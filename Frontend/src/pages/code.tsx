import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";

const MonacoEditorComponentWithNoSSR = dynamic(() => import("../components/editor/Editor"), {ssr: false});

const CodeEditorPage = () => {
    return <MonacoEditorComponentWithNoSSR/>
}

export default CodeEditorPage;