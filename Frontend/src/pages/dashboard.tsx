import React, { useState, useCallback } from 'react';
import Layout from '../components/Layout';
import MatchControls from '@/components/Matching/MatchControls';
import QuestionTable from '../components/questions/QuestionTable';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { Question } from '../models/types';

type QuestionProps = {
    user?: any;
    isLoading: boolean;
    initialData: Question[];
};

export async function getServerSideProps() {
    // Fetch initial data on the server
    const response = await fetch('/api/questions');
    console.log(response);
    const initialData = await response.json();
    return {
        props: { initialData },
    };
}

const Dashboard = ({ user, initialData, isLoading }: QuestionProps) => {
    const [username, setUsername] = useState<string>();
    const fetchUser = useCallback(() => {
        fetch(`/api/users/${user.sub}`)
            .then((response) => response.json())
            .then((fetchedUser) => {
                setUsername(fetchedUser.username);
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
            });
    }, [user.sub]);

    React.useEffect(() => {
        fetchUser();
    }, [username, fetchUser]);

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
                        </section>

                        <section className="section">
                            <h1 className="is-size-3">Questions</h1>
                            <QuestionTable
                                user={user}
                                initialData={initialData}
                            />
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
