/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import prisma from "@/lib/prisma";
import FavoriteButton from "@/components/favoriteButton"; // Sửa lại chữ F viết hoa cho chuẩn

type BrandPageProps = {
  params: Promise<{
    id: string;
  }>;
};

// Hàm tiện ích format tiền
function formatVnd(price: any) {
  if (!price) return "Đang cập nhật";
  const value = typeof price === "object" && "toNumber" in price ? price.toNumber() : Number(price);
  if (!Number.isFinite(value)) return "Đang cập nhật";
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(value);
}

export default async function BrandDetailPage({ params }: BrandPageProps) {
  const { id } = await params;

  // Lấy thông tin Hãng xe và ĐI KÈM toàn bộ Mẫu xe của hãng đó
  const brand = await prisma.brand.findUnique({
    where: { id: id },
    include: {
      models: {
        include: {
          specifications: true, // Kéo theo thông số kỹ thuật (động cơ, số chỗ...)
        },
      },
    },
  });

  if (!brand) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#0B0C10] text-center text-white">
        <h1 className="text-2xl font-bold">Không tìm thấy thương hiệu này</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0C10] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        
        {/* Nút Quay Lại */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/15 px-5 text-sm font-bold text-slate-200 transition hover:border-cyan-400 hover:text-cyan-400"
          >
            ← Quay lại Trang chủ
          </Link>
        </div>

        {/* Tiêu đề trang */}
        <div className="mb-12">
          <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">
            Xe thuộc thương hiệu <span className="text-cyan-400">{brand.name}</span>
          </h1>
          <p className="mt-3 text-slate-400">
            Đang hiển thị {brand.models.length} mẫu xe có sẵn.
          </p>
        </div>

        {/* Lưới danh sách xe */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {brand.models.map((car) => {
            const spec = car.specifications[0];
            const startingPrice = car.startingPrice ?? spec?.price;

            return (
              <Link
                key={car.id}
                href={`/xe/${car.id}`}
                className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#12141D] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]"
              >
                {/* Khung chứa ảnh */}
                <div className="relative h-56 w-full bg-slate-800">
                  
                  {/* NÚT THẢ TIM ĐÃ ĐƯỢC CHÈN VÀO ĐÂY */}
                  <FavoriteButton carId={car.id} />

                  {car.imageUrl ? (
                    <img
                      src={car.imageUrl}
                      alt={car.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-900 text-sm text-slate-500">
                      Chưa có ảnh
                    </div>
                  )}
                </div>

                {/* Khung chứa thông tin */}
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-2xl font-bold text-white transition-colors group-hover:text-cyan-400">
                    {car.name}
                  </h2>
                  
                  <div className="mt-4 flex flex-col gap-2 text-sm text-slate-400">
                    <p>Dáng xe: <span className="text-slate-200">{car.bodyType || "Đang cập nhật"}</span></p>
                    <p>Động cơ: <span className="text-slate-200">{spec?.engine || "Đang cập nhật"}</span></p>
                    <p>Số chỗ: <span className="text-slate-200">{spec?.seatingCapacity ? `${spec.seatingCapacity} chỗ` : "Đang cập nhật"}</span></p>
                  </div>

                  <div className="mt-6 border-t border-white/10 pt-4 mt-auto">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-1">Giá từ</p>
                    <p className="text-xl font-black text-cyan-400">
                      {formatVnd(startingPrice)}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
}