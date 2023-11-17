import { Formik, Field, Form, FormikHelpers } from 'formik';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormControl,
    FormLabel,
    Input,
    Select,
    Textarea,
    Button,
} from '@chakra-ui/react';
import { mutate } from 'swr';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface EditQuestionModalProps {
    isOpen: boolean;
    onClose: () => void;
    question: any;
}

interface FormValues {
    title: string;
    complexity: string;
    categories: string;
    description: string;
    link: string;
}

const EditQuestionModal: React.FC<EditQuestionModalProps> = ({
    isOpen,
    onClose,
    question,
}) => {
    const handleEditSubmit = async (
        values: FormValues,
        { setSubmitting }: FormikHelpers<FormValues>
    ) => {
        try {
            const response = await fetch(`/api/questions/${question.title}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: values.title,
                    categories: values.categories,
                    complexity: values.complexity,
                    description: values.description,
                    link: values.link,
                }),
            });

            if (!response.ok) {
                switch (response.status) {
                    case 409:
                        toast.error(
                            'Question already exists, please try again'
                        );
                        break;
                    case 400:
                        toast.error('Invalid question, please try again');
                        break;
                    case 500:
                    case 502:
                    case 503:
                    case 504:
                        toast.error('A server error occurred');
                        break;
                    default:
                        toast.error('An error occurred while editing question');
                        throw new Error('Failed to edit question');
                }
            }
            await mutate('/api/questions');
            toast.success('Successfully edited question!');
        } catch (error) {
            console.error('Failed to edit question: ', error);
        } finally {
            setSubmitting(false);
            onClose();
        }
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                scrollBehavior={'inside'}
                size={'xl'}
                isCentered
                closeOnOverlayClick={true}
            >
                <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(3px)" />
                <ModalContent>
                    <ModalHeader>Edit question</ModalHeader>
                    <ModalBody>
                        <Formik
                            initialValues={{
                                title: question.title,
                                complexity: question.complexity,
                                categories: question.categories,
                                description: question.description,
                                link: question.link,
                            }}
                            onSubmit={handleEditSubmit}
                        >
                            {(props) => (
                                <Form>
                                    <FormControl isRequired className="mb-2">
                                        <FormLabel>Title</FormLabel>
                                        <Field
                                            name="title"
                                            as={Input}
                                            defaultValue={question.title}
                                            isDisabled
                                        ></Field>
                                    </FormControl>
                                    <FormControl isRequired className="mb-2">
                                        <FormLabel>Complexity</FormLabel>
                                        <Field
                                            name="complexity"
                                            as={Select}
                                            defaultValue={'easy'}
                                        >
                                            <option value="easy">Easy</option>
                                            <option value="medium">
                                                Medium
                                            </option>
                                            <option value="hard">Hard</option>
                                        </Field>
                                    </FormControl>
                                    <FormControl className="mb-2">
                                        <FormLabel>Categories</FormLabel>
                                        <Field
                                            name="categories"
                                            as={Input}
                                            placeholder="Include categories separated by commas"
                                        />
                                    </FormControl>
                                    <FormControl isRequired className="mb-2">
                                        <FormLabel>Description</FormLabel>
                                        <Field
                                            name="description"
                                            as={Textarea}
                                            placeholder="Description accepts HTML formatting"
                                            size={'lg'}
                                            rows={20}
                                            height={'auto'}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Link</FormLabel>
                                        <Field
                                            name="link"
                                            as={Input}
                                            placeholder="https://leetcode.com/problems/example"
                                        />
                                    </FormControl>
                                    <ModalFooter>
                                        <Button
                                            className="button is-outlined"
                                            onClick={onClose}
                                            mr={3}
                                        >
                                            Close
                                        </Button>
                                        <Button
                                            className="button is-outlined"
                                            type="submit"
                                            isLoading={props.isSubmitting}
                                            colorScheme="blue"
                                        >
                                            Submit
                                        </Button>
                                    </ModalFooter>
                                </Form>
                            )}
                        </Formik>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default EditQuestionModal;
