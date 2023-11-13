const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const amqp = require('amqplib');
const {AMQP_SERVER_URL, MATCH_REQUEST_QUEUE, MATCH_RESULT_QUEUE,
        MATCH_CANCEL_QUEUE, printQueue, mapClientDifficultyToEnum} = require('./helper');


// Global variable for amqplib
let channel;

// Stores the user ID as the key and the User object as the value
const queue = new Map();

// 1000 milliseconds
const ONE_SECOND = 1000;

// Countdown from 30 seconds
const INITIAL_TIMER_COUNTDOWN = 29;

// Hosted database URL for question service
QUESTIONS_DB_URL = 'https://34k0nfj43f.execute-api.ap-southeast-1.amazonaws.com/dev/questions/complexity/';



// User object used by controller server
// difficulty is expected to be of type enum DIFFICULTY
// timer is expected to be a NodeJS Timeout object
function User(userId, socket, difficulty, timer) {
    this.userId = userId;
    this.socket = socket;
    this.difficulty = difficulty;
    this.timer = timer;
}


function getUserBySocket(socket) {
    for (const user of queue.values()) {
        if (user.socket.id == socket.id) {
            return user
        }
    }

    // User not found
    return null
}


async function initServer() {
    try {
        const connection = await amqp.connect(AMQP_SERVER_URL);

        channel = await connection.createChannel();
        console.log(`Connected to ${AMQP_SERVER_URL}`)

        channel.assertQueue(MATCH_REQUEST_QUEUE, { durable: false });
        console.log(`${MATCH_REQUEST_QUEUE} created`)

        channel.assertQueue(MATCH_RESULT_QUEUE, { durable: false });
        console.log(`${MATCH_RESULT_QUEUE} created`)

        channel.assertQueue(MATCH_CANCEL_QUEUE, { durable: false });
        console.log(`${MATCH_CANCEL_QUEUE} created`)

    } catch (error) {
        console.log("Error initializing match queues")
        throw error;
    }
}


function startListening(io) {

    // Listen to match result queue
    channel.consume(MATCH_RESULT_QUEUE, async (amqpMessage) => {
        console.log('Match result received')
        const byteMessage = amqpMessage.content;
        const message = JSON.parse(byteMessage.toString());

        await processMatchResult(io, message);

        channel.ack(amqpMessage);
        console.log(`Ack sent to ${MATCH_RESULT_QUEUE}\n`);

    }, {
        // Manual acknowledgement mode
        noAck: false
    });
}


// message is an object
async function processMatchResult(io, message) {

    const u1 = queue.get(message.userId1)
    const u2 = queue.get(message.userId2)

    // In the event either u1 and u2 have already been removed from the queue
    // Abort the match success process and remove the other user from the queue
    if (u1 == null && u2 == null) {
        return

    } else if (u1 == null) {
        queue.delete(u2.userId)
        return

    } else if (u2 == null) {
        queue.delete(u1.userId)
        return
    }

    // Clear timers
    clearInterval(u1.timer)
    clearInterval(u2.timer)


    // Create new room for sockets
    const roomId = uuidv4()

    matchSuccessMessage = `Paired ${u1.userId} and ${u2.userId} in room ${roomId}`;
    console.log(matchSuccessMessage);

    u1.socket.join(roomId)
    u2.socket.join(roomId)


    // Get question for the new room
    const response = await axios.get(QUESTIONS_DB_URL + u1.difficulty.toLowerCase());
    const qn = await response.data;
    console.log('Room Found:' + qn.title);
    io.to(roomId).emit('matchFound', matchSuccessMessage, roomId, qn.title);

    // io.to(roomId).emit('matchFound', matchSuccessMessage)


    queue.delete(u1.userId)
    queue.delete(u2.userId)

    printQueue(queue)
}


function cancelMatchRequest(userId) {

    // Send match cancel request to match cancel queue
    const message = { userId: userId };
    const byteMessage = Buffer.from(JSON.stringify(message));

    channel.sendToQueue(MATCH_CANCEL_QUEUE, byteMessage);
    console.log(`Sent to ${MATCH_CANCEL_QUEUE}:`)
    console.log(message)
}


function onStartMatch(socket, userId, difficulty) {

    // If user is already in the queue
    if (queue.has(userId)) {
        console.log(`User ${userId} already in queue`)

        // Inform client that he is already in the queue
        socket.emit('userAlreadyInQueue')

        // Close socket connection with this duplicate client
        socket.disconnect(true)
        return
    }


    // Send match request to match request queue
    const message = { userId: userId, difficulty: difficulty };
    const byteMessage = Buffer.from(JSON.stringify(message));

    channel.sendToQueue(MATCH_REQUEST_QUEUE, byteMessage);
    console.log(`Sent to ${MATCH_REQUEST_QUEUE}:`)
    console.log(message)


    // Add new User object to queue while waiting for response from matching server
    const newUser = new User(userId, socket, mapClientDifficultyToEnum(difficulty), null);
    queue.set(newUser.userId, newUser)

    printQueue(queue)


    // Set up match timer
    let timerCountdown = INITIAL_TIMER_COUNTDOWN
    const newTimer = setInterval(() => {

        // Update client with countdown timer value
        newUser.socket.emit('matchTimerCountdown', timerCountdown)

        // No match found within time limit
        if (timerCountdown == 0) {
            console.log(`No match found for user ${newUser.userId}`);

            // Inform client no match found within time limit
            newUser.socket.emit('noMatchTimerExpired')

            // Inform server to cancel match request
            cancelMatchRequest(newUser.userId)

            // Remove user from queue
            queue.delete(newUser.userId)
            printQueue(queue)

            clearInterval(newTimer)

            // Close socket connection with client
            newUser.socket.disconnect(true)
        }

        timerCountdown--
    }, ONE_SECOND);

    newUser.timer = newTimer
}


async function onQuestionUpdate(io, data) {
    const response = await axios.get(QUESTIONS_DB_URL + data.difficulty);
    const qn = await response.data;

    console.log('Updating Question: ' + qn.title);

    io.to(data.roomId).emit('questionUpdate', {
        roomId: data.roomId,
        qnTitle: qn.title,
    });
}


function onDisconnect(socket) {
    console.log(`Socket ${socket.id} disconnected`);

    const user = getUserBySocket(socket)

    // If user is present in queue
    if (user) {
        // Inform server to cancel any oustanding match request from this user
        cancelMatchRequest(user.userId)

        // Delete user from queue
        queue.delete(user.userId)

        // Clear timer
        clearInterval(user.timer)

        printQueue(queue)
    }
}


module.exports = {initServer, startListening, onStartMatch, onQuestionUpdate, onDisconnect};
