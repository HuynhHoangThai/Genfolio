import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Clock, 
  QrCode, 
  Sparkles, 
  ExternalLink, 
  Trash2, 
  AlertCircle,
  Smartphone,
  Globe,
  Send,
  Linkedin,
  Twitter,
  Mail,
  RefreshCw
} from 'lucide-react';
import QRCode from 'qrcode';
import { LayoutConcept, MockProfile } from '../../types/portfolio';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: MockProfile;
  concept: LayoutConcept;
  primaryColor: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  profile,
  concept,
  primaryColor,
}) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [shareId, setShareId] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [expiresInHours, setExpiresInHours] = useState<number>(48);
  const [copied, setCopied] = useState<boolean>(false);
  const [isWebShareSupported, setIsWebShareSupported] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'link' | 'qr'>('link');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Check Web Share API capability
  useEffect(() => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      setIsWebShareSupported(true);
    } else {
      setIsWebShareSupported(false);
    }
  }, []);

  // Generate temporary link when modal opens if not already created
  useEffect(() => {
    if (isOpen && !shareId) {
      createTemporaryShare(expiresInHours);
    }
  }, [isOpen]);

  // Render QR Code whenever shareUrl changes or QR tab is shown
  useEffect(() => {
    if (shareUrl && qrCanvasRef.current) {
      QRCode.toCanvas(
        qrCanvasRef.current,
        shareUrl,
        {
          width: 200,
          margin: 1.5,
          color: {
            dark: '#0a0a0c',
            light: '#ffffff',
          },
        },
        (error) => {
          if (error) console.error('Error generating QR code:', error);
        }
      );
    }
  }, [shareUrl, activeTab]);

  const createTemporaryShare = async (hours: number) => {
    setIsGenerating(true);
    setErrorMsg(null);
    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          concept,
          primaryColor,
          expiresInHours: hours,
        }),
      });

      const data = await response.json();
      if (data.success && data.shareId) {
        setShareId(data.shareId);
        setExpiresAt(data.expiresAt);
        setExpiresInHours(data.expiresInHours);
        
        // Construct canonical URL
        const origin = window.location.origin;
        const generatedUrl = `${origin}/?share=${data.shareId}`;
        setShareUrl(generatedUrl);
      } else {
        throw new Error(data.error || 'Không thể tạo liên kết chia sẻ');
      }
    } catch (err: any) {
      console.error('Failed to create share link:', err);
      setErrorMsg(err.message || 'Lỗi khi khởi tạo liên kết tạm thời');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleWebShare = async () => {
    if (!shareUrl) return;

    const shareData = {
      title: `${profile.fullName} — ${profile.title} | Gen-Folio`,
      text: `Khám phá Portfolio tương tác của ${profile.fullName} (${profile.title}), được thiết kế với phong cách ${concept}:`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setShareFeedback('Đã mở chia sẻ thành công!');
        setTimeout(() => setShareFeedback(null), 3000);
      } catch (err: any) {
        // User cancelled or share aborted
        if (err.name !== 'AbortError') {
          console.warn('Web Share failed, fallback to copy:', err);
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setShareFeedback('Đã sao chép liên kết vào bộ nhớ tạm!');
      setTimeout(() => {
        setCopied(false);
        setShareFeedback(null);
      }, 2500);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleRevokeShare = async () => {
    if (!shareId) return;
    try {
      await fetch(`/api/share/${shareId}`, { method: 'DELETE' });
      setShareId(null);
      setShareUrl('');
      setExpiresAt(null);
      setShareFeedback('Đã hủy liên kết chia sẻ.');
      setTimeout(() => setShareFeedback(null), 3000);
    } catch (err) {
      console.error('Error revoking share:', err);
    }
  };

  const formatExpiryTime = (timestamp: number | null) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRemainingHours = (timestamp: number | null) => {
    if (!timestamp) return 0;
    const diff = timestamp - Date.now();
    if (diff <= 0) return 0;
    return Math.round(diff / (1000 * 60 * 60));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden text-neutral-100 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md"
              style={{ backgroundColor: `${primaryColor}25`, color: primaryColor }}
            >
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Chia sẻ Gen-Folio
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
                  Web Share API
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Tạo liên kết tạm thời để gửi cho nhà tuyển dụng hoặc khách hàng
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Notification Feedback Toast */}
          {shareFeedback && (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{shareFeedback}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Primary Action: Native Web Share API trigger */}
          <div className="bg-gradient-to-br from-neutral-800/80 to-neutral-900/90 rounded-2xl p-4 border border-neutral-700/60 shadow-inner">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <span className="text-xs font-bold text-white block">
                  Chia sẻ một chạm qua hệ thống
                </span>
                <span className="text-[11px] text-neutral-400 block mt-0.5">
                  {isWebShareSupported 
                    ? 'Kích hoạt trình chia sẻ gốc của thiết bị (Zalo, Tin nhắn, AirDrop, Gmail...)' 
                    : 'Thiết bị không hỗ trợ Share Sheet trực tiếp, dùng liên kết sao chép bên dưới'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleWebShare}
                disabled={isGenerating || !shareUrl}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-neutral-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:opacity-95 shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                <Share2 className="w-4 h-4" />
                <span>{isWebShareSupported ? 'Mở Share Sheet' : 'Sao chép & Chia sẻ'}</span>
              </button>
            </div>
          </div>

          {/* Temporary Link & Duration Settings */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Thời hạn hiệu lực của liên kết</span>
              </label>
              <div className="flex items-center gap-1">
                {[
                  { hours: 24, label: '24 giờ' },
                  { hours: 48, label: '48 giờ' },
                  { hours: 72, label: '3 ngày' },
                  { hours: 168, label: '7 ngày' },
                ].map((item) => (
                  <button
                    key={item.hours}
                    type="button"
                    onClick={() => {
                      setExpiresInHours(item.hours);
                      createTemporaryShare(item.hours);
                    }}
                    disabled={isGenerating}
                    className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                      expiresInHours === item.hours
                        ? 'bg-neutral-200 text-neutral-900 font-bold'
                        : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Generated Shareable URL box */}
            <div className="relative flex items-center bg-neutral-950 rounded-xl border border-neutral-800 p-1.5 focus-within:border-neutral-600 transition-colors">
              <input
                type="text"
                readOnly
                value={isGenerating ? 'Đang tạo liên kết tạm thời...' : shareUrl}
                className="w-full bg-transparent px-3 py-1.5 text-xs font-mono text-neutral-200 focus:outline-none select-all"
                placeholder="https://..."
              />
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  disabled={isGenerating || !shareUrl}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    copied 
                      ? 'bg-emerald-500 text-neutral-950' 
                      : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                  }`}
                  title="Sao chép liên kết"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Sao chép</span>
                    </>
                  )}
                </button>

                <a
                  href={shareUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors ${!shareUrl ? 'pointer-events-none opacity-40' : ''}`}
                  title="Mở thử nghiệm tab mới"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Expiry detail notice */}
            {expiresAt && (
              <div className="flex items-center justify-between mt-2 text-[11px] text-neutral-400 px-1">
                <span className="flex items-center gap-1 text-amber-300/90 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  Hết hạn lúc: {formatExpiryTime(expiresAt)} (còn ~{getRemainingHours(expiresAt)}h)
                </span>
                <span className="text-neutral-500">Tự động hủy sau thời hạn</span>
              </div>
            )}
          </div>

          {/* Tab Selector: Link options vs QR Code */}
          <div className="flex border-b border-neutral-800">
            <button
              type="button"
              onClick={() => setActiveTab('link')}
              className={`pb-2.5 px-4 text-xs font-semibold flex items-center gap-1.5 border-b-2 cursor-pointer transition-colors ${
                activeTab === 'link'
                  ? 'border-emerald-400 text-white'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Chia sẻ Mạng xã hội</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('qr')}
              className={`pb-2.5 px-4 text-xs font-semibold flex items-center gap-1.5 border-b-2 cursor-pointer transition-colors ${
                activeTab === 'qr'
                  ? 'border-emerald-400 text-white'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Mã QR quét trên Mobile</span>
            </button>
          </div>

          {/* Tab 1: Social and Direct Sharing */}
          {activeTab === 'link' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {/* LinkedIn */}
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 hover:border-blue-500/40 hover:bg-neutral-800/80 transition-all text-neutral-300 hover:text-white group"
                >
                  <Linkedin className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform mb-1" />
                  <span className="text-[11px] font-medium">LinkedIn</span>
                </a>

                {/* X / Twitter */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Xem Portfolio trực tuyến của tôi (${profile.fullName} — ${profile.title}) được tạo bởi Gen-Folio:`)}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 hover:border-neutral-500 hover:bg-neutral-800/80 transition-all text-neutral-300 hover:text-white group"
                >
                  <Twitter className="w-5 h-5 text-neutral-200 group-hover:scale-110 transition-transform mb-1" />
                  <span className="text-[11px] font-medium">X (Twitter)</span>
                </a>

                {/* Telegram */}
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Hồ sơ Portfolio của ${profile.fullName}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 hover:border-cyan-500/40 hover:bg-neutral-800/80 transition-all text-neutral-300 hover:text-white group"
                >
                  <Send className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform mb-1" />
                  <span className="text-[11px] font-medium">Telegram</span>
                </a>

                {/* Email / Gmail */}
                <a
                  href={`mailto:?subject=${encodeURIComponent(`Hồ sơ Portfolio trực tuyến — ${profile.fullName}`)}&body=${encodeURIComponent(`Kính gửi Quý đối tác/Nhà tuyển dụng,\n\nVui lòng xem hồ sơ Portfolio trực tuyến tương tác của tôi tại:\n${shareUrl}\n\nLiên kết này có hiệu lực trong ${expiresInHours} giờ.\n\nTrân trọng,\n${profile.fullName}`)}`}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 hover:border-emerald-500/40 hover:bg-neutral-800/80 transition-all text-neutral-300 hover:text-white group"
                >
                  <Mail className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform mb-1" />
                  <span className="text-[11px] font-medium">Gửi Email</span>
                </a>
              </div>

              {/* Portfolio Snapshot Preview Info */}
              <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                <div className="flex items-center gap-2">
                  <span 
                    className="w-2.5 h-2.5 rounded-full" 
                    style={{ backgroundColor: primaryColor }} 
                  />
                  <span>
                    Chủ đề: <strong className="text-neutral-200 capitalize">{concept}</strong> · Ứng viên: <strong className="text-neutral-200">{profile.fullName}</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => createTemporaryShare(expiresInHours)}
                  className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  title="Làm mới snapshot dữ liệu"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Cập nhật</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: QR Code view */}
          {activeTab === 'qr' && (
            <div className="flex flex-col items-center justify-center py-2 space-y-3">
              <div className="p-3 bg-white rounded-2xl shadow-xl border border-neutral-200">
                <canvas ref={qrCanvasRef} className="rounded-lg" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-xs font-semibold text-neutral-200 flex items-center justify-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  Quét camera điện thoại để xem trực tiếp trên thiết bị di động
                </p>
                <p className="text-[11px] text-neutral-400">
                  Phù hợp khi phỏng vấn trực tiếp, thuyết trình hoặc test giao diện Responsive
                </p>
              </div>
            </div>
          )}

          {/* Security and Revoke Controls */}
          <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
            <span className="text-[11px] text-neutral-500">
              Bảo mật: Tự động hết hạn và xóa dữ liệu khỏi hệ thống
            </span>
            {shareId && (
              <button
                type="button"
                onClick={handleRevokeShare}
                className="text-[11px] text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Hủy liên kết ngay</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
