import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Tách cấu hình ra thành một biến riêng và export để dùng lại ở các API khác
export const authOptions: NextAuthOptions = {
  // 1. Cấu hình phương thức đăng nhập (Bằng Email & Password)
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Vui lòng nhập đầy đủ email và mật khẩu");
        }

        // 2. Tìm người dùng trong Database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          throw new Error("Tài khoản không tồn tại");
        }

        // 3. Giải mã và so sánh mật khẩu
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("Mật khẩu không chính xác");
        }

        // 4. Nếu đúng, trả về thông tin người dùng
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    })
  ],
  // Cấu hình Session bằng JWT (JSON Web Token)
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // Đăng nhập tồn tại trong 30 ngày
  },
  // Chuyển hướng các trang báo lỗi về trang login của chúng ta
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };