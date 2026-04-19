import { useEffect, useState } from 'react';
import { analyticsAPI } from '../api/config';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function AdvocateDashboard() {
  const [commissionData, setCommissionData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [vulnFlags, setVulnFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      analyticsAPI.get('/analytics/commission-trends', {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
}),
analyticsAPI.get('/analytics/income-by-city', {
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
}),

analyticsAPI.get('/analytics/vulnerability-flags', {
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
}),
    ]).then(([c, ci, v]) => {
      setCommissionData(c.data);
      setCityData(ci.data);
      setVulnFlags(v.data);
    }).catch(() => {
      setError('Failed to load analytics.');
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading analytics...</div>;
  if (error) return <div style={{ padding: 40, textAlign: 'center', color: '#b91c1c' }}>{error}</div>;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Advocate Analytics Panel</h1>
      <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 28 }}>Aggregate intelligence across all workers on the platform.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
        <div style={{ background: 'white', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: '#374151' }}>Commission Rate Trends by Platform</h3>
          {commissionData.length === 0 ? (
            <p style={{ color: '#9ca3af', fontSize: 13 }}>No data yet. Seed some earnings entries.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={commissionData.slice(0, 20)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="platform" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit="%" />
                <Tooltip formatter={v => `${v}%`} />
                <Bar dataKey="avg_commission_pct" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div style={{ background: 'white', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: '#374151' }}>Income Distribution by City</h3>
          {cityData.length === 0 ? (
            <p style={{ color: '#9ca3af', fontSize: 13 }}>No city data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={cityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="city" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={v => `PKR ${v.toLocaleString()}`} />
                <Bar dataKey="median_net" name="Median Net/Shift" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, color: '#374151' }}>⚠ Vulnerability Flags</h3>
        <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>Workers whose income dropped more than 20% month-on-month.</p>
        {vulnFlags.length === 0 ? (
          <p style={{ color: '#9ca3af', fontSize: 13 }}>No vulnerability flags detected.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#fff7ed' }}>
                {['Worker ID', 'Month', 'Current Net', 'Previous Net', 'Drop %'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#374151', borderBottom: '1px solid #e5e7eb' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vulnFlags.map((f, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '9px 12px', fontSize: 11, color: '#6b7280' }}>{f.worker_id?.slice(0, 12)}...</td>
                  <td style={{ padding: '9px 12px' }}>{f.month?.slice(0, 7)}</td>
                  <td style={{ padding: '9px 12px' }}>PKR {f.monthly_net?.toLocaleString()}</td>
                  <td style={{ padding: '9px 12px' }}>PKR {f.prev_month_net?.toLocaleString()}</td>
                  <td style={{ padding: '9px 12px' }}>
                    <span style={{ background: '#fee2e2', color: '#dc2626', padding: '2px 8px', borderRadius: 10, fontWeight: 700, fontSize: 12 }}>↓ {f.drop_pct}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}