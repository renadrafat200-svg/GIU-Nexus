import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const JobDetailPage = () => {
  const { id } = useParams()
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [coverLetter, setCoverLetter] = useState('')
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [applyError, setApplyError] = useState('')
  const [saved, setSaved] = useState(false)
  const [showApplyForm, setShowApplyForm] = useState(false)

  useEffect(() => {
    api.get(`/jobs/${id}`)
      .then(res => setJob(res.data.job))
      .catch(() => setError('Job not found.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleApply = async (e) => {
    e.preventDefault()
    setApplying(true)
    setApplyError('')
    try {
      await api.post(`/jobs/${id}/apply`, { coverLetter })
      setApplied(true)
      setShowApplyForm(false)
    } catch (err) {
      setApplyError(err.response?.data?.message || 'Application failed.')
    } finally { setApplying(false) }
  }

  const handleSave = async () => {
    try { await api.post(`/jobs/${id}/save`); setSaved(s => !s) } catch {}
  }

  const typeColor = { 'full-time': '#27ae60', 'part-time': '#f39c12', 'internship': '#e94560' }

  if (loading) return <p style={styles.center}>Loading job...</p>
  if (error) return <p style={{ ...styles.center, color: '#e94560' }}>{error}</p>
  if (!job) return null

  return (
    <div style={styles.wrapper}>
      <div style={styles.bubble1} /><div style={styles.bubble2} />
      <div style={styles.inner}>
        <Link to="/jobs" style={styles.back}>← Back to Jobs</Link>
        <div className="glass-card fade-in" style={styles.mainCard}>
          <div style={styles.header}>
            <div>
              <h1 style={styles.title}>{job.title}</h1>
              <p style={styles.company}>🏢 {job.company}</p>
            </div>
            <span style={{ ...styles.badge, background: typeColor[job.type] || '#9999BB' }}>{job.type}</span>
          </div>
          <div style={styles.metaRow}>
            <span style={styles.meta}>📍 {job.location}</span>
            {job.salary && <span style={styles.meta}>💰 {job.salary}</span>}
            <span style={styles.meta}>🏷️ {job.category || 'General'}</span>
            <span style={styles.meta}>🪑 {job.totalSlots} slots</span>
            <span style={{ ...styles.meta, color: job.status === 'open' ? '#27ae60' : '#e94560', fontWeight: 600 }}>
              {job.status === 'open' ? '🟢 Open' : '🔴 Closed'}
            </span>
          </div>
          <hr style={styles.divider} />
          <h3 style={styles.sectionHead}>Description</h3>
          <p style={styles.desc}>{job.description}</p>
          {job.requirements?.length > 0 && (
            <>
              <h3 style={styles.sectionHead}>Requirements</h3>
              <ul style={styles.list}>
                {job.requirements.map((r, i) => <li key={i} style={styles.listItem}>✅ {r}</li>)}
              </ul>
            </>
          )}
          {isAuthenticated && user?.role === 'jobSeeker' && job.status === 'open' && (
            <div style={styles.actions}>
              {applied ? <p style={styles.successMsg}>✅ Application submitted!</p> : (
                <button className="btn-primary" style={styles.applyBtn} onClick={() => setShowApplyForm(s => !s)}>
                  {showApplyForm ? 'Cancel' : '🚀 Apply Now'}
                </button>
              )}
              <button className="btn-primary" style={{ ...styles.applyBtn, ...styles.saveBtn }} onClick={handleSave}>
                {saved ? '🔖 Saved' : '🔖 Save Job'}
              </button>
            </div>
          )}
          {!isAuthenticated && (
            <div style={styles.actions}>
              <Link to="/login" className="btn-primary" style={styles.applyBtn}>Login to Apply</Link>
            </div>
          )}
          {showApplyForm && !applied && (
            <div className="glass-card fade-in" style={styles.applyForm}>
              <h3 style={styles.sectionHead}>Your Application</h3>
              {applyError && <p className="error-text">{applyError}</p>}
              <form onSubmit={handleApply}>
                <textarea className="input-field" placeholder="Write a cover letter (optional)..." value={coverLetter} onChange={e => setCoverLetter(e.target.value)} rows={5} style={{ resize: 'vertical' }} />
                <button className="btn-primary" style={{ width: '100%' }} type="submit" disabled={applying}>{applying ? 'Submitting...' : 'Submit Application'}</button>
              </form>
            </div>
          )}
          {isAuthenticated && user?.role === 'recruiter' && (
            <div style={styles.actions}>
              <Link to={`/jobs/${id}/edit`} className="btn-primary" style={styles.applyBtn}>✏️ Edit Job</Link>
              <Link to={`/jobs/${id}/applicants`} className="btn-primary" style={{ ...styles.applyBtn, ...styles.saveBtn }}>👥 View Applicants</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrapper: { minHeight: '90vh', padding: '2rem', position: 'relative' },
  bubble1: { position: 'fixed', width: '280px', height: '280px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,182,215,0.4), rgba(200,160,228,0.15))', top: '5%', right: '5%', filter: 'blur(2px)', pointerEvents: 'none', zIndex: 0, animation: 'float1 7s ease-in-out infinite' },
  bubble2: { position: 'fixed', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,157,0.3), rgba(180,140,220,0.1))', bottom: '10%', left: '5%', filter: 'blur(2px)', pointerEvents: 'none', zIndex: 0, animation: 'float2 9s ease-in-out infinite' },
  inner: { maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 },
  back: { color: '#9999BB', fontSize: '0.9rem', display: 'inline-block', marginBottom: '1.2rem' },
  mainCard: { padding: '2.5rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' },
  title: { fontSize: '1.8rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '0.3rem' },
  company: { color: '#555', fontSize: '1rem' },
  badge: { color: '#fff', fontSize: '0.8rem', fontWeight: 600, padding: '0.3rem 0.8rem', borderRadius: '20px', whiteSpace: 'nowrap' },
  metaRow: { display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' },
  meta: { color: '#9999BB', fontSize: '0.9rem' },
  divider: { border: 'none', borderTop: '1px solid rgba(0,0,0,0.08)', margin: '1.5rem 0' },
  sectionHead: { fontSize: '1.1rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '0.8rem' },
  desc: { color: '#444', lineHeight: 1.7, marginBottom: '1.5rem', whiteSpace: 'pre-wrap' },
  list: { paddingLeft: '0', listStyle: 'none', marginBottom: '1.5rem' },
  listItem: { color: '#444', marginBottom: '0.4rem', fontSize: '0.95rem' },
  actions: { display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' },
  applyBtn: { padding: '0.75rem 2rem', borderRadius: '10px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' },
  saveBtn: { background: 'transparent', border: '2px solid #e94560', color: '#e94560' },
  applyForm: { padding: '1.5rem', marginTop: '1.5rem' },
  successMsg: { color: '#27ae60', fontWeight: 600 },
  center: { textAlign: 'center', padding: '4rem', color: '#9999BB' },
}

export default JobDetailPage
