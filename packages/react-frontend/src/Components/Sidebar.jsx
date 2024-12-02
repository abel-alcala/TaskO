import React, { useState } from "react";
import "../CSS/Sidebar.css";

export function Sidebar({
  isOpen,
  lists,
  addList,
  setCurrentList,
  onToggleCalendar,
}) {
  const [newListName, setNewListName] = useState("");

  function handleAddList() {
    if (newListName.trim()) {
      addList(newListName.trim());
      setNewListName("");
    }
  }

  return (
    <div className={`sidebar ${isOpen ? "show" : ""}`}>
      <h2>Lists</h2>
      <input
        type="text"
        placeholder="Create New List"
        value={newListName}
        onChange={(e) => setNewListName(e.target.value)}
      />
      <button type="button" onClick={handleAddList} className="btn">
        +
      </button>
      <button onClick={onToggleCalendar} className="btn">
        Toggle Calendar
      </button>
      <ul>
        {lists.length === 0 ? (
          <p>No lists available. Create one!</p>
        ) : (
          lists.map(({ id, name }) => (
            <li key={id}>
              <button type="button" onClick={() => setCurrentList(id)}>
                {name}
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default Sidebar;
