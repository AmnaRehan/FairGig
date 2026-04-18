import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { useState } from 'react';

const ROLE_CONFIG = {
  worker:   { icon: '🛵', color: '#34d399', bg: 'rgba(52,211,153,0.12)' },
  verifier: { icon: '✅', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' },
  advocate: { icon: '⚖️', color: '#f472b6', bg: 'rgba(244,114,182,0.12)' },
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [hovered, setHovered] = useState(null);
  const role = ROLE_CONFIG[user?.role] || {};

  const isActive = (path) => location.pathname === path;

  const navLink = (to, label) => (
    <Link
      key={to}
      to={to}
      onMouseEnter={() => setHovered(to)}
      onMouseLeave={() => setHovered(null)}
      style={{
        color: isActive(to) ? '#fff' : hovered === to ? '#fff' : 'rgba(255,255,255,0.55)',
        textDecoration: 'none',
        fontSize: 13,
        fontWeight: isActive(to) ? 600 : 400,
        letterSpacing: '0.02em',
        padding: '5px 12px',
        borderRadius: 8,
        background: isActive(to)
          ? 'rgba(255,255,255,0.12)'
          : hovered === to
          ? 'rgba(255,255,255,0.07)'
          : 'transparent',
        transition: 'all 0.18s ease',
        position: 'relative',
      }}
    >
      {label}
      {isActive(to) && (
        <span style={{
          position: 'absolute', bottom: -1, left: '50%',
          transform: 'translateX(-50%)',
          width: 16, height: 2,
          background: 'linear-gradient(90deg,#60a5fa,#a78bfa)',
          borderRadius: 2,
        }} />
      )}
    </Link>
  );

  return (
    <>
      <style>{`
        @keyframes fg-pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .fg-logout:hover { background: rgba(239,68,68,0.2) !important; color: #fca5a5 !important; }
        .fg-logo:hover .fg-logo-dot { transform: scale(1.15); }
      `}</style>

      <nav style={{
        position: 'sticky', top: 0, zIndex: 1000,
        height: 56,
        background: 'rgba(10,14,26,0.82)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        boxShadow: '0 1px 40px rgba(0,0,0,0.4)',
      }}>

        {/* Left — Brand */}
        <Link to="/" className="fg-logo" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
          <div className="fg-logo-dot" style={{
            width: 30, height: 30,
            background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
            borderRadius: 9,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 800, color: '#fff',
            transition: 'transform 0.2s ease',
            boxShadow: '0 0 12px rgba(99,102,241,0.5)',
          }}>F</div>
          <span style={{
            fontSize: 16, fontWeight: 700, color: '#fff',
            letterSpacing: '-0.02em',
          }}>
            Fair<span style={{ color: '#818cf8' }}>Gig</span>
          </span>
          {/* live dot */}
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#34d399',
            display: 'inline-block',
            animation: 'fg-pulse 2s infinite',
            marginLeft: 2,
          }} />
        </Link>

        {/* Right — Nav links + user */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {navLink('/grievances', 'Grievances')}
            {user.role === 'worker' && <>
              {navLink('/log-earnings', 'Log Earnings')}
              {navLink('/certificate', 'Certificate')}
            </>}
            {user.role === 'verifier' && navLink('/verify', 'Verify')}
            {user.role === 'advocate' && navLink('/advocate', 'Analytics')}

            {/* Divider */}
            <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)', margin: '0 8px' }} />

            {/* User pill */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: role.bg,
              border: `1px solid ${role.color}22`,
              borderRadius: 20, padding: '4px 10px 4px 6px',
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: `${role.color}22`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11,
              }}>{role.icon}</div>
              <span style={{ fontSize: 12, color: role.color, fontWeight: 500, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.full_name}
              </span>
            </div>

            {/* Logout */}
            <button
              className="fg-logout"
              onClick={logout}
              style={{
                background: 'rgba(239,68,68,0.1)',
                color: '#f87171',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: 8,
                padding: '5px 12px',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 500,
                marginLeft: 4,
                transition: 'all 0.18s ease',
              }}
            >
              Sign out
            </button>
          </div>
        )}
      </nav>
    </>
  );
}