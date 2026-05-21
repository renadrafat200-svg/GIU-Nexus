import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const RecruiterDashboard = () => {
  const { user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/jobs/my-jobs')
      .then(res => setJobs(res.data.jobs || []))
      .catch(() => setError('Failed to load your job posts.'))
      .finally(() => setLoading(false))
  }, [])

  const totalApplicants = jobs.reduce((sum, j) => sum + (j.applicantCount || 0), 0)
  const openJobs = jobs.filter(j => j.status === 'open').length

  return (
    <div style={styles.wrapper}>
      <div style={styles.bubble1} />
      <div style={styles.bubble2} />

      <div style={styles.inner}>

        {user?.status === 'pending' && (
          <div style={styles.pendingBanner}>
            ⏳ Your recruiter account is pending admin approval. You cannot post jobs yet.
          </div>
        )}

        <div style={styles.header}>
          <div>
            <h1 style={styles.pageTitle}>📊 Recruiter Dashboard</h1>
            <p style={styles.pageSub}>Welcome back, {user?.name || 'Recruiter'}</p>
          </div>
          {user?.status !== 'pending' && (
            <Link to="/recruiter/jobs/create" className="btn-primary" style={styles.postBtn}>
              + Post a Job
            </Link>
          )}
        </div>

        {!loading && !error && (
          <div style={styles.statsRow}>
            <div className="glass-card" style={styles.statCard}>
              <span style={styles.statIcon}>📋</span>
              <span style={styles.statNum}>{jobs.length}</span>
              <span style={styles.statLabel}>Total Posts</span>
            </div>
            <div className="glass-card" style={styles.statCard}>
              <span style={styles.statIcon}>🟢</span>
              <span style={{ ...styles.statNum, color: '#27ae60' }}>{openJobs}</span>
              <span style={styles.statLabel}>Open</span>
            </div>
            <div className="glass-card" style={styles.statCard}>
              <span style={styles.statIcon}>👥</span>
              <span style={{ ...styles.statNum, color: '#e94560' }}>{totalApplicants}</span>
              <span style={styles.statLabel}>Total Applicants</span>
            </div>
          </div>
        )}

        {loading && <p style={styles.center}>Loading your posts...</p>}
        {error && <p className="error-text" style={styles.center}>{error}</p>}

        {!loading && !error && jobs.length === 0 && user?.status !== 'pending' && (
          <div className="glass-card fade-in" style={styles.emptyCard}>
            <p style={styles.emptyIcon}>📭</p>
            <p style={styles.emptyTitle}>No job posts yet</p>
            <p style={styles.emptySub}>Start hiring by creating your first job posting.</p>
            <Link to="/recruiter/jobs/create" className="btn-primary" style={styles.emptyBtn}>
              Post a Job
            </Link>
          </div>
        )}

        <div style={styles.list}>
          {jobs.map(job => (
            <div key={job._id} className="glass-card fade-in" style={styles.card}>
              <div style={styles.cardLeft}>
                <div>
                  <div style={styles.titleRow}>
                    <h3 style={styles.jobTitle}>{job.title}</h3>
                    <span style={{
                      ...styles.statusBadge,
                      background: job.status === 'open' ? '#27ae60' : '#9999BB'
                    }}>
                      {job.status}
                    </span>
                  </div>
                  <p style={styles.company}>🏢 {job.company}</p>
                  <p style={styles.meta}>📍 {job.location} · {job.type}</p>
                  {job.category && (
                    <span style={{ ...styles.categoryBadge, ...categoryColor(job.category) }}>
                      {job.category}
                    </span>
                  )}
                </div>
              </div>

              <div style={styles.cardRight}>
                <div style={styles.applicantCount}>
                  <span style={styles.countNum}>{job.applicantCount || 0}</span>
                  <span style={styles.countLabel}>Applicant{job.applicantCount !== 1 ? 's' : ''}</span>
                </div>
                <div style={styles.btnGroup}>
                  <Link
                    to={`/recruiter/applicants/${job._id}`}
                    className="btn-primary"
                    style={styles.actionBtn}
                  >
                    👥 View Applicants
                  </Link>
                  <Link
                    to={`/recruiter/jobs/${job._id}/edit`}
                    style={styles.editBtn}
                  >
                    ✏️ Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

const categoryColorMap = {
  'Frontend':         { background: 'rgba(39,174,96,0.12)',   color: '#27ae60', border: 'rgba(39,174,96,0.3)'   },
  'Backend':          { background: 'rgba(41,128,185,0.12)',  color: '#2980b9', border: 'rgba(41,128,185,0.3)'  },
  'AI/ML':            { background: 'rgba(142,68,173,0.12)',  color: '#8e44ad', border: 'rgba(142,68,173,0.3)'  },
  'DevOps':           { background: 'rgba(26,188,156,0.12)',  color: '#1abc9c', border: 'rgba(26,188,156,0.3)'  },
  'Data Engineering': { background: 'rgba(230,126,34,0.12)',  color: '#e67e22', border: 'rgba(230,126,34,0.3)'  },
  'Other':            { background: 'rgba(153,153,187,0.12)', color: '#9999BB', border: 'rgba(153,153,187,0.3)' },
}
const categoryColor = (cat) => {
  const c = categoryColorMap[cat] || categoryColorMap['Other']
  return { background: c.background, color: c.color, border: `1px solid ${c.border}` }
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
  pendingBanner: {
    background: 'rgba(243,156,18,0.15)', border: '1px solid rgba(243,156,18,0.4)',
    color: '#b7770d', borderRadius: '12px', padding: '1rem 1.5rem',
    marginBottom: '1.5rem', fontWeight: 600,
  },
  inner: { maxWidth: '960px', margin: '0 auto', position: 'relative', zIndex: 1 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' },
  pageTitle: { fontSize: '2.2rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '0.3rem' },
  pageSub: { color: '#9999BB' },
  postBtn: { padding: '0.75rem 1.8rem', borderRadius: '10px', textDecoration: 'none', display: 'inline-block', fontWeight: 600 },
  statsRow: { display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' },
  statCard: { flex: 1, minWidth: '140px', padding: '1.2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center' },
  statIcon: { fontSize: '1.5rem' },
  statNum: { fontSize: '2rem', fontWeight: 700, color: '#1A1A2E' },
  statLabel: { color: '#9999BB', fontSize: '0.85rem' },
  list: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  card: { padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' },
  cardLeft: { flex: 1 },
  titleRow: { display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.3rem', flexWrap: 'wrap' },
  jobTitle: { fontSize: '1.1rem', fontWeight: 700, color: '#1A1A2E' },
  statusBadge: { color: '#fff', fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.7rem', borderRadius: '20px' },
  company: { color: '#555', fontSize: '0.9rem', marginBottom: '0.2rem' },
  meta: { color: '#9999BB', fontSize: '0.85rem', marginBottom: '0.5rem' },
  categoryBadge: { fontSize: '0.78rem', fontWeight: 600, padding: '0.25rem 0.7rem', borderRadius: '20px', display: 'inline-block' },
  cardRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.8rem' },
  applicantCount: { textAlign: 'center' },
  countNum: { fontSize: '1.8rem', fontWeight: 700, color: '#e94560', display: 'block' },
  countLabel: { color: '#9999BB', fontSize: '0.8rem' },
  btnGroup: { display: 'flex', gap: '0.6rem', flexWrap: 'wrap' },
  actionBtn: { padding: '0.5rem 1rem', fontSize: '0.85rem', borderRadius: '8px', textDecoration: 'none', display: 'inline-block' },
  editBtn: { padding: '0.5rem 1rem', fontSize: '0.85rem', borderRadius: '8px', textDecoration: 'none', display: 'inline-block', color: '#9999BB', border: '1px solid rgba(153,153,187,0.3)' },
  center: { textAlign: 'center', padding: '3rem 0', color: '#9999BB' },
  emptyCard: { padding: '3rem', textAlign: 'center', maxWidth: '480px', margin: '2rem auto' },
  emptyIcon: { fontSize: '3rem', marginBottom: '1rem' },
  emptyTitle: { fontSize: '1.3rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '0.5rem' },
  emptySub: { color: '#9999BB', marginBottom: '1.5rem', lineHeight: 1.6 },
  emptyBtn: { padding: '0.75rem 2rem', borderRadius: '10px', textDecoration: 'none', display: 'inline-block' },
}

export default RecruiterDashboard