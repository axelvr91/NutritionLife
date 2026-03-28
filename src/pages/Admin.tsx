import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
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
  XCircle,
  Plus,
  Trash2,
  Edit2,
  X,
  Utensils,
  ShoppingBasket
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { cn } from '@/src/lib/utils';

// Types
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

interface Recipe {
  id: number;
  title: string;
  category: string;
  time: string;
  calories: string;
  image: string;
  description: string;
  ingredients: string[];
  instructions: string[];
}

interface Product {
  id: number;
  name: string;
  category: string;
  why: string;
  lookFor: string;
  image: string;
}

// Mock Data for chart
const incomeData = [
  { name: 'Mon', amount: 0 },
  { name: 'Tue', amount: 0 },
  { name: 'Wed', amount: 0 },
  { name: 'Thu', amount: 0 },
  { name: 'Fri', amount: 0 },
  { name: 'Sat', amount: 0 },
  { name: 'Sun', amount: 0 },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState('overview');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'appointment' | 'recipe' | 'product'>('appointment');
  const [editingItem, setEditingItem] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [aptRes, recRes, prodRes] = await Promise.all([
        fetch('/api/appointments'),
        fetch('/api/recipes'),
        fetch('/api/products')
      ]);

      if (aptRes.ok) setAppointments(await aptRes.json());
      if (recRes.ok) setRecipes(await recRes.json());
      if (prodRes.ok) setProducts(await prodRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers ---
  const handleDelete = async (type: string, id: number) => {
    if (!confirm('Segura que quieres eliminar este item?')) return;
    try {
      const res = await fetch(`/api/${type}/${id}`, { method: 'DELETE' });
      if (res.ok) fetchAllData();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data: any = Object.fromEntries(formData.entries());

    // Handle JSON fields for recipes
    if (modalType === 'recipe') {
      data.ingredients = data.ingredients.split('\n').filter((i: string) => i.trim());
      data.instructions = data.instructions.split('\n').filter((i: string) => i.trim());
    }

    const method = editingItem ? 'PUT' : 'POST';
    const url = editingItem ? `/api/${modalType}s/${editingItem.id}` : `/api/${modalType}s`;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setEditingItem(null);
        fetchAllData();
      }
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const openEditModal = (type: any, item: any) => {
    setModalType(type);
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const openAddModal = (type: any) => {
    setModalType(type);
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    navigate('/login');
  };

  // Stats
  const today = new Date().toISOString().split('T')[0];
  const todaysAppointments = appointments.filter(apt => apt.date === today);
  const totalPatients = new Set(appointments.map(a => a.email)).size;
  const monthlyRevenue = appointments.length * 99;

  const dynamicStats = [
    { label: 'Total De Pacientes', value: totalPatients.toString(), icon: Users, trend: '+12%', color: 'bg-blue-500' },
    { label: 'Citas Hoy', value: todaysAppointments.length.toString(), icon: Calendar, trend: '+3', color: 'bg-emerald-500' },
    { label: 'Recaudación Mensual', value: `$${monthlyRevenue.toLocaleString()}`, icon: DollarSign, trend: '+18%', color: 'bg-primary' },
    { label: 'Promedio de Satisfacción', value: '4.9/5', icon: TrendingUp, trend: '+0.2', color: 'bg-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <Users size={20} />
            </div>
            <span className="text-xl font-bold text-gray-900">Panel De Admin</span>
          </div>
        </div>

        <nav className="flex-grow p-4 space-y-2">
          {[
            { id: 'overview', label: 'Resumen', icon: LayoutDashboard },
            { id: 'patients', label: 'Pacientes', icon: Users },
            { id: 'recipes', label: 'Recetas', icon: Utensils },
            { id: 'shop', label: 'Tienda', icon: ShoppingBasket },
            { id: 'settings', label: 'Configuraciones', icon: Settings },
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
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={18} />
            <span>Salir</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 overflow-y-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Panel De Admin</h1>
            <p className="text-gray-500">Controla tu informacion importante</p>
          </div>
        </header>

        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {dynamicStats.map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
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
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Income Chart */}
              <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-8">Grafica De Ingresos</h2>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={incomeData}>
                      <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#286420" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#286420" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                      <Area type="monotone" dataKey="amount" stroke="#286420" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Today's Schedule */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Agenda De Hoy</h2>
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
                            {apt.time}
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
                    <p className="text-sm text-gray-500 text-center py-4">No hay citas para hoy.</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'patients' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Pacientes</h2>
                <button onClick={() => openAddModal('appointment')} className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center">
                  <Plus size={18} className="mr-2" /> Agregar Paciente
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Nombre</th>
                      <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Edad</th>
                      <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Objetivo</th>
                      <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Fecha</th>
                      <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {appointments.map((patient) => (
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
                            <div className={cn("w-2 h-2 rounded-full", patient.status === 'Confirmed' ? "bg-emerald-500" : "bg-orange-500")} />
                            <span className="text-sm text-gray-600">{patient.status}</span>
                          </div>
                        </td>
                        <td className="px-8 py-4 text-sm text-gray-600">{patient.date}</td>
                        <td className="px-8 py-4">
                          <div className="flex items-center space-x-2">
                            <button onClick={() => openEditModal('appointment', patient)} className="p-2 text-gray-400 hover:text-primary transition-colors">
                              <Edit2 size={18} />
                            </button>
                            <button onClick={() => handleDelete('appointments', patient.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'recipes' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Administrar Recetas</h2>
                <button onClick={() => openAddModal('recipe')} className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center">
                  <Plus size={18} className="mr-2" /> Agregar Receta
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
                {recipes.map((recipe) => (
                  <div key={recipe.id} className="border border-gray-100 rounded-2xl overflow-hidden group">
                    <div className="aspect-video relative">
                      <img src={recipe.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                        <button onClick={() => openEditModal('recipe', recipe)} className="p-2 bg-white rounded-full text-primary hover:scale-110 transition-transform">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete('recipes', recipe.id)} className="p-2 bg-white rounded-full text-red-500 hover:scale-110 transition-transform">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-gray-900">{recipe.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{recipe.category} • {recipe.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'shop' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Recomendaciones de la Tienda</h2>
                <button onClick={() => openAddModal('product')} className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center">
                  <Plus size={18} className="mr-2" /> Agregar Producto
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
                {products.map((product) => (
                  <div key={product.id} className="border border-gray-100 rounded-2xl overflow-hidden group">
                    <div className="aspect-square relative">
                      <img src={product.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                        <button onClick={() => openEditModal('product', product)} className="p-2 bg-white rounded-full text-primary hover:scale-110 transition-transform">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete('products', product.id)} className="p-2 bg-white rounded-full text-red-500 hover:scale-110 transition-transform">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-gray-900">{product.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">{product.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* CRUD Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl p-8">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"><X size={24} /></button>
              <h2 className="text-2xl font-bold mb-6">{editingItem ? 'Edit' : 'Add'} {modalType.charAt(0).toUpperCase() + modalType.slice(1)}</h2>

              <form onSubmit={handleSave} className="space-y-6">
                {modalType === 'appointment' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                        <input name="fullName" defaultValue={editingItem?.fullName} required className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                        <input name="email" type="email" defaultValue={editingItem?.email} required className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Date</label>
                        <input name="date" type="date" defaultValue={editingItem?.date} required className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Time</label>
                        <input name="time" defaultValue={editingItem?.time} required className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Status</label>
                      <select name="status" defaultValue={editingItem?.status || 'Confirmed'} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none">
                        <option value="Confirmed">Confirmed</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Goals</label>
                      <textarea name="goals" defaultValue={editingItem?.goals} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none h-24 resize-none" />
                    </div>
                  </>
                )}

                {modalType === 'recipe' && (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Titulo</label>
                      <input name="title" defaultValue={editingItem?.title} required className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Categoria</label>
                        <select name="category" defaultValue={editingItem?.category} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none">
                          <option value="Vegan">Vegano</option>
                          <option value="High Protein">Alto En Proteina</option>
                          <option value="Anti-inflammatory">Anti-inflamatorio</option>
                          <option value="Low Carb">Bajo En Carbohidratos</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Tiempo (e.n. 20 min)</label>
                        <input name="time" defaultValue={editingItem?.time} required className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Imagen URL</label>
                      <input name="image" defaultValue={editingItem?.image} required className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Calorias</label>
                      <input name="calories" defaultValue={editingItem?.calories} required className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Descripcion</label>
                      <textarea name="description" defaultValue={editingItem?.description} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none h-20 resize-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Ingredientes (uno por linea)</label>
                      <textarea name="ingredients" defaultValue={editingItem?.ingredients?.join('\n')} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none h-32 resize-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Instrucciones (uno por linea)</label>
                      <textarea name="instructions" defaultValue={editingItem?.instructions?.join('\n')} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none h-32 resize-none" />
                    </div>
                  </>
                )}

                {modalType === 'product' && (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Nombre</label>
                      <input name="name" defaultValue={editingItem?.name} required className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Categoria</label>
                      <select name="category" defaultValue={editingItem?.category} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none">
                        <option value="Pantry">Pantry</option>
                        <option value="Proteins">Proteins</option>
                        <option value="Produce">Produce</option>
                        <option value="Snacks">Snacks</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Imagen URL</label>
                      <input name="image" defaultValue={editingItem?.image} required className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Porque es recomendado</label>
                      <textarea name="why" defaultValue={editingItem?.why} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none h-24 resize-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Que buscar</label>
                      <textarea name="lookFor" defaultValue={editingItem?.lookFor} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 outline-none h-24 resize-none" />
                    </div>
                  </>
                )}

                <div className="pt-4">
                  <button type="submit" className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                    {editingItem ? 'Update' : 'Create'} {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

