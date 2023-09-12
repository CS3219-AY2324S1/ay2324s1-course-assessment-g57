import Head from "next/head";
import React from "react";
import { User, Question, Fact } from "../models/types";
import dynamic from 'next/dynamic'
import UserTable from '../components/table'
import NavBar from '../components/nav'

const questionsApi = "https://www.boredapi.com/api/activity";
const usersApi = "https://jsonplaceholder.typicode.com/users";

const getUsers = async () => {
    const res = await fetch(usersApi);
    return res.json();
};

const MainApp = () => {
    const [fact, setFact] = React.useState<Fact | undefined>(undefined);
    const [question, setQuestion] = React.useState<string | undefined>(undefined);
    const [users, setUsers] = React.useState<User[]>([{ id: 0, name: "", username: "", email: ""}]);

    React.useEffect(() => {
        fetch(usersApi)
            .then((res) => res.json())
            .then((data) => {
                setUsers(data);
            });
    }, [users]);

    // function getUsers() {
    //     fetch(usersApi)
    //         .then((res) => res.json())
    //         .then((data) => {
    //             setUsers(data);
    //         });
    // }

    function getFact() {
        fetch("https://catfact.ninja/fact")
            .then((res) => res.json())
            .then((data) => {
                setFact(data);
            });
    }

    return (
        <>
            <Head>
                <title>PeerPrep</title>
                <meta
                    name="description"
                    content="auto generated content by chatgpt so this is plagurism 100%"
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <NavBar />
                <h1 className="is-size-1">PeerPrep</h1>
                <p>
                    PeerPrep is a platform for students to practice technical interviews with their
                    peers.
                </p>
                <p> The fact is : {fact?.fact}</p>
                <p> The length is : {fact?.length}</p>

                <div className="buttons">
                    <button className="button is-primary" onClick={getFact}>
                        Primary
                    </button>
                    <button className="button is-link" onClick={getUsers}>Link</button>
                </div>
                <UserTable users={users} />
            </main>
        </>
    );
};

export default MainApp;
