"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  SaveCartridgeIcon,
  ShareLinkIcon,
  RetroCloseIcon,
} from "@/components/icons/RetroIcons";

export default function SavedPortfoliosModal({
  isOpen,
  onClose,
  user,
  onSelectPortfolio,
  onSharePortfolio,
}) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!isOpen || !user?.email) return;

    let cancelled = false;
    async function fetchList() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/portfolios/user?email=${encodeURIComponent(user.email)}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Không thể tải danh sách portfolio.");
        if (!cancelled) setList(json.items || []);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchList();
    return () => {
      cancelled = true;
    };
  }, [isOpen, user]);

  async function handleDelete(id, e) {
    e.stopPropagation();
    if (!confirm("Bạn có chắc chắn muốn xóa bản lưu portfolio này không?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(
        `/api/portfolios/user?id=${encodeURIComponent(id)}&email=${encodeURIComponent(user.email)}`,
        { method: "DELETE" }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Không thể xóa portfolio.");
      setList((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert("Lỗi khi xóa: " + err.message);
    } finally {
      setDeletingId(null);
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2c2e2a]/40 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-[25.5px] border border-[#d5d5d4] bg-[#ffffff] shadow-xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3 shrink-0 bg-[#f5f1e4] border-b border-[#d5d5d4]">
          <div className="flex items-center gap-2">
            <span className="rounded-[10px] border border-[#d5d5d4] bg-[#ffffff] px-2.5 py-0.5 font-mono text-[10px] font-bold tracking-tight text-[#2c2e2a]">
              GENFOLIO
            </span>
            <span className="text-[12px] font-bold uppercase tracking-[0.5px] text-[#2c2e2a]">
              DANH SÁCH PORTFOLIO ĐÃ LƯU
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded-full border border-[#d5d5d4] bg-[#ffffff] text-[#2c2e2a] hover:bg-[#ff705d] hover:text-white hover:border-[#ff705d] transition cursor-pointer"
          >
            <RetroCloseIcon className="w-2.5 h-2.5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <span className="flex h-3 w-3 animate-ping rounded-full bg-[#8ed462] mr-2" />
              <span className="text-xs font-bold text-[#2c2e2a]">Đang tải danh sách từ cơ sở dữ liệu…</span>
            </div>
          ) : error ? (
            <div className="rounded-[20px] border border-[#ff705d] bg-white p-4 text-xs text-[#ff705d]">
              {error}
            </div>
          ) : list.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#d5d5d4] bg-[#f5f1e4] text-[#2c2e2a]">
                <SaveCartridgeIcon className="w-6 h-6 text-[#2c2e2a]" />
              </div>
              <h4 className="mt-3 text-sm font-bold text-[#2c2e2a]">
                Chưa có portfolio nào được lưu
              </h4>
              <p className="mt-1 text-xs text-[#80827f] max-w-sm mx-auto">
                Khi chỉnh sửa hồ sơ, hãy bấm nút <strong>&quot;LƯU DỰ ÁN&quot;</strong> trên thanh công cụ để lưu dữ liệu vào cơ sở dữ liệu.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {list.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[20px] border border-[#d5d5d4] bg-[#ffffff] p-4 shadow-none hover:border-[#8ed462] transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-[10px] bg-[#f5f1e4] border border-[#d5d5d4] px-2 py-0.5 text-[9px] font-bold uppercase text-[#2c2e2a]">
                        {item.template?.toUpperCase()}
                      </span>
                      <h4 className="text-xs font-bold text-[#2c2e2a]">
                        {item.title || "Portfolio Không Tên"}
                      </h4>
                    </div>
                    <p className="mt-1 text-[11px] text-[#80827f]">
                      Cập nhật lần cuối: {new Date(item.updated_at).toLocaleString("vi-VN")}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectPortfolio(item);
                        onClose();
                      }}
                      className="rounded-[50px] border border-[#d5d5d4] bg-[#ffffff] hover:border-[#8ed462] hover:bg-[#f5f1e4] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.5px] text-[#2c2e2a] transition cursor-pointer"
                    >
                      CHỈNH SỬA
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onSharePortfolio(item);
                        onClose();
                      }}
                      className="rounded-[50px] bg-[#ff705d] hover:bg-[#e05a48] text-white flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.5px] transition cursor-pointer"
                      title="Chia sẻ portfolio này"
                    >
                      <ShareLinkIcon className="w-3 h-3 text-white" />
                      <span>CHIA SẺ</span>
                    </button>

                    <button
                      type="button"
                      disabled={deletingId === item.id}
                      onClick={(e) => handleDelete(item.id, e)}
                      className="rounded-full border border-[#d5d5d4] bg-[#ffffff] p-1.5 text-[10px] font-bold text-[#ff705d] hover:bg-[#ff705d] hover:text-white hover:border-[#ff705d] transition cursor-pointer flex items-center justify-center min-w-[26px] min-h-[26px]"
                      title="Xóa portfolio"
                    >
                      {deletingId === item.id ? "…" : <RetroCloseIcon className="w-2.5 h-2.5" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
