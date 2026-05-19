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
        <div style={styles.card} className="glass-card">
          <div style={styles.iconContainer}>
            <span style={styles.successIcon}>✓</span>
          </div>
          <h2 style={styles.title}>Check Your Email</h2>
          <p style={styles.sub}>
            If an account exists with <strong>{email}</strong>, a password reset link has been sent to it.
          </p>
          <Link to="/login" style={styles.backBtn}>
            Back to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.card} className="glass-card">
        <div style={styles.header}>
          <div style={styles.logoCircle}>✦</div>
          <h2 style={styles.title}>Forgot Password</h2>
          <p style={styles.sub}>Enter your registered email and we'll send you a secure link to reset your password.</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputWrapper}>
            <span style={styles.inputIcon}>✉</span>
            <input
              style={styles.input}
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <button style={styles.btn} className="glow-btn" type="submit" disabled={loading}>
            {loading ? 'Sending Secure Link...' : 'Send Reset Link'}
          </button>
        </form>

        <div style={styles.footerLink}>
          <Link to="/login" style={styles.linkText}>
            ← Back to Login
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
    position: 'relative'
  },
  card: { 
    padding: '3rem 2.5rem', 
    borderRadius: '20px', 
    width: '100%', 
    maxWidth: '440px',
    textAlign: 'center',
    animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards'
  },
  header: {
    marginBottom: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logoCircle: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: 'rgba(233, 69, 96, 0.1)',
    border: '1px solid rgba(233, 69, 96, 0.2)',
    color: '#e94560',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1.6rem',
    marginBottom: '1rem',
  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1.5rem',
  },
  successIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    color: '#10b981',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '2rem',
    fontWeight: 'bold',
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
    margin: '0 auto',
    maxWidth: '340px',
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
    fontSize: '1.1rem',
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
  backBtn: {
    display: 'inline-block',
    marginTop: '1.8rem',
    padding: '0.75rem 1.8rem',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '30px',
    color: '#fffffe',
    fontSize: '0.9rem',
    fontWeight: 600,
    transition: 'all 0.3s ease',
  },
  footerLink: {
    marginTop: '1.8rem',
    textAlign: 'center',
  },
  linkText: {
    fontSize: '0.9rem',
    color: '#a7a9be',
    fontWeight: 500,
  }
}

export default ForgotPasswordPage
