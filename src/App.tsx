import { useEffect, useMemo, useState } from "react";
import {
  Activity, AlertTriangle, ArrowDownRight, ArrowRight, ArrowUpRight, BarChart3, Bell, BookOpen,
  Boxes, BriefcaseBusiness, Check, ChevronDown, CircleHelp, Clock3, Compass, Cpu, Database,
  FileChartColumn, Filter, Globe2, Layers3, LayoutDashboard, Menu, PackageSearch, Plus, Search,
  Settings2, ShieldCheck, Sparkles, Truck, Users, X
} from "lucide-react";

type Section = "overview" | "projects" | "market" | "products" | "voice" | "competitors" | "suppliers" | "opportunities" | "reports" | "settings";
const nav = [
  { group: "WORKSPACE", items: [
    { id: "overview", label: "总览", icon: LayoutDashboard },
    { id: "projects", label: "研究项目", icon: Compass },
    { id: "market", label: "市场情报", icon: Globe2 },
    { id: "products", label: "产品情报", icon: PackageSearch },
    { id: "voice", label: "客户声音", icon: Users },
    { id: "competitors", label: "竞争对手", icon: BriefcaseBusiness },
    { id: "suppliers", label: "供应链", icon: Truck },
    { id: "opportunities", label: "产品机会", icon: Sparkles },
    { id: "reports", label: "研究报告", icon: FileChartColumn }
  ]},
  { group: "ADMINISTRATION", items: [{ id: "settings", label: "配置中心", icon: Settings2 }] }
] as const;
const domains = [
  ["D01","电商与零售","Marketplace & Retail"],["D02","搜索与发现","Search & Discovery"],["D03","社交与社区","Social & Community"],
  ["D04","评论与反馈","Reviews & Feedback"],["D05","趋势与需求","Trends & Demand"],["D06","供应商与制造","Supplier & Manufacturing"],
  ["D07","企业与竞争","Company & Competition"],["D08","技术与标准","Technical & Standards"],["D09","价格与商业","Pricing & Commercial"],
  ["D10","贸易与物流","Trade & Logistics"],["D11","AI 与分析","AI & Analytics"],["D12","第一方数据","First-party Data"]
];
const providers = [
  { name:"OpenAI", category:"AI 模型", domain:"D11", model:"GPT models", state:"未配置", detail:"推理、结构化抽取、研究报告" },
  { name:"Anthropic", category:"AI 模型", domain:"D11", model:"Claude models", state:"未配置", detail:"长上下文分析、独立验证" },
  { name:"Google Gemini", category:"AI 模型", domain:"D11", model:"Gemini models", state:"未配置", detail:"多模态与研究辅助" },
  { name:"DeepSeek", category:"AI 模型", domain:"D11", model:"DeepSeek models", state:"未配置", detail:"中文分析与成本优化" },
  { name:"DataForSEO", category:"搜索数据", domain:"D02", model:"SERP / Keywords", state:"未配置", detail:"搜索结果与关键词指标" },
  { name:"Google Ads", category:"搜索数据", domain:"D02", model:"Keyword Planning", state:"未配置", detail:"关键词规划与需求代理指标" },
  { name:"eBay Browse", category:"电商数据", domain:"D01", model:"Browse API", state:"未配置", detail:"商品检索与目录信息" },
  { name:"Amazon SP-API", category:"电商数据", domain:"D01", model:"Selling Partner API", state:"需申请权限", detail:"卖家授权范围内的商品与业务数据" },
  { name:"1688 Open Platform", category:"供应链", domain:"D06", model:"Open Platform", state:"需申请权限", detail:"供应商与商品信息" },
  { name:"Reddit", category:"社交数据", domain:"D03", model:"Reddit API", state:"未配置", detail:"社区公开讨论与主题" },
  { name:"YouTube", category:"社交数据", domain:"D03", model:"YouTube Data API", state:"未配置", detail:"视频元数据与互动指标" },
  { name:"Google Trends", category:"趋势数据", domain:"D05", model:"Trends", state:"接入方式待确认", detail:"搜索兴趣变化，不代表销量" }
];
const API_BASE = "https://varuna-api.xg-y.workers.dev";
function App() {
  const [section,setSection] = useState<Section>("overview");
  const [apiStatus,setApiStatus] = useState<"checking"|"online"|"error">("checking");
  useEffect(()=>{let active=true;fetch(API_BASE+"/api/v1/health").then(r=>{if(!r.ok)throw new Error("API unavailable");return r.json();}).then(()=>{if(active)setApiStatus("online");}).catch(()=>{if(active)setApiStatus("error");});return()=>{active=false;};},[]);
  const [mobileOpen,setMobileOpen] = useState(false);
  const [query,setQuery] = useState("");
  const [showCreate,setShowCreate] = useState(false);
  const [projectName,setProjectName] = useState("USB Cable 全球市场研究");
  const [projectCategory,setProjectCategory] = useState("USB Cable");
  const [toast,setToast] = useState("");
  const [providerFilter,setProviderFilter] = useState("全部");
  const [expandedProvider,setExpandedProvider] = useState<string | null>(null);
  const [keyDraft,setKeyDraft] = useState<Record<string,string>>({});
  const [modelDraft,setModelDraft] = useState<Record<string,string>>({});
  const [savedProviders,setSavedProviders] = useState<string[]>([]);
  const filteredProviders = useMemo(()=>providers.filter(p=>(providerFilter==="全部" || p.category===providerFilter) && (p.name+p.detail+p.domain).toLowerCase().includes(query.toLowerCase())),[providerFilter,query]);
  const title = nav.flatMap(g=>g.items).find(i=>i.id===section)?.label ?? "总览";
  const notify=(message:string)=>{setToast(message);window.setTimeout(()=>setToast(""),3200);};
  const createProject=()=>{if(!projectName.trim())return;notify("研究项目草稿已创建。连接认证与数据库后将启用持久化创建。");setShowCreate(false);};
  const saveProvider=(name:string)=>{setSavedProviders(old=>old.includes(name)?old:[...old,name]);setKeyDraft(old=>({...old,[name]:""}));notify(name+" 配置草稿已暂存于当前页面；服务端密钥存储接口尚未启用，尚未写入数据库。");};
  return <div className="app-shell">
    <aside className={`sidebar ${mobileOpen?"open":""}`}>
      <div className="brand"><div className="brand-mark"><Layers3 size={21}/></div><div><strong>VARUNA</strong><span>PRODUCT INTELLIGENCE</span></div><button className="icon-btn mobile-close" onClick={()=>setMobileOpen(false)}><X size={18}/></button></div>
      <div className="workspace-switch"><div className="workspace-avatar">V</div><div><b>Varuna Workspace</b><small>Personal workspace</small></div><ChevronDown size={15}/></div>
      {nav.map(group=><div className="nav-group" key={group.group}><div className="nav-label">{group.group}</div>{group.items.map(item=>{const Icon=item.icon;return <button key={item.id} className={`nav-item ${section===item.id?"active":""}`} onClick={()=>{setSection(item.id as Section);setMobileOpen(false);}}><Icon size={17}/><span>{item.label}</span>{item.id==="projects"&&<em>1</em>}</button>})}</div>)}
      <div className="sidebar-bottom"><div className="system-health"><span className="health-dot"></span><div><b>系统基础状态</b><small>{apiStatus==="online"?"API 已部署 · Web 构建待验证":apiStatus==="error"?"API 连接异常":"API 状态检测中"}</small></div></div><div className="user-profile"><div className="user-avatar">J</div><div><b>Workspace Admin</b><small>管理员</small></div><ChevronDown size={15}/></div></div>
    </aside>
    {mobileOpen&&<button className="mobile-scrim" onClick={()=>setMobileOpen(false)} aria-label="关闭导航"/>}
    <main className="main-area">
      <header className="topbar"><div className="topbar-left"><button className="icon-btn menu-btn" onClick={()=>setMobileOpen(true)}><Menu size={20}/></button><span className="breadcrumb">Workspace</span><span className="crumb-slash">/</span><b>{title}</b></div><div className="topbar-right"><div className="searchbox"><Search size={16}/><input placeholder="搜索项目、产品或报告..." value={query} onChange={e=>setQuery(e.target.value)}/><kbd>⌘ K</kbd></div><button className="icon-btn" aria-label="帮助"><CircleHelp size={18}/></button><button className="icon-btn notification" aria-label="通知"><Bell size={18}/><i/></button><div className="top-avatar">J</div></div></header>
      <div className="content">
        {section==="overview"&&<><div className="page-heading"><div><div className="eyebrow">INTELLIGENCE OVERVIEW <span className="live-pill"><i/> SYSTEM PREVIEW</span></div><h1>产品情报总览</h1><p>从市场信号到产品决策，建立可追溯的全球产品研究体系。</p></div><button className="primary-btn" onClick={()=>setShowCreate(true)}><Plus size={17}/> 创建研究项目</button></div>
          <div className="notice"><ShieldCheck size={18}/><div><b>研究可信度优先</b><span>当前为基础前端预览。数据连接、用户认证与研究执行服务尚未部署，页面不会展示虚构的市场数据。</span></div><button onClick={()=>setSection("settings")}>配置数据源 <ArrowRight size={15}/></button></div>
          <div className="metric-grid"><Metric icon={<FolderIcon/>} label="研究项目" value="—" sub="数据库尚未连接" tone="blue"/><Metric icon={<Database size={18}/>} label="数据源连接" value="0 / 12" sub="候选连接器目录已建立" tone="violet"/><Metric icon={<Activity size={18}/>} label="证据记录" value="—" sub="等待首个研究任务" tone="green"/><Metric icon={<ShieldCheck size={18}/>} label="证据可追溯率" value="—" sub="上线后按实际记录计算" tone="amber"/></div>
          <div className="dashboard-grid"><section className="panel project-panel"><div className="panel-head"><div><h2>研究项目</h2><p>Research workspace</p></div><button className="text-btn" onClick={()=>setSection("projects")}>查看全部 <ArrowRight size={15}/></button></div><div className="empty-state"><div className="empty-icon"><PackageSearch size={24}/></div><b>开始你的第一个产品研究</b><span>输入产品品类或市场问题，Varuna 将生成研究计划、证据需求和数据源清单。</span><button className="secondary-btn" onClick={()=>setShowCreate(true)}><Plus size={16}/> 新建研究项目</button></div></section>
            <section className="panel"><div className="panel-head"><div><h2>数据源覆盖</h2><p>Intelligence domains</p></div><button className="icon-btn"><Filter size={16}/></button></div><div className="domain-list">{domains.slice(0,6).map(([id,label])=><div className="domain-row" key={id}><span className="domain-id">{id}</span><span>{label}</span><div className="domain-track"><i style={{width:"0%"}}/></div><small>待接入</small></div>)}</div><button className="panel-footer-btn" onClick={()=>setSection("settings")}>查看全部 12 个情报领域 <ArrowRight size={15}/></button></section>
          </div>
          <div className="bottom-grid"><section className="panel"><div className="panel-head"><div><h2>研究工作流</h2><p>Evidence-led research pipeline</p></div><span className="muted-tag">11 个阶段</span></div><div className="pipeline">{["定义研究范围","自适应研究规划","合规数据采集","证据归档与标准化","证据质量评估","市场与客户分析","产品技术分析","供应链与成本","机会假设","开发规格书","人工审批与监测"].map((s,i)=><div className="pipeline-step" key={s}><span>{String(i+1).padStart(2,"0")}</span>{s}{i===0&&<em>准备就绪</em>}</div>)}</div></section><section className="panel"><div className="panel-head"><div><h2>系统组件</h2><p>Infrastructure readiness</p></div><span className="muted-tag">待部署</span></div><div className="infra-list"><Infra icon={<Globe2/>} name="Cloudflare Pages" desc="Web 应用托管" status="项目已创建"/><Infra icon={<Cpu/>} name="Cloudflare Workers" desc="API 与数据连接层" status="已部署"/><Infra icon={<Database/>} name="Supabase" desc="Postgres · Auth · pgvector" status="项目已存在"/><Infra icon={<Boxes/>} name="Queues / R2" desc="异步任务与证据存储" status="待配置"/></div></section></div>
        </>}
        {section==="settings"&&<><div className="page-heading"><div><div className="eyebrow">PLATFORM CONFIGURATION</div><h1>配置中心</h1><p>统一管理 12 个情报领域、API 连接和 AI 模型路由。</p></div><button className="secondary-btn" onClick={()=>notify("连接测试将在 Worker API 部署后启用。")}><Activity size={16}/> 测试全部连接</button></div>
          <div className="notice"><ShieldCheck size={18}/><div><b>密钥安全策略</b><span>正式版本会将 API Key 加密后存入服务端；页面不会回显完整密钥。当前界面仅为配置入口预览，保存操作不会把密钥发送到任何位置。</span></div></div>
          <div className="settings-summary"><div><b>12</b><span>情报领域</span></div><div><b>{providers.length}</b><span>候选连接器</span></div><div><b>{savedProviders.length}</b><span>本页暂存草稿</span></div><div><b>0</b><span>已验证连接</span></div></div>
          <div className="filter-row"><div className="filter-tabs">{["全部","AI 模型","搜索数据","电商数据","供应链","社交数据","趋势数据"].map(f=><button key={f} className={providerFilter===f?"selected":""} onClick={()=>setProviderFilter(f)}>{f}</button>)}</div><div className="domain-select"><span>领域目录</span><ChevronDown size={15}/></div></div>
          <div className="provider-layout"><div className="provider-list">{filteredProviders.map(p=><div className={`provider-card ${expandedProvider===p.name?"expanded":""}`} key={p.name}><button className="provider-main" onClick={()=>setExpandedProvider(expandedProvider===p.name?null:p.name)}><div className="provider-logo">{p.domain==="D11"?<Sparkles size={18}/>:p.domain==="D06"?<Truck size={18}/>:p.domain==="D01"?<PackageSearch size={18}/>:<Globe2 size={18}/>}</div><div className="provider-copy"><b>{p.name}</b><span>{p.detail}</span></div><span className={`status-tag ${p.state==="未配置"?"neutral":"warning"}`}>{savedProviders.includes(p.name)?"草稿":p.state}</span><ChevronDown size={16}/></button>{expandedProvider===p.name&&<div className="provider-config"><div className="config-grid"><label>API Key / Secret<input type="password" placeholder="粘贴申请的 API Key" value={keyDraft[p.name]||""} onChange={e=>setKeyDraft(o=>({...o,[p.name]:e.target.value}))}/></label><label>模型 / API 产品<input placeholder={p.model} value={modelDraft[p.name]||""} onChange={e=>setModelDraft(o=>({...o,[p.name]:e.target.value}))}/></label></div><label>API Base URL（如供应商支持）<input placeholder="https://api.provider.com/v1" /></label><div className="config-actions"><span><ShieldCheck size={14}/> 密钥服务端加密功能待部署</span><button className="primary-btn small" onClick={()=>saveProvider(p.name)}>保存配置草稿</button></div></div>}</div>)}</div><aside className="domain-sidebar"><h3>情报领域</h3>{domains.map(([id,label,en])=><button key={id} onClick={()=>{setProviderFilter(id==="D11"?"AI 模型":id==="D02"?"搜索数据":id==="D01"?"电商数据":id==="D06"?"供应链":id==="D03"?"社交数据":id==="D05"?"趋势数据":"全部");}}><span>{id}</span><div><b>{label}</b><small>{en}</small></div></button>)}</aside></div>
        </>}
        {section!=="overview"&&section!=="settings"&&<div className="placeholder-page"><div className="placeholder-icon"><BookOpen size={28}/></div><div className="eyebrow">VARUNA WORKSPACE</div><h1>{title}</h1><p>该模块已纳入产品导航和蓝图，正在按阶段建设。数据功能将在 API、数据库和研究任务服务部署后启用。</p><button className="secondary-btn" onClick={()=>setSection("overview")}>返回总览 <ArrowRight size={15}/></button></div>}
      </div>
      <footer className="footer"><span>VARUNA · GLOBAL PRODUCT INTELLIGENCE</span><span>Evidence first. Decisions with confidence.</span><span>Preview build 0.1.0</span></footer>
    </main>
    {showCreate&&<div className="modal-backdrop" onClick={()=>setShowCreate(false)}><div className="modal" onClick={e=>e.stopPropagation()}><div className="modal-head"><div><div className="eyebrow">NEW RESEARCH PROJECT</div><h2>创建研究项目</h2></div><button className="icon-btn" onClick={()=>setShowCreate(false)}><X size={18}/></button></div><p className="modal-intro">定义你要解决的产品或市场问题。下一阶段将由研究规划器生成证据清单。</p><label>项目名称<input value={projectName} onChange={e=>setProjectName(e.target.value)} /></label><label>产品 / 市场主题<input value={projectCategory} onChange={e=>setProjectCategory(e.target.value)} /></label><label>研究范围<select defaultValue="global"><option value="global">中国 + 国际市场</option><option value="cn">中国市场</option><option value="global-only">国际市场</option></select></label><div className="modal-actions"><button className="secondary-btn" onClick={()=>setShowCreate(false)}>取消</button><button className="primary-btn" onClick={createProject}>创建研究草稿 <ArrowRight size={16}/></button></div><small className="form-note">当前预览不会写入数据库；认证和持久化接口完成后开放正式创建。</small></div></div>}
    {toast&&<div className="toast"><Check size={16}/>{toast}</div>}
  </div>;
}
function Metric({icon,label,value,sub,tone}:{icon:React.ReactNode;label:string;value:string;sub:string;tone:string}){return <div className="metric-card"><div className={`metric-icon ${tone}`}>{icon}</div><span>{label}</span><strong>{value}</strong><small>{sub}</small></div>}
function Infra({icon,name,desc,status}:{icon:React.ReactNode;name:string;desc:string;status:string}){return <div className="infra-row"><div className="infra-icon">{icon}</div><div><b>{name}</b><small>{desc}</small></div><span>{status}</span></div>}
function FolderIcon(){return <BriefcaseBusiness size={18}/>}
export default App;