import { HeartPulse } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="h-14 bg-white border-t border-slate-200 flex items-center px-8 justify-between text-[11px] text-slate-400 font-bold uppercase tracking-widest">
      <div className="container mx-auto px-0 flex items-center justify-between w-full">
        <div className="flex gap-8">
          <span className="text-slate-500">&copy; 2024 MedCore Global</span>
          <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span>Health System: Active</span>
          </div>
          <span className="text-slate-200">|</span>
          <span className="hidden sm:inline">Secure Node v2.43.0</span>
        </div>
      </div>
    </footer>
  );
}
