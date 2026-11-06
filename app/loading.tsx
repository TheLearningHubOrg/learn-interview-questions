export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center py-20">
      <div className="relative mb-5">
        <div className="h-12 w-12 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
        <div className="absolute inset-0 rounded-full blur-md bg-purple-500/20 -z-10" />
      </div>
      <p className="text-sm font-semibold text-slate-300 tracking-wide">Loading Question Bank...</p>
      <p className="text-xs text-slate-500 mt-1">Preparing master interview questions & answers</p>
    </div>
  );
}

