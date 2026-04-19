import { useState } from 'react';
import { earningsAPI } from '../api/config';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const PLATFORMS = ['Careem', 'Foodpanda', 'Uber', 'Bykea', 'Other'];
const CATEGORIES = ['ride-hailing', 'food-delivery', 'courier', 'freelance', 'other'];

export default function LogEarnings() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    platform: 'Careem', shift_date: '', hours_worked: '', gross_earned: '',
    platform_deductions: '0', net_received: '', city: '', category: 'ride-hailing',
  });
  const [csvFile, setCsvFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const gross = parseFloat(form.gross_earned) || 0;
  const ded   = parseFloat(form.platform_deductions) || 0;
  const hours = parseFloat(form.hours_worked) || 0;
  const net   = gross - ded;
  const hrly  = hours > 0 && net > 0 ? (net / hours).toFixed(0) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await earningsAPI.post('/earnings/', {
        ...form,
        shift_date: `${form.shift_date}T00:00:00`,
        hours_worked: parseFloat(form.hours_worked),
        gross_earned: parseFloat(form.gross_earned),
        platform_deductions: parseFloat(form.platform_deductions),
        net_received: parseFloat(form.net_received),
      });
      toast.success('Earnings logged successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to log earnings');
    } finally {
      setLoading(false);
    }
  };

  const handleCsvImport = async () => {
    if (!csvFile) return;
    setLoading(true);
    const fd = new FormData();
    fd.append('file', csvFile);
    try {
      const r = await earningsAPI.post('/earnings/bulk-import', fd);
      toast.success(`Imported ${r.data.imported} entries!`);
      navigate('/');
    } catch {
      toast.error('CSV import failed');
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    width: '100%', padding: '11px 14px', borderRadius: 12,
    border: '1px solid rgba(148,163,184,0.15)',
    background: 'rgba(2,6,23,0.6)', color: '#e2e8f0',
    fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s',
    fontFamily: 'inherit',
  };

  const labelStyle = {
    fontSize: 11, letterSpacing: '0.08em', color: '#64748b',
    fontWeight: 600, display: 'block', marginBottom: 7,
  };

  const pillBase = (active, color) => ({
    padding: '6px 14px', borderRadius: 20, fontSize: 12, cursor: 'pointer',
    transition: 'all 0.15s', fontWeight: active ? 600 : 400,
    border: active ? `1px solid ${color}55` : '1px solid rgba(148,163,184,0.12)',
    background: active ? `${color}18` : 'rgba(2,6,23,0.5)',
    color: active ? color : '#64748b',
  });

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at 20% 10%, #0f172a, #020617 60%, #000)', padding: '32px 20px' }}>
      <style>{`
        @keyframes fadeup { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        .le-inp:focus { border-color: rgba(99,102,241,0.6) !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.12) !important; }
        .le-inp::placeholder { color: #334155; }
        .le-pill:hover { border-color: rgba(99,102,241,0.4) !important; }
        .le-filedrop:hover { border-color: rgba(99,102,241,0.4) !important; background: rgba(99,102,241,0.05) !important; }
      `}</style>

      {/* ambient glows */}
      <div style={{ position: 'fixed', width: 500, height: 500, background: 'radial-gradient(circle,rgba(99,102,241,0.18),transparent 65%)', top: '-150px', left: '-150px', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', width: 400, height: 400, background: 'radial-gradient(circle,rgba(236,72,153,0.12),transparent 65%)', bottom: '-100px', right: '-100px', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 760, margin: '0 auto', animation: 'fadeup 0.4s ease' }}>

        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg,#6366f1,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: '0 8px 24px rgba(99,102,241,0.4)' }}>💼</div>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#e2e8f0', letterSpacing: '-0.02em' }}>Log a Shift</h1>
            <p style={{ margin: 0, fontSize: 13, color: '#475569' }}>Record your earnings for a platform shift</p>
          </div>
        </div>

        {/* main form card */}
        <div style={{
          background: 'rgba(15,23,42,0.9)', backdropFilter: 'blur(24px)',
          border: '1px solid rgba(148,163,184,0.12)', borderRadius: 20,
          padding: 28, marginBottom: 20, position: 'relative', overflow: 'hidden',
          boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
        }}>
          {/* shimmer top border */}
          <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1, background: 'linear-gradient(90deg,transparent,rgba(99,102,241,0.8),rgba(236,72,153,0.8),transparent)', backgroundSize: '200% auto', animation: 'shimmer 3s linear infinite' }} />

          <form onSubmit={handleSubmit}>

            {/* Platform pills */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>PLATFORM</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {PLATFORMS.map(p => (
                  <button type="button" key={p} className="le-pill"
                    onClick={() => set('platform', p)}
                    style={pillBase(form.platform === p, '#a5b4fc')}>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Category pills */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>CATEGORY</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {CATEGORIES.map(c => (
                  <button type="button" key={c} className="le-pill"
                    onClick={() => set('category', c)}
                    style={pillBase(form.category === c, '#818cf8')}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* 2-col grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div>
                <label style={labelStyle}>SHIFT DATE <span style={{ color: '#6366f1' }}>*</span></label>
                <input type="date" value={form.shift_date} onChange={e => set('shift_date', e.target.value)}
                  required className="le-inp" style={{ ...inp, colorScheme: 'dark' }} />
              </div>
              <div>
                <label style={labelStyle}>CITY</label>
                <input type="text" value={form.city} onChange={e => set('city', e.target.value)}
                  placeholder="e.g. Lahore" className="le-inp" style={inp} />
              </div>
              <div>
                <label style={labelStyle}>HOURS WORKED <span style={{ color: '#6366f1' }}>*</span></label>
                <input type="number" value={form.hours_worked} onChange={e => set('hours_worked', e.target.value)}
                  placeholder="0.0" step="0.5" min="0" required className="le-inp" style={inp} />
              </div>
              <div>
                <label style={labelStyle}>GROSS EARNED (PKR) <span style={{ color: '#6366f1' }}>*</span></label>
                <input type="number" value={form.gross_earned} onChange={e => set('gross_earned', e.target.value)}
                  placeholder="0.00" step="0.01" min="0" required className="le-inp" style={inp} />
              </div>
              <div>
                <label style={labelStyle}>PLATFORM DEDUCTIONS (PKR)</label>
                <input type="number" value={form.platform_deductions} onChange={e => set('platform_deductions', e.target.value)}
                  placeholder="0.00" step="0.01" min="0" className="le-inp" style={inp} />
              </div>
              <div>
                <label style={labelStyle}>NET RECEIVED (PKR) <span style={{ color: '#6366f1' }}>*</span></label>
                <input type="number" value={form.net_received} onChange={e => set('net_received', e.target.value)}
                  placeholder={gross > 0 ? net.toFixed(2) : '0.00'} step="0.01" min="0" required className="le-inp" style={inp} />
              </div>
            </div>

            {/* net preview strip */}
            {gross > 0 && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.2)',
                borderRadius: 12, padding: '12px 18px', marginBottom: 20,
              }}>
                <div>
                  <div style={{ fontSize: 11, color: '#34d39988', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 2 }}>NET PREVIEW</div>
                  {hrly && <div style={{ fontSize: 12, color: '#475569' }}>PKR <span style={{ color: '#34d399' }}>{hrly}</span>/hr</div>}
                </div>
                <div style={{ fontSize: 26, fontWeight: 700, color: '#34d399', letterSpacing: '-0.03em' }}>
                  PKR {net.toLocaleString('en-PK', { maximumFractionDigits: 2 })}
                </div>
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{ padding: '13px 28px', borderRadius: 12, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 14, color: 'white', background: 'linear-gradient(135deg,#6366f1,#ec4899)', boxShadow: '0 10px 28px rgba(99,102,241,0.35)', transition: 'all 0.2s', opacity: loading ? 0.6 : 1, width: '100%' }}>
              {loading ? 'Saving...' : 'Log Shift →'}
            </button>
          </form>
        </div>

        {/* CSV import card */}
        <div style={{
          background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(148,163,184,0.1)', borderRadius: 20,
          padding: 24, boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
        }}>
          <h3 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 700, color: '#e2e8f0' }}>Bulk CSV Import</h3>
          <p style={{ margin: '0 0 16px', fontSize: 12, color: '#475569', lineHeight: 1.6 }}>
            Required headers:{' '}
            {['platform','shift_date','hours_worked','gross_earned','platform_deductions','net_received'].map(h => (
              <span key={h} style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8', padding: '1px 7px', borderRadius: 6, fontSize: 11, marginRight: 4, border: '1px solid rgba(99,102,241,0.2)' }}>{h}</span>
            ))}
          </p>

          <label className="le-filedrop" style={{
            display: 'block', border: `1.5px dashed ${csvFile ? 'rgba(52,211,153,0.4)' : 'rgba(148,163,184,0.2)'}`,
            borderRadius: 12, padding: '20px 16px', textAlign: 'center', cursor: 'pointer',
            marginBottom: 14, background: csvFile ? 'rgba(52,211,153,0.06)' : 'transparent', transition: 'all 0.2s',
          }}>
            <input type="file" accept=".csv" style={{ display: 'none' }} onChange={e => setCsvFile(e.target.files[0] || null)} />
            <div style={{ fontSize: 13, color: csvFile ? '#34d399' : '#475569' }}>
              {csvFile ? `✓ ${csvFile.name}` : 'Drop CSV here or click to browse'}
            </div>
          </label>

          <button onClick={handleCsvImport} disabled={!csvFile || loading}
            style={{ padding: '11px 24px', borderRadius: 12, border: '1px solid rgba(52,211,153,0.25)', cursor: csvFile && !loading ? 'pointer' : 'not-allowed', fontWeight: 600, fontSize: 13, color: '#34d399', background: 'rgba(52,211,153,0.1)', transition: 'all 0.2s', opacity: csvFile && !loading ? 1 : 0.4 }}>
            {loading ? 'Importing...' : 'Import CSV →'}
          </button>
        </div>

      </div>
    </div>
  );
}