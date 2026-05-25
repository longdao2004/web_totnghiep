"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Moon, Search, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";

const navigationLinks = [
  { href: "/", label: "Trang chủ", active: true },
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

function SearchField({ className = "" }: { className?: string }) {
  return (
    <label
      className={`flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-600 shadow-inner shadow-slate-200/60 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400 dark:shadow-white/5 ${className}`}
    >
      <Search className="h-4 w-4 text-slate-500" aria-hidden="true" />
      <input
        type="search"
        placeholder="Tìm mẫu xe..."
        className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-500 dark:text-white"
      />
    </label>
  );
}

export default function Header() {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isDark = isMounted && resolvedTheme === "dark";

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  function toggleTheme() {
    setTheme(isDark ? "light" : "dark");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 text-slate-950 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur dark:border-white/10 dark:bg-[#0B0C10]/95 dark:text-white dark:shadow-[0_1px_0_rgba(255,255,255,0.04)]">
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
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

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300 lg:flex">
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative py-7 transition hover:text-cyan-500 dark:hover:text-cyan-400 ${
                link.active ? "text-cyan-500 dark:text-cyan-400" : ""
              }`}
            >
              {link.label}
              {link.active ? (
                <span className="absolute inset-x-0 bottom-5 h-0.5 rounded-full bg-cyan-500 dark:bg-cyan-400" />
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-2 sm:gap-3">
          <SearchField className="hidden w-44 xl:flex" />

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

          <button
            type="button"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            onClick={toggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-cyan-500 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-cyan-400"
          >
            {isDark ? (
              <Sun className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Moon className="h-5 w-5" aria-hidden="true" />
            )}
          </button>

          <Link
            href="/profile"
            aria-label="User profile"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-400/10 text-xs font-bold text-cyan-600 shadow-[0_0_20px_rgba(34,211,238,0.18)] dark:text-cyan-300 sm:inline-flex"
          >
            AI
          </Link>

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

      {isMobileMenuOpen ? (
        <div className="border-t border-slate-200 bg-white px-4 py-5 shadow-lg shadow-slate-950/5 dark:border-white/10 dark:bg-[#0B0C10] dark:shadow-black/30 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-5">
            <nav className="flex flex-col text-sm font-semibold text-slate-700 dark:text-slate-200">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className={`rounded-lg px-3 py-3 transition hover:bg-slate-100 hover:text-cyan-500 dark:hover:bg-white/10 dark:hover:text-cyan-400 ${
                    link.active ? "text-cyan-500 dark:text-cyan-400" : ""
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <SearchField />

            <div className="grid gap-3 sm:grid-cols-2">
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
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
