import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Layers, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  X, 
  Play, 
  CheckCircle2,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { Topic, GradeLevel } from '../../types/index.ts';

interface LessonsViewProps {
  initialTopicId?: string;
  userGrade?: GradeLevel;
  onStartTestByTopic?: (topicId: string) => void;
}

export const LessonsView: React.FC<LessonsViewProps> = ({
  initialTopicId,
  userGrade = 5,
  onStartTestByTopic
}) => {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(userGrade);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Barchasi');
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/topics?grade=${selectedGrade}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTopics(data.topics || []);
          if (initialTopicId) {
            const found = data.topics.find((t: Topic) => t.id === initialTopicId);
            if (found) setActiveTopic(found);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedGrade, initialTopicId]);

  // Categories list
  const categories = ['Barchasi', ...Array.from(new Set(topics.map(t => t.category)))];

  const filteredTopics = topics.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'Barchasi' || t.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header with Grade Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-indigo-400" />
            Matematika Darslari va Nazariya
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            5, 6, 7 va 8-sinflar uchun to'liq davlat o'quv dasturi
          </p>
        </div>

        {/* Grade Level Selector Buttons */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shrink-0">
          {([5, 6, 7, 8] as GradeLevel[]).map(g => (
            <button
              key={g}
              onClick={() => {
                setSelectedGrade(g);
                setSelectedCategory('Barchasi');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedGrade === g
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {g}-sinf
            </button>
          ))}
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Mavzularni qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Topics Grid */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400">Mavzular yuklanmoqda...</p>
        </div>
      ) : filteredTopics.length === 0 ? (
        <div className="p-12 text-center glass-panel rounded-3xl border border-slate-800">
          <p className="text-sm text-slate-400">Qidiruv bo'yicha hech qanday mavzu topilmadi.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTopics.map((topic, idx) => (
            <div
              key={topic.id}
              onClick={() => setActiveTopic(topic)}
              className="glass-card glass-card-hover rounded-3xl p-6 border border-slate-800/90 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {topic.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{topic.estimatedMinutes} daqiqa</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {idx + 1}. {topic.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {topic.description}
                </p>

                {/* Formula Highlight Preview */}
                <div className="mt-4 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 font-mono text-xs text-amber-300 font-semibold truncate">
                  {topic.formulaSummary}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {topic.questionCount} ta savol
                </span>
                <span className="text-xs font-bold text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Darsni ochish
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TOPIC DETAIL & LESSON MODAL */}
      {activeTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl glass-panel rounded-3xl border border-slate-700/80 shadow-2xl p-6 sm:p-8 my-auto text-slate-100 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setActiveTopic(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="pb-4 border-b border-slate-800 pr-10">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {activeTopic.grade}-sinf • {activeTopic.category}
                </span>
                <span className="text-xs text-amber-400 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {activeTopic.estimatedMinutes} daqiqa darslik
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {activeTopic.title}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {activeTopic.description}
              </p>
            </div>

            {/* Formula Card */}
            <div className="my-5 p-4 rounded-2xl bg-gradient-to-r from-indigo-950/70 to-slate-900 border border-indigo-500/30 shadow-lg">
              <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block mb-1">
                Asosiy formula / Qoida:
              </span>
              <div className="font-mono text-base sm:text-lg font-bold text-amber-300">
                {activeTopic.formulaSummary}
              </div>
            </div>

            {/* Detailed Theory Sections */}
            <div className="space-y-5 my-6">
              {activeTopic.theoryContent?.sections?.map((sec, sIdx) => (
                <div key={sIdx} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                  <h4 className="font-bold text-sm sm:text-base text-white mb-2 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-lg bg-indigo-600/30 text-indigo-300 text-xs flex items-center justify-center font-bold">
                      {sIdx + 1}
                    </span>
                    {sec.heading}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {sec.text}
                  </p>

                  {sec.formula && (
                    <div className="my-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-indigo-300 text-xs font-semibold">
                      {sec.formula}
                    </div>
                  )}

                  {sec.example && (
                    <div className="mt-3 p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                      <div className="text-xs font-bold text-emerald-400 mb-1">
                        Amaliy misol:
                      </div>
                      <div className="text-xs text-slate-200 font-medium">
                        {sec.example.problem}
                      </div>
                      <div className="mt-2 text-xs text-slate-300 pl-2 border-l-2 border-emerald-500/60">
                        <strong className="text-emerald-300">Yechimi:</strong> {sec.example.solution}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                Mavzuni to'liq tushungach, o'z bilimingizni test orqali sinab ko'ring.
              </span>
              <button
                onClick={() => {
                  const tId = activeTopic.id;
                  setActiveTopic(null);
                  if (onStartTestByTopic) onStartTestByTopic(tId);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Play className="w-4 h-4 fill-white" />
                Ushbu mavzudan test ishlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
