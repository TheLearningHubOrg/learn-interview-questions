import { NextResponse } from 'next/server';
import { getGlobalSearchIndex } from '@/lib/tracks';

export const dynamic = 'force-static';
export const revalidate = 86400; // 24 hours

export async function GET() {
  const items = await getGlobalSearchIndex();
  return NextResponse.json(items, {
    headers: {
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    },
  });
}

