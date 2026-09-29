import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Activity, Terminal as TerminalIcon, Briefcase, GraduationCap } from 'lucide-react';
import { MockProfile, ProjectItem } from '../../types/portfolio';
import { generateProceduralAvatar } from '../../utils/aiVisuals';

interface Props {
  profile: MockProfile;
  onOpenProject: (proj: ProjectItem) => void;
  onOpenResume: () => void;
  onGenerateAiVisuals?: () => void;
}

export const CyberNeonPortfolio: React.FC<Props> = ({ profile, onOpenProject, onOpenResume, onGenerateAiVisuals }) => {
  const avatar = profile.avatarImage || generateProceduralAvatar(profile.fullName, 'tech-dev');
  const layout = profile.layoutConfig || ['hero', 'metrics', 'skills', 'projects', 'experience', 'education'];

  const renderSection = (section: string, index: number) => {
    switch (section) {
      case 'hero':
        return (
          <motion.div key="hero" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-4xl mb-16">
            <div className="relative inline-block mb-6 group">
              <div className="absolute inset-0 bg-[var(--primary-color)] opacity-40 blur-xl group-hover:opacity-60 transition-opacity rounded-full"></div>
              <img src={avatar} alt={profile.fullName} className="w-32 h-32 rounded-full border-2 relative z-10 object-cover" style={{ borderColor: 'var(--primary-color)' }} />
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-4 uppercase tracking-tighter" style={{ color: 'var(--primary-color)', textShadow: '0 0 20px var(--primary-glow)' }}>
              {profile.fullName}
            </h1>
            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-widest opacity-90 border-l-4 pl-4" style={{ borderColor: 'var(--primary-color)' }}>
              {profile.title}
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed mb-8 max-w-2xl">
              {profile.tagline}
            </p>
            <div className="flex gap-4">
              <button onClick={onOpenResume} className="px-6 py-3 bg-[var(--primary-color)] text-black font-bold uppercase tracking-wider rounded-sm hover:scale-105 transition-transform shadow-[0_0_15px_var(--primary-glow)]">
                Access Dossier
              </button>
              {onGenerateAiVisuals && (
                <button onClick={onGenerateAiVisuals} className="px-6 py-3 border-2 text-white font-bold uppercase tracking-wider rounded-sm hover:bg-[var(--primary-glow)] transition-colors" style={{ borderColor: 'var(--primary-color)' }}>
                  Visuals
                </button>
              )}
            </div>
          </motion.div>
        );

      case 'metrics':
        if (!profile.metrics?.length) return null;
        return (
          <motion.div key="metrics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {profile.metrics.map((m, i) => (
              <div key={i} className="p-6 border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm rounded-lg relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full transition-all group-hover:w-full opacity-10" style={{ backgroundColor: 'var(--primary-color)' }}></div>
                <div className="text-4xl font-black mb-2" style={{ color: 'var(--primary-color)' }}>{m.value}</div>
                <div className="text-xs text-neutral-400 uppercase tracking-widest">{m.label}</div>
              </div>
            ))}
          </motion.div>
        );

      case 'skills':
        if (!profile.skills?.length) return null;
        return (
          <motion.section key="skills" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="mb-16">
            <div className="flex items-center gap-3 mb-6 border-b border-neutral-800 pb-3">
              <Activity className="w-6 h-6" style={{ color: 'var(--primary-color)' }} />
              <h3 className="text-2xl font-bold uppercase tracking-widest">Tech Stack / Systems</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {profile.skills.map((skill, i) => (
                <div key={i} className={`px-4 py-2 rounded-sm border text-sm font-bold tracking-wide transition-all hover:-translate-y-1 ${skill.highlight ? 'bg-[var(--primary-light)] text-white shadow-[0_0_10px_var(--primary-glow)]' : 'bg-transparent text-neutral-400 border-neutral-800 hover:border-neutral-600'}`} style={{ borderColor: skill.highlight ? 'var(--primary-color)' : '' }}>
                  {skill.name}
                </div>
              ))}
            </div>
          </motion.section>
        );

      case 'projects':
        if (!profile.projects?.length) return null;
        return (
          <motion.section key="projects" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="mb-16">
            <div className="flex items-center gap-3 mb-6 border-b border-neutral-800 pb-3">
              <TerminalIcon className="w-6 h-6" style={{ color: 'var(--primary-color)' }} />
              <h3 className="text-2xl font-bold uppercase tracking-widest">Deployed Protocols</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.projects.map((proj) => (
                <div key={proj.id} onClick={() => onOpenProject(proj)} className="group cursor-pointer block border border-neutral-800 bg-neutral-900/30 hover:bg-neutral-900/80 backdrop-blur-sm p-8 rounded-xl transition-all hover:border-[var(--primary-color)] relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-[2px] -translate-y-[100px] group-hover:translate-y-[300px] transition-transform duration-1000 opacity-50 pointer-events-none" style={{ backgroundColor: 'var(--primary-color)', boxShadow: '0 0 20px 2px var(--primary-color)' }} />
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-2xl font-bold text-white group-hover:text-[var(--primary-color)] transition-colors">{proj.title}</h4>
                    <ExternalLink className="w-5 h-5 text-neutral-500 group-hover:text-[var(--primary-color)] transition-colors" />
                  </div>
                  <p className="text-neutral-400 mb-6">{proj.description}</p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {proj.tags.slice(0, 4).map(tag => (
                      <span key={tag} className="text-[10px] uppercase tracking-widest px-2 py-1 bg-black border border-neutral-800 rounded text-neutral-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        );

      case 'experience':
        if (!profile.experiences?.length) return null;
        return (
          <motion.section key="experience" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="mb-16">
            <div className="flex items-center gap-3 mb-6 border-b border-neutral-800 pb-3">
              <Briefcase className="w-6 h-6" style={{ color: 'var(--primary-color)' }} />
              <h3 className="text-2xl font-bold uppercase tracking-widest">Mission Logs (Experience)</h3>
            </div>
            <div className="space-y-6">
              {profile.experiences.map((exp) => (
                <div key={exp.id} className="border border-neutral-800 bg-neutral-900/30 p-6 rounded-xl border-l-4" style={{ borderLeftColor: 'var(--primary-color)' }}>
                  <h4 className="text-xl font-bold text-white mb-1">{exp.role}</h4>
                  <div className="text-sm font-mono text-[var(--primary-color)] mb-4">{exp.company} // {exp.period}</div>
                  <p className="text-neutral-400 mb-4">{exp.description}</p>
                  <ul className="list-disc pl-5 space-y-2 text-neutral-300 text-sm mb-4">
                    {exp.achievements.map((ach, i) => <li key={i}>{ach}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </motion.section>
        );

      case 'education':
        if (!profile.education?.length) return null;
        return (
          <motion.section key="education" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="mb-16">
            <div className="flex items-center gap-3 mb-6 border-b border-neutral-800 pb-3">
              <GraduationCap className="w-6 h-6" style={{ color: 'var(--primary-color)' }} />
              <h3 className="text-2xl font-bold uppercase tracking-widest">Archive Chrono (Education)</h3>
            </div>
            <div className="space-y-4">
              {profile.education.map((edu, i) => (
                <div key={i} className="flex justify-between items-center p-4 border border-neutral-800 bg-neutral-900/30 rounded-lg">
                  <div>
                    <h4 className="font-bold text-white text-lg">{edu.degree}</h4>
                    <div className="text-neutral-400">{edu.institution}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-[var(--primary-color)]">{edu.year}</span>
                    {edu.honors && <div className="text-xs text-amber-400 mt-1">{edu.honors}</div>}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono selection:bg-[var(--primary-color)] selection:text-black overflow-hidden relative">
      {/* Neon Grid Background */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(to right, rgba(var(--primary-rgb), 0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(var(--primary-rgb), 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)'
      }} />

      {/* Glow Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full blur-[120px] opacity-20 pointer-events-none" style={{ backgroundColor: 'var(--primary-color)' }} />
      <div className="fixed bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] rounded-full blur-[100px] opacity-10 pointer-events-none" style={{ backgroundColor: 'var(--primary-color)' }} />

      <main className="relative z-10 container mx-auto px-6 py-24 md:py-32 max-w-5xl">
        {layout.map((section, idx) => (
          <React.Fragment key={idx}>
            {renderSection(section, idx)}
          </React.Fragment>
        ))}
      </main>
    </div>
  );
};
