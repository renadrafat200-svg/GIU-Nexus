const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.brandSection}>
          <div style={styles.brand}>
            <span style={styles.brandLogo}>✦</span>
            GIU<span style={styles.brandHighlight}>Nexus</span>
          </div>
          <p style={styles.tagline}>AI-Powered Career & Talent Platform</p>
        </div>
        <div style={styles.divider}></div>
        <div style={styles.metaSection}>
          <p style={styles.text}>© 2026 GIU Nexus. All rights reserved.</p>
          <p style={styles.sub}>German International University · Software Engineering Spring 2026</p>
        </div>
      </div>
    </footer>
  )
}

const styles = {
  footer: {
    backgroundColor: '#0f0e17',
    color: '#a7a9be',
    padding: '2.5rem 0',
    marginTop: 'auto',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.2rem',
  },
  brandSection: {
    textAlign: 'center',
  },
  brand: {
    fontSize: '1.2rem',
    fontWeight: 800,
    color: '#fffffe',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.3rem',
    fontFamily: "'Outfit', sans-serif",
    letterSpacing: '-0.01em',
  },
  brandLogo: {
    color: '#e94560',
    fontSize: '1.4rem',
  },
  brandHighlight: {
    color: '#e94560',
  },
  tagline: {
    fontSize: '0.85rem',
    color: '#a7a9be',
    marginTop: '0.3rem',
    fontWeight: 500,
    letterSpacing: '0.02em',
  },
  divider: {
    width: '100%',
    maxWidth: '300px',
    height: '1px',
    background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 100%)',
  },
  metaSection: {
    textAlign: 'center',
  },
  text: {
    fontSize: '0.85rem',
    color: '#a7a9be',
    marginBottom: '0.2rem',
  },
  sub: {
    fontSize: '0.75rem',
    color: '#5f6170',
  },
}

export default Footer