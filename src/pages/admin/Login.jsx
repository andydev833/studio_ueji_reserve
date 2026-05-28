import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Lock, User } from 'lucide-react';

export default function Login() {
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(userId, password)) {
      navigate('/admin');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card animate-fade-in-up">
        <h1 className="login-card__title">スタジオうえじ</h1>
        <p className="login-card__subtitle">管理画面ログイン</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" style={{ color: 'var(--a-text)' }}>
              <User size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
              ユーザーID
            </label>
            <input
              className="admin-form-input"
              type="text"
              value={userId}
              onChange={e => setUserId(e.target.value)}
              placeholder="admin"
              autoFocus
            />
          </div>
          <div className="form-group">
            <label className="form-label" style={{ color: 'var(--a-text)' }}>
              <Lock size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
              パスワード
            </label>
            <input
              className="admin-form-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="password"
            />
          </div>
          {error && <div className="form-error mb-md">{error}</div>}
          <button type="submit" className="admin-btn admin-btn--primary" style={{ width: '100%', padding: '14px', fontSize: 15 }}>
            ログイン
          </button>
        </form>
        <p style={{ fontSize: 11, color: 'var(--a-text-muted)', textAlign: 'center', marginTop: 16 }}>
          ID: admin / Pass: password
        </p>
      </div>
    </div>
  );
}
