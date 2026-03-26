import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPasswordAPI } from '../api';
import toast from 'react-hot-toast';
import { LockIcon, MailIcon } from '../components/ui/Icons';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { toast.error('Enter your email'); return; }
    setLoading(true);
    try {
      await forgotPasswordAPI(email);
      setSent(true);
      toast.success('Reset email sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div style={{ width: '100%', maxWidth: '432px' }}>
        <div className="auth-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <LockIcon size={26} />
            </div>
            <div>
              <h2>Find Your Account</h2>
              <p style={{ fontSize: '14px', color: 'var(--secondary-text)' }}>
                Enter your email to find your account.
              </p>
            </div>
          </div>

          <div className="auth-divider" />

          {sent ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div className="empty-state-icon" style={{ margin: '0 auto 12px' }}>
                <MailIcon size={24} />
              </div>
              <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Check your email</h3>
              <p style={{ color: 'var(--secondary-text)', fontSize: '14px' }}>
                We sent a password reset link to <strong>{email}</strong>
              </p>
              <Link to="/login">
                <button className="btn-primary" style={{ marginTop: '20px' }}>
                  Back to Login
                </button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '16px' }}>
                <Link to="/login">
                  <button type="button" className="btn-ghost">Cancel</button>
                </Link>
                <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '10px 24px', fontSize: '15px' }} disabled={loading}>
                  {loading ? 'Sending...' : 'Search'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
