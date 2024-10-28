import {TodoTask} from "./TodoTask.jsx";

export function TodoList({todos, toggleToDo, deleteToDo}) {
    return (
        <ul className="list">
        {todos.length === 0 && "No Current Tasks"}
        {todos.map(todos => {
            return (
                <TodoTask
                    {...todos}
                    key = {todos.id}
                    toggleToDo={toggleToDo}
                    deleteToDo={deleteToDo}
                />
            )
        })}
    </ul>
    )
}