const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Example of a route
app.get('/example', (req, res) => {
  const exampleVar = 'This is an example';
  res.json({ message: exampleVar });
});

// Another example
app.post('/data', (req, res) => {
  const data = req.body;
  if (!data) {
    return res.status(400).json({ error: 'No data provided' });
  }
  res.status(201).json({ data });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});