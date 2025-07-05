import React, { useState } from 'react';

interface SearchResult {
  id: string;
  score: number;
  text: string;
  payload: {
    section_heading: string;
    journal: string;
    publish_year: number;
    usage_count: number;
    attributes: string[];
  };
}

const SimilaritySearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [k, setK] = useState(3);
  const [minScore, setMinScore] = useState(0.2);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/similarity_search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          k,
          min_score: minScore
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setResults(data);
      } else {
        setError(data.error || 'An error occurred while searching');
      }
    } catch (error) {
      setError('Failed to connect to the server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="search-container">
      <h2>Similarity Search</h2>
      
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-inputs">
          <div className="form-group">
            <label className="form-label">Query</label>
            <input
              type="text"
              className="form-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your search query..."
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Top K</label>
            <input
              type="number"
              className="form-input"
              value={k}
              onChange={(e) => setK(parseInt(e.target.value) || 3)}
              min="1"
              max="20"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Min Score</label>
            <input
              type="number"
              className="form-input"
              value={minScore}
              onChange={(e) => setMinScore(parseFloat(e.target.value) || 0.2)}
              min="0"
              max="1"
              step="0.1"
            />
          </div>
        </div>
        
        <button
          type="submit"
          className="submit-btn"
          disabled={!query.trim() || isLoading}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="loading">
          Searching for similar documents...
        </div>
      )}

      {results.length > 0 && (
        <div className="results-list">
          <h3>Search Results ({results.length})</h3>
          {results.map((result, index) => (
            <div key={result.id} className="result-item">
              <div className="result-score">
                Score: {(result.score * 100).toFixed(1)}%
              </div>
              <div className="result-text">
                {result.text || 'No text content available'}
              </div>
              <div className="result-meta">
                <strong>Section:</strong> {result.payload.section_heading} | 
                <strong> Journal:</strong> {result.payload.journal} | 
                <strong> Year:</strong> {result.payload.publish_year} | 
                <strong> Usage:</strong> {result.payload.usage_count}
              </div>
              {result.payload.attributes.length > 0 && (
                <div className="result-meta">
                  <strong>Tags:</strong> {result.payload.attributes.join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SimilaritySearch; 