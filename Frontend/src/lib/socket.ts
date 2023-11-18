import { io } from 'socket.io-client';

const URL =
    process.env.NEXT_PUBLIC_ENV === 'PROD'
        ? process.env.NEXT_PUBLIC_MATCHING_SERVICE_URL_PROD
        : process.env.NEXT_PUBLIC_MATCHING_SERVICE_URL_DEV;

const socket = io(URL as string, {
    autoConnect: false,
});

export default socket;
