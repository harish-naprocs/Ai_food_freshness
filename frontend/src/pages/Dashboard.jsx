import React, { useState, useEffect } from 'react';
import { 
  Search, Calendar, ChevronDown, Download, Sparkles, Filter, 
  LayoutDashboard, Activity, Package, Layers, LineChart, 
  AlertCircle, FileText, BarChart2, ShieldCheck, Users, 
  Settings, CheckCircle2, TrendingUp, Clock, AlertTriangle, Bell, RefreshCw
} from 'lucide-react';
import { 
  LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import './Dashboard.css';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/analytics/dashboard')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return <div style={{padding: '3rem', textAlign: 'center'}}>Loading AI Analytics...</div>;
  }
  const [activeMenu, setActiveMenu] = useState('Overview');

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview' },
    { icon: Activity, label: 'AI Freshness' },
    { icon: Package, label: 'Inventory' },
    { icon: Layers, label: 'Batches & Traceability' },
    { icon: LineChart, label: 'Shelf-Life Intelligence' },
    { icon: Sparkles, label: 'AI Recommendations' },
    { icon: AlertCircle, label: 'Alerts & Exceptions', badge: '8' },
    { icon: FileText, label: 'Reports Center' },
    { icon: BarChart2, label: 'Freshness Analytics' }
  ];

  const adminItems = [
    { icon: ShieldCheck, label: 'Quality Inspectors' },
    { icon: Users, label: 'Users & Roles' },
    { icon: FileText, label: 'Audit Logs' },
    { icon: Settings, label: 'System Health' }
  ];

  return (
    <div className="dashboard-body">
          <div className="page-header">
            <div>
              <div className="breadcrumb">
                <span className="badge-live">LIVE TELEMETRY</span>
                <span className="text-muted">• Network-wide Freshness Model v4.2</span>
              </div>
              <h1>Executive Overview: Food Quality Command Center</h1>
              <p>Real-time visibility into freshness, shelf life, storage risk and inventory health across supply-chain nodes.</p>
            </div>
            <div className="page-actions">
              <button className="btn-outline"><Filter size={16}/> Node Filter: All (12)</button>
              <button className="btn-primary"><Download size={16}/> Generate Ops Briefing</button>
            </div>
          </div>

          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-header"><span>TOTAL INVENTORY</span> <Package size={16}/></div>
              <h2>{data.kpis.total_inventory.toLocaleString()}</h2>
              <div className="kpi-trend positive"><TrendingUp size={14}/> +4.8% vs last mo</div>
              <div className="kpi-meta">148 SKUs • 12 facilities</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-header"><span>FRESH INVENTORY</span> <span className="kpi-badge success">Optimal</span></div>
              <h2>{data.kpis.fresh_inventory.toLocaleString()}</h2>
              <div className="kpi-trend positive"><CheckCircle2 size={14}/> 71.7% of total</div>
              <div className="progress-mini"><div className="fill success" style={{width: '71.7%'}}></div></div>
            </div>
            <div className="kpi-card">
              <div className="kpi-header"><span>AT-RISK INVENTORY</span> <span className="kpi-badge warning">Amber Alert</span></div>
              <h2>{data.kpis.at_risk_inventory.toLocaleString()}</h2>
              <div className="kpi-trend warning"><Clock size={14}/> 10.3% of total</div>
              <div className="kpi-meta">Rotate within 72h window</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-header"><span>NEAR SPOILAGE</span> <span className="kpi-badge danger">Critical</span></div>
              <h2>{data.kpis.near_spoilage}</h2>
              <div className="kpi-trend danger"><AlertTriangle size={14}/> 3.4% requiring markdown</div>
              <div className="kpi-meta text-danger">Immediate triage required</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-header"><span>WASTE PREVENTED</span> <ShieldCheck size={16}/></div>
              <h2>₹{(data.kpis.waste_prevented / 100000).toFixed(1)}L</h2>
              <div className="kpi-trend positive"><TrendingUp size={14}/> +18.2% vs baseline</div>
              <div className="kpi-meta">8.4 MT preserved Q3</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-header"><span>FRESHNESS SCORE</span> <span className="kpi-badge success">Pass</span></div>
              <h2>{data.kpis.freshness_score} <small>/100</small></h2>
              <div className="kpi-trend positive"><TrendingUp size={14}/> +3.7 pts vs 30d (Target: 80)</div>
              <div className="kpi-meta">Enterprise Benchmark: 78</div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="charts-row">
            <div className="chart-card flex-2">
              <div className="chart-header">
                <div>
                  <h3>Freshness Health Trend</h3>
                  <p>Continuous CV Inference | Spectral analysis and IoT ambient storage cross-validation</p>
                </div>
                <div className="chart-actions">
                  <div className="time-toggles">
                    <button className="active">7D</button><button>30D</button><button>90D</button>
                  </div>
                </div>
              </div>
              <div className="chart-container" style={{height: '300px'}}>
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={data.health_trend} margin={{top: 20, right: 30, left: 0, bottom: 0}}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <Tooltip />
                    <Line type="monotone" dataKey="fresh" stroke="#10b981" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="good" stroke="#3b82f6" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="acceptable" stroke="#f59e0b" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="risk" stroke="#ef4444" strokeWidth={2} dot={false} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-card flex-1">
              <div className="chart-header">
                <h3>Inventory Risk Distribution</h3>
                <p>Breakdown by current safety tier</p>
              </div>
              <div className="pie-container" style={{height: '200px', position: 'relative'}}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data.risk_distribution} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                      {data.risk_distribution.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pie-center">
                  <h2>91.8%</h2>
                  <span>COMPLIANT<br/>Safety Threshold</span>
                </div>
              </div>
              <div className="pie-legend">
                {data.risk_distribution.map(item => (
                  <div key={item.name} className="legend-item">
                    <div className="legend-label"><span className="dot" style={{background: item.color}}></span> {item.name}</div>
                    <div className="legend-value">{item.value.toFixed(1)}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="bottom-row">
            {/* Table */}
            <div className="table-card flex-2">
              <div className="table-header">
                <div>
                  <h3>Items Requiring Attention</h3>
                  <p>Algorithmically sorted by shelf-life decay velocity</p>
                </div>
                <div className="table-filters">
                  <span className="badge-danger">5 Prioritized</span>
                  <button className="active">All (8)</button>
                  <button>At Risk</button>
                  <button>Near Spoilage</button>
                </div>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>PRODUCT</th>
                    <th>BATCH & ZONE</th>
                    <th>FRESHNESS</th>
                    <th>REMAINING LIFE</th>
                    <th>RISK TIER</th>
                  </tr>
                </thead>
                <tbody>
                  {data.attention_items.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <div className="td-product">
                          <div className="img-placeholder">{item.emoji}</div>
                          <div>
                            <strong>{item.product}</strong>
                            <span>{item.grade}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <strong>{item.batch}</strong>
                        <span>{item.zone}</span>
                      </td>
                      <td>
                        <span className={`score-badge ${item.risk_tier === 'Critical' ? 'danger' : item.risk_tier === 'Medium' ? 'warning' : 'success'}`}>
                          {item.score} / 100
                        </span>
                      </td>
                      <td>
                        <strong>{item.days_left} days left</strong>
                        <div className="mini-bar">
                          <div className={`fill ${item.risk_tier === 'Critical' ? 'danger' : item.risk_tier === 'Medium' ? 'warning' : 'success'}`} style={{width: `${(item.days_left / 14) * 100}%`}}></div>
                        </div>
                      </td>
                      <td>
                        <span className={item.risk_tier === 'Critical' ? 'badge-danger' : `text-${item.risk_tier === 'Medium' ? 'warning' : 'success'} font-medium`}>
                          {item.risk_tier}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* AI Insights Feed */}
            <div className="feed-card flex-1">
              <div className="feed-header">
                <h3><Sparkles size={18} className="text-primary"/> AI Insights & Copilot</h3>
                <span className="status-badge success">Active Engine</span>
              </div>
              <p className="feed-subtitle">Proactive algorithmic suggestions for loss mitigation</p>
              
              <div className="feed-list">
                {data.insights.map((insight, idx) => (
                  <div key={idx} className={`feed-item border-${insight.level}`}>
                    <div className="fi-header">
                      <span className={`fi-tag ${insight.level}`}>
                        {insight.level === 'danger' ? <AlertTriangle size={12}/> : insight.level === 'warning' ? <RefreshCw size={12}/> : <ShieldCheck size={12}/>} 
                        {' '}{insight.type}
                      </span>
                      <span className="fi-time">{insight.time}</span>
                    </div>
                    <p>{insight.description}</p>
                    {insight.action && (
                      <div className="fi-actions">
                        <button className={`btn-${insight.level === 'danger' ? 'danger' : 'primary'}-solid`}>{insight.action}</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
  );
}
