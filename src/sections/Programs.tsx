import { GraduationCap, BookOpen, Shield, Laptop, UtensilsCrossed, Code } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const programs = [
  { 
    icon: GraduationCap, 
    title: 'K-12 Education', 
    description: 'Build a strong academic foundation',
    color: 'from-blue-400 to-blue-600',
    accent: 'bg-blue-100'
  },
  { 
    icon: BookOpen, 
    title: 'Bachelor of Elementary Education', 
    description: 'Shape the next generation',
    color: 'from-purple-400 to-purple-600',
    accent: 'bg-purple-100'
  },
  { 
    icon: Shield, 
    title: 'Bachelor of Science in Criminology', 
    description: 'Serve your community with pride',
    color: 'from-red-400 to-red-600',
    accent: 'bg-red-100'
  },
  { 
    icon: Laptop, 
    title: 'Bachelor of Science in IT', 
    description: 'Master digital transformation',
    color: 'from-green-400 to-green-600',
    accent: 'bg-green-100'
  },
  { 
    icon: UtensilsCrossed, 
    title: 'Bachelor of Science in Hospitality', 
    description: 'Excel in service excellence',
    color: 'from-orange-400 to-orange-600',
    accent: 'bg-orange-100'
  },
  { 
    icon: Code, 
    title: 'Bachelor of Science in Computer Science', 
    description: 'Build the future with code',
    color: 'from-pink-400 to-pink-600',
    accent: 'bg-pink-100'
  },
];

export function Programs() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="programs" className="relative w-full py-16 sm:py-20 bg-gradient-to-b from-white to-blue-50/50 overflow-hidden">
      {/* Decorative element */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-blue-100/80 backdrop-blur mb-4">
            <span className="text-sm font-semibold text-blue-600">6 Programs Available</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-3 leading-tight">
            Choose Your Path
          </h2>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            From K-12 to specialized degrees, we have the perfect program for your journey.
          </p>
        </motion.div>

        {/* Programs Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {programs.map((program, idx) => {
            const Icon = program.icon;
            return (
              <motion.div
                key={program.title}
                variants={itemVariants}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                whileHover={{ y: -8 }}
                className="group cursor-pointer"
              >
                <div className="glass-card !p-6 sm:!p-8 h-full flex flex-col relative overflow-hidden">
                  {/* Background gradient on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${program.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                  />

                  {/* Icon container */}
                  <div className={`${program.accent} w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-slate-900" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all">
                    {program.title}
                  </h3>
                  <p className="text-slate-600 mb-6 flex-grow">
                    {program.description}
                  </p>

                  {/* CTA */}
                  <div className="inline-flex items-center gap-2 text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Learn More</span>
                    <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-12 sm:mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-slate-600 mb-4">Can't decide? Get more information about each program.</p>
          <button className="btn btn-secondary rounded-lg">
            Explore All Programs
          </button>
        </motion.div>
      </div>
    </section>
  );
}
