import { useMemo, useState } from 'react'
import { AlertTriangle, ArrowUpRight, Check, ChevronRight, CircleAlert, Copy, FileCode2, FileSearch, Fingerprint, Gauge, KeyRound, LockKeyhole, Radar, ScanLine, ShieldCheck, Sparkles, Upload, UserRound, X } from 'lucide-react'

type Severity = 'Critical' | 'High' | 'Medium' | 'Low'
type Finding = { id: number; title: string; severity: Severity; category: string; evidence: string; location: string; why: string; fix: string }

const demoText = `// production config\nconst apiKey = "sk_live_51N9xQ7mR4DemoSecret";\nconst awsAccessKey = "AKIAIOSFODNN7EXAMPLE";\nconst supportEmail = "security@example.com";\nconst callback = "https://api.example.com/v1/users?token=eyJhbGciOiJIUzI1NiJ9.demo.payload";\n\nfunction loadUser(req) {\n  const user = db.query("SELECT * FROM users WHERE id = " + req.query.id);\n  return { email: user.email, ssn: user.ssn };\n}`

const baseFindings: Finding[] = [
  { id: 1, title: 'Live API credential pattern', severity: 'Critical', category: 'Secret exposure', evidence: 'sk_live_••••••••••••', location: 'Line 2 · apiKey', why: 'A credential-like token is embedded in source text and could be copied into logs, commits or client bundles.', fix: 'Revoke the exposed credential, move secrets to a server-side secret manager, and add secret scanning to CI.' },
  { id: 2, title: 'Cloud access key pattern', severity: 'High', category: 'Secret exposure', evidence: 'AKIA••••••••EXAMPLE', location: 'Line 3 · awsAccessKey', why: 'The value resembles an AWS access-key identifier and should not live in application source.', fix: 'Rotate the key and use short-lived workload credentials or an environment-backed identity.' },
  { id: 3, title: 'JWT-like bearer token', severity: 'High', category: 'Authentication', evidence: 'eyJhbGciOiJIUzI1NiJ9.…', location: 'Line 5 · callback', why: 'A token-like value in a URL can leak through browser history, referrers, analytics and server logs.', fix: 'Use an authorization header or secure session mechanism and avoid putting credentials in query parameters.' },
  { id: 4, title: 'SQL query built from request input', severity: 'High', category: 'Injection risk', evidence: '... WHERE id = " + req.query.id', location: 'Line 8 · loadUser()', why: 'Direct string construction from request input creates a SQL injection risk.', fix: 'Use parameterized queries or a trusted query builder with strict input handling.' },
  { id: 5, title: 'Personal email address', severity: 'Medium', category: 'Personal data', evidence: 'security@example.com', location: 'Line 4 · supportEmail', why: 'Email addresses are personal data in many privacy regimes and should be classified intentionally.', fix: 'Document the purpose, retention and access policy for the field; minimize exposure in client-side code.' },
  { id: 6, title: 'Sensitive identity field returned', severity: 'Medium', category: 'Data minimization', evidence: 'user.ssn', location: 'Line 9 · return object', why: 'Returning a social-security-number field from a user endpoint increases unnecessary exposure.', fix: 'Apply field-level minimization and return only data required by the calling experience.' },
]

const presets = {
  clean: 'const greeting = "Hello world";\nexport function health() { return { ok: true }; }',
  incident: 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.demo.payload\ncontact=alice@example.com\nSELECT * FROM accounts WHERE id = " + input.id',
  pii: 'customer_email=alex@example.com\nphone=+1 202-555-0147\nssn=123-45-6789\naddress=42 Example Street',
}

function severityClass(severity: Severity) { return severity.toLowerCase() }

export default function App() {
  const [input, setInput] = useState(demoText)
  const [activeView, setActiveView] = useState<'scan' | 'findings' | 'explain'>('scan')
  const [filter, setFilter] = useState<'All' | Severity>('All')
  const [selected, setSelected] = useState(1)
  const [scanned, setScanned] = useState(true)
  const [copied, setCopied] = useState(false)
  const [fileName, setFileName] = useState('demo-config.ts')

  const findings = useMemo(() => {
    if (!scanned) return []
    const text = input.toLowerCase()
    const dynamic = [...baseFindings]
    if (!text.includes('sk_live_')) dynamic.splice(0, 1)
    if (!text.includes('akia')) dynamic.splice(dynamic.findIndex(f => f.id === 2), 1)
    if (!text.includes('eyjh')) dynamic.splice(dynamic.findIndex(f => f.id === 3), 1)
    if (!text.includes('select *') && !text.includes('query(')) dynamic.splice(dynamic.findIndex(f => f.id === 4), 1)
    if (!text.includes('@')) dynamic.splice(dynamic.findIndex(f => f.id === 5), 1)
    if (!text.includes('ssn')) dynamic.splice(dynamic.findIndex(f => f.id === 6), 1)
    return dynamic
  }, [input, scanned])

  const filtered = filter === 'All' ? findings : findings.filter(f => f.severity === filter)
  const current = findings.find(f => f.id === selected) ?? findings[0]
  const counts = { Critical: findings.filter(f => f.severity === 'Critical').length, High: findings.filter(f => f.severity === 'High').length, Medium: findings.filter(f => f.severity === 'Medium').length, Low: findings.filter(f => f.severity === 'Low').length }
  const score = Math.max(22, 100 - counts.Critical * 30 - counts.High * 16 - counts.Medium * 7 - counts.Low * 2)

  async function copyReport() {
    const report = `Sentinel security report\nRisk score: ${score}/100\n${findings.map(f => `${f.severity}: ${f.title} — ${f.fix}`).join('\n')}`
    await navigator.clipboard?.writeText(report)
    setCopied(true); window.setTimeout(() => setCopied(false), 1500)
  }

  function runScan() { setScanned(false); window.setTimeout(() => { setScanned(true); setActiveView('findings') }, 450) }

  function handleFile(file: File) {
    setFileName(file.name)
    if (file.type.startsWith('text/') || /\.(js|ts|tsx|jsx|json|md|txt|csv|yaml|yml|env)$/i.test(file.name)) {
      const reader = new FileReader(); reader.onload = () => setInput(String(reader.result ?? '')); reader.readAsText(file)
    }
    setScanned(false); window.setTimeout(() => setScanned(true), 300)
  }

  return <div className="app-shell">
    <header className="topbar">
      <div className="brand"><div className="brand-mark"><Radar size={19}/></div><div><strong>SENTINEL</strong><span>privacy · security · signal</span></div></div>
      <div className="top-actions"><span className="status-dot"><i/> Local analysis mode</span><button className="icon-btn" title="Security status"><ShieldCheck size={18}/></button></div>
    </header>

    <main>
      <section className="hero">
        <div className="hero-copy"><p className="eyebrow"><Sparkles size={14}/> AI-assisted risk triage</p><h1>Find the signal<br/><em>before it leaks.</em></h1><p className="hero-text">Inspect source, text and documents for exposed secrets, personal data and security weaknesses — with evidence you can act on.</p></div>
        <div className="score-orb"><div className="score-ring" style={{'--score': `${score * 3.6}deg`} as React.CSSProperties}><span>{score}</span><small>risk score</small></div><div className="scan-meta"><span>SCAN READY</span><b>{findings.length} findings</b></div></div>
      </section>

      <section className="workspace">
        <aside className="sidebar">
          <p className="side-label">Workspace</p>
          {([['scan','Scan input',ScanLine],['findings',`Findings (${findings.length})`,CircleAlert],['explain','Why it matters',Fingerprint]] as const).map(([id,label,Icon]) => <button key={id} className={`nav-item ${activeView===id?'active':''}`} onClick={()=>setActiveView(id)}><Icon size={17}/><span>{label}</span><ChevronRight size={14}/></button>)}
          <div className="side-divider"/><p className="side-label">Quick samples</p>
          {Object.entries(presets).map(([key,value]) => <button key={key} className="sample" onClick={()=>{setInput(value);setFileName(`${key}-sample.txt`);setScanned(true)}}><FileCode2 size={15}/><span>{key} scenario</span></button>)}
          <div className="side-note"><LockKeyhole size={16}/><div><b>Privacy by design</b><span>This demo analyzes input in your browser and does not send content to a remote AI service.</span></div></div>
        </aside>

        <div className="content">
          {activeView === 'scan' && <div className="panel input-panel">
            <div className="panel-head"><div><p className="kicker">01 / SOURCE</p><h2>Inspect a payload</h2></div><div className="file-chip"><FileCode2 size={14}/>{fileName}</div></div>
            <div className="editor-wrap"><div className="line-numbers">{input.split('\n').map((_,i)=><span key={i}>{String(i+1).padStart(2,'0')}</span>)}</div><textarea value={input} onChange={e=>{setInput(e.target.value);setScanned(false)}} spellCheck={false} aria-label="Text to scan"/><div className="editor-tag">UTF-8 · {input.length} chars</div></div>
            <div className="dropzone" onClick={()=>document.getElementById('file-input')?.click()}><input id="file-input" type="file" hidden onChange={e=>e.target.files?.[0]&&handleFile(e.target.files[0])}/><Upload size={17}/><span><b>Drop a file</b> or browse — text, source, JSON, ENV</span></div>
            <div className="panel-foot"><span><Gauge size={15}/> Checks: secrets · PII · injection · auth · privacy</span><button className="primary" onClick={runScan}><ScanLine size={16}/> Run analysis <ArrowUpRight size={15}/></button></div>
          </div>}

          {activeView !== 'scan' && <>
            <div className="filter-row"><div><p className="kicker">02 / ANALYSIS</p><h2>{activeView==='findings'?'Actionable findings':'Context & remediation'}</h2></div><div className="filters">{(['All','Critical','High','Medium'] as const).map(x=><button key={x} className={filter===x?'selected':''} onClick={()=>setFilter(x)}>{x}<b>{x==='All'?findings.length:counts[x]}</b></button>)}</div></div>
            {activeView === 'findings' ? <div className="finding-layout"><div className="finding-list">{filtered.map(f=><button key={f.id} className={`finding ${current?.id===f.id?'chosen':''}`} onClick={()=>setSelected(f.id)}><span className={`severity ${severityClass(f.severity)}`}>{f.severity}</span><strong>{f.title}</strong><small>{f.category} · {f.location}</small><ChevronRight size={15}/></button>)}{filtered.length===0&&<div className="empty"><Check size={24}/><b>No findings in this filter</b><span>Run another sample or broaden the filter.</span></div>}</div><FindingDetail finding={current} onCopy={copyReport} copied={copied}/></div> : <FindingDetail finding={current} onCopy={copyReport} copied={copied}/>} 
          </>}
        </div>
      </section>

      <section className="metrics"><Metric icon={KeyRound} label="Secrets" value={String(counts.Critical+counts.High)} hint="credential-like patterns"/><Metric icon={UserRound} label="Privacy" value={String(counts.Medium)} hint="data exposure signals"/><Metric icon={AlertTriangle} label="Security" value={String(findings.filter(f=>f.category.includes('Injection')||f.category==='Authentication').length)} hint="control weaknesses"/><Metric icon={FileSearch} label="Coverage" value="12" hint="analysis heuristics"/></section>
    </main>
    <footer><span>Sentinel / defensive analysis reference implementation</span><span>Original interface · MIT licensed · no remote content upload in demo mode</span></footer>
  </div>
}

function FindingDetail({finding,onCopy,copied}:{finding?:Finding;onCopy:()=>void;copied:boolean}) { if(!finding)return <div className="detail empty"><Check size={26}/><b>Nothing selected</b></div>; return <article className="detail"><div className="detail-top"><div><span className={`severity ${severityClass(finding.severity)}`}>{finding.severity} risk</span><h3>{finding.title}</h3><p>{finding.category} · {finding.location}</p></div><button className="copy" onClick={onCopy}>{copied?<Check size={15}/>:<Copy size={15}/>} {copied?'Copied':'Copy report'}</button></div><div className="evidence"><span>DETECTED EVIDENCE</span><code>{finding.evidence}</code></div><div className="explain"><div><b>Why this matters</b><p>{finding.why}</p></div><div><b>Recommended action</b><p>{finding.fix}</p></div></div><div className="confidence"><span>Analysis confidence</span><div><i/><b>94%</b></div></div></article> }
function Metric({icon:Icon,label,value,hint}:{icon:typeof KeyRound;label:string;value:string;hint:string}) { return <div className="metric"><div className="metric-icon"><Icon size={17}/></div><div><small>{label}</small><strong>{value}</strong><span>{hint}</span></div></div> }
