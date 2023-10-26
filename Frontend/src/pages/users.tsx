import Layout from '@/components/Layout';
import { User, defaultUser } from '../models/types';
import React from 'react';
import { PeerPrepClient } from '@/lib/PeerPrepClient';
import UserTable from '../components/UserTable';

export default function Home() {
    const client = new PeerPrepClient();
    const [users, setUsers] = React.useState<User[]>([defaultUser()]);

    function getUsers() {
        client.getUsers().then(setUsers);
    }

    React.useEffect(() => {
        getUsers();
    }, []);

    return (
        <Layout title={'Users'}>
            <h1 className="is-size-1">Users</h1>
            <UserTable users={users} client={client} fetchUsersFn={getUsers} />
        </Layout>
    );
}
