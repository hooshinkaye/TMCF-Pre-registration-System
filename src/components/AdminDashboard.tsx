import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, RefreshCw, LogOut, TrendingUp, Users, Award, Zap } from 'lucide-react';

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

  const COLORS = ['#FF6B6B', '#FFA500', '#FFD700', '#4ECDC4', '#45B7D1', '#96CEB4'];

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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600 mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600">Track and manage pre-registrations in real-time</p>
          </div>
          {onLogout && (
            <Button
              onClick={onLogout}
              className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl"
            >
              <LogOut size={18} />
              Logout
            </Button>
          )}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-semibold mb-1">Total</p>
                <p className="text-4xl font-black">{registrations.length}</p>
              </div>
              <Users className="w-12 h-12 text-white/30" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-100 text-sm font-semibold mb-1">Today</p>
                <p className="text-4xl font-black">{todaySubmissions}</p>
              </div>
              <Zap className="w-12 h-12 text-white/30" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-semibold mb-1">This Week</p>
                <p className="text-4xl font-black">{thisWeekSubmissions}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-white/30" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-100 text-sm font-semibold mb-1">Avg/Day</p>
                <p className="text-4xl font-black">{registrations.length > 0 ? Math.ceil(registrations.length / 30) : 0}</p>
              </div>
              <Award className="w-12 h-12 text-white/30" />
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Timeline */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-black text-gray-900 mb-4">Trend</h3>
            {timelineData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '2px solid #ff7a5c', borderRadius: '12px' }}
                  />
                  <Line type="monotone" dataKey="submissions" stroke="#ff7a5c" strokeWidth={3} dot={{ fill: '#ff7a5c', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 text-center py-8">No data</p>
            )}
          </div>

          {/* Program Pie */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-black text-gray-900 mb-4">Programs</h3>
            {programCounts.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={programCounts} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" paddingAngle={2}>
                    {programCounts.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 text-center py-8">No data</p>
            )}
          </div>
        </div>

        {/* Gender Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <h3 className="text-xl font-black text-gray-900 mb-4">Gender Distribution</h3>
          {genderCounts.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={genderCounts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '2px solid #ff7a5c', borderRadius: '12px' }} />
                <Bar dataKey="value" fill="#ff7a5c" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-center py-8">No data</p>
          )}
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <h3 className="text-xl font-black text-gray-900 mb-4">Search & Filter</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
            <Input
              placeholder="Search name/email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-xl border-2 border-gray-200"
            />

            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="rounded-xl border-2 border-gray-200 px-4 py-2"
            >
              <option value="all">All Programs</option>
              {uniquePrograms.map(prog => (
                <option key={prog} value={prog}>{prog}</option>
              ))}
            </select>

            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="rounded-xl border-2 border-gray-200 px-4 py-2"
            >
              <option value="all">All</option>
              {uniqueGenders.map(gender => (
                <option key={gender} value={gender}>{gender}</option>
              ))}
            </select>

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-xl border-2 border-gray-200 px-4 py-2"
            />

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-xl border-2 border-gray-200 px-4 py-2"
            />

            <Button
              onClick={fetchRegistrations}
              disabled={loading}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={exportToCSV}
              disabled={filtered.length === 0}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl"
            >
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
            <Button
              onClick={exportToJSON}
              disabled={filtered.length === 0}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl"
            >
              <Download className="w-4 h-4 mr-2" />
              JSON
            </Button>
            <span className="text-gray-600 font-semibold self-center">
              {filtered.length} of {registrations.length}
            </span>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-orange-100 to-pink-100">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === filtered.length && filtered.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded"
                    />
                  </th>
                  <th className="px-6 py-4 text-left font-black text-gray-900">Name</th>
                  <th className="px-6 py-4 text-left font-black text-gray-900">Email</th>
                  <th className="px-6 py-4 text-left font-black text-gray-900">Program</th>
                  <th className="px-6 py-4 text-left font-black text-gray-900">Gender</th>
                  <th className="px-6 py-4 text-left font-black text-gray-900">Phone</th>
                  <th className="px-6 py-4 text-left font-black text-gray-900">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.length > 0 ? (
                  filtered.map((reg) => (
                    <tr key={reg.id} className="hover:bg-orange-50 transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(reg.id)}
                          onChange={() => toggleRowSelection(reg.id)}
                          className="w-4 h-4 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{reg.first_name} {reg.last_name}</td>
                      <td className="px-6 py-4 text-gray-700">{reg.email}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-orange-100 to-pink-100 text-orange-900 text-sm font-semibold">
                          {reg.program}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{reg.gender}</td>
                      <td className="px-6 py-4 text-gray-700">{reg.phone}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{new Date(reg.submitted_at).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      {loading ? 'Loading...' : 'No data found'}
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
