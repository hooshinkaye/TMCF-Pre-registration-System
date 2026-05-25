import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function ScheduleFilter() {
  const [formData, setFormData] = useState({
    f_ay: '',
    f_program: '',
    f_year: '',
    f_section: '',
    f_sem: '1st Semester',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isValid = formData.f_ay && formData.f_program && formData.f_year && formData.f_section;

  return (
    <form
      method="GET"
      action="https://xt.pbhitsolution.info/enrollment_hub/viewschedule/index.php"
      className="bg-white border border-[#F0EEEA] rounded-2xl shadow-lg p-6 md:p-8"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Academic Year */}
        <div>
          <label className="block text-[11px] uppercase font-bold text-gray-400 tracking-wide mb-1.5">
            Acad. Year *
          </label>
          <Input
            name="f_ay"
            value={formData.f_ay}
            onChange={e => handleChange('f_ay', e.target.value)}
            placeholder="2025-2026"
            required
            className="h-11 bg-gray-50 border-gray-100"
          />
        </div>

        {/* Program */}
        <div>
          <label className="block text-[11px] uppercase font-bold text-gray-400 tracking-wide mb-1.5">
            Program *
          </label>
          <select
            name="f_program"
            value={formData.f_program}
            onChange={e => handleChange('f_program', e.target.value)}
            required
            className="w-full h-11 px-3 rounded-md border border-input bg-gray-50 text-sm text-gray-900 focus:border-[#D4A843] focus:ring-2 focus:ring-[#D4A843]/20 outline-none transition-all"
          >
            <option value="">-- Select --</option>
            <option>BEED</option>
            <option>BSCRIM</option>
            <option>BSCRIM(Special Class)</option>
            <option>BSCS</option>
            <option>BSHM</option>
            <option>BSIT</option>
          </select>
        </div>

        {/* Year */}
        <div>
          <label className="block text-[11px] uppercase font-bold text-gray-400 tracking-wide mb-1.5">
            Year *
          </label>
          <select
            name="f_year"
            value={formData.f_year}
            onChange={e => handleChange('f_year', e.target.value)}
            required
            className="w-full h-11 px-3 rounded-md border border-input bg-gray-50 text-sm text-gray-900 focus:border-[#D4A843] focus:ring-2 focus:ring-[#D4A843]/20 outline-none transition-all"
          >
            <option value="">-- Select --</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
        </div>

        {/* Section */}
        <div>
          <label className="block text-[11px] uppercase font-bold text-gray-400 tracking-wide mb-1.5">
            Section *
          </label>
          <select
            name="f_section"
            value={formData.f_section}
            onChange={e => handleChange('f_section', e.target.value)}
            required
            className="w-full h-11 px-3 rounded-md border border-input bg-gray-50 text-sm text-gray-900 focus:border-[#D4A843] focus:ring-2 focus:ring-[#D4A843]/20 outline-none transition-all"
          >
            <option value="">-- Select --</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            <option value="C">Section C</option>
            <option value="D">Section D</option>
            <option value="E">Section E</option>
          </select>
        </div>

        {/* Semester */}
        <div>
          <label className="block text-[11px] uppercase font-bold text-gray-400 tracking-wide mb-1.5">
            Semester *
          </label>
          <select
            name="f_sem"
            value={formData.f_sem}
            onChange={e => handleChange('f_sem', e.target.value)}
            required
            className="w-full h-11 px-3 rounded-md border border-input bg-gray-50 text-sm text-gray-900 focus:border-[#D4A843] focus:ring-2 focus:ring-[#D4A843]/20 outline-none transition-all"
          >
            <option value="1st Semester">1st Semester</option>
            <option value="2nd Semester">2nd Semester</option>
          </select>
        </div>

        {/* Submit */}
        <div className="flex items-end">
          <button
            type="submit"
            disabled={!isValid}
            className="w-full bg-[#D4A843] hover:bg-[#C49A3A] text-[#0B1F3F] font-bold h-11 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:-translate-y-0.5"
          >
            <Search className="w-4 h-4" /> Find Schedule
          </button>
        </div>
      </div>
    </form>
  );
}
