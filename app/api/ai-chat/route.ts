import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import Groq from "groq-sdk";
import type { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";

const prisma = new PrismaClient();
const groqModelName = process.env.GROQ_MODEL?.trim() || "llama-3.3-70b-versatile";

type IncomingMessage = {
  role?: string;
  content?: string;
};

// Hàm tiện ích: Định dạng giá tiền
function formatPrice(price: unknown) {
  if (!price) return "Chưa có giá";
  const value = Number(price);
  if (Number.isNaN(value)) return String(price);
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatMessagesForGroq(
  messages: IncomingMessage[],
  systemInstruction: string,
): ChatCompletionMessageParam[] {
  const formattedMessages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: systemInstruction,
    },
  ];

  for (const message of messages) {
    const content = message.content?.trim();
    if (!content) continue;

    if (message.role === "user") {
      formattedMessages.push({
        role: "user",
        content,
      });
      continue;
    }

    if (message.role === "assistant" || message.role === "model") {
      formattedMessages.push({
        role: "assistant",
        content,
      });
    }
  }

  return formattedMessages;
}

export async function POST(req: Request) {
  console.log("🚀 HỆ THỐNG ĐANG CHẠY Ở MÔI TRƯỜNG:", process.env.NODE_ENV);

  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Hệ thống chưa cấu hình GROQ_API_KEY" },
        { status: 500 },
      );
    }

    const body = await req.json();
    const messages: IncomingMessage[] = Array.isArray(body.messages)
      ? body.messages
      : [];

    if (messages.length === 0) {
      return NextResponse.json(
        { error: "Tin nhắn không được để trống" },
        { status: 400 },
      );
    }

    // 1. Lấy dữ liệu xe từ Database (RAG)
    const cars = await prisma.carModel.findMany({
      take: 10, // Lấy nhiều hơn một chút để AI có dữ liệu lọc
      include: {
        brand: { select: { name: true } },
        specifications: {
          take: 1,
          select: { engine: true, seatingCapacity: true },
        },
      },
    });

    // Ép kiểu dữ liệu để AI hiểu rõ phân khúc xe
    let carContext = "Dữ liệu xe có sẵn trong Database:\n";
    cars.forEach((car, index) => {
      // Giả sử database chưa có bodyStyle, ta dùng số chỗ ngồi để AI tạm ước lượng
      const spec = car.specifications[0];
      const seats = spec?.seatingCapacity
        ? `${spec.seatingCapacity} chỗ`
        : "Chưa rõ";
      carContext += `${index + 1}. Xe ${car.brand?.name} ${car.name} | Loại: ${seats} | Giá: ${formatPrice(car.startingPrice)}.\n`;
    });

    const systemInstruction = `Bạn là chuyên gia tư vấn ô tô tại Việt Nam.
QUY TẮC BẮT BUỘC:
1. CHỈ TƯ VẤN dựa trên danh sách xe được cung cấp dưới đây.
2. Nếu khách hỏi loại xe không có trong danh sách, phải trả lời: "Xin lỗi, hiện tại tôi không có mẫu xe nào phù hợp với yêu cầu này."
3. Không tự ý bịa đặt thông tin xe bên ngoài.
4. Trả lời ngắn gọn, thân thiện, ưu tiên nêu tên xe, thương hiệu, loại xe và giá.

${carContext}`;

    const formattedMessages = formatMessagesForGroq(
      messages,
      systemInstruction,
    );

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const response = await groq.chat.completions.create({
      model: groqModelName,
      messages: formattedMessages,
    });

    const result = response.choices[0]?.message?.content;
    if (!result) {
      return NextResponse.json(
        { error: "Groq không trả về nội dung phản hồi" },
        { status: 500 },
      );
    }

    return NextResponse.json({ text: result });
  } catch (error: unknown) {
    console.error("🚨 LỖI BACKEND AI:", error);
    if (error instanceof Error && error.message.includes("429")) {
      return NextResponse.json(
        { error: "Hệ thống AI đang bận. Vui lòng thử lại sau vài giây!" },
        { status: 429 },
      );
    }
    return NextResponse.json(
      { error: "Lỗi kết nối bộ não AI." },
      { status: 500 },
    );
  } finally {
    // Luôn luôn đóng kết nối Database để tránh sập server
    await prisma.$disconnect();
  }
}
