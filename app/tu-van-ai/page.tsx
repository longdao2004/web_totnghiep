"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { Bot, Send, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

type ChatMessage = {
  role: "user" | "model";
  content: string;
};

const initialMessages: ChatMessage[] = [
  {
    role: "model",
    content:
      "Xin chào! Tôi là Trợ lý AI. Bạn đang tìm kiếm mẫu xe nào, hay cần tư vấn trong tầm giá bao nhiêu?",
  },
];

export default function TuVanAiPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    const trimmedInput = input.trim();

    if (!trimmedInput || isLoading) {
      return;
    }

    const newMessages: ChatMessage[] = [
      ...messages,
      {
        role: "user",
        content: trimmedInput,
      },
    ];

    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessages((currentMessages) => [
          ...currentMessages,
          {
            role: "model",
            content:
              typeof data.error === "string"
                ? data.error
                : "Xin lỗi, hệ thống đang gặp lỗi khi xử lý tin nhắn. Bạn vui lòng thử lại sau.",
          },
        ]);

        return;
      }

      const responseText =
        typeof data.text === "string"
          ? data.text
          : "Xin lỗi, tôi chưa thể phản hồi lúc này.";

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: "model",
          content: responseText,
        },
      ]);
    } catch (error) {
      console.error("Failed to send chat message:", error);

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: "model",
          content:
            "Xin lỗi, hệ thống đang gặp lỗi khi xử lý tin nhắn. Bạn vui lòng thử lại sau.",
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

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  return (
    <main className="mx-auto flex min-h-[85vh] w-full max-w-5xl flex-col px-4 py-6">
      <header className="border-b border-gray-200 pb-4 dark:border-gray-800">
        <h1 className="text-2xl font-semibold text-gray-950 dark:text-gray-50">
          Trợ lý AI Tư vấn
        </h1>
      </header>

      <section className="flex-1 space-y-5 overflow-y-auto py-6">
        {messages.map((message, index) => {
          const isUser = message.role === "user";

          return (
            <div
              key={`${message.role}-${index}`}
              className={`flex items-start gap-3 ${
                isUser ? "justify-end" : "justify-start"
              }`}
            >
              {!isUser && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-cyan-700 dark:bg-gray-800 dark:text-cyan-300">
                  <Bot size={18} aria-hidden="true" />
                </div>
              )}

              <div
                className={`max-w-[82%] rounded-lg px-4 py-3 text-sm leading-6 shadow-sm md:max-w-[72%] ${
                  isUser
                    ? "bg-cyan-600 text-white"
                    : "bg-gray-100 text-gray-950 dark:bg-gray-800 dark:text-gray-50"
                }`}
              >
                {isUser ? (
                  <p>{message.content}</p>
                ) : (
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-600 text-white">
                  <User size={18} aria-hidden="true" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-cyan-700 dark:bg-gray-800 dark:text-cyan-300">
              <Bot size={18} aria-hidden="true" />
            </div>
            <div className="rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-700 shadow-sm dark:bg-gray-800 dark:text-gray-200">
              Đang gõ...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </section>

      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 flex gap-3 border-t border-gray-200 bg-white py-4 dark:border-gray-800 dark:bg-gray-950"
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nhập nhu cầu của bạn..."
          className="min-h-11 flex-1 rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-950 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-70 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-cyan-600 text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Gửi tin nhắn"
        >
          <Send size={20} aria-hidden="true" />
        </button>
      </form>
    </main>
  );
}
