import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

// ── Inline colour maps (self-contained file) ──────────────────────────────────
const CATEGORY_COLORS = {
  'Frontend':         { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' },
  'Backend':          { bg: '#dbeafe', text: '#1e3a8a', border: '#93c5fd' },
  'AI/ML':            { bg: '#ede9fe', text: '#4c1d95', border: '#c4b5fd' },
  'DevOps':           { bg: '#ccfbf1', text: '#134e4a', border: '#5eead4' },
  'Data Engineering': { bg: '#ffedd5', text: '#7c2d12', border: '#fdba74' },
  'Other':            { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' },
}

const TYPE_COLORS = {
  'full-time':  { bg: '#dcfce7', text: '#166534', border: '#86efac' },
  'part-time':  { bg: '#fef9c3', text: '#854d0e', border: '#fde047' },
  'internship': { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
}

const STATUS_COLORS = {
  pending:     { bg: '#fef9c3', text: '#854d0e', border: '#fde047' },
  shortlisted: { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' },
  rejected:    { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
}

function Badge({ label, colorMap, value }) {
  const c = colorMap[value] ?? { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' }
  return (
    <span style={{
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
      borderRadius: '9999px', padding: '3px 12px', fontSize: '0.78rem',
      fontWeight: 600, display: 'inline-block', whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
const JobDetailPage = () => {
  const { id }                    = useParams()
  const { user, isAuthenticated } = useAuth()
  const navigate                  = useNavigate()

  const [job, setJob]               = useState(null)
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')

  // Apply state
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [coverLetter, setCoverLetter]       = useState('')
  const [applying, setApplying]             = useState(false)
  const [applyError, setApplyError]         = useState('')
  const [myApplication, setMyApplication]   = useState(null) // null = not applied

  // Save state — initialised from job data once loaded
  const [saved, setSaved]     = useState(false)
  const [saving, setSaving]   = useState(false)

  // ── Fetch job ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await api.get(`/jobs/${id}`)
        const fetchedJob = res.data.job
        setJob(fetchedJob)

        // If user is a jobSeeker, check whether they've already applied
        // We do this by calling /applications/my and looking for this job id.
        // Only make the call if the user is authenticated and a jobSeeker.
        if (isAuthenticated && user?.role === 'jobSeeker') {
          try {
            const appRes = await api.get('/applications/my')
            const apps = appRes.data.applications ?? []
            const existing = apps.find(a => {
              const jobId = a.job?._id ?? a.job
              return jobId?.toString() === id
            })
            if (existing) setMyApplication(existing)
          } catch {
            // Non-critical — if this fails we just show the Apply button
          }

          // Check if this job is in user's saved list
          // The user object in AuthContext includes savedJobs as array of IDs
          // (populated when we stored the full user object from login response).
          // Safest: call /jobs/saved and check.
          try {
            const savedRes = await api.get('/jobs/saved')
            const savedJobs = savedRes.data.jobs ?? []
            setSaved(savedJobs.some(j => (j._id ?? j) === id))
          } catch {
            // Non-critical
          }
        }
      } catch {
        setError('Job not found or could not be loaded.')
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [id, isAuthenticated, user?.role])

  // ── Apply handler ───────────────────────────────────────────────────────────
  const handleApply = async (e) => {
    e.preventDefault()
    setApplying(true)
    setApplyError('')
    try {
      const res = await api.post(`/jobs/${id}/apply`, { coverLetter })
      setMyApplication(res.data.application)
      setShowApplyModal(false)
      setCoverLetter('')
    } catch (err) {
      setApplyError(err.response?.data?.message || 'Application failed. Please try again.')
    } finally {
      setApplying(false)
    }
  }

  // ── Save / Unsave handler ───────────────────────────────────────────────────
  const handleSave = async () => {
    if (saving) return
    setSaving(true)
    try {
      const res = await api.post(`/jobs/${id}/save`)
      // Backend returns { saved: true } or { saved: false }
      setSaved(res.data.saved)
    } catch {
      // Silently fail
    } finally {
      setSaving(false)
    }
  }

  // ── Render: loading ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={styles.centerPage}>
        <div style={styles.spinner} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  // ── Render: error ───────────────────────────────────────────────────────────
  if (error) {
    return (
      <div style={styles.centerPage}>
        <p style={{ color: '#e94560', fontSize: '1.1rem', marginBottom: '1rem' }}>{error}</p>
        <Link to="/jobs" style={styles.backLink}>← Back to Jobs</Link>
      </div>
    )
  }

  if (!job) return null

  const isJobSeeker   = isAuthenticated && user?.role === 'jobSeeker'
  const isRecruiter   = isAuthenticated && user?.role === 'recruiter'
  const isOwner       = isRecruiter && job.createdBy?._id?.toString() === user?._id
  const canApply      = isJobSeeker && job.status === 'open' && !myApplication
  const typeLabel     = { 'full-time': 'Full-Time', 'part-time': 'Part-Time', 'internship': 'Internship' }

  return (
    <div style={styles.wrapper}>
      <div style={styles.bubble1} />
      <div style={styles.bubble2} />

      <style>{`
        @keyframes float1{0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}}
        @keyframes float2{0%,100%{transform:translateY(0)}50%{transform:translateY(14px)}}
        @keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .apply-btn:hover:not(:disabled){opacity:0.87;transform:translateY(-1px)}
        .save-btn-outline:hover:not(:disabled){background:rgba(233,69,96,0.08) !important}
        .modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;z-index:999;padding:1rem}
        .modal-box{background:#fff;border-radius:16px;padding:2rem;max-width:500px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.18);animation:fadeInUp 0.18s ease}
      `}</style>

      <div style={styles.inner}>
        {/* Back link */}
        <Link to="/jobs" style={styles.backLink}>← Back to Jobs</Link>

        {/* Main card */}
        <div style={styles.card}>

          {/* Header */}
          <div style={styles.header}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={styles.title}>{job.title}</h1>
              <p style={styles.company}>🏢 {job.company}</p>
            </div>
            <div style={styles.badgesCol}>
              <Badge label={typeLabel[job.type] ?? job.type} colorMap={TYPE_COLORS} value={job.type} />
              <Badge label={job.category ?? 'Other'} colorMap={CATEGORY_COLORS} value={job.category ?? 'Other'} />
            </div>
          </div>

          {/* Meta row */}
          <div style={styles.metaRow}>
            <span style={styles.meta}>📍 {job.location}</span>
            {job.salary && (
              <span style={styles.meta}>💰 {Number(job.salary).toLocaleString()} EGP/month</span>
            )}
            <span style={styles.meta}>🪑 {job.totalSlots} slot{job.totalSlots !== 1 ? 's' : ''}</span>
            <span style={{ ...styles.meta, color: job.status === 'open' ? '#059669' : '#e94560', fontWeight: 600 }}>
              {job.status === 'open' ? '🟢 Open' : '🔴 Closed'}
            </span>
          </div>

          <hr style={styles.divider} />

          {/* Description */}
          <h3 style={styles.sectionHead}>Description</h3>
          <p style={styles.desc}>{job.description}</p>

          {/* Requirements */}
          {job.requirements?.length > 0 && (
            <>
              <h3 style={styles.sectionHead}>Requirements</h3>
              <ul style={styles.list}>
                {job.requirements.map((r, i) => (
                  <li key={i} style={styles.listItem}>
                    <span style={styles.bullet}>✓</span> {r}
                  </li>
                ))}
              </ul>
            </>
          )}

          <hr style={styles.divider} />

          {/* ── Action buttons ──────────────────────────────────────────────── */}
          <div style={styles.actions}>

            {/* Job Seeker — not yet applied */}
            {canApply && (
              <button
                className="apply-btn"
                style={styles.applyBtn}
                onClick={() => setShowApplyModal(true)}
              >
                🚀 Apply Now
              </button>
            )}

            {/* Job Seeker — already applied: show status badge */}
            {isJobSeeker && myApplication && (
              <div style={styles.appliedBox}>
                <span style={styles.appliedLabel}>✅ Application submitted</span>
                <Badge
                  label={myApplication.status.charAt(0).toUpperCase() + myApplication.status.slice(1)}
                  colorMap={STATUS_COLORS}
                  value={myApplication.status}
                />
              </div>
            )}

            {/* Save / Unsave — only for open jobs */}
            {isJobSeeker && job.status === 'open' && (
              <button
                className="save-btn-outline"
                style={{ ...styles.applyBtn, ...styles.outlineBtn }}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? '...' : saved ? '🔖 Saved' : '🔗 Save Job'}
              </button>
            )}

            {/* Not logged in */}
            {!isAuthenticated && (
              <Link to="/login" style={styles.applyBtn} className="apply-btn">
                Log in to Apply
              </Link>
            )}

            {/* Recruiter owner */}
            {isOwner && (
              <>
                <Link
                  to={`/recruiter/jobs/${id}/edit`}
                  style={{ ...styles.applyBtn, ...styles.outlineBtn }}
                  className="apply-btn"
                >
                  ✏️ Edit Job
                </Link>
                <Link
                  to={`/recruiter/applicants/${id}`}
                  style={styles.applyBtn}
                  className="apply-btn"
                >
                  👥 View Applicants
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Apply Modal ───────────────────────────────────────────────────────── */}
      {showApplyModal && (
        <div className="modal-backdrop" onClick={() => setShowApplyModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Apply to {job.title}</h3>
            <p style={styles.modalSub}>at {job.company}</p>

            {applyError && (
              <p style={styles.applyError}>{applyError}</p>
            )}

            <form onSubmit={handleApply}>
              <label style={styles.label}>Cover Letter <span style={styles.optional}>(optional)</span></label>
              <textarea
                style={styles.textarea}
                placeholder="Introduce yourself and explain why you're a great fit..."
                value={coverLetter}
                onChange={e => setCoverLetter(e.target.value)}
                rows={6}
              />
              <div style={styles.modalActions}>
                <button
                  type="button"
                  style={styles.cancelBtn}
                  onClick={() => setShowApplyModal(false)}
                  disabled={applying}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={styles.applyBtn}
                  className="apply-btn"
                  disabled={applying}
                >
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  wrapper:     { minHeight: '90vh', padding: '2rem', position: 'relative', overflow: 'hidden' },
  bubble1: {
    position: 'fixed', width: '300px', height: '300px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,182,215,0.35), rgba(200,160,228,0.12))',
    top: '5%', right: '3%', filter: 'blur(3px)', pointerEvents: 'none', zIndex: 0,
    animation: 'float1 7s ease-in-out infinite',
  },
  bubble2: {
    position: 'fixed', width: '200px', height: '200px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,107,157,0.25), rgba(180,140,220,0.08))',
    bottom: '10%', left: '3%', filter: 'blur(3px)', pointerEvents: 'none', zIndex: 0,
    animation: 'float2 9s ease-in-out infinite',
  },
  centerPage: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: '1rem' },
  spinner:    { width: 40, height: 40, border: '4px solid #e5e7eb', borderTop: '4px solid #e94560', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  inner:      { maxWidth: '820px', margin: '0 auto', position: 'relative', zIndex: 1 },
  backLink:   { color: '#9999BB', fontSize: '0.9rem', display: 'inline-block', marginBottom: '1.2rem', transition: 'color 0.15s' },
  card: {
    background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.7)', borderRadius: 16,
    padding: '2.5rem', boxShadow: '0 8px 32px rgba(31,38,135,0.08)',
    animation: 'fadeInUp 0.4s ease both',
  },
  header:     { display: 'flex', gap: '1rem', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap' },
  title:      { fontSize: '1.8rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '0.3rem', lineHeight: 1.25 },
  company:    { color: '#555577', fontSize: '1rem' },
  badgesCol:  { display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end', flexShrink: 0 },
  metaRow:    { display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' },
  meta:       { color: '#9999BB', fontSize: '0.9rem' },
  divider:    { border: 'none', borderTop: '1px solid rgba(0,0,0,0.07)', margin: '1.5rem 0' },
  sectionHead:{ fontSize: '1.05rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '0.75rem' },
  desc:       { color: '#444', lineHeight: 1.75, marginBottom: '1.5rem', whiteSpace: 'pre-wrap', fontSize: '0.95rem' },
  list:       { listStyle: 'none', padding: 0, marginBottom: '1.5rem' },
  listItem:   { display: 'flex', gap: '0.6rem', color: '#444', marginBottom: '0.45rem', fontSize: '0.93rem', alignItems: 'flex-start' },
  bullet:     { color: '#059669', fontWeight: 700, flexShrink: 0 },
  actions:    { display: 'flex', gap: '0.85rem', flexWrap: 'wrap', alignItems: 'center' },
  applyBtn: {
    display: 'inline-block', background: 'linear-gradient(135deg,#e94560,#c2185b)',
    color: '#fff', border: 'none', borderRadius: 10,
    padding: '0.75rem 1.8rem', fontSize: '0.95rem', fontWeight: 600,
    cursor: 'pointer', textDecoration: 'none', transition: 'all 0.2s',
  },
  outlineBtn: {
    background: 'transparent', border: '2px solid #e94560', color: '#e94560',
  },
  appliedBox: { display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' },
  appliedLabel: { color: '#059669', fontWeight: 600, fontSize: '0.95rem' },
  // Modal
  modalTitle:   { fontSize: '1.25rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '0.2rem' },
  modalSub:     { color: '#9999BB', fontSize: '0.9rem', marginBottom: '1.25rem' },
  applyError:   { color: '#e94560', fontSize: '0.88rem', marginBottom: '0.9rem', fontWeight: 500 },
  label:        { display: 'block', fontWeight: 600, color: '#1A1A2E', marginBottom: '0.4rem', fontSize: '0.9rem' },
  optional:     { color: '#9999BB', fontWeight: 400 },
  textarea: {
    width: '100%', padding: '0.75rem 1rem', border: '1.5px solid rgba(200,180,220,0.4)',
    borderRadius: 10, fontSize: '0.93rem', background: 'rgba(255,255,255,0.8)',
    color: '#1a1a2e', resize: 'vertical', outline: 'none', marginBottom: '1.25rem',
    fontFamily: 'inherit',
  },
  modalActions: { display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' },
  cancelBtn: {
    padding: '0.7rem 1.4rem', borderRadius: 10, border: '1px solid #e5e7eb',
    background: '#f9fafb', color: '#374151', fontSize: '0.9rem',
    fontWeight: 600, cursor: 'pointer',
  },
}

export default JobDetailPage

