import { MetadataRoute } from 'next';
import { withBasePath } from '@/lib/site-config';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'InterviewHub PRO - Master Technical Interview Question Bank',
    short_name: 'InterviewHub',
    description: '4,300+ production-tested questions across 64 specialized tracks: TypeScript, Angular, React, Next.js, Vue, Nuxt, Svelte, Astro, Go, Rust, Java, Spring Boot, C#, ASP.NET Core, PHP, Laravel, Swift, iOS, Kotlin, Android, Mobile, Testing & SRE, Networking, Linux, SOLID, Design Patterns, Data Engineering, Cloud, and more.',
    start_url: withBasePath('/'),
    display: 'standalone',
    background_color: '#090a0f',
    theme_color: '#7c3aed',
    icons: [
      {
        src: withBasePath('/icon.svg'),
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}

