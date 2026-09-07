import { useState, useMemo } from "react";

const PROJECTS = ["Freshworks CRM", "Gunvatta Pathshala", "Call Center", "MVTF", "Zoho Survey"];
const STATUSES = ["Not Started", "In Progress", "Completed", "On Hold", "Blocked"];
const PRIORITIES = ["Critical", "High", "Medium", "Low"];
const CATEGORIES = ["Strategy & Planning", "Development & Implementation", "Integrations", "Data & Analytics", "Campaigns & Outreach", "Operations", "Testing & QA", "Deployment", "Ad Hoc", "Stakeholder Management"];

const STATUS_COLORS = {
  "Not Started": { bg: "#f1f5f9", text: "#64748b", dot: "#94a3b8" },
  "In Progress": { bg: "#eff6ff", text: "#1d4ed8", dot: "#3b82f6" },
  "Completed": { bg: "#f0fdf4", text: "#15803d", dot: "#22c55e" },
  "On Hold": { bg: "#fffbeb", text: "#b45309", dot: "#f59e0b" },
  "Blocked": { bg: "#fef2f2", text: "#b91c1c", dot: "#ef4444" },
};
const PRIORITY_COLORS = {
  "Critical": "#dc2626", "High": "#ea580c", "Medium": "#ca8a04", "Low": "#16a34a"
};
const PROJECT_COLORS = {
  "Freshworks CRM": "#6366f1", "Gunvatta Pathshala": "#0ea5e9",
  "Call Center": "#f59e0b", "MVTF": "#ec4899", "Zoho Survey": "#10b981"
};

const initTasks = [
  // Freshworks CRM
  { id:1, project:"Freshworks CRM", category:"Strategy & Planning", task:"Account & Contact Data Model Design", description:"Define account hierarchy, contact lifecycle stages, field standardization", assignee:"CRM Team", priority:"High", status:"In Progress", startDate:"2025-04-01", dueDate:"2025-04-15", progress:60, notes:"" },
  { id:2, project:"Freshworks CRM", category:"Strategy & Planning", task:"Deal Pipeline Structuring", description:"Define deal stages for NABH, Yatra and other programs", assignee:"CRM Team", priority:"High", status:"In Progress", startDate:"2025-04-05", dueDate:"2025-04-20", progress:40, notes:"" },
  { id:3, project:"Freshworks CRM", category:"Integrations", task:"Website Lead Capture Integration", description:"Contact Us, Query Forms and landing page integration into CRM", assignee:"Dev Team", priority:"Critical", status:"In Progress", startDate:"2025-04-01", dueDate:"2025-04-18", progress:50, notes:"" },
  { id:4, project:"Freshworks CRM", category:"Integrations", task:"ERP Integration - Payment Sync", description:"Payment status sync and pending payment tracking with ERP", assignee:"Dev Team", priority:"High", status:"Not Started", startDate:"2025-04-15", dueDate:"2025-05-05", progress:0, notes:"" },
  { id:5, project:"Freshworks CRM", category:"Integrations", task:"Call Center Integration", description:"Call logs capture, disposition mapping, agent performance linkage", assignee:"IT Team", priority:"High", status:"Not Started", startDate:"2025-04-20", dueDate:"2025-05-10", progress:0, notes:"" },
  { id:6, project:"Freshworks CRM", category:"Integrations", task:"WhatsApp Integration", description:"Lead communication workflows, notifications and follow-ups", assignee:"Dev Team", priority:"Medium", status:"Not Started", startDate:"2025-05-01", dueDate:"2025-05-20", progress:0, notes:"" },
  { id:7, project:"Freshworks CRM", category:"Development & Implementation", task:"Lead Routing & Auto-Assignment Rules", description:"Region/state/program-based routing, manual override workflows", assignee:"CRM Team", priority:"High", status:"In Progress", startDate:"2025-04-08", dueDate:"2025-04-22", progress:30, notes:"" },
  { id:8, project:"Freshworks CRM", category:"Campaigns & Outreach", task:"Email Campaign Setup & Scheduling", description:"Freddy AI/Marketer campaign setup, trigger-based campaigns", assignee:"Marketing", priority:"Medium", status:"Not Started", startDate:"2025-04-25", dueDate:"2025-05-15", progress:0, notes:"" },
  { id:9, project:"Freshworks CRM", category:"Data & Analytics", task:"Lead Funnel & Conversion Dashboard", description:"Lead funnel reports, conversion metrics, campaign performance", assignee:"Analytics Team", priority:"Medium", status:"Not Started", startDate:"2025-05-01", dueDate:"2025-05-20", progress:0, notes:"" },
  { id:10, project:"Freshworks CRM", category:"Data & Analytics", task:"Data Cleaning & Deduplication", description:"Bulk uploads (Yatra, events, legacy data), validation rules", assignee:"Data Team", priority:"Medium", status:"In Progress", startDate:"2025-04-10", dueDate:"2025-04-30", progress:25, notes:"" },
  { id:11, project:"Freshworks CRM", category:"Ad Hoc", task:"Debug Early Campaign Trigger Issue", description:"Resolve premature campaign trigger bug affecting lead nurturing", assignee:"Dev Team", priority:"Critical", status:"Completed", startDate:"2025-04-02", dueDate:"2025-04-04", progress:100, notes:"Resolved" },
  // Gunvatta Pathshala
  { id:12, project:"Gunvatta Pathshala", category:"Strategy & Planning", task:"Platform Rebranding EQuest → Gunvatta Pathshala", description:"Full rebrand including assets, naming conventions, communication", assignee:"Product Team", priority:"Critical", status:"In Progress", startDate:"2025-04-01", dueDate:"2025-04-25", progress:55, notes:"" },
  { id:13, project:"Gunvatta Pathshala", category:"Strategy & Planning", task:"Feature Mapping & Gap Analysis", description:"Map existing EQuest features, identify gaps for new platform", assignee:"Product Team", priority:"High", status:"Completed", startDate:"2025-03-20", dueDate:"2025-04-05", progress:100, notes:"" },
  { id:14, project:"Gunvatta Pathshala", category:"Development & Implementation", task:"Onboarding Flow Redesign", description:"Registration-first approach, uniform design system implementation", assignee:"Dev Team", priority:"High", status:"In Progress", startDate:"2025-04-05", dueDate:"2025-04-28", progress:45, notes:"" },
  { id:15, project:"Gunvatta Pathshala", category:"Development & Implementation", task:"KPoint Integration for Video Streaming", description:"Integrate KPoint for course video streaming and delivery", assignee:"Dev Team", priority:"High", status:"Not Started", startDate:"2025-04-20", dueDate:"2025-05-10", progress:0, notes:"" },
  { id:16, project:"Gunvatta Pathshala", category:"Data & Analytics", task:"User Progress & Course Completion Tracking", description:"Backend analytics for user progress, engagement metrics", assignee:"Dev Team", priority:"Medium", status:"Not Started", startDate:"2025-05-01", dueDate:"2025-05-25", progress:0, notes:"" },
  { id:17, project:"Gunvatta Pathshala", category:"Deployment", task:"Hosting Setup (Vercel/Railway)", description:"Environment setup for prototype deployment, performance optimization", assignee:"DevOps", priority:"Medium", status:"In Progress", startDate:"2025-04-10", dueDate:"2025-04-22", progress:70, notes:"" },
  { id:18, project:"Gunvatta Pathshala", category:"Ad Hoc", task:"UI Fixes – Alignment & Hospital Naming", description:"Resolve UI inconsistencies, hospital naming errors", assignee:"Dev Team", priority:"Medium", status:"Completed", startDate:"2025-04-06", dueDate:"2025-04-08", progress:100, notes:"" },
  // Call Center
  { id:19, project:"Call Center", category:"Development & Implementation", task:"Call Center Tool Selection & Telephony Setup", description:"Evaluate and finalize call center platform, configure telephony", assignee:"IT Team", priority:"Critical", status:"In Progress", startDate:"2025-04-01", dueDate:"2025-04-20", progress:40, notes:"" },
  { id:20, project:"Call Center", category:"Integrations", task:"CRM-Call Center Integration", description:"Call logging in CRM, auto-fetch customer details, ticket creation", assignee:"Dev Team", priority:"High", status:"Not Started", startDate:"2025-04-21", dueDate:"2025-05-10", progress:0, notes:"" },
  { id:21, project:"Call Center", category:"Operations", task:"Call Disposition Mapping & Escalation Matrix", description:"Define call dispositions, follow-up and escalation workflows", assignee:"Ops Team", priority:"High", status:"Not Started", startDate:"2025-04-15", dueDate:"2025-05-01", progress:0, notes:"" },
  { id:22, project:"Call Center", category:"Operations", task:"Pending Payment Outbound Campaign", description:"Integrate ERP payment data for outbound follow-up calls", assignee:"Ops Team", priority:"High", status:"Not Started", startDate:"2025-05-01", dueDate:"2025-05-20", progress:0, notes:"" },
  { id:23, project:"Call Center", category:"Data & Analytics", task:"Agent Performance Tracking Dashboard", description:"Call metrics, conversion tracking, productivity dashboards", assignee:"Analytics Team", priority:"Medium", status:"Not Started", startDate:"2025-05-05", dueDate:"2025-05-25", progress:0, notes:"" },
  // MVTF
  { id:24, project:"MVTF", category:"Development & Implementation", task:"HTML Prototype Development", description:"Create HTML version with draft iterations and token/API handling", assignee:"Dev Team", priority:"High", status:"In Progress", startDate:"2025-04-01", dueDate:"2025-04-15", progress:65, notes:"" },
  { id:25, project:"MVTF", category:"Testing & QA", task:"Feature Validation & Dummy Data Setup", description:"Workflow simulation, feature validation with test data", assignee:"QA Team", priority:"High", status:"In Progress", startDate:"2025-04-10", dueDate:"2025-04-22", progress:35, notes:"" },
  { id:26, project:"MVTF", category:"Stakeholder Management", task:"Stakeholder Demo Preparation & Feedback", description:"Share drafts, collect feedback, manage iteration cycles", assignee:"PM", priority:"High", status:"Not Started", startDate:"2025-04-20", dueDate:"2025-04-28", progress:0, notes:"" },
  { id:27, project:"MVTF", category:"Ad Hoc", task:"Fix Token Expiry Issues", description:"Resolve API token expiry and rapid revision support", assignee:"Dev Team", priority:"Critical", status:"Completed", startDate:"2025-04-03", dueDate:"2025-04-04", progress:100, notes:"Fixed" },
  // Zoho Survey
  { id:28, project:"Zoho Survey", category:"Development & Implementation", task:"Survey Design & Logic-Based Flows", description:"Questionnaire structuring, multi-step survey with conditional logic", assignee:"Survey Team", priority:"Medium", status:"In Progress", startDate:"2025-04-05", dueDate:"2025-04-20", progress:50, notes:"" },
  { id:29, project:"Zoho Survey", category:"Integrations", task:"Survey → CRM Integration", description:"Response capture automation, CRM data sync", assignee:"Dev Team", priority:"Medium", status:"Not Started", startDate:"2025-04-21", dueDate:"2025-05-05", progress:0, notes:"" },
  { id:30, project:"Zoho Survey", category:"Data & Analytics", task:"Response Analysis & Reporting Dashboard", description:"Analytics for survey responses and campaign-level reporting", assignee:"Analytics Team", priority:"Low", status:"Not Started", startDate:"2025-05-05", dueDate:"2025-05-20", progress:0, notes:"" },
];

let nextId = 31;

const Badge = ({ label, color, textColor, dot }) => (
  <span style={{ background: color, color: textColor, border: `1px solid ${textColor}22`, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600, display:"inline-flex", alignItems:"center", gap:5, whiteSpace:"nowrap" }}>
    {dot && <span style={{ width:6, height:6, borderRadius:"50%", background: dot, display:"inline-block" }} />}
    {label}
  </span>
);

const ProgressBar = ({ pct }) => (
  <div style={{ background:"#e2e8f0", borderRadius:10, height:7, width:"100%", minWidth:60 }}>
    <div style={{ background: pct===100?"#22c55e": pct>50?"#3b82f6":"#f59e0b", borderRadius:10, height:"100%", width:`${pct}%`, transition:"width .3s" }} />
  </div>
);

const TABS = ["📋 Task Tracker", "📊 Dashboard"];

export default function App() {
  const [tasks, setTasks] = useState(initTasks);
  const [tab, setTab] = useState(0);
  const [filterProject, setFilterProject] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState("id");
  const [sortDir, setSortDir] = useState("asc");
  const [editId, setEditId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({});

  const filtered = useMemo(() => {
    let t = tasks;
    if (filterProject !== "All") t = t.filter(x => x.project === filterProject);
    if (filterStatus !== "All") t = t.filter(x => x.status === filterStatus);
    if (filterPriority !== "All") t = t.filter(x => x.priority === filterPriority);
    if (search) t = t.filter(x => x.task.toLowerCase().includes(search.toLowerCase()) || x.description.toLowerCase().includes(search.toLowerCase()) || x.assignee.toLowerCase().includes(search.toLowerCase()));
    return [...t].sort((a,b) => {
      let va = a[sortCol], vb = b[sortCol];
      if (typeof va === "string") va = va.toLowerCase(), vb = vb.toLowerCase();
      return sortDir === "asc" ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });
  }, [tasks, filterProject, filterStatus, filterPriority, search, sortCol, sortDir]);

  const sort = col => { if (sortCol === col) setSortDir(d => d==="asc"?"desc":"asc"); else { setSortCol(col); setSortDir("asc"); } };

  const openEdit = t => { setForm({...t}); setEditId(t.id); setShowAdd(false); };
  const openAdd = () => { setForm({ project:"Freshworks CRM", category:"Strategy & Planning", task:"", description:"", assignee:"", priority:"Medium", status:"Not Started", startDate:"", dueDate:"", progress:0, notes:"" }); setShowAdd(true); setEditId(null); };
  const saveEdit = () => { setTasks(ts => ts.map(t => t.id === editId ? {...form, id:editId} : t)); setEditId(null); };
  const saveAdd = () => { setTasks(ts => [...ts, {...form, id: nextId++}]); setShowAdd(false); };
  const deleteTask = id => { if (confirm("Delete this task?")) setTasks(ts => ts.filter(t => t.id !== id)); };

  // Dashboard stats
  const total = tasks.length;
  const byStatus = STATUSES.map(s => ({ label:s, count: tasks.filter(t=>t.status===s).length, ...STATUS_COLORS[s] }));
  const byProject = PROJECTS.map(p => ({ label:p, count: tasks.filter(t=>t.project===p).length, done: tasks.filter(t=>t.project===p && t.status==="Completed").length, color: PROJECT_COLORS[p] }));
  const byPriority = PRIORITIES.map(p => ({ label:p, count: tasks.filter(t=>t.priority===p).length, color: PRIORITY_COLORS[p] }));
  const overallProgress = Math.round(tasks.reduce((a,t)=>a+t.progress,0)/total);
  const blocked = tasks.filter(t=>t.status==="Blocked").length;
  const critical = tasks.filter(t=>t.priority==="Critical" && t.status!=="Completed").length;

  const F = ({ label, value, color }) => (
    <div style={{ background:"#fff", border:`1px solid #e2e8f0`, borderRadius:12, padding:"16px 20px", minWidth:120, flex:1, boxShadow:"0 1px 4px #0001" }}>
      <div style={{ fontSize:11, color:"#94a3b8", fontWeight:600, textTransform:"uppercase", letterSpacing:.5 }}>{label}</div>
      <div style={{ fontSize:28, fontWeight:800, color: color||"#1e293b", marginTop:4 }}>{value}</div>
    </div>
  );

  const inputStyle = { border:"1px solid #e2e8f0", borderRadius:8, padding:"6px 10px", fontSize:13, width:"100%", outline:"none", boxSizing:"border-box", background:"#f8fafc" };
  const thStyle = (col) => ({ padding:"10px 12px", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:.5, color:"#64748b", background:"#f8fafc", cursor:"pointer", whiteSpace:"nowrap", userSelect:"none", borderBottom:"2px solid #e2e8f0" });

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", minHeight:"100vh", background:"#f1f5f9", color:"#1e293b" }}>
      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#1e293b 0%,#334155 100%)", padding:"20px 28px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <div style={{ fontSize:20, fontWeight:800, color:"#fff", letterSpacing:-.3 }}>🗂 Project Task Tracker</div>
          <div style={{ fontSize:12, color:"#94a3b8", marginTop:2 }}>All Projects · {total} Tasks · Last updated: April 2, 2026</div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {TABS.map((t,i) => (
            <button key={i} onClick={()=>setTab(i)} style={{ background: tab===i?"#6366f1":"transparent", color: tab===i?"#fff":"#94a3b8", border: tab===i?"none":"1px solid #475569", borderRadius:8, padding:"7px 16px", fontSize:13, fontWeight:600, cursor:"pointer" }}>{t}</button>
          ))}
        </div>
      </div>

      {/* DASHBOARD */}
      {tab === 1 && (
        <div style={{ padding:24, maxWidth:1200, margin:"0 auto" }}>
          {/* KPI Row */}
          <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:20 }}>
            <F label="Total Tasks" value={total} />
            <F label="Overall Progress" value={`${overallProgress}%`} color="#6366f1" />
            <F label="Completed" value={byStatus.find(s=>s.label==="Completed").count} color="#22c55e" />
            <F label="In Progress" value={byStatus.find(s=>s.label==="In Progress").count} color="#3b82f6" />
            <F label="Blocked" value={blocked} color="#ef4444" />
            <F label="Critical Open" value={critical} color="#dc2626" />
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
            {/* Status breakdown */}
            <div style={{ background:"#fff", borderRadius:14, padding:20, boxShadow:"0 1px 4px #0001" }}>
              <div style={{ fontWeight:700, fontSize:14, marginBottom:14 }}>Status Breakdown</div>
              {byStatus.map(s => (
                <div key={s.label} style={{ marginBottom:10 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:3 }}>
                    <span style={{ display:"flex", alignItems:"center", gap:6 }}><span style={{width:8,height:8,borderRadius:"50%",background:s.dot,display:"inline-block"}}/>{s.label}</span>
                    <span style={{ fontWeight:700 }}>{s.count} <span style={{color:"#94a3b8",fontWeight:400}}>({Math.round(s.count/total*100)}%)</span></span>
                  </div>
                  <div style={{ background:"#f1f5f9", borderRadius:10, height:8 }}>
                    <div style={{ background:s.dot, borderRadius:10, height:"100%", width:`${s.count/total*100}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Priority breakdown */}
            <div style={{ background:"#fff", borderRadius:14, padding:20, boxShadow:"0 1px 4px #0001" }}>
              <div style={{ fontWeight:700, fontSize:14, marginBottom:14 }}>Priority Distribution</div>
              {byPriority.map(p => (
                <div key={p.label} style={{ marginBottom:10 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:3 }}>
                    <span style={{ display:"flex", alignItems:"center", gap:6 }}><span style={{width:8,height:8,borderRadius:"50%",background:p.color,display:"inline-block"}}/>{p.label}</span>
                    <span style={{ fontWeight:700 }}>{p.count}</span>
                  </div>
                  <div style={{ background:"#f1f5f9", borderRadius:10, height:8 }}>
                    <div style={{ background:p.color, borderRadius:10, height:"100%", width:`${p.count/total*100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project cards */}
          <div style={{ fontWeight:700, fontSize:14, marginBottom:12 }}>Project-wise Progress</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:12 }}>
            {byProject.map(p => {
              const pct = p.count ? Math.round(p.done/p.count*100) : 0;
              const ip = tasks.filter(t=>t.project===p.label && t.status==="In Progress").length;
              return (
                <div key={p.label} style={{ background:"#fff", borderRadius:14, padding:18, boxShadow:"0 1px 4px #0001", borderTop:`4px solid ${p.color}` }}>
                  <div style={{ fontWeight:700, fontSize:13, color:"#1e293b", marginBottom:6 }}>{p.label}</div>
                  <div style={{ fontSize:11, color:"#64748b", marginBottom:10 }}>{p.count} tasks · {p.done} done · {ip} in progress</div>
                  <ProgressBar pct={pct} />
                  <div style={{ fontSize:12, fontWeight:700, color: pct===100?"#22c55e":"#6366f1", marginTop:5 }}>{pct}% complete</div>
                </div>
              );
            })}
          </div>

          {/* Category table */}
          <div style={{ background:"#fff", borderRadius:14, padding:20, boxShadow:"0 1px 4px #0001", marginTop:16 }}>
            <div style={{ fontWeight:700, fontSize:14, marginBottom:14 }}>Tasks by Category</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:10 }}>
              {CATEGORIES.map(c => {
                const ct = tasks.filter(t=>t.category===c);
                const done = ct.filter(t=>t.status==="Completed").length;
                return ct.length ? (
                  <div key={c} style={{ background:"#f8fafc", borderRadius:10, padding:"10px 14px", border:"1px solid #e2e8f0" }}>
                    <div style={{ fontSize:12, fontWeight:600, marginBottom:4 }}>{c}</div>
                    <div style={{ display:"flex", gap:8, fontSize:11, color:"#64748b" }}>
                      <span>Total: <b style={{color:"#1e293b"}}>{ct.length}</b></span>
                      <span>Done: <b style={{color:"#22c55e"}}>{done}</b></span>
                      <span>Open: <b style={{color:"#3b82f6"}}>{ct.length-done}</b></span>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>
      )}

      {/* TRACKER */}
      {tab === 0 && (
        <div style={{ padding:24 }}>
          {/* Filters */}
          <div style={{ background:"#fff", borderRadius:12, padding:"14px 18px", marginBottom:16, display:"flex", gap:10, flexWrap:"wrap", alignItems:"center", boxShadow:"0 1px 4px #0001" }}>
            <input placeholder="🔍  Search tasks, assignees..." value={search} onChange={e=>setSearch(e.target.value)}
              style={{ ...inputStyle, maxWidth:240 }} />
            {[["Project", PROJECTS, filterProject, setFilterProject],
              ["Status", STATUSES, filterStatus, setFilterStatus],
              ["Priority", PRIORITIES, filterPriority, setFilterPriority]].map(([lbl, opts, val, set]) => (
              <select key={lbl} value={val} onChange={e=>set(e.target.value)} style={{ ...inputStyle, maxWidth:160 }}>
                <option value="All">All {lbl}s</option>
                {opts.map(o=><option key={o}>{o}</option>)}
              </select>
            ))}
            <div style={{ marginLeft:"auto" }}>
              <button onClick={openAdd} style={{ background:"#6366f1", color:"#fff", border:"none", borderRadius:8, padding:"8px 18px", fontSize:13, fontWeight:700, cursor:"pointer" }}>+ Add Task</button>
            </div>
          </div>

          <div style={{ fontSize:12, color:"#64748b", marginBottom:10 }}>{filtered.length} tasks shown</div>

          {/* Table */}
          <div style={{ background:"#fff", borderRadius:14, boxShadow:"0 1px 4px #0001", overflow:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead>
                <tr>
                  {[["id","#"],["project","Project"],["category","Category"],["task","Task"],["assignee","Assignee"],["priority","Priority"],["status","Status"],["startDate","Start"],["dueDate","Due"],["progress","Progress"],["notes","Notes"]].map(([col,lbl])=>(
                    <th key={col} style={thStyle(col)} onClick={()=>sort(col)}>
                      {lbl} {sortCol===col ? (sortDir==="asc"?"↑":"↓") : ""}
                    </th>
                  ))}
                  <th style={{...thStyle(""), cursor:"default"}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => {
                  const sc = STATUS_COLORS[t.status];
                  return (
                    <tr key={t.id} style={{ background: i%2===0?"#fff":"#f8fafc", borderBottom:"1px solid #f1f5f9" }}>
                      <td style={{ padding:"10px 12px", color:"#94a3b8", fontWeight:600 }}>{t.id}</td>
                      <td style={{ padding:"10px 12px" }}>
                        <span style={{ background: PROJECT_COLORS[t.project]+"18", color: PROJECT_COLORS[t.project], border:`1px solid ${PROJECT_COLORS[t.project]}44`, borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:700, whiteSpace:"nowrap" }}>{t.project}</span>
                      </td>
                      <td style={{ padding:"10px 12px", fontSize:12, color:"#475569" }}>{t.category}</td>
                      <td style={{ padding:"10px 12px", fontWeight:600, maxWidth:200 }}>
                        <div>{t.task}</div>
                        <div style={{ fontSize:11, color:"#94a3b8", fontWeight:400, marginTop:2 }}>{t.description}</div>
                      </td>
                      <td style={{ padding:"10px 12px", color:"#475569" }}>{t.assignee}</td>
                      <td style={{ padding:"10px 12px" }}>
                        <span style={{ color: PRIORITY_COLORS[t.priority], fontWeight:700, fontSize:12 }}>● {t.priority}</span>
                      </td>
                      <td style={{ padding:"10px 12px" }}>
                        <Badge label={t.status} color={sc.bg} textColor={sc.text} dot={sc.dot} />
                      </td>
                      <td style={{ padding:"10px 12px", color:"#64748b", fontSize:12 }}>{t.startDate}</td>
                      <td style={{ padding:"10px 12px", color:"#64748b", fontSize:12 }}>{t.dueDate}</td>
                      <td style={{ padding:"10px 12px", minWidth:100 }}>
                        <ProgressBar pct={t.progress} />
                        <div style={{ fontSize:11, color:"#64748b", marginTop:2 }}>{t.progress}%</div>
                      </td>
                      <td style={{ padding:"10px 12px", fontSize:12, color:"#64748b", maxWidth:120 }}>{t.notes||"—"}</td>
                      <td style={{ padding:"10px 12px" }}>
                        <div style={{ display:"flex", gap:6 }}>
                          <button onClick={()=>openEdit(t)} style={{ background:"#eff6ff", color:"#3b82f6", border:"none", borderRadius:6, padding:"4px 10px", fontSize:11, fontWeight:700, cursor:"pointer" }}>Edit</button>
                          <button onClick={()=>deleteTask(t.id)} style={{ background:"#fef2f2", color:"#ef4444", border:"none", borderRadius:6, padding:"4px 10px", fontSize:11, fontWeight:700, cursor:"pointer" }}>Del</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {(editId !== null || showAdd) && (
        <div style={{ position:"fixed", inset:0, background:"#0008", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ background:"#fff", borderRadius:16, padding:28, width:560, maxHeight:"90vh", overflow:"auto", boxShadow:"0 8px 40px #0003" }}>
            <div style={{ fontWeight:800, fontSize:16, marginBottom:18 }}>{showAdd ? "➕ Add New Task" : "✏️ Edit Task"}</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {[["task","Task Name","text"],["assignee","Assignee","text"],["startDate","Start Date","date"],["dueDate","Due Date","date"],["progress","Progress (%)","number"]].map(([k,lbl,type])=>(
                <div key={k} style={{ gridColumn: k==="task"?"1/-1":"auto" }}>
                  <label style={{ fontSize:11, fontWeight:600, color:"#64748b", display:"block", marginBottom:4 }}>{lbl}</label>
                  <input type={type} value={form[k]||""} min={type==="number"?0:undefined} max={type==="number"?100:undefined}
                    onChange={e=>setForm(f=>({...f,[k]:type==="number"?+e.target.value:e.target.value}))} style={inputStyle} />
                </div>
              ))}
              {[["project","Project",PROJECTS],["category","Category",CATEGORIES],["status","Status",STATUSES],["priority","Priority",PRIORITIES]].map(([k,lbl,opts])=>(
                <div key={k}>
                  <label style={{ fontSize:11, fontWeight:600, color:"#64748b", display:"block", marginBottom:4 }}>{lbl}</label>
                  <select value={form[k]||""} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} style={inputStyle}>
                    {opts.map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div style={{ gridColumn:"1/-1" }}>
                <label style={{ fontSize:11, fontWeight:600, color:"#64748b", display:"block", marginBottom:4 }}>Description</label>
                <textarea value={form.description||""} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={2} style={{...inputStyle, resize:"vertical"}} />
              </div>
              <div style={{ gridColumn:"1/-1" }}>
                <label style={{ fontSize:11, fontWeight:600, color:"#64748b", display:"block", marginBottom:4 }}>Notes</label>
                <textarea value={form.notes||""} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} rows={2} style={{...inputStyle, resize:"vertical"}} />
              </div>
            </div>
            <div style={{ display:"flex", gap:10, marginTop:20, justifyContent:"flex-end" }}>
              <button onClick={()=>{setEditId(null);setShowAdd(false)}} style={{ background:"#f1f5f9", color:"#475569", border:"none", borderRadius:8, padding:"8px 20px", fontWeight:700, cursor:"pointer" }}>Cancel</button>
              <button onClick={showAdd ? saveAdd : saveEdit} style={{ background:"#6366f1", color:"#fff", border:"none", borderRadius:8, padding:"8px 24px", fontWeight:700, cursor:"pointer" }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
