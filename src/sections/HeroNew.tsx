import { motion } from 'framer-motion';
import { ChevronRight, BookOpen, Users, Zap, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface HeroNewProps {
  onRegisterClick: () => void;
}

export function HeroNew({ onRegisterClick }: HeroNewProps) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section id="home" className="relative overflow-hidden pt-24 sm:pt-32 lg:pt-40 pb-16 sm:pb-20 lg:pb-24">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 -z-10" />
      
      {/* Decorative blurred circles */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-20 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/60 backdrop-blur-sm border border-blue-200/50">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-900">Join 5000+ Students Transforming Their Future</span>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-center mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Your Future Starts Today
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            Join JAQ National Colleges and unlock world-class education designed for student success. Pre-register now for the semester ahead.
          </p>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: BookOpen,
                title: 'Learn',
                desc: 'World-class education with cutting-edge curriculum',
                color: 'from-blue-500 to-blue-600',
              },
              {
                icon: Users,
                title: 'Connect',
                desc: 'Build lasting connections with diverse communities',
                color: 'from-purple-500 to-purple-600',
              },
              {
                icon: Zap,
                title: 'Grow',
                desc: 'Develop skills that lead to career success',
                color: 'from-pink-500 to-pink-600',
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  onMouseEnter={() => setHoveredCard(idx)}
                  onMouseLeave={() => setHoveredCard(null)}
                  whileHover={{ y: -4 }}
                  className="group relative transition-transform duration-300 hover:-translate-y-1"
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
                  
                  {/* Card */}
                  <div className="relative p-8 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
                    {/* Icon */}
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-4`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                    
                    {/* Description */}
                    <p className="text-slate-600 mb-4">{feature.desc}</p>
                    
                    {/* Hover indicator */}
                    <div className={`inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 ${
                      hoveredCard === idx ? 'text-blue-600 gap-3' : 'text-slate-600'
                    }`}>
                      Learn More
                      <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${
                        hoveredCard === idx ? 'translate-x-1' : ''
                      }`} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={onRegisterClick}
              className="btn btn-primary rounded-lg w-full sm:w-auto group"
            >
              <span>Start Pre-Registration</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              className="btn btn-secondary rounded-lg w-full sm:w-auto"
            >
              Learn About Programs
            </button>
          </div>

          {/* Trust Signals */}
          <div className="text-center space-y-3 pt-8 border-t border-white/20">
            <p className="text-sm text-slate-600 font-medium">Why Choose J.A.Q?</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>100% Free Registration</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Instant Confirmation</span>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="flex justify-center mt-16 animate-bounce-gentle">
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-2">Scroll to explore</p>
              <ChevronRight className="w-5 h-5 text-slate-400 mx-auto rotate-90" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
