const PAGE_HOST = "varuna-cu7.pages.dev";
const cors = (request) => {
  const origin = request.headers.get("Origin") || "";
  let allowed = "";
  try { const u = new URL(origin); if (u.protocol === "https:" && (u.hostname === PAGE_HOST || u.hostname.endsWith("." + PAGE_HOST))) allowed = origin; if (origin === "http://localhost:5173") allowed = origin; } catch {}
  return {"access-control-allow-origin":allowed,"access-control-allow-methods":"GET,POST,PUT,PATCH,DELETE,OPTIONS","access-control-allow-headers":"authorization,content-type,x-request-id","access-control-max-age":"86400","vary":"Origin"};
};
const domains = [["D01","Marketplace & Retail","电商与零售"],["D02","Search & Discovery","搜索与发现"],["D03","Social & Community","社交与社区"],["D04","Reviews & Feedback","评论与客户反馈"],["D05","Trends & Demand","趋势与需求"],["D06","Supplier & Manufacturing","供应链与制造"],["D07","Company & Competition","企业与竞争"],["D08","Technical & Standards","技术与标准"],["D09","Pricing & Commercial","价格与商业"],["D10","Trade & Logistics","贸易与物流"],["D11","AI & Analytics","AI 与分析"],["D12","First-party Data","第一方数据"]];
const providers = [["openai","OpenAI","D11","AI models","reasoning,extraction,embeddings"],["anthropic","Anthropic Claude","D11","AI models","reasoning,long_context,extraction"],["google-gemini","Google Gemini","D11","AI models","multimodal,reasoning,extraction"],["deepseek","DeepSeek","D11","AI models","reasoning,chinese_analysis"],["dataforseo","DataForSEO","D02","Search data","serp,keywords,shopping"],["google-ads","Google Ads Keyword Planning","D02","Search data","keyword_planning,search_volume"],["ebay-browse","eBay Browse API","D01","Marketplace","item_search,catalog"],["amazon-sp-api","Amazon SP-API","D01","Marketplace","catalog,seller_authorized_data"],["alibaba-1688","1688 Open Platform","D06","Supplier","supplier_discovery,product_catalog"],["reddit","Reddit API","D03","Social","community_search,posts"],["youtube-data","YouTube Data API","D03","Social","video_search,video_metadata"],["google-trends","Google Trends","D05","Demand trends","interest_over_time,related_queries"]];
const json = (request,data,status=200)=>new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json; charset=utf-8",...cors(request)}});
const hexBytes = hex=>Uint8Array.from(hex.match(/.{1,2}/g)||[],x=>parseInt(x,16));
const b64 = bytes=>btoa(String.fromCharCode(...bytes));
const unb64 = value=>Uint8Array.from(atob(value),c=>c.charCodeAt(0));
async function cryptoKey(env){if(!env.CREDENTIAL_ENCRYPTION_KEY)throw new Error("credential_vault_unavailable");return crypto.subtle.importKey("raw",hexBytes(env.CREDENTIAL_ENCRYPTION_KEY),{name:"AES-GCM"},false,["encrypt","decrypt"]);}
async function encryptSecret(env,value){const key=await cryptoKey(env);const iv=crypto.getRandomValues(new Uint8Array(12));const cipher=await crypto.subtle.encrypt({name:"AES-GCM",iv},key,new TextEncoder().encode(value));return JSON.stringify({v:1,iv:b64(iv),data:b64(new Uint8Array(cipher))});}
async function decryptSecret(env,value){const record=JSON.parse(value);if(record.v!==1)throw new Error("credential_version_unsupported");const key=await cryptoKey(env);const plain=await crypto.subtle.decrypt({name:"AES-GCM",iv:unb64(record.iv)},key,unb64(record.data));return new TextDecoder().decode(plain);}
async function authUser(request,env){const token=(request.headers.get("authorization")||"").replace(/^Bearer\s+/i,"");if(!token||!env.SUPABASE_URL||!env.SUPABASE_ANON_KEY)return null;const response=await fetch(env.SUPABASE_URL+"/auth/v1/user",{headers:{apikey:env.SUPABASE_ANON_KEY,authorization:"Bearer "+token}});if(!response.ok)return null;return{token,user:await response.json()};}
async function db(request,env,token,path,method="GET",body,prefer){const headers={apikey:env.SUPABASE_ANON_KEY,authorization:"Bearer "+token};if(body!==undefined)headers["content-type"]="application/json";if(prefer)headers.prefer=prefer;return fetch(env.SUPABASE_URL+"/rest/v1/"+path,{method,headers,body:body===undefined?undefined:JSON.stringify(body)});}
async function membership(request,env,token,userId,workspaceId){const query=new URLSearchParams({select:"role",workspace_id:"eq."+workspaceId,user_id:"eq."+userId});const response=await db(request,env,token,"workspace_members?"+query.toString());if(!response.ok)return null;const rows=await response.json();return Array.isArray(rows)?rows[0]||null:null;}
function safeProviderError(status){if(status===401||status===403)return"provider_rejected_credentials";if(status===429)return"provider_rate_limited";return"provider_http_"+status;}
async function testProvider(providerId,credentials){
 const key=credentials.api_key||credentials.apiKey||credentials.key||"";let response;
 if(providerId==="openai"&&key)response=await fetch("https://api.openai.com/v1/models",{headers:{authorization:"Bearer "+key},signal:AbortSignal.timeout(12000)});
 else if(providerId==="deepseek"&&key)response=await fetch("https://api.deepseek.com/models",{headers:{authorization:"Bearer "+key},signal:AbortSignal.timeout(12000)});
 else if(providerId==="anthropic"&&key)response=await fetch("https://api.anthropic.com/v1/models?limit=1",{headers:{"x-api-key":key,"anthropic-version":"2023-06-01"},signal:AbortSignal.timeout(12000)});
 else if(providerId==="google-gemini"&&key)response=await fetch("https://generativelanguage.googleapis.com/v1beta/models?key="+encodeURIComponent(key),{signal:AbortSignal.timeout(12000)});
 else if(providerId==="youtube-data"&&key)response=await fetch("https://youtube.googleapis.com/youtube/v3/videos?part=id&id=dQw4w9WgXcQ&key="+encodeURIComponent(key),{signal:AbortSignal.timeout(12000)});
 else if(providerId==="dataforseo"&&credentials.username&&credentials.password)response=await fetch("https://api.dataforseo.com/v3/appendix/user_data",{headers:{authorization:"Basic "+btoa(credentials.username+":"+credentials.password)},signal:AbortSignal.timeout(12000)});
 else if(providerId==="ebay-browse"&&credentials.client_id&&credentials.client_secret){const r=await fetch("https://api.ebay.com/identity/v1/oauth2/token",{method:"POST",headers:{authorization:"Basic "+btoa(credentials.client_id+":"+credentials.client_secret),"content-type":"application/x-www-form-urlencoded"},body:"grant_type=client_credentials&scope=https%3A%2F%2Fapi.ebay.com%2Foauth%2Fapi_scope",signal:AbortSignal.timeout(12000)});if(!r.ok)return{status:"degraded",error:safeProviderError(r.status),message:"eBay OAuth credentials were rejected."};return{status:"connected",message:"eBay OAuth client credentials validated."};}
 else if(providerId==="reddit"&&credentials.client_id&&credentials.client_secret){const r=await fetch("https://www.reddit.com/api/v1/access_token",{method:"POST",headers:{authorization:"Basic "+btoa(credentials.client_id+":"+credentials.client_secret),"content-type":"application/x-www-form-urlencoded","user-agent":credentials.user_agent||"VarunaResearch/0.1"},body:"grant_type=client_credentials",signal:AbortSignal.timeout(12000)});if(!r.ok)return{status:"degraded",error:safeProviderError(r.status),message:"Reddit OAuth credentials were rejected or are not eligible."};return{status:"connected",message:"Reddit OAuth credentials validated."};}
 else return{status:"configured",message:"Credentials encrypted and stored. This provider requires additional OAuth, account eligibility, or a provider-specific validation workflow."};
 if(response.ok)return{status:"connected",message:"Provider credentials validated successfully."};
 return{status:"degraded",error:safeProviderError(response.status),message:"Provider returned HTTP "+response.status+"; verify credentials, permissions, and quota."};
}
export default {
 async fetch(request,env){
  const url=new URL(request.url);
  if(request.method==="OPTIONS")return new Response(null,{status:204,headers:cors(request)});
  if(url.pathname==="/health"||url.pathname==="/api/v1/health")return json(request,{service:"varuna-api",status:"ok",version:"0.2.0",environment:env.VARUNA_ENV||"unconfigured",timestamp:new Date().toISOString(),dependencies:{supabase:Boolean(env.SUPABASE_URL&&env.SUPABASE_ANON_KEY),credentialVault:Boolean(env.PROVIDER_SECRETS&&env.CREDENTIAL_ENCRYPTION_KEY)}});
  if(url.pathname==="/api/v1/catalog")return json(request,{domains:domains.map(([id,name,label])=>({id,name,label})),providers:providers.map(([id,name,domain,category,capabilities])=>({id,name,domain,category,capabilities:capabilities.split(","),status:"not_configured"}))});
  if(url.pathname==="/api/v1/providers"&&request.method==="GET"){
   const auth=await authUser(request,env);if(!auth)return json(request,{error:"unauthorized"},401);
   const workspaceId=url.searchParams.get("workspace_id");if(!workspaceId)return json(request,{error:"workspace_id_required"},400);
   if(!await membership(request,env,auth.token,auth.user.id,workspaceId))return json(request,{error:"forbidden"},403);
   const query=new URLSearchParams({select:"id,provider_id,display_name,config,status,last_tested_at,last_test_status,last_error_code,created_at",workspace_id:"eq."+workspaceId,order:"created_at.desc"});
   const result=await db(request,env,auth.token,"provider_connections?"+query.toString());if(!result.ok)return json(request,{error:"provider_list_failed"},502);
   return json(request,{connections:await result.json()});
  }
  if(url.pathname==="/api/v1/providers"&&request.method==="POST"){
   const auth=await authUser(request,env);if(!auth)return json(request,{error:"unauthorized"},401);
   let body;try{body=await request.json();}catch{return json(request,{error:"invalid_json"},400);}
   const {workspace_id,provider_id,display_name,credentials,config={}}=body||{};
   if(typeof workspace_id!=="string"||typeof provider_id!=="string"||typeof display_name!=="string"||!credentials)return json(request,{error:"missing_required_fields"},400);
   const member=await membership(request,env,auth.token,auth.user.id,workspace_id);if(!member||!["owner","admin"].includes(member.role))return json(request,{error:"workspace_admin_required"},403);
   const catalog=await db(request,env,auth.token,"provider_catalog?select=id&id=eq."+encodeURIComponent(provider_id));if(!catalog.ok||!(await catalog.json()).length)return json(request,{error:"unknown_provider"},404);
   let credentialObject=credentials;
   if(typeof credentials==="string"){const trimmed=credentials.trim();if(trimmed.startsWith("{")){try{credentialObject=JSON.parse(trimmed);}catch{return json(request,{error:"credentials_json_invalid"},400);}}else credentialObject={api_key:trimmed};}
   if(!credentialObject||typeof credentialObject!=="object"||Array.isArray(credentialObject))return json(request,{error:"credentials_must_be_object_or_key"},400);
   const serialized=JSON.stringify(credentialObject);if(serialized.length>24000)return json(request,{error:"credentials_too_large"},413);
   const secretRef="provider:"+workspace_id+":"+provider_id;let encrypted;try{encrypted=await encryptSecret(env,serialized);}catch{return json(request,{error:"credential_vault_unavailable"},503);}
   await env.PROVIDER_SECRETS.put(secretRef,encrypted,{metadata:{workspace_id,provider_id,version:1}});
   const row={workspace_id,provider_id,display_name,config:{model:typeof config.model==="string"?config.model:"",base_url:typeof config.base_url==="string"?config.base_url:""},secret_ref:secretRef,status:"configured",created_by:auth.user.id,last_tested_at:null,last_test_status:null,last_error_code:null};
   const saved=await db(request,env,auth.token,"provider_connections?on_conflict=workspace_id,provider_id,display_name","POST",row,"resolution=merge-duplicates,return=representation");
   if(!saved.ok){await env.PROVIDER_SECRETS.delete(secretRef);return json(request,{error:"provider_config_save_failed"},502);}
   const savedRows=await saved.json();return json(request,{saved:true,status:"configured",connection:savedRows[0]?{id:savedRows[0].id,provider_id:savedRows[0].provider_id,display_name:savedRows[0].display_name,status:savedRows[0].status}:null});
  }
  const testMatch=url.pathname.match(/^\/api\/v1\/providers\/([^/]+)\/test$/);
  if(testMatch&&request.method==="POST"){
   const auth=await authUser(request,env);if(!auth)return json(request,{error:"unauthorized"},401);
   let body;try{body=await request.json();}catch{return json(request,{error:"invalid_json"},400);}
   const workspaceId=body?.workspace_id;const providerId=decodeURIComponent(testMatch[1]);if(typeof workspaceId!=="string")return json(request,{error:"workspace_id_required"},400);
   const member=await membership(request,env,auth.token,auth.user.id,workspaceId);if(!member||!["owner","admin"].includes(member.role))return json(request,{error:"workspace_admin_required"},403);
   const query=new URLSearchParams({select:"id,secret_ref",workspace_id:"eq."+workspaceId,provider_id:"eq."+providerId,limit:"1"});
   const lookup=await db(request,env,auth.token,"provider_connections?"+query.toString());if(!lookup.ok)return json(request,{error:"provider_lookup_failed"},502);
   const rows=await lookup.json();if(!rows.length||!rows[0].secret_ref)return json(request,{error:"provider_not_configured"},404);
   const encrypted=await env.PROVIDER_SECRETS.get(rows[0].secret_ref);if(!encrypted)return json(request,{error:"provider_secret_missing"},404);
   let credentials;try{credentials=JSON.parse(await decryptSecret(env,encrypted));}catch{return json(request,{error:"provider_secret_decryption_failed"},500);}
   let result;try{result=await testProvider(providerId,credentials);}catch{result={status:"degraded",error:"provider_test_failed",message:"Connection test failed due to a network or provider error."};}
   const patch={status:result.status,last_tested_at:new Date().toISOString(),last_test_status:result.status,last_error_code:result.error||null};
   await db(request,env,auth.token,"provider_connections?id=eq."+rows[0].id,"PATCH",patch,"return=minimal");
   return json(request,{provider_id:providerId,...result});
  }
  if(url.pathname.startsWith("/api/v1/"))return json(request,{error:"not_implemented",message:"This API capability is scheduled for the next implementation phase.",path:url.pathname},501);
  return json(request,{error:"not_found"},404);
 }
};