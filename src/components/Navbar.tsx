import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Flame, 
  Star, 
  Bell, 
  LogOut, 
  User as UserIcon, 
  GraduationCap, 
  ShieldCheck, 
  BookOpen, 
  CheckCircle2, 
  Layers, 
  BarChart3, 
  Trophy, 
  CalendarDays,
  Sparkles,
  Link2,
  ChevronDown
} from 'lucide-react';
import { User, AppNotification } from '../types/index.ts';

interface NavbarProps {
  user: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onSelectDemoUser: (user: User) => void;
  demoUsers: User[];
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onLogout,
  onSelectDemoUser,
  demoUsers
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/notifications/${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setNotifications(data.notifications || []);
        }
      })
      .catch(console.error);
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    notifications.forEach(n => {
      if (!n.read) {
        fetch(`/api/notifications/${n.id}/read`, { method: 'POST' }).catch(console.error);
      }
    });
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-all duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('dashboard')} 
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
                Matematika Pro
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                5-8 Sinf
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Interaktiv ta'lim platformasi</p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        {user && (
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800">
            {user.role === 'student' && (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === 'dashboard'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Bosh sahifa
                </button>
                <button
                  onClick={() => setActiveTab('lessons')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === 'lessons'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  Darslar
                </button>
                <button
                  onClick={() => setActiveTab('tests')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === 'tests'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Testlar
                </button>
                <button
                  onClick={() => setActiveTab('exercises')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === 'exercises'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Mashqlar
                </button>
                <button
                  onClick={() => setActiveTab('stats')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === 'stats'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  Statistika
                </button>
                <button
                  onClick={() => setActiveTab('achievements')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === 'achievements'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5" />
                  Yutuqlar
                </button>
                <button
                  onClick={() => setActiveTab('daily_report')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === 'daily_report'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <CalendarDays className="w-3.5 h-3.5" />
                  Kunlik
                </button>
              </>
            )}

            {user.role === 'teacher' && (
              <>
                <button
                  onClick={() => setActiveTab('teacher_dashboard')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === 'teacher_dashboard'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('teacher_classes')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === 'teacher_classes'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  Sinflar & O'quvchilar
                </button>
                <button
                  onClick={() => setActiveTab('teacher_create_test')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === 'teacher_create_test'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Test yaratish
                </button>
                <button
                  onClick={() => setActiveTab('teacher_stats')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === 'teacher_stats'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  Statistika
                </button>
                <button
                  onClick={() => setActiveTab('teacher_daily')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === 'teacher_daily'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <CalendarDays className="w-3.5 h-3.5" />
                  Kunlik hisobot
                </button>
                <button
                  onClick={() => setActiveTab('kundalik')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === 'kundalik'
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Link2 className="w-3.5 h-3.5 text-cyan-300" />
                  Kundalik
                </button>
              </>
            )}

            {user.role === 'admin' && (
              <>
                <button
                  onClick={() => setActiveTab('admin_panel')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === 'admin_panel'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin boshqaruvi
                </button>
                <button
                  onClick={() => setActiveTab('kundalik')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === 'kundalik'
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Link2 className="w-3.5 h-3.5 text-cyan-300" />
                  Kundalik integratsiyasi
                </button>
              </>
            )}
          </nav>
        )}

        {/* Right Section: Stats, Notifications, Profile / Demo Switch */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Demo Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDemoMenu(!showDemoMenu)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-xs font-medium text-slate-300 flex items-center gap-1.5 transition-all shadow-sm"
              title="Foydalanuvchi hisobini almashtirish"
            >
              <span className="hidden sm:inline">Hisob:</span>
              <span className="font-semibold text-white truncate max-w-[100px]">
                {user ? user.name : "Demo hisoblar"}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showDemoMenu && (
              <div 
                className="absolute right-0 mt-2 w-64 glass-panel border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 text-xs"
                onClick={() => setShowDemoMenu(false)}
              >
                <div className="px-3 py-2 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Tezkor demo hisobga o'tish:
                </div>
                <div className="py-1 space-y-1">
                  {demoUsers.map(du => (
                    <button
                      key={du.id}
                      onClick={() => onSelectDemoUser(du)}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800/80 flex items-center justify-between transition-colors"
                    >
                      <div>
                        <div className="font-semibold text-slate-200">
                          {du.name} {du.surname}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {du.role === 'teacher' ? 'O\'qituvchi' : du.role === 'admin' ? 'Administrator' : `${du.grade}-sinf o'quvchisi (${du.className})`}
                        </div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        du.role === 'teacher' ? 'bg-emerald-500/20 text-emerald-300' :
                        du.role === 'admin' ? 'bg-purple-500/20 text-purple-300' : 'bg-indigo-500/20 text-indigo-300'
                      }`}>
                        {du.role === 'teacher' ? 'Ustoz' : du.role === 'admin' ? 'Admin' : `${du.grade}-sinf`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {user ? (
            <>
              {/* Gamification Pills for Student */}
              {user.role === 'student' && (
                <div className="hidden lg:flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
                    <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
                    <span>{user.streak || 1} kun</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
                    <Star className="w-4 h-4 text-indigo-400 fill-indigo-400" />
                    <span>{user.points || 0} ball</span>
                  </div>
                </div>
              )}

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    if (!showNotifications) markAllAsRead();
                  }}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-slate-300 transition-colors relative"
                  title="Bildirishnomalar"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-panel border border-slate-700 rounded-2xl shadow-2xl p-3 z-50">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="font-bold text-sm text-white">Bildirishnomalar</span>
                      <span className="text-xs text-indigo-400">Jami: {notifications.length} ta</span>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60 py-1">
                      {notifications.length === 0 ? (
                        <div className="py-6 text-center text-xs text-slate-400">
                          Hozircha yangi bildirishnomalar yo'q.
                        </div>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} className="py-2.5 px-2 hover:bg-slate-800/50 rounded-xl transition-colors">
                            <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                              <span>{n.title}</span>
                              <span className="text-[10px] text-slate-500 font-normal">
                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar & Logout */}
              <div className="flex items-center gap-2 pl-1 border-l border-slate-800">
                <div 
                  onClick={() => setActiveTab('profile')}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800/60 cursor-pointer transition-colors"
                  title="Shaxsiy profil"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                    {user.name.charAt(0)}{user.surname.charAt(0)}
                  </div>
                  <div className="hidden xl:block text-left">
                    <div className="text-xs font-bold text-white leading-tight">
                      {user.name} {user.surname}
                    </div>
                    <div className="text-[10px] text-slate-400 leading-tight">
                      {user.role === 'student' ? `${user.grade}-sinf (${user.className || 'A'})` : user.role === 'teacher' ? 'O\'qituvchi' : 'Administrator'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Chiqish"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
            >
              <UserIcon className="w-3.5 h-3.5" />
              Kirish / Registratsiya
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
