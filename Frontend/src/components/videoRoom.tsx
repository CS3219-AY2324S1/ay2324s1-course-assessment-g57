import React, { useEffect, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import axios from 'axios';

import videoPlayer from './video/videoPlayer';

const client = AgoraRTC.createClient({
    mode: "rtc",
    codec: "vp8"
});

const videoRoom = () => {
    const [users, setUsers] = useState([]);

    
  return (
    <div>videoRoom</div>
  )
}

export default videoRoom