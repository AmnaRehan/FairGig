import { useState } from 'react';
import { certificateAPI } from '../api/config';
import { useAuth } from '../context/auth';
import toast from 'react-hot-toast';

const ACCENT   = '#2563EB';
const ACCENT_D = '#1D4ED8';
const GREEN    = '#10B981';
const ORANGE   = '#F59E0B';
const RED      = '#EF4444';

const field = {
  width: '100%',
  padding: '16px 18px',
  borderRadius: 14,
  border: '2px solid #CBD5E1',
  background: '#fff',
  color: '#0F172A',
  fontSize: 18,
  fontFamily: '"Nunito", system-ui, sans-serif',
  fontWeight: 600,
  boxSizing: 'border-box',
  outline: 'none',
  transition: 'border 0.18s, box-shadow 0.18s',
  colorScheme: 'light',
};

const labelSt = {
  fontSize: 13,
  fontWeight: 800,
  color: '#475569',
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  display: 'block',
  marginBottom: 7,
};

export default function Certificate() {
  const { user } = useAuth();
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo]     = useState('');
  const [loading, setLoading]   = useState(false);
  const [focusField, setFocus]  = useState(null);
  const [hasWindowSupport]      = useState(typeof window !== 'undefined');

  const inp = (name) => ({
    ...field,
    border: focusField === name ? `2px solid ${ACCENT}` : '2px solid #CBD5E1',
    boxShadow: focusField === name ? `0 0 0 4px rgba(37,99,235,0.12)` : 'none',
  });

  const generate = async () => {
    if (!dateFrom || !dateTo) return toast.error('Please select both dates');
    if (dateTo < dateFrom) return toast.error('End date must be after start date');
    setLoading(true);
    try {
      const r = await certificateAPI.post('/certificate/generate', {
        worker_id:   user.id,
        worker_name: user.full_name,
        date_from:   dateFrom,
        date_to:     dateTo,
      }, { responseType: 'text' });
      const win = window.open('', '_blank');
      if (!win) {
        toast.error('Pop-up blocked — please allow pop-ups and try again.');
        return;
      }
      win.document.write(r.data);
      win.document.close();
    } catch {
      toast.error('No verified earnings found in this range');
    } finally {
      setLoading(false);
    }
  };

  const ready = dateFrom && dateTo && dateTo >= dateFrom && !loading && hasWindowSupport;

  // compute friendly date range label
  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }) : null;
  const rangeLabel = dateFrom && dateTo && dateTo >= dateFrom
    ? `${fmt(dateFrom)} → ${fmt(dateTo)}`
    : null;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F0F4FF',
      fontFamily: '"Nunito", system-ui, sans-serif',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.3); cursor: pointer; scale: 1.2; }
        * { font-family: "Nunito", system-ui, sans-serif; }
        .cert-generate-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(37,99,235,0.4) !important; }
        .cert-generate-btn:active:not(:disabled) { transform: translateY(0); }
      `}</style>

      {/* ── Header bar ── */}
      <div style={{ background: ACCENT, padding: '20px 24px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 46, height: 46, borderRadius: 14, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
          📄
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: '-0.01em' }}>
            Income Certificate
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>
            Official proof of your gig earnings
          </p>
        </div>
      </div>

      {/* ── Blue info banner ── */}
      <div style={{ background: ACCENT_D, padding: '14px 24px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>ℹ️</span>
        <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.9)', fontWeight: 600, lineHeight: 1.6 }}>
          You can use this certificate with <strong style={{ color: '#fff' }}>banks, landlords, or microfinance</strong> providers as official proof of income.
        </p>
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px 16px 48px' }}>

        {/* ── Certificate preview card ── */}
        <div style={{
          background: '#fff',
          borderRadius: 20,
          border: '2px solid #E2E8F0',
          marginBottom: 18,
          overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(37,99,235,0.08)',
        }}>
          {/* Certificate mock header */}
          <div style={{
            background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_D} 100%)`,
            padding: '28px 28px 22px',
            textAlign: 'center',
            position: 'relative',
          }}>
            {/* decorative seal ring */}
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              border: '3px solid rgba(255,255,255,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              fontSize: 30,
              background: 'rgba(255,255,255,0.12)',
            }}>
              🏅
            </div>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>
              FairGig Platform
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', letterSpacing: '-0.01em' }}>
              Certificate of Income
            </div>
            {rangeLabel && (
              <div style={{ marginTop: 8, fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: 700 }}>
                {rangeLabel}
              </div>
            )}
          </div>

          {/* Certificate body rows */}
          <div style={{ padding: '20px 24px' }}>
            {[
              { label: 'Worker Name',  value: user?.full_name || 'Your Name',     icon: '👤' },
              { label: 'Platform',     value: 'All Verified Platforms',            icon: '📱' },
              { label: 'Status',       value: 'Verified Earnings Only',            icon: '✅' },
              { label: 'Period',       value: rangeLabel || 'Select dates below',  icon: '📅' },
            ].map((row, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '13px 0',
                borderBottom: i < 3 ? '1px solid #F1F5F9' : 'none',
              }}>
                <span style={{ fontSize: 18, width: 26, textAlign: 'center', flexShrink: 0 }}>{row.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
                    {row.label}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: row.value.includes('Select') ? '#CBD5E1' : '#1E293B' }}>
                    {row.value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Certificate footer stripe */}
          <div style={{
            background: '#F8FAFC',
            borderTop: '1px solid #E2E8F0',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span style={{ fontSize: 14 }}>🔒</span>
            <span style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>
              Digitally verified by FairGig · Valid for official use
            </span>
          </div>
        </div>

        {/* ── Warning notice ── */}
        <div style={{
          background: '#FFFBEB',
          border: '2px solid #FCD34D',
          borderRadius: 16,
          padding: '16px 18px',
          marginBottom: 18,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
        }}>
          <span style={{ fontSize: 22, flexShrink: 0, marginTop: 1 }}>⚠️</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#78350F', marginBottom: 4 }}>
              Verify your shifts first
            </div>
            <div style={{ fontSize: 14, color: '#92400E', fontWeight: 600, lineHeight: 1.6 }}>
              Upload screenshots and get them verified before generating. Unverified shifts will <strong>not</strong> appear on your certificate.
            </div>
          </div>
        </div>

        {/* ── Date range card ── */}
        <div style={{
          background: '#fff',
          borderRadius: 20,
          border: '1.5px solid #E2E8F0',
          padding: '24px 22px',
          marginBottom: 16,
        }}>
          <h2 style={{ margin: '0 0 18px', fontSize: 18, fontWeight: 800, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 36, height: 36, borderRadius: 10, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
              📅
            </span>
            Choose your date range
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 10 }}>
            <div>
              <label style={labelSt} htmlFor="dateFrom">
                From Date <span style={{ color: ACCENT }}>*</span>
              </label>
              <input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
                style={inp('dateFrom')}
                onFocus={() => setFocus('dateFrom')}
                onBlur={() => setFocus(null)}
              />
            </div>
            <div>
              <label style={labelSt} htmlFor="dateTo">
                To Date <span style={{ color: ACCENT }}>*</span>
              </label>
              <input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
                min={dateFrom || undefined}
                style={inp('dateTo')}
                onFocus={() => setFocus('dateTo')}
                onBlur={() => setFocus(null)}
              />
            </div>
          </div>

          {/* Quick range pills */}
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
              Quick select
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { label: 'Last 30 days', days: 30 },
                { label: 'Last 3 months', days: 90 },
                { label: 'Last 6 months', days: 180 },
                { label: 'Last year', days: 365 },
              ].map(({ label, days }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    const to = new Date();
                    const from = new Date();
                    from.setDate(from.getDate() - days);
                    const fmt = d => d.toISOString().split('T')[0];
                    setDateFrom(fmt(from));
                    setDateTo(fmt(to));
                  }}
                  style={{
                    padding: '9px 16px',
                    borderRadius: 12,
                    border: '2px solid #E2E8F0',
                    background: '#F8FAFC',
                    color: '#475569',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={e => { e.target.style.borderColor = ACCENT; e.target.style.color = ACCENT; e.target.style.background = '#EFF6FF'; }}
                  onMouseLeave={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.color = '#475569'; e.target.style.background = '#F8FAFC'; }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* range confirmation */}
          {rangeLabel && (
            <div style={{
              marginTop: 16,
              background: '#F0FDF4',
              border: '2px solid #86EFAC',
              borderRadius: 12,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}>
              <span style={{ fontSize: 18 }}>✅</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#065F46' }}>
                Certificate will cover: <strong>{rangeLabel}</strong>
              </span>
            </div>
          )}
        </div>

        {/* ── No window support warning ── */}
        {!hasWindowSupport && (
          <div style={{
            background: '#FEF2F2',
            border: '2px solid #FCA5A5',
            borderRadius: 14,
            padding: '14px 18px',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <span style={{ fontSize: 20 }}>🚫</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#7F1D1D' }}>
              Certificate preview requires a browser window
            </span>
          </div>
        )}

        {/* ── Generate button ── */}
        <button
          onClick={generate}
          disabled={!ready}
          className="cert-generate-btn"
          style={{
            width: '100%',
            padding: '20px',
            borderRadius: 18,
            border: 'none',
            background: ready ? `linear-gradient(135deg, ${ACCENT}, ${ACCENT_D})` : '#E2E8F0',
            color: ready ? '#fff' : '#94A3B8',
            fontSize: 20,
            fontWeight: 900,
            cursor: ready ? 'pointer' : 'not-allowed',
            boxShadow: ready ? '0 8px 24px rgba(37,99,235,0.3)' : 'none',
            transition: 'all 0.18s',
            letterSpacing: '-0.01em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            marginBottom: 16,
          }}
        >
          {loading
            ? <><span style={{ fontSize: 20 }}>⏳</span> Generating Certificate...</>
            : <><span style={{ fontSize: 20 }}>📄</span> Generate Certificate →</>
          }
        </button>

        {/* Helper tip */}
        <p style={{ textAlign: 'center', fontSize: 13, color: '#94A3B8', fontWeight: 600, margin: 0 }}>
          🔒 The certificate will open in a new tab for printing or saving as PDF
        </p>
      </div>
    </div>
  );
}
