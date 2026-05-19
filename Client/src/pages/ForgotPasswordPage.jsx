import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email })
    } catch (err) {
      // always show success to avoid email enumeration
    } finally {
      setSubmitted(true)
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div style={styles.container}>
        <div style={styles.card} className="premium-card animate-fade-in">
          <div style={styles.successBadge}>✓</div>
          <h2 style={styles.title}>Check your email</h2>
          <p style={styles.sub}>
            We have sent a secure password reset link to <strong>{email}</strong> if it is registered on our platform.
          </p>
          <Link to="/login" style={styles.backBtn}>
            Back to Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.card} className="premium-card animate-fade-in">
        <div style={styles.header}>
          <div style={styles.badge}>Security</div>
          <h2 style={styles.title}>Forgot Password?</h2>
          <p style={styles.sub}>Enter the email address associated with your account and we will email you a secure link to reset it.</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              style={styles.input}
              type="email"
              placeholder="e.g. name@student.giu-uni.de"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Sending link...' : 'Send reset link'}
          </button>
        </form>

        <div style={styles.footer}>
          <Link to="/login" style={styles.backLink}>
            ← Return to Sign In
          </Link>
        </div>
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
  successBadge: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#ecfdf5',
    color: '#10b981',
    border: '1px solid #a7f3d0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1.4rem',
    fontWeight: 'bold',
    margin: '0 auto 1.5rem auto',
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
  backBtn: {
    display: 'inline-block',
    marginTop: '1.5rem',
    padding: '0.55rem 1.4rem',
    background: '#f1f5f9',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    color: '#334155',
    fontSize: '0.88rem',
    fontWeight: 600,
    textAlign: 'center',
  },
  footer: {
    marginTop: '1.5rem',
    textAlign: 'center',
    borderTop: '1px solid #f1f5f9',
    paddingTop: '1.2rem',
  },
  backLink: {
    fontSize: '0.88rem',
    color: '#64748b',
    fontWeight: 500,
  }
}

export default ForgotPasswordPage
