import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminLogin } from '../../api/admin';
import amazonLogo from '../../assets/amazon-logo.png';
import '../Login/index.css';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError('');
    if (!username.trim() || !password.trim()) {
      setApiError('Please enter username and password');
      return;
    }
    setLoading(true);
    try {
      const res = await adminLogin({ username: username.trim(), password });
      if (res.data.code === 200) {
        localStorage.setItem('adminUser', JSON.stringify(res.data.data));
        navigate('/admin-dashboard');
      } else {
        setApiError(res.data.message || 'Login failed');
      }
    } catch (err: any) {
      setApiError(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <img src={amazonLogo} alt="Logo" className="auth-logo" />
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Administrator Login</h2>
        </div>

        {apiError && <div className="auth-error-banner">{apiError}</div>}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="admin-username">Username</label>
            <input
              id="admin-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Admin username"
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Not an admin? <Link to="/login">Back to User Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
