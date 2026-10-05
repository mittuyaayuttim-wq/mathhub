import React from 'react';
import { 
  Trophy, 
  Flame, 
  Target, 
  Crown, 
  Zap, 
  Footprints, 
  Star, 
  Medal, 
  CheckCircle2, 
  Lock 
} from 'lucide-react';
import { User, Achievement } from '../../types/index.ts';

interface AchievementsViewProps {
  user: User;
}

const BADGES: Achievement[] = [
  {
    id: 'ach-1',
    title: 'Ilk qadam',
    description: "Birinchi testni muvaffaqiyatli yakunlang",
    icon: 'Footprints',
    unlocked: true,
    unlockedAt: '2026-10-01',
    currentProgress: 1,
    maxProgress: 1,
    category: 'tests',
    badgeColor: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'ach-2',
    title: '7 kunlik seriya 🔥',
    description: "Ketma-ket 7 kun matematika bilan uzluksiz shug'ullaning",
    icon: 'Flame',
    unlocked: false,
    currentProgress: 5,
    maxProgress: 7,
    category: 'streak',
    badgeColor: 'from-amber-500 to-orange-600'
  },
  {
    id: 'ach-3',
    title: '100 ta savol yechildi 🎯',
    description: "Jami 100 ta matematika savolini to'g'ri yeching",
    icon: 'Target',
    unlocked: false,
    currentProgress: 42,
    maxProgress: 100,
    category: 'mastery',
    badgeColor: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'ach-4',
    title: "Matematika ustasi 👑",
    description: "Barcha sinf mavzularida 90%+ (A'lo) natija ko'rsating",
    icon: 'Crown',
    unlocked: false,
    currentProgress: 3,
    maxProgress: 8,
    category: 'accuracy',
    badgeColor: 'from-purple-500 to-pink-600'
  },
  {
    id: 'ach-5',
    title: "Tezkor hisobchi ⚡",
    description: "Testni ajratilgan vaqtning yarmidan kamida a'lo bahoga topshiring",
    icon: 'Zap',
    unlocked: true,
    unlockedAt: '2026-10-03',
    currentProgress: 1,
    maxProgress: 1,
    category: 'mastery',
    badgeColor: 'from-yellow-400 to-amber-500'
  }
];

const LEADERBOARD = [
  { rank: 1, name: 'Dilnoza Rahimova', className: '8-V', points: 610, streak: 14, badge: 'Matematika ustasi' },
  { rank: 2, name: 'Jasur Ergashev', className: '7-A', points: 520, streak: 11, badge: 'Tezkor hisobchi' },
  { rank: 3, name: 'Malika Toshmatova', className: '6-B', points: 380, streak: 7, badge: 'Ilk qadam' },
  { rank: 4, name: 'Nodir Karimov (Siz)', className: '5-A', points: 240, streak: 5, badge: 'Faol o\'quvchi' },
  { rank: 5, name: 'Samandar Zokirov', className: '5-A', points: 210, streak: 4, badge: 'Izlanuvchi' }
];

export const AchievementsView: React.FC<AchievementsViewProps> = ({ user }) => {
  return (
    <div className="space-y-8 pb-20 md:pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Trophy className="w-7 h-7 text-amber-400" />
          Yutuqlar va Reyting Tizimi
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Nishonlarni to'plang, ketma-ketlik seriyasini oshiring va yetakchilar safidan o'rin oling
        </p>
      </div>

      {/* Badges Grid */}
      <div>
        <h2 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Medal className="w-5 h-5 text-indigo-400" />
          Mening Nishonlarim ({BADGES.filter(b => b.unlocked).length} / {BADGES.length})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BADGES.map((badge) => {
            const pct = Math.round((badge.currentProgress / badge.maxProgress) * 100);
            return (
              <div
                key={badge.id}
                className={`glass-card rounded-3xl p-5 border flex flex-col justify-between transition-all ${
                  badge.unlocked 
                    ? 'border-indigo-500/40 shadow-lg shadow-indigo-500/10' 
                    : 'border-slate-800/80 opacity-80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${badge.badgeColor} flex items-center justify-center text-white shadow-md ${
                      !badge.unlocked ? 'grayscale' : ''
                    }`}>
                      {badge.icon === 'Footprints' && <Footprints className="w-6 h-6" />}
                      {badge.icon === 'Flame' && <Flame className="w-6 h-6 fill-white" />}
                      {badge.icon === 'Target' && <Target className="w-6 h-6" />}
                      {badge.icon === 'Crown' && <Crown className="w-6 h-6" />}
                      {badge.icon === 'Zap' && <Zap className="w-6 h-6" />}
                    </div>

                    {badge.unlocked ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Ochilgan
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full">
                        <Lock className="w-3 h-3" />
                        {badge.currentProgress}/{badge.maxProgress}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-white mb-1">
                    {badge.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {badge.description}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1.5">
                    <span>Jarayon</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className={`bg-gradient-to-r ${badge.badgeColor} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-400" />
              Umumiy O'quvchilar Reytingi (Top-5)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Matematika Pro platformasining eng faol va yuqori balli o'quvchilari
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-xl border border-indigo-500/20">
            Haftalik yangilanish
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="pb-3 pl-3">O'rin</th>
                <th className="pb-3">O'quvchi</th>
                <th className="pb-3 text-center">Sinf</th>
                <th className="pb-3 text-center">Ketma-ketlik</th>
                <th className="pb-3 text-center">Nishon</th>
                <th className="pb-3 text-right pr-3">Jami Ball</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {LEADERBOARD.map((item) => {
                const isCurrentUser = item.name.includes('(Siz)');
                return (
                  <tr 
                    key={item.rank} 
                    className={`transition-colors ${
                      isCurrentUser 
                        ? 'bg-indigo-950/40 text-indigo-200 font-bold border-l-2 border-indigo-500' 
                        : 'hover:bg-slate-900/40 text-slate-300'
                    }`}
                  >
                    <td className="py-3.5 pl-3">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                        item.rank === 1 ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20' :
                        item.rank === 2 ? 'bg-slate-300 text-slate-950' :
                        item.rank === 3 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {item.rank}
                      </div>
                    </td>
                    <td className="py-3.5 font-bold text-white">
                      {item.name}
                    </td>
                    <td className="py-3.5 text-center text-slate-400">
                      {item.className}
                    </td>
                    <td className="py-3.5 text-center">
                      <span className="inline-flex items-center gap-1 text-amber-400 font-bold">
                        <Flame className="w-3.5 h-3.5 fill-amber-400" />
                        {item.streak} kun
                      </span>
                    </td>
                    <td className="py-3.5 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {item.badge}
                      </span>
                    </td>
                    <td className="py-3.5 text-right pr-3 font-mono font-black text-indigo-400 text-sm">
                      {item.points} ⭐
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
