// import Head from "next/head";
import { useUser } from '@auth0/nextjs-auth0/client'
import React from "react";
import Layout from "../components/Layout";

const MainApp = () => {
    const { user, isLoading } = useUser()
    return (
        <Layout user = {user} loading = {isLoading}>
            <section style={{ padding: 15}}>
                <h1 className="is-size-1">PeerPrep</h1>
                <p>
                    PeerPrep is a platform for students to practice technical interviews with their
                    peers.
                </p>
            </section>
        </Layout>
    );
};

export default MainApp;
