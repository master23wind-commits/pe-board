/* ================= 축구 · 풋살 ================= */
function makeSoccer(V){const FS=!!V.futsal;return{name:V.name,sub:V.sub,color:V.color,
html:`
<div class="board">
  <section class="team" data-t="0">
    <input class="tname" id="tname0" aria-label="팀 이름">
    <div class="score" id="score0">0</div>
    <div class="pills"><span class="pill" id="cards0"></span>${FS?'<span class="pill" id="fouls0"></span><span class="pill" id="tout0"></span>':''}</div>
    <div class="btnrow op"><button class="small" type="button" data-og="0">득점 (이름 없이)</button><button class="small" type="button" data-minus="0">점수 −1</button></div>
    ${FS?'<div class="btnrow op"><button class="small" type="button" data-foul="0">팀 반칙 +1</button><button class="small" type="button" data-fminus="0">반칙 −1</button><button class="small" type="button" data-tout="0">타임아웃</button></div>':''}
  </section>
  <section class="center">
    <div class="qtr" id="per">전반</div>
    <div class="clock" id="clock">0:00</div>
    ${K.timeCtl("st")}
    <div class="state" id="state">대기 중</div>
    <div class="btnrow op">
      <button class="go" id="goBtn" type="button">킥오프</button>
      <button class="small" id="endBtn" type="button">이번 하프 종료</button>
    </div>
    <button class="nextq op" id="nextBtn" type="button" hidden>후반 시작</button>
    <div class="pk" id="pkBox" hidden>
      <div class="lbl" style="text-align:center">승부차기</div>
      <div class="pkrow" data-t="0"><span class="nm" id="pkn0"></span><span class="kicks" id="pkk0"></span><span class="sum" id="pks0">0</span></div>
      <div class="pkrow" data-t="1"><span class="nm" id="pkn1"></span><span class="kicks" id="pkk1"></span><span class="sum" id="pks1">0</span></div>
      <div class="pkturn" id="pkTurn"></div>
      <div class="btnrow op"><button class="go" id="pkGoal" type="button">골</button><button class="small danger" id="pkMiss" type="button">실축 · 선방</button></div>
    </div>
    <div class="btnrow op">
      <button class="small" id="undoBtn" type="button">되돌리기</button>
    </div>
  </section>
  <section class="team" data-t="1">
    <input class="tname" id="tname1" aria-label="팀 이름">
    <div class="score" id="score1">0</div>
    <div class="pills"><span class="pill" id="cards1"></span>${FS?'<span class="pill" id="fouls1"></span><span class="pill" id="tout1"></span>':''}</div>
    <div class="btnrow op"><button class="small" type="button" data-og="1">득점 (이름 없이)</button><button class="small" type="button" data-minus="1">점수 −1</button></div>
    ${FS?'<div class="btnrow op"><button class="small" type="button" data-foul="1">팀 반칙 +1</button><button class="small" type="button" data-fminus="1">반칙 −1</button><button class="small" type="button" data-tout="1">타임아웃</button></div>':''}
  </section>
</div>
<div class="rosters">
  <div class="roster" data-t="0"><h3 id="rh0">홍팀 선수</h3><div id="r0"></div></div>
  <div class="roster" data-t="1"><h3 id="rh1">청팀 선수</h3><div id="r1"></div></div>
</div>
<div class="bgk" id="sBingo"></div>
<div class="lower">
  <div class="box"><h4>경기 기록</h4><ul class="log" id="log"></ul></div>
  <div class="box op">
    <h4>경기 설정</h4>
    <div class="cfg">
      <div class="cfgrow">
        <label>하프 시간(분) <input id="cfgHalf" type="number" min="1" max="45"></label>
        <label>경기 방식 <select id="cfgHalves"><option value="2">전·후반</option><option value="1">단판</option></select></label>
        <label><input id="cfgPk" type="checkbox"> 동점이면 승부차기</label>
      </div>
      <div class="names">
        <div><div class="nh"><span id="nl0">홍팀 명단</span></div><textarea id="ros0" aria-label="홍팀 명단"></textarea></div>
        <div><div class="nh"><span id="nl1">청팀 명단</span></div><textarea id="ros1" aria-label="청팀 명단"></textarea></div>
      </div>
      <div class="keys">${FS?"풋살은 5명(골키퍼 포함)이 뛰고, 교체는 자유롭게 할 수 있어요. 터치라인 밖으로 나간 공은 킥인으로 다시 시작해요. 팀 반칙은 하프마다 새로 세고, 6번째 반칙부터는 수비벽 없이 10m 지점에서 프리킥(두 번째 페널티 마크)을 줘요. 타임아웃은 하프마다 팀당 1번이에요.<br>":""}명단은 한 줄에 한 명, 팀당 최대 20명입니다. 처음 들어 있는 이름은 예시예요. 시계는 축구처럼 0분부터 올라가고, 하프 시간이 되면 휘슬이 울리며 멈춥니다. 경고 2장이면 자동으로 퇴장 처리돼요.<br>
        승부차기는 5명씩 번갈아 차고, 그래도 같으면 한 명씩 서든데스로 이어집니다.<br>
        <kbd>Space</kbd> 시작/정지 · <kbd>Z</kbd> 되돌리기</div>
      <div><button class="danger" id="newBtn" type="button">새 경기</button></div>
    </div>
  </div>
</div>`,
init(ctx){
const $=K.$,R=ctx.root,KEY="pe-"+V.key,esc=K.esc;
const z=n=>Array(n).fill(0);
function mkTeam(name,roster){return{name,roster:roster.slice(0,20),g:z(20),y:z(20),r:z(20),og:0,bg:0,fh:[0,0,0],to:[1,1,1]};}
function fresh(cfg,keep){
  cfg=cfg||{half:V.half||15,halves:2,pk:true};
  const k=keep||[{name:"홍팀",roster:K.EX10[0]},{name:"청팀",roster:K.EX10[1]}];
  return{cfg,teams:k.map(x=>mkTeam(x.name,x.roster)),period:1,clock:0,running:false,periodEnd:false,over:null,pk:null,log:[]};
}
let S=K.load(KEY);if(!S||!S.teams)S=fresh();S.running=false;
let undoStack=[],lastSave=0;
const save=()=>K.save(KEY,S);
const BG=K.bingoKit({el:$("sBingo"),key:V.key,get:()=>S,teams:()=>S.teams.map((T,t)=>({name:T.name,color:t?"var(--blue)":"var(--red)",roster:T.roster})),
  missions:V.missions,bonusDef:1,unit:"골",hint:"선수가 골을 넣으면 그 칸이 채워지고",
  apply:(t,p)=>{S.teams[t].bg=(S.teams[t].bg||0)+p;},snap:()=>snap(),after:()=>{save();draw();}});
function snap(){const c={clock:S.clock};undoStack.push(JSON.stringify(Object.assign({},S,{running:false})));if(undoStack.length>150)undoStack.shift();}
function undo(){if(!undoStack.length)return;const keep={clock:S.clock,running:S.running};S=Object.assign(JSON.parse(undoStack.pop()),keep);K.closeModal();save();draw();K.toast("되돌렸습니다","",1200);}
const score=t=>S.teams[t].g.reduce((a,b)=>a+b,0)+S.teams[t].og+(S.teams[t].bg||0);
const perName=p=>S.cfg.halves===1?"경기":p===1?"전반":"후반";
const lim=()=>S.cfg.half*60000;
const minute=()=>Math.floor(S.clock/60000)+1+(S.period===2?S.cfg.half:0);

function addLog(o){o.min=minute();o.per=S.period;S.log.unshift(o);if(S.log.length>80)S.log.pop();}
function goal(t,i){
  if(S.over||S.pk)return;snap();
  const T=S.teams[t];
  if(i>=0)T.g[i]++;else T.og++;
  addLog({t,k:"g",who:i>=0?T.roster[i]:null});
  BG.hit(t,i);
  save();draw();K.bump($("score"+t));K.fx.play("goal",$("score"+t));K.snd.fanfare();K.toast("골! "+T.name+(i>=0?" · "+T.roster[i]:""),"bingo",2600);
}
K.fixKit(R,{get:()=>S,snap,after:()=>{save();draw();}});
function card(t,i,kind){
  if(S.over)return;snap();
  const T=S.teams[t];
  if(kind==="y"){
    T.y[i]++;addLog({t,k:"y",who:T.roster[i]});
    if(T.y[i]>=2&&!T.r[i]){T.r[i]=1;addLog({t,k:"r",who:T.roster[i],two:true});K.toast(T.roster[i]+" 경고 2장 · 퇴장","bad",3000);}
    else K.toast(T.roster[i]+" 경고","",1800);
  }else{T.r[i]=1;addLog({t,k:"r",who:T.roster[i]});K.toast(T.roster[i]+" 퇴장","bad",2600);}
  K.snd.whistle(1);save();draw();
}
function start(){if(S.over||S.periodEnd||S.pk)return;S.running=true;K.wake(true);draw();if(S.clock===0)K.snd.whistle(1);}
function stop(){S.running=false;K.wake(false);save();draw();}
function endPeriod(){
  S.running=false;S.periodEnd=true;K.wake(false);K.snd.whistle(S.period===S.cfg.halves?3:2);
  if(S.period<S.cfg.halves){K.toast(perName(S.period)+" 종료","",2600);}
  else{
    const a=score(0),b=score(1);
    if(a===b&&S.cfg.pk){S.pk={k:[[],[]],first:0};K.toast("동점! 승부차기로 승부를 가립니다","",3600);}
    else finish();
  }
  save();draw();
}
function nextPeriod(){if(!S.periodEnd||S.period>=S.cfg.halves)return;S.period++;S.clock=0;S.periodEnd=false;undoStack=[];save();draw();K.toast(perName(S.period)+" 준비 · 킥오프를 누르세요","",2000);}
function pkTurn(){const p=S.pk;return p.k[0].length===p.k[1].length?p.first:1-p.first;}
function pkSum(t){return S.pk.k[t].reduce((a,b)=>a+b,0);}
function pkDecided(){
  const p=S.pk,a=pkSum(0),b=pkSum(1),n0=p.k[0].length,n1=p.k[1].length;
  if(n0<=5&&n1<=5){if(a+(5-n0)<b)return 1;if(b+(5-n1)<a)return 0;}
  if(n0>=5&&n0===n1&&a!==b)return a>b?0:1;
  return -1;
}
function pkKick(res){
  if(!S.pk||S.over)return;snap();
  const t=pkTurn();S.pk.k[t].push(res);
  addLog({t,k:res?"pkg":"pkx"});
  if(res)K.snd.chime();else K.snd.stop();
  const d=pkDecided();
  save();draw();
  if(d>=0)setTimeout(()=>finish(d),400);
}
function finish(wPk){
  const a=score(0),b=score(1);
  let w=a>b?0:b>a?1:(wPk!==undefined?wPk:-1);
  S.over={w};S.running=false;save();draw();K.snd.fanfare();
  const T=S.teams;let st="";
  [0,1].forEach(t=>{const tt=T[t],sc=tt.roster.map((n,i)=>tt.g[i]?n+(tt.g[i]>1?" "+tt.g[i]+"골":""):null).filter(Boolean);
    if(sc.length)st+="<div>"+esc(tt.name)+" 득점: <b>"+esc(sc.join(", "))+"</b></div>";});
  if(S.pk)st+="<div style=\"color:var(--muted)\">승부차기 "+pkSum(0)+" : "+pkSum(1)+"</div>";
  K.modal({sub:"경기 종료",title:w<0?"무승부":T[w].name+" 승리",color:w<0?"var(--fg)":w?"var(--blue)":"var(--red)",score:a+" : "+b,stats:st,
    buttons:[{label:"되돌리기",fn:undo},{label:"닫기"}]});
  ctx.store(makeRec());
}
function makeRec(){
  if(!S.mid)S.mid=K.newId();
  const T=S.teams,a=score(0),b=score(1);
  const d=[];
  S.log.slice().reverse().forEach(l=>{
    if(l.k==="g")d.push(l.min+"' 골 · "+T[l.t].name+(l.who?" "+l.who:""));
    else if(l.k==="y")d.push(l.min+"' 경고 · "+T[l.t].name+" "+l.who);
    else if(l.k==="r")d.push(l.min+"' 퇴장 · "+T[l.t].name+" "+l.who);
  });
  if(S.pk)d.push("승부차기 "+pkSum(0)+" : "+pkSum(1));
  if(BG.summary())d.push(BG.summary());
  const w=S.over?S.over.w:null;
  return{id:S.mid,sport:V.key,sportName:V.name,at:Date.now(),done:!!S.over,
    teams:T.map((t,i)=>({name:t.name,score:score(i)})),winner:S.over?(w<0?"무승부":T[w].name):null,
    summary:a+" : "+b+(S.pk?" (PK "+pkSum(0)+":"+pkSum(1)+")":""),details:d,
    players:T.flatMap(t=>t.roster.map((n,i)=>({team:t.name,name:n,pts:t.g[i],note:[t.y[i]?"경고 "+t.y[i]:"",t.r[i]?"퇴장":""].filter(Boolean).join(" ")})))};
}
function newGame(){BG.reset();S=fresh(S.cfg,S.teams.map(T=>({name:T.name,roster:T.roster})));undoStack=[];K.closeModal();save();draw();K.toast("새 경기 준비 완료 (팀 이름·명단 유지)","",1800);}

function drawClock(){
  $("per").textContent=perName(S.period);
  if(!S.running)K.fillTime("st",S.clock,true);
  const c=$("clock");c.textContent=K.fmtUp(S.clock);c.className="clock"+(lim()-S.clock<60000&&!S.periodEnd?" low":"");
  const g=$("goBtn");g.textContent=S.running?"정지":(S.clock===0?"킥오프":"재개");g.classList.toggle("run",S.running);
  const st=$("state");
  st.textContent=S.over?"경기 종료":S.pk?"승부차기 진행 중":S.periodEnd?perName(S.period)+" 종료":S.running?perName(S.period)+" 진행 중 · "+S.cfg.half+"분 경기":"정지 · "+S.cfg.half+"분 경기";
  st.classList.toggle("live",S.running);
}
function draw(){
  [0,1].forEach(t=>{
    const T=S.teams[t],n=T.roster.length;
    K.setVal("tname"+t,T.name);
    $("score"+t).innerHTML=score(t)+(S.pk?"<small>("+pkSum(t)+")</small>":"");
    const ys=T.y.reduce((a,b)=>a+b,0),rs=T.r.reduce((a,b)=>a+b,0);
    const cp=$("cards"+t);cp.innerHTML="<span class=\"ycard\"></span> "+ys+" &nbsp; <span class=\"rcard\"></span> "+rs;cp.className="pill"+(rs?" bad":"");
    if(FS){const f=(T.fh||[0,0,0])[S.period]||0,fp=$("fouls"+t);fp.textContent="팀 반칙 "+f+(f>=5?" · 다음부터 10m 프리킥":"");fp.className="pill"+(f>=5?" bad":f>=4?" warn":"");
      const to=(T.to||[1,1,1])[S.period];$("tout"+t).textContent="타임아웃 "+(to?"1":"0");$("tout"+t).className="pill"+(to?"":" dash");}
    if(T.bg)cp.innerHTML+=" &nbsp; 빙고 +"+T.bg;
    $("rh"+t).textContent=T.name+" 선수";$("nl"+t).textContent=T.name+" 명단 ("+n+"명)";
    let h="<div class=\"prow head\"><span>이름</span><span style=\"text-align:center\">골</span><span style=\"text-align:center\">카드</span><span class=\"op\"></span></div>";
    for(let i=0;i<n;i++){
      const nm=T.roster[i],cards=K.fixN("<span class=\"ycard\"></span>"+T.y[i],"teams."+t+".y."+i,nm+" · 경고(옐로카드)","fixc"+(T.y[i]?"":" zero"))+K.fixN("<span class=\"rcard\"></span>"+T.r[i],"teams."+t+".r."+i,nm+" · 퇴장(레드카드)","fixc"+(T.r[i]?"":" zero"),1);
      h+="<div class=\"prow\"><span class=\"pn\">"+esc(nm)+(T.r[i]?"<em>퇴장</em>":"")+"</span>"+K.fixN(T.g[i],"teams."+t+".g."+i,nm+" · 골")+"<span class=\"fixcards\">"+cards+"</span>"+
        "<span class=\"btns op\"><button class=\"b2\" type=\"button\" data-goal=\""+i+"\" data-t=\""+t+"\">골</button><button class=\"by\" type=\"button\" data-card=\"y\" data-i=\""+i+"\" data-t=\""+t+"\">경고</button><button class=\"br\" type=\"button\" data-card=\"r\" data-i=\""+i+"\" data-t=\""+t+"\">퇴장</button></span></div>";
    }
    $("r"+t).innerHTML=h;
    K.setVal("ros"+t,T.roster.join("\n"));
  });
  $("nextBtn").hidden=!(S.periodEnd&&S.period<S.cfg.halves&&!S.over);
  $("nextBtn").textContent="후반 시작";
  $("endBtn").hidden=S.periodEnd||!!S.over;
  const pb=$("pkBox");pb.hidden=!S.pk;
  if(S.pk){
    [0,1].forEach(t=>{
      $("pkn"+t).textContent=S.teams[t].name;
      const k=S.pk.k[t],n=Math.max(5,S.pk.k[0].length,S.pk.k[1].length);
      let h="";for(let i=0;i<n;i++)h+=i<k.length?(k[i]?"<i class=\"g\"></i>":"<i class=\"x\"></i>"):"<i></i>";
      $("pkk"+t).innerHTML=h;$("pks"+t).textContent=pkSum(t);
    });
    const tt=pkTurn(),n=S.pk.k[tt].length+1;
    $("pkTurn").innerHTML=S.over?"승부차기 종료":"<span style=\"color:"+(tt?"var(--blue)":"var(--red)")+"\">"+esc(S.teams[tt].name)+"</span> "+n+"번째 키커"+(n>5?" · 서든데스":"");
  }
  $("log").innerHTML=S.log.length?S.log.slice(0,12).map(l=>{
    const T=S.teams[l.t],col=l.t?"var(--blue)":"var(--red)";
    if(l.k==="g")return "<li><span class=\"p\" style=\"--c:"+col+"\">"+l.min+"'</span><span><b>골</b> · "+esc(T.name)+(l.who?" "+esc(l.who):"")+"</span></li>";
    if(l.k==="y")return "<li><span class=\"p\" style=\"--c:"+col+"\">"+l.min+"'</span><span><span class=\"ycard\"></span> 경고 · "+esc(T.name)+" "+esc(l.who)+"</span></li>";
    if(l.k==="r")return "<li><span class=\"p\" style=\"--c:"+col+"\">"+l.min+"'</span><span><span class=\"rcard\"></span> 퇴장 · "+esc(T.name)+" "+esc(l.who)+(l.two?" <span class=\"x\">(경고 누적)</span>":"")+"</span></li>";
    if(l.k==="f")return "<li><span class=\"p\" style=\"--c:"+col+"\">"+l.min+"'</span><span>팀 반칙 · "+esc(T.name)+" <span class=\"x\">("+l.n+"번째)</span></span></li>";
    if(l.k==="m")return "<li><span class=\"p\" style=\"--c:"+col+"\">−1</span><span>"+esc(T.name)+" <span class=\"x\">점수 정정</span></span></li>";
    return "<li><span class=\"p\" style=\"--c:"+col+"\">PK</span><span>"+esc(T.name)+" "+(l.k==="pkg"?"<b>성공</b>":"<span class=\"x\">실축</span>")+"</span></li>";
  }).join(""):"<li class=\"empty\">아직 기록이 없습니다. 선수 옆 골, 경고, 퇴장 버튼으로 기록하세요.</li>";
  $("undoBtn").disabled=!undoStack.length;
  BG.draw();
  K.setVal("cfgHalf",S.cfg.half);$("cfgHalves").value=String(S.cfg.halves);$("cfgPk").checked=S.cfg.pk;
  drawClock();
}

$("goBtn").onclick=()=>{S.running?stop():start();};
K.bindTime(R,()=>S.clock,(k,v)=>{
  v=Math.max(0,Math.min(lim(),v));S.clock=v;
  if(S.periodEnd&&!S.pk&&!S.over&&v<lim())S.periodEnd=false;
  save();draw();
},{full:()=>0,stop:()=>stop()});
$("endBtn").onclick=()=>{if(S.over||S.periodEnd)return;snap();endPeriod();};
$("nextBtn").onclick=nextPeriod;
$("pkGoal").onclick=()=>pkKick(1);
$("pkMiss").onclick=()=>pkKick(0);
$("undoBtn").onclick=undo;
K.arm($("newBtn"),"새 경기",newGame);
R.addEventListener("click",e=>{
  let b;
  if(b=e.target.closest("[data-goal]")){goal(+b.dataset.t,+b.dataset.goal);return;}
  if(b=e.target.closest("[data-og]")){goal(+b.dataset.og,-1);return;}
  if(b=e.target.closest("[data-foul]")){const t=+b.dataset.foul,T=S.teams[t];if(S.over)return;snap();T.fh=T.fh||[0,0,0];T.fh[S.period]++;const f=T.fh[S.period];addLog({t,k:"f",n:f});save();draw();K.snd.whistle(1);
    if(f>=6)K.toast(T.name+" 팀 반칙 "+f+"개 · 상대 10m 프리킥(수비벽 없음)","bad",3000);else if(f===5)K.toast(T.name+" 팀 반칙 5개 · 다음 반칙부터 10m 프리킥","",2600);return;}
  if(b=e.target.closest("[data-fminus]")){const t=+b.dataset.fminus,T=S.teams[t];T.fh=T.fh||[0,0,0];if(!T.fh[S.period])return;snap();T.fh[S.period]--;save();draw();return;}
  if(b=e.target.closest("[data-tout]")){const t=+b.dataset.tout,T=S.teams[t];T.to=T.to||[1,1,1];snap();if(T.to[S.period]){T.to[S.period]=0;stop();K.toast(T.name+" 타임아웃 (1분)","",3000);}else T.to[S.period]=1;save();draw();return;}
  if(b=e.target.closest("[data-card]")){card(+b.dataset.t,+b.dataset.i,b.dataset.card);return;}
  if(b=e.target.closest("[data-minus]")){const t=+b.dataset.minus,T=S.teams[t];if(score(t)<=0||S.over)return;snap();
    if(T.og>0)T.og--;else{const i=T.g.findIndex(x=>x>0);if(i>=0)T.g[i]--;}
    addLog({t,k:"m"});save();draw();return;}
  if(b=e.target.closest("[data-clk]")){S.clock=Math.max(0,Math.min(lim(),S.clock+ +b.dataset.clk));save();drawClock();return;}
});
R.addEventListener("input",e=>{const el=e.target;if(el.id==="tname0"||el.id==="tname1"){const t=+el.id.slice(-1);S.teams[t].name=el.value;$("rh"+t).textContent=el.value+" 선수";save();}});
R.addEventListener("change",e=>{
  const el=e.target;
  if(el.id==="ros0"||el.id==="ros1"){const t=+el.id.slice(-1),list=K.parseList(el.value,20);if(!list.length){draw();return;}snap();S.teams[t].roster=list;save();draw();}
  else if(["cfgHalf","cfgHalves","cfgPk"].includes(el.id)){
    S.cfg.half=Math.max(1,Math.min(45,+$("cfgHalf").value||15));S.cfg.halves=+$("cfgHalves").value||2;S.cfg.pk=$("cfgPk").checked;
    if(S.period>S.cfg.halves)S.period=S.cfg.halves;
    save();draw();
  }
});
draw();
return{
  record:makeRec,
  tick(dt,now){
    if(!S.running)return;
    S.clock=Math.min(lim(),S.clock+dt);
    if(S.clock>=lim()){endPeriod();return;}
    if(now-lastSave>1000){save();lastSave=now;}
    drawClock();
  },
  key(e){
    if(e.code==="Space"){e.preventDefault();S.running?stop():start();}
    else if(e.key==="z"||e.key==="Z")undo();
  },
  destroy(){if(S.running){S.running=false;save();}}
};
}};}
MODS.soccer=makeSoccer({key:"soccer",name:"축구",sub:"전·후반 · 득점자 · 경고 카드 · 승부차기 · 빙고",color:"var(--c-sc)",half:15,
  missions:["헤딩 골","왼발 골","어시스트 골","골키퍼 선방","패스 5번 이어서 공격","코너킥 성공","수비 태클 성공","역습 골"]});
MODS.futsal=makeSoccer({key:"futsal",name:"풋살",sub:"5대5 · 팀 반칙 누적 · 타임아웃 · 승부차기 · 빙고",color:"var(--c-fs)",futsal:true,half:20,
  missions:["킥인으로 시작한 골","왼발 골","어시스트 골","골키퍼 선방","2대1 패스 성공","발바닥 볼 컨트롤","수비 가로채기","3명 연속 패스 골"]});
