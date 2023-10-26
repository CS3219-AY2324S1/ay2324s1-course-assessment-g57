import React from 'react';
import {
    Question,
    // AddQuestionForm,
    defaultAddQuestionForm,
    defaultQuestion,
} from '../models/types';
import { isValidJsonString, hasEmptyValues } from '@/lib/utils';

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

    function fetchQuestions() {
        fetch(`/api/questions`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then((fetchedQuestions) => {
                console.log('Fetched questions', fetchedQuestions);
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

    console.log('Questions', questions);

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
                    alert(`Updated question: ${question.id}!`);
                    return response.json();
                })
                .catch((error) => {
                    console.error('Error updating question', error);
                });
            // fetchQnFn();
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
            alert(err);
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

    return (
        <>
            <table className="table">
                <thead>
                    <tr>
                        <th>id</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Complexity</th>
                        <th>Description</th>
                        <th>Link</th>
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
                            <tr key={val.id}>
                                <td>{val.id}</td>
                                <td>{val.title}</td>
                                <td>{val.categories}</td>
                                <td>{val.complexity}</td>
                                <td>{val.description}</td>
                                <td>{val.link}</td>
                                {user?.peerprepRoles?.[0] === 'Admin' ? (
                                    <>
                                        <td>
                                            <img
                                                src="/assets/edit.svg"
                                                onClick={() => {
                                                    sendToEditBox(val);
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

                    <br />
                    <br />
                    <br />
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
