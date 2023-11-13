import React from 'react';
import { Question, defaultQuestion } from '../../models/types';
import EditQuestionModal from './EditQuestionModal';
import AddQuestionModal from './AddQuestionModal';
import ViewQuestionModal from './ViewQuestionModal';
import { useDisclosure, Tag } from '@chakra-ui/react';

type QuestionTableProp = {
    user?: any;
};

const TableComponent = ({ user }: QuestionTableProp) => {
    const [questions, setQuestions] = React.useState<Question[]>([
        defaultQuestion(),
    ]);
    const [currQuestion, setCurrQuestion] = React.useState<Question>(
        defaultQuestion()
    );

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

    async function fetchQuestions() {
        try {
            const response = await fetch(`/api/questions`);
            const fetchedQuestions = await response.json();
            // console.log('Fetched questions', fetchedQuestions);
            setQuestions(fetchedQuestions);
        } catch (error) {
            console.error('Error fetching all questions', error);
            setQuestions([]);
        }
    }

    async function getQuestionDetails(title: string) {
        try {
            const response = await fetch(`/api/questions/${title}`);
            const qn = await response.json();
            setCurrQuestion(qn);
        } catch (error) {
            console.error('Error fetching question data:', error);
        }
    }

    React.useEffect(() => {
        fetchQuestions();
    }, []);

    // OnClick Delete function
    async function sendDelete(deleteTitle: string) {
        try {
            const res = await fetch(`/api/questions/${deleteTitle}`, {
                method: 'DELETE',
            });

            console.log(`Deleted question: ${deleteTitle}`);
            return await res.json();
        } catch (e: any) {
            console.log(e);
        }
    }

    function getComplexityColor(complexity: string) {
        if (complexity === 'easy') {
            return 'green';
        } else if (complexity === 'medium') {
            return 'yellow';
        } else if (complexity === 'hard') {
            return 'red';
        } else {
        }
    }

    return (
        <>
            {/* View Question Details Modal */}
            <ViewQuestionModal
                isOpen={isViewOpen}
                onClose={onViewClose}
                question={currQuestion}
            />

            {/* Edit Question Details Modal */}
            <EditQuestionModal
                isOpen={isEditOpen}
                onClose={onEditClose}
                question={currQuestion}
            />

            {/* Add Question Modal */}
            <AddQuestionModal isOpen={isAddOpen} onClose={onAddClose} />

            <div className="table-container">
                {user?.peerprepRoles?.[0] === 'Admin' ? (
                    <>
                        <button
                            className="button is-link is-pulled-right"
                            onClick={onAddOpen}
                        >
                            Add question
                        </button>
                    </>
                ) : (
                    <></>
                )}

                {/* Questions Table */}
                <table className="table is-bordered is-striped is-hoverable is-fullwidth">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Complexity</th>
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
                                            <Tag key={val.title + s}>
                                                {s}&nbsp;
                                            </Tag>
                                        ))}
                                    </td>
                                    <td>
                                        <Tag
                                            size={'lg'}
                                            variant={'solid'}
                                            colorScheme={getComplexityColor(
                                                val.complexity
                                            )}
                                        >
                                            {val.complexity}
                                        </Tag>
                                    </td>
                                    <td>
                                        <button
                                            className="button is-outlined is-info"
                                            onClick={() => {
                                                getQuestionDetails(val.title);
                                                onViewOpen();
                                            }}
                                        >
                                            View Details
                                        </button>
                                    </td>
                                    {user?.peerprepRoles?.[0] === 'Admin' ? (
                                        <>
                                            <td>
                                                {/* Edit */}
                                                <img
                                                    src="/assets/edit.svg"
                                                    alt="edit"
                                                    onClick={() => {
                                                        getQuestionDetails(
                                                            val.title
                                                        );
                                                        onEditOpen();
                                                    }}
                                                    style={{ width: 25 }}
                                                />
                                            </td>
                                            <td>
                                                {/* Delete */}
                                                <img
                                                    src="/assets/trash.svg"
                                                    alt="delete"
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
        </>
    );
};

export default TableComponent;
