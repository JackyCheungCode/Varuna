import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { AlertCircle, Database, ExternalLink, RefreshCw } from "lucide-react";

type Project = { id: string; name: string };
type Run = {
  id: string; project_id: string; status: string; plan: Record<string, unknown> | null;
  coverage: Record<string, unknown> | null; started_at: string | null; finished_at: string | null; created_at: string;
};
type Task = {
  id: string; run_id: string; domain_code: string | null; provider_id: string | null; task_type: string;
  status: string; output: Record<string, unknown> | null; attempt_count: number; error_code: string | null;
  created_at: string; updated_at: string;
};
type Source = { id: string; project_id: string; source_name: string; source_url: string | null; provider_id: string; geography: string | null; created_at: string };

const statusLabel: Record<string, string> = {
  planning: "计划生成中", queued: "排队中", running: "执行中", succeeded: "已完成",
  partial: "部分完成", completed: "已结束", blocked: "受阻", failed: "失败", skipped: "已跳过"
};
const terminal = new Set(["succeeded", "partial", "completed", "blocked", "failed", "skipped"]);

export default function ResearchExecution({ supabase, session, workspaceId, projects, onOpenEvidence }: {
  supabase: SupabaseClient; session: Session; workspaceId: string; projects: Project[];
  onOpenEvidence: (project: Project) => void;
}) {
  const [projectId, setProjectId] = useState("all");
  const [runs, setRuns] = useState<Run[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [observationCount, setObservationCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = useCallback(async () => {
    if (!workspaceId) return;
    try {
      const runQuery = supabase.from("research_runs")
        .select("id,project_id,status,plan,coverage,started_at,finished_at,created_at")
        .eq("workspace_id", workspaceId).order("created_at", { ascending: false }).limit(30);
      const { data: runData, error: runError } = projectId === "all" ? await runQuery : await runQuery.eq("project_id", projectId);
      if (runError) throw runError;
      const nextRuns = (runData ?? []) as Run[];
      setRuns(nextRuns);
      const runIds = nextRuns.map(r => r.id);
      if (runIds.length) {
        const { data, error: taskError } = await supabase.from("research_tasks")
          .select("id,run_id,domain_code,provider_id,task_type,status,output,attempt_count,error_code,created_at,updated_at")
          .eq("workspace_id", workspaceId).in("run_id", runIds).order("created_at", { ascending: true }).limit(500);
        if (taskError) throw taskError;
        setTasks((data ?? []) as Task[]);
      } else setTasks([]);

      let sourceQuery = supabase.from("evidence_sources")
        .select("id,project_id,source_name,source_url,provider_id,geography,created_at")
        .eq("workspace_id", workspaceId).order("created_at", { ascending: false }).limit(100);
      if (projectId !== "all") sourceQuery = sourceQuery.eq("project_id", projectId);
      const { data: sourceData, error: sourceError } = await sourceQuery;
      if (sourceError) throw sourceError;
      const nextSources = (sourceData ?? []) as Source[];
      setSources(nextSources);
      if (nextSources.length) {
        const { count, error: observationError } = await supabase.from("evidence_observations")
          .select("id", { count: "exact", head: true }).eq("workspace_id", workspaceId)
          .in("source_id", nextSources.map(s => s.id));
        if (observationError) throw observationError;
        setObservationCount(count ?? 0);
      } else setObservationCount(0);
      setError("");
      setLastUpdated(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : "读取研究状态失败，请检查工作区权限。");
    } finally {
      setLoading(false);
    }
  }, [supabase, workspaceId, projectId]);

  useEffect(() => {
    let active = true;
    const refresh = async () => { if (active) await load(); };
    void refresh();
    const timer = window.setInterval(() => { void refresh(); }, 5000);
    return () => { active = false; window.clearInterval(timer); };
  }, [load]);

  const selectedRun = runs[0] ?? null;
  const selectedTasks = useMemo(() => selectedRun ? tasks.filter(t => t.run_id === selectedRun.id) : [], [tasks, selectedRun]);
  const counts = useMemo(() => ({
    done: selectedTasks.filter(t => terminal.has(t.status)).length,
    succeeded: selectedTasks.filter(t => t.status === "succeeded").length,
    partial: selectedTasks.filter(t => t.status === "partial").length,
    blocked: selectedTasks.filter(t => t.status === "blocked").length,
    failed: selectedTasks.filter(t => t.status === "failed").length,
    active: selectedTasks.filter(t => t.status === "queued" || t.status === "running").length
  }), [selectedTasks]);
  const progress = selectedTasks.length ? Math.round(counts.done / selectedTasks.length * 100) : 0;
  const selectedProject = projects.find(p => p.id === (projectId === "all" ? selectedRun?.project_id : projectId));

  return <div className="page-content research-execution-page">
    <style>{`
      .research-execution-page{display:grid;gap:18px}.research-execution-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
      .research-execution-toolbar select{min-width:190px}.research-execution-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
      .research-execution-stat,.research-execution-panel{background:var(--panel,#fff);border:1px solid var(--border,#e5e7eb);border-radius:14px;padding:16px}
      .research-execution-stat span,.research-execution-muted{color:var(--muted,#64748b);font-size:12px}.research-execution-stat strong{display:block;font-size:25px;margin:5px 0}
      .research-execution-panel h2{font-size:16px;margin:0 0 6px}.research-execution-progress{height:9px;background:#e8edf3;border-radius:99px;overflow:hidden;margin:14px 0 8px}
      .research-execution-progress span{display:block;height:100%;background:#27845d;border-radius:99px;transition:width .25s}
      .research-execution-task{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;padding:12px 0;border-top:1px solid var(--border,#e5e7eb);align-items:center}
      .research-execution-task b{display:block;font-size:13px}.research-execution-task small{color:var(--muted,#64748b);font-size:11px}
      .research-execution-pill{font-size:11px;border-radius:20px;padding:4px 9px;background:#eef2f7;white-space:nowrap}.research-execution-pill.good{background:#e8f5ee;color:#17633f}.research-execution-pill.bad{background:#fff0ed;color:#a33b2d}
      .research-execution-source{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;padding:10px 0;border-top:1px solid var(--border,#e5e7eb);align-items:center}
      .research-execution-source a{font-size:12px;overflow-wrap:anywhere}.research-execution-empty{padding:24px 12px;text-align:center;color:var(--muted,#64748b);font-size:13px}
      @media(max-width:700px){.research-execution-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.research-execution-task,.research-execution-source{grid-template-columns:1fr}.research-execution-toolbar{align-items:stretch}.research-execution-toolbar select{width:100%}}
    `}</style>
    <div className="page-heading"><div><div className="eyebrow">LIVE RESEARCH MONITOR</div><h1>研究执行与数据</h1><p>查看研究运行、任务进度和已经保存的证据。每 5 秒自动刷新，状态直接读取 Supabase。</p></div></div>
    <div className="research-execution-toolbar">
      <select value={projectId} onChange={e => setProjectId(e.target.value)} aria-label="筛选研究项目">
        <option value="all">全部研究项目</option>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
      <div className="research-execution-muted">{lastUpdated ? "最近更新：" + lastUpdated.toLocaleTimeString() : "正在同步…"} · {loading ? "读取中" : "自动刷新已开启"}</div>
      <button className="secondary-btn small" onClick={() => { setLoading(true); void load(); }}><RefreshCw size={14}/> 立即刷新</button>
    </div>
    {error && <div className="research-execution-panel"><AlertCircle size={17}/> 读取失败：{error}</div>}
    <div className="research-execution-stats">
      <div className="research-execution-stat"><span>研究运行</span><strong>{runs.length}</strong><small className="research-execution-muted">最近 30 次</small></div>
      <div className="research-execution-stat"><span>当前运行任务</span><strong>{selectedTasks.length}</strong><small className="research-execution-muted">最近一次研究计划</small></div>
      <div className="research-execution-stat"><span>已保存来源</span><strong>{sources.length}</strong><small className="research-execution-muted">当前筛选范围</small></div>
      <div className="research-execution-stat"><span>证据观测</span><strong>{observationCount}</strong><small className="research-execution-muted">原始字段记录</small></div>
    </div>
    <section className="research-execution-panel">
      <div className="research-execution-toolbar"><div><h2>最近一次研究进度</h2><div className="research-execution-muted">{selectedRun ? (selectedProject?.name || "研究项目") + " · " + new Date(selectedRun.created_at).toLocaleString() : "尚无研究运行记录"}</div></div>{selectedRun && <span className="research-execution-pill">{statusLabel[selectedRun.status] || selectedRun.status}</span>}</div>
      {selectedRun ? <>
        <div className="research-execution-progress"><span style={{ width: progress + "%" }}/></div>
        <div className="research-execution-toolbar"><b>{progress}% 完成</b><span className="research-execution-muted">{counts.done}/{selectedTasks.length} 项终态 · {counts.active} 项执行中</span></div>
        <div className="research-execution-muted" style={{marginTop:8}}>成功 {counts.succeeded} · 部分完成 {counts.partial} · 受阻 {counts.blocked} · 失败 {counts.failed}</div>
        {selectedTasks.length ? selectedTasks.map(task => <div className="research-execution-task" key={task.id}>
          <div><b>{task.domain_code || "研究任务"} · {task.provider_id || "未匹配数据源"}</b><small>{task.task_type} · 尝试 {task.attempt_count} 次{task.error_code ? " · " + task.error_code : ""}</small>{typeof task.output?.reason === "string" && <small>{task.output.reason}</small>}</div>
          <span className={"research-execution-pill " + (task.status === "succeeded" ? "good" : task.status === "failed" || task.status === "blocked" ? "bad" : "")}>{statusLabel[task.status] || task.status}</span>
        </div>) : <div className="research-execution-empty">该研究运行尚未生成任务清单。</div>}
      </> : <div className="research-execution-empty">{loading ? "正在读取研究运行…" : "数据库中尚无研究运行。请先在研究向导中生成研究计划；生成成功后，这里会自动显示任务和进度。"}</div>}
    </section>
    <section className="research-execution-panel">
      <div className="research-execution-toolbar"><div><h2>已采集的数据与证据</h2><div className="research-execution-muted">数据保存于项目证据库，可追溯原始来源和采集时间。</div></div>{selectedProject && <button className="secondary-btn small" onClick={() => onOpenEvidence(selectedProject)}><Database size={14}/> 打开完整证据库</button>}</div>
      {sources.length ? sources.slice(0,20).map(source => <div className="research-execution-source" key={source.id}>
        <div><b>{source.source_name || source.provider_id}</b><small className="research-execution-muted"> {source.provider_id} · {source.geography || "地区未标注"} · {new Date(source.created_at).toLocaleString()}</small></div>
        {source.source_url && /^https?:\/\//i.test(source.source_url) ? <a href={source.source_url} target="_blank" rel="noreferrer">查看原始来源 <ExternalLink size={12}/></a> : <span className="research-execution-muted">无公开链接</span>}
      </div>) : <div className="research-execution-empty">{loading ? "正在读取证据…" : "当前筛选范围没有已保存来源。请执行数据采集或导入授权数据。"}</div>}
    </section>
    <div className="research-execution-muted">登录用户：{session.user.email || session.user.id} · 进度按已完成、部分完成、失败、受阻和跳过的任务计算，不以计划生成状态代替采集进度。</div>
  </div>;
}
