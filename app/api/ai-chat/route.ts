import { GoogleGenerativeAI } from "@google/generative-ai";
import { Prisma, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

const systemInstruction =
  "Ban la mot chuyen gia tu van xe o to nhiet tinh va giau kinh nghiem tai Viet Nam. Nhiem vu cua ban la tu van cho nguoi dung chon mua xe phu hop voi nhu cau, ngan sach va so thich. Hay tra loi ngan gon, than thien, de hieu va dung markdown de format noi dung. Neu nguoi hoi ve gia xe hoac thong so, hay uu tien cac thong tin pho bien tai thi truong Viet Nam.";
const geminiModel = process.env.GEMINI_MODEL?.trim() || "gemini-2.0-flash";

type ChatMessage = {
  role: "user" | "model";
  content: string;
};

type CarWithContext = Prisma.CarModelGetPayload<{
  include: {
    brand: {
      select: {
        name: true;
      };
    };
    specifications: {
      take: 1;
      select: {
        engine: true;
        seatingCapacity: true;
        fuelType: true;
        transmission: true;
      };
    };
  };
}>;

function formatPrice(price: unknown) {
  if (!price) {
    return "Chua co gia";
  }

  const value = Number(price);

  if (Number.isNaN(value)) {
    return String(price);
  }

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

function buildCarContext(cars: CarWithContext[]) {
  if (cars.length === 0) {
    return "Hien database chua co du lieu xe.";
  }

  return cars
    .map((car, index) => {
      const specification = car.specifications[0];

      return [
        `${index + 1}. ${car.brand.name} ${car.name}`,
        `Gia tu: ${formatPrice(car.startingPrice)}`,
        specification?.engine ? `Dong co: ${specification.engine}` : null,
        specification?.seatingCapacity
          ? `So cho: ${specification.seatingCapacity}`
          : null,
        specification?.fuelType ? `Nhien lieu: ${specification.fuelType}` : null,
        specification?.transmission
          ? `Hop so: ${specification.transmission}`
          : null,
      ]
        .filter(Boolean)
        .join(" | ");
    })
    .join("\n");
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (!apiKey) {
      return NextResponse.json(
        { error: "Thieu GEMINI_API_KEY trong file .env." },
        { status: 500 },
      );
    }

    const body = await req.json();
    const messages: ChatMessage[] = Array.isArray(body.messages)
      ? body.messages
      : [];

    if (messages.length === 0) {
      return NextResponse.json(
        { error: "Messages phai co it nhat mot tin nhan." },
        { status: 400 },
      );
    }

    const lastMessage = messages[messages.length - 1]?.content?.trim();

    if (!lastMessage) {
      return NextResponse.json(
        { error: "Tin nhan moi nhat dang rong." },
        { status: 400 },
      );
    }

    const previousMessages = messages
      .slice(0, -1)
      .filter((msg, index) => !(index === 0 && msg.role === "model"))
      .filter((msg) => Boolean(msg.content?.trim()));

    const formattedHistory = previousMessages.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const cars = await prisma.carModel.findMany({
      take: 5,
      orderBy: {
        startingPrice: "asc",
      },
      include: {
        brand: {
          select: {
            name: true,
          },
        },
        specifications: {
          take: 1,
          select: {
            engine: true,
            seatingCapacity: true,
            fuelType: true,
            transmission: true,
          },
        },
      },
    });

    const carContext = buildCarContext(cars);
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: geminiModel,
      systemInstruction: `${systemInstruction}\n\nDu lieu xe hien co trong he thong:\n${carContext}`,
    });

    const chat = model.startChat({ history: formattedHistory });
    const result = await chat.sendMessage(lastMessage);

    return NextResponse.json({ text: result.response.text() });
  } catch (error) {
    console.error("Backend Error:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Khong the xu ly yeu cau chat luc nay.";
    const isQuotaError =
      errorMessage.includes("429") ||
      errorMessage.toLowerCase().includes("quota") ||
      errorMessage.toLowerCase().includes("too many requests");
    const isDevelopment = process.env.NODE_ENV === "development";

    return NextResponse.json(
      {
        error: isQuotaError
          ? "Gemini API dang het quota hoac bi gioi han toc do. Vui long doi mot lat, doi API key, hoac bat billing cho project Google AI."
          : isDevelopment
          ? `Loi backend: ${errorMessage}`
          : "Khong the xu ly yeu cau chat luc nay.",
      },
      { status: isQuotaError ? 429 : 500 },
    );
  }
}
