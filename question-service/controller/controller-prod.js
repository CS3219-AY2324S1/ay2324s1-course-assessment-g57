const dynamoose = require('dynamoose');
const {
    QuestionModel,
    MetadataModel,
} = require('../models/question-dynamo-model');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
    DynamoDBDocumentClient,
    ScanCommand,
    GetCommand,
    PutCommand,
    UpdateCommand,
    DeleteCommand,
} = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

// Get all questions
const getQuestions = async (req, res) => {
    // try {
    //     const questions = await QuestionModel.scan()
    //         .attributes(['id', 'title', 'categories', 'complexity'])
    //         .exec();
    //     res.status(200).json(questions);
    // } catch (err) {
    //     console.error('Unable to scan the table', err);
    //     res.status(500).json({ error: 'Unable to get questions' });
    // }
    const withDescription = req.query.withDescription;
    let projectExpr;
    if (withDescription === 'true') {
        projectExpr = 'id, title, categories, complexity, description';
    } else {
        projectExpr = 'id, title, categories, complexity';
    }
    const params = {
        TableName: 'questions',
        ProjectionExpression: projectExpr,
    };

    try {
        const data = await docClient.send(new ScanCommand(params));
        res.status(200).json(data.Items);
    } catch (err) {
        console.error('Unable to scan the table', err);
        res.status(500).json({ error: 'Unable to get questions' });
    }
};

// Get a question by ID
const getQuestionById = async (req, res) => {
    const params = {
        TableName: 'questions',
        Key: {
            title: req.params.title,
        },
    };
    try {
        // const question = await QuestionModel.get(req.params.id);
        // res.status(200).json(question);
        const { Item: question } = await docClient.send(new GetCommand(params));
        if (!question) {
            res.status(404).json({ error: 'Question not found' });
            return;
        }

        res.status(200).json(question);
    } catch (err) {
        console.error('Unable to get question', err);
        res.status(500).json({ error: 'Unable to get question' });
    }
};

const getQuestionByComplexity = async (req, res) => {
    const params = {
        TableName: 'questions',
        FilterExpression: 'complexity = :complexity',
        ExpressionAttributeValues: {
            ':complexity': req.params.complexity,
        },
    };

    try {
        const command = new ScanCommand(params);
        const { Items: questions } = await client.send(command);

        if (questions.length === 0) {
            res.status(404).json({
                error: 'No questions found for the requested complexity',
            });
            return;
        }

        const randomIndex = Math.floor(Math.random() * questions.length);
        const randomQuestion = questions[randomIndex];

        res.status(200).json(randomQuestion);
    } catch (err) {
        console.error('Unable to scan items', err);
        res.status(500).json({ error: 'Unable to get question' });
    }
};

// Create a new question
const createQuestion = async (req, res) => {
    const { title, categories, complexity, description, link } = req.body;
    let newQuestionID;
    let questionCreated = false;
    const maxRetries = 1;
    let retries = 0;
    console.log('Creating question', req.bod, 'with count:', retries);
    while (!questionCreated && retries < maxRetries) {
        const question = await QuestionModel.query('title').eq(title).exec();
        if (question.length > 0) {
            res.status(409).json({ error: 'Question already exists' });
            return;
        }

        // Query the metadata table for the lastID with a consistent read
        const metadata = await MetadataModel.query('type')
            .eq('question')
            .consistent()
            .exec()
            .catch((err) => {
                console.log('Unable to query metadata table', err);
            });

        if (metadata && metadata[0]) {
            newQuestionID = metadata[0].lastID + 1;
        } else {
            newQuestionID = 1; // Initial ID
        }

        await dynamoose
            .transaction([
                metadata != null
                    ? MetadataModel.transaction.update({
                          type: 'question',
                          lastID: newQuestionID,
                      })
                    : MetadataModel.transaction.create({
                          type: 'question',
                          lastID: newQuestionID,
                      }),
                QuestionModel.transaction.create({
                    id: newQuestionID,
                    title,
                    categories,
                    complexity,
                    description,
                    link,
                }),
            ])
            .then(() => {
                questionCreated = true;
                console.log('Transaction: Question created successfully');
            })
            .catch((err) => {
                console.log('Unable to create question', err);
                retries++;
            });
        if (questionCreated) {
            res.status(201).json({
                id: newQuestionID,
                message: 'Question created successfully',
            });
            return;
        }
        console.log(
            `Retrying: questionCreated: ${questionCreated}, attempts: ${retries}`
        );
    }
    res.status(500).json({ error: 'Unable to create question' });
};

// Update an existing question
const updateQuestion = async (req, res) => {
    const { title, categories, complexity, description, link } = req.body;

    if (title != req.params.title) {
        // Delete the existing item with the old key
        try {
            const deleteParams = {
                TableName: 'questions',
                Key: {
                    title: req.params.title,
                },
                ReturnValues: 'ALL_OLD',
            };

            const { Attributes: deletedQuestion } = await docClient.send(
                new DeleteCommand(deleteParams)
            );

            if (!deletedQuestion) {
                res.status(404).json({ error: 'Question not found' });
                return;
            }

            // Insert a new item with the updated key
            const putParams = {
                TableName: 'questions',
                Item: {
                    title: title,
                    categories: categories,
                    complexity: complexity,
                    description: description,
                    link: link,
                    id: deletedQuestion.id,
                },
                ReturnValues: 'NONE',
            };

            const updatedQuestion = await docClient.send(
                new PutCommand(putParams)
            );
            if (!updatedQuestion) {
                res.status(404).json({ error: 'Question not found' });
                return;
            }
            res.status(200).json({ message: 'Question updated successfully' });
            return;
        } catch (err) {
            console.error('Unable to update item', err);
            console.error('Request:', req);
            res.status(500).json({ error: 'Unable to update question' });
        }
    }

    try {
        const params = {
            TableName: 'questions',
            Key: {
                title: req.params.title,
            },
            UpdateExpression:
                'set categories = :categories, complexity = :complexity, description = :description, link = :link',
            ExpressionAttributeValues: {
                ':categories': categories,
                ':complexity': complexity,
                ':description': description,
                ':link': link,
            },
            ReturnValues: 'UPDATED_NEW',
        };

        const { Attributes: updatedQuestion } = await docClient.send(
            new UpdateCommand(params)
        );
        if (!updatedQuestion) {
            res.status(404).json({ error: 'Question not found' });
            return;
        }
        res.status(200).json(updatedQuestion);
    } catch (err) {
        console.error('Unable to update item', err);
        console.error('Request:', req);
        res.status(500).json({ error: 'Unable to update question' });
    }
};

// Delete a question by ID
const deleteQuestion = async (req, res) => {
    // try {
    //     const question = await QuestionModel.get(req.params.title);

    //     if (question) {
    //         await question.delete();
    //         res.status(200).json({ message: 'Question deleted successfully' });
    //     } else {
    //         res.status(404).json({ error: 'Question not found' });
    //     }
    // } catch (err) {
    //     console.error('Unable to delete item', err);
    //     res.status(500).json({ error: 'Unable to delete question' });
    // }
    try {
        const deleteParams = {
            TableName: 'questions',
            Key: {
                title: req.params.title,
            },
            ReturnValues: 'ALL_OLD',
        };

        const { Attributes: question } = await docClient.send(
            new DeleteCommand(deleteParams)
        );
        if (!question) {
            res.status(404).json({ error: 'Question not found' });
            return;
        }
        res.status(200).json({ message: 'Question deleted successfully' });
    } catch (err) {
        console.error('Unable to delete item', err);
        console.error('Request:', req);
        res.status(500).json({ error: 'Unable to delete question' });
    }
};

module.exports = {
    getQuestions,
    getQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    getQuestionByComplexity,
};
