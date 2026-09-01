const express = require('express');
const store = require('./store');

const router = express.Router();

let todos = store.loadTodos();
let nextId = todos.length ? Math.max(...todos.map((t) => t.id)) + 1 : 1;

router.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
});

router.get('/todos', (req, res) => {
  res.json(todos);
});

router.post('/todos', (req, res) => {
  const title = req.body && req.body.title;
  if (!title) {
    return res.status(400).json({ error: 'title is required' });
  }
  const todo = { id: nextId++, title };
  todos.push(todo);
  store.saveTodos(todos);
  res.status(201).json(todo);
});

router.delete('/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = todos.findIndex((t) => t.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'todo not found' });
  }
  todos.splice(idx, 1);
  store.saveTodos(todos);
  res.json({ ok: true });
});

module.exports = router;