import React, { useState, useEffect, useContext, useCallback } from 'react';
import socket from '../../lib/socket';
import { useRouter } from 'next/navigation';
import { RoomContext } from '@/contexts/RoomContext';
import { Button, Progress, Select } from '@chakra-ui/react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type MatchControlsProps = {
    userId: string;
};

const MatchControls = ({ userId }: MatchControlsProps) => {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [difficulty, setDifficulty] = useState('easy');
    const [timeElapsed, setTimeElapsed] = useState('30');
    const [status, setStatus] = useState('');
    const { setRoomId } = useContext(RoomContext);
    const { push } = useRouter();
    const [disconnectDisabled, setDisconnectDisabled] = React.useState(true);
    const [connectDisabled, setConnectDisabled] = React.useState(false);
    const css = `
    .column {
        display: flex;
    }`;
    const onConnect = useCallback(() => {
        setIsConnected(true);
        setStatus('Finding Match...');
        toast.dismiss();
        socket.emit('startMatch', userId, difficulty);
    }, [difficulty, setIsConnected, userId]);

    const onDisconnect = useCallback(() => {
        setIsConnected(false);
        setRoomId('');
        setTimeElapsed('30');
        console.log('disconnected');
        toast.dismiss('startMatch');
        toast.warn("You have been disconnected", {
            toastId: 'noMatch',
            position: 'top-right',
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
        });
        setConnectDisabled(false);
        setDisconnectDisabled(true);
    }, [setIsConnected, setRoomId, setTimeElapsed]);

    useEffect(() => {
        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        socket.on(
            'matchFound',
            (msg: string, room: string, qnTitle: string) => {
                setTimeElapsed('30');
                setRoomId(room);
                toast.dismiss();
                push(
                    `/code?room=${room}&qnTitle=${qnTitle}&difficulty=${difficulty}`
                );
            }
        );

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        };
    }, [onConnect, onDisconnect, difficulty, push, setRoomId, setTimeElapsed]);

    const alertNoMatch = useCallback(() => {
        toast.warn("Couldn't find a match. Please try again.", {
            toastId: 'noMatch',
            position: 'top-right',
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
        });
    }, []);

    useEffect(() => {
        socket.on('matchTimerCountdown', (timerCountdown: string) => {
            setTimeElapsed(timerCountdown);
        });

        socket.on('noMatchTimerExpired', () => {
            setConnectDisabled(false);
            setDisconnectDisabled(true);
            setTimeElapsed('30');
            console.log("Couldn't find a match. Please try again.");
            alertNoMatch();
        });

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        };
    }, [onConnect, onDisconnect]);

    return (
        <>
            <style>{css}</style>
            {/* Same as */}
            <div className="container">
                <div className="columns">
                    <div className="column is-one-quarter">
                        <div className="container">
                            {/* Select difficulty */}
                            {!isConnected && (
                                <div style={{ width: '100%' }}>
                                    <p>Select difficulty level:</p>
                                    <Select
                                        id="difficulty"
                                        className="select is-link"
                                        value={difficulty}
                                        onChange={(event) => {
                                            setDifficulty(event.target.value);
                                        }}
                                    >
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </Select>
                                </div>
                            )}
                            {/* Timer */}
                            {isConnected && (
                                <div style={{ width: '100%' }}>
                                    <div>{status}</div>
                                    <h2>Time left: {timeElapsed}s...</h2>
                                    <Progress
                                        hasStripe
                                        value={Number(timeElapsed)}
                                        max={30}
                                        min={0}
                                        width={'100%'}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="column">
                        <div className="columns is-gapless">
                            <div className="column is-half">
                                <div>
                                    <Button
                                        className="button is-primary mt-5"
                                        onClick={() => {
                                            setDisconnectDisabled(false);
                                            setConnectDisabled(true);
                                            socket.connect();
                                        }}
                                        isDisabled={connectDisabled}
                                        height={'2rem'}
                                        width={'100%'}
                                    >
                                        &nbsp;Connect&nbsp;
                                    </Button>
                                </div>
                            </div>
                            <div className="column is-half">
                                <Button
                                    className="button is-danger is-light mt-5"
                                    onClick={() => {
                                        setDisconnectDisabled(true);
                                        setConnectDisabled(false);
                                        socket.disconnect();
                                    }}
                                    isDisabled={disconnectDisabled}
                                    height={'2rem'}
                                    width={'100%'}
                                >
                                    Disconnect
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MatchControls;
