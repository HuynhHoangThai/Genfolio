import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowUpRight, 
  Download, 
  Mail, 
  Globe, 
  Sparkles, 
  BookOpen, 
  Compass, 
  Award, 
  CheckCircle2,
  ChevronRight,
  Layers,
  ArrowDown,
  GraduationCap,
  Trophy,
  ShieldCheck,
  Copy,
  Check,
  MapPin,
  Phone
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

interface SwissEditorialPortfolioProps {
  profile: MockProfile;
  onOpenProject: (project: ProjectItem) => void;
  onOpenResume: () => void;
  onGenerateAiVisuals?: () => void;
}

export const SwissEditorialPortfolio: React.FC<SwissEditorialPortfolioProps> = ({
  profile,
  onOpenProject,
  onOpenResume,
  onGenerateAiVisuals,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const avatar = profile.avatarImage || generateProceduralAvatar(profile.fullName, 'creative', '#ffffff');

  const categories = ['all', ...Array.from(new Set((profile.projects || []).map((p) => p.category)))];
  const filteredProjects = activeFilter === 'all' 
    ? profile.projects 
    : profile.projects.filter((p) => p.category === activeFilter);

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText(profile.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0c0d0e] text-[#ededed] font-sans selection:bg-white selection:text-black">
      {/* Top Editorial Index Bar */}
      <header className="sticky top-0 z-40 bg-[#0c0d0e]/90 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono tracking-widest text-neutral-400">VOL. 2026 // MONOGRAPH</span>
            <span className="hidden sm:inline text-neutral-700">/</span>
            <span className="hidden sm:inline text-xs font-medium tracking-tight text-white uppercase">{profile.fullName}</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-mono text-neutral-400">
            <a href="#about" className="hover:text-white transition-colors">01. PREFACE</a>
            <a href="#metrics" className="hover:text-white transition-colors">02. DATA</a>
            <a href="#selected-works" className="hover:text-white transition-colors">03. ARCHIVES</a>
            <a href="#experience" className="hover:text-white transition-colors">04. CHRONOLOGY</a>
            {profile.education && profile.education.length > 0 && (
              <a href="#education" className="hover:text-white transition-colors">05. ACADEMIA</a>
            )}
            <a href="#contact" className="hover:text-white transition-colors">06. INQUIRIES</a>
          </nav>

          <div className="flex items-center gap-3">
            {onGenerateAiVisuals && (
              <button
                onClick={onGenerateAiVisuals}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border border-neutral-700 hover:border-white text-neutral-300 hover:text-white transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">AI VISUALS</span>
              </button>
            )}

            <button
              onClick={onOpenResume}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono bg-white text-black hover:bg-neutral-200 transition-colors font-semibold cursor-pointer"
            >
              <span>RESUME</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Swiss Grid Container */}
      <main className="max-w-7xl mx-auto px-6">
        {/* Section 01: Hero / Preface */}
        <motion.section 
          id="about" 
          className="py-20 lg:py-28 border-b border-neutral-800"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <motion.div variants={revealItem} className="lg:col-span-8">
              <motion.span variants={revealItem} className="text-xs font-mono text-neutral-500 uppercase tracking-widest block mb-6">
                ARCHIVE ENTRY Nº 001 · SWISS EDITORIAL
              </motion.span>
              <motion.h1 variants={revealItem} className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-white leading-[1.08] mb-8">
                {profile.fullName}
                <span className="block text-neutral-500 text-3xl sm:text-4xl lg:text-5xl mt-2 font-normal">
                  {profile.title}
                </span>
              </motion.h1>
              <motion.p variants={revealItem} className="text-lg sm:text-xl text-neutral-300 font-light max-w-2xl leading-relaxed mb-8">
                {profile.tagline}
              </motion.p>
              <motion.p variants={revealItem} className="text-sm text-neutral-400 font-light max-w-2xl leading-relaxed mb-8">
                {profile.bio}
              </motion.p>

              <motion.div variants={revealItem} className="flex flex-wrap items-center gap-4">
                <a
                  href="#selected-works"
                  className="px-6 py-3 bg-white text-black text-xs font-mono uppercase tracking-wider font-bold hover:bg-neutral-200 transition-colors flex items-center gap-2"
                >
                  <span>Mục lục Dự án</span>
                  <ArrowDown className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="px-5 py-3 border border-neutral-700 hover:border-white text-xs font-mono text-neutral-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEmail ? 'Copied' : profile.email}</span>
                </button>
              </motion.div>
            </motion.div>

            <motion.div variants={slideInRightItem} className="lg:col-span-4">
              <div className="border border-neutral-800 p-6 bg-neutral-900/30">
                <div className="aspect-[3/4] w-full overflow-hidden bg-neutral-950 mb-6 border border-neutral-800">
                  <img
                    src={avatar}
                    alt={profile.fullName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover filter grayscale contrast-110"
                  />
                </div>
                <div className="space-y-2 text-xs font-mono text-neutral-400">
                  <div className="flex justify-between border-b border-neutral-800 pb-1.5">
                    <span>LOCATION</span>
                    <span className="text-white">{profile.location.split(' · ')[0]}</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-800 pb-1.5">
                    <span>STATUS</span>
                    <span className="text-white">CONSULTING ACTIVE</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span>EDITION</span>
                    <span className="text-white">2026.01</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Section 02: Quantitative Index (Metrics) with Stagger Reveal */}
        <motion.section 
          id="metrics" 
          className="py-16 border-b border-neutral-800"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
        >
          <motion.div variants={cardsGridContainer} className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {profile.metrics.map((m, idx) => (
              <motion.div 
                key={idx} 
                variants={cardRevealItem}
                className="border-l border-neutral-800 pl-6"
              >
                <span className="text-xs font-mono text-neutral-500 block mb-2">0{idx + 1} // STAT</span>
                <div className="text-4xl font-light text-white mb-2 tracking-tight">
                  {m.value}
                </div>
                <div className="text-xs font-medium text-neutral-300 mb-1">
                  {m.label}
                </div>
                {m.subtext && (
                  <div className="text-[11px] text-neutral-500 font-light">
                    {m.subtext}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Section 03: Selected Archives (Projects) with Stagger Reveal */}
        <motion.section 
          id="selected-works" 
          className="py-24 border-b border-neutral-800"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
        >
          <motion.div variants={revealItem} className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block mb-2">
                INDEX 03 // WORKS
              </span>
              <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight">
                Tuyển tập Công trình Chọn lọc
              </h2>
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-mono">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveFilter(cat)}
                  className={`px-3 py-1 border transition-colors cursor-pointer ${
                    activeFilter === cat
                      ? 'border-white text-white font-bold bg-neutral-900'
                      : 'border-neutral-800 text-neutral-500 hover:text-white'
                  }`}
                >
                  {cat === 'all' ? 'ALL' : cat.toUpperCase()}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div variants={cardsGridContainer} className="space-y-16">
            {filteredProjects.map((proj, idx) => {
              const visual = proj.imageUrl || generateProceduralVisual({
                theme: 'tech',
                title: proj.title,
                category: proj.category,
                aspectRatio: '16:9',
              });

              return (
                <motion.div
                  key={proj.id}
                  variants={cardRevealItem}
                  onClick={() => onOpenProject(proj)}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center group cursor-pointer border-t border-neutral-850 pt-10"
                  whileHover={{ y: -3 }}
                >
                  <div className="lg:col-span-1 text-2xl font-light text-neutral-600 font-mono">
                    0{idx + 1}
                  </div>

                  <div className="lg:col-span-6 overflow-hidden bg-neutral-950 border border-neutral-800">
                    <img
                      src={visual}
                      alt={proj.title}
                      referrerPolicy="no-referrer"
                      className="w-full aspect-video object-cover filter grayscale contrast-115 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    />
                  </div>

                  <div className="lg:col-span-5 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-mono text-neutral-500 mb-2">
                        {proj.category} · {proj.year}
                      </div>
                      <h3 className="text-2xl font-light text-white group-hover:underline underline-offset-4 mb-3">
                        {proj.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-light mb-6">
                        {proj.tagline}
                      </p>
                    </div>

                    <div>
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {proj.tags.map((t, tIdx) => (
                          <span key={tIdx} className="text-[10px] font-mono px-2 py-0.5 border border-neutral-800 text-neutral-400">
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 text-xs font-mono text-white">
                        <span>VIEW ARCHIVE ENTRY</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.section>

        {/* Dynamic Section Mapping: Skills -> Grid / Tag Cloud UI */}
        <DynamicSectionRenderer sectionType="skills" profile={profile} concept="swiss-editorial" />

        {/* Dynamic Section Mapping: Experience -> Card-Based List UI */}
        <DynamicSectionRenderer sectionType="experience" profile={profile} concept="swiss-editorial" />

        {/* Dynamic Section Mapping: Education -> Distinct Timeline UI */}
        {profile.education && profile.education.length > 0 && (
          <DynamicSectionRenderer sectionType="education" profile={profile} concept="swiss-editorial" />
        )}

        {/* DISTINCT SECTION: Accreditations & Honors (Chứng chỉ & Giải thưởng) */}
        {((profile.certifications && profile.certifications.length > 0) || (profile.awards && profile.awards.length > 0)) && (
          <motion.section 
            id="accreditations" 
            className="py-24 border-b border-neutral-800"
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {profile.certifications && profile.certifications.length > 0 && (
                <div>
                  <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block mb-2">
                    VERIFIED REGISTRY
                  </span>
                  <h3 className="text-2xl font-light text-white mb-6">Chứng chỉ &amp; Chuẩn mực</h3>
                  <div className="border-t border-neutral-800">
                    {profile.certifications.map((c, idx) => (
                      <div key={idx} className="py-3.5 border-b border-neutral-800 text-xs font-mono flex items-center justify-between">
                        <span className="text-neutral-200">{c}</span>
                        <span className="text-neutral-500">AUTHENTICATED</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {profile.awards && profile.awards.length > 0 && (
                <div>
                  <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block mb-2">
                    HONORS &amp; AWARDS
                  </span>
                  <h3 className="text-2xl font-light text-white mb-6">Vinh danh &amp; Giải thưởng</h3>
                  <div className="border-t border-neutral-800">
                    {profile.awards.map((a, idx) => (
                      <div key={idx} className="py-3.5 border-b border-neutral-800 text-xs font-mono flex items-center gap-3">
                        <span className="text-neutral-600">0{idx + 1}</span>
                        <span className="text-neutral-200">{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.section>
        )}

        {/* Section 07: Critical Endorsements */}
        <motion.section 
          id="reviews" 
          className="py-24 border-b border-neutral-800"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-14">
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block mb-2">
              INDEX 07 // CRITIQUE
            </span>
            <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight">
              Đánh giá từ Đồng nghiệp &amp; Lãnh đạo
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {profile.testimonials.map((test, idx) => (
              <div key={test.id} className="border-l border-neutral-700 pl-6 flex flex-col justify-between">
                <p className="text-sm text-neutral-300 font-light leading-relaxed mb-6 italic">
                  "{test.quote}"
                </p>

                <div className="pt-4 border-t border-neutral-800 text-xs font-mono">
                  <div className="text-white font-medium">{test.author}</div>
                  <div className="text-neutral-500">{test.role} // {test.company}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Section 08: Colophon & Contact */}
        <motion.footer 
          id="contact" 
          className="py-20 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {profile.philosophy && (
            <div className="mb-12 text-left sm:text-center">
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block mb-2">PHILOSOPHY</span>
              <p className="text-base text-neutral-200 font-light italic leading-relaxed">
                "{profile.philosophy}"
              </p>
            </div>
          )}

          <div className="border border-neutral-800 p-8 bg-neutral-900/20 mb-8">
            <span className="text-xs font-mono text-neutral-500 block mb-4">DIRECT INQUIRIES &amp; ADVISORY</span>
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-white">
              <span>{profile.email}</span>
              <span>/</span>
              <span>{profile.phone}</span>
              <span>/</span>
              <span>{profile.location}</span>
            </div>
          </div>

          <p className="text-[11px] font-mono text-neutral-600">
            SWISS INTERNATIONAL TYPOGRAPHIC STYLE · JOSEF MÜLLER-BROCKMANN CONSTITUTION
          </p>
        </motion.footer>
      </main>
    </div>
  );
};
