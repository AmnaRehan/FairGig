import { useCallback, useEffect, useState } from 'react';
import { grievanceAPI } from '../api/config';
import { useAuth } from '../context/auth';
import toast from 'react-hot-toast';

const CATEGORIES = ['commission', 'deactivation', 'payment', 'other'];
const PLATFORMS  = ['Careem', 'Foodpanda', 'Uber', 'Bykea', 'InDrive', 'Other'];

const CAT_META = {
  commission:   { label: 'Commission',   icon: '💸', bg: '#EDE9FE', color: '#6d28d9', border: '#c4b5fd' },
  deactivation: { label: 'Deactivation', icon: '🚫', bg: '#FEE2E2', color: '#dc2626', border: '#fca5a5' },
  payment:      { label: 'Payment',      icon: '💳', bg: '#FEF3C7', color: '#b45309', border: '#fcd34d' },
  other:        { label: 'Other',        icon: '📋', bg: '#F1F5F9', color: '#475569', border: '#cbd5e1' },
};

const STATUS_META = {
  open:      { label: 'Open',      icon: '🔵', bg: '#EFF6FF', color: '#1d4ed8', border: '#93c5fd', left: '#3b82f6' },
  escalated: { label: 'Escalated', icon: '🔴', bg: '#FEE2E2', color: '#dc2626', border: '#fca5a5', left: '#ef4444' },
  resolved:  { label: 'Resolved',  icon: '🟢', bg: '#DCFCE7', color: '#15803d', border: '#86efac', left: '#10b981' },
};

const PLATFORM_ICONS = { Careem: '🟢', Foodpanda: '🔴', Uber: '⚫', Bykea: '🔵', InDrive: '🟡', Other: '⚪' };

export default function GrievanceBoard() {
  const { user } = useAuth();
  const [grievances, setGrievances]   = useState([]);
  const [form, setForm]               = useState({ platform: 'Careem', category: 'commission', title: '', description: '', city: '' });
  const [loading, setLoading]         = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError]     = useState('');
  const [filter, setFilter]           = useState({ platform: '', category: '', status: '' });
  const [showForm, setShowForm]       = useState(false);
  const [expandedId, setExpandedId]   = useState(null);
  const [activeTab, setActiveTab]     = useState('all');

  const load = useCallback(async () => {
    const params = new URLSearchParams(Object.entries(filter).filter(([, v]) => v));
    setPageError('');
    try {
      const r = await grievanceAPI.get(`/grievances?${params}`);
      setGrievances(r.data.grievances || []);
    } catch {
      setPageError('Failed to load grievances.');
    } finally {
      setPageLoading(false);
    }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await grievanceAPI.post('/grievances', { ...form, worker_id: user.id });
      toast.success('Complaint posted!');
      setForm({ platform: 'Careem', category: 'commission', title: '', description: '', city: '' });
      setShowForm(false);
      load();
    } catch {
      toast.error('Failed to post complaint');
    } finally {
      setLoading(false);
    }
  };

  const upvote = async (id) => {
    try {
      await grievanceAPI.post(`/grievances/${id}/upvote`);
      load();
    } catch { toast.error('Failed to upvote'); }
  };

  const updateStatus = async (id, status) => {
    const notes = prompt('Add notes (optional):') || '';
    try {
      await grievanceAPI.patch(`/grievances/${id}/status`, { status, advocate_notes: notes });
      load();
    } catch { toast.error('Failed to update status'); }
  };

  /* Derived counts for tabs */
  const counts = { all: grievances.length, open: 0, escalated: 0, resolved: 0 };
  grievances.forEach(g => { if (counts[g.status] !== undefined) counts[g.status]++; });

  const displayed = activeTab === 'all' ? grievances : grievances.filter(g => g.status === activeTab);

  return (
    <div style={s.root}>
      <style>{CSS}</style>

      {/* ── PAGE HEADER ── */}
      <div style={s.pageHeader}>
        <div style={s.headerLeft}>
          <div style={s.headerIcon}>📢</div>
          <div>
            <h1 style={s.pageTitle}>Grievance Board</h1>
            <p style={s.pageDesc}>Share complaints · Get support · Fight unfair treatment</p>
          </div>
        </div>
        {user.role === 'worker' && (
          <button
            onClick={() => setShowForm(f => !f)}
            className={showForm ? 'fg-cancel-btn' : 'fg-post-btn'}
            style={showForm ? s.cancelBtn : s.postBtn}
          >
            {showForm ? '✕  Cancel' : '+ Post Complaint'}
          </button>
        )}
      </div>

      {/* ── SUMMARY STATS ── */}
      <div style={s.statsRow}>
        {[
          { label: 'Total Complaints', value: counts.all,      bg: '#EFF6FF', color: '#1d4ed8', icon: '📋' },
          { label: 'Open',             value: counts.open,      bg: '#EFF6FF', color: '#1d4ed8', icon: '🔵' },
          { label: 'Escalated',        value: counts.escalated, bg: '#FEE2E2', color: '#dc2626', icon: '🔴' },
          { label: 'Resolved',         value: counts.resolved,  bg: '#DCFCE7', color: '#15803d', icon: '🟢' },
        ].map(st => (
          <div key={st.label} style={{ ...s.statCard, background: st.bg }}>
            <span style={{ fontSize: 22 }}>{st.icon}</span>
            <div>
              <div style={{ ...s.statVal, color: st.color }}>{st.value}</div>
              <div style={s.statLabel}>{st.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── POST FORM ── */}
      {user.role === 'worker' && showForm && (
        <div style={s.formCard} className="fg-fadein">
          <div style={s.formCardHeader}>
            <span style={{ fontSize: 20 }}>📝</span>
            <h3 style={s.formCardTitle}>Post a New Complaint</h3>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Platform */}
            <div style={s.fieldWrap}>
              <label style={s.label}>Which Platform?</label>
              <div style={s.pillRow}>
                {PLATFORMS.map(p => (
                  <button type="button" key={p}
                    onClick={() => setForm(f => ({ ...f, platform: p }))}
                    className="fg-pill-btn"
                    style={{
                      ...s.pillBtn,
                      background: form.platform === p ? '#DBEAFE' : '#F8FAFC',
                      border:     form.platform === p ? '2px solid #2563EB' : '2px solid #e2e8f0',
                      color:      form.platform === p ? '#1d4ed8' : '#64748b',
                      fontWeight: form.platform === p ? 800 : 600,
                    }}>
                    {PLATFORM_ICONS[p]} {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div style={s.fieldWrap}>
              <label style={s.label}>What's the Issue?</label>
              <div style={s.pillRow}>
                {CATEGORIES.map(c => {
                  const m = CAT_META[c];
                  const active = form.category === c;
                  return (
                    <button type="button" key={c}
                      onClick={() => setForm(f => ({ ...f, category: c }))}
                      className="fg-pill-btn"
                      style={{
                        ...s.pillBtn,
                        background: active ? m.bg     : '#F8FAFC',
                        border:     active ? `2px solid ${m.border}` : '2px solid #e2e8f0',
                        color:      active ? m.color  : '#64748b',
                        fontWeight: active ? 800 : 600,
                      }}>
                      {m.icon} {m.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title */}
            <div style={s.fieldWrap}>
              <label style={s.label} htmlFor="gb-title">Complaint Title</label>
              <div style={{ position: 'relative' }}>
                <span style={s.inputIcon}>✏️</span>
                <input id="gb-title" value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Short summary of your complaint"
                  required className="fg-input" style={s.input} />
              </div>
            </div>

            {/* Description */}
            <div style={s.fieldWrap}>
              <label style={s.label} htmlFor="gb-desc">What Happened?</label>
              <textarea id="gb-desc" value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={4} placeholder="Describe the issue in detail. Include dates, amounts, and what the platform did..."
                required className="fg-input fg-textarea"
                style={{ ...s.input, ...s.textarea }} />
            </div>

            {/* City */}
            <div style={{ ...s.fieldWrap, maxWidth: 280 }}>
              <label style={s.label} htmlFor="gb-city">Your City (Optional)</label>
              <div style={{ position: 'relative' }}>
                <span style={s.inputIcon}>📍</span>
                <input id="gb-city" value={form.city}
                  onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                  placeholder="e.g. Lahore" className="fg-input" style={s.input} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <button type="submit" disabled={loading} className="fg-submit-btn" style={s.submitBtn}>
                {loading
                  ? <><span className="fg-spinner" style={s.spinner} /> Posting...</>
                  : '📢  Post Complaint'
                }
              </button>
              <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>
                Your complaint will be reviewed by an advocate.
              </p>
            </div>
          </form>
        </div>
      )}

      {/* ── FILTERS + TABS ── */}
      <div style={s.filterBar}>
        {/* Status tabs */}
        <div style={s.tabRow}>
          {[
            { key: 'all',      label: `All (${counts.all})` },
            { key: 'open',      label: `Open (${counts.open})` },
            { key: 'escalated', label: `Escalated (${counts.escalated})` },
            { key: 'resolved',  label: `Resolved (${counts.resolved})` },
          ].map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className="fg-tab"
              style={{
                ...s.tab,
                background:  activeTab === t.key ? '#2563EB' : 'transparent',
                color:       activeTab === t.key ? '#fff'    : '#64748b',
                borderColor: activeTab === t.key ? '#2563EB' : '#e2e8f0',
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Search filters */}
        <div style={s.filterInputRow}>
          {[
            { key: 'platform', placeholder: '🔍 Platform', width: 150 },
            { key: 'category', placeholder: '🔍 Category', width: 150 },
          ].map(f => (
            <input key={f.key} value={filter[f.key]}
              onChange={e => setFilter(fv => ({ ...fv, [f.key]: e.target.value }))}
              placeholder={f.placeholder}
              className="fg-filter-input"
              style={{ ...s.filterInput, width: f.width }} />
          ))}
          {(filter.platform || filter.category || filter.status) && (
            <button onClick={() => setFilter({ platform: '', category: '', status: '' })}
              className="fg-clear-btn" style={s.clearBtn}>
              ✕ Clear
            </button>
          )}
          <span style={s.resultCount}>{displayed.length} result{displayed.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* ── LOADING / ERROR ── */}
      {pageLoading && (
        <div style={s.emptyState}>
          <span className="fg-spinner-lg" style={s.spinnerLg} />
          <p style={{ color: '#64748b', fontSize: 15, margin: 0 }}>Loading complaints...</p>
        </div>
      )}
      {pageError && (
        <div style={s.errorBox}>
          <span style={{ fontSize: 22 }}>⚠️</span>
          <p style={{ margin: 0, color: '#dc2626', fontWeight: 600 }}>{pageError}</p>
          <button onClick={load} style={s.retryBtn} className="fg-retry-btn">Retry</button>
        </div>
      )}

      {/* ── GRIEVANCE CARDS ── */}
      {!pageLoading && !pageError && (
        <div style={s.cardList}>
          {displayed.map((g, idx) => {
            const st = STATUS_META[g.status] || STATUS_META.open;
            const cm = CAT_META[g.category]  || CAT_META.other;
            const expanded = expandedId === g.id;
            return (
              <div key={g.id} className="fg-gcard" style={{ ...s.gCard, borderLeft: `5px solid ${st.left}`, animationDelay: `${idx * 40}ms` }}>

                {/* Card top row */}
                <div style={s.gCardTop}>
                  {/* Status strip */}
                  <div style={{ ...s.statusBadge, background: st.bg, color: st.color, border: `1.5px solid ${st.border}` }}>
                    {st.icon} {st.label}
                  </div>

                  {/* Platform + Category */}
                  <div style={s.badgeRow}>
                    <span style={s.platformBadge}>
                      {PLATFORM_ICONS[g.platform]} {g.platform}
                    </span>
                    <span style={{ ...s.catBadge, background: cm.bg, color: cm.color, border: `1.5px solid ${cm.border}` }}>
                      {cm.icon} {cm.label}
                    </span>
                    {g.city && <span style={s.cityBadge}>📍 {g.city}</span>}
                  </div>

                  <span style={s.dateText}>{new Date(g.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>

                {/* Title */}
                <h3 style={s.gCardTitle}>{g.title}</h3>

                {/* Description — expandable */}
                <p style={{ ...s.gCardDesc, WebkitLineClamp: expanded ? 'unset' : 3, overflow: expanded ? 'visible' : 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical' }}>
                  {g.description}
                </p>
                {g.description && g.description.length > 180 && (
                  <button onClick={() => setExpandedId(expanded ? null : g.id)}
                    className="fg-expand-btn" style={s.expandBtn}>
                    {expanded ? '▲ Show less' : '▼ Read more'}
                  </button>
                )}

                {/* Advocate note */}
                {g.advocate_notes && (
                  <div style={s.advocateNote}>
                    <span style={{ fontSize: 18 }}>⚖️</span>
                    <div>
                      <p style={s.advocateNoteTitle}>Advocate Response</p>
                      <p style={s.advocateNoteText}>{g.advocate_notes}</p>
                    </div>
                  </div>
                )}

                {/* Bottom action row */}
                <div style={s.gCardBottom}>
                  <button onClick={() => upvote(g.id)} className="fg-upvote-btn" style={s.upvoteBtn}>
                    ▲ Support ({g.upvotes})
                  </button>

                  {user.role === 'advocate' && (
                    <div style={{ display: 'flex', gap: 10, marginLeft: 'auto' }}>
                      <button onClick={() => updateStatus(g.id, 'escalated')}
                        className="fg-escalate-btn" style={s.escalateBtn}>
                        🔴 Escalate
                      </button>
                      <button onClick={() => updateStatus(g.id, 'resolved')}
                        className="fg-resolve-btn" style={s.resolveBtn}>
                        🟢 Resolve
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {displayed.length === 0 && (
            <div style={s.emptyState}>
              <span style={{ fontSize: 52 }}>📭</span>
              <p style={{ color: '#64748b', fontSize: 17, fontWeight: 700, margin: '4px 0' }}>No complaints found</p>
              <p style={{ color: '#94a3b8', fontSize: 14, margin: 0 }}>Try clearing filters or post the first complaint.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   STYLES
───────────────────────────────────────── */
const s = {
  root: {
    minHeight: '100vh',
    background: '#F0F6FF',
    padding: '32px 24px 60px',
    fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif",
    fontSize: 16,
    color: '#1e293b',
  },

  /* Header */
  pageHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    flexWrap: 'wrap', gap: 16, marginBottom: 24,
    maxWidth: 960, margin: '0 auto 24px',
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 16 },
  headerIcon: {
    width: 56, height: 56, borderRadius: 18,
    background: 'linear-gradient(135deg, #2563EB, #1d4ed8)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 26, boxShadow: '0 8px 24px rgba(37,99,235,0.35)',
    flexShrink: 0,
  },
  pageTitle: { fontFamily: "'Nunito', sans-serif", fontSize: 28, fontWeight: 900, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.8px' },
  pageDesc:  { fontSize: 15, color: '#64748b', margin: 0 },

  postBtn: {
    padding: '13px 26px', borderRadius: 14, border: 'none',
    background: 'linear-gradient(135deg, #2563EB, #1d4ed8)',
    color: '#fff', fontSize: 16, fontWeight: 800,
    cursor: 'pointer', transition: 'all 0.2s',
    boxShadow: '0 6px 20px rgba(37,99,235,0.35)',
    fontFamily: "'Nunito', sans-serif",
  },
  cancelBtn: {
    padding: '13px 26px', borderRadius: 14,
    border: '2px solid #e2e8f0', background: '#fff',
    color: '#64748b', fontSize: 16, fontWeight: 700,
    cursor: 'pointer', transition: 'all 0.2s',
    fontFamily: "'Source Sans 3', sans-serif",
  },

  /* Stats */
  statsRow: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 14, maxWidth: 960, margin: '0 auto 24px',
  },
  statCard: {
    borderRadius: 16, padding: '18px 20px',
    display: 'flex', alignItems: 'center', gap: 14,
    border: '2px solid #e2e8f0',
  },
  statVal:   { fontFamily: "'Nunito', sans-serif", fontSize: 26, fontWeight: 900, lineHeight: 1, letterSpacing: '-1px' },
  statLabel: { fontSize: 13, color: '#64748b', fontWeight: 600, marginTop: 2 },

  /* Form card */
  formCard: {
    maxWidth: 960, margin: '0 auto 28px',
    background: '#fff', borderRadius: 20,
    border: '2px solid #e2e8f0',
    padding: '28px 32px',
    boxShadow: '0 8px 32px rgba(37,99,235,0.08)',
  },
  formCardHeader: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, paddingBottom: 18, borderBottom: '2px solid #f1f5f9' },
  formCardTitle:  { fontFamily: "'Nunito', sans-serif", fontSize: 20, fontWeight: 900, color: '#0f172a', margin: 0 },

  fieldWrap: { marginBottom: 20 },
  label: { display: 'block', fontSize: 15, fontWeight: 700, color: '#374151', marginBottom: 10 },
  pillRow: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  pillBtn: {
    padding: '9px 16px', borderRadius: 100, fontSize: 14,
    cursor: 'pointer', transition: 'all 0.15s',
    fontFamily: "'Source Sans 3', sans-serif",
    display: 'flex', alignItems: 'center', gap: 5,
  },
  inputIcon: { position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 18, pointerEvents: 'none' },
  input: {
    width: '100%', padding: '13px 16px 13px 46px',
    borderRadius: 14, border: '2px solid #e2e8f0',
    background: '#F8FAFC', color: '#0f172a',
    fontSize: 16, outline: 'none', boxSizing: 'border-box',
    fontFamily: "'Source Sans 3', sans-serif", transition: 'all 0.2s',
  },
  textarea: { resize: 'vertical', paddingLeft: 16, minHeight: 100 },

  submitBtn: {
    padding: '14px 28px', borderRadius: 14, border: 'none',
    background: 'linear-gradient(135deg, #2563EB, #1d4ed8)',
    color: '#fff', fontSize: 16, fontWeight: 800,
    cursor: 'pointer', transition: 'all 0.2s',
    boxShadow: '0 6px 20px rgba(37,99,235,0.35)',
    fontFamily: "'Nunito', sans-serif",
    display: 'flex', alignItems: 'center', gap: 8,
  },
  spinner: { width: 18, height: 18, borderRadius: '50%', border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', display: 'inline-block' },

  /* Filter bar */
  filterBar: {
    maxWidth: 960, margin: '0 auto 20px',
    background: '#fff', borderRadius: 16,
    border: '2px solid #e2e8f0', padding: '16px 20px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    flexWrap: 'wrap', gap: 12,
  },
  tabRow: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  tab: {
    padding: '8px 16px', borderRadius: 100, fontSize: 14, fontWeight: 700,
    cursor: 'pointer', border: '2px solid', transition: 'all 0.15s',
    fontFamily: "'Source Sans 3', sans-serif",
  },
  filterInputRow: { display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' },
  filterInput: {
    padding: '9px 14px', borderRadius: 12,
    border: '2px solid #e2e8f0', background: '#F8FAFC',
    color: '#0f172a', fontSize: 14, outline: 'none',
    fontFamily: "'Source Sans 3', sans-serif", transition: 'all 0.15s',
  },
  clearBtn: {
    padding: '9px 16px', borderRadius: 12,
    border: '2px solid #fca5a5', background: '#FEE2E2',
    color: '#dc2626', fontSize: 14, fontWeight: 700,
    cursor: 'pointer', transition: 'all 0.15s',
  },
  resultCount: { fontSize: 13, color: '#94a3b8', fontWeight: 600, whiteSpace: 'nowrap' },

  /* Cards */
  cardList: { display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 960, margin: '0 auto' },

  gCard: {
    background: '#fff', borderRadius: 20,
    border: '2px solid #e2e8f0',
    padding: '22px 26px',
    transition: 'all 0.2s',
    animation: 'fg-fadein 0.3s ease both',
  },

  gCardTop: { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  statusBadge: { display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 100, fontSize: 13, fontWeight: 800, fontFamily: "'Nunito', sans-serif" },
  badgeRow: { display: 'flex', gap: 8, flexWrap: 'wrap', flex: 1 },
  platformBadge: { background: '#F1F5F9', color: '#334155', border: '1.5px solid #e2e8f0', padding: '4px 12px', borderRadius: 100, fontSize: 13, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 5 },
  catBadge: { padding: '4px 12px', borderRadius: 100, fontSize: 13, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 },
  cityBadge: { padding: '4px 10px', borderRadius: 100, fontSize: 12, fontWeight: 600, color: '#64748b', background: '#F8FAFC', border: '1.5px solid #e2e8f0' },
  dateText: { fontSize: 12, color: '#94a3b8', fontWeight: 600, marginLeft: 'auto', whiteSpace: 'nowrap' },

  gCardTitle: { fontFamily: "'Nunito', sans-serif", fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '0 0 10px', letterSpacing: '-0.3px' },
  gCardDesc:  { fontSize: 15, color: '#475569', lineHeight: 1.7, margin: '0 0 6px' },

  expandBtn: { background: 'none', border: 'none', color: '#2563EB', fontSize: 13, fontWeight: 700, cursor: 'pointer', padding: '2px 0', marginBottom: 10 },

  advocateNote: {
    display: 'flex', gap: 12, alignItems: 'flex-start',
    background: '#F0FDF4', border: '2px solid #86efac',
    borderRadius: 14, padding: '14px 16px', margin: '12px 0',
  },
  advocateNoteTitle: { fontFamily: "'Nunito', sans-serif", fontSize: 14, fontWeight: 800, color: '#15803d', margin: '0 0 4px' },
  advocateNoteText:  { fontSize: 14, color: '#166534', margin: 0, lineHeight: 1.55 },

  gCardBottom: { display: 'flex', alignItems: 'center', gap: 12, marginTop: 16, paddingTop: 16, borderTop: '1.5px solid #f1f5f9', flexWrap: 'wrap' },

  upvoteBtn: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '9px 18px', borderRadius: 12,
    border: '2px solid #e2e8f0', background: '#F8FAFC',
    color: '#475569', fontSize: 14, fontWeight: 700,
    cursor: 'pointer', transition: 'all 0.15s',
  },
  escalateBtn: {
    padding: '9px 18px', borderRadius: 12,
    border: '2px solid #fca5a5', background: '#FEE2E2',
    color: '#dc2626', fontSize: 14, fontWeight: 700,
    cursor: 'pointer', transition: 'all 0.15s',
  },
  resolveBtn: {
    padding: '9px 18px', borderRadius: 12,
    border: '2px solid #86efac', background: '#DCFCE7',
    color: '#15803d', fontSize: 14, fontWeight: 700,
    cursor: 'pointer', transition: 'all 0.15s',
  },

  /* Empty / Loading / Error */
  emptyState: { textAlign: 'center', padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 },
  spinnerLg:  { width: 40, height: 40, borderRadius: '50%', border: '4px solid #e2e8f0', borderTopColor: '#2563EB', display: 'inline-block', marginBottom: 12 },
  errorBox:   { display: 'flex', alignItems: 'center', gap: 12, background: '#FEE2E2', border: '2px solid #fca5a5', borderRadius: 16, padding: '18px 22px', maxWidth: 960, margin: '0 auto 20px' },
  retryBtn:   { padding: '8px 20px', borderRadius: 10, border: '2px solid #fca5a5', background: '#fff', color: '#dc2626', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginLeft: 'auto' },
};

/* ─────────────────────────────────────────
   CSS
───────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Source+Sans+3:wght@400;600;700&display=swap');

  @keyframes fg-fadein { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fg-spin   { to{transform:rotate(360deg)} }

  .fg-fadein     { animation: fg-fadein 0.3s ease both; }
  .fg-spinner    { animation: fg-spin 0.7s linear infinite; }
  .fg-spinner-lg { animation: fg-spin 0.9s linear infinite; }

  .fg-input:focus {
    border-color: #2563EB !important;
    box-shadow: 0 0 0 4px rgba(37,99,235,0.12) !important;
    background: #EFF6FF !important;
  }
  .fg-textarea { padding-left: 16px !important; }
  .fg-textarea:focus { padding-left: 16px !important; }

  .fg-post-btn:hover   { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(37,99,235,0.45) !important; }
  .fg-cancel-btn:hover { border-color: #2563EB !important; color: #2563EB !important; }
  .fg-submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(37,99,235,0.45) !important; }
  .fg-submit-btn:disabled { opacity: 0.65; cursor: not-allowed !important; }

  .fg-pill-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
  .fg-tab:hover      { background: #EFF6FF !important; color: #1d4ed8 !important; border-color: #93c5fd !important; }

  .fg-filter-input:focus { border-color: #2563EB !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.1) !important; }
  .fg-clear-btn:hover    { background: #dc2626 !important; color: #fff !important; }
  .fg-retry-btn:hover    { background: #dc2626 !important; color: #fff !important; }

  .fg-gcard:hover { transform: translateY(-3px) !important; box-shadow: 0 16px 40px rgba(37,99,235,0.1) !important; }
  .fg-expand-btn:hover  { text-decoration: underline; }
  .fg-upvote-btn:hover  { background: #EFF6FF !important; border-color: #2563EB !important; color: #1d4ed8 !important; }
  .fg-escalate-btn:hover{ background: #dc2626 !important; color: #fff !important; }
  .fg-resolve-btn:hover { background: #15803d !important; color: #fff !important; }

  @media (max-width: 768px) {
    .fg-stats-row    { grid-template-columns: repeat(2,1fr) !important; }
    .fg-filter-bar   { flex-direction: column !important; align-items: flex-start !important; }
  }
`;
