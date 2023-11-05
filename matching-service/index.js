const path = require('path');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const cors = require('cors');
const onStartMatch = require('./matchHandler');
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

    socket.on('startMatch', async (difficulty) =>
        await onStartMatch(io, socket, difficulty)
    );

    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected`);
    });

    socket.on('questionUpdate', async (data) => {
        const qn = await axios.get('https://34k0nfj43f.execute-api.ap-southeast-1.amazonaws.com/dev/questions/complexity/' + data.difficulty);
        // const newQn = qn.data.filter(s => s.complexity === data.difficulty);    
        // const maxSz = newQn.length;
        // const idx = Math.floor(Math.random() * maxSz);
    
        // console.log(data.difficulty);
        // console.log(newQn);
        // console.log(idx);
        // console.log(newQn[idx]._id);
        // console.log(data.roomId);

        io.to(data.roomId).emit('questionUpdate', { roomId: data.roomId, qnId: qn._id} );
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
