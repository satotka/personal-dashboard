export function parseJmaWeather(payload,now=Date.now()){
 const daily=payload?.[0],series=daily?.timeSeries;if(!Array.isArray(series))throw Error('気象庁の予報形式が不正です');
 const day=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(now));
 const weatherSeries=series.find(s=>s.areas.some(a=>a.area.code==='140010'&&Array.isArray(a.weathers)));
 const area=weatherSeries?.areas.find(a=>a.area.code==='140010');const index=weatherSeries?.timeDefines.findIndex(t=>t.slice(0,10)===day);
 if(!area||index<0||!area.weathers[index])throw Error('本日の神奈川県東部予報がありません');
 const description=area.weathers[index].replace(/\s+/g,' ');const code=area.weatherCodes[index];const icon=code?.startsWith('1')?'☀':code?.startsWith('3')?'🌧':code?.startsWith('4')?'❄':'☁';
 const popSeries=series.find(s=>s.areas.some(a=>a.area.code==='140010'&&Array.isArray(a.pops)));const pops=popSeries?.areas.find(a=>a.area.code==='140010')?.pops||[];
 const numeric=v=>v!==''&&v!=null&&Number.isFinite(Number(v))?Number(v):null;
 const rain=pops.map((v,i)=>popSeries.timeDefines[i]?.slice(0,10)===day?numeric(v):null).filter(v=>v!==null&&v>=0&&v<=100);
 const tempSeries=series.find(s=>s.areas.some(a=>a.area.code==='46106'&&Array.isArray(a.temps)));const tempArea=tempSeries?.areas.find(a=>a.area.code==='46106');const maxIndex=tempSeries?.timeDefines.findIndex(t=>t.slice(0,10)===day&&t.slice(11,13)==='09');
 const high=maxIndex>=0?numeric(tempArea.temps[maxIndex]):null;
 const asOf=Date.parse(daily.reportDatetime);if(!Number.isFinite(asOf))throw Error('気象庁の発表日時が不正です');
 return {state:'ready',source:'気象庁',sourceUrl:'https://www.jma.go.jp/bosai/forecast/#area_type=offices&area_code=140000',fetchedAt:now,cities:[{name:'横浜・川崎（神奈川県東部）',description,icon,high,low:null,rainProbability:rain.length?Math.max(...rain):null,forecastDate:Date.parse(day+'T00:00:00+09:00'),asOf,fetchedAt:now,source:'気象庁',forecastOnly:true}]};
}
export async function getWeather(request,cache=null,fetcher=fetch,now=Date.now()){
 const key=new Request(new URL('/__weather_jma_v1',request.url));let saved=null;if(cache){const hit=await cache.match(key);if(hit)try{saved=await hit.json()}catch{}}
 if(saved&&now<(saved.retryAt||saved.fetchedAt+3600000))return saved;
 try{const r=await fetcher('https://www.jma.go.jp/bosai/forecast/data/forecast/140000.json',{signal:AbortSignal.timeout(15000),redirect:'manual'});if(r.status>=300&&r.status<400)throw Error('気象庁がリダイレクトを返しました（'+r.status+'）');if(!r.ok){const e=Error('気象庁の取得エラー（'+r.status+'）');const wait=Number(r.headers.get('Retry-After'));if(r.status===429)e.retryMs=Math.max(3600000,Number.isFinite(wait)?wait*1000:3600000);throw e}const result=parseJmaWeather(await r.json(),now);if(cache)await cache.put(key,new Response(JSON.stringify(result)));return result}
 catch(error){const result={...(saved||{cities:[]}),state:saved?.cities?.length?'stale':'error',message:error.message,retryAt:now+(error.retryMs||900000)};if(cache)await cache.put(key,new Response(JSON.stringify(result)));return result}
}
