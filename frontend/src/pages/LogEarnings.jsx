import { useState } from 'react';
import { earningsAPI } from '../api/config';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function LogEarnings() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    platform: '', shift_date: '', hours_worked: '', gross_earned: '',
    platform_deductions: '0', net_received: '', city: '', category: ''
  });
  const [csvFile, setCsvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewNet, setPreviewNet] = useState('');

  const updateField = (key, value) => {
    const nextForm = { ...form, [key]: value };
    setForm(nextForm);

    const gross = parseFloat(nextForm.gross_earned);
    const deductions = parseFloat(nextForm.platform_deductions || '0');
    if (!Number.isNaN(gross) && !Number.isNaN(deductions)) {
      setPreviewNet((gross - deductions).toFixed(2));
    } else {
      setPreviewNet('');
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    await earningsAPI.post('/earnings/', {
      ...form,
      shift_date: `${form.shift_date}T00:00:00`,  // fix: add time component
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

  const inputStyle = { width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' };
  const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5, color: '#374151' };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '32px 20px' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Log a Shift</h1>
      <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 28 }}>Record your earnings for a platform shift.</p>

      <div style={{ background: 'white', borderRadius: 12, padding: 32, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', marginBottom: 24 }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              ['Platform', 'platform', 'text', 'e.g. Careem, Foodpanda'],
              ['Shift Date', 'shift_date', 'date'],
              ['Hours Worked', 'hours_worked', 'number', '0'],
              ['Gross Earned (PKR)', 'gross_earned', 'number', '0'],
              ['Platform Deductions (PKR)', 'platform_deductions', 'number', '0'],
              ['Net Received (PKR)', 'net_received', 'number', '0'],
              ['City', 'city', 'text', 'e.g. Lahore'],
              ['Category', 'category', 'text', 'ride-hailing, food-delivery'],
            ].map(([label, key, type, placeholder]) => (
              <div key={key}>
                <label style={labelStyle}>{label}</label>
                <input type={type} placeholder={placeholder || ''} value={form[key]}
                  onChange={e => updateField(key, e.target.value)}
                  style={inputStyle} required={key !== 'city' && key !== 'category'} step={type === 'number' ? '0.01' : undefined} />
              </div>
            ))}
          </div>
          {previewNet && (
            <div style={{ marginTop: 16, fontSize: 13, color: '#059669' }}>
              Preview net income: PKR {Number(previewNet).toLocaleString()}
            </div>
          )}
          <button type="submit" disabled={loading}
            style={{ marginTop: 24, width: '100%', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, padding: '12px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
            {loading ? 'Saving...' : 'Log Shift'}
          </button>
        </form>
      </div>

      <div style={{ background: 'white', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Bulk CSV Import</h3>
        <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>
          CSV headers: platform, shift_date (YYYY-MM-DD), hours_worked, gross_earned, platform_deductions, net_received, city, category
        </p>
        <input type="file" accept=".csv" onChange={e => setCsvFile(e.target.files[0])}
          style={{ marginBottom: 12, fontSize: 13 }} />
        <button type="button" onClick={handleCsvImport} disabled={!csvFile || loading}
          style={{ background: '#059669', color: 'white', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 14, cursor: 'pointer' }}>
          Import CSV
        </button>
      </div>
    </div>
  );
}