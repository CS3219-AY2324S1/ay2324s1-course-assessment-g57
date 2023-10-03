import Head from "next/head";
import NavBar from '../components/Nav'
import { User, defaultUser } from "../models/types";
import React from "react";
import { PeerPrepClient } from "@/lib/PeerPrepClient";
import UserTable from '../components/userTable'

export default function Home() {
    const client = new PeerPrepClient();
    const [users, setUsers] = React.useState<User[]>([defaultUser()]);

    React.useEffect(() => {
        client.getUsers().then(setUsers)
    }, []);

    return (
        <>
            <Head>
                <title>Users</title>
            </Head>
            <main>
                <NavBar />
                <section>
                    <h1 className="is-size-1">Users</h1>
                    <UserTable users={users} client={client} />
                </section>
            </main>
        </>
    )
}