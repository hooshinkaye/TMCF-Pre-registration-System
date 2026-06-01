import { GraduationCap, BookOpen, Shield, Laptop, UtensilsCrossed, Code } from 'lucide-react';
import { motion } from 'framer-motion';

const programs = [
  { icon: GraduationCap, title: 'K-12 Education', description: 'Build your foundation with exceptional K-12 programs', color: 'from-red-400 to-red-600', lightColor: 'bg-red-100' },
  { icon: BookOpen, title: 'BEED', description: 'Become an inspiring educator', color: 'from-orange-400 to-orange-600', lightColor: 'bg-orange-100' },
  { icon: Shield, title: 'BSCRIM', description: 'Lead in law enforcement & justice', color: 'from-yellow-400 to-yellow-600', lightColor: 'bg-yellow-100' },
  { icon: Laptop, title: 'BSIT', description: 'Master modern technology & innovation', color: 'from-green-400 to-green-600', lightColor: 'bg-green-100' },
  { icon: UtensilsCrossed, title: 'BSHM', description: 'Excel in hospitality & tourism', color: 'from-blue-400 to-blue-600', lightColor: 'bg-blue-100' },
  { icon: Code, title: 'BSCS', description: 'Engineer the future with code', color: 'from-purple-400 to-purple-600', lightColor: 'bg-purple-100' },
];

export function Programs() {
  return (
    <section id="programs" className="bg-gradient-to-b from-white to-orange-50 py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl lg:text-6xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600">
            Choose Your Passion
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Six world-class programs designed to launch your career and unlock your potential
          </p>
        </motion.div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, i) => {
            const Icon = program.icon;
            return (
              <motion.div
                key={program.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                className="group relative bg-white rounded-3xl p-8 border-2 border-gray-100 hover:border-gray-200 transition-all"
              >
                {/* Background accent */}
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${program.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />

                {/* Icon */}
                <motion.div
                  className={`w-16 h-16 rounded-2xl ${program.lightColor} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
                >
                  <Icon className={`w-8 h-8 text-transparent bg-clip-text bg-gradient-to-r ${program.color}`} />
                </motion.div>

                {/* Title */}
                <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-pink-600 transition-all">
                  {program.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed">{program.description}</p>

                {/* CTA Link */}
                <motion.div
                  className={`inline-flex items-center gap-2 font-bold text-transparent bg-clip-text bg-gradient-to-r ${program.color}`}
                  whileHover={{ gap: 12 }}
                >
                  Learn More
                  <motion.span whileHover={{ x: 5 }}>→</motion.span>
                </motion.div>

                {/* Number badge */}
                <div className={`absolute top-6 right-6 w-10 h-10 rounded-full bg-gradient-to-br ${program.color} flex items-center justify-center text-white font-black text-sm opacity-20 group-hover:opacity-100 transition-opacity`}>
                  {i + 1}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-gray-700 mb-4">Ready to find your perfect program?</p>
          <button className="px-10 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-orange-500/40 transition-all hover:scale-105">
            Explore All Programs
          </button>
        </motion.div>
      </div>
    </section>
  );
}
