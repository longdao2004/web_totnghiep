import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // 1. Kiểm tra dữ liệu đầu vào
    if (!email || !password) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ email và mật khẩu." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Mật khẩu phải có ít nhất 6 ký tự." },
        { status: 400 }
      );
    }

    // 2. Kiểm tra xem email này đã có ai đăng ký chưa
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email này đã được sử dụng. Vui lòng thử đăng nhập." },
        { status: 400 }
      );
    }

    // 3. Mã hóa mật khẩu siêu an toàn (Hashing)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Lưu người dùng mới vào Database
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        // role sẽ tự động nhận giá trị mặc định là USER (như chúng ta đã thiết lập trong schema)
      },
    });

    // 5. Trả về thông báo thành công (Tuyệt đối không trả về mật khẩu dù đã mã hóa)
    return NextResponse.json(
      {
        message: "Tạo tài khoản thành công!",
        user: { id: newUser.id, name: newUser.name, email: newUser.email },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("🚨 LỖI ĐĂNG KÝ TÀI KHOẢN:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}