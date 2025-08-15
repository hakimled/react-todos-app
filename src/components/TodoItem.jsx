import { useState } from "react";

export default function TodoItem({ todo, onToggle, onDelete, onEditTitle }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);
  const [saving, setSaving] = useState(false);

  async function saveEdit() {
    const t = draft.trim();
    if (!t) return;
    setSaving(true);
    await onEditTitle(t);
    setSaving(false);
    setEditing(false);
  }

  return (
    <li className="todo-item">
      <label className="left">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={onToggle}
        />
        {!editing ? (
          <span className={todo.completed ? "done" : ""}>{todo.title}</span>
        ) : (
          <input
            className="edit-input"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") saveEdit();
              if (e.key === "Escape") {
                setDraft(todo.title);
                setEditing(false);
              }
            }}
            autoFocus
          />
        )}
      </label>

      <div className="actions">
        {!editing ? (
          <button onClick={() => setEditing(true)}>Edit</button>
        ) : (
          <button disabled={saving} onClick={saveEdit}>
            {saving ? "Saving…" : "Save"}
          </button>
        )}
        {editing ? (
          <button
            className="secondary"
            onClick={() => {
              setDraft(todo.title);
              setEditing(false);
            }}
          >
            Cancel
          </button>
        ) : (
          <button className="danger" onClick={onDelete}>Delete</button>
        )}
      </div>
    </li>
  );
}
