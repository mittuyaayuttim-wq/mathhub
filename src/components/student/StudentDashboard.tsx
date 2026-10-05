import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Star, 
  Target, 
  Trophy, 
  CheckCircle2, 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  ChevronRight, 
  TrendingUp, 
  Clock, 
  Award,
  Zap,
  Play
} from 'lucide-react';
import { User, Topic, Test } from '../../types/index.ts';

interface StudentDashboardProps {
  user: User;
  onNavigateTab: (tab: string, param?: any) => void;
  onStartTest: (testId: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  onNavigateTab,
  onStartTest
}) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [recommendedTests, setRecommendedTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  const grade = user.grade || 5;

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/topics?grade=${grade}`).then(r => r.json()),
      fetch(`/api/tests?grade=${grade}`).then(r => r.json())
    ])
      .then(([topicsRes, testsRes]) => {
        if (topicsRes.success) setTopics(topicsRes.topics || []);
        if (testsRes.success) setRecommendedTests(testsRes.tests || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [grade]);

  // Daily goal mock calculation
  const dailyGoalTarget = 15;
  const dailyGoalCurrent = Math.min(dailyGoalTarget, 11);
  const dailyGoalPercent = Math.round((dailyGoalCurrent / dailyGoalTarget) * 100);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel border border-slate-800 p-6 sm:p-8 bg-gradient-to-r from-indigo-950/60 via-slate-900/60 to-purple-950/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>{grade}-sinf Matematika Dasturi</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Salom, {user.name} {user.surname}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Bugun yangi matematik marralarni zabt etishga tayyormisiz? 
              Darslarni o'zlashtiring, testlarni yeching va do'stlaringiz bilan reytingda yetakchi bo'ling!
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-5">
              <button
                onClick={() => onNavigateTab('lessons')}
                className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-[1.02]"
              >
                <BookOpen className="w-4 h-4" />
                Darslarni boshlash
              </button>
              <button
                onClick={() => onNavigateTab('tests')}
                className="px-5 py-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Test sinovlari
              </button>
            </div>
          </div>

          {/* Quick Metrics Badge Cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 shrink-0">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Flame className="w-6 h-6 text-amber-400 fill-amber-400 animate-bounce" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">{user.streak || 1} kun</div>
                <div className="text-[11px] text-slate-400 font-medium">Ketma-ket seriya 🔥</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <Star className="w-6 h-6 text-indigo-400 fill-indigo-400" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">{user.points || 0}</div>
                <div className="text-[11px] text-slate-400 font-medium">To'plangan ball ⭐</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Award className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">{grade}-sinf</div>
                <div className="text-[11px] text-slate-400 font-medium">O'quv bosqichi</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">#3</div>
                <div className="text-[11px] text-slate-400 font-medium">Sinf reytingi 🥇</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Target Progress & Quick Challenge */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-3xl p-5 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" />
                Bugungi maqsad
              </span>
              <span className="text-xs font-black text-emerald-400">{dailyGoalPercent}%</span>
            </div>
            <h3 className="text-sm font-bold text-white mb-1">
              15 ta masala yechish
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Bugun {dailyGoalCurrent} ta masala yechdingiz. Yana {dailyGoalTarget - dailyGoalCurrent} ta qoldi!
            </p>
          </div>
          <div>
            <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden mb-3">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500" 
                style={{ width: `${dailyGoalPercent}%` }}
              />
            </div>
            <button
              onClick={() => onNavigateTab('exercises')}
              className="w-full py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Zap className="w-3.5 h-3.5" />
              Mashq orqali davom etish
            </button>
          </div>
        </div>

        {/* Recommended Test Card */}
        <div className="glass-card rounded-3xl p-5 border border-slate-800 md:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Siz uchun tavsiya etiladigan test
            </span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
              O'qituvchi topshirig'i
            </span>
          </div>

          {recommendedTests.length > 0 ? (
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 my-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm sm:text-base font-extrabold text-white">
                  {recommendedTests[0].title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                  {recommendedTests[0].description}
                </p>
                <div className="flex items-center gap-4 text-[11px] text-slate-400 mt-2">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                    {recommendedTests[0].questionCount} ta savol
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    {recommendedTests[0].timeLimitMinutes} daqiqa
                  </span>
                </div>
              </div>

              <button
                onClick={() => onStartTest(recommendedTests[0].id)}
                className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 shrink-0 transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                Testni boshlash
              </button>
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-4">Barcha topshiriqlar bajarilgan.</p>
          )}

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
            <span>Matematika Pro bilim sinovi</span>
            <button
              onClick={() => onNavigateTab('tests')}
              className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
            >
              Barcha testlarni ko'rish
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grade Curriculum Topics Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              {grade}-sinf Matematika Mavzulari
            </h2>
            <p className="text-xs text-slate-400">
              Davlat ta'lim standartiga mos interaktiv nazariya va amaliyot
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('lessons')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
          >
            Barchasi ({topics.length})
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.slice(0, 6).map((top) => (
            <div
              key={top.id}
              onClick={() => onNavigateTab('lessons', top.id)}
              className="glass-card glass-card-hover rounded-3xl p-5 border border-slate-800 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {top.category}
                  </span>
                  <span className="text-[11px] font-semibold text-indigo-400">
                    {top.estimatedMinutes} daq
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {top.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {top.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="font-mono text-[11px] text-amber-300 truncate max-w-[170px]">
                  {top.formulaSummary}
                </span>
                <span className="text-indigo-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  O'rganish
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
