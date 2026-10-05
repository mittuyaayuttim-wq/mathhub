import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  Award, 
  Trophy, 
  Check, 
  AlertTriangle,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { ClientQuestion, TestAttempt, User } from '../types/index.ts';

interface TestRunnerProps {
  testId: string;
  user: User;
  onClose: () => void;
  onTestCompleted?: (result: TestAttempt) => void;
}

export const TestRunner: React.FC<TestRunnerProps> = ({
  testId,
  user,
  onClose,
  onTestCompleted
}) => {
  const [loading, setLoading] = useState(true);
  const [testData, setTestData] = useState<{
    id: string;
    title: string;
    description: string;
    grade: number;
    timeLimitMinutes: number;
    questionCount: number;
    questions: ClientQuestion[];
  } | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [secondsLeft, setSecondsLeft] = useState(15 * 60);
  const [totalSpentSeconds, setTotalSpentSeconds] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<TestAttempt | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [confirmSubmitModal, setConfirmSubmitModal] = useState(false);

  // Load test from server
  useEffect(() => {
    setLoading(true);
    fetch(`/api/tests/${testId}/start`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.test) {
          setTestData(data.test);
          setSecondsLeft((data.test.timeLimitMinutes || 20) * 60);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [testId]);

  // Timer countdown
  useEffect(() => {
    if (!testData || result || loading) return;

    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
      setTotalSpentSeconds(s => s + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [testData, result, loading]);

  const currentQ = testData?.questions[currentIndex];

  const handleSelectOption = (qId: string, option: string, isMulti: boolean = false) => {
    if (isMulti) {
      const existing: string[] = userAnswers[qId] || [];
      const updated = existing.includes(option)
        ? existing.filter(o => o !== option)
        : [...existing, option];
      setUserAnswers(prev => ({ ...prev, [qId]: updated }));
    } else {
      setUserAnswers(prev => ({ ...prev, [qId]: option }));
    }
  };

  const handleNumberInput = (qId: string, val: string) => {
    setUserAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleSubmitTest = async () => {
    if (submitting || !testData) return;
    setSubmitting(true);
    setConfirmSubmitModal(false);

    const formattedAnswers = testData.questions.map(q => ({
      questionId: q.id,
      answer: userAnswers[q.id] !== undefined ? userAnswers[q.id] : ''
    }));

    try {
      const res = await fetch(`/api/tests/${testId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          answers: formattedAnswers,
          timeSpentSeconds: totalSpentSeconds || 60
        })
      });
      const data = await res.json();
      if (data.success && data.result) {
        setResult(data.result);
        if (onTestCompleted) {
          onTestCompleted(data.result);
        }
      }
    } catch (e) {
      console.error('Test topshirishda xatolik:', e);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md">
        <div className="text-center p-8 rounded-3xl glass-panel border border-slate-700">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white">Test yuklanmoqda...</h3>
          <p className="text-xs text-slate-400 mt-1">Matematik savollar va chizmalar tayyorlanmoqda</p>
        </div>
      </div>
    );
  }

  if (!testData || !currentQ) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4">
        <div className="text-center p-8 glass-panel rounded-3xl border border-slate-700 max-w-md">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">Test topilmadi yoki mavjud emas</h3>
          <p className="text-xs text-slate-400 mt-2 mb-6">Ushbu test vaqtincha faol emas yoki o'chirilgan bo'lishi mumkin.</p>
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm">
            Orqaga qaytish
          </button>
        </div>
      </div>
    );
  }

  // =================== RESULTS VIEW ===================
  if (result) {
    const isPassing = result.percentage >= 60;
    const badgeColors: Record<string, string> = {
      "A'lo": "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      "Juda yaxshi": "bg-blue-500/20 text-blue-300 border-blue-500/40",
      "Yaxshi": "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
      "Qoniqarli": "bg-amber-500/20 text-amber-300 border-amber-500/40",
      "Ko'proq mashq qilish kerak": "bg-rose-500/20 text-rose-300 border-rose-500/40"
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
        <div className="w-full max-w-3xl glass-panel rounded-3xl border border-slate-700/80 shadow-2xl p-6 sm:p-8 my-auto text-slate-100">
          {/* Header */}
          <div className="text-center pb-6 border-b border-slate-800">
            <div className={`w-16 h-16 mx-auto rounded-3xl flex items-center justify-center mb-3 shadow-xl ${
              result.percentage >= 80 ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-emerald-500/20' :
              result.percentage >= 60 ? 'bg-gradient-to-tr from-indigo-500 to-blue-500 shadow-indigo-500/20' :
              'bg-gradient-to-tr from-amber-500 to-rose-500 shadow-rose-500/20'
            }`}>
              <Trophy className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Test Natijasi: <span className="text-indigo-400">{result.percentage}%</span>
            </h2>

            <div className="mt-2.5">
              <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-black border ${badgeColors[result.gradeMark] || 'bg-slate-800 text-white'}`}>
                <Award className="w-4 h-4" />
                Baholash darajasi: {result.gradeMark}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2">{result.testTitle}</p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
              <div className="text-emerald-400 text-xl font-black">{result.correctCount} ta</div>
              <div className="text-[11px] text-slate-400 mt-0.5">To'g'ri javoblar</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
              <div className="text-rose-400 text-xl font-black">{result.wrongCount} ta</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Noto'g'ri javoblar</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
              <div className="text-amber-400 text-xl font-black">+{result.score} ball</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Umumiy ball</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
              <div className="text-indigo-400 text-xl font-black">
                {Math.floor(result.timeSpentSeconds / 60)} daq {result.timeSpentSeconds % 60} s
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Sarflangan vaqt</div>
            </div>
          </div>

          {/* Explanations Accordion / Section */}
          <div className="mb-6">
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="w-full py-3 px-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-xs font-bold text-slate-200 transition-colors"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                Savollar tahlili va to'g'ri yechimlar tushuntirishi ({result.reviewItems?.length || 0} ta)
              </span>
              <span className="text-indigo-400">{showExplanation ? "Yashirish ▲" : "Ko'rish ▼"}</span>
            </button>

            {showExplanation && (
              <div className="mt-3 space-y-3 max-h-80 overflow-y-auto pr-1">
                {result.reviewItems?.map((item, idx) => (
                  <div 
                    key={item.questionId}
                    className={`p-4 rounded-2xl border text-xs ${
                      item.isCorrect 
                        ? 'bg-emerald-950/20 border-emerald-500/30' 
                        : 'bg-rose-950/20 border-rose-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold mb-1">
                      <span className="flex items-center gap-1.5 text-white">
                        {item.isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                        Savol {idx + 1}: {item.questionText}
                      </span>
                      <span className={item.isCorrect ? 'text-emerald-400' : 'text-rose-400'}>
                        {item.pointsEarned}/{item.maxPoints} ball
                      </span>
                    </div>

                    {item.formula && (
                      <div className="font-mono bg-slate-900/70 p-2 rounded-lg text-indigo-300 my-2 font-semibold">
                        {item.formula}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 font-medium">
                      <div className="p-2 rounded-xl bg-slate-900/40">
                        <span className="text-slate-400">Sizning javobingiz: </span>
                        <span className={item.isCorrect ? 'text-emerald-300 font-bold' : 'text-rose-300 font-bold'}>
                          {item.userAnswer ? String(item.userAnswer) : "Belgilanmagan"}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-900/40">
                        <span className="text-slate-400">To'g'ri javob: </span>
                        <span className="text-emerald-300 font-bold">{String(item.correctAnswer)}</span>
                      </div>
                    </div>

                    <div className="mt-2.5 p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-slate-300">
                      <strong className="text-indigo-300 block mb-0.5">Yechim tushuntirishi:</strong>
                      {item.explanation}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => {
                setResult(null);
                setCurrentIndex(0);
                setUserAnswers({});
                setSecondsLeft((testData.timeLimitMinutes || 20) * 60);
              }}
              className="w-full sm:flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Testni qayta topshirish
            </button>
            <button
              onClick={onClose}
              className="w-full sm:flex-1 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
            >
              Natijalarni saqlash va chiqish
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =================== ACTIVE TEST VIEW ===================
  const answeredCount = Object.keys(userAnswers).filter(k => userAnswers[k] !== undefined && userAnswers[k] !== '').length;
  const progressPercent = Math.round(((currentIndex + 1) / testData.questions.length) * 100);
  const remainingQuestionsCount = testData.questions.length - answeredCount;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-slate-100 overflow-y-auto">
      {/* Test Top bar */}
      <header className="sticky top-0 z-20 glass-panel border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xs">
            {testData.grade}-s
          </div>
          <div>
            <h2 className="font-extrabold text-sm sm:text-base text-white tracking-tight line-clamp-1">
              {testData.title}
            </h2>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span>Savol: {currentIndex + 1} / {testData.questions.length}</span>
              <span>•</span>
              <span className="text-amber-400 font-semibold">{remainingQuestionsCount} ta savol qoldi</span>
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono font-bold text-xs sm:text-sm ${
            secondsLeft < 120 
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
              : 'bg-slate-900 text-indigo-300 border-slate-800'
          }`}>
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>{formatTimer(secondsLeft)}</span>
          </div>

          <button
            onClick={() => setConfirmSubmitModal(true)}
            className="hidden sm:flex px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 items-center gap-1.5 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            Yakunlash
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 h-1.5">
        <div 
          className="bg-gradient-to-r from-indigo-500 via-indigo-400 to-cyan-400 h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question Navigation Bubbles */}
      <div className="max-w-4xl mx-auto w-full px-4 pt-4 flex items-center gap-1.5 overflow-x-auto pb-2">
        {testData.questions.map((q, idx) => {
          const isAnswered = userAnswers[q.id] !== undefined && userAnswers[q.id] !== '';
          const isCurrent = idx === currentIndex;
          return (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(idx)}
              className={`w-8 h-8 rounded-xl text-xs font-bold shrink-0 transition-all ${
                isCurrent 
                  ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-950 scale-110'
                  : isAnswered
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Main Question Body */}
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 flex flex-col justify-between">
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
          {/* Question Tag */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              {currentQ.type === 'single_choice' && "Bitta to'g'ri javob"}
              {currentQ.type === 'multiple_choice' && "Bir nechta to'g'ri javob"}
              {currentQ.type === 'number_input' && "Son kiritish"}
              {currentQ.type === 'equation_solve' && "Tenglamani yechish"}
              {currentQ.type === 'geometry' && "Geometriya savoli"}
              {currentQ.type === 'logic_puzzle' && "Mantiqiy masala"}
            </span>
            <span className="text-xs font-bold text-amber-400">
              +{currentQ.points} ball
            </span>
          </div>

          {/* Question Text */}
          <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed mb-4">
            {currentIndex + 1}. {currentQ.questionText}
          </h3>

          {/* Optional Formula display */}
          {currentQ.formula && (
            <div className="mb-5 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 font-mono text-center text-indigo-300 text-base sm:text-lg font-semibold tracking-wide">
              {currentQ.formula}
            </div>
          )}

          {/* Optional Geometry Diagram SVG */}
          {currentQ.diagramSvg && (
            <div 
              className="my-5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex justify-center items-center"
              dangerouslySetInnerHTML={{ __html: currentQ.diagramSvg }}
            />
          )}

          {/* Answers Component by Type */}
          {(currentQ.type === 'single_choice' || currentQ.type === 'equation_solve' || currentQ.type === 'geometry' || currentQ.type === 'logic_puzzle') && currentQ.options && (
            <div className="space-y-2.5 mt-5">
              {currentQ.options.map((opt, oIdx) => {
                const isSelected = userAnswers[currentQ.id] === opt;
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectOption(currentQ.id, opt, false)}
                    className={`w-full p-4 rounded-2xl text-left font-medium text-xs sm:text-sm flex items-center justify-between transition-all border ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                        : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {String.fromCharCode(65 + oIdx)}
                      </div>
                      <span>{opt}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                  </button>
                );
              })}
            </div>
          )}

          {currentQ.type === 'multiple_choice' && currentQ.options && (
            <div className="space-y-2.5 mt-5">
              <p className="text-xs text-slate-400 italic mb-2">Barcha to'g'ri javoblarni tanlang:</p>
              {currentQ.options.map((opt, oIdx) => {
                const isSelected = (userAnswers[currentQ.id] || []).includes(opt);
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectOption(currentQ.id, opt, true)}
                    className={`w-full p-4 rounded-2xl text-left font-medium text-xs sm:text-sm flex items-center justify-between transition-all border ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                        : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-md text-xs font-bold flex items-center justify-center border shrink-0 ${
                        isSelected ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-700 bg-slate-800'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <span>{opt}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {currentQ.type === 'number_input' && (
            <div className="mt-5 space-y-3">
              <label className="block text-xs font-semibold text-slate-300">
                Javobingizni (aniq son yoki kasr) kiriting:
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="masalan: 140 yoki -12"
                  value={userAnswers[currentQ.id] || ''}
                  onChange={(e) => handleNumberInput(currentQ.id, e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-900/80 border border-slate-700 text-white font-mono text-base focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Quick Math Symbols Bar for easy input */}
              <div className="flex items-center gap-1.5 flex-wrap pt-2">
                <span className="text-[10px] text-slate-500 font-semibold mr-1">Tezkor belgilar:</span>
                {['-', '+', '/', '.', 'π', '√', '²', '0', '5'].map((sym) => (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => {
                      const cur = userAnswers[currentQ.id] || '';
                      handleNumberInput(currentQ.id, cur + sym);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold"
                  >
                    {sym}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => handleNumberInput(currentQ.id, '')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 text-xs"
                >
                  Tozalash
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between gap-3 mt-6">
          <button
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 disabled:opacity-40 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Oldingi
          </button>

          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={() => setConfirmSubmitModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Tugatish
            </button>
          </div>

          {currentIndex < testData.questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex(prev => prev + 1)}
              className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-indigo-600/30"
            >
              Keyingi
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setConfirmSubmitModal(true)}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              Testni topshirish
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel p-6 rounded-3xl max-w-md w-full border border-slate-700 text-slate-100 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-3">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-center text-white">Testni yakunlaysizmi?</h3>
            <p className="text-xs text-slate-400 text-center mt-2 mb-4">
              Siz jami {testData.questions.length} ta savoldan <strong className="text-white">{answeredCount} tasiga</strong> javob berdingiz.
              {remainingQuestionsCount > 0 && (
                <span className="text-amber-400 block mt-1 font-semibold">
                  ⚠️ {remainingQuestionsCount} ta savol belgilanmagan!
                </span>
              )}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setConfirmSubmitModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700"
              >
                Davom ettirish
              </button>
              <button
                onClick={handleSubmitTest}
                disabled={submitting}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5"
              >
                {submitting ? "Tekshirilmoqda..." : "Ha, topshirish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
