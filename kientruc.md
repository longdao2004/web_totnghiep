# TÀI LIỆU KIẾN TRÚC HỆ THỐNG VÀ THIẾT KẾ CHỨC NĂNG
## DỰ ÁN: WEBSITE SO SÁNH VÀ TƯ VẤN LỰA CHỌN Ô TÔ TÍCH HỢP AI

Tài liệu này được thiết kế chuẩn cấu trúc Markdown nhằm cung cấp bức tranh tổng thể về kiến trúc hệ thống, cơ sở dữ liệu và sơ đồ các màn hình chức năng. Bạn có thể sử dụng file này làm "Context gốc" để nạp cho các AI Agent trong IDE (như VS Code Codex/Cursor/Copilot) hiểu và tự động sinh mã nguồn (scaffolding) cho toàn bộ dự án Next.js.

---

## 1. TỔNG QUAN CÔNG NGHỆ (TECH STACK)

Hệ thống được xây dựng hoàn toàn dựa trên nền tảng JavaScript/TypeScript toàn diện (Full-stack Single-Language) nhằm tối ưu hóa hiệu năng, giảm thiểu độ trễ và hỗ trợ AI Agent sinh code chính xác nhất.

* **Frontend (FE):** `Next.js 14+ (App Router)` kết hợp `TypeScript`. Giao diện được xây dựng bằng `TailwindCSS` và bộ component `Shadcn UI` / `Radix UI` để đảm bảo tính thẩm mỹ, hiện đại và chuẩn responsive.
* **Backend (BE):** `Next.js API Routes` (nằm trong thư mục `app/api/`). Hoạt động dưới dạng Edge/Serverless Functions giúp tối ưu chi phí và tốc độ phản hồi.
* **Database (DB):** `PostgreSQL` (Hệ quản trị cơ sở dữ liệu quan hệ chặt chẽ). Kết nối thông qua `Prisma ORM` để quản lý migration và truy vấn dữ liệu an toàn (Type-safe).
* **AI Integration:** `Gemini Pro API` (Google AI Studio) để xử lý logic chatbot tư vấn, phân tích ưu nhược điểm xe dựa trên kỹ thuật Prompt Engineering dữ liệu thực tế.

---

## 2. KIẾN TRÚC HỆ THỐNG (SYSTEM ARCHITECTURE)

Hệ thống áp dụng mô hình kiến trúc **Monolith hiện đại (Next.js Full-stack)** giúp tối giản việc triển khai nhưng vẫn đảm bảo tách biệt rõ ràng giữa tầng hiển thị và tầng xử lý dữ liệu.

```text
[ Trình duyệt Client ] (Next.js Frontend + TailwindCSS)
         │
         ▼ (HTTPS / JSON API Requests)
[ Next.js App Router /api ] (Backend API Routes)
         │
         ├──────────────────────────────┐
         ▼ (Prisma ORM / SQL)          ▼ (Google AI SDK)
[ Cơ sở dữ liệu PostgreSQL ]     [ Gemini AI Cloud ]
 (Lưu trữ thông số xe & Chat)     (Xử lý hội thoại thông minh)