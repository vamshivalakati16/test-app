// Import Express.js
const express = require('express');

// Create an Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Set port and verify_token
const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN || "qwerty";

// Route for GET requests (webhook verification)
app.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('WEBHOOK VERIFIED');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Route for POST requests (webhook events)
app.post('/', (req, res) => {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  console.log(\n\nWebhook received ${timestamp}\n);
  console.log(JSON.stringify(req.body, null, 2));
  res.status(200).end();
});

// Health check route (useful for Render)
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Start the server — bind to 0.0.0.0 so Render can route traffic to it
app.listen(port, '0.0.0.0', () => {
  console.log(\nListening on port ${port}\n);
});
