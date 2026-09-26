import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Award, 
  ExternalLink, 
  ArrowUpRight, 
  Mail, 
  Download, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Building2,
  PieChart,
  Sparkles,
  GraduationCap,
  Trophy,
  ShieldCheck,
  Copy,
  Check
} from 'lucide-react';
import { MockProfile, ProjectItem } from '../../types/portfolio';
import { generateProceduralVisual, generateProceduralAvatar } from '../../utils/aiVisuals';
import { DynamicSectionRenderer } from './sections/DynamicSectionRenderer';
import { 
  defaultViewport, 
  staggerContainer, 
  cardsGridContainer, 
  cardRevealItem, 
  revealItem,
  slideInRightItem
} from '../../utils/motionVariants';

interface BusinessPortfolioProps {
  profile: MockProfile;
  onOpenProject: (project: ProjectItem) => void;
  onOpenResume: () => void;
  onGenerateAiVisuals?: () => void;
}

export const BusinessPortfolio: React.FC<BusinessPortfolioProps> = ({
  profile,
  onOpenProject,
  onOpenResume,
  onGenerateAiVisuals
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const avatar = profile.avatarImage || generateProceduralAvatar(profile.fullName, 'business', '#f59e0b');

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText(profile.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="min-h-screen business-canvas-bg text-neutral-100 font-body selection:bg-amber-500/20 selection:text-amber-300">
      {/* Top Bar Contract (3 Zones, Single text brand) */}
      <header className="sticky top-0 z-40 border-b border-neutral-800/80 bg-[#0b0f17]/90 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Zone 1: Wordmark */}
          <a href="#hero" className="text-lg font-bold font-business tracking-wide text-white">
            {profile.fullName.toUpperCase()} <span className="text-xs font-mono text-neutral-400 font-normal ml-1">/ EXECUTIVE ADVISORY</span>
          </a>

          {/* Zone 2: 4-6 text links */}
          <nav className="hidden md:flex items-center gap-7 text-xs text-neutral-300 font-medium">
            <a href="#kpis" className="hover:text-white transition-colors">Executive KPIs</a>
            <a href="#initiatives" className="hover:text-white transition-colors">GTM Initiatives</a>
            <a href="#competencies" className="hover:text-white transition-colors">Competencies</a>
            <a href="#career" className="hover:text-white transition-colors">Trajectory</a>
            {profile.education && profile.education.length > 0 && (
              <a href="#education" className="hover:text-white transition-colors">Academia</a>
            )}
            {((profile.certifications && profile.certifications.length > 0) || (profile.awards && profile.awards.length > 0)) && (
              <a href="#credentials" className="hover:text-white transition-colors">Governance</a>
            )}
            <a href="#board" className="hover:text-white transition-colors">Board Endorsements</a>
          </nav>

          {/* Zone 3: Primary actions */}
          <div className="flex items-center gap-3">
            {onGenerateAiVisuals && (
              <button
                onClick={onGenerateAiVisuals}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-amber-500/50 bg-amber-950/40 text-amber-300 hover:bg-amber-900/60 transition-colors cursor-pointer"
                title="Tạo ảnh minh họa bằng AI"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Sinh ảnh AI</span>
              </button>
            )}

            <button
              onClick={onOpenResume}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Executive Brief</span>
            </button>

            <a
              href={`mailto:${profile.email}`}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg text-neutral-950 theme-accent-bg hover:opacity-90 transition-opacity cursor-pointer shadow-md"
            >
              Book Consultation
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section: Executive Credibility */}
      <motion.section 
        id="hero" 
        className="relative pt-16 pb-20 px-6 max-w-7xl mx-auto"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <motion.div variants={revealItem} className="lg:col-span-8">
            <motion.div variants={revealItem} className="inline-flex items-center gap-2 text-xs font-mono mb-6 px-3 py-1 rounded bg-neutral-900/90 border border-neutral-800 text-neutral-300">
              <span className="w-2 h-2 rounded-full theme-accent-bg animate-pulse" />
              <span>ENTERPRISE GTM &amp; REVENUE LEADERSHIP</span>
              <span className="text-neutral-500">· {profile.location}</span>
            </motion.div>

            <motion.h1 variants={revealItem} className="text-4xl sm:text-5xl lg:text-6xl font-normal text-white font-business tracking-tight mb-6 leading-tight">
              {profile.fullName}
            </motion.h1>

            <motion.div variants={revealItem} className="text-base sm:text-lg font-semibold theme-accent-text mb-6">
              {profile.title}
            </motion.div>

            <motion.p variants={revealItem} className="text-sm sm:text-base text-neutral-300 leading-relaxed font-light mb-8 max-w-2xl">
              {profile.bio}
            </motion.p>

            <motion.div variants={revealItem} className="flex flex-wrap items-center gap-4">
              <a
                href="#initiatives"
                className="py-3 px-6 rounded-lg text-xs font-semibold text-neutral-950 theme-accent-bg hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <span>Nghiên cứu Chiến dịch GTM</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="py-3 px-5 rounded-lg text-xs font-medium bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-neutral-200 transition-colors flex items-center gap-2 cursor-pointer"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-amber-400" /> : <Copy className="w-4 h-4 text-neutral-400" />}
                <span>{copiedEmail ? 'Đã sao chép email' : profile.email}</span>
              </button>
            </motion.div>
          </motion.div>

          <motion.div variants={slideInRightItem} className="lg:col-span-4 flex justify-center">
            <div className="relative w-64 h-80 rounded-2xl overflow-hidden border border-neutral-700 shadow-2xl bg-neutral-900">
              <img
                src={avatar}
                alt={profile.fullName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">C-Level Advisor</span>
                <h4 className="text-sm font-bold text-white">{profile.fullName}</h4>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Boardroom KPI Strip with Stagger Reveal */}
      <motion.section 
        id="kpis" 
        className="py-12 border-y border-neutral-800/80 bg-neutral-900/40"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div variants={cardsGridContainer} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {profile.metrics.map((m, idx) => (
              <motion.div
                key={idx}
                variants={cardRevealItem}
                className="p-6 rounded-xl bg-neutral-900/70 border border-neutral-800 hover:border-amber-500/30 transition-all shadow-sm"
                whileHover={{ y: -3 }}
              >
                <div className="text-3xl sm:text-4xl font-extrabold text-white font-business mb-1">
                  {m.value}
                </div>
                <div className="text-xs font-semibold theme-accent-text mb-1">
                  {m.label}
                </div>
                {m.subtext && (
                  <div className="text-[11px] text-neutral-400 font-light">
                    {m.subtext}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* High-Stakes Initiatives (Projects) with Stagger Reveal */}
      <motion.section 
        id="initiatives" 
        className="py-24 px-6 max-w-7xl mx-auto"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
      >
        <motion.div variants={revealItem} className="mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold mb-2 block">
            Executive Case Studies
          </span>
          <h2 className="text-3xl sm:text-4xl font-normal text-white font-business">
            Chiến dịch Mở rộng &amp; Tăng trưởng Doanh thu
          </h2>
        </motion.div>

        <motion.div variants={cardsGridContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {profile.projects.map((proj) => {
            const visual = proj.imageUrl || generateProceduralVisual({
              theme: 'business',
              title: proj.title,
              category: proj.category,
              aspectRatio: '16:9',
            });

            return (
              <motion.div
                key={proj.id}
                variants={cardRevealItem}
                onClick={() => onOpenProject(proj)}
                className="group rounded-2xl bg-neutral-900/60 border border-neutral-800 overflow-hidden hover:border-neutral-600 transition-all cursor-pointer flex flex-col justify-between shadow-xl"
                whileHover={{ y: -4 }}
              >
                <div className="relative aspect-video w-full bg-neutral-950 overflow-hidden border-b border-neutral-800">
                  <img
                    src={visual}
                    alt={proj.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded text-[10px] font-mono bg-black/80 text-amber-300 border border-neutral-800">
                    {proj.category}
                  </div>
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded text-[10px] font-mono bg-black/80 text-neutral-400 border border-neutral-800">
                    {proj.year}
                  </div>
                </div>

                <div className="p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors font-business mb-2">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-neutral-300 leading-relaxed font-light mb-4 line-clamp-3">
                      {proj.tagline}
                    </p>

                    {proj.metrics && proj.metrics.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-neutral-950/70 border border-neutral-800/80 mb-4">
                        {proj.metrics.map((m, mIdx) => (
                          <div key={mIdx} className="text-center">
                            <div className="text-xs font-bold text-white font-mono">{m.value}</div>
                            <div className="text-[9px] text-neutral-400 truncate">{m.label}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {proj.tags.map((t, tIdx) => (
                        <span key={tIdx} className="text-[10px] px-2.5 py-0.5 rounded bg-neutral-800/80 text-neutral-300">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-neutral-800 text-xs text-neutral-400 group-hover:text-white transition-colors">
                      <span className="flex items-center gap-1 font-medium">Chi tiết ROI &amp; Tác động <ArrowUpRight className="w-3.5 h-3.5" /></span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>

      {/* Dynamic Section Mapping: Skills -> Grid / Tag Cloud UI */}
      <DynamicSectionRenderer sectionType="skills" profile={profile} concept="executive-kpi" />

      {/* Dynamic Section Mapping: Experience -> Card-Based List UI */}
      <DynamicSectionRenderer sectionType="experience" profile={profile} concept="executive-kpi" />

      {/* Dynamic Section Mapping: Education -> Distinct Timeline UI */}
      {profile.education && profile.education.length > 0 && (
        <DynamicSectionRenderer sectionType="education" profile={profile} concept="executive-kpi" />
      )}

      {/* DISTINCT SECTION: Governance & Executive Accreditations (Chứng chỉ & Giải thưởng) */}
      {((profile.certifications && profile.certifications.length > 0) || (profile.awards && profile.awards.length > 0)) && (
        <motion.section 
          id="credentials" 
          className="py-24 border-t border-neutral-800/80 px-6 max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {profile.certifications && profile.certifications.length > 0 && (
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold mb-2 block">
                  Governance &amp; Certifications
                </span>
                <h3 className="text-2xl font-bold text-white font-business flex items-center gap-2.5 mb-6">
                  <ShieldCheck className="w-6 h-6 text-amber-400" />
                  <span>Chứng nhận Năng lực Quản trị</span>
                </h3>

                <div className="space-y-4">
                  {profile.certifications.map((cert, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-semibold text-white">{cert}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">
                        VERIFIED
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {profile.awards && profile.awards.length > 0 && (
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold mb-2 block">
                  Honors &amp; Recognition
                </span>
                <h3 className="text-2xl font-bold text-white font-business flex items-center gap-2.5 mb-6">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  <span>Giải thưởng &amp; Vinh danh Lãnh đạo</span>
                </h3>

                <div className="space-y-4">
                  {profile.awards.map((award, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center gap-3">
                      <Trophy className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-neutral-200">{award}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.section>
      )}

      {/* Board Endorsements (Testimonials) */}
      <motion.section 
        id="board" 
        className="py-24 border-t border-neutral-800/80 bg-neutral-900/30 px-6"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="mb-14 text-center">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold mb-2 block">
              Executive Endorsements
            </span>
            <h2 className="text-3xl sm:text-4xl font-normal text-white font-business">
              Đánh giá từ Hội đồng Quản trị &amp; Lãnh đạo Cấp cao
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {profile.testimonials.map((test, idx) => (
              <motion.div
                key={test.id}
                className="p-8 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between"
                whileHover={{ y: -4 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <p className="text-sm text-neutral-300 italic font-light leading-relaxed mb-6 font-business">
                  "{test.quote}"
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-neutral-800">
                  <div className="w-10 h-10 rounded-full bg-amber-950/60 border border-amber-800/70 text-amber-300 font-bold flex items-center justify-center text-xs font-business">
                    {test.avatarText}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{test.author}</div>
                    <div className="text-[11px] text-neutral-400">{test.role} · {test.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Advisory & Footer */}
      <motion.footer 
        className="py-20 px-6 border-t border-neutral-800 max-w-4xl mx-auto text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {profile.philosophy && (
          <div className="mb-10 p-8 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-left sm:text-center">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 mb-3 block">Triết lý Điều hành</span>
            <p className="text-base text-neutral-200 italic font-business leading-relaxed">
              "{profile.philosophy}"
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400 mb-8 font-light">
          <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-amber-400" /> {profile.email}</span>
          <span>·</span>
          <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-amber-400" /> {profile.phone}</span>
          <span>·</span>
          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-amber-400" /> {profile.location}</span>
        </div>

        <p className="text-[11px] text-neutral-500 font-mono">
          EXECUTIVE ADVISORY · WALL-STREET SPECIFICATION · POWERED BY FRAMER MOTION
        </p>
      </motion.footer>
    </div>
  );
};
