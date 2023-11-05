import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import Layout from '../components/Layout';
import React, { useState } from 'react';

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
    // const client = new PeerPrepClient();
    const [editing, setEditing] = useState(false);
    const [username, setUsername] = useState<string>();
    const [email, setEmail] = useState<string>();

    async function fetchUser() {
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

    React.useEffect(() => {
        fetchUser();
    }, []);

    const handleEditClick = () => {
        setEditing(true);
    };

    const handleSaveClick = () => {
        setEditing(false);
        updateUserDetails();
    };

    const handleCancelClick = () => {
        setEditing(false);
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    return (
        <section className="section">
            <div className="container">
                <div className="columns is-centered">
                    <div className="column is-half">
                        <h2 className="is-size-1">User Profile</h2>
                        <img src={user.picture} alt="profile picture" />
                        {editing ? (
                            <div>
                                <label htmlFor="displayName">
                                    Display Name:
                                </label>
                                <input
                                    type="text"
                                    id="displayName"
                                    value={username}
                                    onChange={handleUsernameChange}
                                />
                                <br />
                                <label htmlFor="email">Email:</label>
                                <input
                                    type="text"
                                    id="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                />
                                <br />
                                <button
                                    className="button"
                                    onClick={handleSaveClick}
                                >
                                    Save
                                </button>
                                <button
                                    className="button"
                                    onClick={handleCancelClick}
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <div>
                                <p>
                                    <strong>Username:</strong> {username}
                                </p>
                                <p>
                                    <strong>Email:</strong> {email}
                                </p>
                                <button
                                    className="button"
                                    onClick={handleEditClick}
                                >
                                    Edit
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

type ProfileProps = {
    user?: any;
    isLoading: boolean;
};

const Profile = ({ user, isLoading }: ProfileProps) => {
    console.log(user);
    return (
        <Layout title={'Profile'} user={user} loading={isLoading}>
            {isLoading ? <>Loading...</> : <ProfileCard user={user} />}
        </Layout>
    );
};

// Protected route, checking user authentication client-side.(CSR)
export default withPageAuthRequired(Profile);
