import Layout from '@/components/Layout';
import React from 'react';
import UserTable from '../components/UserTable';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';

type UserPageProps = {
    user?: any;
    isLoading: boolean;
};
const UserPage = ({ user, isLoading }: UserPageProps) => {
    // const client = new PeerPrepClient();
    // const [users, setUsers] = React.useState<User[]>([defaultUser()]);

    // function getUsers() {
    //     client.getUsers().then(setUsers);
    // }

    // React.useEffect(() => {
    //     getUsers();
    // }, []);

    return (
        <Layout title={'Users'} user={user} loading={isLoading}>
            <h1 className="is-size-1">Users</h1>
            <UserTable authUser={user} />
        </Layout>
    );
};

export default withPageAuthRequired(UserPage);
