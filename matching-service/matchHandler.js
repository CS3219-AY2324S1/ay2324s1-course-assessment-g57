const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

// Stores the user socket ID as the key and the User object as the value
const queue = new Map();

// Store the room IDs in a set
const roomIds = new Set();

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

// Helper function for debugging
function printQueue(queue) {
  let result = 'Queue:';

  for (const user of queue.values()) {
    result += `\n${user.socket.id}: ${user.difficulty}`;
  }

  result += '\n';
  console.log(result);
}

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
function User(difficulty, socket, timer) {
  this.difficulty = difficulty;
  this.socket = socket;
  this.timer = timer;
}

function canMatchUser(u1, u2) {
  return u1.difficulty == u2.difficulty;
}

function findMatch(newUser) {
  let result = null;

  for (const user of queue.values()) {
    if (canMatchUser(newUser, user)) {
      result = user;
    }
    break;
  }

  return result;
}

async function onStartMatch(io, socket, difficulty) {
  const newUser = new User(mapClientDifficultyToEnum(difficulty), socket, null);

  // Set up match timer
  let timerCountdown = INITIAL_TIMER_COUNTDOWN;
  const newTimer = setInterval(() => {
    // Update client with countdown timer value
    newUser.socket.emit('matchTimerCountdown', timerCountdown);

    // No match found within time limit
    if (timerCountdown == 0) {
      // Inform client no match found within time limit
      newUser.socket.emit('noMatchTimerExpired');

      // Close socket connection with client
      newUser.socket.disconnect(true);

      // Remove user from queue
      queue.delete(newUser.socket.id);

      // Clear timer for this user
      clearInterval(newTimer);

      console.log(`No match found for user ${newUser.socket.id}`);
      printQueue(queue);
    }

    timerCountdown--;
  }, ONE_SECOND);

  newUser.timer = newTimer;

  // Check if the new user can be matched
  const partner = findMatch(newUser);

  if (partner) {
    console.log(`Partner found: ${partner.socket.id}`);

    queue.delete(partner.socket.id);

    // Create new room
    const roomId = uuidv4();
    roomIds.add(roomId);

    newUser.socket.join(roomId);
    partner.socket.join(roomId);

    message = `Paired ${newUser.socket.id} and ${partner.socket.id}`;

    const qn = await axios.get('http://localhost:3002/questions');
    const newQn = qn.data.filter(s => s.complexity === difficulty);    
    const maxSz = newQn.length;
    const idx = Math.floor(Math.random() * maxSz);

    console.log(difficulty);
    console.log(newQn);
    console.log(idx);
    console.log(newQn[idx]._id);
    
    io.to(roomId).emit('matchFound', message, roomId, newQn[idx]._id);

    console.log(message);

    // Clear timers
    clearInterval(newUser.timer);
    clearInterval(partner.timer);

    // Else no match found yet
  } else {
    console.log(
      `Partner not found! Adding new user ${newUser.socket.id} to queue`
    );

    // Add new user object to queue
    queue.set(newUser.socket.id, newUser);
  }

  printQueue(queue);
}

module.exports = onStartMatch;
