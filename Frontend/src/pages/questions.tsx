import Head from "next/head";
import NavBar from '../components/nav'
import React from "react";
import { PeerPrepClient } from "@/lib/PeerPrepClient";
import QuestionTable from '../components/questionTable'
import { Question, defaultQuestion } from "../models/types";

export default function Home() {
    const client = new PeerPrepClient();
    const [questions, setQuestions] = React.useState<Question[]>([defaultQuestion()]);

    function fetchQuestions() {
        client.getQuestions().then(setQuestions)
    }

    React.useEffect(() => {
        fetchQuestions()
    }, []);

    return (
        <>
        <Head>
            <title>Questions</title>
        </Head>
        <main>
            <NavBar />
            <h1 className="is-size-1">Questions</h1>
            <QuestionTable questions={questions} client={client} fetchQnFn={fetchQuestions}/>
        </main>
        </>
    )
}