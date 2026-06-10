const express = require('express');

const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN || "qwerty";

app.get('/', (req, res) => {
  res.status(200).send('Server is running');
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const challenge = req.query['hub.challenge'];
  const token = req.query['hub.verify_token'];

  console.log('--- Verification Request ---');
  console.log('Received token:', token);
  console.log('Expected token:', verifyToken);

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('WEBHOOK VERIFIED');
    return res.status(200).send(String(challenge));
  }

  console.log('VERIFICATION FAILED');
  return res.sendStatus(403);
});

app.post('/webhook', (req, res) => {
  console.log('Webhook event received:', JSON.stringify(req.body, null, 2));
  res.status(200).send('EVENT_RECEIVED');
});

app.listen(port, '0.0.0.0', () => {
  console.log('Server listening on port ' + port);
  console.log('Verify token: ' + verifyToken);
});
