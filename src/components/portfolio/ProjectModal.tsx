import React from 'react';
import { X, ExternalLink, Github, CheckCircle2, Layers, Calendar, Tag } from 'lucide-react';
import { ProjectItem } from '../../types/portfolio';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          title="Đóng (ESC)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tag / Year */}
        <div className="flex items-center gap-3 text-xs text-neutral-400 mb-3">
          <span className="font-mono text-xs uppercase tracking-wider theme-accent-text font-bold">
            {project.category}
          </span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1 font-mono">
            <Calendar className="w-3.5 h-3.5" />
            {project.year}
          </span>
        </div>

        {/* Project Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          {project.title}
        </h2>

        {/* Tagline */}
        <p className="text-sm font-medium theme-accent-text mb-6">
          {project.tagline}
        </p>

        {/* Metrics Grid */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 p-4 rounded-xl bg-neutral-950/60 border border-neutral-800">
            {project.metrics.map((m, idx) => (
              <div key={idx} className="text-left">
                <div className="text-lg sm:text-xl font-bold font-mono text-white">
                  {m.value}
                </div>
                <div className="text-xs text-neutral-400 mt-0.5">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Deep Description */}
        <div className="mb-6">
          <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold mb-2">
            Mô tả kiến trúc & Giải pháp triển khai
          </h4>
          <p className="text-sm text-neutral-300 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Technology Stack Tags */}
        <div className="mb-8">
          <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold mb-2.5">
            Công nghệ & Công cụ sử dụng
          </h4>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((t, idx) => (
              <span
                key={idx}
                className="text-xs font-mono px-2.5 py-1 rounded-md bg-neutral-800/80 border border-neutral-700/60 text-neutral-200"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Action Links */}
        <div className="flex items-center gap-3 pt-4 border-t border-neutral-800">
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 py-2 px-4 rounded-lg text-xs font-semibold text-neutral-950 theme-accent-bg hover:opacity-90 transition-opacity"
            >
              <span>Xem Demo / Chi tiết</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 py-2 px-4 rounded-lg text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>Xem Repository</span>
            </a>
          )}

          <button
            onClick={onClose}
            className="ml-auto py-2 px-4 rounded-lg text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
