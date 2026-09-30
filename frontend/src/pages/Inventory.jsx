import React from 'react';
import { Download, RefreshCw, Filter, Package, AlertTriangle, TrendingUp, CheckCircle2, Search, SlidersHorizontal, Settings2, Zap } from 'lucide-react';
import './Inventory.css';

export default function Inventory() {
  return (
    <div className="inventory-page">
      <div className="page-header">
        <div>
          <div className="breadcrumb">
            <span className="badge-live">LIVE ALGORITHMIC TELEMETRY</span>
            <span className="text-muted">• REGION NORTH MULTI-HUB</span>
          </div>
          <h1>Inventory Intelligence Command Center</h1>
          <p>Real-time SKU-level freshness tracking, risk exposure tiers, and automated FEFO dispatch priorities.</p>
        </div>
        <div className="page-actions">
          <button className="btn-outline"><Download size={16}/> Export Manifest</button>
          <button className="btn-outline"><RefreshCw size={16}/> Bulk Reallocate</button>
          <button className="btn-fefo"><Zap size={16}/> Trigger FEFO Dispatch</button>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header"><span>TRACKED SKUs</span> <Package size={16}/></div>
          <h2>148</h2>
          <div className="kpi-meta text-muted">Across 12 hubs</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-header"><span>PHYSICAL UNITS</span> <TrendingUp size={16}/></div>
          <h2>428.5k</h2>
          <div className="kpi-trend positive">+5.2% inbound</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-header"><span>FRESH & PRIME</span> <CheckCircle2 size={16} className="text-success"/></div>
          <h2>312.8k</h2>
          <div className="kpi-trend positive">73.0% Optimal Grade</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-header"><span>AT-RISK WINDOW</span> <RefreshCw size={16} className="text-warning"/></div>
          <h2>68,400</h2>
          <div className="kpi-trend warning">16.0% FEFO Flagged</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-header"><span>NEAR SPOILAGE</span> <AlertTriangle size={16} className="text-danger"/></div>
          <h2 className="text-danger">18,200</h2>
          <div className="kpi-trend danger">4.2% Markdown tier</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-header"><span>LOSS EXPOSURE</span> <span className="rupee">₹</span></div>
          <h2>₹2.45L</h2>
          <div className="kpi-trend positive">88.4% Protected</div>
        </div>
      </div>

      <div className="inventory-content-split">
        {/* Main Table Area */}
        <div className="table-area">
          <div className="inventory-tabs">
            <button className="tab active">All Inventory (148)</button>
            <button className="tab text-muted">At-Risk / Expiry &lt;72h (24)</button>
            <button className="tab text-danger font-medium">Critical Spoilage (8)</button>
            <button className="tab text-muted">Surge Cold-Chain (14)</button>
          </div>
          
          <div className="table-controls">
            <div className="search-box">
              <Search size={16} className="text-muted"/>
              <input type="text" placeholder="Filter by product, SKU, batch, zone..." />
            </div>
            <div className="filter-dropdowns">
              <select><option>Category: All</option></select>
              <select><option>Zone: All</option></select>
              <select><option>Freshness: All</option></select>
              <button className="btn-icon"><SlidersHorizontal size={16}/></button>
            </div>
          </div>

          <table className="inventory-table">
            <thead>
              <tr>
                <th>PRODUCT & SKU</th>
                <th>CATEGORY</th>
                <th>BATCH & ZONE</th>
                <th>UNITS</th>
                <th>FRESHNESS INDEX</th>
                <th>SHELF LIFE</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="td-product">
                    <div className="img-placeholder">🍅</div>
                    <div>
                      <strong>Ripe Vine Tomatoes</strong>
                      <span>SKU-VNE-8821</span>
                    </div>
                  </div>
                </td>
                <td><span className="text-muted">Vine Produce</span></td>
                <td>
                  <strong>TOM-BCH-01</strong>
                  <span>Cold Zone A-12</span>
                </td>
                <td><strong>1,240<br/>kg</strong></td>
                <td>
                  <div className="freshness-cell">
                    <span className="score-badge success">91/100</span>
                    <span className="grade success">Grade<br/>A</span>
                  </div>
                </td>
                <td>
                  <strong>6.0 Days</strong>
                  <span>Oct 28 2026</span>
                </td>
              </tr>

              <tr>
                <td>
                  <div className="td-product">
                    <div className="img-placeholder">🥛</div>
                    <div>
                      <strong>Organic Whole Milk 1L</strong>
                      <span>SKU-DAI-1044</span>
                    </div>
                  </div>
                </td>
                <td><span className="text-muted">Dairy Line</span></td>
                <td>
                  <strong>MLK-BCH-18</strong>
                  <span>Chiller B-04</span>
                </td>
                <td><strong>4,800<br/>units</strong></td>
                <td>
                  <div className="freshness-cell">
                    <span className="score-badge warning">68/100</span>
                    <span className="grade warning">Grade<br/>B</span>
                  </div>
                </td>
                <td>
                  <strong>2.0 Days</strong>
                  <span>Oct 24 2026</span>
                </td>
              </tr>

              <tr className="highlight-danger">
                <td>
                  <div className="td-product">
                    <div className="img-placeholder">🥬</div>
                    <div>
                      <strong>Baby Spinach Clamshells <span className="dot danger"></span></strong>
                      <span>SKU-GRN-3092</span>
                    </div>
                  </div>
                </td>
                <td><span className="text-muted">Leafy Greens</span></td>
                <td>
                  <strong>SPN-BCH-09</strong>
                  <span className="text-danger">Cold Vault C-01</span>
                </td>
                <td><strong className="text-danger">850<br/>units</strong></td>
                <td>
                  <div className="freshness-cell">
                    <span className="score-badge danger">42/100</span>
                    <span className="grade danger">Grade<br/>C</span>
                  </div>
                </td>
                <td>
                  <strong className="text-danger">1.0 Days</strong>
                  <span className="text-danger">Oct 23 2026</span>
                </td>
              </tr>

              <tr>
                <td>
                  <div className="td-product">
                    <div className="img-placeholder">🥑</div>
                    <div>
                      <strong>Hass Avocados Stage 3</strong>
                      <span>SKU-AVO-4410</span>
                    </div>
                  </div>
                </td>
                <td><span className="text-muted">Exotic Produce</span></td>
                <td>
                  <strong>AVO-BCH-44</strong>
                  <span>Ripening Rm 2</span>
                </td>
                <td><strong>2,150<br/>kg</strong></td>
                <td>
                  <div className="freshness-cell">
                    <span className="score-badge success">76/100</span>
                    <span className="grade success">Grade<br/>A-</span>
                  </div>
                </td>
                <td>
                  <strong>3.0 Days</strong>
                  <span>Oct 25 2026</span>
                </td>
              </tr>
              
              <tr className="highlight-warning">
                <td>
                  <div className="td-product">
                    <div className="img-placeholder">🐟</div>
                    <div>
                      <strong>Atlantic Salmon Fillets <span className="dot danger"></span></strong>
                      <span>SKU-SEA-9901</span>
                    </div>
                  </div>
                </td>
                <td><span className="text-muted">Fresh Seafood</span></td>
                <td>
                  <strong>SLM-BCH-07</strong>
                  <span>Sub-Zero Vault 1</span>
                </td>
                <td><strong>420<br/>kg</strong></td>
                <td>
                  <div className="freshness-cell">
                    <span className="score-badge danger">54/100</span>
                    <span className="grade danger">Grade<br/>C+</span>
                  </div>
                </td>
                <td>
                  <strong className="text-danger">1.5 Days</strong>
                  <span>Oct 23 2026</span>
                </td>
              </tr>
              
              <tr>
                <td>
                  <div className="td-product">
                    <div className="img-placeholder">🍎</div>
                    <div>
                      <strong>Crisp Honeycrisp Apples</strong>
                      <span>SKU-APL-6211</span>
                    </div>
                  </div>
                </td>
                <td><span className="text-muted">Pome Fruit</span></td>
                <td>
                  <strong>APL-BCH-12</strong>
                  <span>Controlled Atmos A</span>
                </td>
                <td><strong>5,600<br/>kg</strong></td>
                <td>
                  <div className="freshness-cell">
                    <span className="score-badge success">96/100</span>
                    <span className="grade success">Grade<br/>A+</span>
                  </div>
                </td>
                <td>
                  <strong>18.0 Days</strong>
                  <span>Nov 10 2026</span>
                </td>
              </tr>

            </tbody>
          </table>
          <div className="pagination">
            <span className="text-muted">Showing <strong>1-6</strong> of <strong>148</strong> SKUs</span>
            <span className="text-muted" style={{marginLeft: '1rem'}}>Rows per page: <strong>25</strong></span>
            <div className="page-controls">
              <button disabled>&lt;</button>
              <button className="active">1</button>
              <button>2</button>
              <button>3</button>
              <span>...</span>
              <button>25</button>
              <button>&gt;</button>
            </div>
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="right-sidebar">
          {/* FEFO Hub */}
          <div className="side-card">
            <div className="card-top">
              <div className="fefo-icon"><Zap size={20}/></div>
              <div>
                <h3 style={{margin:0}}>FEFO Automation Hub</h3>
                <span className="text-muted font-small">First-Expired, First-Out Engine</span>
              </div>
              <div className="badge-fefo">8 BATCHES PENDING</div>
            </div>
            
            <div className="metric-box">
              <div className="mb-header">
                <span>Rotation Compliance Velocity</span>
                <strong>94.2%</strong>
              </div>
              <div className="progress-bar"><div className="fill success" style={{width: '94.2%'}}></div></div>
              <div className="mb-footer">
                <span>Target: 92.0%</span>
                <span className="text-success">+1.8% vs last week</span>
              </div>
            </div>
            
            <p className="font-small text-muted mb-4">Algorithmic model detected 8 critical decay trajectories across Cold Vault C and Chiller B. Immediate re-dispatch preserves ₹1.82L in inventory margin.</p>
            
            <button className="btn-fefo w-100"><CheckCircle2 size={16}/> Approve Automated FEFO Pick List</button>
          </div>

          {/* Risk Exposure */}
          <div className="side-card">
            <div className="card-top" style={{alignItems: 'center'}}>
              <h3 style={{margin:0, display:'flex', alignItems:'center', gap:'0.5rem'}}><AlertTriangle size={18}/> Risk Exposure by Food Category</h3>
              <span className="badge-live" style={{fontSize:'0.6rem'}}>Live Weighting</span>
            </div>
            
            <div className="risk-list">
              <div className="risk-item">
                <div className="ri-label">
                  <span>Leafy Greens (Rapid Respiration)</span>
                  <strong className="text-danger">38% At Risk</strong>
                </div>
                <div className="progress-bar mini"><div className="fill danger" style={{width: '38%'}}></div></div>
              </div>
              <div className="risk-item">
                <div className="ri-label">
                  <span>Fresh Seafood</span>
                  <strong className="text-danger">24% At Risk</strong>
                </div>
                <div className="progress-bar mini"><div className="fill danger" style={{width: '24%'}}></div></div>
              </div>
              <div className="risk-item">
                <div className="ri-label">
                  <span>Dairy Products</span>
                  <strong className="text-warning">19% At Risk</strong>
                </div>
                <div className="progress-bar mini"><div className="fill warning" style={{width: '19%'}}></div></div>
              </div>
              <div className="risk-item">
                <div className="ri-label">
                  <span>Stone Fruits</span>
                  <strong className="text-muted">12% At Risk</strong>
                </div>
                <div className="progress-bar mini"><div className="fill warning" style={{width: '12%'}}></div></div>
              </div>
              <div className="risk-item">
                <div className="ri-label">
                  <span>Hard Produce</span>
                  <strong className="text-muted">4% At Risk</strong>
                </div>
                <div className="progress-bar mini"><div className="fill success" style={{width: '4%'}}></div></div>
              </div>
            </div>
            
            <div className="info-box">
              <AlertCircle size={14} className="text-muted"/>
              <span>Leafy greens show 2.4x higher ethylene sensitivity under current ambient humidity.</span>
            </div>
          </div>

          {/* Zone Occupancy */}
          <div className="side-card">
            <div className="card-top">
              <h3 style={{margin:0, display:'flex', alignItems:'center', gap:'0.5rem'}}><Settings2 size={18}/> Zone Occupancy & Thermal Health</h3>
            </div>
            {/* Mock content since it's cut off in the screenshot */}
            <div style={{height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '8px', color: '#94a3b8'}}>
              Loading telemetry...
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
