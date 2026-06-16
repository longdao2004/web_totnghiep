"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, User as UserIcon } from "lucide-react";
import { useSession, signOut } from "next-auth/react"; // Khai báo NextAuth

const navigationLinks = [
  { href: "/", label: "Trang chủ" },
  { href: "/danh-sach", label: "Danh sách xe" },
  { href: "/so-sanh", label: "So sánh" },
  { href: "/tu-van-ai", label: "Trợ lý AI" },
  { href: "/news", label: "Tin tức" },
  { href: "/about", label: "Giới thiệu" },
];

function CarMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 18"
      className="h-4 w-10 text-cyan-500 dark:text-cyan-400"
      fill="none"
    >
      <path
        d="M5 13.5h38M11.5 13.5l4.2-7h16.6l4.2 7M16.5 13.5l2.3-3.8h10.4l2.3 3.8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Lấy trạng thái đăng nhập từ NextAuth
  const { data: session, status } = useSession();

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 text-slate-950 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur dark:border-white/10 dark:bg-[#0B0C10]/95 dark:text-white dark:shadow-[0_1px_0_rgba(255,255,255,0.04)]">
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3"
          onClick={closeMobileMenu}
        >
          <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-tight">
            <CarMark />
            CAR <span className="text-cyan-500 dark:text-cyan-400">AI</span>
          </span>
          <span className="hidden text-2xl font-black tracking-tight text-slate-950 dark:text-white sm:block">
            Car <span className="text-cyan-500 dark:text-cyan-400">AI</span>
          </span>
        </Link>

        {/* Menu Desktop */}
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300 lg:flex">
          {navigationLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative py-7 transition hover:text-cyan-500 dark:hover:text-cyan-400 ${
                  isActive ? "text-cyan-500 dark:text-cyan-400" : ""
                }`}
              >
                {link.label}
                <span className="absolute inset-x-0 bottom-5 h-0.5 origin-center scale-x-0 rounded-full bg-cyan-500 transition-transform duration-300 ease-out group-hover:scale-x-100 dark:bg-cyan-400" />
              </Link>
            );
          })}
        </nav>

        {/* Nút Đăng nhập / Đăng ký & Thông tin User */}
        <div className="flex items-center justify-end gap-2 sm:gap-3">
          {status === "loading" ? (
             <div className="hidden h-10 w-24 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800 md:block"></div>
          ) : session ? (
             <div className="hidden items-center gap-4 md:flex">
               {/* SỬA ĐỔI: Biến thẻ div thành Link dẫn đến trang Profile */}
               <Link 
                 href="/profile" 
                 className="group flex items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-cyan-500 dark:text-slate-300 dark:hover:text-cyan-400"
               >
                 <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-500 transition group-hover:bg-cyan-500/30 dark:text-cyan-400">
                   <UserIcon className="h-4 w-4" />
                 </div>
                 <span>Chào, {session.user?.name || "Bạn"}</span>
               </Link>
               
               {/* SỬA ĐỔI: Thêm callbackUrl khi đăng xuất */}
               <button
                 onClick={() => signOut({ callbackUrl: "/login?loggedout=true" })}
                 className="flex items-center gap-2 rounded-full border border-red-500/50 px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-500/10 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
               >
                 <LogOut className="h-4 w-4" />
                 Đăng xuất
               </button>
             </div>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-800 transition hover:border-cyan-500 hover:text-cyan-500 dark:border-white/25 dark:text-white dark:hover:border-cyan-400 dark:hover:text-cyan-400 md:inline-flex"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="hidden rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.25)] transition hover:bg-cyan-300 md:inline-flex"
              >
                Đăng ký
              </Link>
            </>
          )}

          {/* Nút Hamburger cho Mobile */}
          <button
            type="button"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100 hover:text-cyan-500 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-cyan-400 lg:hidden"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Menu thả xuống cho Mobile */}
      {isMobileMenuOpen ? (
        <div className="border-t border-slate-200 bg-white px-4 py-5 shadow-lg shadow-slate-950/5 dark:border-white/10 dark:bg-[#0B0C10] dark:shadow-black/30 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-5">
            <nav className="flex flex-col text-sm font-semibold text-slate-700 dark:text-slate-200">
              {navigationLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className={`rounded-lg px-3 py-3 transition hover:bg-slate-100 hover:text-cyan-500 dark:hover:bg-white/10 dark:hover:text-cyan-400 ${
                      isActive ? "text-cyan-500 dark:text-cyan-400" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="grid gap-3 sm:grid-cols-2">
              {session ? (
                 <>
                   {/* SỬA ĐỔI: Thêm nút xem Hồ sơ vào menu điện thoại */}
                   <Link
                     href="/profile"
                     onClick={closeMobileMenu}
                     className="col-span-2 flex items-center justify-center gap-2 rounded-lg px-3 py-3 transition hover:bg-slate-100 hover:text-cyan-500 dark:hover:bg-white/10 dark:hover:text-cyan-400"
                   >
                     <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-500 dark:text-cyan-400">
                       <UserIcon className="h-3 w-3" />
                     </div>
                     <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Hồ sơ cá nhân</span>
                   </Link>
                   
                   <button
                     onClick={() => { closeMobileMenu(); signOut({ callbackUrl: "/login?loggedout=true" }); }}
                     className="col-span-2 inline-flex min-h-11 items-center justify-center rounded-full border border-red-500/50 text-sm font-medium text-red-500 transition hover:bg-red-500/10 dark:text-red-400"
                   >
                     Đăng xuất
                   </button>
                 </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-300 px-5 text-sm font-medium text-slate-800 transition hover:border-cyan-500 hover:text-cyan-500 dark:border-white/25 dark:text-white dark:hover:border-cyan-400 dark:hover:text-cyan-400"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/register"
                    onClick={closeMobileMenu}
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-cyan-400 px-5 text-sm font-bold text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.25)] transition hover:bg-cyan-300"
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}