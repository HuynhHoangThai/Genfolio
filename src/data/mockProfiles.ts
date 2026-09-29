import { MockProfile } from '../types/portfolio';

export const TECH_DEV_PROFILE: MockProfile = {
  id: 'tech-dev-profile',
  industry: 'tech-dev',
  fullName: 'Alex Code',
  title: 'Senior Software Engineer',
  tagline: 'Building scalable microservices and blazing-fast frontends.',
  bio: 'Passionate about clean architecture, performance optimization, and creating seamless user experiences. Specializing in the modern React ecosystem and distributed Go services.',
  email: 'alex@code.io',
  phone: '+1 234 567 8900',
  location: 'San Francisco, CA',
  socials: { github: 'https://github.com/alexcode', linkedin: 'https://linkedin.com/in/alexcode' },
  metrics: [
    { value: '10+', label: 'Years Experience' },
    { value: '45+', label: 'Apps Deployed' },
    { value: '99.9%', label: 'Uptime' },
    { value: '1M+', label: 'Users Reached' },
  ],
  skills: [
    { name: 'React/Next.js', level: 98, category: 'Frontend', highlight: true },
    { name: 'TypeScript', level: 95, category: 'Frontend', highlight: true },
    { name: 'Go', level: 85, category: 'Backend', highlight: true },
    { name: 'PostgreSQL', level: 88, category: 'Database', highlight: true },
  ],
  projects: [],
  experiences: [],
  education: [],
  testimonials: [],
};

export const TECH_DEVOPS_PROFILE: MockProfile = {
  id: 'tech-devops-profile',
  industry: 'tech-devops',
  fullName: 'Sarah Ops',
  title: 'Cloud Infrastructure Architect',
  tagline: 'Automating everything from commit to deployment.',
  bio: 'Ensuring absolute reliability and massive scale through Infrastructure as Code and zero-downtime CI/CD pipelines.',
  email: 'sarah@ops.io',
  phone: '+1 987 654 3210',
  location: 'Remote',
  socials: { github: 'https://github.com/sarahops', linkedin: 'https://linkedin.com/in/sarahops' },
  metrics: [
    { value: '100%', label: 'IaC Coverage' },
    { value: '5min', label: 'Deploy Time' },
    { value: '99.99%', label: 'SLA' },
    { value: '500+', label: 'Nodes Managed' },
  ],
  skills: [
    { name: 'Kubernetes', level: 96, category: 'Orchestration', highlight: true },
    { name: 'Terraform', level: 95, category: 'IaC', highlight: true },
    { name: 'AWS', level: 98, category: 'Cloud', highlight: true },
    { name: 'GitHub Actions', level: 90, category: 'CI/CD', highlight: true },
  ],
  projects: [],
  experiences: [],
  education: [],
  testimonials: [],
};

export const MOCK_PROFILES_MAP: Record<string, MockProfile> = {
  'tech-dev': TECH_DEV_PROFILE,
  'tech-devops': TECH_DEVOPS_PROFILE,
  'tech-uiux': TECH_DEV_PROFILE,
  'tech-sec': TECH_DEVOPS_PROFILE,
  'tech-data': TECH_DEV_PROFILE,
};
