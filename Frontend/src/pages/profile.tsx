import Layout from '../components/Layout';
import { Formik, Field, Form, FormikHelpers } from 'formik';
import React, { useState, useCallback } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    useDisclosure,
    Button,
    FormControl,
    FormLabel,
    Input,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfileCard = () => {
    const router = useRouter();
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const {
        isOpen: isEditOpen,
        onOpen: onEditOpen,
        onClose: onEditClose,
    } = useDisclosure();
    const {
        isOpen: isDeleteOpen,
        onOpen: onDeleteOpen,
        onClose: onDeleteClose,
    } = useDisclosure();
    // var localUsername = '';

    const fetchUser = useCallback(async (localUsername: string) => {
        try {
            console.log('fetching user', localUsername);
            const response = await fetch(
                `http://localhost:3001/${localUsername}`
            );
            const profile = await response.json();
            if (response.ok) {
                setEmail(profile.email);
            }
        } catch (error) {
            console.error('Error fetching user data');
        }
    }, []);

    React.useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        console.log('stored', storedUsername);
        if (storedUsername) {
            setUsername(storedUsername);
            fetchUser(storedUsername);
        }
    }, []);

    interface FormValues {
        // username: string;
        email: string;
    }

    const updateUserDetails = async (
        values: FormValues,
        { setSubmitting }: FormikHelpers<FormValues>
    ) => {
        try {
            console.log("submitting user's details", values);
            const response = await fetch(`http://localhost:3001/${username}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    // username: values.username,
                    email: values.email,
                }),
            });

            if (!response.ok) {
                toast.error('Failed to update username');
                console.log('Failed to update user');
            }
            // setUsername(values.username);
            // localStorage.setItem('username', values.username);
            fetchUser(username);
            await response.json();
        } catch (error) {
            console.error('Failed to edit user: ', error);
            toast.warning('Failed to edit profile');
        } finally {
            setSubmitting(false);
            onEditClose();
            toast.success('Successfully edited profile!');
        }
    };

    // OnClick Delete function
    async function deleteUser() {
        try {
            await fetch(`http://localhost:3001/${username}`, {
                method: 'DELETE',
            })
                .then((response) => {
                    if (response.ok) {
                        console.log('User deleted successfully');
                        localStorage.removeItem('userToken');
                        localStorage.removeItem('username');
                        router.push('/');
                    }
                    return response.json();
                })
                .catch((error) => {
                    console.error('Error deleting user', error);
                });
        } catch (e: any) {
            console.log(e);
        }
    }

    return (
        <>
            {/* Edit modal */}
            <Modal
                isOpen={isEditOpen}
                onClose={onEditClose}
                scrollBehavior={'inside'}
                isCentered
            >
                <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(4px)" />
                <ModalContent>
                    <ModalHeader>Edit profile</ModalHeader>
                    <ModalBody>
                        <Formik
                            initialValues={{
                                email: email ?? '',
                            }}
                            onSubmit={updateUserDetails}
                        >
                            {(props) => (
                                <Form>
                                    <FormControl>
                                        <FormLabel>Email</FormLabel>
                                        <Field
                                            name="email"
                                            type="email"
                                            as={Input}
                                            // placeholder="https://leetcode.com/problems/example"
                                        />
                                    </FormControl>
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

            {/* Delete Modal */}
            <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} isCentered>
                <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(3px)" />
                <ModalContent>
                    <ModalHeader>Delete account</ModalHeader>
                    <ModalBody>
                        <p>Are you sure you want to delete your account?</p>
                        <p>
                            This action is <b>IRREVERSIBLE!</b>
                        </p>
                    </ModalBody>

                    <ModalFooter>
                        <button
                            className="button is-outlined"
                            onClick={onDeleteClose}
                        >
                            Close
                        </button>
                        &nbsp;
                        <button
                            className="button is-danger"
                            onClick={() => {
                                deleteUser();
                                onDeleteClose();
                            }}
                        >
                            Delete
                        </button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Main section */}
            <section className="section">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-half">
                            <h2 className="is-size-1">User Profile</h2>
                            <div className="columns">
                                <div className="column">
                                    <p className="is-size-5 has-text-weight-bold">
                                        Username:
                                    </p>
                                    <p className="is-size-5 has-text-weight-bold">
                                        Email:
                                    </p>
                                </div>
                                <div className="column">
                                    <p className="is-size-5">
                                        {username ?? ''}
                                    </p>
                                    <p className="is-size-5">{email}</p>
                                </div>
                            </div>
                            <div>
                                <button
                                    className="button is-primary"
                                    onClick={onEditOpen}
                                >
                                    Edit Details
                                </button>

                                <button
                                    className="button is-pulled-right is-danger"
                                    onClick={onDeleteOpen}
                                >
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

const Profile = () => {
    // console.log(user);
    return (
        <Layout title={'Profile'}>
            <ProfileCard />
        </Layout>
    );
};

// Protected route, checking user authentication client-side.(CSR)
export default Profile;
