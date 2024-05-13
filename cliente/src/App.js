import React, { useState, useEffect } from "react";
import "./App.css";

const LOCAL_STORAGE_KEY = "tasks";
const LIST_TITLE_KEY = "listTitle";

function App() {
  const [tasks, setTasks] = useState([]);
  const [listTitle, setListTitle] = useState("");

  const handleTaskCompletion = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const handleTaskDeletion = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const handleTaskEdit = (index, newDescription) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].description = newDescription;
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const handleAddTask = () => {
    const newTask = { completed: false, description: "" };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const handleClearList = () => {
    setTasks([]);
    saveTasksToLocalStorage([]);
    localStorage.removeItem(LIST_TITLE_KEY);
  };

  const handleSaveList = () => {
    const filename = prompt("Enter a filename:");
    if (filename) {
      const blob = new Blob([JSON.stringify({ tasks, listTitle }, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleImportList = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json";
    fileInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const importedData = JSON.parse(e.target.result);
        setTasks(importedData.tasks);
        setListTitle(importedData.listTitle);
        saveTasksToLocalStorage(importedData.tasks);
        localStorage.setItem(LIST_TITLE_KEY, importedData.listTitle);
      };
      reader.readAsText(file);
    });
    fileInput.click();
  };

  const handleLoadTasks = () => {
    const tasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    const listTitle = localStorage.getItem(LIST_TITLE_KEY) || "";
    setTasks(tasks);
    setListTitle(listTitle);
  };

  const saveTasksToLocalStorage = (tasks) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    localStorage.setItem(LIST_TITLE_KEY, listTitle);
  };

  useEffect(() => {
    handleLoadTasks();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div class="box">
          <h2>
            <input
              type="text"
              value={listTitle}
              onChange={(event) => {
                setListTitle(event.target.value);
                localStorage.setItem(LIST_TITLE_KEY, event.target.value);
              }}
              placeholder="Nome da Lista"
            />
          </h2>
          <ul>
            <p>ITEM</p>
            <div class="container">
              {tasks.map((task, index) => (
                <li key={index}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleTaskCompletion(index)}
                  />
                  <input
                    type="text"
                    value={task.description}
                    onChange={(event) =>
                      handleTaskEdit(index, event.target.value)
                    }
                    placeholder="Descrição da Tarefa"
                  />
                  <button onClick={() => handleTaskDeletion(index)}>
                    Deletar
                  </button>
                </li>
              ))}
            </div>
          </ul>
          <div class="draggable-button">
            <button onClick={handleAddTask}>Adicionar</button>
            <button onClick={handleClearList}>Limpar Lista</button>
            <button onClick={handleSaveList}>Salvar Lista</button>
            <button onClick={handleImportList}>Carregar Lista</button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
