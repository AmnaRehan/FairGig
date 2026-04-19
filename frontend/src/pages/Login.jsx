import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/auth';
import toast from 'react-hot-toast';

const DEMO = [
  { role: 'Worker', icon: '🛵', email: 'worker@demo.com', color: '#34d399' },
  { role: 'Verifier', icon: '✅', email: 'verifier@demo.com', color: '#60a5fa' },
  { role: 'Advocate', icon: '⚖️', email: 'advocate@demo.com', color: '#f472b6' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back 👋');
      navigate('/');
    } catch {
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: 20,
      background: 'radial-gradient(circle at 30% 20%, #0f172a, #020617 60%, #000)',
    }}>
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        .fg-input { transition: all 0.2s ease !important; box-sizing: border-box !important; }
        .fg-input:focus { border-color: rgba(99,102,241,0.7) !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.15) !important; background: rgba(99,102,241,0.06) !important; }
        .fg-btn { transition: all 0.2s ease !important; }
        .fg-btn:hover:not(:disabled) { transform: translateY(-2px) !important; box-shadow: 0 20px 50px rgba(99,102,241,0.5) !important; }
        .fg-btn:active:not(:disabled) { transform: translateY(0) !important; }
        .fg-btn:disabled { opacity: 0.6; cursor: not-allowed !important; }
        .fg-demo:hover { background: rgba(99,102,241,0.1) !important; border-color: rgba(99,102,241,0.3) !important; cursor: pointer; }
      `}</style>

      {/* ambient glows */}
      <div style={{ position: 'fixed', width: 500, height: 500, background: 'radial-gradient(circle, rgba(99,102,241,0.22), transparent 65%)', top: '-150px', left: '-150px', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', width: 500, height: 500, background: 'radial-gradient(circle, rgba(236,72,153,0.16), transparent 65%)', bottom: '-150px', right: '-150px', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', width: 300, height: 300, background: 'radial-gradient(circle, rgba(52,211,153,0.08), transparent 65%)', top: '50%', right: '5%', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{
        width: '100%', maxWidth: 420, position: 'relative', zIndex: 2,
        background: 'rgba(15,23,42,0.8)',
        backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(148,163,184,0.12)',
        borderRadius: 24, padding: 36,
        boxShadow: '0 40px 100px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}>

        {/* top shimmer line */}
        <div style={{
          position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.8), rgba(236,72,153,0.8), transparent)',
          backgroundSize: '200% auto',
          animation: 'shimmer 3s linear infinite',
          borderRadius: 1,
        }} />

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

          <h2 style={{ margin: '0 0 6px', fontSize: 23, fontWeight: 700, color: '#e2e8f0', letterSpacing: '-0.02em' }}>
            Welcome back
          </h2>
          <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
            Sign in to your FairGig dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, letterSpacing: '0.08em', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 7 }}>EMAIL ADDRESS</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com" required className="fg-input"
              style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid rgba(148,163,184,0.15)', background: 'rgba(2,6,23,0.6)', color: '#e2e8f0', fontSize: 14, outline: 'none' }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
              <label style={{ fontSize: 11, letterSpacing: '0.08em', color: '#64748b', fontWeight: 600 }}>PASSWORD</label>
              <a href="#" style={{ fontSize: 11, color: '#818cf8', textDecoration: 'none', letterSpacing: '0.02em' }}>Forgot password?</a>
            </div>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required className="fg-input"
              style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid rgba(148,163,184,0.15)', background: 'rgba(2,6,23,0.6)', color: '#e2e8f0', fontSize: 14, outline: 'none' }}
            />
          </div>

          {/* spacer */}
          <div style={{ marginBottom: 20 }} />

          <button type="submit" disabled={loading} className="fg-btn"
            style={{
              width: '100%', padding: '13px', borderRadius: 14, border: 'none',
              cursor: 'pointer', fontWeight: 700, fontSize: 15, color: 'white',
              background: 'linear-gradient(135deg, #6366f1, #ec4899)',
              boxShadow: '0 15px 35px rgba(99,102,241,0.35)',
              letterSpacing: '0.01em',
            }}>
            {loading ? 'Signing in...' : 'Sign in →'}
          </button>
        </form>

        {/* divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '22px 0 16px' }}>
          <div style={{ flex: 1, height: '0.5px', background: 'rgba(148,163,184,0.12)' }} />
          <span style={{ fontSize: 11, color: '#475569', letterSpacing: '0.06em' }}>DEMO ACCOUNTS</span>
          <div style={{ flex: 1, height: '0.5px', background: 'rgba(148,163,184,0.12)' }} />
        </div>

        <p style={{ marginTop: 22, textAlign: 'center', fontSize: 13, color: '#64748b' }}>
          New here?{' '}
          <Link to="/register" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>Create account</Link>
        </p>
      </div>
    </div>
  );
}