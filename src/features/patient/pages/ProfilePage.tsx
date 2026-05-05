import React from 'react';
import { useAuthStore } from '@/src/app/store/authStore';
import { User, Calendar, Clipboard, CreditCard, LogOut, FileText, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

const PatientProfilePage = () => {
  const { logout, user } = useAuthStore();

  const menuItems = [
    { title: 'Appointments', subtitle: 'View your upcoming visits', icon: <Calendar className="text-blue-500" /> },
    { title: 'Treatment History', subtitle: 'Record of past procedures', icon: <Clipboard className="text-purple-500" /> },
    { title: 'Billing & Invoices', subtitle: 'Payments and receipts', icon: <CreditCard className="text-green-500" /> },
    { title: 'Medical Records', subtitle: 'X-rays and documents', icon: <FileText className="text-red-500" /> },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 lg:p-8 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <header className="bg-white p-6 lg:p-8 rounded-3xl border border-neutral-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-neutral-100 overflow-hidden ring-4 ring-neutral-50">
              <img src={`https://ui-avatars.com/api/?name=${user?.fullName}&background=2563eb&color=fff`} alt="avatar" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">{user?.fullName}</h1>
              <p className="text-neutral-500 text-sm">{user?.email}</p>
              <div className="mt-2 flex gap-2">
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase tracking-wider">Patient</span>
                <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-[10px] font-bold rounded-full uppercase tracking-wider">Member Since 2026</span>
              </div>
            </div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 text-neutral-400 hover:text-red-600 transition-colors font-medium text-sm"
          >
            <LogOut size={18} />
            Logout Account
          </button>
        </header>

        {/* Profile Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {menuItems.map((item, i) => (
            <motion.button 
              key={i}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm text-left flex items-start justify-between group"
            >
              <div className="flex gap-4">
                <div className="p-3 bg-neutral-50 rounded-xl transition-colors group-hover:bg-neutral-100">{item.icon}</div>
                <div>
                  <h3 className="font-bold text-neutral-900">{item.title}</h3>
                  <p className="text-neutral-500 text-sm">{item.subtitle}</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-neutral-300 group-hover:text-neutral-500 transition-colors" />
            </motion.button>
          ))}
        </div>

        {/* Quick Actions */}
        <section className="bg-blue-600 p-8 rounded-3xl text-white overflow-hidden relative shadow-xl shadow-blue-200">
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-2">Need a Checkup?</h2>
            <p className="text-blue-100 text-sm max-w-sm mb-6">Connect with our specialists for a routine screening or specific dental concern.</p>
            <button className="px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg shadow-blue-800/20">
              New Appointment
            </button>
          </div>
          <div className="absolute -right-8 -bottom-8 opacity-10 rotate-12">
            <User size={200} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default PatientProfilePage;
