import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import Layout from "@/components/Layout";

const MonacoEditorComponentWithNoSSR = dynamic(() => import("../components/Editor"), {ssr: false});

const CodeEditorPage = () => {
    return (
        <Layout title={"Collaborate"}>
            <MonacoEditorComponentWithNoSSR/>
        </Layout>
    )
}

export default CodeEditorPage;