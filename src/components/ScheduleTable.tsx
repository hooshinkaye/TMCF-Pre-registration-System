import { CalendarDays, Filter, Search } from 'lucide-react';

interface ScheduleData {
  time: string;
  subject: string;
  room: string;
  instructor: string;
}

interface ScheduleTableProps {
  data?: ScheduleData[];
}

export function ScheduleTable({ data }: ScheduleTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 shadow-sm">
        <div className="mx-auto flex max-w-md flex-col items-center justify-center py-10 text-center">
          <div className="relative mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-slate-100 text-slate-500">
            <CalendarDays className="h-8 w-8" />
            <div className="absolute -right-2 -top-2 grid h-8 w-8 place-items-center rounded-full bg-amber-400 text-slate-950">
              <Search className="h-4 w-4" />
            </div>
          </div>
          <h2 className="text-xl font-black text-slate-950">No schedule selected yet</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Use the finder above to open the official timetable for your program and section.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600">
            <Filter className="h-4 w-4" />
            Waiting for filters
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-[#F0EEEA]">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F8F6F1]">
              <th className="text-left text-[13px] font-semibold text-[#0B1F3F] uppercase tracking-wide px-5 py-4">Time</th>
              <th className="text-left text-[13px] font-semibold text-[#0B1F3F] uppercase tracking-wide px-5 py-4">Subject</th>
              <th className="text-left text-[13px] font-semibold text-[#0B1F3F] uppercase tracking-wide px-5 py-4">Room</th>
              <th className="text-left text-[13px] font-semibold text-[#0B1F3F] uppercase tracking-wide px-5 py-4">Instructor</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className={`border-t border-[#F0EEEA] ${i % 2 === 1 ? 'bg-gray-50' : 'bg-white'}`}>
                <td className="px-5 py-4 text-sm text-gray-700">{row.time}</td>
                <td className="px-5 py-4 text-sm text-gray-700 font-medium">{row.subject}</td>
                <td className="px-5 py-4 text-sm text-gray-500">{row.room}</td>
                <td className="px-5 py-4 text-sm text-gray-500">{row.instructor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
