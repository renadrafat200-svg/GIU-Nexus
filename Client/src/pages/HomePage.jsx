import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const HomePage = () => {
  const { isAuthenticated, user } = useAuth()

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.heroSection} className="animate-fade-in">
        <div style={styles.badge}>
          <span style={styles.badgeIcon}>✦</span>
          <span>Official GIU Career Portal</span>
        </div>
        
        <h1 style={styles.heroTitle}>
          Connecting German International University <br />
          Talent with <span style={styles.highlightText}>AI-Powered</span> Opportunities
        </h1>
        
        <p style={styles.heroSubtitle}>
          GIU Nexus bridges the gap between top-tier student capabilities and leading industry recruiters, 
          leveraging state-of-the-art NLP models to streamline job search and candidate matching.
        </p>

        <div style={styles.heroButtons}>
          <Link to="/jobs" style={styles.primaryBtn}>
            Browse Vacancies
          </Link>
          
          {!isAuthenticated ? (
            <Link to="/register" style={styles.secondaryBtn}>
              Join Platform
            </Link>
          ) : (
            <Link to={user?.role === 'recruiter' ? '/recruiter/dashboard' : '/profile'} style={styles.secondaryBtn}>
              Dashboard Access
            </Link>
          )}
        </div>
      </section>

      {/* Platform Features Grid */}
      <section style={styles.featuresSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Built on Talent Intelligence</h2>
          <p style={styles.sectionSubtitle}>Empowering recruitment and career progression through advanced NLP matching pipelines.</p>
        </div>

        <div style={styles.grid}>
          {/* Card 1 */}
          <div style={styles.card} className="premium-card">
            <div style={{ ...styles.cardIconCircle, background: 'rgba(233, 69, 96, 0.08)', color: '#e94560' }}>📊</div>
            <h3 style={styles.cardTitle}>Skill Extraction AI</h3>
            <p style={styles.cardText}>
              Leverages fine-tuned Named Entity Recognition (NER) models. Automatically analyzes bio descriptions on student profiles to identify and extract technical skills as structured tags.
            </p>
          </div>

          {/* Card 2 */}
          <div style={styles.card} className="premium-card">
            <div style={{ ...styles.cardIconCircle, background: 'rgba(16, 185, 129, 0.08)', color: '#10b981' }}>⚡</div>
            <h3 style={styles.cardTitle}>Vector Match Recommendations</h3>
            <p style={styles.cardText}>
              Calculates cosine similarity metrics using pre-trained sentence transformer embeddings. Instantly generates ranked job listings corresponding to candidate capabilities.
            </p>
          </div>

          {/* Card 3 */}
          <div style={styles.card} className="premium-card">
            <div style={{ ...styles.cardIconCircle, background: 'rgba(78, 84, 200, 0.08)', color: '#4e54c8' }}>🎯</div>
            <h3 style={styles.cardTitle}>Zero-Shot Classification</h3>
            <p style={styles.cardText}>
              Categorizes job postings automatically upon creation. Deep learning classifiers evaluate raw job descriptions to dynamically organize and tag career domains for search indexing.
            </p>
          </div>
        </div>
      </section>

      {/* Corporate Platform Trust */}
      <section style={styles.trustSection}>
        <div style={styles.trustBox} className="premium-card">
          <div style={styles.trustTextCol}>
            <h2 style={styles.trustTitle}>The Unified Nexus Framework</h2>
            <p style={styles.trustText}>
              Nexus coordinates core university authentication pipelines, administrative approval workflows for verified external recruiters, 
              and robust status-tracking interfaces for student job applications—all packed in a secure, performant corporate architecture.
            </p>
            <div style={styles.trustActions}>
              <Link to="/register" style={{ ...styles.primaryBtn, padding: '0.75rem 1.8rem', fontSize: '0.9rem' }}>
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '5rem 2rem 7rem 2rem',
    position: 'relative',
    backgroundColor: '#f8fafc',
  },
  heroSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: '6.5rem',
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.4rem 1rem',
    borderRadius: '30px',
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#e94560',
    backgroundColor: 'rgba(233, 69, 96, 0.08)',
    marginBottom: '1.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  badgeIcon: {
    color: '#e94560',
  },
  heroTitle: {
    fontSize: '3.4rem',
    fontWeight: 800,
    lineHeight: 1.15,
    letterSpacing: '-0.03em',
    color: '#0f172a',
    marginBottom: '1.5rem',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  highlightText: {
    color: '#e94560',
  },
  heroSubtitle: {
    fontSize: '1.15rem',
    color: '#475569',
    maxWidth: '780px',
    lineHeight: 1.6,
    marginBottom: '2.5rem',
  },
  heroButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  primaryBtn: {
    padding: '0.85rem 2rem',
    background: '#e94560',
    color: '#ffffff',
    borderRadius: '6px',
    fontSize: '0.95rem',
    fontWeight: 600,
    boxShadow: '0 4px 10px rgba(233, 69, 96, 0.15)',
    display: 'inline-block',
    transition: 'all 0.2s ease',
  },
  secondaryBtn: {
    padding: '0.85rem 2rem',
    background: '#ffffff',
    border: '1px solid #cbd5e1',
    color: '#334155',
    borderRadius: '6px',
    fontSize: '0.95rem',
    fontWeight: 600,
    display: 'inline-block',
    transition: 'all 0.2s ease',
  },
  featuresSection: {
    marginBottom: '6.5rem',
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '3.5rem',
  },
  sectionTitle: {
    fontSize: '2.2rem',
    fontWeight: 800,
    color: '#0f172a',
    marginBottom: '0.5rem',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    letterSpacing: '-0.02em',
  },
  sectionSubtitle: {
    color: '#475569',
    fontSize: '1rem',
    maxWidth: '580px',
    margin: '0 auto',
    lineHeight: 1.5,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '2rem',
  },
  card: {
    padding: '2.5rem 2rem',
    borderRadius: '10px',
    textAlign: 'left',
  },
  cardIconCircle: {
    width: '44px',
    height: '44px',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1.3rem',
    marginBottom: '1.2rem',
  },
  cardTitle: {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: '0.6rem',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  cardText: {
    color: '#475569',
    fontSize: '0.88rem',
    lineHeight: 1.6,
  },
  trustSection: {
    display: 'flex',
    justifyContent: 'center',
  },
  trustBox: {
    padding: '3.5rem 3rem',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '960px',
    backgroundColor: '#ffffff',
  },
  trustTextCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '1.5rem',
  },
  trustTitle: {
    fontSize: '2rem',
    fontWeight: 800,
    color: '#0f172a',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    letterSpacing: '-0.02em',
  },
  trustText: {
    color: '#475569',
    fontSize: '0.95rem',
    lineHeight: 1.6,
    maxWidth: '740px',
  },
  trustActions: {
    marginTop: '0.5rem',
  }
}

export default HomePage
