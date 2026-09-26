import React, { useState } from 'react';
import { X, Download, Printer, CheckCircle2, MapPin, Mail, Phone, Globe, ExternalLink, FileText, Code2, Copy, Check, ShieldCheck, Trophy, Award } from 'lucide-react';
import { MockProfile } from '../../types/portfolio';

interface ResumeModalProps {
  profile: MockProfile | null;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ profile, onClose }) => {
  if (!profile) return null;

  const [activeTab, setActiveTab] = useState<'dossier' | 'markitdown'>('dossier');
  const [copiedMd, setCopiedMd] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${profile.id}-resume.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyMarkdown = () => {
    if (profile.markitdownMarkdown) {
      navigator.clipboard?.writeText(profile.markitdownMarkdown);
      setCopiedMd(true);
      setTimeout(() => setCopiedMd(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/90">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Hồ sơ Dữ liệu CV Hoàn chỉnh</span>
            </span>

            {/* Tab switchers */}
            <div className="flex items-center p-0.5 rounded-lg bg-neutral-900 border border-neutral-800 ml-2">
              <button
                type="button"
                onClick={() => setActiveTab('dossier')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeTab === 'dossier'
                    ? 'bg-neutral-800 text-white font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Cấu trúc Dossier
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('markitdown')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                  activeTab === 'markitdown'
                    ? 'bg-neutral-800 text-emerald-300 font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>MarkItDown (MD)</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'markitdown' && profile.markitdownMarkdown && (
              <button
                onClick={handleCopyMarkdown}
                className="px-3 py-1.5 rounded-lg text-xs font-mono bg-neutral-800 hover:bg-neutral-700 text-emerald-300 border border-neutral-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Sao chép Markdown"
              >
                {copiedMd ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedMd ? 'Đã sao chép' : 'Copy MD'}</span>
              </button>
            )}

            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              title="In / Xuất PDF"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownloadJson}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              title="Tải file JSON"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {activeTab === 'markitdown' ? (
          <div className="p-6 overflow-y-auto font-mono text-xs text-neutral-300 bg-neutral-950 leading-relaxed max-h-[80vh]">
            <div className="mb-4 pb-3 border-b border-neutral-800 flex items-center justify-between text-neutral-400">
              <span className="text-emerald-400"># Microsoft MarkItDown Parsed Representation</span>
              <span>Input Pipeline Format: Markdown</span>
            </div>
            {profile.markitdownMarkdown ? (
              <pre className="whitespace-pre-wrap font-mono text-neutral-200">
                {profile.markitdownMarkdown}
              </pre>
            ) : (
              <div className="py-12 text-center text-neutral-500 font-sans">
                <Code2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Tài liệu này được khởi tạo từ Mock Profile mẫu.</p>
                <p className="text-xs text-neutral-600 mt-1">Khi tải lên tệp CV PDF/Word thực tế, Microsoft MarkItDown sẽ bóc tách và hiển thị toàn bộ Markdown tại đây.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 overflow-y-auto space-y-6 text-neutral-200 max-h-[80vh]">
            {/* Header */}
            <div className="border-b border-neutral-800 pb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                {profile.fullName}
              </h1>
              <p className="text-sm font-semibold theme-accent-text mb-3">
                {profile.title}
              </p>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-neutral-400">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-neutral-400" />
                  {profile.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-neutral-400" />
                  {profile.phone}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  {profile.location}
                </span>
              </div>
            </div>

            {/* Summary & Philosophy */}
            <div>
              <h3 className="text-xs uppercase font-mono tracking-wider text-neutral-400 font-semibold mb-2">
                Tóm tắt chuyên môn &amp; Định hướng
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-3">
                {profile.bio}
              </p>
              {profile.philosophy && (
                <p className="text-xs text-neutral-400 italic bg-neutral-950 p-3 rounded-lg border border-neutral-800">
                  "{profile.philosophy}"
                </p>
              )}
            </div>

            {/* Metrics */}
            <div>
              <h3 className="text-xs uppercase font-mono tracking-wider text-neutral-400 font-semibold mb-2">
                Chỉ số Năng lực Định lượng (KPI Metrics)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {profile.metrics.map((m, idx) => (
                  <div key={idx} className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg text-center">
                    <div className="text-base font-bold text-white font-mono">{m.value}</div>
                    <div className="text-[11px] text-neutral-400">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div>
              <h3 className="text-xs uppercase font-mono tracking-wider text-neutral-400 font-semibold mb-3">
                Kinh nghiệm làm việc &amp; Thành tựu
              </h3>
              <div className="space-y-4">
                {profile.experiences.map((exp) => (
                  <div key={exp.id} className="border-l-2 border-neutral-800 pl-4 py-1">
                    <div className="flex items-baseline justify-between mb-1">
                      <h4 className="text-sm font-bold text-white">{exp.role}</h4>
                      <span className="text-xs font-mono text-neutral-400">{exp.period}</span>
                    </div>
                    <div className="text-xs text-neutral-400 font-medium mb-2">
                      {exp.company} · {exp.location}
                    </div>
                    <p className="text-xs text-neutral-300 mb-2 leading-relaxed">{exp.description}</p>
                    <ul className="list-disc list-inside space-y-1 text-xs text-neutral-300">
                      {exp.achievements.map((ach, idx) => (
                        <li key={idx} className="leading-relaxed">{ach}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <h3 className="text-xs uppercase font-mono tracking-wider text-neutral-400 font-semibold mb-3">
                Học vấn &amp; Bằng cấp Học thuật
              </h3>
              <div className="space-y-3">
                {profile.education.map((edu, idx) => (
                  <div key={idx} className="border-l-2 border-neutral-800 pl-4 py-1">
                    <div className="flex items-baseline justify-between">
                      <h4 className="text-sm font-bold text-white">{edu.degree}</h4>
                      <span className="text-xs font-mono text-neutral-400">{edu.year}</span>
                    </div>
                    <div className="text-xs text-neutral-400">{edu.institution}</div>
                    {edu.honors && (
                      <div className="text-xs theme-accent-text mt-1 font-medium">{edu.honors}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications & Awards */}
            {((profile.certifications && profile.certifications.length > 0) || (profile.awards && profile.awards.length > 0)) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {profile.certifications && profile.certifications.length > 0 && (
                  <div>
                    <h3 className="text-xs uppercase font-mono tracking-wider text-neutral-400 font-semibold mb-2 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Chứng chỉ Chuyên môn</span>
                    </h3>
                    <ul className="space-y-1 text-xs text-neutral-300">
                      {profile.certifications.map((c, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-400">✓</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {profile.awards && profile.awards.length > 0 && (
                  <div>
                    <h3 className="text-xs uppercase font-mono tracking-wider text-neutral-400 font-semibold mb-2 flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      <span>Giải thưởng &amp; Vinh danh</span>
                    </h3>
                    <ul className="space-y-1 text-xs text-neutral-300">
                      {profile.awards.map((a, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-400">★</span>
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Skills */}
            <div>
              <h3 className="text-xs uppercase font-mono tracking-wider text-neutral-400 font-semibold mb-2">
                Kỹ năng Trọng tâm
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded bg-neutral-800/80 border border-neutral-700/60 text-neutral-200"
                  >
                    {s.name} {s.level ? `(${s.level}%)` : ''}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
