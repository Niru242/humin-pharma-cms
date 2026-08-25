'use client';

import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [showMfa, setShowMfa] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password, showMfa ? mfaCode : undefined);

    if (result.success) {
      window.location.href = '/dashboard';
    } else if (result.mfaRequired) {
      setShowMfa(true);
    } else {
      setError(result.error || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6', fontFamily: '"Nunito", sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '2.5rem', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937', margin: 0 }}>Pharma HRMS</h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem' }}>Sign in to your account</p>
        </div>

        {error && <div style={{ padding: '0.75rem', borderRadius: '8px', background: '#fef2f2', color: '#dc2626', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="admin@pharmahrms.local" style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem', outline: 'none' }} />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter password" style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem', outline: 'none' }} />
          </div>

          {showMfa && (
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>MFA Code</label>
              <input type="text" value={mfaCode} onChange={(e) => setMfaCode(e.target.value)} required maxLength={6} placeholder="6-digit code" style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem', outline: 'none', letterSpacing: '0.2em' }} />
            </div>
          )}

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#fff', fontWeight: 700, fontSize: '0.875rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
