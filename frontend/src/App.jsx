// frontend/src/App.jsx
import { useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I'm your AI Career Mentor. Ask me anything 👋",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://ai-career-mentor1.onrender.com/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput: input }),
      });

      const data = await res.json();
      const botMessage = { sender: "bot", text: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Failed to get response." },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-app">
      <h2>💼 AI Career Mentor</h2>
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.sender}`}>
            {msg.sender === "bot" ? (
              <div
                className="bubble"
                dangerouslySetInnerHTML={{ __html: msg.text }}
              ></div>
            ) : (
              <div className="bubble">{msg.text}</div>
            )}
          </div>
        ))}

        {loading && (
          <div className="chat-message bot">
            <div className="bubble">💬 Typing...</div>
          </div>
        )}
      </div>
      <div className="input-area">
        <textarea
          rows="2"
          placeholder="Type your question here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSend} disabled={loading}>
          ➤
        </button>
      </div>
    </div>
  );
}

export default App;
