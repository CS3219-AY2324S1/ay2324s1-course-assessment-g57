import React from 'react';
import { Question, defaultQuestion } from '../../models/types';
import EditQuestionModal from './EditQuestionModal';
import AddQuestionModal from './AddQuestionModal';
import ViewQuestionModal from './ViewQuestionModal';
import { useDisclosure, Tag, IconButton } from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import useSWR, { mutate } from 'swr';
import { getComplexityColor } from '../../lib/utils';
import { toast } from 'react-toastify';

type QuestionTableProp = {
    user?: any;
    initialData: Question[];
};
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const TableComponent = ({ user, initialData }: QuestionTableProp) => {
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

    async function getQuestionDetails(title: string) {
        try {
            const response = await fetch(`/api/questions/${title}`);
            const qn = await response.json();
            setCurrQuestion(qn);
        } catch (error) {
            console.error('Error fetching question data:', error);
        }
    }

    // OnClick Delete function
    async function sendDelete(deleteTitle: string) {
        try {
            const res = await fetch(`/api/questions/${deleteTitle}`, {
                method: 'DELETE',
            });

            console.log(`Deleted question: ${deleteTitle}`);
            if (!res.ok) {
                toast.error('An error occurred while deleting question');
                throw new Error('Failed to delete question');
            }
            await mutate('/api/questions');
            return await res.json();
        } catch (e: any) {
            console.log(e);
        } finally {
            toast.success('Successfully deleted question!');
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
                                        {val.categories[0] != '' ? (
                                            val.categories?.map((s) => (
                                                <Tag
                                                    key={val.title + s}
                                                    className="mr-1 mb-1"
                                                >
                                                    {s}
                                                </Tag>
                                            ))
                                        ) : (
                                            <></>
                                        )}
                                        {}
                                    </td>
                                    <td>
                                        <div className="flex justify-center items-center">
                                            <Tag
                                                className="mt-1"
                                                size={'lg'}
                                                variant={'solid'}
                                                colorScheme={getComplexityColor(
                                                    val.complexity
                                                )}
                                            >
                                                {val.complexity}
                                            </Tag>
                                        </div>
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
