import Head from "next/head";
import NavBar from '../components/nav'
import React from "react";
import { PeerPrepClient } from "@/lib/PeerPrepClient";
import QuestionTable from '../components/questionTable'
import { Question, defaultQuestion } from "../models/types";
import Layout from "../components/layout";
import { useUser } from '@auth0/nextjs-auth0/client'

export default function Home() {
    const client = new PeerPrepClient();
    const [questions, setQuestions] = React.useState<Question[]>([defaultQuestion()]);
    const { user, isLoading } = useUser()

    function fetchQuestions() {
        client.getQuestions().then(setQuestions)
    }

    React.useEffect(() => {
        fetchQuestions()
    }, []);

    return (
        <Layout user = {user} loading = {isLoading}>
            <h1 className="is-size-1">Questions</h1>
            <QuestionTable questions={questions} client={client} fetchQnFn={fetchQuestions}/>
        </Layout>
    )
}