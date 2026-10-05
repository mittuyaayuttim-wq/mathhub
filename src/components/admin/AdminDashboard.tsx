import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Layers, 
  BookOpen, 
  CheckCircle2, 
  BarChart3, 
  Settings, 
  Database,
  Link2,
  Trash2,
  RefreshCw
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchOverview = () => {
    setLoading(true);
    fetch('/api/admin/overview')
      .then(res => res.json())
      .then(d => {
        if (d.success) {
          setData(d.overview);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-purple-400" />
            Administrator Boshqaruv Markazi
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Platformaning barcha modullari, foydalanuvchilar va bazani to'liq boshqarish
          </p>
        </div>

        <button
          onClick={fetchOverview}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
          Yangilash
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-3xl p-5 border border-slate-800">
          <div className="text-xs font-semibold text-slate-400 mb-1">Jami foydalanuvchilar</div>
          <div className="text-2xl sm:text-3xl font-black text-purple-400">
            {data?.totalUsers || 6} nafar
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {data?.studentsCount || 4} o'quvchi, {data?.teachersCount || 1} o'qituvchi
          </p>
        </div>

        <div className="glass-card rounded-3xl p-5 border border-slate-800">
          <div className="text-xs font-semibold text-slate-400 mb-1">Mavzular bazasi</div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {data?.topicsCount || 23} ta
          </div>
          <p className="text-[11px] text-indigo-400 mt-1">5-8 sinf dasturi</p>
        </div>

        <div className="glass-card rounded-3xl p-5 border border-slate-800">
          <div className="text-xs font-semibold text-slate-400 mb-1">Sinflar & Guruhlar</div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">
            {data?.classesCount || 4} ta sinf
          </div>
          <p className="text-[11px] text-slate-500 mt-1">5-A, 6-B, 7-A, 8-V</p>
        </div>

        <div className="glass-card rounded-3xl p-5 border border-slate-800">
          <div className="text-xs font-semibold text-slate-400 mb-1">Kundalik holati</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-lg font-bold text-cyan-400">Sinxronlangan</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Mock/Integration API</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-400" />
          Foydalanuvchilar ro'yxati va rollar (RBAC)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="pb-3 pl-2">Ism Familiya</th>
                <th className="pb-3">Login</th>
                <th className="pb-3 text-center">Rol</th>
                <th className="pb-3 text-center">Sinf</th>
                <th className="pb-3 text-center">Ball</th>
                <th className="pb-3 text-right pr-2">Ro'yxatdan o'tgan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {data?.users?.map((u: any) => (
                <tr key={u.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 pl-2 font-bold text-white">
                    {u.name}
                  </td>
                  <td className="py-3.5 text-slate-400 font-mono">
                    @{u.login}
                  </td>
                  <td className="py-3.5 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      u.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                      u.role === 'teacher' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    }`}>
                      {u.role === 'admin' ? 'Administrator' : u.role === 'teacher' ? 'O\'qituvchi' : 'O\'quvchi'}
                    </span>
                  </td>
                  <td className="py-3.5 text-center text-slate-300">
                    {u.grade ? `${u.grade}-sinf` : "—"}
                  </td>
                  <td className="py-3.5 text-center font-bold text-amber-400">
                    {u.points || 0} ⭐
                  </td>
                  <td className="py-3.5 text-right pr-2 text-slate-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
