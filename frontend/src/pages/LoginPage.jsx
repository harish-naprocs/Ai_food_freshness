import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, ShieldCheck } from 'lucide-react';
import './LoginPage.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate real auth call for now
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="login-container">
      {/* Left Side Visual */}
      <div className="login-visual">
        <div className="visual-content">
          <Link to="/" className="visual-logo">FRESH<span className="text-primary">IQ</span></Link>
          <h1>Freshness Intelligence,<br/>At Every Decision Point.</h1>
          
          <div className="visual-dashboard">
            <div className="vd-row">
              <span className="vd-label">Freshness</span>
              <span className="vd-value">92</span>
            </div>
            <div className="vd-row">
              <span className="vd-label">Shelf Life</span>
              <span className="vd-value">6 days</span>
            </div>
            <div className="vd-row">
              <span className="vd-label">Storage</span>
              <span className="vd-value text-success">Optimal</span>
            </div>
            <div className="vd-row">
              <span className="vd-label">Risk</span>
              <span className="vd-value text-success">Low</span>
            </div>
          </div>
        </div>
        <div className="visual-overlay"></div>
      </div>

      {/* Right Side Form */}
      <div className="login-form-container">
        <div className="login-form-wrapper">
          <Link to="/" className="mobile-logo">FRESH<span className="text-primary">IQ</span></Link>
          <h2>Welcome back</h2>
          <p className="subtitle">Sign in to your FreshIQ workspace.</p>
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Work Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com" 
                required 
              />
            </div>
            
            <div className="form-group">
              <div className="label-row">
                <label>Password</label>
                <a href="#" className="forgot-link">Forgot password?</a>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                required 
              />
            </div>
            
            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
            </div>

            <button type="submit" className="btn-primary full-width" disabled={loading}>
              {loading ? 'Signing you in...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/register">Create account</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
