import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Layers, 
  Plus, 
  Search, 
  Flame, 
  Star, 
  Award, 
  X, 
  CheckCircle2, 
  UserPlus,
  ArrowRight
} from 'lucide-react';
import { ClassGroup, User, GradeLevel } from '../../types/index.ts';

interface ClassManagementProps {
  currentUser: User;
}

export const ClassManagement: React.FC<ClassManagementProps> = ({ currentUser }) => {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('class-5a');
  const [loading, setLoading] = useState(true);
  const [searchStudent, setSearchStudent] = useState('');

  // Add student modal
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentSurname, setNewStudentSurname] = useState('');
  const [newStudentLogin, setNewStudentLogin] = useState('');
  const [newStudentGrade, setNewStudentGrade] = useState<GradeLevel>(5);

  // Add class modal
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassGrade, setNewClassGrade] = useState<GradeLevel>(5);

  useEffect(() => {
    fetch('/api/teacher/classes')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setClasses(data.classes || []);
          if (data.classes?.length > 0) {
            setSelectedClassId(data.classes[0].id);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const currentClass = classes.find(c => c.id === selectedClassId) || classes[0];

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName || !newStudentSurname || !newStudentLogin) return;

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newStudentName,
          surname: newStudentSurname,
          login: newStudentLogin,
          password: '123456',
          role: 'student',
          grade: newStudentGrade,
          className: currentClass?.name || `${newStudentGrade}-A`
        })
      });
      const data = await res.json();
      if (data.success) {
        // Refresh classes
        const refRes = await fetch('/api/teacher/classes');
        const refData = await refRes.json();
        if (refData.success) setClasses(refData.classes);
        setShowAddStudentModal(false);
        setNewStudentName('');
        setNewStudentSurname('');
        setNewStudentLogin('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName) return;

    try {
      const res = await fetch('/api/teacher/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newClassName,
          grade: newClassGrade,
          teacherId: currentUser.id
        })
      });
      const data = await res.json();
      if (data.success) {
        const refRes = await fetch('/api/teacher/classes');
        const refData = await refRes.json();
        if (refData.success) setClasses(refData.classes);
        setShowAddClassModal(false);
        setNewClassName('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredStudents = (currentClass?.students || []).filter((s: any) =>
    `${s.name} ${s.surname}`.toLowerCase().includes(searchStudent.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-emerald-400" />
            Sinflar va O'quvchilar Boshqaruvi
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Sinflar ro'yxati, o'quvchilarni biriktirish va ularning yutuqlarini kuzatish
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddClassModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Yangi sinf ochish
          </button>
          <button
            onClick={() => setShowAddStudentModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            O'quvchi qo'shish
          </button>
        </div>
      </div>

      {/* Class Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {classes.map(cl => (
          <button
            key={cl.id}
            onClick={() => setSelectedClassId(cl.id)}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold shrink-0 transition-all border flex items-center gap-2 ${
              selectedClassId === cl.id
                ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{cl.name}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950/60 text-slate-300">
              {cl.studentCount || cl.students?.length || 0} o'quvchi
            </span>
          </button>
        ))}
      </div>

      {/* Active Class Student List */}
      {currentClass && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">
                  {currentClass.name} O'quvchilari
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                  Kod: {currentClass.code}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Sinf rahbari: {currentClass.teacherName} • O'rtacha o'zlashtirish: <strong className="text-emerald-400">{currentClass.averageScore}%</strong>
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="O'quvchini qidirish..."
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Student Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="pb-3 pl-3">#</th>
                  <th className="pb-3">Ism va Familiya</th>
                  <th className="pb-3 text-center">Seriya 🔥</th>
                  <th className="pb-3 text-center">To'plangan Ball</th>
                  <th className="pb-3 text-center">O'zlashtirish</th>
                  <th className="pb-3 text-right pr-3">Holat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Ushbu sinfda o'quvchilar topilmadi. Yuqoridagi "O'quvchi qo'shish" tugmasi orqali yangi o'quvchini ro'yxatga oling.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((st: any, idx: number) => (
                    <tr key={st.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3.5 pl-3 text-slate-500">{idx + 1}</td>
                      <td className="py-3.5 font-bold text-white flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-black shadow-sm">
                          {st.name.charAt(0)}{st.surname.charAt(0)}
                        </div>
                        <div>
                          <div>{st.name} {st.surname}</div>
                          <div className="text-[10px] text-slate-400 font-normal">ID: {st.id}</div>
                        </div>
                      </td>
                      <td className="py-3.5 text-center">
                        <span className="inline-flex items-center gap-1 text-amber-400 font-bold">
                          <Flame className="w-3.5 h-3.5 fill-amber-400" />
                          {st.streak || 1} kun
                        </span>
                      </td>
                      <td className="py-3.5 text-center font-mono font-bold text-indigo-300">
                        {st.points || 100} ⭐
                      </td>
                      <td className="py-3.5 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          A'lo (5)
                        </span>
                      </td>
                      <td className="py-3.5 text-right pr-3">
                        <span className="text-emerald-400 font-semibold text-[11px]">Faol</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full border border-slate-700 text-slate-100 shadow-2xl relative">
            <button
              onClick={() => setShowAddStudentModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-1">Yangi o'quvchi qo'shish</h3>
            <p className="text-xs text-slate-400 mb-4">O'quvchi uchun avtomatik standart parol: 123456</p>

            <form onSubmit={handleCreateStudent} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Ism</label>
                <input
                  type="text"
                  placeholder="masalan: Kamron"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Familiya</label>
                <input
                  type="text"
                  placeholder="masalan: Yoqubov"
                  value={newStudentSurname}
                  onChange={(e) => setNewStudentSurname(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Login</label>
                <input
                  type="text"
                  placeholder="masalan: kamron2026"
                  value={newStudentLogin}
                  onChange={(e) => setNewStudentLogin(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Sinf</label>
                <div className="grid grid-cols-4 gap-2">
                  {([5, 6, 7, 8] as GradeLevel[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setNewStudentGrade(g)}
                      className={`py-2 rounded-xl text-xs font-bold border ${
                        newStudentGrade === g
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : 'border-slate-800 bg-slate-900 text-slate-400'
                      }`}
                    >
                      {g}-sinf
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all mt-4"
              >
                O'quvchini saqlash
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Class Modal */}
      {showAddClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full border border-slate-700 text-slate-100 shadow-2xl relative">
            <button
              onClick={() => setShowAddClassModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-1">Yangi sinf ochish</h3>
            <p className="text-xs text-slate-400 mb-4">Yangi sinf guruhi yaratish</p>

            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Sinf nomi</label>
                <input
                  type="text"
                  placeholder="masalan: 7-B sinf"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Sinf darajasi</label>
                <div className="grid grid-cols-4 gap-2">
                  {([5, 6, 7, 8] as GradeLevel[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setNewClassGrade(g)}
                      className={`py-2 rounded-xl text-xs font-bold border ${
                        newClassGrade === g
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : 'border-slate-800 bg-slate-900 text-slate-400'
                      }`}
                    >
                      {g}-sinf
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all mt-4"
              >
                Sinfni yaratish
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
