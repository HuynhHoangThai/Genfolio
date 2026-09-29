import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Zap, Hexagon, Briefcase, GraduationCap } from 'lucide-react';
import { MockProfile, ProjectItem } from '../../types/portfolio';
import { generateProceduralAvatar } from '../../utils/aiVisuals';

interface Props {
  profile: MockProfile;
  onOpenProject: (proj: ProjectItem) => void;
  onOpenResume: () => void;
  onGenerateAiVisuals?: () => void;
}

export const HolographicGridPortfolio: React.FC<Props> = ({ profile, onOpenProject, onOpenResume, onGenerateAiVisuals }) => {
  const avatar = profile.avatarImage || generateProceduralAvatar(profile.fullName, 'tech-dev');
  const layout = profile.layoutConfig || ['hero', 'metrics', 'projects', 'skills', 'experience', 'education'];

  const renderSection = (section: string, index: number) => {
    switch (section) {
      case 'hero':
        return (
          <div key="hero" className="text-center max-w-3xl mx-auto mb-20">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', duration: 1 }}>
              <div className="relative inline-block mb-8">
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--primary-color)] to-fuchsia-500 rounded-3xl rotate-6 opacity-30 blur-lg"></div>
                <img src={avatar} alt={profile.fullName} className="w-32 h-32 rounded-3xl relative z-10 object-cover shadow-xl border-4 border-white" />
              </div>
            </motion.div>
            
            <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-5xl md:text-7xl font-black tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-[var(--primary-color)] to-slate-900" style={{ backgroundSize: '200% auto', animation: 'shine 5s linear infinite' }}>
              {profile.fullName}
            </motion.h1>
            
            <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="text-2xl font-bold text-slate-600 mb-8">
              {profile.title}
            </motion.h2>
            
            <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="text-lg text-slate-500 leading-relaxed mb-10">
              {profile.bio}
            </motion.p>

            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="flex justify-center gap-4">
              <button onClick={onOpenResume} className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:shadow-[0_10px_40px_-10px_var(--primary-color)] hover:-translate-y-1 transition-all">
                Explore Full Profile
              </button>
              {onGenerateAiVisuals && (
                <button onClick={onGenerateAiVisuals} className="px-8 py-4 bg-white border border-slate-200 text-slate-900 font-bold rounded-2xl hover:border-[var(--primary-color)] hover:shadow-lg transition-all">
                  AI Visualizer
                </button>
              )}
            </motion.div>
          </div>
        );

      case 'metrics':
        if (!profile.metrics?.length) return null;
        return (
          <div key="metrics" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 max-w-6xl mx-auto">
            {profile.metrics.map((m, i) => (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.1 }} key={i} className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:border-[var(--primary-color)] transition-colors text-center">
                <div className="text-4xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-br from-[var(--primary-color)] to-fuchsia-500">{m.value}</div>
                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{m.label}</div>
              </motion.div>
            ))}
          </div>
        );

      case 'projects':
        if (!profile.projects?.length) return null;
        return (
          <motion.div key="projects" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="mb-20 max-w-5xl mx-auto">
            <h3 className="text-3xl font-black flex items-center justify-center gap-3 mb-12">
              <Layers className="w-8 h-8 text-[var(--primary-color)]" />
              Technical Showcases
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {profile.projects.map(proj => (
                <div key={proj.id} onClick={() => onOpenProject(proj)} className="group cursor-pointer bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-[var(--primary-glow)] transition-all flex flex-col">
                  <h4 className="text-2xl font-bold mb-3 text-slate-800 group-hover:text-[var(--primary-color)] transition-colors">{proj.title}</h4>
                  <p className="text-slate-500 mb-6">{proj.description}</p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {proj.tags.slice(0, 4).map(tag => (
                      <span key={tag} className="text-xs font-bold px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg group-hover:bg-[var(--primary-light)] group-hover:text-[var(--primary-color)] transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 'skills':
        if (!profile.skills?.length) return null;
        return (
          <motion.div key="skills" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="mb-20 max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-black flex items-center justify-center gap-3 mb-10">
              <Zap className="w-8 h-8 text-[var(--primary-color)]" />
              Core Arsenal
            </h3>
            <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100 inline-block w-full">
              <div className="flex flex-wrap justify-center gap-3">
                {profile.skills.map(skill => (
                  <div key={skill.name} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 ${skill.highlight ? 'bg-gradient-to-r from-[var(--primary-color)] to-teal-400 text-white shadow-lg' : 'bg-slate-50 border border-slate-200 text-slate-600'}`}>
                    {skill.name}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 'experience':
        if (!profile.experiences?.length) return null;
        return (
          <motion.div key="experience" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="mb-20 max-w-4xl mx-auto">
            <h3 className="text-3xl font-black flex items-center justify-center gap-3 mb-10">
              <Briefcase className="w-8 h-8 text-[var(--primary-color)]" />
              Professional History
            </h3>
            <div className="space-y-8">
              {profile.experiences.map((exp) => (
                <div key={exp.id} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:border-[var(--primary-color)] transition-colors relative">
                  <div className="absolute top-8 left-0 w-2 h-12 bg-gradient-to-b from-[var(--primary-color)] to-fuchsia-500 rounded-r-lg"></div>
                  <div className="ml-4">
                    <h4 className="text-2xl font-bold text-slate-800 mb-1">{exp.role}</h4>
                    <div className="text-sm font-bold text-[var(--primary-color)] mb-4">{exp.company} • {exp.period}</div>
                    <p className="text-slate-600 mb-4">{exp.description}</p>
                    <ul className="list-none space-y-2">
                      {exp.achievements.map((ach, i) => (
                        <li key={i} className="flex gap-3 text-slate-600 text-sm">
                          <Hexagon className="w-4 h-4 text-fuchsia-400 flex-shrink-0 mt-0.5" />
                          <span>{ach}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 'education':
        if (!profile.education?.length) return null;
        return (
          <motion.div key="education" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="mb-20 max-w-4xl mx-auto">
            <h3 className="text-3xl font-black flex items-center justify-center gap-3 mb-10">
              <GraduationCap className="w-8 h-8 text-[var(--primary-color)]" />
              Academic Credentials
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.education.map((edu, i) => (
                <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                  <div className="text-sm font-bold text-[var(--primary-color)] mb-2">{edu.year}</div>
                  <h4 className="text-xl font-bold text-slate-800 mb-1">{edu.degree}</h4>
                  <div className="text-slate-500">{edu.institution}</div>
                  {edu.honors && <div className="mt-4 text-sm font-bold text-amber-500 bg-amber-50 inline-block px-3 py-1 rounded-lg">{edu.honors}</div>}
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[var(--primary-color)] selection:text-white overflow-hidden relative">
      {/* Holographic Isometric Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(30deg, #000 12%, transparent 12.5%, transparent 87%, #000 87.5%, #000), linear-gradient(150deg, #000 12%, transparent 12.5%, transparent 87%, #000 87.5%, #000), linear-gradient(30deg, #000 12%, transparent 12.5%, transparent 87%, #000 87.5%, #000), linear-gradient(150deg, #000 12%, transparent 12.5%, transparent 87%, #000 87.5%, #000), linear-gradient(60deg, #000 25%, transparent 25.5%, transparent 75%, #000 75%, #000), linear-gradient(60deg, #000 25%, transparent 25.5%, transparent 75%, #000 75%, #000)',
        backgroundSize: '80px 140px',
        backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px'
      }} />

      {/* Iridescent Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-[100px] opacity-20 pointer-events-none" style={{ backgroundColor: 'var(--primary-color)' }} />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[100px] opacity-10 pointer-events-none bg-fuchsia-400" />
      <div className="fixed top-[30%] left-[30%] w-[40vw] h-[40vw] rounded-full mix-blend-multiply filter blur-[100px] opacity-15 pointer-events-none bg-cyan-400" />

      <main className="relative z-10 container mx-auto px-6 py-24 lg:py-32 max-w-7xl">
        {layout.map((section, idx) => (
          <React.Fragment key={idx}>
            {renderSection(section, idx)}
          </React.Fragment>
        ))}
      </main>
    </div>
  );
};
