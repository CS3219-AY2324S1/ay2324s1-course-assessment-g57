import Head from "next/head";
// import NavBar from '../components/Nav'
import React from "react";
import { PeerPrepClient } from "@/lib/PeerPrepClient";
import QuestionTable from '../components/QuestionTable';
import { Question, defaultQuestion } from "../models/types";
import Layout from "../components/Layout";
import { useUser } from '@auth0/nextjs-auth0/client'

export default function Home() {
    const client = new PeerPrepClient();
    const [questions, setQuestions] = React.useState<Question[]>([defaultQuestion()]);
    const { user, isLoading } = useUser()

    function fetchQuestions() {
        fetch(`/api/questions`).then((response) => response.json())
        .then((fetchedQuestions) => {
            setQuestions(fetchedQuestions);
        })
        .catch((error) => {
        console.error('Error fetching questions', error);
        });
    }

    React.useEffect(() => {
        fetchQuestions()
    }, []);

    return (
        <Layout title={"Questions"} user={user} loading ={isLoading}>
            <h1 className="is-size-1">Questions</h1>
            <QuestionTable questions={questions} client={client} fetchQnFn={fetchQuestions}/>
        </Layout>
    )
}