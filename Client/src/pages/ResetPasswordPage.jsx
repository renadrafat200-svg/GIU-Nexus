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
      <div style={styles.card} className="glass-card">
        <div style={styles.header}>
          <div style={styles.logoCircle}>⚙</div>
          <h2 style={styles.title}>Reset Password</h2>
          <p style={styles.sub}>Please create a secure new password to access your account.</p>
        </div>

        {error && (
          <div style={styles.errorContainer}>
            <span style={styles.errorIcon}>⚠</span>
            <p style={styles.error}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputWrapper}>
            <span style={styles.inputIcon}>🔑</span>
            <input
              style={styles.input}
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={form.newPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.inputWrapper}>
            <span style={styles.inputIcon}>🔑</span>
            <input
              style={styles.input}
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button style={styles.btn} className="glow-btn" type="submit" disabled={loading}>
            {loading ? 'Updating Password...' : 'Reset Password'}
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
    position: 'relative'
  },
  card: { 
    padding: '3rem 2.5rem', 
    borderRadius: '20px', 
    width: '100%', 
    maxWidth: '440px',
    animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards'
  },
  header: {
    marginBottom: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  logoCircle: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: 'rgba(78, 84, 200, 0.1)',
    border: '1px solid rgba(78, 84, 200, 0.2)',
    color: '#8f94fb',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1.6rem',
    marginBottom: '1rem',
  },
  title: { 
    fontSize: '2rem', 
    fontWeight: 800, 
    color: '#fffffe', 
    marginBottom: '0.6rem',
    fontFamily: "'Outfit', sans-serif",
    letterSpacing: '-0.02em',
  },
  sub: { 
    color: '#a7a9be', 
    fontSize: '0.95rem',
    lineHeight: 1.6,
    maxWidth: '340px',
  },
  errorContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    padding: '0.8rem 1rem',
    borderRadius: '10px',
    marginBottom: '1.5rem',
  },
  errorIcon: {
    color: '#ef4444',
    fontSize: '1.1rem',
    fontWeight: 'bold',
  },
  error: { 
    color: '#ef4444', 
    fontSize: '0.88rem',
    margin: 0,
    fontWeight: 500,
    lineHeight: 1.4,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '1.2rem',
    color: '#a7a9be',
    fontSize: '1rem',
  },
  input: { 
    width: '100%', 
    padding: '0.9rem 1rem 0.9rem 2.8rem', 
    background: 'rgba(255, 255, 255, 0.04)', 
    border: '1px solid rgba(255, 255, 255, 0.08)', 
    borderRadius: '12px', 
    fontSize: '0.95rem', 
    color: '#fffffe',
    display: 'block',
  },
  btn: { 
    width: '100%', 
    padding: '0.9rem', 
    borderRadius: '12px', 
    fontSize: '1rem', 
    cursor: 'pointer',
    border: 'none',
    boxShadow: '0 4px 15px rgba(233, 69, 96, 0.2)',
  },
}

export default ResetPasswordPage
