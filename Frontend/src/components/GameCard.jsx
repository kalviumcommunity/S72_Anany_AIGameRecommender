function GameCard({ game, rank }) {
  const escapeHtml = (text) => {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  return (
    <div className="game-card">
      <span className="game-rank">#{rank}</span>
      <div className="game-name">{game.name || 'Unknown Game'}</div>
      <span className="game-genre">{game.genre || 'Unknown Genre'}</span>
      <p className="game-description">{game.description || 'No description available'}</p>
    </div>
  )
}

export default GameCard
