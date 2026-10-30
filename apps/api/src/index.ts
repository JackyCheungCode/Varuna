const PAGE_HOST = "varuna-cu7.pages.dev";
const cors = (request) => {
  const origin = request.headers.get("Origin") || "";
  let allowed = "";
  try { const u = new URL(origin); if (u.protocol === "https:" && (u.hostname === PAGE_HOST || u.hostname.endsWith("." + PAGE_HOST))) allowed = origin; if (origin === "http://localhost:5173") allowed = origin; } catch {}
  return {"access-control-allow-origin":allowed,"access-control-allow-methods":"GET,POST,PUT,PATCH,DELETE,OPTIONS","access-control-allow-headers":"authorization,content-type,x-request-id","access-control-max-age":"86400","vary":"Origin"};
};
const domains = [["D01","Marketplace & Retail","电商与零售"],["D02","Search & Discovery","搜索与发现"],["D03","Social & Community","社交与社区"],["D04","Reviews & Feedback","评论与客户反馈"],["D05","Trends & Demand","趋势与需求"],["D06","Supplier & Manufacturing","供应链与制造"],["D07","Company & Competition","企业与竞争"],["D08","Technical & Standards","技术与标准"],["D09","Pricing & Commercial","价格与商业"],["D10","Trade & Logistics","贸易与物流"],["D11","AI & Analytics","AI 与分析"],["D12","First-party Data","第一方数据"]];
const providers = [["openai","OpenAI","D11","AI models","reasoning,extraction,embeddings"],["anthropic","Anthropic Claude","D11","AI models","reasoning,long_context,extraction"],["google-gemini","Google Gemini","D11","AI models","multimodal,reasoning,extraction"],["deepseek","DeepSeek","D11","AI models","reasoning,chinese_analysis"],["dataforseo","DataForSEO","D02","Search data","serp,keywords,shopping"],["google-ads","Google Ads Keyword Planning","D02","Search data","keyword_planning,search_volume"],["ebay-browse","eBay Browse API","D01","Marketplace","item_search,catalog"],["amazon-sp-api","Amazon SP-API","D01","Marketplace","catalog,seller_authorized_data"],["alibaba-1688","1688 Open Platform","D06","Supplier","supplier_discovery,product_catalog"],["reddit","Reddit API","D03","Social","community_search,posts"],["youtube-data","YouTube Data API","D03","Social","video_search,video_metadata"],["google-trends","Google Trends","D05","Demand trends","interest_over_time,related_queries"],["qwen","Qwen / DashScope","D11","AI models","reasoning,chinese_analysis,structured_output"],["workers-ai","Cloudflare Workers AI","D11","AI models","inference,embeddings,classification"],["amazon-creators","Amazon Creators API","D01","Marketplace","product_search,product_details"],["walmart-marketplace","Walmart Marketplace APIs","D01","Marketplace","catalog,item_search"],["alibaba-marketplace","Alibaba.com Open Platform","D01","Marketplace","product_search,supplier_catalog"],["taobao-top","Taobao / Tmall TOP","D01","Marketplace","product_search,catalog"],["jd-open","JD Open Platform","D01","Marketplace","product_search,catalog"],["pdd-open","Pinduoduo Open Platform","D01","Marketplace","product_search,catalog"],["bing-search","Bing Search API","D02","Search data","web_search,serp"],["baidu-marketing","Baidu Marketing API","D02","Search data","keyword_planning,search_demand"],["x-api","X API","D03","Social","posts_search,public_metrics"],["bilibili-open","Bilibili Open Platform","D03","Social","video_metadata,creator_data"],["tiktok-research","TikTok Research API","D03","Social","public_content_research"],["xiaohongshu-partner","Xiaohongshu Official / Partner Access","D03","Social","authorized_content,commerce_data"],["douyin-open","Douyin Open Platform","D03","Social","authorized_video,creator_data"],["similarweb","Similarweb API","D05","Demand trends","traffic_estimates,market_intelligence"],["semrush","Semrush API","D05","Demand trends","keyword_metrics,domain_analytics"],["ahrefs","Ahrefs API","D05","Demand trends","keyword_metrics,backlinks"],["trade-statistics","Trade & Customs Statistics","D10","Trade data","import_export,hs_code"],["standards-registry","Standards & Certification Registries","D08","Technical data","standards,certification"],["company-intelligence","Company Intelligence Providers","D07","Company data","company_profiles,brand_portfolios"],["review-import","Authorized Review / Feedback Import","D04","Customer feedback","review_analysis,complaint_themes"],["supplier-quote-import","Supplier Quote Import","D06","Supplier data","supplier_quotes,moq,lead_time"],["first-party-import","First-party Business Data Import","D12","First-party data","sales,returns,support,customer_tests"]];
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
 else if(providerId==="google-gemini"&&key)response=await fetch("https://generativelanguage.googleapis.com/v1beta/models",{headers:{"x-goog-api-key":key},signal:AbortSignal.timeout(12000)});
 else if(providerId==="youtube-data"&&key)response=await fetch("https://youtube.googleapis.com/youtube/v3/videos?part=id&id=dQw4w9WgXcQ",{headers:{"x-goog-api-key":key},signal:AbortSignal.timeout(12000)});
 else if(providerId==="dataforseo"&&credentials.username&&credentials.password)response=await fetch("https://api.dataforseo.com/v3/appendix/user_data",{headers:{authorization:"Basic "+btoa(credentials.username+":"+credentials.password)},signal:AbortSignal.timeout(12000)});
 else if(providerId==="ebay-browse"&&credentials.client_id&&credentials.client_secret){const r=await fetch("https://api.ebay.com/identity/v1/oauth2/token",{method:"POST",headers:{authorization:"Basic "+btoa(credentials.client_id+":"+credentials.client_secret),"content-type":"application/x-www-form-urlencoded"},body:"grant_type=client_credentials&scope=https%3A%2F%2Fapi.ebay.com%2Foauth%2Fapi_scope",signal:AbortSignal.timeout(12000)});if(!r.ok)return{status:"degraded",error:safeProviderError(r.status),message:"eBay OAuth credentials were rejected."};return{status:"connected",message:"eBay OAuth client credentials validated."};}
 else if(providerId==="workers-ai"&&credentials.account_id&&(credentials.api_token||credentials.api_key)){const token=credentials.api_token||credentials.api_key;const r=await fetch("https://api.cloudflare.com/client/v4/accounts/"+encodeURIComponent(credentials.account_id)+"/ai/models/search?per_page=1",{headers:{authorization:"Bearer "+token},signal:AbortSignal.timeout(12000)});if(!r.ok)return{status:"degraded",error:safeProviderError(r.status),message:"Cloudflare Workers AI credentials were rejected."};return{status:"connected",message:"Cloudflare Workers AI account access validated."};}
  else if(providerId==="reddit"&&credentials.client_id&&credentials.client_secret){const r=await fetch("https://www.reddit.com/api/v1/access_token",{method:"POST",headers:{authorization:"Basic "+btoa(credentials.client_id+":"+credentials.client_secret),"content-type":"application/x-www-form-urlencoded","user-agent":credentials.user_agent||"VarunaResearch/0.1"},body:"grant_type=client_credentials",signal:AbortSignal.timeout(12000)});if(!r.ok)return{status:"degraded",error:safeProviderError(r.status),message:"Reddit OAuth credentials were rejected or are not eligible."};return{status:"connected",message:"Reddit OAuth credentials validated."};}
 else return{status:"configured",message:"Credentials encrypted and stored. This provider requires additional OAuth, account eligibility, or a provider-specific validation workflow."};
 if(response.ok)return{status:"connected",message:"Provider credentials validated successfully."};
 return{status:"degraded",error:safeProviderError(response.status),message:"Provider returned HTTP "+response.status+"; verify credentials, permissions, and quota."};
}

function safeProviderBase(value){
 const parsed=new URL(value);
 const host=parsed.hostname.toLowerCase();
 const privateIPv4=/^(10\.|127\.|169\.254\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[01])\.)/;
 if(parsed.protocol!=="https:"||parsed.username||parsed.password||parsed.search||parsed.hash||host==="localhost"||host.endsWith(".local")||privateIPv4.test(host)||host==="0.0.0.0")throw new Error("invalid_provider_base_url");
 return parsed.toString().replace(/\/+$/,"");
}
async function generateAI(providerId,credentials,config,input){
 const key=credentials.api_key||credentials.apiKey||credentials.key||"";
 const model=input.model||config.model;
 if(!model)throw new Error("model_required");
 const system=input.system_prompt||"You are a careful research assistant. Distinguish evidence from assumptions and return only the requested format.";
 const prompt=input.prompt||"";
 if(providerId==="openai"||providerId==="deepseek"||providerId==="qwen"){
  if(!key)throw new Error("provider_key_missing");
  const defaultBase=providerId==="deepseek"?"https://api.deepseek.com/v1":providerId==="qwen"?"https://dashscope.aliyuncs.com/compatible-mode/v1":"https://api.openai.com/v1";
  const base=safeProviderBase(config.base_url||defaultBase);
  const endpoint=base.endsWith("/chat/completions")?base:base+"/chat/completions";
  const response=await fetch(endpoint,{method:"POST",headers:{authorization:"Bearer "+key,"content-type":"application/json"},body:JSON.stringify({model,messages:[{role:"system",content:system},{role:"user",content:prompt}],max_tokens:Math.min(Math.max(Number(input.max_output_tokens)||4096,128),8192),temperature:0.2}),signal:AbortSignal.timeout(60000)});
  if(!response.ok)throw new Error("ai_provider_http_"+response.status);
  const data=await response.json();return{text:data.choices?.[0]?.message?.content||"",usage:data.usage||{},model:data.model||model};
 }
 if(providerId==="anthropic"){
  if(!key)throw new Error("provider_key_missing");
  const response=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"x-api-key":key,"anthropic-version":"2023-06-01","content-type":"application/json"},body:JSON.stringify({model,system,max_tokens:Math.min(Math.max(Number(input.max_output_tokens)||4096,128),8192),messages:[{role:"user",content:prompt}]}),signal:AbortSignal.timeout(60000)});
  if(!response.ok)throw new Error("ai_provider_http_"+response.status);
  const data=await response.json();return{text:(data.content||[]).filter(x=>x.type==="text").map(x=>x.text).join("\n"),usage:data.usage||{},model:data.model||model};
 }
 if(providerId==="workers-ai"){
  const accountId=credentials.account_id;const token=credentials.api_token||credentials.api_key||credentials.key;
  if(!accountId||!token)throw new Error("provider_key_missing");
  const response=await fetch("https://api.cloudflare.com/client/v4/accounts/"+encodeURIComponent(accountId)+"/ai/run/"+encodeURIComponent(model),{method:"POST",headers:{authorization:"Bearer "+token,"content-type":"application/json"},body:JSON.stringify({messages:[{role:"system",content:system},{role:"user",content:prompt}],max_tokens:Math.min(Math.max(Number(input.max_output_tokens)||4096,128),8192)}),signal:AbortSignal.timeout(60000)});
  if(!response.ok)throw new Error("ai_provider_http_"+response.status);
  const data=await response.json();return{text:data.result?.response||data.result?.output||JSON.stringify(data.result||{}),usage:data.result?.usage||{},model};
 }
 if(providerId==="google-gemini"){
  if(!key)throw new Error("provider_key_missing");
  const response=await fetch("https://generativelanguage.googleapis.com/v1beta/models/"+encodeURIComponent(model)+":generateContent",{method:"POST",headers:{"x-goog-api-key":key,"content-type":"application/json"},body:JSON.stringify({systemInstruction:{parts:[{text:system}]},contents:[{role:"user",parts:[{text:prompt}]}],generationConfig:{maxOutputTokens:Math.min(Math.max(Number(input.max_output_tokens)||4096,128),8192),temperature:0.2}}),signal:AbortSignal.timeout(60000)});
  if(!response.ok)throw new Error("ai_provider_http_"+response.status);
  const data=await response.json();return{text:(data.candidates?.[0]?.content?.parts||[]).map(x=>x.text||"").join("\n"),usage:data.usageMetadata||{},model};
 }
 throw new Error("ai_provider_adapter_not_implemented");
}
function parseModelJSON(text){
 const cleaned=String(text||"").trim().replace(/^\`\`\`(?:json)?\s*/i,"").replace(/\s*\`\`\`$/,"");
 return JSON.parse(cleaned);
}

export default {
 async fetch(request,env){
  const url=new URL(request.url);
  if(request.method==="OPTIONS")return new Response(null,{status:204,headers:cors(request)});
  if(url.pathname==="/health"||url.pathname==="/api/v1/health")return json(request,{service:"varuna-api",status:"ok",version:"0.3.0",environment:env.VARUNA_ENV||"unconfigured",timestamp:new Date().toISOString(),dependencies:{supabase:Boolean(env.SUPABASE_URL&&env.SUPABASE_ANON_KEY),credentialVault:Boolean(env.PROVIDER_SECRETS&&env.CREDENTIAL_ENCRYPTION_KEY)}});
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



  if(url.pathname==="/api/v1/collect/ebay"&&request.method==="POST"){
   const auth=await authUser(request,env);if(!auth)return json(request,{error:"unauthorized"},401);
   let body;try{body=await request.json();}catch{return json(request,{error:"invalid_json"},400);}
   const {workspace_id,project_id,query,marketplace_id="EBAY_US",limit=30}=body||{};
   if(typeof workspace_id!=="string"||typeof project_id!=="string"||typeof query!=="string"||!query.trim()||query.length>300)return json(request,{error:"invalid_collection_request"},400);
   const allowedMarkets=["EBAY_US","EBAY_GB","EBAY_DE","EBAY_FR","EBAY_AU","EBAY_CA","EBAY_IT","EBAY_ES","EBAY_JP"];
   if(!allowedMarkets.includes(marketplace_id))return json(request,{error:"unsupported_marketplace"},400);
   const member=await membership(request,env,auth.token,auth.user.id,workspace_id);if(!member||!["owner","admin","researcher"].includes(member.role))return json(request,{error:"workspace_researcher_required"},403);
   const projectQuery=new URLSearchParams({select:"id",id:"eq."+project_id,workspace_id:"eq."+workspace_id,limit:"1"});
   const projectCheck=await db(request,env,auth.token,"research_projects?"+projectQuery.toString());if(!projectCheck.ok||!(await projectCheck.json()).length)return json(request,{error:"project_not_found"},404);
   const connectionQuery=new URLSearchParams({select:"secret_ref",workspace_id:"eq."+workspace_id,provider_id:"eq.ebay-browse",limit:"1"});
   const connectionResponse=await db(request,env,auth.token,"provider_connections?"+connectionQuery.toString());if(!connectionResponse.ok)return json(request,{error:"provider_lookup_failed"},502);
   const connections=await connectionResponse.json();if(!connections.length||!connections[0].secret_ref)return json(request,{error:"ebay_not_configured"},409);
   const encrypted=await env.PROVIDER_SECRETS.get(connections[0].secret_ref);if(!encrypted)return json(request,{error:"ebay_secret_missing"},404);
   let credentials;try{credentials=JSON.parse(await decryptSecret(env,encrypted));}catch{return json(request,{error:"ebay_secret_decryption_failed"},500);}
   if(!credentials.client_id||!credentials.client_secret)return json(request,{error:"ebay_oauth_credentials_required"},400);
   const sandbox=credentials.environment==="sandbox";const apiHost=sandbox?"https://api.sandbox.ebay.com":"https://api.ebay.com";
   let tokenData;
   try{const tokenResponse=await fetch(apiHost+"/identity/v1/oauth2/token",{method:"POST",headers:{authorization:"Basic "+btoa(credentials.client_id+":"+credentials.client_secret),"content-type":"application/x-www-form-urlencoded"},body:"grant_type=client_credentials&scope=https%3A%2F%2Fapi.ebay.com%2Foauth%2Fapi_scope",signal:AbortSignal.timeout(15000)});if(!tokenResponse.ok)return json(request,{error:safeProviderError(tokenResponse.status),message:"eBay OAuth failed. Verify production/sandbox credentials and app eligibility."},502);tokenData=await tokenResponse.json();}
   catch{return json(request,{error:"ebay_oauth_network_error"},502);}
   const params=new URLSearchParams({q:query.trim(),limit:String(Math.min(Math.max(Number(limit)||30,1),50)),sort:"BEST_MATCH"});
   let searchData;
   try{const response=await fetch(apiHost+"/buy/browse/v1/item_summary/search?"+params.toString(),{headers:{authorization:"Bearer "+tokenData.access_token,"X-EBAY-C-MARKETPLACE-ID":marketplace_id},signal:AbortSignal.timeout(20000)});if(!response.ok)return json(request,{error:safeProviderError(response.status),message:"eBay Browse API rejected the search request. Production access or marketplace scope may be required."},502);searchData=await response.json();}
   catch{return json(request,{error:"ebay_search_network_error"},502);}
   const items=searchData.itemSummaries||[];if(!items.length)return json(request,{collected:0,observations_created:0,marketplace_id,limitations:["No matching listings were returned."]});
   const sources=items.map((item,index)=>({workspace_id,project_id,provider_id:"ebay-browse",source_name:"eBay Browse API",external_id:item.itemId,source_url:item.itemWebUrl||null,published_at:null,geography:marketplace_id,language:"en",rights_status:"authorized",retention_policy:"Comply with eBay Buy API License Agreement, Developer Terms, attribution, display, storage and refresh requirements.",provenance:{endpoint:"/buy/browse/v1/item_summary/search",query,marketplace_id,search_rank:index+1,api_version:"Browse API"},quality:{sampling_method:"Best-match ranked marketplace item search",sample_size:items.length,metric_semantics:"Observed asking/listing prices; not completed transaction prices, units sold, or market share."}}));
   const sourceInsert=await db(request,env,auth.token,"evidence_sources","POST",sources,"return=representation");if(!sourceInsert.ok)return json(request,{error:"evidence_source_save_failed"},502);
   const savedSources=await sourceInsert.json();const observations=[];
   for(let i=0;i<items.length;i++){const item=items[i];const source=savedSources[i];const values=[["title",item.title,"text"],["price",item.price?.value,"currency"],["currency",item.price?.currency,"ISO-4217"],["seller_username",item.seller?.username,"text"],["seller_feedback_score",item.seller?.feedbackScore,"score"],["condition",item.condition,"text"],["item_location_country",item.itemLocation?.country,"ISO-3166"],["category_id",item.categories?.[0]?.categoryId,"id"],["buying_options",item.buyingOptions,"list"],["shipping_price",item.shippingOptions?.[0]?.shippingCost?.value,"currency"],["shipping_currency",item.shippingOptions?.[0]?.shippingCost?.currency,"ISO-4217"],["item_url",item.itemWebUrl,"url"]];
    for(const [attribute,value,unit] of values){if(value===undefined||value===null)continue;observations.push({workspace_id,source_id:source.id,entity_type:"marketplace_listing",entity_key:item.itemId,attribute_key:attribute,raw_value:value,normalized_value:value,unit,metric_type:"observed",currency:attribute==="price"||attribute==="shipping_price"?item.price?.currency||null:null,geography:marketplace_id,confidence_rationale:"Direct listing field returned by eBay Browse API; price is an asking price and does not prove a sale."});}}
   let observationCount=0;let partial=false;if(observations.length){const saved=await db(request,env,auth.token,"evidence_observations","POST",observations,"return=representation");if(saved.ok){const rows=await saved.json();observationCount=rows.length;}else partial=true;}
   return json(request,{partial,collected:savedSources.length,observations_created:observationCount,provider:"ebay-browse",query,marketplace_id,limitations:["Best-match results are a ranked sample, not the full marketplace catalogue.","Listing prices are asking prices, not completed sales or realized transaction prices.","eBay API access and data display/retention remain subject to app approval and current developer terms."]});
  }
  if(url.pathname==="/api/v1/collect/youtube"&&request.method==="POST"){
   const auth=await authUser(request,env);if(!auth)return json(request,{error:"unauthorized"},401);
   let body;try{body=await request.json();}catch{return json(request,{error:"invalid_json"},400);}
   const {workspace_id,project_id,run_id,query,region_code="US",language="en",max_results=20}=body||{};
   if(typeof workspace_id!=="string"||typeof project_id!=="string"||typeof query!=="string"||!query.trim()||query.length>300)return json(request,{error:"invalid_collection_request"},400);
   const member=await membership(request,env,auth.token,auth.user.id,workspace_id);if(!member||!["owner","admin","researcher"].includes(member.role))return json(request,{error:"workspace_researcher_required"},403);
   const projectQuery=new URLSearchParams({select:"id",id:"eq."+project_id,workspace_id:"eq."+workspace_id,limit:"1"});
   const projectCheck=await db(request,env,auth.token,"research_projects?"+projectQuery.toString());if(!projectCheck.ok||!(await projectCheck.json()).length)return json(request,{error:"project_not_found"},404);
   let validRunId=null;
   if(typeof run_id==="string"){const runQuery=new URLSearchParams({select:"id",id:"eq."+run_id,workspace_id:"eq."+workspace_id,limit:"1"});const runCheck=await db(request,env,auth.token,"research_runs?"+runQuery.toString());if(!runCheck.ok||!(await runCheck.json()).length)return json(request,{error:"research_run_not_found"},404);validRunId=run_id;}
   const connectionQuery=new URLSearchParams({select:"secret_ref",workspace_id:"eq."+workspace_id,provider_id:"eq.youtube-data",limit:"1"});
   const connectionResponse=await db(request,env,auth.token,"provider_connections?"+connectionQuery.toString());if(!connectionResponse.ok)return json(request,{error:"provider_lookup_failed"},502);
   const connections=await connectionResponse.json();if(!connections.length||!connections[0].secret_ref)return json(request,{error:"youtube_not_configured"},409);
   const encrypted=await env.PROVIDER_SECRETS.get(connections[0].secret_ref);if(!encrypted)return json(request,{error:"youtube_secret_missing"},404);
   let credentials;try{credentials=JSON.parse(await decryptSecret(env,encrypted));}catch{return json(request,{error:"youtube_secret_decryption_failed"},500);}
   const apiKey=credentials.api_key||credentials.apiKey||credentials.key;if(!apiKey)return json(request,{error:"youtube_api_key_missing"},400);
   const count=Math.min(Math.max(Number(max_results)||20,1),50);
   const searchParams=new URLSearchParams({part:"snippet",type:"video",q:query.trim(),maxResults:String(count),regionCode:String(region_code).toUpperCase(),relevanceLanguage:String(language)});
   let searchData;
   try{const response=await fetch("https://youtube.googleapis.com/youtube/v3/search?"+searchParams.toString(),{headers:{"x-goog-api-key":apiKey},signal:AbortSignal.timeout(20000)});if(!response.ok)return json(request,{error:safeProviderError(response.status),message:"YouTube search request failed."},502);searchData=await response.json();}
   catch{return json(request,{error:"youtube_network_error"},502);}
   const ids=(searchData.items||[]).map(item=>item.id?.videoId).filter(Boolean);
   if(!ids.length)return json(request,{collected:0,observations_created:0,limitations:["No matching public videos were returned for this query and region."]});
   let detailData;
   try{const params=new URLSearchParams({part:"snippet,statistics,contentDetails",id:ids.join(",")});const response=await fetch("https://youtube.googleapis.com/youtube/v3/videos?"+params.toString(),{headers:{"x-goog-api-key":apiKey},signal:AbortSignal.timeout(20000)});if(!response.ok)return json(request,{error:safeProviderError(response.status),message:"YouTube video detail request failed."},502);detailData=await response.json();}
   catch{return json(request,{error:"youtube_details_network_error"},502);}
   const videos=detailData.items||[];
   const sources=videos.map(video=>({workspace_id,project_id,run_id:validRunId,provider_id:"youtube-data",source_name:"YouTube Data API",external_id:video.id,source_url:"https://www.youtube.com/watch?v="+video.id,published_at:video.snippet?.publishedAt||null,geography:String(region_code).toUpperCase(),language:String(language),rights_status:"authorized",retention_policy:"Use and refresh/delete API data in accordance with YouTube API Services Terms and Developer Policies.",provenance:{endpoint:"videos.list",query,region_code,language,search_order:ids.indexOf(video.id)+1,api_version:"v3"},quality:{sampling_method:"YouTube relevance-ranked public video search",sample_size:videos.length,metric_semantics:"Views and engagement are platform signals, not product sales or market size."}}));
   const sourceInsert=await db(request,env,auth.token,"evidence_sources","POST",sources,"return=representation");
   if(!sourceInsert.ok)return json(request,{error:"evidence_source_save_failed"},502);
   const savedSources=await sourceInsert.json();
   const observations=[];
   for(let i=0;i<videos.length;i++){
    const video=videos[i];const source=savedSources[i];const snippet=video.snippet||{};const stats=video.statistics||{};
    const values=[["title",snippet.title,"text"],["description",snippet.description,"text"],["channel_title",snippet.channelTitle,"text"],["view_count",stats.viewCount,"count"],["like_count",stats.likeCount,"count"],["comment_count",stats.commentCount,"count"],["duration",video.contentDetails?.duration,"ISO-8601 duration"],["category_id",snippet.categoryId,"id"]];
    for(const [attribute,value,unit] of values){if(value===undefined||value===null)continue;observations.push({workspace_id,source_id:source.id,entity_type:"youtube_video",entity_key:video.id,attribute_key:attribute,raw_value:value,normalized_value:value,unit,metric_type:"observed",geography:String(region_code).toUpperCase(),confidence_rationale:"Direct field returned by YouTube Data API v3; not independently audited."});}
   }
   let observationCount=0;let observationSaveStatus="complete";
   if(observations.length){const saved=await db(request,env,auth.token,"evidence_observations","POST",observations,"return=representation");if(saved.ok){const rows=await saved.json();observationCount=rows.length;}else observationSaveStatus="partial";}
   return json(request,{partial:observationSaveStatus==="partial",collected:savedSources.length,observations_created:observationCount,provider:"youtube-data",query,region_code:String(region_code).toUpperCase(),language,quota_note:"YouTube search.list consumes substantially more quota than videos.list; monitor Google Cloud API quota.",limitations:["Video views, likes, comments and ranking are engagement proxies, not product sales.","Search results are relevance-ranked and are not a representative sample of all consumers.","YouTube API data retention, refresh and display requirements remain subject to the current YouTube API Services Terms."]});
  }
  if(url.pathname==="/api/v1/ai/generate"&&request.method==="POST"){
   const auth=await authUser(request,env);if(!auth)return json(request,{error:"unauthorized"},401);
   let body;try{body=await request.json();}catch{return json(request,{error:"invalid_json"},400);}
   const {workspace_id,provider_id,model,task_type,prompt,system_prompt,max_output_tokens}=body||{};
   if(typeof workspace_id!=="string"||typeof provider_id!=="string"||typeof prompt!=="string"||prompt.length>50000)return json(request,{error:"invalid_ai_request"},400);
   const member=await membership(request,env,auth.token,auth.user.id,workspace_id);if(!member||!["owner","admin","researcher"].includes(member.role))return json(request,{error:"workspace_researcher_required"},403);
   const q=new URLSearchParams({select:"provider_id,config,secret_ref,status",workspace_id:"eq."+workspace_id,provider_id:"eq."+provider_id,limit:"1"});
   const lookup=await db(request,env,auth.token,"provider_connections?"+q.toString());if(!lookup.ok)return json(request,{error:"ai_provider_lookup_failed"},502);
   const rows=await lookup.json();if(!rows.length||!rows[0].secret_ref)return json(request,{error:"ai_provider_not_configured"},409);
   const encrypted=await env.PROVIDER_SECRETS.get(rows[0].secret_ref);if(!encrypted)return json(request,{error:"ai_provider_secret_missing"},404);
   let credentials;try{credentials=JSON.parse(await decryptSecret(env,encrypted));}catch{return json(request,{error:"ai_provider_secret_decryption_failed"},500);}
   try{const result=await generateAI(provider_id,credentials,rows[0].config||{},{model,task_type,prompt,system_prompt,max_output_tokens});return json(request,{provider_id,model:result.model,text:result.text,usage:result.usage,task_type:task_type||"general"});}
   catch(error){const code=error instanceof Error?error.message:"ai_generation_failed";return json(request,{error:code.startsWith("ai_provider_http_")?code:"ai_generation_failed"},502);}
  }
  const planMatch=url.pathname.match(/^\/api\/v1\/projects\/([^/]+)\/plan$/);
  if(planMatch&&request.method==="POST"){
   const auth=await authUser(request,env);if(!auth)return json(request,{error:"unauthorized"},401);
   let body;try{body=await request.json();}catch{return json(request,{error:"invalid_json"},400);}
   const workspaceId=body?.workspace_id;const requestedProvider=body?.provider_id;
   if(typeof workspaceId!=="string")return json(request,{error:"workspace_id_required"},400);
   const member=await membership(request,env,auth.token,auth.user.id,workspaceId);if(!member||!["owner","admin","researcher"].includes(member.role))return json(request,{error:"workspace_researcher_required"},403);
   const projectId=decodeURIComponent(planMatch[1]);
   const projectQuery=new URLSearchParams({select:"id,name,subject,markets,languages,scope,decision_intent",id:"eq."+projectId,workspace_id:"eq."+workspaceId,limit:"1"});
   const projectResponse=await db(request,env,auth.token,"research_projects?"+projectQuery.toString());
   if(!projectResponse.ok)return json(request,{error:"project_lookup_failed"},502);
   const projectRows=await projectResponse.json();if(!projectRows.length)return json(request,{error:"project_not_found"},404);
   const project=projectRows[0];
   const providerIds=requestedProvider?[requestedProvider]:["openai","anthropic","google-gemini","deepseek"];
   let connection=null;
   for(const providerId of providerIds){
    const query=new URLSearchParams({select:"provider_id,config,secret_ref,status",workspace_id:"eq."+workspaceId,provider_id:"eq."+providerId,limit:"1"});
    const result=await db(request,env,auth.token,"provider_connections?"+query.toString());
    if(result.ok){const rows=await result.json();if(rows.length&&rows[0].secret_ref){connection=rows[0];break;}}
   }
   if(!connection)return json(request,{error:"ai_provider_not_configured",message:"Configure and save at least one AI provider in Configuration Center first."},409);
   const encrypted=await env.PROVIDER_SECRETS.get(connection.secret_ref);if(!encrypted)return json(request,{error:"ai_provider_secret_missing"},404);
   let credentials;try{credentials=JSON.parse(await decryptSecret(env,encrypted));}catch{return json(request,{error:"ai_provider_secret_decryption_failed"},500);}
   const systemPrompt="You are Varuna's evidence-led research planning engine. Produce a practical research plan, not market findings. Do not invent data, sales, market sizes, API access, or provider capabilities. Use only provider IDs from this allowed list: "+providers.map(p=>p[0]).join(", ")+". Treat search volume, ranking, views, likes and listing counts only as demand proxies, never as sales. Separate observed evidence requirements from estimates and hypotheses. Output one valid JSON object only, with keys: summary (string), research_questions (array of objects with id,question,decision_relevance,priority), workstreams (array of objects with title,domain_code,research_question,geographies,languages,evidence_requirements,suggested_provider_ids,stop_conditions), coverage_requirements (array), assumptions (array), limitations (array), human_review_questions (array). Use domain codes D01-D12. Include both China and global markets when requested. For USB Cable, distinguish connector, USB protocol, data rate, charging power, e-marker, length, material, certification and test evidence.";
   const prompt="Create a research plan for this project. Project: "+JSON.stringify(project)+"\nDecision intent: "+(project.decision_intent||"Identify evidence-backed product development opportunities.")+"\nScope: "+JSON.stringify(project.scope||{})+"\nReturn 6-12 focused workstreams with clear evidence requirements and stopping rules. No findings or invented metrics.";
   let generated;
   try{generated=await generateAI(connection.provider_id,credentials,connection.config||{},{model:body?.model,system_prompt:systemPrompt,prompt,max_output_tokens:6000});}
   catch(error){const code=error instanceof Error?error.message:"ai_generation_failed";return json(request,{error:code.startsWith("ai_provider_http_")?code:"ai_plan_generation_failed"},502);}
   let plan;try{plan=parseModelJSON(generated.text);}catch{return json(request,{error:"ai_plan_invalid_json",message:"The selected model did not return valid JSON. Try another model or adjust its configuration."},502);}
   if(!Array.isArray(plan.workstreams)||!Array.isArray(plan.research_questions))return json(request,{error:"ai_plan_schema_invalid"},502);
   plan.workstreams=plan.workstreams.slice(0,20).map((w,i)=>({...w,id:w.id||"WS-"+String(i+1).padStart(2,"0"),domain_code:/^D(0[1-9]|1[0-2])$/.test(w.domain_code||"")?w.domain_code:"D02"}));
   const runInsert=await db(request,env,auth.token,"research_runs","POST",{workspace_id:workspaceId,project_id:projectId,status:"planning",plan,coverage:{status:"not_started"},created_by:auth.user.id},"return=representation");
   if(!runInsert.ok)return json(request,{error:"research_run_save_failed"},502);
   const runRows=await runInsert.json();const run=runRows[0];
   const taskRows=plan.workstreams.map(w=>({workspace_id:workspaceId,run_id:run.id,domain_code:w.domain_code,provider_id:Array.isArray(w.suggested_provider_ids)?w.suggested_provider_ids.find(id=>providers.some(p=>p[0]===id))||null:null,task_type:"evidence_discovery",status:"queued",input:w,output:{}}));
   let tasksCreated=0;
   if(taskRows.length){const taskInsert=await db(request,env,auth.token,"research_tasks","POST",taskRows,"return=representation");if(taskInsert.ok){const createdRows=await taskInsert.json();tasksCreated=createdRows.length;}}
   await db(request,env,auth.token,"research_projects?id=eq."+projectId,"PATCH",{status:"planning"},"return=minimal");
   return json(request,{created:true,run_id:run.id,project_id:projectId,provider_id:connection.provider_id,model:generated.model,plan,tasks_created:tasksCreated,tasks_expected:taskRows.length});
  }
  if(url.pathname.startsWith("/api/v1/"))return json(request,{error:"not_implemented",message:"This API capability is scheduled for the next implementation phase.",path:url.pathname},501);
  return json(request,{error:"not_found"},404);
 }
};