/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import prisma from "@/lib/prisma";
import FavoriteButton from "@/components/favoriteButton";

// Hàm tiện ích format tiền (Chạy ngầm hỗ trợ)
function formatVnd(price: any) {
  if (!price) return "Đang cập nhật";
  const value =
    typeof price === "object" && "toNumber" in price
      ? price.toNumber()
      : Number(price);
  if (!Number.isFinite(value)) return "Đang cập nhật";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function DanhSachXePage() {
  // ==============================================================================
  // ⬇️ BẮT ĐẦU PHẦN BACK-END (SERVER-SIDE)
  // Tính chất: Gọi trực tiếp vào Neon Database, chạy ngầm trên máy chủ.
  // ==============================================================================

  // Lấy TOÀN BỘ xe từ Database, kèm theo tên Hãng và Thông số kỹ thuật
  const cars = await prisma.carModel.findMany({
    include: {
      brand: true,
      specifications: true,
    },
    orderBy: {
      startingPrice: "asc", // Sắp xếp giá từ thấp đến cao cho dễ xem
    },
  });

  // ==============================================================================
  // ⬆️ KẾT THÚC PHẦN BACK-END
  // ==============================================================================

  // ==============================================================================
  // ⬇️ BẮT ĐẦU PHẦN FRONT-END (UI / CLIENT-SIDE)
  // Tính chất: Trải dữ liệu (cars) ra thành giao diện HTML/CSS lấp lánh.
  // ==============================================================================
  return (
    <div className="min-h-screen bg-[#0B0C10] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Header UI */}
        <div className="mb-12 flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">
              Danh sách <span className="text-cyan-400">Tất cả xe</span>
            </h1>
            <p className="mt-3 text-slate-400">
              Đang hiển thị {cars.length} mẫu xe có sẵn tại hệ thống.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/15 px-5 text-sm font-bold text-slate-200 transition hover:border-cyan-400 hover:text-cyan-400"
          >
            ← Về Trang chủ
          </Link>
        </div>

        {/* Lưới danh sách toàn bộ xe (Vòng lặp map dữ liệu) */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {cars.map((car) => {
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
                  {/* NÚT THẢ TIM ĐÃ ĐƯỢC GẮN VÀO ĐÂY */}
                  <FavoriteButton carId={car.id} />

                  {/* Badge tên hãng nổi bật trên góc ảnh */}
                  <div className="absolute left-4 top-4 z-10 rounded-full bg-black/60 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-400 backdrop-blur-md">
                    {car.brand.name}
                  </div>
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
                    <p>
                      Dáng xe:{" "}
                      <span className="text-slate-200">
                        {car.bodyType || "Đang cập nhật"}
                      </span>
                    </p>
                    <p>
                      Động cơ:{" "}
                      <span className="text-slate-200">
                        {spec?.engine || "Đang cập nhật"}
                      </span>
                    </p>
                    <p>
                      Số chỗ:{" "}
                      <span className="text-slate-200">
                        {spec?.seatingCapacity
                          ? `${spec.seatingCapacity} chỗ`
                          : "Đang cập nhật"}
                      </span>
                    </p>
                  </div>

                  <div className="mt-6 border-t border-white/10 pt-4 mt-auto">
                    <p className="mb-1 text-xs font-medium uppercase tracking-widest text-slate-500">
                      Giá từ
                    </p>
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
  // ==============================================================================
  // ⬆️ KẾT THÚC PHẦN FRONT-END
  // ==============================================================================
}
