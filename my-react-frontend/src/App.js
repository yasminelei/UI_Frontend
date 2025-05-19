import React, { useState } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [chatLog, setChatLog] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to chat log
    setChatLog(prev => [...prev, { sender: 'user', text: input }]);

    try {
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();

      // Add bot reply to chat log
      setChatLog(prev => [...prev, { sender: 'bot', text: data.reply }]);
    } catch (error) {
      setChatLog(prev => [...prev, { sender: 'bot', text: 'Error: Could not reach server.' }]);
    }

    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="app-container">
      <h1 className="title">Chat with Flask Bot</h1>
      <div className="chat-window">
        {chatLog.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.sender}`}>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
