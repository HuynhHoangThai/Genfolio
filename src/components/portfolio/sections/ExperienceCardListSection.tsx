import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Building2, Calendar, MapPin, ChevronRight, CheckCircle2, TrendingUp, Layers, Rocket, FolderKanban, LayoutGrid } from 'lucide-react';
import { ExperienceItem, LayoutConcept } from '../../../types/portfolio';
import { 
  defaultViewport, 
  staggerContainer, 
  cardsGridContainer, 
  cardRevealItem, 
  revealItem 
} from '../../../utils/motionVariants';

interface ExperienceCardListSectionProps {
  experiences: ExperienceItem[];
  concept: LayoutConcept;
  sectionTitle?: string;
  sectionSubtitle?: string;
}

export const ExperienceCardListSection: React.FC<ExperienceCardListSectionProps> = ({
  experiences,
  concept,
  sectionTitle = 'Lộ trình Kinh nghiệm Thực chiến',
  sectionSubtitle = 'Chi tiết các vị trí công tác, dự án quy mô và thành tựu đã được kiểm chứng',
}) => {
  if (!experiences || experiences.length === 0) return null;

  const [expandedId, setExpandedId] = useState<string | null>(experiences[0]?.id || null);
  const [viewMode, setViewMode] = useState<'project-cards' | 'dossier'>('project-cards');

  // Concept styles
  const isTerminal = concept === 'terminal';
  const isBrutalist = concept === 'brutalist';
  const isCyberpunk = concept === 'cyberpunk-holo';
  const isBento = concept === 'bento-glass';
  const isSwiss = concept === 'swiss-editorial';
  const isExecutive = concept === 'executive-kpi';

  const accentColorClass = 
    isTerminal ? 'text-emerald-400' :
    isBrutalist ? 'text-yellow-400' :
    isCyberpunk ? 'text-cyan-400' :
    isBento ? 'text-rose-400' :
    isExecutive ? 'text-amber-400' : 'text-neutral-200';

  const accentBgClass =
    isTerminal ? 'theme-accent-bg text-neutral-950' :
    isBrutalist ? 'bg-yellow-400 text-black border border-black' :
    isCyberpunk ? 'bg-cyan-500 text-black shadow-[0_0_12px_#06b6d4]' :
    isBento ? 'bg-rose-500 text-white' :
    isExecutive ? 'bg-amber-500 text-neutral-950 font-bold' : 'bg-white text-black font-bold';

  return (
    <motion.section
      id="experience-card-list"
      className={`py-20 px-6 max-w-5xl mx-auto ${
        isBrutalist ? 'border-t-4 border-neutral-800' : 'border-t border-neutral-800/70'
      }`}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
    >
      {/* Section Header with View Mode Switcher */}
      <motion.div variants={revealItem} className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
        <div>
          <span className={`text-xs font-mono uppercase tracking-widest block mb-2 font-bold ${accentColorClass}`}>
            {isTerminal ? '$ git log --branches --projects' :
             isBrutalist ? 'SECTION 03 // PROJECT CARDS LIST' :
             isCyberpunk ? 'CAREER_LEDGER // MISSION_CARDS' :
             isBento ? 'Curated Milestones & Projects' :
             isExecutive ? 'Executive Career History' : 'INDEX 04 // CHRONICLE'}
          </span>
          <h2 className={`text-3xl sm:text-4xl font-extrabold text-white flex items-center gap-3 ${
            isExecutive ? 'font-business' : isBento ? 'font-creative' : isSwiss ? 'font-light' : ''
          }`}>
            <Briefcase className={`w-8 h-8 ${accentColorClass}`} />
            <span>{sectionTitle}</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-xl font-light">
            {sectionSubtitle}
          </p>
        </div>

        {/* View Switcher: Distinct Project Cards vs Company Dossier */}
        <div className="flex items-center p-1 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-mono self-start sm:self-end">
          <button
            type="button"
            onClick={() => setViewMode('project-cards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              viewMode === 'project-cards' ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Project Cards</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('dossier')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              viewMode === 'dossier' ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Company Dossiers</span>
          </button>
        </div>
      </motion.div>

      {/* VIEW VARIANT 1: List of Distinct Project Cards explicitly reflecting each initiative */}
      {viewMode === 'project-cards' && (
        <motion.div 
          key="project-cards-grid" 
          variants={cardsGridContainer} 
          initial="hidden" 
          animate="visible" 
          className="space-y-8"
        >
          {experiences.map((exp, expIdx) => (
            <motion.div
              key={exp.id}
              variants={cardRevealItem}
              className={`rounded-2xl transition-all overflow-hidden ${
                isTerminal ? 'bg-neutral-900/60 border border-neutral-800 hover:border-emerald-500/50 shadow-md' :
                isBrutalist ? 'bg-neutral-900 border-4 border-neutral-800 shadow-[6px_6px_0px_#000] hover:shadow-[8px_8px_0px_#facc15]' :
                isCyberpunk ? 'bg-[#050e1a]/90 border border-cyan-900/60 hover:border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.1)]' :
                isBento ? 'bg-white/[0.03] border border-white/10 hover:border-rose-500/40 backdrop-blur-xl shadow-xl' :
                isExecutive ? 'bg-neutral-900/80 border border-neutral-800 hover:border-amber-500/40 shadow-lg' :
                'bg-neutral-900/30 border border-neutral-800 hover:border-neutral-500'
              }`}
            >
              {/* Card Meta Top Banner */}
              <div className="p-6 sm:p-7 border-b border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-base font-bold font-mono ${
                    isTerminal ? 'bg-emerald-950/80 border border-emerald-800/80 text-emerald-400' :
                    isBrutalist ? 'bg-yellow-400 text-black border-2 border-black font-black' :
                    isCyberpunk ? 'bg-cyan-950 border border-cyan-700 text-cyan-300 shadow-[0_0_10px_#06b6d4]' :
                    isBento ? 'bg-rose-950/50 border border-rose-800/60 text-rose-300' :
                    isExecutive ? 'bg-amber-950/60 border border-amber-800/60 text-amber-300' :
                    'bg-neutral-800 text-neutral-200'
                  }`}>
                    {exp.company.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className={`text-lg sm:text-xl font-bold text-white mb-1 ${
                      isExecutive ? 'font-business' : isBento ? 'font-creative' : isSwiss ? 'font-light' : ''
                    }`}>
                      {exp.role}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-400">
                      <span className="flex items-center gap-1 font-medium text-neutral-200">
                        <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                        {exp.company}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                        {exp.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-mono font-medium ${
                    isTerminal ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60' :
                    isBrutalist ? 'bg-yellow-400 text-black border border-black uppercase font-black' :
                    isCyberpunk ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                    isBento ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                    isExecutive ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    'bg-neutral-800 text-neutral-300'
                  }`}>
                    <Calendar className="w-3.5 h-3.5 inline mr-1" />
                    {exp.period}
                  </span>
                </div>
              </div>

              {/* Card Body: High-Level Summary */}
              <div className="p-6 sm:p-7 space-y-6">
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
                  {exp.description}
                </p>

                {/* Sub-List of Distinct Project Deliverable Cards */}
                {exp.achievements && exp.achievements.length > 0 && (
                  <div className="space-y-3">
                    <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block font-semibold flex items-center gap-2">
                      <Rocket className={`w-3.5 h-3.5 ${accentColorClass}`} />
                      <span>Các Dự án &amp; Sáng kiến Trọng điểm đã Triển khai:</span>
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {exp.achievements.map((ach, aIdx) => (
                        <div
                          key={aIdx}
                          className={`p-4 rounded-xl text-xs transition-all flex flex-col justify-between ${
                            isTerminal ? 'bg-neutral-950/80 border border-neutral-800/90 text-neutral-200 hover:border-emerald-500/40' :
                            isBrutalist ? 'bg-black border-2 border-neutral-700 text-white font-mono hover:border-yellow-400 shadow-[3px_3px_0px_#000]' :
                            isCyberpunk ? 'bg-[#040a14] border border-cyan-900/50 text-cyan-100 hover:border-cyan-400/60' :
                            isBento ? 'bg-white/[0.02] border border-white/5 text-neutral-200 hover:border-rose-500/30' :
                            isExecutive ? 'bg-neutral-950/70 border border-neutral-800 text-neutral-200 hover:border-amber-500/40' :
                            'bg-neutral-950/60 border border-neutral-800 text-neutral-300 hover:border-neutral-600'
                          }`}
                        >
                          <div className="flex items-start gap-2.5 mb-2">
                            <span className={`font-bold mt-0.5 ${accentColorClass}`}>
                              {isTerminal ? '▸' : isBrutalist ? '■' : isCyberpunk ? '⚡' : '✓'}
                            </span>
                            <span className="leading-relaxed font-medium">{ach}</span>
                          </div>

                          <div className="pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[10px] font-mono text-neutral-500">
                            <span>DELIVERABLE #0{aIdx + 1}</span>
                            <span className={accentColorClass}>VERIFIED IMPACT</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tech Stack Used Chips */}
                {exp.skillsUsed && exp.skillsUsed.length > 0 && (
                  <div className="pt-4 border-t border-neutral-800/80 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-mono text-neutral-500 mr-1 uppercase">Stack:</span>
                    {exp.skillsUsed.map((sk, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800/90 text-neutral-300 border border-neutral-700/60"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* VIEW VARIANT 2: Interactive Expandable Company Dossier List */}
      {viewMode === 'dossier' && (
        <motion.div 
          key="dossier-list"
          variants={cardsGridContainer} 
          initial="hidden" 
          animate="visible" 
          className="space-y-6"
        >
          {experiences.map((exp) => {
            const isExpanded = expandedId === exp.id;

            return (
              <motion.div
                key={exp.id}
                variants={cardRevealItem}
                className={`rounded-2xl transition-all overflow-hidden ${
                  isTerminal ? 'bg-neutral-900/60 border border-neutral-800 hover:border-emerald-500/50 shadow-md' :
                  isBrutalist ? 'bg-neutral-900 border-4 border-neutral-800 shadow-[6px_6px_0px_#000] hover:shadow-[8px_8px_0px_#facc15]' :
                  isCyberpunk ? 'bg-[#050e1a]/90 border border-cyan-900/60 hover:border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.1)]' :
                  isBento ? 'bg-white/[0.03] border border-white/10 hover:border-rose-500/40 backdrop-blur-xl shadow-xl' :
                  isExecutive ? 'bg-neutral-900/80 border border-neutral-800 hover:border-amber-500/40 shadow-lg' :
                  'bg-neutral-900/30 border border-neutral-800 hover:border-neutral-500'
                }`}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                {/* Card Header Bar */}
                <div 
                  onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                  className="p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-base font-bold font-mono ${
                      isTerminal ? 'bg-emerald-950/80 border border-emerald-800/80 text-emerald-400' :
                      isBrutalist ? 'bg-yellow-400 text-black border-2 border-black font-black' :
                      isCyberpunk ? 'bg-cyan-950 border border-cyan-700 text-cyan-300 shadow-[0_0_10px_#06b6d4]' :
                      isBento ? 'bg-rose-950/50 border border-rose-800/60 text-rose-300' :
                      isExecutive ? 'bg-amber-950/60 border border-amber-800/60 text-amber-300' :
                      'bg-neutral-800 text-neutral-200'
                    }`}>
                      {exp.company.slice(0, 2).toUpperCase()}
                    </div>

                    <div>
                      <h3 className={`text-base sm:text-lg font-bold text-white mb-1 ${
                        isExecutive ? 'font-business' : isBento ? 'font-creative' : isSwiss ? 'font-light' : ''
                      }`}>
                        {exp.role}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-400">
                        <span className="flex items-center gap-1 font-medium text-neutral-200">
                          <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                          {exp.company}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                          {exp.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-mono font-medium ${
                      isTerminal ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60' :
                      isBrutalist ? 'bg-yellow-400 text-black border border-black uppercase font-black' :
                      isCyberpunk ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                      isBento ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                      isExecutive ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-neutral-800 text-neutral-300'
                    }`}>
                      {exp.period}
                    </span>

                    <button
                      type="button"
                      aria-label="Toggle details"
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                    >
                      <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Card Expanded Content */}
                {isExpanded && (
                  <div className="px-6 pb-6 sm:px-7 sm:pb-7 pt-1 border-t border-neutral-800/70 text-xs sm:text-sm text-neutral-300 space-y-4">
                    <p className="leading-relaxed font-light text-neutral-300">
                      {exp.description}
                    </p>

                    {/* Bullet achievements list */}
                    {exp.achievements && exp.achievements.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block font-semibold">
                          Các thành tựu &amp; cột mốc định lượng:
                        </span>
                        <div className="space-y-2">
                          {exp.achievements.map((ach, aIdx) => (
                            <div key={aIdx} className="flex items-start gap-2.5 text-xs text-neutral-200">
                              <span className={`font-bold mt-0.5 ${accentColorClass}`}>
                                {isTerminal ? '▸' : isBrutalist ? '■' : isCyberpunk ? '⚡' : '✓'}
                              </span>
                              <span className="leading-relaxed">{ach}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tech stack chips */}
                    {exp.skillsUsed && exp.skillsUsed.length > 0 && (
                      <div className="pt-3 border-t border-neutral-800/80 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-mono text-neutral-500 mr-1 uppercase">Stack:</span>
                        {exp.skillsUsed.map((sk, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800/90 text-neutral-300 border border-neutral-700/60"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.section>
  );
};
