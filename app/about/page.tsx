import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0B0C10] px-6 py-12 text-white md:py-20">
      <div className="mx-auto max-w-5xl">
        
        {/* Header Section */}
        <div className="mb-16 text-center">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-cyan-400">
            Về chúng tôi
          </p>
          <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">
            Định hình tương lai <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
              Tư vấn ô tô bằng AI
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400 leading-relaxed">
            Car AI không chỉ là một nền tảng tra cứu xe. Chúng tôi mang đến một trợ lý ảo thông minh, thấu hiểu nhu cầu và đồng hành cùng bạn trên hành trình tìm kiếm chiếc xe mơ ước.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {/* Card 1 */}
          <div className="rounded-3xl border border-white/10 bg-[#12141D] p-8 transition-transform hover:-translate-y-2 hover:border-cyan-400">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-2xl text-cyan-400">
              🤖
            </div>
            <h3 className="mb-3 text-xl font-bold text-white">AI Thông minh</h3>
            <p className="text-slate-400 leading-relaxed">
              Tích hợp lõi AI tiên tiến từ Llama 3, giúp phân tích nhu cầu và đưa ra những gợi ý mua xe chuẩn xác nhất.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-3xl border border-white/10 bg-[#12141D] p-8 transition-transform hover:-translate-y-2 hover:border-purple-400">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-400/10 text-2xl text-purple-400">
              ⚡
            </div>
            <h3 className="mb-3 text-xl font-bold text-white">Dữ liệu Real-time</h3>
            <p className="text-slate-400 leading-relaxed">
              Hệ thống cơ sở dữ liệu Cloud luôn được cập nhật, mang đến thông số kỹ thuật và mức giá mới nhất của mọi dòng xe.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-3xl border border-white/10 bg-[#12141D] p-8 transition-transform hover:-translate-y-2 hover:border-indigo-400">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-400/10 text-2xl text-indigo-400">
              ⚖️
            </div>
            <h3 className="mb-3 text-xl font-bold text-white">So sánh trực quan</h3>
            <p className="text-slate-400 leading-relaxed">
              Công cụ so sánh mạnh mẽ giúp bạn đặt 2 mẫu xe lên bàn cân, đối chiếu từng chi tiết nhỏ nhất.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-20 flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-b from-[#12141D] to-[#0B0C10] p-10 text-center shadow-2xl">
          <h2 className="text-3xl font-bold text-white">Sẵn sàng trải nghiệm?</h2>
          <p className="mt-4 text-slate-400">Trò chuyện ngay với AI của chúng tôi để tìm chiếc xe phù hợp nhất với bạn.</p>
          <Link
            href="/tu-van-ai"
            className="mt-8 rounded-full bg-cyan-400 px-8 py-4 font-bold text-slate-950 transition hover:bg-cyan-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]"
          >
            Bắt đầu Tư vấn AI
          </Link>
        </div>
      </div>
    </div>
  );
}