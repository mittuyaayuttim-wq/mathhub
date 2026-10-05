import React from 'react';
import { Home, CheckCircle2, BarChart3, User as UserIcon, BookOpen, Layers } from 'lucide-react';
import { User } from '../types/index.ts';

interface MobileNavProps {
  user: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  user,
  activeTab,
  setActiveTab,
  onOpenAuth
}) => {
  if (!user) {
    return (
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-3 glass-panel border-t border-slate-800">
        <button
          onClick={onOpenAuth}
          className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
        >
          <UserIcon className="w-4 h-4" />
          Tizimga kirish yoki ro'yxatdan o'tish
        </button>
      </div>
    );
  }

  // Mobile navigation as specified in prompt: Bosh sahifa | Testlar | Statistika | Profil
  const navItems = user.role === 'student' ? [
    { id: 'dashboard', label: 'Bosh sahifa', icon: Home },
    { id: 'tests', label: 'Testlar', icon: CheckCircle2 },
    { id: 'stats', label: 'Statistika', icon: BarChart3 },
    { id: 'profile', label: 'Profil', icon: UserIcon }
  ] : user.role === 'teacher' ? [
    { id: 'teacher_dashboard', label: 'Bosh sahifa', icon: Home },
    { id: 'teacher_classes', label: 'Sinflar', icon: Layers },
    { id: 'teacher_stats', label: 'Statistika', icon: BarChart3 },
    { id: 'profile', label: 'Profil', icon: UserIcon }
  ] : [
    { id: 'admin_panel', label: 'Boshqaruv', icon: Home },
    { id: 'kundalik', label: 'Kundalik', icon: Layers },
    { id: 'profile', label: 'Profil', icon: UserIcon }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-slate-800/90 px-3 py-2">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive 
                  ? 'text-indigo-400 font-bold scale-105' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
