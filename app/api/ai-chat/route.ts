import { Prisma, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
const ollamaModel = process.env.OLLAMA_MODEL?.trim() || "qwen2.5:3b";

const systemInstruction = `
Bạn là chuyên gia tư vấn ô tô tại Việt Nam. Nhiệm vụ của bạn là tư vấn xe chính xác, ngắn gọn, thực tế và dễ hiểu dựa trên dữ liệu được cung cấp.

QUY TẮC BẮT BUỘC:
1. Chỉ được tư vấn dựa trên danh sách xe trong phần "Dữ liệu xe". Không được tự ý nêu, gợi ý hoặc bịa thông tin về mẫu xe không có trong danh sách đó.
2. Khi khách hàng hỏi theo phân khúc/kiểu dáng như Sedan, SUV, Crossover, Hatchback, MPV, Pickup..., bạn phải tự lọc từ trường "Phân khúc" trong "Dữ liệu xe".
3. Không được gọi sai phân khúc. Nếu dữ liệu ghi "Phân khúc: SUV" thì chỉ xem xe đó là SUV; nếu ghi "Sedan" thì chỉ xem là Sedan.
4. Nếu không tìm thấy xe phù hợp với phân khúc, ngân sách hoặc nhu cầu trong "Dữ liệu xe", hãy nói lịch sự rằng hiện chưa tìm thấy mẫu xe phù hợp trong cơ sở dữ liệu, không được tự bịa mẫu xe khác.
5. Nếu dữ liệu thiếu thông tin, hãy nói rõ là dữ liệu chưa cập nhật thay vì suy đoán.
6. Khi trả lời, ưu tiên nêu tên xe, thương hiệu, phân khúc và giá. Có thể dùng markdown để trình bày gọn gàng.
`.trim();

type ChatMessage = {
  role: "user" | "model" | "assistant" | "system";
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
    return "Chưa có giá";
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
    return "Hiện database chưa có dữ liệu xe.";
  }

  return cars
    .map((car, index) => {
      const specification = car.specifications[0];
      const carSegment = car.bodyType?.trim() || car.segment?.trim() || "Đang cập nhật";

      return [
        `${index + 1}. ${car.brand.name} ${car.name}`,
        `Phân khúc: ${carSegment}`,
        `Giá: ${formatPrice(car.startingPrice)}`,
        specification?.engine ? `Động cơ: ${specification.engine}` : null,
        specification?.seatingCapacity
          ? `Số chỗ: ${specification.seatingCapacity}`
          : null,
        specification?.fuelType ? `Nhiên liệu: ${specification.fuelType}` : null,
        specification?.transmission
          ? `Hộp số: ${specification.transmission}`
          : null,
      ]
        .filter(Boolean)
        .join(" | ");
    })
    .join("\n");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages: ChatMessage[] = Array.isArray(body.messages)
      ? body.messages
      : [];

    if (messages.length === 0) {
      return NextResponse.json(
        { error: "Tin nhắn không được để trống" },
        { status: 400 },
      );
    }

    const cars = await prisma.carModel.findMany({
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
    const formattedMessages = messages
      .filter((msg) => Boolean(msg.content?.trim()))
      .map((msg) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      }));

    const ollamaMessages = [
      {
        role: "system",
        content: `${systemInstruction}\n\nDữ liệu xe:\n${carContext}`,
      },
      ...formattedMessages,
    ];

    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: ollamaModel,
        messages: ollamaMessages,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(
        "Ollama không phản hồi. Hãy chắc chắn phần mềm Ollama đang mở.",
      );
    }

    const data = await response.json();

    return NextResponse.json({ text: data.message.content });
  } catch (error) {
    console.error("Lỗi backend Local AI:", error);

    return NextResponse.json(
      { error: "Lỗi kết nối Local AI. Vui lòng kiểm tra Ollama." },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
