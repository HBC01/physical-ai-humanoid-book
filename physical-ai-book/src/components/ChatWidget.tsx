import React, { useState } from 'react';

const ChatWidget: React.FC = () => {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');

  const sendChat = async () => {
    const res = await fetch('http://localhost:8000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    setReply(data.reply);
  };

  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, border: '1px solid #ccc', padding: 10, background: 'white' }}>
      <h4>AI Assistant</h4>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendChat}>Ask</button>
      {reply && <p>{reply}</p>}
    </div>
  );
};

export default ChatWidget;
