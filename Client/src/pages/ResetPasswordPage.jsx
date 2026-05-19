import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const ResetPasswordPage = () => {
  const { token } = useParams()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await api.patch(`/auth/reset-password/${token}`, {
        newPassword: form.newPassword,
      })
      login(res.data.token, res.data.user)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. Link may be expired.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card} className="premium-card animate-fade-in">
        <div style={styles.header}>
          <div style={styles.badge}>Reset</div>
          <h2 style={styles.title}>Create New Password</h2>
          <p style={styles.sub}>Enter your new password below. Ensure it is secure and unique.</p>
        </div>

        {error && (
          <div style={styles.errorContainer}>
            <span style={styles.errorIcon}>⚠</span>
            <p style={styles.error}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>New Password</label>
            <input
              style={styles.input}
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              value={form.newPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm New Password</label>
            <input
              style={styles.input}
              type="password"
              name="confirmPassword"
              placeholder="Re-enter new password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Resetting password...' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  container: { 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '80vh', 
    padding: '2rem',
    backgroundColor: '#f8fafc'
  },
  card: { 
    background: '#ffffff', 
    padding: '3rem 2.5rem', 
    borderRadius: '12px', 
    width: '100%', 
    maxWidth: '440px',
    border: '1px solid #e2e8f0',
  },
  header: {
    marginBottom: '2rem',
    textAlign: 'center',
  },
  badge: {
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    borderRadius: '30px',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#e94560',
    backgroundColor: 'rgba(233, 69, 96, 0.08)',
    marginBottom: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  title: { 
    fontSize: '1.8rem', 
    fontWeight: 800, 
    color: '#0f172a', 
    marginBottom: '0.6rem',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    letterSpacing: '-0.02em',
  },
  sub: { 
    color: '#64748b', 
    fontSize: '0.9rem',
    lineHeight: 1.6,
  },
  errorContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    background: '#fef2f2',
    border: '1px solid #fee2e2',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    marginBottom: '1.2rem',
  },
  errorIcon: {
    color: '#ef4444',
    fontSize: '1.1rem',
    fontWeight: 'bold',
  },
  error: { 
    color: '#ef4444', 
    fontSize: '0.85rem',
    margin: 0,
    fontWeight: 500,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  label: {
    fontSize: '0.82rem',
    fontWeight: 600,
    color: '#334155',
  },
  input: { 
    width: '100%', 
    padding: '0.75rem 1rem', 
    borderRadius: '8px', 
    fontSize: '0.95rem', 
    display: 'block',
    outline: 'none',
  },
  btn: { 
    width: '100%', 
    padding: '0.75rem 1rem', 
    background: '#e94560', 
    color: '#ffffff', 
    border: 'none', 
    borderRadius: '8px', 
    fontSize: '0.95rem', 
    fontWeight: 600,
    cursor: 'pointer',
  },
}

export default ResetPasswordPage
