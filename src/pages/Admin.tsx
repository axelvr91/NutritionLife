import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Search, 
  MoreVertical, 
  FileText, 
  Clock,
  LayoutDashboard,
  Settings,
  LogOut,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { cn } from '@/src/lib/utils';

// Mock Data for stats and chart
const incomeData = [
  { name: 'Mon', amount: 1200 },
  { name: 'Tue', amount: 1900 },
  { name: 'Wed', amount: 1500 },
  { name: 'Thu', amount: 2100 },
  { name: 'Fri', amount: 2400 },
  { name: 'Sat', amount: 1100 },
  { name: 'Sun', amount: 800 },
];

interface Appointment {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  age: number;
  weight: number;
  height: number;
  goals: string;
  conditions: string;
  date: string;
  time: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState('overview');
  const [realAppointments, setRealAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments');
      if (response.ok) {
        const data = await response.json();
        setRealAppointments(data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter today's appointments for the schedule
  const today = new Date().toISOString().split('T')[0];
  const todaysAppointments = realAppointments.filter(apt => apt.date === today);

  // Calculate real stats
  const totalPatients = new Set(realAppointments.map(a => a.email)).size;
  const appointmentsTodayCount = todaysAppointments.length;
  const monthlyRevenue = realAppointments.length * 99; // Assuming $99 per session

  const dynamicStats = [
    { label: 'Total Patients', value: totalPatients.toString(), icon: Users, trend: '+12%', color: 'bg-blue-500' },
    { label: 'Appointments Today', value: appointmentsTodayCount.toString(), icon: Calendar, trend: '+3', color: 'bg-emerald-500' },
    { label: 'Monthly Revenue', value: `$${monthlyRevenue.toLocaleString()}`, icon: DollarSign, trend: '+18%', color: 'bg-primary' },
    { label: 'Avg. Satisfaction', value: '4.9/5', icon: TrendingUp, trend: '+0.2', color: 'bg-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <Users size={20} />
            </div>
            <span className="text-xl font-bold text-gray-900">Admin Panel</span>
          </div>
        </div>
        
        <nav className="flex-grow p-4 space-y-2">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'patients', label: 'Patients', icon: Users },
            { id: 'appointments', label: 'Appointments', icon: Calendar },
            { id: 'income', label: 'Income', icon: DollarSign },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                activeTab === item.id 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-gray-500 hover:bg-gray-50"
              )}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 overflow-y-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, Dr. Elena</h1>
            <p className="text-gray-500">Here's what's happening with your practice today.</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input 
                type="text" 
                placeholder="Search anything..."
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
              />
            </div>
            <button className="p-2 bg-white border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 relative">
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              <Calendar size={20} />
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {dynamicStats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-3 rounded-2xl text-white", stat.color)}>
                  <stat.icon size={24} />
                </div>
                <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
                  {stat.trend}
                </span>
              </div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Income Chart */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-gray-900">Revenue Overview</h2>
              <select className="bg-gray-50 border-none text-sm font-bold text-gray-500 rounded-lg px-3 py-1 outline-none">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={incomeData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#286420" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#286420" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 12 }} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#286420" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorAmount)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Today's Schedule</h2>
            <div className="space-y-6">
              {todaysAppointments.length > 0 ? todaysAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between group">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-bg-light flex items-center justify-center text-primary font-bold">
                      {apt.fullName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{apt.fullName}</h4>
                      <div className="flex items-center text-xs text-gray-400 mt-1">
                        <Clock size={12} className="mr-1" />
                        {apt.time} • {apt.goals.substring(0, 15)}...
                      </div>
                    </div>
                  </div>
                  <div className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    apt.status === 'Confirmed' ? "bg-emerald-50 text-emerald-500" : "bg-orange-50 text-orange-500"
                  )}>
                    {apt.status}
                  </div>
                </div>
              )) : (
                <p className="text-sm text-gray-500 text-center py-4">No appointments for today.</p>
              )}
            </div>
            <button className="w-full mt-8 py-3 rounded-xl border border-gray-100 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all">
              View Full Calendar
            </button>
          </div>
        </div>

        {/* Patients Table */}
        <div className="mt-10 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Patient Expedients</h2>
            <button className="text-primary text-sm font-bold hover:underline">View All Patients</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Patient</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Age</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Goal</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Last Visit</th>
                  <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {realAppointments.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                          {patient.fullName.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900">{patient.fullName}</span>
                          <span className="text-[10px] text-gray-400">{patient.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-sm text-gray-600">{patient.age}</td>
                    <td className="px-8 py-4">
                      <span className="px-3 py-1 rounded-lg bg-bg-light text-primary text-xs font-bold">
                        {patient.goals.substring(0, 20)}...
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center space-x-2">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          patient.status === 'Confirmed' ? "bg-emerald-500" : "bg-gray-300"
                        )} />
                        <span className="text-sm text-gray-600">{patient.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-sm text-gray-600">{patient.date}</td>
                    <td className="px-8 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                          <FileText size={18} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
