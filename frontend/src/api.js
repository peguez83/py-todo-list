const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const TOKEN_KEY = 'py-todo-list.jwt';

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const { authRequired = true, headers = {}, ...rest } = options;
  const requestHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (authRequired) {
    const token = getStoredToken();
    if (token) {
      requestHeaders.Authorization = 'Bearer ' + token;
    }
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: requestHeaders,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(error.detail || `HTTP ${response.status}`, response.status);
  }

  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  login: (username, password) =>
    request('/auth/login', {
      method: 'POST',
      authRequired: false,
      body: JSON.stringify({ username, password }),
    }),
  me: () => request('/auth/me'),
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

export { ApiError };
