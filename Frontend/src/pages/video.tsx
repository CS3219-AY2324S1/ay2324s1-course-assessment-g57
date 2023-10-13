import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import NavBar from "../components/nav";

const VideoComponentWithNoSSR = dynamic(
  () => import("../components/videoRoom"),
  { ssr: false }
);

const video = () => {
  return (
    <>
      <Head>
        <title>video</title>
      </Head>
      <main>
        <NavBar />
        <VideoComponentWithNoSSR />
      </main>
    </>
  );
};

export default video;
