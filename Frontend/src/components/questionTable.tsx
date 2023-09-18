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
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {prop.questions.map((val) => {
                        return (
                            <tr>
                                <td><img src=""/></td>
                                <td>{val.id}</td>
                                <td>{val.title}</td>
                                <td>{val.category}</td>
                                <td>{val.difficulty}</td>
                                <td>{val.link}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </>
    )
}

export default tableComponent;