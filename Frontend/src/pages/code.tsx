import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import QuestionDisplay from '../components/collab/QuestionDisplay';
import socket from '../lib/socket';

const MonacoEditorComponentWithNoSSR = dynamic(
    () => import('../components/editor/Editor'),
    { ssr: false }
);
const AgoraUIKit = dynamic(
    () => import('../components/video/UIKitVideoPlayer'),
    { ssr: false }
);

const CodeEditorPage = () => {
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

        setRoomId(id);
        setCurrentQnTitle(qnTitle || '');
        setDifficulty(difficulty);

        // socket.emit('questionUpdate', { roomId, difficulty });
    }, []);

    function getNewQn() {
        socket.emit('questionUpdate', { roomId, difficulty: currDifficulty });
    }

    return (
        <>
            {/* <TopBar /> */}
            <div className="columns">
                <div className="column is-two-fifths">
                    <QuestionDisplay
                        qnTitle={currentQnTitle}
                        getNewQnFn={getNewQn}
                    />
                </div>
                <div className="column is-three-fifths">
                    <MonacoEditorComponentWithNoSSR roomId={roomId || ''} />
                    <AgoraUIKit channel={roomId || ''} />
                </div>
            </div>
        </>
    );
};

export default CodeEditorPage;
