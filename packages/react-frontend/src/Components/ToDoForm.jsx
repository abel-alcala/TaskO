import {useState} from 'react';

export function ToDoForm({onSubmit}) {
    const [newItem, setNewItem] = useState("");
    const [dueDate, setDueDate] = useState(""); 

    function handleSubmit(e) {
        e.preventDefault();
        if (newItem === "") return;

        onSubmit({ text: newItem, dueDate }); 
        setNewItem("");
        setDueDate("");
    }

    return (
        <form onSubmit={handleSubmit} className="new-item-form">
            <div className="form-row">
                <label htmlFor="item">New Task </label>
                <input
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    type="text"
                    id="item"
                />
            </div>
            <div className="form-row">
                <label htmlFor="due-date">Due Date </label>
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