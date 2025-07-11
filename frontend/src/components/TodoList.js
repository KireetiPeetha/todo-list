// todo-list/frontend/src/components/TodoList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddTodoForm from './AddTodoForm'; // Import the new form component

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null); // NEW STATE for editing

  // Function to fetch all todos from the backend
  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/todos/');
      setTodos(response.data);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
      console.error("Error fetching todos:", err); // Log error for debugging
    }
  };

  // useEffect to call fetchTodos when the component mounts
  useEffect(() => {
    fetchTodos();
  }, []); // Empty dependency array ensures this runs only once

  // Function to handle adding new todos
  const handleAddTodo = async (newTodoData) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/todos/', newTodoData);
      setTodos((prevTodos) => [...prevTodos, response.data]);

      setFeedbackMessage('Todo added successfully!');
      setIsSuccess(true);
      setTimeout(() => {
        setFeedbackMessage(null);
      }, 3000);

    } catch (err) {
      setError(err);
      console.error("Error adding todo:", err.response ? err.response.data : err.message);

      setFeedbackMessage(`Failed to add todo: ${err.response?.data?.detail || err.message}`);
      setIsSuccess(false);
      setTimeout(() => {
        setFeedbackMessage(null);
      }, 5000);
    }
  };

  // Function to toggle todo completion status (Update)
  const handleToggleComplete = async (id, completedStatus) => {
    try {
      // Fetch the current state of the todo first (more robust for PUT requests)
      const currentTodoResponse = await axios.get(`http://127.0.0.1:8000/api/todos/${id}/`);
      const currentTodo = currentTodoResponse.data;

      // Create the updated todo object
      const updatedTodoData = {
        ...currentTodo, // Spread all existing fields
        completed: completedStatus, // Override only the 'completed' field
      };

      const response = await axios.put(`http://127.0.0.1:8000/api/todos/${id}/`, updatedTodoData);

      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, completed: response.data.completed } : todo
        )
      );
      setFeedbackMessage(completedStatus ? 'Todo marked as complete!' : 'Todo marked as pending!');
      setIsSuccess(true);
      setTimeout(() => setFeedbackMessage(null), 3000);

    } catch (err) {
      setError(err);
      console.error("Error toggling todo completion:", err.response ? err.response.data : err.message);
      setFeedbackMessage(`Failed to update todo status: ${err.response?.data?.detail || err.message}`);
      setIsSuccess(false);
      setTimeout(() => setFeedbackMessage(null), 5000);
    }
  };

  // NEW FUNCTION: To set a todo for editing
  const handleEditClick = (todo) => {
      setEditingTodo(todo);
      // Optionally, scroll to the top of the form for better UX
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // NEW FUNCTION: To handle update submission from the form
  const handleUpdateTodo = async (updatedTodoData) => {
      try {
          const response = await axios.put(`http://127.0.0.1:8000/api/todos/${updatedTodoData.id}/`, updatedTodoData);
          setTodos((prevTodos) =>
              prevTodos.map((todo) =>
                  todo.id === updatedTodoData.id ? response.data : todo
              )
          );
          setFeedbackMessage('Todo updated successfully!');
          setIsSuccess(true);
          setTimeout(() => setFeedbackMessage(null), 3000);
          setEditingTodo(null); // Exit editing mode after update
      } catch (err) {
          setError(err);
          console.error("Error updating todo:", err.response ? err.response.data : err.message);
          setFeedbackMessage(`Failed to update todo: ${err.response?.data?.detail || err.message}`);
          setIsSuccess(false);
          setTimeout(() => setFeedbackMessage(null), 5000);
      }
  };
   const handleDeleteTodo = async (id) => {
  // Optional: Add a confirmation dialog for better UX
  if (!window.confirm("Are you sure you want to delete this todo?")) {
    return; // If user cancels, stop the function
  }

  try {
    await axios.delete(`http://127.0.0.1:8000/api/todos/${id}/`);

    // Update the state: filter out the deleted todo
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));

    setFeedbackMessage('Todo deleted successfully!');
    setIsSuccess(true);
    setTimeout(() => setFeedbackMessage(null), 3000);

    // If the deleted todo was the one being edited, clear editing mode
    if (editingTodo && editingTodo.id === id) {
      setEditingTodo(null);
    }

  } catch (err) {
    setError(err);
    console.error("Error deleting todo:", err.response ? err.response.data : err.message);
    setFeedbackMessage(`Failed to delete todo: ${err.response?.data?.detail || err.message}`);
    setIsSuccess(false);
    setTimeout(() => setFeedbackMessage(null), 5000);
  }
};

  // NEW FUNCTION: To cancel editing from the form
  const handleCancelEdit = () => {
      setEditingTodo(null); // Exit editing mode
  };


  if (loading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Loading todos...</div>;
  }

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>Error: {error.message}. Please ensure your Django backend is running and accessible at http://127.0.0.1:8000/.</div>;
  }


  // Sort todos so completed ones are at the bottom
  const sortedTodos = [...todos].sort((a, b) => {
    if (a.completed && !b.completed) {
      return 1;
    }
    if (!a.completed && b.completed) {
      return -1;
    }
    // Secondary sort by creation date (newest first for same completion status)
    return new Date(b.created_at) - new Date(a.created_at);
  });

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '20px auto',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '2px 2px 5px rgba(0,0,0,0.1)',
      backgroundColor: '#fdfdfd'
    }}>
      {feedbackMessage && (
        <div style={{
          padding: '10px 15px',
          marginBottom: '20px',
          borderRadius: '5px',
          textAlign: 'center',
          fontWeight: 'bold',
          backgroundColor: isSuccess ? '#d4edda' : '#f8d7da',
          color: isSuccess ? '#155724' : '#721c24',
          border: `1px solid ${isSuccess ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {feedbackMessage}
        </div>
      )}

      <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap' }}>

        <div style={{ flex: '1 1 45%', minWidth: '300px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
            {editingTodo ? 'Edit Todo' : 'Add Todo'}
          </h2>
          <AddTodoForm
            onTodoAdded={handleAddTodo}
            editingTodo={editingTodo}          // Pass the todo being edited
            onTodoUpdated={handleUpdateTodo}   // Pass the update handler
            onCancelEdit={handleCancelEdit}    // Pass the cancel handler
          />
        </div>

        <div style={{ flex: '1 1 45%', minWidth: '300px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Your Todos</h2>
          {/* This new container will have the same styling as the form */}
          <div style={{
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#fff',
            boxShadow: '1px 1px 3px rgba(0,0,0,0.05)'
          }}>
            {todos.length === 0 ? (
              <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#666' }}>No todos found. Add some using the form!</p>
            ) : (
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0, // Reset margin to fit nicely in the box
                maxHeight: '65vh', // Keep the max height on the UL
                overflowY: 'auto', // Add a vertical scrollbar when content overflows
                paddingRight: '5px', // Add a little space for the scrollbar
              }}>
                {sortedTodos.map(todo => {
                  const createdAtDate = new Date(todo.created_at);
                  const options = {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true
                  };
                  const formattedDateTime = createdAtDate.toLocaleString('en-US', options);

                  return (
                    <li key={todo.id} style={{
                    padding: '15px',
                    marginBottom: '10px',
                    backgroundColor: '#fff',
                    border: '1px solid #eee',
                    borderRadius: '5px',
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    color: todo.completed ? '#888' : '#333',
                    display: 'flex',
                    flexDirection: 'column',
                      gap: '5px'
                    }}>
                      <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2em' }}>{todo.title}</h3>
                      <p style={{ margin: '0 0 10px 0', fontSize: '0.9em' }}>{todo.description}</p>
                      <small style={{ display: 'block', fontSize: '0.8em', color: '#666' }}>
                        Status: {todo.completed ? 'Completed' : 'Pending'}
                      </small>
                      {todo.created_at && (
                        <small style={{ display: 'block', fontSize: '0.75em', color: '#888', marginTop: '5px' }}>
                          Created: {formattedDateTime}
                        </small>
                      )}
                      <div style={{ marginTop: '10px', display: 'flex', gap: '35px',paddingLeft: '60px'}}>
                        {!todo.completed && (
                          <button
                          onClick={() => handleToggleComplete(todo.id, !todo.completed)}
                          style={{
                            padding: '8px 12px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '0.8em',
                            transition: 'background-color 0.3s ease'
                          }}
                          onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                          onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
                          >
                            Mark as Complete
                          </button>
                        )}
                        {/* NEW: Update Button */}
                        <button
                        onClick={() => handleEditClick(todo)} // Pass the entire todo object
                        style={{
                          padding: '8px 12px',
                          backgroundColor: '#ffc107', // Yellow color for update
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          fontSize: '0.8em',
                          transition: 'background-color 0.3s ease'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#e0a800'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#ffc107'}
                        >
                          Update
                        </button>
                        {/* NEW: Delete button */}
                        <button
    onClick={() => handleDeleteTodo(todo.id)} // Pass the todo's ID
    style={{
      padding: '8px 12px',
      backgroundColor: '#dc3545', // Red color for delete
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '0.8em',
      transition: 'background-color 0.3s ease'
    }}
    onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
    onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
                        >
                          Delete
                        </button>

                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TodoList;