import React, { useState } from 'react';
import './App.css';
import Chat from './components/Chat';
import SimilaritySearch from './components/SimilaritySearch';
import FindChunkById from './components/FindChunkById';
import UploadModal from './components/UploadModal';

function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const tabs = [
    { id: 'chat', label: 'Chat' },
    { id: 'similarity', label: 'Similarity Search' },
    { id: 'find-chunk', label: 'Find Chunk by ID' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return <Chat />;
      case 'similarity':
        return <SimilaritySearch />;
      case 'find-chunk':
        return <FindChunkById />;
      default:
        return <Chat />;
    }
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="logo">Document Q&A</h1>
          <button 
            className="upload-btn"
            onClick={() => setShowUploadModal(true)}
          >
            Upload Document
          </button>
        </div>
      </header>

      {/* Tabs */}
      <nav className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {renderTabContent()}
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal onClose={() => setShowUploadModal(false)} />
      )}
    </div>
  );
}

export default App;
