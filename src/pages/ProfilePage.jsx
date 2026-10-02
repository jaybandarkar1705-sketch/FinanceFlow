import { useState, useEffect } from 'react';
import { profileService } from '../services';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { User, Mail, Calendar, Lock, LogOut, Edit3, Save, X, Shield, Clock } from 'lucide-react';

const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await profileService.get();
        if (data.success) {
          setProfile(data.data);
          setUsername(data.data.username);
        }
      } catch {
        toast.error('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!username.trim() || username.trim().length < 3) {
      toast.error('Username must be at least 3 characters.');
      return;
    }
    setSaving(true);
    try {
      const { data } = await profileService.update({ username: username.trim() });
      if (data.success) {
        setProfile(data.data);
        updateUser(data.data);
        toast.success('Profile updated successfully!');
        setEditing(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
        <div style={{ width: 32, height: 32, border: '3px solid rgba(59,130,246,0.2)', borderTop: '3px solid #3b82f6', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640 }}>
      {/* Profile Card */}
      <div className="glass-card" style={{ padding: '32px', marginBottom: 20 }}>
        {/* Avatar & Name */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 84, height: 84,
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 800, color: 'white', margin: '0 auto 16px',
            boxShadow: '0 8px 32px rgba(59,130,246,0.3)',
          }}>
            {getInitials(profile?.username)}
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', marginBottom: 4 }}>{profile?.username}</h2>
          <p style={{ color: '#64748b', fontSize: 14 }}>{profile?.email}</p>
        </div>

        {/* Info Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Username */}
          <div style={{ background: 'rgba(15,23,42,0.5)', borderRadius: 12, padding: '16px', border: '1px solid rgba(51,65,85,0.4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: editing ? 12 : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, background: 'rgba(59,130,246,0.15)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={14} color="#3b82f6" />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Username</div>
                  {!editing && <div style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9', marginTop: 2 }}>{profile?.username}</div>}
                </div>
              </div>
              {!editing ? (
                <button id="edit-username-btn" onClick={() => setEditing(true)} style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 8, padding: '6px 12px', color: '#3b82f6', cursor: 'pointer', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Edit3 size={12} /> Edit
                </button>
              ) : (
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => { setEditing(false); setUsername(profile?.username); }} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 4 }}>
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
            {editing && (
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  id="profile-username-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-input"
                  style={{ height: 38, fontSize: 13, flex: 1 }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                />
                <button id="save-profile-btn" onClick={handleSave} className="btn-primary" style={{ padding: '0 16px', height: 38, fontSize: 13, whiteSpace: 'nowrap' }} disabled={saving}>
                  <Save size={13} /> {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>

          {/* Email */}
          <div style={{ background: 'rgba(15,23,42,0.5)', borderRadius: 12, padding: '16px', border: '1px solid rgba(51,65,85,0.4)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, background: 'rgba(139,92,246,0.15)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Mail size={14} color="#8b5cf6" />
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9', marginTop: 2 }}>{profile?.email}</div>
            </div>
          </div>

          {/* Password */}
          <div style={{ background: 'rgba(15,23,42,0.5)', borderRadius: 12, padding: '16px', border: '1px solid rgba(51,65,85,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, background: 'rgba(245,158,11,0.15)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Shield size={14} color="#f59e0b" />
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</div>
                <div style={{ fontSize: 16, color: '#94a3b8', marginTop: 2, letterSpacing: '2px' }}>••••••••</div>
              </div>
            </div>
            <Link to="/change-password" id="change-password-link" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8, padding: '6px 12px', color: '#f59e0b', fontSize: 12, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Lock size={12} /> Change
            </Link>
          </div>

          {/* Member Since */}
          <div style={{ background: 'rgba(15,23,42,0.5)', borderRadius: 12, padding: '16px', border: '1px solid rgba(51,65,85,0.4)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, background: 'rgba(16,185,129,0.15)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Calendar size={14} color="#10b981" />
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Member Since</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9', marginTop: 2 }}>{formatDate(profile?.createdAt)}</div>
            </div>
          </div>

          {/* Last Updated */}
          <div style={{ background: 'rgba(15,23,42,0.5)', borderRadius: 12, padding: '16px', border: '1px solid rgba(51,65,85,0.4)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, background: 'rgba(59,130,246,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Clock size={14} color="#3b82f6" />
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Last Updated</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9', marginTop: 2 }}>{formatDate(profile?.updatedAt)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link to="/change-password" className="btn-secondary" style={{ textDecoration: 'none', flex: 1, justifyContent: 'center', minWidth: 160 }}>
          <Lock size={15} /> Change Password
        </Link>
        <button id="profile-logout-btn" onClick={logout} className="btn-danger" style={{ flex: 1, justifyContent: 'center', minWidth: 160 }}>
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </div>
  );
}
