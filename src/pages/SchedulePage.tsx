import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ScheduleFilter } from '@/components/ScheduleFilter';
import { ScheduleTable } from '@/components/ScheduleTable';
import { Footer } from '@/components/Footer';

export function SchedulePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="bg-[#0B1F3F] no-print">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-5">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-400 hover:text-[#D4A843] transition-colors text-[13px] font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              BACK TO HOME
            </Link>
            <div className="text-right">
              <h1 className="text-xl sm:text-2xl lg:text-[28px] font-extrabold text-white tracking-tight">
                CLASS SCHEDULES
              </h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-[3px]">TMCFI</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 py-8">
        <ScheduleFilter />
        <div className="mt-8">
          <ScheduleTable />
        </div>
      </main>

      <div className="no-print mt-auto">
        <Footer />
      </div>
    </div>
  );
}
