import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/auth';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Welcome back 👋');
      navigate('/');
    } catch {
      toast.error('Invalid credentials');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      background: 'radial-gradient(circle at top, #0f172a, #020617 60%, #000000)'
    }}>

      {/* Glow blobs */}
      <div style={{
        position: 'absolute',
        width: 400,
        height: 400,
        background: 'radial-gradient(circle, rgba(99,102,241,0.25), transparent 60%)',
        top: '-100px',
        left: '-100px',
        filter: 'blur(40px)'
      }} />
      <div style={{
        position: 'absolute',
        width: 400,
        height: 400,
        background: 'radial-gradient(circle, rgba(236,72,153,0.18), transparent 60%)',
        bottom: '-120px',
        right: '-120px',
        filter: 'blur(50px)'
      }} />

      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: 420,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(148,163,184,0.15)',
        borderRadius: 20,
        padding: 34,
        boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
        position: 'relative',
        zIndex: 2
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 26 }}>
          <div style={{
            width: 54,
            height: 54,
            margin: '0 auto 12px',
            borderRadius: 16,
            background: 'linear-gradient(135deg, #6366f1, #ec4899)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 800,
            fontSize: 20,
            boxShadow: '0 10px 30px rgba(99,102,241,0.4)'
          }}>
            F
          </div>

          <h2 style={{
            margin: 0,
            fontSize: 22,
            fontWeight: 700,
            color: '#e2e8f0'
          }}>
            Welcome back
          </h2>

          <p style={{
            marginTop: 6,
            fontSize: 13,
            color: '#94a3b8'
          }}>
            Sign in to FairGig dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={{
              fontSize: 11,
              letterSpacing: 1,
              color: '#94a3b8',
              fontWeight: 600
            }}>
              EMAIL
            </label>

            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{
                width: '100%',
                marginTop: 6,
                padding: '12px 14px',
                borderRadius: 14,
                border: '1px solid rgba(148,163,184,0.2)',
                background: 'rgba(2,6,23,0.6)',
                color: '#e2e8f0',
                fontSize: 14,
                outline: 'none',
                transition: '0.2s'
              }}
              onFocus={(e) => {
                e.target.style.border = '1px solid #6366f1';
                e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.2)';
              }}
              onBlur={(e) => {
                e.target.style.border = '1px solid rgba(148,163,184,0.2)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 22 }}>
            <label style={{
              fontSize: 11,
              letterSpacing: 1,
              color: '#94a3b8',
              fontWeight: 600
            }}>
              PASSWORD
            </label>

            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                marginTop: 6,
                padding: '12px 14px',
                borderRadius: 14,
                border: '1px solid rgba(148,163,184,0.2)',
                background: 'rgba(2,6,23,0.6)',
                color: '#e2e8f0',
                fontSize: 14,
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.border = '1px solid #ec4899';
                e.target.style.boxShadow = '0 0 0 3px rgba(236,72,153,0.2)';
              }}
              onBlur={(e) => {
                e.target.style.border = '1px solid rgba(148,163,184,0.2)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 14,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              color: 'white',
              background: 'linear-gradient(135deg, #6366f1, #ec4899)',
              boxShadow: '0 15px 35px rgba(99,102,241,0.3)',
              transition: '0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Sign in
          </button>
        </form>

        {/* Footer */}
        <p style={{
          marginTop: 18,
          textAlign: 'center',
          fontSize: 13,
          color: '#94a3b8'
        }}>
          New here?{' '}
          <Link
            to="/register"
            style={{
              color: '#6366f1',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}