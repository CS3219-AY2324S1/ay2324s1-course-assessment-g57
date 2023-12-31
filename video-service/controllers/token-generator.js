// Import necessary modules
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
const dotenv = require('dotenv');

// Do necessary setup
dotenv.config();

// Define necessary constants
const { APP_ID } = process.env;
const { APP_CERTIFICATE } = process.env;

const generateRTCToken = (req, res) => {
    // Define necessary constants
    const uid = 0;
    const role = RtcRole.SUBSCRIBER;
    const { channel } = req.params;
    if (!channel) {
        return res.status(500).json({ error: 'channel is required parameter' });
    }

    // Setup the expiry time for the token
    let expireTime = req.query.expiry;

    if (!expireTime || expireTime === '') {
        expireTime = 3600;
    } else {
        expireTime = parseInt(expireTime, 10);
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expireTime;

    const token = RtcTokenBuilder.buildTokenWithUid(
        APP_ID,
        APP_CERTIFICATE,
        channel,
        uid,
        role,
        privilegeExpireTime
    );
    console.log('Token generated: ', token);

    return res.json({ rtcToken: token });
};

module.exports = generateRTCToken;
