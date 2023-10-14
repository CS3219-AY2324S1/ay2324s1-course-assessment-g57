import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import NavBar from "../components/nav";

const UIKitVideoWithNoSSR = dynamic(
  () => import("../components/video/UIKitVideoPlayer"),
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
        <UIKitVideoWithNoSSR channel={"VideoChatApp"} />
      </main>
    </>
  );
};

export default video;
