import React from 'react';
import { useAuthStore } from '@/src/app/store/authStore';
import { LayoutDashboard, Users, Calendar, Settings, LogOut, TrendingUp, DollarSign, Activity } from 'lucide-react';
import { motion } from 'motion/react';

const DashboardPage = () => {
  const { logout, user } = useAuthStore();

  const stats = [
    { label: 'Total Patients', value: '1,284', change: '+12%', icon: <Users className="text-blue-600" /> },
    { label: 'New Appointments', value: '42', change: '+8%', icon: <Calendar className="text-purple-600" /> },
    { label: 'Revenue (MTD)', value: '$52,400', change: '+24%', icon: <DollarSign className="text-green-600" /> },
    { label: 'Treatment Success', value: '98.2%', change: '+0.5%', icon: <Activity className="text-red-600" /> },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900 text-neutral-400 p-6 flex flex-col hidden md:flex">
        <div className="flex items-center gap-2 mb-10 text-white">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">D</div>
          <span className="font-bold text-lg">Admin Panel</span>
        </div>

        <nav className="flex-1 space-y-1">
          {[
            { label: 'Dashboard', icon: <LayoutDashboard size={20} />, active: true },
            { label: 'Patients', icon: <Users size={20} /> },
            { label: 'Schedule', icon: <Calendar size={20} /> },
            { label: 'Settings', icon: <Settings size={20} /> },
          ].map((item, i) => (
            <button key={i} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${item.active ? 'bg-blue-600 text-white' : 'hover:bg-neutral-800'}`}>
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <button 
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-colors mt-auto"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Clinic Overview</h1>
            <p className="text-neutral-500">Welcome back, {user?.fullName}</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-white border border-neutral-200 rounded-lg font-medium text-sm hover:bg-neutral-50">Generate Report</button>
            <div className="w-10 h-10 rounded-full bg-neutral-200 overflow-hidden border-2 border-white shadow-sm">
              <img src="https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff" alt="avatar" />
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-neutral-50 rounded-lg">{stat.icon}</div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">{stat.change}</span>
              </div>
              <p className="text-sm text-neutral-500 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Charts/Table Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
            <h3 className="font-bold text-lg mb-4">Recent Appointments</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-neutral-400 text-xs uppercase tracking-wider border-b border-neutral-50">
                    <th className="pb-4 font-semibold text-neutral-500">Patient</th>
                    <th className="pb-4 font-semibold text-neutral-500">Time</th>
                    <th className="pb-4 font-semibold text-neutral-500">Service</th>
                    <th className="pb-4 font-semibold text-neutral-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {[
                    { name: 'Alex Johnson', time: '09:00 AM', service: 'Checkup', status: 'Confirmed' },
                    { name: 'Maria Garcia', time: '10:30 AM', service: 'Root Canal', status: 'In Progress' },
                    { name: 'James Wilson', time: '01:15 PM', service: 'Braces Adj', status: 'Pending' },
                  ].map((row, i) => (
                    <tr key={i} className="group hover:bg-neutral-50 transition-colors">
                      <td className="py-4 font-medium text-neutral-900">{row.name}</td>
                      <td className="py-4 text-neutral-500 text-sm">{row.time}</td>
                      <td className="py-4 text-neutral-500 text-sm">{row.service}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          row.status === 'Confirmed' ? 'bg-green-50 text-green-600' : 
                          row.status === 'In Progress' ? 'bg-blue-50 text-blue-600' : 'bg-neutral-100 text-neutral-500'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
            <h3 className="font-bold text-lg mb-4">Weekly Revenue</h3>
            <div className="space-y-4">
              {[
                { day: 'Mon', value: 80 },
                { day: 'Tue', value: 65 },
                { day: 'Wed', value: 90 },
                { day: 'Thu', value: 45 },
                { day: 'Fri', value: 70 },
              ].map((bar, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs text-neutral-500">
                    <span>{bar.day}</span>
                    <span>${bar.value * 100}</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${bar.value}%` }} 
                      className="h-full bg-blue-600 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
