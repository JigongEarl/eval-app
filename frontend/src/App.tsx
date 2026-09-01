import { useState, useEffect } from 'react';

interface Todo {
  id: number;
  title: string;
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [health, setHealth] = useState('');

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((d) => setHealth(JSON.stringify(d)))
      .catch((e) => setHealth('err: ' + e.message));
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    fetch('/api/todos')
      .then((r) => r.json())
      .then((d) => setTodos(d));
  };

  const addTodo = () => {
    if (!title.trim()) return;
    fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.trim() })
    })
      .then((r) => r.json())
      .then(() => {
        setTitle('');
        fetchTodos();
      });
  };

  const deleteTodo = (id: number) => {
    fetch(`/api/todos/${id}`, { method: 'DELETE' }).then(() => fetchTodos());
  };

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Todo List</h1>
      <p className="text-sm text-gray-500 mb-4">/api/health: {health || 'loading...'}</p>
      <div className="flex gap-2 mb-6">
        <input
          className="flex-1 border border-gray-300 rounded px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a todo..."
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={addTodo}
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex justify-between items-center border border-gray-200 rounded px-3 py-2"
          >
            <span>{todo.title}</span>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => deleteTodo(todo.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}