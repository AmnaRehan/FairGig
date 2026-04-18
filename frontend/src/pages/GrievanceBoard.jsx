import { useCallback, useEffect, useState } from 'react';
import { grievanceAPI } from '../api/config';
import { useAuth } from '../context/auth';
import toast from 'react-hot-toast';

/* eslint-disable react-hooks/set-state-in-effect */

export default function GrievanceBoard() {
  const { user } = useAuth();
  const [grievances, setGrievances] = useState([]);
  const [form, setForm] = useState({ platform: '', category: 'commission', title: '', description: '', city: '' });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [filter, setFilter] = useState({ platform: '', category: '', status: '' });

  const load = useCallback(async () => {
    const params = new URLSearchParams(Object.entries(filter).filter(([, v]) => v));
    setPageError('');
    try {
      const response = await grievanceAPI.get(`/grievances?${params}`);
      setGrievances(response.data.grievances || []);
    } catch {
      setPageError('Failed to load grievances.');
    } finally {
      setPageLoading(false);
    }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await grievanceAPI.post('/grievances', { ...form, worker_id: user.id });
      toast.success('Complaint posted!');
      setForm({ platform: '', category: 'commission', title: '', description: '', city: '' });
      load();
    } catch {
      toast.error('Failed to post complaint');
    } finally {
      setLoading(false);
    }
  };

  const upvote = async (id) => {
    try {
      await grievanceAPI.post(`/grievances/${id}/upvote`);
      load();
    } catch {
      toast.error('Failed to upvote complaint');
    }
  };

  const updateStatus = async (id, status) => {
    const notes = prompt('Add notes (optional):') || '';
    try {
      await grievanceAPI.patch(`/grievances/${id}/status`, { status, advocate_notes: notes });
      load();
    } catch {
      toast.error('Failed to update grievance status');
    }
  };

  const inputStyle = { width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Grievance Board</h1>
      <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 28 }}>Share complaints, rate intel, and support requests. Advocates moderate this board.</p>

      {user.role === 'worker' && (
        <div style={{ background: 'white', borderRadius: 12, padding: 28, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', marginBottom: 28 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Post a Complaint</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 5 }}>Platform</label>
                <input value={form.platform} onChange={e => setForm({...form, platform: e.target.value})} placeholder="e.g. Careem" style={inputStyle} required />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 5 }}>Category</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={inputStyle}>
                  <option value="commission">Commission Rate</option>
                  <option value="deactivation">Deactivation</option>
                  <option value="payment">Payment Issue</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 5 }}>Title</label>
              <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Short summary" style={inputStyle} required />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 5 }}>Description</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                rows={4} placeholder="Describe what happened in detail..." style={{...inputStyle, resize: 'vertical'}} required />
            </div>
            <input value={form.city} onChange={e => setForm({...form, city: e.target.value})} placeholder="City (optional)" style={{...inputStyle, marginBottom: 16}} />
            <button type="submit" disabled={loading}
              style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              {loading ? 'Posting...' : 'Post Complaint'}
            </button>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {[['platform', 'Platform'], ['category', 'Category'], ['status', 'Status']].map(([key, label]) => (
          <input key={key} placeholder={`Filter by ${label}`} value={filter[key]}
            onChange={e => setFilter({...filter, [key]: e.target.value})}
            style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 13, width: 160 }} />
        ))}
        <button onClick={() => setFilter({ platform: '', category: '', status: '' })}
          style={{ background: '#f3f4f6', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 13, cursor: 'pointer', color: '#374151' }}>
          Clear
        </button>
      </div>

      {pageLoading ? (
        <div style={{ textAlign: 'center', color: '#6b7280', padding: 28 }}>Loading grievances...</div>
      ) : pageError ? (
        <div style={{ textAlign: 'center', color: '#b91c1c', padding: 28 }}>{pageError}</div>
      ) : null}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {grievances.map(g => (
          <div key={g.id} style={{ background: 'white', borderRadius: 10, padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: `4px solid ${g.status === 'resolved' ? '#059669' : g.status === 'escalated' ? '#dc2626' : '#2563eb'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>{g.title}</span>
                <span style={{ marginLeft: 10, background: '#eff6ff', color: '#1d4ed8', padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600 }}>{g.platform}</span>
                <span style={{ marginLeft: 6, background: '#f0fdf4', color: '#15803d', padding: '2px 8px', borderRadius: 12, fontSize: 11 }}>{g.category}</span>
              </div>
              <span style={{ fontSize: 12, color: '#9ca3af' }}>{new Date(g.created_at).toLocaleDateString()}</span>
            </div>
            <p style={{ color: '#374151', fontSize: 13, margin: '10px 0 12px', lineHeight: 1.6 }}>{g.description}</p>
            {g.advocate_notes && (
              <div style={{ background: '#f0fdf4', borderRadius: 6, padding: '8px 12px', fontSize: 12, color: '#166534', marginBottom: 10 }}>
                Advocate: {g.advocate_notes}
              </div>
            )}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => upvote(g.id)} style={{ background: '#f3f4f6', border: 'none', borderRadius: 6, padding: '5px 12px', fontSize: 13, cursor: 'pointer', color: '#374151' }}>
                ▲ {g.upvotes}
              </button>
              <span style={{ fontSize: 12, color: '#9ca3af' }}>Status: {g.status}</span>
              {g.city && <span style={{ fontSize: 12, color: '#9ca3af' }}>📍 {g.city}</span>}
              {user.role === 'advocate' && (
                <>
                  <button onClick={() => updateStatus(g.id, 'escalated')} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer' }}>Escalate</button>
                  <button onClick={() => updateStatus(g.id, 'resolved')} style={{ background: '#d1fae5', color: '#059669', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 12, cursor: 'pointer' }}>Resolve</button>
                </>
              )}
            </div>
          </div>
        ))}
        {grievances.length === 0 && (
          <div style={{ textAlign: 'center', color: '#9ca3af', padding: 40 }}>No complaints found.</div>
        )}
      </div>
    </div>
  );
}