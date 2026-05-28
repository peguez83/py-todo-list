const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  listTodos: (completed) => {
    const query = completed !== undefined ? `?completed=${completed}` : '';
    return request(`/todos/${query}`);
  },
  createTodo: (data) =>
    request('/todos/', { method: 'POST', body: JSON.stringify(data) }),
  updateTodo: (id, data) =>
    request(`/todos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTodo: (id) => request(`/todos/${id}`, { method: 'DELETE' }),
};
