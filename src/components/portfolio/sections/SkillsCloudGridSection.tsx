import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, Sparkles, Filter, CheckCircle2, Tag, LayoutGrid } from 'lucide-react';
import { SkillItem, LayoutConcept } from '../../../types/portfolio';
import { 
  defaultViewport, 
  staggerContainer, 
  cardsGridContainer, 
  cardRevealItem, 
  revealItem 
} from '../../../utils/motionVariants';

interface SkillsCloudGridSectionProps {
  skills: SkillItem[];
  concept: LayoutConcept;
  sectionTitle?: string;
  sectionSubtitle?: string;
}

export const SkillsCloudGridSection: React.FC<SkillsCloudGridSectionProps> = ({
  skills,
  concept,
  sectionTitle = 'Ma trận Kỹ năng & Tag Cloud',
  sectionSubtitle = 'Tổng hợp các công nghệ, ngôn ngữ và năng lực chuyên môn cốt lõi',
}) => {
  if (!skills || skills.length === 0) return null;

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cloud' | 'grid'>('cloud');
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);

  // Derive unique categories
  const categories = ['all', ...Array.from(new Set(skills.map(s => s.category).filter(Boolean) as string[]))];
  const filteredSkills = activeCategory === 'all'
    ? skills
    : skills.filter(s => s.category?.toLowerCase() === activeCategory.toLowerCase());

  // Concept styles
  const cStr = concept as string;
  const isTerminal = concept === 'terminal';
  const isBrutalist = cStr === 'brutalist';
  const isCyberpunk = cStr === 'cyberpunk-holo' || concept === 'cyber-neon' || concept === 'holographic-grid';
  const isBento = cStr === 'bento-glass' || concept === 'glass-morph';
  const isSwiss = cStr === 'swiss-editorial';
  const isExecutive = cStr === 'executive-kpi';

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
      id="skills-cloud-grid"
      className={`py-20 px-6 max-w-7xl mx-auto ${
        isBrutalist ? 'border-t-4 border-neutral-800' : 'border-t border-neutral-800/70'
      }`}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
    >
      {/* Section Header with Category Tabs and View Mode Switcher */}
      <motion.div variants={revealItem} className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
        <div>
          <span className={`text-xs font-mono uppercase tracking-widest block mb-2 font-bold ${accentColorClass}`}>
            {isTerminal ? '$ inspect --competency-matrix' :
             isBrutalist ? 'SECTION 02 // STACK & CLOUD' :
             isCyberpunk ? 'SYS_CAPABILITY // NEURAL_NODES' :
             isBento ? 'Craft & Disciplines' :
             isExecutive ? 'Strategic Competencies' : 'INDEX 04 // COMPETENCIES'}
          </span>
          <h2 className={`text-3xl sm:text-4xl font-extrabold text-white flex items-center gap-3 ${
            isExecutive ? 'font-business' : isBento ? 'font-creative' : isSwiss ? 'font-light' : ''
          }`}>
            <Layers className={`w-8 h-8 ${accentColorClass}`} />
            <span>{sectionTitle}</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-xl font-light">
            {sectionSubtitle}
          </p>
        </div>

        {/* View Switcher & Category Filter */}
        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Toggle: Interactive Tag Cloud vs Skill-Bar Grid */}
          <div className="flex items-center p-1 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-mono">
            <button
              type="button"
              onClick={() => setViewMode('cloud')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'cloud' ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Interactive Tag Cloud</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Skill-Bar Grid</span>
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-900/90 rounded-lg border border-neutral-800 overflow-x-auto max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-xs rounded-md whitespace-nowrap transition-colors cursor-pointer font-medium ${
                  activeCategory.toLowerCase() === cat.toLowerCase()
                    ? accentBgClass
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'Tất cả' : cat}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* DISTINCT UI VARIANT 1: Interactive Tag Cloud UI */}
      {viewMode === 'cloud' && (
        <div className="space-y-6">
          <motion.div
            key="cloud"
            className={`p-8 sm:p-12 rounded-3xl flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 transition-all ${
              isTerminal ? 'bg-neutral-900/50 border border-neutral-800' :
              isBrutalist ? 'bg-neutral-900 border-4 border-neutral-800 shadow-[8px_8px_0px_#facc15]' :
              isCyberpunk ? 'bg-[#050e1a]/80 border border-cyan-900/60 shadow-[0_0_25px_rgba(6,182,212,0.1)]' :
              isBento ? 'bg-white/[0.02] border border-white/10 backdrop-blur-xl' :
              isExecutive ? 'bg-neutral-900/60 border border-neutral-800' :
              'bg-neutral-900/20 border border-neutral-800'
            }`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {filteredSkills.map((skill, idx) => {
              const level = skill.level || 85;
              const isHighlight = skill.highlight || level >= 90;
              const isSelected = selectedSkill?.name === skill.name;

              // Dynamic weighting for Tag Cloud (font sizing, padding, and prominence)
              const sizeClass = 
                level >= 94 ? 'text-sm sm:text-base px-5 py-2.5 font-bold shadow-md' :
                level >= 88 ? 'text-xs sm:text-sm px-4 py-2 font-semibold' :
                'text-xs px-3.5 py-1.5 font-medium text-neutral-300';

              return (
                <motion.div
                  key={idx}
                  onClick={() => setSelectedSkill(isSelected ? null : skill)}
                  className={`rounded-full transition-all flex items-center gap-2 cursor-pointer select-none group ${sizeClass} ${
                    isSelected
                      ? isTerminal ? 'ring-2 ring-emerald-400 bg-emerald-950 text-white' :
                        isBrutalist ? 'ring-4 ring-black bg-yellow-400 text-black' :
                        isCyberpunk ? 'ring-2 ring-cyan-400 bg-cyan-950 text-white shadow-[0_0_15px_#06b6d4]' :
                        isBento ? 'ring-2 ring-rose-400 bg-rose-950 text-white' :
                        isExecutive ? 'ring-2 ring-amber-400 bg-amber-950 text-white' : 'ring-2 ring-white'
                      : isHighlight
                        ? isTerminal ? 'bg-emerald-950/70 border border-emerald-500/60 text-emerald-300' :
                          isBrutalist ? 'bg-yellow-400 text-black border-2 border-black font-black uppercase shadow-[3px_3px_0px_#000]' :
                          isCyberpunk ? 'bg-cyan-950/80 border border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.3)]' :
                          isBento ? 'bg-rose-950/50 border border-rose-500/50 text-rose-200' :
                          isExecutive ? 'bg-amber-950/60 border border-amber-500/60 text-amber-200' :
                          'bg-white text-black font-bold'
                        : isBrutalist ? 'bg-neutral-950 border border-neutral-700 text-neutral-300 hover:border-yellow-400' :
                          'bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 text-neutral-300'
                  }`}
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.02 }}
                >
                  {isHighlight && (
                    <span className={`w-2 h-2 rounded-full animate-pulse ${
                      isTerminal ? 'bg-emerald-400' :
                      isBrutalist ? 'bg-black' :
                      isCyberpunk ? 'bg-cyan-400' :
                      isBento ? 'bg-rose-400' :
                      isExecutive ? 'bg-amber-400' : 'bg-neutral-900'
                    }`} />
                  )}
                  <span>{skill.name}</span>
                  <span className={`text-[10px] font-mono opacity-60 group-hover:opacity-100 transition-opacity ${
                    isBrutalist ? 'text-black' : 'text-neutral-400'
                  }`}>
                    {level}%
                  </span>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Interactive Inspection Callout when a tag is clicked */}
          {selectedSkill && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isTerminal ? 'bg-neutral-900/90 border-emerald-500/50' :
                isBrutalist ? 'bg-neutral-900 border-4 border-neutral-800 shadow-[6px_6px_0px_#facc15]' :
                isCyberpunk ? 'bg-[#050e1a] border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.2)]' :
                isBento ? 'bg-white/[0.04] border-rose-500/40 backdrop-blur-xl' :
                isExecutive ? 'bg-neutral-900/90 border-amber-500/50' :
                'bg-neutral-900 border-neutral-700'
              }`}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-base sm:text-lg font-bold text-white`}>{selectedSkill.name}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${accentBgClass}`}>
                    {(selectedSkill.level ?? 85) >= 90 ? 'Mastery Level' : (selectedSkill.level ?? 85) >= 80 ? 'Advanced' : 'Proficient'}
                  </span>
                </div>
                <div className="text-xs text-neutral-400 font-mono">
                  Phân loại: <span className="text-white">{selectedSkill.category || 'General'}</span> · Điểm định lượng: <span className={accentColorClass}>{selectedSkill.level || 85}/100</span>
                </div>
              </div>

              <div className="w-full sm:w-64">
                <div className="flex justify-between text-[11px] font-mono text-neutral-400 mb-1">
                  <span>Mức độ thuần thục</span>
                  <span className="font-bold text-white">{selectedSkill.level || 85}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      isTerminal ? 'theme-accent-bg' :
                      isBrutalist ? 'bg-yellow-400' :
                      isCyberpunk ? 'bg-cyan-400' :
                      isBento ? 'bg-rose-500' :
                      isExecutive ? 'bg-amber-400' : 'bg-white'
                    }`}
                    style={{ width: `${selectedSkill.level || 85}%` }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* DISTINCT UI VARIANT 2: Structured Skill-Bar Grid UI */}
      {viewMode === 'grid' && (
        <motion.div
          key="grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          initial="hidden"
          animate="visible"
          variants={cardsGridContainer}
        >
          {filteredSkills.map((skill, idx) => (
            <motion.div
              key={idx}
              variants={cardRevealItem}
              className={`p-5 rounded-2xl transition-all ${
                isTerminal ? 'bg-neutral-900/60 border border-neutral-800 hover:border-emerald-500/50 shadow-sm' :
                isBrutalist ? 'bg-neutral-900 border-2 border-neutral-800 shadow-[4px_4px_0px_#000] hover:border-yellow-400 hover:shadow-[6px_6px_0px_#facc15]' :
                isCyberpunk ? 'bg-[#050e1a]/80 border border-cyan-900/60 hover:border-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.1)]' :
                isBento ? 'bg-white/[0.03] border border-white/10 hover:border-rose-500/40 backdrop-blur-md shadow-md' :
                isExecutive ? 'bg-neutral-900/70 border border-neutral-800 hover:border-amber-500/40 shadow-sm' :
                'bg-neutral-900/40 border border-neutral-800 hover:border-neutral-500'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-semibold text-white flex items-center gap-1.5 text-sm">
                  {skill.name}
                  {skill.highlight && (
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      isTerminal ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      isBrutalist ? 'bg-yellow-400 text-black font-black' :
                      isCyberpunk ? 'bg-cyan-950 text-cyan-400 border border-cyan-700' :
                      isBento ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                      isExecutive ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-neutral-800 text-white'
                    }`}>
                      ★ Core
                    </span>
                  )}
                </span>
                <span className="font-mono text-xs font-bold text-neutral-300">{skill.level || 85}%</span>
              </div>

              {/* Explicit Skill-Bar with Background Groove & Gradient Accent */}
              <div className="w-full h-2 rounded-full bg-neutral-950 border border-neutral-800/80 overflow-hidden p-0.5">
                <motion.div
                  className={`h-full rounded-full ${
                    isTerminal ? 'bg-emerald-400' :
                    isBrutalist ? 'bg-yellow-400' :
                    isCyberpunk ? 'bg-gradient-to-r from-cyan-600 via-cyan-400 to-cyan-300 shadow-[0_0_8px_#06b6d4]' :
                    isBento ? 'bg-gradient-to-r from-rose-500 to-rose-400' :
                    isExecutive ? 'bg-gradient-to-r from-amber-500 to-amber-300' : 'bg-white'
                  }`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level || 85}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: idx * 0.04, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>

              <div className="text-[10px] text-neutral-400 mt-3 font-mono flex items-center justify-between">
                <span>Nhóm: {skill.category || 'Domain'}</span>
                <span className={accentColorClass}>
                  {(skill.level || 85) >= 90 ? 'Mastery Tier' : (skill.level || 85) >= 80 ? 'Expert Tier' : 'Proficient Tier'}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.section>
  );
};
