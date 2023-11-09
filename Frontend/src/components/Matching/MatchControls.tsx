import React, { useState, useEffect, useContext } from 'react';
import socket from '../../lib/socket';
import { useRouter } from 'next/navigation';
import { RoomContext } from '@/contexts/RoomContext';
import { Button, Progress, Select } from '@chakra-ui/react';

const MatchControls = () => {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [difficulty, setDifficulty] = useState('easy');
    const [status, setStatus] = useState(
        'Select difficulty and click Start Match'
    );
    const [timeElapsed, setTimeElapsed] = useState('30');
    const { roomId, setRoomId } = useContext(RoomContext);
    const { push } = useRouter();
    const [disconnectDisabled, setDisconnectDisabled] = React.useState(true);
    const [connectDisabled, setConnectDisabled] = React.useState(false);

    useEffect(() => {
        const onConnect = () => {
            setIsConnected(true);
            setStatus(`Finding match with difficulty level ${difficulty}`);
            socket.emit('startMatch', difficulty);
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
            // setConnectDisabled(false);
            // setDisconnectDisabled(true);
            setStatus('No Match Found!');
        });

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        };
    }, []);

    return (
        <div className="container">
            {/* <h1>Client ID: {socket.id} </h1>
            <h1>{status + `Room ID: ${roomId}`}</h1> */}
            <div className="columns">
                <div className="column is-one-fifth">
                    {/* Select difficulty */}
                    {!isConnected && (
                        <div>
                            <h2>Select difficulty level:</h2>
                            <Select
                                id="difficulty"
                                className="select is-link"
                                onChange={(event) =>
                                    setDifficulty(event.target.value)
                                }
                            >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </Select>
                        </div>
                    )}

                    {/* Timer */}
                    {isConnected && (
                        <div>
                            <h2>{timeElapsed}</h2>
                            <Progress hasStripe value={Number(timeElapsed)} />
                        </div>
                    )}
                </div>
                <div className="column is-one-fifth">
                    {/* <ConnectionManager /> */}
                    <div>
                        <Button
                            className="button is-primary"
                            onClick={() => {
                                setDisconnectDisabled(false);
                                setConnectDisabled(true);
                                socket.connect();
                            }}
                            isDisabled={connectDisabled}
                        >
                            Connect
                        </Button>

                        <Button
                            className="button is-danger is-light"
                            onClick={() => {
                                setDisconnectDisabled(true);
                                setConnectDisabled(false);
                                socket.disconnect();
                            }}
                            isDisabled={disconnectDisabled}
                        >
                            disconnect
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MatchControls;
