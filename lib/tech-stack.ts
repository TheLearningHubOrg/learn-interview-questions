import { TRACKS, TrackMeta } from './tracks-meta';

export const TECH_STACK_STORAGE_KEY = 'interviewhub_selected_techs';
export const TECH_STACK_UPDATE_EVENT = 'interviewhub-tech-stack-update';

export interface RolePreset {
  id: string;
  label: string;
  icon: string;
  description: string;
  techSlugs: string[];
}

export const ROLE_PRESETS: RolePreset[] = [
  {
    id: 'fullstack-js',
    label: 'Full-Stack JavaScript (MERN/PERN)',
    icon: '🚀',
    description: 'React, Node.js, JavaScript, Databases & System Design',
    techSlugs: ['react-nextjs', 'javascript', 'nodejs', 'databases', 'system-design'],
  },
  {
    id: 'angular-enterprise',
    label: 'Enterprise Angular Architect',
    icon: '🅰️',
    description: 'Angular 19, TypeScript/JS, Web Security & System Design',
    techSlugs: ['angular-ts', 'javascript', 'web-security-owasp', 'system-design'],
  },
  {
    id: 'backend-python',
    label: 'Backend Python & Cloud',
    icon: '🐍',
    description: 'Python & FastAPI, Databases, AWS Cloud & System Design',
    techSlugs: ['python', 'databases', 'aws', 'system-design'],
  },
  {
    id: 'devops-sre',
    label: 'DevOps, SRE & Cloud Native',
    icon: '☁️',
    description: 'Docker/Kubernetes, AWS Cloud, Web Security & System Design',
    techSlugs: ['devops-kubernetes', 'aws', 'web-security-owasp', 'system-design'],
  },
  {
    id: 'ai-engineer',
    label: 'AI & LLM Systems Engineer',
    icon: '🤖',
    description: 'AI Engineering/RAG, Python, Databases & System Design',
    techSlugs: ['ai-engineering-llm', 'python', 'databases', 'system-design'],
  },
  {
    id: 'coding-core',
    label: 'Live Coding & Algorithms',
    icon: '⚡',
    description: 'DSA Patterns, JavaScript Internals & Behavioral STAR',
    techSlugs: ['dsa', 'javascript', 'behavioral-hr'],
  },
];

export function getSelectedTechSlugs(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(TECH_STACK_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function setSelectedTechSlugs(slugs: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TECH_STACK_STORAGE_KEY, JSON.stringify(slugs));
    window.dispatchEvent(new Event(TECH_STACK_UPDATE_EVENT));
  } catch {}
}

export function toggleTechSlug(slug: string): string[] {
  const current = getSelectedTechSlugs();
  const next = current.includes(slug)
    ? current.filter((s) => s !== slug)
    : [...current, slug];
  setSelectedTechSlugs(next);
  return next;
}

export function clearSelectedTechs(): void {
  setSelectedTechSlugs([]);
}
