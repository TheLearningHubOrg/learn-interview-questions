import Link from 'next/link';
import { Home, HelpCircle, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-6 shadow-lg shadow-purple-500/5">
        <HelpCircle className="h-12 w-12" />
      </div>
      <span className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-2">404 Error</span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight">Question or Page Not Found</h1>
      <p className="text-slate-400 max-w-md mb-8 text-sm sm:text-base leading-relaxed">
        The interview question, track, or page you are looking for does not exist or has been relocated to another section.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-lg shadow-purple-600/20 transition-all hover:-translate-y-0.5"
        >
          <Home className="h-4 w-4" />
          <span>Return to All Tracks</span>
        </Link>
      </div>
    </div>
  );
}

