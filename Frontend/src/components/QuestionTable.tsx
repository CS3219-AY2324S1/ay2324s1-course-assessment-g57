import React from 'react';
import {
    Question,
    // AddQuestionForm,
    defaultAddQuestionForm,
    defaultQuestion,
} from '../models/types';
import { isValidJsonString, hasEmptyValues } from '@/lib/utils';
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    Tag,
    Textarea,
    useDisclosure,
} from '@chakra-ui/react';

type QuestionTableProp = {
    user?: any;
};

const TableComponent = ({ user }: QuestionTableProp) => {
    const [currentQuestionEditJson, setCurrentQuestionEditJson] =
        React.useState<string>('');
    const [currentQuestionAddJson, setQuestionAddJson] = React.useState<string>(
        JSON.stringify(defaultAddQuestionForm(), null, 4)
    );
    const [questions, setQuestions] = React.useState<Question[]>([
        defaultQuestion(),
    ]);
    const {
        isOpen: isViewOpen,
        onOpen: onViewOpen,
        onClose: onViewClose,
    } = useDisclosure();
    const {
        isOpen: isEditOpen,
        onOpen: onEditOpen,
        onClose: onEditClose,
    } = useDisclosure();
    const {
        isOpen: isAddOpen,
        onOpen: onAddOpen,
        onClose: onAddClose,
    } = useDisclosure();

    function fetchQuestions() {
        fetch(`/api/questions`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then((fetchedQuestions) => {
                // console.log('Fetched questions', fetchedQuestions);
                setQuestions(fetchedQuestions);
            })
            .catch((error) => {
                console.error('Error fetching questions', error);
                setQuestions([]);
            });
    }

    React.useEffect(() => {
        fetchQuestions();
    }, []);

    // TODO: fetch question details
    async function fetchQnDetails(title: string) {
        fetch(`/api/questions/${title}`).then((response) => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        });
    }

    function sendToEditBox(question: Question) {
        // send json to textbox
        setCurrentQuestionEditJson(JSON.stringify(question, null, 4));
    }

    async function handleEditSubmit() {
        try {
            // try to parse the string in currentQuestionEditJson
            const question: Question = JSON.parse(currentQuestionEditJson);
            // const _ = await client.updateQuestion(question);
            const res = await fetch(`/api/questions/${question.title}`, {
                method: 'PUT',
                body: currentQuestionEditJson,
            });
            const jsonRes = await res.json();
            setCurrentQuestionEditJson(jsonRes);
            console.log(`Updated question: ${question.title}!`);
            return jsonRes;
        } catch (err: any) {
            console.log(`Error updating questions: ${err}`);
        }
    }

    async function handleAddSubmit() {
        try {
            const res = await fetch(`/api/questions`, {
                method: 'POST',
                body: currentQuestionAddJson,
            });
            setQuestionAddJson(
                JSON.stringify(defaultAddQuestionForm(), null, 4)
            );
            console.log(`Added question!`);
            return await res.json();
        } catch (err: any) {
            console.log(err);
        }
    }

    // OnClick Delete function
    async function sendDelete(title: string) {
        try {
            const res = await fetch(`/api/questions/${title}`, {
                method: 'DELETE',
            });

            console.log(`Deleted question: ${title}`);
            return await res.json();
        } catch (e: any) {
            console.log(e);
        }
    }

    return (
        <>
            {/* View Question Details Modal */}
            <Modal
                isOpen={isViewOpen}
                onClose={onViewClose}
                scrollBehavior={'inside'}
                isCentered
                closeOnOverlayClick={true}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Question Details</ModalHeader>
                    <ModalBody>
                        {/* <div dangerouslySetInnerHTML={{ __html: questions.description }}></div> */}
                    </ModalBody>
                    <ModalFooter>
                        <button
                            className="button is-outlined"
                            onClick={onViewClose}
                        >
                            Close
                        </button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Edit Question Details Modal */}
            <Modal
                isOpen={isEditOpen}
                onClose={onEditClose}
                scrollBehavior={'inside'}
                isCentered
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit question</ModalHeader>
                    <ModalBody>
                        {/* 
                                    value={currentQuestionEditJson}
                                    onChange={(e) => {
                                        setCurrentQuestionEditJson(
                                            e.target.value
                                        );
                                    }}*/}
                        <FormControl isRequired>
                            <FormLabel>Title</FormLabel>
                            <Input placeholder="Question Title" />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Difficulty</FormLabel>
                            <Select defaultValue={'easy'}>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Categories</FormLabel>
                            <Input placeholder="Include categories seperated by commas" />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Description</FormLabel>
                            <Textarea
                                placeholder="Question Description"
                                size={'lg'}
                            ></Textarea>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Link</FormLabel>
                            <Input placeholder="https://leetcode.com/problems/example" />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            className="button is-outlined"
                            onClick={onEditClose}
                            mr={3}
                        >
                            Close
                        </Button>
                        <Button
                            className="button is-outlined"
                            type="submit"
                            colorScheme="blue"
                            disabled={
                                !isValidJsonString(currentQuestionEditJson)
                            }
                            onClick={async () => {
                                await handleEditSubmit();
                                onEditClose();
                            }}
                        >
                            Submit
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Add Question Modal */}
            <Modal
                isOpen={isAddOpen}
                onClose={onAddClose}
                scrollBehavior={'inside'}
                size={'xl'}
                isCentered
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add a new question</ModalHeader>
                    <ModalBody>
                        <FormControl isRequired>
                            <FormLabel>Title</FormLabel>
                            <Input placeholder="Question Title" />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Difficulty</FormLabel>
                            <Select defaultValue={'easy'}>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Categories</FormLabel>
                            <Input placeholder="Include categories seperated by commas" />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Description</FormLabel>
                            <Textarea
                                placeholder="Question Description"
                                size={'lg'}
                            ></Textarea>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Link</FormLabel>
                            <Input placeholder="https://leetcode.com/problems/example" />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            className="button is-outlined"
                            onClick={onAddClose}
                            mr={3}
                        >
                            Close
                        </Button>
                        <Button
                            className="button is-outlined"
                            onClick={() => {
                                handleAddSubmit();
                                onAddClose();
                            }}
                            colorScheme="blue"
                        >
                            Submit
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            {/* End of Add new question modal */}

            <div className="table-container">
                <button
                    className="button is-link is-pulled-right"
                    onClick={onAddOpen}
                >
                    Add question
                </button>
                <table className="table is-bordered is-striped is-hoverable is-fullwidth">
                    <thead>
                        <tr>
                            {/* <th>id</th> */}
                            <th>Title</th>
                            <th>Category</th>
                            <th>Complexity</th>
                            {/* <th>Description</th> */}
                            {/* <th>Link</th> */}
                            <th>View Details</th>
                            {user?.peerprepRoles?.[0] === 'Admin' ? (
                                <>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                </>
                            ) : (
                                <></>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map((val) => {
                            return (
                                <tr key={val.title}>
                                    <td>{val.title}</td>
                                    <td>
                                        {val.categories.map((s) => (
                                            <Tag key={s}>{s}</Tag>
                                        ))}
                                    </td>
                                    <td>{val.complexity}</td>
                                    {/* <td>
                                        <div dangerouslySetInnerHTML={{ __html: val.description }}></div>
                                    </td> */}
                                    {/* <td>{val.link}</td> */}
                                    <td>
                                        <button
                                            className="button"
                                            onClick={onViewOpen}
                                        >
                                            View Details
                                        </button>
                                    </td>
                                    {user?.peerprepRoles?.[0] === 'Admin' ? (
                                        <>
                                            <td>
                                                <img
                                                    src="/assets/edit.svg"
                                                    onClick={() => {
                                                        sendToEditBox(val);
                                                        onEditOpen();
                                                    }}
                                                    style={{ width: 25 }}
                                                />
                                            </td>
                                            <td>
                                                <img
                                                    src="/assets/trash.svg"
                                                    onClick={() =>
                                                        sendDelete(val.title)
                                                    }
                                                    style={{ width: 25 }}
                                                />
                                            </td>
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {user?.peerprepRoles?.[0] === 'Admin' ? (
                <>
                    <form
                        method="post"
                        onSubmit={async () => {
                            await handleEditSubmit();
                        }}
                    >
                        <section>
                            <textarea
                                id="textareaedit"
                                className="textarea is-normal"
                                rows={10}
                                placeholder="json here"
                                value={currentQuestionEditJson}
                                onChange={(e) => {
                                    setCurrentQuestionEditJson(e.target.value);
                                }}
                            ></textarea>
                        </section>

                        <section>
                            <button
                                className="button is-primary"
                                type="submit"
                                disabled={
                                    !isValidJsonString(currentQuestionEditJson)
                                }
                            >
                                Submit
                            </button>
                        </section>
                    </form>

                    <section>
                        <h1 className="is-size-2">Add Question</h1>
                        <form
                            method="post"
                            onSubmit={async () => {
                                await handleAddSubmit();
                            }}
                        >
                            <section>
                                <textarea
                                    id="textareaedit"
                                    className="textarea is-normal"
                                    rows={10}
                                    placeholder="json here"
                                    value={currentQuestionAddJson}
                                    onChange={(e) => {
                                        setQuestionAddJson(e.target.value);
                                    }}
                                ></textarea>
                            </section>

                            <section>
                                <button
                                    className="button is-primary"
                                    type="submit"
                                    disabled={
                                        !isValidJsonString(
                                            currentQuestionAddJson
                                        ) ||
                                        (isValidJsonString(
                                            currentQuestionAddJson
                                        ) &&
                                            hasEmptyValues(
                                                JSON.parse(
                                                    currentQuestionAddJson
                                                )
                                            ))
                                    }
                                >
                                    Submit
                                </button>
                            </section>
                        </form>
                    </section>
                </>
            ) : (
                <></>
            )}
        </>
    );
};

export default TableComponent;
