import { connection } from "next/server";
import CarCard from "@/components/CarCard";
import prisma from "@/lib/prisma";

async function getCars() {
  return prisma.carModel.findMany({
    include: {
      brand: {
        select: {
          name: true,
        },
      },
      specifications: {
        select: {
          price: true,
        },
        orderBy: {
          price: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

function CarIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-8 w-8 text-cyan-400"
      fill="none"
    >
      <path
        d="M5 14h14M7 18h.01M17 18h.01M6.5 10l1.7-4h7.6l1.7 4M5 14v4m14-4v4M4 10h16v5H4v-5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AiIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-8 w-8 text-cyan-400"
      fill="none"
    >
      <path
        d="M9 18h6M10 21h4M8 14.5a6 6 0 1 1 8 0c-.8.7-1 1.4-1 2.5H9c0-1.1-.2-1.8-1-2.5ZM12 8v4M9.8 10h4.4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default async function HomePage() {
  await connection();

  const cars = await getCars();

  return (
    <div className="min-h-screen bg-[#0B0C10] text-white">
      <section className="px-6 py-12 md:py-14">
        <div className="mx-auto max-w-7xl">
          <div
            className="relative min-h-[420px] overflow-hidden rounded-3xl border border-cyan-400/20 bg-cover bg-center shadow-[0_30px_120px_rgba(0,0,0,0.55)] md:min-h-[610px]"
            style={{ backgroundImage: "url('/hero-car-neon.jpg')" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/45 to-black/25" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10]/90 via-transparent to-transparent" />

            <div className="relative flex min-h-[420px] max-w-4xl flex-col justify-end px-7 pb-12 md:min-h-[610px] md:px-14 md:pb-16">
              <p className="mb-6 text-xs font-bold uppercase tracking-[0.32em] text-cyan-400">
                TRÍ TUỆ THẾ HỆ MỚI
              </p>
              <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
                Tương lai của hiệu suất
                <span className="block text-cyan-400">
                  Được dẫn dắt bởi AI
                </span>
              </h1>
            </div>
          </div>

          <div className="mt-7 grid gap-6 lg:grid-cols-2">
            <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.28)] transition hover:border-cyan-400/40">
              <CarIcon />
              <div className="mt-20">
                <h2 className="text-xl font-bold text-white">
                  Phân tích mẫu xe
                </h2>
                <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
                  Giải mã hiệu suất và cung cấp công cụ so sánh theo thời gian
                  thực cho quá trình tìm hiểu xe thông minh hơn.
                </p>
              </div>
            </article>

            <article className="relative rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.28)] transition hover:border-cyan-400/40">
              <span className="absolute right-8 top-8 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[10px] font-bold tracking-widest text-cyan-300">
                BETA
              </span>
              <AiIcon />
              <div className="mt-20">
                <h2 className="text-xl font-bold text-white">
                  Công cụ gợi ý bằng AI
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                  Để hệ thống AI tìm mẫu xe phù hợp nhất dựa trên lối sống, nhu
                  cầu vận hành, ngân sách và mục tiêu sử dụng của bạn.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 pt-8">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-cyan-400">
            {cars.length} mẫu xe
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">
            Khám phá các dòng xe
          </h2>
        </div>

        {cars.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-cyan-400/30 bg-white/[0.04] px-6 py-14 text-center">
            <h3 className="text-lg font-semibold text-white">
              Chưa có xe nào trong hệ thống
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Hãy thêm dữ liệu vào bảng CarModel, Brand và CarSpecification để
              hiển thị danh sách xe tại đây.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => {
              const startingPrice =
                car.startingPrice ?? car.specifications[0]?.price ?? null;

              return (
                <CarCard
                  key={car.id}
                  car={{
                    id: car.id,
                    name: car.name,
                    imageUrl: car.imageUrl,
                    startingPrice,
                    brand: {
                      name: car.brand.name,
                    },
                  }}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
