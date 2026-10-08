"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { INDUSTRIES, getMockProfileByIndustry } from "@/lib/mockProfiles";
import { saveStoredPortfolioData } from "@/lib/portfolioStorage";

export default function InstantGenerator() {
  const router = useRouter();
  const [selectedIndustry, setSelectedIndustry] = useState("tech");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);

  const activeConfig = INDUSTRIES.find((ind) => ind.id === selectedIndustry) || INDUSTRIES[0];

  const SCAN_STEPS = [
    { title: "KHỞI ĐỘNG COMPILER 128-BIT", desc: "Kết nối cartridge phần cứng & nạp dữ liệu..." },
    { title: "GEMINI AI: TRÍCH XUẤT KỸ NĂNG", desc: "Bóc tách kinh nghiệm, dự án & thành tựu trọng tâm..." },
    { title: `THIẾT LẬP BỐ CỤC ${activeConfig.label.toUpperCase()}`, desc: `Áp dụng concept ${activeConfig.themeName}...` },
    { title: "HOÀN TẤT XUẤT BẢN TRÀN VIỀN", desc: "Đang mở giao diện trực quan toàn màn hình..." },
  ];

  const runSimulationAndRedirect = async (portfolioData, targetTemplate) => {
    setIsProcessing(true);
    setUploadError("");
    setProcessStep(0);
    setProgressPercent(10);

    // Lưu ngay dữ liệu vào LocalStorage để trang Preview và Editor cùng đọc được
    saveStoredPortfolioData(portfolioData);

    // Chu kỳ 4 bước mô phỏng phân tích AI trong ~2.6 giây (bám sát chỉ số G-02 của PRD)
    await new Promise((r) => setTimeout(r, 600));
    setProcessStep(1);
    setProgressPercent(40);

    await new Promise((r) => setTimeout(r, 700));
    setProcessStep(2);
    setProgressPercent(75);

    await new Promise((r) => setTimeout(r, 700));
    setProcessStep(3);
    setProgressPercent(100);

    await new Promise((r) => setTimeout(r, 600));
    // Chuyển thẳng sang trang xem thử tràn viền của template tương ứng
    router.push(`/preview/${targetTemplate}`);
  };

  // 1-Click Fast Trial với Hồ sơ mẫu (Mock Profile) chuẩn hóa của ngành
  const handleInstantTrial = () => {
    const mockData = getMockProfileByIndustry(selectedIndustry);
    runSimulationAndRedirect(mockData, activeConfig.defaultTemplate);
  };

  // Xử lý khi người dùng tải CV thật (.pdf / .docx)
  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setUploadError("");
    setProcessStep(0);
    setProgressPercent(15);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      setProcessStep(1);
      setProgressPercent(45);

      const res = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Không thể trích xuất tự động qua AI, hệ thống sẽ nạp dữ liệu mẫu chuẩn ngành để tiếp tục.");
      }

      const json = await res.json();
      const extractedData = json?.data || getMockProfileByIndustry(selectedIndustry);

      setProcessStep(2);
      setProgressPercent(80);
      saveStoredPortfolioData(extractedData);

      setProcessStep(3);
      setProgressPercent(100);
      await new Promise((r) => setTimeout(r, 600));
      router.push(`/preview/${activeConfig.defaultTemplate}`);
    } catch (err) {
      // Fallback êm dịu theo PRD: Không làm gián đoạn trải nghiệm của người dùng
      console.warn("Parse fallback to mock:", err.message);
      const fallbackData = getMockProfileByIndustry(selectedIndustry);
      saveStoredPortfolioData(fallbackData);
      setProcessStep(3);
      setProgressPercent(100);
      await new Promise((r) => setTimeout(r, 800));
      router.push(`/preview/${activeConfig.defaultTemplate}`);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="relative mt-7 w-full overflow-hidden rounded-[4px] border-t border-l border-white/70 border-r border-[#3d4f97] border-b-2 border-b-[#3d4f97] bg-[#dedede] p-4 sm:p-5 shadow-[inset_1px_1px_0_rgba(255,255,255,0.4),0_6px_20px_rgba(33,36,46,0.25)]">
      {/* Top Banner Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#3d4f97] bg-[#7a8aba] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.5px] text-[#21242e] -mx-4 sm:-mx-5 -mt-4 sm:-mt-5 mb-4">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-[#e60012] animate-pulse" />
          <span>TRẠM KHỞI TẠO 1 CHẠM // INSTANT CARTRIDGE LOADER</span>
        </div>
        <span className="font-mono text-[#21242e]">{activeConfig.cartridgeCode}</span>
      </div>

      {/* Bước 1: Chọn nhóm ngành */}
      <div className="mb-3.5">
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.5px] text-[#21242e]">
          <span>BƯỚC 1: CHỌN NHÓM NGÀNH MỤC TIÊU</span>
          <span className="text-[#3d4f97] font-mono">[1 / 2]</span>
        </div>

        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {INDUSTRIES.map((ind) => {
            const isSelected = selectedIndustry === ind.id;
            return (
              <button
                key={ind.id}
                type="button"
                onClick={() => setSelectedIndustry(ind.id)}
                className={`group relative flex flex-col items-start rounded-[3px] p-2.5 text-left transition-all cursor-pointer ${
                  isSelected
                    ? "border-t-2 border-l border-white border-r border-[#21242e] border-b-2 border-b-[#21242e] bg-[#21242e] text-white shadow-md translate-y-[1px]"
                    : "border-t border-l border-white/90 border-r border-[#7a8aba] border-b-2 border-b-[#7a8aba] bg-[#cfcfcf] text-[#21242e] hover:bg-[#c4c4c4]"
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="font-mono text-[10px] font-black text-[#ecab37] border border-[#3d4f97] bg-[#14161d] px-1.5 py-0.5 rounded-[2px]">
                    {ind.icon}
                  </span>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isSelected ? "bg-[#ecab37] shadow-[0_0_6px_#ecab37]" : "bg-[#7a8aba]"
                    }`}
                  />
                </div>
                <div className="mt-1.5 text-[12px] font-black uppercase tracking-tight">
                  {ind.label.split(" ")[1] || ind.label}
                </div>
                <div
                  className={`mt-0.5 line-clamp-1 text-[9.5px] font-medium ${
                    isSelected ? "text-[#9fbee7]" : "text-[#555a6d]"
                  }`}
                >
                  {ind.subtitle}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Thông tin Layout đặc thù được cấu hình */}
      <div className="mb-4 rounded-[2px] border border-[#3d4f97]/40 bg-[#dedede] p-2.5 text-[11px] text-[#21242e]">
        <div className="flex items-center gap-1.5 font-bold uppercase tracking-[0.3px] text-[#21242e]">
          <span className="text-[#f68d1f]">▶</span>
          <span>BỐ CỤC TỰ ĐỘNG:</span>
          <span className="text-[#e60012] font-mono">{activeConfig.themeName}</span>
        </div>
        <p className="mt-1 text-[11px] leading-[1.4] text-[#3d4f97]">
          {activeConfig.tagline}
        </p>
      </div>

      {/* Bước 2: Hai nút kích hoạt (Thử mẫu 1 chạm & Tải CV) */}
      <div>
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.5px] text-[#21242e]">
          <span>BƯỚC 2: KHỞI TẠO LANDING PAGE</span>
          <span className="text-[#3d4f97] font-mono">[2 / 2]</span>
        </div>

        <div className="mt-2.5 flex flex-col gap-2.5 sm:flex-row">
          {/* Nút 1: Thử ngay hồ sơ mẫu (Chạy tức thì không cần chuẩn bị file) */}
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleInstantTrial}
            className="n2001-btn-signal flex flex-1 items-center justify-center gap-2 py-3 px-4 text-[12px] font-black tracking-[0.5px] shadow-md transition active:translate-y-[1px]"
          >
            <span>THỬ NGAY HỒ SƠ MẪU (1 CHẠM)</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/30 text-[11px]">
              ▶
            </span>
          </button>

          {/* Nút 2: Tải CV thật lên */}
          <label className="n2001-btn-amber flex items-center justify-center gap-2 py-3 px-4 text-[11px] font-bold tracking-[0.5px] cursor-pointer shadow-md transition active:translate-y-[1px]">
            <span>TẢI CV LÊN (.PDF, .DOCX)</span>
            <span className="font-mono text-[11px] font-black">↑</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              disabled={isProcessing}
              onChange={handleFileUpload}
              className="sr-only"
            />
          </label>
        </div>
      </div>

      {/* Modal / Scanner Overlay thời gian thực */}
      {isProcessing && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#21242e]/95 p-6 text-white backdrop-blur-xs animate-fadeIn">
          {/* Hardware CRT Header */}
          <div className="flex items-center gap-2 text-[#ecab37] text-[11px] font-black uppercase tracking-[1px]">
            <span className="h-2 w-2 rounded-full bg-[#e60012] animate-ping" />
            <span>GEMINI AI ENGINE // BIÊN DỊCH BỐ CỤC THỜI GIAN THỰC</span>
          </div>

          <div className="mt-4 text-center">
            <h4 className="text-[16px] sm:text-[18px] font-black uppercase tracking-tight text-white font-mono">
              {SCAN_STEPS[processStep]?.title}
            </h4>
            <p className="mt-1 text-[12px] text-[#9fbee7] max-w-[34ch]">
              {SCAN_STEPS[processStep]?.desc}
            </p>
          </div>

          {/* Pixel progress bar Nintendo style */}
          <div className="mt-5 w-full max-w-xs rounded-[2px] border border-[#3d4f97] bg-[#14161d] p-1">
            <div
              className="h-3 rounded-[1px] bg-gradient-to-r from-[#f68d1f] to-[#ecab37] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="mt-2 flex w-full max-w-xs justify-between text-[10px] font-mono text-[#9fbee7]">
            <span>LOADING...</span>
            <span className="font-bold text-[#ecab37]">{progressPercent}%</span>
          </div>

          <div className="mt-3 text-[10px] uppercase tracking-[0.5px] text-[#7a8aba]">
            ĐANG TẠO GIAO DIỆN TRÀN VIỀN (FULL-SCREEN)...
          </div>
        </div>
      )}
    </div>
  );
}
