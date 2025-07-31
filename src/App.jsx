
import React, { useState, useEffect } from 'react';

const App = () => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (input) {
      setTasks([...tasks, { text: input, completed: false }]);
      setInput("");
    }
  };

  const toggleComplete = (index) => {
    const updated = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updated);
  };

  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div className="p-10 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Todo App</h1>
      <div className="flex gap-2 mb-4">
        <input className="border p-2 flex-1" value={input} onChange={(e) => setInput(e.target.value)} />
        <button className="bg-blue-500 text-white px-4" onClick={addTask}>Add</button>
      </div>
      <ul>
        {tasks.map((task, i) => (
          <li key={i} className="flex justify-between mb-2">
            <span
              onClick={() => toggleComplete(i)}
              className={`cursor-pointer ${task.completed ? 'line-through text-gray-500' : ''}`}
            >
              {task.text}
            </span>
            <button className="text-red-500" onClick={() => removeTask(i)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
