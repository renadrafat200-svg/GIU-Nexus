const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.meta}>
          <div style={styles.brand}>
            <span style={styles.brandIcon}>✦</span>
            GIU <span style={styles.brandHighlight}>Nexus</span>
          </div>
          <p style={styles.text}>© 2026 GIU Nexus. Software Engineering Spring 2026.</p>
        </div>
        <div style={styles.metaRight}>
          <p style={styles.sub}>German International University</p>
        </div>
      </div>
    </footer>
  )
}

const styles = {
  footer: {
    backgroundColor: '#ffffff',
    color: '#64748b',
    padding: '2rem 0',
    marginTop: 'auto',
    borderTop: '1px solid #e2e8f0',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  meta: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0.4rem',
  },
  brand: {
    fontSize: '1.05rem',
    fontWeight: 800,
    color: '#0f172a',
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  brandIcon: {
    color: '#e94560',
  },
  brandHighlight: {
    color: '#e94560',
  },
  text: {
    fontSize: '0.82rem',
    color: '#64748b',
  },
  metaRight: {
    textAlign: 'right',
  },
  sub: {
    fontSize: '0.82rem',
    fontWeight: 500,
    color: '#334155',
  },
}

export default Footer