export function TodoTask({
  completed,
  taskID,
  taskName,
  dueDate,
  notes,
  priority,
  toggleToDo,
  deleteToDo,
}) {
  const formattedDueDate = dueDate
    ? new Date(dueDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <li className={`todo-task ${completed ? "completed" : ""}`}>
      <div className="task-header">
        <label className="task-checkbox">
          <input
            type="checkbox"
            checked={completed}
            onChange={(e) => toggleToDo(taskID, e.target.checked)}
          />
          <span className="task-name">{taskName}</span>
        </label>
        {priority && (
          <span className={`priority priority-${priority.toLowerCase()}`}>
            {priority}
          </span>
        )}
      </div>

      {notes && <p className="task-notes">{notes}</p>}

      {formattedDueDate && (
        <div className="task-due-date">Due: {formattedDueDate}</div>
      )}

      <div className="task-actions">
        <button onClick={() => deleteToDo(taskID)} className="btn btn-danger">
          Remove
        </button>
      </div>
    </li>
  );
}
