import React, { useState, useEffect, useContext } from 'react';
import socket from '../../lib/socket';
import ConnectionManager from './ConnectionManager';
import { useRouter } from 'next/navigation';
import { RoomContext } from '@/contexts/RoomContext';

type MatchControlsProps = {
    userId: string;
};

const MatchControls = ({ userId }: MatchControlsProps) => {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [difficulty, setDifficulty] = useState('easy');
    const [status, setStatus] = useState(
        'Select difficulty and click Start Match'
    );
    const [timeElapsed, setTimeElapsed] = useState('30');
    const { roomId, setRoomId } = useContext(RoomContext);
    const { push } = useRouter();

    useEffect(() => {
        const onConnect = () => {
            setIsConnected(true);
            setStatus(`Finding match with difficulty level ${difficulty}`);
            socket.emit('startMatch', userId, difficulty);
        };

        const onDisconnect = () => {
            setIsConnected(false);
            setRoomId('');
            console.log('disconnected');
        };

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        socket.on(
            'matchFound',
            (msg: string, room: string, qnTitle: string) => {
                setTimeElapsed('30');
                setRoomId(room);
                setStatus(msg);
                push(
                    `/code?room=${room}&qnTitle=${qnTitle}&difficulty=${difficulty}`
                );
            }
        );

        socket.on('matchTimerCountdown', (timerCountdown: string) => {
            setTimeElapsed(timerCountdown);
        });

        socket.on('noMatchTimerExpired', () => {
            setStatus('No Match Found!');
        });

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        };
    }, []);

    return (
        <div className="container">
            <h1>Client ID: {socket.id} </h1>
            <h1>{status + `Room ID: ${roomId}`}</h1>
            <h2>Select difficulty level:</h2>
            {!isConnected && (
                <div>
                    <select
                        id="difficulty"
                        className="select is-link is-normal"
                        onChange={(event) => setDifficulty(event.target.value)}
                    >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>
            )}

            {isConnected && (
                <div>
                    <h2>{timeElapsed}</h2>
                </div>
            )}

            <ConnectionManager />
        </div>
    );
};

export default MatchControls;
