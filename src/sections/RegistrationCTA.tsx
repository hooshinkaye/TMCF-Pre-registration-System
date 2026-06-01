import { motion } from 'framer-motion';
import { CheckCircle2, Zap } from 'lucide-react';

interface RegistrationCTAProps {
  onRegister: () => void;
}

export function RegistrationCTA({ onRegister }: RegistrationCTAProps) {
  const highlights = [
    'Instant confirmation & status tracking',
    'Mobile-friendly registration form',
    'Secure & encrypted submission',
    'Personalized program recommendations'
  ];

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-400 to-pink-400 opacity-10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-purple-400 to-pink-400 opacity-10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-100 to-pink-100 border border-orange-200 mb-6">
              <Zap className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-semibold text-orange-900">Fast & Easy</span>
            </div>

            <h2 className="text-5xl lg:text-6xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-red-500 to-pink-600">
              Ready to Start?
            </h2>

            <p className="text-xl text-gray-700 mb-10 leading-relaxed">
              Complete your pre-registration in just minutes. It's simple, secure, and gets you one step closer to your dream education.
            </p>

            {/* Highlights */}
            <div className="space-y-4 mb-10">
              {highlights.map((highlight, index) => (
                <motion.div
                  key={highlight}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">{highlight}</span>
                </motion.div>
              ))}
            </div>

            {/* Primary CTA */}
            <motion.button
              onClick={onRegister}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl transition-all"
            >
              Begin Pre-Registration
            </motion.button>
          </motion.div>

          {/* Right: Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative"
          >
            <div className="relative w-full aspect-square">
              {/* Floating info cards */}
              <motion.div
                animate={{ y: [0, -30, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute top-10 left-0 w-56 bg-white rounded-3xl p-6 shadow-xl border-2 border-orange-100"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-black">
                    ✓
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Application</p>
                    <p className="text-lg font-black text-gray-900">Fast Process</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Complete in minutes</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, 30, 0] }}
                transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                className="absolute bottom-20 right-0 w-56 bg-white rounded-3xl p-6 shadow-xl border-2 border-pink-100"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white font-black">
                    📧
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Confirmation</p>
                    <p className="text-lg font-black text-gray-900">Instant Email</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Right to your inbox</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                className="absolute top-1/3 right-1/4 w-56 bg-white rounded-3xl p-6 shadow-xl border-2 border-purple-100"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-black">
                    🎓
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Next Step</p>
                    <p className="text-lg font-black text-gray-900">Your Future</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Starts with one click</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
