import {
    User,
    defaultUser,
    // CreateUserForm,
    // defaultCreateUserForm,
} from '../models/types';
import React from 'react';
import { isValidJsonString } from '@/lib/utils';

type UserTableProp = {
    // users: User[];
    // client: PeerPrepClient;
    // fetchUsersFn: () => void;
    authUser?: any;
};

const TableComponent = ({ authUser }: UserTableProp) => {
    const [currentUserEditJson, setCurrentUserEditJson] =
        React.useState<string>('');
    // const [currentAddUser, setCurrentAddUser] = React.useState<string>(
    //     JSON.stringify(defaultCreateUserForm(), null, 4)
    // );
    const [users, setUsers] = React.useState<User[]>([defaultUser()]);

    function fetchUsers() {
        fetch(`/api/users`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then((fetchedUsers) => {
                console.log('Fetched users', fetchedUsers);
                setUsers(fetchedUsers);
            })
            .catch((error) => {
                console.error('Error fetching users', error);
                setUsers([]);
            });
    }

    React.useEffect(() => {
        fetchUsers();
    }, []);

    function sendToEditBox(user: User) {
        // send json to textbox
        setCurrentUserEditJson(JSON.stringify(user, null, 4));
    }

    async function handleEditSubmit() {
        try {
            // try to parse the string in currentUserEditJson
            const user: User = JSON.parse(currentUserEditJson);
            // does not return json
            // await client.updateUser(user);
            // we make parent fetch users
            // fetchUsersFn();
            // then we clear the currentUserEditJson
            fetch(`/api/users/${user.userid}`, {
                method: 'PUT',
                body: currentUserEditJson,
            })
                .then((response) => {
                    console.log(response);
                    setCurrentUserEditJson('');
                    alert(`Updated user: ${user.userid}!`);
                    return response.json();
                })
                .catch((error) => {
                    console.error('Error updating user', error);
                });
        } catch (err: any) {
            console.log(err);
        }
    }

    // OnClick Delete function
    async function sendDelete(id: string) {
        try {
            // await client.deleteUser(id);
            // fetchUsersFn();
            fetch(`/api/users/${id}`, {
                method: 'DELETE',
            })
                .then((response) => {
                    return response.json();
                })
                .catch((error) => {
                    console.error('Error deleting user', error);
                });
            // fetchQnFn();
            alert(`Deleted user: ${id}`);
        } catch (e: any) {
            console.log(e);
        }
    }

    // async function handleAddSubmit() {
    //     try {
    //         const user: CreateUserForm = JSON.parse(currentAddUser);
    //         fetch(`/api/users`, {
    //             method: 'POST',
    //             body: currentAddUser,
    //         })
    //             .then((response) => {
    //                 setCurrentAddUser(
    //                     JSON.stringify(defaultCreateUserForm(), null, 4)
    //                 );
    //                 alert(`Added user: ${user.username}!`);
    //                 return response.json();
    //             })
    //             .catch((error) => {
    //                 console.error('Error adding user', error);
    //             });
    //         // fetchQnFn();
    //         // does not return json
    //         // await client.createUser(user);
    //         // we make parent fetch users
    //         // fetchUsersFn();
    //         // then we clear the currentUserEditJson
    //         // setCurrentAddUser(JSON.stringify(defaultCreateUserForm(), null, 4));
    //         // alert('Added user!');
    //     } catch (err: any) {
    //         console.log(err);
    //     }
    // }

    return (
        <>
            <section>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((val) => {
                            return (
                                <tr key={val.userid}>
                                    <td>{val.userid}</td>
                                    <td>{val.username}</td>
                                    <td>{val.email}</td>
                                    {authUser?.peerprepRoles?.[0] ===
                                    'Admin' ? (
                                        <>
                                            <td>
                                                <img
                                                    src="/assets/edit.svg"
                                                    onClick={() => {
                                                        sendToEditBox(val);
                                                    }}
                                                    style={{ width: 25 }}
                                                />
                                            </td>
                                            <td>
                                                <img
                                                    src="/assets/trash.svg"
                                                    onClick={() =>
                                                        sendDelete(val.userid)
                                                    }
                                                    style={{ width: 25 }}
                                                />
                                            </td>
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {authUser?.peerprepRoles?.[0] === 'Admin' ? (
                    <>
                        <form
                            method="post"
                            onSubmit={async () => {
                                await handleEditSubmit();
                            }}
                        >
                            <section>
                                <textarea
                                    id="textareaedit"
                                    className="textarea is-normal"
                                    rows={10}
                                    placeholder="json here"
                                    disabled={currentUserEditJson.length === 0}
                                    value={currentUserEditJson}
                                    onChange={(e) => {
                                        setCurrentUserEditJson(e.target.value);
                                    }}
                                ></textarea>
                            </section>

                            <section>
                                <button
                                    className="button is-primary"
                                    disabled={
                                        !isValidJsonString(currentUserEditJson)
                                    }
                                    type="submit"
                                >
                                    Submit
                                </button>
                            </section>
                        </form>
                        <br />
                        <br />
                        <br />
                        {/* <section>
                            <h1 className="is-size-2">Add User</h1>
                            <form
                                method="post"
                                onSubmit={async () => {
                                    handleAddSubmit();
                                }}
                            >
                                <section>
                                    <textarea
                                        id="textareaedit"
                                        className="textarea is-normal"
                                        rows={10}
                                        placeholder="json here"
                                        value={currentAddUser}
                                        onChange={(e) => {
                                            setCurrentAddUser(e.target.value);
                                        }}
                                    ></textarea>
                                </section>

                                <section>
                                    <button
                                        className="button is-primary"
                                        type="submit"
                                        disabled={
                                            !isValidJsonString(
                                                currentAddUser
                                            ) ||
                                            (isValidJsonString(
                                                currentAddUser
                                            ) &&
                                                hasEmptyValues(
                                                    JSON.parse(currentAddUser)
                                                ))
                                        }
                                    >
                                        Submit
                                    </button>
                                </section>
                            </form>
                        </section> */}
                    </>
                ) : (
                    <></>
                )}
            </section>
        </>
    );
};

export default TableComponent;
