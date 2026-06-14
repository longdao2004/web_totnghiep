/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Image from "next/image";

const mockNews = [
  {
    id: 1,
    title: "VinFast VF 3 chính thức mở bán, giá chỉ từ 240 triệu đồng",
    excerpt: "Mẫu xe điện mini VF 3 đang tạo nên cơn sốt trên thị trường với mức giá siêu hấp dẫn và thiết kế cá tính.",
    category: "Thị trường",
    date: "12/06/2026",
    imageUrl: "/images/cars/VF3.webp", 
  },
  {
    id: 2,
    title: "Toyota Veloz Cross ra mắt phiên bản nâng cấp nhẹ",
    excerpt: "Phiên bản mới bổ sung thêm một số tính năng an toàn và thay đổi nhẹ ở phần đầu xe, tăng sức cạnh tranh trong phân khúc MPV.",
    category: "Xe mới",
    date: "10/06/2026",
    imageUrl: "/images/cars/veloz.jpg", 
  },
  {
    id: 3,
    title: "Xu hướng chuyển dịch sang xe điện tại Việt Nam tăng mạnh",
    excerpt: "Theo báo cáo mới nhất, doanh số xe điện tại thị trường Việt Nam đã tăng trưởng 150% trong nửa đầu năm nay.",
    category: "Công nghệ",
    date: "08/06/2026",
    imageUrl: "/images/cars/VF8.webp",
  },
  {
    id: 4,
    title: "Ford Everest chốt giá mới, cạnh tranh quyết liệt với Santa Fe",
    excerpt: "Cuộc chiến trong phân khúc SUV 7 chỗ ngày càng gay cấn khi các hãng liên tục điều chỉnh giá bán và tung ưu đãi lớn.",
    category: "Thị trường",
    date: "05/06/2026",
    imageUrl: "/images/cars/everest.webp",
  }
];

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-[#0B0C10] px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        
        <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
              Cập nhật liên tục
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-white md:text-5xl">
              Tin tức Ô tô
            </h1>
          </div>
          <Link
            href="/"
            className="rounded-full border border-white/15 px-6 py-3 text-sm font-bold transition hover:border-cyan-400 hover:text-cyan-400"
          >
            ← Về Trang chủ
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {mockNews.map((article) => (
            <div 
              key={article.id} 
              className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#12141D] transition-all hover:-translate-y-1 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)]"
            >
              <div className="relative h-72 w-full overflow-hidden bg-slate-800">
                <div className="absolute left-4 top-4 z-20 rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-bold uppercase text-cyan-400 backdrop-blur-md">
                  {article.category}
                </div>
                {/* Đã thêm unoptimized để bỏ qua lỗi config Next.js và load ảnh gốc siêu nét */}
                <Image 
                  src={article.imageUrl} 
                  alt={article.title} 
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              
              <div className="flex flex-1 flex-col p-6 md:p-8">
                <p className="mb-3 text-sm font-medium text-slate-500">{article.date}</p>
                <h2 className="mb-4 text-2xl font-bold leading-snug text-white transition-colors group-hover:text-cyan-400">
                  {article.title}
                </h2>
                <p className="mb-6 text-slate-400 line-clamp-2">
                  {article.excerpt}
                </p>
                <div className="mt-auto">
                  <span className="inline-flex items-center text-sm font-bold text-cyan-400 transition-transform group-hover:translate-x-2">
                    Đọc tiếp →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}