// todo-list/frontend/src/components/AddTodoForm.js
import React, { useState, useEffect } from 'react';

// Accept new props: editingTodo, onTodoUpdated, and onCancelEdit
function AddTodoForm({ onTodoAdded, editingTodo, onTodoUpdated, onCancelEdit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for submission status
  const [localError, setLocalError] = useState(null); // New state for form-specific errors

  // useEffect to populate form fields when editingTodo changes
  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title || ''); // Set title from the todo being edited
      setDescription(editingTodo.description || ''); // Set description from the todo being edited
    } else {
      // Clear form when exiting edit mode or when no todo is being edited
      setTitle('');
      setDescription('');
    }
    setLocalError(null); // Clear any local errors when switching modes
  }, [editingTodo]); // Dependency array: rerun this effect when editingTodo changes

  const handleSubmit = async (e) => { // Made the function async
    e.preventDefault(); // Prevent default form submission (page reload)

    setLocalError(null); // Clear any previous local errors
    setIsSubmitting(true); // Set submitting state to true (disable button)

    if (!title.trim()) { // Basic validation: Ensure title is not empty or just whitespace
      setLocalError('Todo title cannot be empty!');
      setIsSubmitting(false); // Re-enable button on validation failure
      return;
    }

    const todoData = { title, description };

    try {
      if (editingTodo) {
        // If editingTodo exists, we are in update mode
        const updatedTodo = {
          ...editingTodo, // Spread all existing properties (like ID, completed, created_at)
          title: title, // Override with new title from form
          description: description, // Override with new description from form
        };
        await onTodoUpdated(updatedTodo); // Await the update operation from parent
      } else {
        // If editingTodo is null, we are in add mode
        const newTodo = {
          title: title,
          description: description,
          completed: false, // New todos are always initially incomplete
        };
        await onTodoAdded(newTodo); // Await the add operation from parent
      }

      // NEW: Reset form fields ONLY AFTER successful operation
      setTitle('');
      setDescription('');

    } catch (error) {
      // Handle errors from the parent's API calls or other issues
      console.error("Form submission failed:", error.response ? error.response.data : error.message);
      setLocalError(`Failed to ${editingTodo ? 'update' : 'add'} todo: ${error.response?.data?.detail || error.message || 'Please try again.'}`);
    } finally {
      setIsSubmitting(false); // Always re-enable button after attempt (success or failure)
    }
  };

  // Function for the Cancel button
  const handleCancel = () => {
    onCancelEdit(); // Call the onCancelEdit prop function (passed from TodoList)
    // This will set editingTodo in the parent (TodoList) to null,
    // which in turn triggers the useEffect above to clear the form fields here.
  };

  return (
    <div style={{
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#fff',
      boxShadow: '1px 1px 3px rgba(0,0,0,0.05)'
    }}>
      {localError && ( // Display local errors if any
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '10px',
          borderRadius: '5px',
          marginBottom: '15px',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          {localError}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ textAlign: 'left' }}>
          <label htmlFor="title" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Title:</label>
          <input
            type="text"
            id="title"
            placeholder="Todo Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: 'calc(100% - 22px)', // Adjusted for padding + border
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ddd',
              fontSize: '1em'
            }}
            required // Makes the title field mandatory for form submission
            disabled={isSubmitting} // Disable while submitting
          />
        </div>

        <div style={{ textAlign: 'left' }}>
          <label htmlFor="description" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description:</label>
          <textarea
            id="description"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            style={{
              width: 'calc(100% - 22px)', // Adjusted for padding + border
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ddd',
              fontSize: '1em',
              resize: 'vertical' // Allow vertical resizing
            }}
            disabled={isSubmitting} // Disable while submitting
          ></textarea>
        </div>


        {/* Button Container for "Add/Update" and "Cancel" buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}> {/* Changed to flex-end for better alignment */}
          {(editingTodo || title || description) && ( // Display Cancel button if in edit mode OR if fields have content
            <button
              type="button" // Important: type="button" prevents it from submitting the form
              onClick={handleCancel} // Calls the handleCancel function
              style={{
                padding: '12px 20px',
                backgroundColor: '#6c757d', // Grey color for Cancel
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '1em',
                fontWeight: 'bold',
                transition: 'background-color 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#5a6268'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#6c757d'}
              disabled={isSubmitting} // Disable while submitting
            >
              Cancel
            </button>
          )}
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
            disabled={isSubmitting} // Disable while submitting
          >
            {isSubmitting ? 'Saving...' : (editingTodo ? 'Update Todo' : 'Add Todo')} {/* Dynamic button text & loading state */}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddTodoForm;