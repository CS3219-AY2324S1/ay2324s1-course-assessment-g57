import React from 'react';
import Image from 'next/image';
import {
    Question,
    defaultAddQuestionForm,
    defaultQuestion,
} from '../models/types';
import { isValidJsonString, hasEmptyValues } from '@/lib/utils';
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
} from '@chakra-ui/react';

type QuestionTableProp = {
    // questions: Question[],
    // fetchQnFn: () => void
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
    const {
        isOpen: isDeleteOpen,
        onOpen: onDeleteOpen,
        onClose: onDeleteClose,
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
                console.log('Fetched questions');
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

    function sendToEditBox(question: Question) {
        // send json to textbox
        setCurrentQuestionEditJson(JSON.stringify(question, null, 4));
    }

    async function handleEditSubmit() {
        try {
            // try to parse the string in currentQuestionEditJson
            const question: Question = JSON.parse(currentQuestionEditJson);
            // const _ = await client.updateQuestion(question);
            fetch(`/api/questions/${question.title}`, {
                method: 'PUT',
                body: currentQuestionEditJson,
            })
                .then((response) => {
                    setCurrentQuestionEditJson('');
                    alert(`Updated question: ${question._id}!`);
                    return response.json();
                })
                .catch((error) => {
                    console.error('Error updating question', error);
                });
        } catch (err: any) {
            console.log(err);
        }
    }

    async function handleAddSubmit() {
        try {
            // const question: AddQuestionForm = JSON.parse(currentQuestionAddJson);
            fetch(`/api/questions`, {
                method: 'POST',
                body: currentQuestionAddJson,
            })
                .then((response) => {
                    setQuestionAddJson(
                        JSON.stringify(defaultAddQuestionForm(), null, 4)
                    );
                    alert(`Added question!`);
                    return response.json();
                })
                .catch((error) => {
                    console.error('Error adding question', error);
                });
            // fetchQnFn();
            setQuestionAddJson(
                JSON.stringify(defaultAddQuestionForm(), null, 4)
            );
            alert(`Added question!`);
        } catch (err: any) {
            // alert(err);
            console.log(err);
        }
    }

    // OnClick Delete function
    async function sendDelete(title: string) {
        try {
            fetch(`/api/questions/${title}`, {
                method: 'DELETE',
            })
                .then((response) => {
                    return response.json();
                })
                .catch((error) => {
                    console.error('Error deleting question', error);
                });
            // fetchQnFn();
            alert(`Deleted question: ${title}`);
        } catch (e: any) {
            console.log(e);
        }
    }

    function createMarkup(desc: string) {
        return { __html: desc };
    }

    return (
        <>
            {/* View Question Details Modal */}
            <Modal
                isOpen={isViewOpen}
                onClose={onViewClose}
                scrollBehavior={'inside'}
                isCentered
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Question Details</ModalHeader>
                    <ModalBody>{/* TODO */}</ModalBody>

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
                                    placeholder="json here"
                                    value={currentQuestionEditJson}
                                    onChange={(e) => {
                                        setCurrentQuestionEditJson(
                                            e.target.value
                                        );
                                    }}
                                ></textarea>
                            </section>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <button
                            className="button is-outlined"
                            onClick={onEditClose}
                        >
                            Close
                        </button>
                        <button
                            className="button is-outlined"
                            type="submit"
                            disabled={
                                !isValidJsonString(currentQuestionEditJson)
                            }
                            onClick={handleEditSubmit}
                        >
                            Submit
                        </button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Add Question Modal */}
            <Modal
                isOpen={isAddOpen}
                onClose={onEditClose}
                scrollBehavior={'inside'}
                isCentered
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add a new question</ModalHeader>
                    <ModalBody>{/* TODO */}</ModalBody>
                    <ModalFooter>
                        <button
                            className="button is-outlined"
                            onClick={onAddClose}
                        >
                            Close
                        </button>
                        <button
                            className="button is-outlined"
                            onClick={handleAddSubmit}
                        >
                            Submit
                        </button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Main content body */}
            <div className="table-container">
            <button className="button is-link is-pulled-right" onClick={onAddOpen}>
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
                                <tr key={val._id}>
                                    {/* <td>{val._id}</td> */}
                                    <td>{val.title}</td>
                                    <td>{val.categories}</td>
                                    <td>{val.complexity}</td>
                                    {/* <td>
                                        <div
                                            dangerouslySetInnerHTML={createMarkup(
                                                val.description
                                            )}
                                        ></div>
                                    </td> */}
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
                                                <Image
                                                    src="/assets/edit.svg"
                                                    onClick={() => {
                                                        // sendToEditBox(val);
                                                        onEditOpen();
                                                    }}
                                                    width="25"
                                                    height="25"
                                                    alt="edit"
                                                />
                                            </td>
                                            <td>
                                                <Image
                                                    src="/assets/trash.svg"
                                                    onClick={() => {
                                                        onDeleteOpen();
                                                    }}
                                                    width="25"
                                                    height="25"
                                                    alt="delete"
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
