import { useEffect, useMemo, useState } from 'react';
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import {
  Bell, BookOpen, Calendar, CheckCircle2, Download, Eye, FileText, GraduationCap,
  LayoutDashboard, LogOut, Menu, RefreshCw, Search, Settings, ShieldCheck,
  Table2, Users, XCircle,
} from 'lucide-react';
import { SchoolLogo } from '@/components/SchoolLogo';

type AdminView = 'Dashboard' | 'Pre-Registrations' | 'K-12 Curriculum' | 'Programs' | 'Verification' | 'Settings';
type RegistrationStatus = 'pending' | 'verified' | 'rejected';

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
  status?: RegistrationStatus | null;
  reviewed_at?: string | null;
}

interface AdminDashboardNewProps {
  onLogout?: () => void;
}

const programColors = ['#2563EB', '#7C3AED', '#F97316', '#10B981', '#EC4899', '#06B6D4'];

const navItems: { label: AdminView; icon: typeof LayoutDashboard }[] = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Pre-Registrations', icon: Table2 },
  { label: 'K-12 Curriculum', icon: BookOpen },
  { label: 'Programs', icon: GraduationCap },
  { label: 'Verification', icon: ShieldCheck },
  { label: 'Settings', icon: Settings },
];

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

function getStatus(student: PreRegistration): RegistrationStatus {
  return student.status || 'pending';
}

export function AdminDashboardNew({ onLogout }: AdminDashboardNewProps) {
  const [registrations, setRegistrations] = useState<PreRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [activeView, setActiveView] = useState<AdminView>('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<PreRegistration | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const fetchRegistrations = async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
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
      if (showSpinner) setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchRegistrations();
    const interval = window.setInterval(() => {
      void fetchRegistrations(false);
    }, 8000);
    return () => window.clearInterval(interval);
  }, []);

  const baseFiltered = useMemo(() => {
    return registrations.filter((student) => {
      const fullName = `${student.first_name} ${student.middle_name || ''} ${student.last_name}`.toLowerCase();
      const matchesSearch =
        fullName.includes(searchQuery.toLowerCase()) ||
        (student.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (student.phone || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesProgram = selectedProgram === 'all' || normalizeProgram(student.program) === selectedProgram;
      const matchesGender = selectedGender === 'all' || student.gender === selectedGender;
      const matchesStatus = selectedStatus === 'all' || getStatus(student) === selectedStatus;
      return matchesSearch && matchesProgram && matchesGender && matchesStatus;
    });
  }, [registrations, searchQuery, selectedProgram, selectedGender, selectedStatus]);

  const viewRows = useMemo(() => {
    if (activeView === 'Verification') return baseFiltered.filter((student) => getStatus(student) === 'pending');
    if (activeView === 'K-12 Curriculum') return baseFiltered.filter((student) => normalizeProgram(student.program) === 'K-12');
    return baseFiltered;
  }, [activeView, baseFiltered]);

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
  const verifiedCount = registrations.filter((student) => getStatus(student) === 'verified').length;
  const rejectedCount = registrations.filter((student) => getStatus(student) === 'rejected').length;
  const pendingCount = registrations.filter((student) => getStatus(student) === 'pending').length;

  const metrics = [
    { label: 'Total Pre-Registrations', value: registrations.length, helper: 'All captured records', icon: Users, color: 'bg-blue-600' },
    { label: 'This Week', value: weekCount, helper: `${todayCount} submitted today`, icon: Calendar, color: 'bg-violet-600' },
    { label: 'Pending Review', value: pendingCount, helper: 'Needs admission check', icon: FileText, color: 'bg-orange-500' },
    { label: 'Verified', value: verifiedCount, helper: `${rejectedCount} rejected`, icon: CheckCircle2, color: 'bg-emerald-600' },
  ];

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedProgram('all');
    setSelectedGender('all');
    setSelectedStatus('all');
  };

  const openView = (view: AdminView) => {
    setActiveView(view);
    setSidebarOpen(false);
    setNotice('');
    if (view === 'Verification') setSelectedStatus('pending');
    if (view === 'K-12 Curriculum') setSelectedProgram('K-12');
    if (view === 'Pre-Registrations' || view === 'Dashboard') resetFilters();
  };

  const exportCsv = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Program', 'Gender', 'Status', 'Submitted'];
    const rows = viewRows.map((student) => [
      student.id,
      `${student.first_name} ${student.middle_name || ''} ${student.last_name}`.replace(/\s+/g, ' ').trim(),
      student.email || '',
      student.phone || '',
      normalizeProgram(student.program),
      student.gender || '',
      getStatus(student),
      student.submitted_at || '',
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const url = window.URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeView.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };

  const updateRegistrationStatus = async (id: number, status: RegistrationStatus) => {
    setNotice('');
    setError('');
    try {
      const response = await fetch(`/api/pre-registrations/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to update status');
      }

      setRegistrations((current) => current.map((student) => (
        student.id === id ? data.data : student
      )));
      setSelectedStudent((current) => current?.id === id ? data.data : current);
      setNotice(`Record #${id} marked ${status}. Counters updated.`);
      void fetchRegistrations(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const statusBadge = (student: PreRegistration) => {
    const status = getStatus(student);
    if (status === 'verified') return 'bg-emerald-50 text-emerald-700';
    if (status === 'rejected') return 'bg-red-50 text-red-700';
    return 'bg-orange-50 text-orange-700';
  };

  const pageCopy: Record<AdminView, { title: string; description: string }> = {
    Dashboard: {
      title: 'Dashboard',
      description: 'Live overview of pre-registration activity and admissions status.',
    },
    'Pre-Registrations': {
      title: 'Pre-Registrations',
      description: 'Search, filter, export, and review all submitted pre-registration records.',
    },
    'K-12 Curriculum': {
      title: 'K-12 Curriculum',
      description: 'Manage K-12 track visibility and monitor K-12 interested applicants.',
    },
    Programs: {
      title: 'Programs',
      description: 'Review program distribution and available program categories.',
    },
    Verification: {
      title: 'Verification Queue',
      description: 'Review pending applicants and mark records verified or rejected.',
    },
    Settings: {
      title: 'Settings',
      description: 'Dashboard controls, data sync, and local admin tools.',
    },
  };

  const Filters = () => (
    <div className="grid grid-cols-1 gap-3 border-b border-slate-200 p-5 md:grid-cols-4">
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
      <select value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)} className="h-10 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-blue-500">
        <option value="all">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="verified">Verified</option>
        <option value="rejected">Rejected</option>
      </select>
    </div>
  );

  const RegistrationTable = ({ rows, title }: { rows: PreRegistration[]; title: string }) => (
    <section className="rounded-md border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between">
        <h2 className="text-lg font-black text-slate-950">{title}</h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => fetchRegistrations()} className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button onClick={exportCsv} disabled={rows.length === 0} className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>
      <Filters />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-sm">
          <thead className="bg-slate-50">
            <tr>
              {['Student', 'Contact', 'Program', 'Gender', 'Submitted', 'Status', 'Actions'].map((header) => (
                <th key={header} className="px-5 py-3 text-left font-black text-slate-800">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((student) => (
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
                  <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${statusBadge(student)}`}>
                    {getStatus(student) === 'rejected' ? <XCircle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                    {getStatus(student).replace(/^\w/, (char) => char.toUpperCase())}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setSelectedStudent(student)} className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50">
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </button>
                    <button onClick={() => updateRegistrationStatus(student.id, 'verified')} className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700">
                      Verify
                    </button>
                    <button onClick={() => updateRegistrationStatus(student.id, 'rejected')} className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700">
                      Reject
                    </button>
                    {getStatus(student) !== 'pending' && (
                      <button onClick={() => updateRegistrationStatus(student.id, 'pending')} className="rounded-md bg-slate-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800">
                        Reopen
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-slate-500">No pre-registrations match this view.</td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-slate-500">Loading pre-registrations...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderView = () => {
    if (activeView === 'Pre-Registrations') {
      return <RegistrationTable rows={viewRows} title="All Pre-Registrations" />;
    }

    if (activeView === 'Verification') {
      return <RegistrationTable rows={viewRows} title="Pending Verification Queue" />;
    }

    if (activeView === 'K-12 Curriculum') {
      return (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <section className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-black text-slate-950">K-12 Curriculum</h2>
            <div className="space-y-3">
              {k12Tracks.map((track) => (
                <div key={track} className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                  {track}
                </div>
              ))}
            </div>
          </section>
          <div className="xl:col-span-2">
            <RegistrationTable rows={viewRows} title="K-12 Interested Applicants" />
          </div>
        </div>
      );
    }

    if (activeView === 'Programs') {
      return (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <section className="rounded-md border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
            <h2 className="mb-5 text-lg font-black text-slate-950">Program Categories</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {['BSIT', 'BSCRIM', 'BSHM', 'BEED', 'BSCS', 'K-12'].map((program) => (
                <button
                  key={program}
                  onClick={() => {
                    setSelectedProgram(program);
                    setActiveView('Pre-Registrations');
                  }}
                  className="rounded-md border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50"
                >
                  <p className="font-black text-slate-950">{program}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {registrations.filter((student) => normalizeProgram(student.program) === program).length} interested applicant(s)
                  </p>
                </button>
              ))}
            </div>
          </section>
          <section className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
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
          </section>
        </div>
      );
    }

    if (activeView === 'Settings') {
      return (
        <section className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-black text-slate-950">Dashboard Settings</h2>
          <p className="mt-1 text-sm text-slate-500">Controls for this admin session.</p>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <button onClick={resetFilters} className="rounded-md border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">
              Clear Filters
            </button>
            <button onClick={() => fetchRegistrations()} className="rounded-md bg-slate-950 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800">
              Refresh Data Now
            </button>
            <button onClick={onLogout} className="rounded-md bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-700">
              Logout
            </button>
          </div>
          <div className="mt-6 rounded-md bg-slate-50 p-4 text-sm text-slate-600">
            Realtime polling is enabled. The dashboard refreshes from the server every 8 seconds.
          </div>
        </section>
      );
    }

    return (
      <div className="space-y-6">
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-950">Registration Trend (7 Days)</h2>
              <button onClick={() => fetchRegistrations()} className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
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

        <section className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
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
        </section>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#11102a] text-white transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-20 items-center border-b border-white/10 px-7">
          <SchoolLogo showTagline markClassName="bg-white text-slate-950" textClassName="text-white" />
        </div>
        <nav className="px-4 py-6">
          <p className="mb-4 px-3 text-xs font-bold uppercase tracking-widest text-slate-400">Menu</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => openView(item.label)}
                className={`mb-2 flex w-full items-center gap-3 rounded-md px-4 py-3 text-left text-sm font-semibold transition ${activeView === item.label ? 'bg-white/12 text-white' : 'text-slate-300 hover:bg-white/8 hover:text-white'}`}
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
                <h1 className="text-xl font-black text-slate-950 sm:text-2xl">{pageCopy[activeView].title}</h1>
                <p className="text-sm text-slate-500">{pageCopy[activeView].description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setNotificationsOpen(true)} className="relative rounded-md border border-slate-200 p-2 text-slate-600 hover:bg-slate-50" title="Notifications">
                <Bell className="h-5 w-5" />
                {pendingCount > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-orange-500 px-1.5 text-[10px] font-black text-white">{pendingCount}</span>}
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
          {notice && (
            <div className="mb-6 flex items-center justify-between gap-4 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800">
              <span>{notice}</span>
              <button onClick={() => setNotice('')} className="rounded px-2 py-1 text-xs font-bold hover:bg-blue-100">Dismiss</button>
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

          {renderView()}
        </main>
      </div>

      {selectedStudent && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Pre-registration</p>
                <h2 className="mt-1 text-2xl font-black text-slate-950">{selectedStudent.first_name} {selectedStudent.last_name}</h2>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="rounded-md border border-slate-300 px-3 py-1 text-sm font-bold text-slate-600 hover:bg-slate-50">
                Close
              </button>
            </div>
            <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              {[
                ['Email', selectedStudent.email || 'No email'],
                ['Phone', selectedStudent.phone || 'No phone'],
                ['Program', normalizeProgram(selectedStudent.program)],
                ['Gender', selectedStudent.gender || 'Unspecified'],
                ['Submitted', formatDate(selectedStudent.submitted_at)],
                ['Status', getStatus(selectedStudent)],
                ['Reviewed', selectedStudent.reviewed_at ? formatDate(selectedStudent.reviewed_at) : 'Not reviewed'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-md bg-slate-50 p-3">
                  <dt className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</dt>
                  <dd className="mt-1 font-semibold text-slate-900">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <button onClick={() => updateRegistrationStatus(selectedStudent.id, 'verified')} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700">
                Verify
              </button>
              <button onClick={() => updateRegistrationStatus(selectedStudent.id, 'rejected')} className="rounded-md bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700">
                Reject
              </button>
              <button onClick={() => updateRegistrationStatus(selectedStudent.id, 'pending')} className="rounded-md bg-slate-700 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800">
                Reopen
              </button>
            </div>
          </div>
        </div>
      )}

      {notificationsOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-orange-600">Notifications</p>
                <h2 className="mt-1 text-2xl font-black text-slate-950">Review Queue</h2>
              </div>
              <button onClick={() => setNotificationsOpen(false)} className="rounded-md border border-slate-300 px-3 py-1 text-sm font-bold text-slate-600 hover:bg-slate-50">
                Close
              </button>
            </div>
            <div className="space-y-3">
              <div className="rounded-md bg-orange-50 p-4 text-sm font-semibold text-orange-800">
                {pendingCount} pending pre-registration{pendingCount === 1 ? '' : 's'} need staff review.
              </div>
              <button
                onClick={() => {
                  setNotificationsOpen(false);
                  openView('Verification');
                }}
                className="w-full rounded-md bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800"
              >
                Open Verification Queue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
