import { useMemo, useState } from 'react'
import {
  BriefcaseBusiness, CalendarDays, Check, ChevronDown, CircleDollarSign,
  Clock3, LayoutDashboard, ListChecks, MapPin, Menu, Plus, Search,
  TrendingUp, X,
} from 'lucide-react'
import {
  Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from 'recharts'

const STORAGE_KEY = 'internship-tracker-applications-v1'
const STATUSES = ['Interested', 'Preparing', 'Applied', 'Interviewing', 'Offer', 'Rejected']
const INDUSTRIES = ['Investment Banking', 'Finance', 'Wealth Management', 'Consulting', 'Business Analytics']
const statusColors = {
  Interested: '#8793a7', Preparing: '#d89b2b', Applied: '#416bd2',
  Interviewing: '#8b5bd6', Offer: '#229777', Rejected: '#d45e67',
}
const sampleApplications = [
  { id: 'a1', company: 'Goldman Sachs', position: '2027 Summer Analyst', industry: 'Investment Banking', location: 'New York, NY', season: 'Summer 2027', deadline: '2026-12-15', appliedDate: '', status: 'Preparing', pay: '$110,000 / year', link: 'https://www.goldmansachs.com/careers', notes: 'Explore the investment banking division and prepare a concise why-GS answer.' },
  { id: 'a2', company: 'J.P. Morgan', position: 'Wealth Management Summer Analyst', industry: 'Wealth Management', location: 'New York, NY', season: 'Summer 2027', deadline: '2026-12-02', appliedDate: '2026-10-28', status: 'Applied', pay: '$38 / hour', link: 'https://careers.jpmorgan.com', notes: 'Submitted online; ask alum about the private bank team.' },
  { id: 'a3', company: 'Deloitte', position: 'Discovery Intern — Strategy', industry: 'Consulting', location: 'New York, NY', season: 'Summer 2027', deadline: '2026-11-20', appliedDate: '2026-11-04', status: 'Interviewing', pay: '$36 / hour', link: 'https://jobs.deloitte.com', notes: 'First-round case interview scheduled. Practice market sizing.' },
  { id: 'a4', company: 'BlackRock', position: '2027 Summer Internship Program', industry: 'Finance', location: 'New York, NY', season: 'Summer 2027', deadline: '2026-11-30', appliedDate: '2026-11-02', status: 'Applied', pay: '$40 / hour', link: 'https://careers.blackrock.com', notes: 'Focus on the Aladdin platform and investment stewardship.' },
  { id: 'a5', company: 'Evercore', position: 'Investment Banking Summer Analyst', industry: 'Investment Banking', location: 'New York, NY', season: 'Summer 2027', deadline: '2026-11-10', appliedDate: '', status: 'Interested', pay: 'Not listed', link: 'https://www.evercore.com/careers/', notes: 'Check the careers page for application updates.' },
  { id: 'a6', company: 'Lazard', position: 'Summer Analyst — Financial Advisory', industry: 'Investment Banking', location: 'New York, NY', season: 'Summer 2027', deadline: '2026-12-10', appliedDate: '2026-10-30', status: 'Offer', pay: '$42 / hour', link: 'https://www.lazard.com/careers/', notes: 'Fictional example offer — keep track of decision timeline.' },
  { id: 'a7', company: 'Apex Advisory', position: 'Business Analytics Intern', industry: 'Business Analytics', location: 'New Orleans, LA', season: 'Spring 2027', deadline: '2026-10-25', appliedDate: '2026-10-17', status: 'Rejected', pay: '$28 / hour', link: '', notes: 'Fictional example company.' },
]

function loadApplications() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : sampleApplications
  } catch {
    return sampleApplications
  }
}

function dateAtLocalMidnight(value) {
  if (!value) return null
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function daysUntil(value) {
  const deadline = dateAtLocalMidnight(value)
  if (!deadline) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((deadline - today) / 86400000)
}

function formatDate(value, options = { month: 'short', day: 'numeric' }) {
  const date = dateAtLocalMidnight(value)
  return date ? date.toLocaleDateString('en-US', options) : 'Not set'
}

function getDeadlineLabel(app) {
  const remaining = daysUntil(app.deadline)
  if (remaining === null) return 'No deadline'
  if (remaining < 0) return `${Math.abs(remaining)}d overdue`
  if (remaining === 0) return 'Due today'
  if (remaining === 1) return '1 day left'
  return `${remaining} days left`
}

function StatCard({ title, value, detail, icon: Icon, tone = 'blue' }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${tone}`}><Icon size={19} strokeWidth={2} /></div>
      <p className="stat-title">{title}</p>
      <div className="stat-value-row"><strong>{value}</strong><span>{detail}</span></div>
    </article>
  )
}

function StatusBadge({ status }) {
  return <span className="status-badge" style={{ '--status-color': statusColors[status] }}>{status}</span>
}

function ApplicationForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || {
    company: '', position: '', industry: INDUSTRIES[0], location: '', season: 'Summer 2027',
    deadline: '', appliedDate: '', status: 'Interested', pay: '', link: '', notes: '',
  })
  const [error, setError] = useState('')
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  const submit = (event) => {
    event.preventDefault()
    if (!form.company.trim() || !form.position.trim()) {
      setError('Add a company and internship position to continue.')
      return
    }
    onSave({ ...form, company: form.company.trim(), position: form.position.trim() })
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="application-modal" role="dialog" aria-modal="true" aria-labelledby="form-title">
        <div className="modal-heading">
          <div><p className="eyebrow">APPLICATION DETAILS</p><h2 id="form-title">{initial ? 'Edit opportunity' : 'Add opportunity'}</h2></div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close form"><X size={20} /></button>
        </div>
        <form onSubmit={submit}>
          <div className="form-grid">
            <label>Company name *<input autoFocus name="company" value={form.company} onChange={update} placeholder="e.g. Goldman Sachs" /></label>
            <label>Position *<input name="position" value={form.position} onChange={update} placeholder="e.g. Summer Analyst" /></label>
            <label>Industry<select name="industry" value={form.industry} onChange={update}>{INDUSTRIES.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label>Location<input name="location" value={form.location} onChange={update} placeholder="New York, NY" /></label>
            <label>Season and year<input name="season" value={form.season} onChange={update} placeholder="Summer 2027" /></label>
            <label>Status<select name="status" value={form.status} onChange={update}>{STATUSES.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label>Application deadline<input type="date" name="deadline" value={form.deadline} onChange={update} /></label>
            <label>Date applied<input type="date" name="appliedDate" value={form.appliedDate} onChange={update} /></label>
            <label>Salary / hourly pay<input name="pay" value={form.pay} onChange={update} placeholder="$35 / hour" /></label>
            <label>Application link<input type="url" name="link" value={form.link} onChange={update} placeholder="https://..." /></label>
            <label className="full-width">Notes<textarea name="notes" rows="3" value={form.notes} onChange={update} placeholder="Follow-ups, recruiter conversations, or preparation notes" /></label>
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="modal-actions"><button className="button secondary-button" type="button" onClick={onClose}>Cancel</button><button className="button primary-button" type="submit">{initial ? 'Save changes' : 'Add opportunity'}</button></div>
        </form>
      </section>
    </div>
  )
}

function App() {
  const [applications, setApplications] = useState(loadApplications)
  const [activePage, setActivePage] = useState('Dashboard')
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const [industryFilter, setIndustryFilter] = useState('All industries')
  const [sortBy, setSortBy] = useState('deadline')
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const saveApplications = (next) => {
    setApplications(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }
  const submittedCount = applications.filter((app) => !['Interested', 'Preparing'].includes(app.status)).length
  const activeCount = applications.filter((app) => ['Preparing', 'Applied', 'Interviewing'].includes(app.status)).length
  const interviewCount = applications.filter((app) => app.status === 'Interviewing').length
  const offerCount = applications.filter((app) => app.status === 'Offer').length
  const successRate = submittedCount ? Math.round((offerCount / submittedCount) * 100) : 0

  const deadlines = useMemo(() => applications
    .filter((app) => app.deadline && !['Offer', 'Rejected'].includes(app.status))
    .sort((a, b) => a.deadline.localeCompare(b.deadline)), [applications])

  const filteredApplications = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return applications.filter((app) => {
      const matchesQuery = !needle || [app.company, app.position, app.location, app.industry].some((value) => value.toLowerCase().includes(needle))
      const matchesStatus = statusFilter === 'All statuses' || app.status === statusFilter
      const matchesIndustry = industryFilter === 'All industries' || app.industry === industryFilter
      return matchesQuery && matchesStatus && matchesIndustry
    }).sort((a, b) => {
      if (sortBy === 'company') return a.company.localeCompare(b.company)
      if (sortBy === 'status') return a.status.localeCompare(b.status)
      return (a.deadline || '9999-12-31').localeCompare(b.deadline || '9999-12-31')
    })
  }, [applications, query, statusFilter, industryFilter, sortBy])

  const statusChart = STATUSES.map((status) => ({ name: status, value: applications.filter((app) => app.status === status).length })).filter((item) => item.value > 0)
  const activityChart = useMemo(() => {
    const months = []
    for (let offset = 5; offset >= 0; offset -= 1) {
      const date = new Date()
      date.setDate(1)
      date.setMonth(date.getMonth() - offset)
      const year = date.getFullYear()
      const month = date.getMonth()
      months.push({ month: date.toLocaleDateString('en-US', { month: 'short' }), count: applications.filter((app) => {
        const applied = dateAtLocalMidnight(app.appliedDate)
        return applied && applied.getFullYear() === year && applied.getMonth() === month
      }).length })
    }
    return months
  }, [applications])

  const saveForm = (form) => {
    if (editing) {
      saveApplications(applications.map((app) => app.id === editing.id ? { ...form, id: editing.id } : app))
    } else {
      saveApplications([{ ...form, id: crypto.randomUUID() }, ...applications])
    }
    setShowForm(false)
    setEditing(null)
  }
  const editApplication = (app) => { setEditing(app); setShowForm(true) }
  const deleteApplication = (app) => {
    if (window.confirm(`Delete the ${app.company} opportunity? This cannot be undone.`)) {
      saveApplications(applications.filter((item) => item.id !== app.id))
    }
  }
  const openNewForm = () => { setEditing(null); setShowForm(true) }
  const navigate = (page) => { setActivePage(page); setMobileNavOpen(false) }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNavOpen ? 'sidebar-open' : ''}`}>
        <div className="brand"><div className="brand-mark"><BriefcaseBusiness size={19} /></div><div><strong>Pathway</strong><span>CAREER TRACKER</span></div><button className="mobile-close icon-button" onClick={() => setMobileNavOpen(false)} aria-label="Close menu"><X size={18} /></button></div>
        <div className="sidebar-label">WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {[['Dashboard', LayoutDashboard], ['Applications', ListChecks], ['Deadlines', CalendarDays]].map(([label, Icon]) => (
            <button key={label} className={`nav-item ${activePage === label ? 'nav-active' : ''}`} onClick={() => navigate(label)}><Icon size={18} /><span>{label}</span>{label === 'Applications' && <span className="nav-count">{applications.length}</span>}</button>
          ))}
        </nav>
        <div className="sidebar-bottom"><div className="student-card"><div className="avatar">ET</div><div><strong>My internship search</strong><span>Tulane University</span></div><ChevronDown size={15} /></div><p>PERSONAL WORKSPACE</p></div>
      </aside>
      {mobileNavOpen && <button className="nav-scrim" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} />}

      <main className="main-area">
        <header className="topbar"><button className="mobile-menu icon-button" onClick={() => setMobileNavOpen(true)} aria-label="Open menu"><Menu size={21} /></button><div className="breadcrumb">Workspace <span>/</span> <strong>{activePage}</strong></div><div className="topbar-right"><span className="today-label"><CalendarDays size={15} />{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span><div className="profile-avatar">E</div></div></header>

        <div className="page-content">
          <div className="page-heading"><div><p className="eyebrow">YOUR CAREER, IN FOCUS</p><h1>{activePage === 'Dashboard' ? 'Internship dashboard' : activePage === 'Applications' ? 'Applications' : 'Deadline calendar'}</h1><p className="heading-subtitle">{activePage === 'Dashboard' ? 'A clear view of your internship search and next steps.' : activePage === 'Applications' ? 'Track every opportunity from first look to final decision.' : 'Stay ahead of upcoming application deadlines.'}</p></div><button className="button primary-button add-button" onClick={openNewForm}><Plus size={17} /> Add opportunity</button></div>

          {activePage === 'Dashboard' ? <>
            <section className="stats-grid" aria-label="Application summary">
              <StatCard title="Opportunities saved" value={applications.length} detail="Total tracked" icon={BriefcaseBusiness} tone="blue" />
              <StatCard title="Applications submitted" value={submittedCount} detail="Across all roles" icon={ListChecks} tone="violet" />
              <StatCard title="In progress" value={activeCount} detail="Preparing to interview" icon={Clock3} tone="amber" />
              <StatCard title="Interviews scheduled" value={interviewCount} detail="Keep up the momentum" icon={CalendarDays} tone="green" />
              <StatCard title="Offers received" value={offerCount} detail="A great milestone" icon={CircleDollarSign} tone="green" />
              <StatCard title="Offer rate" value={`${successRate}%`} detail="Offers / submitted" icon={TrendingUp} tone="blue" />
            </section>

            <section className="dashboard-grid">
              <article className="panel chart-panel"><div className="panel-heading"><div><h2>Application activity</h2><p>Submissions over the last six months</p></div><span className="chart-legend"><i /> Applications</span></div><div className="activity-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={activityChart} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}><defs><linearGradient id="activityFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#416bd2" stopOpacity={0.2} /><stop offset="95%" stopColor="#416bd2" stopOpacity={0.01} /></linearGradient></defs><CartesianGrid stroke="#edf0f5" vertical={false} /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#8a94a5', fontSize: 12 }} dy={10} /><YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#8a94a5', fontSize: 12 }} /><Tooltip contentStyle={{ border: '1px solid #e8ebf1', borderRadius: 10, fontSize: 12 }} /><Area type="monotone" dataKey="count" name="Applications" stroke="#416bd2" strokeWidth={2.5} fill="url(#activityFill)" activeDot={{ r: 5 }} /></AreaChart></ResponsiveContainer></div></article>
              <article className="panel status-panel"><div className="panel-heading"><div><h2>Applications by status</h2><p>Pipeline at a glance</p></div></div><div className="status-chart-wrap"><div className="status-chart"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={statusChart.length ? statusChart : [{ name: 'No applications', value: 1 }]} dataKey="value" nameKey="name" innerRadius={57} outerRadius={78} paddingAngle={3} stroke="none">{(statusChart.length ? statusChart : [{ name: 'No applications', value: 1 }]).map((entry) => <Cell key={entry.name} fill={statusColors[entry.name] || '#e5e9f0'} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer><div className="donut-total"><strong>{applications.length}</strong><span>Total roles</span></div></div><div className="status-legend">{STATUSES.map((status) => <div key={status}><span><i style={{ backgroundColor: statusColors[status] }} />{status}</span><strong>{applications.filter((app) => app.status === status).length}</strong></div>)}</div></div></article>
            </section>

            <section className="panel deadlines-panel"><div className="panel-heading"><div><h2>Upcoming deadlines</h2><p>Your next application dates, all in one place</p></div><button className="text-button" onClick={() => navigate('Deadlines')}>View all <span>→</span></button></div>
              {deadlines.length ? <div className="deadline-list">{deadlines.slice(0, 4).map((app) => { const remaining = daysUntil(app.deadline); const urgent = remaining !== null && remaining <= 7; return <div className="deadline-row" key={app.id}><div className={`deadline-date ${urgent ? 'deadline-urgent' : ''}`}><strong>{dateAtLocalMidnight(app.deadline).getDate()}</strong><span>{dateAtLocalMidnight(app.deadline).toLocaleDateString('en-US', { month: 'short' })}</span></div><div className="deadline-info"><strong>{app.company}</strong><span>{app.position}</span></div><StatusBadge status={app.status} /><span className={`days-left ${urgent ? 'urgent-text' : ''}`}>{getDeadlineLabel(app)}</span></div> })}</div> : <div className="empty-state">No active deadlines yet. Add an opportunity to start planning.</div>}
            </section>
          </> : activePage === 'Applications' ? <>
            <section className="table-toolbar panel"><div className="search-box"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search companies, roles, locations..." aria-label="Search applications" />{query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={15} /></button>}</div><div className="filter-controls"><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter by status"><option>All statuses</option>{STATUSES.map((status) => <option key={status}>{status}</option>)}</select><select value={industryFilter} onChange={(event) => setIndustryFilter(event.target.value)} aria-label="Filter by industry"><option>All industries</option>{INDUSTRIES.map((industry) => <option key={industry}>{industry}</option>)}</select><select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort applications"><option value="deadline">Sort: deadline</option><option value="company">Sort: company</option><option value="status">Sort: status</option></select></div></section>
            <section className="panel applications-panel"><div className="table-summary"><div><h2>All opportunities</h2><p>{filteredApplications.length} of {applications.length} opportunities</p></div><button className="button primary-button small-add" onClick={openNewForm}><Plus size={16} /> Add</button></div>
              <div className="table-scroll"><table><thead><tr><th>COMPANY &amp; ROLE</th><th>INDUSTRY</th><th>LOCATION</th><th>DEADLINE</th><th>STATUS</th><th>PAY</th><th aria-label="Actions" /></tr></thead><tbody>{filteredApplications.map((app) => { const remaining = daysUntil(app.deadline); return <tr key={app.id}><td><div className="company-cell"><span className="company-logo">{app.company.slice(0, 1)}</span><div><strong>{app.company}</strong><span>{app.position}</span></div></div></td><td><span className="industry-pill">{app.industry}</span></td><td><span className="location-cell"><MapPin size={13} />{app.location || '—'}</span></td><td><div className={`table-deadline ${remaining !== null && remaining <= 7 ? 'urgent-text' : ''}`}>{formatDate(app.deadline)}<small>{app.deadline ? getDeadlineLabel(app) : 'No deadline'}</small></div></td><td><StatusBadge status={app.status} /></td><td className="pay-cell">{app.pay || '—'}</td><td><div className="row-actions"><button onClick={() => editApplication(app)} aria-label={`Edit ${app.company}`} title="Edit">Edit</button><button onClick={() => deleteApplication(app)} aria-label={`Delete ${app.company}`} title="Delete">Delete</button></div></td></tr> })}</tbody></table></div>
              {filteredApplications.length === 0 && <div className="empty-state">No opportunities match these filters. Try another search or add an opportunity.</div>}
            </section>
            <p className="storage-note"><Check size={14} /> Your changes are saved automatically in this browser.</p>
          </> : <section className="panel calendar-panel"><div className="panel-heading"><div><h2>Deadline timeline</h2><p>Active applications sorted by deadline</p></div><span className="timeline-caption"><span className="urgent-dot" /> Due within 7 days</span></div>{deadlines.length ? <div className="full-deadline-list">{deadlines.map((app) => { const remaining = daysUntil(app.deadline); const urgent = remaining !== null && remaining <= 7; return <div className="full-deadline-row" key={app.id}><div className={`calendar-date ${urgent ? 'calendar-date-urgent' : ''}`}><CalendarDays size={17} /><span>{formatDate(app.deadline, { month: 'long', day: 'numeric', year: 'numeric' })}</span></div><div className="deadline-info"><strong>{app.company}</strong><span>{app.position} · {app.location || 'Location not set'}</span></div><StatusBadge status={app.status} /><span className={`days-left ${urgent ? 'urgent-text' : ''}`}>{getDeadlineLabel(app)}</span><button className="subtle-edit" onClick={() => editApplication(app)}>Edit</button></div> })}</div> : <div className="empty-state">No active deadlines. Add a deadline to an opportunity to see it here.</div>}</section>}
          <footer className="page-footer">Pathway · Internship search workspace <span>Data stays in your browser</span></footer>
        </div>
      </main>
      {showForm && <ApplicationForm initial={editing} onSave={saveForm} onClose={() => { setShowForm(false); setEditing(null) }} />}
    </div>
  )
}

export default App
