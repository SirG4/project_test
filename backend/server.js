// backend/server.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

console.log('Starting server...'); // Add this line
console.log('NODE_ENV:', process.env.NODE_ENV); // Add this line

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Server failed to start:', err); // Add error handler
});

app.get('/api/healthcheck', (req, res) => {
  res.json({ status: 'ok' });
});

