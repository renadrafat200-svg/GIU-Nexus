import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

const JobListPage = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({ keyword: '', location: '', type: '' })
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: 9, ...filters })
      const res = await api.get(`/jobs?${params}`)
      setJobs(res.data.jobs || [])
      setTotalPages(res.data.totalPages || 1)
    } catch { setError('Failed to load jobs.') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchJobs() }, [page, filters])

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
    setPage(1)
  }

  const typeColor = { 'full-time': '#27ae60', 'part-time': '#f39c12', 'internship': '#e94560' }

  return (
    <div style={styles.wrapper}>
      <div style={styles.bubble1} /><div style={styles.bubble2} />
      <div style={styles.inner}>
        <h1 style={styles.pageTitle}>Browse Jobs</h1>
        <p style={styles.pageSub}>Find the opportunity that fits you</p>
        <div className="glass-card fade-in" style={styles.filterRow}>
          <input className="input-field" style={styles.filterInput} name="keyword" placeholder="🔍 Search keyword..." value={filters.keyword} onChange={handleFilterChange} />
          <input className="input-field" style={styles.filterInput} name="location" placeholder="📍 Location" value={filters.location} onChange={handleFilterChange} />
          <select className="input-field" style={styles.filterInput} name="type" value={filters.type} onChange={handleFilterChange}>
            <option value="">All Types</option>
            <option value="full-time">Full-Time</option>
            <option value="part-time">Part-Time</option>
            <option value="internship">Internship</option>
          </select>
        </div>
        {loading && <p style={styles.center}>Loading jobs...</p>}
        {error && <p className="error-text" style={styles.center}>{error}</p>}
        {!loading && !error && jobs.length === 0 && <p style={styles.center}>No jobs found.</p>}
        <div style={styles.grid}>
          {jobs.map(job => (
            <Link key={job._id} to={`/jobs/${job._id}`} style={{ textDecoration: 'none' }}>
              <div className="glass-card fade-in" style={styles.card}>
                <div style={styles.cardTop}>
                  <h3 style={styles.jobTitle}>{job.title}</h3>
                  <span style={{ ...styles.badge, background: typeColor[job.type] || '#9999BB' }}>{job.type}</span>
                </div>
                <p style={styles.company}>🏢 {job.company}</p>
                <p style={styles.location}>📍 {job.location}</p>
                {job.salary && <p style={styles.salary}>💰 {job.salary}</p>}
                <p style={styles.category}>🏷️ {job.category || 'General'}</p>
                <div style={styles.cardFooter}><span style={styles.viewBtn}>View Details →</span></div>
              </div>
            </Link>
          ))}
        </div>
        {totalPages > 1 && (
          <div style={styles.pagination}>
            <button className="btn-primary" style={styles.pageBtn} onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Prev</button>
            <span style={styles.pageInfo}>Page {page} of {totalPages}</span>
            <button className="btn-primary" style={styles.pageBtn} onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next →</button>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  wrapper: { minHeight: '90vh', padding: '2rem', position: 'relative' },
  bubble1: { position: 'fixed', width: '280px', height: '280px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,182,215,0.4), rgba(200,160,228,0.15))', top: '5%', right: '5%', filter: 'blur(2px)', pointerEvents: 'none', zIndex: 0, animation: 'float1 7s ease-in-out infinite' },
  bubble2: { position: 'fixed', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,157,0.3), rgba(180,140,220,0.1))', bottom: '10%', left: '5%', filter: 'blur(2px)', pointerEvents: 'none', zIndex: 0, animation: 'float2 9s ease-in-out infinite' },
  inner: { maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 },
  pageTitle: { fontSize: '2.2rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '0.4rem' },
  pageSub: { color: '#9999BB', marginBottom: '1.8rem' },
  filterRow: { display: 'flex', gap: '1rem', flexWrap: 'wrap', padding: '1.5rem', marginBottom: '2rem', alignItems: 'center' },
  filterInput: { flex: 1, minWidth: '180px', marginBottom: 0 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' },
  card: { padding: '1.5rem', cursor: 'pointer', height: '100%' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' },
  jobTitle: { fontSize: '1.1rem', fontWeight: 700, color: '#1A1A2E', flex: 1, marginRight: '0.5rem' },
  badge: { color: '#fff', fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.6rem', borderRadius: '20px', whiteSpace: 'nowrap' },
  company: { color: '#555', fontSize: '0.9rem', marginBottom: '0.3rem' },
  location: { color: '#9999BB', fontSize: '0.85rem', marginBottom: '0.3rem' },
  salary: { color: '#27ae60', fontSize: '0.85rem', marginBottom: '0.3rem' },
  category: { color: '#9999BB', fontSize: '0.82rem', marginBottom: '1rem' },
  cardFooter: { borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '0.8rem' },
  viewBtn: { color: '#e94560', fontWeight: 600, fontSize: '0.9rem' },
  center: { textAlign: 'center', color: '#9999BB', padding: '3rem 0' },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1rem' },
  pageBtn: { padding: '0.5rem 1.2rem' },
  pageInfo: { color: '#9999BB', fontSize: '0.9rem' },
}

export default JobListPage
