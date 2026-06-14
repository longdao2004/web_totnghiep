/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import prisma from "@/lib/prisma";

// Hàm tiện ích format tiền (Hàm hỗ trợ, chạy trong môi trường Server)
function formatVnd(price: any) {
  if (!price) return "Đang cập nhật";
  const value = typeof price === "object" && "toNumber" in price ? price.toNumber() : Number(price);
  if (!Number.isFinite(value)) return "Đang cập nhật";
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(value);
}

type ComparePageProps = {
  searchParams: Promise<{
    car1?: string;
    car2?: string;
  }>;
};

export default async function SoSanhPage({ searchParams }: ComparePageProps) {
  // ==============================================================================
  // ⬇️ BẮT ĐẦU PHẦN BACK-END (SERVER-SIDE)
  // Tính chất: Chạy ngầm trên máy chủ, bảo mật tuyệt đối. 
  // Trình duyệt của người dùng (Chrome/Cốc Cốc) không bao giờ nhìn thấy đoạn mã này.
  // ==============================================================================
  
  // Lấy các tham số (ID xe) từ trên thanh địa chỉ URL
  const sp = await searchParams;
  const car1Id = sp.car1;
  const car2Id = sp.car2;

  // Gọi Database (Prisma): Lấy danh sách toàn bộ xe để nạp vào Menu Dropdown
  const allCars = await prisma.carModel.findMany({
    include: { brand: true },
    orderBy: { brand: { name: "asc" } },
  });

  // Gọi Database (Prisma): Tìm thông số kỹ thuật chi tiết của 2 xe dựa trên ID
  const car1 = car1Id
    ? await prisma.carModel.findUnique({ where: { id: car1Id }, include: { brand: true, specifications: true } })
    : null;
    
  const car2 = car2Id
    ? await prisma.carModel.findUnique({ where: { id: car2Id }, include: { brand: true, specifications: true } })
    : null;

  const spec1 = car1?.specifications[0];
  const spec2 = car2?.specifications[0];

  // ==============================================================================
  // ⬆️ KẾT THÚC PHẦN BACK-END
  // Dữ liệu đã được lấy ra thành công và sẵn sàng để "nhồi" vào giao diện.
  // ==============================================================================



  // ==============================================================================
  // ⬇️ BẮT ĐẦU PHẦN FRONT-END (UI / CLIENT-SIDE)
  // Tính chất: Next.js sẽ đóng gói toàn bộ thẻ HTML và dữ liệu bên dưới thành 
  // một bản thiết kế hoàn chỉnh rồi gửi thẳng về cho trình duyệt của người dùng vẽ ra.
  // ==============================================================================
  return (
    <div className="min-h-screen bg-[#0B0C10] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        
        {/* Header UI */}
        <div className="mb-10 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-cyan-400">
            Compare Cars
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-white md:text-5xl">
            So sánh xe
          </h1>
        </div>

        {/* Khối Giao diện Form Chọn Xe */}
        <form method="GET" action="/so-sanh" className="mb-12 flex flex-col items-center justify-center gap-4 rounded-3xl border border-white/10 bg-[#12141D] p-6 shadow-lg md:flex-row">
          <div className="w-full md:w-1/3">
            <select
              name="car1"
              defaultValue={car1Id || ""}
              className="w-full rounded-xl border border-white/20 bg-transparent px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
            >
              <option value="" className="bg-slate-900">-- Chọn xe thứ 1 --</option>
              {/* Vòng lặp nhồi dữ liệu từ Back-end xuống HTML */}
              {allCars.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900">
                  {c.brand.name} {c.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-cyan-400">
            VS
          </div>

          <div className="w-full md:w-1/3">
            <select
              name="car2"
              defaultValue={car2Id || ""}
              className="w-full rounded-xl border border-white/20 bg-transparent px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
            >
              <option value="" className="bg-slate-900">-- Chọn xe thứ 2 --</option>
              {allCars.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900">
                  {c.brand.name} {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 px-8 py-3 font-bold text-white transition-transform hover:scale-105 md:w-auto"
          >
            So sánh ngay
          </button>
        </form>

        {/* Khối Giao diện Bảng Thông Số So Sánh */}
        {(car1 || car2) && (
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#12141D] shadow-2xl">
            {/* Hàng Tiêu đề / Hình ảnh UI */}
            <div className="grid grid-cols-3 border-b border-white/10 bg-black/20">
              <div className="flex items-center justify-center p-6 text-center font-bold text-slate-400">
                Thông số
              </div>
              
              <div className="border-l border-white/10 p-6 text-center">
                {car1 ? (
                  <>
                    <img src={car1.imageUrl || ""} alt={car1.name} className="mx-auto mb-4 h-32 object-contain" />
                    <h3 className="text-xl font-bold text-white">{car1.brand.name} {car1.name}</h3>
                    <p className="mt-2 text-xl font-black text-cyan-400">{formatVnd(car1.startingPrice ?? spec1?.price)}</p>
                  </>
                ) : (
                  <p className="mt-10 text-slate-500">Chưa chọn xe 1</p>
                )}
              </div>

              <div className="border-l border-white/10 p-6 text-center">
                {car2 ? (
                  <>
                    <img src={car2.imageUrl || ""} alt={car2.name} className="mx-auto mb-4 h-32 object-contain" />
                    <h3 className="text-xl font-bold text-white">{car2.brand.name} {car2.name}</h3>
                    <p className="mt-2 text-xl font-black text-cyan-400">{formatVnd(car2.startingPrice ?? spec2?.price)}</p>
                  </>
                ) : (
                  <p className="mt-10 text-slate-500">Chưa chọn xe 2</p>
                )}
              </div>
            </div>

            {/* Các hàng thông số được Map thành giao diện */}
            {[
              { label: "Phân khúc", v1: car1?.segment, v2: car2?.segment },
              { label: "Dáng xe", v1: car1?.bodyType, v2: car2?.bodyType },
              { label: "Động cơ", v1: spec1?.engine, v2: spec2?.engine },
              { label: "Công suất", v1: spec1?.power, v2: spec2?.power },
              { label: "Mô-men xoắn", v1: spec1?.torque, v2: spec2?.torque },
              { label: "Hộp số", v1: spec1?.transmission, v2: spec2?.transmission },
              { label: "Hệ dẫn động", v1: spec1?.drivetrain, v2: spec2?.drivetrain },
              { label: "Số chỗ ngồi", v1: spec1?.seatingCapacity ? `${spec1.seatingCapacity} chỗ` : null, v2: spec2?.seatingCapacity ? `${spec2.seatingCapacity} chỗ` : null },
              { label: "Kích thước", v1: spec1?.dimensions, v2: spec2?.dimensions },
              { label: "Khoảng sáng gầm", v1: spec1?.groundClearance ? `${spec1.groundClearance} mm` : null, v2: spec2?.groundClearance ? `${spec2.groundClearance} mm` : null },
              { label: "Mức tiêu hao (L/100km)", v1: spec1?.fuelConsumption, v2: spec2?.fuelConsumption },
            ].map((row, idx) => (
              <div key={idx} className="grid grid-cols-3 border-b border-white/5 transition-colors hover:bg-white/[0.02]">
                <div className="flex items-center justify-start p-4 text-sm font-medium text-slate-400 md:justify-center md:p-6">
                  {row.label}
                </div>
                <div className="border-l border-white/10 p-4 text-center text-sm font-semibold text-white md:p-6 md:text-base">
                  {car1 ? (row.v1 || "-") : ""}
                </div>
                <div className="border-l border-white/10 p-4 text-center text-sm font-semibold text-white md:p-6 md:text-base">
                  {car2 ? (row.v2 || "-") : ""}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
  // ==============================================================================
  // ⬆️ KẾT THÚC PHẦN FRONT-END
  // ==============================================================================
}