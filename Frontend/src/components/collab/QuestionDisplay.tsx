import { Question, defaultQuestion } from '../../models/types';
import React from 'react';
import Image from 'next/image';

type QuestionDisplayProp = {
    qnId: string;
    getNewQnFn: () => void;
};

const QuestionDisplay = ({ qnId, getNewQnFn }: QuestionDisplayProp) => {
    const [question, setQuestion] = React.useState<Question>(defaultQuestion());

    async function getQnById(_id: number) {
        const response = await fetch(`/api/questions`);
        const jsonRes: Question[] = await response.json();
        // console.log(qnId);
        // console.log(jsonRes);
        console.log(_id);

        const qn = jsonRes.filter((s) => s._id == parseInt(qnId))[0];
        setQuestion(qn);
    }

    React.useEffect(() => {
        getQnById(parseInt(qnId));
    }, [qnId]);

    return (
        <div className="box">
            <div className="content">
                <div>
                    <button
                        onClick={async () => {
                            getNewQnFn();
                            await getQnById(parseInt(qnId));
                        }}
                        className="button is-small is-rounded is-primary is-pulled-right"
                    >
                        <Image
                            src="/assets/change.svg"
                            alt="Change Questions"
                            width="10"
                            height="10"
                        />
                    </button>
                </div>
                <h1 className="is-size-3">{question.title}</h1>
                <p className="is-size-5">{question.categories}</p>
                <p>{question.description}</p>
            </div>
        </div>
    );
};

export default QuestionDisplay;
