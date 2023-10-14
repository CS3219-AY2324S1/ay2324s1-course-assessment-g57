import React, { useState, useEffect } from "react";
import AgoraUIKit from "agora-react-uikit";
import axios from "axios";

const SERVER_URL = process.env.SERVER3_URL || "http://localhost:3500";

const UIKitVideo = ({ channel }: { channel: string }) => {
  const [videoCall, setVideoCall] = useState(false);
  const [token, setToken] = useState();

  const getToken = async (channel: string) => {
    const res = await axios
      .get(SERVER_URL + `/rtc/${channel}`)
      .then((res) => {
        if (res.status === 200) {
          return res.data.rtcToken;
        } else {
          return "";
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return res;
  };

  useEffect(() => {
    const init = async () => {
      const token = await getToken(channel);
      setToken(token);
    };

    init();
  }, []);

  const rtcProps = {
    appId: process.env.AGORA_APP_ID || "ead9549ed5af43d5a769644e3136da85",
    channel: channel,
    token: token,
    disableRtm: true,
  };

  const callbacks = {
    EndCall: () => setVideoCall(false),
  };

  return (
    <div>
      {videoCall && (
        <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
          <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} />
        </div>
      )}
      {!videoCall && (
        <button onClick={() => setVideoCall(true)}>Start Call</button>
      )}
    </div>
  );
};

export default UIKitVideo;
