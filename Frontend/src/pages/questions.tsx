import Head from "next/head";
import NavBar from '../components/nav'
import React from "react";
import { PeerPrepClient } from "@/lib/PeerPrepClient";
import QuestionTable from '../components/userTable'
import { Question } from "../models/types";

export default function Home() {
    const questionsApi = "";
    const client = new PeerPrepClient(questionsApi);
    const [questions, setQuestions] = React.useState<Question[]>([{ id: 0, title: "", category: "", difficulty: "", link: ""}]);

    React.useEffect(() => {
        client.getQuestions().then(setQuestions)
    }, [questions]);

return (
    <>
    <Head>
        <title>Questions</title>
    </Head>
    <main>
        <NavBar />
        <h1 className="is-size-1">Questions</h1>
        <p>Questions will go here</p>

        <QuestionTable questions={questions}/>
    </main>
    </>
)
}