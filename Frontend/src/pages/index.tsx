// import Head from "next/head";
import { useUser } from '@auth0/nextjs-auth0/client';
import React from 'react';
import Layout from '../components/Layout';
import MatchControls from '@/components/Matching/MatchControls';

const MainApp = () => {
  const { user, isLoading } = useUser();
  console.log(user);
  return (
    <Layout user={user} loading={isLoading}>
      <section style={{ padding: 15 }}>
        <h1 className="is-size-1">PeerPrep</h1>
        <p>
          PeerPrep is a platform for students to practice technical interviews
          with their peers.
        </p>
      </section>
      {user ? (
        <>
          <h2 className="is-size-2">
            Pick a difficulty and match with someone!
          </h2>
          <MatchControls />
        </>
      ) : (
        <></>
      )}
    </Layout>
  );
};

export default MainApp;
