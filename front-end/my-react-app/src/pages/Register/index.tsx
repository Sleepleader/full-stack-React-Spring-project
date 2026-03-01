import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../api/auth';
import type { RegisterFormErrors } from '../../types';
import amazonLogo from '../../assets/amazon-logo.png';
import './index.css';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const validate = (): boolean => {
    const newErrors: RegisterFormErrors = {};

    if (!username.trim()) {
      newErrors.username = 'Please enter username';
    } else if (username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters long';
    }

    // if (!password) {
    //   newErrors.password = '请输入密码';
    // } else if (password.length < 6) {
    //   newErrors.password = '密码至少6个字符';
    // }
    //
    // if (!confirmPassword) {
    //   newErrors.confirmPassword = '请确认密码';
    // } else if (password !== confirmPassword) {
    //   newErrors.confirmPassword = '两次输入的密码不一致';
    // }
    //
    // if (!email.trim()) {
    //   newErrors.email = '请输入邮箱';
    // } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    //   newErrors.email = '请输入有效的邮箱地址';
    // }
    //
    // if (!phone.trim()) {
    //   newErrors.phone = '请输入手机号';
    // } else if (!/^1[3-9]\d{9}$/.test(phone.trim())) {
    //   newErrors.phone = '请输入有效的手机号';
    // }
    if (!password) {
      newErrors.password = 'Please enter your password';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'The two entered passwords do not match';
    }

    if (!email.trim()) {
      newErrors.email = 'Please enter your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Please enter your phone number';
    } else if (!/^1[3-9]\d{9}$/.test(phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError('');
    setSuccessMsg('');

    if (!validate()) return;

    setLoading(true);
    try {
      await register({
        username: username.trim(),
        password,
        confirmPassword,
        email: email.trim(),
        phone: phone.trim(),
      });

  //     setSuccessMsg('注册成功！即将跳转到登录页面...');
  //     setTimeout(() => {
  //       navigate('/login');
  //     }, 2000);
  //   } catch (error) {
  //     const errMsg =
  //       error instanceof Error ? error.message : '注册失败，请稍后重试';
  //     setApiError(errMsg);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
      setSuccessMsg('Registration successful! Redirecting to the login page...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      const errMsg =
          error instanceof Error ? error.message : 'Registration failed, please try again later';
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
            <h2 className="auth-title">Create Account</h2>
          </div>

          {apiError && <div className="auth-error-banner">{apiError}</div>}
          {successMsg && <div className="auth-success-banner">{successMsg}</div>}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Please enter your username (at least 3 characters)"
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
                  placeholder="Please enter your password (at least 6 characters)"
                  className={errors.password ? 'input-error' : ''}
                  autoComplete="new-password"
              />
              {errors.password && (
                  <span className="field-error">{errors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Please re-enter your password"
                  className={errors.confirmPassword ? 'input-error' : ''}
                  autoComplete="new-password"
              />
              {errors.confirmPassword && (
                  <span className="field-error">{errors.confirmPassword}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Please enter your email address"
                  className={errors.email ? 'input-error' : ''}
                  autoComplete="email"
              />
              {errors.email && (
                  <span className="field-error">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Please enter your phone number"
                  className={errors.phone ? 'input-error' : ''}
                  autoComplete="tel"
              />
              {errors.phone && (
                  <span className="field-error">{errors.phone}</span>
              )}
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account? <Link to="/login">Log in now</Link>
            </p>
          </div>
        </div>
      </div>
  );
};

export default Register;
