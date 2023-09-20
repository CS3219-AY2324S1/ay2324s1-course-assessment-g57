import Head from "next/head";
import NavBar from '../components/nav'
import React from "react";
import { PeerPrepClient } from "@/lib/PeerPrepClient";
import QuestionTable from '../components/questionTable'
import { Question, defaultQuestion } from "../models/types";

export default function Home() {
    const questionsApi = "https://opentdb.com/api.php?amount=10";
    const client = new PeerPrepClient(questionsApi);
    const [questions, setQuestions] = React.useState<Question[]>([defaultQuestion()]);

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

        <QuestionTable questions={questions}/>
    </main>
    </>
)
}