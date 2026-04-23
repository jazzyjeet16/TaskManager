// src/components/TaskModal.jsx
import { useState, useEffect } from 'react';

export default function TaskModal({ onClose, onSubmit, initial }) {
  const [form, setForm]     = useState({ title: '', description: '', status: 'pending' });
  const [error, setError]   = useState('');
  const [saving, setSaving] = useState(false);

  // Pre-fill form when editing
  useEffect(() => {
    if (initial) setForm({ title: initial.title, description: initial.description || '', status: initial.status });
  }, [initial]);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSaving(true);
    const res = await onSubmit(form);
    setSaving(false);
    if (res?.error) setError(res.error);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h3>{initial ? 'Edit Task' : 'New Task'}</h3>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input name="title" value={form.title} onChange={handleChange}
              placeholder="Task title" required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              placeholder="Optional description..." rows={3}
              style={{ resize: 'vertical' }} />
          </div>
          {initial && (
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          )}
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : initial ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
