import { useCallback, useEffect, useState } from 'react';
import { grievanceAPI } from '../api/config';
import { useAuth } from '../context/auth';
import toast from 'react-hot-toast';

const CATEGORIES = ['commission', 'deactivation', 'payment', 'other'];
const PLATFORMS = ['Careem', 'Foodpanda', 'Uber', 'Bykea', 'Other'];

const STATUS_STYLE = {
  open:      { color: '#60a5fa', border: 'rgba(96,165,250,0.3)',  bg: 'rgba(96,165,250,0.08)',  left: '#3b82f6' },
  escalated: { color: '#f87171', border: 'rgba(239,68,68,0.3)',   bg: 'rgba(239,68,68,0.08)',   left: '#ef4444' },
  resolved:  { color: '#34d399', border: 'rgba(52,211,153,0.3)',  bg: 'rgba(52,211,153,0.08)',  left: '#10b981' },
};

const CAT_STYLE = {
  commission:  { color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
  deactivation:{ color: '#f87171', bg: 'rgba(239,68,68,0.12)'   },
  payment:     { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)'  },
  other:       { color: '#94a3b8', bg: 'rgba(148,163,184,0.12)' },
};

export default function GrievanceBoard() {
  const { user } = useAuth();
  const [grievances, setGrievances] = useState([]);
  const [form, setForm] = useState({ platform: 'Careem', category: 'commission', title: '', description: '', city: '' });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [filter, setFilter] = useState({ platform: '', category: '', status: '' });
  const [showForm, setShowForm] = useState(false);

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

  const inp = {
    width: '100%', padding: '11px 14px', borderRadius: 12,
    border: '1px solid rgba(148,163,184,0.15)',
    background: 'rgba(2,6,23,0.6)', color: '#e2e8f0',
    fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at 20% 10%, #0f172a, #020617 60%, #000)', padding: '32px 20px' }}>
      <style>{`
        @keyframes fadeup { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        .fg-inp:focus { border-color: rgba(99,102,241,0.6) !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.12) !important; outline: none !important; }
        .fg-inp::placeholder { color: #334155; }
        .fg-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .fg-card:hover { transform: translateY(-2px); box-shadow: 0 16px 48px rgba(0,0,0,0.5) !important; }
        .fg-upvote:hover { background: rgba(99,102,241,0.2) !important; border-color: rgba(99,102,241,0.4) !important; color: #a5b4fc !important; }
        .fg-pill:hover { border-color: rgba(99,102,241,0.4) !important; }
      `}</style>

      {/* ambient glows */}
      <div style={{ position: 'fixed', width: 500, height: 500, background: 'radial-gradient(circle,rgba(99,102,241,0.18),transparent 65%)', top: '-150px', left: '-150px', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', width: 400, height: 400, background: 'radial-gradient(circle,rgba(236,72,153,0.12),transparent 65%)', bottom: '-100px', right: '-100px', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 900, margin: '0 auto', animation: 'fadeup 0.4s ease' }}>

        {/* header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg,#6366f1,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: '0 8px 24px rgba(99,102,241,0.4)' }}>📢</div>
            <div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#e2e8f0', letterSpacing: '-0.02em' }}>Grievance Board</h1>
              <p style={{ margin: 0, fontSize: 13, color: '#475569' }}>Share complaints and support requests — moderated by advocates</p>
            </div>
          </div>
          {user.role === 'worker' && (
            <button onClick={() => setShowForm(f => !f)}
              style={{ padding: '10px 20px', borderRadius: 12, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13, color: 'white', background: 'linear-gradient(135deg,#6366f1,#ec4899)', boxShadow: '0 8px 24px rgba(99,102,241,0.35)', transition: 'all 0.2s' }}>
              {showForm ? '✕ Cancel' : '+ Post Complaint'}
            </button>
          )}
        </div>

        {/* post form */}
        {user.role === 'worker' && showForm && (
          <div style={{
            background: 'rgba(15,23,42,0.9)', backdropFilter: 'blur(24px)',
            border: '1px solid rgba(148,163,184,0.12)', borderRadius: 20,
            padding: 28, marginBottom: 24, position: 'relative', overflow: 'hidden',
            boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
            animation: 'fadeup 0.3s ease',
          }}>
            <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1, background: 'linear-gradient(90deg,transparent,rgba(99,102,241,0.8),rgba(236,72,153,0.8),transparent)', backgroundSize: '200% auto', animation: 'shimmer 3s linear infinite' }} />

            <h3 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 700, color: '#e2e8f0' }}>Post a Complaint</h3>

            <form onSubmit={handleSubmit}>
              {/* platform pills */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontSize: 11, letterSpacing: '0.08em', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 8 }}>PLATFORM</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {PLATFORMS.map(p => (
                    <button type="button" key={p} className="fg-pill"
                      onClick={() => setForm(f => ({ ...f, platform: p }))}
                      style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, cursor: 'pointer', transition: 'all 0.15s', border: form.platform === p ? '1px solid rgba(99,102,241,0.6)' : '1px solid rgba(148,163,184,0.12)', background: form.platform === p ? 'rgba(99,102,241,0.15)' : 'rgba(2,6,23,0.5)', color: form.platform === p ? '#a5b4fc' : '#64748b', fontWeight: form.platform === p ? 600 : 400 }}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* category pills */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontSize: 11, letterSpacing: '0.08em', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 8 }}>CATEGORY</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {CATEGORIES.map(c => {
                    const cs = CAT_STYLE[c];
                    const active = form.category === c;
                    return (
                      <button type="button" key={c} onClick={() => setForm(f => ({ ...f, category: c }))}
                        style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, cursor: 'pointer', transition: 'all 0.15s', border: active ? `1px solid ${cs.color}55` : '1px solid rgba(148,163,184,0.12)', background: active ? cs.bg : 'rgba(2,6,23,0.5)', color: active ? cs.color : '#64748b', fontWeight: active ? 600 : 400 }}>
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, letterSpacing: '0.08em', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 7 }}>TITLE</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Short summary of your complaint" required className="fg-inp" style={inp} />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, letterSpacing: '0.08em', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 7 }}>DESCRIPTION</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={4} placeholder="Describe what happened in detail..."
                  required className="fg-inp" style={{ ...inp, resize: 'vertical', fontFamily: 'inherit' }} />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, letterSpacing: '0.08em', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 7 }}>CITY (OPTIONAL)</label>
                <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                  placeholder="e.g. Lahore" className="fg-inp" style={inp} />
              </div>

              <button type="submit" disabled={loading}
                style={{ padding: '12px 28px', borderRadius: 12, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14, color: 'white', background: 'linear-gradient(135deg,#6366f1,#ec4899)', boxShadow: '0 10px 28px rgba(99,102,241,0.35)', transition: 'all 0.2s', opacity: loading ? 0.6 : 1 }}>
                {loading ? 'Posting...' : 'Post Complaint →'}
              </button>
            </form>
          </div>
        )}

        {/* filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          {[['platform', 'Platform'], ['category', 'Category'], ['status', 'Status']].map(([key, label]) => (
            <input key={key} placeholder={`Filter by ${label}`} value={filter[key]}
              onChange={e => setFilter(f => ({ ...f, [key]: e.target.value }))}
              className="fg-inp"
              style={{ padding: '9px 14px', borderRadius: 10, border: '1px solid rgba(148,163,184,0.15)', background: 'rgba(15,23,42,0.8)', color: '#e2e8f0', fontSize: 13, outline: 'none', width: 160, backdropFilter: 'blur(8px)' }} />
          ))}
          <button onClick={() => setFilter({ platform: '', category: '', status: '' })}
            style={{ padding: '9px 16px', borderRadius: 10, border: '1px solid rgba(148,163,184,0.12)', background: 'rgba(15,23,42,0.6)', color: '#64748b', fontSize: 13, cursor: 'pointer', backdropFilter: 'blur(8px)' }}>
            Clear
          </button>
          <span style={{ fontSize: 12, color: '#334155', marginLeft: 4 }}>{grievances.length} results</span>
        </div>

        {/* loading / error */}
        {pageLoading && (
          <div style={{ textAlign: 'center', padding: 48 }}>
            <div style={{ width: 36, height: 36, border: '3px solid rgba(99,102,241,0.2)', borderTop: '3px solid #6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <span style={{ fontSize: 13, color: '#475569' }}>Loading grievances...</span>
          </div>
        )}
        {pageError && <div style={{ textAlign: 'center', color: '#f87171', padding: 28, fontSize: 14 }}>{pageError}</div>}

        {/* grievance cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {grievances.map(g => {
            const st = STATUS_STYLE[g.status] || STATUS_STYLE.open;
            const cs = CAT_STYLE[g.category] || CAT_STYLE.other;
            return (
              <div key={g.id} className="fg-card" style={{
                background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(16px)',
                border: `1px solid rgba(148,163,184,0.1)`,
                borderLeft: `3px solid ${st.left}`,
                borderRadius: 16, padding: '20px 24px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
              }}>
                {/* top row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: '#e2e8f0' }}>{g.title}</span>
                    <span style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8', padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600, border: '1px solid rgba(99,102,241,0.2)' }}>{g.platform}</span>
                    <span style={{ background: cs.bg, color: cs.color, padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 500 }}>{g.category}</span>
                  </div>
                  <span style={{ fontSize: 11, color: '#334155' }}>{new Date(g.created_at).toLocaleDateString()}</span>
                </div>

                <p style={{ color: '#94a3b8', fontSize: 13, margin: '0 0 14px', lineHeight: 1.7 }}>{g.description}</p>

                {/* advocate note */}
                {g.advocate_notes && (
                  <div style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 10, padding: '8px 14px', fontSize: 12, color: '#34d399', marginBottom: 14 }}>
                    ⚖️ Advocate: {g.advocate_notes}
                  </div>
                )}

                {/* bottom row */}
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  <button onClick={() => upvote(g.id)} className="fg-upvote"
                    style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(148,163,184,0.08)', border: '1px solid rgba(148,163,184,0.15)', borderRadius: 8, padding: '5px 12px', fontSize: 12, cursor: 'pointer', color: '#64748b', transition: 'all 0.15s', fontWeight: 600 }}>
                    ▲ {g.upvotes}
                  </button>

                  <span style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}`, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                    {g.status}
                  </span>

                  {g.city && (
                    <span style={{ fontSize: 12, color: '#475569' }}>📍 {g.city}</span>
                  )}

                  {user.role === 'advocate' && (
                    <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
                      <button onClick={() => updateStatus(g.id, 'escalated')}
                        style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, padding: '5px 12px', fontSize: 12, cursor: 'pointer', fontWeight: 600, transition: 'all 0.15s' }}>
                        Escalate
                      </button>
                      <button onClick={() => updateStatus(g.id, 'resolved')}
                        style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399', border: '1px solid rgba(52,211,153,0.25)', borderRadius: 8, padding: '5px 12px', fontSize: 12, cursor: 'pointer', fontWeight: 600, transition: 'all 0.15s' }}>
                        Resolve
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {!pageLoading && grievances.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
              <div style={{ color: '#475569', fontSize: 15, marginBottom: 4 }}>No complaints found</div>
              <div style={{ color: '#334155', fontSize: 13 }}>Try clearing filters or post the first complaint.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}