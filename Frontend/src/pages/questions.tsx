import React from 'react';
import QuestionTable from '../components/QuestionTable';
import Layout from '../components/Layout';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';

type QuestionPageProps = {
    user?: any;
    isLoading: boolean;
};
const QuestionPage = ({ user, isLoading }: QuestionPageProps) => {
    return (
        <Layout title={'Questions'} user={user} loading={isLoading}>
            <h1 className="is-size-1">Questions</h1>
            <QuestionTable user={user} />
        </Layout>
    );
};

export default withPageAuthRequired(QuestionPage);
