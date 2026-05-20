import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'

const ApplicantsPage = () => {
  const { jobId } = useParams()
  const [applicants, setApplicants] = useState([])
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    Promise.all([
      api.get(`/jobs/${jobId}/applicants`),
      api.get(`/jobs/${jobId}`)
    ]).then(([appRes, jobRes]) => {
      setApplicants(appRes.data.applicants || [])
      setJob(jobRes.data.job)
    }).catch(() => setError('Failed to load applicants.'))
      .finally(() => setLoading(false))
  }, [jobId])

  const handleStatus = async (appId, status) => {
    setUpdating(appId)
    try {
      await api.patch(`/applications/${appId}/status`, { status })
      setApplicants(applicants.map(a => a._id === appId ? { ...a, status } : a))
    } catch {
      alert('Failed to update status.')
    } finally {
      setUpdating(null)
    }
  }

  const statusColor = { pending: '#f39c12', shortlisted: '#27ae60', rejected: '#e94560' }
  const statusIcon  = { pending: '⏳',      shortlisted: '✅',       rejected: '❌'      }

  return (
    <div style={styles.wrapper}>
      <div style={styles.bubble1} />
      <div style={styles.bubble2} />

      <div style={styles.inner}>
        <Link to="/recruiter/dashboard" style={styles.back}>← Back to Dashboard</Link>
        <h1 style={styles.pageTitle}>👥 Applicants</h1>
        {job && <p style={styles.pageSub}>for <strong>{job.title}</strong> at {job.company}</p>}

        {loading && <p style={styles.center}>Loading applicants...</p>}
        {error && <p className="error-text" style={styles.center}>{error}</p>}

        {!loading && !error && applicants.length === 0 && (
          <div className="glass-card fade-in" style={styles.emptyCard}>
            <p style={styles.emptyIcon}>👤</p>
            <p style={styles.emptyTitle}>No applicants yet</p>
            <p style={styles.emptySub}>Share your job posting to attract candidates.</p>
          </div>
        )}

        {applicants.length > 0 && (
          <div style={styles.summaryRow}>
            {['pending', 'shortlisted', 'rejected'].map(s => (
              <div key={s} className="glass-card" style={styles.summaryCard}>
                <span style={{ fontSize: '1.3rem' }}>{statusIcon[s]}</span>
                <span style={{ ...styles.summaryCount, color: statusColor[s] }}>
                  {applicants.filter(a => a.status === s).length}
                </span>
                <span style={styles.summaryLabel}>{s}</span>
              </div>
            ))}
          </div>
        )}

        <div style={styles.list}>
          {applicants.map(app => (
            <div key={app._id} className="glass-card fade-in" style={styles.card}>
              <div style={styles.cardLeft}>
                <div style={styles.avatarFallback}>
                  {app.user?.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <h3 style={styles.name}>{app.user?.name || 'Unknown'}</h3>
                  <p style={styles.email}>📧 {app.user?.email || '—'}</p>
                  {app.user?.skills?.length > 0 && (
                    <div style={styles.skillsWrap}>
                      {app.user.skills.slice(0, 4).map((s, i) => (
                        <span key={i} style={styles.skillTag}>{s}</span>
                      ))}
                      {app.user.skills.length > 4 && (
                        <span style={styles.skillTag}>+{app.user.skills.length - 4}</span>
                      )}
                    </div>
                  )}
                  {app.coverLetter && (
                    <p style={styles.coverLetter}>
                      💬 <em>"{app.coverLetter.slice(0, 100)}{app.coverLetter.length > 100 ? '...' : ''}"</em>
                    </p>
                  )}
                  <p style={styles.date}>Applied {new Date(app.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div style={styles.cardRight}>
                <span style={{ ...styles.statusBadge, background: statusColor[app.status] }}>
                  {statusIcon[app.status]} {app.status}
                </span>
                <div style={styles.btnGroup}>
                  <button
                    className="btn-primary"
                    style={{ ...styles.actionBtn, background: '#27ae60', opacity: app.status === 'shortlisted' ? 0.5 : 1 }}
                    onClick={() => handleStatus(app._id, 'shortlisted')}
                    disabled={updating === app._id || app.status === 'shortlisted'}
                  >✅ Shortlist</button>
                  <button
                    className="btn-primary"
                    style={{ ...styles.actionBtn, background: '#e94560', opacity: app.status === 'rejected' ? 0.5 : 1 }}
                    onClick={() => handleStatus(app._id, 'rejected')}
                    disabled={updating === app._id || app.status === 'rejected'}
                  >❌ Reject</button>
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
  back: { color: '#9999BB', fontSize: '0.9rem', display: 'inline-block', marginBottom: '1rem', textDecoration: 'none' },
  pageTitle: { fontSize: '2.2rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '0.3rem' },
  pageSub: { color: '#9999BB', marginBottom: '1.5rem' },
  summaryRow: { display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  summaryCard: { padding: '1rem 1.8rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.2rem', alignItems: 'center' },
  summaryCount: { fontSize: '1.6rem', fontWeight: 700 },
  summaryLabel: { color: '#9999BB', fontSize: '0.82rem', textTransform: 'capitalize' },
  list: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  card: { padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' },
  cardLeft: { display: 'flex', gap: '1rem', alignItems: 'flex-start', flex: 1 },
  avatarFallback: {
    width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0,
    background: 'linear-gradient(135deg, #e94560, #c0396e)',
    color: '#fff', fontSize: '1.2rem', fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  name: { fontSize: '1rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '0.2rem' },
  email: { color: '#9999BB', fontSize: '0.85rem', marginBottom: '0.4rem' },
  skillsWrap: { display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.4rem' },
  skillTag: {
    background: 'rgba(233,69,96,0.08)', color: '#e94560',
    border: '1px solid rgba(233,69,96,0.2)',
    borderRadius: '20px', padding: '0.2rem 0.6rem', fontSize: '0.78rem', fontWeight: 600,
  },
  coverLetter: { color: '#9999BB', fontSize: '0.83rem', marginBottom: '0.3rem' },
  date: { color: '#9999BB', fontSize: '0.8rem' },
  cardRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.8rem' },
  statusBadge: { color: '#fff', fontSize: '0.78rem', fontWeight: 600, padding: '0.3rem 0.8rem', borderRadius: '20px' },
  btnGroup: { display: 'flex', gap: '0.5rem' },
  actionBtn: { padding: '0.4rem 0.9rem', fontSize: '0.82rem', borderRadius: '8px', border: 'none', cursor: 'pointer', color: '#fff', fontWeight: 600 },
  center: { textAlign: 'center', padding: '3rem 0', color: '#9999BB' },
  emptyCard: { padding: '3rem', textAlign: 'center', maxWidth: '480px', margin: '2rem auto' },
  emptyIcon: { fontSize: '3rem', marginBottom: '1rem' },
  emptyTitle: { fontSize: '1.3rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '0.5rem' },
  emptySub: { color: '#9999BB', lineHeight: 1.6 },
}

export default ApplicantsPage
