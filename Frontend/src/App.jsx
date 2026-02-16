import { useState, useRef } from 'react'
import Header from './components/Header'
import SearchSection from './components/SearchSection'
import LoadingSpinner from './components/LoadingSpinner'
import ResultsSection from './components/ResultsSection'
import ErrorSection from './components/ErrorSection'
import InfoSection from './components/InfoSection'
import Footer from './components/Footer'

function App() {
  const [query, setQuery] = useState('')
  const [limit, setLimit] = useState(3)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  const handleSearch = async (e) => {
    e?.preventDefault()
    
    const trimmedQuery = query.trim()
    if (!trimmedQuery) {
      setError('Please enter a search query')
      return
    }

    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const encodedQuery = encodeURIComponent(trimmedQuery)
      const url = `/api/recommend?query=${encodedQuery}&limit=${limit}`

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to get recommendations')
      }

      setResults(data)
    } catch (err) {
      console.error('Search error:', err)
      setError(err.message || 'Failed to fetch recommendations. Make sure the backend is running on http://localhost:5000')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e)
    }
  }

  return (
    <div className="container">
      <Header />
      
      <main className="content">
        <SearchSection
          query={query}
          setQuery={setQuery}
          limit={limit}
          setLimit={setLimit}
          onSearch={handleSearch}
          isLoading={loading}
          inputRef={inputRef}
          onKeyPress={handleKeyPress}
        />

        {loading && <LoadingSpinner />}

        {error && <ErrorSection error={error} />}

        {results && <ResultsSection results={results} limit={limit} />}

        {!loading && !results && !error && <InfoSection />}
      </main>

      <Footer />
    </div>
  )
}

export default App
