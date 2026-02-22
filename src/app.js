const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

function startServer() {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

startServer();

let someVariable = 'This is a variable';
console.log(someVariable);

let anotherVariable = 'Another variable';
console.log(anotherVariable);

module.exports = app;