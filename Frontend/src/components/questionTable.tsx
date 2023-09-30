import { Question } from "../models/types";

const tableComponent = (prop: { questions: Question[] }) => {
    return (
        <>
            <table className="table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Id</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Difficulty</th>
                        <th>Link</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {prop.questions.map((val, idx) => {
                        return (
                            <tr>
                                <td><img src="/assets/chevrondown.svg" /></td>
                                <td>{val.id}</td>
                                <td>{val.title}</td>
                                <td>{val.category}</td>
                                <td>{val.difficulty}</td>
                                <td>{val.link}</td>
                                <td><img src="/assets/edit.svg" style={{ width: 25 }} /></td>
                                <td><img src="/assets/trash.svg" style={{ width: 25 }} /></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </>
    )
}

export default tableComponent;