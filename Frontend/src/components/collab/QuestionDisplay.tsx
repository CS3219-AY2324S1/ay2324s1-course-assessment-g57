import { Question, defaultQuestion } from '../../models/types';
import React from 'react';
import Image from 'next/image';

type QuestionDisplayProp = {
    qnTitle: string;
    getNewQnFn: () => void;
};

const QuestionDisplay = ({ qnTitle, getNewQnFn }: QuestionDisplayProp) => {
    const [question, setQuestion] = React.useState<Question>(defaultQuestion());

    async function getQnByTitle(title: string) {
        const response = await fetch(`/api/questions/${title}`);
        const qn = await response.json();
        setQuestion(qn);
    }

    React.useEffect(() => {
        getQnByTitle(qnTitle);
    }, [qnTitle]);

    return (
        <div className="box">
            <div className="content">
                <div>
                    <button
                        onClick={async () => {
                            getNewQnFn();
                            await getQnByTitle(qnTitle);
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
                <div
                    dangerouslySetInnerHTML={{ __html: question.description }}
                ></div>
                {/* <p>{question.description}</p> */}
            </div>
        </div>
    );
};

export default QuestionDisplay;
