import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Layers, 
  Plus, 
  Trash2, 
  Send, 
  Sparkles,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { GradeLevel, QuestionType } from '../../types/index.ts';

interface TeacherTestBuilderProps {
  onTestCreated: () => void;
}

export const TeacherTestBuilder: React.FC<TeacherTestBuilderProps> = ({ onTestCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [grade, setGrade] = useState<GradeLevel>(5);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(20);
  const [questionCount, setQuestionCount] = useState(10);
  const [assignedClassId, setAssignedClassId] = useState('');
  const [classes, setClasses] = useState<any[]>([]);

  // Custom question builder
  const [customQuestions, setCustomQuestions] = useState<{
    questionText: string;
    formula?: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    type: QuestionType;
  }[]>([
    {
      questionText: "To'g'ri burchakli uchburchakning katetlari 6 va 8 bo'lsa, gipotenuzasini toping:",
      formula: "c² = a² + b²",
      options: ['10', '12', '14', '15'],
      correctAnswer: '10',
      explanation: "Pifagor teoremasi: 6² + 8² = 36 + 64 = 100. √100 = 10.",
      type: 'single_choice'
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetch('/api/teacher/classes')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setClasses(data.classes || []);
          if (data.classes?.length > 0) {
            setAssignedClassId(data.classes[0].id);
          }
        }
      })
      .catch(console.error);
  }, []);

  const addCustomQuestion = () => {
    setCustomQuestions(prev => [
      ...prev,
      {
        questionText: '',
        formula: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        explanation: '',
        type: 'single_choice'
      }
    ]);
  };

  const removeQuestion = (idx: number) => {
    setCustomQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  const handleQuestionChange = (idx: number, field: string, value: any) => {
    setCustomQuestions(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const handleOptionChange = (qIdx: number, oIdx: number, val: string) => {
    setCustomQuestions(prev => {
      const copy = [...prev];
      const opts = [...copy[qIdx].options];
      opts[oIdx] = val;
      copy[qIdx].options = opts;
      return copy;
    });
  };

  const handleSaveTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!title) {
      setErrorMsg("Iltimos, test sarlavhasini kiriting!");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/teacher/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          grade,
          timeLimitMinutes,
          questionCount,
          assignedClassId,
          customQuestions: customQuestions.filter(q => q.questionText.trim())
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Testni yaratishda xatolik yuz berdi");
      }

      setSuccessMsg("Yangi test muvaffaqiyatli yaratildi va o'quvchilarga yuborildi! 🔔");
      setTimeout(() => {
        onTestCreated();
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <CheckCircle2 className="w-7 h-7 text-emerald-400" />
          Yangi Matematika Testini Yaratish
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Sinf uchun oraliq yoki yakuniy nazorat testini tuzish va vaqt me'yorini belgilash
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSaveTest} className="space-y-6">
        {/* Basic Config Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white mb-2">1. Asosiy parametrlar</h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Test sarlavhasi
            </label>
            <input
              type="text"
              placeholder="masalan: 7-sinf: Chiziqli tenglamalar va burchaklar bo'yicha oraliq nazorat"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Izoh / Ko'rsatma
            </label>
            <textarea
              rows={2}
              placeholder="Testda kalkulyatordan foydalanish taqiqlanadi. Har bir savolga e'tibor bering."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Sinf darajasi</label>
              <div className="grid grid-cols-4 gap-1.5">
                {([5, 6, 7, 8] as GradeLevel[]).map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGrade(g)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      grade === g
                        ? 'bg-emerald-600 border-emerald-500 text-white shadow-sm'
                        : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    {g}-s
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Ajratilgan vaqt</label>
              <div className="flex items-center gap-2">
                {[15, 20, 30, 45].map(mins => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setTimeLimitMinutes(mins)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border ${
                      timeLimitMinutes === mins
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    {mins} d
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Savollar soni</label>
              <div className="flex items-center gap-2">
                {[10, 20, 30].map(cnt => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setQuestionCount(cnt)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border ${
                      questionCount === cnt
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    {cnt} ta
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Qaysi sinfga biriktirilsin?
            </label>
            <select
              value={assignedClassId}
              onChange={(e) => setAssignedClassId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.grade}-sinf, {c.studentCount || c.students?.length} o'quvchi)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Custom Questions Section */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">2. Maxsus savollar kiritish (ixtiyoriy)</h3>
              <p className="text-xs text-slate-400">
                Agar o'z savollaringizni kiritmasangiz, test platforma savollar bankidan avtomatik to'ldiriladi.
              </p>
            </div>
            <button
              type="button"
              onClick={addCustomQuestion}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Savol qo'shish
            </button>
          </div>

          <div className="space-y-4">
            {customQuestions.map((q, qIdx) => (
              <div key={qIdx} className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-400">
                    Savol #{qIdx + 1}
                  </span>
                  {customQuestions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIdx)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Savol matni..."
                    value={q.questionText}
                    onChange={(e) => handleQuestionChange(qIdx, 'questionText', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />

                  <input
                    type="text"
                    placeholder="Matematik formula (ixtiyoriy, masalan: 2x + 5 = 15)"
                    value={q.formula || ''}
                    onChange={(e) => handleQuestionChange(qIdx, 'formula', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 font-mono text-indigo-300 text-xs focus:outline-none focus:border-emerald-500"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500 w-4">{String.fromCharCode(65 + oIdx)}</span>
                        <input
                          type="text"
                          placeholder={`Variant ${String.fromCharCode(65 + oIdx)}`}
                          value={opt}
                          onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">To'g'ri javob:</label>
                      <input
                        type="text"
                        placeholder="Variant matni (masalan: 10)"
                        value={q.correctAnswer}
                        onChange={(e) => handleQuestionChange(qIdx, 'correctAnswer', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-emerald-950/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Yechim tushuntirishi:</label>
                      <input
                        type="text"
                        placeholder="Nima uchun bu javob to'g'ri?"
                        value={q.explanation}
                        onChange={(e) => handleQuestionChange(qIdx, 'explanation', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {loading ? "Test tayyorlanmoqda..." : "Testni e'lon qilish va yuborish 🔔"}
          </button>
        </div>
      </form>
    </div>
  );
};
