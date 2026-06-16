"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast"; // Import thêm thư viện

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      {/* Cấu hình hiển thị thông báo ở góc dưới bên phải */}
      <Toaster position="bottom-right" reverseOrder={false} />
    </SessionProvider>
  );
}