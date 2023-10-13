import React, { useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import NavBar from "../components/nav";

const VideoComponentWithNoSSR = dynamic(
  () => import("../components/videoRoom"),
  { ssr: false }
);

const video = () => {
  const [joined, setJoined] = useState(false);
  return (
    <>
      <Head>
        <title>video</title>
      </Head>
      <main>
        <NavBar />
        {!joined && <button onClick={() => setJoined(true)}>Join Room</button>}

        {joined && <VideoComponentWithNoSSR />}
      </main>
    </>
  );
};

export default video;
