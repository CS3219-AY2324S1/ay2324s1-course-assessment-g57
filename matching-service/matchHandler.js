const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

// Stores the user ID as the key and the User object as the value
const queue = new Map();

// 1000 milliseconds
const ONE_SECOND = 1000;

// Countdown from 30 seconds
const INITIAL_TIMER_COUNTDOWN = 29;

// Enum to represent difficulty level of question
const DIFFICULTY = Object.freeze({
    EASY: 'EASY',
    MEDIUM: 'MEDIUM',
    HARD: 'HARD',
});

// Maps the client's difficulty input to the corresponding enum DIFFICULTY object
function mapClientDifficultyToEnum(difficulty) {
    switch (difficulty) {
        case 'easy':
            return DIFFICULTY.EASY;

        case 'medium':
            return DIFFICULTY.MEDIUM;

        case 'hard':
            return DIFFICULTY.HARD;

        // Default to easy question if client input is invalid
        default:
            return DIFFICULTY.EASY;
    }
}

// User object used by NodeJS server
// difficulty is expected to be of type enum DIFFICULTY
// timer is expected to be a NodeJS Timeout object
function User(userId, socket, difficulty, timer) {
    this.userId = userId;
    this.socket = socket;
    this.difficulty = difficulty;
    this.timer = timer;
}

// Helper function
function printQueue(queue) {
    let result = 'Queue:';

    for (const user of queue.values()) {
        result += `\n${user.userId}: ${user.difficulty}`;
    }

    result += '\n';
    console.log(result);
}

function getUserBySocket(socket) {
    for (const user of queue.values()) {
        if (user.socket.id == socket.id) {
            return user;
        }
    }

    // User not found
    return null;
}

function canMatchUser(u1, u2) {
    return u1.difficulty == u2.difficulty;
}

function findMatch(newUser) {
    let result = null;

    for (const user of queue.values()) {
        if (canMatchUser(newUser, user)) {
            result = user;
            break;
        }
    }

    return result;
}

async function onStartMatch(io, socket, userId, difficulty) {
    // If user is already in the queue
    if (queue.has(userId)) {
        console.log(`User ${userId} already in queue`);

        // Inform client that he is already in the queue
        socket.emit('userAlreadyInQueue');

        // Close socket connection with this duplicate client
        socket.disconnect(true);
        return;
    }

    const newUser = new User(
        userId,
        socket,
        mapClientDifficultyToEnum(difficulty),
        null
    );
    console.log(
        `New match request from user ${newUser.userId} with difficulty ${newUser.difficulty}`
    );

    // Set up match timer
    let timerCountdown = INITIAL_TIMER_COUNTDOWN;
    const newTimer = setInterval(() => {
        // Update client with countdown timer value
        newUser.socket.emit('matchTimerCountdown', timerCountdown);

        // No match found within time limit
        if (timerCountdown == 0) {
            console.log(`No match found for user ${newUser.userId}`);

            // Inform client no match found within time limit
            newUser.socket.emit('noMatchTimerExpired');

            // Remove user from queue
            queue.delete(newUser.userId);
            printQueue(queue);

            // Clear timer for this user
            clearInterval(newTimer);

            // Close socket connection with client
            newUser.socket.disconnect(true);
        }

        timerCountdown--;
    }, ONE_SECOND);

    newUser.timer = newTimer;

    // Check if the new user can be matched
    const partner = findMatch(newUser);

    if (partner) {
        // Delete partner from queue
        queue.delete(partner.userId);

        // Create new room
        const roomId = uuidv4();

        newUser.socket.join(roomId);
        partner.socket.join(roomId);

        message = `Paired ${newUser.userId} and ${partner.userId} in room ${roomId}`;
        console.log(message);

        const response = await axios.get(
            'https://34k0nfj43f.execute-api.ap-southeast-1.amazonaws.com/dev/questions/complexity/' +
                difficulty
        );
        const qn = await response.data;
        console.log('Room Found:' + qn.title);
        io.to(roomId).emit('matchFound', message, roomId, qn.title);

        // Clear timers
        clearInterval(newUser.timer);
        clearInterval(partner.timer);

        // Else no match found yet
    } else {
        console.log(
            `Partner not found! Adding new user ${newUser.userId} to queue`
        );

        // Add new User object to queue
        queue.set(newUser.userId, newUser);
    }

    printQueue(queue);
}

function onDisconnect(socket) {
    console.log(`Socket ${socket.id} disconnected`);

    const user = getUserBySocket(socket);

    // If user is present in queue
    if (user) {
        // Delete user from queue
        queue.delete(user.userId);

        console.log(`Deleted user ${user.userId} from queue`);
        printQueue(queue);

        // Clear timer
        clearInterval(user.timer);
    }
}

module.exports = { onStartMatch, onDisconnect };
