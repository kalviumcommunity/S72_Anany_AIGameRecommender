function SimilarityScores({ recommendations, similarity }) {
  return (
    <div className="embeddings-info">
      <details>
        <summary>🔍 Similarity Scores</summary>
        <div className="embeddings-details">
          {recommendations.map((game, index) => {
            const score = similarity[index]
            const cosine = score?.cosine !== null && score?.cosine !== undefined 
              ? score.cosine.toFixed(4) 
              : 'N/A'
            const dot = score?.dot !== null && score?.dot !== undefined 
              ? score.dot.toFixed(4) 
              : 'N/A'
            const euc = score?.euclidean !== null && score?.euclidean !== undefined 
              ? score.euclidean.toFixed(4) 
              : 'N/A'

            return (
              <div key={index} style={{ marginBottom: '20px' }}>
                <div style={{
                  fontWeight: '600',
                  color: 'var(--primary)',
                  marginBottom: '8px'
                }}>
                  {game.name || 'Unknown Game'}
                </div>
                <div className="similarity-row">
                  <span>Cosine Similarity:</span>
                  <strong>{cosine}</strong>
                </div>
                <div className="similarity-row">
                  <span>Dot Product:</span>
                  <strong>{dot}</strong>
                </div>
                <div className="similarity-row">
                  <span>Euclidean Distance:</span>
                  <strong>{euc}</strong>
                </div>
              </div>
            )
          })}
        </div>
      </details>
    </div>
  )
}

export default SimilarityScores
