import { useEffect, useState } from 'react';
import './App.css';
import { api, clearStoredToken, getStoredToken, setStoredToken, ApiError } from './api';
import LoginForm from './components/LoginForm';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';

const FILTER_LABELS = [
  { value: 'all', label: 'Todas' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'completed', label: 'Completadas' },
];

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  function logout() {
    clearStoredToken();
    setUser(null);
    setTodos([]);
    setError('');
    setLoading(false);
  }

  useEffect(() => {
    let cancelled = false;

    async function validateSession() {
      const token = getStoredToken();
      if (!token) {
        setAuthLoading(false);
        return;
      }

      try {
        const currentUser = await api.me();
        if (!cancelled) {
          setUser(currentUser);
        }
      } catch (err) {
        if (!cancelled) {
          clearStoredToken();
        }
      } finally {
        if (!cancelled) {
          setAuthLoading(false);
        }
      }
    }

    validateSession();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await api.listTodos();
        if (!cancelled) setTodos(data);
      } catch (err) {
        if (!cancelled) {
          if (err instanceof ApiError && err.status === 401) {
            logout();
          } else {
            setError(err.message);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [user, refreshKey]);

  async function handleLogin(username, password) {
    setAuthSubmitting(true);
    try {
      const { access_token } = await api.login(username, password);
      setStoredToken(access_token);
      try {
        const currentUser = await api.me();
        setUser(currentUser);
        setRefreshKey((k) => k + 1);
      } catch (err) {
        clearStoredToken();
        throw err;
      }
    } finally {
      setAuthSubmitting(false);
    }
  }

  function refresh() {
    setRefreshKey((k) => k + 1);
  }

  async function handleAdd(data) {
    const created = await api.createTodo(data);
    setTodos((prev) => [created, ...prev]);
  }

  async function handleToggle(id, completed) {
    const updated = await api.updateTodo(id, { completed });
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }

  async function handleDelete(id) {
    await api.deleteTodo(id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  async function handleEdit(id, data) {
    const updated = await api.updateTodo(id, data);
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }

  if (authLoading) {
    return (
      <div className="app auth-shell">
        <p className="loading">Validando sesión…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="app auth-shell">
        <LoginForm onLogin={handleLogin} loading={authSubmitting} />
      </div>
    );
  }

  const pending = todos.filter((t) => !t.completed).length;
  const done = todos.filter((t) => t.completed).length;

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-row">
          <div>
            <h1>📝 TODO List</h1>
            <p className="stats">
              {pending} pendiente{pending !== 1 ? 's' : ''} · {done} completada{done !== 1 ? 's' : ''}
            </p>
          </div>
          <button className="logout-btn" onClick={logout}>
            Salir
          </button>
        </div>
      </header>

      <main className="app-main">
        <TodoForm onAdd={handleAdd} />

        <section className="filters">
          {FILTER_LABELS.map(({ value, label }) => (
            <button
              key={value}
              className={`filter-btn${filter === value ? ' active' : ''}`}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </section>

        {error && (
          <div className="error-banner">
            <span>{error}</span>
            <button onClick={refresh}>Reintentar</button>
          </div>
        )}

        {loading ? (
          <p className="loading">Cargando…</p>
        ) : (
          <TodoList
            todos={todos}
            filter={filter}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        )}
      </main>
    </div>
  );
}
