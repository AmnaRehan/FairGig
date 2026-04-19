import { useNavigate } from 'react-router-dom';

const STATS = [
  { value: '12,400+', label: 'Workers Protected' },
  { value: 'PKR 2.8M', label: 'Earnings Verified' },
  { value: '94%', label: 'Grievances Resolved' },
  { value: '6 Cities', label: 'Across Pakistan' },
];

const FEATURES = [
  {
    icon: '💼', title: 'Earnings Tracker', color: '#DBEAFE', iconColor: '#1d4ed8',
    desc: 'Log every shift in seconds. See exactly what platforms are deducting — in real time. Build a verified income history banks trust.',
  },
  {
    icon: '📄', title: 'Income Certificate', color: '#DCFCE7', iconColor: '#15803d',
    desc: 'Get a professional printed certificate for housing, microfinance, and loan applications. Looks official — because it is.',
  },
  {
    icon: '📢', title: 'Grievance Board', color: '#FEF3C7', iconColor: '#b45309',
    desc: 'Wrongful deduction? Unfair ban? File a complaint in plain Urdu or English. Our advocates fight your case publicly.',
  },
  {
    icon: '✅', title: 'Shift Verification', color: '#FCE7F3', iconColor: '#be185d',
    desc: 'Upload a screenshot — our verifiers confirm your work. Proof that stands in disputes, court, or with landlords.',
  },
];

const STEPS = [
  { icon: '👤', title: 'Create Account',  desc: 'Sign up free with your phone number. Takes 2 minutes. No documents needed.' },
  { icon: '📝', title: 'Log Your Shifts', desc: 'Record earnings after each shift. Just three numbers. Takes 30 seconds.' },
  { icon: '🖼', title: 'Upload Proof',    desc: 'Share a screenshot from the platform. Our team verifies it for you.' },
  { icon: '🏆', title: 'Get Protected',   desc: 'Download certificates. File complaints. Know your rights. Fight back.' },
];

const TESTIMONIALS = [
  { initials: 'RM', bg: '#DBEAFE', color: '#1d4ed8', name: 'Rashid Mehmood', role: 'Careem Driver · Lahore',       quote: 'FairGig helped me prove my income to get a loan. I never thought a platform would actually care about us drivers.' },
  { initials: 'FZ', bg: '#FCE7F3', color: '#be185d', name: 'Fatima Zahra',   role: 'Foodpanda Rider · Karachi',    quote: 'When Foodpanda wrongly deducted my earnings, FairGig advocates helped me file a complaint and get it resolved in 3 days.' },
  { initials: 'SB', bg: '#FEF3C7', color: '#b45309', name: 'Sajida Bibi',    role: 'InDrive Worker · Peshawar',    quote: 'I am 54 years old and not great with technology but FairGig is very easy. My son helped me sign up and now I use it myself.' },
  { initials: 'UT', bg: '#DCFCE7', color: '#15803d', name: 'Usman Tariq',    role: 'Bykea Courier · Islamabad',    quote: 'The income certificate got me approved for a house rental. My landlord was impressed by how professional it looked.' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={s.root}>
      <style>{CSS}</style>


      {/* ── HERO ── */}
      <section style={s.hero}>
        <div style={s.badge}>
          <div style={s.badgeDot} />
          Pakistan's #1 Gig Worker Platform
        </div>

        <h1 style={s.heroH1}>
          Your Work.<br />
          Your <span style={{ color: '#2563EB' }}>Rights.</span><br />
          Protected — Simply.
        </h1>

        <p style={s.heroSub}>
          Track your earnings, prove your income, and fight unfair deductions.
          Made for drivers and delivery workers across Pakistan.{' '}
          <strong>Free forever.</strong>
        </p>

        <div style={s.heroBtns}>
          <button className="fg-btn-primary" style={s.btnPrimary} onClick={() => navigate('/login')}>
            ✅ Get Started — It's Free
          </button>
          <button className="fg-btn-secondary" style={s.btnSecondary} onClick={() => navigate('/login')}>
            ▶ See How It Works
          </button>
        </div>

        <div style={s.trustBar}>
          {[
            { icon: '👥', text: '12,400+ Workers Joined' },
            { icon: '🏙', text: '6 Cities Across Pakistan' },
            { icon: '📱', text: 'Works on Any Phone' },
            { icon: '🔒', text: 'Safe & Secure' },
          ].map(t => (
            <div key={t.text} style={s.trustItem}>
              <span style={{ fontSize: 18 }}>{t.icon}</span>
              {t.text}
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div style={s.statsBar}>
        {STATS.map(st => (
          <div key={st.label} style={s.stat}>
            <div style={s.statValue}>{st.value}</div>
            <div style={s.statLabel}>{st.label}</div>
          </div>
        ))}
      </div>

      {/* ── FEATURES ── */}
      <section style={{ ...s.section, background: '#F0F6FF' }}>
        <div style={s.sectionHeader}>
          <div style={{ ...s.tag, background: '#DBEAFE', color: '#1d4ed8' }}>What We Offer</div>
          <h2 style={s.sectionTitle}>Everything you need<br />to protect yourself</h2>
          <p style={s.sectionSub}>Designed for drivers and riders aged 40–65+. Big text, clear steps, easy to use.</p>
        </div>
        <div style={s.grid2}>
          {FEATURES.map(f => (
            <div key={f.title} className="fg-feat-card" style={s.featCard}>
              <div style={{ ...s.featIcon, background: f.color }}>
                <span style={{ fontSize: 26 }}>{f.icon}</span>
              </div>
              <h3 style={s.featTitle}>{f.title}</h3>
              <p style={s.featDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div style={s.divider} />

      {/* ── DASHBOARD PREVIEW ── */}
      <section style={{ ...s.section, background: '#fff' }}>
        <div style={s.splitGrid}>
          {/* Left — Earnings */}
          <div>
            <div style={{ ...s.tag, background: '#DCFCE7', color: '#15803d', marginBottom: 12 }}>Live Dashboard Preview</div>
            <h2 style={{ ...s.sectionTitle, marginBottom: 10 }}>See every rupee,<br />every shift</h2>
            <p style={{ ...s.sectionSub, marginBottom: 24 }}>
              No more guessing. FairGig shows you what you earned, what was taken, and what's left — in a clear, large display.
            </p>
            <div style={s.earningsCard}>
              <div style={s.earningsHeader}>
                <span style={s.earningsTitle}>This Week's Earnings</span>
                <span style={s.earningsPeriod}>Apr 14–18, 2026</span>
              </div>
              <div style={{ padding: '20px 22px' }}>
                <div style={s.earningsTotal}>
                  <span style={s.earningsTotalVal}>PKR 8,240</span>
                  <span style={s.earningsTotalLabel}>Net Earned</span>
                </div>
                {[
                  { dot: '#10B981', label: 'Gross Fare Collected',        val: '+PKR 11,200', color: '#15803d' },
                  { dot: '#EF4444', label: 'Platform Commission (26%)',   val: '−PKR 2,912',  color: '#dc2626' },
                  { dot: '#F59E0B', label: 'App Fee Deduction',           val: '−PKR 48',     color: '#d97706' },
                ].map(r => (
                  <div key={r.label} style={s.epRow}>
                    <span style={s.epRowLabel}>
                      <span style={{ ...s.epDot, background: r.dot }} />
                      {r.label}
                    </span>
                    <span style={{ ...s.epRowVal, color: r.color }}>{r.val}</span>
                  </div>
                ))}
                <div style={{ ...s.epRow, marginTop: 8, paddingTop: 12, borderTop: '2px solid #f1f5f9' }}>
                  <span style={{ ...s.epRowLabel, fontWeight: 700, color: '#0f172a' }}>Shifts Verified</span>
                  <span style={{ fontWeight: 700, color: '#2563EB' }}>14 of 14 ✅</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Grievances + Certificate */}
          <div>
            <div style={{ ...s.tag, background: '#FEF3C7', color: '#b45309', marginBottom: 12 }}>Grievances & Certificates</div>
            <h2 style={{ ...s.sectionTitle, marginBottom: 10 }}>Fight back.<br />Get what's yours.</h2>
            <p style={{ ...s.sectionSub, marginBottom: 24 }}>
              File a complaint in 3 taps, or download an income certificate instantly.
            </p>

            {/* Resolved alert */}
            <div style={{ ...s.alert, background: '#F0FDF4', border: '2px solid #86efac', marginBottom: 12 }}>
              <span style={s.alertIcon}>✅</span>
              <div style={{ flex: 1 }}>
                <p style={{ ...s.alertTitle, color: '#15803d' }}>Grievance Resolved!</p>
                <p style={s.alertDesc}>Your deduction dispute (PKR 480) was resolved by Careem support in 2 days.</p>
              </div>
              <span style={{ ...s.chip, background: '#DCFCE7', color: '#15803d' }}>Resolved</span>
            </div>

            {/* Pending alert */}
            <div style={{ ...s.alert, background: '#FFFBEB', border: '2px solid #fcd34d', marginBottom: 14 }}>
              <span style={s.alertIcon}>⏳</span>
              <div style={{ flex: 1 }}>
                <p style={{ ...s.alertTitle, color: '#b45309' }}>Under Review</p>
                <p style={s.alertDesc}>Unfair deactivation complaint filed Apr 15. Advocate assigned.</p>
              </div>
              <span style={{ ...s.chip, background: '#FEF3C7', color: '#b45309' }}>Pending</span>
            </div>

            {/* Certificate */}
            <div style={s.cert}>
              <div style={s.certBadge}>📄</div>
              <p style={s.certTitle}>FairGig Income Certificate</p>
              <p style={s.certSub}>Issued to: Rashid Mehmood · Careem Driver</p>
              <p style={s.certAmount}>PKR 32,400 / mo</p>
              <p style={s.certPeriod}>Average verified monthly income — Jan to Mar 2026</p>
              <span style={s.certVerified}>🛡 Verified by FairGig</span>
            </div>
          </div>
        </div>
      </section>

      <div style={s.divider} />

      {/* ── HOW IT WORKS ── */}
      <section style={{ ...s.section, background: '#F0F6FF', textAlign: 'center' }}>
        <div style={{ ...s.sectionHeader, textAlign: 'center' }}>
          <div style={{ ...s.tag, background: '#FEF3C7', color: '#b45309', marginBottom: 12 }}>Simple Process</div>
          <h2 style={s.sectionTitle}>Up and running in minutes</h2>
          <p style={{ ...s.sectionSub, margin: '0 auto' }}>Four easy steps. No tech experience needed.</p>
        </div>
        <div style={s.stepsGrid}>
          {STEPS.map((step, i) => (
            <div key={step.title} className="fg-step-card" style={s.stepCard}>
              <div style={s.stepNum}>{i + 1}</div>
              <span style={{ fontSize: 34, display: 'block', marginBottom: 12 }}>{step.icon}</span>
              <h4 style={s.stepTitle}>{step.title}</h4>
              <p style={s.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div style={s.divider} />

      {/* ── TESTIMONIALS ── */}
      <section style={{ ...s.section, background: '#fff', textAlign: 'center' }}>
        <div style={{ ...s.sectionHeader, textAlign: 'center' }}>
          <div style={{ ...s.tag, background: '#DCFCE7', color: '#15803d', marginBottom: 12 }}>Real Workers, Real Stories</div>
          <h2 style={s.sectionTitle}>Voices from the road</h2>
          <p style={{ ...s.sectionSub, margin: '0 auto' }}>Thousands of gig workers across Pakistan have taken back control.</p>
        </div>
        <div style={s.grid2}>
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="fg-test-card" style={s.testCard}>
              <p style={s.testQuote}>{t.quote}</p>
              <div style={s.testAuthor}>
                <div style={{ ...s.avatar, background: t.bg, color: t.color }}>{t.initials}</div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{t.role}</div>
                  <div style={{ color: '#F59E0B', fontSize: 13, marginTop: 2 }}>★★★★★</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={s.ctaSection}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🛵</div>
        <h2 style={s.ctaH2}>Ready to protect your income?</h2>
        <p style={s.ctaP}>
          Join 12,400+ gig workers who've already taken control of their earnings. Free forever for workers.
        </p>
        <button className="fg-btn-white" style={s.btnWhite} onClick={() => navigate('/login')}>
          Get Started — It's Free →
        </button>
        <p style={s.ctaNote}>No credit card required · Works on any phone · Urdu support coming soon</p>
      </section>

      {/* ── FOOTER ── */}
      <footer style={s.footer}>
        <div style={s.logo}>
          <div style={{ ...s.logoMark, width: 34, height: 34, fontSize: 16 }}>F</div>
          <span style={{ ...s.logoText, fontSize: 18, color: '#e2e8f0' }}>Fair<span style={{ color: '#60a5fa' }}>Gig</span></span>
        </div>
        <span style={{ fontSize: 12, color: '#475569' }}>© 2026 FairGig · FAST-NU SOFTEC · Built for Pakistan's gig workers</span>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Privacy', 'Terms', 'Contact'].map(l => (
            <a key={l} href="#" style={{ fontSize: 12, color: '#475569', textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}

/* ─────────────────────────────────────────
   STYLES
───────────────────────────────────────── */
const s = {
  root: {
    fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif",
    fontSize: 17,
    color: '#1e293b',
    background: '#F0F6FF',
    lineHeight: 1.6,
    overflowX: 'hidden',
  },

  /* Nav */
  nav: {
    background: '#fff',
    borderBottom: '2px solid #e2e8f0',
    padding: '0 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 68,
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo:     { display: 'flex', alignItems: 'center', gap: 10 },
  logoMark: { width: 42, height: 42, borderRadius: 12, background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 20, fontFamily: "'Nunito', sans-serif" },
  logoText: { fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 22, color: '#1e293b', letterSpacing: '-0.5px' },
  navLinks: { display: 'flex', gap: 4 },
  navLink:  { padding: '8px 14px', borderRadius: 10, fontSize: 15, fontWeight: 600, color: '#475569', cursor: 'pointer', border: 'none', background: 'none', transition: 'all 0.15s' },
  navCta:   { padding: '10px 22px', borderRadius: 12, fontSize: 16, fontWeight: 700, background: '#2563EB', color: '#fff', border: 'none', cursor: 'pointer', transition: 'all 0.15s' },

  /* Hero */
  hero: {
    background: 'linear-gradient(160deg, #EFF6FF 0%, #F0FDF4 60%, #FFFBEB 100%)',
    padding: '56px 32px 52px',
    textAlign: 'center',
    borderBottom: '2px solid #e2e8f0',
  },
  badge:    { display: 'inline-flex', alignItems: 'center', gap: 8, background: '#DBEAFE', color: '#1d4ed8', fontSize: 13, fontWeight: 700, padding: '6px 16px', borderRadius: 100, marginBottom: 24, border: '1.5px solid #93c5fd', letterSpacing: '0.03em' },
  badgeDot: { width: 8, height: 8, borderRadius: '50%', background: '#2563EB' },
  heroH1:   { fontFamily: "'Nunito', sans-serif", fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, lineHeight: 1.1, color: '#0f172a', margin: '0 0 18px', letterSpacing: '-1px' },
  heroSub:  { fontSize: 'clamp(16px, 2vw, 19px)', color: '#475569', maxWidth: 520, margin: '0 auto 36px', lineHeight: 1.7 },
  heroBtns: { display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 },
  trustBar: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28, flexWrap: 'wrap' },
  trustItem:{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 14, fontWeight: 600, color: '#475569' },

  btnPrimary: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '16px 32px', borderRadius: 16,
    background: '#2563EB', color: '#fff',
    fontSize: 18, fontWeight: 800, border: 'none', cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(37,99,235,0.35)', transition: 'all 0.15s',
    fontFamily: "'Nunito', sans-serif",
  },
  btnSecondary: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '16px 28px', borderRadius: 16,
    background: '#fff', color: '#2563EB',
    fontSize: 17, fontWeight: 700, border: '2px solid #2563EB', cursor: 'pointer',
    transition: 'all 0.15s', fontFamily: "'Nunito', sans-serif",
  },

  /* Stats bar */
  statsBar: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', background: '#2563EB' },
  stat:      { padding: '28px 20px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.15)' },
  statValue: { fontFamily: "'Nunito', sans-serif", fontSize: 30, fontWeight: 900, color: '#fff', lineHeight: 1, marginBottom: 5, letterSpacing: '-1px' },
  statLabel: { fontSize: 13, color: 'rgba(255,255,255,0.78)', fontWeight: 600 },

  /* Section */
  section:       { padding: '56px 32px' },
  sectionHeader: { marginBottom: 36 },
  tag:           { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '5px 14px', borderRadius: 100, marginBottom: 14 },
  sectionTitle:  { fontFamily: "'Nunito', sans-serif", fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 900, color: '#0f172a', margin: '0 0 10px', letterSpacing: '-0.8px', lineHeight: 1.15 },
  sectionSub:    { fontSize: 16, color: '#64748b', maxWidth: 480, lineHeight: 1.65, margin: 0 },
  divider:       { height: 2, background: '#e2e8f0', margin: '0 32px' },

  /* Features */
  grid2:    { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 },
  featCard: { background: '#fff', borderRadius: 20, padding: '26px 24px', border: '2px solid #e2e8f0', transition: 'all 0.2s', cursor: 'default' },
  featIcon: { width: 54, height: 54, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  featTitle:{ fontFamily: "'Nunito', sans-serif", fontSize: 19, fontWeight: 800, color: '#0f172a', margin: '0 0 8px' },
  featDesc: { fontSize: 15, color: '#64748b', lineHeight: 1.65, margin: 0 },

  /* Dashboard split */
  splitGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' },

  earningsCard:    { background: '#fff', borderRadius: 20, border: '2px solid #e2e8f0', overflow: 'hidden' },
  earningsHeader:  { background: '#0f172a', padding: '16px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  earningsTitle:   { fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: '#fff', fontSize: 16 },
  earningsPeriod:  { fontSize: 12, color: '#94a3b8', fontWeight: 600 },
  earningsTotal:   { display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 18, paddingBottom: 18, borderBottom: '1.5px solid #f1f5f9' },
  earningsTotalVal:{ fontFamily: "'Nunito', sans-serif", fontSize: 34, fontWeight: 900, color: '#0f172a', lineHeight: 1, letterSpacing: '-1px' },
  earningsTotalLabel: { fontSize: 13, color: '#64748b', fontWeight: 600, paddingBottom: 4 },
  epRow:     { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f8fafc', fontSize: 14 },
  epRowLabel:{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 8 },
  epRowVal:  { fontWeight: 700 },
  epDot:     { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },

  alert:     { display: 'flex', gap: 14, alignItems: 'flex-start', padding: '18px 20px', borderRadius: 16 },
  alertIcon: { fontSize: 22, flexShrink: 0, marginTop: 1 },
  alertTitle:{ fontWeight: 700, fontSize: 15, margin: '0 0 3px' },
  alertDesc: { fontSize: 13, color: '#64748b', margin: 0, lineHeight: 1.5 },
  chip:      { display: 'inline-flex', alignItems: 'center', padding: '5px 12px', borderRadius: 100, fontSize: 12, fontWeight: 700, flexShrink: 0 },

  cert:        { background: 'linear-gradient(135deg, #EFF6FF, #F0FDF4)', borderRadius: 20, border: '2px solid #93c5fd', padding: 24, textAlign: 'center' },
  certBadge:   { width: 56, height: 56, borderRadius: '50%', background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: 26 },
  certTitle:   { fontFamily: "'Nunito', sans-serif", fontSize: 18, fontWeight: 900, color: '#0f172a', margin: '0 0 6px' },
  certSub:     { fontSize: 13, color: '#64748b', margin: '0 0 14px' },
  certAmount:  { fontFamily: "'Nunito', sans-serif", fontSize: 32, fontWeight: 900, color: '#2563EB', margin: '0 0 4px', letterSpacing: '-1px' },
  certPeriod:  { fontSize: 12, color: '#64748b', margin: '0 0 16px' },
  certVerified:{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#DCFCE7', color: '#15803d', border: '1.5px solid #86efac', borderRadius: 100, padding: '5px 14px', fontSize: 13, fontWeight: 700 },

  /* Steps */
  stepsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 },
  stepCard:  { background: '#fff', borderRadius: 20, padding: '24px 18px', border: '2px solid #e2e8f0', textAlign: 'center', transition: 'all 0.2s' },
  stepNum:   { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: '50%', background: '#2563EB', color: '#fff', fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 17, margin: '0 auto 14px' },
  stepTitle: { fontFamily: "'Nunito', sans-serif", fontSize: 16, fontWeight: 800, color: '#0f172a', margin: '0 0 8px' },
  stepDesc:  { fontSize: 13, color: '#64748b', lineHeight: 1.6, margin: 0 },

  /* Testimonials */
  testCard:  { background: '#fff', borderRadius: 20, padding: 24, border: '2px solid #e2e8f0', transition: 'all 0.2s', textAlign: 'left' },
  testQuote: { fontSize: 15, color: '#334155', lineHeight: 1.7, margin: '0 0 18px', fontStyle: 'italic' },
  testAuthor:{ display: 'flex', alignItems: 'center', gap: 12 },
  avatar:    { width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, flexShrink: 0, fontFamily: "'Nunito', sans-serif" },

  /* CTA */
  ctaSection:{ background: '#2563EB', padding: '64px 32px', textAlign: 'center' },
  ctaH2:     { fontFamily: "'Nunito', sans-serif", fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 900, color: '#fff', margin: '0 0 14px', letterSpacing: '-0.8px' },
  ctaP:      { fontSize: 17, color: 'rgba(255,255,255,0.82)', maxWidth: 420, margin: '0 auto 32px', lineHeight: 1.65 },
  btnWhite:  { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '18px 36px', borderRadius: 16, background: '#fff', color: '#2563EB', fontSize: 18, fontWeight: 800, border: 'none', cursor: 'pointer', transition: 'all 0.15s', fontFamily: "'Nunito', sans-serif" },
  ctaNote:   { marginTop: 16, fontSize: 13, color: 'rgba(255,255,255,0.6)' },

  /* Footer */
  footer: { background: '#0f172a', padding: '32px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 },
};

/* ─────────────────────────────────────────
   HOVER / INTERACTIVE CSS
───────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Source+Sans+3:wght@400;600;700&display=swap');

  .fg-nav-link:hover  { background: #EFF6FF !important; color: #2563EB !important; }
  .fg-cta-nav:hover   { background: #1d4ed8 !important; transform: translateY(-1px); }
  .fg-btn-primary:hover  { background: #1d4ed8 !important; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(37,99,235,0.45) !important; }
  .fg-btn-secondary:hover{ background: #EFF6FF !important; transform: translateY(-2px); }
  .fg-btn-white:hover    { background: #EFF6FF !important; transform: translateY(-2px); }
  .fg-feat-card:hover    { border-color: #93c5fd !important; transform: translateY(-3px) !important; box-shadow: 0 12px 32px rgba(37,99,235,0.12) !important; }
  .fg-step-card:hover    { border-color: #93c5fd !important; transform: translateY(-3px) !important; }
  .fg-test-card:hover    { border-color: #93c5fd !important; transform: translateY(-2px) !important; }

  @media (max-width: 768px) {
    .fg-feat-card, .fg-test-card { width: 100%; }
  }
`;
