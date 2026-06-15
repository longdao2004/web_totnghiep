"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, Lock, LogIn, ArrowRight, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const isRegistered = searchParams.get("registered") === "true"; // Bắt tín hiệu đăng ký thành công

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Xóa thông báo lỗi khi người dùng bắt đầu gõ lại
  useEffect(() => {
    if (error) setError("");
  }, [email, password]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // TODO: Chúng ta sẽ điền logic gọi NextAuth vào đây sau
    console.log("Đang đăng nhập với:", email, password);
    
    // Tạm thời hiển thị loading 1 giây để test UI
    setTimeout(() => {
      setIsLoading(false);
      setError("Chức năng đăng nhập đang được hoàn thiện. Vui lòng quay lại sau!");
    }, 1000);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0C10] px-4 py-12 sm:px-6 lg:px-8">
      {/* Vòng sáng trang trí */}
      <div className="absolute left-1/2 top-1/2 -z-10 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/20 blur-[120px]"></div>

      <div className="w-full max-w-md space-y-8 rounded-3xl border border-white/10 bg-[#12141D]/80 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
        
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400">
            <LogIn className="h-7 w-7" />
          </div>
          <h2 className="mt-6 text-3xl font-black tracking-tight text-white">
            Đăng nhập
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Chào mừng bạn quay trở lại Car AI
          </p>
        </div>

        {/* Bảng thông báo tạo tài khoản thành công */}
        {isRegistered && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-400">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <p className="text-sm font-medium">Tạo tài khoản thành công! Vui lòng đăng nhập.</p>
          </div>
        )}

        {/* Thông báo lỗi */}
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-400 text-center">
            {error}
          </div>
        )}

        {/* Form Đăng nhập */}
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
              <Mail className="h-5 w-5" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-xl border border-slate-700 bg-slate-900/50 py-3.5 pl-12 pr-4 text-slate-200 placeholder-slate-500 transition focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              placeholder="Địa chỉ Email"
            />
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
              <Lock className="h-5 w-5" />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-xl border border-slate-700 bg-slate-900/50 py-3.5 pl-12 pr-4 text-slate-200 placeholder-slate-500 transition focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              placeholder="Mật khẩu"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-400">
                Ghi nhớ đăng nhập
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-semibold text-cyan-400 hover:underline">
                Quên mật khẩu?
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative flex w-full justify-center rounded-xl bg-cyan-500 px-4 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-70"
          >
            {isLoading ? "Đang kiểm tra..." : "Đăng nhập hệ thống"}
            {!isLoading && (
              <ArrowRight className="absolute right-4 h-5 w-5 transition-transform group-hover:translate-x-1" />
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="font-semibold text-cyan-400 hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}