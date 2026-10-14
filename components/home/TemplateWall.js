"use client";

import { useState } from "react";
import { templates } from "@/lib/portfolioData";
import TemplatePreviewCard from "@/components/TemplatePreviewCard";

const CATEGORIES = [
  { id: "all", label: "TẤT CẢ MẪU", count: 12, code: "TẤT CẢ" },
  { id: "tech", label: "KHỐI KỸ THUẬT", count: 4, code: "KỸ THUẬT" },
  { id: "creative", label: "KHỐI SÁNG TẠO", count: 5, code: "SÁNG TẠO" },
  { id: "business", label: "KHỐI KINH DOANH", count: 3, code: "KINH DOANH" },
];

export default function TemplateWall() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredTemplates = activeTab === "all"
    ? templates
    : templates.filter((t) => t.industry === activeTab);

  return (
    <div>
      {/* Category Filter Tabs Bar MindMarket style */}
      <div className="mt-8 flex flex-wrap items-center gap-2.5 border-b border-[#d5d5d4] pb-4">
        <span className="text-[12px] font-semibold uppercase tracking-[0.5px] text-[#2c2e2a] mr-2 hidden sm:inline">
          LỌC THEO NGÀNH:
        </span>
        {CATEGORIES.map((cat) => {
          const isActive = activeTab === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveTab(cat.id)}
              className={`flex items-center gap-2 rounded-[50px] px-4 py-2 text-[12px] font-medium tracking-[0.2px] transition cursor-pointer ${
                isActive
                  ? "bg-[#2c2e2a] text-white shadow-none"
                  : "border border-[#d5d5d4] bg-[#ffffff] text-[#2c2e2a] hover:bg-[#e0dbce]"
              }`}
            >
              <span className="text-[10px] font-bold tracking-wider">
                [{cat.code}]
              </span>
              <span>{cat.label}</span>
              <span
                className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  isActive ? "bg-[#8ed462] text-[#2c2e2a]" : "bg-[#f5f1e4] text-[#80827f]"
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Templates Cartridge Grid */}
      <div className="mt-8 grid auto-rows-fr grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template, index) => (
          <TemplatePreviewCard key={template.id} template={template} index={index} />
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="mt-12 text-center text-[14px] font-medium text-[#80827f]">
          Không có mẫu giao diện nào trong phân mục này.
        </div>
      )}
    </div>
  );
}
