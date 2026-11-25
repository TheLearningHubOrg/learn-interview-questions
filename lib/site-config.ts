export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/+$/, '');

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://learn-interview-questions.vercel.app'
).replace(/\/+$/, '');

export const IS_GITHUB_PAGES = process.env.NEXT_PUBLIC_GITHUB_PAGES === 'true';

/** Prefix a root-relative path with the configured basePath for subpath hosting. */
export function withBasePath(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_PATH}${normalized}`;
}
