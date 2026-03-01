import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../api/auth';
import type { LoginFormErrors } from '../../types';
import amazonLogo from '../../assets/amazon-logo.png';
import './index.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = (): boolean => {
    const newErrors: LoginFormErrors = {};

    if (!username.trim()) {
      newErrors.username = 'Please enter your username';
    }

    if (!password.trim()) {
      newErrors.password = 'Please enter your password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError('');

    if (!validate()) return;

    setLoading(true);
    try {
      const response = await login({ username: username.trim(), password });
      const resData = response.data;

      // Check business logic response code
      if (resData.code !== 200) {
        setApiError(resData.message || 'Login failed, please try again later');
        return;
      }

      // Store token in localStorage
      if (resData.data?.token) {
        localStorage.setItem('token', resData.data.token);
      }

      // Redirect to mall page after successful login
      navigate('/mall');
    } catch (error) {
      const errMsg =
        error instanceof Error ? error.message : 'Login failed, please try again later';
      setApiError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <img src={amazonLogo} alt="Logo" className="auth-logo" />
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Login</h2>
        </div>

        {apiError && <div className="auth-error-banner">{apiError}</div>}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Please enter your username"
              className={errors.username ? 'input-error' : ''}
              autoComplete="username"
            />
            {errors.username && (
              <span className="field-error">{errors.username}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Please enter your password"
              className={errors.password ? 'input-error' : ''}
              autoComplete="current-password"
            />
            {errors.password && (
              <span className="field-error">{errors.password}</span>
            )}
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an username ? <Link to="/register">Register now</Link>
          </p>
          <p className="admin-login-hint">
           Are you administrator ? <Link to="/admin-login">Log in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
