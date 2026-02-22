const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

function exampleFunction() {
  let message = 'This is a message';
  console.log(message);

  let count = 0;
  count++;
  console.log(count);
}

exampleFunction();

module.exports = app;