import { useState } from "react";
import { ArrowRight, Layers3, ShieldCheck } from "lucide-react";

type Props = {
  error: string | null;
  signIn: (email:string,password:string)=>Promise<boolean>;
  signUp: (email:string,password:string)=>Promise<boolean>;
};
export default function LoginScreen({error,signIn,signUp}:Props) {
  const [mode,setMode] = useState<"login"|"signup">("login");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [busy,setBusy] = useState(false);
  const [message,setMessage] = useState("");
  const submit = async(e:React.FormEvent) => {
    e.preventDefault(); setBusy(true); setMessage("");
    const ok = mode==="login" ? await signIn(email,password) : await signUp(email,password);
    setBusy(false);
    if(ok && mode==="signup") setMessage("注册请求已提交。如项目启用了邮箱验证，请先检查邮箱并完成验证。");
  };
  return <div className="auth-screen">
    <div className="auth-card">
      <div className="auth-brand"><div className="brand-mark"><Layers3 size={22}/></div><div><strong>VARUNA</strong><span>PRODUCT INTELLIGENCE</span></div></div>
      <div className="auth-eyebrow">GLOBAL PRODUCT RESEARCH PLATFORM</div>
      <h1>{mode==="login"?"欢迎回来":"创建你的 Varuna 账户"}</h1>
      <p>连接市场证据、产品洞察与商业决策。</p>
      <form onSubmit={submit}>
        <label>电子邮箱<input type="email" required autoComplete="email" placeholder="name@company.com" value={email} onChange={e=>setEmail(e.target.value)}/></label>
        <label>密码<input type="password" required minLength={8} autoComplete={mode==="login"?"current-password":"new-password"} placeholder="至少 8 位" value={password} onChange={e=>setPassword(e.target.value)}/></label>
        {(error||message)&&<div className={message?"auth-message":"auth-error"}>{message||error}</div>}
        <button className="primary-btn auth-submit" disabled={busy}>{busy?"处理中…":mode==="login"?"登录工作区":"创建账户"} <ArrowRight size={16}/></button>
      </form>
      <div className="auth-switch">{mode==="login"?"还没有账户？":"已有账户？"} <button onClick={()=>{setMode(mode==="login"?"signup":"login");setMessage("");}}>{mode==="login"?"注册":"返回登录"}</button></div>
      <div className="auth-security"><ShieldCheck size={15}/> Supabase Auth · 安全会话 · 工作区数据隔离</div>
    </div>
    <div className="auth-footer">VARUNA · EVIDENCE FIRST. DECISIONS WITH CONFIDENCE.</div>
  </div>;
}