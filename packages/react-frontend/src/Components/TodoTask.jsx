import React, { useState, useMemo } from "react";
import "../CSS/TaskSidebar.css";
import { api } from "../ApiFunctions.jsx";

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
  userName,
  listId,
}) {
  const [taskNotes, setTaskNotes] = useState(notes || "");
  const [subTaskInput, setSubTaskInput] = useState("");
  const [subTasks, setSubTasks] = useState([]);

  const [editingDueDate, setEditingDueDate] = useState(
    dueDate ? dueDate.split("T")[0] : "",
  );
  const [editingDueTime, setEditingDueTime] = useState(
    dueDate ? dueDate.split("T")[1]?.substring(0, 5) : "",
  );

  const formattedDueDate = useMemo(() => {
    if (!editingDueDate) return null;

    const fullDateTime = editingDueTime
      ? `${editingDueDate}T${editingDueTime}:00`
      : editingDueDate;

    return new Date(fullDateTime).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }, [editingDueDate, editingDueTime]);

  const formattedDueTime = useMemo(() => {
    if (!editingDueDate) return null;

    const fullDateTime = editingDueTime
      ? `${editingDueDate}T${editingDueTime}:00`
      : editingDueDate;

    return new Date(fullDateTime).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [editingDueDate, editingDueTime]);

  const [isEditingTaskName, setIsEditingTaskName] = useState(false);
  const [editingTaskName, setEditingTaskName] = useState(taskName);

  const handleTaskNameEdit = () => {
    setIsEditingTaskName(true);
  };

  const handleTaskNameChange = (e) => {
    setEditingTaskName(e.target.value);
  };

  const saveTaskName = async () => {
    if (editingTaskName.trim() !== "" && editingTaskName !== taskName) {
      try {
        await api.updateTask(userName, listId, taskID, {
          taskName: editingTaskName,
        });
      } catch (error) {
        console.error("Error updating task name:", error);
      }
    }
    setIsEditingTaskName(false);
  };

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

    const updatedDueDateTime = `${editingDueDate || new Date().toISOString().split("T")[0]}T${updatedTime}`;
    updateTask(taskID, { dueDate: updatedDueDateTime });
  };

  const handleSidebarClose = async () => {
    try {
      const updates = {
        ...(taskNotes !== notes && { notes: taskNotes }),
        ...(subTasks.length > 0 && { subTasks }),
        ...(editingDueDate &&
          editingDueTime && {
            dueDate: `${editingDueDate}T${editingDueTime}:00`,
          }),
        ...(editingTaskName !== taskName && { taskName: editingTaskName }),
      };
      if (Object.keys(updates).length > 0) {
        await api.updateTask(userName, listId, taskID, updates);
      }
      onTaskSelect();
    } catch (error) {
      console.error("Error updating task when closing sidebar:", error);
    }
  };

  return (
    <>
      <li
        className={`todo-task ${completed ? "completed" : ""} ${
          isSelected ? "sidebar-active" : ""
        }`}
        onClick={onTaskSelect}
      >
        <div className="task-header">
          <label className="task-checkbox" onClick={(e) => e.stopPropagation()}>
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => toggleToDo(taskID, e.target.checked)}
            />

            <span className="task-name">{editingTaskName}</span>
          </label>
          {priority && (
            <span className={`priority priority-${priority.toLowerCase()}`}>
              {priority}
            </span>
          )}
        </div>

        {formattedDueDate && (
          <div className="task-due-date">
            Due: {formattedDueDate}{" "}
            {formattedDueTime && `at ${formattedDueTime}`}
          </div>
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
          <button className="sidebar-close-btn" onClick={handleSidebarClose}>
            Close
          </button>
          <div className="side-name">
            {isEditingTaskName ? (
              <input
                type="text"
                value={editingTaskName}
                onChange={handleTaskNameChange}
                onBlur={saveTaskName}
                className="task-name-edit"
                autoFocus
              />
            ) : (
              <span className="task-name">{editingTaskName}</span>
            )}
            <button
              className="btn btn-danger"
              onClick={(e) => {
                e.stopPropagation();
                handleTaskNameEdit();
              }}
            >
              ✏️
            </button>
          </div>

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
