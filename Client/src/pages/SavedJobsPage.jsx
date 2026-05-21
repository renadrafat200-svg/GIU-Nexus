import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

const SavedJobsPage = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/jobs/saved')
      .then(res => setJobs(res.data.jobs || []))
      .catch(() => setError('Failed to load saved jobs.'))
      .finally(() => setLoading(false))
  }, [])

  const handleUnsave = async (jobId) => {
    try {
      await api.post(`/jobs/${jobId}/save`)
      setJobs(jobs.filter(j => j._id !== jobId))
    } catch {}
  }

  const typeColor = { 'full-time': '#27ae60', 'part-time': '#f39c12', 'internship': '#e94560' }

  return (
    <div style={styles.wrapper}>
      <div style={styles.bubble1} />
      <div style={styles.bubble2} />

      <div style={styles.inner}>
        <h1 style={styles.pageTitle}>🔖 Saved Jobs</h1>
        <p style={styles.pageSub}>Jobs you bookmarked for later</p>

        {loading && <p style={styles.center}>Loading saved jobs...</p>}
        {error && <p className="error-text" style={styles.center}>{error}</p>}

        {!loading && !error && jobs.length === 0 && (
          <div className="glass-card fade-in" style={styles.emptyCard}>
            <p style={styles.emptyIcon}>🔖</p>
            <p style={styles.emptyTitle}>No saved jobs yet</p>
            <p style={styles.emptySub}>Browse jobs and save the ones you like to find them here later.</p>
            <Link to="/jobs" className="btn-primary" style={styles.emptyBtn}>Browse Jobs</Link>
          </div>
        )}

        <div style={styles.grid}>
          {jobs.map(job => (
            <div key={job._id} className="glass-card fade-in" style={styles.card}>
              <div style={styles.cardTop}>
                <h3 style={styles.jobTitle}>{job.title}</h3>
                <span style={{ ...styles.badge, background: typeColor[job.type] || '#9999BB' }}>
                  {job.type}
                </span>
              </div>
              <p style={styles.company}>🏢 {job.company}</p>
              <p style={styles.location}>📍 {job.location}</p>
              {job.salary && <p style={styles.salary}>💰 {job.salary}</p>}
              <p style={styles.category}>🏷️ {job.category || 'General'}</p>
              <div style={styles.cardFooter}>
                <Link to={`/jobs/${job._id}`} style={styles.viewBtn}>View Details →</Link>
                <button style={styles.unsaveBtn} onClick={() => handleUnsave(job._id)}>
                  🗑️ Unsave
                </button>
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
  inner: { maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 },
  pageTitle: { fontSize: '2.2rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '0.4rem' },
  pageSub: { color: '#9999BB', marginBottom: '2rem' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  card: { padding: '1.5rem' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' },
  jobTitle: { fontSize: '1.1rem', fontWeight: 700, color: '#1A1A2E', flex: 1, marginRight: '0.5rem' },
  badge: { color: '#fff', fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.6rem', borderRadius: '20px', whiteSpace: 'nowrap' },
  company: { color: '#555', fontSize: '0.9rem', marginBottom: '0.3rem' },
  location: { color: '#9999BB', fontSize: '0.85rem', marginBottom: '0.3rem' },
  salary: { color: '#27ae60', fontSize: '0.85rem', marginBottom: '0.3rem' },
  category: { color: '#9999BB', fontSize: '0.82rem', marginBottom: '1rem' },
  cardFooter: { borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  viewBtn: { color: '#e94560', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' },
  unsaveBtn: { background: 'none', border: 'none', color: '#9999BB', fontSize: '0.85rem', cursor: 'pointer' },
  center: { textAlign: 'center', padding: '3rem 0', color: '#9999BB' },
  emptyCard: { padding: '3rem', textAlign: 'center', maxWidth: '480px', margin: '2rem auto' },
  emptyIcon: { fontSize: '3rem', marginBottom: '1rem' },
  emptyTitle: { fontSize: '1.3rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '0.5rem' },
  emptySub: { color: '#9999BB', marginBottom: '1.5rem', lineHeight: 1.6 },
  emptyBtn: { padding: '0.75rem 2rem', borderRadius: '10px', textDecoration: 'none', display: 'inline-block' },
}

export default SavedJobsPage
