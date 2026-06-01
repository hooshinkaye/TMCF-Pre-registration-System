import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, RefreshCw, LogOut, Users, TrendingUp, CheckCircle2, Calendar } from 'lucide-react';

interface PreRegistration {
  id: number;
  last_name: string;
  first_name: string;
  middle_name: string;
  email: string;
  phone: string;
  program: string;
  gender: string;
  submitted_at: string;
  [key: string]: string | number;
}

interface AdminDashboardProps {
  onLogout?: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [registrations, setRegistrations] = useState<PreRegistration[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/get-preregistrations?limit=1000`);
      const data = await response.json();
      if (data.success) {
        setRegistrations(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  // Filter logic
  const filtered = registrations.filter(reg => {
    const searchMatch = 
      reg.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchTerm.toLowerCase());

    const programMatch = selectedProgram === 'all' || reg.program === selectedProgram;
    const genderMatch = selectedGender === 'all' || reg.gender === selectedGender;

    let dateMatch = true;
    if (startDate || endDate) {
      const regDate = new Date(reg.submitted_at);
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        dateMatch = dateMatch && regDate >= start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        dateMatch = dateMatch && regDate <= end;
      }
    }

    return searchMatch && programMatch && genderMatch && dateMatch;
  });

  // Group by program
  const programCounts = registrations.reduce((acc, reg) => {
    const existing = acc.find(p => p.name === reg.program);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: reg.program, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Gender breakdown
  const genderCounts = registrations.reduce((acc, reg) => {
    const existing = acc.find(g => g.name === reg.gender);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: reg.gender, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Generate timeline data for last 30 days
  const generateTimelineData = () => {
    const data: { date: string; submissions: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const count = registrations.filter(r => r.submitted_at.startsWith(dateStr)).length;
      data.push({ date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), submissions: count });
    }
    return data;
  };

  const timelineData = generateTimelineData();
  const uniquePrograms = [...new Set(registrations.map(r => r.program))].sort();
  const uniqueGenders = [...new Set(registrations.map(r => r.gender))].sort();

  const COLORS = ['#0EA5E9', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const exportToCSV = () => {
    const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Program', 'Gender', 'Submitted At'];
    const rows = filtered.map(reg => [
      reg.id,
      reg.first_name,
      reg.last_name,
      reg.email,
      reg.phone,
      reg.program,
      reg.gender,
      new Date(reg.submitted_at).toLocaleString(),
    ]);

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pre-registrations-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const exportToJSON = () => {
    const json = JSON.stringify(filtered, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pre-registrations-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const toggleRowSelection = (id: number) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === filtered.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filtered.map(r => r.id));
    }
  };

  // Metrics
  const todaySubmissions = registrations.filter(r => {
    const regDate = new Date(r.submitted_at).toDateString();
    return regDate === new Date().toDateString();
  }).length;

  const thisWeekSubmissions = registrations.filter(r => {
    const regDate = new Date(r.submitted_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return regDate >= weekAgo;
  }).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-slate-400">Manage and analyze pre-registration data</p>
          </div>
          {onLogout && (
            <Button
              onClick={onLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
            >
              <LogOut size={18} />
              Logout
            </Button>
          )}
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-400/10 border border-blue-500/30 rounded-lg p-6 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium mb-1">Total Registrations</p>
                <p className="text-3xl font-bold text-white">{registrations.length}</p>
              </div>
              <Users className="w-10 h-10 text-blue-400/50" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600/20 to-green-400/10 border border-green-500/30 rounded-lg p-6 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm font-medium mb-1">Today</p>
                <p className="text-3xl font-bold text-white">{todaySubmissions}</p>
              </div>
              <Calendar className="w-10 h-10 text-green-400/50" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600/20 to-purple-400/10 border border-purple-500/30 rounded-lg p-6 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium mb-1">This Week</p>
                <p className="text-3xl font-bold text-white">{thisWeekSubmissions}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-purple-400/50" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-600/20 to-cyan-400/10 border border-cyan-500/30 rounded-lg p-6 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-200 text-sm font-medium mb-1">Avg/Day</p>
                <p className="text-3xl font-bold text-white">{registrations.length > 0 ? Math.ceil(registrations.length / 30) : 0}</p>
              </div>
              <CheckCircle2 className="w-10 h-10 text-cyan-400/50" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Timeline Chart */}
          <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 backdrop-blur">
            <h3 className="text-lg font-semibold text-white mb-4">Submissions Trend (30 Days)</h3>
            {timelineData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={timelineData}>
                  <defs>
                    <linearGradient id="colorSubmissions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                  <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} />
                  <YAxis stroke="#94A3B8" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #475569', borderRadius: '8px', color: '#F1F5F9' }}
                    cursor={{ fill: 'rgba(14, 165, 233, 0.1)' }}
                  />
                  <Area type="monotone" dataKey="submissions" stroke="#0EA5E9" strokeWidth={2} fillOpacity={1} fill="url(#colorSubmissions)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-400 text-center py-8">No data yet</p>
            )}
          </div>

          {/* Program Distribution */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 backdrop-blur">
            <h3 className="text-lg font-semibold text-white mb-4">Programs</h3>
            {programCounts.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={programCounts}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {programCounts.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #475569', borderRadius: '8px', color: '#F1F5F9' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-400 text-center py-8">No data</p>
            )}
          </div>
        </div>

        {/* Gender Distribution */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 backdrop-blur mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Gender Distribution</h3>
          {genderCounts.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={genderCounts}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis dataKey="name" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #475569', borderRadius: '8px', color: '#F1F5F9' }}
                />
                <Bar dataKey="value" fill="#0EA5E9" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-400 text-center py-8">No data</p>
          )}
        </div>

        {/* Filters */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 backdrop-blur mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Filters & Controls</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
            <div>
              <label className="text-slate-300 text-sm font-medium block mb-2">Search</label>
              <Input
                placeholder="Name, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-500"
              />
            </div>

            <div>
              <label className="text-slate-300 text-sm font-medium block mb-2">Program</label>
              <select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded px-3 py-2 text-sm"
              >
                <option value="all">All Programs</option>
                {uniquePrograms.map(prog => (
                  <option key={prog} value={prog}>{prog}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-300 text-sm font-medium block mb-2">Gender</label>
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded px-3 py-2 text-sm"
              >
                <option value="all">All</option>
                {uniqueGenders.map(gender => (
                  <option key={gender} value={gender}>{gender}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-300 text-sm font-medium block mb-2">From</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-slate-300 text-sm font-medium block mb-2">To</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded px-3 py-2 text-sm"
              />
            </div>

            <div className="flex items-end">
              <Button
                onClick={fetchRegistrations}
                disabled={loading}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Export Options */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={exportToCSV}
              disabled={filtered.length === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
            <Button
              onClick={exportToJSON}
              disabled={filtered.length === 0}
              className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export JSON
            </Button>
            <span className="text-slate-400 text-sm self-center">
              {filtered.length} of {registrations.length} registrations
            </span>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden backdrop-blur">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-700/50 border-b border-slate-600">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === filtered.length && filtered.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-slate-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-200">Name</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-200">Email</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-200">Program</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-200">Gender</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-200">Phone</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-200">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((reg) => (
                    <tr key={reg.id} className="border-b border-slate-700 hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(reg.id)}
                          onChange={() => toggleRowSelection(reg.id)}
                          className="w-4 h-4 rounded border-slate-500"
                        />
                      </td>
                      <td className="px-6 py-4 text-slate-200 font-medium">
                        {reg.first_name} {reg.last_name}
                      </td>
                      <td className="px-6 py-4 text-slate-300">{reg.email}</td>
                      <td className="px-6 py-4 text-slate-300">
                        <span className="px-2 py-1 rounded-full bg-blue-600/30 text-blue-200 text-xs font-medium">
                          {reg.program}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{reg.gender}</td>
                      <td className="px-6 py-4 text-slate-300">{reg.phone}</td>
                      <td className="px-6 py-4 text-slate-400 text-xs">
                        {new Date(reg.submitted_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                      {loading ? 'Loading...' : 'No registrations found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
