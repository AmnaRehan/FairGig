import { useEffect, useState } from 'react';
import { analyticsAPI } from '../api/config';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Cell,
} from 'recharts';

const PINK   = '#EC4899';
const PINK_L = '#FDF2F8';
const PINK_M = '#FBCFE8';
const PINK_D = '#9D174D';
const ROSE   = '#F43F5E';
const PURPLE = '#A855F7';
const token  = () => localStorage.getItem('token');

/* ── floating decorative blobs ── */
function Floaties() {
  const shapes = [
    { top: '4%',  left: '2%',  size: 90,  emoji: '🌸', dur: '6s',  delay: '0s'   },
    { top: '8%',  right: '3%', size: 70,  emoji: '💗', dur: '8s',  delay: '1s'   },
    { top: '22%', left: '1%',  size: 55,  emoji: '🌺', dur: '7s',  delay: '2s'   },
    { top: '40%', right: '1%', size: 80,  emoji: '🦋', dur: '9s',  delay: '0.5s' },
    { top: '58%', left: '0%',  size: 60,  emoji: '💐', dur: '6.5s',delay: '3s'   },
    { top: '72%', right: '2%', size: 65,  emoji: '🌷', dur: '7.5s',delay: '1.5s' },
    { top: '85%', left: '3%',  size: 50,  emoji: '✨', dur: '5s',  delay: '2.5s' },
    { top: '90%', right: '4%', size: 75,  emoji: '🫧', dur: '8.5s',delay: '0.8s' },
  ];
  return (
    <>
      {shapes.map((s, i) => (
        <div key={i} style={{
          position: 'fixed',
          top: s.top,
          left: s.left || 'auto',
          right: s.right || 'auto',
          fontSize: s.size * 0.36,
          opacity: 0.18,
          animation: `floatY ${s.dur} ease-in-out ${s.delay} infinite alternate`,
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 0,
          filter: 'blur(1px)',
        }}>
          {s.emoji}
        </div>
      ))}
    </>
  );
}

/* ── custom tooltip ── */
const PinkTooltip = ({ active, payload, label, prefix = '', suffix = '' }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#fff', border: `2px solid ${PINK_M}`, borderRadius: 12, padding: '10px 16px', boxShadow: '0 4px 20px rgba(236,72,153,0.15)', fontFamily: '"Nunito", sans-serif' }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: 16, fontWeight: 900, color: PINK_D }}>
          {prefix}{typeof p.value === 'number' ? p.value.toLocaleString('en-PK') : p.value}{suffix}
        </div>
      ))}
    </div>
  );
};

/* ── stat card ── */
function StatCard({ icon, label, value, sub, color = PINK }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 20,
      border: `2px solid ${PINK_M}`,
      padding: '20px 22px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: -18, right: -18, fontSize: 64, opacity: 0.07 }}>{icon}</div>
      <div style={{ fontSize: 26, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 900, color, letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 800, color: '#64748B', marginTop: 6 }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600, marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

const PLATFORM_COLORS = ['#EC4899', '#F43F5E', '#A855F7', '#8B5CF6', '#EC4899'];

export default function AdvocateDashboard() {
  const [commissionData, setCommissionData] = useState([]);
  const [cityData,       setCityData]       = useState([]);
  const [vulnFlags,      setVulnFlags]      = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState('');

  useEffect(() => {
    const h = { Authorization: `Bearer ${token()}` };
    Promise.all([
      analyticsAPI.get('/analytics/commission-trends',  { headers: h }),
      analyticsAPI.get('/analytics/income-by-city',     { headers: h }),
      analyticsAPI.get('/analytics/vulnerability-flags',{ headers: h }),
    ]).then(([c, ci, v]) => {
      setCommissionData(c.data);
      setCityData(ci.data);
      setVulnFlags(v.data);
    }).catch(() => setError('Failed to load analytics.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: PINK_L, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, fontFamily: '"Nunito", sans-serif' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');`}</style>
      <div style={{ width: 48, height: 48, border: `4px solid ${PINK_M}`, borderTop: `4px solid ${PINK}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <span style={{ fontSize: 16, color: PINK_D, fontWeight: 700 }}>Loading analytics... 🌸</span>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '100vh', background: PINK_L, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Nunito", sans-serif' }}>
      <div style={{ background: '#fff', borderRadius: 20, border: `2px solid ${PINK_M}`, padding: '40px 48px', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🌺</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: PINK_D }}>{error}</div>
      </div>
    </div>
  );

  const totalWorkers  = new Set(vulnFlags.map(f => f.worker_id)).size;
  const avgDrop       = vulnFlags.length ? Math.round(vulnFlags.reduce((a, f) => a + (f.drop_pct || 0), 0) / vulnFlags.length) : 0;
  const topCity       = cityData.length ? cityData.reduce((a, b) => a.median_net > b.median_net ? a : b, {}) : null;

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(160deg, #FDF2F8 0%, #FFF1F5 50%, #FDF4FF 100%)`, fontFamily: '"Nunito", sans-serif', position: 'relative' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        * { font-family: "Nunito", sans-serif; }
        @keyframes floatY {
          0%   { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(-22px) rotate(8deg); }
        }
        @keyframes fadeup { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .vd-row:hover { background: #FDF2F8 !important; }
        .recharts-cartesian-grid-horizontal line,
        .recharts-cartesian-grid-vertical line { stroke: #FCE7F3; }
      `}</style>

      <Floaties />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Header ── */}
        <div style={{ background: `linear-gradient(135deg, ${PINK} 0%, ${ROSE} 60%, ${PURPLE} 100%)`, padding: '24px 32px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>
              📊
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>Advocate Analytics</h1>
              <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>Aggregate intelligence across all platform workers</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['🌸', '💗', '✨'].map((e, i) => (
              <div key={i} style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{e}</div>
            ))}
          </div>
        </div>

        {/* ── Decorative wave ── */}
        <div style={{ overflow: 'hidden', lineHeight: 0, marginTop: -1 }}>
          <svg viewBox="0 0 1440 48" preserveAspectRatio="none" style={{ width: '100%', height: 48, display: 'block' }}>
            <path d="M0,0 C360,48 1080,0 1440,48 L1440,0 Z" fill="url(#pinkGrad)" />
            <defs>
              <linearGradient id="pinkGrad" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor={PINK} />
                <stop offset="60%" stopColor={ROSE} />
                <stop offset="100%" stopColor={PURPLE} />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px 48px', animation: 'fadeup 0.4s ease' }}>

          {/* ── Stat cards ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
            <StatCard icon="🚨" label="Vulnerable Workers"  value={vulnFlags.length}               color={ROSE}   sub="Income drop >20%" />
            <StatCard icon="📉" label="Avg Income Drop"     value={`${avgDrop}%`}                  color={PINK}   sub="Month-on-month" />
            <StatCard icon="🏙️" label="Cities Tracked"      value={cityData.length}                color={PURPLE} sub="Across Pakistan" />
            <StatCard icon="🏆" label="Top Earning City"    value={topCity?.city || '—'}           color={PINK_D} sub={topCity ? `PKR ${Math.round(topCity.median_net).toLocaleString()} median` : ''} />
          </div>

          {/* ── Charts row ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 24 }}>

            {/* Commission chart */}
            <div style={{ background: '#fff', borderRadius: 22, border: `2px solid ${PINK_M}`, padding: '24px 22px', boxShadow: '0 4px 24px rgba(236,72,153,0.08)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -20, right: -20, fontSize: 80, opacity: 0.05 }}>📊</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: PINK_L, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, border: `1.5px solid ${PINK_M}` }}>📊</div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#1E293B' }}>Commission by Platform</h3>
                  <p style={{ margin: 0, fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>Average deduction rate (%)</p>
                </div>
              </div>
              {commissionData.length === 0 ? (
                <div style={{ height: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  <div style={{ fontSize: 40 }}>🌸</div>
                  <p style={{ color: '#CBD5E1', fontSize: 14, fontWeight: 700 }}>No data yet</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={commissionData.slice(0, 20)} barSize={28}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="platform" tick={{ fontSize: 12, fontWeight: 700, fill: '#64748B', fontFamily: 'Nunito' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: 'Nunito' }} axisLine={false} tickLine={false} unit="%" />
                    <Tooltip content={<PinkTooltip suffix="%" />} />
                    <Bar dataKey="avg_commission_pct" radius={[8, 8, 0, 0]}>
                      {commissionData.slice(0, 20).map((_, i) => (
                        <Cell key={i} fill={PLATFORM_COLORS[i % PLATFORM_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* City income chart */}
            <div style={{ background: '#fff', borderRadius: 22, border: `2px solid ${PINK_M}`, padding: '24px 22px', boxShadow: '0 4px 24px rgba(236,72,153,0.08)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -20, right: -20, fontSize: 80, opacity: 0.05 }}>🏙️</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#FDF4FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, border: '1.5px solid #E9D5FF' }}>🏙️</div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#1E293B' }}>Income by City</h3>
                  <p style={{ margin: 0, fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>Median net earnings per shift</p>
                </div>
              </div>
              {cityData.length === 0 ? (
                <div style={{ height: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  <div style={{ fontSize: 40 }}>🌺</div>
                  <p style={{ color: '#CBD5E1', fontSize: 14, fontWeight: 700 }}>No city data yet</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={cityData} barSize={28}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="city" tick={{ fontSize: 12, fontWeight: 700, fill: '#64748B', fontFamily: 'Nunito' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: 'Nunito' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<PinkTooltip prefix="PKR " />} />
                    <Bar dataKey="median_net" name="Median Net/Shift" radius={[8, 8, 0, 0]}>
                      {cityData.map((_, i) => (
                        <Cell key={i} fill={i % 2 === 0 ? PURPLE : PINK} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* ── Vulnerability flags table ── */}
          <div style={{ background: '#fff', borderRadius: 22, border: `2px solid ${PINK_M}`, overflow: 'hidden', boxShadow: '0 4px 24px rgba(236,72,153,0.08)' }}>

            {/* Table header */}
            <div style={{ padding: '22px 24px 18px', borderBottom: `2px solid ${PINK_M}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: `linear-gradient(135deg, #FFF1F5, #FDF4FF)` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, border: '1.5px solid #FCA5A5' }}>🚨</div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 17, fontWeight: 900, color: '#1E293B' }}>Vulnerability Flags</h3>
                  <p style={{ margin: 0, fontSize: 13, color: '#94A3B8', fontWeight: 600 }}>Workers with income drop greater than 20% month-on-month</p>
                </div>
              </div>
              {vulnFlags.length > 0 && (
                <span style={{ background: '#FEE2E2', color: '#7F1D1D', border: '1.5px solid #FCA5A5', borderRadius: 10, padding: '5px 14px', fontSize: 13, fontWeight: 900 }}>
                  {vulnFlags.length} flagged
                </span>
              )}
            </div>

            {vulnFlags.length === 0 ? (
              <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: 52, marginBottom: 14 }}>🌸</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#1E293B', marginBottom: 6 }}>All clear!</div>
                <div style={{ fontSize: 14, color: '#94A3B8', fontWeight: 600 }}>No vulnerability flags detected. Workers are earning steadily.</div>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: '#FFF1F5' }}>
                      {['Worker', 'Month', 'Current Net (PKR)', 'Previous Net (PKR)', 'Income Drop'].map(h => (
                        <th key={h} style={{ padding: '13px 18px', textAlign: 'left', fontWeight: 800, color: '#64748B', fontSize: 11, letterSpacing: '0.07em', textTransform: 'uppercase', borderBottom: `2px solid ${PINK_M}`, whiteSpace: 'nowrap' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {vulnFlags.map((f, i) => (
                      <tr key={i} className="vd-row" style={{ borderBottom: `1.5px solid #FDF2F8`, background: i % 2 === 0 ? '#fff' : '#FFFBFD', transition: 'background 0.15s' }}>
                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 34, height: 34, borderRadius: '50%', background: PINK_L, border: `2px solid ${PINK_M}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: PINK_D, flexShrink: 0 }}>
                              {(f.worker_id || 'W').slice(0, 2).toUpperCase()}
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B', fontFamily: 'monospace' }}>
                              {f.worker_id?.slice(0, 12)}...
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '14px 18px', fontWeight: 700, color: '#475569' }}>
                          {f.month?.slice(0, 7)}
                        </td>
                        <td style={{ padding: '14px 18px', fontWeight: 800, color: '#1E293B' }}>
                          {f.monthly_net?.toLocaleString('en-PK')}
                        </td>
                        <td style={{ padding: '14px 18px', fontWeight: 700, color: '#64748B' }}>
                          {f.prev_month_net?.toLocaleString('en-PK')}
                        </td>
                        <td style={{ padding: '14px 18px' }}>
                          <span style={{
                            background: '#FEE2E2',
                            color: '#7F1D1D',
                            border: '1.5px solid #FCA5A5',
                            padding: '5px 14px',
                            borderRadius: 20,
                            fontWeight: 900,
                            fontSize: 13,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                          }}>
                            ↓ {f.drop_pct}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div style={{ padding: '14px 20px', borderTop: `1.5px solid ${PINK_M}`, background: '#FFF1F5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: '#64748B', fontWeight: 700 }}>
                    {vulnFlags.length} worker{vulnFlags.length !== 1 ? 's' : ''} need attention
                  </span>
                  <span style={{ fontSize: 13, color: PINK, fontWeight: 800 }}>
                    🌸 FairGig Advocate Panel
                  </span>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

