import Head from "next/head";
import React from "react";
import NavBar from '../components/Nav'

const MainApp = () => {
    return (
        <>
            <Head>
                <title>PeerPrep</title>
                <meta
                    name="description"
                    content="auto generated content by chatgpt so this is plagurism 100%"
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <NavBar />
                <section style={{ padding: 15}}>
                    <h1 className="is-size-1">PeerPrep</h1>
                    <p>
                        PeerPrep is a platform for students to practice technical interviews with their
                        peers.
                    </p>
                </section>
            </main>
        </>
    );
};

export default MainApp;
