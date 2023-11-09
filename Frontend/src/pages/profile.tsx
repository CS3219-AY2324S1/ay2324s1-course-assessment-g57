import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import Layout from '../components/Layout';
import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    useDisclosure,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

type AuthUser = {
    user_id: string;
    email: string;
    email_verified: boolean;
    name: string;
    nickname: string;
    picture: string;
    sub: string;
    updated_at: string;
};

type ProfileCardProps = {
    user: AuthUser;
};

const ProfileCard = ({ user }: ProfileCardProps) => {
    const router = useRouter();
    const [username, setUsername] = useState<string>();
    const [email, setEmail] = useState<string>();
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

    async function fetchUser() {
        console.log('From fetch user:' + user.sub);
        fetch(`/api/users/${user.sub}`)
            .then((response) => response.json())
            .then((fetchedUser) => {
                setUsername(fetchedUser.username);
                setEmail(fetchedUser.email);
                // You can set the state with fetchedUser.username and fetchedUser.email here
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
            });
    }

    async function updateUserDetails() {
        fetch(`/api/users/${user.sub}`, {
            method: 'PUT',
            body: JSON.stringify({
                username: username,
                email: email,
            }),
        })
            .then((response) => response.json())
            .catch((error) => {
                console.error('Error updating user data:', error);
            });
    }

    // OnClick Delete function
    async function deleteUser() {
        try {
            await fetch(`/api/users/${user.sub}`, {
                method: 'DELETE',
            })
                .then((response) => {
                    if (response.ok) {
                        console.log('User deleted successfully');
                        router.push('/api/auth/logout');
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

    React.useEffect(() => {
        fetchUser();
    }, []);

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    return (
        <>
            {/* Edit modal */}
            <Modal
                isOpen={isEditOpen}
                onClose={onEditClose}
                scrollBehavior={'inside'}
                isCentered
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit profile</ModalHeader>
                    <ModalBody>
                        <div>
                            <label htmlFor="displayName">Display Name:</label>
                            <input
                                className="input"
                                type="text"
                                id="displayName"
                                value={username}
                                onChange={handleUsernameChange}
                            />
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <button
                            className="button is-outlined"
                            onClick={onEditClose}
                        >
                            Close
                        </button>
                        &nbsp;
                        <button
                            className="button is-primary"
                            onClick={() => {
                                updateUserDetails();
                                onEditClose();
                            }}
                        >
                            Save Changes
                        </button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Delete Modal */}
            <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Delete account</ModalHeader>
                    <ModalBody>
                        <p>Are you sure you want to delete your account?</p>
                        <p>
                            This action is <strong>IRREVERSIBLE!</strong>
                            {user.sub}
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
                                onDeleteClose();
                                deleteUser();
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
                            {user.picture != null ? (
                                <img src={user.picture} alt="profile picture" />
                            ) : (
                                <></>
                            )}
                            <br />
                            <div className="columns">
                                <div className="column">
                                    <p className="is-size-5 has-text-weight-bold">
                                        Display Name:
                                    </p>
                                    <p className="is-size-5 has-text-weight-bold">
                                        Name:
                                    </p>
                                    <p className="is-size-5 has-text-weight-bold">
                                        Nickname:
                                    </p>
                                    <p className="is-size-5 has-text-weight-bold">
                                        Email:
                                    </p>
                                    <p className="is-size-5 has-text-weight-bold">
                                        Last updated:
                                    </p>
                                    <p className="is-size-5 has-text-weight-bold">
                                        Auth0 ID:
                                    </p>
                                </div>
                                <div className="column">
                                    <p className="is-size-5">{username}</p>
                                    <p className="is-size-5">
                                        {user.name ?? ''}
                                    </p>
                                    <p className="is-size-5">
                                        {user.nickname ?? ''}
                                    </p>
                                    <p className="is-size-5">{email}</p>
                                    <p className="is-size-5">
                                        {user.updated_at}
                                    </p>
                                    <p className="is-size-5">{user.sub}</p>
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

type ProfileProps = {
    user?: any;
    isLoading: boolean;
};

const Profile = ({ user, isLoading }: ProfileProps) => {
    // console.log(user);
    return (
        <Layout title={'Profile'} user={user} loading={isLoading}>
            {isLoading ? <>Loading...</> : <ProfileCard user={user} />}
        </Layout>
    );
};

// Protected route, checking user authentication client-side.(CSR)
export default withPageAuthRequired(Profile);
