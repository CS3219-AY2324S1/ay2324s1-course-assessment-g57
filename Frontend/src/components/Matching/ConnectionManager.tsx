import React from 'react';
import { socket } from '@/lib/socket';
import { Button } from '@chakra-ui/react';

const ConnectionManager = () => {
    function connect() {
        socket.connect();
    }

    function disconnect() {
        socket.disconnect();
    }

  return (
    <div>
        <Button onClick={connect}>Connect</Button>
        <Button onClick={disconnect}>Disconnect</Button>
    </div>
  )
}

export default ConnectionManager
