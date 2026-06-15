"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, ArrowRight, Car } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  
  // Các biến lưu trữ dữ liệu người dùng nhập
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Các biến trạng thái hiển thị
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Hàm xử lý khi bấm nút Đăng ký
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // 1. Kiểm tra mật khẩu nhập lại có khớp không
    if (password !== confirmPassword) {
      return setError("Mật khẩu nhập lại không khớp!");
    }

    setIsLoading(true);

    try {
      // 2. Gọi API đăng ký mà chúng ta đã làm ở bước trước
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Có lỗi xảy ra khi đăng ký.");
      }

      // 3. Đăng ký thành công -> Chuyển hướng sang trang Đăng nhập
      router.push("/login?registered=true");
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0C10] px-4 py-12 sm:px-6 lg:px-8">
      {/* Vòng sáng trang trí nền */}
      <div className="absolute left-1/2 top-1/2 -z-10 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/20 blur-[120px]"></div>

      <div className="w-full max-w-md space-y-8 rounded-3xl border border-white/10 bg-[#12141D]/80 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
        
        {/* Header Form */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400">
            <Car className="h-7 w-7" />
          </div>
          <h2 className="mt-6 text-3xl font-black tracking-tight text-white">
            Tạo tài khoản
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Tham gia Car AI để lưu trữ xe yêu thích của bạn
          </p>
        </div>

        {/* Thông báo lỗi (nếu có) */}
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400 text-center font-medium">
            {error}
          </div>
        )}

        {/* Form Đăng ký */}
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          
          {/* Ô nhập Tên */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
              <User className="h-5 w-5" />
            </div>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full rounded-xl border border-slate-700 bg-slate-900/50 py-3.5 pl-12 pr-4 text-slate-200 placeholder-slate-500 transition focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              placeholder="Họ và tên của bạn"
            />
          </div>

          {/* Ô nhập Email */}
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

          {/* Ô nhập Mật khẩu */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
              <Lock className="h-5 w-5" />
            </div>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-xl border border-slate-700 bg-slate-900/50 py-3.5 pl-12 pr-4 text-slate-200 placeholder-slate-500 transition focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              placeholder="Mật khẩu (ít nhất 6 ký tự)"
            />
          </div>

          {/* Ô Nhập lại Mật khẩu */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
              <Lock className="h-5 w-5" />
            </div>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full rounded-xl border border-slate-700 bg-slate-900/50 py-3.5 pl-12 pr-4 text-slate-200 placeholder-slate-500 transition focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              placeholder="Xác nhận lại mật khẩu"
            />
          </div>

          {/* Nút Đăng ký */}
          <button
            type="submit"
            disabled={isLoading}
            className="group relative flex w-full justify-center rounded-xl bg-cyan-500 px-4 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-70"
          >
            {isLoading ? "Đang xử lý..." : "Tạo tài khoản ngay"}
            {!isLoading && (
              <ArrowRight className="absolute right-4 h-5 w-5 transition-transform group-hover:translate-x-1" />
            )}
          </button>
        </form>

        {/* Chuyển hướng sang Đăng nhập */}
        <p className="mt-6 text-center text-sm text-slate-400">
          Bạn đã có tài khoản?{" "}
          <Link href="/login" className="font-semibold text-cyan-400 hover:underline">
            Đăng nhập tại đây
          </Link>
        </p>
      </div>
    </div>
  );
}