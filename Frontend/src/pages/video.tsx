import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import NavBar from "../components/Nav";
import Layout from "@/components/Layout";

const UIKitVideoWithNoSSR = dynamic(
  () => import("../components/video/UIKitVideoPlayer"),
  { ssr: false }
);

const video = () => {
  return (
    <Layout title={"Video"}>
      <UIKitVideoWithNoSSR channel={"VideoChatApp"} />
    </Layout>
  );
};

export default video;
