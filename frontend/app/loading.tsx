export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
