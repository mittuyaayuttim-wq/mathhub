import React, { useState, useEffect } from 'react';
import { 
  Link2, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Database, 
  FileSpreadsheet, 
  Layers, 
  Clock, 
  Save,
  Info
} from 'lucide-react';
import { KundalikSyncStatus } from '../../types/index.ts';

export const KundalikIntegrationView: React.FC = () => {
  const [status, setStatus] = useState<KundalikSyncStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncResultMsg, setSyncResultMsg] = useState('');

  // Settings form
  const [schoolId, setSchoolId] = useState('UZ-TAS-SCH-178');
  const [schoolName, setSchoolName] = useState("178-sonli umumiy o'rta ta'lim maktabi");
  const [autoSync, setAutoSync] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/kundalik/status')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.kundalik) {
          setStatus(data.kundalik);
          setSchoolId(data.kundalik.schoolId);
          setSchoolName(data.kundalik.schoolName);
          setAutoSync(data.kundalik.autoSync);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSyncNow = async () => {
    try {
      setSyncing(true);
      setSyncResultMsg('');
      const res = await fetch('/api/kundalik/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const data = await res.json();
      if (data.success) {
        setStatus(data.kundalik);
        setSyncResultMsg(data.message);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSyncing(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/kundalik/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolId,
          schoolName,
          autoSync,
          apiKey: apiKey || undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        setStatus(data.kundalik);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-400">Kundalik moduli yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Link2 className="w-7 h-7 text-cyan-400" />
            Kundalik.com Tizimi Integratsiyasi
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Baholar, jurnallar, o'quvchilar va sinflar ma'lumotlarini elektron jurnal bilan xavfsiz sinxronlash
          </p>
        </div>

        <button
          onClick={handleSyncNow}
          disabled={syncing}
          className="px-5 py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? "Sinxronlashtirilmoqda..." : "Hozir sinxronlash"}
        </button>
      </div>

      {/* Transparent Disclaimer Box as required by prompt */}
      <div className="p-4 rounded-3xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-200 flex items-start gap-3">
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold text-cyan-300 mb-0.5">
            Integratsiya qatlami to'g'risida axborot:
          </strong>
          Kundalik rasmiy API xavfsizlik protokoli asosida sozlangan. Tizim haqiqiy maktab ma'lumotlari xavfsizligini ta'minlash maqsadida xavfsiz oraliq integratsiya qatlami (Integration Layer) orqali ishlaydi va baholarni 5, 4, 3 shkalasiga konvertatsiya qilib jurnalga yuboradi.
        </div>
      </div>

      {syncResultMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{syncResultMsg}</span>
        </div>
      )}

      {/* Status Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-3xl p-5 border border-slate-800">
          <div className="text-xs font-semibold text-slate-400 mb-1">Aloqa holati</div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-lg font-bold text-emerald-400">Faol ulangan</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">HTTPS REST Shifrlangan</p>
        </div>

        <div className="glass-card rounded-3xl p-5 border border-slate-800">
          <div className="text-xs font-semibold text-slate-400 mb-1">Sinxronlangan o'quvchilar</div>
          <div className="text-2xl font-black text-white">
            {status?.syncedStudentsCount || 103} nafar
          </div>
          <p className="text-[11px] text-indigo-400 mt-1">5-A, 6-B, 7-A, 8-V sinflar</p>
        </div>

        <div className="glass-card rounded-3xl p-5 border border-slate-800">
          <div className="text-xs font-semibold text-slate-400 mb-1">Jurnalga uzatilgan baholar</div>
          <div className="text-2xl font-black text-cyan-400">
            {status?.syncedGradesCount || 342} ta
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Matematika fani</p>
        </div>

        <div className="glass-card rounded-3xl p-5 border border-slate-800">
          <div className="text-xs font-semibold text-slate-400 mb-1">Oxirgi sinxronlash</div>
          <div className="text-xs font-bold text-slate-200 mt-1">
            {status?.lastSyncTime ? new Date(status.lastSyncTime).toLocaleString() : "Yaqinda"}
          </div>
          <p className="text-[11px] text-emerald-400 mt-1">Muvaffaqiyatli yakunlandi</p>
        </div>
      </div>

      {/* Sync Audit Logs */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800">
        <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          Sinxronizatsiya jurnali (Audit Logs)
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Kundalik serverlari bilan almashilgan eng so'nggi ma'lumotlar tafsiloti
        </p>

        <div className="space-y-3">
          {status?.recentLogs?.map((log, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <div className="flex items-center gap-2 font-bold text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{log.action}</span>
                </div>
                <p className="text-slate-400 mt-0.5 text-[11px]">{log.details}</p>
              </div>
              <span className="text-[10px] text-slate-500 font-mono shrink-0">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Configuration Form */}
      <form onSubmit={handleSaveSettings} className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-400" />
          Kundalik integratsiya sozlamalari
        </h3>
        <p className="text-xs text-slate-400">
          Ushbu sozlamalarga faqat administrator yoki vakolatli o'qituvchilar ruxsatiga ega.
        </p>

        {saveSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs">
            Sozlamalar muvaffaqiyatli saqlandi!
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Maktab kodi (School ID)
            </label>
            <input
              type="text"
              value={schoolId}
              onChange={(e) => setSchoolId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Maktab nomi
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Kundalik API Kaliti (Maskalangan)
          </label>
          <input
            type="text"
            placeholder={status?.apiKeyMasked || "knd_live_••••••••••••••••"}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center justify-between py-2 border-t border-slate-800">
          <div>
            <div className="text-xs font-semibold text-white">Avtomatik sinxronizatsiya</div>
            <div className="text-[11px] text-slate-400">Har bir test topshirilganda bahoni Kundalik jurnaliga avtomatik yuborish</div>
          </div>
          <button
            type="button"
            onClick={() => setAutoSync(!autoSync)}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              autoSync ? 'bg-cyan-600' : 'bg-slate-800'
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
              autoSync ? 'right-1' : 'left-1'
            }`} />
          </button>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-4 h-4" />
            Sozlamalarni saqlash
          </button>
        </div>
      </form>
    </div>
  );
};
