import React, { useEffect, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import axios from "axios";

import VideoPlayer from "./video/videoPlayer";

const client = AgoraRTC.createClient({
  mode: "rtc",
  codec: "vp8",
});

const videoRoom = () => {
  const [users, setUsers] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);

  const handleUserJoined = async (user: any, mediaType: any) => {
    await client.subscribe(user, mediaType);

    if (mediaType === "video") {
      setUsers((previousUsers) => [...previousUsers, user]);
    }

    if (mediaType === "audio") {
      user.audioTrack.play();
    }
  };

  const handleUserLeft = (user: any) => {
    setUsers((previousUsers) =>
      previousUsers.filter((u) => u.uid !== user.uid)
    );
  };

  const getToken = async (channel: String) => {
    const res = await axios
      .get(process.env.SERVER3_URL || "http://localhost:3500" + `/rtc/${channel}`)
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
    const initialize = async (channel: any) => {
      client.on("user-published", handleUserJoined);
      client.on("user-left", handleUserLeft);

      const token = await getToken(channel);
      console.log(token);

      await client
        .join(process.env.AGORA_APP_ID || "ead9549ed5af43d5a769644e3136da85", channel, token, null)
        .then((uid) =>
          Promise.all([AgoraRTC.createMicrophoneAndCameraTracks(), uid])
        )
        .then(([tracks, uid]) => {
          const [audioTrack, videoTrack] = tracks;
          setLocalTracks(tracks);
          setUsers((previousUsers) => [
            ...previousUsers,
            { uid, videoTrack, audioTrack },
          ]);
          client.publish(tracks);
        });
    };
    initialize("VideoChatApp");

    return () => {
      for (let localTrack of localTracks) {
        localTrack.stop();
        localTrack.close();
      }
      client.off("user-published", handleUserJoined);
      client.off("user-left", handleUserLeft);
      client.unpublish(localTracks).then(() => client.leave());
    };
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 200px)" }}>
        {users.map((user) => (
          <VideoPlayer key={user.uid} user={user} />
        ))}
      </div>
    </div>
  );
};

export default videoRoom;
