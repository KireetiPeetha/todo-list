// todo-list/frontend/src/App.js
import React from 'react';
import './App.css';
import TodoList from './components/TodoList'; // Import your new TodoList component

function App() {
  return (
    <div className="App">
      <header className="App-header" style={{ backgroundColor: '#76a5af', padding: '10px 20px', color: '#f9f9f9', marginBottom: '30px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
        <h1 style={{ margin: 0 }}>My Todo List Application</h1>
      </header>
      <main>
        <TodoList /> {/* Render the TodoList component here */}
      </main>
    </div>
  );
}

export default App;