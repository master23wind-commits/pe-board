# 깃허브 페이지용(PWA) 빌드: pe-scoreboard.html → web/
import os,re,time,shutil
from PIL import Image,ImageDraw,ImageFont
B=os.path.dirname(os.path.abspath(__file__));W=os.path.join(B,"web");os.makedirs(W,exist_ok=True)
body=open(os.path.join(B,"pe-scoreboard.html"),encoding="utf-8").read()
ver=time.strftime("%Y%m%d%H%M")
head='''<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>태성쌤의 체육수업 점수판</title>
<meta name="description" content="체육 수업용 통합 점수판 · 팀 나누기 · PAPS · 대진표 · 스포츠 퀴즈">
<meta name="theme-color" content="#0a0f1a">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icon-192.png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="체육점수판">
</head>
<body>
'''
sw_reg='''<script>
if("serviceWorker" in navigator&&location.protocol==="https:"){addEventListener("load",()=>{navigator.serviceWorker.register("sw.js").then(r=>{r.addEventListener("updatefound",()=>{const n=r.installing;n&&n.addEventListener("statechange",()=>{if(n.state==="installed"&&navigator.serviceWorker.controller&&window.K&&K.toast)K.toast("새 버전이 준비됐어요. 다시 열면 바뀝니다","",3200);});});}).catch(()=>{});});}
try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist();}catch(e){}
</script>
'''
open(os.path.join(W,"index.html"),"w",encoding="utf-8").write(head+body+"\n"+sw_reg+"</body>\n</html>\n")
open(os.path.join(W,"manifest.webmanifest"),"w",encoding="utf-8").write('''{
  "name": "태성쌤의 체육수업 점수판",
  "short_name": "체육점수판",
  "description": "체육 수업용 통합 점수판",
  "start_url": "./",
  "scope": "./",
  "display": "standalone",
  "orientation": "any",
  "background_color": "#0a0f1a",
  "theme_color": "#0a0f1a",
  "lang": "ko",
  "icons": [
    {"src": "icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any"},
    {"src": "icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any"},
    {"src": "icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"}
  ]
}
''')
open(os.path.join(W,"sw.js"),"w",encoding="utf-8").write('''// 태성쌤의 체육수업 점수판 · 오프라인 캐시 (버전 VER)
const C="pe-board-VER";
const CORE=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith("pe-board-")&&k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;
  const u=new URL(r.url);
  // 화면(HTML): 인터넷이 되면 새 버전, 안 되면 저장본
  if(r.mode==="navigate"){e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put("index.html",cp));return res;}).catch(()=>caches.match("index.html")));return;}
  // 같은 사이트 파일과 구글 글꼴: 저장본 먼저, 뒤에서 새로 받아 두기
  if(u.origin===location.origin||/fonts\\.(googleapis|gstatic)\\.com$/.test(u.hostname)){
    e.respondWith(caches.match(r).then(hit=>{const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==="opaque")){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));}return res;}).catch(()=>hit);return hit||net;}));
  }
});
'''.replace("VER",ver))
# 아이콘
def icon(size,pad=0.0,path=None,round_=True):
    S=size;im=Image.new("RGBA",(S,S),(0,0,0,0));d=ImageDraw.Draw(im)
    bg=(10,15,26,255);
    if round_:d.rounded_rectangle([0,0,S-1,S-1],radius=int(S*0.22),fill=bg)
    else:d.rectangle([0,0,S,S],fill=bg)
    p=int(S*pad);inner=S-2*p
    # 점수판 틀
    x0,y0,x1,y1=p+inner*0.12,p+inner*0.22,p+inner*0.88,p+inner*0.78
    d.rounded_rectangle([x0,y0,x1,y1],radius=int(inner*0.08),outline=(255,180,40,255),width=max(2,int(inner*0.035)))
    f=None
    for fp in ["/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf","/usr/share/fonts/dejavu/DejaVuSans-Bold.ttf"]:
        if os.path.exists(fp):f=ImageFont.truetype(fp,int(inner*0.30));break
    f=f or ImageFont.load_default()
    cx=(x0+x1)/2;cy=(y0+y1)/2
    d.text((cx-inner*0.17,cy),"7",font=f,fill=(255,90,60,255),anchor="mm")
    d.text((cx+inner*0.17,cy),"5",font=f,fill=(56,174,252,255),anchor="mm")
    r=inner*0.025;d.ellipse([cx-r,cy-inner*0.07-r,cx+r,cy-inner*0.07+r],fill=(255,180,40,255));d.ellipse([cx-r,cy+inner*0.07-r,cx+r,cy+inner*0.07+r],fill=(255,180,40,255))
    # 아래 막대(시계 느낌)
    d.rounded_rectangle([p+inner*0.34,p+inner*0.82,p+inner*0.66,p+inner*0.88],radius=int(inner*0.03),fill=(255,180,40,255))
    im.save(os.path.join(W,path))
icon(192,0,"icon-192.png");icon(512,0,"icon-512.png");icon(180,0,"apple-touch-icon.png",round_=False);icon(512,0.1,"icon-maskable-512.png",round_=False)
open(os.path.join(W,".nojekyll"),"w").write("")
print("web built",ver)
