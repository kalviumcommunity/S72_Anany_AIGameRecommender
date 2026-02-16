function InfoSection() {
  const queries = [
    "I like strategy games with historical themes",
    "Recommend me dark fantasy RPGs with deep story",
    "I want a cozy simulation game",
    "Fast-paced action games for competitive play",
    "Puzzle games that make you think"
  ]

  return (
    <section className="info-section">
      <div className="info-card">
        <h3>📝 Try these queries:</h3>
        <ul>
          {queries.map((query, index) => (
            <li key={index}>"{query}"</li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default InfoSection
