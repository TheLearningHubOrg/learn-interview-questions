import { MetadataRoute } from 'next';
import { TRACKS, getTrackQuestions } from '@/lib/tracks';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://learn-interview-questions.vercel.app';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  const trackRoutes: MetadataRoute.Sitemap = TRACKS.map((t) => ({
    url: `${baseUrl}/sections/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  const questionRoutes: MetadataRoute.Sitemap = [];
  for (const track of TRACKS) {
    const questions = await getTrackQuestions(track.slug);
    for (const q of questions) {
      questionRoutes.push({
        url: `${baseUrl}/sections/${track.slug}/${q.number}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  return [...staticRoutes, ...trackRoutes, ...questionRoutes];
}

