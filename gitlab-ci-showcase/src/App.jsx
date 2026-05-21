import { useState, useEffect, useRef } from 'react'
import { 
  Play, 
  Terminal as TerminalIcon, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Loader2, 
  Activity, 
  Clock, 
  Sparkles, 
  BookOpen, 
  FileCode2, 
  GitBranch,
  Database,
  Cpu
} from 'lucide-react'

// Simulated logs for each stage
const JOB_LOG_TEMPLATES = {
  'eslint-check': [
    { type: 'cmd', text: 'npm run lint' },
    { type: 'info', text: '> gitlab-ci-showcase@1.0.0 lint' },
    { type: 'info', text: '> eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0' },
    { type: 'dim', text: 'Scanning codebase for syntactical and style consistency...' },
    { type: 'dim', text: 'Analyzing 8 source files in /builds/username/gitlab-ci-showcase/src...' },
    { type: 'dim', text: 'Checking ESLint configuration files...' },
    { type: 'success', text: '✓ All files match current code style configuration.' },
    { type: 'success', text: '✓ No warnings or linting violations found.' },
    { type: 'info', text: 'Job succeeded with status code 0' }
  ],
  'vitest-run': [
    { type: 'cmd', text: 'npm run test' },
    { type: 'info', text: '> gitlab-ci-showcase@1.0.0 test' },
    { type: 'info', text: '> vitest run' },
    { type: 'dim', text: ' RUN  v1.6.0 /builds/username/gitlab-ci-showcase' },
    { type: 'dim', text: ' ✓ src/App.test.jsx (1 test) 15ms' },
    { type: 'success', text: ' Test Files  1 passed (1)' },
    { type: 'success', text: '      Tests  1 passed (1)' },
    { type: 'dim', text: '   Start at  ' + new Date().toLocaleTimeString() },
    { type: 'dim', text: '   Duration  180ms (transform 45ms, setup 0ms, collect 8ms, tests 15ms)' },
    { type: 'success', text: '✓ Automated unit test suite successfully verified!' },
    { type: 'info', text: 'Job succeeded with status code 0' }
  ],
  'vite-compile': [
    { type: 'cmd', text: 'npm run build' },
    { type: 'info', text: '> gitlab-ci-showcase@1.0.0 build' },
    { type: 'info', text: '> vite build' },
    { type: 'dim', text: 'vite v5.3.1 building for production...' },
    { type: 'dim', text: 'transforming...' },
    { type: 'dim', text: '✓ 143 modules transformed.' },
    { type: 'dim', text: 'rendering chunks...' },
    { type: 'info', text: 'dist/assets/index-D7h5e2A4.css   48.24 kB │ gzip: 11.45 kB' },
    { type: 'info', text: 'dist/assets/index-C3e9d8B1.js   182.11 kB │ gzip: 56.78 kB' },
    { type: 'success', text: '✓ built in 1.42s' },
    { type: 'info', text: 'Uploading compilation artifacts to GitLab coordinator...' },
    { type: 'success', text: '✓ Artifacts uploaded. Expires in 1 week.' },
    { type: 'info', text: 'Job succeeded with status code 0' }
  ],
  'pages-host': [
    { type: 'cmd', text: 'rm -rf public && mv dist public' },
    { type: 'dim', text: 'Cleaning up deployment structures...' },
    { type: 'dim', text: 'Extracting build compilation artifact...' },
    { type: 'dim', text: 'Preparing directory folder structure [public/]' },
    { type: 'info', text: 'Uploading Pages pipeline content directly to GitLab CDN...' },
    { type: 'dim', text: 'Contacting deployment microservice...' },
    { type: 'success', text: '✓ Environment: GitLab Pages successfully provisioned.' },
    { type: 'success', text: '✓ URL: https://username.gitlab.io/gitlab-ci-showcase' },
    { type: 'info', text: 'Job succeeded with status code 0' }
  ]
}

const PIPELINE_YAML = `# ==========================================
# GitLab CI/CD Pipeline for React-Vite App
# ==========================================

image: node:20-alpine

cache:
  key:
    files:
      - package-lock.json
  paths:
    - .npm/
    - node_modules/

stages:
  - lint
  - test
  - build
  - deploy

before_script:
  - npm ci --cache .npm --prefer-offline

# ==========================================
# 1. Lint Stage
# ==========================================
lint-job:
  stage: lint
  script:
    - npm run lint
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH

# ==========================================
# 2. Test Stage
# ==========================================
test-job:
  stage: test
  script:
    - npm run test
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH

# ==========================================
# 3. Build Stage
# ==========================================
build-job:
  stage: build
  script:
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 week
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH

# ==========================================
# 4. Deploy Stage (GitLab Pages)
# ==========================================
pages:
  stage: deploy
  script:
    - rm -rf public
    - mv dist public
  artifacts:
    paths:
      - public
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH`

const KEYWORD_DESCRIPTIONS = {
  'image': {
    title: 'image',
    desc: 'Specifies the Docker image that the GitLab Runner uses to run the jobs. Here we use node:20-alpine to ensure a lightweight, secure, and fast environment with Node.js installed.'
  },
  'cache': {
    title: 'cache',
    desc: 'Used to store dependencies between jobs. Storing the node_modules and .npm folder saves downloading packages repeatedly, saving gigabytes of bandwith and accelerating execution speeds.'
  },
  'stages': {
    title: 'stages',
    desc: 'Defines the structural order of job executions. Jobs within the same stage run concurrently. If any job in a stage fails, the entire pipeline is stopped, and subsequent stages are skipped.'
  },
  'before_script': {
    title: 'before_script',
    desc: 'A set of commands that runs prior to the script in every single job. Ideal for setup steps, loading caches, and running package installers (like npm ci).'
  },
  'stage': {
    title: 'stage',
    desc: 'Associates a job with a specific stage defined globally. This controls the chronological order of this job relative to others.'
  },
  'script': {
    title: 'script',
    desc: 'The array of Shell commands executed by the GitLab Runner inside the Docker container. This is the absolute core action of any job.'
  },
  'artifacts': {
    title: 'artifacts',
    desc: 'Files or directories created by a job that are saved and passed to subsequent pipeline stages (like compiled static files) or made available to download in the GitLab UI.'
  },
  'rules': {
    title: 'rules',
    desc: 'Conditional checks that determine if a job should be added to the pipeline. In our case, we only trigger builds on the main branch to conserve runner execution minutes.'
  }
}

export default function App() {
  const [activeBranch, setActiveBranch] = useState('main')
  const [pipelineState, setPipelineState] = useState('idle') // idle, running, success, failed
  const [activeJob, setActiveJob] = useState('eslint-check')
  const [simulatedLogs, setSimulatedLogs] = useState([])
  const [selectedKeyword, setSelectedKeyword] = useState(null)
  
  // Pipeline nodes detailed state
  const [jobs, setJobs] = useState({
    'eslint-check': { name: 'eslint-check', stage: 'lint', status: 'idle', duration: '-' },
    'vitest-run': { name: 'vitest-run', stage: 'test', status: 'idle', duration: '-' },
    'vite-compile': { name: 'vite-compile', stage: 'build', status: 'idle', duration: '-' },
    'pages-host': { name: 'pages-host', stage: 'deploy', status: 'idle', duration: '-' }
  })

  // Logs stream ref for auto scroll
  const terminalEndRef = useRef(null)

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [simulatedLogs])

  // Initialize terminal logs on start
  useEffect(() => {
    loadJobLogs('eslint-check', 'idle')
  }, [])

  const loadJobLogs = (jobId, currentStatus) => {
    const template = JOB_LOG_TEMPLATES[jobId] || []
    if (currentStatus === 'idle') {
      setSimulatedLogs([
        { type: 'dim', text: `Job is currently idle. Click "Trigger Pipeline" to simulate a real-world GitLab Runner execution.` },
        { type: 'dim', text: `You can select other jobs to see their execution logs once the pipeline runs.` }
      ])
    } else if (currentStatus === 'pending') {
      setSimulatedLogs([
        { type: 'info', text: `Job is currently pending runner allocation...` }
      ])
    }
  }

  // Simulate pipeline run
  const handleTriggerPipeline = async () => {
    if (pipelineState === 'running') return
    
    setPipelineState('running')
    setSelectedKeyword(null)
    
    // Reset all jobs to pending
    const resetJobs = { ...jobs }
    Object.keys(resetJobs).forEach(k => {
      resetJobs[k] = { ...resetJobs[k], status: 'pending', duration: '-' }
    })
    setJobs(resetJobs)
    
    const runOrder = ['eslint-check', 'vitest-run', 'vite-compile', 'pages-host']
    
    for (let i = 0; i < runOrder.length; i++) {
      const jobId = runOrder[i]
      setActiveJob(jobId)
      
      // Update job to running
      setJobs(prev => ({
        ...prev,
        [jobId]: { ...prev[jobId], status: 'running', duration: 'running...' }
      }))

      // Stream logs
      const logs = JOB_LOG_TEMPLATES[jobId]
      setSimulatedLogs([])
      
      // Print runner startup lines
      const startupLogs = [
        { type: 'dim', text: 'Running with gitlab-runner 16.11.0 (fe390b14)' },
        { type: 'dim', text: '  on docker-auto-scale-runner-01a2b3c4, system ID: s_9f8d7c6b' },
        { type: 'info', text: 'Preparing the "docker" executor...' },
        { type: 'dim', text: 'Using Docker Executor image node:20-alpine with node ID 1...' },
        { type: 'info', text: 'Preparing environment...' },
        { type: 'dim', text: 'Running on alpine-3-19-x86_64 via host-runner...' },
        { type: 'info', text: 'Retrieving compilation cache...' },
        { type: 'success', text: 'Successfully pulled package cache from central storage!' }
      ]
      
      for (const log of startupLogs) {
        setSimulatedLogs(prev => [...prev, log])
        await new Promise(r => setTimeout(r, 120))
      }

      // Print job specific logs
      for (const log of logs) {
        setSimulatedLogs(prev => [...prev, log])
        await new Promise(r => setTimeout(r, 220))
      }

      // Complete job with success
      const randomDuration = (Math.random() * 8 + 3).toFixed(1) + 's'
      setJobs(prev => ({
        ...prev,
        [jobId]: { ...prev[jobId], status: 'success', duration: randomDuration }
      }))

      await new Promise(r => setTimeout(r, 600))
    }

    setPipelineState('success')
  }

  const handleJobSelect = (jobId) => {
    setActiveJob(jobId)
    const jobInfo = jobs[jobId]
    
    if (jobInfo.status === 'idle') {
      loadJobLogs(jobId, 'idle')
    } else if (jobInfo.status === 'success') {
      // Re-populate successful logs
      setSimulatedLogs([
        { type: 'dim', text: '--- HISTORICAL RUN LOGS ---' },
        ...JOB_LOG_TEMPLATES[jobId]
      ])
    } else if (jobInfo.status === 'running') {
      // If currently active, keep current logs stream
    } else {
      loadJobLogs(jobId, 'pending')
    }
  }

  // Parse YAML for interactiveness
  const renderInteractiveYaml = () => {
    const lines = PIPELINE_YAML.split('\n')
    return lines.map((line, idx) => {
      let isKeyword = false
      let keyText = ''
      
      // Match keywords in YAML
      const match = line.match(/^([a-z_]+):/)
      if (match && KEYWORD_DESCRIPTIONS[match[1]]) {
        isKeyword = true
        keyText = match[1]
      }

      if (isKeyword) {
        const rest = line.substring(keyText.length + 1)
        return (
          <div key={idx} className="code-line">
            <span 
              className="key" 
              style={{ cursor: 'pointer', textDecoration: 'underline dotted', fontWeight: 'bold' }}
              onClick={() => setSelectedKeyword(KEYWORD_DESCRIPTIONS[keyText])}
              title="Click to inspect keyword"
            >
              {keyText}
            </span>
            :<span className="val">{rest}</span>
          </div>
        )
      }

      // Style comments
      if (line.trim().startsWith('#')) {
        return <div key={idx} className="code-line comment">{line}</div>
      }

      return <div key={idx} className="code-line">{line}</div>
    })
  }

  return (
    <main className="app-container">
      {/* Sticky Header Section */}
      <header className="header-glass">
        <div className="brand-section">
          <svg className="brand-logo" width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M96.06 50.45L88.94 28.53a3.52 3.52 0 00-1.27-1.74 3.44 3.44 0 00-2.12-.55 3.47 3.47 0 00-2.12.72 3.5 3.5 0 00-1.12 1.83L72.23 60H27.77L17.69 28.79a3.52 3.52 0 00-1.13-1.83 3.47 3.47 0 00-2.12-.72 3.44 3.44 0 00-2.12.55 3.52 3.52 0 00-1.27 1.74L3.94 50.45a7.1 7.1 0 002.58 8L50 93.33l43.48-34.88a7.1 7.1 0 002.58-8z" fill="#E24329"/>
            <path d="M50 93.33L72.23 60H27.77L50 93.33z" fill="#FC6D26"/>
            <path d="M27.77 60H3.94a7.1 7.1 0 002.58 8L50 93.33 27.77 60z" fill="#FCA326"/>
            <path d="M72.23 60h23.83a7.1 7.1 0 00-2.58 8L50 93.33 72.23 60z" fill="#FCA326"/>
            <path d="M27.77 60L17.69 28.79a3.52 3.52 0 00-1.13-1.83l-12.62 33h23.83z" fill="#E24329"/>
            <path d="M72.23 60l10.08-31.21a3.52 3.52 0 00-1.12-1.83l-12.8 33.04h3.84z" fill="#E24329"/>
          </svg>
          <div>
            <h1 className="brand-title">GitLab Pipeline Visualizer</h1>
            <p style={{ fontSize: '10px', color: '#94a3b8', fontFamily: 'monospace' }}>project: gitlab-ci-showcase</p>
          </div>
        </div>

        <div className="header-actions">
          <div className="repo-badge">
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }}></span>
            <span>pages-active</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <GitBranch size={14} color="#a78bfa" />
            <select 
              className="branch-selector"
              value={activeBranch}
              onChange={(e) => setActiveBranch(e.target.value)}
            >
              <option value="main">main</option>
              <option value="feature/interactive-ui">feature/interactive-ui</option>
              <option value="patch/fix-tests">patch/fix-tests</option>
            </select>
          </div>
        </div>
      </header>

      {/* Metrics Section */}
      <section className="metrics-grid">
        <div className="card-glass metric-card" id="metric-success-rate">
          <div className="metric-icon-box">
            <Sparkles size={22} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Pipeline Success Rate</span>
            <span className="metric-value">98.2%</span>
          </div>
        </div>

        <div className="card-glass metric-card" id="metric-avg-duration">
          <div className="metric-icon-box">
            <Clock size={22} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Avg Build Duration</span>
            <span className="metric-value">42.8s</span>
          </div>
        </div>

        <div className="card-glass metric-card" id="metric-active-runners">
          <div className="metric-icon-box" style={{ background: 'hsla(142 70% 45% / 0.1)', color: 'hsl(142 70% 45%)', borderColor: 'hsla(142 70% 45% / 0.2)' }}>
            <Activity size={22} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Active Shared Runners</span>
            <span className="metric-value">4 / 4</span>
          </div>
        </div>

        <div className="card-glass metric-card" id="metric-deploy-target">
          <div className="metric-icon-box" style={{ background: 'hsla(25 95% 53% / 0.1)', color: 'hsl(25 95% 53%)', borderColor: 'hsla(25 95% 53% / 0.2)' }}>
            <Database size={22} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Deploy Target</span>
            <span className="metric-value" style={{ fontSize: '18px', paddingTop: '4px' }}>GitLab Pages</span>
          </div>
        </div>
      </section>

      {/* Interactive Graph & Runner logs */}
      <section className="pipeline-section">
        {/* Graph Visualizer Panel */}
        <div className="card-glass" style={{ display: 'flex', flexDirection: 'column', justifyBetween: 'stretch' }} id="pipeline-panel">
          <div>
            <div className="pipeline-header">
              <h2 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                Interactive Pipeline
                <span className={`pipeline-status-badge status-${pipelineState}`}>
                  {pipelineState}
                </span>
              </h2>

              <button 
                className="btn-primary"
                onClick={handleTriggerPipeline}
                disabled={pipelineState === 'running'}
                id="btn-trigger-pipeline"
              >
                {pipelineState === 'running' ? (
                  <>
                    <Loader2 size={16} className="job-icon running" />
                    <span>Executing Runner...</span>
                  </>
                ) : (
                  <>
                    <Play size={16} fill="white" />
                    <span>Trigger Pipeline</span>
                  </>
                )}
              </button>
            </div>

            <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '1.5rem' }}>
              Observe how jobs execute sequentially down the stages. Click on any job node to inspect live standard outputs and runner allocation states.
            </p>

            {/* Pipeline flowchart */}
            <div className="pipeline-flow">
              {pipelineState === 'running' && <div className="line-pulse"></div>}
              
              {/* Stage LINT */}
              <div className="stage-column">
                <span className="stage-title">lint</span>
                <div 
                  className={`job-node ${jobs['eslint-check'].status} ${activeJob === 'eslint-check' ? 'active-selection' : ''}`}
                  onClick={() => handleJobSelect('eslint-check')}
                >
                  {jobs['eslint-check'].status === 'running' ? (
                    <Loader2 size={16} className="job-icon running" />
                  ) : jobs['eslint-check'].status === 'success' ? (
                    <CheckCircle2 size={16} className="job-icon success" />
                  ) : (
                    <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.2)', borderRadius: '50%' }}></span>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="job-name">eslint-check</span>
                    <span style={{ fontSize: '9px', color: '#64748b' }}>duration: {jobs['eslint-check'].duration}</span>
                  </div>
                </div>
              </div>

              {/* Stage TEST */}
              <div className="stage-column">
                <span className="stage-title">test</span>
                <div 
                  className={`job-node ${jobs['vitest-run'].status} ${activeJob === 'vitest-run' ? 'active-selection' : ''}`}
                  onClick={() => handleJobSelect('vitest-run')}
                >
                  {jobs['vitest-run'].status === 'running' ? (
                    <Loader2 size={16} className="job-icon running" />
                  ) : jobs['vitest-run'].status === 'success' ? (
                    <CheckCircle2 size={16} className="job-icon success" />
                  ) : (
                    <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.2)', borderRadius: '50%' }}></span>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="job-name">vitest-run</span>
                    <span style={{ fontSize: '9px', color: '#64748b' }}>duration: {jobs['vitest-run'].duration}</span>
                  </div>
                </div>
              </div>

              {/* Stage BUILD */}
              <div className="stage-column">
                <span className="stage-title">build</span>
                <div 
                  className={`job-node ${jobs['vite-compile'].status} ${activeJob === 'vite-compile' ? 'active-selection' : ''}`}
                  onClick={() => handleJobSelect('vite-compile')}
                >
                  {jobs['vite-compile'].status === 'running' ? (
                    <Loader2 size={16} className="job-icon running" />
                  ) : jobs['vite-compile'].status === 'success' ? (
                    <CheckCircle2 size={16} className="job-icon success" />
                  ) : (
                    <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.2)', borderRadius: '50%' }}></span>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="job-name">vite-compile</span>
                    <span style={{ fontSize: '9px', color: '#64748b' }}>duration: {jobs['vite-compile'].duration}</span>
                  </div>
                </div>
              </div>

              {/* Stage DEPLOY */}
              <div className="stage-column">
                <span className="stage-title">deploy</span>
                <div 
                  className={`job-node ${jobs['pages-host'].status} ${activeJob === 'pages-host' ? 'active-selection' : ''}`}
                  onClick={() => handleJobSelect('pages-host')}
                >
                  {jobs['pages-host'].status === 'running' ? (
                    <Loader2 size={16} className="job-icon running" />
                  ) : jobs['pages-host'].status === 'success' ? (
                    <CheckCircle2 size={16} className="job-icon success" />
                  ) : (
                    <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.2)', borderRadius: '50%' }}></span>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="job-name">pages-host</span>
                    <span style={{ fontSize: '9px', color: '#64748b' }}>duration: {jobs['pages-host'].duration}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '6px' }}>
              <Cpu size={14} color="#38bdf8" />
              <span style={{ fontSize: '11px', fontFamily: 'monospace' }}>Runner OS: Linux Alpine 3.19</span>
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '6px' }}>
              <TerminalIcon size={14} color="#4ade80" />
              <span style={{ fontSize: '11px', fontFamily: 'monospace' }}>Shell: /bin/sh</span>
            </div>
          </div>
        </div>

        {/* Console Terminal logs */}
        <div className="terminal-window" id="terminal-panel">
          <div className="terminal-header">
            <div className="terminal-controls">
              <span className="dot dot-red"></span>
              <span className="dot dot-yellow"></span>
              <span className="dot dot-green"></span>
            </div>
            <div className="terminal-title">job: {activeJob}</div>
            <div style={{ width: 40 }}></div>
          </div>

          <div className="terminal-logs">
            {simulatedLogs.map((log, index) => (
              <div key={index} className={`log-line ${log.type}`}>
                {log.text}
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>
        </div>
      </section>

      {/* CI/CD Configuration Explorer */}
      <section className="card-glass" style={{ marginTop: '1rem' }} id="config-explorer-panel">
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          <FileCode2 size={20} color="#fb7185" />
          GitLab CI/CD Configuration Explorer
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '1.5rem' }}>
          Inspect the official pipeline definition that governs this repository. 
          <span style={{ color: '#fb7185', fontWeight: '600' }}> Click on any highlighted keyword </span> inside the code editor to view its clinical definition and purpose.
        </p>

        <div className="config-explorer">
          {/* Interactive Code Editor Representation */}
          <div className="code-viewer">
            {renderInteractiveYaml()}
          </div>

          {/* Interactive Card Explaining terms */}
          <div className="pipeline-guide">
            {selectedKeyword ? (
              <div className="card-glass" style={{ height: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid hsla(var(--primary)/0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
                  <span style={{ background: 'hsla(var(--primary)/0.15)', color: 'hsl(var(--primary))', padding: '4px 8px', borderRadius: '4px', fontFamily: 'monospace', fontWeight: 'bold', fontSize: '14px' }}>
                    {selectedKeyword.title}
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>CI/CD keyword</span>
                </div>
                <p style={{ color: '#cbd5e1', fontSize: '13px', lineHeight: 1.6 }}>
                  {selectedKeyword.desc}
                </p>
                <div style={{ marginTop: '2rem', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px' }}>
                  <h4 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '6px' }}>Pro Tip</h4>
                  <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.4 }}>
                    Correct usage of keywords prevents pipeline crashes and can save you hours of waiting time by configuring fast caches and precise execution rules.
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ border: '1px dashed rgba(255, 255, 255, 0.1)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '2rem', textAlign: 'center' }}>
                <BookOpen size={36} color="#475569" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '6px' }}>Interactive Inspector</h3>
                <p style={{ fontSize: '12px', color: '#64748b', maxWidth: '300px' }}>
                  Click on keywords like <strong>image</strong>, <strong>cache</strong>, or <strong>artifacts</strong> in the editor to load explanations here.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-text">
        <p>Created to showcase GitLab CI/CD integration. Configured to build, test, and deploy seamlessly.</p>
        <p style={{ marginTop: '4px', color: '#475569' }}>© 2026 GitLab Showcase Project.</p>
      </footer>
    </main>
  )
}
