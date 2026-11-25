import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site-config';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_URL;
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/tracks/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

