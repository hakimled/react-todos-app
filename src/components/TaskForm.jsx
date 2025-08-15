import { useState } from "react";

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const t = title.trim();
    if (!t || busy) return;
    try {
      setBusy(true);
      await onAdd(t);
      setTitle("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Add a new task…"
      />
      <button disabled={busy} type="submit">
        {busy ? "Adding…" : "Add"}
      </button>
    </form>
  );
}
