import React, { useState } from "react";
import { TodoTask } from "./TodoTask.jsx";

export function TodoList({ todos = [], toggleToDo, deleteToDo }) {
  const [tasks, setTasks] = useState(todos);
  const updateTask = (taskID, updatedData) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.taskID === taskID ? { ...task, ...updatedData } : task
      )
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
          />
        ))
      )}
    </ul>
  );
}
