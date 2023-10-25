import React, { useState, useEffect } from 'react';
import AgoraUIKit, { layout } from 'agora-react-uikit';
import axios from 'axios';
import { Button } from '@chakra-ui/react';

const SERVER_URL =
  process.env.ENV === 'DEV'
    ? process.env.DEV_SERVER_URL
    : process.env.END === 'PROD'
    ? process.env.PROD_SERVER_URL
    : 'http://localhost:3500';

const UIKitVideo = ({ channel }: { channel: string }) => {
  const [videoCall, setVideoCall] = useState(false);
  const [token, setToken] = useState();
  console.log(channel);
  console.log('entered componenet');

  const getToken = async (inputChannel: string) => {
    console.log('entered getToken');
    const config = {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'ngrok-skip-browser-warning': 'true',
      },
    };
    const URL = SERVER_URL + `/rtc/${inputChannel}`;
    console.log('URL', URL);
    const res = await axios
      .get(URL, config)
      .then((response) => {
        console.log('Response data', response.data);
        if (response.status === 200) {
          console.log(response.data.rtcToken);
          return response.data.rtcToken;
        } else {
          console.log('failed res', response);
          return '';
        }
      })
      .catch((error) => {
        console.log('wtf');
        console.log(error);
      });
    console.log('res', res);

    return res;
  };

  useEffect(() => {
    const init = async () => {
      console.log('enter useEffect');
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
      backgroundColor: '#B2BEB5',
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
        <div style={{ display: 'flex', width: '50vw', height: '50vh' }}>
          <AgoraUIKit
            rtcProps={rtcProps}
            callbacks={callbacks}
            styleProps={styleProps}
          />
        </div>
      )}
      {!videoCall && (
        <Button
          onClick={() => {
            alert('Hello world');
            setVideoCall(true);
          }}
          style={{
            borderRadius: 25,
            width: 100,
            height: 60,
            backgroundColor: 'white',
            borderWidth: 1,
          }}
        >
          Start Call
        </Button>
      )}
    </div>
  );
};

export default UIKitVideo;
