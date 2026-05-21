import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

const AdminJobsPage = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    api.get(`/jobs?page=${page}&limit=10`)
      .then(res => {
        setJobs(res.data.jobs || [])
        setTotalPages(res.data.totalPages || 1)
      })
      .catch(() => setError('Failed to load jobs.'))
      .finally(() => setLoading(false))
  }, [page])

  const handleDelete = async (jobId) => {
    if (!window.confirm('Delete this job posting?')) return
    setDeleting(jobId)
    try {
      await api.delete(`/jobs/${jobId}`)
      setJobs(jobs.filter(j => j._id !== jobId))
    } catch { alert('Failed to delete job.') }
    finally { setDeleting(null) }
  }

  const typeColor = { 'full-time': '#27ae60', 'part-time': '#f39c12', 'internship': '#e94560' }

  return (
    <div style={styles.wrapper}>
      <div style={styles.bubble1} />
      <div style={styles.bubble2} />

      <div style={styles.inner}>
        <h1 style={styles.pageTitle}>💼 Manage Jobs</h1>
        <p style={styles.pageSub}>Monitor and moderate all job postings on the platform</p>

        {loading && <p style={styles.center}>Loading jobs...</p>}
        {error && <p className="error-text" style={styles.center}>{error}</p>}

        <div style={styles.list}>
          {jobs.map(job => (
            <div key={job._id} className="glass-card fade-in" style={styles.card}>
              <div style={styles.cardLeft}>
                <div style={styles.titleRow}>
                  <h3 style={styles.jobTitle}>{job.title}</h3>
                  <span style={{ ...styles.badge, background: typeColor[job.type] || '#9999BB' }}>{job.type}</span>
                  <span style={{ ...styles.badge, background: job.status === 'open' ? '#27ae60' : '#e94560' }}>
                    {job.status}
                  </span>
                </div>
                <p style={styles.meta}>🏢 {job.company} · 📍 {job.location}</p>
                <p style={styles.meta}>🏷️ {job.category || 'General'} · 🪑 {job.totalSlots} slots</p>
                {job.createdBy?.name && <p style={styles.meta}>👤 Posted by: {job.createdBy.name}</p>}
              </div>
              <div style={styles.cardRight}>
                <Link to={`/jobs/${job._id}`} className="btn-primary" style={styles.actionBtn}>👁️ View</Link>
                <button className="btn-primary"
                  style={{ ...styles.actionBtn, background: '#c0392b' }}
                  onClick={() => handleDelete(job._id)}
                  disabled={deleting === job._id}>
                  {deleting === job._id ? '...' : '🗑️ Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {!loading && jobs.length === 0 && <p style={styles.center}>No jobs found.</p>}

        {totalPages > 1 && (
          <div style={styles.pagination}>
            <button className="btn-primary" style={styles.pageBtn}
              onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Prev</button>
            <span style={styles.pageInfo}>Page {page} of {totalPages}</span>
            <button className="btn-primary" style={styles.pageBtn}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next →</button>
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
  inner: { maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 },
  pageTitle: { fontSize: '2.2rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '0.4rem' },
  pageSub: { color: '#9999BB', marginBottom: '1.5rem' },
  list: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  card: { padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' },
  cardLeft: { flex: 1 },
  titleRow: { display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem', flexWrap: 'wrap' },
  jobTitle: { fontSize: '1.05rem', fontWeight: 700, color: '#1A1A2E' },
  badge: { color: '#fff', fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '20px' },
  meta: { color: '#9999BB', fontSize: '0.85rem', marginBottom: '0.2rem' },
  cardRight: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  actionBtn: { padding: '0.4rem 0.9rem', fontSize: '0.82rem', borderRadius: '8px', textDecoration: 'none', display: 'inline-block' },
  center: { textAlign: 'center', padding: '3rem', color: '#9999BB' },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' },
  pageBtn: { padding: '0.5rem 1.2rem' },
  pageInfo: { color: '#9999BB', fontSize: '0.9rem' },
}

export default AdminJobsPage
