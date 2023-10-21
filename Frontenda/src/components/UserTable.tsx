import { User, CreateUserForm, defaultCreateUserForm  } from "../models/types";
import { PeerPrepClient } from "@/lib/PeerPrepClient";
import React from 'react';
import { isValidJsonString, hasEmptyValues } from '@/lib/utils';

type UserTableProp = {
    users: User[],
    client: PeerPrepClient,
    fetchUsersFn: () => void
};

const tableComponent = ({ users, client, fetchUsersFn }: UserTableProp) => {
    const [currentUserEditJson, setCurrentUserEditJson] = React.useState<string>("");
    const [currentAddUser, setCurrentAddUser] = React.useState<string>(JSON.stringify(defaultCreateUserForm(), null, 4));

    function sendToEditBox(user: User) {
        // send json to textbox
        setCurrentUserEditJson(JSON.stringify(user, null, 4));
    }

    async function handleEditSubmit(e: React.FormEvent<HTMLFormElement>) {
        try {
            // try to parse the string in currentUserEditJson
            const user: User = JSON.parse(currentUserEditJson);
            // does not return json
            const _ = await client.updateUser(user);
            // we make parent fetch users
            fetchUsersFn();
            // then we clear the currentUserEditJson
            setCurrentUserEditJson("");
            alert(`Updated user: ${user.userid}!`)
        } catch (err: any) {
            console.log(err);
        }
    }

    // OnClick Delete function
    async function sendDelete(id: string) {
        try {        
            await client.deleteUser(id)
            fetchUsersFn();
            alert(`Deleted user: ${id}`);
        } catch(e: any) {
            console.log(e);
        }
    }

    async function handleAddSubmit(e: React.FormEvent<HTMLFormElement>) {
        try {
            // try to parse the string in currentUserEditJson
            const user: CreateUserForm = JSON.parse(currentAddUser);
            // does not return json
            const _ = await client.createUser(user);
            // we make parent fetch users
            fetchUsersFn();
            // then we clear the currentUserEditJson
            setCurrentAddUser(JSON.stringify(defaultCreateUserForm(), null, 4));
            alert('Added user!')
        } catch (err: any) {
            console.log(err);
        }
    }

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
                        {users.map((val, idx) => {
                            return (
                                <tr key={val.userid}>
                                    <td>{val.userid}</td>
                                    <td>{val.username}</td>
                                    <td>{val.email}</td>
                                    <td><img src="/assets/edit.svg" onClick={() => { sendToEditBox(val) }} style={{ width: 25 }} /></td>
                                    <td><img src="/assets/trash.svg" onClick={() => sendDelete(val.userid)} style={{ width: 25 }} /></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <form method="post" onSubmit={async (e) => { await handleEditSubmit(e) }}>
                    <section>
                        <textarea id="textareaedit"
                            className="textarea is-normal"
                            rows={10}
                            placeholder="json here"
                            disabled={currentUserEditJson.length === 0}
                            value={currentUserEditJson}
                            onChange={(e) => { setCurrentUserEditJson(e.target.value) }}
                        >
                        </textarea>
                    </section>

                    <section>
                        <button className="button is-primary"
                            disabled={!isValidJsonString(currentUserEditJson)} 
                            type="submit">Submit
                        </button>
                    </section>
                </form>
                <br/><br/><br/>
                <section>
                    <h1 className="is-size-2">Add User</h1>
                    <form method="post" onSubmit={async (e) => { handleAddSubmit(e) }}>
                        <section>
                            <textarea id="textareaedit"
                                className="textarea is-normal"
                                rows={10}
                                placeholder="json here"
                                value={currentAddUser}
                                onChange={(e) => { setCurrentAddUser(e.target.value) }}
                            >
                            </textarea>
                        </section>

                        <section>
                            <button className="button is-primary" type="submit" disabled={!isValidJsonString(currentAddUser) || (isValidJsonString(currentAddUser) && hasEmptyValues(JSON.parse(currentAddUser)))}>Submit</button>
                        </section>
                    </form>
                </section>
            </section>

        </>
    )
}

export default tableComponent;