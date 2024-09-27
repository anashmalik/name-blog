require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
const port = 3000;

// Twilio Credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

app.use(bodyParser.json());

// Endpoint to send OTP
app.get('/send', (req, res) => {
    const mobile ="+917895036695";

    // Generate a random OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Send the OTP using Twilio
    client.messages
        .create({
            body: `Your OTP is ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio number
            to: mobile
        })
        .then(message => {
            res.json({ message: 'OTP sent successfully', otp: otp });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: 'Failed to send OTP' });
        });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
