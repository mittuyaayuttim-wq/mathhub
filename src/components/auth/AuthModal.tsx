import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  KeyRound, 
  Lock, 
  User as UserIcon, 
  Mail, 
  Phone, 
  GraduationCap, 
  Sparkles,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { User, GradeLevel } from '../../types/index.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  demoUsers: User[];
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  demoUsers
}) => {
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>('login');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regSurname, setRegSurname] = useState('');
  const [regLogin, setRegLogin] = useState('');
  const [regEmailOrPhone, setRegEmailOrPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState<'student' | 'teacher'>('student');
  const [regGrade, setRegGrade] = useState<GradeLevel>(5);

  // Forgot password
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotSuccessMsg, setForgotSuccessMsg] = useState('');

  // UI status
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!loginIdentifier || !loginPassword) {
      setErrorMessage("Login va parolni to'ldiring!");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: loginIdentifier,
          password: loginPassword
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Kirishda xatolik yuz berdi");
      }
      onLoginSuccess(data.user);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Tizimga ulanishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!regName || !regSurname || !regLogin || !regPassword) {
      setErrorMessage("Iltimos, barcha majburiy maydonlarni to'ldiring!");
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage("Kiritilgan parollar bir-biriga mos kelmadi!");
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage("Parol kamida 6 ta belgidan iborat bo'lishi kerak!");
      return;
    }

    try {
      setLoading(true);
      const isEmail = regEmailOrPhone.includes('@');
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName,
          surname: regSurname,
          login: regLogin,
          email: isEmail ? regEmailOrPhone : undefined,
          phone: !isEmail ? regEmailOrPhone : undefined,
          password: regPassword,
          role: regRole,
          grade: regRole === 'student' ? regGrade : undefined,
          className: regRole === 'student' ? `${regGrade}-A` : undefined
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Ro'yxatdan o'tishda xatolik yuz berdi");
      }
      onLoginSuccess(data.user);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Ro'yxatdan o'tishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setForgotSuccessMsg('');

    if (!forgotIdentifier) {
      setErrorMessage("Login, email yoki telefon raqamingizni kiriting!");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: forgotIdentifier })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Foydalanuvchi topilmadi");
      }
      setForgotSuccessMsg(data.message);
    } catch (err: any) {
      setErrorMessage(err.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl border border-slate-700/80 shadow-2xl p-6 sm:p-8 my-8 text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center mb-3 shadow-lg shadow-indigo-500/25">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            {tab === 'login' && "Platformaga kirish"}
            {tab === 'register' && "Ro'yxatdan o'tish"}
            {tab === 'forgot' && "Parolni tiklash"}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            5-8 sinf matematika ta'lim tizimi
          </p>
        </div>

        {/* Tabs switcher */}
        <div className="flex rounded-2xl bg-slate-900/80 p-1 mb-6 border border-slate-800">
          <button
            type="button"
            onClick={() => { setTab('login'); setErrorMessage(''); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === 'login'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Kirish
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setErrorMessage(''); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === 'register'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Ro'yxatdan o'tish
          </button>
        </div>

        {/* Error message banner */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success message banner */}
        {forgotSuccessMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{forgotSuccessMsg}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Login, Telefon yoki Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="masalan: nodir yoki +99890..."
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  required
                />
                <UserIcon className="w-4 h-4 text-slate-500 absolute right-3 top-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Parol
                </label>
                <button
                  type="button"
                  onClick={() => { setTab('forgot'); setErrorMessage(''); }}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  Parolni unutdingizmi?
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  required
                />
                <Lock className="w-4 h-4 text-slate-500 absolute right-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              {loading ? "Kirilmoqda..." : "Kirish"}
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3.5">
            {/* Role selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Hisob turi:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRegRole('student')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    regRole === 'student'
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm'
                      : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  O'quvchi
                </button>
                <button
                  type="button"
                  onClick={() => setRegRole('teacher')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    regRole === 'teacher'
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-sm'
                      : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  O'qituvchi
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Ism</label>
                <input
                  type="text"
                  placeholder="masalan: Jasur"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Familiya</label>
                <input
                  type="text"
                  placeholder="masalan: Aliyev"
                  value={regSurname}
                  onChange={(e) => setRegSurname(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Login</label>
                <input
                  type="text"
                  placeholder="masalan: jasur2026"
                  value={regLogin}
                  onChange={(e) => setRegLogin(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Telefon / Email</label>
                <input
                  type="text"
                  placeholder="+99890... yoki email"
                  value={regEmailOrPhone}
                  onChange={(e) => setRegEmailOrPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {regRole === 'student' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Sinfingizni tanlang:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {([5, 6, 7, 8] as GradeLevel[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setRegGrade(g)}
                      className={`py-2 rounded-xl font-bold text-xs border transition-all ${
                        regGrade === g
                          ? 'bg-indigo-600 border-indigo-400 text-white shadow-md'
                          : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {g}-sinf
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Parol</label>
                <input
                  type="password"
                  placeholder="kamida 6 belgi"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Parolni tasdiqlash</label>
                <input
                  type="password"
                  placeholder="qayta kiriting"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2"
            >
              <UserPlus className="w-4 h-4" />
              {loading ? "Ro'yxatdan o'tilmoqda..." : "Ro'yxatdan o'tish"}
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {tab === 'forgot' && (
          <form onSubmit={handleForgot} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Login yoki ro'yxatdan o'tgan telefon/email
              </label>
              <input
                type="text"
                placeholder="masalan: nodir yoki alisher@maktab.uz"
                value={forgotIdentifier}
                onChange={(e) => setForgotIdentifier(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <KeyRound className="w-4 h-4" />
              {loading ? "Yuborilmoqda..." : "Tiklash kodini olish"}
            </button>

            <button
              type="button"
              onClick={() => { setTab('login'); setErrorMessage(''); setForgotSuccessMsg(''); }}
              className="w-full py-2 text-xs text-slate-400 hover:text-white text-center font-medium"
            >
              ← Kirish sahifasiga qaytish
            </button>
          </form>
        )}

        {/* 1-Click Quick Demo Login Shortcuts */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center mb-2.5 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Bir marta bosish bilan tezkor demo kirish:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {demoUsers.map((du) => (
              <button
                key={du.id}
                type="button"
                onClick={() => {
                  onLoginSuccess(du);
                  onClose();
                }}
                className="p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 text-left transition-all group"
              >
                <div className="text-xs font-bold text-white group-hover:text-indigo-300 truncate">
                  {du.name}
                </div>
                <div className="text-[10px] text-slate-400">
                  {du.role === 'teacher' ? 'O\'qituvchi' : du.role === 'admin' ? 'Admin' : `${du.grade}-sinf o'quvchi`}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
