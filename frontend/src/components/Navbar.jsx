// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/dashboard" className="navbar-brand">✅ TaskManager</Link>
        <div className="navbar-links">
          {user ? (
            <>
              <span style={{ color: 'var(--muted)', fontSize: '.9rem' }}>
                Hi, <strong>{user.name}</strong>
                {user.role === 'admin' && (
                  <span className="badge badge-in_progress" style={{ marginLeft: '.4rem' }}>admin</span>
                )}
              </span>
              {user.role === 'admin' && (
                <Link to="/admin" className="btn btn-ghost btn-sm">Admin Panel</Link>
              )}
              <button onClick={handleLogout} className="btn btn-sm" style={{ background: '#fee2e2', color: 'var(--danger)' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
