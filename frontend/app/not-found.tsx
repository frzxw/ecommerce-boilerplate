import Link from 'next/link';
import { Navbar } from '@/components/ui/Navbar';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <h1 className="text-9xl font-black tracking-tighter mb-4">404</h1>
        <h2 className="text-2xl font-bold uppercase tracking-widest mb-8">Page Not Found</h2>
        <p className="text-gray-500 mb-12 text-center max-w-md">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link 
          href="/" 
          className="px-8 py-4 bg-black text-white text-sm font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
