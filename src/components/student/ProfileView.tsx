import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Flame, 
  Star, 
  Award, 
  Settings, 
  GraduationCap, 
  LogOut, 
  Save, 
  Volume2, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { User, GradeLevel } from '../../types/index.ts';

interface ProfileViewProps {
  user: User;
  onUpdateUser: (updated: Partial<User>) => void;
  onLogout: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onUpdateUser,
  onLogout
}) => {
  const [name, setName] = useState(user.name);
  const [surname, setSurname] = useState(user.surname);
  const [grade, setGrade] = useState<GradeLevel>(user.grade || 5);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name,
      surname,
      grade
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <UserIcon className="w-7 h-7 text-indigo-400" />
          Foydalanuvchi Profili va Sozlamalar
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Shaxsiy ma'lumotlaringiz va platforma parametrlari
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-indigo-600/30">
          {name.charAt(0)}{surname.charAt(0)}
        </div>
        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
            <h2 className="text-xl font-bold text-white">
              {name} {surname}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              @{user.login}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {user.role === 'student' ? `${grade}-sinf o'quvchisi (${user.className || 'A'})` : 'O\'qituvchi'} • A'zo bo'lgan: {new Date(user.createdAt).toLocaleDateString()}
          </p>

          <div className="flex items-center justify-center sm:justify-start gap-3 mt-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span>{user.streak || 1} kunlik seriya</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
              <Star className="w-4 h-4 fill-indigo-400" />
              <span>{user.points || 0} ball</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSave} className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-5">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Settings className="w-4 h-4 text-indigo-400" />
          Ma'lumotlarni tahrirlash
        </h3>

        {savedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Ma'lumotlar muvaffaqiyatli saqlandi!</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Ism</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-900/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Familiya</label>
            <input
              type="text"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-900/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
        </div>

        {user.role === 'student' && (
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Ta'lim bosqichi (Sinf)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {([5, 6, 7, 8] as GradeLevel[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGrade(g)}
                  className={`py-2.5 rounded-2xl text-xs font-bold border transition-all ${
                    grade === g
                      ? 'bg-indigo-600 border-indigo-400 text-white shadow-md'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                  }`}
                >
                  {g}-sinf
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-xs font-semibold text-white">Ovoz effektlari</div>
              <div className="text-[11px] text-slate-400">Test yakunlanganda va to'g'ri javoblarda ohang yangrashi</div>
            </div>
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                soundEnabled ? 'bg-indigo-600' : 'bg-slate-800'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                soundEnabled ? 'right-1' : 'left-1'
              }`} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={onLogout}
            className="px-4 py-2.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Hisobdan chiqish
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            Saqlash
          </button>
        </div>
      </form>
    </div>
  );
};
