import { motion } from 'framer-motion';
import { ScrollReveal } from '@/components/ScrollReveal';

interface RegistrationCTAProps {
  onRegister: () => void;
}

export function RegistrationCTA({ onRegister }: RegistrationCTAProps) {
  return (
    <section className="bg-[#F8F6F1] py-20 lg:py-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Image */}
          <ScrollReveal direction="left" className="flex-shrink-0 w-full lg:w-[400px]">
            <motion.img
              src="/graduation-illustration.jpg"
              alt="Students celebrating graduation"
              className="w-full rounded-2xl shadow-lg"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            />
          </ScrollReveal>

          {/* Content */}
          <ScrollReveal direction="right" className="flex-1 text-center lg:text-left">
            <h2 className="text-3xl lg:text-[40px] font-bold text-[#0B1F3F] leading-tight mb-4">
              Ready to Begin?
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed max-w-md mx-auto lg:mx-0">
              Complete our online pre-registration to secure your slot for the upcoming semester. Join thousands of students who have started their journey with TMCFI.
            </p>
            <button
              onClick={onRegister}
              className="bg-[#0B1F3F] hover:bg-[#16325B] text-white font-semibold px-8 py-3.5 rounded-full transition-all hover:-translate-y-0.5 hover:shadow-lg inline-flex items-center gap-2"
            >
              Start Pre-Registration
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
