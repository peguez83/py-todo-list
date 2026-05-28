import { useState } from 'react';

export default function LoginForm({ onLogin, loading }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      await onLogin(username, password);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Iniciar sesión</h2>
      <p className="auth-hint">Usa tus credenciales para acceder a tus tareas.</p>
      {error && <p className="error">{error}</p>}
      <input
        type="text"
        placeholder="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        autoComplete="username"
        required
        disabled={loading}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
        required
        disabled={loading}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Ingresando…' : 'Entrar'}
      </button>
    </form>
  );
}
