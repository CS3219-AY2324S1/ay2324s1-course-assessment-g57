import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from 'next/navigation'

const MonacoEditorComponentWithNoSSR = dynamic(() => import("../components/editor/Editor"), {ssr: false});
const AgoraUIKit = dynamic(() => import("../components/video/UIKitVideoPlayer"), {ssr: false});

const CodeEditorPage = () => {
    const searchParams = useSearchParams()
    const [roomId, setRoomId] = useState(searchParams.get('roomId'));

    useEffect(() => {
        const id = searchParams.get('roomId');
        console.log(id);
        setRoomId(id);
    }, []);

    // return <MonacoEditorComponentWithNoSSR/>

    return (
        <>
            <AgoraUIKit channel={roomId || ""}/>
            <MonacoEditorComponentWithNoSSR/>
        </>
    );
}

export default CodeEditorPage;
