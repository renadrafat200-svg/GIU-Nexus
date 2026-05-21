import { useState, useEffect } from 'react'
import api from '../services/api'

const PendingRecruitersPage = () => {
  const [recruiters, setRecruiters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    api.get('/users?role=recruiter&status=pending')
      .then(res => setRecruiters(res.data.users || []))
      .catch(() => setError('Failed to load pending recruiters.'))
      .finally(() => setLoading(false))
  }, [])

  const handleStatus = async (userId, status) => {
    setUpdating(userId)
    try {
      await api.patch(`/users/${userId}`, { status })
      setRecruiters(recruiters.filter(r => r._id !== userId))
    } catch { alert('Failed to update status.') }
    finally { setUpdating(null) }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.bubble1} />
      <div style={styles.bubble2} />

      <div style={styles.inner}>
        <h1 style={styles.pageTitle}>⏳ Pending Recruiters</h1>
        <p style={styles.pageSub}>Review and approve recruiter account requests</p>

        {loading && <p style={styles.center}>Loading...</p>}
        {error && <p className="error-text" style={styles.center}>{error}</p>}

        {!loading && !error && recruiters.length === 0 && (
          <div className="glass-card fade-in" style={styles.emptyCard}>
            <p style={styles.emptyIcon}>🎉</p>
            <p style={styles.emptyTitle}>All caught up!</p>
            <p style={styles.emptySub}>No pending recruiter requests at the moment.</p>
          </div>
        )}

        {recruiters.length > 0 && (
          <div className="glass-card fade-in" style={styles.countCard}>
            <span style={styles.countNum}>{recruiters.length}</span>
            <span style={styles.countLabel}>pending {recruiters.length === 1 ? 'request' : 'requests'}</span>
          </div>
        )}

        <div style={styles.list}>
          {recruiters.map(recruiter => (
            <div key={recruiter._id} className="glass-card fade-in" style={styles.card}>
              <div style={styles.cardLeft}>
                <div style={styles.avatarFallback}>{recruiter.name?.[0]?.toUpperCase()}</div>
                <div>
                  <h3 style={styles.name}>{recruiter.name}</h3>
                  <p style={styles.email}>📧 {recruiter.email}</p>
                  {recruiter.bio && <p style={styles.bio}>"{recruiter.bio.slice(0, 120)}{recruiter.bio.length > 120 ? '...' : ''}"</p>}
                  <p style={styles.date}>Registered {new Date(recruiter.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div style={styles.cardRight}>
                <span style={styles.pendingBadge}>⏳ Pending</span>
                <div style={styles.btnGroup}>
                  <button
                    className="btn-primary"
                    style={{ ...styles.actionBtn, background: '#27ae60' }}
                    onClick={() => handleStatus(recruiter._id, 'approved')}
                    disabled={updating === recruiter._id}
                  >
                    ✅ Approve
                  </button>
                  <button
                    className="btn-primary"
                    style={{ ...styles.actionBtn, background: '#e94560' }}
                    onClick={() => handleStatus(recruiter._id, 'rejected')}
                    disabled={updating === recruiter._id}
                  >
                    ❌ Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
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
  inner: { maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 },
  pageTitle: { fontSize: '2.2rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '0.4rem' },
  pageSub: { color: '#9999BB', marginBottom: '1.5rem' },
  countCard: { padding: '1rem 2rem', marginBottom: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.8rem' },
  countNum: { fontSize: '2rem', fontWeight: 700, color: '#f39c12' },
  countLabel: { color: '#9999BB', fontSize: '0.9rem' },
  list: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  card: { padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' },
  cardLeft: { display: 'flex', gap: '1rem', alignItems: 'flex-start', flex: 1 },
  avatarFallback: {
    width: '52px', height: '52px', borderRadius: '50%', flexShrink: 0,
    background: 'linear-gradient(135deg, #e94560, #c0396e)',
    color: '#fff', fontSize: '1.3rem', fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  name: { fontSize: '1rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '0.2rem' },
  email: { color: '#9999BB', fontSize: '0.85rem', marginBottom: '0.3rem' },
  bio: { color: '#777', fontSize: '0.83rem', fontStyle: 'italic', marginBottom: '0.3rem', maxWidth: '400px', lineHeight: 1.5 },
  date: { color: '#9999BB', fontSize: '0.8rem' },
  cardRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.8rem' },
  pendingBadge: { background: '#f39c12', color: '#fff', fontSize: '0.78rem', fontWeight: 600, padding: '0.3rem 0.8rem', borderRadius: '20px' },
  btnGroup: { display: 'flex', gap: '0.5rem' },
  actionBtn: { padding: '0.5rem 1.1rem', fontSize: '0.85rem', borderRadius: '8px' },
  center: { textAlign: 'center', padding: '3rem', color: '#9999BB' },
  emptyCard: { padding: '3rem', textAlign: 'center', maxWidth: '480px', margin: '2rem auto' },
  emptyIcon: { fontSize: '3rem', marginBottom: '1rem' },
  emptyTitle: { fontSize: '1.3rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '0.5rem' },
  emptySub: { color: '#9999BB', lineHeight: 1.6 },
}

export default PendingRecruitersPage
