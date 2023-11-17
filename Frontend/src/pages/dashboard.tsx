import React, { useState, useCallback } from 'react';
import Layout from '../components/Layout';
import QuestionTable from '../components/questions/QuestionTable';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { Question } from '../models/types';
import { restoreTitle } from '@/lib/utils';

type QuestionProps = {
    user?: any;
    isLoading: boolean;
    initialData: Question[];
};

export async function getServerSideProps() {
    const url = process.env.NEXT_PUBLIC_PROD_SERVER_URL + '/questions';
    const response = await fetch(url);

    if (response.ok) {
        const questions = await response.json();
        questions.map(
            (question: Question) =>
                (question.title = restoreTitle(question.title))
        );

        return {
            props: { initialData: questions },
        };
    } else {
        console.log('Failed to fetch questions', response.status);
        return {
            props: { initialData: [] },
        };
    }
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
        <div>
            <Layout user={user} loading={isLoading}>
                {user ? (
                    <>
                        <div className="p-4">
                            <p className="is-size-3">
                                Welcome back, {username}!
                            </p>
                        </div>
                        <div className="p-4 mt-4">
                            <h1 className="is-size-3">Questions</h1>
                            <QuestionTable
                                user={user}
                                initialData={initialData}
                            />
                        </div>
                    </>
                ) : (
                    // <>
                    //     <section className="section p-8">
                    //         <p className="is-size-3">
                    //             Welcome back, {username}!
                    //         </p>
                    //     </section>
                    //     <section className="section p-24">
                    //         <h2 className="is-size-4">Match with a Peer!</h2>
                    //         <MatchControls userId={user.sub} />
                    //     </section>

                    //     <section className="section">
                    //         <h1 className="is-size-3">Questions</h1>
                    //         <QuestionTable
                    //             user={user}
                    //             initialData={initialData}
                    //         />
                    //     </section>
                    // </>
                    <></>
                )}
            </Layout>
        </div>
    );
};

export default withPageAuthRequired(Dashboard);
