import { Formik, FormikHelpers } from 'formik';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,

} from '@chakra-ui/react';

interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
}

interface FormValues {
    username: string;
}

// const isEmptyInput = (input: string) => {
//     input === '';
// };

const EditUserModal: React.FC<EditUserModalProps> = ({
    isOpen,
    onClose,
    user,
}) => {
    const handleEditSubmit = async (
        values: FormValues,
        { setSubmitting }: FormikHelpers<FormValues>
    ) => {
        try {
            const response = await fetch(`/api/users/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: values.username,
                }),
            });

            await response.json();
        } catch (error) {
            console.error('Failed to edit user: ', error);
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
                isCentered
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit profile</ModalHeader>
                    <Formik onSubmit={handleEditSubmit} initialValues={
                        {
                            username: user.username,
                        }
                    }>
                        <ModalBody>
                            <div>
                                <label htmlFor="displayName">Display Name:</label>
                                <input
                                    className="input"
                                    type="text"
                                    id="displayName"
                                    value={user.username}
                                />
                            </div>
                        </ModalBody>

                        <ModalFooter>
                            <button
                                className="button is-outlined"
                                onClick={onClose}
                            >
                                Close
                            </button>
                            &nbsp;
                            <button
                                className="button is-primary"
                                onClick={() => {
                                    onClose();
                                }}
                            >
                                Save Changes
                            </button>
                        </ModalFooter>
                    </Formik>
                </ModalContent>
            </Modal>
        </>
    );
};

export default EditUserModal;
