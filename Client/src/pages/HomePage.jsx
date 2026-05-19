import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const HomePage = () => {
  const { isAuthenticated, user } = useAuth()

  return (
    <div style={styles.container}>
      {/* Glow blobs background */}
      <div style={styles.glow1}></div>
      <div style={styles.glow2}></div>

      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.badge} className="glass-card">
          <span style={styles.badgeDot}>✦</span>
          <span>Next-Generation Career Platform</span>
        </div>
        
        <h1 style={styles.heroTitle}>
          Connecting GIU Talent with <br />
          <span style={styles.gradientText}>AI-Powered</span> Opportunities
        </h1>
        
        <p style={styles.heroSubtitle}>
          The unified career portal for German International University. Explore internships, 
          manage recruitment pipelines, and experience smart skill matching powered by state-of-the-art AI.
        </p>

        <div style={styles.heroButtons}>
          <Link to="/jobs" style={styles.primaryBtn} className="glow-btn">
            Explore Jobs
          </Link>
          
          {!isAuthenticated ? (
            <Link to="/register" style={styles.secondaryBtn}>
              Join GIU Nexus
            </Link>
          ) : (
            <Link to={user?.role === 'recruiter' ? '/recruiter/dashboard' : '/profile'} style={styles.secondaryBtn}>
              Go to Dashboard
            </Link>
          )}
        </div>
      </section>

      {/* Platform Features Grid */}
      <section style={styles.featuresSection}>
        <h2 style={styles.sectionTitle}>Engineered for Intelligence</h2>
        <p style={styles.sectionSubtitle}>Leveraging modern AI model pipelines to simplify student search and recruiter workflows.</p>

        <div style={styles.grid}>
          {/* Card 1 */}
          <div style={styles.card} className="glass-card">
            <div style={{ ...styles.cardIconCircle, background: 'rgba(233, 69, 96, 0.1)', color: '#e94560' }}>🤖</div>
            <h3 style={styles.cardTitle}>Skill Extraction AI</h3>
            <p style={styles.cardText}>
              Built with NER sequence classification models. Automatically analyzes candidate bio profiles to extract technical capabilities as interactive tag chips.
            </p>
          </div>

          {/* Card 2 */}
          <div style={styles.card} className="glass-card">
            <div style={{ ...styles.cardIconCircle, background: 'rgba(78, 84, 200, 0.1)', color: '#8f94fb' }}>⚡</div>
            <h3 style={styles.cardTitle}>Embedding Job Match</h3>
            <p style={styles.cardText}>
              Uses vector embedding similarity mappings. Candidates get a ranked list of recommended roles by comparing user profile skills directly with job descriptions.
            </p>
          </div>

          {/* Card 3 */}
          <div style={styles.card} className="glass-card">
            <div style={{ ...styles.cardIconCircle, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>🎯</div>
            <h3 style={styles.cardTitle}>Smart Classification</h3>
            <p style={styles.cardText}>
              Zero-Shot NLP categorizations. Automatically determines and assigns professional tags to new job listings in real-time based on the recruiter's posting details.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Portal Guide */}
      <section style={styles.portalGuideSection}>
        <div style={styles.guideContainer} className="glass-card">
          <div style={styles.guideTextCol}>
            <h2 style={styles.guideTitle}>Elevate Your Future</h2>
            <p style={styles.guideText}>
              Whether you are a student ready to launch your career, a recruiter sourcing the finest GIU graduates, 
              or an administrator coordinating the platform—Nexus provides a central hub designed for speed, beauty, and security.
            </p>
            <div style={styles.guideSteps}>
              <div style={styles.step}>
                <span style={styles.stepNum}>1</span>
                <div>
                  <h4 style={styles.stepTitle}>Register Profile</h4>
                  <p style={styles.stepDesc}>Create an account as a Job Seeker or Recruiter.</p>
                </div>
              </div>
              <div style={styles.step}>
                <span style={styles.stepNum}>2</span>
                <div>
                  <h4 style={styles.stepTitle}>AI Skills Sync</h4>
                  <p style={styles.stepDesc}>Let Hugging Face models parse and extract your profile skills automatically.</p>
                </div>
              </div>
              <div style={styles.step}>
                <span style={styles.stepNum}>3</span>
                <div>
                  <h4 style={styles.stepTitle}>Apply & Source</h4>
                  <p style={styles.stepDesc}>Submit applications with a single click or review real-time applicant pipelines.</p>
                </div>
              </div>
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
    padding: '4rem 2rem 6rem 2rem',
    position: 'relative',
  },
  glow1: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    top: '-10%',
    left: '-10%',
    background: 'radial-gradient(circle, rgba(233, 69, 96, 0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  glow2: {
    position: 'absolute',
    width: '500px',
    height: '500px',
    bottom: '20%',
    right: '-10%',
    background: 'radial-gradient(circle, rgba(78, 84, 200, 0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  heroSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: '6rem',
    zIndex: 1,
    position: 'relative',
    animation: 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1.2rem',
    borderRadius: '30px',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#e94560',
    marginBottom: '2rem',
    border: '1px solid rgba(233, 69, 96, 0.15)',
  },
  badgeDot: {
    color: '#e94560',
    fontSize: '1.1rem',
  },
  heroTitle: {
    fontSize: '3.6rem',
    fontWeight: 800,
    lineHeight: 1.15,
    letterSpacing: '-0.03em',
    color: '#fffffe',
    marginBottom: '1.5rem',
    fontFamily: "'Outfit', sans-serif",
  },
  gradientText: {
    background: 'linear-gradient(135deg, #e94560 20%, #8f94fb 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSubtitle: {
    fontSize: '1.2rem',
    color: '#a7a9be',
    maxWidth: '760px',
    lineHeight: 1.6,
    marginBottom: '2.5rem',
  },
  heroButtons: {
    display: 'flex',
    gap: '1.2rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  primaryBtn: {
    padding: '0.9rem 2.2rem',
    borderRadius: '30px',
    fontSize: '1rem',
    fontWeight: 600,
    boxShadow: '0 4px 20px rgba(233, 69, 96, 0.25)',
    display: 'inline-block',
  },
  secondaryBtn: {
    padding: '0.9rem 2.2rem',
    borderRadius: '30px',
    fontSize: '1rem',
    fontWeight: 600,
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#fffffe',
    display: 'inline-block',
    transition: 'all 0.3s ease',
  },
  featuresSection: {
    marginBottom: '6rem',
    textAlign: 'center',
    zIndex: 1,
    position: 'relative',
  },
  sectionTitle: {
    fontSize: '2.4rem',
    fontWeight: 800,
    color: '#fffffe',
    marginBottom: '0.6rem',
    fontFamily: "'Outfit', sans-serif",
    letterSpacing: '-0.02em',
  },
  sectionSubtitle: {
    color: '#a7a9be',
    fontSize: '1.05rem',
    maxWidth: '580px',
    margin: '0 auto 3.5rem auto',
    lineHeight: 1.5,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '2rem',
  },
  card: {
    padding: '2.5rem 2rem',
    borderRadius: '16px',
    textAlign: 'left',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  cardIconCircle: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1.4rem',
    marginBottom: '1.5rem',
  },
  cardTitle: {
    fontSize: '1.3rem',
    fontWeight: 700,
    color: '#fffffe',
    marginBottom: '0.8rem',
    fontFamily: "'Outfit', sans-serif",
  },
  cardText: {
    color: '#a7a9be',
    fontSize: '0.92rem',
    lineHeight: 1.6,
  },
  portalGuideSection: {
    zIndex: 1,
    position: 'relative',
  },
  guideContainer: {
    padding: '4rem',
    borderRadius: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '900px',
    margin: '0 auto',
  },
  guideTextCol: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  guideTitle: {
    fontSize: '2.2rem',
    fontWeight: 800,
    color: '#fffffe',
    marginBottom: '1rem',
    fontFamily: "'Outfit', sans-serif",
  },
  guideText: {
    color: '#a7a9be',
    fontSize: '1.05rem',
    lineHeight: 1.6,
    maxWidth: '680px',
    marginBottom: '3rem',
  },
  guideSteps: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    width: '100%',
    maxWidth: '540px',
    textAlign: 'left',
  },
  step: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'flex-start',
  },
  stepNum: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'rgba(233, 69, 96, 0.1)',
    border: '1px solid rgba(233, 69, 96, 0.2)',
    color: '#e94560',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 700,
    fontSize: '1rem',
    flexShrink: 0,
    fontFamily: "'Outfit', sans-serif",
  },
  stepTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#fffffe',
    marginBottom: '0.2rem',
    fontFamily: "'Outfit', sans-serif",
  },
  stepDesc: {
    color: '#a7a9be',
    fontSize: '0.9rem',
    lineHeight: 1.4,
  }
}

export default HomePage
