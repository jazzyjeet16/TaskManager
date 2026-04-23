// src/pages/AdminPanel.jsx
import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Badge = ({ status }) => (
  <span className={`badge badge-${status}`}>{status.replace('_', ' ')}</span>
);

export default function AdminPanel() {
  const { user } = useAuth();

  const [tab, setTab]           = useState('users');   // 'users' | 'tasks'
  const [users, setUsers]       = useState([]);
  const [tasks, setTasks]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [feedback, setFeedback] = useState(null);

  const showFeedback = (type, msg) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 3000);
  };

  // ── Fetch Users ────────────────────────────────────
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/users', { params: { limit: 50 } });
      setUsers(data.data);
    } catch (err) {
      showFeedback('error', 'Failed to load users.');
    } finally { setLoading(false); }
  };

  // ── Fetch Tasks ────────────────────────────────────
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/tasks', { params: { limit: 50 } });
      setTasks(data.data);
    } catch (err) {
      showFeedback('error', 'Failed to load tasks.');
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (tab === 'users') fetchUsers();
    else fetchTasks();
  }, [tab]);

  // ── Delete User ────────────────────────────────────
  const handleDeleteUser = async (id) => {
    if (!confirm('Delete this user and ALL their tasks?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      showFeedback('success', 'User deleted.');
      fetchUsers();
    } catch (err) {
      showFeedback('error', err.response?.data?.message || 'Delete failed.');
    }
  };

  return (
    <div className="container page">
      <div className="page-header">
        <div>
          <h1>🛡️ Admin Panel</h1>
          <p style={{ color: 'var(--muted)', fontSize: '.9rem' }}>Logged in as <strong>{user.email}</strong></p>
        </div>
      </div>

      {feedback && (
        <div className={`alert alert-${feedback.type === 'error' ? 'error' : 'success'}`}>
          {feedback.msg}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '.6rem', marginBottom: '1.2rem' }}>
        {['users', 'tasks'].map(t => (
          <button key={t}
            className={`btn btn-sm ${tab === t ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setTab(t)}
          >
            {t === 'users' ? '👥 All Users' : '📋 All Tasks'}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: 'var(--muted)' }}>Loading...</p>
      ) : tab === 'users' ? (
        // ── Users table ────────────────────────────────
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th><th>Name</th><th>Email</th><th>Role</th>
                  <th>Joined</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0
                  ? <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--muted)' }}>No users.</td></tr>
                  : users.map(u => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge badge-${u.role === 'admin' ? 'in_progress' : 'pending'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ fontSize: '.85rem', color: 'var(--muted)' }}>
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td>
                        {u.id !== user.id && (
                          <button className="btn btn-sm btn-danger" onClick={() => handleDeleteUser(u.id)}>
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // ── Tasks table ────────────────────────────────
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th><th>Title</th><th>Status</th>
                  <th>Owner</th><th>Created</th>
                </tr>
              </thead>
              <tbody>
                {tasks.length === 0
                  ? <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)' }}>No tasks.</td></tr>
                  : tasks.map(t => (
                    <tr key={t.id}>
                      <td>{t.id}</td>
                      <td><strong>{t.title}</strong></td>
                      <td><Badge status={t.status} /></td>
                      <td style={{ fontSize: '.85rem' }}>
                        {t.user_name}<br />
                        <span style={{ color: 'var(--muted)' }}>{t.user_email}</span>
                      </td>
                      <td style={{ fontSize: '.85rem', color: 'var(--muted)' }}>
                        {new Date(t.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
