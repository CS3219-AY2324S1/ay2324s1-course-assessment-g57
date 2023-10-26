import { io } from 'socket.io-client';

const URL = process.env.MATCHING_SERVICE_URL || 'http://127.0.0.1:4000';

const socket = io(URL, {
    autoConnect: false,
});

export default socket;
