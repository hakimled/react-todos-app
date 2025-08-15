import TodoItem from "./TodoItem";

export default function TodoList({ todos, onToggle, onDelete, onEditTitle }) {
  if (!todos.length) return <p className="muted">No tasks yet.</p>;
  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={() => onToggle(todo.id)}
          onDelete={() => onDelete(todo.id)}
          onEditTitle={(title) => onEditTitle(todo.id, title)}
        />
      ))}
    </ul>
  );
}
