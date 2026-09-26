import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Terminal, 
  Cpu, 
  Zap, 
  Radio, 
  Activity, 
  ArrowUpRight, 
  Download, 
  Mail, 
  Github, 
  Linkedin, 
  Layers, 
  Sparkles, 
  Crosshair,
  ShieldCheck,
  Server,
  GraduationCap,
  Trophy,
  Copy,
  Check,
  Phone,
  MapPin,
  Flame
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

interface CyberpunkHoloPortfolioProps {
  profile: MockProfile;
  onOpenProject: (project: ProjectItem) => void;
  onOpenResume: () => void;
  onGenerateAiVisuals?: () => void;
}

export const CyberpunkHoloPortfolio: React.FC<CyberpunkHoloPortfolioProps> = ({
  profile,
  onOpenProject,
  onOpenResume,
  onGenerateAiVisuals,
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const avatar = profile.avatarImage || generateProceduralAvatar(profile.fullName, 'tech', '#06b6d4');

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText(profile.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#03060c] text-neutral-100 font-mono selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
      {/* Background Holographic Hex Grid & Scanning Line */}
      <div className="fixed inset-0 tech-grid-pattern opacity-30 pointer-events-none" />
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-emerald-400 to-indigo-500 shadow-[0_0_15px_#06b6d4] z-50 pointer-events-none" />

      {/* Cyber HUD Status Bar */}
      <div className="border-b border-cyan-900/50 bg-[#050b16]/90 backdrop-blur-md px-6 py-2 flex items-center justify-between text-[11px] text-cyan-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            HOLO-DECK // NODE ACTIVE: 01
          </span>
          <span className="hidden sm:inline text-neutral-600">|</span>
          <span className="hidden sm:inline text-neutral-400">ENCRYPTION: AES-256 GCM</span>
        </div>
        <div className="flex items-center gap-4 text-neutral-400">
          <span className="text-emerald-400">SYS_INTEGRITY: 100%</span>
          <span>LATENCY: 14MS</span>
        </div>
      </div>

      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-neutral-800/80 bg-[#03060c]/85 backdrop-blur-xl px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="#hero" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded border border-cyan-500/60 bg-cyan-950/40 flex items-center justify-center text-cyan-400 group-hover:shadow-[0_0_12px_#06b6d4] transition-all">
              <Crosshair className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold tracking-wider uppercase text-white font-mono">
              {profile.fullName.split(' ').pop()} // MATRIX
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-6 text-xs text-neutral-400">
            <a href="#projects" className="hover:text-cyan-400 transition-colors">[PROJECTS]</a>
            <a href="#telemetry" className="hover:text-cyan-400 transition-colors">[METRICS]</a>
            <a href="#stack" className="hover:text-cyan-400 transition-colors">[STACK]</a>
            <a href="#trajectory" className="hover:text-cyan-400 transition-colors">[MISSIONS]</a>
            {profile.education && profile.education.length > 0 && (
              <a href="#education" className="hover:text-cyan-400 transition-colors">[ARCHIVES]</a>
            )}
            {((profile.certifications && profile.certifications.length > 0) || (profile.awards && profile.awards.length > 0)) && (
              <a href="#credentials" className="hover:text-cyan-400 transition-colors">[SECURITY]</a>
            )}
            <a href="#transmissions" className="hover:text-cyan-400 transition-colors">[LOGS]</a>
          </nav>

          <div className="flex items-center gap-2">
            {onGenerateAiVisuals && (
              <button
                onClick={onGenerateAiVisuals}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-cyan-950/80 border border-cyan-500/60 text-cyan-300 hover:bg-cyan-900/60 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Sinh ảnh AI</span>
              </button>
            )}

            <button
              onClick={onOpenResume}
              className="px-3.5 py-1.5 text-xs font-bold rounded bg-cyan-500 hover:bg-cyan-400 text-neutral-950 shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
            >
              CV Dossier
            </button>
          </div>
        </div>
      </header>

      {/* Hero Holo Console */}
      <motion.section 
        id="hero" 
        className="pt-16 pb-20 px-6 max-w-7xl mx-auto"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <motion.div variants={revealItem} className="lg:col-span-8">
            <motion.div variants={revealItem} className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 mb-6 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>NEURAL MATRIX ARCHITECT // LEVEL 9</span>
              <span className="text-cyan-600">· {profile.location}</span>
            </motion.div>

            <motion.h1 variants={revealItem} className="text-4xl sm:text-6xl font-black uppercase text-white tracking-tight leading-tight mb-4">
              {profile.fullName}
            </motion.h1>

            <motion.div variants={revealItem} className="text-base sm:text-lg font-bold text-cyan-400 mb-6 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>{profile.title}</span>
            </motion.div>

            <motion.p variants={revealItem} className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-8 max-w-2xl font-sans">
              {profile.bio}
            </motion.p>

            {/* Audio frequency visualizer bars */}
            <motion.div variants={revealItem} className="p-4 rounded-xl border border-cyan-900/60 bg-cyan-950/20 mb-8 max-w-md">
              <div className="text-[10px] text-cyan-400 mb-2 flex items-center justify-between">
                <span>NEURAL CARRIER FREQUENCY</span>
                <span>432.84 MHZ</span>
              </div>
              <div className="flex items-end gap-1.5 h-8">
                {[40, 75, 55, 90, 65, 30, 85, 95, 45, 70, 60, 80, 50, 90, 65, 40].map((h, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-sm bg-gradient-to-t from-cyan-600 to-cyan-300"
                    animate={{ height: [`${h}%`, `${(h * 1.5) % 100}%`, `${h}%`] }}
                    transition={{ repeat: Infinity, duration: 1.2 + (i % 5) * 0.2, ease: 'easeInOut' }}
                  />
                ))}
              </div>
            </motion.div>

            <motion.div variants={revealItem} className="flex flex-wrap items-center gap-4">
              <a
                href="#projects"
                className="px-6 py-3 rounded text-xs font-bold uppercase tracking-wider text-black bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Nạp Dữ liệu Dự án</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="px-5 py-3 rounded text-xs font-semibold bg-neutral-900 border border-neutral-700 hover:border-cyan-500/60 text-neutral-200 transition-all flex items-center gap-2 cursor-pointer"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-cyan-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedEmail ? 'Copied Encrypted Email' : profile.email}</span>
              </button>
            </motion.div>
          </motion.div>

          <motion.div variants={slideInRightItem} className="lg:col-span-4 flex justify-center">
            <div className="relative w-64 h-80 rounded-2xl border-2 border-cyan-500/60 bg-neutral-950 p-2 shadow-[0_0_30px_rgba(6,182,212,0.25)] overflow-hidden group">
              <div className="absolute top-2 left-2 text-[9px] text-cyan-400 z-10 font-mono">TARGET ID: 0x9F41</div>
              <img
                src={avatar}
                alt={profile.fullName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-xl filter contrast-125 saturate-150"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#03060c] via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold">HOLOGRAPHIC SYNTH</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Telemetry Metrics with Stagger Reveal */}
      <motion.section 
        id="telemetry" 
        className="py-12 border-y border-cyan-900/40 bg-cyan-950/20 px-6"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={cardsGridContainer} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {profile.metrics.map((m, idx) => (
              <motion.div
                key={idx}
                variants={cardRevealItem}
                className="p-5 rounded-xl border border-cyan-900/60 bg-[#050e1a]/80 shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:border-cyan-400/80 transition-all"
                whileHover={{ y: -3 }}
              >
                <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono mb-1">
                  {m.value}
                </div>
                <div className="text-xs font-bold text-white mb-1 uppercase tracking-wide">
                  {m.label}
                </div>
                {m.subtext && (
                  <div className="text-[10px] text-neutral-400">
                    {m.subtext}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Mission Prototypes (Projects) with Stagger Reveal */}
      <motion.section 
        id="projects" 
        className="py-24 px-6 max-w-7xl mx-auto"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
      >
        <motion.div variants={revealItem} className="mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 block mb-2">DEPLOYED PROTOCOLS</span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase text-white">
            Dự án &amp; Hệ thống Triển khai
          </h2>
        </motion.div>

        <motion.div variants={cardsGridContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {profile.projects.map((proj) => {
            const visual = proj.imageUrl || generateProceduralVisual({
              theme: 'cyberpunk',
              title: proj.title,
              category: proj.category,
              aspectRatio: '16:9',
            });

            return (
              <motion.div
                key={proj.id}
                variants={cardRevealItem}
                onClick={() => onOpenProject(proj)}
                className="rounded-2xl border border-cyan-900/60 bg-[#050e1a]/90 overflow-hidden hover:border-cyan-400 transition-all cursor-pointer flex flex-col justify-between shadow-[0_0_20px_rgba(6,182,212,0.15)] group"
                whileHover={{ y: -4 }}
              >
                <div className="relative aspect-video w-full bg-black overflow-hidden border-b border-cyan-900/60">
                  <img
                    src={visual}
                    alt={proj.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-mono bg-black/80 text-cyan-400 border border-cyan-800">
                    {proj.category}
                  </div>
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded text-[10px] font-mono bg-black/80 text-neutral-400 border border-neutral-800">
                    {proj.year}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors mb-2">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-neutral-300 leading-relaxed font-sans mb-4 line-clamp-3">
                      {proj.tagline}
                    </p>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {proj.tags.map((t, tIdx) => (
                        <span key={tIdx} className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/60">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-cyan-900/40 flex items-center justify-between text-xs text-cyan-400">
                      <span>GIẢI MÃ BLUEPRINT</span>
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
      <DynamicSectionRenderer sectionType="skills" profile={profile} concept="cyberpunk-holo" />

      {/* Dynamic Section Mapping: Experience -> Card-Based List UI */}
      <DynamicSectionRenderer sectionType="experience" profile={profile} concept="cyberpunk-holo" />

      {/* Dynamic Section Mapping: Education -> Distinct Timeline UI */}
      {profile.education && profile.education.length > 0 && (
        <DynamicSectionRenderer sectionType="education" profile={profile} concept="cyberpunk-holo" />
      )}

      {/* DISTINCT SECTION: Cryptographic Badges & Honors (Chứng chỉ & Giải thưởng) */}
      {((profile.certifications && profile.certifications.length > 0) || (profile.awards && profile.awards.length > 0)) && (
        <motion.section 
          id="credentials" 
          className="py-24 border-t border-cyan-900/40 px-6 max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {profile.certifications && profile.certifications.length > 0 && (
              <div>
                <div className="mb-6 flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-2xl font-black uppercase text-white">Chứng chỉ Bảo mật &amp; Hệ thống</h3>
                </div>
                <div className="space-y-3">
                  {profile.certifications.map((cert, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-cyan-900/60 bg-[#050e1a] flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{cert}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                        CRYPT_VERIFIED
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {profile.awards && profile.awards.length > 0 && (
              <div>
                <div className="mb-6 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-2xl font-black uppercase text-white">Huy chương &amp; Vinh danh</h3>
                </div>
                <div className="space-y-3">
                  {profile.awards.map((award, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-cyan-900/60 bg-[#050e1a] flex items-center gap-3">
                      <Trophy className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                      <span className="text-xs text-neutral-200">{award}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.section>
      )}

      {/* Quantum Transmissions (Testimonials) */}
      <motion.section 
        id="transmissions" 
        className="py-24 border-t border-cyan-900/40 bg-cyan-950/20 px-6"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="mb-14 text-center">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 block mb-2">SIGNAL INTERCEPT</span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white">
              Bản tin Đánh giá Thẩm định
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {profile.testimonials.map((test, idx) => (
              <motion.div
                key={test.id}
                className="p-8 rounded-2xl border border-cyan-900/60 bg-[#050e1a] flex flex-col justify-between"
                whileHover={{ y: -4 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <p className="text-xs sm:text-sm text-cyan-200/90 leading-relaxed mb-6 font-mono">
                  “{test.quote}”
                </p>

                <div className="pt-4 border-t border-cyan-900/40 flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-cyan-950 border border-cyan-700 text-cyan-300 font-bold flex items-center justify-center text-xs">
                    {test.avatarText}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{test.author}</div>
                    <div className="text-[10px] text-neutral-400">{test.role} // {test.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Quantum Ingress Footer */}
      <motion.footer 
        className="py-16 px-6 max-w-4xl mx-auto text-center border-t border-cyan-900/60"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {profile.philosophy && (
          <div className="mb-8 p-6 rounded-xl border border-cyan-900/60 bg-[#050e1a] text-left sm:text-center">
            <span className="text-xs text-cyan-400 uppercase font-bold block mb-2">TỔNG HỢP NGUYÊN LÝ LÕI</span>
            <p className="text-xs sm:text-sm text-neutral-200 italic font-sans leading-relaxed">
              "{profile.philosophy}"
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-cyan-400 mb-6">
          <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {profile.email}</span>
          <span>·</span>
          <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {profile.phone}</span>
          <span>·</span>
          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {profile.location}</span>
        </div>

        <p className="text-[10px] text-neutral-500 font-mono">
          CYBERPUNK HOLO-DECK · SYSTEM ACTIVE · FRAMER MOTION ENGINE
        </p>
      </motion.footer>
    </div>
  );
};
