"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { Bot, Mic, SendHorizontal, UserRound, Lock } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useSession } from "next-auth/react"; // Nhập NextAuth để lấy trạng thái đăng nhập
import Link from "next/link"; // Nhập Link để chuyển trang

type ChatMessage = {
  role: "user" | "model";
  content: string;
  timestamp: string;
};

const initialMessages: ChatMessage[] = [
  {
    role: "model",
    content:
      "Xin chào! Tôi là Trợ lý AI của **Car AI**. \n\nHãy cho tôi biết nhu cầu của bạn (ví dụ: *Tài chính, kiểu dáng xe, mục đích sử dụng...*) để tôi tư vấn chiếc xe phù hợp nhất nhé!",
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
          ? "border-cyan-400/50 bg-gradient-to-br from-slate-800 to-slate-900 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
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
  const { data: session } = useSession(); // Lấy thông tin phiên đăng nhập
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // LOGIC GIỚI HẠN: Đếm số câu hỏi của người dùng
  const userMessageCount = messages.filter((m) => m.role === "user").length;
  // Khóa chat nếu: CHƯA đăng nhập VÀ đã hỏi 3 câu
  const isLimitReached = !session && userMessageCount >= 3;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  async function sendMessage(messageText?: string) {
    if (isLimitReached) return; // Chặn luồng gửi nếu đã quá giới hạn

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
    <main className="flex min-h-screen items-center justify-center bg-[#0B0C10] px-4 py-8 text-slate-200 selection:bg-cyan-500/30 sm:px-6">
      <div className="flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#12141D]/90 p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
        
        <div className="mb-6 flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-500"></span>
            </div>
            <h1 className="text-lg font-bold tracking-wide text-white">Car AI Assistant</h1>
          </div>
          {/* Badge báo trạng thái */}
          <div className="rounded-full bg-slate-800/50 px-3 py-1 text-[11px] font-semibold tracking-wider text-slate-400">
            {session ? "TÀI KHOẢN PRO" : `MIỄN PHÍ: ${3 - userMessageCount}/3`}
          </div>
        </div>

        <div className="flex-1 space-y-8 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700/50">
          {messages.map((message, index) => {
            const isUser = message.role === "user";

            return (
              <div key={index} className={`flex w-full items-end gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
                {!isUser && <Avatar type="bot" />}

                <div className={`flex max-w-[85%] flex-col gap-1 sm:max-w-[75%] ${isUser ? "items-end" : "items-start"}`}>
                  <div className={`relative px-6 py-4 text-[15px] leading-relaxed tracking-wide shadow-lg transition-all ${
                    isUser
                      ? "rounded-3xl rounded-tr-sm bg-gradient-to-br from-cyan-400 to-cyan-500 text-slate-950 font-medium"
                      : "rounded-3xl rounded-tl-sm border border-white/10 bg-[#1e293b]/60 text-slate-200 backdrop-blur-md"
                  }`}>
                    {isUser ? (
                      <p>{message.content}</p>
                    ) : (
                      <div className="prose prose-invert max-w-none 
                        prose-p:leading-relaxed prose-p:my-2 
                        prose-headings:text-cyan-400 prose-headings:font-bold prose-headings:mt-4 prose-headings:mb-2 
                        prose-strong:text-white prose-strong:font-semibold 
                        prose-ul:list-inside prose-ul:space-y-1 prose-li:marker:text-cyan-500
                        prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
                        prose-img:mt-5 prose-img:mb-3 prose-img:w-full prose-img:max-h-72 prose-img:object-cover prose-img:rounded-2xl prose-img:border prose-img:border-white/10 prose-img:shadow-2xl"
                      >
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 px-2 mt-1">
                    {message.timestamp}
                  </span>
                </div>

                {isUser && <Avatar type="user" />}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-end gap-3">
              <Avatar type="bot" />
              <div className="rounded-3xl rounded-tl-sm border border-white/5 bg-[#1e293b]/40 px-6 py-5 shadow-sm backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-500"></span>
                  <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-500 delay-100"></span>
                  <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-500 delay-200"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="mt-6 flex shrink-0 flex-col gap-4">
          <div className="flex flex-wrap justify-center gap-2.5">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                disabled={isLoading || isLimitReached}
                className="rounded-full border border-slate-700 bg-slate-800/40 px-5 py-2.5 text-sm font-medium text-slate-300 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-cyan-500/50 hover:bg-slate-800 hover:text-cyan-300 hover:shadow-[0_4px_12px_rgba(34,211,238,0.1)] disabled:opacity-50 disabled:hover:-translate-y-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* KIỂM TRA GIỚI HẠN: Nếu quá 3 câu và chưa đăng nhập thì hiện nút khóa */}
          {isLimitReached ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-cyan-500/30 bg-cyan-500/10 p-5 text-center shadow-[0_0_20px_rgba(34,211,238,0.05)] backdrop-blur-md">
              <div className="flex items-center gap-2 text-cyan-400">
                <Lock className="h-5 w-5" />
                <span className="font-bold">Bạn đã dùng hết 3 lượt tư vấn miễn phí</span>
              </div>
              <p className="text-sm text-slate-400">
                Đăng nhập ngay để trò chuyện không giới hạn và lưu trữ lịch sử tư vấn của bạn.
              </p>
              <Link
                href="/login"
                className="mt-2 rounded-full bg-cyan-400 px-6 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
              >
                Đăng nhập để tiếp tục
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="relative flex items-end gap-3 rounded-3xl border border-slate-700 bg-[#1e293b]/40 p-2.5 shadow-inner backdrop-blur-md transition-all focus-within:border-cyan-500/50 focus-within:bg-[#1e293b]/80 focus-within:shadow-[0_0_20px_rgba(34,211,238,0.1)]"
            >
              <button
                type="button"
                className="mb-2 ml-2 flex shrink-0 items-center justify-center text-slate-400 transition-colors hover:text-cyan-400"
              >
                <Mic className="h-5 w-5" />
              </button>

              <textarea
                id="chat-input"
                name="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Hỏi Car AI bất cứ điều gì..."
                rows={1}
                className="max-h-32 min-h-[44px] flex-1 resize-none bg-transparent py-3 text-[15px] text-slate-100 outline-none placeholder:text-slate-500 disabled:opacity-50 scrollbar-hide"
                disabled={isLoading}
              />

              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-500 text-slate-900 shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] active:scale-95 disabled:scale-100 disabled:bg-slate-700 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 disabled:shadow-none"
              >
                <SendHorizontal className="h-5 w-5 ml-0.5" />
              </button>
            </form>
          )}

          <div className="text-center">
            <span className="text-[10px] font-bold tracking-[0.25em] text-slate-600">
              POWERED BY GROQ & LLAMA 3
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}