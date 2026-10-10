import React, { useState, useEffect } from 'react';
import { reportService, CardReport } from '../../services/reportService';
import { useToast } from '../../context/ToastContext';
import { soundEffects } from '../../utils/audio';
import { Flag, CheckCircle, XCircle, Ban, Filter, Search, RefreshCw, AlertTriangle } from 'lucide-react';

export const CardReportModeration: React.FC = () => {
  const { showToast } = useToast();
  const [reports, setReports] = useState<CardReport[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'resolved' | 'dismissed'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const data = await reportService.getAllReports();
      setReports(data);
    } catch {
      showToast('Failed to load card reports', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleUpdateStatus = async (reportId: string, status: 'resolved' | 'dismissed') => {
    soundEffects.playClick();
    await reportService.updateReportStatus(reportId, status);
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status } : r));
    showToast(`Report marked as ${status}`, 'success');
  };

  const handleDisableCard = async (report: CardReport) => {
    soundEffects.playClick();
    reportService.disableCard(report.cardId);
    await reportService.updateReportStatus(report.id, 'resolved', 'Card disabled from active deck');
    setReports(prev => prev.map(r => r.id === report.id ? { ...r, status: 'resolved' } : r));
    showToast('Card disabled from games and report resolved!', 'success');
  };

  const filtered = reports.filter(r => {
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchesSearch =
      r.promptText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.gameId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reason.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getReasonBadgeColor = (reason: string) => {
    switch (reason) {
      case 'offensive': return 'bg-rose-950/60 text-rose-300 border-rose-500/40';
      case 'duplicate': return 'bg-amber-950/60 text-amber-300 border-amber-500/40';
      case 'broken': return 'bg-red-950/60 text-red-300 border-red-500/40';
      default: return 'bg-purple-950/60 text-purple-300 border-purple-500/40';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black uppercase text-white flex items-center gap-2">
            <Flag className="w-5 h-5 text-rose-400" />
            <span>Card Reports & Moderation</span>
          </h2>
          <p className="text-xs text-zinc-400">
            Review community-flagged cards, inappropriate content, and game bugs
          </p>
        </div>

        <button
          onClick={fetchReports}
          className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/25 text-xs font-semibold text-zinc-300 flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reported text, game ID, or reason..."
            className="w-full bg-black/50 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-400/50"
          />
        </div>

        <div className="flex gap-2">
          {(['pending', 'resolved', 'dismissed', 'all'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                filterStatus === status
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-sm'
                  : 'bg-white/[0.02] border-white/10 text-zinc-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-3xl glass-panel border border-white/10">
          <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-sm font-bold text-white mb-1">No reports matching this view</h3>
          <p className="text-xs text-zinc-400">
            {filterStatus === 'pending'
              ? 'All flagged cards have been reviewed and resolved!'
              : 'Try selecting a different filter.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((report) => (
            <div
              key={report.id}
              className="p-5 rounded-2xl glass-panel border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getReasonBadgeColor(report.reason)}`}>
                      {report.reason}
                    </span>
                    <span className="text-[11px] font-bold text-zinc-400">
                      Game: <span className="text-white">{report.gameId}</span> ({report.category})
                    </span>
                  </div>

                  <span className="text-[10px] text-zinc-500">
                    {new Date(report.createdAt).toLocaleDateString()} {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Prompt quote */}
                <div className="p-3.5 rounded-xl bg-black/60 border border-white/5 my-2">
                  <p className="text-xs sm:text-sm font-semibold text-zinc-200">
                    "{report.promptText}"
                  </p>
                </div>

                {report.details && (
                  <p className="text-xs text-zinc-400 mt-2 bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                    <span className="font-bold text-zinc-300">Reporter comment:</span> {report.details}
                  </p>
                )}
              </div>

              {/* Status & Actions */}
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/5 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Status:</span>
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider ${
                      report.status === 'pending'
                        ? 'text-amber-400'
                        : report.status === 'resolved'
                        ? 'text-emerald-400'
                        : 'text-zinc-400'
                    }`}
                  >
                    {report.status}
                  </span>
                </div>

                {report.status === 'pending' && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => handleUpdateStatus(report.id, 'dismissed')}
                      className="px-3 py-1.5 rounded-xl border border-white/10 hover:border-white/20 text-xs font-semibold text-zinc-400 hover:text-white transition-all cursor-pointer"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => handleDisableCard(report)}
                      className="px-3.5 py-1.5 rounded-xl bg-red-950/50 border border-red-500/40 hover:bg-red-900/60 text-xs font-bold text-red-300 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>Disable Card</span>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(report.id, 'resolved')}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 hover:bg-emerald-900/60 text-xs font-bold text-emerald-300 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Resolve</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

