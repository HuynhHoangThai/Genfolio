/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@lobehub/ui';
import { Flexbox } from 'react-layout-kit';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowRight, Loader2, RotateCcw, Share2, FileText, Smartphone, Monitor } from 'lucide-react';
import { IndustryType, LayoutConcept, MockProfile, ProjectItem } from './types/portfolio';
import { MOCK_PROFILES_MAP } from './data/mockProfiles';
import { AiProcessingModal, UploadedFilePayload } from './components/loading/AiProcessingModal';
import { FloatingWidget } from './components/portfolio/FloatingWidget';
import { TechPortfolio } from './components/portfolio/TechPortfolio';
import { CyberNeonPortfolio } from './components/portfolio/CyberNeonPortfolio';
import { GlassMorphPortfolio } from './components/portfolio/GlassMorphPortfolio';
import { HolographicGridPortfolio } from './components/portfolio/HolographicGridPortfolio';
import { ProjectModal } from './components/portfolio/ProjectModal';
import { ResumeModal } from './components/portfolio/ResumeModal';
import { ShareModal } from './components/portfolio/ShareModal';
import { AiVisualModal } from './components/portfolio/AiVisualModal';
import { generateProceduralVisual, generateProceduralAvatar } from './utils/aiVisuals';

// LobeChat Official Color Tokens & Global Style
import { LOBE_PRIMARY_COLORS, getLobeThemeKey, GlobalStyle } from './styles';

// LobeChat UI Components
import { LobeSideNav, LobeTabKey } from './components/lobe/LobeSideNav';
import { LobeSidebar } from './components/lobe/LobeSidebar';
import { LobeHeader } from './components/lobe/LobeHeader';
import { LobeChatStudio } from './components/lobe/LobeChatStudio';
import { LobeTemplatesMarket } from './components/lobe/LobeTemplatesMarket';
import { LobeDossierView } from './components/lobe/LobeDossierView';
import { LobeSettingsModal } from './components/lobe/LobeSettingsModal';
import { LobeDragUpload } from './components/lobe/LobeDragUpload';
import { LobeErrorBoundary } from './components/lobe/LobeErrorBoundary';

export default function App() {
  const [activeTab, setActiveTab] = useState<LobeTabKey>('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [activeModel, setActiveModel] = useState<string>('nvidia/nemotron-3.5-lightning:free');

  // PRD Business Stages: 'home' (Input) | 'processing' (Loading <= 3s) | 'result' (Full-screen Output)
  const [appStage, setAppStage] = useState<'home' | 'processing' | 'result'>('home');
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType>('tech-dev');
  const [currentConcept, setCurrentConcept] = useState<LayoutConcept>('cyber-neon');
  const [activeProfile, setActiveProfile] = useState<MockProfile>(MOCK_PROFILES_MAP['tech-dev']);
  const [pendingUploadedFile, setPendingUploadedFile] = useState<UploadedFilePayload | null>(null);
  const [primaryColor, setPrimaryColor] = useState<string>(LOBE_PRIMARY_COLORS.cyan.hex);
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile'>('desktop');
  
  // Modals
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isAiVisualModalOpen, setIsAiVisualModalOpen] = useState<boolean>(false);

  // Temporary Shared Portfolio State (PRD Section 5.2 #7 & Section 9.1)
  const [isLoadingShared, setIsLoadingShared] = useState<boolean>(false);
  const [sharedMeta, setSharedMeta] = useState<{
    isShared: boolean;
    expiresAt?: number;
    expiresInHours?: number;
    shareId?: string;
  } | null>(null);
  const [sharedError, setSharedError] = useState<{ expired: boolean; message: string } | null>(null);

  // Apply default LobeChat CSS variables on mount & check for ?share= query param
  useEffect(() => {
    applyCssVariables(LOBE_PRIMARY_COLORS.cyan.hex, LOBE_PRIMARY_COLORS.cyan.rgb);

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
    return '149, 243, 217';
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

  // PRD G-01: 2-step generation flow
  const handleStartGeneration = (
    industry: IndustryType,
    customProfile?: MockProfile,
    uploadedFile?: UploadedFilePayload,
    concept?: LayoutConcept
  ) => {
    setSelectedIndustry(industry);
    
    // Auto-map concept per industry (PRD BR-01, BR-02, BR-03)
    let targetConcept: LayoutConcept = concept || 'cyber-neon';
    if (!concept) {
      if (industry === 'tech-dev' || industry === 'tech-sec') targetConcept = 'cyber-neon';
      else if (industry === 'tech-uiux') targetConcept = 'glass-morph';
      else targetConcept = 'holographic-grid';
    }
    setCurrentConcept(targetConcept);

    if (customProfile) {
      setActiveProfile(customProfile);
    } else {
      setActiveProfile(MOCK_PROFILES_MAP[industry] || MOCK_PROFILES_MAP['tech-dev']);
    }

    setPendingUploadedFile(uploadedFile || null);

    // Auto-align LobeChat color palette per concept
    if (targetConcept === 'cyber-neon') {
      handleColorChange(LOBE_PRIMARY_COLORS.cyan.hex, LOBE_PRIMARY_COLORS.cyan.rgb);
    } else if (targetConcept === 'glass-morph') {
      handleColorChange(LOBE_PRIMARY_COLORS.purple.hex, LOBE_PRIMARY_COLORS.purple.rgb);
    } else if (targetConcept === 'holographic-grid') {
      handleColorChange(LOBE_PRIMARY_COLORS.magenta.hex, LOBE_PRIMARY_COLORS.magenta.rgb);
    } else {
      handleColorChange(LOBE_PRIMARY_COLORS.green.hex, LOBE_PRIMARY_COLORS.green.rgb);
    }

    setAppStage('processing');
  };

  const handleProcessingComplete = (extractedProfile: MockProfile) => {
    const enrichedProjects: ProjectItem[] = (extractedProfile.projects || []).map((proj) => ({
      ...proj,
      imageUrl: proj.imageUrl || generateProceduralVisual({
        theme: 'tech',
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
    if (!pendingUploadedFile && MOCK_PROFILES_MAP[newIndustry]) {
      const mock = MOCK_PROFILES_MAP[newIndustry];
      setActiveProfile(mock);
      let targetConcept: LayoutConcept = 'cyber-neon';
      if (newIndustry === 'tech-dev' || newIndustry === 'tech-sec') targetConcept = 'cyber-neon';
      else if (newIndustry === 'tech-uiux') targetConcept = 'glass-morph';
      else targetConcept = 'holographic-grid';
      handleConceptChange(targetConcept);
    } else {
      setActiveProfile((prev) => ({
        ...prev,
        industry: newIndustry,
      }));
    }
  };

  const handleConceptChange = (newConcept: LayoutConcept) => {
    setCurrentConcept(newConcept);
    setActiveProfile((prev) => ({
      ...prev,
      concept: newConcept,
    }));

    if (newConcept === 'cyber-neon') {
      handleColorChange(LOBE_PRIMARY_COLORS.cyan.hex, LOBE_PRIMARY_COLORS.cyan.rgb);
    } else if (newConcept === 'glass-morph') {
      handleColorChange(LOBE_PRIMARY_COLORS.purple.hex, LOBE_PRIMARY_COLORS.purple.rgb);
    } else if (newConcept === 'holographic-grid') {
      handleColorChange(LOBE_PRIMARY_COLORS.magenta.hex, LOBE_PRIMARY_COLORS.magenta.rgb);
    } else if (newConcept === 'terminal') {
      handleColorChange(LOBE_PRIMARY_COLORS.green.hex, LOBE_PRIMARY_COLORS.green.rgb);
    }
  };

  const handleSelectPreset = (industry: IndustryType, concept: LayoutConcept) => {
    setSelectedIndustry(industry);
    setCurrentConcept(concept);
    setActiveProfile(MOCK_PROFILES_MAP[industry] || MOCK_PROFILES_MAP['tech-dev']);
    setPendingUploadedFile(null);
    handleConceptChange(concept);
    setAppStage('result');
    setActiveTab('chat');
  };

  const handleResetToHome = () => {
    setAppStage('home');
    setPendingUploadedFile(null);
    setViewportMode('desktop');
    setSharedMeta(null);
    setActiveTab('chat');
    if (window.location.search) {
      window.history.replaceState({}, '', window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGlobalFileUpload = (file: File) => {
    const reader = new FileReader();

    if (file.name.endsWith('.json')) {
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          handleStartGeneration(
            parsed.industry || selectedIndustry,
            parsed,
            undefined,
            parsed.concept || currentConcept
          );
        } catch {
          alert('File JSON không hợp lệ');
        }
      };
      reader.readAsText(file);
    } else {
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const payload: UploadedFilePayload = {
          base64Data: base64,
          mimeType: file.type || 'application/pdf',
          fileName: file.name,
          fileSize: (file.size / 1024).toFixed(1) + ' KB',
        };
        handleStartGeneration(selectedIndustry, undefined, payload, currentConcept);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <LobeErrorBoundary>
      <ThemeProvider themeMode="dark" customTheme={{ primaryColor: getLobeThemeKey(primaryColor) as any }}>
        <GlobalStyle />
        {/* Full-Window Drag & Drop Overlay (Cloned from LobeChat DragUpload) */}
        <LobeDragUpload onUploadFile={handleGlobalFileUpload} />
      {/* Loading Shared Portfolio Overlay */}
      {isLoadingShared && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md">
          <div className="flex flex-col items-center gap-4 text-center p-6">
            <Loader2 className="w-10 h-10 text-[var(--primary-color)] animate-spin" />
            <h3 className="text-base font-bold text-white">Đang tải Portfolio được chia sẻ...</h3>
          </div>
        </div>
      )}

      {/* Shared Portfolio Expired or Not Found Modal */}
      {sharedError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
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

      {/* PRD Stage 2: AI Loading / Gemini & MarkItDown Extraction Modal (<= 3s) */}
      {appStage === 'processing' && (
        <AiProcessingModal
          industry={selectedIndustry}
          uploadedFile={pendingUploadedFile}
          onComplete={handleProcessingComplete}
          onCancel={handleResetToHome}
        />
      )}

      {/* 
        PRD Stage 3: FULL-SCREEN OUTPUT (Tràn viền 100% width, không có Sidebar - Section 5.1 #2, Section 7 FR-03, Section 12.1 AC-02)
      */}
      {appStage === 'result' ? (
        <div className="w-full min-h-screen bg-black text-neutral-100 flex flex-col justify-start relative overflow-x-hidden">
          {/* Top Sticky Minimalist Bar */}
          <div className="sticky top-0 z-40 bg-black/85 backdrop-blur-xl border-b border-white/[0.08] px-4 py-2.5 flex items-center justify-between gap-3 text-xs shadow-md">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[var(--primary-color)] animate-pulse" />
              <span className="text-neutral-300">
                Portfolio của <strong className="text-white font-bold">{activeProfile.fullName}</strong> ({activeProfile.title || activeProfile.tagline})
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-[10px] text-neutral-400 font-mono">
                {currentConcept.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Desktop / Mobile Viewport Toggle (PRD FR-05, AC-S01) */}
              <div className="hidden sm:flex items-center bg-neutral-900 border border-white/[0.1] p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => setViewportMode('desktop')}
                  className={`p-1 px-2 rounded text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer ${
                    viewportMode === 'desktop' ? 'bg-white/[0.15] text-white font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                  title="Desktop tràn viền 100%"
                >
                  <Monitor className="w-3 h-3" />
                  <span>Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewportMode('mobile')}
                  className={`p-1 px-2 rounded text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer ${
                    viewportMode === 'mobile' ? 'bg-white/[0.15] text-white font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                  title="Mobile giả lập 375px"
                >
                  <Smartphone className="w-3 h-3" />
                  <span>Mobile</span>
                </button>
              </div>

              {/* Share Button (PRD Section 5.2 #7) */}
              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/[0.1] transition-all cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Chia sẻ link</span>
              </button>

              {/* Return to LobeChat Studio Button */}
              <button
                type="button"
                onClick={handleResetToHome}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[var(--primary-color)] text-black hover:opacity-90 transition-all cursor-pointer shadow-md"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Về Studio LobeChat</span>
              </button>
            </div>
          </div>

          {/* Full-Screen Landing Page Container (Desktop: 100% full width, Mobile: 375px frame) */}
          <div className={`w-full flex-1 transition-all duration-300 ${
            viewportMode === 'mobile'
              ? 'py-8 px-4 flex justify-center bg-neutral-950/90'
              : ''
          }`}>
            <div
              className={`transition-all duration-300 ${
                viewportMode === 'mobile'
                  ? 'w-[375px] max-w-full rounded-[40px] border-[10px] border-neutral-800 shadow-2xl overflow-y-auto max-h-[860px] relative bg-neutral-950'
                  : 'w-full'
              }`}
            >
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
          </div>

          {/* Floating Customization Widget (PRD Section 5.1 #3, FR-04, FR-05, AC-03) */}
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
      ) : (
        /* 
          PRD Stage 1 & Studio: LobeChat 3-Column Studio Workspace
        */
        <Flexbox
          height="100vh"
          horizontal
          style={{
            width: '100vw',
            overflow: 'hidden',
            background: 'var(--lobe-bg-root, #000000)',
            color: '#f5f5f5',
          }}
        >
          {/* LobeChat Activity SideNav */}
          <LobeSideNav
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            primaryColor={primaryColor}
            onColorChange={handleColorChange}
            activeModelName={activeModel}
          />

          {/* LobeChat Session / Presets Sidebar */}
          <LobeSidebar
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            selectedIndustry={selectedIndustry}
            currentConcept={currentConcept}
            activeProfile={activeProfile}
            uploadedFile={pendingUploadedFile}
            onSelectPreset={handleSelectPreset}
            onNewPortfolio={handleResetToHome}
            onClearUploadedFile={() => setPendingUploadedFile(null)}
            activeModelName={activeModel}
          />

          {/* Main Content Pane */}
          <Flexbox
            flex={1}
            height="100%"
            style={{
              overflow: 'hidden',
              position: 'relative',
              background: 'var(--lobe-bg-layout, #050505)',
            }}
          >
            {/* LobeChat Header */}
            <LobeHeader
              appStage={appStage}
              activeProfile={activeProfile}
              currentConcept={currentConcept}
              viewportMode={viewportMode}
              onViewportToggle={(mode) => setViewportMode(mode)}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onOpenShareModal={() => setIsShareModalOpen(true)}
              onOpenResumeModal={() => setIsResumeModalOpen(true)}
              onResetToHome={handleResetToHome}
              activeModelName={activeModel}
              isSidebarOpen={isSidebarOpen}
              onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            {/* Body Content based on Active Tab */}
            <Flexbox
              flex={1}
              style={{
                overflowY: 'auto',
                position: 'relative',
              }}
            >
              {/* Tab: Templates Market */}
              {activeTab === 'market' && (
                <LobeTemplatesMarket
                  currentConcept={currentConcept}
                  onSelectConceptAndLaunch={(concept, industry) => {
                    handleSelectPreset(industry, concept);
                  }}
                />
              )}

              {/* Tab: Files / Dossier */}
              {activeTab === 'files' && (
                <LobeDossierView profile={activeProfile} />
              )}

              {/* Tab: Studio / Chat */}
              {activeTab === 'chat' && (
                <LobeChatStudio
                  onGenerate={handleStartGeneration}
                  selectedIndustry={selectedIndustry}
                  selectedConcept={currentConcept}
                  onSelectConcept={(concept, industry) => {
                    handleConceptChange(concept);
                    setSelectedIndustry(industry);
                  }}
                  activeModelName={activeModel}
                />
              )}
            </Flexbox>
          </Flexbox>
        </Flexbox>
      )}

      {/* LobeChat Settings Modal */}
      <LobeSettingsModal
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentModel={activeModel}
        onSelectModel={(model) => setActiveModel(model)}
      />

      {/* Share Modal (Temporary 24h/48h Share Link) */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        profile={activeProfile}
        concept={currentConcept}
        primaryColor={primaryColor}
      />

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
    </ThemeProvider>
  </LobeErrorBoundary>
  );
}
