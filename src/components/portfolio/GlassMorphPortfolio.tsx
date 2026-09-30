import React from 'react';
import { motion } from 'framer-motion';
import { Code2, ArrowUpRight, Cpu, Briefcase, GraduationCap } from 'lucide-react';
import { MockProfile, ProjectItem } from '../../types/portfolio';
import { generateProceduralAvatar } from '../../utils/aiVisuals';

interface Props {
  profile: MockProfile;
  onOpenProject: (proj: ProjectItem) => void;
  onOpenResume: () => void;
  onGenerateAiVisuals?: () => void;
}

export const GlassMorphPortfolio: React.FC<Props> = ({ profile, onOpenProject, onOpenResume, onGenerateAiVisuals }) => {
  const avatar = profile.avatarImage || generateProceduralAvatar(profile.fullName, 'tech-dev');
  
  // AI Driven Layout Configuration
  const layout = profile.layoutConfig || ['hero', 'metrics', 'skills', 'projects', 'experience', 'education'];
  
  // Separate Hero for the sticky left column, map the rest to the right column
  const hasHero = layout.includes('hero');
  const rightColumnLayout = layout.filter(section => section !== 'hero');

  const renderSection = (section: string, index: number) => {
    switch (section) {
      case 'metrics':
        if (!profile.metrics?.length) return null;
        return (
          <motion.div key="metrics" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1, duration: 0.8 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {profile.metrics.map((m, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl text-center hover:bg-white/10 transition-colors">
                <div className="text-3xl font-bold mb-1" style={{ color: 'var(--primary-color)' }}>{m.value}</div>
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">{m.label}</div>
              </div>
            ))}
          </motion.div>
        );

      case 'skills':
        if (!profile.skills?.length) return null;
        return (
          <motion.div key="skills" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1, duration: 0.8 }} className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Cpu className="w-6 h-6" style={{ color: 'var(--primary-color)' }} /> 
              Technical Architecture
            </h3>
            <div className="flex flex-wrap gap-3">
              {profile.skills.map(skill => (
                <span key={skill.name} className={`px-4 py-2 rounded-xl text-sm font-medium backdrop-blur-md transition-all hover:scale-105 ${skill.highlight ? 'bg-white/20 border border-white/30 text-white shadow-lg' : 'bg-black/20 border border-white/5 text-slate-300'}`}>
                  {skill.name}
                </span>
              ))}
            </div>
          </motion.div>
        );

      case 'projects':
        if (!profile.projects?.length) return null;
        return (
          <motion.div key="projects" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1, duration: 0.8 }}>
            <h3 className="text-2xl font-bold text-white mb-6 ml-2 flex items-center gap-2">
              <Code2 className="w-6 h-6" style={{ color: 'var(--primary-color)' }} />
              Engineering Initiatives
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.projects.map(proj => (
                <div key={proj.id} onClick={() => onOpenProject(proj)} className="group cursor-pointer bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/30 p-6 rounded-3xl transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-[var(--primary-glow)] flex flex-col">
                  <h4 className="text-xl font-bold text-white mb-3 group-hover:text-[var(--primary-color)] transition-colors">{proj.title}</h4>
                  <p className="text-slate-400 text-sm mb-6 line-clamp-3">{proj.description}</p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {proj.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-xs px-3 py-1 bg-black/30 rounded-full text-slate-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 'experience':
        if (!profile.experiences?.length) return null;
        return (
          <motion.div key="experience" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1, duration: 0.8 }} className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Briefcase className="w-6 h-6" style={{ color: 'var(--primary-color)' }} /> 
              Professional History
            </h3>
            <div className="space-y-6">
              {profile.experiences.map((exp) => (
                <div key={exp.id} className="relative pl-6 border-l-2" style={{ borderColor: 'var(--primary-color)' }}>
                  <div className="absolute w-3 h-3 rounded-full -left-[7px] top-1" style={{ backgroundColor: 'var(--primary-color)' }}></div>
                  <h4 className="text-lg font-bold text-white">{exp.role}</h4>
                  <div className="text-sm font-medium text-slate-400 mb-2">{exp.company} • {exp.period}</div>
                  <p className="text-sm text-slate-300 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 'education':
        if (!profile.education?.length) return null;
        return (
          <motion.div key="education" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1, duration: 0.8 }} className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <GraduationCap className="w-6 h-6" style={{ color: 'var(--primary-color)' }} /> 
              Academic Background
            </h3>
            <div className="space-y-4">
              {profile.education.map((edu, i) => (
                <div key={i} className="flex flex-col md:flex-row md:justify-between md:items-center p-4 bg-black/10 rounded-2xl border border-white/5 hover:bg-white/5 transition-colors">
                  <div>
                    <h4 className="font-bold text-white">{edu.degree}</h4>
                    <div className="text-sm text-slate-400">{edu.institution}</div>
                  </div>
                  <div className="text-right mt-2 md:mt-0">
                    <span className="px-3 py-1 bg-[var(--primary-color)]/20 text-[var(--primary-color)] text-xs font-bold rounded-full">{edu.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-[var(--primary-color)] selection:text-white overflow-x-hidden relative">
      {/* Vibrant Mesh Gradients */}
      <div className="fixed top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full mix-blend-screen filter blur-[150px] opacity-40 animate-pulse pointer-events-none" style={{ backgroundColor: 'var(--primary-color)' }} />
      <div className="fixed bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full mix-blend-screen filter blur-[150px] opacity-30 pointer-events-none bg-blue-600" />
      <div className="fixed top-[40%] left-[20%] w-[40vw] h-[40vw] rounded-full mix-blend-screen filter blur-[120px] opacity-20 pointer-events-none bg-purple-600" />

      <main className="relative z-10 container mx-auto px-6 py-20 lg:py-32 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Glass Card Hero (Sticky Left Column if Hero is in layout) */}
          <div className="lg:col-span-4">
            {hasHero && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, type: 'spring' }} 
                className="bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-3xl shadow-2xl sticky top-24">
                <img src={avatar} alt={profile.fullName} className="w-24 h-24 rounded-2xl mb-6 shadow-lg object-cover" />
                <h1 className="text-4xl font-bold mb-2 text-white">{profile.fullName}</h1>
                <h2 className="text-xl font-medium mb-6" style={{ color: 'var(--primary-color)' }}>{profile.title}</h2>
                <p className="text-slate-300 leading-relaxed mb-8">{profile.bio}</p>
                
                <div className="space-y-4">
                  <button onClick={onOpenResume} className="w-full py-4 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white font-semibold rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2">
                    View Full CV <ArrowUpRight className="w-4 h-4" />
                  </button>
                  {onGenerateAiVisuals && (
                    <button onClick={onGenerateAiVisuals} className="w-full py-4 bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/10 text-slate-300 font-semibold rounded-2xl transition-all">
                      Generate Visuals
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Content - Dynamically Rendered based on AI layout configuration */}
          <div className={`space-y-8 ${hasHero ? 'lg:col-span-8' : 'lg:col-span-12 max-w-4xl mx-auto'}`}>
            {rightColumnLayout.map((section, idx) => (
              <React.Fragment key={idx}>
                {renderSection(section, idx)}
              </React.Fragment>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
