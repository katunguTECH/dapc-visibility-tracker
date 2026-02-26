"use client";

import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { fetchAIResponse } from "@/lib/ai"; // helper to call your AI backend

export default function LandingPage() {
  const { user } = useUser();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetchAIResponse(input, user?.id);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8">

        {/* Clerk Authentication Links */}
        <div className="flex justify-end gap-4">
          <SignInButton>
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Sign In</button>
          </SignInButton>
          <SignUpButton>
            <button className="bg-green-600 text-white px-4 py-2 rounded">Sign Up</button>
          </SignUpButton>
        </div>

        {/* AI Assistant */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-3">AI Assistant</h2>
          <div className="flex flex-col gap-2 max-h-64 overflow-y-auto border rounded p-2 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded ${msg.role === "user" ? "bg-blue-100 self-end" : "bg-gray-200 self-start"}`}
              >
                {msg.content}
              </div>
            ))}
            {loading && <div className="text-gray-400 italic">Assistant is typing...</div>}
          </div>

          <div className="mt-3 flex gap-2">
            <input
              type="text"
              placeholder="Looking for something? Ask DAPC"
              className="flex-1 border rounded p-2"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={handleSend}
              disabled={loading}
            >
              Send
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Visibility Score" value="92" />
          <MetricCard title="Exposure Reach" value="14.2K" />
          <MetricCard title="Leads Generated" value="128" />
          <MetricCard title="Conversion Rate" value="8.4%" />
        </div>

        {/* Visibility Growth Chart Placeholder */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="font-bold mb-3">Visibility Growth</h3>
          <div className="h-48 flex items-center justify-center text-gray-400 italic">
            Chart placeholder (Jan-Jun)
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function MetricCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-2xl font-semibold mt-2">{value}</p>
    </div>
  );
}