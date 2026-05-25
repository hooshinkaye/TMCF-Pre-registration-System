import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, GraduationCap } from 'lucide-react';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface NavbarProps {
  onRegisterClick: () => void;
}

export function Navbar({ onRegisterClick }: NavbarProps) {
  const { isScrolled } = useScrollPosition();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const scrollToSection = (id: string) => {
    if (!isHome) return;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMobileOpen(false);
    }
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-[#F0EEEA]'
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isScrolled ? 'bg-[#0B1F3F]' : 'bg-white/20'}`}>
            <GraduationCap className={`w-5 h-5 ${isScrolled ? 'text-[#D4A843]' : 'text-white'}`} />
          </div>
          <span className={`font-bold text-lg tracking-tight transition-colors ${isScrolled ? 'text-[#0B1F3F]' : 'text-white'}`}>
            TMCFI
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {isHome ? (
            <>
              <button
                onClick={() => scrollToSection('home')}
                className={`text-sm font-medium transition-colors hover:text-[#D4A843] ${isScrolled ? 'text-gray-600' : 'text-white/90'}`}
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('programs')}
                className={`text-sm font-medium transition-colors hover:text-[#D4A843] ${isScrolled ? 'text-gray-600' : 'text-white/90'}`}
              >
                Programs
              </button>
            </>
          ) : (
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-[#D4A843] ${isScrolled ? 'text-gray-600' : 'text-white/90'}`}
            >
              Home
            </Link>
          )}
          <Link
            to="/schedule"
            className={`text-sm font-medium transition-colors hover:text-[#D4A843] ${isScrolled ? 'text-gray-600' : 'text-white/90'}`}
          >
            View Schedule
          </Link>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <button
            onClick={onRegisterClick}
            className="bg-[#D4A843] hover:bg-[#C49A3A] text-[#0B1F3F] text-sm font-semibold px-5 py-2.5 rounded-full transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            Register
          </button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="md:hidden">
            <button className={`p-2 ${isScrolled ? 'text-[#0B1F3F]' : 'text-white'}`}>
              <Menu className="w-6 h-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] bg-white p-6">
            <div className="flex flex-col gap-6 mt-8">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="text-gray-600 hover:text-[#0B1F3F] font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                to="/schedule"
                onClick={() => setMobileOpen(false)}
                className="text-gray-600 hover:text-[#0B1F3F] font-medium transition-colors"
              >
                View Schedule
              </Link>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onRegisterClick();
                }}
                className="bg-[#D4A843] hover:bg-[#C49A3A] text-[#0B1F3F] font-semibold px-5 py-3 rounded-full transition-all w-full"
              >
                Register Now
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.nav>
  );
}
