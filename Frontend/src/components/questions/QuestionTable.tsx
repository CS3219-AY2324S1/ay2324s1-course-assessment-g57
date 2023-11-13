import React from 'react';
import { Question, defaultQuestion } from '../../models/types';
import EditQuestionModal from './EditQuestionModal';
import AddQuestionModal from './AddQuestionModal';
import ViewQuestionModal from './ViewQuestionModal';
import { useDisclosure, Tag, IconButton } from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import useSWR from 'swr';

type QuestionTableProp = {
    user?: any;
    initialData: Question[];
};
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const TableComponent = ({ user, initialData }: QuestionTableProp) => {
    const [questions, setQuestions] = React.useState<Question[]>([
        defaultQuestion(),
    ]);
    console.log(questions);
    const [currQuestion, setCurrQuestion] = React.useState<Question>(
        defaultQuestion()
    );
    const { data } = useSWR('/api/questions', fetcher, {
        fallbackData: initialData,
    });

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
            fetchQuestions();
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
                fetchQuestions={fetchQuestions}
            />

            {/* Add Question Modal */}
            <AddQuestionModal
                isOpen={isAddOpen}
                onClose={onAddClose}
                fetchQuestions={fetchQuestions}
            />

            <div className="table-container">
                {user?.peerprepRoles?.[0] === 'Admin' ? (
                    <>
                        <button
                            className="button is-link is-pulled-right mb-4"
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
                        {data.map((val: Question) => {
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
                                            onClick={async () => {
                                                await getQuestionDetails(
                                                    val.title
                                                );
                                                onViewOpen();
                                            }}
                                        >
                                            View Details
                                        </button>
                                    </td>
                                    {user?.peerprepRoles?.[0] === 'Admin' ? (
                                        <>
                                            <td>
                                                <IconButton
                                                    aria-label="Edit Button"
                                                    colorScheme="teal"
                                                    icon={<EditIcon />}
                                                    onClick={async () => {
                                                        await getQuestionDetails(
                                                            val.title
                                                        );
                                                        onEditOpen();
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                {/* Delete */}
                                                {/* <img
                                                        src="/assets/trash.svg"
                                                        alt="delete"
                                                        onClick={() =>
                                                            sendDelete(val.title)
                                                        }
                                                        style={{ width: 25 }}
                                                    /> */}
                                                <IconButton
                                                    aria-label="Delete Button"
                                                    colorScheme="red"
                                                    icon={<DeleteIcon />}
                                                    onClick={() =>
                                                        sendDelete(val.title)
                                                    }
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
