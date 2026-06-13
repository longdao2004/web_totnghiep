/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import prisma from "@/lib/prisma";

type PriceValue =
  | {
      toNumber: () => number;
    }
  | number
  | string
  | null
  | undefined;

type CarDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatVnd(price: PriceValue) {
  if (!price) return "Liên hệ";

  const value =
    typeof price === "object" && "toNumber" in price
      ? price.toNumber()
      : Number(price);

  if (!Number.isFinite(value)) return "Liên hệ";

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

function CarPlaceholderIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-16 w-16 text-cyan-400/70"
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

function SpecCard({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <p className="text-sm font-medium text-slate-400">{label}</p>
      <p className="mt-2 text-base font-bold text-white">
        {value ?? "Đang cập nhật"}
      </p>
    </div>
  );
}

export default async function XeDetailPage({ params }: CarDetailPageProps) {
  const { slug } = await params;

  const car = await prisma.carModel.findUnique({
    where: {
      id: slug,
    },
    include: {
      brand: true,
      specifications: {
        orderBy: {
          price: "asc",
        },
      },
    },
  });

  if (!car) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#0B0C10] px-6 text-center">
        <h1 className="text-2xl font-bold text-white">
          Không tìm thấy thông tin xe
        </h1>
      </div>
    );
  }

  const specification = car.specifications[0];
  const startingPrice = car.startingPrice ?? specification?.price;
  const aiHref = `/tu-van-ai?model=${encodeURIComponent(car.name)}`;
  
  // Xử lý logic hiển thị các đơn vị đo lường
  const fuelConsumption = specification?.fuelConsumption
    ? `${specification.fuelConsumption} L/100km`
    : undefined;
  const seatingCapacity = specification?.seatingCapacity
    ? `${specification.seatingCapacity} chỗ`
    : undefined;
  const groundClearance = specification?.groundClearance
    ? `${specification.groundClearance} mm`
    : undefined;

  return (
    <div className="min-h-screen bg-[#0B0C10] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/15 px-5 text-sm font-bold text-slate-200 transition hover:border-cyan-400 hover:text-cyan-400 sm:w-fit"
          >
            Quay lại
          </Link>
          <Link
            href={aiHref}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 px-6 text-sm font-bold text-white shadow-[0_0_28px_rgba(34,211,238,0.28)] transition hover:-translate-y-0.5 hover:brightness-110 sm:w-fit"
          >
            Hỏi AI về dòng xe này ✨
          </Link>
        </div>

        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#12141D] shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
            {car.imageUrl ? (
              <img
                src={car.imageUrl}
                alt={`${car.brand.name} ${car.name}`}
                className="h-[320px] w-full object-cover md:h-[520px]"
              />
            ) : (
              <div className="flex h-[320px] w-full items-center justify-center bg-slate-900 md:h-[520px]">
                <CarPlaceholderIcon />
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#12141D] p-7 shadow-[0_30px_100px_rgba(0,0,0,0.28)] md:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-cyan-400">
              {car.brand.name}
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
              {car.name}
            </h1>

            <div className="mt-8 grid gap-5">
              <div>
                <p className="text-sm font-medium text-slate-400">Phân khúc</p>
                <p className="mt-2 text-xl font-bold text-white">
                  {car.segment ?? "Đang cập nhật"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">
                  Giá bán khởi điểm
                </p>
                <p className="mt-2 text-3xl font-black text-cyan-400">
                  {formatVnd(startingPrice)}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-cyan-400">
              Car Specifications
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
              Thông số kỹ thuật
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <SpecCard label="Động cơ" value={specification?.engine} />
            <SpecCard label="Hộp số" value={specification?.transmission} />
            <SpecCard label="Số chỗ ngồi" value={seatingCapacity} />
            <SpecCard label="Kích thước" value={specification?.dimensions} />
            <SpecCard label="Khoảng sáng gầm" value={groundClearance} />
            <SpecCard label="Hệ dẫn động" value={specification?.drivetrain} />
            <SpecCard label="Công suất" value={specification?.power} />
            <SpecCard label="Mô-men xoắn" value={specification?.torque} />
            <SpecCard label="Mức tiêu hao nhiên liệu" value={fuelConsumption} />
          </div>
        </section>
      </div>
    </div>
  );
}