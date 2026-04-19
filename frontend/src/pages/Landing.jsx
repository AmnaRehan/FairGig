import { useNavigate } from 'react-router-dom';

const TESTIMONIALS = [
  { name: 'Rashid Mehmood', role: 'Careem Driver · Lahore', avatar: 'RM', color: '#6366f1', quote: 'FairGig helped me prove my income to get a loan. I never thought a platform would actually care about us drivers.' },
  { name: 'Fatima Zahra',   role: 'Foodpanda Rider · Karachi', avatar: 'FZ', color: '#ec4899', quote: 'When Foodpanda wrongly deducted my earnings, FairGig advocates helped me file a complaint and get it resolved in 3 days.' },
  { name: 'Usman Tariq',    role: 'Bykea Courier · Islamabad', avatar: 'UT', color: '#34d399', quote: 'The income certificate got me approved for a house rental. My landlord was impressed by how professional it looked.' },
  { name: 'Sajida Bibi',    role: 'InDrive Worker · Peshawar', avatar: 'SB', color: '#fbbf24', quote: 'I am 54 years old and not great with technology but FairGig is very easy. My son helped me sign up and now I use it myself.' },
  { name: 'Kamran Ali',     role: 'Uber Driver · Lahore', avatar: 'KA', color: '#60a5fa', quote: 'Finally a platform that tracks all my deductions. I realized platforms were taking 28% from me. Now I have proof.' },
  { name: 'Nadia Hussain',  role: 'Careem Captain · Karachi', avatar: 'NH', color: '#f472b6', quote: 'The grievance board connected me with other workers facing the same issues. We filed together and actually won.' },
];

const STATS = [
  { value: '12,400+', label: 'Workers Protected' },
  { value: 'PKR 2.8M', label: 'Earnings Verified' },
  { value: '94%',      label: 'Grievances Resolved' },
  { value: '6 Cities', label: 'Across Pakistan' },
];

const FEATURES = [
  { icon: '💼', title: 'Earnings Tracker', desc: 'Log every shift, see deductions in real-time, and build a verified income history that banks and landlords trust.', color: '#6366f1' },
  { icon: '📄', title: 'Income Certificate', desc: 'Generate a professional, printable certificate for housing applications, microfinance, and credit assessments.', color: '#ec4899' },
  { icon: '📢', title: 'Grievance Board', desc: 'Post complaints about unfair deductions or wrongful deactivations. Advocates fight your case publicly.', color: '#34d399' },
  { icon: '✅', title: 'Shift Verification', desc: 'Upload screenshots, get shifts verified by our network. Proof that stands up in disputes and applications.', color: '#fbbf24' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 20% 20%, #0f172a, #020617 60%, #000)',
      color: '#e2e8f0', fontFamily: "'Inter', 'Segoe UI', sans-serif",
      overflowX: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        @keyframes float    { 0%,100%{transform:translateY(0px) rotate(0deg)} 50%{transform:translateY(-24px) rotate(3deg)} }
        @keyframes float2   { 0%,100%{transform:translateY(0px) rotate(0deg)} 50%{transform:translateY(-16px) rotate(-2deg)} }
        @keyframes float3   { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-10px)} }
        @keyframes shimmer  { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes fadeup   { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin     { to{transform:rotate(360deg)} }
        @keyframes pulse-ring { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(1.6);opacity:0} }
        @keyframes scroll-x { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .cta-btn:hover  { transform:translateY(-3px) scale(1.02)!important; box-shadow:0 30px 70px rgba(99,102,241,0.55)!important; }
        .cta-btn:active { transform:translateY(-1px) scale(1.01)!important; }
        .feat-card:hover { transform:translateY(-6px)!important; border-color:rgba(99,102,241,0.35)!important; box-shadow:0 30px 60px rgba(0,0,0,0.6)!important; }
        .test-card:hover { transform:translateY(-4px)!important; border-color:rgba(148,163,184,0.2)!important; }
        .nav-link:hover  { color:#a5b4fc!important; }
        .sec-btn:hover   { background:rgba(99,102,241,0.15)!important; border-color:rgba(99,102,241,0.5)!important; color:#a5b4fc!important; }
      `}</style>

      {/* ── Ambient spheres ── */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0, overflow:'hidden' }}>
        {/* large indigo top-left */}
        <div style={{ position:'absolute', width:700, height:700, borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,0.22),transparent 65%)', top:-200, left:-200, animation:'float 8s ease-in-out infinite' }} />
        {/* pink bottom-right */}
        <div style={{ position:'absolute', width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle,rgba(236,72,153,0.18),transparent 65%)', bottom:-150, right:-150, animation:'float2 10s ease-in-out infinite' }} />
        {/* teal mid */}
        <div style={{ position:'absolute', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle,rgba(52,211,153,0.1),transparent 65%)', top:'40%', right:'15%', animation:'float3 7s ease-in-out infinite' }} />
        {/* amber small */}
        <div style={{ position:'absolute', width:250, height:250, borderRadius:'50%', background:'radial-gradient(circle,rgba(251,191,36,0.08),transparent 65%)', top:'20%', right:'35%', animation:'float2 9s ease-in-out infinite 2s' }} />
        {/* grid overlay */}
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(99,102,241,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.04) 1px,transparent 1px)', backgroundSize:'60px 60px', maskImage:'radial-gradient(ellipse 80% 80% at 50% 50%,black 40%,transparent 100%)' }} />
      </div>



      {/* ── Hero ── */}
      <section style={{ position:'relative', zIndex:2, textAlign:'center', padding:'120px 20px 100px', animation:'fadeup 0.7s ease' }}>
        {/* badge */}
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.25)', borderRadius:100, padding:'6px 16px', marginBottom:36 }}>
          <div style={{ width:6, height:6, borderRadius:'50%', background:'#6366f1', boxShadow:'0 0 8px #6366f1', animation:'float3 2s ease-in-out infinite' }} />
          <span style={{ fontSize:12, color:'#a5b4fc', fontWeight:600, letterSpacing:'0.06em' }}>Your rights matter</span>
        </div>

        {/* headline */}
        <h1 style={{ fontSize:'clamp(42px, 7vw, 80px)', fontWeight:900, lineHeight:1.05, letterSpacing:'-0.04em', margin:'0 auto 24px', maxWidth:900 }}>
          <span style={{ color:'#e2e8f0' }}>Your Work.</span><br />
          <span style={{ background:'linear-gradient(135deg,#6366f1 0%,#ec4899 50%,#fbbf24 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
            Your Rights.
          </span><br />
          <span style={{ color:'#e2e8f0' }}>Protected.</span>
        </h1>

        <p style={{ fontSize:'clamp(16px,2vw,20px)', color:'#64748b', maxWidth:580, margin:'0 auto 52px', lineHeight:1.8, fontWeight:400 }}>
          Pakistan's first gig worker protection platform. Track earnings, fight unfair deductions, and build verified income proof — all in one place.
        </p>

        {/* CTA group */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:16, flexWrap:'wrap' }}>
          {/* primary CTA with pulse ring */}
          <div style={{ position:'relative' }}>
            <div style={{ position:'absolute', inset:-4, borderRadius:20, background:'linear-gradient(135deg,#6366f1,#ec4899)', opacity:0.4, animation:'pulse-ring 2s ease-out infinite' }} />
            <button onClick={() => navigate('/login')} className="cta-btn"
              style={{ position:'relative', padding:'18px 44px', borderRadius:16, border:'none', background:'linear-gradient(135deg,#6366f1,#ec4899)', color:'white', fontSize:18, fontWeight:800, cursor:'pointer', transition:'all 0.25s', boxShadow:'0 20px 50px rgba(99,102,241,0.45)', letterSpacing:'-0.01em' }}>
              Get Started — It's Free →
            </button>
          </div>
          <button onClick={() => navigate('/login')} className="sec-btn"
            style={{ padding:'18px 36px', borderRadius:16, border:'1px solid rgba(148,163,184,0.15)', background:'rgba(15,23,42,0.6)', color:'#94a3b8', fontSize:16, fontWeight:600, cursor:'pointer', transition:'all 0.2s', backdropFilter:'blur(12px)' }}>
            View Demo
          </button>
        </div>

        {/* trust bar */}
        <div style={{ marginTop:52, display:'flex', alignItems:'center', justifyContent:'center', gap:8, flexWrap:'wrap' }}>
          <div style={{ display:'flex' }}>
            {['#6366f1','#ec4899','#34d399','#fbbf24','#60a5fa'].map((c,i) => (
              <div key={i} style={{ width:32, height:32, borderRadius:'50%', background:`linear-gradient(135deg,${c},${c}88)`, border:'2px solid #020617', marginLeft: i === 0 ? 0 : -8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'white' }}>
                {['R','F','U','S','K'][i]}
              </div>
            ))}
          </div>
          <span style={{ fontSize:13, color:'#475569', marginLeft:8 }}>Trusted by <span style={{ color:'#a5b4fc', fontWeight:600 }}>12,400+ workers</span> across Pakistan</span>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section style={{ position:'relative', zIndex:2, margin:'0 60px 80px', borderRadius:24, background:'rgba(15,23,42,0.7)', backdropFilter:'blur(24px)', border:'1px solid rgba(148,163,184,0.1)', padding:'40px 60px', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20, boxShadow:'0 30px 80px rgba(0,0,0,0.5)', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:0, left:'10%', right:'10%', height:1, background:'linear-gradient(90deg,transparent,rgba(99,102,241,0.8),rgba(236,72,153,0.8),transparent)', backgroundSize:'200% auto', animation:'shimmer 3s linear infinite' }} />
        {STATS.map(s => (
          <div key={s.label} style={{ textAlign:'center' }}>
            <div style={{ fontSize:'clamp(26px,3vw,36px)', fontWeight:900, letterSpacing:'-0.04em', background:'linear-gradient(135deg,#6366f1,#ec4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', marginBottom:6 }}>{s.value}</div>
            <div style={{ fontSize:13, color:'#475569', fontWeight:500, letterSpacing:'0.04em' }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* ── Features ── */}
      <section id="features" style={{ position:'relative', zIndex:2, padding:'0 60px 100px' }}>
        <div style={{ textAlign:'center', marginBottom:56 }}>
          <div style={{ fontSize:11, letterSpacing:'0.12em', color:'#6366f1', fontWeight:700, marginBottom:14, textTransform:'uppercase' }}>What We Offer</div>
          <h2 style={{ fontSize:'clamp(30px,4vw,48px)', fontWeight:800, letterSpacing:'-0.03em', color:'#e2e8f0', margin:0 }}>Everything a gig worker needs</h2>
          <p style={{ fontSize:16, color:'#475569', marginTop:14, maxWidth:500, margin:'14px auto 0' }}>Built for drivers, riders, and delivery workers who deserve more than just an app.</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:20 }}>
          {FEATURES.map(f => (
            <div key={f.title} className="feat-card" style={{ background:'rgba(15,23,42,0.8)', backdropFilter:'blur(16px)', border:'1px solid rgba(148,163,184,0.1)', borderRadius:20, padding:'28px 26px', transition:'all 0.25s', boxShadow:'0 8px 30px rgba(0,0,0,0.4)', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, right:0, width:120, height:120, borderRadius:'50%', background:`radial-gradient(circle,${f.color}18,transparent 70%)`, transform:'translate(30px,-30px)' }} />
              <div style={{ width:48, height:48, borderRadius:14, background:`${f.color}18`, border:`1px solid ${f.color}30`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, marginBottom:18 }}>{f.icon}</div>
              <h3 style={{ fontSize:17, fontWeight:700, color:'#e2e8f0', margin:'0 0 10px', letterSpacing:'-0.01em' }}>{f.title}</h3>
              <p style={{ fontSize:14, color:'#64748b', lineHeight:1.7, margin:0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" style={{ position:'relative', zIndex:2, padding:'0 60px 100px', textAlign:'center' }}>
        <div style={{ fontSize:11, letterSpacing:'0.12em', color:'#ec4899', fontWeight:700, marginBottom:14, textTransform:'uppercase' }}>Simple Process</div>
        <h2 style={{ fontSize:'clamp(30px,4vw,48px)', fontWeight:800, letterSpacing:'-0.03em', color:'#e2e8f0', margin:'0 0 60px' }}>Up and running in minutes</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:20, maxWidth:900, margin:'0 auto', position:'relative' }}>
          {/* connector line */}
          <div style={{ position:'absolute', top:36, left:'10%', right:'10%', height:1, background:'linear-gradient(90deg,#6366f155,#ec489955)', zIndex:0 }} />
          {[
            { step:'01', icon:'👤', title:'Create Account', desc:'Sign up free in under 2 minutes with your phone number.' },
            { step:'02', icon:'📝', title:'Log Your Shifts', desc:'Record earnings after every shift — takes 30 seconds.' },
            { step:'03', icon:'✅', title:'Get Verified', desc:'Upload a screenshot. Our verifiers confirm your earnings.' },
            { step:'04', icon:'🏆', title:'Get Protected', desc:'Use certificates, file grievances, and know your rights.' },
          ].map(s => (
            <div key={s.step} style={{ position:'relative', zIndex:1 }}>
              <div style={{ width:72, height:72, borderRadius:'50%', background:'rgba(15,23,42,0.9)', border:'1px solid rgba(99,102,241,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, margin:'0 auto 16px', boxShadow:'0 0 0 8px rgba(99,102,241,0.06)' }}>{s.icon}</div>
              <div style={{ fontSize:10, color:'#6366f1', fontWeight:700, letterSpacing:'0.1em', marginBottom:6 }}>STEP {s.step}</div>
              <h4 style={{ fontSize:16, fontWeight:700, color:'#e2e8f0', margin:'0 0 8px' }}>{s.title}</h4>
              <p style={{ fontSize:13, color:'#475569', lineHeight:1.7, margin:0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" style={{ position:'relative', zIndex:2, padding:'0 0 100px', overflow:'hidden' }}>
        <div style={{ textAlign:'center', marginBottom:56, padding:'0 60px' }}>
          <div style={{ fontSize:11, letterSpacing:'0.12em', color:'#34d399', fontWeight:700, marginBottom:14, textTransform:'uppercase' }}>Real Workers, Real Stories</div>
          <h2 style={{ fontSize:'clamp(30px,4vw,48px)', fontWeight:800, letterSpacing:'-0.03em', color:'#e2e8f0', margin:0 }}>Voices from the road</h2>
          <p style={{ fontSize:16, color:'#475569', marginTop:14 }}>Thousands of gig workers across Pakistan have taken back control.</p>
        </div>
        {/* scrolling rows */}
        {[TESTIMONIALS.slice(0,3), TESTIMONIALS.slice(3,6)].map((row, ri) => (
          <div key={ri} style={{ overflow:'hidden', marginBottom: ri === 0 ? 16 : 0 }}>
            <div style={{ display:'flex', gap:16, animation:`scroll-x ${ri === 0 ? 30 : 38}s linear infinite${ri === 1 ? ' reverse' : ''}`, width:'max-content' }}>
              {[...row,...row].map((t,i) => (
                <div key={i} className="test-card" style={{ width:340, flexShrink:0, background:'rgba(15,23,42,0.8)', backdropFilter:'blur(16px)', border:'1px solid rgba(148,163,184,0.1)', borderRadius:20, padding:'24px 24px 20px', transition:'all 0.25s', boxShadow:'0 8px 30px rgba(0,0,0,0.4)' }}>
                  <div style={{ fontSize:32, color:`${t.color}`, marginBottom:14, lineHeight:1 }}>"</div>
                  <p style={{ fontSize:14, color:'#94a3b8', lineHeight:1.75, margin:'0 0 20px' }}>{t.quote}</p>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:40, height:40, borderRadius:'50%', background:`linear-gradient(135deg,${t.color},${t.color}88)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'white', flexShrink:0 }}>{t.avatar}</div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:'#e2e8f0' }}>{t.name}</div>
                      <div style={{ fontSize:11, color:'#475569', marginTop:2 }}>{t.role}</div>
                    </div>
                    <div style={{ marginLeft:'auto', display:'flex', gap:2 }}>
                      {[...Array(5)].map((_,si) => <span key={si} style={{ color:'#fbbf24', fontSize:11 }}>★</span>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* ── Final CTA ── */}
      <section style={{ position:'relative', zIndex:2, padding:'0 60px 120px', textAlign:'center' }}>
        <div style={{ maxWidth:700, margin:'0 auto', background:'rgba(15,23,42,0.8)', backdropFilter:'blur(24px)', border:'1px solid rgba(148,163,184,0.1)', borderRadius:28, padding:'64px 48px', position:'relative', overflow:'hidden', boxShadow:'0 40px 100px rgba(0,0,0,0.6)' }}>
          <div style={{ position:'absolute', top:0, left:'10%', right:'10%', height:1, background:'linear-gradient(90deg,transparent,rgba(99,102,241,0.8),rgba(236,72,153,0.8),transparent)', backgroundSize:'200% auto', animation:'shimmer 3s linear infinite' }} />
          <div style={{ position:'absolute', top:-80, left:-80, width:250, height:250, borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,0.2),transparent 65%)' }} />
          <div style={{ position:'absolute', bottom:-80, right:-80, width:250, height:250, borderRadius:'50%', background:'radial-gradient(circle,rgba(236,72,153,0.15),transparent 65%)' }} />
          <div style={{ position:'relative', zIndex:1 }}>
            <div style={{ fontSize:40, marginBottom:16 }}>🛵</div>
            <h2 style={{ fontSize:'clamp(26px,4vw,40px)', fontWeight:900, letterSpacing:'-0.03em', color:'#e2e8f0', margin:'0 0 16px' }}>Ready to protect your income?</h2>
            <p style={{ fontSize:16, color:'#475569', margin:'0 auto 40px', maxWidth:460, lineHeight:1.7 }}>Join 12,400+ gig workers who've already taken control of their earnings. Free forever for workers.</p>
            <div style={{ position:'relative', display:'inline-block' }}>
              <div style={{ position:'absolute', inset:-4, borderRadius:20, background:'linear-gradient(135deg,#6366f1,#ec4899)', opacity:0.4, animation:'pulse-ring 2s ease-out infinite' }} />
              <button onClick={() => navigate('/login')} className="cta-btn"
                style={{ position:'relative', padding:'20px 52px', borderRadius:16, border:'none', background:'linear-gradient(135deg,#6366f1,#ec4899)', color:'white', fontSize:18, fontWeight:800, cursor:'pointer', transition:'all 0.25s', boxShadow:'0 20px 50px rgba(99,102,241,0.45)', letterSpacing:'-0.01em' }}>
                Get Started — It's Free →
              </button>
            </div>
            <p style={{ fontSize:12, color:'#334155', marginTop:20 }}>No credit card required · Works on any phone · Urdu support coming soon</p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ position:'relative', zIndex:2, borderTop:'1px solid rgba(148,163,184,0.08)', padding:'32px 60px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:30, height:30, borderRadius:9, background:'linear-gradient(135deg,#6366f1,#ec4899)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:14, color:'white' }}>F</div>
          <span style={{ fontSize:15, fontWeight:700, color:'#e2e8f0' }}>FairGig</span>
        </div>
        <span style={{ fontSize:12, color:'#334155' }}>© 2026 FairGig · FAST-NU SOFTEC · Built for Pakistan's gig workers</span>
        <div style={{ display:'flex', gap:20 }}>
          {['Privacy','Terms','Contact'].map(l => (
            <a key={l} href="#" style={{ fontSize:12, color:'#475569', textDecoration:'none', transition:'color 0.2s' }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}