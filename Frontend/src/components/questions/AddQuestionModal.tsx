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

interface AddQuestionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface FormValues {
    title: string;
    complexity: string;
    categories: string;
    description: string;
    link: string;
}

const AddQuestionModal: React.FC<AddQuestionModalProps> = ({
    isOpen,
    onClose,
}) => {
    const handleAddSubmit = async (
        values: FormValues,
        { setSubmitting }: FormikHelpers<FormValues>
    ) => {
        try {
            console.log('Submitting question:', values);
            const response = await fetch(`/api/questions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: values.title,
                    categories: values.categories.split(',').map((s) => {
                        s.trimStart();
                        s.trimEnd();
                        return s;
                    }),
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
                        toast.error('An error occurred while adding question');
                        throw new Error('Failed to add question');
                }
            }
            mutate('/api/questions');
            await response.json();
        } catch (error) {
            console.error('Error adding question:', error);
        } finally {
            setSubmitting(false);
            onClose();
            toast.success('Successfully added question!');
        }
    };
    return (
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
                <ModalHeader>Add a new question</ModalHeader>
                <ModalBody>
                    <Formik
                        initialValues={{
                            title: '',
                            complexity: 'easy',
                            categories: '',
                            description: '',
                            link: '',
                        }}
                        onSubmit={handleAddSubmit}
                    >
                        {(props) => (
                            <Form>
                                <FormControl isRequired>
                                    <FormLabel>Title</FormLabel>
                                    <Field
                                        name="title"
                                        as={Input}
                                        placeholder="Question Title"
                                    />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>Complexity</FormLabel>
                                    <Field
                                        name="complexity"
                                        as={Select}
                                        defaultValue={'easy'}
                                    >
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </Field>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Categories</FormLabel>
                                    <Field
                                        name="categories"
                                        as={Input}
                                        placeholder="Include categories separated by commas"
                                    />
                                </FormControl>
                                <FormControl isRequired>
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
    );
};

export default AddQuestionModal;
