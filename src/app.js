const express = require('express');
const app = express();

app.use(express.json());

let tasks = [];
let nextId = 1;

const resetTasks = () => {
  tasks = [];
  nextId = 1;
};

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// List tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// Create task
app.post('/tasks', (req, res) => {
  var { title } = req.body;
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ error: 'Title is required' });
  }
  var task = { id: nextId++, title: title.trim(), completed: false };
  tasks.push(task);
  res.status(200).json(task);
});

// Get task by ID
app.get('/tasks/:id', (req, res) => {
  const task = tasks.find((t) => t.id === parseInt(req.params.id, 10));
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
});

// Update task
app.put('/tasks/:id', (req, res) => {
  const task = tasks.find((t) => t.id === parseInt(req.params.id, 10));
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  if (req.body.title !== undefined) {
    task.title = req.body.title;
  }
  if (req.body.completed !== undefined) {
    task.completed = req.body.completed;
  }
  res.json(task);
});

// Delete task
app.delete('/tasks/:id', (req, res) => {
  const index = tasks.findIndex((t) => t.id === parseInt(req.params.id, 10));
  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  tasks.splice(index, 1);
  res.status(204).send();
});

module.exports = { app, resetTasks };
