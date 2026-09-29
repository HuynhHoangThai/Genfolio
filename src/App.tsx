/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowRight, Loader2 } from 'lucide-react';
import { IndustryType, LayoutConcept, MockProfile, ProjectItem } from './types/portfolio';
import { MOCK_PROFILES_MAP } from './data/mockProfiles';
import { HomeHero } from './components/home/HomeHero';
import { AiProcessingModal, UploadedFilePayload } from './components/loading/AiProcessingModal';
import { FloatingWidget } from './components/portfolio/FloatingWidget';
import { TechPortfolio } from './components/portfolio/TechPortfolio';
import { CyberNeonPortfolio } from './components/portfolio/CyberNeonPortfolio';
import { GlassMorphPortfolio } from './components/portfolio/GlassMorphPortfolio';
import { HolographicGridPortfolio } from './components/portfolio/HolographicGridPortfolio';
import { ProjectModal } from './components/portfolio/ProjectModal';
import { ResumeModal } from './components/portfolio/ResumeModal';
import { AiVisualModal } from './components/portfolio/AiVisualModal';
import { generateProceduralVisual, generateProceduralAvatar } from './utils/aiVisuals';

export default function App() {
  const [appStage, setAppStage] = useState<'home' | 'processing' | 'result'>('home');
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType>('tech-dev');
  const [currentConcept, setCurrentConcept] = useState<LayoutConcept>('cyber-neon');
  const [activeProfile, setActiveProfile] = useState<MockProfile>(MOCK_PROFILES_MAP['tech-dev']);
  const [pendingUploadedFile, setPendingUploadedFile] = useState<UploadedFilePayload | null>(null);
  const [primaryColor, setPrimaryColor] = useState<string>('#06b6d4');
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile'>('desktop');
  
  // Modals
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState<boolean>(false);
  const [isAiVisualModalOpen, setIsAiVisualModalOpen] = useState<boolean>(false);

  // Temporary Shared Portfolio State
  const [isLoadingShared, setIsLoadingShared] = useState<boolean>(false);
  const [sharedMeta, setSharedMeta] = useState<{
    isShared: boolean;
    expiresAt?: number;
    expiresInHours?: number;
    shareId?: string;
  } | null>(null);
  const [sharedError, setSharedError] = useState<{ expired: boolean; message: string } | null>(null);

  // Apply default CSS variables on mount & check for ?share= query param
  useEffect(() => {
    applyCssVariables('#06b6d4', '6, 182, 212');

    // Parse URL for ?share= parameter
    const params = new URLSearchParams(window.location.search);
    const shareParam = params.get('share');
    if (shareParam) {
      loadSharedPortfolio(shareParam);
    }
  }, []);

  const hexToRgb = (hex: string) => {
    const clean = hex.replace('#', '');
    if (clean.length === 6) {
      const r = parseInt(clean.substring(0, 2), 16);
      const g = parseInt(clean.substring(2, 4), 16);
      const b = parseInt(clean.substring(4, 6), 16);
      return `${r}, ${g}, ${b}`;
    }
    return '6, 182, 212';
  };

  const loadSharedPortfolio = async (id: string) => {
    setIsLoadingShared(true);
    setSharedError(null);
    try {
      const response = await fetch(`/api/share/${encodeURIComponent(id)}`);
      const data = await response.json();

      if (response.ok && data.success && data.profile) {
        setActiveProfile(data.profile);
        if (data.concept) setCurrentConcept(data.concept);
        if (data.profile.industry) setSelectedIndustry(data.profile.industry);
        if (data.primaryColor) {
          setPrimaryColor(data.primaryColor);
          applyCssVariables(data.primaryColor, hexToRgb(data.primaryColor));
        }

        setSharedMeta({
          isShared: true,
          expiresAt: data.expiresAt,
          expiresInHours: data.expiresInHours,
          shareId: id,
        });

        setAppStage('result');
      } else {
        setSharedError({
          expired: data.expired || response.status === 410,
          message: data.error || 'Liên kết không tồn tại hoặc đã bị gỡ bỏ.',
        });
      }
    } catch (err: any) {
      console.error('Error loading shared portfolio:', err);
      setSharedError({
        expired: false,
        message: 'Không thể kết nối đến máy chủ để tải portfolio.',
      });
    } finally {
      setIsLoadingShared(false);
    }
  };

  const applyCssVariables = (hex: string, rgb: string) => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', hex);
    root.style.setProperty('--primary-rgb', rgb);
    root.style.setProperty('--primary-glow', `rgba(${rgb}, 0.35)`);
    root.style.setProperty('--primary-light', `rgba(${rgb}, 0.15)`);
    root.style.setProperty('--primary-border', `rgba(${rgb}, 0.45)`);
  };

  const handleStartGeneration = (
    industry: IndustryType,
    customProfile?: MockProfile,
    uploadedFile?: UploadedFilePayload,
    concept?: LayoutConcept
  ) => {
    setSelectedIndustry(industry);
    
    // Determine layout concept
    let targetConcept: LayoutConcept = concept || 'cyber-neon';
    if (!concept) {
      targetConcept = 'cyber-neon';
    }
    setCurrentConcept(targetConcept);

    if (customProfile) {
      setActiveProfile(customProfile);
    } else {
      setActiveProfile(MOCK_PROFILES_MAP[industry] || MOCK_PROFILES_MAP['tech-dev']);
    }

    setPendingUploadedFile(uploadedFile || null);

    // Adjust theme color per concept
    if (targetConcept === 'cyber-neon') {
      handleColorChange('#06b6d4', '6, 182, 212'); // Cyan
    } else if (targetConcept === 'glass-morph') {
      handleColorChange('#8b5cf6', '139, 92, 246'); // Purple
    } else if (targetConcept === 'holographic-grid') {
      handleColorChange('#f43f5e', '244, 63, 94'); // Rose
    } else {
      handleColorChange('#10b981', '16, 185, 129'); // Emerald
    }

    setAppStage('processing');
  };

  const handleProcessingComplete = (extractedProfile: MockProfile) => {
    // Generate AI visual assets for any project without an image
    const themeForVisuals = 'tech';

    const enrichedProjects: ProjectItem[] = (extractedProfile.projects || []).map((proj) => ({
      ...proj,
      imageUrl: proj.imageUrl || generateProceduralVisual({
        theme: themeForVisuals as any,
        title: proj.title,
        category: proj.category,
        primaryColor,
        aspectRatio: '16:9',
      }),
    }));

    const enrichedProfile: MockProfile = {
      ...extractedProfile,
      concept: currentConcept,
      avatarImage: extractedProfile.avatarImage || generateProceduralAvatar(
        extractedProfile.fullName, 
        'tech-dev', 
        primaryColor
      ),
      projects: enrichedProjects,
    };

    setActiveProfile(enrichedProfile);

    if (extractedProfile.industry) {
      setSelectedIndustry(extractedProfile.industry);
    }
    if (extractedProfile.concept) {
      setCurrentConcept(extractedProfile.concept);
    }

    setAppStage('result');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleColorChange = (hex: string, rgb: string) => {
    setPrimaryColor(hex);
    applyCssVariables(hex, rgb);
  };

  const handleIndustryChange = (newIndustry: IndustryType) => {
    setSelectedIndustry(newIndustry);
    setActiveProfile((prev) => ({
      ...prev,
      industry: newIndustry,
    }));
  };

  const handleConceptChange = (newConcept: LayoutConcept) => {
    setCurrentConcept(newConcept);
    setActiveProfile((prev) => ({
      ...prev,
      concept: newConcept,
    }));

    // Auto-align default accents
    if (newConcept === 'cyber-neon') {
      handleColorChange('#06b6d4', '6, 182, 212');
    } else if (newConcept === 'glass-morph') {
      handleColorChange('#8b5cf6', '139, 92, 246');
    } else if (newConcept === 'holographic-grid') {
      handleColorChange('#f43f5e', '244, 63, 94');
    } else if (newConcept === 'terminal') {
      handleColorChange('#10b981', '16, 185, 129');
    }
  };

  const handleResetToHome = () => {
    setAppStage('home');
    setPendingUploadedFile(null);
    setViewportMode('desktop');
    setSharedMeta(null);
    if (window.location.search) {
      window.history.replaceState({}, '', window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-start">
      {/* Shared Portfolio Top Banner */}
      {appStage === 'result' && sharedMeta?.isShared && (
        <div className="sticky top-0 z-40 bg-neutral-950/95 border-b border-neutral-800 backdrop-blur-md px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs shadow-md">
          <div className="flex items-center gap-2 text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-[var(--primary-color)] animate-pulse" />
            <span className="text-xs font-medium">
              Đang xem Portfolio của <strong className="text-white font-bold">{activeProfile.fullName}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={handleResetToHome}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[var(--primary-color)] text-neutral-950 hover:opacity-95 transition-all shadow-sm cursor-pointer"
          >
            <span>Tự tạo Portfolio của bạn</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Loading Shared Portfolio Overlay */}
      {isLoadingShared && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-neutral-950/95 backdrop-blur-md">
          <div className="flex flex-col items-center gap-4 text-center p-6">
            <Loader2 className="w-10 h-10 text-[var(--primary-color)] animate-spin" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Đang tải Portfolio được chia sẻ...</h3>
            </div>
          </div>
        </div>
      )}

      {/* Shared Portfolio Expired or Not Found Modal */}
      {sharedError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white mb-1.5">
                {sharedError.expired ? 'Liên kết chia sẻ tạm thời đã hết hạn' : 'Không tìm thấy hồ sơ'}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">{sharedError.message}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSharedError(null);
                window.history.replaceState({}, '', window.location.pathname);
                handleResetToHome();
              }}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[var(--primary-color)] text-neutral-950 transition-all cursor-pointer"
            >
              Tự tạo Portfolio cho bạn ngay (Miễn phí)
            </button>
          </div>
        </div>
      )}

      {/* Stage 1: Home Generator Screen */}
      {appStage === 'home' && (
        <HomeHero onGenerate={handleStartGeneration} />
      )}

      {/* Stage 2: AI Loading / Gemini PDF Extraction Modal */}
      {appStage === 'processing' && (
        <AiProcessingModal
          industry={selectedIndustry}
          uploadedFile={pendingUploadedFile}
          onComplete={handleProcessingComplete}
          onCancel={handleResetToHome}
        />
      )}

      {/* Stage 3: Full-Screen Portfolio Output (Tràn viền, independent scroll) */}
      {appStage === 'result' && (
        <div className={`w-full min-h-screen transition-all duration-300 ${
          viewportMode === 'mobile'
            ? 'py-8 px-4 flex justify-center bg-neutral-900/90'
            : ''
        }`}>
          {/* Container: 100% full-screen on desktop; 375px centered simulated phone on mobile mode */}
          <div
            className={`transition-all duration-300 ${
              viewportMode === 'mobile'
                ? 'w-[375px] max-w-full rounded-[40px] border-[10px] border-neutral-800 shadow-2xl overflow-y-auto max-h-[850px] relative bg-neutral-950'
                : 'w-full'
            }`}
          >
            {/* Dynamic Layout Concept Routing */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentConcept}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
              >
                {currentConcept === 'terminal' && (
                  <TechPortfolio
                    profile={activeProfile}
                    onOpenProject={(proj) => setSelectedProject(proj)}
                    onOpenResume={() => setIsResumeModalOpen(true)}
                    onGenerateAiVisuals={() => setIsAiVisualModalOpen(true)}
                  />
                )}
                {currentConcept === 'cyber-neon' && (
                  <CyberNeonPortfolio
                    profile={activeProfile}
                    onOpenProject={(proj) => setSelectedProject(proj)}
                    onOpenResume={() => setIsResumeModalOpen(true)}
                    onGenerateAiVisuals={() => setIsAiVisualModalOpen(true)}
                  />
                )}
                {currentConcept === 'glass-morph' && (
                  <GlassMorphPortfolio
                    profile={activeProfile}
                    onOpenProject={(proj) => setSelectedProject(proj)}
                    onOpenResume={() => setIsResumeModalOpen(true)}
                    onGenerateAiVisuals={() => setIsAiVisualModalOpen(true)}
                  />
                )}
                {currentConcept === 'holographic-grid' && (
                  <HolographicGridPortfolio
                    profile={activeProfile}
                    onOpenProject={(proj) => setSelectedProject(proj)}
                    onOpenResume={() => setIsResumeModalOpen(true)}
                    onGenerateAiVisuals={() => setIsAiVisualModalOpen(true)}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Floating Customization Widget */}
          <FloatingWidget
            currentIndustry={selectedIndustry}
            currentConcept={currentConcept}
            currentColor={primaryColor}
            viewportMode={viewportMode}
            profile={activeProfile}
            onColorChange={handleColorChange}
            onViewportToggle={(mode) => setViewportMode(mode)}
            onIndustryChange={handleIndustryChange}
            onConceptChange={handleConceptChange}
            onOpenAiVisualModal={() => setIsAiVisualModalOpen(true)}
            onResetToHome={handleResetToHome}
            onOpenResumeModal={() => setIsResumeModalOpen(true)}
          />
        </div>
      )}

      {/* AI Visual Artwork Synthesizer Modal */}
      <AiVisualModal
        isOpen={isAiVisualModalOpen}
        profile={activeProfile}
        onClose={() => setIsAiVisualModalOpen(false)}
        onUpdateProfileVisuals={(updatedProfile) => setActiveProfile(updatedProfile)}
      />

      {/* Project Lightbox Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Full CV / Dossier Modal */}
      <ResumeModal
        profile={isResumeModalOpen ? activeProfile : null}
        onClose={() => setIsResumeModalOpen(false)}
      />
    </div>
  );
}
