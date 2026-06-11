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

// Bộ lọc tin nhắn an toàn (Từ code của bạn)
function formatMessagesForGroq(
  messages: IncomingMessage[],
  systemInstruction: string,
): ChatCompletionMessageParam[] {
  const formattedMessages: ChatCompletionMessageParam[] = [
    { role: "system", content: systemInstruction },
  ];

  for (const message of messages) {
    const content = message.content?.trim();
    if (!content) continue;

    if (message.role === "user") {
      formattedMessages.push({ role: "user", content });
      continue;
    }

    if (message.role === "assistant" || message.role === "model") {
      formattedMessages.push({ role: "assistant", content });
    }
  }

  return formattedMessages;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Hệ thống chưa cấu hình GROQ_API_KEY" }, { status: 500 });
    }

    const body = await req.json();
    const messages: IncomingMessage[] = Array.isArray(body.messages) ? body.messages : [];

    if (messages.length === 0) {
      return NextResponse.json({ error: "Tin nhắn không được để trống" }, { status: 400 });
    }

    // 1. Lấy dữ liệu xe từ Database (RAG) - Lấy 20 xe để đa dạng dữ liệu
    const cars = await prisma.carModel.findMany({
      take: 20, 
      include: {
        brand: { select: { name: true } },
        specifications: { take: 1, select: { engine: true, seatingCapacity: true } }
      }
    });

    // 2. Ép kiểu dữ liệu để AI hiểu rõ phân khúc xe và link ảnh (Từ code của mình)
    let carContext = "Dữ liệu xe CÓ SẴN trong cửa hàng hiện tại:\n";
    cars.forEach((car: any, index) => {
      const spec = car.specifications[0];
      const seats = spec?.seatingCapacity ? `${spec.seatingCapacity} chỗ` : "Chưa rõ";
      const engine = spec?.engine ? spec.engine : "Chưa rõ";
      
      carContext += `${index + 1}. Xe ${car.brand?.name} ${car.name}\n`;
      carContext += `   - Phân khúc/Dáng xe: ${car.bodyType || "Chưa rõ"}\n`;
      carContext += `   - Số chỗ: ${seats}\n`;
      carContext += `   - Động cơ: ${engine}\n`;
      carContext += `   - Giá bán: ${formatPrice(car.startingPrice)}\n`;
      carContext += `   - Link ảnh gốc: ${car.imageUrl || ""}\n\n`;
    });

    // 3. Kỷ luật thép + Quy tắc xuất ảnh Markdown
    const systemInstruction = `Bạn là chuyên gia tư vấn ô tô chuyên nghiệp và tận tâm tại Việt Nam.

QUY TẮC BẮT BUỘC:
1. CHỈ TƯ VẤN dựa trên danh sách xe được cung cấp dưới đây.
2. Nếu khách hàng hỏi loại xe hoặc tiêu chí không tồn tại trong danh sách, phải trả lời trung thực: "Xin lỗi, hiện tại tôi không có mẫu xe nào phù hợp với yêu cầu này." Sau đó chủ động gợi ý họ tham khảo các lựa chọn có sẵn trong danh sách.
3. Tuyệt đối không tự ý bịa đặt thông số kỹ thuật hoặc thông tin xe nằm ngoài danh sách.
4. Trả lời ngắn gọn, tập trung đúng vào nhu cầu, ngôn từ lịch sự, thân thiện.

QUY TẮC HIỂN THỊ HÌNH ẢNH:
- Mỗi khi giới thiệu, nhắc đến hoặc gợi ý một mẫu xe cụ thể nào đó cho khách hàng, bạn BẮT BUỘC phải chèn link ảnh của xe đó ngay phía dưới tên xe bằng cú pháp Markdown chính xác: ![tên xe](Link ảnh gốc).
- Ví dụ cú pháp: ![Toyota Veloz Cross](https://placehold.co/800x450/1e293b/38bdf8?text=Toyota+Veloz+Cross)
- Tuyệt đối giữ nguyên link ảnh gốc được cung cấp, không tự ý sửa đổi link.

${carContext}`;

    const formattedMessages = formatMessagesForGroq(messages, systemInstruction);

    // 4. Gọi Groq an toàn
    const groq = new Groq({ apiKey });
    const response = await groq.chat.completions.create({
      model: groqModelName,
      messages: formattedMessages,
      temperature: 0.2, // Giữ nhiệt độ thấp để ra Markdown ảnh chuẩn xác
    });

    const result = response.choices[0]?.message?.content;
    if (!result) {
      return NextResponse.json({ error: "Groq không trả về nội dung phản hồi" }, { status: 500 });
    }

    return NextResponse.json({ text: result });

  } catch (error: unknown) {
    console.error("🚨 LỖI BACKEND AI:", error);
    if (error instanceof Error && error.message.includes("429")) {
      return NextResponse.json(
        { error: "Hệ thống AI đang bận. Vui lòng thử lại sau vài giây!" },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { error: "Lỗi kết nối bộ não AI." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}