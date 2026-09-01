const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = process.env.TODOS_FILE || path.join(DATA_DIR, 'todos.json');

function loadTodos() {
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }
  try {
    const raw = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    if (Array.isArray(raw)) {
      return raw;
    }
    if (raw && Array.isArray(raw.todos)) {
      return raw.todos;
    }
    return [];
  } catch (e) {
    return [];
  }
}

function saveTodos(todos) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
}

module.exports = { loadTodos, saveTodos, DATA_FILE };