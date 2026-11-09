/* ================= 화면 번역 (영어 모드) =================
   방식: 화면에 그려진 한국어 글자를 사전(K.I18N_EN, i18n_en.js)으로 바꾼다. 모듈 코드는 그대로 둔다.
   1) 글자 덩어리 전체가 사전에 있으면 그대로 바꾸고
   2) 아니면 숫자+단위 규칙(5분 → 5 min, 2위 → 2nd)을 먼저 적용한 뒤
   3) 사전의 조각(2글자 이상, 긴 것부터)을 찾아 바꾼다.
   바꾸지 않는 것: 입력칸·글상자에 적은 글(학생 이름 등), translate="no" 안, 2단계에서 번역할 내용(퀴즈 문제·작전판 카드·득점 한마디). */
(()=>{
const LBTN=document.getElementById("langBtn");
if(LBTN){LBTN.textContent=K.LANG==="en"?"한국어":"English";LBTN.setAttribute("translate","no");
  LBTN.title=K.LANG==="en"?"한국어로 보기":"Switch to English";
  LBTN.onclick=()=>K.setLang(K.LANG==="en"?"ko":"en");}
K.tr=s=>s;
if(K.LANG!=="en")return;

const D=K.I18N_EN||{};
const H=/[가-힣]/;
const cache=new Map();
/* 2단계 내용(아직 한국어로 둠): 정확히 그 글자 덩어리면 건드리지 않음 */
const CONTENT=new Set();
const addC=s=>{if(typeof s==="string"&&H.test(s))CONTENT.add(s.trim());};
try{(K.QB||[]).forEach(r=>r.slice(3).forEach(addC));}catch(e){}
const PROTECT=[];
try{(K.PLAN_LIB||[]).forEach(c=>{addC(c.n);addC(c.s);(c.how||[]).forEach(addC);addC(c.g);(c.say||[]).forEach(x=>{addC(x);addC("“"+x+"”");});addC(c.e);addC(c.h);addC(c.safe);(c.ax||[]).forEach(addC);if(c.n&&c.n.length>2)PROTECT.push(c.n);});}catch(e){}
try{(K.PLAN_RECIPES||[]).forEach(r=>(r.ax||[]).forEach(addC));}catch(e){}
try{[K.BD_TIPS,K.VB_TIPS,K.TT_TIPS].forEach(a=>(a||[]).forEach(r=>addC(Array.isArray(r)?r[r.length-1]:r)));}catch(e){}
const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
const PRE=PROTECT.length?new RegExp(PROTECT.sort((a,b)=>b.length-a.length).map(esc).join("|"),"g"):null;
/* 기본 팀 이름은 맨 먼저 (홍팀 반칙 → Red fouls) */
const TEAMS={"홍팀":"Red","청팀":"Blue","황팀":"Yellow","녹팀":"Green","백팀":"White"};
const TRE=/홍팀|청팀|황팀|녹팀|백팀/g;
/* 조각 사전: 2글자 이상, 긴 것부터 */
const KEYS=Object.keys(D).filter(k=>k.length>=2&&H.test(k)).sort((a,b)=>b.length-a.length);
/* 카드 이름을 품은 사전 말(레시피 제목 등)은 카드 이름 보호보다 먼저 */
const SUP=PROTECT.length?KEYS.filter(k=>PROTECT.some(n=>k.includes(n))):[];
const SUPRE=SUP.length?new RegExp(SUP.map(esc).join("|"),"g"):null;
const LONG=new RegExp(KEYS.filter(k=>k.length>=4).map(esc).join("|"),"g");
const SHORT=new RegExp(KEYS.filter(k=>k.length<4).map(esc).join("|"),"g");
/* 한 글자 낱말(팀, 점, 라 …)은 앞뒤가 한글이 아닐 때만 */
const ONE=/(^|[^가-힣])([가-힣])(?![가-힣])/g;
const ord=n=>{n=+n;const s=["th","st","nd","rd"],v=n%100;return n+(s[(v-20)%10]||s[v]||s[0]);};
/* 숫자+단위 규칙 (조각 사전보다 먼저) */
/* 사전보다 먼저 적용할 문장 틀 */
const PRE_RULES=[
  [/랠리\s*(\d+)회로\s*(\d+)\s*점/g,"rally of $1 → $2 pts"],
  [/활동 카드\s*(\d+)장/g,"$1 activity cards"],[/레시피\s*(\d+)개/g,"$1 recipes"],
  /* 아이스하키 */
  [/(\d+)피리어드 시작/g,"Start period $1"],[/(\d+)피리어드 종료/g,"End of period $1"],[/(\d+)피리어드 뒤 휴식/g,"Intermission after period $1"],
  [/(\d+)피리어드 진행 중/g,"Period $1 in progress"],[/(\d+)피리어드/g,"Period $1"],[/스케이터 (\d+)명/g,"Skaters $1"],
  [/(\d+)번째 슈터/g,(m,n)=>ord(n)+" shooter"],[/(\d+)포인트/g,(m,n)=>n+(n==="1"?" pt":" pts")]
];
const NUM=[
  [/^(\d+)팀$/,"Team $1"],[/^(\d+)조$/,"Group $1"],
  [/(\d+)\s*회\s*초/g,"Top $1"],[/(\d+)\s*회\s*말/g,"Bottom $1"],
  [/(\d+)대(\d+)/g,"$1v$2"],[/(\d+)인제/g,"$1-a-side"],
  [/(\d+)쿼터/g,"Q$1"],[/(\d+)세트/g,"Set $1"],[/(\d+)게임/g,"Game $1"],[/(\d+)라운드/g,"Round $1"],
  [/(\d+)엔드/g,"End $1"],[/(\d+)피리어드/g,"Period $1"],[/(\d+)이닝/g,"Inning $1"],[/(\d+)단계/g,"Stage $1"],
  [/(\d+)학년/g,"Grade $1"],[/(\d+)반/g,"Class $1"],[/(\d+)차시/g,"Lesson $1"],
  [/(\d+)\s*번\s*서버/g,"server $1"],[/(\d+)번\s*자리/g,"position $1"],
  [/(\d+)등급/g,"Grade $1"],[/(\d+)(?:위|등)/g,(m,n)=>ord(n)],[/(\d+)번째/g,(m,n)=>ord(n)],
  [/(\d+)\s*분/g,"$1 min"],[/(\d+)\s*초/g,"$1 s"],[/(\d+)\s*점/g,(m,n)=>n+(n==="1"?" pt":" pts")],
  [/(\d+)\s*골/g,(m,n)=>n+(n==="1"?" goal":" goals")],[/(\d+)\s*경기/g,(m,n)=>n+(n==="1"?" game":" games")],
  [/(\d+)\s*줄/g,(m,n)=>n+(n==="1"?" line":" lines")],[/(\d+)\s*바퀴/g,(m,n)=>n+(n==="1"?" lap":" laps")],
  [/(\d+)\s*명/g,(m,n)=>n+(n==="1"?" player":" players")],[/(\d+)\s*팀/g,(m,n)=>n+(n==="1"?" team":" teams")],
  [/(\d+)\s*장/g,(m,n)=>n+(n==="1"?" card":" cards")],[/(\d+)\s*개/g,"$1"],[/(\d+)\s*회/g,"$1×"],
  [/(\d+)\s*번/g,"#$1"],[/(\d+)\s*승/g,"$1W"],[/(\d+)\s*패/g,"$1L"],[/(\d+)\s*무/g,"$1D"],
  [/(\d+)\s*연속/g,"$1 in a row"],[/(\d+)\s*루/g,"$1B"]
];
const isW=c=>c&&/[A-Za-z0-9가-힣)\]]/.test(c);
function trText(s){
  if(!s||!H.test(s))return s;
  const long=s.length>400;
  if(!long&&cache.has(s))return cache.get(s);
  const t=s.trim();let out;
  if(D[t]!==undefined)out=s.replace(t,D[t]);
  else if(t.length>=6&&CONTENT.has(t))out=s;
  else{
    const prot=[];let x=s;
    if(SUPRE)x=x.replace(SUPRE,m=>{prot.push(D[m]);return "\u0001"+(prot.length-1)+"\u0002";});
    if(PRE)x=x.replace(PRE,m=>{prot.push(m);return "\u0001"+(prot.length-1)+"\u0002";});
    x=x.replace(TRE,(m,off,str)=>TEAMS[m]+(isW(str[off+m.length])?" ":""));
    const rep=(m,off,str)=>{let v=D[m];if(!v)return v===undefined?m:v;
      if(isW(str[off-1])&&/^[A-Za-z0-9(]/.test(v))v=" "+v;
      if(isW(str[off+m.length])&&/[A-Za-z0-9.!?)]$/.test(v))v=v+" ";
      return v;};
    for(const [re,to] of PRE_RULES)x=x.replace(re,to);
    x=x.replace(LONG,rep);
    for(const [re,to] of NUM){if(re.source[0]==="^"){const t2=x.trim();if(re.test(t2)){x=x.replace(t2,t2.replace(re,to));}}else x=x.replace(re,to);}
    x=x.replace(SHORT,rep);
    x=x.replace(ONE,(m,pre,ch)=>{const v=D[ch];if(v===undefined)return m;return pre+(v&&/[A-Za-z0-9]$/.test(pre)&&/^[A-Za-z0-9(]/.test(v)?" ":"")+v;});
    x=x.replace(/\u0001(\d+)\u0002/g,(m,i)=>prot[+i]).replace(/ {2,}/g," ").replace(/ ([,.!?:)])/g,"$1").replace(/\( /g,"(");
    out=x;
  }
  if(!long)cache.set(s,out);
  return out;
}
K.tr=trText;
/* 입력칸에 넣는 기본값(팀 이름 '홍팀', 예시 반 이름 '1반' 등)은 줄마다 정확히 맞을 때만 바꾼다 */
const trLine=v=>{const t=v.trim();if(!H.test(t))return v;if(D[t]!==undefined)return D[t];const pm=t.match(/^선수\s*(\d+)$/);if(pm)return "Player "+pm[1];if(TEAMS[t])return TEAMS[t];for(const [re,to] of NUM.slice(0,2)){if(re.test(t))return t.replace(re,to);}const m=t.match(/^(\d+)반$/);return m?"Class "+m[1]:v;};
const osv=K.setVal;
K.setVal=(id,v)=>osv(id,typeof v==="string"&&H.test(v)?v.split("\n").map(trLine).join("\n"):v);

const ATTRS=["placeholder","title","aria-label","label"];
const SKIP={SCRIPT:1,STYLE:1,TEXTAREA:1,NOSCRIPT:1};
function skipEl(el){
  for(let e=el;e&&e!==document.body;e=e.parentElement){
    if(SKIP[e.tagName])return true;
    if(e.getAttribute&&(e.getAttribute("translate")==="no"||e.isContentEditable))return true;
  }
  return false;
}
function trAttrs(el){
  for(const a of ATTRS){const v=el.getAttribute(a);if(v&&H.test(v)){const o=trText(v);if(o!==v)el.setAttribute(a,o);}}
  if(el.tagName==="INPUT"&&(el.type==="text"||el.type==="search")&&H.test(el.value)&&document.activeElement!==el){const o=trLine(el.value);if(o!==el.value)el.value=o;}
}
function walk(n){
  if(n.nodeType===3){
    const v=n.nodeValue;if(!H.test(v))return;
    if(n.parentElement&&skipEl(n.parentElement))return;
    const o=trText(v);if(o!==v)n.nodeValue=o;return;
  }
  if(n.nodeType!==1)return;
  if(n.getAttribute("translate")==="no")return;
  if(SKIP[n.tagName]){if(n.tagName==="TEXTAREA")trAttrs(n);return;}
  if(n.isContentEditable)return;
  trAttrs(n);
  for(let c=n.firstChild;c;c=c.nextSibling)walk(c);
}
document.title=trText(document.title);
walk(document.body);
new MutationObserver(list=>{
  for(const m of list){
    if(m.type==="characterData")walk(m.target);
    else if(m.type==="attributes"){if(!skipEl(m.target))trAttrs(m.target);}
    else m.addedNodes.forEach(walk);
  }
}).observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:ATTRS});
/* 파일로 내려받거나 복사하는 글(CSV·지도안·결과)도 영어로. JSON(백업·공유 코드)은 그대로 */
const isJson=s=>typeof s==="string"&&/^\s*[\[{]/.test(s);
if(K.download){const od=K.download;K.download=(n,c,m)=>od(trText(n),(m&&/json/.test(m))||isJson(c)?c:trText(c),m);}
if(K.copyText){const oc=K.copyText;K.copyText=t=>oc(isJson(t)?t:trText(t));}
})();
