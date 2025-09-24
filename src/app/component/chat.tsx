"use client";
import { getOpenAIChatResponse } from "@/utils/api";
import { useEffect, useRef, useState } from "react";
import { MessageBubble } from "./MessageBubble";

// Types
export interface Message {
  id: number;
  sender: "user" | "ai";
  text: string;
  time: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "ai",
      text: `I am Dr. Shital, and I can only provide guidance on medical and health-related topics. How can I assist you with your health concerns today?
– Dr. Shital, UN Mehta Hospital`,
      time: new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date()),
    },
  ]);

  const [text, setText] = useState<string>("");
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  async function sendMessage() {
    if (!text.trim()) return;
    const now = new Date();
    const time = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: text.trim(),
      time,
    };
    setMessages((m) => [...m, newMessage]);
    setText("");

    const tempId = Date.now() + 1;
    const placeholder: Message = {
      id: tempId,
      sender: "ai",
      text: "...",
      time,
    };
    setMessages((prev) => [...prev, placeholder]);

    try {
      const data = await getOpenAIChatResponse(text);

      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? { ...m, text: data } : m))
      );
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId ? { ...m, text: "⚠️ Failed to fetch AI response" } : m
        )
      );
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-0">
      <div className="w-full h-screen bg-white shadow-lg rounded-none border border-gray-200 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-pink-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-semibold">
              SS
            </div>
            <div>
              <div className="text-lg font-semibold">Shital</div>
              <div className="text-sm opacity-90">Chat with AI</div>
            </div>
          </div>
        </div>

        {/* Messages area */}
        <div className="p-6 flex-1 flex flex-col overflow-hidden">
          <div
            ref={listRef}
            className="flex-1 overflow-auto space-y-4 pb-4"
            aria-live="polite"
          >
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
          </div>

          {/* Input area */}
          <div className="mt-4">
            <div className="flex items-center gap-3">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 resize-none rounded-xl border text-gray-800 px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 h-14"
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow"
              >
                Send
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Tip: Press Enter to send
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
