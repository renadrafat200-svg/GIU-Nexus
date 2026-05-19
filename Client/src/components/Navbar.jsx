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
          <span style={styles.brandLogo}>✦</span>
          GIU<span style={styles.brandHighlight}>Nexus</span>
        </Link>

        <div style={styles.links}>
          <Link 
            to="/jobs" 
            style={{
              ...styles.link,
              ...(isActive('/jobs') ? styles.activeLink : {})
            }}
          >
            Browse Jobs
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
                Login
              </Link>
              <Link 
                to="/register" 
                style={styles.registerBtn}
              >
                Get Started
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
                AI Recommendations
              </Link>
              <Link 
                to="/jobs/saved" 
                style={{
                  ...styles.link,
                  ...(isActive('/jobs/saved') ? styles.activeLink : {})
                }}
              >
                Saved
              </Link>
              <Link 
                to="/applications/my" 
                style={{
                  ...styles.link,
                  ...(isActive('/applications/my') ? styles.activeLink : {})
                }}
              >
                Applications
              </Link>
              <Link 
                to="/profile" 
                style={{
                  ...styles.link,
                  ...(isActive('/profile') ? styles.activeLink : {})
                }}
              >
                Profile
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
                Post a Job
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
              <span style={styles.userInfo}>
                {user?.name?.split(' ')[0]} 
                <span style={styles.roleTag}>{user?.role}</span>
              </span>
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
    height: '76px',
    background: 'rgba(15, 14, 23, 0.75)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
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
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#fffffe',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontFamily: "'Outfit', sans-serif",
    letterSpacing: '-0.02em',
  },
  brandLogo: {
    color: '#e94560',
    fontSize: '1.7rem',
  },
  brandHighlight: {
    color: '#e94560',
  },
  links: {
    display: 'flex',
    gap: '1.8rem',
    alignItems: 'center',
  },
  link: {
    color: '#a7a9be',
    fontSize: '0.95rem',
    fontWeight: 500,
    padding: '0.4rem 0',
    position: 'relative',
    transition: 'color 0.3s ease',
  },
  activeLink: {
    color: '#fffffe',
    borderBottom: '2px solid #e94560',
  },
  registerBtn: {
    background: 'linear-gradient(135deg, #e94560 0%, #4e54c8 100%)',
    color: '#fffffe',
    padding: '0.6rem 1.4rem',
    borderRadius: '30px',
    fontSize: '0.9rem',
    fontWeight: 600,
    boxShadow: '0 4px 15px rgba(233, 69, 96, 0.2)',
    transition: 'all 0.3s ease',
  },
  logoutBtn: {
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#e94560',
    border: '1px solid rgba(233, 69, 96, 0.2)',
    padding: '0.5rem 1rem',
    borderRadius: '30px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: 600,
    transition: 'all 0.3s ease',
  },
  userContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    paddingLeft: '1rem',
    borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
  },
  userInfo: {
    color: '#fffffe',
    fontSize: '0.9rem',
    fontWeight: 500,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  roleTag: {
    fontSize: '0.7rem',
    color: '#e94560',
    textTransform: 'uppercase',
    fontWeight: 700,
    letterSpacing: '0.05em',
    marginTop: '-0.1rem',
  }
}

export default Navbar