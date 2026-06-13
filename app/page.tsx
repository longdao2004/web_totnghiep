import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function HomePage() {
  // Lấy danh sách tất cả các hãng xe từ Database, sắp xếp theo tên (A-Z)
  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-h-screen bg-[#0B0C10] px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Header Trang Chủ */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">
            Khám phá các <span className="text-cyan-400">Thương Hiệu</span>
          </h1>
          <p className="mt-4 text-lg text-slate-400">
            Lựa chọn hãng xe yêu thích của bạn để bắt đầu
          </p>
        </div>

        {/* Lưới hiển thị các Hãng xe */}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/thuong-hieu/${brand.id}`}
              className="group flex min-h-[160px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-[#12141D] p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]"
            >
              <p className="text-2xl font-bold tracking-wider text-slate-300 transition-colors group-hover:text-cyan-400">
                {brand.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}