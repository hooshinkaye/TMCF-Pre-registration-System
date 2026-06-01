import { motion } from 'framer-motion';
import { Sparkles, BookOpen, Users, Zap } from 'lucide-react';

interface HeroProps {
  onRegister: () => void;
  onLogin: () => void;
}

export function Hero({ onRegister, onLogin }: HeroProps) {
  const scrollToPrograms = () => {
    document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Floating cards data
  const floatingCards = [
    { icon: BookOpen, label: 'Learn', delay: 0 },
    { icon: Users, label: 'Connect', delay: 0.2 },
    { icon: Zap, label: 'Grow', delay: 0.4 },
  ];

  // Container variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-10">
      {/* Animated background elements */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center min-h-screen"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur border border-blue-100 shadow-sm">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600">Join 2000+ Students</span>
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.div variants={itemVariants} className="text-center mb-6 sm:mb-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-4">
            <span className="text-slate-900">Your Future</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Starts Today
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Join Tan Ting Bing Memorial Colleges and unlock your potential with world-class education and life-changing opportunities.
          </p>
        </motion.div>

        {/* Floating Feature Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 sm:gap-4 mb-10 w-full max-w-sm">
          {floatingCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={idx}
                className="glass-card !p-4 sm:!p-6 text-center hover:scale-105"
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 mb-3">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-sm font-semibold text-slate-900">{card.label}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 w-full max-w-sm mb-12">
          <button
            onClick={onRegister}
            className="btn btn-primary w-full sm:flex-1 rounded-lg shadow-lg hover:shadow-xl"
          >
            Register Now
            <Zap className="w-5 h-5" />
          </button>
          <button
            onClick={onLogin}
            className="btn btn-secondary w-full sm:flex-1 rounded-lg"
          >
            Student Portal
          </button>
        </motion.div>

        {/* Trust indicators */}
        <motion.div variants={itemVariants} className="text-center text-sm text-slate-500">
          <p>✓ Free to register • ✓ No credit card required • ✓ Instant access</p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.button
          onClick={scrollToPrograms}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex flex-col items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
            <span className="text-xs font-semibold uppercase tracking-wider">Explore</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </motion.button>
      </motion.div>
    </section>
  );
}
