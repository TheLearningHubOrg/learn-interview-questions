'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface TrackRedirectProps {
  targetPath: string;
  trackTitle: string;
}

export function TrackRedirect({ targetPath, trackTitle }: TrackRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    router.replace(targetPath);
  }, [router, targetPath]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-sm text-muted-foreground mb-3">
        Redirecting to <span className="font-semibold text-foreground">{trackTitle}</span>...
      </p>
      <Link
        href={targetPath}
        prefetch={false}
        className="px-4 py-2 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white transition-colors"
      >
        Open Question 1 →
      </Link>
    </div>
  );
}
