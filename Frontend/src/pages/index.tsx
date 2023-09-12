import Head from "next/head";
import React from "react";

type Fact = { fact: string; length: number };
type User = { id: number; name: string; username: string; email: string };

const questionsApi = "https://www.boredapi.com/api/activity";
const usersApi = "https://jsonplaceholder.typicode.com/users";

const getUsers = async () => {
    const res = await fetch(usersApi);
    return res.json();
};

const MainApp = () => {
    const [fact, setFact] = React.useState<Fact | undefined>(undefined);
    const [question, setQuestion] = React.useState<string | undefined>(undefined);
    const [users, setUsers] = React.useState<User[]>([]);

    React.useEffect(() => {
        fetch(usersApi)
            .then((res) => res.json())
            .then((data) => {
                setUsers(data);
            });
    }, [users]);

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
                    <button className="button is-link">Link</button>
                </div>

                <table>
                    <thead>
                    <th>Name</th>
                        <th>Age</th>
                        <th>Gender</th>
                    </thead>
                    <tbody>
                    {users.map((val) => {
                        return (
                            <tr>
                                <td>{val.id}</td>
                                <td>{val.name}</td>
                                <td>{val.email}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </main>
        </>
    );
};

export default MainApp;
