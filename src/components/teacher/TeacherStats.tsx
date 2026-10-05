import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  Trophy, 
  Clock, 
  Users, 
  Award,
  Layers
} from 'lucide-react';

export const TeacherStats: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-400">O'qituvchi statistikasi yuklanmoqda...</p>
      </div>
    );
  }

  const classData = stats?.classStats || [
    { className: '5-A sinf', grade: 5, studentCount: 28, averageScore: 84 },
    { className: '6-B sinf', grade: 6, studentCount: 26, averageScore: 78 },
    { className: '7-A sinf', grade: 7, studentCount: 25, averageScore: 88 },
    { className: '8-V sinf', grade: 8, studentCount: 24, averageScore: 81 },
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <BarChart3 className="w-7 h-7 text-emerald-400" />
          O'qituvchi Tahliliy Statistikasi
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Sinflar va o'quvchilar kesimida matematika fani bo'yicha to'liq o'zlashtirish tahlili
        </p>
      </div>

      {/* KPI Overviews */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-3xl p-5 border border-slate-800">
          <div className="text-xs font-semibold text-slate-400 mb-1">Umumiy o'rtacha ball</div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">
            {stats?.overallAvg || 84}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">4 ta sinf kesimida</p>
        </div>

        <div className="glass-card rounded-3xl p-5 border border-slate-800">
          <div className="text-xs font-semibold text-slate-400 mb-1">Jami o'quvchilar</div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            103 nafar
          </div>
          <p className="text-[11px] text-indigo-400 mt-1">5-8 sinflar</p>
        </div>

        <div className="glass-card rounded-3xl p-5 border border-slate-800">
          <div className="text-xs font-semibold text-slate-400 mb-1">Topshirilgan testlar</div>
          <div className="text-2xl sm:text-3xl font-black text-indigo-400">
            {stats?.totalTestsConducted || 24} ta
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Oraliq va mustaqil</p>
        </div>

        <div className="glass-card rounded-3xl p-5 border border-slate-800">
          <div className="text-xs font-semibold text-slate-400 mb-1">O'rtacha test vaqti</div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400">
            14.2 daqiqa
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Me'yor: 20 daqiqa</p>
        </div>
      </div>

      {/* Class Averages Bar Chart Visual */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800">
        <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-400" />
          Sinf bo'yicha o'rtacha ballar
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Har bir sinfning jami testlardagi umumiy o'zlashtirish foizi
        </p>

        <div className="space-y-4">
          {classData.map((cd: any) => (
            <div key={cd.className} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-white">{cd.className} ({cd.studentCount} o'quvchi)</span>
                <span className="text-emerald-400 font-bold">{cd.averageScore}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700"
                  style={{ width: `${cd.averageScore}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weak Topics & Top Students */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Difficult Topics */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800">
          <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Qiyin o'zlashtirilayotgan mavzular (Heatmap)
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Qo'shimcha dars va tushuntirish talab qiladigan boblar
          </p>

          <div className="space-y-3">
            {[
              { title: 'Kvadrat tenglamalar va diskriminant', grade: 8, mastery: 64 },
              { title: 'Doira va aylana yuzasi (π)', grade: 6, mastery: 68 },
              { title: 'Algebraik kasrlarni soddalashtirish', grade: 8, mastery: 71 },
              { title: 'Nisbat va proporsiya masalalari', grade: 6, mastery: 74 },
              { title: 'Birhad va ko\'phadlar ko\'paytmasi', grade: 7, mastery: 76 }
            ].map(m => (
              <div key={m.title} className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">{m.title}</div>
                  <div className="text-[11px] text-slate-400">{m.grade}-sinf dasturi</div>
                </div>
                <div className="text-right">
                  <span className="text-amber-400 font-bold">{m.mastery}%</span>
                  <div className="text-[10px] text-rose-400">Past o'zlashtirish</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Highest Performing Students */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800">
          <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            Eng yuqori natijali o'quvchilar
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Doimiy A'lo (90%+) ko'rsatayotgan o'quvchilar
          </p>

          <div className="space-y-3">
            {[
              { name: 'Dilnoza Rahimova', class: '8-V', score: '96%', points: '610 ball', streak: '14 kun' },
              { name: 'Jasur Ergashev', class: '7-A', score: '94%', points: '520 ball', streak: '11 kun' },
              { name: 'Nodir Karimov', class: '5-A', score: '91%', points: '240 ball', streak: '5 kun' },
              { name: 'Malika Toshmatova', class: '6-B', score: '88%', points: '380 ball', streak: '7 kun' }
            ].map((st, i) => (
              <div key={st.name} className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                    i === 0 ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-bold text-white">{st.name}</div>
                    <div className="text-[11px] text-slate-400">{st.class} sinfi</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-black text-emerald-400">{st.score}</span>
                  <div className="text-[10px] text-slate-400">{st.streak} 🔥</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
