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

  const inp = {
    width: '100%', padding: '11px 14px', borderRadius: 12,
    border: '1px solid rgba(148,163,184,0.15)',
    background: 'rgba(2,6,23,0.6)', color: '#e2e8f0',
    fontSize: 14, outline: 'none', boxSizing: 'border-box',
    transition: 'all 0.2s', colorScheme: 'dark', fontFamily: 'inherit',
  };

  const labelStyle = {
    fontSize: 11, letterSpacing: '0.08em', color: '#64748b',
    fontWeight: 600, display: 'block', marginBottom: 7,
  };

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at 20% 10%, #0f172a, #020617 60%, #000)', padding: '32px 20px' }}>
      <style>{`
        @keyframes fadeup { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        .cert-inp:focus { border-color: rgba(99,102,241,0.6) !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.12) !important; }
        .cert-inp::placeholder { color: #334155; }
        .cert-btn:hover { opacity: 0.88 !important; transform: translateY(-1px); box-shadow: 0 14px 36px rgba(99,102,241,0.45) !important; }
        .cert-btn:active { transform: translateY(0); }
      `}</style>

      {/* ambient glows */}
      <div style={{ position: 'fixed', width: 500, height: 500, background: 'radial-gradient(circle,rgba(99,102,241,0.18),transparent 65%)', top: '-150px', left: '-150px', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', width: 400, height: 400, background: 'radial-gradient(circle,rgba(236,72,153,0.12),transparent 65%)', bottom: '-100px', right: '-100px', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 540, margin: '0 auto', animation: 'fadeup 0.4s ease' }}>

        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg,#6366f1,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: '0 8px 24px rgba(99,102,241,0.4)', flexShrink: 0 }}>📄</div>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#e2e8f0', letterSpacing: '-0.02em' }}>Income Certificate</h1>
            <p style={{ margin: 0, fontSize: 13, color: '#475569' }}>Generate a printable summary for verified shifts</p>
          </div>
        </div>

        {/* main card */}
        <div style={{
          background: 'rgba(15,23,42,0.9)', backdropFilter: 'blur(24px)',
          border: '1px solid rgba(148,163,184,0.12)', borderRadius: 20,
          padding: 28, position: 'relative', overflow: 'hidden',
          boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
        }}>
          {/* shimmer top border */}
          <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1, background: 'linear-gradient(90deg,transparent,rgba(99,102,241,0.8),rgba(236,72,153,0.8),transparent)', backgroundSize: '200% auto', animation: 'shimmer 3s linear infinite' }} />

          <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.7, marginBottom: 24, marginTop: 4 }}>
            Use this with landlords, banks, or microfinance applications. Only <span style={{ color: '#a5b4fc', fontWeight: 600 }}>verified</span> shifts will appear.
          </p>

          {/* date inputs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
            <div>
              <label style={labelStyle}>FROM DATE</label>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                className="cert-inp" style={inp} />
            </div>
            <div>
              <label style={labelStyle}>TO DATE</label>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                className="cert-inp" style={inp} />
            </div>
          </div>

          {/* warning notice */}
          <div style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 12, padding: '12px 16px', marginBottom: 24, fontSize: 13, color: '#fbbf24', lineHeight: 1.6 }}>
            ⚠ Upload screenshots and have them verified before generating — unverified shifts won't appear.
          </div>

          {!hasWindowSupport && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '10px 16px', marginBottom: 16, fontSize: 13, color: '#f87171' }}>
              Certificate preview requires a browser window.
            </div>
          )}

          <button onClick={generate} disabled={loading || !hasWindowSupport} className="cert-btn"
            style={{ width: '100%', background: 'linear-gradient(135deg,#6366f1,#ec4899)', color: 'white', border: 'none', borderRadius: 12, padding: '13px', fontSize: 14, fontWeight: 700, cursor: loading || !hasWindowSupport ? 'not-allowed' : 'pointer', boxShadow: '0 10px 28px rgba(99,102,241,0.35)', transition: 'all 0.2s', opacity: loading || !hasWindowSupport ? 0.6 : 1 }}>
            {loading ? 'Generating...' : 'Generate Certificate →'}
          </button>
        </div>
      </div>
    </div>
  );
}