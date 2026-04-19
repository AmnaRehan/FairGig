import { useEffect, useState } from 'react';
import { earningsAPI } from '../api/config';
import toast from 'react-hot-toast';

const STATUS = {
  verified:     { bg: 'rgba(52,211,153,0.15)',  color: '#34d399', border: 'rgba(52,211,153,0.3)'  },
  disputed:     { bg: 'rgba(239,68,68,0.15)',   color: '#f87171', border: 'rgba(239,68,68,0.3)'   },
  pending:      { bg: 'rgba(251,191,36,0.15)',  color: '#fbbf24', border: 'rgba(251,191,36,0.3)'  },
  unverifiable: { bg: 'rgba(148,163,184,0.15)', color: '#94a3b8', border: 'rgba(148,163,184,0.3)' },
};

const FILTERS = ['pending', 'verified', 'disputed', 'all'];

export default function VerifierDashboard() {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    const notes = prompt(`Notes for ${status} (optional):`) || '';
    try {
      await earningsAPI.put(`/earnings/${id}/verify`, { status, notes });
      toast.success(`Marked as ${status}`);
      load();
    } catch {
      toast.error('Failed to update');
    }
  };

  const filtered = logs.filter(l => filter === 'all' || l.verification_status === filter);
  const count = (s) => s === 'all' ? logs.length : logs.filter(l => l.verification_status === s).length;

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#020617', gap: 16 }}>
      <div style={{ width: 40, height: 40, border: '3px solid rgba(99,102,241,0.2)', borderTop: '3px solid #6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <span style={{ fontSize: 13, color: '#475569' }}>Loading verifier queue...</span>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020617' }}>
      <div style={{ textAlign: 'center', color: '#f87171', fontSize: 14 }}>{error}</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at 20% 10%, #0f172a, #020617 60%, #000)', padding: '32px 20px' }}>
      <style>{`
        @keyframes fadeup { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .fg-row:hover { background: rgba(99,102,241,0.04) !important; }
        .fg-filterbtn { transition: all 0.18s ease !important; }
        .fg-filterbtn:hover { border-color: rgba(99,102,241,0.4) !important; }
        .fg-actbtn { transition: all 0.15s ease !important; }
        .fg-actbtn:hover { transform: scale(1.08); }
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto', animation: 'fadeup 0.4s ease' }}>

        {/* header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'linear-gradient(135deg,#6366f1,#ec4899)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
            }}>✅</div>
            <div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#e2e8f0', letterSpacing: '-0.02em' }}>Verifier Dashboard</h1>
              <p style={{ margin: 0, fontSize: 13, color: '#475569' }}>Review earnings and approve or flag entries</p>
            </div>
          </div>
        </div>

        {/* stat pills */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Pending',      s: 'pending',      icon: '⏳', ...STATUS.pending      },
            { label: 'Verified',     s: 'verified',     icon: '✅', ...STATUS.verified     },
            { label: 'Disputed',     s: 'disputed',     icon: '⚠️', ...STATUS.disputed     },
            { label: 'Total',        s: 'all',          icon: '📋', bg: 'rgba(148,163,184,0.08)', color: '#94a3b8', border: 'rgba(148,163,184,0.15)' },
          ].map(c => (
            <div key={c.s} style={{
              background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(148,163,184,0.1)', borderRadius: 14,
              padding: '16px 18px', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: c.color, opacity: 0.6 }} />
              <div style={{ fontSize: 18, marginBottom: 6 }}>{c.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: c.color }}>{count(c.s)}</div>
              <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{c.label}</div>
            </div>
          ))}
        </div>

        {/* filter tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {FILTERS.map(s => {
            const active = filter === s;
            const st = STATUS[s] || { color: '#94a3b8', border: 'rgba(148,163,184,0.3)', bg: 'rgba(148,163,184,0.1)' };
            return (
              <button key={s} onClick={() => setFilter(s)} className="fg-filterbtn"
                style={{
                  padding: '8px 18px', borderRadius: 10, fontSize: 13, cursor: 'pointer', fontWeight: active ? 600 : 400,
                  border: active ? `1px solid ${st.border}` : '1px solid rgba(148,163,184,0.1)',
                  background: active ? st.bg : 'rgba(15,23,42,0.6)',
                  color: active ? st.color : '#64748b',
                  backdropFilter: 'blur(8px)',
                }}>
                {s.charAt(0).toUpperCase() + s.slice(1)} <span style={{ opacity: 0.7, fontSize: 11 }}>({count(s)})</span>
              </button>
            );
          })}
        </div>

        {/* table */}
        <div style={{
          background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(12px)',
          border: '1px solid rgba(148,163,184,0.1)', borderRadius: 16,
          overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'rgba(2,6,23,0.6)' }}>
                  {['Worker ID', 'Platform', 'Date', 'Gross', 'Deductions', 'Net', 'Status', 'Screenshot', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '13px 16px', textAlign: 'left', fontWeight: 600, color: '#475569', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', borderBottom: '1px solid rgba(148,163,184,0.08)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} style={{ padding: '48px', textAlign: 'center' }}>
                      <div style={{ fontSize: 32, marginBottom: 10 }}>📭</div>
                      <div style={{ color: '#475569', fontSize: 14 }}>No entries for this filter.</div>
                    </td>
                  </tr>
                )}
                {filtered.map(l => {
                  const st = STATUS[l.verification_status] || STATUS.pending;
                  return (
                    <tr key={l.id} className="fg-row" style={{ borderBottom: '1px solid rgba(148,163,184,0.05)', transition: 'background 0.15s' }}>
                      <td style={{ padding: '12px 16px', color: '#475569', fontSize: 11, fontFamily: 'monospace' }}>{l.worker_id?.slice(0, 8)}...</td>
                      <td style={{ padding: '12px 16px', color: '#e2e8f0', fontWeight: 500 }}>{l.platform}</td>
                      <td style={{ padding: '12px 16px', color: '#94a3b8', whiteSpace: 'nowrap' }}>{l.shift_date?.slice(0, 10)}</td>
                      <td style={{ padding: '12px 16px', color: '#94a3b8' }}>PKR {l.gross_earned?.toLocaleString()}</td>
                      <td style={{ padding: '12px 16px', color: '#f87171' }}>-{l.platform_deductions?.toLocaleString()}</td>
                      <td style={{ padding: '12px 16px', color: '#e2e8f0', fontWeight: 700 }}>PKR {l.net_received?.toLocaleString()}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}`, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                          {l.verification_status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {l.screenshot_path
                          ? <a href={`http://localhost:8001/${l.screenshot_path}`} target="_blank" rel="noreferrer"
                              style={{ color: '#818cf8', fontSize: 12, textDecoration: 'none', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 6, padding: '3px 8px' }}>View</a>
                          : <span style={{ color: '#334155', fontSize: 11 }}>None</span>}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {l.verification_status === 'pending' && (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button className="fg-actbtn" onClick={() => verify(l.id, 'verified')}
                              style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 8, padding: '5px 10px', fontSize: 13, cursor: 'pointer', fontWeight: 700 }}>✓</button>
                            <button className="fg-actbtn" onClick={() => verify(l.id, 'disputed')}
                              style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '5px 10px', fontSize: 13, cursor: 'pointer', fontWeight: 700 }}>✗</button>
                            <button className="fg-actbtn" onClick={() => verify(l.id, 'unverifiable')}
                              style={{ background: 'rgba(148,163,184,0.1)', color: '#64748b', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 8, padding: '5px 10px', fontSize: 13, cursor: 'pointer' }}>?</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}