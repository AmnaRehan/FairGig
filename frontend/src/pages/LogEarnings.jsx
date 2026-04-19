import { useState } from 'react';
import { earningsAPI } from '../api/config';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const PLATFORMS = [
  { id: 'Careem',    emoji: '🟢', color: '#065F46', bg: '#ECFDF5', border: '#6EE7B7' },
  { id: 'Foodpanda', emoji: '🩷', color: '#9D174D', bg: '#FDF2F8', border: '#F9A8D4' },
  { id: 'Uber',      emoji: '⬛', color: '#1E293B', bg: '#F8FAFC', border: '#CBD5E1' },
  { id: 'Bykea',     emoji: '🟡', color: '#78350F', bg: '#FFFBEB', border: '#FCD34D' },
  { id: 'Other',     emoji: '➕', color: '#1E40AF', bg: '#EFF6FF', border: '#93C5FD' },
];

const CATEGORIES = [
  { id: 'ride-hailing',  label: 'Ride Hailing',  icon: '🚗' },
  { id: 'food-delivery', label: 'Food Delivery',  icon: '🍔' },
  { id: 'courier',       label: 'Courier',        icon: '📦' },
  { id: 'freelance',     label: 'Freelance',      icon: '💻' },
  { id: 'other',         label: 'Other',          icon: '📋' },
];

const ACCENT   = '#2563EB';
const ACCENT_D = '#1D4ED8';
const GREEN    = '#10B981';
const GREEN_D  = '#059669';
const ORANGE   = '#F59E0B';

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
  appearance: 'none',
  WebkitAppearance: 'none',
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

const card = {
  background: '#fff',
  borderRadius: 20,
  border: '1.5px solid #E2E8F0',
  padding: '24px 22px',
  marginBottom: 16,
};

const sectionTitle = {
  fontSize: 18,
  fontWeight: 800,
  color: '#1E293B',
  margin: '0 0 18px',
  display: 'flex',
  alignItems: 'center',
  gap: 10,
};

const iconBadge = (bg) => ({
  width: 36,
  height: 36,
  borderRadius: 10,
  background: bg,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 18,
  flexShrink: 0,
});

export default function LogEarnings() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    platform: 'Careem', shift_date: '', hours_worked: '', gross_earned: '',
    platform_deductions: '0', net_received: '', city: '', category: 'ride-hailing',
  });
  const [csvFile, setCsvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [focusField, setFocusField] = useState(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const gross = parseFloat(form.gross_earned) || 0;
  const ded   = parseFloat(form.platform_deductions) || 0;
  const hours = parseFloat(form.hours_worked) || 0;
  const net   = gross - ded;
  const hrly  = hours > 0 && net > 0 ? Math.round(net / hours) : null;

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
      toast.success('Shift logged successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to log shift');
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

  const inp = (name) => ({
    ...field,
    border: focusField === name ? `2px solid ${ACCENT}` : '2px solid #CBD5E1',
    boxShadow: focusField === name ? `0 0 0 4px rgba(37,99,235,0.12)` : 'none',
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F0F4FF',
      fontFamily: '"Nunito", system-ui, sans-serif',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.4); cursor: pointer; }
        input::placeholder { color: #94A3B8; font-weight: 400; }
        * { font-family: "Nunito", system-ui, sans-serif; }
      `}</style>

      {/* Top header bar */}
      <div style={{
        background: ACCENT,
        padding: '20px 24px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: 10,
            color: '#fff',
            fontSize: 20,
            width: 40,
            height: 40,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
          aria-label="Go back"
        >
          ←
        </button>
        <div style={{
          width: 46,
          height: 46,
          borderRadius: 14,
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22,
          flexShrink: 0,
        }}>
          💼
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: '-0.01em' }}>
            Log a Shift
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>
            Record today's work and earnings
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ background: ACCENT_D, padding: '0 24px 14px' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              flex: 1,
              height: 5,
              borderRadius: 3,
              background: i === 1 ? '#fff' : 'rgba(255,255,255,0.3)',
            }} />
          ))}
        </div>
        <p style={{ margin: '6px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>
          STEP 1 OF 3 — SHIFT DETAILS
        </p>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 16px 40px' }}>

        <form onSubmit={handleSubmit}>

          {/* ── SECTION 1: Platform ── */}
          <div style={card}>
            <h2 style={sectionTitle}>
              <span style={iconBadge('#EEF2FF')}>📱</span>
              Which platform did you work on?
            </h2>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {PLATFORMS.map(p => {
                const active = form.platform === p.id;
                return (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => set('platform', p.id)}
                    style={{
                      padding: '12px 20px',
                      borderRadius: 14,
                      border: `2px solid ${active ? p.border : '#E2E8F0'}`,
                      background: active ? p.bg : '#F8FAFC',
                      color: active ? p.color : '#64748B',
                      fontSize: 16,
                      fontWeight: active ? 800 : 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 7,
                      boxShadow: active ? `0 0 0 3px ${p.border}55` : 'none',
                    }}
                  >
                    {p.emoji} {p.id}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── SECTION 2: Category ── */}
          <div style={card}>
            <h2 style={sectionTitle}>
              <span style={iconBadge('#FFFBEB')}>🗂️</span>
              What type of work?
            </h2>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {CATEGORIES.map(c => {
                const active = form.category === c.id;
                return (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => set('category', c.id)}
                    style={{
                      padding: '12px 18px',
                      borderRadius: 14,
                      border: `2px solid ${active ? '#93C5FD' : '#E2E8F0'}`,
                      background: active ? '#EFF6FF' : '#F8FAFC',
                      color: active ? '#1E40AF' : '#64748B',
                      fontSize: 15,
                      fontWeight: active ? 800 : 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 7,
                      boxShadow: active ? '0 0 0 3px rgba(147,197,253,0.4)' : 'none',
                    }}
                  >
                    {c.icon} {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── SECTION 3: Date & Location ── */}
          <div style={card}>
            <h2 style={sectionTitle}>
              <span style={iconBadge('#FDF2F8')}>📅</span>
              When and where did you work?
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelSt} htmlFor="shift_date">
                  Shift Date <span style={{ color: ACCENT }}>*</span>
                </label>
                <input
                  id="shift_date"
                  type="date"
                  value={form.shift_date}
                  onChange={e => set('shift_date', e.target.value)}
                  required
                  style={{ ...inp('shift_date'), colorScheme: 'light' }}
                  onFocus={() => setFocusField('shift_date')}
                  onBlur={() => setFocusField(null)}
                />
              </div>
              <div>
                <label style={labelSt} htmlFor="city">City</label>
                <input
                  id="city"
                  type="text"
                  value={form.city}
                  onChange={e => set('city', e.target.value)}
                  placeholder="e.g. Lahore"
                  style={inp('city')}
                  onFocus={() => setFocusField('city')}
                  onBlur={() => setFocusField(null)}
                />
              </div>
            </div>
          </div>

          {/* ── SECTION 4: Earnings ── */}
          <div style={card}>
            <h2 style={sectionTitle}>
              <span style={iconBadge('#ECFDF5')}>💰</span>
              How much did you earn?
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelSt} htmlFor="hours_worked">
                  Hours Worked <span style={{ color: ACCENT }}>*</span>
                </label>
                <input
                  id="hours_worked"
                  type="number"
                  value={form.hours_worked}
                  onChange={e => set('hours_worked', e.target.value)}
                  placeholder="e.g. 6.5"
                  step="0.5"
                  min="0"
                  required
                  style={inp('hours_worked')}
                  onFocus={() => setFocusField('hours_worked')}
                  onBlur={() => setFocusField(null)}
                />
                <p style={{ fontSize: 12, color: '#94A3B8', margin: '5px 0 0', fontWeight: 600 }}>
                  Total hours on shift
                </p>
              </div>
              <div>
                <label style={labelSt} htmlFor="gross_earned">
                  Gross Earned (PKR) <span style={{ color: ACCENT }}>*</span>
                </label>
                <input
                  id="gross_earned"
                  type="number"
                  value={form.gross_earned}
                  onChange={e => set('gross_earned', e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                  style={inp('gross_earned')}
                  onFocus={() => setFocusField('gross_earned')}
                  onBlur={() => setFocusField(null)}
                />
                <p style={{ fontSize: 12, color: '#94A3B8', margin: '5px 0 0', fontWeight: 600 }}>
                  Before platform cuts
                </p>
              </div>
              <div>
                <label style={labelSt} htmlFor="platform_deductions">
                  Platform Deductions (PKR)
                </label>
                <input
                  id="platform_deductions"
                  type="number"
                  value={form.platform_deductions}
                  onChange={e => set('platform_deductions', e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  style={inp('platform_deductions')}
                  onFocus={() => setFocusField('platform_deductions')}
                  onBlur={() => setFocusField(null)}
                />
                <p style={{ fontSize: 12, color: '#94A3B8', margin: '5px 0 0', fontWeight: 600 }}>
                  Commission or fees charged
                </p>
              </div>
              <div>
                <label style={labelSt} htmlFor="net_received">
                  Net Received (PKR) <span style={{ color: ACCENT }}>*</span>
                </label>
                <input
                  id="net_received"
                  type="number"
                  value={form.net_received}
                  onChange={e => set('net_received', e.target.value)}
                  placeholder={gross > 0 ? net.toFixed(2) : '0.00'}
                  step="0.01"
                  min="0"
                  required
                  style={inp('net_received')}
                  onFocus={() => setFocusField('net_received')}
                  onBlur={() => setFocusField(null)}
                />
                <p style={{ fontSize: 12, color: '#94A3B8', margin: '5px 0 0', fontWeight: 600 }}>
                  What you actually received
                </p>
              </div>
            </div>

            {/* Live preview strip */}
            {gross > 0 && (
              <div style={{
                marginTop: 20,
                background: '#F0FDF4',
                border: `2px solid #86EFAC`,
                borderRadius: 16,
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#065F46', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 4 }}>
                    Your Take-Home
                  </div>
                  {hrly && (
                    <div style={{ fontSize: 14, color: '#15803D', fontWeight: 700 }}>
                      PKR {hrly.toLocaleString('en-PK')} per hour
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#15803D', letterSpacing: '-0.02em' }}>
                  PKR {net.toLocaleString('en-PK', { maximumFractionDigits: 2 })}
                </div>
              </div>
            )}

            {/* Deduction warning */}
            {gross > 0 && ded > 0 && (
              <div style={{
                marginTop: 12,
                background: '#FFFBEB',
                border: '2px solid #FCD34D',
                borderRadius: 12,
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}>
                <span style={{ fontSize: 18 }}>⚠️</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#78350F' }}>
                  Platform deducted PKR {ded.toLocaleString('en-PK')} ({((ded / gross) * 100).toFixed(1)}% of gross)
                </span>
              </div>
            )}
          </div>

          {/* ── Submit ── */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '20px',
              borderRadius: 18,
              border: 'none',
              background: loading ? '#94A3B8' : `linear-gradient(135deg, ${ACCENT}, ${ACCENT_D})`,
              color: '#fff',
              fontSize: 20,
              fontWeight: 900,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 8px 24px rgba(37,99,235,0.35)',
              transition: 'all 0.18s',
              letterSpacing: '-0.01em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              marginBottom: 16,
            }}
          >
            {loading ? (
              <>⏳ Saving your shift...</>
            ) : (
              <>✅ Save This Shift →</>
            )}
          </button>
        </form>

        {/* ── CSV Import Card ── */}
        <div style={{
          ...card,
          border: '1.5px dashed #CBD5E1',
          background: '#F8FAFC',
        }}>
          <h2 style={{ ...sectionTitle, marginBottom: 6 }}>
            <span style={iconBadge('#EEF2FF')}>📂</span>
            Bulk Import from CSV
          </h2>
          <p style={{ margin: '0 0 14px', fontSize: 14, color: '#64748B', fontWeight: 600, lineHeight: 1.6 }}>
            Import multiple shifts at once. Required columns:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
            {['platform', 'shift_date', 'hours_worked', 'gross_earned', 'platform_deductions', 'net_received'].map(h => (
              <span key={h} style={{
                background: '#EEF2FF',
                color: '#3730A3',
                border: '1px solid #C7D2FE',
                padding: '4px 10px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
              }}>
                {h}
              </span>
            ))}
          </div>

          <label style={{
            display: 'block',
            border: `2px dashed ${csvFile ? '#10B981' : '#CBD5E1'}`,
            borderRadius: 14,
            padding: '24px 20px',
            textAlign: 'center',
            cursor: 'pointer',
            background: csvFile ? '#F0FDF4' : '#fff',
            marginBottom: 14,
            transition: 'all 0.18s',
          }}>
            <input
              type="file"
              accept=".csv"
              style={{ display: 'none' }}
              onChange={e => setCsvFile(e.target.files[0] || null)}
            />
            <div style={{ fontSize: 28, marginBottom: 8 }}>{csvFile ? '✅' : '📄'}</div>
            <div style={{ fontSize: 15, color: csvFile ? '#065F46' : '#64748B', fontWeight: 700 }}>
              {csvFile ? csvFile.name : 'Tap here to choose a CSV file'}
            </div>
            {!csvFile && (
              <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 4, fontWeight: 600 }}>
                Supported format: .csv
              </div>
            )}
          </label>

          <button
            onClick={handleCsvImport}
            disabled={!csvFile || loading}
            style={{
              padding: '14px 28px',
              borderRadius: 14,
              border: `2px solid ${csvFile && !loading ? GREEN : '#CBD5E1'}`,
              cursor: csvFile && !loading ? 'pointer' : 'not-allowed',
              fontWeight: 800,
              fontSize: 16,
              color: csvFile && !loading ? '#fff' : '#94A3B8',
              background: csvFile && !loading ? GREEN : '#F1F5F9',
              transition: 'all 0.18s',
              fontFamily: 'inherit',
            }}
          >
            {loading ? 'Importing...' : '📥 Import CSV File'}
          </button>
        </div>

      </div>
    </div>
  );
}
