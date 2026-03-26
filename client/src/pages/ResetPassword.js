import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPasswordAPI } from '../api';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (password !== confirm) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await resetPasswordAPI(token, password);
      toast.success('Password reset successful!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed. Link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div style={{ width: '100%', maxWidth: '432px' }}>
        <div className="auth-card">
          <h2>Reset Your Password</h2>
          <p className="subtitle" style={{ marginBottom: '16px' }}>Enter your new password below.</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input type="password" placeholder="New password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div className="form-group">
              <input type="password" placeholder="Confirm new password" value={confirm} onChange={e => setConfirm(e.target.value)} />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
