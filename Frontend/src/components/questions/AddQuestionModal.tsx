import { Formik, Field, Form } from 'formik';
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

const AddQuestionModal = ({ isOpen, onClose }) => {
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
                            difficulty: 'easy',
                            categories: '',
                            description: '',
                            link: '',
                        }}
                        onSubmit={(values, { setSubmitting }) => {
                            // Handle form submission logic here
                            console.log(values);
                            console.log('Submitting form');
                            setSubmitting(false);
                            onClose(); // Close the modal after submitting if needed
                        }}
                    >
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
                                <FormLabel>Difficulty</FormLabel>
                                <Field
                                    name="difficulty"
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
                                    placeholder="Question Description"
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
                                    colorScheme="blue"
                                >
                                    Submit
                                </Button>
                            </ModalFooter>
                        </Form>
                    </Formik>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default AddQuestionModal;
