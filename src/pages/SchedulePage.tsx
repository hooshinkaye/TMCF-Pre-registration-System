import { Link } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Clock3, MapPin } from 'lucide-react';
import { ScheduleFilter } from '@/components/ScheduleFilter';
import { ScheduleTable } from '@/components/ScheduleTable';
import { Footer } from '@/components/Footer';
import { SchoolLogo } from '@/components/SchoolLogo';

export function SchedulePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="relative overflow-hidden bg-slate-950 no-print">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(212,168,67,0.28),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(37,99,235,0.22),_transparent_32%)]" />
        <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex items-center justify-between gap-6">
            <Link
              to="/"
              className="flex items-center gap-2 text-slate-300 hover:text-amber-300 transition-colors text-[13px] font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              BACK TO HOME
            </Link>
            <SchoolLogo
              showTagline
              markClassName="bg-white text-slate-950"
              textClassName="text-white"
            />
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <p className="mb-3 inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-amber-200">
                Student timetable
              </p>
              <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl">
                Find your class schedule faster.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                Select your academic year, program, year level, section, and semester to open the official J.A.Q schedule viewer.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              {[
                { icon: CalendarDays, label: 'AY', value: '2025-2026' },
                { icon: Clock3, label: 'Terms', value: '2 Semesters' },
                { icon: MapPin, label: 'Campus', value: 'Northern Samar' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-lg bg-white/10 p-3 text-white">
                    <Icon className="mb-3 h-5 w-5 text-amber-300" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{item.label}</p>
                    <p className="mt-1 text-xs font-bold leading-snug">{item.value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 pb-10">
        <div className="-mt-10">
          <ScheduleFilter />
        </div>
        <div className="mt-10">
          <ScheduleTable />
        </div>
      </main>

      <div className="no-print mt-auto">
        <Footer />
      </div>
    </div>
  );
}
