---
name: template-designer
description: >-
  Use this skill when the user asks to design, create, or modify a portfolio template for Genfolio (e.g. creating a new React template component in src/components/portfolio).
---

# Template Designer Skill

This skill guides you through the process of creating a new portfolio template for Genfolio.

## Overview
Genfolio allows users to generate dynamic portfolios from their CVs. It supports multiple templates (called Layout Concepts), such as Cyber Neon, Glassmorphism, and Holographic Grid.
When the user asks you to create a new template, follow these guidelines to ensure it seamlessly integrates into the application and meets the project's high aesthetic standards.

## 1. Core Architecture Requirements

### File Location
New templates MUST be placed in `src/components/portfolio/` (e.g. `src/components/portfolio/MinimalistPortfolio.tsx`).

### Props Interface
Every template must accept the following standard props:
```tsx
import { MockProfile, ProjectItem } from '../../types/portfolio';

interface PortfolioProps {
  profile: MockProfile;
  primaryColor: string;
  onProjectClick: (project: ProjectItem) => void;
  onOpenResume?: () => void;
  onOpenVisuals?: () => void;
  isViewOnly?: boolean;
}
```

### Required Actions
- `onProjectClick`: Must be called when a user clicks on a project card to open the project details modal.
- `onOpenResume`: Must be called when a user clicks the "View Resume" button (usually in the Hero section).
- `onOpenVisuals`: Must be called when a user clicks the "AI Visuals" or "Generate Image" button (usually on projects or in the Hero).

## 2. Dynamic Layout Sections
The CV extractor generates a `layoutConfig` array (e.g., `['hero', 'skills', 'experience', 'projects']`) inside `profile.layoutConfig`.
Your template **MUST** iterate through this array to render the sections dynamically in the specified order, or fallback to a sensible default if missing.

Example rendering logic:
```tsx
const renderSection = (sectionId: string) => {
  switch (sectionId) {
    case 'hero': return <HeroSection profile={profile} primaryColor={primaryColor} onOpenResume={onOpenResume} />;
    case 'metrics': return <MetricsSection metrics={profile.metrics} />;
    case 'skills': return <SkillsSection skills={profile.skills} primaryColor={primaryColor} />;
    case 'projects': return <ProjectsSection projects={profile.projects} onProjectClick={onProjectClick} />;
    case 'experience': return <ExperienceSection experiences={profile.experiences} primaryColor={primaryColor} />;
    case 'education': return <EducationSection education={profile.education} />;
    case 'testimonials': return <TestimonialsSection testimonials={profile.testimonials} />;
    default: return null;
  }
};

return (
  <div className="portfolio-wrapper">
    {(profile.layoutConfig || ['hero', 'metrics', 'skills', 'projects', 'experience']).map(renderSection)}
  </div>
);
```

## 3. Design & Aesthetic Guidelines (CRITICAL)
- **Visual Excellence**: Do not create generic, simple designs. Use sophisticated, modern styling (e.g., dark modes, vibrant gradients, glassmorphism, glowing borders).
- **Animations**: Use `framer-motion` for entrance animations (e.g., staggered fades, slide-ups) and interactive micro-animations (e.g., hover scaling, button glowing).
- **Styling**: Use TailwindCSS utility classes. Utilize the `primaryColor` prop by applying it via inline styles for dynamic tinting (e.g., `style={{ color: primaryColor }}`).
- **Icons**: Use `lucide-react` for iconography.

## 4. Integration Steps
Once the template component is created, instruct the user (or do it yourself) to register the new template in `src/App.tsx`:
1. Import the new template at the top of `App.tsx`.
2. Find the `renderPortfolioContent` function in `App.tsx` and add a new case to the `switch(currentConcept)` block.
3. (Optional) Update `LayoutConcept` type in `src/types/portfolio.ts` if a new concept ID was introduced.

## 5. Verification
- After implementing, check if the component renders successfully.
- Verify that clicking a project triggers the `onProjectClick` callback correctly.
