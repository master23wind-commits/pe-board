/* ================= 팀 나누기 ================= */
MODS.teams={name:"팀 나누기",sub:"번호·성별·수준으로 공정하게, 때로는 재미있게",color:"var(--c-tm)",
html:`
<div class="box op tm-setup">
  <div id="tmRoster"></div>
  <div class="tm-abs">
    <div class="tm-abs-h"><b>오늘 함께하는 학생</b> <span id="tmCount"></span> <span class="x">· 빠진 학생은 눌러서 빼 주세요</span> <button type="button" class="small" id="tmAbsClr">모두 출석</button></div>
    <div class="tm-chips" id="tmAbs"></div>
  </div>
</div>
<div class="box op tm-how">
  <div class="cfgrow">
    <div class="seg" role="group" aria-label="나누는 기준" id="tmBy"><button type="button" data-tmby="n">팀 수로</button><button type="button" data-tmby="s">팀당 인원으로</button></div>
    <label><span id="tmByL">팀 수</span> <input id="tmNum" type="number" min="1" max="20" inputmode="numeric"></label>
    <span class="x" id="tmPreview"></span>
  </div>
  <div class="tm-methods" id="tmMethods"></div>
  <div class="tm-desc" id="tmDesc"></div>
  <details class="tm-more">
    <summary>더 보기 · 떨어뜨릴 학생, 연출</summary>
    <div class="cfg">
      <label class="tm-sep">같은 팀이 되면 안 되는 학생 번호 <input id="tmSep" placeholder="예) 3-7, 12-15 (쉼표로 여러 쌍)"></label>
      <div class="cfgrow">
        <label><input type="checkbox" id="tmReveal"> 한 명씩 뽑는 연출 (두근두근)</label>
        <label><input type="checkbox" id="tmShowLv"> 결과에 수준 보이기</label>
      </div>
    </div>
  </details>
  <div class="btnrow"><button class="go tm-go" type="button" id="tmGo">팀 나누기</button></div>
</div>
<div class="tm-result" id="tmResult"></div>
<div class="btnrow op tm-acts" id="tmActs" hidden>
  <button type="button" id="tmAgain">같은 방식으로 다시</button>
  <button type="button" id="tmCopy">결과 복사</button>
  <button type="button" id="tmToBr">이 팀들로 대진표 만들기 →</button>
</div>
<div class="box tm-hist op"><h4>최근 편성</h4><ul class="log" id="tmHist"></ul></div>`,
init(ctx){
const $=K.$,R=ctx.root,KEY="pe-teams",esc=K.esc;
const COL=["#ff5a3c","#38aefc","#ffcf3a","#4ade80","#b98cff","#ff9a2e","#ff6fae","#5eead4","#a3e635","#f0abfc","#7dd3fc","#fda4af"];
const CHO="ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";
const M=[
 {k:"random",t:"무작위",ic:"🎲",d:"번호를 모두 섞어 무작위로 나눠요. 팀 인원은 최대 1명 차이로 맞춰요."},
 {k:"mixed",t:"남녀 고르게",ic:"⚖️",d:"남학생과 여학생을 따로 섞은 뒤 팀마다 번갈아 넣어, 모든 팀의 남녀 수가 비슷해져요."},
 {k:"split",t:"남녀 따로",ic:"🚹🚺",d:"남학생끼리, 여학생끼리 따로 팀을 만들어요. 팀 수는 남녀 인원에 맞춰 나눠요. (예: 4팀 → 남자 2팀, 여자 2팀)"},
 {k:"skill",t:"실력 고르게",ic:"📊",d:"같은 수준끼리 묶은 뒤 잘하는 학생부터 한 명씩, 그때 실력 합이 가장 낮은 팀에 넣어요. 팀마다 실력 합이 비슷해져요."},
 {k:"skillmix",t:"남녀+실력 고르게",ic:"🧮",d:"남녀를 나눠 각각 실력 순으로 한 명씩, 그 성별이 적고 실력 합이 낮은 팀에 넣어요. 성별과 실력을 함께 맞추는 가장 공정한 방식이에요."},
 {k:"same",t:"비슷한 실력끼리",ic:"🎯",d:"수준이 비슷한 학생끼리 한 팀이 돼요. 수준별 리그나 수준별 연습에 좋아요."},
 {k:"order",t:"번호 차례로",ic:"🔢",d:"1번부터 차례로 끊어서 나눠요. (예: 1~6번 1팀, 7~12번 2팀)"},
 {k:"count",t:"번호 돌아가며",ic:"🔁",d:"1·2·3·4… 하고 번호를 세듯이 돌아가며 나눠요. (예: 1·5·9번이 1팀)"},
 {k:"tail",t:"전화번호 끝자리",ic:"📱",d:"전화번호 끝자리가 비슷한 학생끼리 모여요. 끝자리를 모르는 학생은 무작위로 들어가요."},
 {k:"name",t:"이름 비슷한 친구끼리",ic:"🔤",d:"이름(성 빼고)의 첫 자음이 비슷한 학생끼리 모여요. '민준·민서·미나'처럼요."},
 {k:"surname",t:"같은 성씨끼리",ic:"👪",d:"같은 성씨끼리 먼저 모이고, 남는 자리는 가까운 성씨끼리 채워요."}
];
let S=K.load(KEY);if(!S||!S.cfg)S={cfg:{by:"n",num:4,m:"mixed",sep:"",reveal:true,showLv:false},abs:{},last:null,hist:[]};
const save=()=>K.save(KEY,S);
let revealT=null;
const ui=K.rosterUI(R,"tm",{onChange:()=>{drawAbs();drawPreview();}});
const C=()=>K.cls.cur();
const absSet=()=>new Set(S.abs[C().id]||[]);
const present=()=>{const a=absSet();return C().st.filter(s=>!a.has(String(s.no)));};
function teamCount(n){
  const c=S.cfg;
  if(c.by==="n")return Math.max(1,Math.min(c.num||1,n||1));
  return Math.max(1,Math.round(n/Math.max(1,c.num||1)));
}
function drawAbs(){
  const a=absSet(),L=C().st;
  $("tmAbs").innerHTML=L.length?L.map(s=>"<button type=\"button\" class=\"tchip"+(a.has(String(s.no))?" off":"")+(s.sex==="남"?" m":s.sex==="여"?" f":"")+"\" data-tmabs=\""+esc(s.no)+"\"><b>"+esc(s.no)+"</b>"+(s.name?" "+esc(s.name):"")+"</button>").join(""):"<span class=\"x\">명단이 비어 있어요. 위에서 인원을 넣어 주세요.</span>";
  const p=present(),m=p.filter(s=>s.sex==="남").length,f=p.filter(s=>s.sex==="여").length;
  $("tmCount").textContent=p.length+"명"+(m||f?" (남 "+m+" · 여 "+f+")":"");
}
function drawPreview(){
  const c=S.cfg,n=present().length,t=teamCount(n);
  R.querySelectorAll("[data-tmby]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.tmby===c.by)));
  $("tmByL").textContent=c.by==="n"?"팀 수":"팀당 인원";
  K.setVal("tmNum",c.num);
  const lo=Math.floor(n/t),hi=Math.ceil(n/t);
  $("tmPreview").textContent=n?"→ "+t+"팀, 팀당 "+(lo===hi?lo:lo+"~"+hi)+"명":"";
  $("tmMethods").innerHTML=M.map(x=>"<button type=\"button\" class=\"tmm"+(x.k===c.m?" on":"")+"\" data-tmm=\""+x.k+"\"><span class=\"ic\">"+x.ic+"</span>"+x.t+"</button>").join("");
  const mm=M.find(x=>x.k===c.m);
  const st=present();let warn="";
  if(["mixed","split","skillmix"].includes(c.m)&&st.some(s=>!s.sex))warn=" ⚠ 성별이 비어 있는 학생 "+st.filter(s=>!s.sex).length+"명은 무작위로 들어가요.";
  if(["skill","skillmix","same"].includes(c.m)&&st.some(s=>!s.lv))warn=" ⚠ 수준이 비어 있는 학생 "+st.filter(s=>!s.lv).length+"명은 보통(3)으로 계산해요.";
  if(c.m==="tail"&&st.every(s=>!s.tail))warn=" ⚠ 끝자리가 모두 비어 있어요. '명단 고치기'에서 넣거나, 그냥 하면 무작위와 같아요.";
  if((c.m==="name"||c.m==="surname")&&st.every(s=>!s.name))warn=" ⚠ 이름이 비어 있어요. 명단에 이름을 넣어 주세요.";
  $("tmDesc").innerHTML=esc(mm.d)+(warn?"<span class=\"warn\">"+esc(warn)+"</span>":"");
  $("tmReveal").checked=c.reveal;$("tmShowLv").checked=c.showLv;K.setVal("tmSep",c.sep);
}
/* ---------- 나누는 방법 ---------- */
const lvOf=s=>+s.lv||3;
function chunk(list,t){const out=Array.from({length:t},()=>[]);const n=list.length;let i=0;for(let k=0;k<t;k++){const size=Math.floor(n/t)+(k<n%t?1:0);for(let j=0;j<size;j++)out[k].push(list[i++]);}return out;}
function deal(list,t,start){const out=Array.from({length:t},()=>[]);list.forEach((s,i)=>out[(i+(start||0))%t].push(s));return out;}
function snake(list,teams,pos){
  // pos: 이어서 배치할 위치(남녀를 이어 붙일 때 씀)
  const t=teams.length;let p=pos||0;
  list.forEach(s=>{const r=Math.floor(p/t),c=p%t;const k=r%2===0?c:t-1-c;teams[k].push(s);p++;});
  return p;
}
const sum=T=>T.reduce((a,x)=>a+lvOf(x),0);
function place(teams,s,score){
  // score(team) 배열을 앞에서부터 비교해 가장 작은 팀에 넣는다. 같으면 무작위
  const less=(x,y)=>{for(let j=0;j<x.length;j++){if(x[j]!==y[j])return x[j]<y[j];}return false;};
  let best=-1,bs=null;
  K.shuf(teams.map((_,i)=>i)).forEach(i=>{const v=score(teams[i]);if(!bs||less(v,bs)){best=i;bs=v;}});
  teams[best].push(s);
}
function byLevel(list){return K.shuf(list.slice()).sort((a,b)=>lvOf(b)-lvOf(a));}
function smallestFirst(teams){return teams.map((x,i)=>i).sort((a,b)=>teams[a].length-teams[b].length);}
function cho(name){const c=(name||"").charCodeAt(0)-0xAC00;return c>=0&&c<11172?CHO[Math.floor(c/588)]:(name||"").charAt(0);}
function make(list,t,m){
  const L=list.slice();
  if(m==="random")return deal(K.shuf(L),t);
  if(m==="order")return chunk(L.slice().sort((a,b)=>(+a.no||0)-(+b.no||0)),t);
  if(m==="count")return deal(L.slice().sort((a,b)=>(+a.no||0)-(+b.no||0)),t);
  if(m==="mixed"||m==="skillmix"){
    // 성별마다 '그 성별이 가장 적은 팀 → 인원이 가장 적은 팀 → 실력 합이 가장 낮은 팀' 순으로 한 명씩 넣는다
    const teams=Array.from({length:t},()=>[]);
    const boys=L.filter(s=>s.sex==="남"),girls=L.filter(s=>s.sex==="여"),other=L.filter(s=>!s.sex);
    const order=x=>m==="skillmix"?byLevel(x):K.shuf(x.slice());
    const [A,B]=boys.length>=girls.length?[boys,girls]:[girls,boys];
    [A,B,other].forEach(G=>order(G).forEach(s=>place(teams,s,T=>[T.filter(x=>x.sex===s.sex).length,T.length,m==="skillmix"?sum(T):0])));
    return teams;
  }
  if(m==="split"){
    const boys=L.filter(s=>s.sex!=="여"),girls=L.filter(s=>s.sex==="여");
    if(!boys.length||!girls.length)return deal(K.shuf(L),t);
    let tb=Math.max(1,Math.round(t*boys.length/L.length)),tg=Math.max(1,t-tb);
    if(tb+tg>t&&t>=2)tb=t-tg;
    const a=deal(K.shuf(boys),tb),b=deal(K.shuf(girls),tg);
    a.forEach(x=>x.tag="남자");b.forEach(x=>x.tag="여자");
    return a.concat(b);
  }
  if(m==="skill"){const teams=Array.from({length:t},()=>[]);byLevel(L).forEach(s=>place(teams,s,T=>[T.length,sum(T)]));return teams;}
  if(m==="same")return chunk(byLevel(L),t);
  if(m==="tail"){
    const has=L.filter(s=>s.tail!==""&&s.tail!=null),no=L.filter(s=>s.tail===""||s.tail==null);
    const sorted=K.shuf(has).sort((a,b)=>+a.tail-+b.tail);
    const teams=chunk(sorted.concat(K.shuf(no)),t);
    return teams;
  }
  if(m==="name"){
    const key=s=>{const g=(s.name||"").slice(1)||s.name||"";return cho(g)+g;};
    return chunk(K.shuf(L).sort((a,b)=>key(a).localeCompare(key(b),"ko")),t);
  }
  if(m==="surname"){
    const cnt={};L.forEach(s=>{const k=(s.name||"").charAt(0);cnt[k]=(cnt[k]||0)+1;});
    return chunk(K.shuf(L).sort((a,b)=>{const ka=(a.name||"").charAt(0),kb=(b.name||"").charAt(0);return ka===kb?0:(cnt[kb]-cnt[ka])||ka.localeCompare(kb,"ko");}),t);
  }
  return deal(K.shuf(L),t);
}
function parseSep(txt){
  return (txt||"").split(/[,\s/]+/).map(p=>p.split(/[-~·:]/).map(x=>x.trim()).filter(Boolean)).filter(p=>p.length===2);
}
function separate(teams,m){
  const pairs=parseSep(S.cfg.sep);if(!pairs.length)return 0;
  const where=no=>teams.findIndex(T=>T.some(s=>String(s.no)===no));
  const bad=()=>pairs.filter(([a,b])=>{const i=where(a);return i>=0&&i===where(b);});
  let guard=0,fixed=0;
  while(bad().length&&guard++<200){
    const [a,b]=bad()[0];const ti=where(b),T=teams[ti],s=T.find(x=>String(x.no)===b);
    // 다른 팀에서 성별·수준이 같은 학생과 바꾼다 (없으면 성별만, 그래도 없으면 아무나)
    const tries=[x=>x.sex===s.sex&&lvOf(x)===lvOf(s),x=>x.sex===s.sex,()=>true];
    let done=false;
    for(const ok of tries){
      for(const oi of K.shuf(teams.map((_,i)=>i))){
        if(oi===ti||(m==="split"&&teams[oi].tag!==T.tag))continue;
        const cand=K.shuf(teams[oi].filter(x=>ok(x)&&!pairs.some(p=>p.includes(String(x.no)))&&!pairs.some(([p,q])=>(String(p)===a||String(q)===a)&&false)));
        const c=cand.find(x=>!teams[ti].some(y=>pairs.some(([p,q])=>(p===String(x.no)&&q===String(y.no))||(q===String(x.no)&&p===String(y.no)))));
        if(c){teams[oi].splice(teams[oi].indexOf(c),1,s);T.splice(T.indexOf(s),1,c);done=true;fixed++;break;}
      }
      if(done)break;
    }
    if(!done)break;
  }
  return bad().length?-1:fixed;
}
function stats(T){
  const m=T.filter(s=>s.sex==="남").length,f=T.filter(s=>s.sex==="여").length;
  const lv=T.length?(T.reduce((a,s)=>a+lvOf(s),0)/T.length):0;
  return{m,f,lv};
}
function run(){
  const L=present();
  if(L.length<2){K.toast("학생이 2명 이상 있어야 해요","bad",1600);return;}
  const t=teamCount(L.length);
  if(t<2){K.toast("팀이 2개 이상 되도록 숫자를 바꿔 주세요","bad",1800);return;}
  let teams=make(L,t,S.cfg.m).filter(T=>T.length);
  const sep=separate(teams,S.cfg.m);
  const names=teams.map((T,i)=>T.tag?T.tag+" "+(teams.filter((x,j)=>j<=i&&x.tag===T.tag).length)+"팀":(i+1)+"팀");
  const res={at:Date.now(),cls:C().name,m:S.cfg.m,teams:teams.map((T,i)=>({name:names[i],st:T.map(s=>({no:s.no,name:s.name,sex:s.sex,lv:s.lv}))}))};
  S.last=res;S.hist.unshift({at:res.at,cls:res.cls,m:res.m,teams:res.teams});S.hist=S.hist.slice(0,8);save();
  if(sep<0)K.toast("떨어뜨릴 학생을 모두 떨어뜨리지 못했어요. 팀 수를 늘리거나 다시 눌러 주세요","bad",2600);
  drawResult(S.cfg.reveal);drawHist();
  setTimeout(()=>$("tmResult").scrollIntoView({block:"start",behavior:"smooth"}),50);
}
function drawResult(anim){
  clearTimeout(revealT);
  const r=S.last,el=$("tmResult");
  if(!r){el.innerHTML="";$("tmActs").hidden=true;return;}
  $("tmActs").hidden=false;
  const mm=M.find(x=>x.k===r.m)||M[0],showLv=S.cfg.showLv;
  el.innerHTML="<div class=\"tm-rh\"><b>"+esc(r.cls)+"</b> · "+mm.ic+" "+esc(mm.t)+" · "+r.teams.length+"팀 · "+r.teams.reduce((a,T)=>a+T.st.length,0)+"명</div><div class=\"tm-grid\">"+
    r.teams.map((T,i)=>{const s=stats(T.st);return "<section class=\"tm-team\" style=\"--tc:"+COL[i%COL.length]+"\"><h3>"+esc(T.name)+"<small>"+T.st.length+"명"+(s.m||s.f?" · 남 "+s.m+" · 여 "+s.f:"")+(showLv?" · 평균 수준 "+s.lv.toFixed(1):"")+"</small></h3><ul>"+
      T.st.map(x=>"<li class=\""+(x.sex==="남"?"m":x.sex==="여"?"f":"")+"\"><b>"+esc(x.no)+"</b><span>"+esc(x.name||"")+"</span>"+(showLv&&x.lv?"<em>"+"★".repeat(+x.lv)+"</em>":"")+"</li>").join("")+"</ul></section>";}).join("")+"</div>";
  if(anim){
    const lis=[...el.querySelectorAll(".tm-team li")];
    // 팀을 돌아가며 한 명씩 공개
    const byTeam=[...el.querySelectorAll(".tm-team")].map(sec=>[...sec.querySelectorAll("li")]);
    const order=[];const mx=Math.max(...byTeam.map(x=>x.length));
    for(let r2=0;r2<mx;r2++)byTeam.forEach(x=>{if(x[r2])order.push(x[r2]);});
    lis.forEach(li=>li.classList.add("hide"));
    let i=0;const gap=Math.max(70,Math.min(260,4200/order.length));
    const step=()=>{if(i>=order.length){K.snd.fanfare();return;}order[i].classList.remove("hide");order[i].classList.add("pop");K.snd.tick(1);i++;revealT=setTimeout(step,gap);};
    revealT=setTimeout(step,250);
  }
}
function drawHist(){
  $("tmHist").innerHTML=S.hist.length?S.hist.map((h,i)=>{const mm=M.find(x=>x.k===h.m)||M[0];return "<li class=\"tmh\"><span class=\"tmd\">"+K.fmtDate(h.at).slice(5)+"</span><span>"+esc(h.cls)+" · "+mm.ic+" "+esc(mm.t)+" · "+h.teams.length+"팀 <button type=\"button\" class=\"small\" data-tmh=\""+i+"\">다시 보기</button></span></li>";}).join(""):"<li class=\"empty\">아직 없어요.</li>";
}
function asText(){
  const r=S.last;if(!r)return "";
  return r.cls+" 팀 편성 ("+(M.find(x=>x.k===r.m)||M[0]).t+")\n"+r.teams.map(T=>T.name+" ("+T.st.length+"명): "+T.st.map(x=>x.no+(x.name?" "+x.name:"")).join(", ")).join("\n");
}
/* ---------- 이벤트 ---------- */
R.addEventListener("click",e=>{
  let b;
  if(b=e.target.closest("[data-tmabs]")){const id=C().id,no=b.dataset.tmabs;const a=new Set(S.abs[id]||[]);a.has(no)?a.delete(no):a.add(no);S.abs[id]=[...a];save();drawAbs();drawPreview();return;}
  if(b=e.target.closest("[data-tmby]")){S.cfg.by=b.dataset.tmby;S.cfg.num=S.cfg.by==="n"?4:5;save();drawPreview();return;}
  if(b=e.target.closest("[data-tmm]")){S.cfg.m=b.dataset.tmm;save();drawPreview();return;}
  if(b=e.target.closest("[data-tmh]")){const h=S.hist[+b.dataset.tmh];S.last=h;save();drawResult(false);$("tmResult").scrollIntoView({block:"start",behavior:"smooth"});return;}
});
$("tmAbsClr").onclick=()=>{S.abs[C().id]=[];save();drawAbs();drawPreview();};
$("tmNum").onchange=e=>{S.cfg.num=Math.max(1,Math.min(20,+e.target.value||1));save();drawPreview();};
$("tmSep").onchange=e=>{S.cfg.sep=e.target.value.trim();save();};
$("tmReveal").onchange=e=>{S.cfg.reveal=e.target.checked;save();};
$("tmShowLv").onchange=e=>{S.cfg.showLv=e.target.checked;save();drawResult(false);};
$("tmGo").onclick=run;$("tmAgain").onclick=run;
$("tmCopy").onclick=async()=>{const ok=await K.copyText(asText());K.toast(ok?"편성 결과를 복사했어요":"복사가 안 되는 환경이에요","",1600);};
$("tmToBr").onclick=()=>{if(!S.last)return;K.save("pe-bracket-import",{at:Date.now(),names:S.last.teams.map(T=>T.name),from:S.last.cls});K.go("bracket");};
drawAbs();drawPreview();drawResult(false);drawHist();
return{
  key(e){if(e.code==="Enter"){e.preventDefault();run();}},
  destroy(){clearTimeout(revealT);}
};
}};
