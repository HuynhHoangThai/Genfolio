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
    loadPortfolios();
  }, [isOpen, user?.email]);

  async function loadPortfolios() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/portfolios/user?email=${encodeURIComponent(user.email)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Không thể tải danh sách portfolio.");
      setList(json.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#21242e]/80 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="n2001-hardware-card w-full max-w-2xl overflow-hidden border-2 border-[#3d4f97] bg-[#7a8aba] shadow-2xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="n2001-carbon-bar flex items-center justify-between px-4 py-2.5 shrink-0">
          <div className="flex items-center gap-2">
            <span className="n2001-racetrack text-[9px] py-0 px-2 tracking-tight">GENFOLIO</span>
            <span className="text-[11px] font-bold uppercase tracking-[0.5px] text-[#ecab37]">
              DANH SÁCH PORTFOLIO ĐÃ LƯU
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-5 w-5 items-center justify-center rounded-[2px] border border-[#3d4f97] bg-[#21242e] text-white hover:bg-[#e60012] transition cursor-pointer"
          >
            <RetroCloseIcon className="w-2.5 h-2.5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <span className="flex h-3 w-3 animate-ping rounded-full bg-[#f68d1f] mr-2" />
              <span className="text-xs font-bold text-[#21242e]">Đang tải danh sách từ cơ sở dữ liệu…</span>
            </div>
          ) : error ? (
            <div className="rounded-[2px] border border-[#e60012] bg-white p-4 text-xs text-[#e60012]">
              {error}
            </div>
          ) : list.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[2px] border border-[#3d4f97] bg-[#dedede] text-[#3d4f97] shadow-inner">
                <SaveCartridgeIcon className="w-7 h-7 text-[#3d4f97]" />
              </div>
              <h4 className="mt-3 text-sm font-bold uppercase tracking-[0.5px] text-[#21242e]">
                Chưa có portfolio nào được lưu
              </h4>
              <p className="mt-1 text-xs text-[#3d4f97] max-w-sm mx-auto">
                Khi chỉnh sửa hồ sơ, hãy bấm nút <strong>"LƯU DỰ ÁN"</strong> trên thanh công cụ để lưu dữ liệu vào cơ sở dữ liệu.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {list.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[4px] border border-[#3d4f97] bg-white p-3.5 shadow-xs hover:border-[#21242e] transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-[2px] bg-[#dedede] border border-[#3d4f97] px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#21242e]">
                        {item.template?.toUpperCase()}
                      </span>
                      <h4 className="text-xs font-bold text-[#21242e]">
                        {item.title || "Portfolio Không Tên"}
                      </h4>
                    </div>
                    <p className="mt-1 text-[10px] text-[#3d4f97]">
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
                      className="n2001-btn-signal px-3 py-1 text-[10px] font-bold uppercase tracking-[0.5px] cursor-pointer"
                    >
                      CHỈNH SỬA
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onSharePortfolio(item);
                        onClose();
                      }}
                      className="n2001-btn-amber flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.5px] cursor-pointer"
                      title="Chia sẻ portfolio này"
                    >
                      <ShareLinkIcon className="w-3 h-3 text-[#21242e]" />
                      <span>CHIA SẺ</span>
                    </button>

                    <button
                      type="button"
                      disabled={deletingId === item.id}
                      onClick={(e) => handleDelete(item.id, e)}
                      className="rounded-[2px] border border-[#3d4f97] bg-[#dedede] p-1.5 text-[10px] font-bold text-[#e60012] hover:bg-[#e60012] hover:text-white transition cursor-pointer flex items-center justify-center min-w-[22px] min-h-[22px]"
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
