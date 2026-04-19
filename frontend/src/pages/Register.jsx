import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api/config';
import toast from 'react-hot-toast';

const ROLES = [
  { value: 'worker',   label: 'Worker',   icon: '🛵', desc: 'Track earnings',   bg: '#DCFCE7', color: '#15803d' },
  { value: 'verifier', label: 'Verifier', icon: '✅', desc: 'Verify shifts',    bg: '#DBEAFE', color: '#1d4ed8' },
  { value: 'advocate', label: 'Advocate', icon: '⚖️', desc: 'Fight for rights', bg: '#FEF3C7', color: '#b45309' },
];

const PLATFORMS = ['Careem', 'Foodpanda', 'Uber', 'Bykea', 'InDrive', 'Other'];

const STEPS = ['Personal Info', 'Your Platform', 'Your Role'];

export default function Register() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    email: '', password: '', full_name: '',
    role: 'worker', city: '', platform: 'Careem',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 2) { setStep(s => s + 1); return; }
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

  const progress = ((step + 1) / 3) * 100;

  return (
    <div style={s.root}>
      <style>{CSS}</style>

      {/* ── LEFT PANEL — form ── */}
      <div style={s.left}>
        <div style={s.formWrap}>

          {/* Logo */}
          <div style={s.topLogo}>
            <div style={s.logoMark}>F</div>
            <span style={s.logoText}>Fair<span style={{ color: '#10B981' }}>Gig</span></span>
          </div>

          <h1 style={s.formTitle}>Create your account</h1>
          <p style={s.formSub}>Join 12,400+ gig workers protecting their income</p>

          {/* Step indicator */}
          <div style={s.stepRow}>
            {STEPS.map((label, i) => (
              <div key={label} style={s.stepItem}>
                <div style={{
                  ...s.stepCircle,
                  background: i <= step ? '#10B981' : '#e2e8f0',
                  color: i <= step ? '#fff' : '#94a3b8',
                  border: i === step ? '3px solid #059669' : i < step ? '3px solid #10B981' : '3px solid #e2e8f0',
                }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span style={{ ...s.stepLabel, color: i <= step ? '#059669' : '#94a3b8' }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div style={s.progressTrack}>
            <div style={{ ...s.progressFill, width: `${progress}%` }} className="fg-progress" />
          </div>

          <form onSubmit={handleSubmit}>

            {/* ── STEP 0 — Personal Info ── */}
            {step === 0 && (
              <div className="fg-step-in">
                <div style={s.fieldRow}>
                  <Field label="Full Name" id="full_name" value={form.full_name} onChange={v => update('full_name', v)} placeholder="Ali Hassan" icon="👤" required />
                  <Field label="City" id="city" value={form.city} onChange={v => update('city', v)} placeholder="Lahore" icon="🏙" required />
                </div>
                <Field label="Email Address" id="email" type="email" value={form.email} onChange={v => update('email', v)} placeholder="ali@example.com" icon="✉️" required />
                <Field label="Password" id="password" type="password" value={form.password} onChange={v => update('password', v)} placeholder="Minimum 8 characters" icon="🔑" required />
              </div>
            )}

            {/* ── STEP 1 — Platform ── */}
            {step === 1 && (
              <div className="fg-step-in">
                <p style={s.stepHint}>Which platform do you mainly work on?</p>
                <div style={s.platformGrid}>
                  {PLATFORMS.map(p => (
                    <button
                      type="button" key={p}
                      onClick={() => update('platform', p)}
                      className="fg-platform-btn"
                      style={{
                        ...s.platformBtn,
                        border: form.platform === p ? '2.5px solid #10B981' : '2px solid #e2e8f0',
                        background: form.platform === p ? '#F0FDF4' : '#F8FAFC',
                        color: form.platform === p ? '#059669' : '#475569',
                        fontWeight: form.platform === p ? 800 : 600,
                      }}
                    >
                      {PLATFORM_ICONS[p]} {p}
                      {form.platform === p && <span style={s.checkMark}>✓</span>}
                    </button>
                  ))}
                </div>

                <div style={s.infoBox}>
                  <span style={{ fontSize: 20 }}>💡</span>
                  <p style={s.infoBoxText}>
                    You can add multiple platforms later. Pick the one you use most right now.
                  </p>
                </div>
              </div>
            )}

            {/* ── STEP 2 — Role ── */}
            {step === 2 && (
              <div className="fg-step-in">
                <p style={s.stepHint}>What best describes you?</p>
                <div style={s.roleGrid}>
                  {ROLES.map(r => (
                    <button
                      type="button" key={r.value}
                      onClick={() => update('role', r.value)}
                      className="fg-role-btn"
                      style={{
                        ...s.roleBtn,
                        border: form.role === r.value ? `2.5px solid ${r.color}` : '2px solid #e2e8f0',
                        background: form.role === r.value ? r.bg : '#F8FAFC',
                      }}
                    >
                      <span style={{ fontSize: 36, display: 'block', marginBottom: 10 }}>{r.icon}</span>
                      <span style={{ ...s.roleBtnLabel, color: form.role === r.value ? r.color : '#0f172a' }}>{r.label}</span>
                      <span style={s.roleBtnDesc}>{r.desc}</span>
                      {form.role === r.value && (
                        <span style={{ ...s.checkMark, position: 'absolute', top: 10, right: 12, color: r.color }}>✓</span>
                      )}
                    </button>
                  ))}
                </div>

                <div style={s.infoBox}>
                  <span style={{ fontSize: 20 }}>🔄</span>
                  <p style={s.infoBoxText}>
                    You can change your role later from your profile settings.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div style={s.btnRow}>
              {step > 0 && (
                <button type="button" onClick={() => setStep(s => s - 1)} className="fg-back-btn" style={s.backBtn}>
                  ← Back
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="fg-submit-btn"
                style={{ ...s.submitBtn, flex: step > 0 ? '1' : undefined, width: step === 0 ? '100%' : undefined }}
              >
                {loading
                  ? <><span className="fg-spinner" style={s.spinner} /> Creating account...</>
                  : step < 2 ? 'Continue →' : 'Create Account 🎉'
                }
              </button>
            </div>
          </form>

          <p style={s.loginLine}>
            Already have an account?{' '}
            <Link to="/login" style={s.loginLink}>Sign in</Link>
          </p>

          <p style={s.a11yNote}>
            Need help signing up? Call: <strong style={{ color: '#059669' }}>0800-FAIRGIG</strong>
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL — illustration ── */}
      <div style={s.right}>
        {/* Logo */}
        <div style={s.rightLogo}>
          <div style={s.rightLogoMark}>F</div>
          <span style={s.rightLogoText}>Fair<span style={{ color: '#fff' }}>Gig</span></span>
        </div>

        {/* Decorative circles */}
        <div style={s.circle1} />
        <div style={s.circle2} />
        <div style={s.circle3} />

        <div style={s.rightContent}>
          {/* Illustration */}
          <div style={s.illustrationBox}>
            <div style={s.bigEmoji} className="fg-bob">📋</div>
            <div style={s.emojiShadow} />

            {/* Floating cards */}
            <div className="fg-float-1" style={{ ...s.floatCard, top: 0, left: -28 }}>
              <span style={{ fontSize: 20 }}>🎉</span>
              <div>
                <div style={s.floatVal}>Account Ready!</div>
                <div style={s.floatLabel}>In 2 minutes</div>
              </div>
            </div>

            <div className="fg-float-2" style={{ ...s.floatCard, bottom: 30, right: -24 }}>
              <span style={{ fontSize: 20 }}>🛡</span>
              <div>
                <div style={s.floatVal}>Protected</div>
                <div style={s.floatLabel}>From day one</div>
              </div>
            </div>

            <div className="fg-float-3" style={{ ...s.floatCard, bottom: -8, left: 10 }}>
              <span style={{ fontSize: 20 }}>📄</span>
              <div>
                <div style={s.floatVal}>Free Certificate</div>
                <div style={s.floatLabel}>Instantly issued</div>
              </div>
            </div>
          </div>

          <h2 style={s.rightHeading}>
            Three steps.<br />
            <span style={{ color: '#d1fae5' }}>Total protection.</span>
          </h2>
          <p style={s.rightSub}>
            Sign up in under 2 minutes. No ID needed. No credit card. Works on any phone.
          </p>

          {/* Benefits checklist */}
          <div style={s.checklist}>
            {[
              'Track every rupee you earn',
              'Fight unfair deductions easily',
              'Get an official income certificate',
              'File grievances in one tap',
            ].map(item => (
              <div key={item} style={s.checkItem}>
                <span style={s.checkIcon}>✅</span>
                <span style={s.checkText}>{item}</span>
              </div>
            ))}
          </div>

          {/* Trust pills */}
          <div style={s.trustRow}>
            {['🔒 Secure', '🆓 Free Forever', '🇵🇰 Pakistan'].map(t => (
              <span key={t} style={s.trustPill}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Field component ── */
function Field({ label, id, type = 'text', value, onChange, placeholder, icon, required }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label htmlFor={id} style={s.label}>{label}</label>
      <div style={{ position: 'relative' }}>
        <span style={s.inputIcon}>{icon}</span>
        <input
          id={id} type={type} value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="fg-input"
          style={s.input}
          autoComplete={type === 'password' ? 'new-password' : type === 'email' ? 'email' : 'off'}
        />
      </div>
    </div>
  );
}

const PLATFORM_ICONS = {
  Careem: '🟢', Foodpanda: '🔴', Uber: '⚫', Bykea: '🔵', InDrive: '🟡', Other: '🔘',
};

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
  },

  /* Left */
  left: {
    flex: 1,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '36px 32px',
    background: '#fff',
    overflowY: 'auto',
  },
  formWrap: { width: '100%', maxWidth: 460 },

  topLogo: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 },
  logoMark: {
    width: 42, height: 42, borderRadius: 12, background: '#10B981',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontWeight: 900, fontSize: 20, fontFamily: "'Nunito', sans-serif",
    boxShadow: '0 4px 16px rgba(16,185,129,0.35)',
  },
  logoText: {
    fontFamily: "'Nunito', sans-serif", fontWeight: 900,
    fontSize: 22, color: '#0f172a', letterSpacing: '-0.5px',
  },

  formTitle: {
    fontFamily: "'Nunito', sans-serif", fontSize: 28,
    fontWeight: 900, color: '#0f172a', margin: '0 0 6px', letterSpacing: '-0.8px',
  },
  formSub: { fontSize: 15, color: '#64748b', margin: '0 0 28px' },

  /* Step indicator */
  stepRow: { display: 'flex', alignItems: 'center', gap: 0, marginBottom: 12 },
  stepItem: { display: 'flex', alignItems: 'center', gap: 8, flex: 1 },
  stepCircle: {
    width: 32, height: 32, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 13, fontWeight: 800, flexShrink: 0,
    fontFamily: "'Nunito', sans-serif", transition: 'all 0.3s',
  },
  stepLabel: { fontSize: 12, fontWeight: 700, transition: 'color 0.3s', whiteSpace: 'nowrap' },

  progressTrack: { height: 6, background: '#e2e8f0', borderRadius: 100, marginBottom: 28, overflow: 'hidden' },
  progressFill:  { height: '100%', background: 'linear-gradient(90deg, #10B981, #059669)', borderRadius: 100, transition: 'width 0.4s ease' },

  /* Fields */
  fieldRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
  label: { display: 'block', fontSize: 15, fontWeight: 700, color: '#374151', marginBottom: 8 },
  inputIcon: {
    position: 'absolute', left: 14, top: '50%',
    transform: 'translateY(-50%)', fontSize: 18, pointerEvents: 'none', zIndex: 1,
  },
  input: {
    width: '100%', padding: '14px 16px 14px 46px',
    borderRadius: 14, border: '2px solid #e2e8f0',
    background: '#F8FAFC', color: '#0f172a',
    fontSize: 16, outline: 'none', boxSizing: 'border-box',
    fontFamily: "'Source Sans 3', sans-serif", transition: 'all 0.2s',
  },

  stepHint: { fontSize: 16, color: '#475569', margin: '0 0 18px', fontWeight: 500 },

  /* Platform grid */
  platformGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 18 },
  platformBtn: {
    padding: '14px 10px', borderRadius: 14, cursor: 'pointer',
    fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 6, transition: 'all 0.15s', position: 'relative',
    fontFamily: "'Source Sans 3', sans-serif",
  },
  checkMark: { fontSize: 14, fontWeight: 800 },

  infoBox: {
    display: 'flex', alignItems: 'flex-start', gap: 12,
    background: '#F0FDF4', border: '1.5px solid #86efac',
    borderRadius: 14, padding: '14px 16px', marginBottom: 4,
  },
  infoBoxText: { fontSize: 14, color: '#15803d', margin: 0, lineHeight: 1.55 },

  /* Role grid */
  roleGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 18 },
  roleBtn: {
    padding: '18px 12px', borderRadius: 16, cursor: 'pointer',
    textAlign: 'center', transition: 'all 0.15s',
    position: 'relative', display: 'flex', flexDirection: 'column',
    alignItems: 'center',
  },
  roleBtnLabel: { fontSize: 15, fontWeight: 800, fontFamily: "'Nunito', sans-serif", marginBottom: 4 },
  roleBtnDesc:  { fontSize: 12, color: '#64748b', fontWeight: 600 },

  /* Buttons */
  btnRow:    { display: 'flex', gap: 12, marginTop: 8 },
  backBtn: {
    padding: '14px 20px', borderRadius: 14,
    border: '2px solid #e2e8f0', background: '#F8FAFC',
    color: '#475569', fontSize: 16, fontWeight: 700,
    cursor: 'pointer', transition: 'all 0.15s',
    fontFamily: "'Source Sans 3', sans-serif",
  },
  submitBtn: {
    padding: '16px', borderRadius: 16, border: 'none',
    background: 'linear-gradient(135deg, #10B981, #059669)',
    color: '#fff', fontSize: 17, fontWeight: 800,
    cursor: 'pointer', transition: 'all 0.2s',
    boxShadow: '0 6px 20px rgba(16,185,129,0.4)',
    fontFamily: "'Nunito', sans-serif",
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  spinner: {
    width: 18, height: 18, borderRadius: '50%',
    border: '2.5px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff', display: 'inline-block',
  },

  loginLine: { textAlign: 'center', fontSize: 15, color: '#64748b', margin: '20px 0 12px' },
  loginLink: { color: '#10B981', fontWeight: 700, textDecoration: 'none' },
  a11yNote: {
    textAlign: 'center', fontSize: 13, color: '#94a3b8',
    background: '#F8FAFC', borderRadius: 12, padding: '12px 16px',
    border: '1.5px solid #e2e8f0', margin: 0,
  },

  /* Right panel */
  right: {
    width: '46%',
    minHeight: '100vh',
    background: 'linear-gradient(145deg, #10B981 0%, #059669 45%, #047857 100%)',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    padding: '32px 36px 40px',
    overflow: 'hidden',
  },
  circle1: { position: 'absolute', width: 380, height: 380, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', top: -100, right: -120, pointerEvents: 'none' },
  circle2: { position: 'absolute', width: 260, height: 260, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', bottom: 80, left: -60, pointerEvents: 'none' },
  circle3: { position: 'absolute', width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', top: '45%', right: 20, pointerEvents: 'none' },

  rightLogo:     { display: 'flex', alignItems: 'center', gap: 10, position: 'relative', zIndex: 2 },
  rightLogoMark: { width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 18, fontFamily: "'Nunito', sans-serif", border: '1.5px solid rgba(255,255,255,0.3)' },
  rightLogoText: { fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 20, color: 'rgba(255,255,255,0.9)', letterSpacing: '-0.5px' },

  rightContent: {
    flex: 1, display: 'flex', flexDirection: 'column',
    justifyContent: 'center', alignItems: 'center',
    textAlign: 'center', position: 'relative', zIndex: 2, padding: '20px 0',
  },

  illustrationBox: { position: 'relative', width: 240, height: 200, marginBottom: 28 },
  bigEmoji:   { fontSize: 90, lineHeight: 1, filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.2))', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -55%)' },
  emojiShadow:{ width: 70, height: 10, borderRadius: '50%', background: 'rgba(0,0,0,0.15)', margin: '0 auto', position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)' },

  floatCard: {
    position: 'absolute', background: '#fff', borderRadius: 14,
    padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10,
    boxShadow: '0 8px 24px rgba(0,0,0,0.16)', border: '1.5px solid rgba(255,255,255,0.9)',
    minWidth: 140,
  },
  floatVal:   { fontFamily: "'Nunito', sans-serif", fontSize: 13, fontWeight: 800, color: '#0f172a', lineHeight: 1.2 },
  floatLabel: { fontSize: 11, color: '#64748b', fontWeight: 600 },

  rightHeading: {
    fontFamily: "'Nunito', sans-serif", fontSize: 'clamp(22px, 2.5vw, 30px)',
    fontWeight: 900, color: '#fff', margin: '0 0 12px', lineHeight: 1.2,
    letterSpacing: '-0.8px', textShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
  rightSub: { fontSize: 14, color: 'rgba(255,255,255,0.85)', maxWidth: 280, lineHeight: 1.65, margin: '0 auto 24px' },

  checklist: { display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24, alignItems: 'flex-start', width: '100%', maxWidth: 280 },
  checkItem: { display: 'flex', alignItems: 'center', gap: 10 },
  checkIcon: { fontSize: 16, flexShrink: 0 },
  checkText: { fontSize: 14, color: 'rgba(255,255,255,0.92)', fontWeight: 600, textAlign: 'left' },

  trustRow: { display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' },
  trustPill: {
    background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.3)', borderRadius: 100,
    padding: '6px 14px', fontSize: 12, fontWeight: 700, color: '#fff',
  },
};

/* ─────────────────────────────────────────
   CSS
───────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Source+Sans+3:wght@400;600;700&display=swap');

  @keyframes fg-float1 { 0%,100%{transform:translateY(0px) rotate(-1deg)} 50%{transform:translateY(-12px) rotate(1deg)} }
  @keyframes fg-float2 { 0%,100%{transform:translateY(0px) rotate(1deg)}  50%{transform:translateY(-16px) rotate(-1deg)} }
  @keyframes fg-float3 { 0%,100%{transform:translateY(0px)}               50%{transform:translateY(-9px)} }
  @keyframes fg-bob    { 0%,100%{transform:translate(-50%,-55%) scale(1)} 50%{transform:translate(-50%,-60%) scale(1.04)} }
  @keyframes fg-spin   { to { transform: rotate(360deg); } }
  @keyframes fg-step-in { from{opacity:0;transform:translateX(14px)} to{opacity:1;transform:translateX(0)} }

  .fg-float-1  { animation: fg-float1 4s ease-in-out infinite; }
  .fg-float-2  { animation: fg-float2 5.5s ease-in-out infinite 0.6s; }
  .fg-float-3  { animation: fg-float3 3.5s ease-in-out infinite 1.2s; }
  .fg-bob      { animation: fg-bob 4s ease-in-out infinite; }
  .fg-spinner  { animation: fg-spin 0.7s linear infinite; }
  .fg-step-in  { animation: fg-step-in 0.28s ease both; }
  .fg-progress { transition: width 0.4s cubic-bezier(0.4,0,0.2,1); }

  .fg-input:focus {
    border-color: #10B981 !important;
    box-shadow: 0 0 0 4px rgba(16,185,129,0.15) !important;
    background: #F0FDF4 !important;
  }
  .fg-input:hover { border-color: #cbd5e1 !important; }

  .fg-submit-btn:hover:not(:disabled) {
    transform: translateY(-2px) !important;
    box-shadow: 0 12px 32px rgba(16,185,129,0.5) !important;
  }
  .fg-submit-btn:active:not(:disabled) { transform: translateY(0) !important; }
  .fg-submit-btn:disabled { opacity: 0.65; cursor: not-allowed !important; }

  .fg-back-btn:hover { border-color: #10B981 !important; color: #10B981 !important; background: #F0FDF4 !important; }

  .fg-platform-btn:hover { border-color: #10B981 !important; background: #F0FDF4 !important; color: #059669 !important; transform: translateY(-2px); }
  .fg-role-btn:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.08); }

  @media (max-width: 768px) {
    .fg-right-panel { display: none !important; }
    .fg-field-row   { grid-template-columns: 1fr !important; }
  }
`;
