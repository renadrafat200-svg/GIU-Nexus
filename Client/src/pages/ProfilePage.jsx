
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const ProfilePage = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [extracting, setExtracting] = useState(false)
  const [extractMsg, setExtractMsg] = useState('')

  useEffect(() => {
    api.get('/profile')
      .then(res => setProfile(res.data.user))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleExtractSkills = async () => {
    setExtracting(true)
    setExtractMsg('')
    try {
      const res = await api.post('/profile/extract-skills')
      setProfile(p => ({ ...p, skills: res.data.skills }))
      setExtractMsg('✅ Skills extracted successfully!')
    } catch {
      setExtractMsg('❌ Failed to extract skills. Make sure your bio is filled in.')
    } finally {
      setExtracting(false)
    }
  }

  if (loading) return <p style={styles.center}>Loading profile...</p>
  if (!profile) return <p style={styles.center}>Could not load profile.</p>

  return (
    <div style={styles.wrapper}>
      <div style={styles.bubble1} />
      <div style={styles.bubble2} />
      <div style={styles.bubble3} />

      <div style={styles.inner}>
        {/* Profile Header */}
        <div className="glass-card fade-in" style={styles.headerCard}>
          <div style={styles.avatarWrap}>
            {profile.profilePicture
              ? <img src={profile.profilePicture} alt="avatar" style={styles.avatar} />
              : <div style={styles.avatarFallback}>{profile.name?.[0]?.toUpperCase()}</div>
            }
          </div>
          <div style={styles.headerInfo}>
            <h1 style={styles.name}>{profile.name}</h1>
            <p style={styles.email}>📧 {profile.email}</p>
            <span style={{ ...styles.roleBadge, background: roleColor[profile.role] || '#9999BB' }}>
              {profile.role}
            </span>
            {profile.status && profile.role === 'recruiter' && (
              <span style={{ ...styles.roleBadge, background: statusColor[profile.status] || '#9999BB', marginLeft: '0.5rem' }}>
                {profile.status}
              </span>
            )}
          </div>
          <div style={styles.headerActions}>
            <Link to="/profile/edit" className="btn-primary" style={styles.editBtn}>✏️ Edit Profile</Link>
            <Link to="/profile/change-password" className="btn-primary" style={{ ...styles.editBtn, ...styles.outlineBtn }}>
              🔒 Change Password
            </Link>
          </div>
        </div>

        <div style={styles.twoCol}>
          {/* Left */}
          <div style={styles.leftCol}>
            {/* Bio */}
            <div className="glass-card fade-in" style={styles.section}>
              <h3 style={styles.sectionTitle}>About</h3>
              {profile.bio
                ? <p style={styles.bio}>{profile.bio}</p>
                : <p style={styles.empty}>No bio added yet. <Link to="/profile/edit" style={styles.link}>Add one →</Link></p>
              }
            </div>

            {/* Skills */}
            {profile.role === 'jobSeeker' && (
              <div className="glass-card fade-in" style={styles.section}>
                <div style={styles.sectionHeader}>
                  <h3 style={styles.sectionTitle}>Skills</h3>
                  <button
                    className="btn-primary"
                    style={styles.aiBtn}
                    onClick={handleExtractSkills}
                    disabled={extracting}
                  >
                    {extracting ? 'Extracting...' : '🤖 AI Extract'}
                  </button>
                </div>
                {extractMsg && <p style={styles.extractMsg}>{extractMsg}</p>}
                {profile.skills?.length > 0
                  ? <div style={styles.skillsWrap}>
                      {profile.skills.map((s, i) => <span key={i} style={styles.skillTag}>{s}</span>)}
                    </div>
                  : <p style={styles.empty}>No skills listed. Use AI Extract or <Link to="/profile/edit" style={styles.link}>edit your profile →</Link></p>
                }
              </div>
            )}
          </div>

          {/* Right */}
          <div style={styles.rightCol}>
            {/* Quick Links */}
            <div className="glass-card fade-in" style={styles.section}>
              <h3 style={styles.sectionTitle}>Quick Links</h3>
              <div style={styles.quickLinks}>
                {profile.role === 'jobSeeker' && (
                  <>
                    <Link to="/my-applications" style={styles.quickLink}>📋 My Applications</Link>
                    <Link to="/jobs/saved" style={styles.quickLink}>🔖 Saved Jobs</Link>
                    <Link to="/jobs/recommended" style={styles.quickLink}>⭐ Recommended Jobs</Link>
                  </>
                )}
                {profile.role === 'recruiter' && (
                  <>
                    <Link to="/recruiter/dashboard" style={styles.quickLink}>📊 My Dashboard</Link>
                    <Link to="/jobs/create" style={styles.quickLink}>➕ Post a Job</Link>
                  </>
                )}
                {profile.role === 'admin' && (
                  <>
                    <Link to="/admin/dashboard" style={styles.quickLink}>📊 Admin Dashboard</Link>
                    <Link to="/admin/users" style={styles.quickLink}>👥 Manage Users</Link>
                  </>
                )}
              </div>
            </div>

            {/* Account Info */}
            <div className="glass-card fade-in" style={styles.section}>
              <h3 style={styles.sectionTitle}>Account Info</h3>
              <p style={styles.infoRow}><span style={styles.infoLabel}>Role</span> <span>{profile.role}</span></p>
              <p style={styles.infoRow}><span style={styles.infoLabel}>Status</span> <span>{profile.status}</span></p>
              <p style={styles.infoRow}>
                <span style={styles.infoLabel}>Member since</span>
                <span>{new Date(profile.createdAt).toLocaleDateString()}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const roleColor = { jobSeeker: '#3498db', recruiter: '#8e44ad', admin: '#e94560' }
const statusColor = { approved: '#27ae60', pending: '#f39c12', rejected: '#e94560' }

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
  inner: { maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 },
  headerCard: { padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' },
  avatarWrap: { flexShrink: 0 },
  avatar: { width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #e94560' },
  avatarFallback: {
    width: '90px', height: '90px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #e94560, #c0396e)',
    color: '#fff', fontSize: '2.2rem', fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  headerInfo: { flex: 1 },
  name: { fontSize: '1.8rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '0.3rem' },
  email: { color: '#9999BB', fontSize: '0.9rem', marginBottom: '0.6rem' },
  roleBadge: { color: '#fff', fontSize: '0.78rem', fontWeight: 600, padding: '0.25rem 0.7rem', borderRadius: '20px' },
  headerActions: { display: 'flex', gap: '0.8rem', flexWrap: 'wrap' },
  editBtn: { padding: '0.6rem 1.2rem', borderRadius: '10px', textDecoration: 'none', display: 'inline-block', fontSize: '0.9rem' },
  outlineBtn: { background: 'transparent', border: '2px solid #e94560', color: '#e94560' },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' },
  leftCol: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  rightCol: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  section: { padding: '1.5rem' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  sectionTitle: { fontSize: '1.1rem', fontWeight: 700, color: '#1A1A2E', marginBottom: '0.8rem' },
  bio: { color: '#444', lineHeight: 1.7, whiteSpace: 'pre-wrap' },
  empty: { color: '#9999BB', fontSize: '0.9rem' },
  link: { color: '#e94560', fontWeight: 600 },
  skillsWrap: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem' },
  skillTag: {
    background: 'linear-gradient(135deg, rgba(233,69,96,0.1), rgba(192,57,110,0.08))',
    color: '#e94560', border: '1px solid rgba(233,69,96,0.3)',
    borderRadius: '20px', padding: '0.3rem 0.8rem', fontSize: '0.85rem', fontWeight: 600,
  },
  aiBtn: { padding: '0.4rem 0.9rem', fontSize: '0.82rem', borderRadius: '8px' },
  extractMsg: { fontSize: '0.85rem', marginBottom: '0.8rem', color: '#555' },
  quickLinks: { display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  quickLink: { color: '#1A1A2E', fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none', padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.05)' },
  infoRow: { display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.05)', fontSize: '0.9rem', color: '#444' },
  infoLabel: { color: '#9999BB', fontWeight: 600 },
  center: { textAlign: 'center', padding: '4rem', color: '#9999BB' },
}

export default ProfilePage