import React from 'react';
import {
    Question,
    defaultQuestion,
} from '../models/types';
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Link,
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
import AddQuestionModal from './questions/AddQuestionModal';

type QuestionTableProp = {
    user?: any;
};

const TableComponent = ({ user }: QuestionTableProp) => {
    const [title, setTitle] = React.useState<string>('');
    const [complexity, setComplexity] = React.useState<string>('easy');
    const [categories, setCategories] = React.useState<string[]>([]);
    const [description, setDescription] = React.useState<string>('');
    const [link, setLink] = React.useState<string>('');
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
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };
    const handleDifficultyChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setComplexity(e.target.value);
    };
    const handleCategoriesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCategories(e.target.value.split(','));
    };
    const handleDescriptionChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setDescription(e.target.value);
    };
    const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLink(e.target.value);
    };

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

    async function handleEditSubmit() {
        fetch(`/api/questions/${title}`, {
            method: 'PUT',
            body: JSON.stringify({
                title: title,
                complexity: complexity,
                categories: categories,
                description: description,
                link: link,
            }),
        })
            .then((response) => response.json())
            .catch((error) => {
                console.error('Error updating question data:', error);
            });
    }

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

    return (
        <>
            {/* View Question Details Modal */}
            <Modal
                isOpen={isViewOpen}
                onClose={onViewClose}
                scrollBehavior={'inside'}
                size={'xl'}
                isCentered
                closeOnOverlayClick={true}
            >
                <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(3px)" />
                <ModalContent>
                    <ModalHeader>{title}</ModalHeader>
                    <ModalBody>
                        <p>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: description,
                                }}
                            ></div>
                        </p>
                        <br />
                        <p className="has-text-weight-bold">
                            <Link href={link}>{link}</Link>
                        </p>
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
                size={'xl'}
                isCentered
                closeOnOverlayClick={true}
            >
                <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(3px)" />
                <ModalContent>
                    <ModalHeader>Edit question</ModalHeader>
                    <ModalBody>
                        <FormControl isRequired>
                            <FormLabel>Title</FormLabel>
                            <Input
                                placeholder="Question Title"
                                value={title}
                                onChange={handleTitleChange}
                            />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Complexity</FormLabel>
                            <Select
                                defaultValue={'easy'}
                                value={complexity}
                                onChange={handleDifficultyChange}
                            >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Categories</FormLabel>
                            <Input
                                placeholder="Include categories seperated by commas"
                                value={categories}
                                onChange={handleCategoriesChange}
                            />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Description</FormLabel>
                            <Textarea
                                placeholder="Question Description"
                                size={'lg'}
                                value={description}
                                rows={20}
                                height={'auto'}
                                onChange={handleDescriptionChange}
                            ></Textarea>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Link</FormLabel>
                            <Input
                                placeholder="https://leetcode.com/problems/example"
                                value={link}
                                onChange={handleLinkChange}
                            />
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
                                title === '' ||
                                complexity === '' ||
                                description === ''
                            }
                            onClick={async () => {
                                handleEditSubmit();
                                onEditClose();
                            }}
                        >
                            Submit
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

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
                                <tr key={val._id}>
                                    <td>{val.title}</td>
                                    <td>
                                        {val.categories.map((s) => (
                                            <Tag key={s}>{s}</Tag>
                                        ))}
                                    </td>
                                    <td>{val.complexity}</td>
                                    <td>
                                        <button
                                            className="button is-outlined is-info"
                                            onClick={() => {
                                                onViewOpen();
                                                setDescription(val.description);
                                                setLink(val.link);
                                                setTitle(val.title);
                                            }}
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
                                                        onEditOpen();
                                                        setDescription(
                                                            val.description
                                                        );
                                                        setLink(val.link);
                                                        setTitle(val.title);
                                                        setComplexity(
                                                            val.complexity
                                                        );
                                                        setCategories(
                                                            val.categories
                                                        );
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
        </>
    );
};

export default TableComponent;
