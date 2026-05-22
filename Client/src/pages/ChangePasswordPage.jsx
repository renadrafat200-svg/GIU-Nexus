// ChangePasswordPage.jsx — Mostafa Elsheehy
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'

const ChangePasswordPage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await api.patch('/profile/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      })
      setSuccess(true)
      setTimeout(() => navigate('/profile'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password.')
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
        <Link to="/profile" style={styles.back}>← Back to Profile</Link>

        <div className="glass-card fade-in" style={styles.card}>
          <h2 style={styles.title}>Change Password</h2>
          <p style={styles.sub}>Keep your account secure</p>

          {error && <p className="error-text">{error}</p>}
          {success && <p style={styles.success}>✅ Password changed! Redirecting...</p>}

          <form onSubmit={handleSubmit}>
            <label style={styles.label}>Current Password</label>
            <input className="input-field" type="password" name="currentPassword"
              placeholder="🔒 Current password" value={form.currentPassword}
              onChange={handleChange} required />

            <label style={styles.label}>New Password</label>
            <input className="input-field" type="password" name="newPassword"
              placeholder="🔒 New password" value={form.newPassword}
              onChange={handleChange} required />

            <label style={styles.label}>Confirm New Password</label>
            <input className="input-field" type="password" name="confirmPassword"
              placeholder="🔒 Confirm new password" value={form.confirmPassword}
              onChange={handleChange} required />

            <button className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}
              type="submit" disabled={loading}>
              {loading ? 'Updating...' : '🔐 Update Password'}
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
  inner: { maxWidth: '500px', margin: '0 auto', position: 'relative', zIndex: 1 },
  back: { color: '#9999BB', fontSize: '0.9rem', display: 'inline-block', marginBottom: '1.2rem' },
  card: { padding: '2.5rem 2rem' },
  title: { fontSize: '2.2rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '0.4rem', textAlign: 'center' },
  sub: { color: '#9999BB', fontSize: '0.9rem', marginBottom: '2rem', textAlign: 'center' },
  label: { display: 'block', fontWeight: 600, color: '#1A1A2E', marginBottom: '0.3rem', fontSize: '0.9rem' },
  success: { color: '#27ae60', fontWeight: 600, marginBottom: '1rem', textAlign: 'center' },
}

export default ChangePasswordPage