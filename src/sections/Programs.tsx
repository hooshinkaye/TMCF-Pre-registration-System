import { GraduationCap, BookOpen, Shield, Laptop, UtensilsCrossed, Code } from 'lucide-react';
import { ProgramCard } from '@/components/ProgramCard';
import { ScrollReveal } from '@/components/ScrollReveal';

const programs = [
  { icon: GraduationCap, title: 'K-12 Education', description: 'Kindergarten to Senior High School with complete academic tracks and quality foundational learning.' },
  { icon: BookOpen, title: 'BEED', description: 'Bachelor of Elementary Education — train to shape young minds as a professional educator.' },
  { icon: Shield, title: 'BSCRIM', description: 'Bachelor of Science in Criminology — build a career in law enforcement and criminal justice.' },
  { icon: Laptop, title: 'BSIT', description: 'Bachelor of Science in Information Technology — master the digital tools of the modern world.' },
  { icon: UtensilsCrossed, title: 'BSHM', description: 'Bachelor of Science in Hospitality Management — lead in hotels, restaurants, and tourism.' },
  { icon: Code, title: 'BSCS', description: 'Bachelor of Science in Computer Science — dive deep into algorithms, systems, and software engineering.' },
];

export function Programs() {
  return (
    <section id="programs" className="bg-white py-20 lg:py-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <ScrollReveal className="text-center mb-12">
          <p className="text-[11px] font-bold text-[#D4A843] uppercase tracking-[2px] mb-3">
            Academic Offerings
          </p>
          <h2 className="text-3xl lg:text-[40px] font-bold text-[#0B1F3F] leading-tight mb-3">
            Programs That Prepare You
          </h2>
          <p className="text-gray-400 max-w-md mx-auto">
            From K-12 to college degree programs, we build futures.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, i) => (
            <ProgramCard
              key={program.title}
              icon={program.icon}
              title={program.title}
              description={program.description}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
