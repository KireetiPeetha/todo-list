// todo-list/frontend/src/components/AddTodoForm.js
import React, { useState, useEffect } from 'react';

// Accept new props: editingTodo, onTodoUpdated, and onCancelEdit
function AddTodoForm({ onTodoAdded, editingTodo, onTodoUpdated, onCancelEdit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // useEffect to populate form fields when editingTodo changes
  // This effect runs whenever the 'editingTodo' prop changes.
  // If 'editingTodo' is provided (meaning we are in edit mode), it populates the form fields.
  // If 'editingTodo' is null (meaning we exited edit mode or started fresh), it clears the form fields.
  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title || ''); // Set title from the todo being edited
      setDescription(editingTodo.description || ''); // Set description from the todo being edited
    } else {
      // Clear form when exiting edit mode or when no todo is being edited
      setTitle('');
      setDescription('');
    }
  }, [editingTodo]); // Dependency array: rerun this effect when editingTodo changes

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission (page reload)

    if (!title.trim()) { // Basic validation: Ensure title is not empty or just whitespace
      alert('Todo title cannot be empty!');
      return;
    }

    // Determine if we are adding a new todo or updating an existing one
    if (editingTodo) {
      // If editingTodo exists, we are in update mode
      const updatedTodo = {
        ...editingTodo, // Spread all existing properties (like ID, completed, created_at)
        title: title, // Override with new title from form
        description: description, // Override with new description from form
      };
      onTodoUpdated(updatedTodo); // Call the onTodoUpdated prop function (passed from TodoList)
    } else {
      // If editingTodo is null, we are in add mode
      const newTodo = {
        title: title,
        description: description,
        completed: false, // New todos are always initially incomplete
      };
      onTodoAdded(newTodo); // Call the onTodoAdded prop function (passed from TodoList)
    }
    // Form fields are automatically cleared by the useEffect when editingTodo becomes null (after update)
    // or by the handleCancel function/reset after adding.
  };

  // Function for the Cancel button
  const handleCancel = () => {
    onCancelEdit(); // Call the onCancelEdit prop function (passed from TodoList)
    // This will set editingTodo in the parent (TodoList) to null,
    // which in turn triggers the useEffect above to clear the form fields here.
  };

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: 'none', borderRadius: '8px', backgroundColor: '#f9f9f9', boxShadow: 'none' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        {editingTodo ? 'Edit Todo' : 'Add New Todo'} {/* Dynamic heading based on mode */}
      </h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="text"
          placeholder="Todo Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '1em' }}
          required // Makes the title field mandatory for form submission
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '1em' }}
        ></textarea>

        {/* Button Container for "Add/Update" and "Cancel" buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '10px' }}>
          <button
            type="submit" // This button submits the form
            style={{
              padding: '12px 20px',
              backgroundColor: editingTodo ? '#007bff' : '#28a745', // Blue for Update, Green for Add
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1em',
              fontWeight: 'bold',
              transition: 'background-color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = editingTodo ? '#0056b3' : '#218838'}
            onMouseOut={(e) => e.target.style.backgroundColor = editingTodo ? '#007bff' : '#28a745'}
          >
            {editingTodo ? 'Update Todo' : 'Add Todo'} {/* Dynamic button text */}
          </button>

          {/* Cancel Button: only displayed if in editing mode OR if title/description fields have content */}
          {(editingTodo || title || description) && (
            <button
              type="button" // Important: type="button" prevents it from submitting the form
              onClick={handleCancel} // Calls the handleCancel function
              style={{
                padding: '12px 20px',
                backgroundColor: '#dc3545', // Red color for Cancel
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '1em',
                fontWeight: 'bold',
                transition: 'background-color 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default AddTodoForm;