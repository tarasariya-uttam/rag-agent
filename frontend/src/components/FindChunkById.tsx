import React, { useState } from 'react';

interface Chunk {
  id: string;
  text: string;
  payload: {
    section_heading: string;
    journal: string;
    publish_year: number;
    usage_count: number;
    attributes: string[];
    original_id?: string;
  };
}

interface JournalResponse {
  journal_id: string;
  chunks: Chunk[];
}

const FindChunkById: React.FC = () => {
  const [journalId, setJournalId] = useState('');
  const [results, setResults] = useState<JournalResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalId.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/${encodeURIComponent(journalId)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        setResults(data);
      } else {
        setError(data.error || 'An error occurred while fetching chunks');
      }
    } catch (error) {
      setError('Failed to connect to the server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="search-container">
      <h2>Find Chunks by Journal ID</h2>
      
      <form onSubmit={handleSubmit} className="search-form">
        <div className="form-group">
          <label className="form-label">Journal ID</label>
          <input
            type="text"
            className="form-input"
            value={journalId}
            onChange={(e) => setJournalId(e.target.value)}
            placeholder="Enter journal/document ID (e.g., extension_brief_mucuna.pdf)"
            required
          />
        </div>
        
        <button
          type="submit"
          className="submit-btn"
          disabled={!journalId.trim() || isLoading}
        >
          {isLoading ? 'Searching...' : 'Find Chunks'}
        </button>
      </form>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="loading">
          Fetching chunks for journal ID...
        </div>
      )}

      {results && (
        <div className="results-list">
          <h3>Journal: {results.journal_id}</h3>
          <p>Found {results.chunks.length} chunks</p>
          
          {results.chunks.length === 0 ? (
            <div className="loading">
              No chunks found for this journal ID.
            </div>
          ) : (
            results.chunks.map((chunk, index) => (
              <div key={chunk.id} className="result-item">
                <div className="result-score">
                  Chunk {index + 1} | ID: {chunk.id}
                  {chunk.payload.original_id && (
                    <span> | Original ID: {chunk.payload.original_id}</span>
                  )}
                </div>
                <div className="result-text">
                  {chunk.text || 'No text content available'}
                </div>
                <div className="result-meta">
                  <strong>Section:</strong> {chunk.payload.section_heading} | 
                  <strong> Journal:</strong> {chunk.payload.journal} | 
                  <strong> Year:</strong> {chunk.payload.publish_year} | 
                  <strong> Usage:</strong> {chunk.payload.usage_count}
                </div>
                {chunk.payload.attributes.length > 0 && (
                  <div className="result-meta">
                    <strong>Tags:</strong> {chunk.payload.attributes.join(', ')}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default FindChunkById; 