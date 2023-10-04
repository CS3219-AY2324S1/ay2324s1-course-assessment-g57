// Import required modules
const express = require("express");
const { RtcTokenBuilder, RtcRole } = require("agora-access-token");
const dotenv = require("dotenv");
const cors = require("cors");

// Do necessary setup for application
dotenv.config();
const app = express();
app.use(cors({
    // Update when deploy
    origin: "http://localhost:3000"
}));
app.options("*", cors());

// Define necessary constants
const PORT = process.env.PORT || 3500;
const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;
