import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services';
import toast from 'react-hot-toast';
import { TrendingUp, ArrowRight, ArrowLeft, KeyRound } from 'lucide-react';

export default function OTPVerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    } else {
      inputRefs.current[0]?.focus();
    }
  }, [email, navigate]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < text.length; i++) newOtp[i] = text[i];
    setOtp(newOtp);
    inputRefs.current[Math.min(text.length, 5)]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await authService.verifyOTP({ email, otp: otpString });
      if (data.success) {
        toast.success('OTP verified successfully!');
        navigate('/reset-password', { state: { email, otp: otpString } });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await authService.forgotPassword(email);
      toast.success('New OTP sent! Check your email or server console.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch {
      toast.error('Failed to resend OTP.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: 420 }} className="animate-slide-up">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: '0 8px 32px rgba(59,130,246,0.3)' }}>
            <KeyRound size={24} color="white" />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9' }}>Verify OTP</h2>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 6 }}>
            Enter the 6-digit code sent to<br />
            <span style={{ color: '#94a3b8', fontWeight: 600 }}>{email}</span>
          </p>
        </div>

        <div className="glass-card" style={{ padding: '36px' }}>
          <form onSubmit={handleSubmit}>
            {/* OTP Inputs */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 28 }} onPaste={handlePaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  style={{
                    width: 48, height: 56,
                    textAlign: 'center', fontSize: 22, fontWeight: 700,
                    background: '#162032',
                    border: `2px solid ${digit ? '#3b82f6' : 'rgba(51,65,85,0.7)'}`,
                    borderRadius: 12, color: '#f1f5f9',
                    outline: 'none', transition: 'all 0.2s',
                    caretColor: 'transparent',
                  }}
                />
              ))}
            </div>

            <button
              type="submit"
              id="otp-submit"
              className="btn-primary"
              disabled={loading || otp.join('').length < 6}
              style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 15, opacity: (loading || otp.join('').length < 6) ? 0.6 : 1 }}
            >
              {loading ? 'Verifying...' : (<>Verify OTP <ArrowRight size={15} /></>)}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <span style={{ color: '#64748b', fontSize: 13 }}>Didn&apos;t receive it? </span>
            <button onClick={handleResend} style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: 0 }}>
              Resend OTP
            </button>
          </div>
          <div style={{ textAlign: 'center', marginTop: 10 }}>
            <Link to="/forgot-password" style={{ color: '#64748b', fontSize: 13, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <ArrowLeft size={13} /> Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
