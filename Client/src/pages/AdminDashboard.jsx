import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/users/stats')
      .then(res => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={styles.wrapper}>
      <div style={styles.bubble1} />
      <div style={styles.bubble2} />

      <div style={styles.inner}>
        <h1 style={styles.pageTitle}>📊 Admin Dashboard</h1>
        <p style={styles.pageSub}>Platform overview and management</p>

        {loading && <p style={styles.center}>Loading stats...</p>}

        {/* Stats Grid */}
        {!loading && stats && (
          <div style={styles.statsGrid}>
            {[
              { icon: '👥', label: 'Total Users', value: stats.totalUsers || 0, color: '#3498db' },
              { icon: '🎓', label: 'Job Seekers', value: stats.totalJobSeekers || 0, color: '#8e44ad' },
              { icon: '💼', label: 'Recruiters', value: stats.totalRecruiters || 0, color: '#e94560' },
              { icon: '⏳', label: 'Pending Recruiters', value: stats.pendingRecruiters || 0, color: '#f39c12' },
              { icon: '📋', label: 'Total Jobs', value: stats.totalJobs || 0, color: '#27ae60' },
              { icon: '📨', label: 'Total Applications', value: stats.totalApplications || 0, color: '#e74c3c' },
            ].map((s, i) => (
              <div key={i} className="glass-card fade-in" style={styles.statCard}>
                <span style={styles.statIcon}>{s.icon}</span>
                <span style={{ ...styles.statValue, color: s.color }}>{s.value}</span>
                <span style={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={styles.actionsGrid}>
          {[
            { to: '/admin/pending-recruiters', icon: '⏳', label: 'Pending Recruiters', desc: 'Review and approve recruiter accounts' },
            { to: '/admin/users', icon: '👥', label: 'Manage Users', desc: 'View, edit, or remove platform users' },
            { to: '/admin/jobs', icon: '💼', label: 'Manage Jobs', desc: 'Monitor and manage all job postings' },
          ].map((action, i) => (
            <Link key={i} to={action.to} style={{ textDecoration: 'none' }}>
              <div className="glass-card fade-in" style={styles.actionCard}>
                <span style={styles.actionIcon}>{action.icon}</span>
                <h3 style={styles.actionLabel}>{action.label}</h3>
                <p style={styles.actionDesc}>{action.desc}</p>
                <span style={styles.actionArrow}>Go →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrapper: { minHeight: '90vh', padding: '2rem', position: 'relative' },
  bubble1: {
    position: 'fixed', width: '280px', height: '280px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,182,215,0.4), rgba(200,160,228,0.15))',
    top: '5%', right: '5%', filter: 'blur(2px)', pointerEvents: 'none', zIndex: 0,
    animation: 'float1 7s ease-in-out infinite',
  },
  bubble2: {
    position: 'fixed', width: '200px', height: '200px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,107,157,0.3), rgba(180,140,220,0.1))',
    bottom: '10%', left: '5%', filter: 'blur(2px)', pointerEvents: 'none', zIndex: 0,
    animation: 'float2 9s ease-in-out infinite',
  },
  inner: { maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 },
  pageTitle: { fontSize: '2.2rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '0.4rem' },
  pageSub: { color: '#9999BB', marginBottom: '2rem' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2.5rem' },
  statCard: { padding: '1.5rem 1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center' },
  statIcon: { fontSize: '1.8rem' },
  statValue: { fontSize: '2rem', fontWeight: 700 },
  statLabel: { color: '#9999BB', fontSize: '0.82rem' },
  sectionTitle: { fontSize: '1.4rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '1.2rem' },
  actionsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' },
  actionCard: { padding: '2rem', cursor: 'pointer', transition: 'transform 0.2s' },
  actionIcon: { fontSize: '2.2rem', display: 'block', marginBottom: '0.8rem' },
  actionLabel: { fontSize: '1.1rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '0.4rem' },
  actionDesc: { color: '#9999BB', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '1rem' },
  actionArrow: { color: '#e94560', fontWeight: 700, fontSize: '0.9rem' },
  center: { textAlign: 'center', padding: '3rem', color: '#9999BB' },
}

export default AdminDashboard