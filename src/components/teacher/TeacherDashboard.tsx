import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Users, 
  Layers, 
  CheckCircle2, 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  PlusCircle, 
  Link2, 
  Clock, 
  ArrowRight,
  Flame,
  Star,
  Award
} from 'lucide-react';
import { User } from '../../types/index.ts';

interface TeacherDashboardProps {
  user: User;
  onNavigateTab: (tab: string, param?: any) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  user,
  onNavigateTab
}) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/teacher/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data.stats);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Teacher Welcome Header */}
      <div className="relative overflow-hidden rounded-3xl glass-panel border border-slate-800 p-6 sm:p-8 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/50">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-3">
              <GraduationCap className="w-4 h-4" />
              <span>O'qituvchi Boshqaruv Markazi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Xush kelibsiz, {user.name} {user.surname}! 👨‍🏫
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
              5–8-sinflar matematika fanidan dars jarayoni, o'quvchilar reytingi, yangi testlar va Kundalik integratsiyasini to'liq nazorat qiling.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-5">
              <button
                onClick={() => onNavigateTab('teacher_create_test')}
                className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all hover:scale-[1.02]"
              >
                <PlusCircle className="w-4 h-4" />
                Yangi test yaratish
              </button>
              <button
                onClick={() => onNavigateTab('teacher_classes')}
                className="px-5 py-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all"
              >
                <Users className="w-4 h-4 text-emerald-400" />
                O'quvchilar ro'yxati
              </button>
              <button
                onClick={() => onNavigateTab('kundalik')}
                className="px-5 py-2.5 rounded-2xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all"
              >
                <Link2 className="w-4 h-4" />
                Kundalik sinxronlash
              </button>
            </div>
          </div>

          {/* Aggregate KPI */}
          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-2xl sm:text-3xl font-black text-white">4 ta</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Biriktirilgan sinf</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">103 ta</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Jami o'quvchi</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-2xl sm:text-3xl font-black text-indigo-400">{stats?.overallAvg || 84}%</div>
              <div className="text-[11px] text-slate-400 mt-0.5">O'rtacha o'zlashtirish</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-2xl sm:text-3xl font-black text-amber-400">18 ta</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Faol testlar</div>
            </div>
          </div>
        </div>
      </div>

      {/* Class Performance Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            Sinflar bo'yicha ko'rsatkichlar
          </h2>
          <button
            onClick={() => onNavigateTab('teacher_classes')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
          >
            Batafsil boshqarish
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: '5-A sinf', grade: 5, students: 28, avg: 84, topStudent: 'Nodir Karimov' },
            { name: '6-B sinf', grade: 6, students: 26, avg: 78, topStudent: 'Malika Toshmatova' },
            { name: '7-A sinf', grade: 7, students: 25, avg: 88, topStudent: 'Jasur Ergashev' },
            { name: '8-V sinf', grade: 8, students: 24, avg: 81, topStudent: 'Dilnoza Rahimova' },
          ].map((cl) => (
            <div key={cl.name} className="glass-card rounded-3xl p-5 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {cl.name}
                  </span>
                  <span className="text-xs font-black text-emerald-400">
                    {cl.avg}% o'rtacha
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  O'quvchilar: <strong className="text-slate-200">{cl.students} nafar</strong>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Sinf yetakchisi: <strong className="text-amber-300">{cl.topStudent}</strong>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <button
                  onClick={() => onNavigateTab('teacher_classes')}
                  className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  Jurnalni ko'rish
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weak Topics Heatmap & Recent Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Difficult Topics */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Qiyin o'zlashtirilayotgan mavzular
            </h3>
            <span className="text-[11px] text-amber-400 font-bold">Diqqat talab</span>
          </div>

          <div className="space-y-3">
            {[
              { topic: 'Kvadrat tenglamalar va diskriminant', grade: 8, pct: 64 },
              { topic: 'Doira va aylana yuzasi (π)', grade: 6, pct: 68 },
              { topic: 'Algebraik kasrlarni soddalashtirish', grade: 8, pct: 71 },
              { topic: 'Nisbat va proporsiya masalalari', grade: 6, pct: 74 },
            ].map(item => (
              <div key={item.topic} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="text-white">{item.topic} ({item.grade}-sinf)</span>
                  <span className="text-amber-400 font-bold">{item.pct}%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full rounded-full"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Submissions Feed */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" />
              So'nggi topshirilgan testlar (Real-time)
            </h3>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>

          <div className="space-y-3">
            {[
              { student: 'Jasur Ergashev', class: '7-A', test: 'Chiziqli tenglamalar', pct: 95, mark: "A'lo", time: '10 daqiqa oldin' },
              { student: 'Malika Toshmatova', class: '6-B', test: 'Nisbat va proporsiya', pct: 80, mark: "Juda yaxshi", time: '35 daqiqa oldin' },
              { student: 'Nodir Karimov', class: '5-A', test: 'Natural sonlar va amallar', pct: 90, mark: "A'lo", time: '1 soat oldin' },
              { student: 'Dilnoza Rahimova', class: '8-V', test: 'Kvadrat tenglamalar', pct: 85, mark: "Juda yaxshi", time: '2 soat oldin' }
            ].map((sub, sIdx) => (
              <div key={sIdx} className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800/60 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">{sub.student} <span className="text-slate-500 font-normal">({sub.class})</span></div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{sub.test} • {sub.time}</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-emerald-400">{sub.pct}%</div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 font-bold border border-emerald-500/20">
                    {sub.mark}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
