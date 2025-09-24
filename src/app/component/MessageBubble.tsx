import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Message } from "./chat";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === "user";

  return (
    <div
      className={`flex items-end ${isUser ? "justify-end" : "justify-start"}`}
    >
      {/* Show AI avatar on left */}
      {!isUser && (
        <div className="mr-3 flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center font-semibold">
            AI
          </div>
        </div>
      )}

      {/* Message bubble */}
      <div className="max-w-[72%]">
        <div
          className={`px-4 py-2 rounded-2xl leading-relaxed text-sm ${
            isUser
              ? "rounded-bl-none bg-indigo-50 text-gray-800 border border-indigo-100"
              : "rounded-br-none bg-pink-50 text-gray-800 border border-pink-100"
          }`}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.text}
          </ReactMarkdown>
        </div>
        <div
          className={`mt-1 text-[11px] text-gray-800 ${
            isUser ? "text-right" : "text-left"
          }`}
        >
          {message.time}
        </div>
      </div>

      {/* Show user avatar on right */}
      {isUser && (
        <div className="ml-3 flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold">
            S
          </div>
        </div>
      )}
    </div>
  );
}
