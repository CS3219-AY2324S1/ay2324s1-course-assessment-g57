// Import required modules
const express = require('express');
const cors = require('cors');

const generateRTCToken = require('./controllers/token-generator');

// Do necessary setup for application
const app = express();
app.use(
  cors({
    // Update when deploy
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 204,
    methods: 'GET',
  })
);
app.options('*', cors());
// app.options('*', (req, res) => {
//   res.status(204).end(); // Respond with a 204 No Content status for OPTIONS requests
// });
console.log('ping');

// Define necessary constants
const PORT = process.env.PORT || 3500;

// Set up routes
app.get('/rtc', (req, res) => {
  res
    .status(200)
    .json({ message: `Video Service for Generating Agora RTC Tokens.` });
});
app.get('/rtc/:channel', generateRTCToken);

// Configure app to listen for requests
app.listen(PORT, () => {
  console.log(`Video Service Listening on Port ${PORT}`);
});
