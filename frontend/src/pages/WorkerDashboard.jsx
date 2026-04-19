import { useEffect, useState } from 'react';
import { earningsAPI, anomalyAPI } from '../api/config';
import { useAuth } from '../context/auth';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

export default function WorkerDashboard() {
  const { user } = useAuth();
  const [earnings, setEarnings] = useState([]);
  const [anomalies, setAnomalies] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.id) { setLoading(false); return; }
    earningsAPI.get('/earnings/my')
      .then(r => {
        setEarnings(r.data);
        if (r.data.length >= 2) {
          return anomalyAPI.post('/anomaly/detect', {
            worker_id: user.id,
            earnings: r.data.map(e => ({
              id: e.id, shift_date: e.shift_date, hours_worked: e.hours_worked,
              gross_earned: e.gross_earned, platform_deductions: e.platform_deductions,
              net_received: e.net_received, platform: e.platform, city: e.city
            }))
          });
        }
      })
      .then(r => r && setAnomalies(r.data))
      .catch(() => { setError('Failed to load your earnings.'); toast.error('Failed to load data'); })
      .finally(() => setLoading(false));
  }, [user?.id]);

  const totalNet = earnings.reduce((s, e) => s + e.net_received, 0);
  const totalHours = earnings.reduce((s, e) => s + e.hours_worked, 0);
  const avgHourly = totalHours > 0 ? (totalNet / totalHours).toFixed(0) : 0;
  const verified = earnings.filter(e => e.verification_status === 'verified').length;
  const chartData = [...earnings]
    .sort((a, b) => a.shift_date.localeCompare(b.shift_date))
    .slice(-20)
    .map(e => ({ date: e.shift_date?.slice(0, 10), net: e.net_received }));

  const STATUS = {
    verified:     { bg: 'rgba(52,211,153,0.15)',  color: '#34d399', border: 'rgba(52,211,153,0.3)'  },
    disputed:     { bg: 'rgba(239,68,68,0.15)',   color: '#f87171', border: 'rgba(239,68,68,0.3)'   },
    pending:      { bg: 'rgba(251,191,36,0.15)',  color: '#fbbf24', border: 'rgba(251,191,36,0.3)'  },
    unverifiable: { bg: 'rgba(148,163,184,0.15)', color: '#94a3b8', border: 'rgba(148,163,184,0.3)' },
  };

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#020617', gap: 16 }}>
      <div style={{ width: 40, height: 40, border: '3px solid rgba(99,102,241,0.2)', borderTop: '3px solid #6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <span style={{ fontSize: 13, color: '#475569' }}>Loading your dashboard...</span>
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
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes fadeup { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .fg-row:hover { background: rgba(99,102,241,0.04) !important; }
        .fg-statcard { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .fg-statcard:hover { transform: translateY(-3px); box-shadow: 0 20px 50px rgba(0,0,0,0.5) !important; }
      `}</style>

      <div style={{ maxWidth: 1100, margin: '0 auto', animation: 'fadeup 0.4s ease' }}>

        {/* header */}
        <div style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#e2e8f0', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
              Welcome back, <span style={{ background: 'linear-gradient(135deg,#818cf8,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user.full_name}</span>
            </h1>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: '#475569', background: 'rgba(148,163,184,0.08)', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 20, padding: '3px 10px' }}>🛵 {user.platform}</span>
              <span style={{ fontSize: 12, color: '#475569', background: 'rgba(148,163,184,0.08)', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 20, padding: '3px 10px' }}>📍 {user.city}</span>
            </div>
          </div>
          <div style={{ fontSize: 11, color: '#475569', textAlign: 'right', lineHeight: 1.6 }}>
            <div style={{ color: '#64748b' }}>Last updated</div>
            <div style={{ color: '#94a3b8' }}>{new Date().toLocaleDateString('en-PK', { dateStyle: 'medium' })}</div>
          </div>
        </div>

        {/* stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Total Net Earnings', value: `PKR ${totalNet.toLocaleString()}`, icon: '💰', grad: 'linear-gradient(135deg,#6366f1,#8b5cf6)', glow: 'rgba(99,102,241,0.3)' },
            { label: 'Total Shifts',       value: earnings.length,                    icon: '📋', grad: 'linear-gradient(135deg,#059669,#34d399)', glow: 'rgba(52,211,153,0.3)' },
            { label: 'Avg. Hourly Rate',   value: `PKR ${avgHourly}/hr`,              icon: '⚡', grad: 'linear-gradient(135deg,#7c3aed,#a78bfa)', glow: 'rgba(167,139,250,0.3)' },
            { label: 'Verified Shifts',    value: verified,                           icon: '✅', grad: 'linear-gradient(135deg,#d97706,#fbbf24)', glow: 'rgba(251,191,36,0.3)' },
          ].map(c => (
            <div key={c.label} className="fg-statcard" style={{
              background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(148,163,184,0.1)', borderRadius: 16,
              padding: '20px 22px', position: 'relative', overflow: 'hidden',
              boxShadow: `0 8px 30px rgba(0,0,0,0.4)`,
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: c.grad }} />
              <div style={{ fontSize: 22, marginBottom: 10 }}>{c.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>{c.value}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{c.label}</div>
            </div>
          ))}
        </div>

        {/* chart */}
        {chartData.length > 1 && (
          <div style={{
            background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(148,163,184,0.1)', borderRadius: 16,
            padding: 24, marginBottom: 20,
            boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>Earnings per Shift</h3>
              <span style={{ fontSize: 11, color: '#475569', background: 'rgba(148,163,184,0.08)', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 20, padding: '3px 10px' }}>Last 20 shifts</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(148,163,184,0.15)', borderRadius: 10, color: '#e2e8f0', fontSize: 12 }}
                  formatter={v => [`PKR ${v.toLocaleString()}`, 'Net']}
                />
                <Line type="monotone" dataKey="net" stroke="url(#lineGrad)" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* anomalies */}
        {anomalies && anomalies.anomalies_found > 0 && (
          <div style={{
            background: 'rgba(234,179,8,0.06)', border: '1px solid rgba(234,179,8,0.2)',
            borderRadius: 16, padding: 20, marginBottom: 20,
          }}>
            <h3 style={{ color: '#fbbf24', fontWeight: 700, marginBottom: 8, fontSize: 14, margin: '0 0 8px' }}>
              ⚠ Anomalies Detected ({anomalies.anomalies_found})
            </h3>
            <p style={{ color: '#92400e', fontSize: 13, margin: '0 0 14px', color: '#fcd34d' }}>{anomalies.summary}</p>
            {anomalies.flags.map((flag, i) => (
              <div key={i} style={{
                background: 'rgba(15,23,42,0.7)', borderRadius: 10, padding: '12px 16px', marginBottom: 8,
                borderLeft: `3px solid ${flag.severity === 'high' ? '#ef4444' : '#f59e0b'}`,
              }}>
                <div style={{ fontWeight: 600, fontSize: 12, color: flag.severity === 'high' ? '#f87171' : '#fbbf24', marginBottom: 4, letterSpacing: '0.05em' }}>
                  {flag.anomaly_type.replace(/_/g, ' ').toUpperCase()}
                </div>
                <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>{flag.explanation}</div>
                <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>Expected: {flag.expected_range}</div>
              </div>
            ))}
          </div>
        )}

        {/* recent shifts table */}
        <div style={{
          background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(12px)',
          border: '1px solid rgba(148,163,184,0.1)', borderRadius: 16,
          overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
        }}>
          {/* shimmer header */}
          <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(148,163,184,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>Recent Shifts</h3>
            <span style={{ fontSize: 11, color: '#475569' }}>{earnings.length} total</span>
          </div>

          {earnings.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
              <div style={{ color: '#475569', fontSize: 14 }}>No earnings logged yet.</div>
              <div style={{ color: '#334155', fontSize: 12, marginTop: 4 }}>Use "Log Earnings" to add your first shift.</div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: 'rgba(2,6,23,0.5)' }}>
                    {['Date', 'Platform', 'Hours', 'Gross', 'Deductions', 'Net', 'Status'].map(h => (
                      <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontWeight: 600, color: '#475569', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', borderBottom: '1px solid rgba(148,163,184,0.08)', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {earnings.slice(0, 15).map(e => {
                    const st = STATUS[e.verification_status] || STATUS.pending;
                    return (
                      <tr key={e.id} className="fg-row" style={{ borderBottom: '1px solid rgba(148,163,184,0.05)', transition: 'background 0.15s' }}>
                        <td style={{ padding: '11px 16px', color: '#94a3b8', whiteSpace: 'nowrap' }}>{e.shift_date?.slice(0, 10)}</td>
                        <td style={{ padding: '11px 16px', color: '#e2e8f0', fontWeight: 500 }}>{e.platform}</td>
                        <td style={{ padding: '11px 16px', color: '#64748b' }}>{e.hours_worked}h</td>
                        <td style={{ padding: '11px 16px', color: '#94a3b8' }}>PKR {e.gross_earned.toLocaleString()}</td>
                        <td style={{ padding: '11px 16px', color: '#f87171' }}>-{e.platform_deductions.toLocaleString()}</td>
                        <td style={{ padding: '11px 16px', color: '#e2e8f0', fontWeight: 700 }}>PKR {e.net_received.toLocaleString()}</td>
                        <td style={{ padding: '11px 16px' }}>
                          <span style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}`, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                            {e.verification_status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}