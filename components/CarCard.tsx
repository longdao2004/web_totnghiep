/* eslint-disable @next/next/no-img-element */

import Link from "next/link";

type PriceValue =
  | {
      toNumber: () => number;
    }
  | number
  | string
  | null
  | undefined;

type CarCardProps = {
  car: {
    id: string;
    name: string;
    imageUrl: string | null;
    startingPrice: PriceValue;
    brand: {
      name: string;
    };
  };
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
      className="h-12 w-12 text-cyan-400/70"
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

export default function CarCard({ car }: CarCardProps) {
  const detailHref = `/xe/${car.id}`;
  const aiHref = `/tu-van-ai?model=${encodeURIComponent(car.name)}`;

  return (
    <article className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#12141D] shadow-[0_20px_70px_rgba(0,0,0,0.24)] transition duration-300 hover:-translate-y-1 hover:border-cyan-500/80">
      <div className="h-56 overflow-hidden bg-slate-900">
        {car.imageUrl ? (
          <img
            src={car.imageUrl}
            alt={`${car.brand.name} ${car.name}`}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-900">
            <CarPlaceholderIcon />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm font-medium text-slate-400">{car.brand.name}</p>
        <h3 className="mt-2 text-2xl font-bold tracking-tight text-white">
          {car.name}
        </h3>
        <p className="mt-4 text-lg font-bold text-cyan-400">
          {formatVnd(car.startingPrice)}
        </p>

        <div className="mt-7 grid grid-cols-2 gap-2">
          <Link
            href={detailHref}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-cyan-500 px-4 text-sm font-bold text-cyan-400 transition after:absolute after:inset-0 hover:bg-cyan-500 hover:text-slate-950"
          >
            Chi tiết
          </Link>
          <Link
            href={aiHref}
            className="relative z-10 inline-flex min-h-11 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 px-4 text-sm font-bold text-white shadow-[0_0_24px_rgba(34,211,238,0.28)] transition hover:-translate-y-0.5 hover:brightness-110"
          >
            Hỏi AI ✨
          </Link>
        </div>
      </div>
    </article>
  );
}
