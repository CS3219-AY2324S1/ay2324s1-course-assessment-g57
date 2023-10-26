import React, { useState, useEffect } from 'react';
import AgoraUIKit, { layout } from 'agora-react-uikit';
import axios from 'axios';

const SERVER_URL =
  process.env.ENV === 'DEV'
    ? process.env.NEXT_PUBLIC_DEV_SERVER_URL
    : process.env.END === 'PROD'
    ? process.env.NEXT_PUBLIC_PROD_SERVER_URL
    : 'http://localhost:3500';

const UIKitVideo = ({ channel }: { channel: string }) => {
  const [videoCall, setVideoCall] = useState(false);
  const [token, setToken] = useState();

  const getToken = async (inputChannel: string) => {
    const res = await axios
      .get(SERVER_URL + `/rtc/${inputChannel}`)
      .then((response) => {
        if (response.status === 200) {
          return response.data.rtcToken;
        } else {
          return '';
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return res;
  };

  useEffect(() => {
    const init = async () => {
      const retrievedToken = await getToken(channel);
      setToken(retrievedToken);
    };

    init();
  }, []);

  const rtcProps = {
    appId: process.env.AGORA_APP_ID || 'ead9549ed5af43d5a769644e3136da85',
    channel: channel,
    token: token,
    disableRtm: true,
    layout: layout.grid,
  };

  const styleProps = {
    BtnTemplateStyles: {}, // Style the local buttons, except for end call button.
    UIKitContainer: {}, // Style the global view containing AgoraUIKit.
    gridVideoCalls: {}, // Style the individual cells containing the videos in the grid layout.
    gridVideoContainer: {}, // Style the container storing the individual cells in grid layout.
    iconSize: 13, // Customize size of the icons.
    localBtnContainer: {
      backgroundColor: '#3b3b3b',
    }, // Style the container for the buttons.
    localBtnStyles: {
      muteLocalVideo: {
        borderRadius: 25,
        width: 40,
        height: 40,
        borderWidth: 1,
      }, // Camera Button.
      muteLocalAudio: {
        borderRadius: 25,
        width: 40,
        height: 40,
        borderWidth: 1,
      }, // Mute Button.
      endCall: {
        borderRadius: 25,
        width: 60,
        height: 40,
        backgroundColor: '#f66',
        borderWidth: 1,
      }, // End Call Button.
    }, // Style for specific local buttons.
    theme: 'white', // Color tint for the icons in the buttons.
  };

  const callbacks = {
    EndCall: () => setVideoCall(false),
  };

  return (
    <div>
      {videoCall && (
        <div style={{ display: 'flex', height: '50vh' }}>
          <AgoraUIKit
            rtcProps={rtcProps}
            callbacks={callbacks}
            styleProps={styleProps}
          />
        </div>
      )}
      {!videoCall && (
        <button className="button is-link" onClick={() => {
          if (!token) {
            alert("Video Failed To Launch!");
          } else {
            setVideoCall(true)
          }
        }}>
          Start Call
        </button>
      )}
    </div>
  );
};

export default UIKitVideo;
