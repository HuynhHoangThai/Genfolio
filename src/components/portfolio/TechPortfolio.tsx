import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Terminal, 
  Cpu, 
  GitBranch, 
  ExternalLink, 
  Github, 
  Linkedin, 
  Mail, 
  Copy, 
  Check, 
  Layers, 
  Server, 
  Activity, 
  ArrowUpRight,
  ShieldCheck,
  Download,
  Sparkles,
  GraduationCap,
  Award,
  Trophy,
  CheckCircle2,
  FileText,
  Clock,
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

interface TechPortfolioProps {
  profile: MockProfile;
  onOpenProject: (project: ProjectItem) => void;
  onOpenResume: () => void;
  onGenerateAiVisuals?: () => void;
}

export const TechPortfolio: React.FC<TechPortfolioProps> = ({
  profile,
  onOpenProject,
  onOpenResume,
  onGenerateAiVisuals
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTerminalTab, setActiveTerminalTab] = useState<'stack' | 'runtime' | 'network'>('stack');

  const avatar = profile.avatarImage || generateProceduralAvatar(profile.fullName, 'tech');

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText(profile.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  // Derive unique categories from profile skills
  const availableCategories = ['all', ...Array.from(new Set((profile.skills || []).map(s => s.category).filter(Boolean) as string[]))];
  const filteredSkills = selectedCategory === 'all'
    ? profile.skills
    : profile.skills.filter((s) => s.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-tech selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 tech-grid-pattern pointer-events-none opacity-20" />

      {/* Top Bar Contract (3 Zones, Single text brand) */}
      <header className="sticky top-0 z-40 border-b border-neutral-800/80 bg-neutral-950/85 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Zone 1: Single text wordmark */}
          <a href="#hero" className="text-base font-bold tracking-tight text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full theme-accent-bg animate-pulse" />
            <span className="font-mono">{profile.fullName.toLowerCase().replace(/\s+/g, '')}.systems</span>
          </a>

          {/* Zone 2: Clean text links */}
          <nav className="hidden md:flex items-center gap-6 text-xs text-neutral-400 font-medium">
            <a href="#metrics" className="hover:text-white transition-colors">Metrics</a>
            <a href="#stack" className="hover:text-white transition-colors">Stack</a>
            <a href="#projects" className="hover:text-white transition-colors">Projects</a>
            <a href="#experience" className="hover:text-white transition-colors">Trajectory</a>
            {profile.education && profile.education.length > 0 && (
              <a href="#education" className="hover:text-white transition-colors">Academia</a>
            )}
            {((profile.certifications && profile.certifications.length > 0) || (profile.awards && profile.awards.length > 0)) && (
              <a href="#credentials" className="hover:text-white transition-colors">Credentials</a>
            )}
            <a href="#testimonials" className="hover:text-white transition-colors">Endorsements</a>
          </nav>

          {/* Zone 3: Primary actions */}
          <div className="flex items-center gap-2">
            {onGenerateAiVisuals && (
              <button
                onClick={onGenerateAiVisuals}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60 transition-colors cursor-pointer"
                title="Tạo ảnh minh họa bằng AI"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sinh ảnh AI</span>
              </button>
            )}

            <button
              onClick={onOpenResume}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-neutral-800 hover:border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Full Dossier</span>
            </button>

            <a
              href={`mailto:${profile.email}`}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg text-neutral-950 theme-accent-bg hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <motion.section 
        id="hero" 
        className="relative pt-12 pb-20 px-6 max-w-7xl mx-auto"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Narrative with Staggered Children */}
          <motion.div variants={revealItem} className="lg:col-span-7">
            <motion.div variants={revealItem} className="inline-flex items-center gap-2 text-xs mb-5 px-3 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-300">
              <span className="w-2 h-2 rounded-full theme-accent-bg animate-pulse" />
              <span className="theme-accent-text font-bold">READY FOR ARCHITECTURE CONSULTING</span>
              <span className="text-neutral-500">· {profile.location.split(' · ')[0]}</span>
            </motion.div>

            <motion.h1 variants={revealItem} className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
              {profile.fullName}
            </motion.h1>

            <motion.div variants={revealItem} className="text-sm sm:text-base font-semibold theme-accent-text mb-4 font-mono">
              {profile.title}
            </motion.div>

            <motion.p variants={revealItem} className="text-sm sm:text-base text-neutral-400 leading-relaxed mb-6 max-w-2xl">
              {profile.bio}
            </motion.p>

            {/* Quick Action Bar */}
            <motion.div variants={revealItem} className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#projects"
                className="py-2.5 px-5 rounded-lg text-xs font-bold text-neutral-950 theme-accent-bg hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>Xem kiến trúc hệ thống</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="py-2.5 px-4 rounded-lg text-xs font-medium bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors flex items-center gap-2 cursor-pointer"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-neutral-400" />}
                <span className="font-mono">{copiedEmail ? 'Đã sao chép email' : profile.email}</span>
              </button>

              {profile.socials.github && (
                <a
                  href={profile.socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
                  title="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {profile.socials.linkedin && (
                <a
                  href={profile.socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </motion.div>
          </motion.div>

          {/* Right Column: Terminal Window with Side Slide Reveal */}
          <motion.div 
            variants={slideInRightItem}
            className="lg:col-span-5 rounded-xl border border-neutral-800 bg-neutral-900/90 shadow-2xl overflow-hidden"
          >
            {/* Terminal Header */}
            <div className="px-4 py-3 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="text-[11px] font-mono text-neutral-400 ml-2">bash ~ telemetry.sh</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => setActiveTerminalTab('stack')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${activeTerminalTab === 'stack' ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-500'}`}
                >
                  stack
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTerminalTab('runtime')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${activeTerminalTab === 'runtime' ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-500'}`}
                >
                  runtime
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTerminalTab('network')}
                  className={`px-2 py-0.5 rounded cursor-pointer ${activeTerminalTab === 'network' ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-500'}`}
                >
                  network
                </button>
              </div>
            </div>

            {/* Terminal Body */}
            <div className="p-5 text-xs leading-relaxed space-y-3 font-mono min-h-[220px]">
              {activeTerminalTab === 'stack' && (
                <>
                  <div className="text-neutral-500">$ sysctl --inspect-architecture</div>
                  <div className="text-neutral-300 space-y-1">
                    <p><span className="theme-accent-text">Core Engine:</span> Golang + Rust (Tokio Async Engine)</p>
                    <p><span className="theme-accent-text">Cluster Ops:</span> Kubernetes + Istio Service Mesh</p>
                    <p><span className="theme-accent-text">Streaming:</span> Apache Kafka + Real-time Flink</p>
                    <p><span className="theme-accent-text">Datastores:</span> PostgreSQL, CockroachDB, Redis 7</p>
                    <p><span className="theme-accent-text">Observability:</span> OpenTelemetry, Prometheus, Grafana</p>
                  </div>
                  <div className="pt-2 border-t border-neutral-800/80 text-[11px] text-neutral-400">
                    STATUS: <span className="theme-accent-text font-bold">HEALTHY</span> · ALL WORKLOADS DEPLOYED
                  </div>
                </>
              )}
              {activeTerminalTab === 'runtime' && (
                <>
                  <div className="text-neutral-500">$ top -b -n 1 | head -n 8</div>
                  <div className="text-neutral-300 space-y-1">
                    <p>Tasks: 192 total, 2 running, 190 sleeping</p>
                    <p>%Cpu(s): 6.8 us, 1.9 sy, 0.0 ni, 91.3 id</p>
                    <p>MiB Mem: 64182.4 total, 16210.8 used, 47971.6 free</p>
                    <p className="theme-accent-text">p99 Latency: 18.2ms across all ingress edge nodes</p>
                    <p className="text-neutral-400">GC Pause time: &lt; 0.8ms average under heavy load</p>
                  </div>
                </>
              )}
              {activeTerminalTab === 'network' && (
                <>
                  <div className="text-neutral-500">$ netstat -an | grep ESTABLISHED | wc -l</div>
                  <div className="text-neutral-300 space-y-1">
                    <p className="theme-accent-text">Active TCP Ingress: 42,850 connections</p>
                    <p>Edge TLS Handshake: TLS 1.3 (0-RTT enabled)</p>
                    <p>BGP Anycast Routing: 28 Global PoPs active</p>
                    <p className="text-emerald-400">Packet Loss Rate: 0.0001% (Global Backhaul)</p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Metrics Section with Stagger Reveal */}
      <motion.section 
        id="metrics" 
        className="py-12 border-y border-neutral-800/80 bg-neutral-900/30"
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
                className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-all shadow-sm"
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono mb-1">
                  {m.value}
                </div>
                <div className="text-xs font-semibold theme-accent-text mb-1">
                  {m.label}
                </div>
                {m.subtext && (
                  <div className="text-[11px] text-neutral-400">
                    {m.subtext}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Dynamic Section Mapping: Skills -> Grid / Tag Cloud UI */}
      <DynamicSectionRenderer sectionType="skills" profile={profile} concept="terminal" />

      {/* Flagship Production Projects with Stagger Reveal */}
      <motion.section 
        id="projects" 
        className="py-20 border-t border-neutral-800/80 bg-neutral-900/20 px-6"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={revealItem} className="mb-10">
            <div className="text-xs font-mono uppercase tracking-wider theme-accent-text font-bold mb-1">
              Production Workloads
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Dự án Kiến trúc Tiêu biểu
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
              Các giải pháp phân tán đã được kiểm nghiệm thực chiến trên môi trường chịu tải cao.
            </p>
          </motion.div>

          <motion.div variants={cardsGridContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profile.projects.map((proj) => {
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
                  className="group relative rounded-2xl bg-neutral-900/80 border border-neutral-800 overflow-hidden flex flex-col justify-between hover:border-neutral-600 transition-all cursor-pointer shadow-lg"
                  whileHover={{ y: -4 }}
                >
                  {/* Visual Artwork Thumbnail */}
                  <div className="relative aspect-video w-full border-b border-neutral-800/80 bg-neutral-950 overflow-hidden">
                    <img
                      src={visual}
                      alt={proj.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[10px] font-mono bg-black/80 text-emerald-400 border border-neutral-800 rounded">
                      {proj.category}
                    </div>
                    <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 text-[10px] font-mono bg-black/80 text-neutral-300 border border-neutral-800 rounded">
                      {proj.year}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:theme-accent-text transition-colors mb-2">
                        {proj.title}
                      </h3>

                      <p className="text-xs text-neutral-300 leading-relaxed mb-4 line-clamp-3">
                        {proj.tagline}
                      </p>

                      {/* Highlight metrics */}
                      {proj.metrics && proj.metrics.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-neutral-950/70 border border-neutral-800/70 mb-4">
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
                      {/* Tech tags */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {proj.tags.slice(0, 3).map((t, tIdx) => (
                          <span key={tIdx} className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-800/80 text-neutral-300">
                            {t}
                          </span>
                        ))}
                        {proj.tags.length > 3 && (
                          <span className="text-[11px] font-mono text-neutral-500 self-center">
                            +{proj.tags.length - 3}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-neutral-800/80 text-xs">
                        <span className="text-neutral-400 group-hover:text-white transition-colors flex items-center gap-1 font-medium">
                          Xem chi tiết kiến trúc
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                        {proj.github && (
                          <span className="text-neutral-500">
                            <Github className="w-4 h-4" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* Dynamic Section Mapping: Experience -> Card-Based List UI */}
      <DynamicSectionRenderer sectionType="experience" profile={profile} concept="terminal" />

      {/* Dynamic Section Mapping: Education -> Distinct Timeline UI */}
      {profile.education && profile.education.length > 0 && (
        <DynamicSectionRenderer sectionType="education" profile={profile} concept="terminal" />
      )}

      {/* DISTINCT SECTION: Verified Certifications & Awards (Chứng chỉ & Giải thưởng) */}
      {((profile.certifications && profile.certifications.length > 0) || (profile.awards && profile.awards.length > 0)) && (
        <motion.section 
          id="credentials" 
          className="py-20 border-t border-neutral-800/80 px-6 max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Certifications Block */}
            {profile.certifications && profile.certifications.length > 0 && (
              <div>
                <div className="mb-6">
                  <div className="text-xs font-mono uppercase tracking-wider theme-accent-text font-bold mb-1">
                    Accreditations
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 theme-accent-text" />
                    <span>Chứng chỉ Chuyên môn</span>
                  </h3>
                </div>

                <div className="space-y-3">
                  {profile.certifications.map((cert, idx) => (
                    <motion.div
                      key={idx}
                      className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-colors flex items-center justify-between gap-3"
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-800/80 flex items-center justify-center text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{cert}</div>
                          <div className="text-[10px] font-mono text-neutral-400">Industry Standard Verified</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">
                        ACTIVE
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Awards Block */}
            {profile.awards && profile.awards.length > 0 && (
              <div>
                <div className="mb-6">
                  <div className="text-xs font-mono uppercase tracking-wider theme-accent-text font-bold mb-1">
                    Recognition
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    <span>Giải thưởng &amp; Vinh danh</span>
                  </h3>
                </div>

                <div className="space-y-3">
                  {profile.awards.map((award, idx) => (
                    <motion.div
                      key={idx}
                      className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-amber-500/30 transition-colors flex items-center gap-3"
                      whileHover={{ x: 4 }}
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-950/50 border border-amber-800/70 flex items-center justify-center text-amber-400">
                        <Award className="w-4 h-4" />
                      </div>
                      <div className="text-xs text-neutral-200 font-medium">
                        {award}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.section>
      )}

      {/* Endorsements / Testimonials */}
      <motion.section 
        id="testimonials" 
        className="py-20 border-t border-neutral-800/80 bg-neutral-900/30 px-6"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 text-center">
            <div className="text-xs font-mono uppercase tracking-wider theme-accent-text font-bold mb-1">
              Peer Verification
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Đánh giá từ Đồng nghiệp &amp; Lãnh đạo
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {profile.testimonials.map((test, idx) => (
              <motion.div 
                key={test.id} 
                className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between"
                whileHover={{ y: -3 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <p className="text-xs sm:text-sm text-neutral-300 italic leading-relaxed mb-6 font-mono">
                  "{test.quote}"
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-neutral-800">
                  <div className="w-9 h-9 rounded-full bg-neutral-800 text-neutral-200 font-bold flex items-center justify-center text-xs font-mono border border-neutral-700">
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

      {/* DISTINCT SECTION: Direct Contact Terminal & Philosophy */}
      <motion.footer 
        className="py-16 px-6 border-t border-neutral-800 max-w-4xl mx-auto text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {profile.philosophy && (
          <div className="mb-8 p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/60 text-left sm:text-center">
            <div className="text-xs font-mono uppercase tracking-wider theme-accent-text font-bold mb-2">Triết lý Kỹ thuật</div>
            <p className="text-sm text-neutral-200 italic leading-relaxed">
              "{profile.philosophy}"
            </p>
          </div>
        )}

        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 text-left mb-8">
          <div className="text-xs font-mono text-neutral-400 mb-3">$ ping candidate --contact-channel</div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-300">
            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-emerald-400" /> {profile.email}</span>
            <span className="text-neutral-600">|</span>
            <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-emerald-400" /> {profile.phone}</span>
            <span className="text-neutral-600">|</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-emerald-400" /> {profile.location}</span>
          </div>
        </div>

        <p className="text-[11px] text-neutral-500 font-mono">
          Trang cá nhân tạo tự động bởi Gen-Folio · Chuẩn BR-01 Monospace &amp; Framer Motion
        </p>
      </motion.footer>
    </div>
  );
};
