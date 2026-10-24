// 태성쌤의 체육수업 점수판 · 오프라인 캐시 (버전 202610242213)
const C="pe-board-202610242213";
const CORE=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith("pe-board-")&&k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;
  const u=new URL(r.url);
  // 화면(HTML): 인터넷이 되면 새 버전, 안 되면 저장본
  if(r.mode==="navigate"){e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put("index.html",cp));return res;}).catch(()=>caches.match("index.html")));return;}
  // 같은 사이트 파일과 구글 글꼴: 저장본 먼저, 뒤에서 새로 받아 두기
  if(u.origin===location.origin||/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){
    e.respondWith(caches.match(r).then(hit=>{const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==="opaque")){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));}return res;}).catch(()=>hit);return hit||net;}));
  }
});
