import './App.css'
import {useEffect, useState} from "react";
import {ToDoForm} from "./ToDoForm.jsx";
import {TodoList} from "./TodoList.jsx";



function App() {
    const [todos, setToDos] = useState(() => {
        const localValue = localStorage.getItem("ITEMS")
        if (localValue == null) return []

        return JSON.parse(localValue)
    })

    useEffect(() => {
        localStorage.setItem("ITEMS", JSON.stringify(todos))
    }, [todos])

    function addToDo(title) {
        setToDos(currentToDos => {
            return [
                ...currentToDos,
                {id: crypto.randomUUID(), title: title, completed: false},
            ]
        })
    }


    function toggleToDo(id, completed){
        setToDos(currentToDos => {
            return currentToDos.map(todos => {
                if(todos.id === id){
                    return {...todos, completed}
                }
                return todos
            })
        })
    }
    function deleteToDo(id){
        setToDos(currentToDos => {
            return currentToDos.filter(todos => todos.id !== id)
        })
    }


  return (
      <>
      <h2 className="text-center">To Do List</h2>
      <TodoList todos = {todos} toggleToDo={toggleToDo} deleteToDo={deleteToDo}/>
      <ToDoForm onSubmit = {addToDo}/>
      </>
  )
}

export default App
