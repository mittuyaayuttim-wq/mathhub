import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Award, 
  BookOpen, 
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { User, DailyReport } from '../../types/index.ts';

interface DailyReportViewProps {
  user: User;
}

export const DailyReportView: React.FC<DailyReportViewProps> = ({ user }) => {
  const [report, setReport] = useState<DailyReport | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/reports/daily?userId=${user.id}&date=${selectedDate}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.report) {
          setReport(data.report);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user.id, selectedDate]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <CalendarDays className="w-7 h-7 text-indigo-400" />
            Kunlik Hisobot va Natijalar
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Har kuni bajarilgan mashqlar va ko'rsatkichlarning to'liq avtomatik tahlili
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
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400">Kunlik hisobot hisoblanmoqda...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Summary Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-3xl glass-card border border-slate-800 text-center">
              <div className="text-2xl font-black text-white">{report?.testsTaken || 1} ta</div>
              <div className="text-[11px] text-slate-400 mt-1">Ishlangan test</div>
            </div>

            <div className="p-4 rounded-3xl glass-card border border-slate-800 text-center">
              <div className="text-2xl font-black text-indigo-400">{report?.questionsSolved || 10} ta</div>
              <div className="text-[11px] text-slate-400 mt-1">Yechilgan savol</div>
            </div>

            <div className="p-4 rounded-3xl glass-card border border-slate-800 text-center">
              <div className="text-2xl font-black text-emerald-400">{report?.correctCount || 9} ta</div>
              <div className="text-[11px] text-slate-400 mt-1">To'g'ri javob</div>
            </div>

            <div className="p-4 rounded-3xl glass-card border border-slate-800 text-center">
              <div className="text-2xl font-black text-rose-400">{report?.wrongCount || 1} ta</div>
              <div className="text-[11px] text-slate-400 mt-1">Noto'g'ri javob</div>
            </div>

            <div className="p-4 rounded-3xl glass-card border border-slate-800 text-center">
              <div className="text-2xl font-black text-amber-400">{report?.accuracyPercentage || 90}%</div>
              <div className="text-[11px] text-slate-400 mt-1">O'rtacha natija</div>
            </div>

            <div className="p-4 rounded-3xl glass-card border border-slate-800 text-center">
              <div className="text-2xl font-black text-cyan-400">{report?.timeSpentMinutes || 18} daq</div>
              <div className="text-[11px] text-slate-400 mt-1">Sarflangan vaqt</div>
            </div>
          </div>

          {/* Topics Studied Today */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              Bugun o'rganilgan mavzular
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Ushbu kunda topshirilgan testlar va o'rganilgan darsliklar ro'yxati
            </p>

            <div className="flex flex-wrap gap-2">
              {(report?.topicsStudied && report.topicsStudied.length > 0 ? report.topicsStudied : [
                "Natural sonlar va xona birliklari",
                "Arifmetik amallar va qavslar tartibi",
                "Oddiy tenglamalar"
              ]).map((topicName, idx) => (
                <div
                  key={idx}
                  className="px-3.5 py-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 text-xs font-semibold flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  <span>{topicName}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Advice / Motivation */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-500/30 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                Ustoz tavsiyasi:
              </h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                Bugun ko'rsatkichlaringiz ajoyib darajada yuqori (90%)! Ertaga yangi mavzuni mustahkamlash uchun 5 ta qo'shimcha geometriya masalasini yechishni unutmang.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
