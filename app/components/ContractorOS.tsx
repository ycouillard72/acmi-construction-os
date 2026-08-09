"use client";

import { useMemo, useState } from "react";
import {
  activities,
  companies,
  contacts,
  costSnapshot,
  dashboardMetrics,
  documents,
  estimates,
  money,
  partners,
  pipeline,
  projects,
  properties,
  recentActivity,
  weekSchedule,
  type Tone,
} from "../../lib/demo-data";

type ModuleId =
  | "dashboard"
  | "crm"
  | "pipeline"
  | "properties"
  | "estimates"
  | "projects"
  | "partners"
  | "documents"
  | "activities";

type Role = "Administrator" | "Project Manager" | "Estimator" | "Field Crew" | "Accounting" | "Read Only";

const navigation: Array<{ id: ModuleId; label: string; short: string; group: "workspace" | "operations" }> = [
  { id: "dashboard", label: "Overview", short: "OV", group: "workspace" },
  { id: "crm", label: "Contacts + companies", short: "CM", group: "workspace" },
  { id: "pipeline", label: "Leads + pipeline", short: "PL", group: "workspace" },
  { id: "properties", label: "Properties", short: "PR", group: "workspace" },
  { id: "estimates", label: "Estimates", short: "ES", group: "operations" },
  { id: "projects", label: "Projects + jobs", short: "JB", group: "operations" },
  { id: "partners", label: "Trade partners", short: "TP", group: "operations" },
  { id: "documents", label: "Documents", short: "DC", group: "operations" },
  { id: "activities", label: "Tasks + activities", short: "TK", group: "operations" },
];

const moduleCopy: Record<ModuleId, { title: string; kicker: string; action: string }> = {
  dashboard: { title: "Operating overview", kicker: "Saturday, August 8 · Central Florida", action: "Quick create" },
  crm: { title: "Contacts + companies", kicker: "People, clients, partners, and referral relationships", action: "New contact" },
  pipeline: { title: "Leads + opportunities", kicker: "A clear path from first inquiry to signed work", action: "New opportunity" },
  properties: { title: "Properties", kicker: "One property record across sales, estimating, and production", action: "New property" },
  estimates: { title: "Estimates", kicker: "Pricing, scope, margin, and proposal status", action: "New estimate" },
  projects: { title: "Projects + jobs", kicker: "Production stage, financial health, and next milestone", action: "New project" },
  partners: { title: "Trade partners", kicker: "Subcontractors, vendors, compliance, and performance", action: "New partner" },
  documents: { title: "Document register", kicker: "Metadata now, Microsoft 365-backed files next", action: "Register document" },
  activities: { title: "Tasks + activities", kicker: "Follow-ups, field actions, and accountability", action: "New task" },
};

const toneForStatus = (status: string): Tone => {
  const normalized = status.toLowerCase();
  if (normalized.includes("approved") || normalized.includes("active") || normalized.includes("complete")) return "green";
  if (normalized.includes("expir") || normalized.includes("follow") || normalized.includes("review soon")) return "amber";
  if (normalized.includes("draft") || normalized.includes("waiting")) return "slate";
  if (normalized.includes("sent") || normalized.includes("progress") || normalized.includes("qualified")) return "blue";
  return "purple";
};

function Status({ children, tone }: { children: React.ReactNode; tone?: Tone }) {
  return <span className={`status status-${tone ?? toneForStatus(String(children))}`}><i />{children}</span>;
}

function Avatar({ initials, tone = "slate" }: { initials: string; tone?: Tone }) {
  return <span className={`avatar avatar-${tone}`}>{initials}</span>;
}

function EmptySearch({ query }: { query: string }) {
  return <div className="empty-search">No records match “{query}”. Try a broader search.</div>;
}

export default function ContractorOS() {
  const [activeModule, setActiveModule] = useState<ModuleId>("dashboard");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<Role>("Administrator");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [projectFilter, setProjectFilter] = useState("All jobs");
  const copy = moduleCopy[activeModule];
  const query = search.trim().toLowerCase();
  const canCreate = role !== "Read Only" && role !== "Field Crew";

  const setModule = (id: ModuleId) => {
    setActiveModule(id);
    setSearch("");
    setMobileOpen(false);
  };

  const saveDraft = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const recordName = String(form.get("recordName") || "New record");
    setCreateOpen(false);
    setToast(`${recordName} was created as a local MVP draft.`);
    window.setTimeout(() => setToast(null), 3800);
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const typeMatch = projectFilter === "All jobs" || project.type.toLowerCase().includes(projectFilter.toLowerCase());
      const queryMatch = !query || `${project.id} ${project.name} ${project.location} ${project.type} ${project.stage}`.toLowerCase().includes(query);
      return typeMatch && queryMatch;
    });
  }, [projectFilter, query]);

  const renderSidebar = () => (
    <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
      <div className="brand-block">
        <div className="brand-mark"><span>A</span></div>
        <div>
          <strong>ACMI</strong>
          <span>Construction OS</span>
        </div>
        <button type="button" className="sidebar-close" onClick={() => setMobileOpen(false)} aria-label="Close navigation">×</button>
      </div>

      <div className="tenant-chip">
        <Avatar initials="AC" tone="green" />
        <div><strong>ACMI Construction</strong><span>Central Florida</span></div>
        <span className="tenant-chevron">⌄</span>
      </div>

      {(["workspace", "operations"] as const).map((group) => (
        <nav className="nav-group" aria-label={group} key={group}>
          <p>{group === "workspace" ? "Workspace" : "Operations"}</p>
          {navigation.filter((item) => item.group === group).map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => setModule(item.id)}
              className={activeModule === item.id ? "nav-active" : ""}
              aria-current={activeModule === item.id ? "page" : undefined}
            >
              <span className="nav-icon">{item.short}</span>
              <span>{item.label}</span>
              {item.id === "activities" && <b>6</b>}
            </button>
          ))}
        </nav>
      ))}

      <div className="sidebar-bottom">
        <div className="integration-pulse"><i /><div><strong>Integration-ready</strong><span>Microsoft 365 · Email · AI</span></div></div>
        <div className="user-row">
          <Avatar initials="YC" tone="amber" />
          <div><strong>Yannick Couillard</strong><span>{role}</span></div>
          <span>•••</span>
        </div>
      </div>
    </aside>
  );

  const renderDashboard = () => (
    <div className="dashboard-view">
      <section className="welcome-panel">
        <div className="welcome-copy">
          <span className="eyebrow eyebrow-light"><i />Operating pulse</span>
          <h2>Good morning, Yannick.</h2>
          <p>ACMI has 8 active jobs, 3 field milestones, and $1.24M moving through the sales pipeline.</p>
          <div className="welcome-actions">
            <button type="button" className="button button-light" onClick={() => setModule("projects")}>View active jobs</button>
            <button type="button" className="text-button light" onClick={() => setModule("pipeline")}>Open sales pipeline <span>→</span></button>
          </div>
        </div>
        <div className="field-pulse">
          <div className="field-pulse-head"><span>FIELD STATUS</span><b>LIVE</b></div>
          <div className="field-ring"><div><strong>12</strong><span>touchpoints<br />today</span></div></div>
          <div className="field-pulse-foot"><span><i className="dot green" />3 inspections</span><span><i className="dot amber" />2 deliveries</span></div>
        </div>
      </section>

      <section className="metric-grid">
        {dashboardMetrics.map((metric) => (
          <article className="metric-card" key={metric.label}>
            <div className="metric-top"><span>{metric.label}</span><i className={`metric-mark mark-${metric.tone}`} /></div>
            <strong>{metric.value}</strong>
            <p className={`metric-delta delta-${metric.tone}`}>{metric.delta}</p>
            <small>{metric.detail}</small>
          </article>
        ))}
      </section>

      <section className="content-grid content-grid-wide">
        <article className="panel active-jobs-panel">
          <div className="panel-heading">
            <div><span className="eyebrow">Production</span><h3>Active jobs</h3></div>
            <button type="button" className="text-button" onClick={() => setModule("projects")}>View all <span>→</span></button>
          </div>
          <div className="job-list">
            {projects.slice(0, 4).map((project) => (
              <button type="button" className="job-row" key={project.id} onClick={() => setModule("projects")}>
                <span className={`job-badge job-${project.tone}`}>{project.type.includes("Roof") || project.type.includes("roof") ? "RF" : "GC"}</span>
                <span className="job-title"><strong>{project.name}</strong><small>{project.id} · {project.location}</small></span>
                <span className="job-stage"><Status tone={project.tone}>{project.stage}</Status><small>{project.nextMilestone}</small></span>
                <span className="job-progress"><b>{project.progress}%</b><i><em style={{ width: `${project.progress}%` }} /></i></span>
                <span className="job-margin"><strong>{project.margin}%</strong><small>forecast margin</small></span>
                <span className="row-arrow">›</span>
              </button>
            ))}
          </div>
        </article>

        <article className="panel cost-panel">
          <div className="panel-heading"><div><span className="eyebrow">Financial pulse</span><h3>Cost control</h3></div><button type="button" className="icon-button" aria-label="Cost control options">•••</button></div>
          <div className="cost-total"><div><span>Committed this month</span><strong>$328,420</strong></div><Status tone="green">Within plan</Status></div>
          <div className="bar-chart" aria-label="Committed costs from March through August">
            {costSnapshot.map((item, index) => <div className="bar-column" key={item.month}><i style={{ height: `${item.value}%` }} className={index === costSnapshot.length - 1 ? "bar-active" : ""} /><span>{item.month}</span></div>)}
          </div>
          <div className="cost-breakdown"><span><i className="legend legend-dark" />Committed <b>$328K</b></span><span><i className="legend legend-light" />Forecast <b>$346K</b></span></div>
        </article>
      </section>

      <section className="content-grid content-grid-thirds">
        <article className="panel pipeline-panel">
          <div className="panel-heading"><div><span className="eyebrow">Sales</span><h3>Pipeline movement</h3></div><button type="button" className="text-button" onClick={() => setModule("pipeline")}>Board <span>→</span></button></div>
          <div className="pipeline-summary"><strong>$1,243,000</strong><span>open opportunity value</span></div>
          <div className="pipeline-track">
            {pipeline.map((stage) => <span key={stage.stage} className={`track-${stage.tone}`} style={{ flex: stage.total }} title={`${stage.stage}: ${money(stage.total)}`} />)}
          </div>
          <div className="pipeline-legend">
            {pipeline.map((stage) => <div key={stage.stage}><span><i className={`legend legend-${stage.tone}`} />{stage.stage}</span><b>{money(stage.total)}</b></div>)}
          </div>
        </article>

        <article className="panel schedule-panel">
          <div className="panel-heading"><div><span className="eyebrow">Next up</span><h3>Field schedule</h3></div><button type="button" className="text-button" onClick={() => setModule("activities")}>Calendar <span>→</span></button></div>
          <div className="schedule-list">
            {weekSchedule.map((item) => <div className="schedule-row" key={item.date}><div className={`date-tile tile-${item.tone}`}><span>{item.day}</span><strong>{item.date}</strong></div><div><strong>{item.label}</strong><span>{item.meta}</span></div></div>)}
          </div>
        </article>

        <article className="panel activity-panel">
          <div className="panel-heading"><div><span className="eyebrow">Team</span><h3>Recent activity</h3></div><button type="button" className="icon-button" aria-label="Activity options">•••</button></div>
          <div className="activity-list">
            {recentActivity.map((item, index) => <div className="activity-row" key={`${item.text}-${index}`}><Avatar initials={item.actor} tone={item.tone} /><p><strong>{item.actor}</strong> {item.text}<span>{item.time}</span></p></div>)}
          </div>
          <button type="button" className="button button-secondary full-button" onClick={() => setModule("activities")}>See all activity</button>
        </article>
      </section>
    </div>
  );

  const renderCRM = () => {
    const rows = contacts.filter((contact) => !query || Object.values(contact).join(" ").toLowerCase().includes(query));
    return <div className="module-stack">
      <section className="module-summary four-up">
        <div><span>Total contacts</span><strong>248</strong><small>+14 this month</small></div>
        <div><span>Active clients</span><strong>31</strong><small>8 active projects</small></div>
        <div><span>Referral partners</span><strong>26</strong><small>4 new this quarter</small></div>
        <div><span>Needs follow-up</span><strong>9</strong><small>3 overdue</small></div>
      </section>
      <section className="panel table-panel">
        <div className="panel-heading"><div><span className="eyebrow">Relationship directory</span><h3>Contacts</h3></div><div className="segmented"><button type="button" className="segment-active">People</button><button type="button" onClick={() => document.getElementById("companies")?.scrollIntoView({ behavior: "smooth" })}>Companies</button></div></div>
        {rows.length ? <div className="table-scroll"><table><thead><tr><th>Name</th><th>Company</th><th>Contact</th><th>Status</th><th>Last touch</th><th>Owner</th></tr></thead><tbody>
          {rows.map((contact) => <tr key={contact.email}><td><div className="person-cell"><Avatar initials={contact.name.split(" ").map((word) => word[0]).join("").slice(0, 2)} tone="blue" /><span><strong>{contact.name}</strong><small>{contact.role}</small></span></div></td><td>{contact.company}</td><td><strong className="cell-strong">{contact.phone}</strong><small>{contact.email}</small></td><td><Status>{contact.status}</Status></td><td>{contact.lastTouch}</td><td><Avatar initials={contact.owner} tone="slate" /></td></tr>)}
        </tbody></table></div> : <EmptySearch query={search} />}
      </section>
      <section className="panel" id="companies">
        <div className="panel-heading"><div><span className="eyebrow">Organizations</span><h3>Companies</h3></div><button type="button" className="text-button">View directory <span>→</span></button></div>
        <div className="company-grid">{companies.map((company) => <article className="company-card" key={company.name}><span className="company-monogram">{company.name.split(" ").map((word) => word[0]).join("").slice(0, 2)}</span><div><strong>{company.name}</strong><span>{company.type}</span></div><dl><div><dt>Location</dt><dd>{company.location}</dd></div><div><dt>Contacts</dt><dd>{company.contacts}</dd></div><div><dt>Open value</dt><dd>{company.openValue}</dd></div></dl></article>)}</div>
      </section>
    </div>;
  };

  const renderPipeline = () => (
    <div className="module-stack">
      <section className="pipeline-toolbar"><div><span>Open pipeline</span><strong>$1,243,000</strong></div><div><span>Weighted forecast</span><strong>$568,400</strong></div><div><span>Close rate</span><strong>38.6%</strong></div><div><span>Avg. sales cycle</span><strong>29 days</strong></div></section>
      <section className="kanban" aria-label="Opportunity pipeline">
        {pipeline.map((stage) => <div className="kanban-column" key={stage.stage}><div className="kanban-head"><div><i className={`dot ${stage.tone}`} /><strong>{stage.stage}</strong><span>{stage.opportunities.length}</span></div><b>{money(stage.total)}</b></div><div className="kanban-stack">
          {stage.opportunities.filter((opportunity) => !query || Object.values(opportunity).join(" ").toLowerCase().includes(query)).map((opportunity) => <article className="opportunity-card" key={opportunity.name}><div className="opportunity-top"><Status tone={stage.tone}>{opportunity.type}</Status><button type="button" aria-label="Opportunity options">•••</button></div><h3>{opportunity.name}</h3><p>{opportunity.company}</p><div className="opportunity-value"><strong>{money(opportunity.value)}</strong><span>{opportunity.age}</span></div><div className="opportunity-foot"><Avatar initials={opportunity.owner} tone={stage.tone} /><span>Next: follow-up call</span></div></article>)}
          <button type="button" className="add-card" onClick={() => canCreate && setCreateOpen(true)} disabled={!canCreate}>＋ Add opportunity</button>
        </div></div>)}
      </section>
    </div>
  );

  const renderProperties = () => {
    const rows = properties.filter((property) => !query || Object.values(property).join(" ").toLowerCase().includes(query));
    return <div className="module-stack">
      <section className="module-summary three-up"><div><span>Tracked properties</span><strong>74</strong><small>Across Central Florida</small></div><div><span>With active work</span><strong>8</strong><small>5 residential · 3 commercial</small></div><div><span>Roofing histories</span><strong>29</strong><small>Measurements + systems tracked</small></div></section>
      <section className="property-grid">{rows.length ? rows.map((property, index) => <article className="property-card" key={property.address}><div className={`property-visual visual-${index % 4}`}><span>{property.type.includes("Retail") ? "COMMERCIAL" : property.type.toUpperCase()}</span><b>{property.project}</b></div><div className="property-body"><div><h3>{property.address}</h3><p>{property.city}</p></div><dl><div><dt>Primary contact</dt><dd>{property.contact}</dd></div><div><dt>Roof system</dt><dd>{property.roof}</dd></div><div><dt>Site note</dt><dd>{property.note}</dd></div></dl><button type="button" className="text-button">Open property <span>→</span></button></div></article>) : <EmptySearch query={search} />}</section>
    </div>;
  };

  const renderEstimates = () => {
    const rows = estimates.filter((estimate) => !query || Object.values(estimate).join(" ").toLowerCase().includes(query));
    return <div className="module-stack">
      <section className="module-summary four-up"><div><span>Draft value</span><strong>$449K</strong><small>3 estimates</small></div><div><span>Sent value</span><strong>$520K</strong><small>Awaiting decision</small></div><div><span>Approved MTD</span><strong>$314K</strong><small>42% win rate</small></div><div><span>Average margin</span><strong>25.7%</strong><small>Target: 24%</small></div></section>
      <section className="panel table-panel"><div className="panel-heading"><div><span className="eyebrow">Estimate register</span><h3>Current estimates</h3></div><div className="segmented"><button type="button" className="segment-active">All</button><button type="button">Mine</button><button type="button">Expiring</button></div></div>
        {rows.length ? <div className="table-scroll"><table><thead><tr><th>Estimate</th><th>Customer</th><th>Status</th><th className="align-right">Amount</th><th className="align-right">Est. cost</th><th className="align-right">Margin</th><th>Expires</th><th>Updated</th></tr></thead><tbody>
          {rows.map((estimate) => <tr key={estimate.id}><td><strong className="cell-strong">{estimate.name}</strong><small>{estimate.id}</small></td><td>{estimate.customer}</td><td><Status>{estimate.status}</Status></td><td className="align-right table-money">{money(estimate.amount)}</td><td className="align-right">{money(estimate.cost)}</td><td className="align-right"><strong className={estimate.margin >= 24 ? "positive" : "warning"}>{estimate.margin}%</strong></td><td>{estimate.expires}</td><td>{estimate.updated}</td></tr>)}
        </tbody></table></div> : <EmptySearch query={search} />}
      </section>
    </div>;
  };

  const renderProjects = () => (
    <div className="module-stack">
      <section className="module-summary four-up"><div><span>Contracted backlog</span><strong>$2.86M</strong><small>8 active jobs</small></div><div><span>Committed cost</span><strong>$1.48M</strong><small>51.7% of contracts</small></div><div><span>Forecast GP</span><strong>$642K</strong><small>22.4% margin</small></div><div><span>Open change orders</span><strong>$84K</strong><small>5 pending approval</small></div></section>
      <section className="panel table-panel"><div className="panel-heading"><div><span className="eyebrow">Production portfolio</span><h3>Projects + jobs</h3></div><div className="filter-row"><select value={projectFilter} onChange={(event) => setProjectFilter(event.target.value)} aria-label="Filter projects"><option>All jobs</option><option>Roof</option><option>Commercial</option><option>Remodel</option><option>New construction</option></select><button type="button" className="icon-button" aria-label="Project table options">•••</button></div></div>
        {filteredProjects.length ? <div className="project-table-wrap"><table className="project-table"><thead><tr><th>Project</th><th>Stage + progress</th><th className="align-right">Contract</th><th className="align-right">Committed</th><th className="align-right">Forecast</th><th className="align-right">Margin</th><th>Next milestone</th></tr></thead><tbody>
          {filteredProjects.map((project) => <tr key={project.id}><td><div className="project-name"><span className={`job-badge job-${project.tone}`}>{project.type.includes("Roof") || project.type.includes("roof") ? "RF" : "GC"}</span><div><strong>{project.name}</strong><small>{project.id} · {project.location}</small></div></div></td><td><Status tone={project.tone}>{project.stage}</Status><div className="table-progress"><i><em style={{ width: `${project.progress}%` }} /></i><span>{project.progress}%</span></div></td><td className="align-right table-money">{money(project.contract)}</td><td className="align-right">{money(project.committedCost)}</td><td className="align-right">{money(project.forecastCost)}</td><td className="align-right"><strong className={project.margin >= 22 ? "positive" : "warning"}>{project.margin}%</strong></td><td><strong className="cell-strong">{project.nextMilestone.split(" · ")[0]}</strong><small>{project.nextMilestone.split(" · ")[1]}</small></td></tr>)}
        </tbody></table></div> : <EmptySearch query={search} />}
      </section>
      <section className="panel cost-detail"><div className="panel-heading"><div><span className="eyebrow">Selected example</span><h3>AC-26041 · Job-cost snapshot</h3></div><Status tone="green">31.2% forecast margin</Status></div><div className="job-cost-grid"><div><span>Original contract</span><strong>{money(projects[0].contract)}</strong></div><div><span>Estimated cost</span><strong>{money(projects[0].estimatedCost)}</strong></div><div><span>Committed cost</span><strong>{money(projects[0].committedCost)}</strong></div><div><span>Actual cost</span><strong>{money(projects[0].actualCost)}</strong></div><div><span>Forecast at completion</span><strong>{money(projects[0].forecastCost)}</strong></div><div><span>Forecast gross profit</span><strong className="positive">{money(projects[0].contract - projects[0].forecastCost)}</strong></div></div><p className="system-note"><i>i</i><span>This MVP provides operational visibility. Official job costs, payroll, signed contracts, and regulated records remain in their designated systems of record until integrations are implemented.</span></p></section>
    </div>
  );

  const renderPartners = () => {
    const rows = partners.filter((partner) => !query || Object.values(partner).join(" ").toLowerCase().includes(query));
    return <div className="module-stack"><section className="module-summary four-up"><div><span>Approved partners</span><strong>42</strong><small>Across 18 trades</small></div><div><span>COIs expiring in 30d</span><strong>4</strong><small>2 require follow-up</small></div><div><span>Open commitments</span><strong>$684K</strong><small>Across 8 jobs</small></div><div><span>Preferred vendors</span><strong>12</strong><small>Performance score A-/better</small></div></section>
      <section className="panel table-panel"><div className="panel-heading"><div><span className="eyebrow">Trade directory</span><h3>Subcontractors + vendors</h3></div><div className="segmented"><button type="button" className="segment-active">All</button><button type="button">Subs</button><button type="button">Vendors</button></div></div>{rows.length ? <div className="table-scroll"><table><thead><tr><th>Company</th><th>Trade</th><th>Primary contact</th><th>COI expiration</th><th>Active jobs</th><th>Score</th><th>Status</th></tr></thead><tbody>{rows.map((partner) => <tr key={partner.name}><td><div className="person-cell"><span className="company-monogram small">{partner.name.split(" ").map((word) => word[0]).join("").slice(0, 2)}</span><strong>{partner.name}</strong></div></td><td>{partner.trade}</td><td><strong className="cell-strong">{partner.contact}</strong><small>{partner.phone}</small></td><td>{partner.coi}</td><td>{partner.jobs}</td><td><strong>{partner.rating}</strong></td><td><Status>{partner.status}</Status></td></tr>)}</tbody></table></div> : <EmptySearch query={search} />}</section>
    </div>;
  };

  const renderDocuments = () => {
    const rows = documents.filter((document) => !query || Object.values(document).join(" ").toLowerCase().includes(query));
    return <div className="module-stack"><section className="integration-banner"><div className="integration-symbol">M365</div><div><span className="eyebrow">Future connector</span><h3>Microsoft 365 document backbone</h3><p>The register is ready to map document metadata to SharePoint and OneDrive without storing credentials in this MVP.</p></div><Status tone="amber">Placeholder</Status></section>
      <section className="panel table-panel"><div className="panel-heading"><div><span className="eyebrow">Metadata register</span><h3>Recent documents</h3></div><div className="segmented"><button type="button" className="segment-active">All</button><button type="button">Plans</button><button type="button">Contracts</button><button type="button">Compliance</button></div></div>{rows.length ? <div className="table-scroll"><table><thead><tr><th>Name</th><th>Category</th><th>Related record</th><th>Version</th><th>Source</th><th>Owner</th><th>Updated</th></tr></thead><tbody>{rows.map((document) => <tr key={document.name}><td><div className="document-cell"><span>PDF</span><strong>{document.name}</strong></div></td><td>{document.category}</td><td><Status tone="slate">{document.record}</Status></td><td>{document.version}</td><td>{document.source}</td><td><Avatar initials={document.owner} tone="blue" /></td><td>{document.updated}</td></tr>)}</tbody></table></div> : <EmptySearch query={search} />}</section>
    </div>;
  };

  const renderActivities = () => {
    const rows = activities.filter((activity) => !query || Object.values(activity).join(" ").toLowerCase().includes(query));
    return <div className="module-stack"><section className="task-layout"><div className="task-focus"><span>Today</span><strong>3</strong><small>open actions</small></div><div><span>Overdue</span><strong className="danger-text">3</strong><small>requires follow-up</small></div><div><span>This week</span><strong>14</strong><small>team tasks</small></div><div><span>Completed</span><strong>27</strong><small>last 7 days</small></div></section>
      <section className="panel task-panel"><div className="panel-heading"><div><span className="eyebrow">Execution queue</span><h3>Tasks + follow-ups</h3></div><div className="segmented"><button type="button" className="segment-active">Open</button><button type="button">Mine</button><button type="button">Completed</button></div></div>{rows.length ? <div className="task-list">{rows.map((activity) => <div className="task-row" key={activity.title}><button type="button" className="task-check" aria-label={`Complete ${activity.title}`} onClick={(event) => event.currentTarget.classList.toggle("checked")}>✓</button><div className="task-title"><strong>{activity.title}</strong><span>{activity.related}</span></div><Status tone={activity.priority === "High" ? "red" : "slate"}>{activity.priority}</Status><div className="task-assignee"><Avatar initials={activity.assignee.split(" ").map((word) => word[0]).join("").slice(0, 2)} tone="blue" /><span>{activity.assignee}</span></div><div className="task-due"><span>{activity.due}</span><small>{activity.status}</small></div><button type="button" className="icon-button" aria-label="Task options">•••</button></div>)}</div> : <EmptySearch query={search} />}</section>
    </div>;
  };

  const content: Record<ModuleId, () => React.ReactNode> = {
    dashboard: renderDashboard,
    crm: renderCRM,
    pipeline: renderPipeline,
    properties: renderProperties,
    estimates: renderEstimates,
    projects: renderProjects,
    partners: renderPartners,
    documents: renderDocuments,
    activities: renderActivities,
  };

  return (
    <div className="app-shell">
      {renderSidebar()}
      {mobileOpen && <button type="button" className="sidebar-scrim" onClick={() => setMobileOpen(false)} aria-label="Close navigation overlay" />}
      <main className="main-shell">
        <header className="topbar">
          <div className="topbar-left">
            <button type="button" className="mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open navigation">☰</button>
            <div><h1>{copy.title}</h1><p>{copy.kicker}</p></div>
          </div>
          <div className="topbar-actions">
            <label className="global-search"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search this workspace…" aria-label="Search current module" /><kbd>⌘ K</kbd></label>
            <div className="role-control"><span>Viewing as</span><select value={role} onChange={(event) => setRole(event.target.value as Role)} aria-label="Preview role"><option>Administrator</option><option>Project Manager</option><option>Estimator</option><option>Field Crew</option><option>Accounting</option><option>Read Only</option></select></div>
            <div className="notice-wrap"><button type="button" className="notice-button" onClick={() => setNoticeOpen((value) => !value)} aria-label="Notifications"><span>•</span>◎</button>{noticeOpen && <div className="notice-popover"><strong>Attention queue</strong><p>2 COIs expire soon</p><p>3 tasks are overdue</p><p>1 estimate expires Tuesday</p></div>}</div>
            <button type="button" className="button button-primary" onClick={() => setCreateOpen(true)} disabled={!canCreate}><span>＋</span>{copy.action}</button>
          </div>
        </header>
        <div className="mobile-context"><label>Module<select value={activeModule} onChange={(event) => setModule(event.target.value as ModuleId)}>{navigation.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label><label>Role<select value={role} onChange={(event) => setRole(event.target.value as Role)}><option>Administrator</option><option>Project Manager</option><option>Estimator</option><option>Field Crew</option><option>Accounting</option><option>Read Only</option></select></label></div>
        <div className="page-content">{content[activeModule]()}</div>
        <footer className="app-footer"><span>ACMI Construction OS · MVP environment</span><span>Tenant isolated · Role aware · Integration ready</span></footer>
      </main>

      {createOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setCreateOpen(false); }}>
          <section className="modal" role="dialog" aria-modal="true" aria-labelledby="create-title">
            <button type="button" className="modal-close" onClick={() => setCreateOpen(false)} aria-label="Close">×</button>
            <span className="eyebrow">Quick create</span>
            <h2 id="create-title">Add a workspace record</h2>
            <p>This demo saves a local draft only. Database writes activate after Supabase is connected.</p>
            <form onSubmit={saveDraft}>
              <label>Record type<select name="recordType" defaultValue={copy.action.replace("New ", "").replace("Register ", "")}><option>Opportunity</option><option>Contact</option><option>Property</option><option>Estimate</option><option>Project</option><option>Trade partner</option><option>Task</option><option>Document metadata</option></select></label>
              <label>Name<input name="recordName" required placeholder="Enter a clear record name" /></label>
              <div className="form-grid"><label>Owner<select name="owner"><option>Yannick Couillard</option><option>Maya Reynolds</option><option>Kendra Lewis</option></select></label><label>Priority<select name="priority"><option>Normal</option><option>High</option><option>Urgent</option></select></label></div>
              <label>Notes<textarea name="notes" rows={3} placeholder="Optional context, next step, or site note" /></label>
              <div className="modal-actions"><button type="button" className="button button-secondary" onClick={() => setCreateOpen(false)}>Cancel</button><button type="submit" className="button button-primary">Create local draft</button></div>
            </form>
          </section>
        </div>
      )}
      {toast && <div className="toast"><i>✓</i><span>{toast}</span></div>}
    </div>
  );
}
