import { User, defaultUser } from '../../models/types';
import React from 'react';

type UserTableProp = {
    authUser?: any;
};

const TableComponent = ({}: UserTableProp) => {
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
                console.log('Fetched users');
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

    return (
        <>
            <section>
                <div className="table-container">
                    <table className="table is-bordered is-striped is-hoverable is-fullwidth">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Display Name</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((val) => {
                                return (
                                    <tr key={val.userid}>
                                        <td>{val.userid}</td>
                                        <td>{val.username}</td>
                                        <td>{val.email}</td>
                                        <td></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    );
};

export default TableComponent;
