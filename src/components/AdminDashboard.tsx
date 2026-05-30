import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, RefreshCw, LogOut } from 'lucide-react';

interface PreRegistration {
  id: number;
  last_name: string;
  first_name: string;
  middle_name: string;
  program: string;
  gender: string;
  submitted_at: string;
}

interface AdminDashboardProps {
  onLogout?: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [registrations, setRegistrations] = useState<PreRegistration[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

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

  const filtered = registrations.filter(reg => {
    const searchMatch = 
      reg.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.program.toLowerCase().includes(searchTerm.toLowerCase());

    return searchMatch;
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

  const COLORS = ['#0B1F3F', '#D4A843', '#E94B3C', '#2E7D32'];

  const exportToCSV = () => {
    const headers = ['ID', 'Last Name', 'First Name', 'Program', 'Gender', 'Submitted At'];
    const rows = filtered.map(reg => [
      reg.id,
      reg.last_name,
      reg.first_name,
      reg.program,
      reg.gender,
      new Date(reg.submitted_at).toLocaleString(),
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pre-registrations-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Pre-Registration Dashboard</h1>
            <p className="text-slate-600">Total Submissions: {registrations.length}</p>
          </div>
          {onLogout && (
            <Button
              onClick={onLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut size={16} />
              Logout
            </Button>
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Program Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">By Program</h2>
            {programCounts.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={programCounts}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {programCounts.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-500 text-center py-8">No data yet</p>
            )}
          </div>

          {/* Gender Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">By Gender</h2>
            {genderCounts.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={genderCounts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0B1F3F" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-500 text-center py-8">No data yet</p>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <Input
              placeholder="Search by name or program..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={fetchRegistrations}
              disabled={loading}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button
              onClick={exportToCSV}
              disabled={filtered.length === 0}
              size="sm"
              className="flex items-center gap-2 bg-[#0B1F3F] hover:bg-[#0d2b5e]"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-slate-900">Name</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-900">Program</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-900">Gender</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-900">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((reg) => (
                    <tr key={reg.id} className="border-b hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-slate-700">
                        {reg.first_name} {reg.last_name}
                      </td>
                      <td className="px-6 py-4 text-slate-700">{reg.program}</td>
                      <td className="px-6 py-4 text-slate-700">{reg.gender}</td>
                      <td className="px-6 py-4 text-slate-600 text-xs">
                        {new Date(reg.submitted_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
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
