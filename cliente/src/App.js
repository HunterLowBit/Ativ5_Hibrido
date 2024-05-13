import React, { useState, useEffect } from 'react';
import './App.css';

const LOCAL_STORAGE_KEY = 'tasks';
const LIST_TITLE_KEY = 'listTitle';

function App() {
  const [tasks, setTasks] = useState([]);
  const [listTitle, setListTitle] = useState('');

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
    const newTask = { completed: false, description: '' };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const handleClearList = () => {
    setTasks([]);
    saveTasksToLocalStorage([]);
  };

  const handleSaveList = () => {
    const filename = prompt('Enter a filename:');
    if (filename) {
      const blob = new Blob([JSON.stringify(tasks, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleImportList = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const importedTasks = JSON.parse(e.target.result);
        setTasks(importedTasks);
        saveTasksToLocalStorage(importedTasks);
      };
      reader.readAsText(file);
    });
    fileInput.click();
  };

  const handleLoadTasks = () => {
    const tasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    const listTitle = localStorage.getItem(LIST_TITLE_KEY) || '';
    setTasks(tasks);
    setListTitle(listTitle);
  };

  const saveTasksToLocalStorage = (tasks) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  };

  useEffect(() => {
    handleLoadTasks();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h2>
          <input
            type="text"
            value={listTitle}
            onChange={(event) => setListTitle(event.target.value)}
          />
        </h2>
        <ul>
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
                onChange={(event) => handleTaskEdit(index, event.target.value)}
              />
              <button onClick={() => handleTaskDeletion(index)}>Deletar</button>
            </li>
          ))}
        </ul>
        <button onClick={handleAddTask}>Adicionar</button>
        <button onClick={handleClearList}>Limpar Lista</button>
        <button onClick={handleSaveList}>Salvar Lista</button>
        <button onClick={handleImportList}>Carregar Lista</button>
      </header>
    </div>
  );
}

export default App;

