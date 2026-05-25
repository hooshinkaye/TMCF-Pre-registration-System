import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface HeroProps {
  onRegister: () => void;
  onLogin: () => void;
}

export function Hero({ onRegister, onLogin }: HeroProps) {
  const scrollToPrograms = () => {
    document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center bg-[#0B1F3F] overflow-hidden"
    >
      {/* Geometric pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(90deg, white 0px, white 1px, transparent 1px, transparent 80px),
            repeating-linear-gradient(0deg, white 0px, white 1px, transparent 1px, transparent 80px)
          `,
        }}
      />

      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,168,67,0.08)_0%,_transparent_60%)]" />

      <div className="relative z-10 max-w-[700px] mx-auto px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-white leading-[1.1] mb-5"
        >
          Shape Your Future
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          className="text-base sm:text-lg text-gray-400 mb-8 max-w-[540px] mx-auto leading-relaxed"
        >
          Your journey toward success begins at Tan Ting Bing Memorial Colleges Foundation, Inc.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={onRegister}
            className="bg-[#D4A843] hover:bg-[#C49A3A] text-[#0B1F3F] font-bold text-base px-10 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 w-full sm:w-auto"
          >
            Register Now
          </button>
          <button
            onClick={onLogin}
            className="border-2 border-white/30 hover:bg-white hover:text-[#0B1F3F] text-white font-bold text-base px-8 py-3.5 rounded-full transition-all w-full sm:w-auto"
          >
            Student Login
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToPrograms}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 hover:text-white/70 transition-colors"
      >
        <ChevronDown className="w-6 h-6 animate-bounce-gentle" />
      </motion.button>
    </section>
  );
}
