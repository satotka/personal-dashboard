import {createDiagnosticSession,readDiagnostics} from './diagnostics.mjs';
import {getNews} from './news.mjs';
import {siteCache} from './cache.mjs';
import {getWeather} from './weather.mjs';
import {getMarkets} from './market.mjs';
export default {async fetch(request,env){
 const url=new URL(request.url);
 if(url.pathname.startsWith('/api/')){
  const reply=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
  if(request.method!=='GET')return reply({error:'Method not allowed'},405);
  if(!['/api/diagnostics','/api/news','/api/weather','/api/markets'].includes(url.pathname))return reply({error:'Not found'},404);
  if(url.pathname==='/api/diagnostics'){if(!env?.BUCKET)return reply({error:'診断保存領域が利用できません'},503);return reply(await readDiagnostics(env.BUCKET))}
  const group=url.pathname.slice(5);const session=createDiagnosticSession(env?.BUCKET,group);try{const cache=siteCache(env);const fn=group==='news'?getNews:group==='weather'?getWeather:getMarkets;const payload=await fn(request,cache,session.fetcher);await session.finish(payload);const response=reply(payload);response.headers.set('X-Diagnostic-ID',session.traceId);return response}catch(error){console.error(JSON.stringify({event:'api_failure',traceId:session.traceId,group,errorType:error.name,message:String(error.message).slice(0,240)}));return reply({error:'データ取得処理に失敗しました',diagnosticId:session.traceId},500)}
 }
 if(url.pathname!=='/')return new Response('Not found',{status:404,headers:{'Cache-Control':'no-store'}});
 if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405,headers:{Allow:'GET, HEAD'}});
 return new Response(request.method==='HEAD'?null:HTML,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'self'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; base-uri 'none'; frame-ancestors 'self'"}});
}};
