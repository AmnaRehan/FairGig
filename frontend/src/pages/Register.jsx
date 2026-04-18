import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api/config';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', full_name: '', role: 'worker', city: '', platform: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authAPI.post('/auth/register', form);
      toast.success('Registered! Please log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed');
    }
  };

  const field = (label, key, type = 'text') => (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5, color: '#374151' }}>{label}</label>
      <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
        style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
    </div>
  );

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', width: 400 }}>
        <h2 style={{ marginBottom: 24, color: '#1e40af', fontWeight: 700 }}>Join FairGig</h2>
        <form onSubmit={handleSubmit}>
          {field('Full Name', 'full_name')}
          {field('Email', 'email', 'email')}
          {field('Password', 'password', 'password')}
          {field('City', 'city')}
          {field('Primary Platform (e.g. Careem)', 'platform')}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 5, color: '#374151' }}>Role</label>
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}>
              <option value="worker">Worker</option>
              <option value="verifier">Verifier</option>
              <option value="advocate">Advocate</option>
            </select>
          </div>
          <button type="submit" style={{ width: '100%', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, padding: '12px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
            Create Account
          </button>
        </form>
        <p style={{ marginTop: 16, textAlign: 'center', fontSize: 13, color: '#6b7280' }}>
          Have an account? <Link to="/login" style={{ color: '#2563eb' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}