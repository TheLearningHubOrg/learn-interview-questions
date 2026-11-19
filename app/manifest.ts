import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'InterviewHub PRO - Master Technical Interview Question Bank',
    short_name: 'InterviewHub',
    description: '3,600+ production-tested questions across 64 specialized tracks: TypeScript, Angular, React, Next.js, Vue, Nuxt, Svelte, Astro, Go, Rust, Java, Spring Boot, C#, ASP.NET Core, PHP, Laravel, Swift, iOS, Kotlin, Android, Mobile, Testing & SRE, Networking, Linux, SOLID, Design Patterns, Data Engineering, Cloud, and more.',
    start_url: '/',
    display: 'standalone',
    background_color: '#090a0f',
    theme_color: '#7c3aed',
    icons: [
      {
        src: '/icon',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}

