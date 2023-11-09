import React from 'react';
import socket from '@/lib/socket';

const ConnectionManager = () => {
    function connect() {
        socket.connect();
    }

    function disconnect() {
        socket.disconnect();
    }

    return (
        <div>
            <button onClick={connect} className="button">
                Connect
            </button>
            <button onClick={disconnect} className="button">
                Disconnect
            </button>
        </div>
    );
};

export default ConnectionManager;
