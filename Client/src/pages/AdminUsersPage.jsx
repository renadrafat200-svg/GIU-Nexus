import { useState, useEffect } from 'react'
import api from '../services/api'

const AdminUsersPage = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState({ role: '', status: '' })
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(filter)
    api.get(`/users?${params}`)
      .then(res => setUsers(res.data.users || []))
      .catch(() => setError('Failed to load users.'))
      .finally(() => setLoading(false))
  }, [filter])

  const handleDelete = async (userId) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return
    try {
      await api.delete(`/users/${userId}`)
      setUsers(users.filter(u => u._id !== userId))
    } catch { alert('Failed to delete user.') }
  }

  const handleStatus = async (userId, status) => {
    setUpdating(userId)
    try {
      await api.patch(`/users/${userId}`, { status })
      setUsers(users.map(u => u._id === userId ? { ...u, status } : u))
    } catch { alert('Failed to update status.') }
    finally { setUpdating(null) }
  }

  const roleColor = { jobSeeker: '#3498db', recruiter: '#8e44ad', admin: '#e94560' }
  const statusColor = { approved: '#27ae60', pending: '#f39c12', rejected: '#e94560' }

  return (
    <div style={styles.wrapper}>
      <div style={styles.bubble1} />
      <div style={styles.bubble2} />

      <div style={styles.inner}>
        <h1 style={styles.pageTitle}>👥 Manage Users</h1>
        <p style={styles.pageSub}>View and manage all platform users</p>

        {/* Filters */}
        <div className="glass-card fade-in" style={styles.filterRow}>
          <select className="input-field" style={styles.filterInput}
            value={filter.role} onChange={e => setFilter({ ...filter, role: e.target.value })}>
            <option value="">All Roles</option>
            <option value="jobSeeker">Job Seekers</option>
            <option value="recruiter">Recruiters</option>
            <option value="admin">Admins</option>
          </select>
          <select className="input-field" style={styles.filterInput}
            value={filter.status} onChange={e => setFilter({ ...filter, status: e.target.value })}>
            <option value="">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {loading && <p style={styles.center}>Loading users...</p>}
        {error && <p className="error-text" style={styles.center}>{error}</p>}

        <div style={styles.list}>
          {users.map(user => (
            <div key={user._id} className="glass-card fade-in" style={styles.card}>
              <div style={styles.cardLeft}>
                <div style={styles.avatarFallback}>{user.name?.[0]?.toUpperCase()}</div>
                <div>
                  <h3 style={styles.name}>{user.name}</h3>
                  <p style={styles.email}>📧 {user.email}</p>
                  <div style={styles.badgeRow}>
                    <span style={{ ...styles.badge, background: roleColor[user.role] || '#9999BB' }}>{user.role}</span>
                    <span style={{ ...styles.badge, background: statusColor[user.status] || '#9999BB' }}>{user.status}</span>
                  </div>
                  <p style={styles.date}>Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div style={styles.cardRight}>
                {user.role === 'recruiter' && user.status === 'pending' && (
                  <div style={styles.btnGroup}>
                    <button className="btn-primary" style={{ ...styles.actionBtn, background: '#27ae60' }}
                      onClick={() => handleStatus(user._id, 'approved')} disabled={updating === user._id}>
                      ✅ Approve
                    </button>
                    <button className="btn-primary" style={{ ...styles.actionBtn, background: '#e94560' }}
                      onClick={() => handleStatus(user._id, 'rejected')} disabled={updating === user._id}>
                      ❌ Reject
                    </button>
                  </div>
                )}
                <button className="btn-primary" style={{ ...styles.actionBtn, background: '#c0392b' }}
                  onClick={() => handleDelete(user._id)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {!loading && users.length === 0 && (
          <p style={styles.center}>No users found for the selected filters.</p>
        )}
      </div>
    </div>
  )
}

const styles = {
  wrapper: { minHeight: '90vh', padding: '2rem', position: 'relative' },
  bubble1: {
    position: 'fixed', width: '280px', height: '280px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,182,215,0.4), rgba(200,160,228,0.15))',
    top: '5%', right: '5%', filter: 'blur(2px)', pointerEvents: 'none', zIndex: 0,
    animation: 'float1 7s ease-in-out infinite',
  },
  bubble2: {
    position: 'fixed', width: '200px', height: '200px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,107,157,0.3), rgba(180,140,220,0.1))',
    bottom: '10%', left: '5%', filter: 'blur(2px)', pointerEvents: 'none', zIndex: 0,
    animation: 'float2 9s ease-in-out infinite',
  },
  inner: { maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 },
  pageTitle: { fontSize: '2.2rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '0.4rem' },
  pageSub: { color: '#9999BB', marginBottom: '1.5rem' },
  filterRow: { display: 'flex', gap: '1rem', padding: '1.2rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  filterInput: { flex: 1, minWidth: '160px', marginBottom: 0 },
  list: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  card: { padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' },
  cardLeft: { display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 },
  avatarFallback: {
    width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0,
    background: 'linear-gradient(135deg, #e94560, #c0396e)',
    color: '#fff', fontSize: '1.2rem', fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  name: { fontSize: '1rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '0.2rem' },
  email: { color: '#9999BB', fontSize: '0.85rem', marginBottom: '0.4rem' },
  badgeRow: { display: 'flex', gap: '0.4rem', marginBottom: '0.3rem' },
  badge: { color: '#fff', fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '20px' },
  date: { color: '#9999BB', fontSize: '0.8rem' },
  cardRight: { display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' },
  btnGroup: { display: 'flex', gap: '0.5rem' },
  actionBtn: { padding: '0.4rem 0.9rem', fontSize: '0.82rem', borderRadius: '8px' },
  center: { textAlign: 'center', padding: '3rem', color: '#9999BB' },
}

export default AdminUsersPage
