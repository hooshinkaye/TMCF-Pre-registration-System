import { GraduationCap, BookOpen, Shield, Laptop, UtensilsCrossed, Code, ArrowRight } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { motion } from 'framer-motion';

const programs = [
  { icon: GraduationCap, title: 'K-12 Education', description: 'Complete academic foundation from Kindergarten to Senior High School with exceptional faculty and modern facilities.' },
  { icon: BookOpen, title: 'Bachelor of Elementary Education', description: 'Become an inspiring educator who shapes the future generation with innovative teaching methodologies.' },
  { icon: Shield, title: 'Bachelor of Science in Criminology', description: 'Pursue a career in law enforcement and criminal justice with comprehensive training and practical experience.' },
  { icon: Laptop, title: 'Bachelor of Science in Information Technology', description: 'Master cutting-edge technologies and become a tech leader in the digital transformation era.' },
  { icon: UtensilsCrossed, title: 'Bachelor of Science in Hospitality Management', description: 'Lead in the hospitality industry with world-class training in management and customer excellence.' },
  { icon: Code, title: 'Bachelor of Science in Computer Science', description: 'Dive into advanced algorithms, software engineering, and cutting-edge system design principles.' },
];

export function Programs() {
  return (
    <section id="programs" className="bg-slate-50 py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ScrollReveal className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-4">
            Our Academic Programs
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-4">
            Choose Your Path to Success
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explore our comprehensive range of programs designed to prepare you for a rewarding career and personal growth.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, i) => {
            const Icon = program.icon;
            return (
              <ScrollReveal key={program.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ translateY: -8 }}
                  className="group bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100"
                >
                  <div className="mb-4 inline-block p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg group-hover:from-blue-100 group-hover:to-cyan-100 transition-colors">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{program.title}</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed text-sm">
                    {program.description}
                  </p>
                  <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
                    Learn more
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
