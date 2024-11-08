import React, { useEffect, useState } from 'react';
import { ToDoForm } from '../Components/ToDoForm.jsx';
import { TodoList } from '../Components/TodoList.jsx';
import Sidebar from '../Components/Sidebar.jsx';
import Header from '../Components/Header.jsx';
import '../CSS/Home.css';
import {useNavigate} from "react-router-dom";

const Home = () => {
    const [lists, setLists] = useState(() => {
        const savedLists = localStorage.getItem("LISTS");
        return savedLists ? JSON.parse(savedLists) : {};
    });

    const [currentList, setCurrentList] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

    function deleteCurrentList() {
        if (!currentList) return;

        const { [currentList]: _, ...remainingLists } = lists;
        setLists(remainingLists);
        setCurrentList(Object.keys(remainingLists)[0] || null);
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

    function toggleSidebar() {
        setIsSidebarOpen(!isSidebarOpen);
    }



    return (
        <div className="app-container">
            <Header
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
            />
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                lists={Object.keys(lists)}
                addList={addList}
                setCurrentList={setCurrentList}
            />
            <div className="container">
                {currentList ? (
                    <>
                        <div className="list-header">
                            <h2 className="text-center">{currentList}</h2>
                            <button
                                className="delete-list-btn"
                                onClick={deleteCurrentList}
                            >Delete List
                            </button>
                        </div>
                        <TodoList
                            todos={lists[currentList]}
                            toggleToDo={toggleToDo}
                            deleteToDo={deleteToDo}
                        />
                        <ToDoForm onSubmit={addToDo}/>
                    </>
                ) : (
                    <p className="no-list-prompt">Create a new list</p>
                )}
            </div>
        </div>

    );
};

export default Home;
