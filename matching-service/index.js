const path = require('path');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const cors = require('cors');
const onStartMatch = require('./matchHandler');

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

    socket.on('startMatch', (difficulty) =>
        onStartMatch(io, socket, difficulty)
    );

    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected`);
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
