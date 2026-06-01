import { motion } from 'framer-motion';
import { ScrollReveal } from '@/components/ScrollReveal';
import { CheckCircle2 } from 'lucide-react';

interface RegistrationCTAProps {
  onRegister: () => void;
}

export function RegistrationCTA({ onRegister }: RegistrationCTAProps) {
  const benefits = [
    'Secure your slot for the upcoming semester',
    'Join thousands of successful students',
    'Quick and easy online process',
    '24/7 access to your registration status'
  ];

  return (
    <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 lg:py-28 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <ScrollReveal direction="left">
            <div>
              <span className="inline-block px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-semibold mb-6">
                Simple Process
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
                Ready to Take the Next Step?
              </h2>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                Our streamlined pre-registration process takes just minutes to complete. Secure your spot for the upcoming semester and begin your journey toward academic excellence.
              </p>

              <div className="space-y-4 mb-10">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                    <span className="text-slate-200">{benefit}</span>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={onRegister}
                className="px-10 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all hover:-translate-y-1 inline-flex items-center gap-2"
              >
                Start Pre-Registration Now
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </ScrollReveal>

          {/* Right side - Image/Visual */}
          <ScrollReveal direction="right">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl blur-2xl" />
              <img
                src="/graduation-illustration.jpg"
                alt="Students celebrating graduation"
                className="relative w-full rounded-2xl shadow-2xl border border-slate-700/50"
              />
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
