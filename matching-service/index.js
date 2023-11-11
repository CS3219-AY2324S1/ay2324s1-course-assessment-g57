const path = require('path');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const cors = require('cors');
const {onStartMatch, onDisconnect} = require('./matchHandler');
const axios = require('axios');

const hostname = '127.0.0.1';
const port = 4000;

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
    connectionStateRecovery: {},
    cors: {
        origin: 'http://localhost:3000',
    },
});


// Registers the event handlers for socket connections
function onConnection(io, socket) {
    console.log(`User ${socket.id} connected`);

    socket.on(
        'startMatch',
        async (userId, difficulty) => await onStartMatch(io, socket, userId, difficulty)
    );

    socket.on('disconnect', () => onDisconnect(socket));

    socket.on('questionUpdate', async (data) => {
        const response = await axios.get(
            'https://34k0nfj43f.execute-api.ap-southeast-1.amazonaws.com/dev/questions/complexity/' +
                data.difficulty
        );
        const qn = await response.data;

        console.log('Updating Question: ' + qn.title);

        io.to(data.roomId).emit('questionUpdate', {
            roomId: data.roomId,
            qnTitle: qn.title,
        });
    });
}

app.use(express.json());

app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, './index.html'));
});

io.on('connection', (socket) => onConnection(io, socket));

server.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
