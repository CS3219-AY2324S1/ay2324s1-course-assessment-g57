import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from 'next/navigation'
import TopBar from "../components/collab/TopBar";
import QuestionDisplay from "../components/collab/QuestionDisplay";

const MonacoEditorComponentWithNoSSR = dynamic(() => import("../components/editor/Editor"), { ssr: false });
const AgoraUIKit = dynamic(() => import("../components/video/UIKitVideoPlayer"), { ssr: false });

const CodeEditorPage = () => {
    const searchParams = useSearchParams()
    const [roomId, setRoomId] = useState(searchParams.get('room'));

    useEffect(() => {
        const id = searchParams.get('room');
        console.log(id);
        setRoomId(id);
    }, []);

    return (
        <>
            <TopBar />
            <div className="columns">
                <div className="column">
                    <QuestionDisplay />
                    <AgoraUIKit channel={roomId || ""} />
                </div>
                <div className="column is-three-fifths">
                    <MonacoEditorComponentWithNoSSR />
                </div>
            </div>
        </>
    );
}

export default CodeEditorPage;
