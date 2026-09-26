import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowUpRight, 
  Download, 
  Mail, 
  ExternalLink, 
  Sparkles, 
  Zap, 
  Star, 
  Globe, 
  Eye, 
  Compass, 
  Award,
  Layers,
  CheckCircle2,
  Terminal,
  Cpu,
  GraduationCap,
  Trophy,
  ShieldCheck,
  Copy,
  Check,
  Phone,
  MapPin
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

interface BrutalistPortfolioProps {
  profile: MockProfile;
  onOpenProject: (project: ProjectItem) => void;
  onOpenResume: () => void;
  onGenerateAiVisuals?: () => void;
}

export const BrutalistPortfolio: React.FC<BrutalistPortfolioProps> = ({
  profile,
  onOpenProject,
  onOpenResume,
  onGenerateAiVisuals,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const avatar = profile.avatarImage || generateProceduralAvatar(profile.fullName, profile.industry);

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText(profile.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0d0e12] text-neutral-100 font-mono selection:bg-yellow-400 selection:text-black">
      {/* Brutalist Top Marquee Strip */}
      <div className="border-b-4 border-neutral-800 bg-neutral-900 py-3 overflow-hidden whitespace-nowrap text-xs font-black uppercase tracking-wider text-neutral-200">
        <motion.div 
          className="inline-flex gap-8 items-center"
          animate={{ x: [0, -1200] }}
          transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
        >
          <span className="text-yellow-400">★ PORTFOLIO EDITION 2026</span>
          <span>///</span>
          <span>CURATED BY GEN-FOLIO ENGINE</span>
          <span>///</span>
          <span className="text-yellow-400">ZERO COMPROMISE · 100% PRODUCTION READY</span>
          <span>///</span>
          <span>AVAILABLE FOR SELECT HIGH-IMPACT INITIATIVES</span>
          <span>///</span>
          <span className="text-yellow-400">★ PORTFOLIO EDITION 2026</span>
          <span>///</span>
          <span>CURATED BY GEN-FOLIO ENGINE</span>
          <span>///</span>
          <span className="text-yellow-400">ZERO COMPROMISE · 100% PRODUCTION READY</span>
          <span>///</span>
          <span>AVAILABLE FOR SELECT HIGH-IMPACT INITIATIVES</span>
        </motion.div>
      </div>

      {/* Brutalist Header Bar */}
      <header className="sticky top-0 z-40 border-b-4 border-neutral-800 bg-[#0d0e12]/95 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="#hero" className="flex items-center gap-3 group">
            <span className="px-2.5 py-1 text-sm font-black bg-yellow-400 text-neutral-950 border-2 border-black uppercase shadow-[3px_3px_0px_#ffffff]">
              {profile.fullName.slice(0, 2).toUpperCase()}
            </span>
            <span className="text-base font-black tracking-tight text-white group-hover:text-yellow-400 transition-colors">
              {profile.fullName.toUpperCase()}
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-neutral-300">
            <a href="#projects" className="hover:text-yellow-400 transition-colors">01. Showcase</a>
            <a href="#skills" className="hover:text-yellow-400 transition-colors">02. Stack</a>
            <a href="#career" className="hover:text-yellow-400 transition-colors">03. History</a>
            {profile.education && profile.education.length > 0 && (
              <a href="#education" className="hover:text-yellow-400 transition-colors">04. Academia</a>
            )}
            {((profile.certifications && profile.certifications.length > 0) || (profile.awards && profile.awards.length > 0)) && (
              <a href="#credentials" className="hover:text-yellow-400 transition-colors">05. Badges</a>
            )}
            <a href="#reviews" className="hover:text-yellow-400 transition-colors">06. Endorse</a>
          </nav>

          <div className="flex items-center gap-3">
            {onGenerateAiVisuals && (
              <button
                onClick={onGenerateAiVisuals}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-neutral-950 bg-yellow-400 border-2 border-yellow-300 hover:bg-yellow-300 shadow-[3px_3px_0px_#000] cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sinh ảnh AI</span>
              </button>
            )}

            <button
              onClick={onOpenResume}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-neutral-900 border-2 border-neutral-700 hover:border-white shadow-[3px_3px_0px_#ffffff] cursor-pointer"
            >
              CV Full
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section: Raw Asymmetrical Poster */}
      <motion.section 
        id="hero" 
        className="pt-12 pb-16 px-6 max-w-7xl mx-auto"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
      >
        <div className="border-4 border-neutral-800 bg-neutral-900/90 p-8 sm:p-12 shadow-[10px_10px_0px_#facc15] relative overflow-hidden">
          <motion.div variants={revealItem} className="inline-block px-3 py-1 text-xs font-black bg-yellow-400 text-black border-2 border-black mb-6 uppercase shadow-[3px_3px_0px_#000]">
            STATUS: ACTIVE / VERIFIED CANDIDATE
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <motion.div variants={revealItem} className="lg:col-span-8">
              <motion.h1 variants={revealItem} className="text-4xl sm:text-6xl md:text-7xl font-black uppercase text-white tracking-tight leading-[1] mb-6">
                {profile.fullName}
              </motion.h1>

              <motion.div variants={revealItem} className="text-base sm:text-xl font-bold text-yellow-400 mb-6 uppercase border-l-4 border-yellow-400 pl-4">
                {profile.title}
              </motion.div>

              <motion.p variants={revealItem} className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-2xl mb-8">
                {profile.bio}
              </motion.p>

              <motion.div variants={revealItem} className="flex flex-wrap items-center gap-4">
                <a
                  href="#projects"
                  className="px-6 py-3 text-xs font-black uppercase tracking-wider text-black bg-yellow-400 border-2 border-black hover:bg-yellow-300 shadow-[4px_4px_0px_#ffffff] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Dự án Chiến đấu</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="px-5 py-3 text-xs font-black uppercase tracking-wider text-white bg-neutral-950 border-2 border-neutral-700 hover:border-yellow-400 shadow-[4px_4px_0px_#facc15] transition-all flex items-center gap-2 cursor-pointer"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-yellow-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedEmail ? 'Copied' : profile.email}</span>
                </button>
              </motion.div>
            </motion.div>

            <motion.div variants={slideInRightItem} className="lg:col-span-4 flex justify-center">
              <div className="w-56 h-72 rounded-none border-4 border-black bg-neutral-950 shadow-[8px_8px_0px_#ffffff] overflow-hidden relative group">
                <img
                  src={avatar}
                  alt={profile.fullName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover filter contrast-125"
                />
                <div className="absolute bottom-0 inset-x-0 bg-yellow-400 text-black text-[10px] font-black uppercase p-2 border-t-2 border-black text-center">
                  PROD CERTIFIED ID: {profile.id.slice(0, 10)}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Big Metric Blocks with Stagger Reveal */}
      <motion.section 
        className="py-12 px-6 max-w-7xl mx-auto"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
      >
        <motion.div variants={cardsGridContainer} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {profile.metrics.map((m, idx) => (
            <motion.div
              key={idx}
              variants={cardRevealItem}
              className="p-6 border-4 border-neutral-800 bg-neutral-900 shadow-[6px_6px_0px_#000] hover:shadow-[8px_8px_0px_#facc15] transition-all"
              whileHover={{ y: -3 }}
            >
              <div className="text-3xl sm:text-4xl font-black text-yellow-400 mb-2">
                {m.value}
              </div>
              <div className="text-xs font-black uppercase text-white mb-1">
                {m.label}
              </div>
              {m.subtext && (
                <div className="text-[10px] text-neutral-400 uppercase">
                  {m.subtext}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Hard-Edged Projects Showcase with Stagger Reveal */}
      <motion.section 
        id="projects" 
        className="py-20 px-6 max-w-7xl mx-auto"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
      >
        <motion.div variants={revealItem} className="mb-10 flex items-center justify-between border-b-4 border-neutral-800 pb-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-yellow-400">Section 01</span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white">
              Dự án Thực chiến
            </h2>
          </div>
          <span className="text-xs font-black text-neutral-500 hidden sm:block">TOTAL: {profile.projects.length} UNITS</span>
        </motion.div>

        <motion.div variants={cardsGridContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {profile.projects.map((proj) => {
            const visual = proj.imageUrl || generateProceduralVisual({
              theme: 'brutalist',
              title: proj.title,
              category: proj.category,
              aspectRatio: '16:9',
            });

            return (
              <motion.div
                key={proj.id}
                variants={cardRevealItem}
                onClick={() => onOpenProject(proj)}
                className="border-4 border-neutral-800 bg-neutral-900 shadow-[6px_6px_0px_#000] hover:shadow-[10px_10px_0px_#facc15] hover:border-yellow-400 transition-all cursor-pointer flex flex-col justify-between"
                whileHover={{ y: -4 }}
              >
                <div className="relative aspect-video w-full border-b-4 border-neutral-800 bg-neutral-950 overflow-hidden">
                  <img
                    src={visual}
                    alt={proj.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover filter grayscale contrast-125 hover:grayscale-0 transition-all duration-300"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-black bg-yellow-400 text-black border-2 border-black uppercase">
                    {proj.category}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-black uppercase text-white mb-2 line-clamp-1">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-neutral-400 leading-relaxed mb-4 line-clamp-3">
                      {proj.tagline}
                    </p>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {proj.tags.map((t, tIdx) => (
                        <span key={tIdx} className="text-[10px] font-black uppercase px-2 py-0.5 bg-neutral-950 text-neutral-300 border border-neutral-700">
                          #{t}
                        </span>
                      ))}
                    </div>

                    <div className="pt-3 border-t-2 border-neutral-800 flex items-center justify-between text-xs font-black uppercase text-yellow-400">
                      <span>Mở Blueprint</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>

      {/* Dynamic Section Mapping: Skills -> Grid / Tag Cloud UI */}
      <DynamicSectionRenderer sectionType="skills" profile={profile} concept="brutalist" />

      {/* Dynamic Section Mapping: Experience -> Card-Based List UI */}
      <DynamicSectionRenderer sectionType="experience" profile={profile} concept="brutalist" />

      {/* Dynamic Section Mapping: Education -> Distinct Timeline UI */}
      {profile.education && profile.education.length > 0 && (
        <DynamicSectionRenderer sectionType="education" profile={profile} concept="brutalist" />
      )}

      {/* DISTINCT SECTION: Badges & Honors (Chứng chỉ & Giải thưởng) */}
      {((profile.certifications && profile.certifications.length > 0) || (profile.awards && profile.awards.length > 0)) && (
        <motion.section 
          id="credentials" 
          className="py-20 px-6 max-w-7xl mx-auto border-t-4 border-neutral-800"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {profile.certifications && profile.certifications.length > 0 && (
              <div>
                <div className="mb-6 flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-2xl font-black uppercase text-white">Chứng nhận Kỹ thuật</h3>
                </div>
                <div className="space-y-3">
                  {profile.certifications.map((cert, idx) => (
                    <div key={idx} className="p-4 border-2 border-neutral-800 bg-neutral-900 shadow-[4px_4px_0px_#000] flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-white">{cert}</span>
                      <span className="text-[10px] font-black bg-yellow-400 text-black px-2 py-0.5 border border-black">PASS</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {profile.awards && profile.awards.length > 0 && (
              <div>
                <div className="mb-6 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-2xl font-black uppercase text-white">Giải thưởng &amp; Chiến tích</h3>
                </div>
                <div className="space-y-3">
                  {profile.awards.map((award, idx) => (
                    <div key={idx} className="p-4 border-2 border-neutral-800 bg-neutral-900 shadow-[4px_4px_0px_#facc15] flex items-center gap-3">
                      <Star className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                      <span className="text-xs font-black uppercase text-neutral-200">{award}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.section>
      )}

      {/* Raw Quotation Reviews (Testimonials) */}
      <motion.section 
        id="reviews" 
        className="py-20 px-6 max-w-5xl mx-auto border-t-4 border-neutral-800"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-yellow-400">Section 06</span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase text-white">
            Thẩm định &amp; Nhận xét
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {profile.testimonials.map((test, idx) => (
            <motion.div
              key={test.id}
              className="p-8 border-4 border-neutral-800 bg-neutral-900 shadow-[8px_8px_0px_#000] flex flex-col justify-between"
              whileHover={{ y: -4 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <p className="text-xs sm:text-sm text-neutral-200 uppercase font-black leading-relaxed mb-6">
                “{test.quote}”
              </p>

              <div className="pt-4 border-t-2 border-neutral-800 flex items-center gap-3">
                <div className="w-10 h-10 border-2 border-black bg-yellow-400 text-black font-black flex items-center justify-center text-sm">
                  {test.avatarText}
                </div>
                <div>
                  <div className="text-xs font-black uppercase text-white">{test.author}</div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase">{test.role} // {test.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Giant Contact Stamp & Philosophy */}
      <motion.footer 
        className="py-16 px-6 max-w-4xl mx-auto border-t-4 border-neutral-800 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {profile.philosophy && (
          <div className="mb-10 p-6 border-4 border-neutral-800 bg-black shadow-[6px_6px_0px_#facc15] text-left">
            <div className="text-xs font-black text-yellow-400 uppercase mb-2">★ TRIẾT LÝ HÀNH ĐỘNG</div>
            <p className="text-xs sm:text-sm text-white uppercase font-bold leading-relaxed">
              "{profile.philosophy}"
            </p>
          </div>
        )}

        <div className="p-8 border-4 border-neutral-800 bg-yellow-400 text-black shadow-[8px_8px_0px_#ffffff] mb-8 text-left">
          <div className="text-xs font-black uppercase mb-3">TRẠM LIÊN HỆ TRỰC TIẾP:</div>
          <div className="flex flex-wrap gap-4 text-xs font-black uppercase">
            <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {profile.email}</span>
            <span>/</span>
            <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {profile.phone}</span>
            <span>/</span>
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {profile.location}</span>
          </div>
        </div>

        <p className="text-[10px] font-black text-neutral-500 uppercase">
          GEN-FOLIO ENGINE · NEO-BRUTALIST ARCHITECTURE
        </p>
      </motion.footer>
    </div>
  );
};
