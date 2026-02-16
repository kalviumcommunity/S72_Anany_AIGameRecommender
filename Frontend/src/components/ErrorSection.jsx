function ErrorSection({ error }) {
  return (
    <section className="error-section">
      <div className="error-box">
        <h3>⚠️ Error</h3>
        <p>{error}</p>
      </div>
    </section>
  )
}

export default ErrorSection
