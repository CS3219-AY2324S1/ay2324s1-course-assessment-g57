import React from "react";
import { Question, AddQuestionForm, defaultAddQuestionForm } from "../models/types";
import { PeerPrepClient } from "@/lib/PeerPrepClient";
import { isValidJsonString, hasEmptyValues } from "@/lib/utils";

type QuestionTableProp = {
    questions: Question[],
    client: PeerPrepClient,
    fetchQnFn: () => void
};

const tableComponent = ({ questions, client, fetchQnFn }: QuestionTableProp) => {
    const [currentQuestionEditJson, setCurrentQuestionEditJson] = React.useState<string>("");
    const [currentQuestionAddJson, setQuestionAddJson] = React.useState<string>(JSON.stringify(defaultAddQuestionForm(), null, 4));

    function sendToEditBox(question: Question) {
        // send json to textbox
        setCurrentQuestionEditJson(JSON.stringify(question, null, 4));
    }

    async function handleEditSubmit(e: React.FormEvent<HTMLFormElement>) {
        try {
            // try to parse the string in currentQuestionEditJson
            const question: Question = JSON.parse(currentQuestionEditJson);
            const _ = await client.updateQuestion(question);
            fetchQnFn();
            setCurrentQuestionEditJson("");
            alert(`Updated question: ${question.id}!`)
        } catch (err: any) {
            console.log(err);
        }
    }

    async function handleAddSubmit(e: React.FormEvent<HTMLFormElement>) {
        try {
            const question: AddQuestionForm = JSON.parse(currentQuestionAddJson);
            const _ = await client.createQuestion(question);
            fetchQnFn();
            setQuestionAddJson(JSON.stringify(defaultAddQuestionForm(), null, 4));
            alert(`Added question!`)
        } catch (err: any) {
            alert(err);
            console.log(err);
        }
    }

    // OnClick Delete function
    async function sendDelete(id: number) {
        try {    
            await client.deleteQuestion(id)
            fetchQnFn();
            alert(`Deleted question: ${id}`);
        } catch(e: any) {
            console.log(e);
        }
    }

    return (
        <>
            <table className="table">
                <thead>
                    <tr>
                        <th>id</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Complexity</th>
                        <th>Description</th>
                        <th>Link</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {questions.map((val, idx) => {
                        return (
                            <tr key={val.id}>
                                <td>{val.id}</td>
                                <td>{val.title}</td>
                                <td>{val.categories}</td>
                                <td>{val.complexity}</td>
                                <td>{val.description}</td>
                                <td>{val.link}</td>
                                <td><img src="/assets/edit.svg" onClick={() => { sendToEditBox(val) }} style={{ width: 25 }} /></td>
                                <td><img src="/assets/trash.svg" onClick={() => sendDelete(val.id)} style={{ width: 25 }} /></td>
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
                            value={currentQuestionEditJson}
                            onChange={(e) => { setCurrentQuestionEditJson(e.target.value) }}
                        >
                        </textarea>
                    </section>

                    <section>
                        <button className="button is-primary" type="submit" 
                            disabled={!isValidJsonString(currentQuestionEditJson)}>Submit</button>
                    </section>
            </form>

            <br /><br /><br />
            <section>
                <h1 className="is-size-2">Add Question</h1>                
                <form method="post" onSubmit={async (e) => { await handleAddSubmit(e) }}>
                    <section>
                            <textarea id="textareaedit"
                                className="textarea is-normal"
                                rows={10}
                                placeholder="json here"
                                value={currentQuestionAddJson}
                                onChange={(e) => { setQuestionAddJson(e.target.value) }}
                            >
                            </textarea>
                        </section>

                        <section>
                            <button className="button is-primary" type="submit" 
                                disabled={!isValidJsonString(currentQuestionAddJson) || (isValidJsonString(currentQuestionAddJson) && hasEmptyValues(JSON.parse(currentQuestionAddJson)))}>
                                    Submit</button>
                        </section>
                </form>
            </section>
        </>
    )
}

export default tableComponent;