import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, Calendar, ChevronDown, Sparkles, LayoutDashboard, Activity, 
  Package, Layers, LineChart, AlertCircle, FileText, BarChart2, 
  ShieldCheck, Users, Settings, Bell
} from 'lucide-react';
import './DashboardLayout.css';

export default function DashboardLayout({ children }) {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: Activity, label: 'AI Freshness', path: '/freshness' },
    { icon: Package, label: 'Inventory', path: '/inventory' },
    { icon: Layers, label: 'Batches & Traceability', path: '/batches' },
    { icon: LineChart, label: 'Shelf-Life Intelligence', path: '/shelf-life' },
    { icon: Sparkles, label: 'AI Recommendations', path: '/recommendations' },
    { icon: AlertCircle, label: 'Alerts & Exceptions', path: '/alerts', badge: '8' },
    { icon: FileText, label: 'Reports Center', path: '/reports' },
    { icon: BarChart2, label: 'Freshness Analytics', path: '/analytics' }
  ];

  const adminItems = [
    { icon: ShieldCheck, label: 'Quality Inspectors', path: '/admin/quality' },
    { icon: Users, label: 'Users & Roles', path: '/admin/users' },
    { icon: FileText, label: 'Audit Logs', path: '/admin/audit' },
    { icon: Settings, label: 'System Health', path: '/admin/health' }
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">FRESH<span className="text-primary">IQ</span></div>
          <span className="badge-ent">ENT</span>
        </div>
        
        <div className="sidebar-scroll">
          <nav className="sidebar-nav">
            {menuItems.map((item, idx) => (
              <Link 
                key={idx} 
                to={item.path}
                className={`nav-item ${currentPath === item.path ? 'active' : ''}`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </Link>
            ))}
            
            <div className="nav-section">ADMINISTRATION</div>
            {adminItems.map((item, idx) => (
              <Link key={idx} to={item.path} className={`nav-item ${currentPath === item.path ? 'active' : ''}`}>
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="org-selector">
            <div className="org-info">
              <span className="org-label">ORGANIZATION</span>
              <span className="org-name">Metro Food Distribution <ChevronDown size={14}/></span>
            </div>
          </div>
          <div className="user-profile">
            <div className="avatar">EV</div>
            <div className="user-info">
              <span className="user-name">Elena Vanca</span>
              <span className="user-role">VP Quality & Ops</span>
            </div>
            <Settings size={16} className="text-muted" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-area">
        {/* Top Header */}
        <header className="top-header">
          <div className="search-bar">
            <Search size={16} className="text-muted" />
            <input type="text" placeholder="Search products, batches, alerts..." />
          </div>
          <div className="header-actions">
            <div className="status-pill"><span className="dot online"></span> Sensors: 99.8% Online</div>
            <div className="status-pill"><span className="dot online"></span> AI Model: v4.2 Active</div>
            <div className="date-selector">
              <Calendar size={16} /> Last 30 Days <ChevronDown size={16} />
            </div>
            <button className="icon-btn"><Bell size={18}/><span className="notification-dot"></span></button>
            <div className="header-avatar">EV</div>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
}
