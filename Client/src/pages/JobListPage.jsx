import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

// Category colour map — inline so this file is self-contained
const CATEGORY_COLORS = {
  'Frontend':         { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' },
  'Backend':          { bg: '#dbeafe', text: '#1e3a8a', border: '#93c5fd' },
  'AI/ML':            { bg: '#ede9fe', text: '#4c1d95', border: '#c4b5fd' },
  'DevOps':           { bg: '#ccfbf1', text: '#134e4a', border: '#5eead4' },
  'Data Engineering': { bg: '#ffedd5', text: '#7c2d12', border: '#fdba74' },
  'Other':            { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' },
}

function CategoryBadge({ category }) {
  const c = CATEGORY_COLORS[category] ?? CATEGORY_COLORS['Other']
  return (
    <span style={{
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
      borderRadius: '9999px', padding: '2px 10px', fontSize: '0.72rem',
      fontWeight: 600, display: 'inline-block', whiteSpace: 'nowrap',
    }}>
      {category || 'Other'}
    </span>
  )
}

const TYPE_COLORS = {
  'full-time':  { bg: '#dcfce7', text: '#166534', border: '#86efac' },
  'part-time':  { bg: '#fef9c3', text: '#854d0e', border: '#fde047' },
  'internship': { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
}

function TypeBadge({ type }) {
  const c = TYPE_COLORS[type] ?? { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' }
  const labels = { 'full-time': 'Full-Time', 'part-time': 'Part-Time', 'internship': 'Internship' }
  return (
    <span style={{
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
      borderRadius: '9999px', padding: '2px 10px', fontSize: '0.72rem',
      fontWeight: 600, display: 'inline-block', whiteSpace: 'nowrap',
    }}>
      {labels[type] ?? type}
    </span>
  )
}

function JobCardSkeleton() {
  const shimmer = {
    background: 'linear-gradient(90deg,rgba(255,255,255,0.4) 25%,rgba(255,255,255,0.7) 50%,rgba(255,255,255,0.4) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.4s infinite',
    borderRadius: 6,
  }
  return (
    <div style={{ background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.7)', borderRadius: 16, padding: '1.5rem' }}>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      <div style={{ ...shimmer, height: 20, width: '60%', marginBottom: 10 }} />
      <div style={{ ...shimmer, height: 14, width: '40%', marginBottom: 8 }} />
      <div style={{ ...shimmer, height: 14, width: '80%', marginBottom: 16 }} />
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ ...shimmer, height: 22, width: 70, borderRadius: 99 }} />
        <div style={{ ...shimmer, height: 22, width: 90, borderRadius: 99 }} />
      </div>
    </div>
  )
}

const JobListPage = () => {
  const { isAuthenticated, user } = useAuth()
  const [jobs, setJobs]           = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [savedIds, setSavedIds]   = useState(new Set())
  const [savingId, setSavingId]   = useState(null)
  const [filters, setFilters]     = useState({ keyword: '', location: '', type: '', status: 'open' })
  const [page, setPage]           = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal]         = useState(0)

  const fetchJobs = async () => {
    setLoading(true)
    setError('')
    try {
      // Remove empty params so backend doesn't get empty strings
      const params = {}
      if (filters.keyword)  params.keyword  = filters.keyword
      if (filters.location) params.location = filters.location
      if (filters.type)     params.type     = filters.type
      if (filters.status)   params.status   = filters.status
      params.page  = page
      params.limit = 9

      const res = await api.get('/jobs', { params })
      setJobs(res.data.jobs ?? [])
      setTotal(res.data.total ?? 0)
      // Backend returns total count; derive totalPages from it
      setTotalPages(Math.ceil((res.data.total ?? 0) / 9) || 1)
    } catch {
      setError('Failed to load jobs. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchJobs() }, [page, filters])

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setPage(1) // reset to page 1 whenever filter changes
  }

  const handleSave = async (e, jobId) => {
    e.preventDefault()   // stop Link navigation
    e.stopPropagation()
    if (!isAuthenticated || user?.role !== 'jobSeeker') return
    if (savingId === jobId) return

    setSavingId(jobId)
    try {
      const res = await api.post(`/jobs/${jobId}/save`)
      setSavedIds(prev => {
        const next = new Set(prev)
        // Use the boolean the backend returns
        res.data.saved ? next.add(jobId) : next.delete(jobId)
        return next
      })
    } catch {
      // silently fail — don't crash the page
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div style={styles.wrapper}>
      {/* Decorative bubbles — same design language as rest of app */}
      <div style={styles.bubble1} />
      <div style={styles.bubble2} />

      <style>{`
        @keyframes float1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(14px)} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .job-card { transition: transform 0.2s, box-shadow 0.2s; animation: fadeInUp 0.4s ease both; }
        .job-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(31,38,135,0.14) !important; }
        .save-btn { transition: all 0.15s; }
        .save-btn:hover { transform: scale(1.15); }
        .filter-input { transition: border-color 0.2s, box-shadow 0.2s; }
        .filter-input:focus { border-color: #e94560; box-shadow: 0 0 0 3px rgba(233,69,96,0.12); outline: none; }
        .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .page-btn:not(:disabled):hover { background: #e94560; color: #fff; }
      `}</style>

      <div style={styles.inner}>
        {/* Header */}
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>Browse Jobs</h1>
          <p style={styles.pageSub}>
            {total > 0 ? `${total} open position${total !== 1 ? 's' : ''} found` : 'Find the opportunity that fits you'}
          </p>
        </div>

        {/* Filters */}
        <div style={styles.filterCard}>
          <input
            className="filter-input"
            style={styles.filterInput}
            name="keyword"
            placeholder="🔍  Search by title or description..."
            value={filters.keyword}
            onChange={handleFilterChange}
          />
          <input
            className="filter-input"
            style={styles.filterInput}
            name="location"
            placeholder="📍  Location"
            value={filters.location}
            onChange={handleFilterChange}
          />
          <select
            className="filter-input"
            style={styles.filterInput}
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
          >
            <option value="">All Types</option>
            <option value="full-time">Full-Time</option>
            <option value="part-time">Part-Time</option>
            <option value="internship">Internship</option>
          </select>
          <select
            className="filter-input"
            style={styles.filterInput}
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="open">Open Jobs</option>
            <option value="closed">Closed Jobs</option>
            <option value="">All Status</option>
          </select>
        </div>

        {/* Error */}
        {error && (
          <div style={styles.errorBox}>
            <span>⚠️ {error}</span>
            <button onClick={fetchJobs} style={styles.retryBtn}>Retry</button>
          </div>
        )}

        {/* Grid */}
        <div style={styles.grid}>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)
            : jobs.map((job, i) => (
                <Link
                  key={job._id}
                  to={`/jobs/${job._id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    className="job-card"
                    style={{ ...styles.card, animationDelay: `${i * 0.05}s` }}
                  >
                    {/* Card Top */}
                    <div style={styles.cardTop}>
                      <h3 style={styles.jobTitle}>{job.title}</h3>
                      {/* Save button — only for authenticated job seekers */}
                      {isAuthenticated && user?.role === 'jobSeeker' && job.status === 'open' && (
                        <button
                          className="save-btn"
                          style={styles.saveBtn}
                          onClick={(e) => handleSave(e, job._id)}
                          disabled={savingId === job._id}
                          title={savedIds.has(job._id) ? 'Unsave job' : 'Save job'}
                          aria-label={savedIds.has(job._id) ? 'Unsave job' : 'Save job'}
                        >
                          {savedIds.has(job._id) ? '🔖' : '🔗'}
                        </button>
                      )}
                    </div>

                    <p style={styles.company}>🏢 {job.company}</p>
                    <p style={styles.location}>📍 {job.location}</p>
                    {job.salary && (
                      <p style={styles.salary}>💰 {Number(job.salary).toLocaleString()} EGP/month</p>
                    )}

                    {/* Badges row */}
                    <div style={styles.badgeRow}>
                      <TypeBadge type={job.type} />
                      <CategoryBadge category={job.category} />
                    </div>

                    <div style={styles.cardFooter}>
                      <span style={styles.viewBtn}>View Details →</span>
                      {job.status === 'closed' && (
                        <span style={styles.closedTag}>Closed</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))
          }
        </div>

        {/* Empty state */}
        {!loading && !error && jobs.length === 0 && (
          <div style={styles.emptyState}>
            <p style={styles.emptyIcon}>🔍</p>
            <p style={styles.emptyTitle}>No jobs found</p>
            <p style={styles.emptySub}>Try adjusting your filters or search terms</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div style={styles.pagination}>
            <button
              className="page-btn"
              style={styles.pageBtn}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              ← Prev
            </button>
            <span style={styles.pageInfo}>Page {page} of {totalPages}</span>
            <button
              className="page-btn"
              style={styles.pageBtn}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  wrapper: { minHeight: '90vh', padding: '2rem', position: 'relative', overflow: 'hidden' },
  bubble1: {
    position: 'fixed', width: '320px', height: '320px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,182,215,0.35), rgba(200,160,228,0.12))',
    top: '5%', right: '3%', filter: 'blur(3px)', pointerEvents: 'none', zIndex: 0,
    animation: 'float1 7s ease-in-out infinite',
  },
  bubble2: {
    position: 'fixed', width: '220px', height: '220px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,107,157,0.25), rgba(180,140,220,0.08))',
    bottom: '10%', left: '3%', filter: 'blur(3px)', pointerEvents: 'none', zIndex: 0,
    animation: 'float2 9s ease-in-out infinite',
  },
  inner: { maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 },
  pageHeader: { marginBottom: '1.8rem' },
  pageTitle: { fontSize: '2.2rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '0.3rem' },
  pageSub: { color: '#9999BB', fontSize: '0.95rem' },
  filterCard: {
    display: 'flex', gap: '0.85rem', flexWrap: 'wrap', alignItems: 'center',
    background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.7)', borderRadius: 16,
    padding: '1.25rem 1.5rem', marginBottom: '2rem',
    boxShadow: '0 4px 20px rgba(31,38,135,0.07)',
  },
  filterInput: {
    flex: 1, minWidth: '170px', padding: '0.65rem 1rem',
    border: '1.5px solid rgba(200,180,220,0.4)', borderRadius: 10,
    fontSize: '0.9rem', background: 'rgba(255,255,255,0.75)',
    color: '#1a1a2e', cursor: 'pointer',
  },
  errorBox: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 10,
    padding: '0.9rem 1.2rem', marginBottom: '1.5rem', color: '#991b1b', fontSize: '0.9rem',
  },
  retryBtn: {
    background: '#e94560', color: '#fff', border: 'none', borderRadius: 8,
    padding: '0.4rem 0.9rem', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
    gap: '1.4rem',
    marginBottom: '2rem',
  },
  card: {
    background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.7)', borderRadius: 16,
    padding: '1.5rem', height: '100%', cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(31,38,135,0.07)',
  },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' },
  jobTitle: { fontSize: '1.05rem', fontWeight: 700, color: '#1A1A2E', flex: 1, marginRight: '0.5rem', lineHeight: 1.3 },
  saveBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: '1.2rem', padding: '2px', flexShrink: 0,
  },
  company:  { color: '#555577', fontSize: '0.88rem', marginBottom: '0.25rem' },
  location: { color: '#9999BB', fontSize: '0.84rem', marginBottom: '0.25rem' },
  salary:   { color: '#059669', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.6rem' },
  badgeRow: { display: 'flex', gap: '6px', flexWrap: 'wrap', margin: '0.7rem 0' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '0.8rem', marginTop: '0.6rem' },
  viewBtn:  { color: '#e94560', fontWeight: 600, fontSize: '0.88rem' },
  closedTag: { fontSize: '0.75rem', color: '#9999BB', fontWeight: 500 },
  emptyState: { textAlign: 'center', padding: '5rem 1rem' },
  emptyIcon:  { fontSize: '3rem', marginBottom: '0.75rem' },
  emptyTitle: { fontSize: '1.2rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '0.4rem' },
  emptySub:   { color: '#9999BB', fontSize: '0.9rem' },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1rem', paddingBottom: '2rem' },
  pageBtn: {
    padding: '0.5rem 1.4rem', borderRadius: 10, border: '1.5px solid rgba(200,180,220,0.5)',
    background: 'rgba(255,255,255,0.6)', color: '#1A1A2E', fontWeight: 600,
    fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.15s',
  },
  pageInfo: { color: '#9999BB', fontSize: '0.9rem', minWidth: 100, textAlign: 'center' },
}

export default JobListPage

