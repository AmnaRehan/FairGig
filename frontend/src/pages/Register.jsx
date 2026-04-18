import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api/config';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'worker',
    city: '',
    platform: ''
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authAPI.post('/auth/register', form);
      toast.success('Account created 🎉');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed');
    }
  };

  const update = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      background: 'radial-gradient(circle at top, #0f172a, #020617 60%, #000)'
    }}>

      {/* glow */}
      <div style={{
        position: 'absolute',
        width: 450,
        height: 450,
        background: 'radial-gradient(circle, rgba(99,102,241,0.25), transparent 60%)',
        top: '-120px',
        left: '-120px',
        filter: 'blur(50px)'
      }} />

      <div style={{
        position: 'absolute',
        width: 450,
        height: 450,
        background: 'radial-gradient(circle, rgba(236,72,153,0.18), transparent 60%)',
        bottom: '-120px',
        right: '-120px',
        filter: 'blur(60px)'
      }} />

      {/* card */}
      <div style={{
        width: '100%',
        maxWidth: 480,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(148,163,184,0.15)',
        borderRadius: 20,
        padding: 34,
        boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
        position: 'relative',
        zIndex: 2
      }}>

        {/* header */}
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
            Create account
          </h2>

          <p style={{
            marginTop: 6,
            fontSize: 13,
            color: '#94a3b8'
          }}>
            Join FairGig in seconds
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Full name */}
          <Input label="FULL NAME" value={form.full_name} onChange={(v) => update('full_name', v)} />

          {/* Email */}
          <Input label="EMAIL" type="email" value={form.email} onChange={(v) => update('email', v)} />

          {/* Password */}
          <Input label="PASSWORD" type="password" value={form.password} onChange={(v) => update('password', v)} />

          {/* City */}
          <Input label="CITY" value={form.city} onChange={(v) => update('city', v)} />

          {/* Platform */}
          <Input label="PLATFORM" value={form.platform} onChange={(v) => update('platform', v)} />

          {/* Role */}
          <div style={{ marginBottom: 18 }}>
            <label style={{
              fontSize: 11,
              letterSpacing: 1,
              color: '#94a3b8',
              fontWeight: 600
            }}>
              ROLE
            </label>

            <select
              value={form.role}
              onChange={(e) => update('role', e.target.value)}
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
            >
              <option value="worker">Worker</option>
              <option value="verifier">Verifier</option>
              <option value="advocate">Advocate</option>
            </select>
          </div>

          {/* button */}
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
            Create account
          </button>
        </form>

        {/* footer */}
        <p style={{
          marginTop: 18,
          textAlign: 'center',
          fontSize: 13,
          color: '#94a3b8'
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#6366f1', fontWeight: 600, textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
}

/* reusable input */
function Input({ label, type = 'text', value, onChange }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{
        fontSize: 11,
        letterSpacing: 1,
        color: '#94a3b8',
        fontWeight: 600
      }}>
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
      />
    </div>
  );
}