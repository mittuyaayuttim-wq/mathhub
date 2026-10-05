import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  Play, 
  Sparkles, 
  GraduationCap, 
  Layers, 
  Zap,
  Filter
} from 'lucide-react';
import { Test, GradeLevel } from '../../types/index.ts';

interface TestsViewProps {
  userGrade?: GradeLevel;
  onStartTest: (testId: string) => void;
}

export const TestsView: React.FC<TestsViewProps> = ({
  userGrade = 5,
  onStartTest
}) => {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(userGrade);
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<10 | 20 | 30>(10);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/tests?grade=${selectedGrade}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTests(data.tests || []);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedGrade]);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <CheckCircle2 className="w-7 h-7 text-indigo-400" />
            Matematika Test Tizimi
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            5-8-sinflar uchun nazorat, oraliq va mustaqil sinov testlari
          </p>
        </div>

        {/* Grade switchers */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
          {([5, 6, 7, 8] as GradeLevel[]).map(g => (
            <button
              key={g}
              onClick={() => setSelectedGrade(g)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedGrade === g
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {g}-sinf
            </button>
          ))}
        </div>
      </div>

      {/* Test Length Variant Filter (10, 20, 30 ta savolli sinov) */}
      <div className="p-4 rounded-3xl glass-card border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-slate-200">
            Savollar soni varianti:
          </span>
        </div>

        <div className="flex items-center gap-2">
          {([10, 20, 30] as const).map(count => (
            <button
              key={count}
              onClick={() => setSelectedVariant(count)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedVariant === count
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {count} ta savol
            </button>
          ))}
        </div>
      </div>

      {/* Tests Grid */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400">Testlar yuklanmoqda...</p>
        </div>
      ) : tests.length === 0 ? (
        <div className="p-12 text-center glass-panel rounded-3xl border border-slate-800">
          <HelpCircle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-300">Ushbu sinf uchun testlar mavjud emas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {tests.map(test => {
            const displayCount = selectedVariant;
            const timeEstimate = displayCount === 10 ? 15 : displayCount === 20 ? 25 : 40;

            return (
              <div
                key={test.id}
                className="glass-card glass-card-hover rounded-3xl p-6 border border-slate-800/90 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {test.grade}-sinf sinovi
                    </span>
                    {test.isCustom && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        O'qituvchi testi
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white mb-2 leading-snug">
                    {test.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {test.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 mb-5">
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{displayCount} ta savol</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span>{timeEstimate} daqiqa</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
                  <div className="text-[11px] text-slate-400">
                    O'qituvchi: <span className="text-slate-200 font-semibold">{test.teacherName || "Alisher Qodirov"}</span>
                  </div>
                  <button
                    onClick={() => onStartTest(test.id)}
                    className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-[1.02]"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    Testni boshlash
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
