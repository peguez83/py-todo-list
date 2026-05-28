import { useState } from 'react';

export default function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || '');
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    try {
      await onToggle(todo.id, !todo.completed);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setLoading(true);
    try {
      await onDelete(todo.id);
    } finally {
      setLoading(false);
    }
  }

  async function handleEdit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await onEdit(todo.id, { title: title.trim(), description: description.trim() || null });
      setEditing(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <li className={`todo-item${todo.completed ? ' completed' : ''}`}>
      {editing ? (
        <form className="todo-edit-form" onSubmit={handleEdit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción (opcional)"
            disabled={loading}
          />
          <div className="edit-actions">
            <button type="submit" disabled={loading || !title.trim()}>Guardar</button>
            <button type="button" onClick={() => setEditing(false)} disabled={loading}>Cancelar</button>
          </div>
        </form>
      ) : (
        <>
          <label className="todo-check">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={handleToggle}
              disabled={loading}
            />
            <span className="todo-title">{todo.title}</span>
          </label>
          {todo.description && <p className="todo-description">{todo.description}</p>}
          <div className="todo-actions">
            <button
              className="btn-edit"
              onClick={() => setEditing(true)}
              disabled={loading}
              aria-label="Editar"
            >
              ✏️
            </button>
            <button
              className="btn-delete"
              onClick={handleDelete}
              disabled={loading}
              aria-label="Eliminar"
            >
              🗑️
            </button>
          </div>
        </>
      )}
    </li>
  );
}
