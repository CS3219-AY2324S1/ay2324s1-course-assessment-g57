import Head from "next/head";
import NavBar from '../components/nav'
import { User } from "../models/types";
import React from "react";
import { PeerPrepClient } from "@/lib/PeerPrepClient";
import UserTable from '../components/userTable'

export default function Home() {
    const usersApi = "https://jsonplaceholder.typicode.com";
    const client = new PeerPrepClient(usersApi);
    const [users, setUsers] = React.useState<User[]>([{ id: 0, name: "", username: "", email: "", createdDateTime: ""}]);

    React.useEffect(() => {
        client.getUsers().then(setUsers)
    }, [users]);

    return (
        <>
            <Head>
                <title>Users</title>
            </Head>
            <main>
                <NavBar />
                <section>
                    <h1 className="is-size-1">Users</h1>

                    <UserTable users={users} />
                </section>
            </main>
        </>
    )
}