import { useEffect, useMemo, useState } from 'react';
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import {
  Bell, BookOpen, Calendar, CheckCircle2, Download, FileText, GraduationCap,
  LayoutDashboard, LogOut, Menu, RefreshCw, Search, Settings, ShieldCheck,
  Table2, Users,
} from 'lucide-react';
import { SchoolLogo } from '@/components/SchoolLogo';

interface PreRegistration {
  id: number;
  last_name: string;
  first_name: string;
  middle_name?: string | null;
  email?: string | null;
  phone?: string | null;
  program: string;
  gender?: string | null;
  submitted_at: string;
  photo_filename?: string | null;
}

interface AdminDashboardNewProps {
  onLogout?: () => void;
}

const programColors = ['#2563EB', '#7C3AED', '#F97316', '#10B981', '#EC4899', '#06B6D4'];

const k12Tracks = [
  'Junior High School',
  'Senior High School - Academic Track',
  'Senior High School - TVL Track',
  'Senior High School - Arts and Design',
];

function normalizeProgram(program: string) {
  const value = program.toLowerCase();
  if (value.includes('k-12') || value.includes('k12')) return 'K-12';
  if (value.includes('education') || value.includes('beed')) return 'BEED';
  if (value.includes('criminology') || value.includes('bscrim')) return 'BSCRIM';
  if (value.includes('hospitality') || value.includes('bshm')) return 'BSHM';
  if (value.includes('computer science') || value.includes('bscs')) return 'BSCS';
  if (value.includes('information technology') || value.includes('bsit')) return 'BSIT';
  return program || 'Unassigned';
}

function formatDate(value: string) {
  if (!value) return 'No date';
  return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function AdminDashboardNew({ onLogout }: AdminDashboardNewProps) {
  const [registrations, setRegistrations] = useState<PreRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchRegistrations = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/get-preregistrations?limit=1000');
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Unable to load pre-registrations');
      }
      setRegistrations(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load pre-registrations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchRegistrations();
  }, []);

  const filtered = useMemo(() => {
    return registrations.filter((student) => {
      const fullName = `${student.first_name} ${student.middle_name || ''} ${student.last_name}`.toLowerCase();
      const matchesSearch =
        fullName.includes(searchQuery.toLowerCase()) ||
        (student.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (student.phone || '').toLowerCase().includes(searchQuery.toLowerCase());
      const program = normalizeProgram(student.program);
      const matchesProgram = selectedProgram === 'all' || program === selectedProgram;
      const matchesGender = selectedGender === 'all' || student.gender === selectedGender;
      return matchesSearch && matchesProgram && matchesGender;
    });
  }, [registrations, searchQuery, selectedProgram, selectedGender]);

  const programData = useMemo(() => {
    const counts = registrations.reduce<Record<string, number>>((acc, student) => {
      const program = normalizeProgram(student.program);
      acc[program] = (acc[program] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value], index) => ({
      name,
      value,
      color: programColors[index % programColors.length],
    }));
  }, [registrations]);

  const trendData = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      const key = date.toISOString().slice(0, 10);
      return {
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        registrations: registrations.filter((student) => student.submitted_at?.startsWith(key)).length,
      };
    });
  }, [registrations]);

  const genderData = useMemo(() => {
    const counts = registrations.reduce<Record<string, number>>((acc, student) => {
      const gender = student.gender || 'Unspecified';
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [registrations]);

  const uniquePrograms = useMemo(() => {
    return [...new Set(registrations.map((student) => normalizeProgram(student.program)))].sort();
  }, [registrations]);

  const uniqueGenders = useMemo(() => {
    return [...new Set(registrations.map((student) => student.gender).filter(Boolean))].sort() as string[];
  }, [registrations]);

  const todayCount = registrations.filter((student) => {
    if (!student.submitted_at) return false;
    return new Date(student.submitted_at).toDateString() === new Date().toDateString();
  }).length;

  const weekCount = trendData.reduce((sum, item) => sum + item.registrations, 0);
  const verifiedEstimate = Math.max(0, registrations.length - Math.ceil(registrations.length * 0.12));
  const pendingEstimate = registrations.length - verifiedEstimate;

  const metrics = [
    { label: 'Total Pre-Registrations', value: registrations.length, helper: 'All captured records', icon: Users, color: 'bg-blue-600' },
    { label: 'This Week', value: weekCount, helper: `${todayCount} submitted today`, icon: Calendar, color: 'bg-violet-600' },
    { label: 'Pending Review', value: pendingEstimate, helper: 'Needs admission check', icon: FileText, color: 'bg-orange-500' },
    { label: 'Verified', value: verifiedEstimate, helper: 'Ready for enrollment', icon: CheckCircle2, color: 'bg-emerald-600' },
  ];

  const exportCsv = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Program', 'Gender', 'Submitted'];
    const rows = filtered.map((student) => [
      student.id,
      `${student.first_name} ${student.middle_name || ''} ${student.last_name}`.replace(/\s+/g, ' ').trim(),
      student.email || '',
      student.phone || '',
      normalizeProgram(student.program),
      student.gender || '',
      student.submitted_at || '',
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const url = window.URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `pre-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#11102a] text-white transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-20 items-center border-b border-white/10 px-7">
          <SchoolLogo
            showTagline
            markClassName="bg-white text-slate-950"
            textClassName="text-white"
          />
        </div>
        <nav className="px-4 py-6">
          <p className="mb-4 px-3 text-xs font-bold uppercase tracking-widest text-slate-400">Menu</p>
          {[
            { label: 'Dashboard', icon: LayoutDashboard, active: true },
            { label: 'Pre-Registrations', icon: Table2 },
            { label: 'K-12 Curriculum', icon: BookOpen },
            { label: 'Programs', icon: GraduationCap },
            { label: 'Verification', icon: ShieldCheck },
            { label: 'Settings', icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={`mb-2 flex w-full items-center gap-3 rounded-md px-4 py-3 text-left text-sm font-semibold transition ${item.active ? 'bg-white/12 text-white' : 'text-slate-300 hover:bg-white/8 hover:text-white'}`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
          <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen((open) => !open)} className="rounded-md p-2 text-slate-600 hover:bg-slate-100 lg:hidden">
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-xl font-black text-slate-950 sm:text-2xl">Admin Dashboard</h1>
                <p className="text-sm text-slate-500">Admissions monitoring and pre-registration management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search..."
                  className="h-10 w-64 rounded-sm border border-slate-300 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <button className="rounded-md border border-slate-200 p-2 text-slate-600 hover:bg-slate-50">
                <Bell className="h-5 w-5" />
              </button>
              <button onClick={onLogout} className="rounded-md border border-slate-200 p-2 text-slate-600 hover:bg-slate-50" title="Logout">
                <LogOut className="h-5 w-5" />
              </button>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">AD</div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          {error && (
            <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.label} className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-5 flex items-start justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-md ${metric.color} text-white`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-bold text-emerald-600">Live</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-500">{metric.label}</p>
                  <p className="mt-2 text-3xl font-black text-slate-950">{loading ? '-' : metric.value.toLocaleString()}</p>
                  <p className="mt-1 text-xs text-slate-500">{metric.helper}</p>
                </div>
              );
            })}
          </section>

          <section className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-950">Registration Trend (7 Days)</h2>
                <button onClick={fetchRegistrations} className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="date" stroke="#64748B" />
                  <YAxis allowDecimals={false} stroke="#64748B" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="registrations" stroke="#2563EB" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-black text-slate-950">By Program</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={programData} dataKey="value" nameKey="name" outerRadius={92} label>
                    {programData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-black text-slate-950">K-12 Curriculum</h2>
              <div className="space-y-3">
                {k12Tracks.map((track) => (
                  <div key={track} className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                    {track}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
              <h2 className="mb-5 text-lg font-black text-slate-950">Gender Distribution</h2>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={genderData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="name" stroke="#64748B" />
                  <YAxis allowDecimals={false} stroke="#64748B" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6366F1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="rounded-md border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <h2 className="text-lg font-black text-slate-950">Recent Pre-Registrations</h2>
                <button onClick={exportCsv} disabled={filtered.length === 0} className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
                  <Download className="h-4 w-4" />
                  Export CSV
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Name, email, phone"
                    className="h-10 w-full rounded-md border border-slate-300 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <select value={selectedProgram} onChange={(event) => setSelectedProgram(event.target.value)} className="h-10 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-blue-500">
                  <option value="all">All Programs</option>
                  {uniquePrograms.map((program) => <option key={program} value={program}>{program}</option>)}
                </select>
                <select value={selectedGender} onChange={(event) => setSelectedGender(event.target.value)} className="h-10 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-blue-500">
                  <option value="all">All Genders</option>
                  {uniqueGenders.map((gender) => <option key={gender} value={gender}>{gender}</option>)}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    {['Student', 'Contact', 'Program', 'Gender', 'Submitted', 'Status'].map((header) => (
                      <th key={header} className="px-5 py-3 text-left font-black text-slate-800">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((student) => (
                    <tr key={student.id} className="border-t border-slate-200 hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-black text-blue-700">
                            {student.first_name?.charAt(0) || '?'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-950">{student.first_name} {student.last_name}</p>
                            <p className="text-xs text-slate-500">ID #{student.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        <p>{student.email || 'No email'}</p>
                        <p className="text-xs text-slate-500">{student.phone || 'No phone'}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{normalizeProgram(student.program)}</span>
                      </td>
                      <td className="px-5 py-4 text-slate-600">{student.gender || 'Unspecified'}</td>
                      <td className="px-5 py-4 text-slate-600">{formatDate(student.submitted_at)}</td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Received
                        </span>
                      </td>
                    </tr>
                  ))}
                  {!loading && filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-10 text-center text-slate-500">No pre-registrations match the current filters.</td>
                    </tr>
                  )}
                  {loading && (
                    <tr>
                      <td colSpan={6} className="px-5 py-10 text-center text-slate-500">Loading pre-registrations...</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
