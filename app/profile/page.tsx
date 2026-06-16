import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import FavoriteButton from "@/components/favoriteButton";
import { User as UserIcon, Mail, ShieldCheck, Car } from "lucide-react";

// Hàm tiện ích format tiền
function formatVnd(price: any) {
  if (!price) return "Đang cập nhật";
  const value = typeof price === "object" && "toNumber" in price ? price.toNumber() : Number(price);
  if (!Number.isFinite(value)) return "Đang cập nhật";
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(value);
}

export default async function ProfilePage() {
  // 1. Kiểm tra xác thực ngay trên Server
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/login"); // Chưa đăng nhập thì đá về trang Login
  }

  // 2. Tìm User trong Database và lấy toàn bộ xe họ đã lưu
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      savedCars: {
        include: {
          brand: true,
          specifications: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#0B0C10] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl space-y-12">
        
        {/* HEADER: Thông tin cá nhân */}
        <div className="flex flex-col gap-8 rounded-3xl border border-white/10 bg-[#12141D] p-8 shadow-2xl md:flex-row md:items-center md:p-12">
          {/* Avatar */}
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.2)] md:h-32 md:w-32">
            <UserIcon className="h-12 w-12 md:h-16 md:w-16" />
          </div>
          
          {/* Thông tin Text */}
          <div className="flex-1 space-y-4">
            <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">
              Hồ sơ của <span className="text-cyan-400">{user.name || "Bạn"}</span>
            </h1>
            <div className="flex flex-col gap-3 text-slate-400 sm:flex-row sm:gap-8">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-cyan-500" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                <span>Thành viên {user.role === "ADMIN" ? "Quản trị" : "Tiêu chuẩn"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* BODY: Danh sách xe đã lưu */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/20 text-red-500">
              <HeartIcon className="h-5 w-5 fill-current" />
            </div>
            <h2 className="text-2xl font-bold text-white">Xe Yêu Thích Của Bạn</h2>
            <span className="ml-2 rounded-full bg-slate-800 px-3 py-1 text-sm font-semibold text-cyan-400">
              {user.savedCars.length} chiếc
            </span>
          </div>

          {/* Hiển thị Grid Xe hoặc Trạng thái trống */}
          {user.savedCars.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {user.savedCars.map((car) => {
                const spec = car.specifications[0];
                const startingPrice = car.startingPrice ?? spec?.price;

                return (
                  <Link
                    key={car.id}
                    href={`/xe/${car.id}`}
                    className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#12141D] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]"
                  >
                    <div className="relative h-56 w-full bg-slate-800">
                      <FavoriteButton carId={car.id} initialIsSaved={true} />
                      <div className="absolute left-4 top-4 z-10 rounded-full bg-black/60 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-400 backdrop-blur-md">
                        {car.brand?.name || "Hãng xe"}
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

                    <div className="flex flex-1 flex-col p-6">
                      <h2 className="text-2xl font-bold text-white transition-colors group-hover:text-cyan-400">
                        {car.name}
                      </h2>
                      <div className="mt-4 flex flex-col gap-2 text-sm text-slate-400">
                        <p>Động cơ: <span className="text-slate-200">{spec?.engine || "Đang cập nhật"}</span></p>
                      </div>
                      <div className="mt-6 border-t border-white/10 pt-4 mt-auto">
                        <p className="mb-1 text-xs font-medium uppercase tracking-widest text-slate-500">Giá từ</p>
                        <p className="text-xl font-black text-cyan-400">
                          {formatVnd(startingPrice)}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            // Trạng thái trống (Chưa lưu xe nào)
            <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-white/20 bg-[#12141D]/50 py-20 text-center">
              <Car className="h-16 w-16 text-slate-600" />
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-300">Bộ sưu tập trống</h3>
                <p className="text-sm text-slate-500">Bạn chưa lưu chiếc xe nào vào danh sách yêu thích.</p>
              </div>
              <Link
                href="/danh-sach"
                className="mt-4 rounded-full bg-cyan-500 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]"
              >
                Khám phá xe ngay
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// Icon mượn tạm cho phần tiêu đề
function HeartIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}