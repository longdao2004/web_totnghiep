import Link from "next/link";

const navigationLinks = [
  { href: "/", label: "Trang chủ", active: true },
  { href: "/danh-sach", label: "Xe ô tô" },
  { href: "/so-sanh", label: "So sánh" },
  { href: "/tu-van-ai", label: "Gợi ý AI" },
  { href: "/news", label: "Tin tức" },
  { href: "/about", label: "Giới thiệu" },
];

function CarMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 18"
      className="h-4 w-10 text-cyan-400"
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

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 text-slate-500"
      fill="none"
    >
      <path
        d="m20 20-4.3-4.3m2.3-5.2a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
    >
      <path
        d="M20.5 15.2A8.5 8.5 0 0 1 8.8 3.5 8.5 8.5 0 1 0 20.5 15.2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B0C10]/95 text-white shadow-[0_1px_0_rgba(255,255,255,0.04)] backdrop-blur">
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-6 px-6">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-tight">
            <CarMark />
            CAR <span className="text-cyan-400">AI</span>
          </span>
          <span className="hidden text-2xl font-black tracking-tight text-white sm:block">
            Car <span className="text-cyan-400">AI</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-300 lg:flex">
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative py-7 transition hover:text-cyan-400 ${
                link.active ? "text-cyan-400" : ""
              }`}
            >
              {link.label}
              {link.active ? (
                <span className="absolute inset-x-0 bottom-5 h-0.5 rounded-full bg-cyan-400" />
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-3">
          <label className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-400 shadow-inner shadow-white/5 xl:flex">
            <SearchIcon />
            <input
              type="search"
              placeholder="Tìm mẫu xe..."
              className="w-36 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            />
          </label>

          <Link
            href="/login"
            className="hidden rounded-full border border-white/25 px-5 py-2.5 text-sm font-medium text-white transition hover:border-cyan-400 hover:text-cyan-400 md:inline-flex"
          >
            Đăng nhập
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.25)] transition hover:bg-cyan-300"
          >
            Đăng ký
          </Link>

          <button
            type="button"
            aria-label="Đổi giao diện"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-slate-300 transition hover:bg-white/10 hover:text-cyan-400 sm:inline-flex"
          >
            <MoonIcon />
          </button>

          <Link
            href="/profile"
            aria-label="Hồ sơ người dùng"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-400/10 text-xs font-bold text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.18)] sm:inline-flex"
          >
            AI
          </Link>
        </div>
      </div>
    </header>
  );
}
