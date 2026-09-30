import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import './AIFreshness.css';

export default function AIFreshness() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  const fileInputRef = useRef(null);

  const inventory = [
    { id: 1, name: "Fresh Tomatoes", batch: "TOM-BCH-01" },
    { id: 2, name: "Organic Whole Milk", batch: "MLK-BCH-18" },
    { id: 3, name: "Baby Spinach", batch: "SPN-BCH-09" }
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setError(null);
    }
  };

  const analyzeImage = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('product_id', 1);
    formData.append('batch_id', 1);

    try {
      const response = await fetch('http://localhost:8000/api/v1/freshness/analyze', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('Failed to connect to backend (http://localhost:8000). Make sure your FastAPI server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="freshness-page">
      <div className="page-header">
        <div>
          <h1>AI Freshness Analysis</h1>
          <p>Run computer vision diagnostics on physical inventory samples to determine grade and shelf life.</p>
        </div>
      </div>

      <div className="freshness-grid">
        {/* Upload Panel */}
        <div className="upload-panel">
          <h2>Run New Assessment</h2>
          
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
            <div className="upload-dropzone" onClick={() => fileInputRef.current?.click()}>
              <Camera size={48} className="text-muted mb-2" />
              <h3>Capture or Upload Sample</h3>
              <p className="text-muted font-small">Supports JPEG, PNG (Max 5MB)</p>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" hidden />
            </div>
          ) : (
            <div className="preview-container">
              <img src={preview} alt="Sample Preview" className="preview-img" />
              <button className="btn-remove" onClick={() => { setFile(null); setPreview(null); setResult(null); }} disabled={loading}>✕ Remove</button>
            </div>
          )}

          {error && (
            <div className="alert-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button className="btn-primary w-100" onClick={analyzeImage} disabled={!file || loading}>
            {loading ? <><RefreshCw size={16} className="spin"/> Analyzing via ML Engine...</> : 'Run AI Assessment'}
          </button>
        </div>

        {/* Results Panel */}
        <div className="results-panel">
          <h2>Diagnostic Report</h2>
          
          {!result ? (
            <div className="empty-state">
              <Upload size={48} className="text-muted mb-2" />
              <p className="text-muted">Awaiting image payload for analysis.</p>
            </div>
          ) : (
            <div className="report-card animation-fade">
              <div className="report-header">
                <h3>Analysis Results</h3>
                <span className={`status-badge ${result.classification === 'Fresh' ? 'success' : 'danger'}`}>
                  {result.classification}
                </span>
              </div>
              
              <div className="score-display">
                <div className="score-circle">
                  <h2>{result.freshness_score}</h2>
                </div>
                <span>Freshness Score</span>
              </div>

              <div className="metric-list">
                <div className="metric-row">
                  <span>AI Confidence</span>
                  <strong>{result.confidence}%</strong>
                </div>
                <div className="metric-row">
                  <span>Spoilage Markers</span>
                  <strong className={result.spoilage_status.includes('detected') && !result.spoilage_status.includes('No') ? 'text-danger' : 'text-success'}>
                    {result.spoilage_status}
                  </strong>
                </div>
              </div>

              <div className="shelf-life-box">
                <span className="text-primary font-bold">Estimated Shelf Life</span>
                <h3 className="text-primary">{result.estimated_shelf_life_days} Days</h3>
              </div>

              <div className="rec-box">
                <h4><CheckCircle2 size={16}/> Copilot Recommendation</h4>
                <p>{result.recommendation}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
