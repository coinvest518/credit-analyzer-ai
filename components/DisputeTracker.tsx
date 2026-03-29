import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays, Plus, ExternalLink, CheckCircle2, AlertTriangle,
  Clock, Trash2, ChevronDown, XCircle, Filter, RefreshCw,
  Bell, TrendingUp, FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc,
  doc, query, orderBy, serverTimestamp
} from 'firebase/firestore';

// ─── Types ────────────────────────────────────────────────────────────────────

export type Bureau = 'TransUnion' | 'Equifax' | 'Experian' | 'Creditor' | 'Debt Collector' | 'CFPB';
export type DisputeStatus = 'pending' | 'responded' | 'resolved' | 'escalated';
export type LetterType = 'Credit Bureau' | 'Debt Collector' | 'Creditor' | 'CFPB';

export interface Dispute {
  id: string;
  bureau: Bureau;
  accountName: string;
  letterType: LetterType;
  sentDate: string;        // ISO date string
  deadlineDate: string;    // ISO date string (sentDate + 30 days)
  status: DisputeStatus;
  notes?: string;
  createdAt?: any;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const BUREAU_COLORS: Record<Bureau, { bg: string; text: string; dot: string }> = {
  TransUnion:      { bg: 'bg-blue-100',   text: 'text-blue-700',   dot: 'bg-blue-500' },
  Equifax:         { bg: 'bg-red-100',    text: 'text-red-700',    dot: 'bg-red-500' },
  Experian:        { bg: 'bg-indigo-100', text: 'text-indigo-700', dot: 'bg-indigo-500' },
  Creditor:        { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500' },
  'Debt Collector':{ bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
  CFPB:            { bg: 'bg-teal-100',   text: 'text-teal-700',   dot: 'bg-teal-500' },
};

const STATUS_META: Record<DisputeStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pending:    { label: 'Pending',    color: 'bg-yellow-100 text-yellow-700',  icon: <Clock className="w-3 h-3" /> },
  responded:  { label: 'Responded', color: 'bg-blue-100 text-blue-700',      icon: <Bell className="w-3 h-3" /> },
  resolved:   { label: 'Resolved',  color: 'bg-green-100 text-green-700',    icon: <CheckCircle2 className="w-3 h-3" /> },
  escalated:  { label: 'Escalated', color: 'bg-red-100 text-red-700',        icon: <TrendingUp className="w-3 h-3" /> },
};

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function getDaysRemaining(deadlineDate: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const deadline = new Date(deadlineDate);
  deadline.setHours(0, 0, 0, 0);
  return Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function getUrgency(days: number): { label: string; color: string; bar: string; bg: string } {
  if (days < 0)   return { label: `${Math.abs(days)}d overdue`, color: 'text-red-600',    bar: 'bg-red-500',    bg: 'bg-red-50 border-red-200' };
  if (days === 0) return { label: 'Due today!',                 color: 'text-red-600',    bar: 'bg-red-500',    bg: 'bg-red-50 border-red-200' };
  if (days <= 5)  return { label: `${days}d left`,              color: 'text-orange-600', bar: 'bg-orange-400', bg: 'bg-orange-50 border-orange-200' };
  if (days <= 14) return { label: `${days}d left`,              color: 'text-yellow-600', bar: 'bg-yellow-400', bg: 'bg-yellow-50 border-yellow-200' };
  return           { label: `${days}d left`,                    color: 'text-green-600',  bar: 'bg-green-400',  bg: 'bg-green-50 border-green-200' };
}

function getGoogleCalendarUrl(dispute: Dispute): string {
  const date = dispute.deadlineDate.replace(/-/g, '');
  const title = encodeURIComponent(`📋 30-Day Deadline: ${dispute.bureau} – ${dispute.accountName}`);
  const details = encodeURIComponent(
    `Dispute letter sent: ${dispute.sentDate}\nBureau: ${dispute.bureau}\nAccount: ${dispute.accountName}\nType: ${dispute.letterType}\n\nUnder the FCRA, bureaus must respond within 30 days.`
  );
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${date}/${date}&details=${details}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── Sub-components ────────────────────────────────────────────────────────────

const StatCard = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 text-center">
    <div className={`text-2xl font-bold ${color}`}>{value}</div>
    <div className="text-xs text-gray-400 mt-1">{label}</div>
  </div>
);

interface AddDisputeModalProps {
  onSave: (data: Omit<Dispute, 'id' | 'createdAt'>) => Promise<void>;
  onClose: () => void;
  prefill?: Partial<Dispute>;
}

const AddDisputeModal: React.FC<AddDisputeModalProps> = ({ onSave, onClose, prefill }) => {
  const [form, setForm] = useState({
    bureau: prefill?.bureau ?? 'TransUnion' as Bureau,
    accountName: prefill?.accountName ?? '',
    letterType: prefill?.letterType ?? 'Credit Bureau' as LetterType,
    sentDate: prefill?.sentDate ?? new Date().toISOString().split('T')[0],
    notes: prefill?.notes ?? '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const deadlineDate = addDays(form.sentDate, 30);
    await onSave({ ...form, deadlineDate, status: 'pending' });
    setSaving(false);
  };

  const field = "w-full bg-gray-700/60 border border-gray-600 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Add Dispute</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Account / Creditor Name</label>
            <input required className={field} placeholder="e.g. Capital One – Card ending 4521"
              value={form.accountName} onChange={e => setForm({ ...form, accountName: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Bureau / Recipient</label>
              <select className={field} value={form.bureau} onChange={e => setForm({ ...form, bureau: e.target.value as Bureau })}>
                {(['TransUnion','Equifax','Experian','Creditor','Debt Collector','CFPB'] as Bureau[]).map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Letter Type</label>
              <select className={field} value={form.letterType} onChange={e => setForm({ ...form, letterType: e.target.value as LetterType })}>
                {(['Credit Bureau','Debt Collector','Creditor','CFPB'] as LetterType[]).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Date Letter Sent</label>
            <input type="date" required className={field}
              value={form.sentDate} onChange={e => setForm({ ...form, sentDate: e.target.value })} />
            <p className="text-xs text-gray-500 mt-1">
              Deadline auto-sets to {form.sentDate ? formatDate(addDays(form.sentDate, 30)) : '30 days later'}
            </p>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Notes (optional)</label>
            <textarea className={field} rows={2} placeholder="Tracking number, account details, etc."
              value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" className="flex-1 text-gray-400" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving} className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white">
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Add Dispute'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// ─── Dispute Card ──────────────────────────────────────────────────────────────

interface DisputeCardProps {
  dispute: Dispute;
  onStatusChange: (id: string, status: DisputeStatus) => void;
  onDelete: (id: string) => void;
  tick: number; // forces re-render for live countdown
}

const DisputeCard: React.FC<DisputeCardProps> = ({ dispute, onStatusChange, onDelete, tick }) => {
  const [expanded, setExpanded] = useState(false);
  const daysLeft = getDaysRemaining(dispute.deadlineDate);
  const urgency = getUrgency(daysLeft);
  const bureau = BUREAU_COLORS[dispute.bureau];
  const status = STATUS_META[dispute.status];
  const progressPct = Math.min(100, Math.max(0, ((30 - daysLeft) / 30) * 100));
  const isActive = dispute.status === 'pending' || dispute.status === 'responded';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={`bg-gray-800/70 border rounded-xl overflow-hidden transition-all ${
        isActive && daysLeft <= 5 ? 'border-red-500/50' :
        isActive && daysLeft <= 14 ? 'border-yellow-500/30' :
        'border-gray-700/50'
      }`}
    >
      {/* Top urgency stripe */}
      {isActive && daysLeft <= 5 && (
        <div className="h-1 bg-gradient-to-r from-red-500 to-orange-500" />
      )}

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full ${bureau.bg} ${bureau.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${bureau.dot}`} />
              {dispute.bureau}
            </span>
            <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${status.color}`}>
              {status.icon}
              {status.label}
            </span>
          </div>

          {/* Countdown badge */}
          {isActive && (
            <span className={`text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 ${urgency.color} bg-gray-700/60`}>
              {urgency.label}
            </span>
          )}
        </div>

        {/* Account name */}
        <div className="mt-3">
          <p className="text-white font-semibold text-sm">{dispute.accountName}</p>
          <p className="text-gray-400 text-xs mt-0.5 flex items-center gap-1">
            <FileText className="w-3 h-3" />
            {dispute.letterType} letter
          </p>
        </div>

        {/* Progress bar (only for active) */}
        {isActive && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Sent {formatDate(dispute.sentDate)}</span>
              <span>Deadline {formatDate(dispute.deadlineDate)}</span>
            </div>
            <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${urgency.bar}`}
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1 transition-colors"
        >
          <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          {expanded ? 'Less' : 'Actions & Details'}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-3 space-y-3 border-t border-gray-700/50 mt-3">
                {dispute.notes && (
                  <p className="text-xs text-gray-400 italic">{dispute.notes}</p>
                )}

                {/* Status actions */}
                <div className="flex flex-wrap gap-2">
                  {dispute.status === 'pending' && (
                    <button
                      onClick={() => onStatusChange(dispute.id, 'responded')}
                      className="text-xs bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-600/30 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Bell className="w-3 h-3" /> Mark Responded
                    </button>
                  )}
                  {(dispute.status === 'pending' || dispute.status === 'responded') && (
                    <button
                      onClick={() => onStatusChange(dispute.id, 'resolved')}
                      className="text-xs bg-green-600/20 hover:bg-green-600/40 text-green-400 border border-green-600/30 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" /> Mark Resolved
                    </button>
                  )}
                  {dispute.status !== 'escalated' && dispute.status !== 'resolved' && (
                    <button
                      onClick={() => onStatusChange(dispute.id, 'escalated')}
                      className="text-xs bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-600/30 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <TrendingUp className="w-3 h-3" /> Escalate
                    </button>
                  )}
                </div>

                <div className="flex gap-2">
                  <a
                    href={getGoogleCalendarUrl(dispute)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-xs bg-gray-700/60 hover:bg-gray-600/60 text-gray-300 border border-gray-600/40 px-3 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <CalendarDays className="w-3 h-3" />
                    Add to Google Calendar
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                  <button
                    onClick={() => onDelete(dispute.id)}
                    className="text-xs bg-gray-700/60 hover:bg-red-900/40 text-gray-500 hover:text-red-400 border border-gray-600/40 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────

type FilterTab = 'all' | 'active' | 'urgent' | 'resolved';

interface DisputeTrackerProps {
  autoAdd?: Omit<Dispute, 'id' | 'createdAt'>[];
}

const DisputeTracker: React.FC<DisputeTrackerProps> = ({ autoAdd }) => {
  const { currentUser } = useAuth();
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [showAdd, setShowAdd] = useState(false);
  const [tick, setTick] = useState(0); // live countdown ticker
  const [loading, setLoading] = useState(true);

  // Live tick every minute for countdown freshness
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  // Real-time Firestore listener
  useEffect(() => {
    if (!currentUser) { setLoading(false); return; }
    const q = query(
      collection(db, 'users', currentUser.uid, 'disputes'),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setDisputes(snap.docs.map(d => ({ id: d.id, ...d.data() } as Dispute)));
      setLoading(false);
    });
    return unsub;
  }, [currentUser]);

  // Auto-add disputes from letter generation
  useEffect(() => {
    if (!autoAdd?.length || !currentUser) return;
    autoAdd.forEach(dispute => addDispute(dispute));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoAdd]);

  const addDispute = useCallback(async (data: Omit<Dispute, 'id' | 'createdAt'>) => {
    if (!currentUser) return;
    await addDoc(collection(db, 'users', currentUser.uid, 'disputes'), {
      ...data,
      createdAt: serverTimestamp(),
    });
  }, [currentUser]);

  const updateStatus = useCallback(async (id: string, status: DisputeStatus) => {
    if (!currentUser) return;
    await updateDoc(doc(db, 'users', currentUser.uid, 'disputes', id), { status });
  }, [currentUser]);

  const deleteDispute = useCallback(async (id: string) => {
    if (!currentUser) return;
    await deleteDoc(doc(db, 'users', currentUser.uid, 'disputes', id));
  }, [currentUser]);

  // Stats
  const active   = disputes.filter(d => d.status === 'pending' || d.status === 'responded');
  const overdue  = active.filter(d => getDaysRemaining(d.deadlineDate) < 0);
  const urgent   = active.filter(d => { const r = getDaysRemaining(d.deadlineDate); return r >= 0 && r <= 7; });
  const resolved = disputes.filter(d => d.status === 'resolved' || d.status === 'escalated');

  // Filtered list
  const filtered = disputes.filter(d => {
    if (filter === 'active')   return d.status === 'pending' || d.status === 'responded';
    if (filter === 'urgent')   return (d.status === 'pending' || d.status === 'responded') && getDaysRemaining(d.deadlineDate) <= 7;
    if (filter === 'resolved') return d.status === 'resolved' || d.status === 'escalated';
    return true;
  });

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CalendarDays className="w-10 h-10 text-gray-500 mb-3" />
        <p className="text-gray-400">Sign in to track your disputes</p>
      </div>
    );
  }

  const TABS: { key: FilterTab; label: string; count?: number }[] = [
    { key: 'all',      label: 'All',      count: disputes.length },
    { key: 'active',   label: 'Active',   count: active.length },
    { key: 'urgent',   label: 'Urgent',   count: urgent.length + overdue.length },
    { key: 'resolved', label: 'Resolved', count: resolved.length },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-cyan-400" />
            Dispute Tracker
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">Live updates · 30-day FCRA deadlines</p>
        </div>
        <Button
          size="sm"
          onClick={() => setShowAdd(true)}
          className="bg-cyan-600 hover:bg-cyan-500 text-white gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Add Dispute
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard label="Total"   value={disputes.length} color="text-white" />
        <StatCard label="Active"  value={active.length}   color="text-cyan-400" />
        <StatCard label="Urgent"  value={urgent.length + overdue.length} color={urgent.length + overdue.length > 0 ? 'text-red-400' : 'text-gray-400'} />
        <StatCard label="Resolved" value={resolved.length} color="text-green-400" />
      </div>

      {/* Overdue alert */}
      {overdue.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-900/30 border border-red-500/40 rounded-xl p-3 flex items-center gap-3"
        >
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <div>
            <p className="text-red-300 text-sm font-semibold">
              {overdue.length} dispute{overdue.length > 1 ? 's' : ''} overdue!
            </p>
            <p className="text-red-400/70 text-xs">
              The bureau missed the 30-day window — you may have grounds to escalate or file a CFPB complaint.
            </p>
          </div>
        </motion.div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-1 bg-gray-800/50 rounded-xl p-1">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex-1 text-xs font-medium py-2 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              filter === tab.key
                ? 'bg-cyan-600 text-white shadow'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Filter className="w-2.5 h-2.5" />
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`text-[10px] px-1 rounded-full ${filter === tab.key ? 'bg-white/20' : 'bg-gray-700'}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 text-center border border-dashed border-gray-700 rounded-xl">
          <CalendarDays className="w-10 h-10 text-gray-600 mb-3" />
          <p className="text-gray-400 font-medium">No disputes here</p>
          <p className="text-gray-500 text-sm mt-1">
            {filter === 'all' ? 'Add your first dispute after sending a letter.' : `No ${filter} disputes right now.`}
          </p>
          {filter === 'all' && (
            <Button size="sm" className="mt-4 bg-cyan-600 hover:bg-cyan-500 text-white gap-1" onClick={() => setShowAdd(true)}>
              <Plus className="w-3 h-3" /> Add Dispute
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map(d => (
              <DisputeCard
                key={d.id}
                dispute={d}
                onStatusChange={updateStatus}
                onDelete={deleteDispute}
                tick={tick}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add modal */}
      <AnimatePresence>
        {showAdd && (
          <AddDisputeModal
            onSave={async (data) => { await addDispute(data); setShowAdd(false); }}
            onClose={() => setShowAdd(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DisputeTracker;
