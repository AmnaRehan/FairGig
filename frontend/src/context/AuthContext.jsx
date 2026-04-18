import { useState, useEffect } from 'react';
import { authAPI } from '../api/config';
import { AuthContext } from './auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const response = await authAPI.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
        if (isMounted) setUser(response.data);
      } catch {
        localStorage.removeItem('token');
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    const form = new URLSearchParams();
    form.append('username', email);
    form.append('password', password);
    const r = await authAPI.post('/auth/login', form, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    localStorage.setItem('token', r.data.access_token);
    const me = await authAPI.get('/auth/me', { headers: { Authorization: `Bearer ${r.data.access_token}` } });
    setUser(me.data);
    return me.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>;
}