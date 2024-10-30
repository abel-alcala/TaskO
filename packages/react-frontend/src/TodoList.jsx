import { TodoTask } from './TodoTask';

export function TodoList({ todos, toggleToDo, deleteToDo }) {
    return (
        <ul className="list">
            {todos.length === 0 && "No Current Tasks"}
            {todos.map(todo => (
                <TodoTask
                    {...todo}
                    key={todo.id}
                    toggleToDo={toggleToDo}
                    deleteToDo={deleteToDo}
                />
            ))}
        </ul>
    );
}