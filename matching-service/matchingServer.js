const amqp = require('amqplib');
const { AMQP_SERVER_URL, MATCH_REQUEST_QUEUE, MATCH_RESULT_QUEUE,
    MATCH_CANCEL_QUEUE, printQueue, mapClientDifficultyToEnum } = require('./helper');


// Global variable for amqplib
let channel;

// Stores the user ID as the key and the UserInQueue object as the value
const queue = new Map();



// UserInQueue object used by matching server
// difficulty is expected to be of type enum DIFFICULTY
function UserInQueue(userId, difficulty) {
    this.userId = userId;
    this.difficulty = difficulty;
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


function startListening() {

    // Listen to match request queue
    channel.consume(MATCH_REQUEST_QUEUE, (amqpMessage) => {
        console.log('Match request received')
        const byteMessage = amqpMessage.content;
        const message = JSON.parse(byteMessage.toString());

        processMatchRequest(message);

        channel.ack(amqpMessage);
        console.log(`Ack sent to ${MATCH_REQUEST_QUEUE}\n`);

    }, {
        // Manual acknowledgement mode
        noAck: false
    });


    // Listen to match cancel queue
    channel.consume(MATCH_CANCEL_QUEUE, (amqpMessage) => {
        console.log('Match cancel received')
        const byteMessage = amqpMessage.content;
        const message = JSON.parse(byteMessage.toString());

        processMatchCancel(message);

        channel.ack(amqpMessage);
        console.log(`Ack sent to ${MATCH_CANCEL_QUEUE}\n`);

    }, {
        // Manual acknowledgement mode
        noAck: false
    });
}


// message is an object
function processMatchCancel(message) {
    console.log(message)

    queue.delete(message.userId)
    console.log(`Deleted user ${message.userId} from queue`)

    printQueue(queue)
}


// message is an object
function processMatchRequest(message) {
    console.log(message);

    const newUser = new UserInQueue(message.userId, mapClientDifficultyToEnum(message.difficulty));

    console.log(newUser);
    printQueue(queue)


    // Check if the new user can be matched
    partner = findMatch(newUser)

    if (partner) {

        queue.delete(partner.userId)

        console.log(`Paired ${newUser.userId} and ${partner.userId}`)

        // Send reply back
        const responseMessage = { userId1: newUser.userId, userId2: partner.userId };
        const byteResponseMessage = Buffer.from(JSON.stringify(responseMessage));

        channel.sendToQueue(MATCH_RESULT_QUEUE, byteResponseMessage);
        console.log(`Sent to ${MATCH_RESULT_QUEUE}:`)
        console.log(responseMessage)


        // Else no match found yet
    } else {
        console.log(`Partner not found! Adding new user ${newUser.userId} to queue`)

        // Add new UserInQueue object to queue
        queue.set(newUser.userId, newUser)
    }

    printQueue(queue)
}


initServer().then(startListening)
