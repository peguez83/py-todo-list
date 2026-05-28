import { useState } from 'react';

export default function TodoForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    setError('');
    try {
      await onAdd({ title: title.trim(), description: description.trim() || undefined });
      setTitle('');
      setDescription('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <h2>Nueva tarea</h2>
      {error && <p className="error">{error}</p>}
      <input
        type="text"
        placeholder="Título *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        disabled={loading}
      />
      <input
        type="text"
        placeholder="Descripción (opcional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={loading}
      />
      <button type="submit" disabled={loading || !title.trim()}>
        {loading ? 'Guardando…' : 'Agregar'}
      </button>
    </form>
  );
}
