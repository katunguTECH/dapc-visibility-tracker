"use client";

import { useState } from "react";

export default function SearchBar() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: string; content: string }[]
  >([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const res = await fetch("/api/ai", {
      method: "POST",
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: data.response },
    ]);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Chat Messages */}
      <div className="bg-white border rounded-2xl shadow-sm p-4 h-64 overflow-y-auto mb-4">
        {messages.length === 0 && (
          <p className="text-gray-400">
            Looking for something? Ask DAPC
          </p>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-3 ${
              msg.role === "user"
                ? "text-right"
                : "text-left"
            }`}
          >
            <div
              className={`inline-block px-4 py-2 rounded-2xl ${
                msg.role === "user"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-black"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Looking for something? Ask DAPC"
          className="flex-1 px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-black"
        />
        <button
          onClick={sendMessage}
          className="px-5 py-3 bg-black text-white rounded-2xl hover:opacity-90"
        >
          Ask
        </button>
      </div>
    </div>
  );
}