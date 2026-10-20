"use client";

import { useState } from "react";

const FAQ_ITEMS = [
  {
    id: "how-it-works",
    question: "Gen-Folio hoạt động như thế nào và tôi cần chuẩn bị những gì?",
    answer:
      "Bạn chỉ cần tối đa 2 thao tác: Chọn nhóm ngành mục tiêu (Khối Kỹ Thuật, Sáng Tạo hoặc Kinh Doanh), sau đó tải file CV định dạng PDF / DOCX hoặc bấm 'Thử ngay hồ sơ mẫu'. Gemini AI sẽ tự động phân tích kỹ năng, kinh nghiệm và tạo ngay một website Landing Page tràn viền chuyên nghiệp trong vòng 3 giây.",
    badge: "QUY TRÌNH 1 CHẠM",
  },
  {
    id: "code-ownership",
    question: "Tôi có toàn quyền sở hữu mã nguồn của website không?",
    answer:
      "Có, 100%. Khi xuất bản, hệ thống sẽ clone một ứng dụng Next.js độc lập trực tiếp vào tài khoản GitHub cá nhân của bạn và kết nối tự động với Vercel. Bạn toàn quyền chỉnh sửa mã nguồn, thêm tính năng hoặc tích hợp thêm bất kỳ dịch vụ nào tùy thích.",
    badge: "MÃ NGUỒN ĐỘC LẬP",
  },
  {
    id: "hosting-cost",
    question: "Có phát sinh chi phí duy trì hàng tháng hay phí ẩn nào không?",
    answer:
      "Hoàn toàn 0 đ. Website chạy trực tiếp trên tài khoản Vercel và GitHub cá nhân của bạn (theo gói miễn phí tiêu chuẩn). Không có phí duy trì định kỳ, không phí gia hạn, và không ai có thể can thiệp tắt website của bạn.",
    badge: "0 Đ PHÍ DUY TRÌ",
  },
  {
    id: "custom-domain",
    question: "Tôi có thể gắn tên miền riêng (Custom Domain) cho website không?",
    answer:
      "Hoàn toàn được. Do website chạy trên dự án Vercel của chính bạn, bạn có thể dễ dàng cấu hình bất kỳ tên miền riêng nào (ví dụ: yourname.dev, yourname.vn, portfolio.com) thông qua bảng điều khiển Vercel hoàn toàn miễn phí và có sẵn chứng chỉ SSL tự động.",
    badge: "TÊN MIỀN RIÊNG",
  },
  {
    id: "customization",
    question: "Làm thế nào để tôi thay đổi màu sắc, font chữ và bố cục theo ý muốn?",
    answer:
      "Trên trang xem trước hoặc trình chỉnh sửa, hệ thống trang bị sẵn Floating Widget (Nút nổi góc màn hình). Bạn có thể đổi màu chủ đạo với tốc độ tức thì (< 100ms), chuyển đổi linh hoạt giữa giao diện Di động và Máy tính, hoặc tùy biến từng mục kinh nghiệm, dự án trực tiếp.",
    badge: "TÙY BIẾN TỨC THÌ",
  },
  {
    id: "data-privacy",
    question: "Dữ liệu CV và thông tin của tôi được bảo mật như thế nào?",
    answer:
      "Toàn bộ quá trình phân tích CV được xử lý bảo mật trên server và nạp trực tiếp vào trình duyệt của bạn. Gen-Folio không lưu trữ trái phép hay thương mại hóa dữ liệu cá nhân của người dùng. Dữ liệu chỉ được lưu vào kho lưu trữ khi bạn chủ động xuất bản lên GitHub của mình.",
    badge: "BẢO MẬT TUYỆT ĐỐI",
  },
];

export default function FAQSection() {
  const [openId, setOpenId] = useState("how-it-works");

  const toggleItem = (id) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section id="faq" className="home-band scroll-mt-16 pb-20 pt-10 lg:pb-24 lg:pt-14">
      <div className="mx-auto w-full max-w-[86rem] px-4 sm:px-6 lg:px-10">
        {/* Section Label Bar */}
        <div className="n2001-section-bar mb-8 rounded-[2px]">
          <span className="flex items-center gap-2">
            <span className="text-[#f68d1f]">≡</span>
            <span>CÂU HỎI THƯỜNG GẶP (HỎI ĐÁP HỆ THỐNG)</span>
          </span>
          <span className="text-[#3d4f97] text-[10px] font-bold tracking-wider">KHO KIẾN THỨC // TOÀN BỘ CHỦ ĐỀ</span>
        </div>

        {/* Section Header */}
        <div className="home-reveal flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <div>
            <p className="home-label">
              <span className="home-nums text-[#f68d1f]">HỎI ĐÁP 03</span> // GIẢI ĐÁP THẮC MẮC
            </p>
            <h2 className="home-grotesque text-[28px] sm:text-[38px] font-black uppercase tracking-tight text-[#21242e] mt-3 max-w-[28ch]">
              Mọi điều bạn cần biết về <em className="home-em">Gen-Folio</em>.
            </h2>
          </div>
          <p className="max-w-[42ch] text-[13px] leading-[1.6] text-[#3d4f97] font-medium">
            Từ quy trình tạo portfolio 1 chạm bằng Gemini AI đến việc sở hữu trọn vẹn mã nguồn và tự do xuất bản lên hạ tầng cá nhân.
          </p>
        </div>

        {/* Full-width FAQ Accordion List */}
        <div className="mt-10 space-y-3.5">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openId === item.id;
            const itemCode = `HỎI-${String(index + 1).padStart(2, "0")}`;

            return (
              <div
                key={item.id}
                className="overflow-hidden rounded-[4px] border-t border-l border-white/80 border-r border-[#3d4f97] border-b-2 border-b-[#3d4f97] bg-[#dedede] shadow-[inset_1px_1px_0_rgba(255,255,255,0.4),0_2px_8px_rgba(33,36,46,0.15)] transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 p-4 sm:p-5 text-left transition hover:bg-[#d5d5d5] cursor-pointer"
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <span className="shrink-0 text-[11px] font-black tracking-wide text-[#f68d1f]">
                      {itemCode}
                    </span>
                    <h3 className="text-[14px] sm:text-[16px] font-bold uppercase tracking-[0.2px] text-[#21242e]">
                      {item.question}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="hidden sm:inline-flex rounded-[2px] border border-[#3d4f97]/50 bg-[#7a8aba] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.5px] text-[#21242e]">
                      {item.badge}
                    </span>
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-[2px] border border-[#21242e] bg-[#21242e] text-[11px] font-black text-[#ecab37] shadow-xs transition-transform duration-200 ${
                        isOpen ? "rotate-90 bg-[#f68d1f] text-white" : ""
                      }`}
                    >
                      ▶
                    </span>
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-[#3d4f97]/30 bg-[#21242e] p-5 sm:p-6 text-white animate-fadeIn">
                    <div className="flex items-start gap-3">
                      <span className="text-[10px] font-black text-[#ecab37] shrink-0 mt-0.5 border border-white/20 bg-[#14161d] px-1.5 py-0.5 rounded-[2px]">
                        ĐÁP
                      </span>
                      <p className="text-[13.5px] sm:text-[14.5px] leading-[1.7] text-[#dedede]">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Fast Action Prompt */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-[4px] border border-[#3d4f97] bg-[#7a8aba] p-5 text-[#21242e]">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-black text-[#ecab37] bg-[#21242e] border border-[#3d4f97] px-2 py-1 rounded-[2px] shadow-xs">
              SẴN SÀNG
            </span>
            <div>
              <p className="text-[13px] font-black uppercase tracking-[0.5px]">
                SẴN SÀNG TẠO PORTFOLIO CỦA BẠN?
              </p>
              <p className="text-[11.5px] text-[#21242e]/80">
                Thao tác trong 30 giây — không cần đăng ký tài khoản trước.
              </p>
            </div>
          </div>

          <a
            href="#templates"
            className="n2001-btn-signal text-[11px] py-2.5 px-5 font-bold uppercase tracking-[0.5px] shadow-md"
          >
            <span>BẮT ĐẦU NGAY</span>
            <span className="font-mono">▶</span>
          </a>
        </div>
      </div>
    </section>
  );
}
