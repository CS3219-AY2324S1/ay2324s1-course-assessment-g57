const dynamoose = require('dynamoose');
const { UserModel } = require('../models/user-dynamo-model');
const axios = require('axios');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
    DynamoDBDocumentClient,
    // ScanCommand,
    GetCommand,
    // PutCommand,
    // UpdateCommand,
    // DeleteCommand,
} = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);
// Get all users
const getUsers = async (req, res) => {
    await UserModel.scan()
        .exec()
        .then((users) => {
            console.log('Users:', users);
            res.status(200).json(users);
        })
        .catch((err) => {
            console.error('Unable to scan the User table', err);
            console.error('Request:', req);
            res.status(500).json({ error: 'Unable to get users' });
        });
};

// Get a user by ID
const getUserById = async (req, res) => {
    const params = {
        TableName: 'users',
        Key: {
            user_id: req.params.id,
        },
    };
    try {
        // const question = await QuestionModel.get(req.params.id);
        // res.status(200).json(question);
        const { Item: user } = await docClient.send(new GetCommand(params));
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.status(200).json(user);
    } catch (err) {
        console.error('Unable to get user', err);
        console.error('Request:', req);
        res.status(500).json({ error: 'Unable to get user' });
    }
};

// Create a new user
const createUser = async (req, res) => {
    console.log('Creating User');
    console.log('Request Body: ', req.body);
    const { user_id, email } = req.body;
    let { username } = req.body;
    if (username == null || username === '') {
        // Set a default username if it's not provided
        username = 'displayName';
    }

    const newUser = new UserModel({
        user_id,
        email,
        username,
    });

    await newUser
        .save()
        .then((user) => {
            console.log('User created:', user);
            res.status(201).json({ message: 'User created successfully' });
        })
        .catch((err) => {
            console.error('Unable to add user', err);
            console.error('Request:', req);
            res.status(500).json({ error: 'Unable to create user' });
        });
};

// Update an existing user
const updateUser = async (req, res) => {
    console.log('Updating User');
    console.log('Request Body: ', req.body);
    const { username } = req.body;
    console.log('Username: ', username);

    await UserModel.get(req.params.id)
        .then((existingUser) => {
            if (!existingUser) {
                return res.status(404).json({ error: 'User not found' });
            }
            // return existingUser.json();
        })
        .then(async () => {
            await UserModel.update(
                { user_id: req.params.id },
                { username: username }
            ).then((updatedUser) => {
                console.log('Updated user:', updatedUser);
                res.status(200).json({ message: 'User updated successfully' });
            });
        })
        .catch((err) => {
            console.error('Unable to update user', err);
            console.error('Request:', req);
            res.status(500).json({ error: 'Unable to update user' });
        });
};

// Delete a user by ID
const deleteUser = async (req, res) => {
    console.log('Deleting User');
    try {
        const userInfoResponse = axios.request({
            method: 'GET',
            url: 'https://dev-r67hrnstb5x4ekjv.us.auth0.com/userinfo',
            headers: {
                Authorization: req.headers.authorization,
            },
        });
        var tokenOptions = {
            method: 'POST',
            url: `https://${process.env.DOMAIN}/oauth/token`,
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                audience: `https://${process.env.DOMAIN}/api/v2/`,
            }),
        };

        const tokenResponse = axios.request(tokenOptions);

        const userInfo = (await userInfoResponse).data;
        const MGMT_API_ACCESS_TOKEN = (await tokenResponse).data?.access_token;

        console.log('User Info:', userInfo);
        console.log('MGMT_TOKEN', MGMT_API_ACCESS_TOKEN);
        const options = {
            method: 'DELETE',
            url: `https://dev-r67hrnstb5x4ekjv.us.auth0.com/api/v2/users/${encodeURIComponent(
                userInfo.sub
            )}`,
            headers: { authorization: `Bearer ${MGMT_API_ACCESS_TOKEN}` },
        };

        const response = await axios.request(options);
        await UserModel.delete(req.params.id)
            .then(() => {
                console.log(
                    `User ${userInfo.sub} deleted on Auth0 and DynamoDB`
                );
                res.status(200).json({ message: 'User deleted successfully' });
            })
            .catch((err) => {
                console.error('Unable to delete user', err);
                console.error('Request:', req);
                res.status(500).json({ error: 'Unable to delete user' });
            });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Unable to delete user' });
    }
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};
