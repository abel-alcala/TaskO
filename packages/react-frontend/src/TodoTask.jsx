export function TodoTask({ completed, id, title, toggleToDo, deleteToDo }) {
    return (
        <li>
            <label>
                <input
                    type="checkbox"
                    checked={completed}
                    onChange={e => toggleToDo(id, e.target.checked)}
                />
                {title}
            </label>
            <button
                onClick={() => deleteToDo(id)}
                className="btn btn-danger"
            >
                Remove
            </button>
        </li>
    );
}