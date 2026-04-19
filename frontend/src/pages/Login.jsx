import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/auth';
import toast from 'react-hot-toast';

const DEMO = [
  { role: 'Worker',   icon: '🛵', email: 'worker@demo.com',   password: 'demo', color: '#1d4ed8', bg: '#DBEAFE' },
  { role: 'Verifier', icon: '✅', email: 'verifier@demo.com', password: 'demo', color: '#15803d', bg: '#DCFCE7' },
  { role: 'Advocate', icon: '⚖️', email: 'advocate@demo.com', password: 'demo', color: '#b45309', bg: '#FEF3C7' },
];

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const loggedInUser = await login(email, password);
      toast.success('Welcome back 👋');

      const role = String(loggedInUser?.role || '').toLowerCase();
      if (role === 'worker') {
        navigate('/worker');
      } else if (role === 'verifier') {
        navigate('/verify');
      } else if (role === 'advocate') {
        navigate('/advocate');
      } else {
        navigate('/');
      }
    } catch {
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (d) => { setEmail(d.email); setPassword(d.password); };

  return (
    <div style={s.root}>
      <style>{CSS}</style>

      {/* ── LEFT PANEL — illustration ── */}
      <div className="fg-left-panel" style={s.left}>
        {/* top-left logo */}
        <div style={s.leftLogo}>
          <div style={s.logoMark}>F</div>
          <span style={s.logoText}>Fair<span style={{ color: '#fff' }}>Gig</span></span>
        </div>

        {/* big decorative circles */}
        <div style={s.circle1} />
        <div style={s.circle2} />
        <div style={s.circle3} />

        {/* center content */}
        <div style={s.leftContent}>
          <div style={s.illustrationBox}>
            {/* Rider illustration — pure CSS/emoji */}
            <div style={s.riderWrap}>
              <div style={s.riderEmoji}>🛵</div>
              <div style={s.riderShadow} />
            </div>

            {/* floating stat cards */}
            <div className="fg-float-card fg-float-1" style={{ ...s.floatCard, top: 10, right: -20 }}>
              <span style={s.floatCardIcon}>💰</span>
              <div>
                <div style={s.floatCardVal}>PKR 8,240</div>
                <div style={s.floatCardLabel}>This week</div>
              </div>
            </div>

            <div className="fg-float-card fg-float-2" style={{ ...s.floatCard, bottom: 20, left: -24 }}>
              <span style={s.floatCardIcon}>✅</span>
              <div>
                <div style={s.floatCardVal}>14 Shifts</div>
                <div style={s.floatCardLabel}>Verified</div>
              </div>
            </div>

            <div className="fg-float-card fg-float-3" style={{ ...s.floatCard, bottom: -10, right: 10 }}>
              <span style={s.floatCardIcon}>🛡</span>
              <div>
                <div style={s.floatCardVal}>Protected</div>
                <div style={s.floatCardLabel}>Rights secured</div>
              </div>
            </div>
          </div>

          <h2 style={s.leftHeading}>
            Your income.<br />
            <span style={{ color: '#FEF3C7' }}>Verified & protected.</span>
          </h2>
          <p style={s.leftSub}>
            Trusted by 12,400+ gig workers across Pakistan.
            Track earnings, fight deductions, get certified.
          </p>

          {/* trust pills */}
          <div style={s.trustRow}>
            {['🔒 Secure', '📱 Any Phone', '🇵🇰 Pakistan'].map(t => (
              <span key={t} style={s.trustPill}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — form ── */}
      <div style={s.right}>
        <div style={s.formWrap}>

          {/* mobile logo (hidden on desktop) */}
          <div className="fg-mobile-logo" style={s.mobileLogo}>
            <div style={{ ...s.logoMark, background: '#2563EB', boxShadow: '0 4px 16px rgba(37,99,235,0.3)' }}>F</div>
            <span style={{ ...s.logoText, color: '#0f172a' }}>Fair<span style={{ color: '#2563EB' }}>Gig</span></span>
          </div>

          <h1 style={s.formTitle}>Welcome back 👋</h1>
          <p style={s.formSub}>Sign in to your FairGig dashboard</p>

          <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
            {/* Email */}
            <div style={s.fieldWrap}>
              <label style={s.label} htmlFor="fg-email">Email Address</label>
              <div style={s.inputWrap}>
                <span style={s.inputIcon}>✉️</span>
                <input
                  id="fg-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="fg-input"
                  style={s.input}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div style={s.fieldWrap}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={s.label} htmlFor="fg-password">Password</label>
                <a href="#" style={s.forgotLink}>Forgot password?</a>
              </div>
              <div style={s.inputWrap}>
                <span style={s.inputIcon}>🔑</span>
                <input
                  id="fg-password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="fg-input"
                  style={s.input}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="fg-submit-btn"
              style={s.submitBtn}
            >
              {loading
                ? <><span style={s.spinner} className="fg-spinner" /> Signing in...</>
                : <>Sign In  →</>
              }
            </button>
          </form>

          {/* Register link */}
          <p style={s.registerLine}>
            New to FairGig?{' '}
            <Link to="/register" style={s.registerLink}>Create a free account</Link>
          </p>

          {/* Accessibility note */}
          <p style={s.a11yNote}>
            Need help? Call our helpline: <strong style={{ color: '#0f172a' }}>0800-FAIRGIG</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   STYLES
───────────────────────────────────────── */
const s = {
  root: {
    minHeight: '100vh',
    display: 'flex',
    fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif",
    fontSize: 16,
    color: '#1e293b',
    background: '#fff',
  },

  /* Left panel */
  left: {
    width: '48%',
    minHeight: '100vh',
    background: 'linear-gradient(145deg, #F59E0B 0%, #D97706 40%, #B45309 100%)',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    padding: '32px 40px 40px',
    overflow: 'hidden',
  },
  circle1: {
    position: 'absolute', width: 400, height: 400, borderRadius: '50%',
    background: 'rgba(255,255,255,0.08)', top: -120, right: -120, pointerEvents: 'none',
  },
  circle2: {
    position: 'absolute', width: 280, height: 280, borderRadius: '50%',
    background: 'rgba(255,255,255,0.06)', bottom: 60, left: -80, pointerEvents: 'none',
  },
  circle3: {
    position: 'absolute', width: 160, height: 160, borderRadius: '50%',
    background: 'rgba(255,255,255,0.05)', bottom: 200, right: 40, pointerEvents: 'none',
  },

  leftLogo: {
    display: 'flex', alignItems: 'center', gap: 10,
    position: 'relative', zIndex: 2,
  },
  logoMark: {
    width: 42, height: 42, borderRadius: 12,
    background: 'rgba(255,255,255,0.22)',
    backdropFilter: 'blur(8px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontWeight: 900, fontSize: 20,
    fontFamily: "'Nunito', sans-serif",
    border: '1.5px solid rgba(255,255,255,0.3)',
  },
  logoText: {
    fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 22,
    color: 'rgba(255,255,255,0.9)', letterSpacing: '-0.5px',
  },

  leftContent: {
    flex: 1, display: 'flex', flexDirection: 'column',
    justifyContent: 'center', alignItems: 'center',
    textAlign: 'center', position: 'relative', zIndex: 2,
    padding: '20px 0',
  },

  illustrationBox: {
    position: 'relative', width: 260, height: 220, marginBottom: 32,
  },
  riderWrap: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    position: 'absolute', top: '50%', left: '50%',
    transform: 'translate(-50%, -60%)',
  },
  riderEmoji:  { fontSize: 96, lineHeight: 1, filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.25))' },
  riderShadow: { width: 80, height: 12, borderRadius: '50%', background: 'rgba(0,0,0,0.15)', marginTop: 4 },

  floatCard: {
    position: 'absolute',
    background: '#fff',
    borderRadius: 14,
    padding: '10px 14px',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
    border: '1.5px solid rgba(255,255,255,0.9)',
    minWidth: 130,
  },
  floatCardIcon:  { fontSize: 22, flexShrink: 0 },
  floatCardVal:   { fontFamily: "'Nunito', sans-serif", fontSize: 14, fontWeight: 800, color: '#0f172a', lineHeight: 1.2 },
  floatCardLabel: { fontSize: 11, color: '#64748b', fontWeight: 600 },

  leftHeading: {
    fontFamily: "'Nunito', sans-serif",
    fontSize: 'clamp(24px, 3vw, 34px)',
    fontWeight: 900, color: '#fff',
    margin: '0 0 12px', lineHeight: 1.2,
    letterSpacing: '-0.8px',
    textShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
  leftSub: {
    fontSize: 15, color: 'rgba(255,255,255,0.85)',
    maxWidth: 320, lineHeight: 1.65, margin: '0 auto 24px',
  },
  trustRow: { display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' },
  trustPill: {
    background: 'rgba(255,255,255,0.18)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: 100, padding: '6px 14px',
    fontSize: 13, fontWeight: 700, color: '#fff',
  },

  /* Right panel */
  right: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 32px',
    background: '#fff',
    overflowY: 'auto',
  },
  formWrap: { width: '100%', maxWidth: 420 },

  mobileLogo: {
    display: 'none',
    alignItems: 'center',
    gap: 10,
    marginBottom: 28,
    justifyContent: 'center',
  },

  formTitle: {
    fontFamily: "'Nunito', sans-serif",
    fontSize: 30, fontWeight: 900, color: '#0f172a',
    margin: '0 0 6px', letterSpacing: '-0.8px',
  },
  formSub: { fontSize: 16, color: '#64748b', margin: '0 0 32px' },

  fieldWrap: { marginBottom: 20 },
  label: {
    display: 'block', fontSize: 15, fontWeight: 700,
    color: '#374151', marginBottom: 8, letterSpacing: '-0.1px',
  },
  inputWrap: { position: 'relative' },
  inputIcon: {
    position: 'absolute', left: 14, top: '50%',
    transform: 'translateY(-50%)', fontSize: 18,
    pointerEvents: 'none', zIndex: 1,
  },
  input: {
    width: '100%', padding: '14px 16px 14px 46px',
    borderRadius: 14, border: '2px solid #e2e8f0',
    background: '#F8FAFC', color: '#0f172a',
    fontSize: 16, outline: 'none',
    fontFamily: "'Source Sans 3', sans-serif",
    boxSizing: 'border-box',
    transition: 'all 0.2s',
  },

  forgotLink: {
    fontSize: 14, color: '#F59E0B', fontWeight: 700,
    textDecoration: 'none',
  },

  submitBtn: {
    width: '100%', padding: '16px',
    borderRadius: 16, border: 'none',
    background: 'linear-gradient(135deg, #F59E0B, #D97706)',
    color: '#fff', fontSize: 18, fontWeight: 800,
    cursor: 'pointer', transition: 'all 0.2s',
    boxShadow: '0 6px 20px rgba(245,158,11,0.4)',
    fontFamily: "'Nunito', sans-serif",
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    letterSpacing: '-0.3px',
    marginTop: 8,
  },
  spinner: {
    width: 18, height: 18, borderRadius: '50%',
    border: '2.5px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    display: 'inline-block',
  },

  /* Demo section */
  demoSection: { marginBottom: 24 },
  dividerRow:  { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 },
  dividerLine: { flex: 1, height: 1.5, background: '#e2e8f0' },
  dividerText: { fontSize: 13, color: '#94a3b8', fontWeight: 600, whiteSpace: 'nowrap' },
  demoGrid:    { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 },
  demoBtn: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: 8, padding: '14px 10px', borderRadius: 14,
    border: '2px solid #e2e8f0', background: '#F8FAFC',
    cursor: 'pointer', transition: 'all 0.15s',
  },
  demoRole: {
    fontSize: 12, fontWeight: 700, padding: '3px 10px',
    borderRadius: 100,
  },

  registerLine: { textAlign: 'center', fontSize: 15, color: '#64748b', margin: '0 0 14px' },
  registerLink: { color: '#D97706', fontWeight: 700, textDecoration: 'none' },

  a11yNote: {
    textAlign: 'center', fontSize: 13, color: '#94a3b8',
    background: '#F8FAFC', borderRadius: 12,
    padding: '12px 16px', margin: 0,
    border: '1.5px solid #e2e8f0',
  },
};

/* ─────────────────────────────────────────
   CSS — hover + animation + responsive
───────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Source+Sans+3:wght@400;600;700&display=swap');

  @keyframes fg-float1 { 0%,100%{transform:translateY(0px) rotate(-1deg)} 50%{transform:translateY(-10px) rotate(1deg)} }
  @keyframes fg-float2 { 0%,100%{transform:translateY(0px) rotate(1deg)}  50%{transform:translateY(-14px) rotate(-1deg)} }
  @keyframes fg-float3 { 0%,100%{transform:translateY(0px)}               50%{transform:translateY(-8px)} }
  @keyframes fg-spin    { to { transform: rotate(360deg); } }

  .fg-float-1 { animation: fg-float1 4s ease-in-out infinite; }
  .fg-float-2 { animation: fg-float2 5s ease-in-out infinite 0.5s; }
  .fg-float-3 { animation: fg-float3 3.5s ease-in-out infinite 1s; }
  .fg-spinner  { animation: fg-spin 0.7s linear infinite; }

  .fg-input:focus {
    border-color: #F59E0B !important;
    box-shadow: 0 0 0 4px rgba(245,158,11,0.15) !important;
    background: #FFFBEB !important;
  }
  .fg-input:hover { border-color: #cbd5e1 !important; }

  .fg-submit-btn:hover:not(:disabled) {
    transform: translateY(-2px) !important;
    box-shadow: 0 12px 32px rgba(245,158,11,0.5) !important;
  }
  .fg-submit-btn:active:not(:disabled) { transform: translateY(0) !important; }
  .fg-submit-btn:disabled { opacity: 0.65; cursor: not-allowed !important; }

  .fg-demo-btn:hover {
    border-color: #F59E0B !important;
    background: #FFFBEB !important;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    .fg-left-panel { display: none !important; }
    .fg-mobile-logo { display: flex !important; }
  }
`;
