// src/pages/Dashboard.jsx
import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import TaskModal from '../components/TaskModal';

const STATUSES = ['', 'pending', 'in_progress', 'completed'];

const Badge = ({ status }) => (
  <span className={`badge badge-${status}`}>
    {status.replace('_', ' ')}
  </span>
);

export default function Dashboard() {
  const { user } = useAuth();

  const [tasks, setTasks]         = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage]           = useState(1);
  const [statusFilter, setStatus] = useState('');
  const [loading, setLoading]     = useState(true);
  const [feedback, setFeedback]   = useState(null);   // { type, msg }
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask]   = useState(null);

  // ── Fetch tasks ────────────────────────────────────
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 8 };
      if (statusFilter) params.status = statusFilter;
      const { data } = await api.get('/tasks', { params });
      setTasks(data.data);
      setPagination(data.pagination);
    } catch (err) {
      showFeedback('error', err.response?.data?.message || 'Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const showFeedback = (type, msg) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 3500);
  };

  // ── Create ─────────────────────────────────────────
  const handleCreate = async (form) => {
    try {
      await api.post('/tasks', { title: form.title, description: form.description });
      setShowModal(false);
      showFeedback('success', 'Task created!');
      setPage(1);
      fetchTasks();
    } catch (err) {
      return { error: err.response?.data?.message || 'Create failed.' };
    }
  };

  // ── Update ─────────────────────────────────────────
  const handleUpdate = async (form) => {
    try {
      await api.patch(`/tasks/${editTask.id}`, form);
      setEditTask(null);
      showFeedback('success', 'Task updated!');
      fetchTasks();
    } catch (err) {
      return { error: err.response?.data?.message || 'Update failed.' };
    }
  };

  // ── Delete ─────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      showFeedback('success', 'Task deleted.');
      fetchTasks();
    } catch (err) {
      showFeedback('error', err.response?.data?.message || 'Delete failed.');
    }
  };

  return (
    <div className="container page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>My Tasks</h1>
          <p style={{ color: 'var(--muted)', fontSize: '.9rem', marginTop: '.2rem' }}>
            {pagination.total || 0} total tasks
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + New Task
        </button>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div className={`alert alert-${feedback.type === 'error' ? 'error' : 'success'}`}>
          {feedback.msg}
        </div>
      )}

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: '.6rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {STATUSES.map(s => (
          <button
            key={s}
            className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => { setStatus(s); setPage(1); }}
          >
            {s === '' ? 'All' : s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Task table */}
      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>Loading...</p>
        ) : tasks.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '.5rem' }}>No tasks yet</p>
            <p style={{ color: 'var(--muted)' }}>Click "+ New Task" to get started.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((t, i) => (
                  <tr key={t.id}>
                    <td style={{ color: 'var(--muted)', fontSize: '.85rem' }}>
                      {(page - 1) * 8 + i + 1}
                    </td>
                    <td><strong>{t.title}</strong></td>
                    <td style={{ color: 'var(--muted)', maxWidth: '220px' }}>
                      {t.description
                        ? t.description.length > 60
                          ? t.description.slice(0, 60) + '…'
                          : t.description
                        : '—'}
                    </td>
                    <td><Badge status={t.status} /></td>
                    <td style={{ fontSize: '.85rem', color: 'var(--muted)' }}>
                      {new Date(t.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '.4rem' }}>
                        <button
                          className="btn btn-sm btn-ghost"
                          onClick={() => setEditTask(t)}
                        >Edit</button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(t.id)}
                        >Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '.5rem', marginTop: '1rem' }}>
          <button className="btn btn-sm btn-ghost" disabled={page === 1}
            onClick={() => setPage(p => p - 1)}>← Prev</button>
          <span style={{ padding: '.35rem .8rem', fontSize: '.9rem', color: 'var(--muted)' }}>
            Page {page} of {pagination.totalPages}
          </span>
          <button className="btn btn-sm btn-ghost" disabled={page === pagination.totalPages}
            onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}

      {/* Modals */}
      {showModal && <TaskModal onClose={() => setShowModal(false)} onSubmit={handleCreate} />}
      {editTask  && <TaskModal onClose={() => setEditTask(null)} onSubmit={handleUpdate} initial={editTask} />}
    </div>
  );
}
