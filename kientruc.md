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

 car-comparison-ai/
├── app/                        # Next.js App Router
│   ├── api/                    # Tầng Backend API Routes
│   │   ├── cars/route.ts       # API lấy/thêm dữ liệu xe
│   │   ├── compare/route.ts    # API xử lý so sánh nâng cao
│   │   └── ai-chat/route.ts    # API kết nối Gemini AI tư vấn
│   ├── page.tsx                # Màn hình Trang chủ
│   ├── so-sanh/page.tsx        # Màn hình So sánh xe
│   ├── tu-van-ai/page.tsx      # Màn hình Chatbot AI
│   ├── danh-sach/page.tsx      # Màn hình Bộ lọc & Tìm kiếm xe
│   └── xe/[slug]/page.tsx      # Màn hình Chi tiết dòng xe
├── components/                 # Các UI Components dùng chung (Navbar, Card, Dialog...)
├── lib/                        # Thư viện dùng chung (prisma.ts, gemini.ts)
├── prisma/                     # Cấu hình Database & Schema Migration
│   └── schema.prisma
├── public/                     # Tài nguyên tĩnh (Logo, Icons)
└── .env.local                  # Biến môi trường (DATABASE_URL, GEMINI_API_KEY)

3. THIẾT KẾ CƠ SỞ DỮ LIỆU (POSTGRESQL SCHEMA VIA PRISMA)
Dữ liệu ô tô mang tính chất quan hệ cao (Một hãng xe có nhiều dòng xe, một dòng xe có nhiều phiên bản thông số). Dưới đây là thiết kế các bảng dữ liệu chuẩn hóa:

Bảng 1: Hãng Xe (Brand)
id: String (Primary Key, UUID)

name: String (Tên hãng, ví dụ: Toyota, Hyundai, Mitsubishi)

logoUrl: String (Đường link ảnh logo hãng)

slug: String (Unique, dùng cho SEO URL)

createdAt: DateTime

updatedAt: DateTime

Bảng 2: Dòng Xe (CarModel)
id: String (Primary Key, UUID)

brandId: String (Foreign Key kết nối với bảng Brand)

name: String (Tên dòng xe, ví dụ: Veloz Cross, Xpander, Creta)

type: String (Phân khúc: SUV, Sedan, MPV, Hatchback...)

fuelType: String (Xăng, Dầu, Điện, Hybrid)

priceMin: Int (Giá sàn thấp nhất)

priceMax: Int (Giá trần cao nhất)

mainImageUrl: String (Ảnh đại diện chính của xe)

createdAt: DateTime

updatedAt: DateTime

Bảng 3: Phiên Bản & Thông Số Kỹ Thuật Chi Tiết (CarSpecification)
id: String (Primary Key, UUID)

modelId: String (Foreign Key kết nối với bảng CarModel)

versionName: String (Tên phiên bản, ví dụ: Top, Premium, Tiêu chuẩn)

price: Int (Giá bán chính xác của phiên bản)

engine: String (Dung tích xi lanh / Động cơ)

transmission: String (Hộp số: Tự động CVT, Số sàn 5 cấp...)

power: String (Công suất tối đa - mã lực)

fuelConsumption: Float (Mức tiêu hao nhiên liệu hỗn hợp l/100km)

airbags: Int (Số túi khí)

safetyFeatures: String[] (Mảng các tính năng an toàn: ABS, EBD, Cảnh báo tiền va chạm...)

dimensions: String (Kích thước Dài x Rộng x Cao)

createdAt: DateTime

updatedAt: DateTime

4. DANH SÁCH CHỨC NĂNG VÀ MÀN HÌNH TƯƠNG ỨNG
Chức năng 1: Trang chủ & Bộ lọc thông minh
Màn hình tương ứng: Trang chủ (app/page.tsx) & Trang danh sách (app/danh-sach/page.tsx).

Mô tả UI/UX:

Khu vực Hero banner sang trọng với thanh tìm kiếm nhanh tên xe.

Khối hiển thị danh sách các Hãng xe phổ biến tại Việt Nam (bấm vào lọc theo hãng).

Bộ lọc đa điều kiện thông minh (Smart Filter sidebar): Cho phép người dùng kéo chọn khoảng giá (Ví dụ: 500 triệu - 700 triệu), chọn kiểu dáng (SUV/MPV), chọn loại nhiên liệu.

Danh sách kết quả trả về hiển thị dạng lưới (Grid Card), mỗi card gồm: ảnh xe, tên xe, phân khúc, khoảng giá và nút "Thêm vào danh sách so sánh".

Chức năng 2: So sánh thông số xe chuyên sâu
Màn hình tương ứng: Trang So sánh (app/so-sanh/page.tsx).

Mô tả UI/UX:

Giao diện chia cột thông minh (cho phép chọn tối đa 3 phiên bản xe cùng lúc để đối chiếu).

Có các ô tìm kiếm trống kèm nút + để người dùng chọn xe muốn thêm vào bảng so sánh.

Bảng đối chiếu thông số dọc (Comparison Matrix): Hiển thị rõ các hàng tiêu chí bao gồm: Giá bán, Động cơ, Kích thước, Tiêu hao nhiên liệu, Tiện nghi, Hệ thống an toàn.

Tính năng Highlight điểm khác biệt: Một nút chuyển đổi (Toggle switch) cho phép ẩn đi các hàng thông số giống nhau, chỉ làm nổi bật hoặc tô màu nền (ví dụ màu xanh nhạt) những hàng có thông số khác nhau giữa các xe để người dùng dễ nhận biết xe nào vượt trội hơn.

Chức năng 3: Trợ lý AI tư vấn lựa chọn xe cá nhân hóa
Màn hình tương ứng: Trang Trợ lý AI (app/tu-van-ai/page.tsx).

Mô tả UI/UX:

Thiết kế giao diện dạng khung Chatbot hiện đại (tương tự ChatGPT/Gemini web).

Bên cạnh trái là lịch sử các phiên tư vấn cũ, bên phải là khung chat realtime.

Gợi ý Prompt sẵn có (Quick Prompts): Đưa ra sẵn các nút bong bóng gợi ý câu hỏi phổ biến để người dùng bấm nhanh như: "Tầm 600 triệu mua xe gia đình nào tiết kiệm xăng?", "So sánh giúp tôi ưu nhược điểm của Veloz Top và Xpander Premium dưới góc nhìn chuyên gia".

Cơ chế AI thông minh (RAG kết hợp Prompt Engineering): Khi người dùng đặt câu hỏi, Backend API của Next.js sẽ tự động truy vấn dữ liệu thông số chính xác của các dòng xe liên quan trong PostgreSQL, đóng gói thành ngữ cảnh chuẩn (Context) rồi mới gửi kèm câu hỏi qua Gemini API. Việc này giúp AI trả lời chính xác thông số thực tế của thị trường ô tô Việt Nam, tránh hiện tượng AI tự "bịa" ra thông số sai lệch.

Chức năng 4: Xem chi tiết dòng xe & Đánh giá tổng hợp
Màn hình tương ứng: Trang Chi tiết xe (app/xe/[slug]/page.tsx).

Mô tả UI/UX:

Ảnh banner lớn toàn cảnh xe, các góc nhìn ngoại thất, nội thất (Carousel slider).

Bảng tóm tắt nhanh các điểm ăn tiền của xe.

Tab chia hai nội dung rõ rệt:

Thông số kỹ thuật: Hiển thị chi tiết tất cả phiên bản hiện có.

AI Phân tích (AI Insights): Một khối nội dung được sinh tự động bằng AI, phân tích cụ thể 3 mục: Ưu điểm cốt lõi, Nhược điểm cần lưu ý, và Mẫu chân dung khách hàng phù hợp nhất với dòng xe này.

5. THIẾT KẾ CÁC ĐẦU MÃ API (BACKEND API ROUTES)
Các file xử lý API này sẽ nhận request từ Frontend, tương tác với PostgreSQL qua Prisma hoặc kết nối Cloud API và trả về dữ liệu định dạng JSON chuẩn:

API Lấy danh sách & Lọc xe: GET /api/cars?brand=...&priceMin=...&priceMax=...&type=...

Mô tả: Trả về mảng danh sách các dòng xe thỏa mãn bộ lọc để render ra UI.

API So sánh chi tiết: POST /api/compare

Body truyền lên: [id_version_1, id_version_2, id_version_3]

Mô tả: Lấy toàn bộ thông số chi tiết của các ID phiên bản truyền lên để dựng bảng ma trận đối chiếu.

API Chatbot AI tư vấn: POST /api/ai-chat

Body truyền lên: { message: "Câu hỏi của user", history: [...] }

Mô tả: Tiếp nhận câu hỏi, tự động quét từ khóa trong câu hỏi để fetch thông số xe từ DB làm context, sau đó streaming hoặc gửi kết quả phân tích từ Gemini API về cho UI hiển thị.