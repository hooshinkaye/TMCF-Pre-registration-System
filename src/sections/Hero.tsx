import { motion } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';

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
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden"
    >
      {/* Minimalist abstract elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-slate-700/20 to-transparent rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Subtitle badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 inline-block"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium">
            Welcome to Excellence
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6"
        >
          Your Future <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Starts Here</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
          className="text-lg sm:text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Join Tan Ting Bing Memorial Colleges Foundation and unlock your potential with world-class education and exceptional opportunities.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <button
            onClick={onRegister}
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all hover:-translate-y-1 flex items-center gap-2"
          >
            Start Your Journey
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={onLogin}
            className="px-8 py-4 border border-slate-500/30 text-white font-semibold rounded-lg hover:bg-slate-700/50 transition-all flex items-center gap-2"
          >
            Student Portal
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-16"
        >
          <div className="text-center">
            <p className="text-3xl font-bold text-white mb-1">6+</p>
            <p className="text-sm text-slate-400">Degree Programs</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white mb-1">2000+</p>
            <p className="text-sm text-slate-400">Active Students</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white mb-1">25+</p>
            <p className="text-sm text-slate-400">Years Legacy</p>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToPrograms}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-400 hover:text-white transition-colors"
      >
        <ChevronDown className="w-6 h-6 animate-bounce" />
      </motion.button>
    </section>
  );
}
