// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const twilio = require("twilio");
require("dotenv").config(); // Load .env variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Twilio client setup
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Route to handle contact form submissions
app.post("/send-sms", async (req, res) => {
  const { name, email, phone, message } = req.body;

  const fullMessage = `📩 New Contact Submission:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`;

  try {
    const msg = await client.messages.create({
      body: fullMessage,
      from: process.env.TWILIO_PHONE, // Twilio number
      to: process.env.MY_PHONE, // Your personal number
    });

    console.log("✅ SMS sent:", msg.sid);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Failed to send SMS:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
