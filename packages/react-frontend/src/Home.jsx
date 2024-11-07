import React, { useEffect, useState } from 'react';
import { ToDoForm } from './ToDoForm';
import { TodoList } from './TodoList';
import Sidebar from './Sidebar';
import './Home.css';

const Home = () => {
    const [lists, setLists] = useState(() => {
        const savedLists = localStorage.getItem("LISTS");
        return savedLists ? JSON.parse(savedLists) : { Default: [] };
    });

    const [currentList, setCurrentList] = useState("Default");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem("LISTS", JSON.stringify(lists));
    }, [lists]);

    function addToDo(title) {
        setLists(currentLists => ({
            ...currentLists,
            [currentList]: [
                ...currentLists[currentList],
                { id: crypto.randomUUID(), title, completed: false }
            ]
        }));
    }

    function toggleToDo(id, completed) {
        setLists(currentLists => ({
            ...currentLists,
            [currentList]: currentLists[currentList].map(todo =>
                todo.id === id ? { ...todo, completed } : todo
            )
        }));
    }

    function deleteToDo(id) {
        setLists(currentLists => ({
            ...currentLists,
            [currentList]: currentLists[currentList].filter(todo => todo.id !== id)
        }));
    }

    function addList(name) {
        if (!lists[name]) {
            setLists(currentLists => ({
                ...currentLists,
                [name]: []
            }));
            setCurrentList(name);
        }
    }

    return (
        <div className="container">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="btn">
                {isSidebarOpen ? "Hide" : "Show"}
            </button>
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                lists={Object.keys(lists)}
                addList={addList}
                setCurrentList={setCurrentList}
            />
            <h2 className="text-center">{currentList}</h2>
            <TodoList todos={lists[currentList]} toggleToDo={toggleToDo} deleteToDo={deleteToDo} />
            <ToDoForm onSubmit={addToDo} />
        </div>
    );
};

export default Home;
