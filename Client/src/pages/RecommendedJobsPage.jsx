
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

const RecommendedJobsPage = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/jobs/recommended')
      .then(res => setJobs(res.data.jobs || []))
      .catch(() => setError('Failed to load recommendations. Make sure your profile has skills listed.'))
      .finally(() => setLoading(false))
  }, [])

  const typeColor = { 'full-time': '#27ae60', 'part-time': '#f39c12', 'internship': '#e94560' }

  return (
    <div style={styles.wrapper}>
      <div style={styles.bubble1} />
      <div style={styles.bubble2} />

      <div style={styles.inner}>
        <h1 style={styles.pageTitle}>⭐ Recommended for You</h1>
        <p style={styles.pageSub}>Jobs matched to your skills using AI</p>

        {loading && <p style={styles.center}>Finding your best matches...</p>}
        {error && <p className="error-text" style={styles.center}>{error}</p>}

        {!loading && !error && jobs.length === 0 && (
          <div className="glass-card fade-in" style={styles.emptyCard}>
            <p style={styles.emptyIcon}>🤖</p>
            <p style={styles.emptyTitle}>No recommendations yet</p>
            <p style={styles.emptySub}>Update your profile with skills so our AI can match you with the best jobs.</p>
            <Link to="/profile/edit" className="btn-primary" style={styles.emptyBtn}>Update Profile</Link>
          </div>
        )}

        <div style={styles.grid}>
          {jobs.map((job, i) => (
            <Link key={job._id} to={`/jobs/${job._id}`} style={{ textDecoration: 'none' }}>
              <div className="glass-card fade-in" style={styles.card}>
                <div style={styles.rankBadge}>#{i + 1} Match</div>
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
                {job.score !== undefined && (
                  <div style={styles.scoreRow}>
                    <div style={styles.scoreBar}>
                      <div style={{ ...styles.scoreFill, width: `${Math.round(job.score * 100)}%` }} />
                    </div>
                    <span style={styles.scoreText}>{Math.round(job.score * 100)}% match</span>
                  </div>
                )}
                <div style={styles.cardFooter}>
                  <span style={styles.viewBtn}>View Details →</span>
                </div>
              </div>
            </Link>
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
  card: { padding: '1.5rem', cursor: 'pointer', transition: 'transform 0.2s', position: 'relative' },
  rankBadge: {
    position: 'absolute', top: '1rem', right: '1rem',
    background: 'linear-gradient(135deg, #e94560, #c0396e)',
    color: '#fff', fontSize: '0.72rem', fontWeight: 700,
    padding: '0.2rem 0.6rem', borderRadius: '20px',
  },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem', paddingRight: '4rem' },
  jobTitle: { fontSize: '1.1rem', fontWeight: 700, color: '#1A1A2E' },
  badge: { color: '#fff', fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.6rem', borderRadius: '20px', whiteSpace: 'nowrap' },
  company: { color: '#555', fontSize: '0.9rem', marginBottom: '0.3rem' },
  location: { color: '#9999BB', fontSize: '0.85rem', marginBottom: '0.3rem' },
  salary: { color: '#27ae60', fontSize: '0.85rem', marginBottom: '0.3rem' },
  category: { color: '#9999BB', fontSize: '0.82rem', marginBottom: '0.8rem' },
  scoreRow: { display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' },
  scoreBar: { flex: 1, height: '6px', background: '#f0e6f6', borderRadius: '10px', overflow: 'hidden' },
  scoreFill: { height: '100%', background: 'linear-gradient(90deg, #e94560, #c0396e)', borderRadius: '10px', transition: 'width 0.6s ease' },
  scoreText: { fontSize: '0.78rem', color: '#e94560', fontWeight: 600, whiteSpace: 'nowrap' },
  cardFooter: { borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '0.8rem' },
  viewBtn: { color: '#e94560', fontWeight: 600, fontSize: '0.9rem' },
  center: { textAlign: 'center', padding: '3rem 0', color: '#9999BB' },
  emptyCard: { padding: '3rem', textAlign: 'center', maxWidth: '480px', margin: '2rem auto' },
  emptyIcon: { fontSize: '3rem', marginBottom: '1rem' },
  emptyTitle: { fontSize: '1.3rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '0.5rem' },
  emptySub: { color: '#9999BB', marginBottom: '1.5rem', lineHeight: 1.6 },
  emptyBtn: { padding: '0.75rem 2rem', borderRadius: '10px', textDecoration: 'none', display: 'inline-block' },
}

export default RecommendedJobsPage