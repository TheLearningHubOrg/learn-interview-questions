import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'InterviewHub PRO - Master Technical Interview Question Bank',
    short_name: 'InterviewHub',
    description: '1,500+ production-tested questions across Angular, React, JavaScript, Databases, Python, Node.js, AWS Cloud, and DSA.',
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

