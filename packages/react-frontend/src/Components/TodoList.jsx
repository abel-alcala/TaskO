import { TodoTask } from "./TodoTask.jsx";

export function TodoList({ todos = [], toggleToDo, deleteToDo }) {
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
          />
        ))
      )}
    </ul>
  );
}
