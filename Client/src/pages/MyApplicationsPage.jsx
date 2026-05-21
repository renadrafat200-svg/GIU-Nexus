import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

const MyApplicationsPage = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/applications/my')
      .then(res => setApplications(res.data.applications || []))
      .catch(() => setError('Failed to load applications.'))
      .finally(() => setLoading(false))
  }, [])

  const statusColor = { pending: '#f39c12', shortlisted: '#27ae60', rejected: '#e94560' }
  const statusIcon  = { pending: '⏳',      shortlisted: '✅',       rejected: '❌'      }

  return (
    <div style={styles.wrapper}>
      <div style={styles.bubble1} />
      <div style={styles.bubble2} />

      <div style={styles.inner}>
        <h1 style={styles.pageTitle}>📋 My Applications</h1>
        <p style={styles.pageSub}>Track the status of your job applications</p>

        {loading && <p style={styles.center}>Loading applications...</p>}
        {error && <p className="error-text" style={styles.center}>{error}</p>}

        {!loading && !error && applications.length === 0 && (
          <div className="glass-card fade-in" style={styles.emptyCard}>
            <p style={styles.emptyIcon}>📭</p>
            <p style={styles.emptyTitle}>No applications yet</p>
            <p style={styles.emptySub}>Start applying to jobs and track your progress here.</p>
            <Link to="/jobs" className="btn-primary" style={styles.emptyBtn}>Browse Jobs</Link>
          </div>
        )}

        <div style={styles.list}>
          {applications.map(app => (
            <div key={app._id} className="glass-card fade-in" style={styles.card}>
              <div style={styles.cardLeft}>
                <div style={styles.statusDot(statusColor[app.status])} />
                <div>
                  <h3 style={styles.jobTitle}>{app.job?.title || 'Job Removed'}</h3>
                  <p style={styles.company}>🏢 {app.job?.company || '—'}</p>
                  <p style={styles.location}>📍 {app.job?.location || '—'}</p>
                  {app.coverLetter && (
                    <p style={styles.coverLetter}>
                      💬 <span style={styles.coverText}>"{app.coverLetter.slice(0, 80)}{app.coverLetter.length > 80 ? '...' : ''}"</span>
                    </p>
                  )}
                </div>
              </div>
              <div style={styles.cardRight}>
                <span style={{ ...styles.statusBadge, background: statusColor[app.status] }}>
                  {statusIcon[app.status]} {app.status}
                </span>
                <p style={styles.date}>{new Date(app.createdAt).toLocaleDateString()}</p>
                {app.job?._id && (
                  <Link to={`/jobs/${app.job._id}`} style={styles.viewLink}>View Job →</Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {applications.length > 0 && (
          <div style={styles.summaryRow}>
            {['pending', 'shortlisted', 'rejected'].map(s => (
              <div key={s} className="glass-card" style={styles.summaryCard}>
                <span style={{ fontSize: '1.5rem' }}>{statusIcon[s]}</span>
                <span style={{ ...styles.summaryCount, color: statusColor[s] }}>
                  {applications.filter(a => a.status === s).length}
                </span>
                <span style={styles.summaryLabel}>{s}</span>
              </div>
            ))}
          </div>
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
  inner: { maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 },
  pageTitle: { fontSize: '2.2rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '0.4rem' },
  pageSub: { color: '#9999BB', marginBottom: '2rem' },
  list: { display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' },
  card: { padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' },
  cardLeft: { display: 'flex', gap: '1rem', alignItems: 'flex-start', flex: 1 },
  statusDot: (color) => ({ width: '10px', height: '10px', borderRadius: '50%', background: color, marginTop: '6px', flexShrink: 0 }),
  jobTitle: { fontSize: '1.1rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '0.3rem' },
  company: { color: '#555', fontSize: '0.9rem', marginBottom: '0.2rem' },
  location: { color: '#9999BB', fontSize: '0.85rem', marginBottom: '0.4rem' },
  coverLetter: { fontSize: '0.85rem', color: '#9999BB', marginTop: '0.4rem' },
  coverText: { fontStyle: 'italic' },
  cardRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' },
  statusBadge: { color: '#fff', fontSize: '0.78rem', fontWeight: 600, padding: '0.3rem 0.8rem', borderRadius: '20px' },
  date: { color: '#9999BB', fontSize: '0.82rem' },
  viewLink: { color: '#e94560', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none' },
  center: { textAlign: 'center', padding: '3rem 0', color: '#9999BB' },
  emptyCard: { padding: '3rem', textAlign: 'center', maxWidth: '480px', margin: '2rem auto' },
  emptyIcon: { fontSize: '3rem', marginBottom: '1rem' },
  emptyTitle: { fontSize: '1.3rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '0.5rem' },
  emptySub: { color: '#9999BB', marginBottom: '1.5rem', lineHeight: 1.6 },
  emptyBtn: { padding: '0.75rem 2rem', borderRadius: '10px', textDecoration: 'none', display: 'inline-block' },
  summaryRow: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' },
  summaryCard: { padding: '1.2rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center' },
  summaryCount: { fontSize: '1.8rem', fontWeight: 700 },
  summaryLabel: { color: '#9999BB', fontSize: '0.85rem', textTransform: 'capitalize' },
}

export default MyApplicationsPage
