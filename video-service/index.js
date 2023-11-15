// Import required modules
const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');

const generateRTCToken = require('./controllers/token-generator');

// Do necessary setup for application
const app = express();
app.use(
    cors({
        // Update when deploy
        origin: [
            'https://master.cs3219-peerprep-g57.com',
            'http://localhost:3000',
            'http://localhost:8080',
        ],
    })
);
app.options('*', cors());

// Define necessary constants
const PORT = process.env.PORT || 3500;

// Set up routes
app.get('/rtc', (req, res) => {
    res.status(200).json({
        message: `Video Service for Generating Agora RTC Tokens.`,
    });
});
app.get('/rtc/:channel', generateRTCToken);

// Configure app to listen for requests
if (process.env.ENV == 'DEV') {
    app.listen(PORT, () => {
        console.log(`Video Service Listening on Port ${PORT}`);
    });
} else {
    module.exports.handler = serverless(app);
}
