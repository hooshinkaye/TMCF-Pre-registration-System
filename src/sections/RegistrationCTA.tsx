import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Lock, Zap } from 'lucide-react';

interface RegistrationCTAProps {
  onRegister: () => void;
}

export function RegistrationCTA({ onRegister }: RegistrationCTAProps) {
  const benefits = [
    { icon: Clock, text: '5 minutes to complete', accent: 'text-blue-600' },
    { icon: Lock, text: 'Your data is secure', accent: 'text-purple-600' },
    { icon: Zap, text: 'Instant confirmation', accent: 'text-orange-600' },
    { icon: CheckCircle2, text: '100% free to join', accent: 'text-green-600' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <section className="relative w-full py-16 sm:py-20 bg-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-40" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-pink-100 to-orange-100 rounded-full blur-3xl opacity-40" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-blue-100/80 backdrop-blur mb-4">
              <span className="text-sm font-semibold text-blue-600">Ready to Join?</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-6 leading-tight">
              Start Your Application in Seconds
            </h2>

            <p className="text-lg text-slate-600 mb-8">
              Our streamlined registration process is designed for you. Quick, easy, and completely free. Get started today and take the first step toward your future.
            </p>

            {/* Benefits Grid */}
            <motion.div
              className="grid grid-cols-2 gap-4 mb-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
            >
              {benefits.map((benefit, idx) => {
                const Icon = benefit.icon;
                return (
                  <motion.div key={idx} variants={itemVariants} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <Icon className={`w-5 h-5 ${benefit.accent}`} />
                    </div>
                    <p className="text-sm font-medium text-slate-700">{benefit.text}</p>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* CTA Button */}
            <motion.button
              onClick={onRegister}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary rounded-xl text-lg px-8 py-4 w-full sm:w-auto shadow-lg hover:shadow-xl"
            >
              <span>Start Registration</span>
              <Zap className="w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* Right: Visual */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Floating cards */}
            <div className="relative h-96 sm:h-[450px]">
              {/* Card 1 */}
              <motion.div
                className="glass-card absolute top-0 left-0 right-0 mx-auto w-full max-w-xs"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600" />
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Step 1</p>
                    <p className="text-xs text-slate-500">Tell us about yourself</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-2 bg-blue-200 rounded-full" />
                  <div className="w-8 h-2 bg-slate-200 rounded-full" />
                  <div className="w-8 h-2 bg-slate-200 rounded-full" />
                </div>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                className="glass-card absolute top-32 left-1/2 -translate-x-1/2 w-full max-w-xs"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600" />
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Step 2</p>
                    <p className="text-xs text-slate-500">Choose your program</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-2 bg-blue-200 rounded-full" />
                  <div className="w-8 h-2 bg-purple-200 rounded-full" />
                  <div className="w-8 h-2 bg-slate-200 rounded-full" />
                </div>
              </motion.div>

              {/* Card 3 */}
              <motion.div
                className="glass-card absolute bottom-0 right-0 w-full max-w-xs"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600" />
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Step 3</p>
                    <p className="text-xs text-slate-500">Complete & submit</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-2 bg-blue-200 rounded-full" />
                  <div className="w-8 h-2 bg-purple-200 rounded-full" />
                  <div className="w-8 h-2 bg-green-200 rounded-full" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
