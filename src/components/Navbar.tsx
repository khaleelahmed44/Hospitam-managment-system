import { Link } from 'react-router-dom';
import { User, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Button } from '@/components/ui/button';
import { HeartPulse, User as UserIcon, LogOut, Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar({ user }: { user: User | null }) {
  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = () => signOut(auth);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Doctors', path: '/doctors' },
    { name: 'Contact', path: '/contact' },
    { name: 'Staff', path: '/admin' },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-slate-800">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <HeartPulse className="w-5 h-5 text-white" />
          </div>
          <span className="tracking-tight">MedCore<span className="text-primary">HMS</span></span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} className="hover:text-primary transition-colors">
              {link.name}
            </Link>
          ))}
          {user && (
            <>
              <div className="h-4 w-px bg-slate-200"></div>
              <Link to="/dashboard" className="flex items-center gap-3 bg-slate-100 py-1.5 px-3 rounded-full border border-slate-200 hover:bg-slate-200 transition-colors">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-[10px] font-bold text-primary">
                  {user.displayName?.split(' ').map(n => n[0]).join('') || 'U'}
                </div>
                <span className="text-slate-700">{user.displayName || 'User'}</span>
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/book" className="hidden sm:block">
                <Button size="sm" className="rounded-xl shadow-md">Book Appointment</Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout" className="rounded-full">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button size="sm" onClick={handleLogin} className="rounded-xl px-6">Login</Button>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon">
                    <Menu className="w-6 h-6" />
                  </Button>
                }
              />
              <SheetContent side="right">
                <div className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <Link key={link.path} to={link.path} className="text-lg font-medium border-b pb-2">
                      {link.name}
                    </Link>
                  ))}
                  {user ? (
                    <>
                      <Link to="/dashboard" className="text-lg font-medium border-b pb-2">Dashboard</Link>
                      <Link to="/book" className="text-lg font-medium border-b pb-2">Book Appointment</Link>
                      <Button variant="outline" onClick={handleLogout} className="mt-4">Logout</Button>
                    </>
                  ) : (
                    <Button onClick={handleLogin} className="mt-4">Login</Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
