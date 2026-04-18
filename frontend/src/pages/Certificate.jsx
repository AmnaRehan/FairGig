import { useState } from 'react';
import { certificateAPI } from '../api/config';
import { useAuth } from '../context/auth';
import toast from 'react-hot-toast';

export default function Certificate() {
  const { user } = useAuth();
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasWindowSupport] = useState(typeof window !== 'undefined');

  const generate = async () => {
    if (!dateFrom || !dateTo) return toast.error('Select date range');
    setLoading(true);
    try {
      const r = await certificateAPI.post('/certificate/generate', {
        worker_id: user.id,
        worker_name: user.full_name,
        date_from: dateFrom,
        date_to: dateTo,
      }, { responseType: 'text' });
      const win = window.open('', '_blank');
      if (!win) {
        toast.error('Pop-up blocked. Allow pop-ups to view the certificate.');
        return;
      }
      win.document.write(r.data);
      win.document.close();
    } catch {
      toast.error('No verified earnings in this range, or service error');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14 };

  return (
    <div style={{ maxWidth: 600, margin: '60px auto', padding: '0 20px' }}>
      <div style={{ background: 'white', borderRadius: 14, padding: 40, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Income Certificate</h1>
        <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 28 }}>
          Generate a printable income summary for verified shifts. Use this with landlords, banks, or microfinance applications.
        </p>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>From Date</label>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={inputStyle} />
        </div>
        <div style={{ marginBottom: 28 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>To Date</label>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={inputStyle} />
        </div>
        <div style={{ background: '#fef3c7', borderRadius: 8, padding: '12px 16px', marginBottom: 24, fontSize: 13, color: '#92400e' }}>
          Only <strong>verified</strong> shifts will appear on the certificate. Upload screenshots and have them verified first.
        </div>
        {!hasWindowSupport && (
          <div style={{ color: '#b91c1c', fontSize: 13, marginBottom: 12 }}>Certificate preview requires a browser window.</div>
        )}
        <button onClick={generate} disabled={loading || !hasWindowSupport}
          style={{ width: '100%', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, padding: '13px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
          {loading ? 'Generating...' : 'Generate Certificate'}
        </button>
      </div>
    </div>
  );
}