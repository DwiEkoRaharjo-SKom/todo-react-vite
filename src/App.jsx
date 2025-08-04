import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const App = () => {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editInput, setEditInput] = useState("");
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = () => {
    if (!input.trim()) return;
    const newTodo = {
      id: Date.now().toString(), // ✅ ubah ke string
      text: input.trim(),
      completed: false,
    };
    setTodos([...todos, newTodo]);
    setInput("");
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleToggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleFilterChange = (value) => {
    setFilter(value);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(todos);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setTodos(reordered);
  };

  const toggleDarkMode = () => {
    const html = document.documentElement;
    html.classList.toggle("dark");
    setIsDark(!isDark);
  };

  const startEditing = (id, text) => {
    setEditingId(id);
    setEditInput(text);
  };

  const saveEdit = (id) => {
    if (!editInput.trim()) return;
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: editInput.trim() } : todo
      )
    );
    setEditingId(null);
    setEditInput("");
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white transition-all duration-300">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Todo App</h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-300 dark:bg-gray-700 text-xl"
            title="Toggle Dark Mode"
          >
            {isDark ? "🌞" : "🌙"}
          </button>
        </div>

        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a new todo"
            className="flex-1 px-4 py-2 rounded border border-gray-300 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
          <button
            onClick={handleAddTodo}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Add
          </button>
        </div>

        <div className="flex justify-between items-center">
          <div className="space-x-2">
            {["all", "active", "completed"].map((f) => (
              <button
                key={f}
                onClick={() => handleFilterChange(f)}
                className={`px-3 py-1 rounded capitalize ${
                  filter === f
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="todos">
            {(provided) => (
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                <AnimatePresence>
                  {filteredTodos.map((todo, index) => (
                    <Draggable
                      key={todo.id}
                      draggableId={String(todo.id)} // ✅ pastikan string
                      index={index}
                    >
                      {(provided) => (
                        <motion.li
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded shadow"
                        >
                          <div className="flex items-center gap-2 w-full">
                            <input
                              type="checkbox"
                              checked={todo.completed}
                              onChange={() => handleToggleComplete(todo.id)}
                            />
                            {editingId === todo.id ? (
                              <input
                                value={editInput}
                                onChange={(e) => setEditInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") saveEdit(todo.id);
                                }}
                                className="flex-1 px-2 py-1 rounded border dark:bg-gray-700"
                              />
                            ) : (
                              <span
                                className={`flex-1 font-medium ${
                                  todo.completed
                                    ? "line-through text-gray-400"
                                    : "text-gray-800 dark:text-white"
                                }`}
                              >
                                {todo.text}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 ml-4">
                            {editingId === todo.id ? (
                              <button
                                onClick={() => saveEdit(todo.id)}
                                className="px-2 py-1 text-sm rounded bg-green-500 text-white hover:bg-green-600"
                              >
                                Save
                              </button>
                            ) : (
                              <button
                                onClick={() => startEditing(todo.id, todo.text)}
                                className="px-2 py-1 text-sm rounded bg-yellow-400 text-black hover:bg-yellow-500"
                              >
                                Edit
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteTodo(todo.id)}
                              className="px-2 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </motion.li>
                      )}
                    </Draggable>
                  ))}
                </AnimatePresence>
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default App;