import { User} from "../models/types";

const tableComponent = (prop: {users: User[]}) => {
    return (
    <>
    <table className="table">
        <thead>
            <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
            </tr>
        </thead>
        <tbody>
            {prop.users.map((val) => {
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
    </>
)
}

export default tableComponent;