import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import "./App.css";

/**
 * PUBLIC_INTERFACE
 * Main Todo App component.
 * Implements Add, Update, Mark Complete, Delete, and List using Supabase.
 * Light, minimal, and responsive.
 */
function App() {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [error, setError] = useState("");

  // Fetch todos on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  // PUBLIC_INTERFACE
  /**
   * Fetch all todos from Supabase
   */
  async function fetchTodos() {
    setLoading(true);
    setError("");
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      setError("Failed to fetch todos.");
      setLoading(false);
      return;
    }
    setTodos(data);
    setLoading(false);
  }

  // PUBLIC_INTERFACE
  /**
   * Add a new todo
   */
  async function handleAddTodo(e) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setLoading(true);
    setError("");
    const { data, error } = await supabase
      .from("todos")
      .insert([{ title: newTitle.trim(), completed: false }])
      .select();
    if (error) {
      setError("Failed to add todo.");
      setLoading(false);
      return;
    }
    setTodos((prev) => [data[0], ...prev]);
    setNewTitle("");
    setLoading(false);
  }

  // PUBLIC_INTERFACE
  /**
   * Set a todo as completed/uncompleted
   */
  async function handleToggleComplete(id, completed) {
    setLoading(true);
    setError("");
    const { data, error } = await supabase
      .from("todos")
      .update({ completed: !completed, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select();
    if (error) {
      setError("Failed to update todo.");
      setLoading(false);
      return;
    }
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? data[0] : todo))
    );
    setLoading(false);
  }

  // PUBLIC_INTERFACE
  /**
   * Delete a todo by ID
   */
  async function handleDeleteTodo(id) {
    setLoading(true);
    setError("");
    const { error } = await supabase.from("todos").delete().eq("id", id);
    if (error) {
      setError("Failed to delete todo.");
      setLoading(false);
      return;
    }
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    setLoading(false);
  }

  // PUBLIC_INTERFACE
  /**
   * Enter edit mode for a todo
   */
  function handleEditTodo(id, currentTitle) {
    setEditingId(id);
    setEditTitle(currentTitle);
    setError("");
  }

  // PUBLIC_INTERFACE
  /**
   * Save the updated title for a todo
   */
  async function handleSaveEdit(id) {
    const trimmed = editTitle.trim();
    if (!trimmed) return;
    setLoading(true);
    setError("");
    const { data, error } = await supabase
      .from("todos")
      .update({ title: trimmed, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select();
    if (error) {
      setError("Failed to update todo.");
      setLoading(false);
      return;
    }
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? data[0] : todo))
    );
    setEditingId(null);
    setEditTitle("");
    setLoading(false);
  }

  // PUBLIC_INTERFACE
  /**
   * Cancel edit mode
   */
  function handleCancelEdit() {
    setEditingId(null);
    setEditTitle("");
  }

  return (
    <div className="App">
      <main className="todo-wrapper">
        <h1 className="todo-header" style={{ color: "#1976d2" }}>
          📝 Minimal To-Do
        </h1>
        <form className="todo-form" onSubmit={handleAddTodo}>
          <input
            type="text"
            placeholder="Add a new todo..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="todo-input"
            aria-label="Add a new todo"
            disabled={loading}
          />
          <button
            type="submit"
            className="todo-add-btn"
            style={{ background: "#ff9800" }}
            disabled={loading || !newTitle.trim()}
          >
            Add
          </button>
        </form>
        {error && <div className="todo-error">{error}</div>}
        <ul className="todo-list">
          {todos.length === 0 && !loading && (
            <li className="todo-empty">No todos yet. Add your first!</li>
          )}
          {todos.map((todo) => (
            <li
              key={todo.id}
              className={`todo-item ${todo.completed ? "completed" : ""}`}
              style={{ borderColor: "#e9ecef" }}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                disabled={loading}
                className="todo-checkbox"
                onChange={() => handleToggleComplete(todo.id, todo.completed)}
              />
              {editingId === todo.id ? (
                <form
                  className="todo-edit-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveEdit(todo.id);
                  }}
                >
                  <input
                    className="todo-edit-input"
                    value={editTitle}
                    disabled={loading}
                    onChange={(e) => setEditTitle(e.target.value)}
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="todo-save-btn"
                    style={{ background: "#1976d2" }}
                    disabled={loading || !editTitle.trim()}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="todo-cancel-btn"
                    onClick={handleCancelEdit}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <span
                    className="todo-title"
                    style={{
                      textDecoration: todo.completed ? "line-through" : "none",
                      color: todo.completed ? "#424242" : "#282c34",
                    }}
                  >
                    {todo.title}
                  </span>
                  <div className="todo-actions">
                    <button
                      className="todo-edit-btn"
                      onClick={() => handleEditTodo(todo.id, todo.title)}
                      disabled={loading}
                      style={{ color: "#1976d2" }}
                      aria-label="Edit todo"
                    >
                      Edit
                    </button>
                    <button
                      className="todo-delete-btn"
                      onClick={() => handleDeleteTodo(todo.id)}
                      disabled={loading}
                      style={{ color: "#ff9800" }}
                      aria-label="Delete todo"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
        {loading && <div className="todo-loading">Loading...</div>}

        <footer className="todo-footer">
          <span>
            Minimal To-Do |{" "}
            <a
              href="https://supabase.com/"
              rel="noopener noreferrer"
              target="_blank"
              className="todo-link"
            >
              Powered by Supabase
            </a>
          </span>
        </footer>
      </main>
    </div>
  );
}

export default App;
