// Sites cannot use the default Cache API. Persist regenerable public data in R2.
export function siteCache(env){
 const bucket=env?.BUCKET;
 if(!bucket)throw Error('Sitesのキャッシュ保存領域が未接続です');
 return {async match(request){const data=await bucket.get(new URL(request.url).pathname.slice(1));return data?new Response(await data.text()):undefined},async put(request,response){await bucket.put(new URL(request.url).pathname.slice(1),await response.text(),{httpMetadata:{contentType:'application/json'}})}};
}
