import { CalendarDays } from 'lucide-react';

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
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <CalendarDays className="w-12 h-12 mb-3 text-gray-300" />
        <p className="text-sm">Select filters above to view your class schedule</p>
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
