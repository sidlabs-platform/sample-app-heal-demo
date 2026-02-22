const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Example of var usage that needs fixing
let port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;