import { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import {
  Users, TrendingUp, Calendar, FileText, Search, Download,
  Filter, ChevronDown, Eye, Trash2, Edit, Plus
} from 'lucide-react';
import { motion } from 'framer-motion';

export function AdminDashboardNew() {
  const [preRegistrations, setPreRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ program: '', gender: '', dateRange: '7days' });
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with real API calls
  const mockData = {
    metrics: [
      { label: 'Total Pre-Registrations', value: 1247, change: '+12.5%', icon: Users, color: 'from-blue-500 to-blue-600' },
      { label: 'This Week', value: 156, change: '+8.2%', icon: Calendar, color: 'from-purple-500 to-purple-600' },
      { label: 'Pending Review', value: 34, change: '-2.1%', icon: FileText, color: 'from-orange-500 to-orange-600' },
      { label: 'Verified', value: 1089, change: '+15.3%', icon: TrendingUp, color: 'from-green-500 to-green-600' },
    ],
    trendData: [
      { date: 'Mon', registrations: 124 },
      { date: 'Tue', registrations: 98 },
      { date: 'Wed', registrations: 156 },
      { date: 'Thu', registrations: 112 },
      { date: 'Fri', registrations: 189 },
      { date: 'Sat', registrations: 76 },
      { date: 'Sun', registrations: 54 },
    ],
    programData: [
      { name: 'BSIT', value: 345, color: '#3B82F6' },
      { name: 'BSCRIM', value: 267, color: '#8B5CF6' },
      { name: 'BSHM', value: 234, color: '#F97316' },
      { name: 'BEED', value: 198, color: '#10B981' },
      { name: 'K-12', value: 203, color: '#EC4899' },
    ],
    recentSubmissions: [
      { id: 1, name: 'Maria Santos', program: 'BSIT', email: 'maria@example.com', status: 'Verified', date: '2024-06-01' },
      { id: 2, name: 'Juan Dela Cruz', program: 'BSCRIM', email: 'juan@example.com', status: 'Pending', date: '2024-06-01' },
      { id: 3, name: 'Anna Mercado', program: 'BSHM', email: 'anna@example.com', status: 'Verified', date: '2024-05-31' },
      { id: 4, name: 'Carlos Reyes', program: 'BSIT', email: 'carlos@example.com', status: 'Verified', date: '2024-05-31' },
      { id: 5, name: 'Rosa Garcia', program: 'BEED', email: 'rosa@example.com', status: 'Rejected', date: '2024-05-30' },
    ],
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPreRegistrations(mockData.recentSubmissions);
      setLoading(false);
    }, 500);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Verified': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'Verified') return '✓';
    if (status === 'Pending') return '⏳';
    if (status === 'Rejected') return '✕';
    return '?';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-black text-slate-900">Admin Dashboard</h1>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-slate-100 rounded-lg transition">
              <Bell className="w-5 h-5 text-slate-600" />
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              AD
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {mockData.metrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${metric.color} text-white`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-bold text-green-600">{metric.change}</span>
                </div>
                <p className="text-slate-600 text-sm font-medium mb-1">{metric.label}</p>
                <p className="text-3xl font-black text-slate-900">{metric.value.toLocaleString()}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Line Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-4">Registration Trend (7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockData.trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="date" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#E2E8F0' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="registrations"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-4">By Program</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockData.programData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockData.programData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Filters & Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
        >
          {/* Table Header & Filters */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Recent Pre-Registrations</h3>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={filter.program}
                onChange={(e) => setFilter({ ...filter, program: e.target.value })}
                className="px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Programs</option>
                <option value="BSIT">BSIT</option>
                <option value="BSCRIM">BSCRIM</option>
                <option value="BSHM">BSHM</option>
                <option value="BEED">BEED</option>
                <option value="K-12">K-12</option>
              </select>

              <select
                value={filter.gender}
                onChange={(e) => setFilter({ ...filter, gender: e.target.value })}
                className="px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              <select
                value={filter.dateRange}
                onChange={(e) => setFilter({ ...filter, dateRange: e.target.value })}
                className="px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="alltime">All time</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-bold text-slate-900">Student Name</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-slate-900">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-slate-900">Program</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-slate-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-slate-900">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {preRegistrations.map((student, idx) => (
                  <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                          {student.name.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-900">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{student.email}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                        {student.program}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(student.status)}`}>
                        <span>{getStatusIcon(student.status)}</span>
                        {student.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{student.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-blue-50 text-blue-600 rounded transition">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-slate-100 text-slate-600 rounded transition">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-red-50 text-red-600 rounded transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <p className="text-sm text-slate-600">Showing {preRegistrations.length} of {preRegistrations.length} results</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition font-medium">
                Previous
              </button>
              <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium">
                1
              </button>
              <button className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition font-medium">
                Next
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Bell icon
function Bell(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}
