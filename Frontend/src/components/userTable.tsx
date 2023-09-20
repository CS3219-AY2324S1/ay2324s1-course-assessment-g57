import { User } from "../models/types";
import { PeerPrepClient } from "@/lib/PeerPrepClient";
import React from 'react';

type UserTableProp = {
    users: User[],
    client: PeerPrepClient
};


const tableComponent = ({ users, client }: UserTableProp) => {
    const [currentUserEditJson, setCurrentUserEditJson] = React.useState<string>("");

    function sendToEditBox(user: User) {
        // send json to textbox
        setCurrentUserEditJson(JSON.stringify(user, null, 4));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            // try to parse the string in currentUserEditJson
            const user: User = JSON.parse(currentUserEditJson);
            const _ = await client.updateUser(user);
            alert(`Updated user: ${user.userid}!`)
        } catch (err: any) {
            console.log(err);
            alert("Are you sure that the json is valid?");
        }
    }

    // OnClick Delete function
    function sendDelete(id: number) {
        client.deleteUser(id)
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
                            <th>CreatedDateTime</th>
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
                                    <td>{val.createddatetime}</td>
                                    <td><img src="/assets/edit.svg" onClick={() => { sendToEditBox(val) }} style={{ width: 25 }} /></td>
                                    <td><img src="/assets/trash.svg" onClick={() => sendDelete(val.userid)} style={{ width: 25 }} /></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <form method="post" onSubmit={async (e) => { await handleSubmit(e) }}>
                    <section>
                        <textarea id="textareaedit"
                            className="textarea is-normal"
                            rows={10}
                            placeholder="json here"
                            defaultValue={currentUserEditJson}
                            onChange={(e) => { setCurrentUserEditJson(e.target.value) }}
                        >
                        </textarea>
                    </section>

                    <section>
                        <button className="button is-primary" type="submit">Submit</button>
                    </section>
                </form>
                <br /><br /><br />
                <section>
                    <h1 className="is-size-2">Add User</h1>
                </section>
            </section>

        </>
    )
}

export default tableComponent;