import { useEffect, useState } from 'react';
import { earningsAPI } from '../api/config';
import toast from 'react-hot-toast';

const ACCENT   = '#059669';
const ACCENT_L = '#ECFDF5';
const ACCENT_D = '#047857';

const STATUS = {
  verified:     { bg: '#ECFDF5', color: '#065F46', border: '#6EE7B7', label: 'Verified',     icon: '✅' },
  disputed:     { bg: '#FEF2F2', color: '#7F1D1D', border: '#FCA5A5', label: 'Disputed',     icon: '❌' },
  pending:      { bg: '#FFFBEB', color: '#78350F', border: '#FCD34D', label: 'Pending',      icon: '⏳' },
  unverifiable: { bg: '#F8FAFC', color: '#475569', border: '#CBD5E1', label: 'Unverifiable', icon: '❓' },
};

const FILTERS = ['pending', 'verified', 'disputed', 'all'];

const th = {
  padding: '14px 16px',
  textAlign: 'left',
  fontWeight: 800,
  color: '#475569',
  fontSize: 11,
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  borderBottom: '2px solid #E2E8F0',
  whiteSpace: 'nowrap',
  background: '#F8FAFC',
};

export default function VerifierDashboard() {
  const [logs, setLogs]     = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const r = await earningsAPI.get('/earnings/all');
      setLogs(r.data);
    } catch {
      setError('Failed to load earnings entries.');
      toast.error('Failed to load earnings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const verify = async (id, status) => {
    const notes = prompt(`Notes for "${status}" (optional):`) || '';
    try {
      await earningsAPI.put(`/earnings/${id}/verify`, { status, notes });
      toast.success(`Marked as ${status}`);
      load();
    } catch {
      toast.error('Failed to update');
    }
  };

  const filtered = logs.filter(l => filter === 'all' || l.verification_status === filter);
  const count    = (s) => s === 'all' ? logs.length : logs.filter(l => l.verification_status === s).length;

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#F0FDF8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, fontFamily: '"Nunito", system-ui, sans-serif' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');`}</style>
      <div style={{ width: 48, height: 48, border: `4px solid #A7F3D0`, borderTop: `4px solid ${ACCENT}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <span style={{ fontSize: 16, color: '#065F46', fontWeight: 700 }}>Loading verifier queue...</span>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '100vh', background: '#F0FDF8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Nunito", system-ui, sans-serif' }}>
      <div style={{ background: '#fff', borderRadius: 20, border: '2px solid #FCA5A5', padding: '32px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#7F1D1D' }}>{error}</div>
        <button onClick={load} style={{ marginTop: 16, padding: '12px 24px', borderRadius: 12, border: 'none', background: ACCENT, color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Try Again</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F0FDF8', fontFamily: '"Nunito", system-ui, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        * { font-family: "Nunito", system-ui, sans-serif; }
        .vd-row:hover { background: #F0FDF8 !important; }
        .vd-actbtn:hover { transform: scale(1.08); }
        .vd-filter:hover { border-color: ${ACCENT} !important; }
        .vd-pill-btn:hover { opacity: 0.85; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ background: ACCENT, padding: '20px 28px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 46, height: 46, borderRadius: 14, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
            🛡️
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: '-0.01em' }}>Verifier Dashboard</h1>
            <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>Review, approve, or flag earnings entries</p>
          </div>
        </div>
        <button
          onClick={load}
          style={{ padding: '10px 20px', borderRadius: 12, border: '2px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 15, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
        >
          🔄 Refresh
        </button>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 20px 48px' }}>

        {/* ── Stat cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { s: 'pending',      ...STATUS.pending,      label: 'Pending Review' },
            { s: 'verified',     ...STATUS.verified,     label: 'Verified' },
            { s: 'disputed',     ...STATUS.disputed,     label: 'Disputed' },
            { s: 'all',          bg: '#EFF6FF', color: '#1E40AF', border: '#93C5FD', icon: '📋', label: 'Total Entries' },
          ].map(c => (
            <div key={c.s} style={{
              background: '#fff',
              borderRadius: 18,
              border: `2px solid ${c.border}`,
              padding: '20px 18px',
              cursor: 'pointer',
              transition: 'all 0.15s',
              boxShadow: filter === c.s ? `0 4px 20px ${c.border}80` : 'none',
              transform: filter === c.s ? 'translateY(-2px)' : 'none',
            }}
              onClick={() => setFilter(c.s)}
            >
              <div style={{ fontSize: 22, marginBottom: 8 }}>{c.icon}</div>
              <div style={{ fontSize: 30, fontWeight: 900, color: c.color, letterSpacing: '-0.02em', lineHeight: 1 }}>
                {count(c.s)}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#64748B', marginTop: 6 }}>{c.label}</div>
              {filter === c.s && (
                <div style={{ marginTop: 10, height: 3, borderRadius: 2, background: c.color, opacity: 0.5 }} />
              )}
            </div>
          ))}
        </div>

        {/* ── Filter tabs ── */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em', marginRight: 4 }}>Filter:</span>
          {FILTERS.map(s => {
            const active = filter === s;
            const st = STATUS[s] || { color: '#1E40AF', border: '#93C5FD', bg: '#EFF6FF' };
            return (
              <button key={s} onClick={() => setFilter(s)} className="vd-filter"
                style={{
                  padding: '10px 20px',
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: active ? 800 : 600,
                  cursor: 'pointer',
                  border: `2px solid ${active ? st.border : '#E2E8F0'}`,
                  background: active ? st.bg : '#fff',
                  color: active ? st.color : '#64748B',
                  transition: 'all 0.15s',
                  fontFamily: 'inherit',
                }}>
                {s === 'all' ? 'All' : STATUS[s].label} ({count(s)})
              </button>
            );
          })}
        </div>

        {/* ── Table ── */}
        <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 4px 24px rgba(5,150,105,0.08)' }}>

          {/* Table header row with count */}
          <div style={{ padding: '16px 20px', borderBottom: '2px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#1E293B' }}>
              {filter === 'all' ? 'All Entries' : `${STATUS[filter]?.label} Entries`}
              <span style={{ marginLeft: 10, background: ACCENT_L, color: ACCENT_D, borderRadius: 8, padding: '2px 10px', fontSize: 13, fontWeight: 800 }}>
                {filtered.length}
              </span>
            </div>
            {filtered.length > 0 && filter === 'pending' && (
              <span style={{ fontSize: 13, color: '#94A3B8', fontWeight: 600 }}>
                {filtered.length} shift{filtered.length !== 1 ? 's' : ''} awaiting review
              </span>
            )}
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr>
                  {['Worker', 'Platform', 'Date', 'Gross (PKR)', 'Deductions', 'Net (PKR)', 'Status', 'Screenshot', 'Actions'].map(h => (
                    <th key={h} style={th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} style={{ padding: '60px 20px', textAlign: 'center' }}>
                      <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                      <div style={{ fontSize: 17, fontWeight: 800, color: '#1E293B', marginBottom: 6 }}>No entries here</div>
                      <div style={{ fontSize: 14, color: '#94A3B8', fontWeight: 600 }}>
                        {filter === 'pending' ? 'All caught up! No pending reviews.' : `No ${filter} entries found.`}
                      </div>
                    </td>
                  </tr>
                )}
                {filtered.map((l, i) => {
                  const st = STATUS[l.verification_status] || STATUS.pending;
                  return (
                    <tr key={l.id} className="vd-row"
                      style={{ borderBottom: '1.5px solid #F1F5F9', background: i % 2 === 0 ? '#fff' : '#FAFFFE', transition: 'background 0.15s' }}>

                      {/* Worker */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: '50%', background: ACCENT_L, border: `2px solid #A7F3D0`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: ACCENT_D, flexShrink: 0 }}>
                            {(l.worker_id || 'W').slice(0, 2).toUpperCase()}
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B', fontFamily: 'monospace' }}>
                            {l.worker_id?.slice(0, 8)}...
                          </span>
                        </div>
                      </td>

                      {/* Platform */}
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ background: '#F0FDF8', color: ACCENT_D, border: `1.5px solid #A7F3D0`, padding: '4px 10px', borderRadius: 8, fontSize: 13, fontWeight: 800 }}>
                          {l.platform}
                        </span>
                      </td>

                      {/* Date */}
                      <td style={{ padding: '14px 16px', color: '#475569', fontWeight: 700, whiteSpace: 'nowrap' }}>
                        {l.shift_date?.slice(0, 10)}
                      </td>

                      {/* Gross */}
                      <td style={{ padding: '14px 16px', color: '#1E293B', fontWeight: 700 }}>
                        {l.gross_earned?.toLocaleString('en-PK')}
                      </td>

                      {/* Deductions */}
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ color: '#DC2626', fontWeight: 700 }}>
                          -{l.platform_deductions?.toLocaleString('en-PK')}
                        </span>
                      </td>

                      {/* Net */}
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontSize: 15, fontWeight: 900, color: ACCENT_D }}>
                          {l.net_received?.toLocaleString('en-PK')}
                        </span>
                      </td>

                      {/* Status badge */}
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          background: st.bg,
                          color: st.color,
                          border: `1.5px solid ${st.border}`,
                          padding: '5px 12px',
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 800,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          whiteSpace: 'nowrap',
                        }}>
                          {st.icon} {l.verification_status}
                        </span>
                      </td>

                      {/* Screenshot */}
                      <td style={{ padding: '14px 16px' }}>
                        {l.screenshot_path
                          ? (
                            <a
                              href={`http://localhost:8001/${l.screenshot_path}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{ color: ACCENT_D, fontSize: 13, fontWeight: 800, textDecoration: 'none', background: ACCENT_L, border: `1.5px solid #6EE7B7`, borderRadius: 8, padding: '5px 12px', display: 'inline-block' }}
                            >
                              👁 View
                            </a>
                          ) : (
                            <span style={{ color: '#CBD5E1', fontSize: 13, fontWeight: 700 }}>None</span>
                          )
                        }
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 16px' }}>
                        {l.verification_status === 'pending' ? (
                          <div style={{ display: 'flex', gap: 7 }}>
                            <button className="vd-actbtn"
                              onClick={() => verify(l.id, 'verified')}
                              title="Approve"
                              style={{ background: '#ECFDF5', color: '#065F46', border: '2px solid #6EE7B7', borderRadius: 10, padding: '8px 14px', fontSize: 15, cursor: 'pointer', fontWeight: 900, transition: 'all 0.15s', fontFamily: 'inherit' }}>
                              ✓
                            </button>
                            <button className="vd-actbtn"
                              onClick={() => verify(l.id, 'disputed')}
                              title="Dispute"
                              style={{ background: '#FEF2F2', color: '#7F1D1D', border: '2px solid #FCA5A5', borderRadius: 10, padding: '8px 14px', fontSize: 15, cursor: 'pointer', fontWeight: 900, transition: 'all 0.15s', fontFamily: 'inherit' }}>
                              ✗
                            </button>
                            <button className="vd-actbtn"
                              onClick={() => verify(l.id, 'unverifiable')}
                              title="Cannot verify"
                              style={{ background: '#F8FAFC', color: '#475569', border: '2px solid #CBD5E1', borderRadius: 10, padding: '8px 14px', fontSize: 15, cursor: 'pointer', fontWeight: 900, transition: 'all 0.15s', fontFamily: 'inherit' }}>
                              ?
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: 12, color: '#CBD5E1', fontWeight: 700 }}>Done</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filtered.length > 0 && (
            <div style={{ padding: '14px 20px', borderTop: '1.5px solid #F1F5F9', background: '#FAFFFE', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: '#64748B', fontWeight: 700 }}>
                Showing {filtered.length} of {logs.length} total entries
              </span>
              <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>
                Last refreshed just now
              </span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
