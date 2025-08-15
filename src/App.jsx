import { useEffect, useState, useMemo } from "react";
import { API_URL } from "./api";
import TaskForm from "./components/TaskForm";
import TodoList from "./components/TodoList";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [filter, setFilter] = useState("all"); // all | active | completed
  const [query, setQuery] = useState("");

  // Fetch list
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}?format=json`);
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const data = await res.json();

        // Sort DESC by created_at (latest first)
        data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setTodos(data);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Derived list (filter + search)
  const visibleTodos = useMemo(() => {
    let list = [...todos];
    if (filter === "active") list = list.filter(t => !t.completed);
    if (filter === "completed") list = list.filter(t => t.completed);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(t => t.title.toLowerCase().includes(q));
    }
    // Keep DESC by created_at
    return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [todos, filter, query]);

  // Create
  async function addTodo(title) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, completed: false })
    });
    if (!res.ok) throw new Error("Failed to create todo");
    const newTodo = await res.json();
    setTodos(prev => [newTodo, ...prev]); // keep latest first
  }

  // Toggle complete
  async function toggleTodo(id) {
    const target = todos.find(t => t.id === id);
    if (!target) return;
    // optimistic update
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    try {
      const res = await fetch(`${API_URL}${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !target.completed })
      });
      if (!res.ok) throw new Error("Failed to toggle");
      const updated = await res.json();
      setTodos(prev => prev.map(t => t.id === id ? updated : t));
    } catch (e) {
      // roll back
      setTodos(prev => prev.map(t => t.id === id ? target : t));
      alert(e.message);
    }
  }

  // Update title
  async function updateTitle(id, title) {
    const original = todos.find(t => t.id === id);
    const temp = { ...original, title };
    setTodos(prev => prev.map(t => t.id === id ? temp : t));
    try {
      const res = await fetch(`${API_URL}${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
      });
      if (!res.ok) throw new Error("Failed to update");
      const updated = await res.json();
      setTodos(prev => prev.map(t => t.id === id ? updated : t));
    } catch (e) {
      setTodos(prev => prev.map(t => t.id === id ? original : t));
      alert(e.message);
    }
  }

  // Delete
  async function deleteTodo(id) {
    const original = todos;
    setTodos(prev => prev.filter(t => t.id !== id));
    try {
      const res = await fetch(`${API_URL}${id}/`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) throw new Error("Failed to delete");
    } catch (e) {
      setTodos(original); // roll back
      alert(e.message);
    }
  }

  return (
    <div className="container">
      <h1>React + Django To-Do</h1>

      <div className="toolbar">
        <TaskForm onAdd={addTodo} />
        <div className="filters">
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search…"
          />
        </div>
      </div>

      {loading && <p>Loading…</p>}
      {err && <p className="error">Error: {err}</p>}

      {!loading && !err && (
        <TodoList
          todos={visibleTodos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onEditTitle={updateTitle}
        />
      )}
    </div>
  );
}
