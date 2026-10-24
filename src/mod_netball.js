/* ================= 넷볼 ================= */
MODS.netball={name:"넷볼",sub:"7포지션 · 4쿼터 · 센터 패스 교대 · 슈팅 성공률 · 빙고",color:"var(--c-nb)",
html:`
<div class="board">
  <section class="team" data-t="0">
    <input class="tname" id="nname0" aria-label="팀 이름">
    <div class="serve" id="ncp0">${K.SERVE_SVG}<span>센터 패스</span></div>
    <div class="score" id="nsc0">0</div>
    <div class="tmeta"><div class="stat"><b id="npct0">-</b><span>슈팅 성공률</span></div><div class="stat"><b id="nint0">0</b><span>가로채기</span></div></div>
    <div class="btnrow op"><button class="pt" type="button" data-ng="0:GS">GS 골<small id="ngs0"></small></button><button class="pt" type="button" data-ng="0:GA">GA 골<small id="nga0"></small></button></div>
    <div class="btnrow op"><button class="small" type="button" data-nm="0:GS">GS 슛 실패</button><button class="small" type="button" data-nm="0:GA">GA 슛 실패</button><button class="small" type="button" data-nminus="0">점수 −1</button></div>
  </section>
  <section class="center">
    <div class="qtr" id="nq">1쿼터</div>
    <div class="clock" id="nclock">10:00</div>
    ${K.timeCtl("nc")}
    <div class="btnrow op"><button class="go" id="nGo" type="button">시작</button><button class="nextq" id="nNext" type="button" hidden>다음 쿼터</button></div>
    <div class="state" id="nstate"></div>
    <div class="op nb-pen"><div class="lbl">반칙 기록 (상대 팀 프리 패스 · 페널티 패스)</div>
      <div class="seg" role="group" aria-label="반칙한 팀" id="nfTeam"></div>
      <div class="btnrow" id="nfBtns"></div>
    </div>
    <div class="btnrow op"><button class="small" id="nUndo" type="button">되돌리기</button></div>
  </section>
  <section class="team" data-t="1">
    <input class="tname" id="nname1" aria-label="팀 이름">
    <div class="serve" id="ncp1">${K.SERVE_SVG}<span>센터 패스</span></div>
    <div class="score" id="nsc1">0</div>
    <div class="tmeta"><div class="stat"><b id="npct1">-</b><span>슈팅 성공률</span></div><div class="stat"><b id="nint1">0</b><span>가로채기</span></div></div>
    <div class="btnrow op"><button class="pt" type="button" data-ng="1:GS">GS 골<small id="ngs1"></small></button><button class="pt" type="button" data-ng="1:GA">GA 골<small id="nga1"></small></button></div>
    <div class="btnrow op"><button class="small" type="button" data-nm="1:GS">GS 슛 실패</button><button class="small" type="button" data-nm="1:GA">GA 슛 실패</button><button class="small" type="button" data-nminus="1">점수 −1</button></div>
  </section>
</div>
<div class="rosters">
  <div class="roster" data-t="0"><h3 id="nrh0">홍팀 포지션</h3><div id="nr0"></div></div>
  <div class="roster" data-t="1"><h3 id="nrh1">청팀 포지션</h3><div id="nr1"></div></div>
</div>
<div class="bgk" id="nbBingo"></div>
<div class="lower">
  <div class="box"><h4>경기 기록</h4><ul class="log" id="nlog"></ul></div>
  <div class="box op">
    <h4>경기 설정</h4>
    <div class="cfg">
      <div class="cfgrow">
        <label>쿼터 수 <select id="ncQ"><option value="2">2쿼터(전·후반)</option><option value="4">4쿼터</option></select></label>
        <label>쿼터 시간 <input id="ncMin" type="number" min="1" max="15">분</label>
        <label><input id="ncRot" type="checkbox"> 쿼터마다 포지션 돌리기</label>
      </div>
      <div class="names">
        <div><div class="nh"><span id="nnl0">홍팀 명단</span></div><textarea id="nros0" aria-label="홍팀 명단"></textarea></div>
        <div><div class="nh"><span id="nnl1">청팀 명단</span></div><textarea id="nros1" aria-label="청팀 명단"></textarea></div>
      </div>
      <div class="keys">넷볼은 한 팀 7명이 포지션 조끼(GS·GA·WA·C·WD·GD·GK)를 입고, 자기 포지션 구역에서만 움직여요. 골은 GS(골 슈터)와 GA(골 어택)만, 슈팅 서클 안에서 넣을 수 있고 한 골에 1점이에요.<br>
        공을 잡으면 3초 안에 패스하거나 슛해야 하고, 착지한 발을 떼고 다시 디디면 안 돼요(발 움직임). 수비는 공을 가진 선수에게서 0.9m 떨어져야 해요(방해). 골이 들어가면 센터 패스는 두 팀이 번갈아 해요.<br>
        포지션 표에서 학생마다 포지션을 고르면 GS·GA 골 버튼이 그 학생 이름으로 기록돼요. '쿼터마다 포지션 돌리기'를 켜면 다음 쿼터에 모두 한 칸씩 옮겨 가요.<br>
        <kbd>Space</kbd> 시계 시작/정지 · <kbd>Z</kbd> 되돌리기</div>
      <div><button class="danger" id="nNew" type="button">새 경기</button></div>
    </div>
  </div>
</div>`,
init(ctx){
const $=K.$,R=ctx.root,KEY="pe-netball",esc=K.esc;
const POS=["GS","GA","WA","C","WD","GD","GK"];
const PN={GS:"골 슈터",GA:"골 어택",WA:"윙 어택",C:"센터",WD:"윙 디펜스",GD:"골 디펜스",GK:"골 키퍼"};
const TCOL=["var(--red)","var(--blue)"];
const FAULTS=["발 움직임(트래블)","3초 넘게 들기","방해(0.9m 안)","접촉","오프사이드(구역 이탈)","던지기 잘못(한 손 잡기 등)"];
const z=n=>Array(n).fill(0);
function mkTeam(name,roster){const r=roster.slice(0,15);return{name,roster:r,pos:r.map((_,i)=>i<7?POS[i]:""),g:z(15),a:z(15),it:z(15),fouls:0,bg:0};}
function fresh(cfg,keep){
  cfg=cfg||{q:4,min:8,rot:true};
  const k=keep||[{name:"홍팀",roster:K.EX10[0]},{name:"청팀",roster:K.EX10[1]}];
  return{cfg,teams:k.map(x=>mkTeam(x.name,x.roster)),q:1,clock:cfg.min*60000,running:false,qEnd:false,over:null,cp:0,first:0,ft:0,hist:[],log:[]};
}
let S=K.load(KEY);if(!S||!S.teams)S=fresh();S.running=false;
let undoStack=[],lastSave=0;
const save=()=>K.save(KEY,S);
K.fixKit(R,{get:()=>S,snap:()=>snap(),after:()=>{save();draw();}});
function snap(){undoStack.push(JSON.stringify(Object.assign({},S,{running:false})));if(undoStack.length>250)undoStack.shift();}
function undo(){if(!undoStack.length)return;const keep={clock:S.clock,running:S.running};S=Object.assign(JSON.parse(undoStack.pop()),keep);K.closeModal();save();draw();K.toast("되돌렸습니다","",1200);}
const score=t=>S.teams[t].g.reduce((a,b)=>a+b,0)+(S.teams[t].og||0)+(S.teams[t].bg||0);
const who=(t,p)=>S.teams[t].pos.indexOf(p);
const BG=K.bingoKit({el:$("nbBingo"),key:"netball",get:()=>S,teams:()=>S.teams.map((T,t)=>({name:T.name,color:TCOL[t],roster:T.roster})),
  missions:["가로채기 성공","센터 패스에서 3번 만에 골","리바운드 잡아 골","모든 포지션이 공 한 번씩","발 움직임 반칙 없이 한 쿼터","GA 골","3초 안에 빠른 패스 5번","수비 리바운드"],bonusDef:1,
  hint:"GS·GA가 골을 넣거나 가로채기를 하면 그 학생 칸이 채워지고",
  apply:(t,p)=>{S.teams[t].bg=(S.teams[t].bg||0)+p;},snap:()=>snap(),after:()=>{save();draw();}});
function addLog(o){o.q=S.q;o.sc=[score(0),score(1)];S.log.unshift(o);if(S.log.length>120)S.log.pop();}
function goal(t,p){
  if(S.over)return;snap();
  const T=S.teams[t],i=who(t,p);
  if(i>=0){T.g[i]++;T.a[i]++;BG.hit(t,i);}else T.og=(T.og||0)+1;
  S.cp=1-S.cp; // 센터 패스는 골이 들어갈 때마다 번갈아
  addLog({k:"g",t,p,who:i>=0?T.roster[i]:null});
  save();draw();K.bump($("nsc"+t));K.fx.play("netball",$("nsc"+t));K.snd.swish();
  K.toast(T.name+" 골! "+p+(i>=0?" "+T.roster[i]:"")+" · 다음 센터 패스: "+S.teams[S.cp].name,"bingo",2200);
}
function miss(t,p){if(S.over)return;snap();const T=S.teams[t],i=who(t,p);if(i>=0)T.a[i]++;else T.oa=(T.oa||0)+1;addLog({k:"x",t,p,who:i>=0?T.roster[i]:null});save();draw();}
function pct(t){const T=S.teams[t];const g=T.g.reduce((a,b)=>a+b,0)+(T.og||0),a=T.a.reduce((x,y)=>x+y,0)+(T.og||0)+(T.oa||0);return a?Math.round(100*g/a)+"%":"-";}
function qUp(){
  S.running=false;K.wake(false);K.snd.horn();
  S.hist.push([score(0),score(1)]);
  if(S.q>=S.cfg.q){const a=score(0),b=score(1);finish(a>b?0:b>a?1:-1);return;}
  S.qEnd=true;save();draw();K.toast(S.q+"쿼터 종료","",2400);
}
function nextQ(){
  S.q++;S.qEnd=false;S.clock=S.cfg.min*60000;undoStack=[];
  if(S.cfg.rot)S.teams.forEach(T=>{
    // 포지션을 가진 학생과 벤치 학생이 함께 한 칸씩 돈다
    const n=T.roster.length,old=T.pos.slice();
    T.pos=old.map((_,i)=>old[(i-1+n)%n]);
  });
  save();draw();K.toast(S.q+"쿼터 · "+(S.cfg.rot?"포지션을 한 칸씩 옮겼어요 · ":"")+S.teams[S.cp].name+" 센터 패스","",2600);
}
function finish(w){
  S.over={w};S.running=false;save();draw();setTimeout(K.snd.fanfare,300);
  const T=S.teams;let st="";
  [0,1].forEach(t=>{const x=T[t],sc=x.roster.map((n,i)=>x.g[i]?n+" "+x.g[i]+"골":null).filter(Boolean);st+="<div>"+esc(x.name)+" 슈팅 "+pct(t)+(sc.length?" · <b>"+esc(sc.join(", "))+"</b>":"")+"</div>";});
  K.modal({sub:"경기 종료",title:w<0?"무승부":T[w].name+" 승리",color:w<0?"var(--fg)":TCOL[w],score:score(0)+" : "+score(1),stats:st,buttons:[{label:"되돌리기",fn:undo},{label:"닫기"}]});
  ctx.store(makeRec());
}
function makeRec(){
  if(!S.mid)S.mid=K.newId();
  const T=S.teams,d=[S.hist.map((h,i)=>(i+1)+"Q "+h.join(":")).join(" · ")].filter(Boolean);
  T.forEach((x,t)=>d.push(x.name+" 슈팅 성공률 "+pct(t)+" · 반칙 "+x.fouls));
  if(BG.summary())d.push(BG.summary());
  return{id:S.mid,sport:"netball",sportName:"넷볼",at:Date.now(),done:!!S.over,
    teams:T.map((x,t)=>({name:x.name,score:score(t)})),winner:S.over?(S.over.w<0?"무승부":T[S.over.w].name):null,
    summary:score(0)+" : "+score(1),details:d,
    players:T.flatMap(x=>x.roster.map((n,i)=>({team:x.name,name:n,pts:x.g[i],note:"슛 "+x.a[i]+" · 가로채기 "+x.it[i]})))};
}
function drawClock(){
  $("nq").textContent=S.cfg.q===2?(S.q===1?"전반":"후반"):S.q+"쿼터";
  const c=$("nclock");c.textContent=K.fmt(S.clock);c.className="clock"+(S.clock<60000?" low":"");
  if(!S.running)K.fillTime("nc",S.clock);
  const g=$("nGo");g.textContent=S.running?"정지":"시작";g.classList.toggle("run",S.running);g.hidden=S.qEnd||!!S.over;
  $("nNext").hidden=!S.qEnd||!!S.over;$("nNext").textContent=S.cfg.q===2?"후반 시작":"다음 쿼터";
}
function draw(){
  const T=S.teams;
  [0,1].forEach(t=>{
    const x=T[t];
    K.setVal("nname"+t,x.name);$("nsc"+t).textContent=score(t);
    $("ncp"+t).classList.toggle("no",S.cp!==t||!!S.over);
    $("npct"+t).textContent=pct(t);$("nint"+t).textContent=x.it.reduce((a,b)=>a+b,0);
    const gs=who(t,"GS"),ga=who(t,"GA");$("ngs"+t).textContent=gs>=0?x.roster[gs]:"(지정 안 됨)";$("nga"+t).textContent=ga>=0?x.roster[ga]:"(지정 안 됨)";
    $("nrh"+t).textContent=x.name+" 포지션";$("nnl"+t).textContent=x.name+" 명단 ("+x.roster.length+"명)";
    let h="<div class=\"prow nb head\"><span>이름</span><span>포지션</span><span style=\"text-align:center\">골/슛</span><span style=\"text-align:center\">가로채기</span><span class=\"op\"></span></div>";
    x.roster.forEach((n,i)=>{
      h+="<div class=\"prow nb\"><span class=\"pn\">"+esc(n)+"</span><select class=\"npos\" data-npos=\""+t+":"+i+"\" aria-label=\"포지션\"><option value=\"\">벤치</option>"+POS.map(p=>"<option value=\""+p+"\""+(x.pos[i]===p?" selected":"")+">"+p+" "+PN[p]+"</option>").join("")+"</select><span class=\"num\">"+K.fixN(x.g[i],"teams."+t+".g."+i+"|teams."+t+".a."+i,n+" · 골(슛 시도도 함께)","in")+"<small>/"+K.fixN(x.a[i],"teams."+t+".a."+i,n+" · 슛 시도","in")+"</small></span>"+K.fixN(x.it[i],"teams."+t+".it."+i,n+" · 가로채기")+"<span class=\"btns op\"><button type=\"button\" class=\"small\" data-nit=\""+t+":"+i+"\">가로채기</button></span></div>";
    });
    $("nr"+t).innerHTML=h;
    K.setVal("nros"+t,x.roster.join("\n"));
  });
  $("nstate").innerHTML=S.over?"경기 종료":"다음 센터 패스: <b style=\"color:"+TCOL[S.cp]+"\">"+esc(T[S.cp].name)+"</b>";
  $("nfTeam").innerHTML=[0,1].map(t=>"<button type=\"button\" data-nft=\""+t+"\" aria-pressed=\""+(S.ft===t)+"\">"+esc(T[t].name)+" 반칙</button>").join("");
  $("nfBtns").innerHTML=FAULTS.map(f=>"<button class=\"small\" type=\"button\" data-nf=\""+esc(f)+"\">"+esc(f)+"</button>").join("");
  $("nlog").innerHTML=S.log.length?S.log.slice(0,14).map(l=>{
    const tn="<b style=\"color:"+TCOL[l.t]+"\">"+esc(T[l.t].name)+"</b>",q=" <span class=\"x\">· "+(S.cfg.q===2?(l.q===1?"전반":"후반"):l.q+"Q")+"</span>";
    if(l.k==="g")return "<li><span class=\"p\" style=\"--c:"+TCOL[l.t]+"\">"+l.sc.join(":")+"</span><span>"+tn+" 골 · "+l.p+(l.who?" "+esc(l.who):"")+q+"</span></li>";
    if(l.k==="x")return "<li><span class=\"p\" style=\"--c:"+TCOL[l.t]+"\">✕</span><span>"+tn+" 슛 실패 · "+l.p+(l.who?" "+esc(l.who):"")+q+"</span></li>";
    if(l.k==="i")return "<li><span class=\"p\" style=\"--c:"+TCOL[l.t]+"\">INT</span><span>"+tn+" 가로채기 · "+esc(l.who)+q+"</span></li>";
    if(l.k==="f")return "<li><span class=\"p\" style=\"--c:"+TCOL[l.t]+"\">반칙</span><span>"+tn+" "+esc(l.r)+q+"</span></li>";
    return "<li><span class=\"p\" style=\"--c:"+TCOL[l.t]+"\">−1</span><span>"+tn+" 점수 정정"+q+"</span></li>";
  }).join(""):"<li class=\"empty\">아직 기록이 없습니다. 포지션을 정하고 GS·GA 골 버튼으로 기록하세요.</li>";
  $("nUndo").disabled=!undoStack.length;
  $("ncQ").value=String(S.cfg.q);K.setVal("ncMin",S.cfg.min);$("ncRot").checked=S.cfg.rot;
  drawClock();BG.draw();
}
function start(){if(S.over||S.qEnd||S.clock<=0)return;S.running=true;K.wake(true);drawClock();K.snd.whistle(1);}
function stop(){S.running=false;K.wake(false);save();drawClock();}
$("nGo").onclick=()=>{S.running?stop():start();};
$("nNext").onclick=nextQ;
$("nUndo").onclick=undo;
K.bindTime(R,()=>S.clock,(k,v)=>{S.clock=Math.max(0,Math.min(5999000,v));if(S.qEnd&&v>0&&!S.over){S.qEnd=false;S.hist.pop();}save();draw();},{full:()=>S.cfg.min*60000,stop:()=>stop()});
K.arm($("nNew"),"새 경기",()=>{BG.reset();S=fresh(S.cfg,S.teams.map(x=>({name:x.name,roster:x.roster})));undoStack=[];K.closeModal();save();draw();K.toast("새 경기 준비 완료 (팀 이름·명단 유지)","",1800);});
R.addEventListener("click",e=>{
  let b;
  if(b=e.target.closest("[data-ng]")){const [t,p]=b.dataset.ng.split(":");goal(+t,p);return;}
  if(b=e.target.closest("[data-nm]")){const [t,p]=b.dataset.nm.split(":");miss(+t,p);return;}
  if(b=e.target.closest("[data-nminus]")){const t=+b.dataset.nminus,T=S.teams[t];if(score(t)<=0||S.over)return;snap();if(T.og>0)T.og--;else{const i=T.g.findIndex(x=>x>0);if(i>=0)T.g[i]--;else if(T.bg>0)T.bg--;}addLog({k:"m",t});save();draw();return;}
  if(b=e.target.closest("[data-nit]")){const [t,i]=b.dataset.nit.split(":").map(Number);if(S.over)return;snap();S.teams[t].it[i]++;BG.hit(t,i);addLog({k:"i",t,who:S.teams[t].roster[i]});save();draw();K.snd.chime();return;}
  if(b=e.target.closest("[data-nft]")){S.ft=+b.dataset.nft;draw();return;}
  if(b=e.target.closest("[data-nf]")){if(S.over)return;snap();S.teams[S.ft].fouls++;addLog({k:"f",t:S.ft,r:b.dataset.nf});save();draw();K.snd.whistle(1);K.toast(S.teams[S.ft].name+" "+b.dataset.nf+" · "+S.teams[1-S.ft].name+" 패스","",1800);return;}
});
R.addEventListener("input",e=>{const el=e.target;if(el.id==="nname0"||el.id==="nname1"){S.teams[+el.id.slice(-1)].name=el.value;save();}});
R.addEventListener("change",e=>{
  const el=e.target;
  if(el.dataset.npos){
    const [t,i]=el.dataset.npos.split(":").map(Number),T=S.teams[t],p=el.value;snap();
    // 같은 포지션은 한 명만: 원래 그 포지션이던 학생과 맞바꾼다
    const j=p?T.pos.indexOf(p):-1;if(j>=0&&j!==i)T.pos[j]=T.pos[i];
    T.pos[i]=p;save();draw();return;
  }
  if(el.id==="nros0"||el.id==="nros1"){
    const t=+el.id.slice(-1),list=K.parseList(el.value,15);if(!list.length){draw();return;}snap();
    const T=S.teams[t],old=T.roster;
    const pick=(arr,dflt)=>list.map(n=>{const k=old.indexOf(n);return k>=0?arr[k]:dflt;});
    T.pos=pick(T.pos,"");T.g=pick(T.g,0);T.a=pick(T.a,0);T.it=pick(T.it,0);T.roster=list;
    POS.forEach(p=>{if(T.pos.indexOf(p)<0){const k=T.pos.indexOf("");if(k>=0)T.pos[k]=p;}});
    save();draw();return;
  }
  if(["ncQ","ncMin","ncRot"].includes(el.id)){
    const C=S.cfg,om=C.min;C.q=+$("ncQ").value||4;C.min=Math.max(1,Math.min(15,+$("ncMin").value||8));C.rot=$("ncRot").checked;
    if(!S.running&&om!==C.min&&S.clock===om*60000)S.clock=C.min*60000;save();draw();
  }
});
draw();
return{
  record:makeRec,
  tick(dt,now){
    if(!S.running)return;
    S.clock=Math.max(0,S.clock-dt);
    if(S.clock<=0){qUp();return;}
    if(now-lastSave>1000){save();lastSave=now;}
    drawClock();
  },
  key(e){
    if(e.code==="Space"){e.preventDefault();S.running?stop():start();}
    else if(e.key==="z"||e.key==="Z")undo();
  },
  destroy(){if(S.running){S.running=false;save();}}
};
}};
