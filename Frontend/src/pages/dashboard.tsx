import React from 'react';
import Layout from '../components/Layout';
import MatchControls from '@/components/Matching/MatchControls';
import QuestionTable from '../components/QuestionTable';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';

type QuestionProps = {
    user?: any;
    isLoading: boolean;
};

const Dashboard = ({ user, isLoading }: QuestionProps) => {
    // const { user, isLoading } = useUser();
    // console.log(user);

    return (
        <>
            <Layout user={user} loading={isLoading}>
                {user ? (
                    <>
                        <section className="section">
                            <p className="is-size-3">
                                Welcome back, {user.nickname}!
                            </p>
                        </section>

                        <section className="section">
                            <h2 className="is-size-4">Match with a Peer!</h2>
                            <MatchControls />
                        </section>

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
