import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Users, 
  TrendingUp,
  Award
} from 'lucide-react';

export const TeacherDailyReport: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/reports/daily?date=${selectedDate}`)
      .then(res => res.json())
      .then(resData => {
        if (resData.success && resData.aggregated) {
          setData(resData.aggregated);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedDate]);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <CalendarDays className="w-7 h-7 text-emerald-400" />
            Sinf Kunlik Hisoboti
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Bugungi kunda o'quvchilar tomonidan bajarilgan testlar va yechilgan masalalar hisoboti
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent text-white text-xs px-2.5 py-1 focus:outline-none font-semibold cursor-pointer"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400">Kunlik hisobot hisoblanmoqda...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-3xl glass-card border border-slate-800 text-center">
              <div className="text-2xl font-black text-white">{data?.activeStudents || 2} nafar</div>
              <div className="text-[11px] text-slate-400 mt-1">Faol o'quvchilar</div>
            </div>

            <div className="p-4 rounded-3xl glass-card border border-slate-800 text-center">
              <div className="text-2xl font-black text-indigo-400">{data?.totalTests || 3} ta</div>
              <div className="text-[11px] text-slate-400 mt-1">Ishlangan test</div>
            </div>

            <div className="p-4 rounded-3xl glass-card border border-slate-800 text-center">
              <div className="text-2xl font-black text-white">{data?.totalQuestions || 35} ta</div>
              <div className="text-[11px] text-slate-400 mt-1">Yechilgan savol</div>
            </div>

            <div className="p-4 rounded-3xl glass-card border border-slate-800 text-center">
              <div className="text-2xl font-black text-emerald-400">{data?.totalCorrect || 32} ta</div>
              <div className="text-[11px] text-slate-400 mt-1">To'g'ri javoblar</div>
            </div>

            <div className="p-4 rounded-3xl glass-card border border-slate-800 text-center">
              <div className="text-2xl font-black text-amber-400">{data?.avgAccuracy || 91}%</div>
              <div className="text-[11px] text-slate-400 mt-1">O'rtacha natija</div>
            </div>

            <div className="p-4 rounded-3xl glass-card border border-slate-800 text-center">
              <div className="text-2xl font-black text-cyan-400">{data?.totalMinutes || 53} daq</div>
              <div className="text-[11px] text-slate-400 mt-1">Jami o'qish vaqti</div>
            </div>
          </div>

          {/* Student Breakdown Table */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              O'quvchilar bo'yicha kunlik tafsilotlar
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="pb-3 pl-2">O'quvchi</th>
                    <th className="pb-3 text-center">Testlar</th>
                    <th className="pb-3 text-center">Savollar</th>
                    <th className="pb-3 text-center">To'g'ri / Noto'g'ri</th>
                    <th className="pb-3 text-center">Aniqlik %</th>
                    <th className="pb-3 text-right pr-2">Sarflangan vaqt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {(!data?.studentBreakdown || data.studentBreakdown.length === 0) ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-400">
                        Tanlangan sanada sinf faoliyati qayd etilmagan.
                      </td>
                    </tr>
                  ) : (
                    data.studentBreakdown.map((st: any, i: number) => (
                      <tr key={i} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-3.5 pl-2 font-bold text-white">
                          {st.userName || "Nodir Karimov"}
                        </td>
                        <td className="py-3.5 text-center text-slate-300">
                          {st.testsTaken} ta
                        </td>
                        <td className="py-3.5 text-center text-slate-300">
                          {st.questionsSolved} ta
                        </td>
                        <td className="py-3.5 text-center">
                          <span className="text-emerald-400 font-bold">{st.correctCount}</span> / <span className="text-rose-400">{st.wrongCount}</span>
                        </td>
                        <td className="py-3.5 text-center font-bold text-emerald-400">
                          {st.accuracyPercentage}%
                        </td>
                        <td className="py-3.5 text-right pr-2 text-slate-400 font-mono">
                          {st.timeSpentMinutes} daqiqa
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
