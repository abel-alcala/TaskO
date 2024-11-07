// Sidebar.jsx
import React, { useState } from 'react';
import './Sidebar.css';

export function Sidebar({ isOpen, onClose, lists, addList, setCurrentList }) {
    const [newListName, setNewListName] = useState("");

    function handleAddList() {
        if (newListName.trim()) {
            addList(newListName.trim());
            setNewListName("");
        }
    }

    return (
        <div className={`sidebar ${isOpen ? "show" : ""}`}>
            <button type="button" onClick={onClose} className="btn close-btn">Close Sidebar</button>
            <h2>Lists</h2>
            <input
                type="text"
                placeholder="New List Name"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
            />
            <button type="button" onClick={handleAddList} className="btn">+</button>
            <ul>
                {lists.map(list => (
                    <li key={list}>
                        <button type="button" onClick={() => setCurrentList(list)}>
                            {list}
                        </button>
                    </li>
                ))}
            </ul>
        </div>

    );
}

export default Sidebar;
