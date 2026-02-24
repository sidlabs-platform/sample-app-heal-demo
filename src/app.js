const express = require('express');
var app = express();

// In-memory task store
let tasks = [];
let nextId = 1;

const resetTasks = () => {
  tasks = [];
  nextId = 1;
};

// Middleware
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Create a task
app.post('/tasks', (req, res) => {
  const { title } = req.body;
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }
  const task = { id: nextId++, title, completed: false };
  tasks.push(task);
  res.status(201).json(task);
});

// List all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// Get a task by ID
app.get('/tasks/:id', (req, res) => {
  const task = tasks.find((t) => t.id === parseInt(req.params.id, 10));
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
  const index = tasks.findIndex((t) => t.id === parseInt(req.params.id, 10));
  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  tasks.splice(index, 1);
  res.status(204).send();
});

module.exports = { app, resetTasks };
