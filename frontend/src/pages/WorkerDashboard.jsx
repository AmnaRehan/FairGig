import { useEffect, useState } from 'react';
import { earningsAPI, anomalyAPI } from '../api/config';
import { useAuth } from '../context/auth';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

/* eslint-disable react-hooks/set-state-in-effect */

export default function WorkerDashboard() {
  const { user } = useAuth();
  const [earnings, setEarnings] = useState([]);
  const [anomalies, setAnomalies] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

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
      .catch(() => {
        setError('Failed to load your earnings. Please try again.');
        toast.error('Failed to load data');
      })
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

  const statCard = (label, value, color = '#2563eb') => (
    <div style={{ background: 'white', borderRadius: 10, padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', flex: 1, minWidth: 150 }}>
      <div style={{ fontSize: 24, fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{label}</div>
    </div>
  );

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading your dashboard...</div>;
  if (error) return <div style={{ padding: 40, textAlign: 'center', color: '#b91c1c' }}>{error}</div>;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 8 }}>Welcome, {user.full_name}</h1>
      <p style={{ color: '#6b7280', marginBottom: 28, fontSize: 14 }}>Platform: {user.platform} · City: {user.city}</p>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 28 }}>
        {statCard('Total Net Earnings', `PKR ${totalNet.toLocaleString()}`)}
        {statCard('Total Shifts', earnings.length, '#059669')}
        {statCard('Avg. Hourly Rate', `PKR ${avgHourly}/hr`, '#7c3aed')}
        {statCard('Verified Shifts', verified, '#d97706')}
      </div>

      {chartData.length > 1 && (
        <div style={{ background: 'white', borderRadius: 10, padding: 24, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: '#374151' }}>Earnings per Shift (last 20)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={v => `PKR ${v.toLocaleString()}`} />
              <Line type="monotone" dataKey="net" stroke="#2563eb" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {anomalies && anomalies.anomalies_found > 0 && (
        <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: 10, padding: 20, marginBottom: 24 }}>
          <h3 style={{ color: '#92400e', fontWeight: 700, marginBottom: 8 }}>⚠ Anomalies Detected ({anomalies.anomalies_found})</h3>
          <p style={{ color: '#92400e', fontSize: 13, marginBottom: 12 }}>{anomalies.summary}</p>
          {anomalies.flags.map((flag, i) => (
            <div key={i} style={{ background: 'white', borderRadius: 8, padding: '12px 16px', marginBottom: 8, borderLeft: `4px solid ${flag.severity === 'high' ? '#dc2626' : '#f59e0b'}` }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a1a' }}>{flag.anomaly_type.replace(/_/g, ' ').toUpperCase()}</div>
              <div style={{ fontSize: 13, color: '#374151', marginTop: 4 }}>{flag.explanation}</div>
              <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>Expected: {flag.expected_range}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ background: 'white', borderRadius: 10, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: '#374151' }}>Recent Shifts</h3>
        {earnings.length === 0 ? (
          <div style={{ padding: '24px 0', textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>
            No earnings logged yet.
          </div>
        ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Date', 'Platform', 'Hours', 'Gross', 'Deductions', 'Net', 'Status'].map(h => (
                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#374151', borderBottom: '1px solid #e5e7eb' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {earnings.slice(0, 15).map(e => (
              <tr key={e.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '9px 12px' }}>{e.shift_date?.slice(0, 10)}</td>
                <td style={{ padding: '9px 12px' }}>{e.platform}</td>
                <td style={{ padding: '9px 12px' }}>{e.hours_worked}h</td>
                <td style={{ padding: '9px 12px' }}>PKR {e.gross_earned.toLocaleString()}</td>
                <td style={{ padding: '9px 12px', color: '#dc2626' }}>-PKR {e.platform_deductions.toLocaleString()}</td>
                <td style={{ padding: '9px 12px', fontWeight: 600 }}>PKR {e.net_received.toLocaleString()}</td>
                <td style={{ padding: '9px 12px' }}>
                  <span style={{
                    background: e.verification_status === 'verified' ? '#d1fae5' : e.verification_status === 'disputed' ? '#fee2e2' : '#fef3c7',
                    color: e.verification_status === 'verified' ? '#059669' : e.verification_status === 'disputed' ? '#dc2626' : '#d97706',
                    padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600
                  }}>{e.verification_status}</span>
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