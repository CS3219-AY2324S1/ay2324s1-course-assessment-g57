import React, { useState } from 'react';
import Layout from '../components/Layout';
import MatchControls from '@/components/Matching/MatchControls';
import QuestionTable from '../components/questions/QuestionTable';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';

type QuestionProps = {
    user?: any;
    isLoading: boolean;
};

const Dashboard = ({ user, isLoading }: QuestionProps) => {
    const [username, setUsername] = useState<string>();

    async function fetchUser() {
        fetch(`/api/users/${user.sub}`)
            .then((response) => response.json())
            .then((fetchedUser) => {
                setUsername(fetchedUser.username);
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
            });
    }

    React.useEffect(() => {
        fetchUser();
    }, [username]);

    return (
        <>
            <Layout user={user} loading={isLoading}>
                {user ? (
                    <>
                        <section className="section">
                            <p className="is-size-3">
                                Welcome back, {username}!
                            </p>
                        </section>

                        <section className="section">
                            <h2 className="is-size-4">Match with a Peer!</h2>
                            <MatchControls userId={user.sub} />

                        <section className="section">
                            <h1 className="is-size-3">Questions Database</h1>
                            <QuestionTable user={user} />
                        </section>
                    </>
                ) : (
                    <></>
                )}
            </Layout>
        </>
    );
};

export default withPageAuthRequired(Dashboard);
