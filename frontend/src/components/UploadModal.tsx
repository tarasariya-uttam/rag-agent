import React, { useState } from 'react';

interface UploadModalProps {
  onClose: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' || selectedFile.type === 'application/json') {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please select a PDF or JSON file');
        setFile(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setError('');
    setUploadStatus('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://127.0.0.1:8000/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setUploadStatus(`Successfully uploaded! ${data.inserted} chunks created.`);
        setFile(null);
        // Reset file input
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        setError(data.detail || 'Upload failed');
      }
    } catch (error) {
      setError('Failed to connect to the server');
    } finally {
      setIsUploading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Upload Document</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Select File</label>
            <input
              id="file-input"
              type="file"
              className="file-input"
              accept=".pdf,.json"
              onChange={handleFileChange}
              required
            />
            <label htmlFor="file-input" className="file-label">
              {file ? file.name : 'Click to select PDF or JSON file'}
            </label>
          </div>

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          {uploadStatus && (
            <div style={{ color: '#28a745', padding: '1rem', background: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '6px', marginBottom: '1rem' }}>
              {uploadStatus}
            </div>
          )}

          <button
            type="submit"
            className="submit-btn"
            disabled={!file || isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload Document'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadModal; 