import './Home.css'
import React, { useEffect, useState } from 'react';
import {ToDoForm} from './ToDoForm';
import {TodoList} from './TodoList';

const Home = () => {
    const [todos, setToDos] = useState(() => {
        const localValue = localStorage.getItem("ITEMS");
        if (localValue == null) return [];
        return JSON.parse(localValue);
    });

    useEffect(() => {
        localStorage.setItem("ITEMS", JSON.stringify(todos));
    }, [todos]);

    function addToDo(title) {
        setToDos(currentToDos => [
            ...currentToDos,
            { id: crypto.randomUUID(), title, completed: false }
        ]);
    }

    function toggleToDo(id, completed) {
        setToDos(currentToDos =>
            currentToDos.map(todo =>
                todo.id === id ? { ...todo, completed } : todo
            )
        );
    }

    function deleteToDo(id) {
        setToDos(currentToDos =>
            currentToDos.filter(todo => todo.id !== id)
        );
    }

    return (
        <>
            <h2 className="text-center">To Do List</h2>
            <TodoList todos={todos} toggleToDo={toggleToDo} deleteToDo={deleteToDo} />
            <ToDoForm onSubmit={addToDo} />
        </>
    );
};

export default Home;