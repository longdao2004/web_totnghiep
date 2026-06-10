"use client";

import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  BarChart3,
  Bell,
  Bot,
  Car,
  Gauge,
  History,
  LogOut,
  MessageSquareText,
  Mic,
  Paperclip,
  SendHorizontal,
  Settings,
  UserRound,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

type ChatMessage = {
  role: "user" | "model";
  content: string;
};

const initialMessages: ChatMessage[] = [
  {
    role: "model",
    content:
      "Xin chào! Tôi là Trợ lý AI của Car AI. Hãy cho tôi biết ngân sách, nhu cầu sử dụng hoặc mẫu xe bạn đang quan tâm để tôi tư vấn chiếc xe phù hợp nhất.",
  },
];

const quickPrompts = [
  "SUV dưới 1 tỷ",
  "Xe gia đình 7 chỗ",
  "Sedan tiết kiệm xăng",
  "Xe điện đáng mua",
  "Xe cho người mới lái",
];

const sidebarItems = [
  { icon: MessageSquareText, label: "Tư vấn", active: true },
  { icon: Gauge, label: "Hiệu năng" },
  { icon: BarChart3, label: "Phân tích" },
  { icon: History, label: "Lịch sử" },
];

function CarMark() {
  return (
    <span className="flex h-10 w-10 items-center justify-center border border-white/10 bg-white text-cyan-500 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
      <Car className="h-5 w-5" aria-hidden="true" />
    </span>
  );
}

function Avatar({ type }: { type: "bot" | "user" }) {
  const isBot = type === "bot";

  return (
    <div
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border ${
        isBot
          ? "border-cyan-300/70 bg-cyan-400/10 text-cyan-200 shadow-[0_0_0_4px_rgba(56,189,248,0.08)]"
          : "border-cyan-200/70 bg-slate-950 text-cyan-100 shadow-[0_0_0_4px_rgba(56,189,248,0.08)]"
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

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  return (
    <main className="min-h-[calc(100vh-5rem)] overflow-hidden bg-[#0d1020] text-slate-100">
      <div className="grid min-h-[calc(100vh-5rem)] grid-cols-1 lg:grid-cols-[6.25rem_minmax(0,1fr)]">
        <aside className="hidden border-r border-white/10 bg-[#101423] lg:flex lg:flex-col">
          <div className="flex h-20 items-center justify-center border-b border-white/10">
            <CarMark />
          </div>

          <nav className="flex flex-1 flex-col items-center gap-2 pt-12">
            {sidebarItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.label}
                  type="button"
                  aria-label={item.label}
                  className={`relative flex h-16 w-full items-center justify-center transition ${
                    item.active
                      ? "bg-cyan-400/20 text-cyan-200"
                      : "text-slate-400 hover:bg-white/[0.04] hover:text-cyan-100"
                  }`}
                >
                  {item.active ? (
                    <span className="absolute right-0 h-full w-1 bg-cyan-300" />
                  ) : null}
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </button>
              );
            })}
          </nav>

          <div className="flex h-20 items-center justify-center">
            <button
              type="button"
              aria-label="Đăng xuất"
              className="flex h-10 w-10 items-center justify-center text-slate-400 transition hover:text-cyan-100"
            >
              <LogOut className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </aside>

        <section className="flex min-w-0 flex-col">
          <header className="flex min-h-20 items-center justify-between border-b border-white/10 px-5 sm:px-10">
            <div className="flex items-center gap-4">
              <div className="lg:hidden">
                <CarMark />
              </div>
              <div>
                <p className="text-xl font-medium tracking-tight text-cyan-200">
                  Car AI
                </p>
              </div>
            </div>

            <nav className="hidden items-center gap-9 text-sm font-semibold tracking-wide text-slate-300 md:flex">
              <span>Fleet</span>
              <span>Analytics</span>
              <span>Support</span>
            </nav>

            <div className="flex items-center gap-3 text-slate-300">
              <button
                type="button"
                aria-label="Thông báo"
                className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-white/[0.06] hover:text-cyan-100"
              >
                <Bell className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Cài đặt"
                className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-white/[0.06] hover:text-cyan-100"
              >
                <Settings className="h-5 w-5" aria-hidden="true" />
              </button>
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-200/40 bg-slate-950 text-cyan-100">
                <UserRound className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>
          </header>

          <div className="flex flex-1 justify-center px-4 py-7 sm:px-8 lg:px-12">
            <div className="flex min-h-[calc(100vh-10rem)] w-full max-w-6xl flex-col rounded-[1.75rem] border border-white/10 bg-[#101423]/96 px-5 py-7 shadow-[0_30px_90px_rgba(0,0,0,0.35)] sm:px-8 lg:px-10">
              <section className="min-h-0 flex-1 space-y-8 overflow-y-auto pr-1">
                {messages.map((message, index) => {
                  const isUser = message.role === "user";

                  return (
                    <div
                      key={`${message.role}-${index}`}
                      className={`flex items-start gap-5 ${
                        isUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!isUser ? <Avatar type="bot" /> : null}

                      <div
                        className={`max-w-[78%] rounded-2xl border px-5 py-4 text-base leading-8 shadow-lg md:max-w-[72%] ${
                          isUser
                            ? "border-cyan-300/30 bg-cyan-400 text-slate-950 shadow-cyan-950/40"
                            : "border-white/10 bg-[#202434] text-slate-100 shadow-black/20"
                        }`}
                      >
                        {isUser ? (
                          <p>{message.content}</p>
                        ) : (
                          <div className="max-w-none text-slate-100 [&_a]:text-cyan-200 [&_li]:my-1 [&_ol]:ml-5 [&_p]:my-0 [&_ul]:ml-5">
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                          </div>
                        )}
                      </div>

                      {isUser ? <Avatar type="user" /> : null}
                    </div>
                  );
                })}

                {isLoading ? (
                  <div className="flex items-start gap-5">
                    <Avatar type="bot" />
                    <div className="inline-flex min-h-14 items-center gap-4 rounded-2xl border border-white/10 bg-[#202434] px-5 text-base italic text-slate-300 shadow-lg shadow-black/20">
                      <span className="flex gap-1">
                        <span className="h-2.5 w-2.5 rounded-full bg-cyan-200" />
                        <span className="h-2.5 w-2.5 rounded-full bg-cyan-200/80" />
                        <span className="h-2.5 w-2.5 rounded-full bg-cyan-200/60" />
                      </span>
                      AI đang phân tích...
                    </div>
                  </div>
                ) : null}

                <div ref={messagesEndRef} />
              </section>

              <div className="pt-6">
                <div className="mb-6 flex flex-wrap gap-3">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => void sendMessage(prompt)}
                      disabled={isLoading}
                      className="min-h-11 rounded-full border border-white/12 bg-white/[0.06] px-5 text-sm font-semibold text-slate-100 transition hover:border-cyan-200/60 hover:bg-cyan-300/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="flex items-end gap-4">
                  <label className="flex min-h-16 flex-1 items-center gap-4 rounded-2xl border border-white/12 bg-[#222636] px-5 text-slate-400 shadow-inner shadow-black/20 focus-within:border-cyan-200/60">
                    <Paperclip className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <textarea
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Nhập câu hỏi của bạn tại đây..."
                      rows={1}
                      className="max-h-28 min-h-8 flex-1 resize-none bg-transparent py-3 text-base text-slate-100 outline-none placeholder:text-slate-500 disabled:cursor-not-allowed"
                      disabled={isLoading}
                    />
                    <Mic className="h-5 w-5 shrink-0" aria-hidden="true" />
                  </label>

                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-cyan-300 text-slate-950 shadow-[0_18px_35px_rgba(103,232,249,0.25)] transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none"
                    aria-label="Gửi tin nhắn"
                  >
                    <SendHorizontal className="h-7 w-7" aria-hidden="true" />
                  </button>
                </form>

                <p className="mt-5 text-center text-xs text-slate-500">
                  Car AI có thể đưa ra câu trả lời không chính xác. Hãy kiểm tra
                  các thông tin quan trọng.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
