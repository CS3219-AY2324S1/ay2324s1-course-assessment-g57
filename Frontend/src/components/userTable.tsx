import { User } from "../models/types";

const tableComponent = (prop: { users: User[] }) => {
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
                    {prop.users.map((val) => {
                        return (
                            <tr>
                                <td>{val.id}</td>
                                <td>{val.name}</td>
                                <td>{val.email}</td>
                                <td>{val.createdDateTime}</td>
                                <td><img src = "/assets/edit.svg"/></td>
                                <td><img src = "/assets/trash.svg"/></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </>
    )
}

export default tableComponent;