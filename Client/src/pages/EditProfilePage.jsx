const EditProfilePage = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '2rem' }}>
      <div className="glass-card" style={{ padding: '3rem 2.5rem', borderRadius: '20px', maxWidth: '500px', textAlign: 'center', width: '100%', animation: 'fadeInUp 0.6s ease forwards' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(233, 69, 96, 0.1)', border: '1px solid rgba(233, 69, 96, 0.2)', color: '#e94560', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.8rem', margin: '0 auto 1.5rem auto' }}>✦</div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fffffe', marginBottom: '0.8rem', fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em' }}>Edit Profile Details</h2>
        <p style={{ color: '#a7a9be', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>This portal screen is currently being constructed. Stay tuned for future updates!</p>
      </div>
    </div>
  )
}

export default EditProfilePage
