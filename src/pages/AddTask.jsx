import TaskForm from "../components/TaskForm";
import { useState, useEffect } from "react";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // Fetch todos
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/todos/?format=json")
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);

  // Add new todo
  const addTodo = () => {
    fetch("http://127.0.0.1:8000/api/todos/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title: newTask, completed: false })
    })
      .then(res => res.json())
      .then(todo => setTasks([todo, ...tasks])); // add new todo to list

    setNewTask("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Todo App</h1>

      <input
        type="text"
        value={newTask}
        onChange={e => setNewTask(e.target.value)}
        placeholder="Add new task..."
      />
      <button onClick={addTodo}>Add</button>

      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.title} {task.completed ? "✅" : "❌"}
          </li>
        ))}
      </ul>
    </div>
  );
}
