import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserInfo, updateUser } from '../../api/user';
import type { UserInfo } from '../../api/user';
import './index.css';

type EditField = 'username' | 'password' | 'email' | 'phone' | null;

const Account: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<EditField>(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; isError: boolean } | null>(null);

  const fetchUser = async () => {
    try {
      const res = await getUserInfo();
      if (res.data.code === 200) {
        setUser(res.data.data);
      } else {
        setError('Failed to load user info');
      }
    } catch {
      setError('Failed to load user info');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUser(); }, []);

  const showToast = (msg: string, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 2500);
  };

  const startEdit = (field: EditField) => {
    if (!field || !user) return;
    setEditing(field);
    if (field === 'password') {
      setEditValue('');
    } else {
      setEditValue(user[field] || '');
    }
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditValue('');
  };

  const handleSave = async () => {
    if (!editing || !editValue.trim()) return;
    setSaving(true);
    try {
      await updateUser({ [editing]: editValue.trim() });
      showToast('Updated successfully!');
      setEditing(null);
      setEditValue('');
      // Refresh user data
      const res = await getUserInfo();
      if (res.data.code === 200) setUser(res.data.data);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Update failed';
      showToast(msg, true);
    } finally {
      setSaving(false);
    }
  };

  // SVG Icons
  const UserIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );

  const LockIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );

  const MailIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );

  const PhoneIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );

  const PencilIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );

  const renderCard = (
    field: 'username' | 'password' | 'email' | 'phone',
    label: string,
    value: string,
    icon: React.ReactNode,
    colorClass: string,
    isMasked = false
  ) => {
    const isEditing = editing === field;

    return (
      <div className="bento-card" key={field}>
        <div className="bento-card-header">
          <div className={`bento-card-icon ${colorClass}`}>{icon}</div>
          {!isEditing && (
            <button className="bento-edit-btn" onClick={() => startEdit(field)} title={`Edit ${label}`}>
              <PencilIcon />
            </button>
          )}
        </div>
        <div className="bento-card-label">{label}</div>
        {isEditing ? (
          <>
            <input
              className="bento-edit-input"
              type={field === 'password' ? 'password' : 'text'}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder={field === 'password' ? 'Enter new password' : `Enter ${label.toLowerCase()}`}
              autoFocus
              onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') cancelEdit(); }}
            />
            <div className="bento-edit-row">
              <button className="bento-cancel-btn" onClick={cancelEdit}>Cancel</button>
              <button className="bento-save-btn" onClick={handleSave} disabled={saving || !editValue.trim()}>
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </>
        ) : (
          <div className={`bento-card-value${isMasked ? ' masked' : ''}`}>
            {isMasked ? '●●●●●●●●' : value || '—'}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="account-page">
        <div className="account-loading">Loading account info...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="account-page">
        <div className="account-error">{error || 'User not found'}</div>
      </div>
    );
  }

  return (
    <div className="account-page">
      <nav className="account-nav">
        <Link to="/mall" className="account-nav-back">← Back to Mall</Link>
        <span className="account-nav-title">Account</span>
        <span style={{ width: 80 }} />
      </nav>

      <main className="account-main">
        <h1 className="account-heading">My Account</h1>
        <p className="account-subheading">Manage your personal information</p>

        <div className="bento-grid">
          {renderCard('username', 'Username', user.username, <UserIcon />, 'username')}
          {renderCard('password', 'Password', '', <LockIcon />, 'password', true)}
          {renderCard('email', 'Email', user.email, <MailIcon />, 'email')}
          {renderCard('phone', 'Phone', user.phone, <PhoneIcon />, 'phone')}
        </div>

        <button
          className="account-logout-btn"
          onClick={() => {
            localStorage.removeItem('token');
            navigate('/login');
          }}
        >
          Log out
        </button>
      </main>

      {toast && (
        <div className={`account-toast${toast.isError ? ' error' : ''}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
};

export default Account;
