import { useState, useMemo, useEffect } from "react";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const PROJECT_TYPES = ["Implementation","Development","Integration","Procurement","Consulting","Research","Certification","Event","Other"];
const DEPARTMENTS = ["Quality Council","NABH","NABET","NPL","NQSP","Yatra","IT & Digital","Finance","HR","Operations"];
const PRIORITIES = ["Critical","High","Medium","Low"];
const TASK_STATUSES = ["Not Started","In Progress","Completed","On Hold","Blocked"];
const PROJ_STATUSES = ["Initiation","Planning","In Progress","On Hold","Completed","Cancelled"];
const DELIV_STATUSES = ["Not Started","In Progress","Submitted","Under Review","Approved","Rework","Completed"];
const INV_STATUSES = ["Draft","Submitted","Under Review","Approved","Sent for Payment","Partially Paid","Paid","Rejected","On Hold","Overdue"];
const RISK_TYPES = ["Risk","Issue","Dependency"];
const SEVERITIES = ["Critical","High","Medium","Low"];
const HEALTH = { "On Track":"#22c55e","At Risk":"#f59e0b","Delayed":"#ef4444" };
const LIFECYCLE_STAGES = ["Initiation","Planning","Requirement","Design","Development","Testing/UAT","Deployment","Handover","Closure"];
const CATEGORIES = ["Strategy & Planning","Development & Implementation","Integrations","Data & Analytics","Campaigns & Outreach","Operations","Testing & QA","Deployment","Ad Hoc","Stakeholder Management"];
const PROJECT_COLORS = ["#6366f1","#0ea5e9","#f59e0b","#ec4899","#10b981","#8b5cf6","#f97316","#14b8a6"];
const STATUS_COLORS = {
  "Not Started":{bg:"#f1f5f9",text:"#64748b",dot:"#94a3b8"},
  "In Progress":{bg:"#eff6ff",text:"#1d4ed8",dot:"#3b82f6"},
  "Completed":{bg:"#f0fdf4",text:"#15803d",dot:"#22c55e"},
  "On Hold":{bg:"#fffbeb",text:"#b45309",dot:"#f59e0b"},
  "Blocked":{bg:"#fef2f2",text:"#b91c1c",dot:"#ef4444"},
  "Submitted":{bg:"#f0f9ff",text:"#0369a1",dot:"#0ea5e9"},
  "Under Review":{bg:"#faf5ff",text:"#7e22ce",dot:"#a855f7"},
  "Approved":{bg:"#f0fdf4",text:"#15803d",dot:"#22c55e"},
  "Rework":{bg:"#fff7ed",text:"#c2410c",dot:"#f97316"},
  "Cancelled":{bg:"#f1f5f9",text:"#64748b",dot:"#94a3b8"},
  "Initiation":{bg:"#f0f9ff",text:"#0369a1",dot:"#0ea5e9"},
  "Planning":{bg:"#faf5ff",text:"#7e22ce",dot:"#a855f7"},
  "Paid":{bg:"#f0fdf4",text:"#15803d",dot:"#22c55e"},
  "Draft":{bg:"#f1f5f9",text:"#64748b",dot:"#94a3b8"},
  "Overdue":{bg:"#fef2f2",text:"#b91c1c",dot:"#ef4444"},
  "Partially Paid":{bg:"#fffbeb",text:"#b45309",dot:"#f59e0b"},
  "Rejected":{bg:"#fef2f2",text:"#b91c1c",dot:"#ef4444"},
  "Sent for Payment":{bg:"#eff6ff",text:"#1d4ed8",dot:"#3b82f6"},
  "Handover":{bg:"#faf5ff",text:"#7e22ce",dot:"#a855f7"},
  "Closure":{bg:"#f0fdf4",text:"#15803d",dot:"#22c55e"},
};
const PRIO_COLORS = {"Critical":"#dc2626","High":"#ea580c","Medium":"#ca8a04","Low":"#16a34a"};
const NAV_ITEMS = [
  {id:"dashboard",label:"Dashboard",icon:"📊"},
  {id:"projects",label:"Projects",icon:"🗂"},
  {id:"tasks",label:"Tasks",icon:"✅"},
  {id:"deliverables",label:"Deliverables",icon:"📦"},
  {id:"pdar",label:"PDAR",icon:"📋"},
  {id:"invoices",label:"Invoices",icon:"🧾"},
  {id:"risks",label:"Risks & Issues",icon:"⚠️"},
];

// ─── SEED DATA ────────────────────────────────────────────────────────────────
const seedProjects = [
  {id:"P001",name:"Freshworks CRM",code:"QCI-CRM-01",type:"Implementation",dept:"IT & Digital",owner:"CRM Team",client:"Internal",startDate:"2025-04-01",endDate:"2025-08-31",priority:"High",status:"In Progress",health:"At Risk",description:"End-to-end CRM implementation on Freshworks platform",budget:1500000,vendor:"Freshworks",progress:42,stage:"Development",color:"#6366f1"},
  {id:"P002",name:"Gunvatta Pathshala",code:"QCI-GP-02",type:"Development",dept:"NQSP",owner:"Product Team",client:"MoE",startDate:"2025-03-01",endDate:"2025-09-30",priority:"Critical",status:"In Progress",health:"On Track",description:"Digital learning platform rebranded from EQuest",budget:2200000,vendor:"Internal",progress:58,stage:"Testing/UAT",color:"#0ea5e9"},
  {id:"P003",name:"Call Center Setup",code:"QCI-CC-03",type:"Implementation",dept:"Operations",owner:"IT Team",client:"Internal",startDate:"2025-04-01",endDate:"2025-07-31",priority:"High",status:"In Progress",health:"At Risk",description:"Full call center infrastructure with CRM integration",budget:800000,vendor:"External",progress:28,stage:"Design",color:"#f59e0b"},
  {id:"P004",name:"MVTF",code:"QCI-MVT-04",type:"Development",dept:"IT & Digital",owner:"Dev Team",client:"MOH",startDate:"2025-04-01",endDate:"2025-06-30",priority:"High",status:"In Progress",health:"On Track",description:"Minimum Viable Testing Framework for health travel",budget:600000,vendor:"Internal",progress:65,stage:"Development",color:"#ec4899"},
  {id:"P005",name:"Zoho Survey",code:"QCI-ZS-05",type:"Integration",dept:"Quality Council",owner:"Survey Team",client:"Internal",startDate:"2025-04-05",endDate:"2025-06-30",priority:"Medium",status:"In Progress",health:"On Track",description:"Zoho Survey implementation with CRM integration",budget:200000,vendor:"Zoho",progress:38,stage:"Development",color:"#10b981"},
];

const seedTasks = [
  {id:1,project:"P001",category:"Strategy & Planning",task:"Account & Contact Data Model Design",description:"Define account hierarchy, contact lifecycle stages, field standardization",assignee:"CRM Team",priority:"High",status:"In Progress",startDate:"2025-04-01",dueDate:"2025-04-15",progress:60,notes:"",deliverableId:"D001",subtasks:[],comments:[],tags:["CRM","Data"]},
  {id:2,project:"P001",category:"Strategy & Planning",task:"Deal Pipeline Structuring",description:"Define deal stages for NABH, Yatra and other programs",assignee:"CRM Team",priority:"High",status:"In Progress",startDate:"2025-04-05",dueDate:"2025-04-20",progress:40,notes:"",deliverableId:null,subtasks:[],comments:[],tags:[]},
  {id:3,project:"P001",category:"Integrations",task:"Website Lead Capture Integration",description:"Contact Us, Query Forms and landing page integration into CRM",assignee:"Dev Team",priority:"Critical",status:"In Progress",startDate:"2025-04-01",dueDate:"2025-04-18",progress:50,notes:"",deliverableId:"D002",subtasks:[],comments:[],tags:["Integration"]},
  {id:4,project:"P001",category:"Integrations",task:"ERP Integration - Payment Sync",description:"Payment status sync and pending payment tracking with ERP",assignee:"Dev Team",priority:"High",status:"Not Started",startDate:"2025-04-15",dueDate:"2025-05-05",progress:0,notes:"",deliverableId:null,subtasks:[],comments:[],tags:[]},
  {id:5,project:"P001",category:"Ad Hoc",task:"Debug Early Campaign Trigger Issue",description:"Resolve premature campaign trigger bug affecting lead nurturing",assignee:"Dev Team",priority:"Critical",status:"Completed",startDate:"2025-04-02",dueDate:"2025-04-04",progress:100,notes:"Resolved",deliverableId:null,subtasks:[],comments:[],tags:[]},
  {id:6,project:"P002",category:"Strategy & Planning",task:"Platform Rebranding EQuest → Gunvatta Pathshala",description:"Full rebrand including assets, naming conventions, communication",assignee:"Product Team",priority:"Critical",status:"In Progress",startDate:"2025-04-01",dueDate:"2025-04-25",progress:55,notes:"",deliverableId:"D003",subtasks:[],comments:[],tags:[]},
  {id:7,project:"P002",category:"Development & Implementation",task:"KPoint Integration for Video Streaming",description:"Integrate KPoint for course video streaming and delivery",assignee:"Dev Team",priority:"High",status:"Not Started",startDate:"2025-04-20",dueDate:"2025-05-10",progress:0,notes:"",deliverableId:null,subtasks:[],comments:[],tags:[]},
  {id:8,project:"P003",category:"Development & Implementation",task:"Call Center Tool Selection & Telephony Setup",description:"Evaluate and finalize call center platform",assignee:"IT Team",priority:"Critical",status:"In Progress",startDate:"2025-04-01",dueDate:"2025-04-20",progress:40,notes:"",deliverableId:null,subtasks:[],comments:[],tags:[]},
  {id:9,project:"P004",category:"Development & Implementation",task:"HTML Prototype Development",description:"Create HTML version with draft iterations",assignee:"Dev Team",priority:"High",status:"In Progress",startDate:"2025-04-01",dueDate:"2025-04-15",progress:65,notes:"",deliverableId:null,subtasks:[],comments:[],tags:[]},
  {id:10,project:"P005",category:"Development & Implementation",task:"Survey Design & Logic-Based Flows",description:"Questionnaire structuring, multi-step survey with conditional logic",assignee:"Survey Team",priority:"Medium",status:"In Progress",startDate:"2025-04-05",dueDate:"2025-04-20",progress:50,notes:"",deliverableId:null,subtasks:[],comments:[],tags:[]},
];

const seedDeliverables = [
  {id:"D001",project:"P001",name:"CRM Data Architecture Document",description:"Complete data model and schema definition for CRM implementation",owner:"CRM Team",plannedStart:"2025-04-01",dueDate:"2025-04-20",actualCompletion:"",status:"In Progress",priority:"High",progress:60,dependencies:"",remarks:"",approvalStatus:"Pending"},
  {id:"D002",project:"P001",name:"Website-CRM Integration Module",description:"Fully functional integration between all website forms and CRM",owner:"Dev Team",plannedStart:"2025-04-01",dueDate:"2025-05-10",actualCompletion:"",status:"In Progress",priority:"Critical",progress:45,dependencies:"D001",remarks:"",approvalStatus:"Pending"},
  {id:"D003",project:"P002",name:"Rebranded Platform - Phase 1",description:"Complete UI/UX rebrand of EQuest to Gunvatta Pathshala",owner:"Product Team",plannedStart:"2025-04-01",dueDate:"2025-04-30",actualCompletion:"",status:"In Progress",priority:"Critical",progress:55,dependencies:"",remarks:"",approvalStatus:"Pending"},
  {id:"D004",project:"P002",name:"Learning Management System v1.0",description:"Full LMS with course delivery, tracking and admin dashboards",owner:"Dev Team",plannedStart:"2025-04-15",dueDate:"2025-06-30",actualCompletion:"",status:"Not Started",priority:"High",progress:0,dependencies:"D003",remarks:"",approvalStatus:"Not Required"},
];

const seedInvoices = [
  {id:"INV001",project:"P001",client:"Internal - QCI",vendor:"Freshworks Inc.",type:"Software License",poRef:"PO-2025-001",invoiceDate:"2025-04-01",submissionDate:"2025-04-02",dueDate:"2025-04-30",amount:450000,tax:81000,total:531000,status:"Approved",paymentDate:"",outstanding:531000,approvedBy:"Finance Head",remarks:"Annual license fee Q1"},
  {id:"INV002",project:"P001",client:"Internal - QCI",vendor:"Freshworks Inc.",type:"Implementation Service",poRef:"PO-2025-001",invoiceDate:"2025-04-15",submissionDate:"2025-04-16",dueDate:"2025-05-15",amount:300000,tax:54000,total:354000,status:"Submitted",paymentDate:"",outstanding:354000,approvedBy:"",remarks:"Phase 1 implementation"},
  {id:"INV003",project:"P002",client:"MoE",vendor:"Internal",type:"Development Milestone",poRef:"PO-MoE-2025-003",invoiceDate:"2025-03-31",submissionDate:"2025-04-01",dueDate:"2025-04-20",amount:550000,tax:99000,total:649000,status:"Paid",paymentDate:"2025-04-18",outstanding:0,approvedBy:"MoE Finance",remarks:"Milestone 1 payment"},
  {id:"INV004",project:"P003",client:"Internal - QCI",vendor:"Telecom Vendor",type:"Infrastructure",poRef:"PO-2025-004",invoiceDate:"2025-04-10",submissionDate:"2025-04-11",dueDate:"2025-04-25",amount:180000,tax:32400,total:212400,status:"Overdue",paymentDate:"",outstanding:212400,approvedBy:"",remarks:"Telephony hardware"},
  {id:"INV005",project:"P004",client:"MOH",vendor:"Internal",type:"Development",poRef:"PO-MOH-2025-002",invoiceDate:"2025-04-05",submissionDate:"2025-04-06",dueDate:"2025-05-06",amount:200000,tax:36000,total:236000,status:"Under Review",paymentDate:"",outstanding:236000,approvedBy:"",remarks:"Sprint 1 delivery"},
];

const seedPDAR = [
  {id:"PDAR001",date:"2025-04-01",project:"P001",manager:"Vikas Gothwal",location:"Delhi - Office",activity:"CRM kickoff meeting and requirement walkthrough with Freshworks team",remarks:"All stakeholders aligned on scope",issues:"None",persons:"CRM Team, Freshworks PM",followUp:true,followUpDate:"2025-04-05",status:"Completed"},
  {id:"PDAR002",date:"2025-04-02",project:"P001",manager:"Vikas Gothwal",location:"Remote",activity:"Data model design session - Account and Contact hierarchy finalized",remarks:"Draft schema created",issues:"Conflicting field requirements from two departments",persons:"CRM Team, IT Lead",followUp:true,followUpDate:"2025-04-08",status:"Follow-up Pending"},
  {id:"PDAR003",date:"2025-04-03",project:"P002",manager:"Vikas Gothwal",location:"Delhi - Office",activity:"Rebranding review - reviewed all UI screens for Gunvatta Pathshala",remarks:"15 screens reviewed, 4 sent for revision",issues:"Hospital naming inconsistency in 3 screens",persons:"Product Team, Design Lead",followUp:true,followUpDate:"2025-04-07",status:"Completed"},
  {id:"PDAR004",date:"2025-04-04",project:"P004",manager:"Vikas Gothwal",location:"Remote",activity:"MVTF HTML prototype review and token expiry bug fix",remarks:"Token issue resolved, prototype updated",issues:"Token expiry was breaking API calls",persons:"Dev Team",followUp:false,followUpDate:"",status:"Completed"},
];

const seedRisks = [
  {id:"R001",project:"P001",type:"Risk",description:"ERP integration may face API compatibility issues with legacy system",severity:"High",probability:"Medium",impact:"High",owner:"Dev Team",dateRaised:"2025-04-01",targetDate:"2025-04-30",status:"Open",mitigation:"Conduct API audit before integration sprint",remarks:""},
  {id:"R002",project:"P001",type:"Issue",description:"Campaign trigger firing prematurely - affecting 200+ leads",severity:"Critical",probability:"",impact:"Critical",owner:"Dev Team",dateRaised:"2025-04-02",targetDate:"2025-04-04",status:"Resolved",mitigation:"Fixed in hotfix deployed on April 4",remarks:"Root cause: timing condition in workflow"},
  {id:"R003",project:"P003",type:"Risk",description:"Telephony vendor may not deliver hardware on time",severity:"High",probability:"High",impact:"High",owner:"IT Team",dateRaised:"2025-04-10",targetDate:"2025-04-25",status:"Open",mitigation:"Identify backup vendor",remarks:"Invoice overdue - vendor holding delivery"},
  {id:"R004",project:"P002",type:"Dependency",description:"KPoint integration depends on LMS module completion",severity:"Medium",probability:"",impact:"Medium",owner:"Product Team",dateRaised:"2025-04-05",targetDate:"2025-05-10",status:"Open",mitigation:"Parallel development approach",remarks:""},
];

let _taskId = 11, _delivId = 5, _invId = 6, _pdarId = 5, _riskId = 5;

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const Badge = ({label,color,textColor,dot,size=11})=>(
  <span style={{background:color,color:textColor,border:`1px solid ${textColor}22`,borderRadius:20,padding:`2px ${size===11?10:8}px`,fontSize:size,fontWeight:600,display:"inline-flex",alignItems:"center",gap:5,whiteSpace:"nowrap"}}>
    {dot&&<span style={{width:6,height:6,borderRadius:"50%",background:dot,display:"inline-block"}}/>}{label}
  </span>
);
const StatusBadge=({s})=>{const c=STATUS_COLORS[s]||STATUS_COLORS["Not Started"];return <Badge label={s} color={c.bg} textColor={c.text} dot={c.dot}/>;};
const ProgressBar=({pct,color})=>(
  <div style={{background:"#e2e8f0",borderRadius:10,height:7,width:"100%",minWidth:60}}>
    <div style={{background:color||(pct===100?"#22c55e":pct>50?"#3b82f6":"#f59e0b"),borderRadius:10,height:"100%",width:`${Math.min(pct,100)}%`,transition:"width .3s"}}/>
  </div>
);
const KPI=({label,value,color,sub,onClick})=>(
  <div onClick={onClick} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px 18px",flex:1,minWidth:110,boxShadow:"0 1px 4px #0001",cursor:onClick?"pointer":"default",transition:"box-shadow .2s"}}
    onMouseEnter={e=>{if(onClick)e.currentTarget.style.boxShadow="0 4px 12px #6366f122"}}
    onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 1px 4px #0001"}}>
    <div style={{fontSize:10,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>{label}</div>
    <div style={{fontSize:24,fontWeight:800,color:color||"#1e293b",marginTop:4}}>{value}</div>
    {sub&&<div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>{sub}</div>}
  </div>
);
const fmt=n=>n>=10000000?`₹${(n/10000000).toFixed(1)}Cr`:n>=100000?`₹${(n/100000).toFixed(1)}L`:n>=1000?`₹${(n/1000).toFixed(0)}K`:`₹${n}`;
const today=()=>new Date().toISOString().split("T")[0];
const isOverdue=(d)=>d&&d<today()&&d!=="";
const inputS={border:"1px solid #e2e8f0",borderRadius:8,padding:"7px 10px",fontSize:13,width:"100%",outline:"none",boxSizing:"border-box",background:"#f8fafc"};
const labelS={fontSize:11,fontWeight:600,color:"#64748b",display:"block",marginBottom:4};
const Section=({title,children,action})=>(
  <div style={{background:"#fff",borderRadius:14,padding:20,boxShadow:"0 1px 4px #0001",marginBottom:16}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
      <div style={{fontWeight:700,fontSize:14}}>{title}</div>
      {action}
    </div>
    {children}
  </div>
);
const Btn=({onClick,children,variant="primary",size="md"})=>{
  const styles={primary:{background:"#6366f1",color:"#fff",border:"none"},secondary:{background:"#f1f5f9",color:"#475569",border:"none"},danger:{background:"#fef2f2",color:"#ef4444",border:"none"},outline:{background:"transparent",color:"#6366f1",border:"1px solid #6366f1"}};
  const sizes={sm:{padding:"4px 12px",fontSize:11},md:{padding:"7px 16px",fontSize:13},lg:{padding:"9px 22px",fontSize:14}};
  return <button onClick={onClick} style={{...styles[variant],...sizes[size],borderRadius:8,fontWeight:700,cursor:"pointer"}}>{children}</button>;
};
const Th=({children,onClick})=><th onClick={onClick} style={{padding:"10px 12px",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.5,color:"#64748b",background:"#f8fafc",cursor:onClick?"pointer":"default",whiteSpace:"nowrap",borderBottom:"2px solid #e2e8f0",textAlign:"left"}}>{children}</th>;
const Td=({children,style={}})=><td style={{padding:"10px 12px",fontSize:13,borderBottom:"1px solid #f1f5f9",...style}}>{children}</td>;

// ─── MODAL ────────────────────────────────────────────────────────────────────
const Modal=({title,onClose,children,width=560})=>(
  <div style={{position:"fixed",inset:0,background:"#0008",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
    <div style={{background:"#fff",borderRadius:16,padding:28,width,maxWidth:"95vw",maxHeight:"90vh",overflow:"auto",boxShadow:"0 8px 40px #0003"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div style={{fontWeight:800,fontSize:16}}>{title}</div>
        <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#94a3b8"}}>×</button>
      </div>
      {children}
    </div>
  </div>
);

// ─── PROJECT FORM ─────────────────────────────────────────────────────────────
const ProjectForm=({init,onSave,onClose,colorIdx=0})=>{
  const [f,setF]=useState(init||{name:"",code:"",type:"Implementation",dept:"IT & Digital",owner:"",client:"",startDate:"",endDate:"",priority:"High",status:"Initiation",description:"",budget:"",vendor:"",progress:0,stage:"Initiation",health:"On Track",color:PROJECT_COLORS[colorIdx%PROJECT_COLORS.length]});
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {[["name","Project Name","text",true],["code","Project Code/ID","text"],["owner","Project Manager/Owner","text"],["client","Client/Stakeholder","text"],["vendor","Vendor/Partner","text"],["budget","Budget (₹)","number"]].map(([k,l,t,full])=>(
          <div key={k} style={{gridColumn:full?"1/-1":"auto"}}>
            <label style={labelS}>{l}</label>
            <input type={t||"text"} value={f[k]||""} onChange={e=>set(k,e.target.value)} style={inputS}/>
          </div>
        ))}
        {[["type","Project Type",PROJECT_TYPES],["dept","Department/Board",DEPARTMENTS],["priority","Priority",PRIORITIES],["status","Project Status",PROJ_STATUSES],["stage","Current Stage",LIFECYCLE_STAGES],["health","Project Health",["On Track","At Risk","Delayed"]]].map(([k,l,opts])=>(
          <div key={k}>
            <label style={labelS}>{l}</label>
            <select value={f[k]||""} onChange={e=>set(k,e.target.value)} style={inputS}>
              {opts.map(o=><option key={o}>{o}</option>)}
            </select>
          </div>
        ))}
        {[["startDate","Start Date"],["endDate","Target End Date"]].map(([k,l])=>(
          <div key={k}>
            <label style={labelS}>{l}</label>
            <input type="date" value={f[k]||""} onChange={e=>set(k,e.target.value)} style={inputS}/>
          </div>
        ))}
        <div>
          <label style={labelS}>Progress (%)</label>
          <input type="number" min={0} max={100} value={f.progress||0} onChange={e=>set("progress",+e.target.value)} style={inputS}/>
        </div>
        <div>
          <label style={labelS}>Project Colour</label>
          <div style={{display:"flex",gap:6,marginTop:4,flexWrap:"wrap"}}>
            {PROJECT_COLORS.map(c=><div key={c} onClick={()=>set("color",c)} style={{width:24,height:24,borderRadius:"50%",background:c,cursor:"pointer",border:f.color===c?"3px solid #1e293b":"2px solid transparent"}}/>)}
          </div>
        </div>
        <div style={{gridColumn:"1/-1"}}>
          <label style={labelS}>Project Description</label>
          <textarea value={f.description||""} onChange={e=>set("description",e.target.value)} rows={2} style={{...inputS,resize:"vertical"}}/>
        </div>
      </div>
      <div style={{display:"flex",gap:10,marginTop:20,justifyContent:"flex-end"}}>
        <Btn onClick={onClose} variant="secondary">Cancel</Btn>
        <Btn onClick={()=>{if(!f.name)return alert("Project name required");onSave(f);}}>Save Project</Btn>
      </div>
    </div>
  );
};

// ─── TASK FORM ────────────────────────────────────────────────────────────────
const TaskForm=({init,projects,deliverables,onSave,onClose})=>{
  const [f,setF]=useState(init||{project:"P001",category:"Strategy & Planning",task:"",description:"",assignee:"",priority:"Medium",status:"Not Started",startDate:"",dueDate:"",progress:0,notes:"",deliverableId:"",tags:""});
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const projDelivs=deliverables.filter(d=>d.project===f.project);
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div style={{gridColumn:"1/-1"}}>
          <label style={labelS}>Task Name *</label>
          <input value={f.task||""} onChange={e=>set("task",e.target.value)} style={inputS}/>
        </div>
        <div>
          <label style={labelS}>Project *</label>
          <select value={f.project||""} onChange={e=>set("project",e.target.value)} style={inputS}>
            {projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label style={labelS}>Linked Deliverable</label>
          <select value={f.deliverableId||""} onChange={e=>set("deliverableId",e.target.value)} style={inputS}>
            <option value="">None</option>
            {projDelivs.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
        <div>
          <label style={labelS}>Category</label>
          <select value={f.category||""} onChange={e=>set("category",e.target.value)} style={inputS}>
            {CATEGORIES.map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={labelS}>Assignee</label>
          <input value={f.assignee||""} onChange={e=>set("assignee",e.target.value)} style={inputS}/>
        </div>
        <div>
          <label style={labelS}>Priority</label>
          <select value={f.priority||""} onChange={e=>set("priority",e.target.value)} style={inputS}>
            {PRIORITIES.map(p=><option key={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label style={labelS}>Status</label>
          <select value={f.status||""} onChange={e=>set("status",e.target.value)} style={inputS}>
            {TASK_STATUSES.map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label style={labelS}>Start Date</label>
          <input type="date" value={f.startDate||""} onChange={e=>set("startDate",e.target.value)} style={inputS}/>
        </div>
        <div>
          <label style={labelS}>Due Date</label>
          <input type="date" value={f.dueDate||""} onChange={e=>set("dueDate",e.target.value)} style={inputS}/>
        </div>
        <div>
          <label style={labelS}>Progress (%)</label>
          <input type="number" min={0} max={100} value={f.progress||0} onChange={e=>set("progress",+e.target.value)} style={inputS}/>
        </div>
        <div>
          <label style={labelS}>Tags (comma-separated)</label>
          <input value={f.tags||""} onChange={e=>set("tags",e.target.value)} style={inputS}/>
        </div>
        <div style={{gridColumn:"1/-1"}}>
          <label style={labelS}>Description</label>
          <textarea value={f.description||""} onChange={e=>set("description",e.target.value)} rows={2} style={{...inputS,resize:"vertical"}}/>
        </div>
        <div style={{gridColumn:"1/-1"}}>
          <label style={labelS}>Notes</label>
          <textarea value={f.notes||""} onChange={e=>set("notes",e.target.value)} rows={2} style={{...inputS,resize:"vertical"}}/>
        </div>
      </div>
      <div style={{display:"flex",gap:10,marginTop:20,justifyContent:"flex-end"}}>
        <Btn onClick={onClose} variant="secondary">Cancel</Btn>
        <Btn onClick={()=>{if(!f.task)return alert("Task name required");onSave(f);}}>Save Task</Btn>
      </div>
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App(){
  const [nav,setNav]=useState("dashboard");
  const [projects,setProjects]=useState(seedProjects);
  const [tasks,setTasks]=useState(seedTasks);
  const [deliverables,setDeliverables]=useState(seedDeliverables);
  const [invoices,setInvoices]=useState(seedInvoices);
  const [pdar,setPdar]=useState(seedPDAR);
  const [risks,setRisks]=useState(seedRisks);
  const [modal,setModal]=useState(null); // {type, data}
  const [notifs,setNotifs]=useState([]);
  const [selectedProject,setSelectedProject]=useState(null);

  // notifications
  useEffect(()=>{
    const n=[];
    tasks.forEach(t=>{if(isOverdue(t.dueDate)&&t.status!=="Completed")n.push({type:"warning",msg:`Task overdue: ${t.task}`});});
    invoices.forEach(i=>{if(i.status==="Overdue")n.push({type:"danger",msg:`Invoice overdue: ${i.id} — ${fmt(i.outstanding)}`});});
    deliverables.forEach(d=>{if(isOverdue(d.dueDate)&&d.status!=="Completed")n.push({type:"warning",msg:`Deliverable overdue: ${d.name}`});});
    setNotifs(n);
  },[tasks,invoices,deliverables]);

  const projById=id=>projects.find(p=>p.id===id);
  const closeModal=()=>setModal(null);

  // ── DASHBOARD ──────────────────────────────────────────────────────────────
  const DashboardView=()=>{
    const totalTasks=tasks.length;
    const completed=tasks.filter(t=>t.status==="Completed").length;
    const inProgress=tasks.filter(t=>t.status==="In Progress").length;
    const blocked=tasks.filter(t=>t.status==="Blocked").length;
    const overdueTasks=tasks.filter(t=>isOverdue(t.dueDate)&&t.status!=="Completed").length;
    const criticalOpen=tasks.filter(t=>t.priority==="Critical"&&t.status!=="Completed").length;
    const avgProg=Math.round(tasks.reduce((a,t)=>a+t.progress,0)/totalTasks);
    const activeProjs=projects.filter(p=>p.status==="In Progress").length;
    const atRisk=projects.filter(p=>p.health==="At Risk"||p.health==="Delayed").length;

    const totalInvoiced=invoices.reduce((a,i)=>a+i.total,0);
    const totalPaid=invoices.filter(i=>i.status==="Paid").reduce((a,i)=>a+i.total,0);
    const totalOutstanding=invoices.filter(i=>i.status!=="Paid").reduce((a,i)=>a+i.outstanding,0);
    const overdueInv=invoices.filter(i=>i.status==="Overdue").length;
    const overdueAmt=invoices.filter(i=>i.status==="Overdue").reduce((a,i)=>a+i.outstanding,0);

    const statusBreak=[
      {l:"Not Started",c:tasks.filter(t=>t.status==="Not Started").length,col:"#94a3b8"},
      {l:"In Progress",c:inProgress,col:"#3b82f6"},
      {l:"Completed",c:completed,col:"#22c55e"},
      {l:"On Hold",c:tasks.filter(t=>t.status==="On Hold").length,col:"#f59e0b"},
      {l:"Blocked",c:blocked,col:"#ef4444"},
    ];

    const MiniBar=({label,val,total,color})=>(
      <div style={{marginBottom:10}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}>
          <span style={{display:"flex",alignItems:"center",gap:6}}><span style={{width:8,height:8,borderRadius:"50%",background:color,display:"inline-block"}}/>{label}</span>
          <span style={{fontWeight:700}}>{val} <span style={{color:"#94a3b8",fontWeight:400}}>({Math.round(val/total*100)||0}%)</span></span>
        </div>
        <div style={{background:"#f1f5f9",borderRadius:10,height:8}}>
          <div style={{background:color,borderRadius:10,height:"100%",width:`${Math.round(val/total*100)||0}%`}}/>
        </div>
      </div>
    );

    return (
      <div style={{padding:24,maxWidth:1300,margin:"0 auto"}}>
        {notifs.length>0&&(
          <div style={{background:"#fffbeb",border:"1px solid #f59e0b",borderRadius:10,padding:"10px 16px",marginBottom:16,display:"flex",flexWrap:"wrap",gap:8,alignItems:"center"}}>
            <span style={{fontWeight:700,fontSize:12,color:"#b45309"}}>⚠️ {notifs.length} Alert{notifs.length>1?"s":""}</span>
            {notifs.slice(0,3).map((n,i)=><span key={i} style={{fontSize:11,color:"#92400e",background:"#fef3c7",borderRadius:6,padding:"2px 8px"}}>{n.msg}</span>)}
            {notifs.length>3&&<span style={{fontSize:11,color:"#92400e"}}>+{notifs.length-3} more</span>}
          </div>
        )}

        <div style={{fontWeight:800,fontSize:16,marginBottom:16,color:"#1e293b"}}>📊 Overview</div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:20}}>
          <KPI label="Active Projects" value={activeProjs} color="#6366f1"/>
          <KPI label="Projects at Risk" value={atRisk} color="#f59e0b"/>
          <KPI label="Total Tasks" value={totalTasks}/>
          <KPI label="Overall Progress" value={`${avgProg}%`} color="#6366f1"/>
          <KPI label="Completed" value={completed} color="#22c55e"/>
          <KPI label="In Progress" value={inProgress} color="#3b82f6"/>
          <KPI label="Overdue Tasks" value={overdueTasks} color="#ef4444"/>
          <KPI label="Critical Open" value={criticalOpen} color="#dc2626"/>
        </div>

        <div style={{fontWeight:800,fontSize:16,marginBottom:16,color:"#1e293b"}}>🧾 Invoice Summary</div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:20}}>
          <KPI label="Total Invoiced" value={fmt(totalInvoiced)} color="#6366f1" onClick={()=>setNav("invoices")}/>
          <KPI label="Total Paid" value={fmt(totalPaid)} color="#22c55e" onClick={()=>setNav("invoices")}/>
          <KPI label="Outstanding" value={fmt(totalOutstanding)} color="#f59e0b" onClick={()=>setNav("invoices")}/>
          <KPI label="Overdue Amount" value={fmt(overdueAmt)} color="#ef4444" onClick={()=>setNav("invoices")}/>
          <KPI label="Total Invoices" value={invoices.length}/>
          <KPI label="Paid Invoices" value={invoices.filter(i=>i.status==="Paid").length} color="#22c55e"/>
          <KPI label="Pending" value={invoices.filter(i=>!["Paid","Rejected"].includes(i.status)).length} color="#f59e0b"/>
          <KPI label="Overdue Invoices" value={overdueInv} color="#ef4444" onClick={()=>setNav("invoices")}/>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
          <Section title="Status Breakdown">
            {statusBreak.map(s=><MiniBar key={s.l} label={s.l} val={s.c} total={totalTasks} color={s.col}/>)}
          </Section>
          <Section title="Priority Distribution">
            {PRIORITIES.map(p=>{const c=tasks.filter(t=>t.priority===p).length;return <MiniBar key={p} label={p} val={c} total={totalTasks} color={PRIO_COLORS[p]}/>;}) }
          </Section>
        </div>

        <Section title="Project Health & Progress">
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>
            {projects.map(p=>{
              const pt=tasks.filter(t=>t.project===p.id);
              const pd=deliverables.filter(d=>d.project===p.id);
              const pi=invoices.filter(i=>i.project===p.id);
              return (
                <div key={p.id} onClick={()=>{setSelectedProject(p.id);setNav("projects");}} style={{background:"#f8fafc",borderRadius:12,padding:16,cursor:"pointer",border:`1px solid #e2e8f0`,borderTop:`4px solid ${p.color}`,transition:"box-shadow .2s"}}
                  onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 12px #0002"}
                  onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                    <div style={{fontWeight:700,fontSize:13}}>{p.name}</div>
                    <span style={{background:`${HEALTH[p.health]}22`,color:HEALTH[p.health],borderRadius:20,padding:"1px 8px",fontSize:10,fontWeight:700}}>{p.health}</span>
                  </div>
                  <div style={{fontSize:11,color:"#64748b",marginBottom:8}}>{p.stage} · {pt.length} tasks · {pd.length} deliverables</div>
                  <ProgressBar pct={p.progress} color={p.color}/>
                  <div style={{display:"flex",justifyContent:"space-between",marginTop:6,fontSize:11}}>
                    <span style={{color:p.color,fontWeight:700}}>{p.progress}%</span>
                    <span style={{color:"#94a3b8"}}>{pi.length} invoice{pi.length!==1?"s":""}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        <Section title="Invoice Status Distribution">
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:10}}>
            {INV_STATUSES.filter(s=>invoices.some(i=>i.status===s)).map(s=>{
              const c=invoices.filter(i=>i.status===s);
              const sc=STATUS_COLORS[s]||STATUS_COLORS["Not Started"];
              return (
                <div key={s} style={{background:sc.bg,borderRadius:10,padding:"10px 14px",border:`1px solid ${sc.text}22`}}>
                  <div style={{fontSize:11,color:sc.text,fontWeight:600}}>{s}</div>
                  <div style={{fontSize:20,fontWeight:800,color:sc.text,marginTop:2}}>{c.length}</div>
                  <div style={{fontSize:11,color:sc.text,opacity:.8}}>{fmt(c.reduce((a,i)=>a+i.total,0))}</div>
                </div>
              );
            })}
          </div>
        </Section>
      </div>
    );
  };

  // ── PROJECTS VIEW ──────────────────────────────────────────────────────────
  const ProjectsView=()=>{
    const [view,setView]=useState(selectedProject?"detail":"list");
    const [selId,setSelId]=useState(selectedProject);
    const [tab,setTab]=useState("overview");
    const proj=projects.find(p=>p.id===selId);

    useEffect(()=>{if(selectedProject){setSelId(selectedProject);setView("detail");setSelectedProject(null);}}, []);

    if(view==="detail"&&proj){
      const pt=tasks.filter(t=>t.project===proj.id);
      const pd=deliverables.filter(d=>d.project===proj.id);
      const pi=invoices.filter(i=>i.project===proj.id);
      const pp=pdar.filter(e=>e.project===proj.id);
      const pr=risks.filter(r=>r.project===proj.id);
      const TABS=["overview","tasks","deliverables","pdar","risks","invoices","lifecycle"];
      return (
        <div style={{padding:24,maxWidth:1300,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
            <button onClick={()=>setView("list")} style={{background:"none",border:"none",cursor:"pointer",color:"#6366f1",fontWeight:700,fontSize:13}}>← Back to Projects</button>
            <span style={{color:"#e2e8f0"}}>/</span>
            <span style={{fontWeight:700,color:"#1e293b"}}>{proj.name}</span>
            <span style={{background:`${HEALTH[proj.health]}22`,color:HEALTH[proj.health],borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700,marginLeft:"auto"}}>{proj.health}</span>
            <StatusBadge s={proj.status}/>
            <Btn onClick={()=>setModal({type:"editProject",data:proj})} variant="outline" size="sm">Edit Project</Btn>
          </div>

          <div style={{background:"#fff",borderRadius:14,padding:"0",boxShadow:"0 1px 4px #0001",marginBottom:16,overflow:"hidden"}}>
            <div style={{background:`linear-gradient(135deg,${proj.color}22,${proj.color}08)`,padding:"20px 24px",borderBottom:"1px solid #f1f5f9"}}>
              <div style={{display:"flex",gap:24,flexWrap:"wrap",alignItems:"flex-start"}}>
                <div style={{flex:1,minWidth:200}}>
                  <div style={{fontSize:10,color:"#94a3b8",fontWeight:700,textTransform:"uppercase"}}>Project Code</div>
                  <div style={{fontWeight:700,color:proj.color}}>{proj.code}</div>
                </div>
                {[["Owner/PM",proj.owner],["Client",proj.client],["Type",proj.type],["Department",proj.dept],["Budget",fmt(proj.budget||0)],["Vendor",proj.vendor||"—"]].map(([l,v])=>(
                  <div key={l} style={{minWidth:120}}>
                    <div style={{fontSize:10,color:"#94a3b8",fontWeight:700,textTransform:"uppercase"}}>{l}</div>
                    <div style={{fontWeight:600,fontSize:13,color:"#1e293b"}}>{v}</div>
                  </div>
                ))}
                <div style={{minWidth:200,flex:1}}>
                  <div style={{fontSize:10,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",marginBottom:4}}>Overall Progress</div>
                  <ProgressBar pct={proj.progress} color={proj.color}/>
                  <div style={{fontSize:12,fontWeight:700,color:proj.color,marginTop:4}}>{proj.progress}% complete</div>
                </div>
              </div>
              {proj.description&&<div style={{fontSize:12,color:"#64748b",marginTop:12}}>{proj.description}</div>}
            </div>
            <div style={{display:"flex",gap:0,borderBottom:"2px solid #f1f5f9",overflowX:"auto"}}>
              {TABS.map(t=><button key={t} onClick={()=>setTab(t)} style={{padding:"12px 20px",border:"none",background:"none",fontWeight:tab===t?700:500,color:tab===t?proj.color:"#64748b",borderBottom:tab===t?`2px solid ${proj.color}`:"2px solid transparent",cursor:"pointer",whiteSpace:"nowrap",fontSize:13,textTransform:"capitalize"}}>{t}</button>)}
            </div>
            <div style={{padding:20}}>
              {tab==="overview"&&(
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                  <div>
                    <div style={{fontWeight:700,marginBottom:10,fontSize:13}}>Quick Stats</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                      {[[`${pt.length}`,`Tasks`],[`${pt.filter(t=>t.status==="Completed").length}`,`Completed Tasks`],[`${pd.length}`,`Deliverables`],[`${pi.length}`,`Invoices`],[`${pp.length}`,`PDAR Entries`],[`${pr.filter(r=>r.status==="Open").length}`,`Open Risks`]].map(([v,l])=>(
                        <div key={l} style={{background:"#f8fafc",borderRadius:10,padding:"10px 14px"}}>
                          <div style={{fontSize:20,fontWeight:800,color:proj.color}}>{v}</div>
                          <div style={{fontSize:11,color:"#64748b"}}>{l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{fontWeight:700,marginBottom:10,fontSize:13}}>Dates & Financials</div>
                    {[["Start Date",proj.startDate],["End Date",proj.endDate],["Current Stage",proj.stage],["Budget",fmt(proj.budget||0)],["Total Invoiced",fmt(pi.reduce((a,i)=>a+i.total,0))],["Outstanding",fmt(pi.filter(i=>i.status!=="Paid").reduce((a,i)=>a+i.outstanding,0))]].map(([l,v])=>(
                      <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #f1f5f9",fontSize:13}}>
                        <span style={{color:"#64748b"}}>{l}</span><span style={{fontWeight:600}}>{v||"—"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {tab==="tasks"&&(
                <div>
                  <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}>
                    <Btn onClick={()=>setModal({type:"addTask",data:{project:proj.id}})} size="sm">+ Add Task</Btn>
                  </div>
                  {pt.length===0?<div style={{color:"#94a3b8",textAlign:"center",padding:20}}>No tasks yet. Add your first task.</div>:(
                    <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                      <thead><tr><Th>Task</Th><Th>Assignee</Th><Th>Priority</Th><Th>Status</Th><Th>Due</Th><Th>Progress</Th></tr></thead>
                      <tbody>{pt.map(t=>(
                        <tr key={t.id} style={{background:"#fff"}}>
                          <Td><div style={{fontWeight:600}}>{t.task}</div><div style={{fontSize:11,color:"#94a3b8"}}>{t.category}</div></Td>
                          <Td>{t.assignee}</Td>
                          <Td><span style={{color:PRIO_COLORS[t.priority],fontWeight:700,fontSize:12}}>● {t.priority}</span></Td>
                          <Td><StatusBadge s={t.status}/></Td>
                          <Td style={{color:isOverdue(t.dueDate)&&t.status!=="Completed"?"#ef4444":"#64748b"}}>{t.dueDate||"—"}</Td>
                          <Td><ProgressBar pct={t.progress}/><div style={{fontSize:11,color:"#64748b",marginTop:2}}>{t.progress}%</div></Td>
                        </tr>
                      ))}</tbody>
                    </table>
                  )}
                </div>
              )}
              {tab==="deliverables"&&(
                <div>
                  <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}>
                    <Btn onClick={()=>setModal({type:"addDeliverable",data:{project:proj.id}})} size="sm">+ Add Deliverable</Btn>
                  </div>
                  {pd.length===0?<div style={{color:"#94a3b8",textAlign:"center",padding:20}}>No deliverables yet.</div>:(
                    <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                      <thead><tr><Th>Deliverable</Th><Th>Owner</Th><Th>Status</Th><Th>Due</Th><Th>Approval</Th><Th>Progress</Th></tr></thead>
                      <tbody>{pd.map(d=>(
                        <tr key={d.id}><Td><div style={{fontWeight:600}}>{d.name}</div><div style={{fontSize:11,color:"#94a3b8"}}>{d.id}</div></Td><Td>{d.owner}</Td><Td><StatusBadge s={d.status}/></Td><Td style={{color:isOverdue(d.dueDate)&&d.status!=="Completed"?"#ef4444":"#64748b"}}>{d.dueDate||"—"}</Td><Td><span style={{fontSize:12,color:"#64748b"}}>{d.approvalStatus}</span></Td><Td><ProgressBar pct={d.progress}/><span style={{fontSize:11,color:"#64748b"}}>{d.progress}%</span></Td></tr>
                      ))}</tbody>
                    </table>
                  )}
                </div>
              )}
              {tab==="pdar"&&(
                <div>
                  <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}>
                    <Btn onClick={()=>setModal({type:"addPDAR",data:{project:proj.id}})} size="sm">+ Add Entry</Btn>
                  </div>
                  {pp.length===0?<div style={{color:"#94a3b8",textAlign:"center",padding:20}}>No PDAR entries yet.</div>:(
                    <div style={{display:"flex",flexDirection:"column",gap:10}}>
                      {pp.sort((a,b)=>b.date.localeCompare(a.date)).map(e=>(
                        <div key={e.id} style={{background:"#f8fafc",borderRadius:10,padding:"12px 16px",borderLeft:"3px solid #6366f1"}}>
                          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                            <span style={{fontWeight:700,fontSize:13}}>{e.date}</span>
                            <StatusBadge s={e.status}/>
                          </div>
                          <div style={{fontSize:13,color:"#1e293b",marginBottom:4}}>{e.activity}</div>
                          {e.issues&&<div style={{fontSize:12,color:"#ef4444"}}>⚠️ {e.issues}</div>}
                          <div style={{fontSize:11,color:"#94a3b8",marginTop:4}}>👤 {e.persons} · 📍 {e.location}</div>
                          {e.followUp&&<div style={{fontSize:11,color:"#f59e0b",marginTop:2}}>Follow-up: {e.followUpDate}</div>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {tab==="risks"&&(
                <div>
                  <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}>
                    <Btn onClick={()=>setModal({type:"addRisk",data:{project:proj.id}})} size="sm">+ Add Risk/Issue</Btn>
                  </div>
                  {pr.length===0?<div style={{color:"#94a3b8",textAlign:"center",padding:20}}>No risks or issues logged.</div>:(
                    <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                      <thead><tr><Th>ID</Th><Th>Type</Th><Th>Description</Th><Th>Severity</Th><Th>Status</Th><Th>Owner</Th><Th>Target</Th></tr></thead>
                      <tbody>{pr.map(r=>(
                        <tr key={r.id}><Td style={{color:"#94a3b8",fontWeight:600}}>{r.id}</Td><Td><Badge label={r.type} color={r.type==="Risk"?"#fef2f2":r.type==="Issue"?"#fff7ed":"#f0f9ff"} textColor={r.type==="Risk"?"#dc2626":r.type==="Issue"?"#ea580c":"#0369a1"}/></Td><Td style={{maxWidth:200}}>{r.description}</Td><Td><span style={{color:PRIO_COLORS[r.severity],fontWeight:700,fontSize:12}}>● {r.severity}</span></Td><Td><Badge label={r.status} color={r.status==="Resolved"?"#f0fdf4":"#fef2f2"} textColor={r.status==="Resolved"?"#15803d":"#b91c1c"}/></Td><Td>{r.owner}</Td><Td style={{fontSize:12,color:"#64748b"}}>{r.targetDate}</Td></tr>
                      ))}</tbody>
                    </table>
                  )}
                </div>
              )}
              {tab==="invoices"&&(
                <div>
                  <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}>
                    <Btn onClick={()=>setModal({type:"addInvoice",data:{project:proj.id}})} size="sm">+ Add Invoice</Btn>
                  </div>
                  {pi.length===0?<div style={{color:"#94a3b8",textAlign:"center",padding:20}}>No invoices yet.</div>:(
                    <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                      <thead><tr><Th>Invoice #</Th><Th>Type</Th><Th>Amount</Th><Th>Status</Th><Th>Due</Th><Th>Outstanding</Th></tr></thead>
                      <tbody>{pi.map(i=>(
                        <tr key={i.id}><Td style={{fontWeight:600,color:"#6366f1"}}>{i.id}</Td><Td>{i.type}</Td><Td style={{fontWeight:600}}>{fmt(i.total)}</Td><Td><StatusBadge s={i.status}/></Td><Td style={{color:isOverdue(i.dueDate)&&i.status!=="Paid"?"#ef4444":"#64748b"}}>{i.dueDate}</Td><Td style={{fontWeight:600,color:i.outstanding>0?"#f59e0b":"#22c55e"}}>{fmt(i.outstanding)}</Td></tr>
                      ))}</tbody>
                    </table>
                  )}
                </div>
              )}
              {tab==="lifecycle"&&(
                <div>
                  <div style={{fontWeight:700,fontSize:13,marginBottom:16}}>Project Lifecycle — Current Stage: <span style={{color:proj.color}}>{proj.stage}</span></div>
                  <div style={{display:"flex",gap:0,overflowX:"auto",paddingBottom:8}}>
                    {LIFECYCLE_STAGES.map((s,i)=>{
                      const done=LIFECYCLE_STAGES.indexOf(proj.stage)>i;
                      const current=proj.stage===s;
                      return (
                        <div key={s} style={{display:"flex",alignItems:"center",minWidth:0}}>
                          <div style={{textAlign:"center",padding:"12px 14px",borderRadius:10,background:current?proj.color:done?"#f0fdf4":"#f8fafc",border:`2px solid ${current?proj.color:done?"#22c55e":"#e2e8f0"}`,minWidth:100}}>
                            <div style={{fontSize:16}}>{done?"✅":current?"🔵":"⚪"}</div>
                            <div style={{fontSize:11,fontWeight:700,color:current?"#fff":done?"#15803d":"#64748b",marginTop:4,whiteSpace:"nowrap"}}>{s}</div>
                          </div>
                          {i<LIFECYCLE_STAGES.length-1&&<div style={{width:20,height:2,background:done?"#22c55e":"#e2e8f0",flexShrink:0}}/>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div style={{padding:24,maxWidth:1300,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div style={{fontWeight:800,fontSize:16}}>🗂 Projects ({projects.length})</div>
          <Btn onClick={()=>setModal({type:"addProject"})}>+ New Project</Btn>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:16}}>
          {projects.map(p=>{
            const pt=tasks.filter(t=>t.project===p.id);
            const pi=invoices.filter(i=>i.project===p.id);
            const pr=risks.filter(r=>r.project===p.id&&r.status==="Open");
            return (
              <div key={p.id} onClick={()=>{setSelId(p.id);setView("detail");setTab("overview");}} style={{background:"#fff",borderRadius:14,overflow:"hidden",boxShadow:"0 1px 4px #0001",cursor:"pointer",border:"1px solid #e2e8f0",transition:"box-shadow .2s"}}
                onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 16px #0002"}
                onMouseLeave={e=>e.currentTarget.style.boxShadow="0 1px 4px #0001"}>
                <div style={{height:5,background:p.color}}/>
                <div style={{padding:18}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                    <div>
                      <div style={{fontWeight:700,fontSize:14}}>{p.name}</div>
                      <div style={{fontSize:11,color:"#94a3b8"}}>{p.code} · {p.type}</div>
                    </div>
                    <span style={{background:`${HEALTH[p.health]}22`,color:HEALTH[p.health],borderRadius:20,padding:"2px 8px",fontSize:10,fontWeight:700,flexShrink:0}}>{p.health}</span>
                  </div>
                  <div style={{fontSize:12,color:"#64748b",marginBottom:10,lineHeight:1.4}}>{p.description?.slice(0,80)}{p.description?.length>80?"…":""}</div>
                  <ProgressBar pct={p.progress} color={p.color}/>
                  <div style={{display:"flex",justifyContent:"space-between",marginTop:8,fontSize:11,color:"#94a3b8"}}>
                    <span>{p.stage}</span><span style={{fontWeight:700,color:p.color}}>{p.progress}%</span>
                  </div>
                  <div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap"}}>
                    <StatusBadge s={p.status}/>
                    <span style={{fontSize:11,color:"#64748b",background:"#f1f5f9",borderRadius:6,padding:"2px 8px"}}>{pt.length} tasks</span>
                    <span style={{fontSize:11,color:"#64748b",background:"#f1f5f9",borderRadius:6,padding:"2px 8px"}}>{pi.length} invoices</span>
                    {pr.length>0&&<span style={{fontSize:11,color:"#dc2626",background:"#fef2f2",borderRadius:6,padding:"2px 8px"}}>⚠️ {pr.length} risks</span>}
                  </div>
                  <div style={{marginTop:10,fontSize:11,color:"#94a3b8"}}>👤 {p.owner} · 📅 {p.endDate||"—"}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ── TASKS VIEW ─────────────────────────────────────────────────────────────
  const TasksView=()=>{
    const [fp,setFp]=useState("All");
    const [fs,setFs]=useState("All");
    const [fpr,setFpr]=useState("All");
    const [search,setSearch]=useState("");
    const [editId,setEditId]=useState(null);

    const filtered=useMemo(()=>{
      let t=tasks;
      if(fp!=="All")t=t.filter(x=>x.project===fp);
      if(fs!=="All")t=t.filter(x=>x.status===fs);
      if(fpr!=="All")t=t.filter(x=>x.priority===fpr);
      if(search)t=t.filter(x=>x.task.toLowerCase().includes(search.toLowerCase())||x.assignee.toLowerCase().includes(search.toLowerCase()));
      return t;
    },[tasks,fp,fs,fpr,search]);

    return (
      <div style={{padding:24,maxWidth:1400,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={{fontWeight:800,fontSize:16}}>✅ Tasks ({filtered.length})</div>
          <Btn onClick={()=>setModal({type:"addTask"})}>+ Add Task</Btn>
        </div>
        <div style={{background:"#fff",borderRadius:12,padding:"12px 16px",marginBottom:16,display:"flex",gap:10,flexWrap:"wrap",alignItems:"center",boxShadow:"0 1px 4px #0001"}}>
          <input placeholder="🔍 Search tasks…" value={search} onChange={e=>setSearch(e.target.value)} style={{...inputS,maxWidth:220}}/>
          <select value={fp} onChange={e=>setFp(e.target.value)} style={{...inputS,maxWidth:170}}>
            <option value="All">All Projects</option>
            {projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select value={fs} onChange={e=>setFs(e.target.value)} style={{...inputS,maxWidth:150}}>
            <option value="All">All Statuses</option>
            {TASK_STATUSES.map(s=><option key={s}>{s}</option>)}
          </select>
          <select value={fpr} onChange={e=>setFpr(e.target.value)} style={{...inputS,maxWidth:140}}>
            <option value="All">All Priorities</option>
            {PRIORITIES.map(p=><option key={p}>{p}</option>)}
          </select>
        </div>
        <div style={{background:"#fff",borderRadius:14,boxShadow:"0 1px 4px #0001",overflow:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead><tr><Th>#</Th><Th>Project</Th><Th>Task</Th><Th>Assignee</Th><Th>Priority</Th><Th>Status</Th><Th>Due Date</Th><Th>Progress</Th><Th>Actions</Th></tr></thead>
            <tbody>
              {filtered.map((t,i)=>{
                const p=projById(t.project);
                const overdue=isOverdue(t.dueDate)&&t.status!=="Completed";
                return (
                  <tr key={t.id} style={{background:i%2===0?"#fff":"#f8fafc"}}>
                    <Td style={{color:"#94a3b8",fontWeight:600}}>{t.id}</Td>
                    <Td><span style={{background:p?.color+"18",color:p?.color,borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:700}}>{p?.name}</span></Td>
                    <Td style={{maxWidth:200}}>
                      <div style={{fontWeight:600}}>{t.task}</div>
                      <div style={{fontSize:11,color:"#94a3b8"}}>{t.category}</div>
                      {t.tags&&t.tags.length>0&&<div style={{display:"flex",gap:4,marginTop:3,flexWrap:"wrap"}}>{(Array.isArray(t.tags)?t.tags:t.tags.split(",")).filter(Boolean).map(tag=><span key={tag} style={{background:"#eff6ff",color:"#3b82f6",borderRadius:4,padding:"1px 5px",fontSize:10}}>{tag.trim()}</span>)}</div>}
                    </Td>
                    <Td>{t.assignee}</Td>
                    <Td><span style={{color:PRIO_COLORS[t.priority],fontWeight:700,fontSize:12}}>● {t.priority}</span></Td>
                    <Td><StatusBadge s={t.status}/></Td>
                    <Td style={{color:overdue?"#ef4444":"#64748b",fontWeight:overdue?700:400}}>{t.dueDate||"—"}{overdue&&" ⚠️"}</Td>
                    <Td style={{minWidth:110}}>
                      <ProgressBar pct={t.progress}/>
                      <div style={{fontSize:11,color:"#64748b",marginTop:2}}>{t.progress}%</div>
                    </Td>
                    <Td>
                      <div style={{display:"flex",gap:6}}>
                        <Btn onClick={()=>setModal({type:"editTask",data:t})} variant="secondary" size="sm">Edit</Btn>
                        <Btn onClick={()=>{if(confirm("Delete task?"))setTasks(ts=>ts.filter(x=>x.id!==t.id));}} variant="danger" size="sm">Del</Btn>
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length===0&&<div style={{textAlign:"center",padding:32,color:"#94a3b8"}}>No tasks match the current filters.</div>}
        </div>
      </div>
    );
  };

  // ── DELIVERABLES VIEW ──────────────────────────────────────────────────────
  const DeliverablesView=()=>{
    const [fp,setFp]=useState("All");
    const [fs,setFs]=useState("All");
    const filtered=deliverables.filter(d=>(fp==="All"||d.project===fp)&&(fs==="All"||d.status===fs));
    return (
      <div style={{padding:24,maxWidth:1300,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={{fontWeight:800,fontSize:16}}>📦 Deliverables ({filtered.length})</div>
          <Btn onClick={()=>setModal({type:"addDeliverable"})}>+ Add Deliverable</Btn>
        </div>
        <div style={{background:"#fff",borderRadius:12,padding:"12px 16px",marginBottom:16,display:"flex",gap:10,flexWrap:"wrap",boxShadow:"0 1px 4px #0001"}}>
          <select value={fp} onChange={e=>setFp(e.target.value)} style={{...inputS,maxWidth:170}}>
            <option value="All">All Projects</option>
            {projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select value={fs} onChange={e=>setFs(e.target.value)} style={{...inputS,maxWidth:160}}>
            <option value="All">All Statuses</option>
            {DELIV_STATUSES.map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
        <div style={{background:"#fff",borderRadius:14,boxShadow:"0 1px 4px #0001",overflow:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead><tr><Th>ID</Th><Th>Project</Th><Th>Deliverable</Th><Th>Owner</Th><Th>Status</Th><Th>Due</Th><Th>Approval</Th><Th>Progress</Th><Th>Actions</Th></tr></thead>
            <tbody>
              {filtered.map((d,i)=>{
                const p=projById(d.project);
                const overdue=isOverdue(d.dueDate)&&d.status!=="Completed";
                return (
                  <tr key={d.id} style={{background:i%2===0?"#fff":"#f8fafc"}}>
                    <Td style={{color:"#94a3b8",fontWeight:600,fontSize:11}}>{d.id}</Td>
                    <Td><span style={{background:p?.color+"18",color:p?.color,borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:700}}>{p?.name}</span></Td>
                    <Td style={{maxWidth:200}}><div style={{fontWeight:600}}>{d.name}</div><div style={{fontSize:11,color:"#94a3b8"}}>{d.description?.slice(0,50)}</div></Td>
                    <Td>{d.owner}</Td>
                    <Td><StatusBadge s={d.status}/></Td>
                    <Td style={{color:overdue?"#ef4444":"#64748b",fontWeight:overdue?700:400}}>{d.dueDate||"—"}{overdue&&" ⚠️"}</Td>
                    <Td><span style={{fontSize:12,color:"#64748b"}}>{d.approvalStatus}</span></Td>
                    <Td style={{minWidth:100}}><ProgressBar pct={d.progress}/><div style={{fontSize:11,color:"#64748b",marginTop:2}}>{d.progress}%</div></Td>
                    <Td>
                      <div style={{display:"flex",gap:6}}>
                        <Btn onClick={()=>setModal({type:"editDeliverable",data:d})} variant="secondary" size="sm">Edit</Btn>
                        <Btn onClick={()=>{if(confirm("Delete?"))setDeliverables(ds=>ds.filter(x=>x.id!==d.id));}} variant="danger" size="sm">Del</Btn>
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length===0&&<div style={{textAlign:"center",padding:32,color:"#94a3b8"}}>No deliverables found.</div>}
        </div>
      </div>
    );
  };

  // ── PDAR VIEW ──────────────────────────────────────────────────────────────
  const PDARView=()=>{
    const [fp,setFp]=useState("All");
    const [search,setSearch]=useState("");
    const filtered=pdar.filter(e=>(fp==="All"||e.project===fp)&&(!search||e.activity.toLowerCase().includes(search.toLowerCase()))).sort((a,b)=>b.date.localeCompare(a.date));
    return (
      <div style={{padding:24,maxWidth:1100,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={{fontWeight:800,fontSize:16}}>📋 PDAR — Project Daily Activity Report ({filtered.length} entries)</div>
          <Btn onClick={()=>setModal({type:"addPDAR"})}>+ Add Entry</Btn>
        </div>
        <div style={{background:"#fff",borderRadius:12,padding:"12px 16px",marginBottom:16,display:"flex",gap:10,flexWrap:"wrap",boxShadow:"0 1px 4px #0001"}}>
          <input placeholder="🔍 Search activities…" value={search} onChange={e=>setSearch(e.target.value)} style={{...inputS,maxWidth:220}}/>
          <select value={fp} onChange={e=>setFp(e.target.value)} style={{...inputS,maxWidth:170}}>
            <option value="All">All Projects</option>
            {projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {filtered.map(e=>{
            const p=projById(e.project);
            return (
              <div key={e.id} style={{background:"#fff",borderRadius:14,padding:20,boxShadow:"0 1px 4px #0001",borderLeft:`4px solid ${p?.color||"#6366f1"}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8,marginBottom:8}}>
                  <div>
                    <span style={{fontWeight:800,fontSize:15,color:"#1e293b"}}>{e.date}</span>
                    <span style={{background:p?.color+"18",color:p?.color,borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:700,marginLeft:10}}>{p?.name}</span>
                  </div>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <StatusBadge s={e.status}/>
                    <Btn onClick={()=>setModal({type:"editPDAR",data:e})} variant="secondary" size="sm">Edit</Btn>
                    <Btn onClick={()=>{if(confirm("Delete?"))setPdar(ps=>ps.filter(x=>x.id!==e.id));}} variant="danger" size="sm">Del</Btn>
                  </div>
                </div>
                <div style={{fontSize:13,color:"#1e293b",marginBottom:6,lineHeight:1.5}}>{e.activity}</div>
                {e.remarks&&<div style={{fontSize:12,color:"#475569",marginBottom:4}}>💬 {e.remarks}</div>}
                {e.issues&&<div style={{fontSize:12,color:"#ef4444",marginBottom:4}}>⚠️ Issues: {e.issues}</div>}
                <div style={{display:"flex",gap:16,fontSize:11,color:"#94a3b8",flexWrap:"wrap",marginTop:6}}>
                  <span>👤 {e.manager}</span>
                  <span>📍 {e.location}</span>
                  <span>👥 {e.persons}</span>
                  {e.followUp&&<span style={{color:"#f59e0b",fontWeight:600}}>📅 Follow-up: {e.followUpDate}</span>}
                </div>
              </div>
            );
          })}
          {filtered.length===0&&<div style={{textAlign:"center",padding:32,color:"#94a3b8",background:"#fff",borderRadius:14}}>No PDAR entries found.</div>}
        </div>
      </div>
    );
  };

  // ── INVOICES VIEW ──────────────────────────────────────────────────────────
  const InvoicesView=()=>{
    const [fp,setFp]=useState("All");
    const [fs,setFs]=useState("All");
    const filtered=invoices.filter(i=>(fp==="All"||i.project===fp)&&(fs==="All"||i.status===fs));
    const totalAmt=filtered.reduce((a,i)=>a+i.total,0);
    const totalOutstanding=filtered.reduce((a,i)=>a+i.outstanding,0);
    return (
      <div style={{padding:24,maxWidth:1300,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={{fontWeight:800,fontSize:16}}>🧾 Invoice Management ({filtered.length})</div>
          <Btn onClick={()=>setModal({type:"addInvoice"})}>+ Add Invoice</Btn>
        </div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:16}}>
          <KPI label="Total Amount" value={fmt(totalAmt)} color="#6366f1"/>
          <KPI label="Outstanding" value={fmt(totalOutstanding)} color="#f59e0b"/>
          <KPI label="Paid" value={fmt(filtered.filter(i=>i.status==="Paid").reduce((a,i)=>a+i.total,0))} color="#22c55e"/>
          <KPI label="Overdue" value={filtered.filter(i=>i.status==="Overdue").length} color="#ef4444"/>
        </div>
        <div style={{background:"#fff",borderRadius:12,padding:"12px 16px",marginBottom:16,display:"flex",gap:10,flexWrap:"wrap",boxShadow:"0 1px 4px #0001"}}>
          <select value={fp} onChange={e=>setFp(e.target.value)} style={{...inputS,maxWidth:170}}>
            <option value="All">All Projects</option>
            {projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select value={fs} onChange={e=>setFs(e.target.value)} style={{...inputS,maxWidth:160}}>
            <option value="All">All Statuses</option>
            {INV_STATUSES.map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
        <div style={{background:"#fff",borderRadius:14,boxShadow:"0 1px 4px #0001",overflow:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead><tr><Th>Invoice #</Th><Th>Project</Th><Th>Type</Th><Th>Client</Th><Th>Amount</Th><Th>Tax</Th><Th>Total</Th><Th>Status</Th><Th>Due</Th><Th>Outstanding</Th><Th>Actions</Th></tr></thead>
            <tbody>
              {filtered.map((inv,i)=>{
                const p=projById(inv.project);
                const overdue=isOverdue(inv.dueDate)&&inv.status!=="Paid";
                return (
                  <tr key={inv.id} style={{background:i%2===0?"#fff":"#f8fafc"}}>
                    <Td style={{fontWeight:700,color:"#6366f1"}}>{inv.id}</Td>
                    <Td><span style={{background:p?.color+"18",color:p?.color,borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:700}}>{p?.name}</span></Td>
                    <Td>{inv.type}</Td>
                    <Td style={{fontSize:12}}>{inv.client}</Td>
                    <Td style={{fontWeight:600}}>₹{inv.amount.toLocaleString()}</Td>
                    <Td style={{color:"#64748b"}}>₹{inv.tax.toLocaleString()}</Td>
                    <Td style={{fontWeight:700}}>₹{inv.total.toLocaleString()}</Td>
                    <Td><StatusBadge s={inv.status}/></Td>
                    <Td style={{color:overdue?"#ef4444":"#64748b",fontWeight:overdue?700:400}}>{inv.dueDate}{overdue&&" ⚠️"}</Td>
                    <Td style={{fontWeight:700,color:inv.outstanding>0?"#f59e0b":"#22c55e"}}>₹{inv.outstanding.toLocaleString()}</Td>
                    <Td>
                      <div style={{display:"flex",gap:6}}>
                        <Btn onClick={()=>setModal({type:"editInvoice",data:inv})} variant="secondary" size="sm">Edit</Btn>
                        <Btn onClick={()=>{if(confirm("Delete?"))setInvoices(is=>is.filter(x=>x.id!==inv.id));}} variant="danger" size="sm">Del</Btn>
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length===0&&<div style={{textAlign:"center",padding:32,color:"#94a3b8"}}>No invoices found.</div>}
        </div>
      </div>
    );
  };

  // ── RISKS VIEW ─────────────────────────────────────────────────────────────
  const RisksView=()=>{
    const [fp,setFp]=useState("All");
    const [ft,setFt]=useState("All");
    const filtered=risks.filter(r=>(fp==="All"||r.project===fp)&&(ft==="All"||r.type===ft));
    return (
      <div style={{padding:24,maxWidth:1200,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={{fontWeight:800,fontSize:16}}>⚠️ Risks & Issues ({filtered.length})</div>
          <Btn onClick={()=>setModal({type:"addRisk"})}>+ Add Risk/Issue</Btn>
        </div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:16}}>
          <KPI label="Open Risks" value={risks.filter(r=>r.type==="Risk"&&r.status==="Open").length} color="#dc2626"/>
          <KPI label="Open Issues" value={risks.filter(r=>r.type==="Issue"&&r.status==="Open").length} color="#ea580c"/>
          <KPI label="Dependencies" value={risks.filter(r=>r.type==="Dependency").length} color="#0ea5e9"/>
          <KPI label="Resolved" value={risks.filter(r=>r.status==="Resolved").length} color="#22c55e"/>
        </div>
        <div style={{background:"#fff",borderRadius:12,padding:"12px 16px",marginBottom:16,display:"flex",gap:10,boxShadow:"0 1px 4px #0001"}}>
          <select value={fp} onChange={e=>setFp(e.target.value)} style={{...inputS,maxWidth:170}}>
            <option value="All">All Projects</option>
            {projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select value={ft} onChange={e=>setFt(e.target.value)} style={{...inputS,maxWidth:150}}>
            <option value="All">All Types</option>
            {RISK_TYPES.map(t=><option key={t}>{t}</option>)}
          </select>
        </div>
        <div style={{background:"#fff",borderRadius:14,boxShadow:"0 1px 4px #0001",overflow:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead><tr><Th>ID</Th><Th>Project</Th><Th>Type</Th><Th>Description</Th><Th>Severity</Th><Th>Owner</Th><Th>Status</Th><Th>Target</Th><Th>Mitigation</Th><Th>Actions</Th></tr></thead>
            <tbody>
              {filtered.map((r,i)=>{
                const p=projById(r.project);
                return (
                  <tr key={r.id} style={{background:i%2===0?"#fff":"#f8fafc"}}>
                    <Td style={{color:"#94a3b8",fontWeight:600,fontSize:11}}>{r.id}</Td>
                    <Td><span style={{background:p?.color+"18",color:p?.color,borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:700}}>{p?.name}</span></Td>
                    <Td><Badge label={r.type} color={r.type==="Risk"?"#fef2f2":r.type==="Issue"?"#fff7ed":"#f0f9ff"} textColor={r.type==="Risk"?"#dc2626":r.type==="Issue"?"#ea580c":"#0369a1"}/></Td>
                    <Td style={{maxWidth:200}}>{r.description}</Td>
                    <Td><span style={{color:PRIO_COLORS[r.severity],fontWeight:700,fontSize:12}}>● {r.severity}</span></Td>
                    <Td>{r.owner}</Td>
                    <Td><Badge label={r.status} color={r.status==="Resolved"?"#f0fdf4":r.status==="Open"?"#fef2f2":"#fffbeb"} textColor={r.status==="Resolved"?"#15803d":r.status==="Open"?"#b91c1c":"#b45309"}/></Td>
                    <Td style={{fontSize:12,color:"#64748b"}}>{r.targetDate||"—"}</Td>
                    <Td style={{fontSize:12,color:"#475569",maxWidth:180}}>{r.mitigation||"—"}</Td>
                    <Td>
                      <div style={{display:"flex",gap:6}}>
                        <Btn onClick={()=>setModal({type:"editRisk",data:r})} variant="secondary" size="sm">Edit</Btn>
                        <Btn onClick={()=>{if(confirm("Delete?"))setRisks(rs=>rs.filter(x=>x.id!==r.id));}} variant="danger" size="sm">Del</Btn>
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ── MODALS ─────────────────────────────────────────────────────────────────
  const renderModal=()=>{
    if(!modal)return null;
    const {type,data}=modal;

    const GenericForm=({fields,init,onSave,title})=>{
      const [f,setF]=useState(init||{});
      const set=(k,v)=>setF(p=>({...p,[k]:v}));
      return (
        <Modal title={title} onClose={closeModal} width={580}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {fields.map(([k,l,type,opts,full])=>(
              <div key={k} style={{gridColumn:full?"1/-1":"auto"}}>
                <label style={labelS}>{l}</label>
                {type==="select"?<select value={f[k]||""} onChange={e=>set(k,e.target.value)} style={inputS}>{opts.map(o=><option key={o}>{o}</option>)}</select>
                :type==="textarea"?<textarea value={f[k]||""} onChange={e=>set(k,e.target.value)} rows={2} style={{...inputS,resize:"vertical"}}/>
                :<input type={type||"text"} value={f[k]||""} onChange={e=>set(k,type==="number"?+e.target.value:e.target.value)} style={inputS}/>}
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:10,marginTop:20,justifyContent:"flex-end"}}>
            <Btn onClick={closeModal} variant="secondary">Cancel</Btn>
            <Btn onClick={()=>onSave(f)}>Save</Btn>
          </div>
        </Modal>
      );
    };

    if(type==="addProject") return <Modal title="➕ New Project" onClose={closeModal} width={620}><ProjectForm colorIdx={projects.length} onClose={closeModal} onSave={f=>{setProjects(ps=>[...ps,{...f,id:`P${String(ps.length+1).padStart(3,"0")}`}]);closeModal();}}/></Modal>;
    if(type==="editProject") return <Modal title="✏️ Edit Project" onClose={closeModal} width={620}><ProjectForm init={data} onClose={closeModal} onSave={f=>{setProjects(ps=>ps.map(p=>p.id===data.id?{...f,id:data.id}:p));closeModal();}}/></Modal>;

    if(type==="addTask") return (
      <Modal title="➕ Add Task" onClose={closeModal} width={580}>
        <TaskForm projects={projects} deliverables={deliverables} init={data?{...{project:"P001",category:"Strategy & Planning",task:"",description:"",assignee:"",priority:"Medium",status:"Not Started",startDate:"",dueDate:"",progress:0,notes:"",deliverableId:"",tags:""},...data}:undefined}
          onClose={closeModal} onSave={f=>{setTasks(ts=>[...ts,{...f,id:_taskId++,subtasks:[],comments:[]}]);closeModal();}}/>
      </Modal>
    );
    if(type==="editTask") return (
      <Modal title="✏️ Edit Task" onClose={closeModal} width={580}>
        <TaskForm projects={projects} deliverables={deliverables} init={data} onClose={closeModal} onSave={f=>{setTasks(ts=>ts.map(t=>t.id===data.id?{...f,id:data.id}:t));closeModal();}}/>
      </Modal>
    );

    if(type==="addDeliverable"||type==="editDeliverable") return <GenericForm title={type==="addDeliverable"?"➕ Add Deliverable":"✏️ Edit Deliverable"} init={type==="editDeliverable"?data:data?{project:data.project,status:"Not Started",priority:"Medium",approvalStatus:"Pending",progress:0}:{status:"Not Started",priority:"Medium",approvalStatus:"Pending",progress:0}}
      fields={[["project","Project","select",projects.map(p=>p.id)],["name","Deliverable Name","text",null,true],["owner","Owner"],["status","Status","select",DELIV_STATUSES],["priority","Priority","select",PRIORITIES],["plannedStart","Planned Start","date"],["dueDate","Due Date","date"],["actualCompletion","Actual Completion","date"],["progress","% Completion","number"],["approvalStatus","Approval Status","select",["Pending","Approved","Not Required","Rejected"]],["dependencies","Dependencies (IDs)"],["description","Description","textarea",null,true],["remarks","Remarks","textarea",null,true]]}
      onSave={f=>{
        if(type==="editDeliverable")setDeliverables(ds=>ds.map(d=>d.id===data.id?{...f,id:data.id}:d));
        else setDeliverables(ds=>[...ds,{...f,id:`D${String(ds.length+1).padStart(3,"0")}`}]);
        closeModal();
      }}/>;

    if(type==="addInvoice"||type==="editInvoice") return <GenericForm title={type==="addInvoice"?"➕ Add Invoice":"✏️ Edit Invoice"} init={type==="editInvoice"?data:data?{project:data.project,status:"Draft",amount:0,tax:0,total:0,outstanding:0}:{status:"Draft",amount:0,tax:0,total:0,outstanding:0}}
      fields={[["project","Project","select",projects.map(p=>p.id)],["type","Invoice Type","select",["Software License","Implementation Service","Development Milestone","Infrastructure","Consulting","Other"]],["client","Client"],["vendor","Vendor"],["poRef","PO/Contract Ref"],["invoiceDate","Invoice Date","date"],["submissionDate","Submission Date","date"],["dueDate","Due Date","date"],["amount","Amount (₹)","number"],["tax","Tax/GST (₹)","number"],["total","Total Amount (₹)","number"],["status","Payment Status","select",INV_STATUSES],["paymentDate","Payment Date","date"],["outstanding","Outstanding (₹)","number"],["approvedBy","Approved By"],["remarks","Remarks","textarea",null,true]]}
      onSave={f=>{
        if(type==="editInvoice")setInvoices(is=>is.map(i=>i.id===data.id?{...f,id:data.id}:i));
        else setInvoices(is=>[...is,{...f,id:`INV${String(is.length+1).padStart(3,"0")}`}]);
        closeModal();
      }}/>;

    if(type==="addPDAR"||type==="editPDAR") return <GenericForm title={type==="addPDAR"?"➕ Add PDAR Entry":"✏️ Edit PDAR Entry"} init={type==="editPDAR"?data:data?{project:data.project,date:today(),status:"In Progress",followUp:false}:{date:today(),status:"In Progress",followUp:false}}
      fields={[["date","Date","date"],["project","Project","select",projects.map(p=>p.id)],["manager","Project Manager"],["location","Location/Mode"],["activity","Activity","textarea",null,true],["remarks","Remarks","textarea",null,true],["issues","Issues/Reasons","textarea",null,true],["persons","Persons Involved"],["followUpDate","Follow-up Date","date"],["status","Status","select",["In Progress","Completed","Follow-up Pending","Cancelled"]]]}
      onSave={f=>{
        if(type==="editPDAR")setPdar(ps=>ps.map(e=>e.id===data.id?{...f,id:data.id}:e));
        else setPdar(ps=>[...ps,{...f,id:`PDAR${String(ps.length+1).padStart(3,"0")}`}]);
        closeModal();
      }}/>;

    if(type==="addRisk"||type==="editRisk") return <GenericForm title={type==="addRisk"?"➕ Add Risk/Issue":"✏️ Edit Risk/Issue"} init={type==="editRisk"?data:data?{project:data.project,type:"Risk",severity:"Medium",status:"Open",dateRaised:today()}:{type:"Risk",severity:"Medium",status:"Open",dateRaised:today()}}
      fields={[["project","Project","select",projects.map(p=>p.id)],["type","Type","select",RISK_TYPES],["severity","Severity","select",SEVERITIES],["status","Status","select",["Open","In Progress","Resolved","Closed"]],["owner","Owner"],["dateRaised","Date Raised","date"],["targetDate","Target Resolution","date"],["description","Description","textarea",null,true],["mitigation","Mitigation/Resolution","textarea",null,true],["remarks","Remarks","textarea",null,true]]}
      onSave={f=>{
        if(type==="editRisk")setRisks(rs=>rs.map(r=>r.id===data.id?{...f,id:data.id}:r));
        else setRisks(rs=>[...rs,{...f,id:`R${String(rs.length+1).padStart(3,"0")}`}]);
        closeModal();
      }}/>;

    return null;
  };

  // ── RENDER ─────────────────────────────────────────────────────────────────
  const views={dashboard:<DashboardView/>,projects:<ProjectsView/>,tasks:<TasksView/>,deliverables:<DeliverablesView/>,pdar:<PDARView/>,invoices:<InvoicesView/>,risks:<RisksView/>};

  return (
    <div style={{fontFamily:"'Inter',system-ui,sans-serif",minHeight:"100vh",background:"#f1f5f9",color:"#1e293b",display:"flex",flexDirection:"column"}}>
      {/* Top Bar */}
      <div style={{background:"linear-gradient(135deg,#0f172a 0%,#1e293b 100%)",padding:"0 24px",display:"flex",alignItems:"center",gap:0,height:54,flexShrink:0}}>
        <div style={{fontWeight:800,fontSize:15,color:"#fff",marginRight:32,whiteSpace:"nowrap"}}>🗂 QCI Project Hub</div>
        <div style={{display:"flex",gap:2,overflowX:"auto",flex:1}}>
          {NAV_ITEMS.map(n=>(
            <button key={n.id} onClick={()=>setNav(n.id)} style={{background:nav===n.id?"#6366f1":"transparent",color:nav===n.id?"#fff":"#94a3b8",border:"none",borderRadius:8,padding:"6px 14px",fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",transition:"all .15s"}}>
              {n.icon} {n.label}
            </button>
          ))}
        </div>
        {notifs.length>0&&<div style={{background:"#ef4444",color:"#fff",borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700,flexShrink:0,marginLeft:8}}>🔔 {notifs.length}</div>}
      </div>
      {/* Content */}
      <div style={{flex:1,overflow:"auto"}}>
        {views[nav]}
      </div>
      {renderModal()}
    </div>
  );
}
