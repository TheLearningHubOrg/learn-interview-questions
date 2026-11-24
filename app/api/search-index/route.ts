import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://learn-interview-questions.vercel.app';
  return NextResponse.redirect(new URL('/search-index.json', baseUrl), 308);
}
