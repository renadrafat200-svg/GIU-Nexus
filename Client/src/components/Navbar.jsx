import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.brand}>
          <span style={styles.brandIcon}>✦</span>
          GIU <span style={styles.brandHighlight}>Nexus</span>
        </Link>

        <div style={styles.links}>
          <Link 
            to="/jobs" 
            style={{
              ...styles.link,
              ...(isActive('/jobs') ? styles.activeLink : {})
            }}
          >
            Explore Jobs
          </Link>

          {!isAuthenticated && (
            <>
              <Link 
                to="/login" 
                style={{
                  ...styles.link,
                  ...(isActive('/login') ? styles.activeLink : {})
                }}
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                style={styles.registerBtn}
              >
                Join Platform
              </Link>
            </>
          )}

          {isAuthenticated && user?.role === 'jobSeeker' && (
            <>
              <Link 
                to="/jobs/recommended" 
                style={{
                  ...styles.link,
                  ...(isActive('/jobs/recommended') ? styles.activeLink : {})
                }}
              >
                AI Job Match
              </Link>
              <Link 
                to="/jobs/saved" 
                style={{
                  ...styles.link,
                  ...(isActive('/jobs/saved') ? styles.activeLink : {})
                }}
              >
                Bookmarked
              </Link>
              <Link 
                to="/applications/my" 
                style={{
                  ...styles.link,
                  ...(isActive('/applications/my') ? styles.activeLink : {})
                }}
              >
                My Applications
              </Link>
              <Link 
                to="/profile" 
                style={{
                  ...styles.link,
                  ...(isActive('/profile') ? styles.activeLink : {})
                }}
              >
                My Profile
              </Link>
            </>
          )}

          {isAuthenticated && user?.role === 'recruiter' && (
            <>
              <Link 
                to="/recruiter/dashboard" 
                style={{
                  ...styles.link,
                  ...(isActive('/recruiter/dashboard') ? styles.activeLink : {})
                }}
              >
                Recruiter Portal
              </Link>
              <Link 
                to="/recruiter/jobs/create" 
                style={{
                  ...styles.link,
                  ...(isActive('/recruiter/jobs/create') ? styles.activeLink : {})
                }}
              >
                Post vacancy
              </Link>
            </>
          )}

          {isAuthenticated && user?.role === 'admin' && (
            <>
              <Link 
                to="/admin/dashboard" 
                style={{
                  ...styles.link,
                  ...(isActive('/admin/dashboard') ? styles.activeLink : {})
                }}
              >
                Admin Panel
              </Link>
              <Link 
                to="/admin/recruiters" 
                style={{
                  ...styles.link,
                  ...(isActive('/admin/recruiters') ? styles.activeLink : {})
                }}
              >
                Approvals
              </Link>
              <Link 
                to="/admin/jobs" 
                style={{
                  ...styles.link,
                  ...(isActive('/admin/jobs') ? styles.activeLink : {})
                }}
              >
                All Jobs
              </Link>
              <Link 
                to="/admin/users" 
                style={{
                  ...styles.link,
                  ...(isActive('/admin/users') ? styles.activeLink : {})
                }}
              >
                Users
              </Link>
            </>
          )}

          {isAuthenticated && (
            <div style={styles.userContainer}>
              <div style={styles.userInfo}>
                <span style={styles.userName}>{user?.name?.split(' ')[0]}</span>
                <span style={styles.roleTag}>{user?.role}</span>
              </div>
              <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    width: '100%',
    height: '70px',
    background: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
  },
  container: {
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    fontSize: '1.35rem',
    fontWeight: 800,
    color: '#0f172a',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    letterSpacing: '-0.02em',
  },
  brandIcon: {
    color: '#e94560',
    fontSize: '1.4rem',
  },
  brandHighlight: {
    color: '#e94560',
  },
  links: {
    display: 'flex',
    gap: '1.6rem',
    alignItems: 'center',
  },
  link: {
    color: '#64748b',
    fontSize: '0.92rem',
    fontWeight: 500,
    padding: '0.4rem 0',
    position: 'relative',
    transition: 'color 0.2s ease',
  },
  activeLink: {
    color: '#e94560',
    fontWeight: 600,
  },
  registerBtn: {
    background: '#e94560',
    color: '#ffffff',
    padding: '0.55rem 1.2rem',
    borderRadius: '6px',
    fontSize: '0.88rem',
    fontWeight: 600,
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(233, 69, 96, 0.1)',
  },
  logoutBtn: {
    background: '#f1f5f9',
    color: '#64748b',
    border: '1px solid #cbd5e1',
    padding: '0.45rem 0.9rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.82rem',
    fontWeight: 600,
    transition: 'all 0.2s ease',
  },
  userContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    paddingLeft: '0.8rem',
    borderLeft: '1px solid #e2e8f0',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    lineHeight: 1.2,
  },
  userName: {
    color: '#0f172a',
    fontSize: '0.88rem',
    fontWeight: 600,
  },
  roleTag: {
    fontSize: '0.68rem',
    color: '#e94560',
    textTransform: 'uppercase',
    fontWeight: 700,
    letterSpacing: '0.02em',
  }
}

export default Navbar