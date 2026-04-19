import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api/config';
import toast from 'react-hot-toast';

const ROLES = [
  { value: 'worker', label: 'Worker', icon: '🛵', desc: 'Track earnings' },
  { value: 'verifier', label: 'Verifier', icon: '✅', desc: 'Verify shifts' },
  { value: 'advocate', label: 'Advocate', icon: '⚖️', desc: 'Fight for rights' },
];

const PLATFORMS = ['Careem', 'Foodpanda', 'Uber', 'Bykea', 'Other'];

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', full_name: '', role: 'worker', city: '', platform: 'Careem' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const update = (key, value) => setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.post('/auth/register', form);
      toast.success('Account created 🎉');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: 20,
      background: 'radial-gradient(circle at 20% 20%, #0f172a, #020617 60%, #000)'
    }}>
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        .fg-input:focus { border-color: rgba(99,102,241,0.6) !important; background: rgba(99,102,241,0.06) !important; }
        .fg-submit:hover { transform: translateY(-2px); box-shadow: 0 20px 50px rgba(99,102,241,0.45) !important; }
        .fg-submit:active { transform: translateY(0); }
        .fg-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none !important; }
      `}</style>

      {/* ambient glows */}
      <div style={{ position: 'fixed', width: 500, height: 500, background: 'radial-gradient(circle, rgba(99,102,241,0.2), transparent 65%)', top: '-150px', left: '-150px', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', width: 500, height: 500, background: 'radial-gradient(circle, rgba(236,72,153,0.15), transparent 65%)', bottom: '-150px', right: '-150px', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', width: 300, height: 300, background: 'radial-gradient(circle, rgba(52,211,153,0.1), transparent 65%)', top: '40%', right: '10%', pointerEvents: 'none' }} />

      <div style={{
        width: '100%', maxWidth: 500,
        background: 'rgba(15,23,42,0.8)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(148,163,184,0.12)',
        borderRadius: 24, padding: 36,
        boxShadow: '0 40px 100px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)',
        position: 'relative', zIndex: 2,
      }}>

        {/* header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 58, height: 58, margin: '0 auto 14px',
            borderRadius: 18,
            background: 'linear-gradient(135deg, #6366f1, #ec4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 800, fontSize: 22,
            boxShadow: '0 12px 40px rgba(99,102,241,0.5)',
            animation: 'float 4s ease-in-out infinite',
          }}>F</div>
          <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 700, color: '#e2e8f0', letterSpacing: '-0.02em' }}>Create your account</h2>
          <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>Join thousands of gig workers on FairGig</p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* name + city row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <Field label="FULL NAME" value={form.full_name} onChange={v => update('full_name', v)} placeholder="Ali Hassan" />
            <Field label="CITY" value={form.city} onChange={v => update('city', v)} placeholder="Lahore" />
          </div>

          <Field label="EMAIL ADDRESS" type="email" value={form.email} onChange={v => update('email', v)} placeholder="ali@example.com" />
          <Field label="PASSWORD" type="password" value={form.password} onChange={v => update('password', v)} placeholder="Min. 8 characters" />

          {/* platform */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 11, letterSpacing: '0.08em', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 7 }}>PLATFORM</label>
            <select value={form.platform} onChange={e => update('platform', e.target.value)}
              className="fg-input"
              style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid rgba(148,163,184,0.15)', background: 'rgba(2,6,23,0.6)', color: '#e2e8f0', fontSize: 14, outline: 'none', transition: 'all 0.2s', cursor: 'pointer' }}>
              {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          {/* role cards */}
          <div style={{ marginBottom: 22 }}>
            <label style={{ fontSize: 11, letterSpacing: '0.08em', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 10 }}>I AM A</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
              {ROLES.map(r => (
                <button type="button" key={r.value} onClick={() => update('role', r.value)}
                  style={{
                    padding: '12px 8px', borderRadius: 14, cursor: 'pointer', textAlign: 'center',
                    border: form.role === r.value ? '1px solid rgba(99,102,241,0.6)' : '1px solid rgba(148,163,184,0.12)',
                    background: form.role === r.value ? 'rgba(99,102,241,0.15)' : 'rgba(2,6,23,0.5)',
                    transition: 'all 0.18s ease',
                    boxShadow: form.role === r.value ? '0 0 20px rgba(99,102,241,0.2)' : 'none',
                  }}>
                  <div style={{ fontSize: 20, marginBottom: 5 }}>{r.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: form.role === r.value ? '#a5b4fc' : '#94a3b8', marginBottom: 2 }}>{r.label}</div>
                  <div style={{ fontSize: 10, color: '#475569' }}>{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="fg-submit"
            style={{
              width: '100%', padding: '13px', borderRadius: 14, border: 'none',
              cursor: 'pointer', fontWeight: 700, fontSize: 15, color: 'white',
              background: 'linear-gradient(135deg, #6366f1, #ec4899)',
              boxShadow: '0 15px 35px rgba(99,102,241,0.35)',
              transition: 'all 0.2s ease', letterSpacing: '0.01em',
            }}>
            {loading ? 'Creating account...' : 'Create account →'}
          </button>
        </form>

        <p style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: '#64748b' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, type = 'text', value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 11, letterSpacing: '0.08em', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 7 }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="fg-input"
        style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid rgba(148,163,184,0.15)', background: 'rgba(2,6,23,0.6)', color: '#e2e8f0', fontSize: 14, outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' }}
      />
    </div>
  );
}