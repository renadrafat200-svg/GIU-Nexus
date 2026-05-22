// CreateJobPage.jsx — Kareem Elayouty

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const CreateJobPage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '', company: '', description: '', location: '',
    type: 'internship', salary: '', totalSlots: '', requirements: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = {
        ...form,
        totalSlots: Number(form.totalSlots),
        requirements: form.requirements.split('\n').map(r => r.trim()).filter(Boolean),
      }
      const res = await api.post('/jobs', payload)
      setSuccess(true)
      setTimeout(() => navigate(`/jobs/${res.data.job._id}`), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create job.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.bubble1} />
      <div style={styles.bubble2} />
      <div style={styles.bubble3} />

      <div style={styles.inner}>
        <div className="glass-card fade-in" style={styles.card}>
          <h2 style={styles.title}>Post a Job</h2>
          <p style={styles.sub}>Fill in the details and let AI classify it for you</p>

          {error && <p className="error-text">{error}</p>}
          {success && <p style={styles.success}>✅ Job posted! Redirecting...</p>}

          <form onSubmit={handleSubmit}>
            <label style={styles.label}>Job Title</label>
            <input className="input-field" name="title" placeholder="e.g. Frontend Developer Intern"
              value={form.title} onChange={handleChange} required />

            <label style={styles.label}>Company Name</label>
            <input className="input-field" name="company" placeholder="e.g. Google"
              value={form.company} onChange={handleChange} required />

            <label style={styles.label}>Location</label>
            <input className="input-field" name="location" placeholder="e.g. Cairo, Egypt"
              value={form.location} onChange={handleChange} required />

            <div style={styles.row}>
              <div style={styles.half}>
                <label style={styles.label}>Job Type</label>
                <select className="input-field" name="type" value={form.type} onChange={handleChange}>
                  <option value="internship">🎓 Internship</option>
                  <option value="full-time">💼 Full-Time</option>
                  <option value="part-time">⏰ Part-Time</option>
                </select>
              </div>
              <div style={styles.half}>
                <label style={styles.label}>Total Slots</label>
                <input className="input-field" name="totalSlots" type="number" min="1"
                  placeholder="e.g. 5" value={form.totalSlots} onChange={handleChange} required />
              </div>
            </div>

            <label style={styles.label}>Salary <span style={styles.optional}>(optional)</span></label>
            <input className="input-field" name="salary" placeholder="e.g. 5000 EGP/month"
              value={form.salary} onChange={handleChange} />

            <label style={styles.label}>Description</label>
            <textarea className="input-field" name="description"
              placeholder="Describe the role, responsibilities, and what you're looking for..."
              value={form.description} onChange={handleChange} rows={5}
              style={{ resize: 'vertical' }} required />

            <label style={styles.label}>Requirements <span style={styles.optional}>(one per line)</span></label>
            <textarea className="input-field" name="requirements"
              placeholder={"React\nNode.js\nGood communication skills"}
              value={form.requirements} onChange={handleChange} rows={4}
              style={{ resize: 'vertical' }} />

            <p style={styles.aiNote}>🤖 AI will automatically classify this job into a category.</p>

            <button className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}
              type="submit" disabled={loading}>
              {loading ? 'Posting...' : 'Post Job'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrapper: { minHeight: '90vh', padding: '2rem', position: 'relative' },
  bubble1: {
    position: 'fixed', width: '250px', height: '250px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,182,215,0.5), rgba(200,160,228,0.2))',
    top: '10%', right: '10%', filter: 'blur(1px)', pointerEvents: 'none', zIndex: 0,
    animation: 'float1 7s ease-in-out infinite',
  },
  bubble2: {
    position: 'fixed', width: '180px', height: '180px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,107,157,0.4), rgba(180,140,220,0.15))',
    bottom: '15%', left: '8%', filter: 'blur(1px)', pointerEvents: 'none', zIndex: 0,
    animation: 'float2 9s ease-in-out infinite',
  },
  bubble3: {
    position: 'fixed', width: '120px', height: '120px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,200,230,0.6), rgba(220,180,240,0.2))',
    top: '50%', left: '5%', filter: 'blur(1px)', pointerEvents: 'none', zIndex: 0,
    animation: 'float1 11s ease-in-out infinite',
  },
  inner: { maxWidth: '680px', margin: '0 auto', position: 'relative', zIndex: 1 },
  card: { padding: '2.5rem 2rem' },
  title: { fontSize: '2.2rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '0.4rem', textAlign: 'center' },
  sub: { color: '#9999BB', fontSize: '0.9rem', marginBottom: '2rem', textAlign: 'center' },
  label: { display: 'block', fontWeight: 600, color: '#1A1A2E', marginBottom: '0.3rem', fontSize: '0.9rem' },
  optional: { color: '#9999BB', fontWeight: 400 },
  row: { display: 'flex', gap: '1rem' },
  half: { flex: 1 },
  aiNote: { color: '#9999BB', fontSize: '0.85rem', marginTop: '0.5rem', fontStyle: 'italic' },
  success: { color: '#27ae60', fontWeight: 600, marginBottom: '1rem', textAlign: 'center' },
}

export default CreateJobPage
