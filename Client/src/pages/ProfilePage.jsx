import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import Spinner from '../components/Spinner'

const ProfilePage = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [extracting, setExtracting] = useState(false)
  const [extractError, setExtractError] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile')
        setProfile(res.data.user)
      } catch (err) {
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleExtractSkills = async () => {
    setExtracting(true)
    setExtractError('')
    try {
      const res = await api.post('/profile/extract-skills')
      setProfile(prev => ({ ...prev, skills: res.data.skills }))
    } catch (err) {
      setExtractError(err.response?.data?.message || 'Failed to extract skills')
    } finally {
      setExtracting(false)
    }
  }

  if (loading) return <Spinner />
  if (error) return <p style={{ textAlign: 'center', color: '#e94560', padding: '2rem' }}>{error}</p>

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.avatar}>
            {profile.profilePicture
              ? <img src={profile.profilePicture} alt="avatar" style={styles.avatarImg} />
              : <div style={styles.avatarPlaceholder}>{profile.name?.[0]?.toUpperCase()}</div>
            }
          </div>
          <div>
            <h2 style={styles.name}>{profile.name}</h2>
            <p style={styles.email}>{profile.email}</p>
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Bio</h3>
          <p style={styles.bio}>{profile.bio || 'No bio yet.'}</p>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Skills</h3>
          <div style={styles.chipsRow}>
            {profile.skills?.length > 0
              ? profile.skills.map((skill, i) => (
                <span key={i} style={styles.chip}>{skill}</span>
              ))
              : <p style={{ color: '#888' }}>No skills extracted yet.</p>
            }
          </div>
          <button onClick={handleExtractSkills} style={styles.extractBtn} disabled={extracting}>
            {extracting ? 'Extracting...' : 'Extract Skills from Bio'}
          </button>
          {extractError && (
            <p style={styles.extractError}>
              {extractError} <Link to="/profile/edit">Update your bio</Link>
            </p>
          )}
        </div>

        <div style={styles.actions}>
          <Link to="/profile/edit" style={styles.editBtn}>Edit Profile</Link>
          <Link to="/profile/change-password" style={styles.pwdBtn}>Change Password</Link>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { maxWidth: '700px', margin: '2rem auto', padding: '0 1rem' },
  card: { background: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', padding: '2rem' },
  header: { display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' },
  avatar: { flexShrink: 0 },
  avatarImg: { width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' },
  avatarPlaceholder: { width: '80px', height: '80px', borderRadius: '50%', background: '#e94560', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700 },
  name: { fontSize: '1.5rem', fontWeight: 700, color: '#1a1a2e' },
  email: { color: '#888', marginTop: '0.2rem' },
  section: { marginBottom: '1.5rem' },
  sectionTitle: { fontSize: '1rem', fontWeight: 600, color: '#1a1a2e', marginBottom: '0.75rem' },
  bio: { color: '#555', lineHeight: 1.6 },
  chipsRow: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' },
  chip: { background: '#f0f4ff', color: '#1a1a2e', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 500 },
  extractBtn: { background: '#1a1a2e', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' },
  extractError: { color: '#e94560', marginTop: '0.5rem', fontSize: '0.9rem' },
  actions: { display: 'flex', gap: '1rem', marginTop: '1.5rem' },
  editBtn: { background: '#e94560', color: '#fff', padding: '0.6rem 1.2rem', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' },
  pwdBtn: { background: '#f5f7fa', color: '#1a1a2e', padding: '0.6rem 1.2rem', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', border: '1px solid #ddd' },
}

export default ProfilePage

//ProfilePage
