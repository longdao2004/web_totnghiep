"use client";

import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Bot,
  Mic,
  SendHorizontal,
  UserRound,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

type ChatMessage = {
  role: "user" | "model";
  content: string;
  timestamp: string;
};

const initialMessages: ChatMessage[] = [
  {
    role: "model",
    content:
      "Xin chào! Tôi là Trợ lý AI của Car AI. Hãy cho tôi biết nhu cầu của bạn để tôi tư vấn chiếc xe phù hợp nhất.",
    timestamp: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  },
];

const quickPrompts = [
  "SUV dưới 1 tỷ",
  "Toyota Veloz Cross Top",
  "Sedan tiết kiệm xăng",
  "Xe điện đáng mua",
];

function formatTime(date: Date) {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Avatar({ type }: { type: "bot" | "user" }) {
  const isBot = type === "bot";

  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
        isBot
          ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.15)]"
          : "border-slate-600 bg-slate-800 text-slate-300 shadow-md"
      }`}
    >
      {isBot ? (
        <Bot className="h-5 w-5" aria-hidden="true" />
      ) : (
        <UserRound className="h-5 w-5" aria-hidden="true" />
      )}
    </div>
  );
}

export default function TuVanAiPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  async function sendMessage(messageText?: string) {
    const trimmedInput = (messageText ?? input).trim();

    if (!trimmedInput || isLoading) return;

    const newMessages: ChatMessage[] = [
      ...messages,
      {
        role: "user",
        content: trimmedInput,
        timestamp: formatTime(new Date()),
      },
    ];

    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Lỗi phản hồi từ máy chủ.");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content: data.text || "Xin lỗi, tôi chưa thể phản hồi lúc này.",
          timestamp: formatTime(new Date()),
        },
      ]);
    } catch (error) {
      console.error("Failed to send chat message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content: "Hệ thống AI đang bận hoặc mất kết nối. Vui lòng thử lại sau.",
          timestamp: formatTime(new Date()),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0f1c] px-4 py-8 text-slate-200 selection:bg-cyan-500/30 sm:px-6">
      {/* Khung Chat Chính */}
      <div className="flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[2.5rem] border border-slate-800/80 bg-[#111827]/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        
        {/* Khu vực hiển thị tin nhắn */}
        <div className="flex-1 space-y-8 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-800">
          {messages.map((message, index) => {
            const isUser = message.role === "user";

            return (
              <div
                key={index}
                className={`flex w-full items-end gap-3 ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isUser && <Avatar type="bot" />}

                <div className={`flex max-w-[80%] flex-col gap-1 sm:max-w-[70%] ${isUser ? "items-end" : "items-start"}`}>
                  <div
                    className={`relative px-5 py-3.5 text-[15px] leading-relaxed tracking-wide shadow-sm ${
                      isUser
                        ? "rounded-2xl rounded-tr-sm bg-cyan-400 text-slate-900"
                        : "rounded-2xl rounded-tl-sm bg-slate-800 text-slate-200"
                    }`}
                  >
                    {isUser ? (
                      <p>{message.content}</p>
                    ) : (
                      <div className="prose prose-invert prose-p:my-1 prose-a:text-cyan-300 max-w-none">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 px-1">
                    {message.timestamp}
                  </span>
                </div>

                {isUser && <Avatar type="user" />}
              </div>
            );
          })}

          {/* Hiệu ứng AI đang trả lời */}
          {isLoading && (
            <div className="flex items-end gap-3">
              <Avatar type="bot" />
              <div className="rounded-2xl rounded-tl-sm bg-slate-800 px-5 py-4 shadow-sm">
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-500"></span>
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-500 delay-100"></span>
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-500 delay-200"></span>
                  <span className="ml-2 text-sm font-medium">AI đang phân tích...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Khu vực Nhập liệu */}
        <div className="mt-6 flex shrink-0 flex-col gap-4">
          {/* Nút gợi ý nhanh */}
          <div className="flex flex-wrap justify-center gap-2.5">
            {quickPrompts.map((prompt) => (
               <button
                 key={prompt}
                 onClick={() => sendMessage(prompt)}
                 disabled={isLoading}
                 className="rounded-full border border-slate-700 bg-slate-800/50 px-5 py-2 text-sm font-medium text-slate-300 transition-all hover:border-cyan-500/50 hover:bg-slate-800 hover:text-cyan-300 disabled:opacity-50"
               >
                 {prompt}
               </button>
            ))}
          </div>

          {/* Thanh Input */}
          <form
            onSubmit={handleSubmit}
            className="relative flex items-end gap-3 rounded-3xl border border-slate-700 bg-[#1e293b]/50 p-2.5 shadow-inner backdrop-blur-sm transition-colors focus-within:border-cyan-500/50 focus-within:bg-[#1e293b]/80"
          >
            <button
              type="button"
              className="mb-1.5 ml-2 flex shrink-0 items-center justify-center text-slate-400 hover:text-cyan-400"
            >
              <Mic className="h-5 w-5" />
            </button>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập nhu cầu của bạn..."
              rows={1}
              className="max-h-32 min-h-[44px] flex-1 resize-none bg-transparent py-3 text-[15px] text-slate-100 outline-none placeholder:text-slate-500 disabled:opacity-50 scrollbar-hide"
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-400 text-slate-900 shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-transform hover:scale-105 active:scale-95 disabled:scale-100 disabled:bg-slate-700 disabled:text-slate-500 disabled:shadow-none"
            >
              <SendHorizontal className="h-5 w-5 ml-0.5" />
            </button>
          </form>

          {/* Footer Text */}
          <div className="text-center">
             <span className="text-[10px] font-semibold tracking-[0.2em] text-slate-600">
               CAR AI ADVANCED ASSISTANT
             </span>
          </div>
        </div>

      </div>
    </main>
  );
}