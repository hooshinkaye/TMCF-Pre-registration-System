import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroProps {
  onRegister: () => void;
  onLogin: () => void;
}

export function Hero({ onRegister, onLogin }: HeroProps) {
  const scrollToPrograms = () => {
    document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-100 to-pink-100 border border-orange-200 mb-6"
            >
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-semibold text-orange-900">New Opportunities Await</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.1] mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-red-500 to-pink-600"
            >
              Transform Your Dreams Into Reality
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-lg sm:text-xl text-gray-700 mb-8 leading-relaxed max-w-lg"
            >
              Join thousands of ambitious students at Tan Ting Bing Memorial Colleges. Quality education. Limitless potential. Your success story starts today.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <button
                onClick={onRegister}
                className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-orange-500/40 transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                Register Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onLogin}
                className="px-8 py-4 border-2 border-orange-500 text-orange-600 font-bold rounded-2xl hover:bg-orange-50 transition-all"
              >
                Student Login
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex gap-8"
            >
              <div>
                <p className="text-3xl font-black bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">6+</p>
                <p className="text-sm text-gray-600 font-semibold">Degree Programs</p>
              </div>
              <div>
                <p className="text-3xl font-black bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">2000+</p>
                <p className="text-sm text-gray-600 font-semibold">Happy Students</p>
              </div>
              <div>
                <p className="text-3xl font-black bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">25+</p>
                <p className="text-sm text-gray-600 font-semibold">Years Excellence</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotate: 5 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square">
              {/* Floating cards animation */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-0 left-0 w-48 h-32 bg-gradient-to-br from-orange-400 to-orange-500 rounded-3xl shadow-2xl p-6 text-white"
              >
                <p className="text-sm font-bold mb-2">Top Program</p>
                <p className="text-2xl font-black">BSIT</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                className="absolute bottom-10 right-0 w-48 h-32 bg-gradient-to-br from-pink-400 to-pink-500 rounded-3xl shadow-2xl p-6 text-white"
              >
                <p className="text-sm font-bold mb-2">Success Rate</p>
                <p className="text-2xl font-black">98%</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="absolute top-1/3 right-1/4 w-40 h-40 bg-gradient-to-br from-purple-400 to-purple-500 rounded-3xl shadow-2xl flex items-center justify-center text-white"
              >
                <div className="text-center">
                  <p className="text-4xl font-black">🎓</p>
                  <p className="text-xs font-bold mt-2">Quality Education</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-orange-600"
        >
          <p className="text-sm font-semibold">Explore Programs</p>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
