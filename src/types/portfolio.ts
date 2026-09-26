export type IndustryType = 'tech' | 'creative' | 'business';

export type LayoutConcept =
  | 'terminal'        // Cyber-Terminal & Distributed Systems
  | 'brutalist'       // Neo-Brutalist Avant-Garde & High-Contrast
  | 'bento-glass'     // Spatial Bento & Glassmorphism Studio
  | 'swiss-editorial' // Swiss Minimalist Luxury Editorial
  | 'executive-kpi'   // Executive Corporate & Wall-Street KPI
  | 'cyberpunk-holo'; // Futuristic Cyberpunk Holo-Deck & AI Nodes

export interface SkillItem {
  name: string;
  level?: number; // 1-100
  category?: string;
  highlight?: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  year: string;
  metrics?: { label: string; value: string }[];
  tags: string[];
  link?: string;
  github?: string;
  featured?: boolean;
  accentBadge?: string;
  imageUrl?: string;
  imagePrompt?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
  skillsUsed: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  year: string;
  honors?: string;
}

export interface TestimonialItem {
  id: string;
  author: string;
  role: string;
  company: string;
  quote: string;
  avatarText?: string;
  avatarImage?: string;
}

export interface KpiMetric {
  value: string;
  label: string;
  change?: string;
  subtext?: string;
}

export interface MockProfile {
  id: string;
  industry: IndustryType;
  concept?: LayoutConcept;
  fullName: string;
  title: string;
  tagline: string;
  bio: string;
  avatarImage?: string;
  heroBannerImage?: string;
  email: string;
  phone: string;
  location: string;
  socials: {
    github?: string;
    linkedin?: string;
    behance?: string;
    dribbble?: string;
    twitter?: string;
    website?: string;
  };
  metrics: KpiMetric[];
  skills: SkillItem[];
  projects: ProjectItem[];
  experiences: ExperienceItem[];
  education: EducationItem[];
  testimonials: TestimonialItem[];
  awards?: string[];
  certifications?: string[];
  philosophy?: string;
  markitdownMarkdown?: string;
}

export interface ThemeConfig {
  primaryColor: string;
  primaryGlow: string;
  primaryLight: string;
  isDark: boolean;
  viewportMode: 'desktop' | 'mobile';
  concept: LayoutConcept;
}

