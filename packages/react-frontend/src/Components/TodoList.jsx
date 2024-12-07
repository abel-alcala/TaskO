import React, { useState } from "react";
import { TodoTask } from "./TodoTask.jsx";

export function TodoList({ todos = [], toggleToDo, deleteToDo }) {
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const updateTask = (taskID, updatedData) => {
    return todos.map((task) =>
      task.taskID === taskID ? { ...task, ...updatedData } : task,
    );
  };

  const handleTaskSelect = (taskId) => {
    setSelectedTaskId((prevSelectedId) =>
      prevSelectedId === taskId ? null : taskId,
    );
  };

  return (
    <ul className="list">
      {todos.length === 0 ? (
        <li>No tasks available</li>
      ) : (
        todos.map((todo) => (
          <TodoTask
            {...todo}
            key={todo.taskID}
            toggleToDo={toggleToDo}
            deleteToDo={deleteToDo}
            updateTask={updateTask}
            isSelected={selectedTaskId === todo.taskID}
            onTaskSelect={() => handleTaskSelect(todo.taskID)}
          />
        ))
      )}
    </ul>
  );
}
