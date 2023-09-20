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
        setCurrentUserEditJson(JSON.stringify(user));    
    }
    
    async function handleSubmit(){
        // try to parse the string in currentUserEditJson
        try {
            const user: User = JSON.parse(currentUserEditJson);
            const _ = await client.updateUser(user);
        } catch(e) {
            alert(e);
            alert("Are you sure that the json is valid?");
        }
    }

    // OnClick Delete function
    function sendDelete(id: number) {
        client.deleteUser(id)
    }

    return (
        <>
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
                            <tr>
                                <td>{val.userid}</td>
                                <td>{val.username}</td>
                                <td>{val.email}</td>
                                <td>{val.createddatetime}</td>
                                <td><img src="/assets/edit.svg" onClick={() => { sendToEditBox(val) }} style={{ width: 25 }} /></td>
                                <td><img src="/assets/trash.svg" style={{ width: 25 }} /></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <form method="post" onSubmit={ async () => { await handleSubmit() }}>
                <section>
                    <textarea id="textareaedit" className="textarea is-normal" rows={10} placeholder="json here" defaultValue={currentUserEditJson}>    
                    </textarea>
                </section>

                <section>
                    <button className="button is-primary" type="submit">Submit</button>
                </section>
            </form>
        </>
    )
}

export default tableComponent;