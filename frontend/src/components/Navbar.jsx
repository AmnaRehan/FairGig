import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/auth';

const ROLE_CONFIG = {
  worker:   { icon: '🛵', label: 'Worker',   color: '#065F46', bg: '#ECFDF5', border: '#6EE7B7', accent: '#10B981' },
  verifier: { icon: '🛡️', label: 'Verifier', color: '#1E40AF', bg: '#EFF6FF', border: '#93C5FD', accent: '#2563EB' },
  advocate: { icon: '⚖️', label: 'Advocate', color: '#6B21A8', bg: '#FDF4FF', border: '#D8B4FE', accent: '#A855F7' },
};

const NAV_LINKS = {
  worker:   [
    { to: '/log-earnings', label: '💼 Log Shift' },
    { to: '/certificate',  label: '📄 Certificate' },
    { to: '/grievances',   label: '📣 Grievances' },
  ],
  verifier: [
    { to: '/verify',     label: '✅ Verify' },
    { to: '/grievances', label: '📣 Grievances' },
  ],
  advocate: [
    { to: '/advocate',   label: '📊 Analytics' },
    { to: '/grievances', label: '📣 Grievances' },
  ],
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const location         = useLocation();
  const role = ROLE_CONFIG[user?.role] || {};
  const links = NAV_LINKS[user?.role] || [];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        .fg-nav * { font-family: "Nunito", system-ui, sans-serif; }
        @keyframes fg-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.85)} }
        @keyframes fg-slidein { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        .fg-navlink:hover { background: #F0F4FF !important; color: #2563EB !important; }
        .fg-logout-btn:hover { background: #FEF2F2 !important; color: #7F1D1D !important; border-color: #FCA5A5 !important; }
        .fg-logo-box:hover { transform: rotate(-6deg) scale(1.08); }
        .fg-menu-link:hover { background: #F0F4FF !important; }
        .fg-desktop-links, .fg-desktop-user { display: flex; }

        @media (max-width: 960px) {
          .fg-desktop-links, .fg-desktop-user { display: none !important; }
          .fg-brand-subtext, .fg-brand-live { display: none !important; }
          .fg-nav { height: 56px !important; padding: 0 14px !important; }
          .fg-brand-title { font-size: 17px !important; }
        }
      `}</style>

      <nav className="fg-nav" style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: '#fff',
        borderBottom: '2px solid #E2E8F0',
        boxShadow: '0 2px 16px rgba(37,99,235,0.06)',
        height: 68,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
      }}>

        {/* ── Brand ── */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
          <div className="fg-logo-box" style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            fontWeight: 900,
            color: '#fff',
            transition: 'transform 0.2s ease',
            boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
            flexShrink: 0,
          }}>
            <img src="/images.png" alt="FairGig" style={{ width: 20, height: 20 }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span className="fg-brand-title" style={{ fontSize: 19, fontWeight: 900, color: '#1E293B', letterSpacing: '-0.03em' }}>
              Fair<span style={{ color: '#2563EB' }}>Gig</span>
            </span>
            <span className="fg-brand-subtext" style={{ fontSize: 10, fontWeight: 800, color: '#94A3B8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Worker Platform
            </span>
          </div>
          {/* live indicator */}
          <div className="fg-brand-live" style={{ display: 'flex', alignItems: 'center', gap: 5, marginLeft: 4, background: '#ECFDF5', border: '1.5px solid #6EE7B7', borderRadius: 20, padding: '3px 9px' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981', display: 'inline-block', animation: 'fg-pulse 2s infinite', flexShrink: 0 }} />
            <span style={{ fontSize: 11, fontWeight: 800, color: '#065F46' }}>Live</span>
          </div>
        </Link>

        {/* ── Desktop nav links ── */}
        {user && (
          <div className="fg-desktop-links" style={{ alignItems: 'center', gap: 4 }}>
            {links.map(({ to, label }) => {
              const active = isActive(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className="fg-navlink"
                  style={{
                    textDecoration: 'none',
                    fontSize: 14,
                    fontWeight: active ? 800 : 700,
                    color: active ? '#2563EB' : '#475569',
                    padding: '8px 16px',
                    borderRadius: 12,
                    background: active ? '#EFF6FF' : 'transparent',
                    border: active ? '2px solid #BFDBFE' : '2px solid transparent',
                    transition: 'all 0.15s',
                    whiteSpace: 'nowrap',
                    position: 'relative',
                  }}
                >
                  {label}
                  {active && (
                    <span style={{
                      position: 'absolute',
                      bottom: -2,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 20,
                      height: 3,
                      background: '#2563EB',
                      borderRadius: 2,
                    }} />
                  )}
                </Link>
              );
            })}
          </div>
        )}

        {/* ── Right: user pill + logout ── */}
        {user && (
          <div className="fg-desktop-user" style={{ alignItems: 'center', gap: 10, flexShrink: 0 }}>

            {/* Role pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: role.bg,
              border: `2px solid ${role.border}`,
              borderRadius: 22,
              padding: '6px 14px 6px 8px',
            }}>
              <div style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: '#fff',
                border: `2px solid ${role.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 15,
                flexShrink: 0,
              }}>
                {role.icon}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: role.color, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.1 }}>
                  {user.full_name}
                </div>
                <div style={{ fontSize: 10, fontWeight: 800, color: role.accent, textTransform: 'uppercase', letterSpacing: '0.07em', lineHeight: 1.1 }}>
                  {role.label}
                </div>
              </div>
            </div>

            {/* Logout */}
            <button
              className="fg-logout-btn"
              onClick={logout}
              style={{
                background: '#FFF5F5',
                color: '#DC2626',
                border: '2px solid #FED7D7',
                borderRadius: 12,
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 800,
                transition: 'all 0.15s',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontSize: 14 }}>🚪</span> Sign Out
            </button>
          </div>
        )}
      </nav>

      {/* ── Mobile bottom tab bar ── */}
      {user && (
        <div style={{
          display: 'none',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 999,
          background: '#fff',
          borderTop: '2px solid #E2E8F0',
          padding: '8px 0 env(safe-area-inset-bottom, 8px)',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
        }}
          className="fg-mobile-tabs"
        >
          <style>{`
            @media (max-width: 640px) {
              .fg-mobile-tabs { display: flex !important; }
            }
          `}</style>
          <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
            {links.map(({ to, label }) => {
              const active = isActive(to);
              const emoji  = label.split(' ')[0];
              const text   = label.split(' ').slice(1).join(' ');
              return (
                <Link
                  key={to}
                  to={to}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3,
                    textDecoration: 'none',
                    padding: '6px 18px',
                    borderRadius: 14,
                    background: active ? '#EFF6FF' : 'transparent',
                    minWidth: 64,
                  }}
                >
                  <span style={{ fontSize: 22 }}>{emoji}</span>
                  <span style={{ fontSize: 11, fontWeight: active ? 800 : 600, color: active ? '#2563EB' : '#94A3B8' }}>
                    {text}
                  </span>
                  {active && <span style={{ width: 16, height: 3, borderRadius: 2, background: '#2563EB' }} />}
                </Link>
              );
            })}
            <button
              onClick={logout}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', padding: '6px 18px', borderRadius: 14, minWidth: 64 }}
            >
              <span style={{ fontSize: 22 }}>🚪</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8' }}>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
