"use client";

import { useState } from "react";
import { templates } from "@/lib/portfolioData";
import TemplatePreviewCard from "@/components/TemplatePreviewCard";

const CATEGORIES = [
  { id: "all", label: "TẤT CẢ MẪU", count: 12, icon: "🎮" },
  { id: "tech", label: "KHỐI KỸ THUẬT (TECH)", count: 4, icon: "💻" },
  { id: "creative", label: "KHỐI SÁNG TẠO (CREATIVE)", count: 5, icon: "🎨" },
  { id: "business", label: "KHỐI KINH DOANH (BUSINESS)", count: 3, icon: "📈" },
];

export default function TemplateWall() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredTemplates = activeTab === "all"
    ? templates
    : templates.filter((t) => t.industry === activeTab);

  return (
    <div>
      {/* Category Filter Tabs Bar Nintendo 2001 style */}
      <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-[#3d4f97] pb-4">
        <span className="text-[11px] font-bold uppercase tracking-[0.5px] text-[#21242e] mr-2 hidden sm:inline">
          LỌC THEO NGÀNH:
        </span>
        {CATEGORIES.map((cat) => {
          const isActive = activeTab === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveTab(cat.id)}
              className={`flex items-center gap-2 rounded-[2px] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.5px] transition cursor-pointer ${
                isActive
                  ? "border-t border-l border-white border-r border-[#21242e] border-b-2 border-b-[#21242e] bg-[#21242e] text-[#ecab37] shadow-sm translate-y-[1px]"
                  : "border-t border-l border-white/90 border-r border-[#7a8aba] border-b-2 border-b-[#7a8aba] bg-[#cfcfcf] text-[#21242e] hover:bg-[#c2c2c2]"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              <span
                className={`ml-1 rounded-[1px] px-1.5 py-0.2 text-[9px] font-black ${
                  isActive ? "bg-[#ecab37] text-[#21242e]" : "bg-[#7a8aba] text-[#21242e]"
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Templates Cartridge Grid */}
      <div className="mt-8 grid auto-rows-fr grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template, index) => (
          <TemplatePreviewCard key={template.id} template={template} index={index} />
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="mt-12 text-center text-[13px] font-bold text-[#3d4f97]">
          Không có mẫu giao diện nào trong phân mục này.
        </div>
      )}
    </div>
  );
}
