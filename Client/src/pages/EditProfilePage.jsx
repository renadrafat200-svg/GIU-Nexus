
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const EditProfilePage = () => {
  const { user, login, token } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', bio: '', skills: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    api.get('/profile')
      .then(res => {
        const u = res.data.user
        setForm({
          name: u.name || '',
          bio: u.bio || '',
          skills: (u.skills || []).join(', '),
        })
      })
      .catch(() => setError('Failed to load profile.'))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = {
        name: form.name,
        bio: form.bio,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      }
      const res = await api.patch('/profile', payload)
      login(token, res.data.user)
      setSuccess(true)
      setTimeout(() => navigate('/profile'), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p style={styles.center}>Loading...</p>

  return (
    <div style={styles.wrapper}>
      <div style={styles.bubble1} />
      <div style={styles.bubble2} />
      <div style={styles.bubble3} />

      <div style={styles.inner}>
        <Link to="/profile" style={styles.back}>← Back to Profile</Link>

        <div className="glass-card fade-in" style={styles.card}>
          <h2 style={styles.title}>Edit Profile</h2>
          <p style={styles.sub}>Update your personal information</p>

          {error && <p className="error-text">{error}</p>}
          {success && <p style={styles.success}>✅ Profile updated! Redirecting...</p>}

          <form onSubmit={handleSubmit}>
            <label style={styles.label}>Full Name</label>
            <input className="input-field" name="name" placeholder="Your full name"
              value={form.name} onChange={handleChange} required />

            <label style={styles.label}>Bio</label>
            <textarea className="input-field" name="bio"
              placeholder="Tell recruiters about yourself, your experience, and what you're looking for..."
              value={form.bio} onChange={handleChange} rows={5} style={{ resize: 'vertical' }} />

            {user?.role === 'jobSeeker' && (
              <>
                <label style={styles.label}>
                  Skills <span style={styles.optional}>(comma separated)</span>
                </label>
                <input className="input-field" name="skills"
                  placeholder="e.g. React, Node.js, Python, Machine Learning"
                  value={form.skills} onChange={handleChange} />
                <p style={styles.hint}>💡 Or use the AI Extract button on your profile to auto-detect skills from your bio.</p>
              </>
            )}

            <button className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}
              type="submit" disabled={saving}>
              {saving ? 'Saving...' : '💾 Save Changes'}
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
  inner: { maxWidth: '600px', margin: '0 auto', position: 'relative', zIndex: 1 },
  back: { color: '#9999BB', fontSize: '0.9rem', display: 'inline-block', marginBottom: '1.2rem' },
  card: { padding: '2.5rem 2rem' },
  title: { fontSize: '2.2rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '0.4rem', textAlign: 'center' },
  sub: { color: '#9999BB', fontSize: '0.9rem', marginBottom: '2rem', textAlign: 'center' },
  label: { display: 'block', fontWeight: 600, color: '#1A1A2E', marginBottom: '0.3rem', fontSize: '0.9rem' },
  optional: { color: '#9999BB', fontWeight: 400 },
  hint: { color: '#9999BB', fontSize: '0.82rem', marginTop: '-0.5rem', marginBottom: '1rem', fontStyle: 'italic' },
  success: { color: '#27ae60', fontWeight: 600, marginBottom: '1rem', textAlign: 'center' },
  center: { textAlign: 'center', padding: '4rem', color: '#9999BB' },

}

export default EditProfilePage