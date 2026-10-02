import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Lock, ArrowLeft, Save, ShieldCheck } from 'lucide-react';

export default function ChangePasswordPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.currentPassword) errs.currentPassword = 'Current password is required';
    if (!form.newPassword || form.newPassword.length < 6) errs.newPassword = 'New password must be at least 6 characters';
    if (form.newPassword !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (form.currentPassword === form.newPassword && form.currentPassword) errs.newPassword = 'New password must differ from current';
    return errs;
  };

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((p) => ({ ...p, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      const { data } = await authService.changePassword(form);
      if (data.success) {
        toast.success('Password changed successfully! Please sign in again.');
        setTimeout(() => { logout(); navigate('/signin'); }, 1500);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'currentPassword', label: 'Current Password', key: 'current', placeholder: 'Enter current password' },
    { name: 'newPassword', label: 'New Password', key: 'new', placeholder: 'At least 6 characters' },
    { name: 'confirmPassword', label: 'Confirm New Password', key: 'confirm', placeholder: 'Repeat new password' },
  ];

  return (
    <div style={{ maxWidth: 500 }}>
      <button onClick={() => navigate('/profile')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, marginBottom: 24, padding: 0 }}>
        <ArrowLeft size={14} /> Back to Profile
      </button>

      <div className="glass-card" style={{ padding: '32px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
          <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(59,130,246,0.3)', flexShrink: 0 }}>
            <ShieldCheck size={22} color="white" />
          </div>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9', margin: 0 }}>Change Password</h2>
            <p style={{ color: '#64748b', fontSize: 13, marginTop: 2 }}>Keep your account secure</p>
          </div>
        </div>

        {/* Security Note */}
        <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 10, padding: '12px 14px', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <Lock size={13} color="#3b82f6" style={{ marginTop: 2, flexShrink: 0 }} />
            <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
              After changing your password, you will be automatically signed out and redirected to the sign-in page.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {fields.map(({ name, label, key, placeholder }) => (
            <div key={name} style={{ marginBottom: 16 }}>
              <label className="form-label">{label}</label>
              <div style={{ position: 'relative' }}>
                <Lock size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input
                  id={`change-${name}`}
                  name={name}
                  type={show[key] ? 'text' : 'password'}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="form-input"
                  style={{ paddingLeft: 36, paddingRight: 44 }}
                  autoComplete={name === 'currentPassword' ? 'current-password' : 'new-password'}
                />
                <button type="button" onClick={() => setShow((p) => ({ ...p, [key]: !p[key] }))} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}>
                  {show[key] ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors[name] && <p style={{ color: '#f43f5e', fontSize: 11, marginTop: 4 }}>{errors[name]}</p>}
            </div>
          ))}

          <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
            <button type="button" onClick={() => navigate('/profile')} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
              Cancel
            </button>
            <button
              type="submit"
              id="change-password-submit"
              className="btn-primary"
              disabled={loading}
              style={{ flex: 1, justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
            >
              <Save size={14} /> {loading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
