import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToDoForm } from "../Components/ToDoForm.jsx";
import { TodoList } from "../Components/TodoList.jsx";
import Sidebar from "../Components/Sidebar.jsx";
import Header from "../Components/Header.jsx";
import { api } from "../ApiFunctions.jsx";
import "../CSS/Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [lists, setLists] = useState({});
  const [currentList, setCurrentList] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userName = localStorage.getItem("userName");
  const token = localStorage.getItem("token");

  console.log(userName);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const fetchLists = async () => {
      try {
        setLoading(true);
        const response = await api.getLists(userName);
        const listsData = response.reduce((acc, list) => {
          acc[list.listID] = {
            name: list.listName,
            tasks: list.tasks || [],
          };
          return acc;
        }, {});
        setLists(listsData);
        if (!currentList && Object.keys(listsData).length > 0) {
          setCurrentList(Object.keys(listsData)[0]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, [userName, token]);

  const addToDo = async (taskData) => {
    if (!currentList || !lists[currentList]) return;
    try {
      const response = await api.createTask(userName, currentList, taskData);
      setLists((prevLists) => ({
        ...prevLists,
        [currentList]: {
          ...prevLists[currentList],
          tasks: [...prevLists[currentList].tasks, response],
        },
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteCurrentList = async () => {
    if (!currentList || !lists[currentList]) return;
    try {
      await api.deleteList(userName, currentList);
      const { [currentList]: _, ...remainingLists } = lists;
      setLists(remainingLists);
      setCurrentList(Object.keys(remainingLists)[0] || null);
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleToDo = async (taskId, completed) => {
    if (!currentList || !lists[currentList]) return;
    try {
      await api.updateTask(userName, currentList, taskId, { completed });
      setLists((prevLists) => ({
        ...prevLists,
        [currentList]: {
          ...prevLists[currentList],
          tasks: prevLists[currentList].tasks.map((task) =>
            task.taskID === taskId ? { ...task, completed } : task,
          ),
        },
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteToDo = async (taskId) => {
    if (!currentList || !lists[currentList]) return;
    try {
      await api.deleteTask(userName, currentList, taskId);
      setLists((prevLists) => ({
        ...prevLists,
        [currentList]: {
          ...prevLists[currentList],
          tasks: prevLists[currentList].tasks.filter(
            (task) => task.taskID !== taskId,
          ),
        },
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  const addList = async (name) => {
    try {
      const response = await api.createList(userName, name);
      setLists((prevLists) => ({
        ...prevLists,
        [response.listID]: {
          name: response.listName,
          tasks: [],
        },
      }));
      setCurrentList(response.listID);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="app-container">
      <Header
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        userName={userName}
      />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        lists={Object.entries(lists).map(([id, list]) => ({
          id,
          name: list.name,
        }))}
        addList={addList}
        setCurrentList={setCurrentList}
        currentList={currentList}
      />
      <div className="container">
        {currentList && lists[currentList] ? (
          <>
            <div className="list-header">
              <h2 className="text-center">{lists[currentList].name}</h2>
              <button className="delete-list-btn" onClick={deleteCurrentList}>
                Delete List
              </button>
            </div>
            <TodoList
              todos={lists[currentList].tasks}
              toggleToDo={toggleToDo}
              deleteToDo={deleteToDo}
            />
            <ToDoForm onSubmit={addToDo} />
          </>
        ) : (
          <p className="no-list-prompt">Create a new list</p>
        )}
      </div>
    </div>
  );
};

export default Home;
