import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'InterviewHub PRO - Master Technical Interview Question Bank',
    short_name: 'InterviewHub',
    description: '2,719+ production-tested questions across 30 specialized tracks: Go, Rust, PHP, Java, .NET, Mobile, Testing & SRE, Networking, Linux, Design Patterns, Data Engineering, Search DBs, Cloud, React, Angular, and more.',
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

