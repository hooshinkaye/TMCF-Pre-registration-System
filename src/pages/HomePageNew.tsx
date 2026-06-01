import { Facebook, Instagram, Mail, MapPin, Phone, ChevronRight, GraduationCap, Users, Award, Globe } from 'lucide-react';
import { HeroNew } from '@/sections/HeroNew';

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

      {/* New Footer - No Reuse */}
      <FooterNew />
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
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-4">
            Our Programs
          </h2>
          <p className="text-lg text-slate-600">
            Explore our diverse range of academic programs designed to prepare you for success
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((prog, idx) => {
            const Icon = prog.icon;
            return (
              <div
                key={idx}
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
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <button onClick={onRegister} className="btn btn-primary rounded-lg">
            Explore All Programs
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
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
          <div className="relative h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
            <div className="text-center text-white">
              <GraduationCap className="w-32 h-32 mx-auto opacity-30 mb-4" />
              <p className="text-lg font-semibold">JAQ National Colleges</p>
            </div>
          </div>

          {/* Right: Content */}
          <div>
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
          </div>
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
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-4">
            What Students Say
          </h2>
          <p className="text-lg text-slate-600">
            Hear from our students about their journey at JAQ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// New Footer - Completely Different
function FooterNew() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
              <GraduationCap className="w-6 h-6" />
              J.A.Q
            </h3>
            <p className="text-sm leading-relaxed">
              JAQ National Colleges - Empowering students through quality education and innovation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Programs</a></li>
              <li><a href="#" className="hover:text-white transition">Admissions</a></li>
              <li><a href="#" className="hover:text-white transition">About Us</a></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4">Contact Info</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>(063) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@jaq.edu.ph</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>Northern Samar, Philippines</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-bold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-white transition p-2 rounded-lg bg-slate-800 hover:bg-slate-700">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition p-2 rounded-lg bg-slate-800 hover:bg-slate-700">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition p-2 rounded-lg bg-slate-800 hover:bg-slate-700">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>&copy; 2024 JAQ National Colleges. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
