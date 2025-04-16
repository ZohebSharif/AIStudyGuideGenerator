const express = require('express');
const cors = require('cors');
const WriteDatabase = require('./WriteDatabase'); // ✅ Adjust path if needed

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Root Route
app.get('/', (req, res) => {
    res.send('Welcome to the Study Guide API!');
  });  

// /generate Route to process requests
app.post('/generate', async (req, res) => {
  const { topic } = req.body;
  if (!topic) {
    return res.status(400).json({ error: 'Missing topic' });
  }

  try {
    await WriteDatabase(topic);
    res.status(200).json({ message: 'Study guide generated and saved.' });
  } catch (err) {

    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
