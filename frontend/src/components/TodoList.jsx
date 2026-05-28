import TodoItem from './TodoItem';

export default function TodoList({ todos, filter, onToggle, onDelete, onEdit }) {
  const filtered =
    filter === 'pending'
      ? todos.filter((t) => !t.completed)
      : filter === 'completed'
      ? todos.filter((t) => t.completed)
      : todos;

  if (filtered.length === 0) {
    return <p className="empty">No hay tareas{filter !== 'all' ? ' en esta categoría' : ''}.</p>;
  }

  return (
    <ul className="todo-list">
      {filtered.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
}
