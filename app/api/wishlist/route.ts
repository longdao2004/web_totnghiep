import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    // 1. Kiểm tra xem người dùng đã đăng nhập chưa
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Vui lòng đăng nhập để lưu xe" }, { status: 401 });
    }

    // 2. Lấy ID của chiếc xe được bấm
    const { carId } = await req.json();

    // 3. Tìm người dùng trong Database kèm theo danh sách xe họ đã lưu
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { savedCars: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Không tìm thấy người dùng" }, { status: 404 });
    }

    // 4. Kiểm tra xem chiếc xe này đã có trong danh sách yêu thích chưa
    const isSaved = user.savedCars.some((car) => car.id === carId);

    if (isSaved) {
      // NẾU ĐÃ LƯU RỒI -> Bấm vào là BỎ LƯU (Hủy thả tim)
      await prisma.user.update({
        where: { id: user.id }, // Đổi sang dùng ID thay vì email để tránh lỗi TypeScript
        data: { savedCars: { disconnect: { id: carId } } },
      });
      return NextResponse.json({ message: "Đã bỏ lưu xe", isSaved: false });
    } else {
      // NẾU CHƯA LƯU -> Thêm vào danh sách (Thả tim)
      await prisma.user.update({
        where: { id: user.id }, // Đổi sang dùng ID
        data: { savedCars: { connect: { id: carId } } },
      });
      return NextResponse.json({ message: "Đã lưu xe thành công", isSaved: true });
    }
  } catch (error) {
    console.error("🚨 LỖI LƯU XE:", error);
    return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 });
  }
}