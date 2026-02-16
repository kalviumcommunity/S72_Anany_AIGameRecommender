import GameCard from './GameCard'
import SimilarityScores from './SimilarityScores'

function ResultsSection({ results, limit }) {
  const recommendations = Array.isArray(results.recommendations) ? results.recommendations : []
  const displayedResults = recommendations.slice(0, limit)

  return (
    <section className="results-section">
      <div className="results-container">
        <div className="reasoning-box">
          <h3>Why these recommendations?</h3>
          <p>{results.reasoning || 'Based on your query and available data.'}</p>
        </div>

        <div className="recommendations-grid">
          {displayedResults.map((game, index) => (
            <GameCard
              key={index}
              game={game}
              rank={index + 1}
            />
          ))}
        </div>

        {results.similarity && results.similarity.length > 0 && (
          <SimilarityScores
            recommendations={displayedResults}
            similarity={results.similarity}
          />
        )}
      </div>
    </section>
  )
}

export default ResultsSection
