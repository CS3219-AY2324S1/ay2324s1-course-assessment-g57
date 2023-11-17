import React from 'react';
import Layout from '../components/Layout';
import QuestionTable from '../components/questions/QuestionTable';
import { Question } from '../models/types';
import { restoreTitle } from '@/lib/utils';
// import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type QuestionProps = {
    initialData: Question[];
};

export async function getServerSideProps() {
    const url = process.env.NEXT_PUBLIC_PROD_SERVER_URL + '/questions';
    const response = await fetch(url);

    if (response.ok) {
        const questions = await response.json();
        questions.map(
            (question: Question) =>
                (question.title = restoreTitle(question.title))
        );

        return {
            props: { initialData: questions },
        };
    } else {
        console.log('Failed to fetch questions', response.status);
        return {
            props: { initialData: [] },
        };
    }
}

const MainPage = ({ initialData }: QuestionProps) => {
    return (
        <div>
            <Layout>
                <div className="p-4">
                    <p className="is-size-3">Welcome back!</p>
                </div>

                <div className="p-4 mt-4">
                    <h1 className="is-size-3">Questions</h1>
                    <QuestionTable initialData={initialData} />
                </div>
            </Layout>
        </div>
    );
};

export default MainPage;
