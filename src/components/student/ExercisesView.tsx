import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  Flame, 
  RotateCcw,
  Zap,
  Lightbulb
} from 'lucide-react';
import { GradeLevel } from '../../types/index.ts';

interface Exercise {
  id: string;
  grade: GradeLevel;
  topic: string;
  question: string;
  formula?: string;
  options: string[];
  correct: string;
  hint: string;
  solution: string;
}

const PRACTICE_EXERCISES: Exercise[] = [
  {
    id: 'ex-1',
    grade: 5,
    topic: 'Natural sonlar',
    question: "Qaysi son 15 ga ham, 20 ga ham qoldiqsiz bo'linadi?",
    options: ['45', '60', '80', '100'],
    correct: '60',
    hint: "15 va 20 ning eng kichik umumiy karralisini (EKUK) toping.",
    solution: "15 = 3 · 5, 20 = 2² · 5. EKUK(15, 20) = 2² · 3 · 5 = 60."
  },
  {
    id: 'ex-2',
    grade: 5,
    topic: 'Foizlar',
    question: "Sinfda 30 nafar o'quvchi bor. Ularning 40% i qizlar. Sinfda nechta qiz bola bor?",
    options: ['10', '12', '14', '15'],
    correct: '12',
    hint: "30 ni 40 ga ko'paytirib, 100 ga bo'ling.",
    solution: "30 · 40 / 100 = 1200 / 100 = 12 nafar qiz bola."
  },
  {
    id: 'ex-3',
    grade: 6,
    topic: 'Musbat va manfiy sonlar',
    question: "(-25) - (-14) ifodaning qiymatini hisoblang:",
    formula: '(-25) - (-14) = ?',
    options: ['-39', '-11', '11', '39'],
    correct: '-11',
    hint: "Minusga minus plyus beradi: -25 + 14.",
    solution: "-25 + 14 = -(25 - 14) = -11."
  },
  {
    id: 'ex-4',
    grade: 7,
    topic: 'Qisqa ko\'paytirish',
    question: "(x + 4)² ifodaning yoyilmasi qanday bo'ladi?",
    formula: '(a + b)² = a² + 2ab + b²',
    options: ['x² + 16', 'x² + 8x + 16', 'x² + 4x + 16', 'x² + 8x + 8'],
    correct: 'x² + 8x + 16',
    hint: "Ikkihad kvadratida ikkilangan ko'paytma 2·x·4 qatnashadi.",
    solution: "x² + 2·x·4 + 4² = x² + 8x + 16."
  },
  {
    id: 'ex-5',
    grade: 8,
    topic: 'Pifagor teoremasi',
    question: "To'g'ri burchakli uchburchakning katetlari 5 sm va 12 sm bo'lsa, gipotenuzasini toping:",
    formula: 'c² = a² + b²',
    options: ['13 sm', '15 sm', '17 sm', '14 sm'],
    correct: '13 sm',
    hint: "5² + 12² = 25 + 144 = 169. √169 ni hisoblang.",
    solution: "c = √(25 + 144) = √169 = 13 sm."
  }
];

export const ExercisesView: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [solvedCount, setSolvedCount] = useState(0);

  const current = PRACTICE_EXERCISES[currentIdx];

  const handleSelect = (opt: string) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);
    if (opt === current.correct) {
      setSolvedCount(prev => prev + 1);
    }
  };

  const handleNext = () => {
    setIsAnswered(false);
    setSelectedOption(null);
    setShowHint(false);
    setCurrentIdx((prev) => (prev + 1) % PRACTICE_EXERCISES.length);
  };

  const isCorrect = selectedOption === current.correct;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Zap className="w-7 h-7 text-amber-400" />
            Interaktiv Matematik Mashqlar
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Tezkor topshiriqlar va darhol tekshiruv
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
          <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>Yechildi: {solvedCount} ta</span>
        </div>
      </div>

      {/* Main Exercise Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {current.grade}-sinf • {current.topic}
          </span>
          <span className="text-xs text-slate-400">
            Mashq {currentIdx + 1} / {PRACTICE_EXERCISES.length}
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-white mb-3">
          {current.question}
        </h3>

        {current.formula && (
          <div className="my-4 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 font-mono text-center text-amber-300 text-sm font-semibold">
            {current.formula}
          </div>
        )}

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-5">
          {current.options.map((opt, i) => {
            const isThisSelected = selectedOption === opt;
            const isThisCorrect = opt === current.correct;

            let btnStyle = "bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-800";
            if (isAnswered) {
              if (isThisCorrect) {
                btnStyle = "bg-emerald-950/40 border-emerald-500 text-emerald-300 font-bold shadow-md shadow-emerald-500/10";
              } else if (isThisSelected) {
                btnStyle = "bg-rose-950/40 border-rose-500 text-rose-300 font-bold shadow-md shadow-rose-500/10";
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(opt)}
                disabled={isAnswered}
                className={`p-4 rounded-2xl border text-left text-sm font-medium transition-all flex items-center justify-between ${btnStyle}`}
              >
                <span>{opt}</span>
                {isAnswered && isThisCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                {isAnswered && isThisSelected && !isThisCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Hint toggle */}
        {!isAnswered && (
          <div className="pt-2">
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              {showHint ? "Maslahatni yashirish" : "Yordam / Maslahat olish"}
            </button>
            {showHint && (
              <div className="mt-2 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
                💡 <strong>Maslahat:</strong> {current.hint}
              </div>
            )}
          </div>
        )}

        {/* Instant Result Box */}
        {isAnswered && (
          <div className={`mt-5 p-4 rounded-2xl border text-xs leading-relaxed ${
            isCorrect ? 'bg-emerald-950/30 border-emerald-500/30' : 'bg-rose-950/30 border-rose-500/30'
          }`}>
            <div className="flex items-center gap-2 font-bold mb-1">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">Barakalla, to'g'ri topdingiz! 🎉</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span className="text-rose-300">Javob noto'g'ri bo'ldi. To'g'ri javob: {current.correct}</span>
                </>
              )}
            </div>
            <div className="mt-2 text-slate-300 border-t border-slate-800/60 pt-2">
              <strong className="text-indigo-300">Batafsil tushuntirish:</strong> {current.solution}
            </div>
          </div>
        )}

        {/* Next Question Button */}
        {isAnswered && (
          <div className="mt-5 flex justify-end">
            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-105"
            >
              Keyingi mashq
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
