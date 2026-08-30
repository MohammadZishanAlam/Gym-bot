"use client";

import { useState, useRef, useEffect } from "react";
import { Dumbbell, Send, Bot, User, Flame, Activity, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_PROMPTS = [
  "🏋️ Build me a 4-day Upper/Lower workout split",
  "🔥 Best exercises for burning belly fat at home",
  "🥗 How much protein do I need to build muscle?",
  "🦵 Leg day workout with dumbbells only"
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "👋 Hey there! I'm **Gymbot**, your AI Personal Trainer & Fitness Coach.\n\nTell me your fitness goals (e.g. *muscle gain, fat loss, endurance*), your available equipment (*full gym, dumbbells, home bodyweight*), or pick a quick topic below to get started!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = { role: "user", content: textToSend };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json().catch(() => ({ error: `Server returned status ${res.status}` }));
      
      if (res.ok && data.content) {
        setMessages([...updatedMessages, { role: "assistant", content: data.content }]);
      } else {
        setMessages([
          ...updatedMessages,
          { role: "assistant", content: `⚠️ ${data.error || "Failed to get response from server."}` }
        ]);
      }
    } catch (err: any) {
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: `⚠️ Network error: ${err?.message || "Please check your connection."}` }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans selection:bg-teal-500 selection:text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-xl shadow-lg shadow-teal-500/20">
            <Dumbbell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white tracking-wide flex items-center gap-2">
              Gymbot AI <span className="text-[10px] bg-teal-500/20 text-teal-300 font-mono px-2 py-0.5 rounded-full border border-teal-500/30">PRO</span>
            </h1>
            <p className="text-xs text-slate-400">AI Personal Trainer & Workout Coach</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1 bg-slate-800/80 rounded-full border border-slate-700 text-slate-300">
            <Flame className="w-3.5 h-3.5 text-orange-400" /> Powered by Gemini
          </span>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-w-3xl w-full mx-auto">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center flex-shrink-0 text-white shadow-md">
                <Bot className="w-4 h-4" />
              </div>
            )}
            <div
              className={`px-4 py-3 rounded-2xl max-w-[85%] text-sm whitespace-pre-wrap leading-relaxed shadow-sm ${
                m.role === "user"
                  ? "bg-teal-600 text-white rounded-br-none"
                  : "bg-slate-900 border border-slate-800/80 text-slate-200 rounded-bl-none"
              }`}
            >
              {m.content}
            </div>
            {m.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 text-slate-200 shadow-md">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 items-center text-slate-400 text-sm">
            <div className="w-8 h-8 rounded-full bg-teal-600/30 border border-teal-500/40 flex items-center justify-center text-teal-400 animate-pulse">
              <Activity className="w-4 h-4 animate-spin" />
            </div>
            <span className="text-xs text-teal-300 font-medium">Gymbot is calculating your optimal routine...</span>
          </div>
        )}

        {messages.length === 1 && (
          <div className="pt-4">
            <p className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" /> Quick Starters:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(prompt.replace(/^[^\s]+ /, ""))}
                  className="text-left text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-teal-500/40 rounded-xl p-3 text-slate-300 transition"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Input Box */}
      <footer className="p-4 border-t border-slate-800/80 bg-slate-900/60 backdrop-blur">
        <form onSubmit={handleSend} className="max-w-3xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for a workout split, form correction, meal suggestions..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition shadow-inner"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 disabled:opacity-40 text-white font-medium rounded-xl text-sm flex items-center gap-2 transition shadow-lg shadow-teal-900/30 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </footer>
    </div>
  );
}
