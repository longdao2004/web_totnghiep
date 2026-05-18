/* eslint-disable @next/next/no-img-element */

import { connection } from "next/server";
import prisma from "@/lib/prisma";

async function getCars() {
  return prisma.carModel.findMany({
    include: {
      brand: {
        select: {
          name: true,
          logoUrl: true,
        },
      },
      specifications: {
        select: {
          price: true,
          engine: true,
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

function formatVnd(price: { toNumber: () => number } | null | undefined) {
  if (!price) return "Liên hệ";

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price.toNumber());
}

export default async function HomePage() {
  await connection();

  const cars = await getCars();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="bg-slate-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
            Car AI Project
          </p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
            Khám phá các dòng xe nổi bật
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
            Cập nhật thông tin hãng xe, phân khúc, động cơ và giá bán để hỗ trợ
            quá trình so sánh, lựa chọn ô tô phù hợp.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-cyan-700">
              {cars.length} mẫu xe
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-slate-950">
              Danh sách xe ô tô
            </h2>
          </div>
        </div>

        {cars.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <h3 className="text-lg font-semibold text-slate-900">
              Chưa có xe nào trong hệ thống
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Hãy thêm dữ liệu vào bảng CarModel, Brand và CarSpecification để
              hiển thị danh sách xe tại đây.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => {
              const baseSpecification = car.specifications[0];
              const startingPrice = car.startingPrice ?? baseSpecification?.price;

              return (
                <article
                  key={car.id}
                  className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  {car.imageUrl ? (
                    <img
                      src={car.imageUrl}
                      alt={`${car.brand.name} ${car.name}`}
                      className="h-48 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-48 w-full items-center justify-center bg-slate-200 text-sm font-medium text-slate-500">
                      Chưa có hình ảnh
                    </div>
                  )}

                  <div className="space-y-5 p-5">
                    <div className="flex items-center gap-3">
                      {car.brand.logoUrl ? (
                        <img
                          src={car.brand.logoUrl}
                          alt={car.brand.name}
                          className="h-9 w-9 rounded-full border border-slate-200 object-contain p-1"
                        />
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                          {car.brand.name.charAt(0)}
                        </div>
                      )}

                      <div>
                        <p className="text-sm font-medium text-slate-500">
                          {car.brand.name}
                        </p>
                        <h3 className="text-xl font-bold text-slate-950">
                          {car.name}
                        </h3>
                      </div>
                    </div>

                    <div className="grid gap-3 text-sm text-slate-600">
                      <div className="flex items-center justify-between gap-4">
                        <span>Phân khúc</span>
                        <span className="font-semibold text-slate-900">
                          {car.segment ?? "Đang cập nhật"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span>Động cơ</span>
                        <span className="text-right font-semibold text-slate-900">
                          {baseSpecification?.engine ?? "Đang cập nhật"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span>Giá từ</span>
                        <span className="text-right font-bold text-cyan-700">
                          {formatVnd(startingPrice)}
                        </span>
                      </div>
                    </div>

                    <a
                      href={`/xe/${car.id}`}
                      className="block rounded-md bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-cyan-700"
                    >
                      Xem chi tiết
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
