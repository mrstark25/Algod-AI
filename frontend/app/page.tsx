"use client";

import { useState, useRef } from "react";

type Message = {
  role: "user" | "ai";
  text: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const sendingRef = useRef(false);

  async function sendMessage() {
    if (!input.trim() || sendingRef.current) return;

    sendingRef.current = true;

    const userMessage = input;
    setInput("");

    // add user message + empty AI message
    setMessages(prev => [
      ...prev,
      { role: "user", text: userMessage },
      { role: "ai", text: "" },
    ]);

    const response = await fetch(
      "http://localhost:3001/chat/message",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      }
    );

    if (!response.body) {
      sendingRef.current = false;
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let aiText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (!line.startsWith("data:")) continue;

        const payload = line.replace("data: ", "").trim();

        if (!payload || payload === "[DONE]") continue;

        try {
          const parsed = JSON.parse(payload);

          aiText += parsed.content;

          // update ONLY last AI message
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: "ai",
              text: aiText,
            };
            return updated;
          });
        } catch (e) {
          console.error("JSON parse error:", e);
        }
      }
    }

    sendingRef.current = false;
  }

  return (
    <div className="min-h-screen bg-black text-white flex justify-center">
      <div className="w-full max-w-3xl p-6">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Algod AI
        </h1>

        {/* CHAT WINDOW */}
        <div className="border border-gray-700 rounded-lg p-4 h-[500px] overflow-y-auto space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={
                msg.role === "user"
                  ? "text-right"
                  : "text-left"
              }
            >
              <div
                className={
                  msg.role === "user"
                    ? "inline-block bg-blue-600 px-4 py-2 rounded-lg"
                    : "inline-block bg-gray-800 px-4 py-2 rounded-lg whitespace-pre-wrap"
                }
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* INPUT */}
        <div className="flex gap-2 mt-4">
          <input
            className="flex-1 p-3 rounded bg-gray-900 border border-gray-700"
            placeholder="Ask about BTC, NVDA, SPY..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button
            onClick={sendMessage}
            className="bg-white text-black px-5 rounded font-semibold"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
