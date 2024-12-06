import React, { useState } from "react";
import "../CSS/TaskSidebar.css";

export function TodoTask({
  completed,
  taskID,
  taskName,
  dueDate,
  notes,
  priority,
  toggleToDo,
  deleteToDo,
  updateTask,
  isSelected,
  onTaskSelect,
}) {
  const [taskNotes, setTaskNotes] = useState(notes || "");
  const [subTaskInput, setSubTaskInput] = useState("");
  const [subTasks, setSubTasks] = useState([]);
  const [editingDueDate, setEditingDueDate] = useState(
    dueDate ? dueDate.split("T")[0] : ""
  );
  const [editingDueTime, setEditingDueTime] = useState(
    dueDate ? dueDate.split("T")[1]?.substring(0, 5) : ""
  );

  const formattedDueDate = dueDate
    ? new Date(dueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : null;

  const handleNotesChange = (e) => {
    const updatedNotes = e.target.value;
    setTaskNotes(updatedNotes);
    updateTask(taskID, { notes: updatedNotes });
  };

  const handleSubTaskChange = (e) => {
    setSubTaskInput(e.target.value);
  };

  const addSubTask = () => {
    if (subTaskInput.trim() === "") return;
    const updatedSubTasks = [...subTasks, subTaskInput.trim()];
    setSubTasks(updatedSubTasks);
    setSubTaskInput("");
    updateTask(taskID, { subTasks: updatedSubTasks });
  };

  const handleDueDateChange = (e) => {
    const updatedDate = e.target.value;
    setEditingDueDate(updatedDate);
    const updatedDueDateTime = `${updatedDate}T${editingDueTime || "00:00"}`;
    updateTask(taskID, { dueDate: updatedDueDateTime });
  };

  const handleDueTimeChange = (e) => {
    const updatedTime = e.target.value;
    setEditingDueTime(updatedTime);
    const updatedDueDateTime = `${editingDueDate || "1970-01-01"}T${updatedTime}`;
    updateTask(taskID, { dueDate: updatedDueDateTime });
  };
  
  return (
    <>
      <li
        className={`todo-task ${completed ? "completed" : ""} ${isSelected ? "sidebar-active" : ""}`}
        onClick={onTaskSelect}
      >
        <div className="task-header">
          <label className="task-checkbox" onClick={(e) => e.stopPropagation()}>
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
          <div className="task-due-date">Due: {formattedDueDate} {formattedDueTime && `at ${formattedDueTime}`}</div>
        )}

        <div className="task-actions">
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteToDo(taskID);
            }}
            className="btn btn-danger"
          >
            Remove
          </button>
        </div>
      </li>

      {isSelected && (
        <div className={`task-details-sidebar ${isSelected ? "show" : ""}`}>
          <button className="sidebar-close-btn" onClick={onTaskSelect}>
            Close
          </button>
          <h2>{taskName}</h2>
          <div className="task-details">
            <div className="task-due-date-detail">
              <strong>Due Date:</strong>
              <input
                type="date"
                value={editingDueDate}
                onChange={handleDueDateChange}
              />
              <input
                type="time"
                value={editingDueTime}
                onChange={handleDueTimeChange}
              />
            </div>
          </div>

          <div className="sub-tasks">
            <h3>Sub Tasks</h3>
            <div className="subtask-input">
              <input
                type="text"
                value={subTaskInput}
                onChange={handleSubTaskChange}
                placeholder="Add Sub Task"
              />
              <button onClick={addSubTask} className="btn btn-add">
                Add
              </button>
            </div>
            <ul className="subtask-list">
              {subTasks.map((subTask, index) => (
                <li key={index} className="subtask-item">
                  • {subTask}
                </li>
              ))}
            </ul>
          </div>
          <div className="task-notes-section">
            <h3>Notes</h3>
            <textarea
              className="task-notes-input"
              value={taskNotes}
              onChange={handleNotesChange}
              placeholder="Add your note here..."
            />
          </div>
        </div>
      )}
    </>
  );
}
