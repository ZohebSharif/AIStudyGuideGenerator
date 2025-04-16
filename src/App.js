import './App.css';
import HomePage from './HomePage';
import { useState } from 'react';

function App() {
  const [input, setInput] = useState('');

  const handleSubmit = async () => {
    if (!input.trim()) return alert("Please enter a topic.");

    try {
      const response = await fetch('http://localhost:4000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: input }),
      });

      if (!response.ok) throw new Error("Failed to write to database");

      alert("Study guide generated and uploaded!");
      setInput('');
    } catch (error) {
      console.error("Error writing to database:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Generate Study Guide</h1>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a topic..."
          style={{ padding: '8px', fontSize: '16px', width: '300px', marginBottom: '10px' }}
        />

        <br />

        <button
          onClick={handleSubmit}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            marginBottom: '20px',
          }}
        >
          Submit
        </button>

        <HomePage></HomePage>
      </header>
    </div>
  );
}

export default App;
