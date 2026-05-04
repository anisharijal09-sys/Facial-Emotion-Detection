import React, { useState } from "react";

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi 💙 I’m here to listen. How are you feeling right now?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };

    // Simple empathetic response (can later be AI-powered)
    const botMessage = {
      sender: "bot",
      text: generateResponse(input),
    };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput("");
  };

  const generateResponse = (text) => {
    const lower = text.toLowerCase();

    if (lower.includes("sad") || lower.includes("depressed")) {
      return "I’m really sorry you’re feeling this way 💔. Want to tell me what’s been weighing on you?";
    }
    if (lower.includes("happy")) {
      return "That’s wonderful 😊 What’s been making you feel happy?";
    }
    if (lower.includes("stress") || lower.includes("anxious")) {
      return "That sounds overwhelming 😔. Let’s take a deep breath together.";
    }

    return "Thank you for sharing that with me 💭. I’m listening.";
  };

  return (
    <div className="w-full bg-white/20 backdrop-blur-lg rounded-2xl p-4 shadow-lg flex flex-col h-[350px]">
      <h3 className="text-white font-semibold mb-2">Emotional Support Chat 💬</h3>

      <div className="flex-1 overflow-y-auto space-y-2 mb-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg max-w-[80%] ${
              msg.sender === "user"
                ? "ml-auto bg-blue-500 text-white"
                : "mr-auto bg-gray-200 text-black"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Share your thoughts..."
          className="flex-1 px-3 py-2 rounded-lg outline-none"
        />
            <button
  onClick={() => {
    const journal = JSON.parse(localStorage.getItem("journal")) || [];
    journal.push({
      text: input,
      date: new Date().toISOString()
    });
    localStorage.setItem("journal", JSON.stringify(journal));
    alert("Saved to journal 💙");
  }}
  className="px-3 py-2 bg-purple-500 text-white rounded-lg"
>
  Save to Journal
</button>


        
      </div>
    </div>
  );
};

export default ChatBot;
