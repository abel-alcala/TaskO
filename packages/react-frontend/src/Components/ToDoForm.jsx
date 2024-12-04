import { useState } from "react";

export function ToDoForm({ onSubmit }) {
  const [taskName, setTaskName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (taskName.trim() === "") return;

    const taskData = {
      taskName,
      notes: notes || null,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      completed: false,
      remindDate: null,
      priority: priority || null,
    };

    onSubmit(taskData);
    setTaskName("");
    setDueDate("");
    setNotes("");
    setPriority("");
  }

  return (
    <form onSubmit={handleSubmit} className="new-item-form">
      <div className="form-row">
        <input
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          type="text"
          id="item"
          placeholder="Task Name"
          required
        />
      </div>
      <div className="form-row">
        <label htmlFor="due-date">Due Date</label>
        <input
          type="date"
          id="due-date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
      <button className="btn">Create Task</button>
    </form>
  );
}
