import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, TrendingUp, ThermometerSnowflake, Camera, CheckCircle2, Factory, Store, Truck, Users, ArrowRight, BarChart3, AlertTriangle, RefreshCw } from 'lucide-react';
import './LandingPage.css';

export default function LandingPage() {
  const [activeRole, setActiveRole] = useState('retail');

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-logo">
          <span className="logo-text">FRESH<span className="text-primary">IQ</span></span>
        </div>
        <div className="nav-links hidden-mobile">
          <a href="#product">Product</a>
          <a href="#solutions">Solutions</a>
          <a href="#ai">AI Intelligence</a>
          <a href="#impact">Impact</a>
        </div>
        <div className="nav-actions">
          <Link to="/login" className="btn-text">Sign In</Link>
          <Link to="/register" className="btn-primary">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="trust-badge">
            <ShieldCheck size={16} />
            <span>AI-powered • Real-time monitoring • Enterprise-ready</span>
          </div>
          <h1>Turn Food Freshness Into Actionable Intelligence.</h1>
          <p className="hero-subtitle">
            AI-powered freshness assessment, shelf-life prediction and storage intelligence for modern food operations.
          </p>
          <div className="hero-ctas">
            <Link to="/login" className="btn-primary large">Explore FreshIQ</Link>
            <a href="#workflow" className="btn-secondary large">See How It Works</a>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="mock-dashboard">
            <div className="mock-header">
              <span>FreshIQ Command Center</span>
              <span className="status-dot">Live</span>
            </div>
            <div className="mock-body">
              <div className="mock-card highlight">
                <span>Freshness Score</span>
                <h2>92 <small>/ 100</small></h2>
                <div className="trend positive">↑ 2.4% vs baseline</div>
              </div>
              <div className="mock-card">
                <span>Shelf Life</span>
                <h2>6 days</h2>
                <div className="trend neutral">Optimal rotation</div>
              </div>
              <div className="mock-card">
                <span>Storage</span>
                <h2 className="text-success">Optimal</h2>
                <div className="trend neutral">4.2°C • 61% RH</div>
              </div>
              <div className="mock-card">
                <span>Risk</span>
                <h2 className="text-success">Low</h2>
                <div className="trend positive">0 critical alerts</div>
              </div>
            </div>
            <div className="mock-footer">
              <span>AI Confidence: 94.7%</span>
              <span>Model v2.1</span>
            </div>
          </div>
        </div>
      </section>

      {/* Business Impact KPIs */}
      <section className="impact-section" id="impact">
        <div className="kpi-grid">
          <div className="kpi-item">
            <h2>12,480</h2>
            <p>Inventory Items Monitored</p>
          </div>
          <div className="kpi-item">
            <h2>82<small>/100</small></h2>
            <p>Average Freshness Score</p>
          </div>
          <div className="kpi-item">
            <h2>96.8%</h2>
            <p>Storage Compliance</p>
          </div>
          <div className="kpi-item">
            <h2>₹4.8L</h2>
            <p>Potential Waste Prevented</p>
          </div>
        </div>
      </section>

      {/* AI Intelligence Showcase */}
      <section className="ai-showcase" id="ai">
        <div className="ai-content">
          <h2 className="section-title">AI Freshness Intelligence</h2>
          <p className="section-desc">Analyze visual condition and identify freshness and spoilage indicators using our proprietary computer vision models.</p>
          <ul className="ai-features">
            <li><CheckCircle2 size={20} className="text-primary"/> Spectral Analysis Integration</li>
            <li><CheckCircle2 size={20} className="text-primary"/> 94.7% Baseline Confidence</li>
            <li><CheckCircle2 size={20} className="text-primary"/> Sub-second processing latency</li>
          </ul>
          <Link to="/login" className="btn-primary" style={{marginTop: '2rem', display: 'inline-block'}}>Explore AI Assessment</Link>
        </div>
        <div className="ai-visual">
          <div className="scan-card">
            <div className="scan-header">Analysis complete: Batch TOM-BCH-01</div>
            <div className="scan-metrics">
              <div className="metric-row">
                <span>Confidence</span>
                <div className="progress-bar"><div className="fill" style={{width: '94.7%'}}></div></div>
                <span>94.7%</span>
              </div>
              <div className="metric-row">
                <span>Spoilage Probability</span>
                <div className="progress-bar"><div className="fill warning" style={{width: '2.8%'}}></div></div>
                <span>2.8%</span>
              </div>
              <div className="metric-row">
                <span>Color Integrity</span>
                <div className="progress-bar"><div className="fill" style={{width: '95%'}}></div></div>
                <span>95%</span>
              </div>
            </div>
            <div className="scan-alert">
              <strong>AI Explanation:</strong> No major visual degradation detected. Low spoilage indicators observed.
            </div>
          </div>
        </div>
      </section>

      {/* Recommendations & Action */}
      <section className="recommendations-section">
        <div className="rec-header">
          <h2>Don't Just Detect Risk. Know What To Do Next.</h2>
          <p>Prescriptive intelligence tells your team exactly how to mitigate losses before they occur.</p>
        </div>
        <div className="rec-grid">
          <div className="rec-card warning">
            <div className="rec-tag"><RefreshCw size={16}/> ROTATE</div>
            <p className="rec-text">Milk Batch MLK-BCH-18 should be rotated within 24 hours.</p>
            <div className="rec-meta">Impact: Prevent ₹12,000 loss</div>
          </div>
          <div className="rec-card info">
            <div className="rec-tag"><Truck size={16}/> MOVE</div>
            <p className="rec-text">Move Spinach Batch SPN-BCH-09 to controlled cooling.</p>
            <div className="rec-meta">Impact: Extend life by 3 days</div>
          </div>
          <div className="rec-card danger">
            <div className="rec-tag"><AlertTriangle size={16}/> MONITOR</div>
            <p className="rec-text">Humidity in Tomato Zone A is trending upward (+5%).</p>
            <div className="rec-meta">Impact: Avert condensation decay</div>
          </div>
        </div>
      </section>

      {/* Role-Based Value Tabs */}
      <section className="roles-section">
        <h2 style={{textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem'}}>One Platform. Different Operational Views.</h2>
        
        <div className="role-tabs">
          <button className={`role-tab ${activeRole === 'retail' ? 'active' : ''}`} onClick={() => setActiveRole('retail')}>Retail Manager</button>
          <button className={`role-tab ${activeRole === 'warehouse' ? 'active' : ''}`} onClick={() => setActiveRole('warehouse')}>Warehouse Operator</button>
          <button className={`role-tab ${activeRole === 'quality' ? 'active' : ''}`} onClick={() => setActiveRole('quality')}>Quality Inspector</button>
        </div>

        <div className="role-content">
          {activeRole === 'retail' && (
            <div className="role-panel animation-fade">
              <h3>Retail Operations Command</h3>
              <ul>
                <li><Store className="icon"/> Monitor product freshness across all stores</li>
                <li><BarChart3 className="icon"/> Shelf-life markdown alerts</li>
                <li><TrendingUp className="icon"/> Drive waste reduction ROI</li>
              </ul>
            </div>
          )}
          {activeRole === 'warehouse' && (
            <div className="role-panel animation-fade">
              <h3>Supply Chain & Storage</h3>
              <ul>
                <li><ThermometerSnowflake className="icon"/> Live storage telemetry (Temp/Humidity)</li>
                <li><ShieldCheck className="icon"/> Batch health tracking</li>
                <li><RefreshCw className="icon"/> Automated rotation queue (FEFO)</li>
              </ul>
            </div>
          )}
          {activeRole === 'quality' && (
            <div className="role-panel animation-fade">
              <h3>Quality Assurance</h3>
              <ul>
                <li><Camera className="icon"/> AI visual assessment tools</li>
                <li><CheckCircle2 className="icon"/> Priority inspection queues</li>
                <li><Activity className="icon"/> Quality verification logging</li>
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <h2>Build a Smarter Food Quality Operation.</h2>
        <p>Turn freshness data into decisions before quality becomes waste.</p>
        <div className="hero-ctas" style={{justifyContent: 'center', marginTop: '2rem'}}>
          <Link to="/register" className="btn-primary large">Get Started Today</Link>
          <Link to="/login" className="btn-secondary large">Sign In</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h2>FRESH<span className="text-primary">IQ</span></h2>
            <p>AI Food Freshness Intelligence Platform</p>
          </div>
          <div className="footer-links">
            <div>
              <h4>Product</h4>
              <a href="#">AI Freshness</a>
              <a href="#">Shelf Life</a>
              <a href="#">Storage Monitoring</a>
              <a href="#">Analytics</a>
            </div>
            <div>
              <h4>Solutions</h4>
              <a href="#">Retail</a>
              <a href="#">Warehousing</a>
              <a href="#">Manufacturing</a>
            </div>
            <div>
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Contact</a>
              <a href="#">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
