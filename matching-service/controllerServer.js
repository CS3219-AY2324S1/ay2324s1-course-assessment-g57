const path = require('path');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const cors = require('cors');
const {initServer, startListening, onStartMatch, onQuestionUpdate, onDisconnect} = require('./eventHandlers');


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
    console.log(`Socket ${socket.id} connected`);

    socket.on('startMatch', (userId, difficulty) => onStartMatch(socket, userId, difficulty));

    socket.on('questionUpdate', (data) => onQuestionUpdate(io, data));

    socket.on('disconnect', () => onDisconnect(socket));
}


initServer().then(() => startListening(io));

io.on('connection', (socket) => onConnection(io, socket));


app.use(express.json());

app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, './index.html'));
});

server.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
