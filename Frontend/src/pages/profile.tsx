import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import Layout from '../components/Layout';
import React, { useState, useCallback } from 'react';
import Image from 'next/image';
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
import { toast } from 'react-toastify';

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

    const fetchUser = useCallback(() => {
        fetch(`/api/users/${user.sub}`)
            .then((response) => response.json())
            .then((fetchedUser) => {
                setUsername(fetchedUser.username);
                setEmail(fetchedUser.email);
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
            });
    }, [user.sub]);

    async function updateUserDetails() {
        try {
            const response = await fetch(`/api/users/${user.sub}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                }),
            });

            if (!response.ok) {
                toast.error('Failed to update display name');
                console.log('Failed to update user');
            }

            fetchUser();
            await response.json();
        } catch (error) {
            console.error('Failed to edit user: ', error);
        } finally {
            onEditClose();
            toast.success('Successfully edited display name!');
        }
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
    }, [fetchUser]);

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
                    <form onSubmit={updateUserDetails}>
                        <ModalBody>
                            <label htmlFor="displayName">Display Name:</label>
                            <input
                                className="input"
                                type="text"
                                id="displayName"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </ModalBody>
                        <ModalFooter>
                            <button
                                className="button is-outlined"
                                onClick={onEditClose}
                            >
                                Close
                            </button>
                            &nbsp;
                            <button className="button is-primary" type="submit">
                                Save Changes
                            </button>
                        </ModalFooter>
                    </form>
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
                            {user.picture != null ? (
                                <Image
                                    src={user?.picture ?? ''}
                                    alt="profile picture"
                                    width="120"
                                    height="120"
                                    className="rounded-full"
                                />
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
                                        Email:
                                    </p>
                                </div>
                                <div className="column">
                                    <p className="is-size-5">{username ?? ''}</p>
                                    <p className="is-size-5">
                                        {user.name ?? ''}
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
