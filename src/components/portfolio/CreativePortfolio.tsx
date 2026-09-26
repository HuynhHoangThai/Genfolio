import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowUpRight, 
  ExternalLink, 
  Award, 
  Mail, 
  Download, 
  Eye, 
  Layers, 
  Feather,
  Compass,
  CheckCircle2,
  GraduationCap,
  Trophy,
  ShieldCheck,
  MapPin,
  Phone,
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

interface CreativePortfolioProps {
  profile: MockProfile;
  onOpenProject: (project: ProjectItem) => void;
  onOpenResume: () => void;
  onGenerateAiVisuals?: () => void;
}

export const CreativePortfolio: React.FC<CreativePortfolioProps> = ({
  profile,
  onOpenProject,
  onOpenResume,
  onGenerateAiVisuals,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const avatar = profile.avatarImage || generateProceduralAvatar(profile.fullName, 'creative', '#f43f5e');

  const categories = ['all', ...Array.from(new Set((profile.projects || []).map(p => p.category).filter(Boolean)))];
  const filteredProjects = activeCategory === 'all'
    ? profile.projects
    : profile.projects.filter((p) => p.category === activeCategory);

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText(profile.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#07080b] text-neutral-100 font-body selection:bg-rose-500/20 selection:text-rose-300">
      {/* Dynamic ambient glassmesh background */}
      <div className="fixed inset-0 creative-mesh-bg pointer-events-none opacity-40" />

      {/* Top Bar Contract (3 Zones, Single text brand) */}
      <header className="sticky top-0 z-40 border-b border-neutral-800/60 bg-[#07080b]/80 backdrop-blur-xl px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Zone 1: Brand title */}
          <a href="#hero" className="text-lg font-extrabold tracking-tight font-creative text-white">
            {profile.fullName.toUpperCase()} <span className="text-xs font-mono font-normal theme-accent-text ml-1">/ STUDIO</span>
          </a>

          {/* Zone 2: 4-6 text links */}
          <nav className="hidden md:flex items-center gap-7 text-xs text-neutral-300 font-medium">
            <a href="#works" className="hover:text-white transition-colors">Works</a>
            <a href="#competencies" className="hover:text-white transition-colors">Disciplines</a>
            <a href="#milestones" className="hover:text-white transition-colors">Milestones</a>
            {profile.education && profile.education.length > 0 && (
              <a href="#education" className="hover:text-white transition-colors">Laurels</a>
            )}
            {((profile.awards && profile.awards.length > 0) || (profile.certifications && profile.certifications.length > 0)) && (
              <a href="#accolades" className="hover:text-white transition-colors">Accolades</a>
            )}
            <a href="#collaborations" className="hover:text-white transition-colors">Endorsements</a>
          </nav>

          {/* Zone 3: Primary actions */}
          <div className="flex items-center gap-3">
            {onGenerateAiVisuals && (
              <button
                onClick={onGenerateAiVisuals}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border border-rose-500/50 bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 transition-all cursor-pointer"
                title="Tạo ảnh minh họa bằng AI"
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                <span>Sinh ảnh AI</span>
              </button>
            )}

            <button
              onClick={onOpenResume}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border border-neutral-700 bg-neutral-900/60 hover:bg-neutral-850 text-neutral-300 hover:text-white transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Full Dossier</span>
            </button>

            <a
              href={`mailto:${profile.email}`}
              className="px-4 py-1.5 text-xs font-semibold rounded-full text-neutral-950 theme-accent-bg hover:opacity-90 transition-all cursor-pointer shadow-lg"
            >
              Inquire
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section: Editorial Split */}
      <motion.section 
        id="hero" 
        className="relative pt-16 pb-24 px-6 max-w-7xl mx-auto"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Bold Editorial Typography with Stagger */}
          <motion.div variants={revealItem} className="lg:col-span-8">
            <motion.div variants={revealItem} className="inline-flex items-center gap-2 text-xs font-mono mb-6 px-3.5 py-1 rounded-full bg-neutral-900/90 border border-neutral-700/60 text-neutral-300 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full theme-accent-bg" />
              <span>SELECTED ARCHIVES 2024 — 2026</span>
              <span className="text-neutral-500">· {profile.location}</span>
            </motion.div>

            <motion.h1 variants={revealItem} className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 font-creative leading-[1.08] text-balance">
              {profile.title.split('&')[0]} <br className="hidden sm:inline" />
              <span className="italic font-business font-normal opacity-90 theme-accent-text">&amp; {profile.title.split('&')[1] || 'Digital Direction'}</span>
            </motion.h1>

            <motion.p variants={revealItem} className="text-base sm:text-lg text-neutral-300 leading-relaxed max-w-2xl font-light mb-8">
              {profile.bio}
            </motion.p>

            <motion.div variants={revealItem} className="flex flex-wrap items-center gap-4">
              <a
                href="#works"
                className="py-3 px-6 rounded-full text-xs font-bold text-neutral-950 theme-accent-bg hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer shadow-xl"
              >
                <span>Khám phá Tuyển tập Tác phẩm</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="py-3 px-5 rounded-full text-xs font-medium bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/70 text-neutral-200 transition-all flex items-center gap-2 cursor-pointer backdrop-blur-sm"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-rose-400" /> : <Copy className="w-3.5 h-3.5 text-neutral-400" />}
                <span>{copiedEmail ? 'Đã sao chép email' : profile.email}</span>
              </button>
            </motion.div>
          </motion.div>

          {/* Right Column: High-Fashion Monogram Avatar Card with Slide In */}
          <motion.div variants={slideInRightItem} className="lg:col-span-4 flex justify-center">
            <motion.div 
              className="relative w-64 h-80 sm:w-72 sm:h-96 rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-neutral-900 group"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={avatar}
                alt={profile.fullName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              <div className="absolute bottom-5 left-5 right-5 text-left">
                <span className="text-[10px] font-mono tracking-widest text-rose-400 uppercase">Art Direction</span>
                <h4 className="text-base font-bold text-white font-creative">{profile.fullName}</h4>
                <p className="text-xs text-neutral-300 font-light truncate">{profile.tagline}</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Bento Metrics Bar with Stagger Reveal */}
      <motion.section 
        className="py-12 border-y border-neutral-800/60 bg-neutral-950/40 backdrop-blur-md"
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
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-rose-500/30 transition-all backdrop-blur-sm"
                whileHover={{ y: -3 }}
              >
                <div className="text-3xl sm:text-4xl font-extrabold text-white font-creative mb-1">
                  {m.value}
                </div>
                <div className="text-xs font-semibold theme-accent-text mb-1 tracking-wide">
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

      {/* Selected Works (Projects) with Stagger Reveal */}
      <motion.section 
        id="works" 
        className="py-24 px-6 max-w-7xl mx-auto"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
      >
        <motion.div variants={revealItem} className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-rose-400 font-semibold mb-2 block">
              Curated Portfolio
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-creative">
              Tuyển tập Tác phẩm Chọn lọc
            </h2>
          </div>

          <div className="flex items-center gap-2 p-1 bg-neutral-900/80 rounded-full border border-neutral-800 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 text-xs rounded-full whitespace-nowrap transition-all cursor-pointer font-medium ${
                  activeCategory === cat
                    ? 'theme-accent-bg text-neutral-950 font-bold shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'Tất cả' : cat}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div variants={cardsGridContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((proj) => {
            const visual = proj.imageUrl || generateProceduralVisual({
              theme: 'creative',
              title: proj.title,
              category: proj.category,
              aspectRatio: '16:9',
            });

            return (
              <motion.div
                key={proj.id}
                variants={cardRevealItem}
                onClick={() => onOpenProject(proj)}
                className="group rounded-3xl bg-neutral-900/40 border border-white/5 overflow-hidden hover:border-rose-500/40 transition-all cursor-pointer flex flex-col justify-between backdrop-blur-sm shadow-xl"
                whileHover={{ y: -5 }}
              >
                <div className="relative aspect-video w-full overflow-hidden bg-neutral-950">
                  <img
                    src={visual}
                    alt={proj.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-mono bg-black/60 backdrop-blur-md text-rose-300 border border-white/10">
                    {proj.category}
                  </div>
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full text-[10px] font-mono bg-black/60 backdrop-blur-md text-neutral-300 border border-white/10">
                    {proj.year}
                  </div>
                </div>

                <div className="p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-rose-400 transition-colors font-creative mb-2">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-neutral-300 leading-relaxed font-light mb-4 line-clamp-3">
                      {proj.tagline}
                    </p>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {proj.tags.map((t, tIdx) => (
                        <span key={tIdx} className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/[0.04] text-neutral-300 border border-white/5">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs text-neutral-400 group-hover:text-white transition-colors">
                      <span className="flex items-center gap-1 font-medium">Khám phá Case Study <ArrowUpRight className="w-3.5 h-3.5" /></span>
                      <Eye className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>

      {/* Dynamic Section Mapping: Skills -> Grid / Tag Cloud UI */}
      <DynamicSectionRenderer sectionType="skills" profile={profile} concept="bento-glass" />

      {/* Dynamic Section Mapping: Experience -> Card-Based List UI */}
      <DynamicSectionRenderer sectionType="experience" profile={profile} concept="bento-glass" />

      {/* Dynamic Section Mapping: Education -> Distinct Timeline UI */}
      {profile.education && profile.education.length > 0 && (
        <DynamicSectionRenderer sectionType="education" profile={profile} concept="bento-glass" />
      )}

      {/* DISTINCT SECTION: Accolades & Certified Standards (Giải thưởng & Chứng chỉ) */}
      {((profile.awards && profile.awards.length > 0) || (profile.certifications && profile.certifications.length > 0)) && (
        <motion.section 
          id="accolades" 
          className="py-24 border-t border-neutral-800/60 px-6 max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {profile.awards && profile.awards.length > 0 && (
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-rose-400 font-semibold mb-2 block">
                  International Recognition
                </span>
                <h3 className="text-2xl font-bold text-white font-creative flex items-center gap-2.5 mb-6">
                  <Trophy className="w-6 h-6 text-amber-400" />
                  <span>Giải thưởng &amp; Vinh danh Quốc tế</span>
                </h3>

                <div className="space-y-4">
                  {profile.awards.map((award, idx) => (
                    <motion.div
                      key={idx}
                      className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-amber-500/40 transition-all flex items-center gap-4"
                      whileHover={{ x: 5 }}
                    >
                      <div className="w-10 h-10 rounded-full bg-amber-950/60 border border-amber-800/80 flex items-center justify-center text-amber-400 flex-shrink-0">
                        <Award className="w-5 h-5" />
                      </div>
                      <div className="text-xs sm:text-sm text-neutral-200 font-light">
                        {award}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {profile.certifications && profile.certifications.length > 0 && (
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-rose-400 font-semibold mb-2 block">
                  Design Standards
                </span>
                <h3 className="text-2xl font-bold text-white font-creative flex items-center gap-2.5 mb-6">
                  <ShieldCheck className="w-6 h-6 text-rose-400" />
                  <span>Quy chuẩn &amp; Chứng nhận Chuyên ngành</span>
                </h3>

                <div className="space-y-4">
                  {profile.certifications.map((cert, idx) => (
                    <motion.div
                      key={idx}
                      className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-rose-500/40 transition-all flex items-center justify-between gap-4"
                      whileHover={{ x: 5 }}
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-rose-400 flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-white font-medium">{cert}</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-white/5">
                        VERIFIED
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.section>
      )}

      {/* Endorsements (Testimonials) */}
      <motion.section 
        id="collaborations" 
        className="py-24 border-t border-neutral-800/60 bg-neutral-950/60 px-6"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="mb-14 text-center">
            <span className="text-xs font-mono uppercase tracking-widest text-rose-400 font-semibold mb-2 block">
              Collaborative Voices
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-creative">
              Đánh giá từ Đối tác &amp; Lãnh đạo
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {profile.testimonials.map((test, idx) => (
              <motion.div
                key={test.id}
                className="p-8 rounded-3xl bg-neutral-900/60 border border-white/5 flex flex-col justify-between"
                whileHover={{ y: -4 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <p className="text-sm text-neutral-300 italic font-light leading-relaxed mb-6">
                  "{test.quote}"
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <div className="w-10 h-10 rounded-full bg-rose-950/50 border border-rose-800/60 text-rose-300 font-bold flex items-center justify-center text-xs font-creative">
                    {test.avatarText}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white font-creative">{test.author}</div>
                    <div className="text-[11px] text-neutral-400">{test.role} · {test.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Philosophy & Studio Footer */}
      <motion.footer 
        className="py-20 px-6 border-t border-neutral-800/80 text-center max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {profile.philosophy && (
          <div className="mb-10 p-8 rounded-3xl bg-neutral-900/40 border border-white/5">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-3 block">Triết lý Sáng tạo</span>
            <p className="text-base text-neutral-200 italic font-light leading-relaxed max-w-2xl mx-auto">
              "{profile.philosophy}"
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400 mb-8 font-light">
          <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-rose-400" /> {profile.email}</span>
          <span>·</span>
          <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-rose-400" /> {profile.phone}</span>
          <span>·</span>
          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-rose-400" /> {profile.location}</span>
        </div>

        <p className="text-[11px] text-neutral-500 font-mono">
          ATELIER LINH · Trình bày với chuẩn Framer Motion &amp; GSAP Bento Architecture
        </p>
      </motion.footer>
    </div>
  );
};
