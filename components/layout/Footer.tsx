import Link from "next/link";

const quickLinks = [
  "Trang chủ",
  "Xe ô tô",
  "So sánh",
  "Gợi ý AI",
  "Tin tức",
  "Liên hệ",
];
const categories = ["SUV", "Sedan", "Hatchback", "Xe điện", "Xe sang"];
const support = [
  "Câu hỏi thường gặp",
  "Chính sách bảo mật",
  "Điều khoản dịch vụ",
  "Trung tâm hỗ trợ",
];
const socialIcons = ["X", "IG", "IN", "YT", "GH"];

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

function FooterLinkList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-[0.32em] text-white">
        {title}
      </h3>
      <ul className="mt-6 space-y-3 text-sm text-slate-400">
        {items.map((item) => (
          <li key={item}>
            <Link href="#" className="transition hover:text-cyan-400">
              {item}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0B0C10] px-6 text-white">
      <div className="mx-auto max-w-7xl py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-xs font-bold uppercase">
                <CarMark />
                CAR <span className="text-cyan-400">AI</span>
              </span>
              <span className="text-3xl font-black tracking-tight text-cyan-400">
                Car AI
              </span>
            </Link>
            <p className="mt-7 max-w-xs text-sm leading-7 text-slate-300">
              Nền tảng ứng dụng AI giúp so sánh và lựa chọn xe ô tô phù hợp.
              Hỗ trợ người dùng tra cứu, đánh giá và ra quyết định mua xe thông
              minh hơn.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              {socialIcons.map((icon) => (
                <Link
                  key={icon}
                  href="#"
                  aria-label={`Social link ${icon}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[10px] font-bold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-400"
                >
                  {icon}
                </Link>
              ))}
            </div>
          </div>

          <FooterLinkList title="LIÊN KẾT NHANH" items={quickLinks} />
          <FooterLinkList title="DANH MỤC XE" items={categories} />
          <FooterLinkList title="HỖ TRỢ" items={support} />
        </div>

        <div className="mt-14 rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_right,rgba(34,211,238,0.18),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-white">
                Đăng ký nhận bản tin
              </h3>
              <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300">
                Cập nhật thông tin mới nhất về công nghệ AI trong lĩnh vực ô tô
                và các bài so sánh xe cao cấp.
              </p>
            </div>
            <form className="flex w-full flex-col gap-3 sm:flex-row lg:max-w-lg">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="min-h-12 flex-1 rounded-lg border border-white/15 bg-white/10 px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
              />
              <button
                type="submit"
                className="min-h-12 rounded-lg bg-cyan-400 px-7 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
              >
                Đăng ký
              </button>
            </form>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-white/10 pt-8 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 CAR AI. ĐÃ ĐĂNG KÝ BẢN QUYỀN.</p>
          <div className="flex gap-8">
            <Link href="#" className="transition hover:text-cyan-400">
              ĐỊA ĐIỂM
            </Link>
            <Link href="#" className="transition hover:text-cyan-400">
              TUYỂN DỤNG
            </Link>
            <Link href="#" className="transition hover:text-cyan-400">
              PHÁP LÝ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
