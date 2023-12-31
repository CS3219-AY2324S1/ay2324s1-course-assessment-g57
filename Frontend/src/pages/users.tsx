import Layout from '@/components/Layout';
import React from 'react';
import UserTable from '../components/users/UserTable';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';

type UserPageProps = {
    user?: any;
    isLoading: boolean;
};
const UserPage = ({ user, isLoading }: UserPageProps) => {
    return (
        <Layout title={'Users'} user={user} loading={isLoading}>
            <br />
            <h1 className="is-size-2">Users</h1>
            <br />
            <UserTable authUser={user} />
        </Layout>
    );
};

export default withPageAuthRequired(UserPage);
