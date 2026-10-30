const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  "access-control-allow-headers": "authorization,content-type,x-request-id",
  "access-control-max-age": "86400"
};
const domains = [
  ["D01","Marketplace & Retail","电商与零售"],["D02","Search & Discovery","搜索与发现"],
  ["D03","Social & Community","社交与社区"],["D04","Reviews & Feedback","评论与客户反馈"],
  ["D05","Trends & Demand","趋势与需求"],["D06","Supplier & Manufacturing","供应链与制造"],
  ["D07","Company & Competition","企业与竞争"],["D08","Technical & Standards","技术与标准"],
  ["D09","Pricing & Commercial","价格与商业"],["D10","Trade & Logistics","贸易与物流"],
  ["D11","AI & Analytics","AI 与分析"],["D12","First-party Data","第一方数据"]
];
const providers = [
  ["openai","OpenAI","D11","AI models","reasoning,extraction,embeddings"],
  ["anthropic","Anthropic Claude","D11","AI models","reasoning,long_context,extraction"],
  ["google-gemini","Google Gemini","D11","AI models","multimodal,reasoning,extraction"],
  ["deepseek","DeepSeek","D11","AI models","reasoning,chinese_analysis"],
  ["dataforseo","DataForSEO","D02","Search data","serp,keywords,shopping"],
  ["google-ads","Google Ads Keyword Planning","D02","Search data","keyword_planning,search_volume"],
  ["ebay-browse","eBay Browse API","D01","Marketplace","item_search,catalog"],
  ["amazon-sp-api","Amazon SP-API","D01","Marketplace","catalog,seller_authorized_data"],
  ["alibaba-1688","1688 Open Platform","D06","Supplier","supplier_discovery,product_catalog"],
  ["reddit","Reddit API","D03","Social","community_search,posts"],
  ["youtube-data","YouTube Data API","D03","Social","video_search,video_metadata"],
  ["google-trends","Google Trends","D05","Demand trends","interest_over_time,related_queries"]
];
function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: { "content-type":"application/json; charset=utf-8", ...corsHeaders } });
}
export default {
  async fetch(request: Request, env: { VARUNA_ENV?: string; SUPABASE_URL?: string; SUPABASE_ANON_KEY?: string }): Promise<Response> {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null, { status:204, headers:corsHeaders });
    if (url.pathname === "/health" || url.pathname === "/api/v1/health") {
      return json({ service:"varuna-api", status:"ok", version:"0.1.0", environment:env.VARUNA_ENV || "unconfigured", timestamp:new Date().toISOString(), dependencies:{supabase:Boolean(env.SUPABASE_URL && env.SUPABASE_ANON_KEY)} });
    }
    if (url.pathname === "/api/v1/catalog") return json({ domains:domains.map(([id,name,label])=>({id,name,label})), providers:providers.map(([id,name,domain,category,capabilities])=>({id,name,domain,category,capabilities:capabilities.split(","),status:"not_configured"})) });
    if (url.pathname === "/api/v1/config" && request.method === "GET") return json({ configured:false, message:"Provider credential vault is not enabled yet. No credentials are accepted by this endpoint." },503);
    if (url.pathname.startsWith("/api/v1/")) return json({ error:"not_implemented", message:"This API capability is scheduled for the next implementation phase.", path:url.pathname },501);
    return json({ error:"not_found" },404);
  }
};