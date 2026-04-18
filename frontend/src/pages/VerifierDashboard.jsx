import { useEffect, useState } from 'react';
import { earningsAPI } from '../api/config';
import toast from 'react-hot-toast';

/* eslint-disable react-hooks/set-state-in-effect */

export default function VerifierDashboard() {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await earningsAPI.get('/earnings/all');
      setLogs(response.data);
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

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Loading verifier queue...</div>;
  }

  if (error) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#b91c1c' }}>{error}</div>;
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Verifier Dashboard</h1>
      <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>Review earnings screenshots and approve or flag entries.</p>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {['pending', 'verified', 'disputed', 'all'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            style={{ background: filter === s ? '#2563eb' : '#f3f4f6', color: filter === s ? 'white' : '#374151', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, cursor: 'pointer', fontWeight: filter === s ? 700 : 400 }}>
            {s.charAt(0).toUpperCase() + s.slice(1)} ({s === 'all' ? logs.length : logs.filter(l => l.verification_status === s).length})
          </button>
        ))}
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#1e40af', color: 'white' }}>
            {['Worker ID', 'Platform', 'Date', 'Gross', 'Deductions', 'Net', 'Status', 'Screenshot', 'Actions'].map(h => (
              <th key={h} style={{ padding: '12px 12px', textAlign: 'left', fontWeight: 600, fontSize: 12 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 && (
            <tr>
              <td colSpan={9} style={{ padding: '24px 12px', textAlign: 'center', color: '#9ca3af' }}>
                No earnings found for this filter.
              </td>
            </tr>
          )}
          {filtered.map(l => (
            <tr key={l.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
              <td style={{ padding: '10px 12px', color: '#6b7280', fontSize: 11 }}>{l.worker_id?.slice(0, 8)}...</td>
              <td style={{ padding: '10px 12px' }}>{l.platform}</td>
              <td style={{ padding: '10px 12px' }}>{l.shift_date?.slice(0, 10)}</td>
              <td style={{ padding: '10px 12px' }}>PKR {l.gross_earned?.toLocaleString()}</td>
              <td style={{ padding: '10px 12px', color: '#dc2626' }}>-{l.platform_deductions?.toLocaleString()}</td>
              <td style={{ padding: '10px 12px', fontWeight: 600 }}>PKR {l.net_received?.toLocaleString()}</td>
              <td style={{ padding: '10px 12px' }}>
                <span style={{ background: l.verification_status === 'verified' ? '#d1fae5' : l.verification_status === 'disputed' ? '#fee2e2' : '#fef3c7', color: l.verification_status === 'verified' ? '#059669' : l.verification_status === 'disputed' ? '#dc2626' : '#d97706', padding: '2px 7px', borderRadius: 10, fontSize: 11, fontWeight: 600 }}>{l.verification_status}</span>
              </td>
              <td style={{ padding: '10px 12px' }}>
                {l.screenshot_path ? <a href={`http://localhost:8001/${l.screenshot_path}`} target="_blank" rel="noreferrer" style={{ color: '#2563eb', fontSize: 12 }}>View</a> : <span style={{ color: '#9ca3af', fontSize: 11 }}>None</span>}
              </td>
              <td style={{ padding: '10px 12px' }}>
                {l.verification_status === 'pending' && (
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => verify(l.id, 'verified')} style={{ background: '#d1fae5', color: '#059669', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>✓</button>
                    <button onClick={() => verify(l.id, 'disputed')} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>✗</button>
                    <button onClick={() => verify(l.id, 'unverifiable')} style={{ background: '#f3f4f6', color: '#6b7280', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 11, cursor: 'pointer' }}>?</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}