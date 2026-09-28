import { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('storage'); // 'inventory', 'analysis', 'reports', 'storage'
  
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [storageData, setStorageData] = useState([]);
  
  const fileInputRef = useRef(null);

  // Mock Inventory Data for Milestone 2 Display
  const inventory = [
    { id: 1, name: "Fresh Tomatoes", batch: "TOM-BCH-01", stock: 120, received: "2026-09-20" },
    { id: 2, name: "Red Apples", batch: "APP-BCH-02", stock: 340, received: "2026-09-21" },
    { id: 3, name: "Organic Bananas", batch: "BAN-BCH-03", stock: 85, received: "2026-09-24" },
    { id: 4, name: "Spinach", batch: "SPI-BCH-04", stock: 50, received: "2026-09-25" }
  ];

  useEffect(() => {
    if (activeTab === 'reports' || activeTab === 'analysis') {
      fetchHistory();
    }
    if (activeTab === 'storage') {
      fetchStorage();
      const interval = setInterval(fetchStorage, 5000); // Simulate live IoT data update
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const fetchStorage = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/storage/status');
      if (res.ok) {
        const data = await res.json();
        setStorageData(data);
      }
    } catch (err) {
      console.error('Failed to fetch storage IoT data', err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/freshness/history');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error('Failed to fetch history', err);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
    }
  };

  const analyzeImage = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('product_id', 1);
    formData.append('batch_id', 1);

    try {
      const response = await fetch('http://localhost:8000/api/v1/freshness/analyze', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Analysis failed');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert('Error during analysis. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // --- Screens ---

  const renderInventoryScreen = () => (
    <div className="glass-panel section-panel animation-fade">
      <h2>Current Inventory & Batches</h2>
      <p style={{color: 'var(--text-muted)'}}>Select a product to view details or initiate a freshness scan.</p>
      
      <div className="inventory-grid">
        {inventory.map(item => (
          <div key={item.id} className="inventory-card">
            <h3>{item.name}</h3>
            <div style={{marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem'}}>
              <div><strong>Batch:</strong> {item.batch}</div>
              <div><strong>Stock:</strong> {item.stock} units</div>
              <div><strong>Received:</strong> {item.received}</div>
            </div>
            <button 
              className="btn-primary" 
              style={{width: '100%', marginTop: '1.5rem', padding: '0.5rem'}}
              onClick={() => setActiveTab('analysis')}
            >
              Analyze Freshness
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalysisScreen = () => (
    <div className="main-content">
      <div className="glass-panel section-panel">
        <h2>Run Freshness Assessment</h2>
        
        <div className="form-group">
          <label>Select Product</label>
          <select className="form-select">
            {inventory.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Select Batch</label>
          <select className="form-select">
            {inventory.map(item => <option key={item.id} value={item.id}>{item.batch}</option>)}
          </select>
        </div>

        {!preview ? (
          <div 
            className="upload-dropzone" 
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="upload-icon">📸</div>
            <h3>Upload Food Image</h3>
            <p style={{color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem'}}>Supports JPEG, PNG, WEBP</p>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
          </div>
        ) : (
          <div className="preview-container">
            {loading && (
              <div className="loading-overlay">
                <div className="spinner"></div>
                <h4>Analyzing via ML Engine...</h4>
              </div>
            )}
            <img src={preview} alt="Preview" className="preview-image" />
            <button className="remove-btn" onClick={() => { setFile(null); setPreview(null); setResult(null); }} disabled={loading}>✕</button>
          </div>
        )}

        <button className="btn-primary" onClick={analyzeImage} disabled={!file || loading}>
          {loading ? 'Processing...' : 'Run Assessment'}
        </button>
      </div>

      <div className="glass-panel section-panel">
        <h2>Assessment Report</h2>
        {result ? (
          <>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1rem'}}>
              <h3>Results</h3>
              <span className={`status-badge status-${result.classification.replace(' ', '')}`}>
                {result.classification}
              </span>
            </div>
            
            <div className="score-circle" style={{'--score': result.freshness_score}}>
              <div className="score-value">{result.freshness_score}</div>
            </div>
            <p style={{textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem'}}>Freshness Score</p>

            <div className="detail-row">
              <span className="detail-label">AI Confidence</span>
              <span className="detail-value">{result.confidence}%</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Spoilage Markers</span>
              <span className="detail-value" style={{color: result.spoilage_status.includes('detected') && !result.spoilage_status.includes('No') ? 'var(--danger)' : 'inherit'}}>
                {result.spoilage_status}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Analysis Timestamp</span>
              <span className="detail-value">{new Date(result.analyzed_at).toLocaleString()}</span>
            </div>
            
            {/* Milestone 3: Shelf Life & Recommendations */}
            <div className="detail-row" style={{background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginTop: '1rem'}}>
              <span className="detail-label" style={{fontWeight: 'bold', color: 'var(--primary)'}}>Estimated Shelf Life</span>
              <span className="detail-value" style={{fontSize: '1.25rem', color: 'var(--primary)'}}>
                {result.estimated_shelf_life_days} Days
              </span>
            </div>
            <div style={{marginTop: '1rem', padding: '1rem', background: '#ecfdf5', border: '1px solid #10b981', borderRadius: '8px'}}>
              <h4 style={{color: '#047857', marginBottom: '0.5rem'}}>AI Recommendation</h4>
              <p style={{fontSize: '0.9rem', color: '#065f46', fontWeight: '500'}}>{result.recommendation}</p>
            </div>
          </>
        ) : (
          <div style={{textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)'}}>
            <div style={{fontSize: '3rem', marginBottom: '1rem'}}>📊</div>
            <p>Upload an image and run assessment<br/>to generate a freshness report.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderReportsScreen = () => {
    if (selectedReport) {
      return (
        <div className="glass-panel section-panel" style={{maxWidth: '800px', margin: '0 auto'}}>
          <button onClick={() => setSelectedReport(null)} style={{color: 'var(--primary)', fontWeight: 'bold', textAlign: 'left', marginBottom: '1rem'}}>
            &larr; Back to Reports
          </button>
          
          <div style={{display: 'flex', gap: '2rem'}}>
            <img 
              src={`http://localhost:8000${selectedReport.image_url}`} 
              alt="Report" 
              style={{width: '300px', height: '300px', objectFit: 'cover', borderRadius: '12px'}}
              onError={(e) => {e.target.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjZWVlIi8+PC9zdmc+'}} 
            />
            <div style={{flex: 1}}>
              <h2 style={{marginBottom: '0.5rem'}}>Detailed Analysis Report</h2>
              <p style={{color: 'var(--text-muted)', marginBottom: '2rem'}}>Report ID: #{selectedReport.id}</p>
              
              <div className="detail-row">
                <span className="detail-label">Classification</span>
                <span className={`status-badge status-${selectedReport.classification.replace(' ', '')}`}>{selectedReport.classification}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Confidence</span>
                <span className="detail-value">{selectedReport.confidence}%</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Freshness Score</span>
                <span className="detail-value">{selectedReport.freshness_score} pts</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Timestamp</span>
                <span className="detail-value">{new Date(selectedReport.analyzed_at).toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Shelf Life</span>
                <span className="detail-value">{selectedReport.estimated_shelf_life_days} Days</span>
              </div>
              <div style={{marginTop: '1.5rem', padding: '1rem', background: '#ecfdf5', border: '1px solid #10b981', borderRadius: '8px'}}>
                <h4 style={{color: '#047857', marginBottom: '0.25rem'}}>Recommendation</h4>
                <p style={{fontSize: '0.875rem', color: '#065f46'}}>{selectedReport.recommendation}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="glass-panel section-panel">
        <h2>Freshness Analysis History</h2>
        <p style={{color: 'var(--text-muted)'}}>Review past reports and quality control inspections.</p>
        
        <div className="history-list">
          {history.length > 0 ? history.map(item => (
            <div key={item.id} className="history-item" onClick={() => setSelectedReport(item)}>
              <img 
                src={`http://localhost:8000${item.image_url}`} 
                alt="Thumb" 
                className="history-thumb"
                onError={(e) => {e.target.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjZWVlIi8+PC9zdmc+'}} 
              />
              <div style={{flex: 1}}>
                <h4 style={{marginBottom: '0.25rem'}}>Analysis #{item.id}</h4>
                <div style={{color: 'var(--text-muted)', fontSize: '0.875rem'}}>
                  {new Date(item.analyzed_at).toLocaleString()}
                </div>
              </div>
              <div style={{textAlign: 'right'}}>
                <div className={`status-badge status-${item.classification.replace(' ', '')}`} style={{marginBottom: '0.25rem', display: 'inline-block'}}>
                  {item.classification}
                </div>
                <div style={{fontWeight: 'bold'}}>{item.freshness_score} pts</div>
              </div>
            </div>
          )) : (
            <p style={{textAlign: 'center', padding: '3rem', color: 'var(--text-muted)'}}>No history found.</p>
          )}
        </div>
      </div>
    );
  };

  const renderStorageScreen = () => (
    <div className="glass-panel section-panel animation-fade">
      <h2>Storage Condition Monitoring (IoT)</h2>
      <p style={{color: 'var(--text-muted)'}}>Real-time telemetry from warehouse sensors.</p>
      
      <div className="inventory-grid">
        {storageData.length > 0 ? storageData.map(unit => (
          <div key={unit.unit_id} className="inventory-card" style={{borderLeft: `4px solid ${unit.status.includes('Warning') ? 'var(--danger)' : 'var(--primary)'}`}}>
            <h3 style={{marginBottom: '1rem'}}>{unit.unit_id}</h3>
            
            <div className="detail-row">
              <span className="detail-label">Temperature</span>
              <span className="detail-value" style={{fontSize: '1.2rem', color: unit.status.includes('Warning') ? 'var(--danger)' : 'inherit'}}>
                {unit.temperature_celsius}°C
              </span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Humidity</span>
              <span className="detail-value" style={{fontSize: '1.2rem'}}>{unit.humidity_percent}%</span>
            </div>

            <div style={{marginTop: '1.5rem', textAlign: 'center'}}>
              <span className={`status-badge ${unit.status.includes('Warning') ? 'status-Spoiled' : 'status-Fresh'}`}>
                {unit.status}
              </span>
            </div>
          </div>
        )) : (
          <p>Loading IoT sensor data...</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="app-container">
      <header>
        <h1>AI Food Freshness Platform</h1>
      </header>

      <nav className="nav-tabs">
        <button className={`nav-tab ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>
          Inventory
        </button>
        <button className={`nav-tab ${activeTab === 'storage' ? 'active' : ''}`} onClick={() => setActiveTab('storage')}>
          Storage Monitor (IoT)
        </button>
        <button className={`nav-tab ${activeTab === 'analysis' ? 'active' : ''}`} onClick={() => {setActiveTab('analysis'); setSelectedReport(null);}}>
          Freshness Analysis
        </button>
        <button className={`nav-tab ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => {setActiveTab('reports'); setSelectedReport(null);}}>
          Reports & History
        </button>
      </nav>

      {activeTab === 'inventory' && renderInventoryScreen()}
      {activeTab === 'storage' && renderStorageScreen()}
      {activeTab === 'analysis' && renderAnalysisScreen()}
      {activeTab === 'reports' && renderReportsScreen()}
    </div>
  );
}

export default App;
