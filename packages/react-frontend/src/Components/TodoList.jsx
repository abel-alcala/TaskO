import {TodoTask} from './TodoTask.jsx';

export function TodoList({todos, toggleToDo, deleteToDo}) {
    return (
        <ul className="list">
            {todos.length === 0}
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