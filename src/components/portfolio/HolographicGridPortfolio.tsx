import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Zap, Hexagon } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[var(--primary-color)] selection:text-white overflow-hidden relative">
      {/* Holographic Isometric Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(30deg, #000 12%, transparent 12.5%, transparent 87%, #000 87.5%, #000), linear-gradient(150deg, #000 12%, transparent 12.5%, transparent 87%, #000 87.5%, #000), linear-gradient(30deg, #000 12%, transparent 12.5%, transparent 87%, #000 87.5%, #000), linear-gradient(150deg, #000 12%, transparent 12.5%, transparent 87%, #000 87.5%, #000), linear-gradient(60deg, #000 25%, transparent 25.5%, transparent 75%, #000 75%, #000), linear-gradient(60deg, #000 25%, transparent 25.5%, transparent 75%, #000 75%, #000)',
        backgroundSize: '80px 140px',
        backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px'
      }} />

      {/* Iridescent Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-[100px] opacity-20 pointer-events-none" style={{ backgroundColor: 'var(--primary-color)' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[100px] opacity-10 pointer-events-none bg-fuchsia-400" />
      <div className="absolute top-[30%] left-[30%] w-[40vw] h-[40vw] rounded-full mix-blend-multiply filter blur-[100px] opacity-15 pointer-events-none bg-cyan-400" />

      <main className="relative z-10 container mx-auto px-6 py-24 lg:py-32 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-20">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {profile.metrics.map((m, i) => (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.1 }} key={i} className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:border-[var(--primary-color)] transition-colors text-center">
              <div className="text-4xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-br from-[var(--primary-color)] to-fuchsia-500">{m.value}</div>
              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{m.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Projects */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }} className="space-y-6">
            <h3 className="text-2xl font-black flex items-center gap-3 mb-8">
              <Layers className="w-8 h-8 text-[var(--primary-color)]" />
              Technical Showcases
            </h3>
            {profile.projects.map(proj => (
              <div key={proj.id} onClick={() => onOpenProject(proj)} className="group cursor-pointer bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-[var(--primary-glow)] transition-all">
                <h4 className="text-2xl font-bold mb-3 text-slate-800 group-hover:text-[var(--primary-color)] transition-colors">{proj.title}</h4>
                <p className="text-slate-500 mb-6">{proj.description}</p>
                <div className="flex flex-wrap gap-2">
                  {proj.tags.slice(0, 4).map(tag => (
                    <span key={tag} className="text-xs font-bold px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg group-hover:bg-[var(--primary-light)] group-hover:text-[var(--primary-color)] transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Skills */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
            <h3 className="text-2xl font-black flex items-center gap-3 mb-8">
              <Zap className="w-8 h-8 text-[var(--primary-color)]" />
              Core Arsenal
            </h3>
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <div className="flex flex-wrap gap-3">
                {profile.skills.map(skill => (
                  <div key={skill.name} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${skill.highlight ? 'bg-gradient-to-r from-[var(--primary-color)] to-teal-400 text-white shadow-lg' : 'bg-slate-50 border border-slate-200 text-slate-600'}`}>
                    {skill.name}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

      </main>
    </div>
  );
};
