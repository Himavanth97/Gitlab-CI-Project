import { useState } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  Layers, 
  Activity, 
  Github, 
  ArrowUpRight, 
  Terminal as TerminalIcon,
  HelpCircle,
  BarChart3
} from 'lucide-react'

// Mock trend datasets for interactive SVGs
const TRENDS_DATASETS = {
  'ai-agents': {
    title: 'AI Agent Automations',
    category: 'Artificial Intelligence',
    growth: '+142.6%',
    volume: '382,100 searches',
    points: [
      { month: 'Jan', value: 45, label: '45k queries' },
      { month: 'Feb', value: 80, label: '80k queries' },
      { month: 'Mar', value: 110, label: '110k queries' },
      { month: 'Apr', value: 180, label: '180k queries' },
      { month: 'May', value: 290, label: '290k queries' },
      { month: 'Jun', value: 382, label: '382k queries' }
    ],
    color: '#a855f7' // Purple
  },
  'webassembly': {
    title: 'WebAssembly Edge Frameworks',
    category: 'Cloud Engineering',
    growth: '+88.1%',
    volume: '194,500 searches',
    points: [
      { month: 'Jan', value: 70, label: '70k queries' },
      { month: 'Feb', value: 92, label: '92k queries' },
      { month: 'Mar', value: 115, label: '115k queries' },
      { month: 'Apr', value: 130, label: '130k queries' },
      { month: 'May', value: 165, label: '165k queries' },
      { month: 'Jun', value: 194, label: '194k queries' }
    ],
    color: '#06b6d4' // Cyan
  },
  'saas-boilerplates': {
    title: 'Next.js SaaS Boilerplates',
    category: 'Web Development',
    growth: '+64.3%',
    volume: '142,000 searches',
    points: [
      { month: 'Jan', value: 50, label: '50k queries' },
      { month: 'Feb', value: 68, label: '68k queries' },
      { month: 'Mar', value: 72, label: '72k queries' },
      { month: 'Apr', value: 98, label: '98k queries' },
      { month: 'May', value: 121, label: '121k queries' },
      { month: 'Jun', value: 142, label: '142k queries' }
    ],
    color: '#10b981' // Emerald
  },
  'tailwindcss-v4': {
    title: 'Tailwind CSS v4 Spec',
    category: 'Design Systems',
    growth: '+118.5%',
    volume: '228,900 searches',
    points: [
      { month: 'Jan', value: 30, label: '30k queries' },
      { month: 'Feb', value: 55, label: '55k queries' },
      { month: 'Mar', value: 92, label: '92k queries' },
      { month: 'Apr', value: 140, label: '140k queries' },
      { month: 'May', value: 198, label: '198k queries' },
      { month: 'Jun', value: 228, label: '228k queries' }
    ],
    color: '#f59e0b' // Gold
  }
}

export default function App() {
  const [activeTrend, setActiveTrend] = useState('ai-agents')
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, label: '', value: '' })

  const currentDataset = TRENDS_DATASETS[activeTrend]

  // Calculate SVG Points coordinates
  // SVG Width: 600, Height: 240. Margin: Left 40, Right 40, Top 30, Bottom 30
  // Value range: 0 to 400
  const getCoordinates = (points) => {
    const width = 600
    const height = 240
    const paddingX = 50
    const paddingY = 40
    
    return points.map((p, idx) => {
      const x = paddingX + (idx / (points.length - 1)) * (width - 2 * paddingX)
      // Normalize values relative to 400 max
      const y = height - paddingY - (p.value / 400) * (height - 2 * paddingY)
      return { x, y, month: p.month, value: p.value, label: p.label }
    })
  }

  const coords = getCoordinates(currentDataset.points)
  
  // Construct SVG Path String (Area and Line)
  const linePath = coords.reduce((acc, c, idx) => {
    return acc + `${idx === 0 ? 'M' : 'L'} ${c.x} ${c.y} `
  }, '')

  const areaPath = linePath + `L ${coords[coords.length - 1].x} 200 L ${coords[0].x} 200 Z`

  const handlePointHover = (event, point) => {
    const rect = event.currentTarget.getBoundingClientRect()
    // Align absolute tooltip positions
    setTooltip({
      visible: true,
      x: event.clientX - rect.left + 15,
      y: event.clientY - rect.top - 60,
      label: point.month,
      value: point.label
    })
  }

  const handlePointLeave = () => {
    setTooltip(prev => ({ ...prev, visible: false }))
  }

  return (
    <main className="app-container">
      {/* Header */}
      <header className="header-glass">
        <div className="brand-section">
          <Layers className="brand-logo" size={32} />
          <div>
            <h1 className="brand-title">Trend Insights & Analytics</h1>
            <p style={{ fontSize: '10px', color: '#94a3b8', fontFamily: 'monospace' }}>account: Himavanth97</p>
          </div>
        </div>

        <div className="header-actions">
          <a 
            href="https://github.com/Himavanth97/Gitlab-CI-Project" 
            target="_blank" 
            rel="noopener noreferrer"
            className="gh-badge"
          >
            <Github size={14} />
            <span>Himavanth97/Gitlab-CI-Project</span>
            <ArrowUpRight size={12} />
          </a>
        </div>
      </header>

      {/* Metrics Section */}
      <section className="metrics-grid">
        <div className="card-glass metric-card" id="metric-queries">
          <div className="metric-header">
            <span className="metric-title">Global Trend Volume</span>
            <div className="metric-icon" style={{ color: '#a855f7' }}>⚡</div>
          </div>
          <div className="metric-body">
            <span className="metric-value">947,500</span>
            <span className="trend-badge trend-up">
              <TrendingUp size={12} />
              <span>+18.4%</span>
            </span>
          </div>
        </div>

        <div className="card-glass metric-card" id="metric-growth">
          <div className="metric-header">
            <span className="metric-title">Emerging SaaS Velocity</span>
            <div className="metric-icon" style={{ color: '#06b6d4' }}>📈</div>
          </div>
          <div className="metric-body">
            <span className="metric-value">82.1%</span>
            <span className="trend-badge trend-up">
              <TrendingUp size={12} />
              <span>+12.6%</span>
            </span>
          </div>
        </div>

        <div className="card-glass metric-card" id="metric-actions">
          <div className="metric-header">
            <span className="metric-title">Pages Builds Run</span>
            <div className="metric-icon" style={{ color: '#10b981' }}>⚙</div>
          </div>
          <div className="metric-body">
            <span className="metric-value">12 Passed</span>
            <span className="trend-badge" style={{ background: 'rgba(255,255,255,0.03)', color: '#94a3b8' }}>
              <span>Flatline</span>
            </span>
          </div>
        </div>

        <div className="card-glass metric-card" id="metric-hotspot">
          <div className="metric-header">
            <span className="metric-title">Active Market Hotspot</span>
            <div className="metric-icon" style={{ color: '#f59e0b' }}>🔥</div>
          </div>
          <div className="metric-body">
            <span className="metric-value" style={{ fontSize: '18px', paddingTop: '4px' }}>AI Agent Tech</span>
            <span className="trend-badge trend-up">
              <TrendingUp size={12} />
              <span>Peak</span>
            </span>
          </div>
        </div>
      </section>

      {/* Main Charts & Sidebars */}
      <section className="charts-layout">
        {/* Core Interactive Chart */}
        <div className="card-glass" style={{ minHeight: '440px' }} id="chart-panel">
          <div className="chart-header">
            <div>
              <h2 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Activity size={18} color="#a855f7" />
                Interest Over Time: <span style={{ color: currentDataset.color }}>{currentDataset.title}</span>
              </h2>
              <p style={{ fontSize: '12px', color: '#64748b' }}>Search frequency scaled relative to baseline query density (0-400k range)</p>
            </div>

            <div className="trend-badge trend-up" style={{ color: currentDataset.color, borderColor: `${currentDataset.color}33`, background: `${currentDataset.color}11` }}>
              <Sparkles size={12} />
              <span>{currentDataset.growth} growth</span>
            </div>
          </div>

          {/* SVG Canvas Area */}
          <div className="svg-chart-container" id="svg-container">
            {tooltip.visible && (
              <div 
                className="chart-tooltip" 
                style={{ 
                  left: `${tooltip.x}px`, 
                  top: `${tooltip.y}px`,
                  borderColor: currentDataset.color
                }}
              >
                <span style={{ color: '#94a3b8', fontSize: '9px', fontWeight: 'bold' }}>{tooltip.label}</span>
                <span style={{ fontWeight: 'bold', color: currentDataset.color }}>{tooltip.value}</span>
              </div>
            )}

            <svg viewBox="0 0 600 240" style={{ width: '100%', height: '100%' }}>
              <defs>
                <linearGradient id="chart-gradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="50%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
                <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={currentDataset.color} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={currentDataset.color} stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              <line x1="50" y1="40" x2="550" y2="40" className="chart-grid-line" />
              <line x1="50" y1="80" x2="550" y2="80" className="chart-grid-line" />
              <line x1="50" y1="120" x2="550" y2="120" className="chart-grid-line" />
              <line x1="50" y1="160" x2="550" y2="160" className="chart-grid-line" />
              <line x1="50" y1="200" x2="550" y2="200" className="chart-grid-line" style={{ stroke: 'rgba(255,255,255,0.1)' }} />

              {/* Y Axis indicators */}
              <text x="25" y="44" fill="#475569" fontSize="9" fontFamily="monospace">400k</text>
              <text x="25" y="124" fill="#475569" fontSize="9" fontFamily="monospace">200k</text>
              <text x="25" y="204" fill="#475569" fontSize="9" fontFamily="monospace">0</text>

              {/* Glowing curves */}
              <path d={areaPath} className="chart-area" />
              <path d={linePath} className="chart-glow-line" style={{ stroke: currentDataset.color }} />

              {/* Interaction points */}
              {coords.map((c, idx) => (
                <g key={idx}>
                  <circle 
                    cx={c.x} 
                    cy={c.y} 
                    className="chart-dot" 
                    style={{ stroke: currentDataset.color }}
                    onMouseMove={(e) => handlePointHover(e, c)}
                    onMouseLeave={handlePointLeave}
                  />
                  <text 
                    x={c.x} 
                    y="222" 
                    fill="#94a3b8" 
                    fontSize="10" 
                    fontFamily="monospace" 
                    textAnchor="middle"
                  >
                    {c.month}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Sidebar: trending hotspot selector list */}
        <div className="card-glass" id="hotspots-panel">
          <h2 style={{ fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: 6 }}>
            <BarChart3 size={16} color="#06b6d4" />
            Trending Hotspots
          </h2>
          
          <div className="trending-list">
            {Object.keys(TRENDS_DATASETS).map((key, index) => {
              const item = TRENDS_DATASETS[key]
              const isActive = key === activeTrend
              return (
                <div 
                  key={key} 
                  className="trending-item" 
                  style={{ borderColor: isActive ? `${item.color}55` : '' }}
                  onClick={() => setActiveTrend(key)}
                >
                  <div className="trending-meta">
                    <span className="trending-rank">0{index + 1}</span>
                    <div>
                      <div className="trending-name">{item.title}</div>
                      <div className="trending-volume">{item.category}</div>
                    </div>
                  </div>
                  <span className="trend-badge trend-up" style={{ color: item.color, background: `${item.color}11`, borderColor: `${item.color}22` }}>
                    {item.growth}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* GitHub actions Deployer Instructions */}
      <section className="card-glass" style={{ marginTop: '1rem' }} id="git-helper-panel">
        <h2 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Github size={20} color="#06b6d4" />
          GitHub Actions Deployment Guide
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '1rem' }}>
          This trend-insights project comes configured with GitHub Actions. Open your terminal inside this project folder and run the push script below to host the live interactive dashboard directly under your GitHub account!
        </p>

        <div className="git-helper-panel">
          <div className="code-terminal-box">
            <div className="code-terminal-header">
              <span>Terminal: Deploy trend-insights</span>
              <span style={{ fontSize: '9px', color: '#475569' }}>directory: trend-insights/</span>
            </div>
            <div className="cmd-line">git init --initial-branch=main</div>
            <div className="cmd-line">git add .</div>
            <div className="cmd-line">git commit -m "feat: init premium trend-insights analytics dashboard"</div>
            <div className="cmd-line">git remote add origin https://github.com/Himavanth97/Gitlab-CI-Project.git</div>
            <div className="cmd-line">git push -u origin main --force</div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>
            <h4 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '4px' }}>Deployment Instructions</h4>
            <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.4 }}>
              * Simply paste the temporary Personal Access Token (PAT) you generated as the Password in the terminal to upload. 
              Once the push succeeds, navigate to the **Actions** tab in your repository on GitHub to monitor your live build, test, and automated hosting run!
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-text">
        <p>Emerging Trend Insights Analytics. Configured for GitHub Actions automatic deployment pipelines.</p>
        <p style={{ marginTop: '4px', color: '#334155' }}>© 2026 Trend Insights Inc.</p>
      </footer>
    </main>
  )
}
