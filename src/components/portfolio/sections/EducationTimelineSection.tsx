import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Award, Calendar, BookOpen, CheckCircle2 } from 'lucide-react';
import { EducationItem, LayoutConcept } from '../../../types/portfolio';
import { 
  defaultViewport, 
  staggerContainer, 
  cardsGridContainer, 
  cardRevealItem, 
  revealItem 
} from '../../../utils/motionVariants';

interface EducationTimelineSectionProps {
  education: EducationItem[];
  concept: LayoutConcept;
  sectionTitle?: string;
  sectionSubtitle?: string;
}

export const EducationTimelineSection: React.FC<EducationTimelineSectionProps> = ({
  education,
  concept,
  sectionTitle = 'Lộ trình Học thuật & Bằng cấp',
  sectionSubtitle = 'Nền tảng đào tạo chuyên sâu và các văn bằng học vị chính quy',
}) => {
  if (!education || education.length === 0) return null;

  // Concept-specific styles
  const isTerminal = concept === 'terminal';
  const isBrutalist = concept === 'brutalist';
  const isCyberpunk = concept === 'cyberpunk-holo';
  const isBento = concept === 'bento-glass';
  const isSwiss = concept === 'swiss-editorial';
  const isExecutive = concept === 'executive-kpi';

  return (
    <motion.section 
      id="education-timeline"
      className={`py-20 px-6 max-w-5xl mx-auto ${
        isBrutalist ? 'border-t-4 border-neutral-800' : 'border-t border-neutral-800/70'
      }`}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
    >
      {/* Section Header */}
      <motion.div variants={revealItem} className="mb-14 text-center sm:text-left">
        <span className={`text-xs font-mono uppercase tracking-widest block mb-2 font-bold ${
          isTerminal ? 'text-emerald-400' :
          isBrutalist ? 'text-yellow-400' :
          isCyberpunk ? 'text-cyan-400' :
          isBento ? 'text-rose-400' :
          isExecutive ? 'text-amber-400' : 'text-neutral-400'
        }`}>
          {isTerminal ? '$ cat /etc/academia.timeline' :
           isBrutalist ? 'SECTION 04 // TIMELINE' :
           isCyberpunk ? 'ACADEMIC_CHRONOLOGY // LOG' :
           isBento ? 'Academic Pedigree & Laurels' :
           isExecutive ? 'Academic Distinctions' : 'INDEX 05 // ACADEMIA'}
        </span>
        <h2 className={`text-3xl sm:text-4xl font-extrabold text-white flex items-center justify-center sm:justify-start gap-3 ${
          isExecutive ? 'font-business' : isBento ? 'font-creative' : isSwiss ? 'font-light' : ''
        }`}>
          <GraduationCap className={`w-8 h-8 ${
            isTerminal ? 'text-emerald-400' :
            isBrutalist ? 'text-yellow-400' :
            isCyberpunk ? 'text-cyan-400' :
            isBento ? 'text-rose-400' :
            isExecutive ? 'text-amber-400' : 'text-neutral-300'
          }`} />
          <span>{sectionTitle}</span>
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-xl font-light">
          {sectionSubtitle}
        </p>
      </motion.div>

      {/* DISTINCT TIMELINE UI: Vertical Journey Track with Tangible Connecting Lines */}
      <motion.div 
        variants={cardsGridContainer} 
        className="relative space-y-12 sm:space-y-16 pl-4 sm:pl-8"
      >
        {/* Continuous Vertical Spine Connecting Line */}
        <div 
          className={`absolute left-4 sm:left-8 top-6 bottom-6 w-0.5 sm:w-1 -translate-x-1/2 ${
            isTerminal ? 'bg-gradient-to-b from-emerald-500/80 via-emerald-800/40 to-emerald-950/20' :
            isBrutalist ? 'bg-yellow-400 border-r-2 border-black' :
            isCyberpunk ? 'bg-gradient-to-b from-cyan-400 via-cyan-800/50 to-transparent shadow-[0_0_10px_#06b6d4]' :
            isBento ? 'bg-gradient-to-b from-rose-500/80 via-white/10 to-transparent' :
            isExecutive ? 'bg-gradient-to-b from-amber-400 via-amber-800/50 to-neutral-800' :
            'bg-gradient-to-b from-neutral-400 via-neutral-700 to-transparent'
          }`} 
        />

        {/* Top Timeline Terminus Cap */}
        <div className={`absolute -top-3 left-4 sm:left-8 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-widest font-bold z-10 whitespace-nowrap ${
          isTerminal ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50' :
          isBrutalist ? 'bg-yellow-400 text-black border-2 border-black font-black' :
          isCyberpunk ? 'bg-cyan-950 text-cyan-300 border border-cyan-400 shadow-[0_0_10px_#06b6d4]' :
          isBento ? 'bg-rose-950 text-rose-300 border border-rose-500/40' :
          isExecutive ? 'bg-amber-950 text-amber-300 border border-amber-500/40' :
          'bg-neutral-900 text-neutral-300 border border-neutral-700'
        }`}>
          Graduation Track
        </div>

        {education.map((edu, idx) => (
          <motion.div
            key={idx}
            variants={cardRevealItem}
            className="relative pl-8 sm:pl-16 group"
          >
            {/* Horizontal Branch Connecting Line linking spine into card */}
            <div 
              className={`absolute left-0 sm:left-0 top-7 w-8 sm:w-16 h-0.5 transition-all duration-300 ${
                isTerminal ? 'bg-emerald-600/70 group-hover:bg-emerald-400' :
                isBrutalist ? 'bg-black border-b-2 border-yellow-400 h-1' :
                isCyberpunk ? 'bg-cyan-600/70 group-hover:bg-cyan-400 group-hover:shadow-[0_0_8px_#06b6d4]' :
                isBento ? 'bg-rose-600/60 group-hover:bg-rose-400' :
                isExecutive ? 'bg-amber-600/70 group-hover:bg-amber-400' :
                'bg-neutral-600 group-hover:bg-white'
              }`} 
            />

            {/* Timeline Node Marker positioned right on the spine */}
            <div className={`absolute -left-3 sm:-left-3 top-4 w-6 h-6 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-125 z-20 ${
              isTerminal ? 'bg-neutral-950 border-2 border-emerald-400 text-emerald-400' :
              isBrutalist ? 'bg-yellow-400 border-2 border-black text-black shadow-[2px_2px_0px_#000]' :
              isCyberpunk ? 'bg-neutral-950 border-2 border-cyan-400 text-cyan-400 shadow-[0_0_14px_#06b6d4]' :
              isBento ? 'bg-neutral-950 border-2 border-rose-500 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.3)]' :
              isExecutive ? 'bg-neutral-950 border-2 border-amber-400 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]' :
              'bg-neutral-950 border-2 border-neutral-300 text-neutral-200'
            }`}>
              <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
            </div>

            {/* Timeline Card Container */}
            <div className={`p-6 sm:p-7 rounded-2xl transition-all duration-300 ${
              isTerminal ? 'bg-neutral-900/70 border border-neutral-800 hover:border-emerald-500/60 hover:bg-neutral-900/90 shadow-sm' :
              isBrutalist ? 'bg-neutral-900 border-4 border-neutral-800 shadow-[6px_6px_0px_#facc15] hover:border-yellow-400 hover:translate-x-1' :
              isCyberpunk ? 'bg-[#050e1a]/90 border border-cyan-900/60 shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:border-cyan-400/90' :
              isBento ? 'bg-white/[0.03] border border-white/10 backdrop-blur-xl hover:border-rose-500/50 shadow-xl' :
              isExecutive ? 'bg-neutral-900/80 border border-neutral-800 hover:border-amber-500/50 shadow-md' :
              'bg-neutral-900/20 border border-neutral-800 hover:border-neutral-500'
            }`}>
              {/* Year Pill & Node Index */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold ${
                  isTerminal ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/80' :
                  isBrutalist ? 'bg-yellow-400 text-black border border-black uppercase font-black' :
                  isCyberpunk ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-700' :
                  isBento ? 'bg-rose-950/60 text-rose-300 border border-rose-800/60' :
                  isExecutive ? 'bg-amber-950/60 text-amber-300 border border-amber-800/60' :
                  'bg-neutral-800 text-neutral-200'
                }`}>
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{edu.year}</span>
                </span>

                <span className="text-[11px] font-mono text-neutral-500 uppercase">
                  ACADEMIC MILESTONE #0{idx + 1}
                </span>
              </div>

              {/* Degree Title */}
              <h3 className={`text-lg sm:text-xl font-bold text-white mb-1.5 ${
                isExecutive ? 'font-business' : isBento ? 'font-creative' : isSwiss ? 'font-light' : ''
              }`}>
                {edu.degree}
              </h3>

              {/* Institution / University */}
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-300 mb-4">
                <BookOpen className="w-4 h-4 text-neutral-400" />
                <span className={
                  isTerminal ? 'text-emerald-400' :
                  isBrutalist ? 'text-yellow-400 font-bold' :
                  isCyberpunk ? 'text-cyan-400' :
                  isBento ? 'text-rose-300' :
                  isExecutive ? 'text-amber-400' : 'text-neutral-200'
                }>
                  {edu.institution}
                </span>
              </div>

              {/* Honors / GPA / Scholarship Distinct Callout */}
              {edu.honors && (
                <div className={`p-4 rounded-xl text-xs flex items-start gap-3 mt-3 ${
                  isTerminal ? 'bg-neutral-950 border border-emerald-900/50 text-emerald-300 font-mono' :
                  isBrutalist ? 'bg-black border-2 border-neutral-700 text-yellow-300 font-bold' :
                  isCyberpunk ? 'bg-black/60 border border-cyan-900/60 text-cyan-200' :
                  isBento ? 'bg-neutral-900/70 border border-white/5 text-neutral-200' :
                  isExecutive ? 'bg-neutral-950/70 border border-neutral-800 text-neutral-300 font-business' :
                  'bg-neutral-950 border border-neutral-800 text-neutral-300'
                }`}>
                  <Award className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <span className="font-semibold text-white block mb-0.5">Thành tựu Học thuật:</span>
                    <span>{edu.honors}</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};
