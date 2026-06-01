import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { SchoolLogo } from '@/components/SchoolLogo';

export function SiteFooter() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <SchoolLogo
              showTagline
              className="mb-5"
              markClassName="h-14 w-14"
              textClassName="text-2xl text-white"
            />
            <p className="max-w-md text-sm leading-6 text-slate-400">
              TMCFI Enrollment Hub supports Tan Ting Bing Memorial Colleges Foundation Inc. with a student-centered pre-registration experience.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { icon: Facebook, label: 'Facebook' },
                { icon: Instagram, label: 'Instagram' },
                { icon: Mail, label: 'Email' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href="#"
                    className="grid h-10 w-10 place-items-center rounded-lg bg-white/10 text-slate-300 transition hover:bg-amber-400 hover:text-slate-950"
                    aria-label={item.label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-white">Contact</h3>
            <div className="space-y-3 text-sm text-slate-400">
              <p className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-amber-300" />
                (063) 123-4567
              </p>
              <p className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-amber-300" />
                info@jaq.edu.ph
              </p>
              <p className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-300" />
                Northern Samar, Philippines
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-white">Admissions</h3>
            <p className="text-sm leading-6 text-slate-400">
              Pre-registration requires accurate student information, a valid profile photo, and location verification during submission.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <p>&copy; 2024 TMCFI Enrollment Hub. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
