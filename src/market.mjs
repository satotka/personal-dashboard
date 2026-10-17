export const MARKET_SOURCES=[{id:'nikkei',symbol:'^N225',sourceUrl:'https://finance.yahoo.com/quote/%5EN225/'},{id:'usdjpy',symbol:'JPY=X',sourceUrl:'https://finance.yahoo.com/quote/JPY%3DX/'}];
export function parseMarket(payload,id,now=Date.now()){
 const result=payload?.chart?.result?.[0];if(payload?.chart?.error||!result)throw Error('配信元からデータを取得できません');
 const close=result.indicators?.quote?.[0]?.close;
 if(!Array.isArray(result.timestamp)||!Array.isArray(close))throw Error('配信データの形式が不正です');
 const rows=result.timestamp.map((t,i)=>({time:t*1000,value:close[i]})).filter(p=>Number.isFinite(p.time)&&p.time<=now&&Number.isFinite(p.value)&&p.value>0).sort((a,b)=>a.time-b.time);
 if(!rows.length)throw Error('有効な日次データがありません');
 const latest=rows.at(-1),previous=rows.at(-2);return {id,rows,value:latest.value,change:previous?latest.value-previous.value:null,changePercent:previous?(latest.value/previous.value-1)*100:null,asOf:latest.time,fetchedAt:now,state:'ready',timezone:result.meta?.exchangeTimezoneName||'Asia/Tokyo',source:'Yahoo Finance'};
}
export async function acquireMarket(source,fetcher=fetch,now=Date.now()){
 const url=`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(source.symbol)}?range=10y&interval=1d`;
 const res=await fetcher(url,{headers:{Accept:'application/json','User-Agent':'PocketDashboard/1.0'},signal:AbortSignal.timeout(20000),redirect:'manual'});
 if(res.status>=300&&res.status<400)throw Error('配信元がリダイレクトを返しました（'+res.status+'）');
 if(!res.ok)throw Error(`配信元の取得エラー（${res.status}）`);
 return {...parseMarket(await res.json(),source.id,now),sourceUrl:source.sourceUrl};
}
export async function getMarkets(request,cache=null,fetcher=fetch,now=Date.now()){
 return Object.fromEntries(await Promise.all(MARKET_SOURCES.map(async source=>{
 const key=new Request(new URL('/__market_cache_v2/'+source.id,request.url));let saved=null;
 if(cache){const hit=await cache.match(key);if(hit)try{saved=await hit.json()}catch{}}
 if(saved&&now<(saved.retryAt||saved.fetchedAt+86400000))return [source.id,saved];
 try{const data=await acquireMarket(source,fetcher,now);if(cache)await cache.put(key,new Response(JSON.stringify(data),{headers:{'Cache-Control':'public, max-age=604800'}}));return [source.id,data]}
 catch(error){const data={...(saved||{id:source.id,rows:[],sourceUrl:source.sourceUrl}),state:saved?.rows?.length?'stale':'error',message:error.message,retryAt:now+3600000};if(cache)await cache.put(key,new Response(JSON.stringify(data),{headers:{'Cache-Control':'public, max-age=604800'}}));return [source.id,data]}
 })));
}
