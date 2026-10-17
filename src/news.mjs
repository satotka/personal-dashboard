export const NEWS_COMPANIES=['NHK トップニュース','Money Forward ME','ソニー銀行','auじぶん銀行','横浜銀行','三菱UFJ eスマート証券','JIS&T','Coincheck','ChatGPT'];
export function decodeXml(value){return value.replace(/^<!\[CDATA\[([\s\S]*)\]\]>$/,'$1').replace(/&#(x[0-9a-f]+|\d+);/gi,(_,n)=>{const cp=n[0].toLowerCase()==='x'?parseInt(n.slice(1),16):Number(n);return cp>=0&&cp<=0x10ffff?String.fromCodePoint(cp):''}).replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&amp;/g,'&');}
export function parseNews(xml,company,now=Date.now()){
 if(xml.length>2000000||!/<rss[\s>]/i.test(xml))throw Error('News配信形式が不正です');
 const tag=(item,name)=>{const m=item.match(new RegExp('<'+name+'(?:\\s[^>]*)?>([\\s\\S]*?)<\\/'+name+'>','i'));return m?decodeXml(m[1].trim()):''};const seen=new Set(),rows=[];
 for(const match of xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)){const item=match[1],title=tag(item,'title'),url=tag(item,'link'),date=Date.parse(tag(item,'pubDate'));let u;try{u=new URL(url)}catch{continue}if(u.protocol!=='https:'||!title||!Number.isFinite(date)||date>now||date<now-7*86400000||seen.has(url))continue;seen.add(url);rows.push({company,title,url,publishedAt:new Date(date).toISOString(),publisher:tag(item,'source')})}return rows.sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt));
}
export async function getNews(request,cache,fetcher=fetch,now=Date.now()){
 const results={};for(let offset=0;offset<NEWS_COMPANIES.length;offset+=4){await Promise.all(NEWS_COMPANIES.slice(offset,offset+4).map(async company=>{
 const key=new Request(new URL('/__news_v1/'+encodeURIComponent(company),request.url));let old=null;const hit=await cache?.match(key);if(hit)try{old=await hit.json()}catch{}
 if(old&&now<(old.retryAt||old.fetchedAt+(company==='NHK トップニュース'?3600000:21600000))){results[company]=old;return}
 try{const isNhk=company==='NHK トップニュース';const url=new URL(isNhk?'https://news.web.nhk/n-data/conf/na/rss/cat0.xml':'https://news.google.com/rss/search');if(!isNhk)url.search=new URLSearchParams({q:'"'+company+'" when:7d',hl:'ja',gl:'JP',ceid:'JP:ja'});let response=await fetcher(url,{redirect:'manual',signal:AbortSignal.timeout(15000)});if(response.status>=300&&response.status<400)throw Error('News配信元のリダイレクト（'+response.status+'）');if(!response.ok)throw Error('News取得エラー（'+response.status+'）');const data={state:'ready',rows:parseNews(await response.text(),company,now),fetchedAt:now,source:isNhk?'NHK 主要ニュースRSS':'Google News RSS',searchUrl:'https://news.google.com/search?q='+encodeURIComponent('"'+company+'" when:7d')+'&hl=ja&gl=JP&ceid=JP:ja'};await cache?.put(key,new Response(JSON.stringify(data)));results[company]=data}
 catch(e){const data={...(old||{rows:[]}),state:old?.fetchedAt?'stale':'error',message:e.message,retryAt:now+3600000};await cache?.put(key,new Response(JSON.stringify(data)));results[company]=data}
 }))}return results;
}
