import React, { useState, useEffect, useContext } from 'react';
import socket from '../../lib/socket';
import { useRouter } from 'next/navigation';
import { RoomContext } from '@/contexts/RoomContext';
import { Button, Progress, Select } from '@chakra-ui/react';

type MatchControlsProps = {
    userId: string;
};

const MatchControls = ({ userId }: MatchControlsProps) => {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [difficulty, setDifficulty] = useState('easy');
    const [status, setStatus] = useState('');
    const [timeElapsed, setTimeElapsed] = useState('30');
    const { setRoomId } = useContext(RoomContext);
    const { push } = useRouter();
    const [disconnectDisabled, setDisconnectDisabled] = React.useState(true);
    const [connectDisabled, setConnectDisabled] = React.useState(false);
    const css = `
    .column {
        display: flex;
    }`;
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
            // setConnectDisabled(false);
            // setDisconnectDisabled(true);
            setTimeElapsed('30');
            setStatus('No Match Found!');
        });

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        };
    }, []);

    return (
        <>
            <style>{css}</style>

            <div className="container">
                <h1>{status}</h1>
                <br />
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
                        </div>
                    </div>

                    {/* Timer */}
                    {isConnected && (
                        <div className="column is-one-quarter">
                            <div style={{ width: '100%' }}>
                                <h2>Time left: {timeElapsed}s...</h2>
                                <Progress
                                    hasStripe
                                    value={Number(timeElapsed)}
                                    max={30}
                                    min={0}
                                    width={'100%'}
                                />
                            </div>
                        </div>
                    )}

                    <div className="column">
                        {/* <ConnectionManager /> */}
                        <div className="columns is-gapless">
                            <div className="column is-half">
                                <div>
                                    <Button
                                        className="button is-primary"
                                        onClick={() => {
                                            setDisconnectDisabled(false);
                                            setConnectDisabled(true);
                                            socket.connect();
                                        }}
                                        isDisabled={connectDisabled}
                                        height={'100%'}
                                        width={'100%'}
                                    >
                                        &nbsp;Connect&nbsp;
                                    </Button>
                                </div>
                            </div>
                            <div className="column is-half">
                                <Button
                                    className="button is-danger is-light"
                                    onClick={() => {
                                        setDisconnectDisabled(true);
                                        setConnectDisabled(false);
                                        socket.disconnect();
                                    }}
                                    isDisabled={disconnectDisabled}
                                    height={'100%'}
                                    width={'100%'}
                                >
                                    Disconnect
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <div className='columns'>
                    <div className='column is-one-quarter'>
                        
                    </div>
                </div> */}
            </div>
        </>
    );
};

export default MatchControls;
