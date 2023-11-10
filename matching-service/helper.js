
AMQP_SERVER_URL = 'amqp://localhost';
MATCH_REQUEST_QUEUE = 'match-request-queue';
MATCH_RESULT_QUEUE = 'match-result-queue';
MATCH_CANCEL_QUEUE = 'match-cancel-queue';


// Helper function
function printQueue(queue) {
    let result = 'Queue:';

    for (const user of queue.values()) {
      result += `\n${user.userId}: ${user.difficulty}`;
    }

    result += '\n';
    console.log(result);
}


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


module.exports = {AMQP_SERVER_URL, MATCH_REQUEST_QUEUE, MATCH_RESULT_QUEUE,
        MATCH_CANCEL_QUEUE, printQueue, mapClientDifficultyToEnum}
