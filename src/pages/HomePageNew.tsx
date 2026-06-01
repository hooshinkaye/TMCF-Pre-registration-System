import { motion } from 'framer-motion';
import { ChevronRight, GraduationCap, Users, Award, Globe } from 'lucide-react';
import { HeroNew } from '@/sections/HeroNew';
import { SiteFooter } from '@/components/SiteFooter';

interface HomePageNewProps {
  onRegister: () => void;
  onLogin: () => void;
}

export function HomePageNew({ onRegister, onLogin }: HomePageNewProps) {
  void onLogin;

  return (
    <>
      {/* Hero Section */}
      <HeroNew onRegisterClick={onRegister} />

      {/* Programs Section */}
      <ProgramsNew onRegister={onRegister} />

      {/* About Section */}
      <AboutSection onRegister={onRegister} />

      {/* Testimonials Section */}
      <TestimonialsSection />

      <SiteFooter />
    </>
  );
}

// New Programs Section
function ProgramsNew({ onRegister }: { onRegister: () => void }) {
  const programs = [
    {
      icon: GraduationCap,
      title: 'Bachelor of Science in Information Technology',
      description: 'Master cutting-edge technology and prepare for the digital future',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Users,
      title: 'Bachelor of Science in Criminology',
      description: 'Develop critical thinking and forensic expertise',
      color: 'from-slate-500 to-slate-600',
      bgColor: 'bg-slate-50',
    },
    {
      icon: Award,
      title: 'Bachelor of Science in Hospitality Management',
      description: 'Lead in the dynamic hospitality and tourism industry',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      icon: Globe,
      title: 'Bachelor of Education',
      description: 'Shape minds and inspire the next generation',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: GraduationCap,
      title: 'K-12 Programs',
      description: 'Junior High School and Senior High School curriculum tracks',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      curriculum: ['Junior High School', 'SHS Academic Track', 'SHS TVL Track', 'Arts and Design'],
    },
    {
      icon: Award,
      title: 'Bachelor of Science in Computer Science',
      description: 'Become a computer science professional',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
    },
  ];

  return (
    <section id="programs" className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-4">
            Our Programs
          </h2>
          <p className="text-lg text-slate-600">
            Explore our diverse range of academic programs designed to prepare you for success
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((prog, idx) => {
            const Icon = prog.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                whileHover={{ y: -4 }}
                className={`p-8 rounded-2xl ${prog.bgColor} border border-white/50 shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer hover:-translate-y-1`}
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${prog.color} text-white mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{prog.title}</h3>
                <p className="text-slate-600 mb-4">{prog.description}</p>
                {prog.curriculum && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {prog.curriculum.map((item) => (
                      <span key={item} className="rounded-full bg-white px-3 py-1 text-xs font-bold text-purple-700 shadow-sm">
                        {item}
                      </span>
                    ))}
                  </div>
                )}
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 group-hover:gap-3 transition-all">
                  Learn More
                  <ChevronRight className="w-4 h-4" />
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.15 }}
        >
          <button onClick={onRegister} className="btn btn-primary rounded-lg">
            Explore All Programs
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

// New About Section
function AboutSection({ onRegister }: { onRegister: () => void }) {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Image/Placeholder */}
          <motion.div
            className="relative h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <img src="/campus-front.png" alt="JAQ National Colleges campus" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 to-transparent" />
            <p className="absolute bottom-6 left-6 text-lg font-bold text-white">JAQ National Colleges</p>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6">
              About J.A.Q edu hub
            </h2>
            <p className="text-lg text-slate-600 mb-6">
              JAQ National Colleges is committed to providing world-class education that transforms lives and empowers students to achieve their dreams.
            </p>
            <ul className="space-y-4 mb-8">
              {[
                'Experienced faculty with industry expertise',
                'State-of-the-art facilities and technology',
                'Personalized academic support and mentoring',
                'Strong alumni network and career opportunities',
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold mt-0.5">
                    ✓
                  </div>
                  <span className="text-slate-700 font-medium">{item}</span>
                </li>
              ))}
            </ul>
            <button onClick={onRegister} className="btn btn-primary rounded-lg">
              Get Started Today
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Testimonials Section
function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Maria Santos',
      program: 'BSIT Student',
      quote: 'JAQ National Colleges has given me the skills and confidence to pursue my career in tech.',
      avatar: '👩‍🎓',
    },
    {
      name: 'Juan Dela Cruz',
      program: 'BSCRIM Graduate',
      quote: 'The education I received here prepared me well for my professional career.',
      avatar: '👨‍🎓',
    },
    {
      name: 'Anna Mercado',
      program: 'BSHM Student',
      quote: 'Incredible faculty, amazing facilities, and supportive community!',
      avatar: '👩‍🎓',
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-4">
            What Students Say
          </h2>
          <p className="text-lg text-slate-600">
            Hear from our students about their journey at JAQ
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              whileHover={{ y: -3 }}
              className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">{testimonial.avatar}</div>
                <div>
                  <p className="font-bold text-slate-900">{testimonial.name}</p>
                  <p className="text-sm text-slate-600">{testimonial.program}</p>
                </div>
              </div>
              <p className="text-slate-700 italic">"{testimonial.quote}"</p>
              <div className="flex gap-1 mt-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

