import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Award, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  TrendingUp, 
  Flame, 
  Star,
  Calendar,
  Layers
} from 'lucide-react';
import { User, TestAttempt } from '../../types/index.ts';

interface StatsViewProps {
  user: User;
}

export const StatsView: React.FC<StatsViewProps> = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{
    points: number;
    streak: number;
    totalTests: number;
    avgPercentage: number;
    totalCorrect: number;
    totalWrong: number;
    totalTimeMinutes: number;
    marks: Record<string, number>;
    recentAttempts: TestAttempt[];
  } | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/stats/student/${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.stats) {
          setStats(data.stats);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user.id]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-400">Statistika hisoblanmoqda...</p>
      </div>
    );
  }

  const marksData = stats?.marks || {
    "A'lo": 1,
    "Juda yaxshi": 1,
    "Yaxshi": 0,
    "Qoniqarli": 0,
    "Ko'proq mashq qilish kerak": 0
  };

  const totalGraded = Object.values(marksData).reduce((a, b) => a + b, 0) || 1;

  const gradingLevels = [
    { label: "A'lo (90–100%)", count: marksData["A'lo"] || 0, color: 'from-emerald-500 to-teal-400', textColor: 'text-emerald-400' },
    { label: "Juda yaxshi (80–89%)", count: marksData["Juda yaxshi"] || 0, color: 'from-blue-500 to-indigo-500', textColor: 'text-blue-400' },
    { label: "Yaxshi (70–79%)", count: marksData["Yaxshi"] || 0, color: 'from-indigo-500 to-violet-500', textColor: 'text-indigo-400' },
    { label: "Qoniqarli (60–69%)", count: marksData["Qoniqarli"] || 0, color: 'from-amber-500 to-yellow-500', textColor: 'text-amber-400' },
    { label: "Ko'proq mashq kerak (0–59%)", count: marksData["Ko'proq mashq qilish kerak"] || 0, color: 'from-rose-500 to-red-500', textColor: 'text-rose-400' }
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <BarChart3 className="w-7 h-7 text-indigo-400" />
          Mening Natijalarim va Statistikam
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          O'quv yutuqlaringiz, baholash darajalari va testlar tahlili
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-3xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>O'rtacha ko'rsatkich</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {stats?.avgPercentage || 85}%
          </div>
          <p className="text-[11px] text-emerald-400 font-semibold mt-1">
            Davlat standarti bo'yicha yuqori
          </p>
        </div>

        <div className="glass-card rounded-3xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>Yechilgan testlar</span>
            <Award className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {stats?.totalTests || 0} ta
          </div>
          <p className="text-[11px] text-indigo-400 font-semibold mt-1">
            Topshirilgan sinovlar
          </p>
        </div>

        <div className="glass-card rounded-3xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>To'g'ri javoblar ulushi</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {stats?.totalCorrect || 0} <span className="text-sm font-normal text-slate-400">/ {(stats?.totalCorrect || 0) + (stats?.totalWrong || 0)}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Xatolar soni: {stats?.totalWrong || 0} ta
          </p>
        </div>

        <div className="glass-card rounded-3xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>O'rganish vaqti</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {stats?.totalTimeMinutes || 24} <span className="text-sm font-normal text-slate-400">daq</span>
          </div>
          <p className="text-[11px] text-amber-400 font-semibold mt-1">
            Faol o'zlashtirish vaqti
          </p>
        </div>
      </div>

      {/* Baholash Tizimi - Progress Bars Visualizer */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800">
        <h3 className="text-base sm:text-lg font-bold text-white mb-1 flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-400" />
          Baholash tizimi bo'yicha taqsimot
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Barcha topshirilgan testlar natijalarining 5 ballik shkala bo'yicha foizlari
        </p>

        <div className="space-y-4">
          {gradingLevels.map((lvl) => {
            const pct = Math.round((lvl.count / totalGraded) * 100);
            return (
              <div key={lvl.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-200">{lvl.label}</span>
                  <span className={lvl.textColor}>
                    {lvl.count} ta test ({pct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800/80">
                  <div
                    className={`bg-gradient-to-r ${lvl.color} h-full rounded-full transition-all duration-700`}
                    style={{ width: `${Math.max(pct, lvl.count > 0 ? 6 : 0)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Attempts History Table */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-400" />
          Oxirgi topshirilgan testlar tarixi
        </h3>

        {!stats?.recentAttempts || stats.recentAttempts.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">
            Hozircha topshirilgan testlar mavjud emas. Testlar bo'limidan sinovni boshlang!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="pb-3 pl-2">Test nomi</th>
                  <th className="pb-3">Sana</th>
                  <th className="pb-3 text-center">Savollar</th>
                  <th className="pb-3 text-center">Natija</th>
                  <th className="pb-3 text-center">Baho</th>
                  <th className="pb-3 text-right pr-2">Sarflangan vaqt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {stats.recentAttempts.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 pl-2 text-white font-bold max-w-[220px] truncate">
                      {att.testTitle}
                    </td>
                    <td className="py-3.5 text-slate-400">
                      {new Date(att.completedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 text-center text-slate-300">
                      <span className="text-emerald-400 font-bold">{att.correctCount}</span> / {att.totalQuestions}
                    </td>
                    <td className="py-3.5 text-center">
                      <span className={`font-black ${
                        att.percentage >= 80 ? 'text-emerald-400' :
                        att.percentage >= 60 ? 'text-indigo-400' : 'text-rose-400'
                      }`}>
                        {att.percentage}%
                      </span>
                    </td>
                    <td className="py-3.5 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        att.gradeMark === "A'lo" ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        att.gradeMark === "Juda yaxshi" ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                        att.gradeMark === "Yaxshi" ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                        'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {att.gradeMark}
                      </span>
                    </td>
                    <td className="py-3.5 text-right pr-2 text-slate-400 font-mono">
                      {Math.floor(att.timeSpentSeconds / 60)} daq {att.timeSpentSeconds % 60} s
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
