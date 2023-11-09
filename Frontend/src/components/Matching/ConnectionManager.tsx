import React from 'react';
import socket from '@/lib/socket';
import { Button } from '@chakra-ui/react';

const ConnectionManager = () => {
    const [disconnectDisabled, setDisconnectDisabled] = React.useState(true);
    const [connectDisabled, setConnectDisabled] = React.useState(false);

    return (
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
    );
};

export default ConnectionManager;
