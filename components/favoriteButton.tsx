"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast"; // Import thư viện thông báo

interface FavoriteButtonProps {
  carId: string;
  initialIsSaved?: boolean;
}

export default function FavoriteButton({ carId, initialIsSaved = false }: FavoriteButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isLoading, setIsLoading] = useState(false);

  async function toggleSave(e: React.MouseEvent) {
    e.preventDefault(); 
    e.stopPropagation();

    // 1. Nếu chưa đăng nhập -> Hiện thông báo xịn xò
    if (!session) {
      toast.error("Vui lòng đăng nhập để lưu xe yêu thích!", {
        style: {
          borderRadius: '16px',
          background: '#1e293b', // Màu nền tối
          color: '#fff',
          border: '1px solid rgba(34, 211, 238, 0.3)', // Viền màu Cyan
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
        },
        iconTheme: {
          primary: '#ef4444', // Trái tim lỗi màu đỏ
          secondary: '#fff',
        },
      });
      
      // Delay 1.5 giây để người dùng đọc kịp thông báo rồi mới chuyển sang trang Đăng nhập
      setTimeout(() => {
        router.push("/login");
      }, 1500);
      
      return;
    }

    setIsSaved(!isSaved);
    setIsLoading(true);

    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carId }),
      });

      if (!res.ok) throw new Error("Lỗi mạng");

      // Hiện thông báo nhỏ khi lưu thành công (Nếu muốn)
      if (!isSaved) {
        toast.success("Đã lưu vào danh sách yêu thích!", {
          style: {
            borderRadius: '16px',
            background: '#1e293b',
            color: '#fff',
            border: '1px solid rgba(34, 211, 238, 0.3)',
          },
          iconTheme: {
            primary: '#22d3ee', // Dấu tích màu Cyan
            secondary: '#fff',
          },
        });
      }

    } catch (error) {
      setIsSaved(isSaved);
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau.", {
        style: { background: '#1e293b', color: '#fff' }
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      onClick={toggleSave}
      disabled={isLoading}
      aria-label="Lưu xe yêu thích"
      // TĂNG KÍCH THƯỚC TẠI ĐÂY: h-12 w-12 thay vì h-10 w-10
      className={`absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 ${
        isSaved 
          ? "bg-red-500/10 text-red-500 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.5)]" 
          : "bg-black/30 text-white border border-white/20 hover:bg-black/60"
      }`}
    >
      {/* TĂNG KÍCH THƯỚC ICON TẠI ĐÂY: h-6 w-6 thay vì h-5 w-5 */}
      <Heart className={`h-6 w-6 transition-all ${isSaved ? "fill-current scale-110" : "scale-100"}`} />
    </button>
  );
}