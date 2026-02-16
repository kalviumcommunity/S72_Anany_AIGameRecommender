function SearchSection({ query, setQuery, limit, setLimit, onSearch, isLoading, inputRef, onKeyPress }) {
  return (
    <section className="search-section">
      <div className="search-box">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={onKeyPress}
          className="search-input"
          placeholder="e.g., 'I want a dark fantasy RPG with challenging combat'"
          autoFocus
          disabled={isLoading}
        />
        <div className="controls">
          <label htmlFor="limitSelect">Results:</label>
          <select
            id="limitSelect"
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value))}
            className="limit-select"
            disabled={isLoading}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="5">5</option>
            <option value="10">10</option>
          </select>
          <button
            onClick={onSearch}
            className="search-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>
    </section>
  )
}

export default SearchSection
