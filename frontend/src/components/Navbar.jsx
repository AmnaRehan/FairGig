import { Link } from 'react-router-dom';
import { useAuth } from '../context/auth';

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav style={{ background: '#1e40af', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Link to="/" style={{ color: 'white', fontWeight: 700, fontSize: 20, textDecoration: 'none' }}>
        FairGig
      </Link>
      <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
        {user && <>
          <Link to="/grievances" style={{ color: '#bfdbfe', textDecoration: 'none', fontSize: 14 }}>Grievances</Link>
          {user.role === 'worker' && <>
            <Link to="/log-earnings" style={{ color: '#bfdbfe', textDecoration: 'none', fontSize: 14 }}>Log Earnings</Link>
            <Link to="/certificate" style={{ color: '#bfdbfe', textDecoration: 'none', fontSize: 14 }}>Certificate</Link>
          </>}
          <span style={{ color: '#93c5fd', fontSize: 13 }}>{user.full_name} ({user.role})</span>
          <button onClick={logout} style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontSize: 13 }}>
            Logout
          </button>
        </>}
      </div>
    </nav>
  );
}