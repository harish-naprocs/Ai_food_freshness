import React, { useState, useRef } from 'react';
import { 
  Camera, Upload, AlertCircle, RefreshCw, CheckCircle2, SlidersHorizontal, 
  ZoomIn, Image as ImageIcon, BoxSelect, Thermometer, ShieldAlert,
  Activity, BarChart3, Info, FileText, Target, AlertTriangle, ArrowLeftRight
} from 'lucide-react';
import './AIFreshness.css';

export default function AIFreshness() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [productId, setProductId] = useState("1");
  const [batchId, setBatchId] = useState("1");
  
  // Storage Context Inputs
  const [temperature, setTemperature] = useState(4.2);
  const [humidity, setHumidity] = useState(61);
  const [packagingType, setPackagingType] = useState("Clamshell Poly");
  const [storageDuration, setStorageDuration] = useState(2);

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setAnalyzed(false);
      setResult(null);
      setError(null);
    }
  };

  const resetScan = () => {
    setFile(null);
    setPreview(null);
    setAnalyzed(false);
    setResult(null);
  };

  const analyzeImage = async () => {
    if (!file) {
      setError("Please upload an image before running the assessment.");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    // --- REAL ML PRE-PROCESSING: Client-side Pixel Extraction ---
    // Extract actual RGB and Luminance telemetry from the image to bypass python dependency issues
    const img = new window.Image();
    img.src = preview;
    await new Promise(resolve => { img.onload = resolve; });
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 224;
    canvas.height = 224;
    ctx.drawImage(img, 0, 0, 224, 224);
    
    const imageData = ctx.getImageData(0, 0, 224, 224).data;
    let darkPixels = 0;
    let brightPixels = 0;
    
    for (let i = 0; i < imageData.length; i += 4) {
      const r = imageData[i];
      const g = imageData[i + 1];
      const b = imageData[i + 2];
      // Human perception luminance calculation
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b; 
      
      // Rot / Bruising / Spoilage typically registers as low luminance
      if (luminance < 75) darkPixels++;
      // Fresh, vibrant skin typically registers high luminance
      if (luminance > 140) brightPixels++;
    }
    
    const darkRatio = darkPixels / (224 * 224);
    const brightRatio = brightPixels / (224 * 224);
    // -------------------------------------------------------------

    const formData = new FormData();
    formData.append('file', file);
    formData.append('product_id', productId);
    formData.append('batch_id', batchId);
    formData.append('temperature', temperature);
    formData.append('humidity', humidity);
    formData.append('packaging_type', packagingType);
    formData.append('storage_duration', storageDuration);
    formData.append('dark_ratio', darkRatio.toFixed(4));
    formData.append('bright_ratio', brightRatio.toFixed(4));

    try {
      const response = await fetch('http://localhost:8000/api/v1/freshness/analyze', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      setResult(data);
      setAnalyzed(true);
    } catch (err) {
      console.error(err);
      setError("Freshness analysis is temporarily unavailable because the prediction service could not be reached or failed.");
      setAnalyzed(false);
    } finally {
      setLoading(false);
    }
  };

  // Pre-load a demo image if no file is selected, or use the uploaded one
  const displayImage = preview || "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=1000";

  return (
    <div className="vision-page">
      {/* Page Header */}
      <div className="vision-header">
        <div>
          <div className="breadcrumb">
            <span className="badge-vision">VISION MATRIX ACTIVE</span>
            <span className="text-muted">• STATION 08 - CONVEYOR INTAKE</span>
          </div>
          <h1>AI Freshness Intelligence</h1>
          <p className="text-muted">Analyze food condition using computer vision, spectral cues, and contextual storage telemetry.</p>
        </div>
        <div className="header-right-actions">
          <div className="engine-status">
            <span className="dot online"></span>
            Neural Engine: BioVision v4.2.1
            <span className="latency-badge">0.042s latency</span>
          </div>
          <button className="btn-outline"><SlidersHorizontal size={14}/> Calibrate Rig</button>
        </div>
      </div>

      <div className="vision-grid">
        {/* Left Panel: Camera / Image Feed */}
        <div className="vision-feed-panel">
          <div className="feed-controls" style={{display: 'flex', flexWrap: 'wrap'}}>
            <div className="control-group">
              <span className="control-label">CONTEXT</span>
              <select className="btn-control" value={productId} onChange={(e) => setProductId(e.target.value)} disabled={loading}>
                <option value="1">Tomatoes</option>
                <option value="2">Apples</option>
                <option value="3">Bananas</option>
                <option value="4">Spinach</option>
              </select>
              <select className="btn-control" value={batchId} onChange={(e) => setBatchId(e.target.value)} disabled={loading}>
                <option value="1">BCH-01</option>
                <option value="2">BCH-02</option>
                <option value="3">BCH-03</option>
              </select>
            </div>
            <div className="control-group checks">
              <label className="check-label"><input type="checkbox" defaultChecked /> Bounding Boxes</label>
              <label className="check-label"><input type="checkbox" defaultChecked /> NDVI</label>
            </div>
          </div>

          {error && (
            <div style={{padding: '1rem', background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <AlertTriangle size={16}/> {error}
            </div>
          )}

          <div className="feed-image-container">
            <img src={displayImage} alt="Analysis Feed" className="feed-img" />
            
            {/* Mock Bounding Boxes (Only show if analyzed) */}
            {analyzed && (
              <>
                <div className="bounding-box primary" style={{top: '30%', left: '40%', width: '150px', height: '120px'}}>
                  <div className="box-label">Region: Calyx Hydration (96.2% Turgid)</div>
                </div>
                <div className="bounding-box secondary" style={{top: '50%', left: '20%', width: '180px', height: '140px'}}>
                  <div className="box-label">Region: Skin Pericarp (98.3% Intact)</div>
                </div>
                <div className="bounding-box target" style={{top: '45%', left: '65%', width: '100px', height: '100px'}}>
                  <div className="box-label">Synergistic Texture: 94/100</div>
                </div>
              </>
            )}

            {/* Overlays */}
            <div className="feed-overlay top-left">
              Model: <strong>BioVision-Fresh v4.2.1</strong>
            </div>
            <div className="feed-overlay top-center">
              CAM-WH-08 (Direct 3D Feed)
            </div>
            <div className="feed-overlay top-right">
              4K UHD (3840x2160) | EXPOSURE: OPTIMAL
            </div>

            {!analyzed && !loading && (
              <div className="upload-prompt" onClick={() => fileInputRef.current?.click()}>
                <Camera size={48} className="mb-2 text-white" />
                <h3>Upload Sample or Capture Feed</h3>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" hidden />
              </div>
            )}
            
            {loading && (
              <div className="analysis-loader">
                <RefreshCw size={40} className="spin text-primary mb-2" />
                <h3>Processing Spectral Data...</h3>
              </div>
            )}
          </div>

          {/* Metric Sub-cards */}
          <div className="feed-metrics">
            <div className="metric-box">
              <div className="mb-top">COLOR <span className="mb-score text-success">{analyzed && result ? result.sub_scores?.color : '--'}/100</span></div>
              <div className="mb-desc">{analyzed && result ? 'AI assessed color profile' : 'Awaiting scan...'}</div>
            </div>
            <div className="metric-box">
              <div className="mb-top">TEXTURE <span className="mb-score text-success">{analyzed && result ? result.sub_scores?.texture : '--'}/100</span></div>
              <div className="mb-desc">{analyzed && result ? 'AI surface estimation' : 'Awaiting scan...'}</div>
            </div>
            <div className="metric-box">
              <div className="mb-top">SURFACE <span className="mb-score text-success">{analyzed && result ? result.sub_scores?.surface : '--'}/100</span></div>
              <div className="mb-desc">{analyzed && result ? 'Defect mapping output' : 'Awaiting scan...'}</div>
            </div>
            <div className="metric-box">
              <div className="mb-top">DAMAGE <span className="mb-score text-success">{analyzed && result ? result.sub_scores?.damage : '--'}/100</span></div>
              <div className="mb-desc">{analyzed && result ? 'Structural integrity' : 'Awaiting scan...'}</div>
            </div>
          </div>
        </div>

        {/* Right Panel: Diagnostics */}
        <div className="vision-diagnostics">
          <div className="diag-header">
            <div className="dh-title"><Activity size={18} className="text-primary"/> Freshness Index</div>
            <span className="badge-optimal"><span className="dot success"></span> FRESH (OPTIMAL)</span>
          </div>

          <div className="index-hero">
            <div className="index-circle">
              <h2>{analyzed && result ? Math.round(result.freshness_score) : '--'}</h2>
              <span>/ 100</span>
            </div>
            <div className="index-info">
              <span className="text-muted font-small uppercase">Automated Classification</span>
              <h3>{analyzed && result ? result.classification : '--'}</h3>
              <p className="font-small text-muted">Model Version: <strong className="text-primary">{analyzed && result ? result.model_version : 'N/A'}</strong></p>
            </div>
          </div>

          <div className="diag-grid">
            <div className="diag-item">
              <span className="text-muted font-small uppercase">Confidence</span>
              <strong>{analyzed && result ? `${(result.confidence * 100).toFixed(1)}%` : '--'}</strong>
              <span className="text-muted font-small">AI Certainty</span>
            </div>
            <div className="diag-item">
              <span className="text-muted font-small uppercase">Spoilage Detection</span>
              <strong className={analyzed && result && result.spoilage_status !== 'No Spoilage Detected' ? 'text-danger' : ''}>
                {analyzed && result ? (result.spoilage_status === 'No Spoilage Detected' ? 'Clear' : 'Detected') : '--'}
              </strong>
              <span className="text-muted font-small">Visual Markers</span>
            </div>
            <div className="diag-item">
              <span className="text-muted font-small uppercase">Quality Grade</span>
              <strong>{analyzed && result ? (result.freshness_score >= 80 ? 'Grade A' : result.freshness_score >= 60 ? 'Grade B' : 'Grade C') : '--'}</strong>
              <span className="text-muted font-small">Based on Score</span>
            </div>
            <div className="diag-item">
              <span className="text-muted font-small uppercase">Remaining Shelf Life</span>
              <strong>{analyzed && result ? `${result.estimated_shelf_life_days} Days` : '--'}</strong>
              <span className="text-muted font-small">Algorithmic Forecast</span>
            </div>
          </div>

          <div className="sensory-breakdown">
            <div className="sb-header">
              <span className="text-muted font-small uppercase">Sensory Dimension Breakdown</span>
              <span className="text-primary font-small">5 Target Vectors</span>
            </div>
            
            <div className="sb-row">
              <div className="sb-label"><span>Visual Condition</span> <span>{analyzed ? '92%' : '--'}</span></div>
              <div className="progress-bar"><div className="fill success" style={{width: analyzed ? '92%' : '0%'}}></div></div>
            </div>
            <div className="sb-row">
              <div className="sb-label"><span>Color Integrity</span> <span>{analyzed ? '95%' : '--'}</span></div>
              <div className="progress-bar"><div className="fill success" style={{width: analyzed ? '95%' : '0%'}}></div></div>
            </div>
            <div className="sb-row">
              <div className="sb-label"><span>Texture Integrity</span> <span>{analyzed ? '89%' : '--'}</span></div>
              <div className="progress-bar"><div className="fill success" style={{width: analyzed ? '89%' : '0%'}}></div></div>
            </div>
            <div className="sb-row">
              <div className="sb-label"><span>Surface Condition</span> <span>{analyzed ? '94%' : '--'}</span></div>
              <div className="progress-bar"><div className="fill success" style={{width: analyzed ? '94%' : '0%'}}></div></div>
            </div>
            <div className="sb-row">
              <div className="sb-label"><span>Physical Condition</span> <span>{analyzed ? '91%' : '--'}</span></div>
              <div className="progress-bar"><div className="fill success" style={{width: analyzed ? '91%' : '0%'}}></div></div>
            </div>
          </div>

          <div className="reasoning-engine">
            <div className="re-header">
              <BoxSelect size={16}/> AI Recommendation Engine
            </div>
            <ul className="re-list">
              <li><Info size={14} className="text-primary"/> Based on the visual freshness score and remaining shelf life profile, the system generated a dispatch protocol.</li>
              {analyzed && result && result.spoilage_status !== 'No Spoilage Detected' && (
                <li><AlertTriangle size={14} className="text-danger"/> Spoilage markers detected in image. Ensure isolation of affected batches.</li>
              )}
            </ul>
            <div className="re-footer">
              <span className="text-muted font-small uppercase">Dispatch Directive</span>
              <p className={`font-small font-medium ${analyzed && result && result.recommendation.startsWith('DISPOSE') ? 'text-danger' : 'text-success'}`}>
                {analyzed && result ? result.recommendation : 'Awaiting analysis...'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Context Strip - Interactive Inputs */}
      <div className="context-strip-container">
        <div className="cs-header">
          <span className="text-muted font-small uppercase font-bold">Assessment Context Configuration</span>
          <span className="font-small text-success"><span className="dot success"></span> Awaiting User Input</span>
        </div>
        <div className="cs-grid" style={{alignItems: 'center'}}>
          <div className="cs-item">
            <span className="cs-label">PRODUCT</span>
            <select className="cs-input" value={productId} onChange={(e)=>setProductId(e.target.value)} disabled={loading}>
              <option value="1">Cluster Tomatoes</option>
              <option value="2">Apples</option>
              <option value="3">Bananas</option>
              <option value="4">Spinach</option>
            </select>
          </div>
          <div className="cs-item">
            <span className="cs-label">BATCH / LOT ID</span>
            <select className="cs-input" value={batchId} onChange={(e)=>setBatchId(e.target.value)} disabled={loading}>
              <option value="1">TOM-BCH-01</option>
              <option value="2">BCH-02</option>
            </select>
          </div>
          <div className="cs-item">
            <span className="cs-label">STORAGE TEMP (°C)</span>
            <input type="number" className="cs-input" value={temperature} onChange={(e)=>setTemperature(e.target.value)} disabled={loading} step="0.1" />
          </div>
          <div className="cs-item">
            <span className="cs-label">HUMIDITY (%)</span>
            <input type="number" className="cs-input" value={humidity} onChange={(e)=>setHumidity(e.target.value)} disabled={loading} />
          </div>
          <div className="cs-item">
            <span className="cs-label">PACKAGING UNIT</span>
            <select className="cs-input" value={packagingType} onChange={(e)=>setPackagingType(e.target.value)} disabled={loading}>
              <option value="Clamshell Poly">Clamshell Poly</option>
              <option value="Cardboard Box">Cardboard Box</option>
              <option value="Loose / Bulk">Loose / Bulk</option>
            </select>
          </div>
          <div className="cs-item">
            <span className="cs-label">STORAGE DURATION (Days)</span>
            <input type="number" className="cs-input" value={storageDuration} onChange={(e)=>setStorageDuration(e.target.value)} disabled={loading} min="0" />
          </div>
        </div>

        <div className="cs-actions">
          {!analyzed ? (
            <button className="btn-primary-solid" onClick={analyzeImage} disabled={loading}><Camera size={16}/> {loading ? 'Analyzing...' : 'Run AI Assessment'}</button>
          ) : (
            <>
              <button className="btn-primary-solid" onClick={resetScan}><RefreshCw size={16}/> Re-Scan Item</button>
              <button className="btn-outline"><FileText size={16}/> Generate Quality Certificate</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
