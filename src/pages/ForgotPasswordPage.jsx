import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services';
import toast from 'react-hot-toast';
import { TrendingUp, Mail, ArrowRight, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await authService.forgotPassword(email);
      if (data.success) {
        setSent(true);
        toast.success(data.message);
        // Navigate to OTP page after short delay
        setTimeout(() => navigate('/verify-otp', { state: { email } }), 1500);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: 420 }} className="animate-slide-up">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(59,130,246,0.3)' }}>
              <TrendingUp size={24} color="white" />
            </div>
          </Link>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', marginTop: 12 }}>Forgot Password?</h2>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 6 }}>
            Enter your email and we'll send you an OTP to reset your password.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '36px' }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ width: 56, height: 56, background: 'rgba(16, 185, 129, 0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Mail size={24} color="#10b981" />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>OTP Sent!</h3>
              <p style={{ color: '#94a3b8', fontSize: 14 }}>Check your email or server console (dev mode) for the OTP.</p>
              <p style={{ color: '#64748b', fontSize: 13, marginTop: 8 }}>Redirecting to verification...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 24 }}>
                <label className="form-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input
                    id="forgot-email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="form-input"
                    style={{ paddingLeft: 40 }}
                    autoComplete="email"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="forgot-submit"
                className="btn-primary"
                disabled={loading}
                style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 15, opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Sending OTP...' : (<>Send OTP <ArrowRight size={15} /></>)}
              </button>
            </form>
          )}

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Link to="/signin" style={{ color: '#64748b', fontSize: 13, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <ArrowLeft size={13} /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
