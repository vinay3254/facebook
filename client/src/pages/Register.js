import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import '../App.css';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', dateOfBirth: '', gender: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'At least 6 characters';
    if (!form.dateOfBirth) errs.dateOfBirth = 'Date of birth is required';
    if (!form.gender) errs.gender = 'Select a gender';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome to FaceBook!');
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      toast.error(msg);
      if (msg.toLowerCase().includes('email')) setErrors({ email: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ alignItems: 'flex-start', paddingTop: '40px' }}>
      <div style={{ width: '100%', maxWidth: '432px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--primary)', textAlign: 'center', marginBottom: '8px' }}>FaceBook</h1>

        <div className="auth-card">
          <h2 style={{ fontSize: '24px', marginBottom: '4px' }}>Create a new account</h2>
          <p className="subtitle">It's quick and easy.</p>
          <div className="auth-divider" style={{ margin: '8px 0 16px' }} />

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Full name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-msg">{errors.name}</span>}
            </div>

            <div className="form-group">
              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-msg">{errors.email}</span>}
            </div>

            <div className="form-group">
              <input
                type="password"
                placeholder="New password (6+ characters)"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="error-msg">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', color: 'var(--secondary-text)', marginBottom: '4px', display: 'block' }}>
                Date of birth
              </label>
              <input
                type="date"
                value={form.dateOfBirth}
                onChange={e => setForm({ ...form, dateOfBirth: e.target.value })}
                className={errors.dateOfBirth ? 'error' : ''}
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.dateOfBirth && <span className="error-msg">{errors.dateOfBirth}</span>}
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', color: 'var(--secondary-text)', marginBottom: '4px', display: 'block' }}>
                Gender
              </label>
              <div className="gender-group">
                {['Female', 'Male', 'Other'].map(g => (
                  <label key={g} className="gender-option" style={{
                    background: form.gender === g ? 'var(--primary-light)' : 'var(--white)',
                    borderColor: form.gender === g ? 'var(--primary)' : 'var(--border)',
                  }}>
                    {g}
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={form.gender === g}
                      onChange={e => setForm({ ...form, gender: e.target.value })}
                    />
                  </label>
                ))}
              </div>
              {errors.gender && <span className="error-msg">{errors.gender}</span>}
            </div>

            <p style={{ fontSize: '12px', color: 'var(--secondary-text)', marginBottom: '16px', lineHeight: '1.4' }}>
              By clicking Sign Up, you agree to our Terms, Privacy Policy and Cookies Policy.
            </p>

            <div style={{ textAlign: 'center' }}>
              <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '12px 80px', fontSize: '17px' }} disabled={loading}>
                {loading ? 'Creating...' : 'Sign Up'}
              </button>
            </div>
          </form>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <Link to="/login" className="auth-link">Already have an account?</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
