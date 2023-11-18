import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams, useRouter } from 'next/navigation';
import QuestionDisplay from '../components/collab/QuestionDisplay';
import socket from '../lib/socket';
import Head from 'next/head';

const MonacoEditorComponentWithNoSSR = dynamic(
    () => import('../components/editor/Editor'),
    { ssr: false }
);
const AgoraUIKit = dynamic(
    () => import('../components/video/UIKitVideoPlayer'),
    { ssr: false }
);

const CodeEditorPage = () => {
    const { push } = useRouter();
    const searchParams = useSearchParams();
    const [roomId, setRoomId] = useState(searchParams.get('room'));
    const [currentQnTitle, setCurrentQnTitle] = useState<string>(
        searchParams.get('qnTitle') || ''
    );
    const [currDifficulty, setDifficulty] = useState(
        searchParams.get('difficulty')
    );

    socket.on('questionUpdate', (data) => {
        const { qnTitle } = data;
        setCurrentQnTitle(`${qnTitle}`);
    });

    useEffect(() => {
        const id = searchParams.get('room');
        const qnTitle = searchParams.get('qnTitle');
        const difficulty = searchParams.get('difficulty');

        const requiredSearchParams = [id, qnTitle, difficulty];

        const missingParams = requiredSearchParams.some((param) => !param);

        if (missingParams) {
            push('/dashboard');
        }

        setRoomId(id);
        setCurrentQnTitle(qnTitle || '');
        setDifficulty(difficulty);

        // socket.emit('questionUpdate', { roomId, difficulty });
    }, [setRoomId, setCurrentQnTitle, setDifficulty, searchParams, push]);

    function getNewQn() {
        socket.emit('questionUpdate', { roomId, difficulty: currDifficulty });
    }

    return (
        <>
            {/* <TopBar /> */}
            <Head>
                <title>PeerPrep</title>
                <meta
                    name="PeerPrep"
                    // content="A collaborative platform for coders to practice technical interviews with their peers."
                    http-equiv="Content-Security-Policy"
                    content="upgrade-insecure-requests"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" type="image/x-icon" />
            </Head>
            <div className="columns ml-4 mr-4">
                <div className="column is-two-fifths">
                    <QuestionDisplay
                        qnTitle={currentQnTitle}
                        getNewQnFn={getNewQn}
                    />
                    <AgoraUIKit channel={roomId || ''} />
                </div>
                <div className="column is-three-fifths">
                    <MonacoEditorComponentWithNoSSR roomId={roomId || ''} />
                </div>
            </div>
        </>
    );
};

export default CodeEditorPage;
