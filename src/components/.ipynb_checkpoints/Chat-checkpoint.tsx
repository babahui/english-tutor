// src/components/Chat.tsx
import { useState, useEffect } from 'react';

export default function Chat() {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputText, setInputText] = useState('');
  const [socket, setSocket] = useState<WebSocket | null>(null);

  // 初始化WebSocket连接
  useEffect(() => {
    const ws = new WebSocket('wss://api.deepseek.com/v1/chat/completions');
    
    ws.onopen = () => {
      console.log('WebSocket Connected');
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages(prev => [...prev, data.choices[0].delta.content]);
    };

    return () => ws.close();
  }, []);

  const sendMessage = () => {
    if (!inputText.trim() || !socket) return;
    
    socket.send(JSON.stringify({
      messages: [{ role: "user", content: inputText }],
      stream: true
    }));
    setInputText('');
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
      </div>
      <input
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
