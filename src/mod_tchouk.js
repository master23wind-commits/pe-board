/* ================= 츄크볼 ================= */
MODS.tchouk={name:"츄크볼",sub:"몸싸움 없는 경기 · 득점·수비 캐치 · 프레임 연속 슛 3회",color:"var(--c-tb)",
html:`
<div class="board">
  <section class="team" data-t="0">
    <input class="tname" id="tname0" aria-label="팀 이름">
    <div class="serve" id="tst0">${K.SERVE_SVG}<span>공격 시작</span></div>
    <div class="score" id="tsc0">0</div>
    <div class="tmeta"><div class="stat"><b id="tca0">0</b><span>수비 캐치</span></div><div class="stat"><b id="tfo0">0</b><span>반칙 실점</span></div><div class="stat"><b id="tvi0">0</b><span>3-3-3 위반</span></div></div>
    <div class="btnrow op"><button class="pt" type="button" data-tpt="0">득점 +1<small>리바운드가 코트에 떨어짐</small></button></div>
    <div class="btnrow op"><button class="small" type="button" data-tcatch="0">수비 캐치</button><button class="small" type="button" data-tvio="0">3-3-3 위반</button><button class="small" type="button" data-tminus="0">점수 −1</button></div>
  </section>
  <section class="center">
    <div class="qtr" id="tper">1피리어드</div>
    <div id="ttimer" class="kclock">
      <div class="clock" id="tclock">10:00</div>
      ${K.timeCtl("tc")}
      <div class="btnrow op"><button class="go" id="tGo" type="button">시작</button><button class="nextq" id="tNext" type="button" hidden>다음 피리어드</button></div>
    </div>
    <div class="frames">
      <button type="button" class="frame" data-frame="0"><span class="lbl">왼쪽 프레임</span><span class="fdots" id="fd0"></span></button>
      <button type="button" class="frame" data-frame="1"><span class="lbl">오른쪽 프레임</span><span class="fdots" id="fd1"></span></button>
    </div>
    <div class="state" id="tstate"></div>
    <div class="op tfaults"><div class="lbl">공격 팀 반칙 → 상대 팀 +1 (반칙한 팀을 먼저 고르세요)</div>
      <div class="seg" role="group" aria-label="반칙한 팀" id="tfTeam"></div>
      <div class="btnrow" id="tfBtns"></div>
    </div>
    <div class="btnrow op"><button class="small" id="tUndo" type="button">되돌리기</button></div>
  </section>
  <section class="team" data-t="1">
    <input class="tname" id="tname1" aria-label="팀 이름">
    <div class="serve" id="tst1">${K.SERVE_SVG}<span>공격 시작</span></div>
    <div class="score" id="tsc1">0</div>
    <div class="tmeta"><div class="stat"><b id="tca1">0</b><span>수비 캐치</span></div><div class="stat"><b id="tfo1">0</b><span>반칙 실점</span></div><div class="stat"><b id="tvi1">0</b><span>3-3-3 위반</span></div></div>
    <div class="btnrow op"><button class="pt" type="button" data-tpt="1">득점 +1<small>리바운드가 코트에 떨어짐</small></button></div>
    <div class="btnrow op"><button class="small" type="button" data-tcatch="1">수비 캐치</button><button class="small" type="button" data-tvio="1">3-3-3 위반</button><button class="small" type="button" data-tminus="1">점수 −1</button></div>
  </section>
</div>
<div class="gpick op" id="tpick" hidden></div>
<div class="rosters">
  <div class="roster" data-t="0"><h3 id="trh0">홍팀 선수</h3><div id="tr0"></div></div>
  <div class="roster" data-t="1"><h3 id="trh1">청팀 선수</h3><div id="tr1"></div></div>
</div>
<div class="bgk" id="tbBingo"></div>
<div class="lower">
  <div class="box"><h4>경기 기록</h4><ul class="log" id="tlog"></ul></div>
  <div class="box op">
    <h4>경기 설정</h4>
    <div class="cfg">
      <div class="cfgrow">
        <label>피리어드 수 <select id="tcPer"><option value="1">1피리어드</option><option value="2">2피리어드</option><option value="3">3피리어드</option></select></label>
        <label>피리어드 시간 <input id="tcMin" type="number" min="1" max="30">분</label>
        <label>목표 점수 <input id="tcTo" type="number" min="0" max="99"> (0 = 시간으로만)</label>
      </div>
      <div class="cfgrow"><label><input id="tcPick" type="checkbox"> 득점·캐치할 때 선수 이름 고르기</label></div>
      <div class="names">
        <div><div class="nh"><span id="tnl0">홍팀 명단</span></div><textarea id="tros0" aria-label="홍팀 명단"></textarea></div>
        <div><div class="nh"><span id="tnl1">청팀 명단</span></div><textarea id="tros1" aria-label="청팀 명단"></textarea></div>
      </div>
      <div class="keys">공격 팀이 프레임에 공을 던져 튕겨 나온 공이 코트 안(D존 밖)에 떨어지면 공격 팀이 1점을 얻습니다. 수비 팀이 땅에 닿기 전에 잡으면 '수비 캐치'로 공격권만 넘어가요.<br>
        슛이 프레임을 빗나가거나, D존 안·코트 밖에 떨어지거나, 튕긴 공이 슈터에게 맞으면 상대 팀이 1점을 얻습니다. 점수가 나면 실점한 팀이 공격을 시작합니다.<br>
        3패스·3걸음·3초를 넘기면 공격권만 넘어갑니다(점수 없음). 같은 프레임에는 (두 팀 슛을 합쳐) 연속 3번까지만 슛할 수 있고, 4번째는 반대쪽 프레임으로 던져야 합니다. 슛한 프레임을 눌러 두면 수비 캐치로 이어진 슛을 세어 주고, 점수나 반칙이 나오면 0부터 다시 셉니다.<br>
        <kbd>Space</kbd> 시계 시작/정지 · <kbd>Z</kbd> 되돌리기</div>
      <div><button class="danger" id="tNew" type="button">새 경기</button></div>
    </div>
  </div>
</div>`,
init(ctx){
const $=K.$,R=ctx.root,KEY="pe-tchouk",esc=K.esc;
const TCOL=["var(--red)","var(--blue)"];
const FAULTS=["프레임 빗나감","D존에 떨어짐","코트 밖에 떨어짐","튕긴 공이 슈터에게 맞음","D존을 밟고 슛","D존에서 수비가 잡음"];
const z=n=>Array(n).fill(0);
function mkTeam(name,roster){return{name,roster:roster.slice(0,15),score:0,pts:z(15),cat:z(15),catches:0,fouls:0,vio:0};}
function fresh(cfg,keep){
  cfg=cfg||{per:3,min:10,to:0,pick:true};
  const k=keep||[{name:"홍팀",roster:K.EX10[0]},{name:"청팀",roster:K.EX10[1]}];
  return{cfg,teams:k.map(x=>mkTeam(x.name,x.roster)),period:1,clock:cfg.min*60000,running:false,perEnd:false,over:null,frame:0,fcount:[0,0],start:0,ft:0,hist:[],log:[]};
}
let S=K.load(KEY);if(!S||!S.teams)S=fresh();S.running=false;
let undoStack=[],lastSave=0,pick=null;
const save=()=>K.save(KEY,S);
K.fixKit(R,{get:()=>S,snap:()=>snap(),after:()=>{save();draw();}});
const BG=K.bingoKit({el:$("tbBingo"),key:"tchouk",get:()=>S,teams:()=>S.teams.map((T,t)=>({name:T.name,color:TCOL[t],roster:T.roster})),
  missions:["수비 캐치 성공","점프 슛 득점","3패스 안에 득점","왼쪽·오른쪽 프레임 모두 득점","다이빙 캐치","모두 한 번씩 패스","리바운드 각도 득점","3-3-3 없이 공격 5번"],bonusDef:1,hint:"선수가 득점하면 그 칸이 채워지고",
  apply:(t,p)=>{S.teams[t].score+=p;S.teams[t].bg=(S.teams[t].bg||0)+p;},snap:()=>snap(),after:()=>{save();draw();if(S.cfg.to>0){const w=[0,1].find(x=>S.teams[x].score>=S.cfg.to);if(w!==undefined&&!S.over)finish(w,S.cfg.to+"점 선착");}}});
function snap(){undoStack.push(JSON.stringify(Object.assign({},S,{running:false})));if(undoStack.length>250)undoStack.shift();}
function undo(){if(!undoStack.length)return;const keep={clock:S.clock,running:S.running};S=Object.assign(JSON.parse(undoStack.pop()),keep);pick=null;K.closeModal();save();draw();K.toast("되돌렸습니다","",1200);}
const nm=(t,i)=>S.teams[t].roster[i]||"선수";
function shotAt(){
  // 같은 프레임 연속 슛 세기
  const f=S.frame;S.fcount[f]=Math.min(9,S.fcount[f]+1);S.fcount[1-f]=0;
  if(S.fcount[f]>=3)setTimeout(()=>K.toast("같은 프레임에 연속 3번 · 다음 슛은 반대쪽 프레임으로!","",2600),700);
}
function point(t,who,how){
  if(S.over)return;snap();
  const T=S.teams[t];T.score++;if(who>=0)T.pts[who]++;
  S.fcount=[0,0];// 점수나 반칙으로 연속 플레이가 끊기면 다시 0부터
  S.start=1-t;
  if(how==="shot"&&who>=0)BG.hit(t,who);
  S.log.unshift({k:"p",t,who:who>=0?nm(t,who):null,how,sc:[S.teams[0].score,S.teams[1].score],per:S.period});if(S.log.length>120)S.log.pop();
  pick=null;save();draw();K.bump($("tsc"+t));K.fx.play("tchouk",$("tsc"+t));K.snd.swish();
  K.toast(T.name+" +1"+(how&&how!=="shot"?" · 상대 "+how:"")+(who>=0?" · "+nm(t,who):""),"bingo",2000);
  if(S.cfg.to>0&&T.score>=S.cfg.to)finish(t,S.cfg.to+"점 선착");
}
function caught(t,who){
  if(S.over)return;snap();
  const T=S.teams[t];T.catches++;if(who>=0)T.cat[who]++;
  shotAt();S.start=t;
  S.log.unshift({k:"c",t,who:who>=0?nm(t,who):null,per:S.period});if(S.log.length>120)S.log.pop();
  pick=null;save();draw();K.snd.chime();K.toast(T.name+" 수비 캐치!"+(who>=0?" · "+nm(t,who):""),"",1600);
}
function fault(t,reason){
  // t = 반칙한 팀, 상대 팀이 1점
  if(S.over)return;
  S.teams[t].fouls++;
  point(1-t,-1,reason);
}
function finish(w,reason){
  S.over={w,reason};S.running=false;K.wake(false);save();draw();setTimeout(K.snd.fanfare,300);
  const T=S.teams;let st="";
  [0,1].forEach(t=>{const x=T[t],n=x.roster.length,mp=Math.max(...x.pts.slice(0,n)),mc=Math.max(...x.cat.slice(0,n));
    if(mp>0)st+="<div>"+esc(x.name)+" 최다 득점: <b>"+esc(x.roster.filter((r,i)=>x.pts[i]===mp).join(", "))+"</b> ("+mp+")</div>";
    if(mc>0)st+="<div>"+esc(x.name)+" 수비 캐치왕: <b>"+esc(x.roster.filter((r,i)=>x.cat[i]===mc).join(", "))+"</b> ("+mc+")</div>";
    st+="<div style=\"color:var(--muted)\">"+esc(x.name)+" 수비 캐치 "+x.catches+" · 반칙 실점 "+x.fouls+"</div>";});
  K.modal({sub:reason,title:w<0?"무승부":T[w].name+" 승리",color:w<0?"var(--fg)":TCOL[w],score:T[0].score+" : "+T[1].score,stats:st,buttons:[{label:"되돌리기",fn:undo},{label:"닫기"}]});
  ctx.store(makeRec());
}
function periodUp(){
  S.running=false;K.wake(false);K.snd.horn();
  S.hist.push([S.teams[0].score,S.teams[1].score]);
  if(S.period>=S.cfg.per){const a=S.teams[0].score,b=S.teams[1].score;finish(a>b?0:b>a?1:-1,"경기 시간 종료");return;}
  S.perEnd=true;save();draw();K.toast(S.period+"피리어드 종료","",2600);
}
function nextPeriod(){S.period++;S.perEnd=false;S.clock=S.cfg.min*60000;S.fcount=[0,0];S.start=(S.period-1)%2;undoStack=[];save();draw();K.toast(S.period+"피리어드 · "+S.teams[S.start].name+" 공격으로 시작","",2200);}
function makeRec(){
  if(!S.mid)S.mid=K.newId();
  const T=S.teams,d=[];
  T.forEach(x=>d.push(x.name+" 수비 캐치 "+x.catches+" · 반칙 실점 "+x.fouls+" · 3-3-3 위반 "+x.vio));
  if(BG.summary())d.push(BG.summary());
  S.log.slice().reverse().forEach(l=>{if(l.k==="p")d.push(l.per+"P "+T[l.t].name+" +1 "+(l.who||"")+(l.how&&l.how!=="shot"&&l.how!=="manual"?" (상대 "+l.how+")":"")+" ("+l.sc.join(":")+")");});
  return{id:S.mid,sport:"tchouk",sportName:"츄크볼",at:Date.now(),done:!!S.over,
    teams:T.map(x=>({name:x.name,score:x.score})),winner:S.over?(S.over.w<0?"무승부":T[S.over.w].name):null,
    summary:T[0].score+" : "+T[1].score,details:d,
    players:T.flatMap(x=>x.roster.map((n,i)=>({team:x.name,name:n,pts:x.pts[i],note:"수비 캐치 "+x.cat[i]})))};
}

function drawPick(){
  const el=$("tpick");
  if(!pick){el.hidden=true;return;}
  el.hidden=false;const T=S.teams[pick.t];el.style.setProperty("--tc",TCOL[pick.t]);
  el.innerHTML="<div class=\"gph\"><b>"+esc(T.name)+" "+(pick.k==="p"?"득점":"수비 캐치")+"</b> · "+(pick.k==="p"?"슛한 사람":"잡은 사람")+"을 고르세요</div><div class=\"btnrow\">"+T.roster.map((n,i)=>"<button type=\"button\" class=\"gchip\" data-tw=\""+i+"\">"+esc(n)+"</button>").join("")+"<button type=\"button\" class=\"small\" data-tw=\"-1\">이름 없이</button><button type=\"button\" class=\"small\" data-tw=\"x\">취소</button></div>";
}
function drawClock(){
  $("tper").textContent=S.cfg.per>1?S.period+"피리어드":"경기";
  const c=$("tclock");c.textContent=K.fmt(S.clock);c.className="clock"+(S.clock<60000?" low":"");
  if(!S.running)K.fillTime("tc",S.clock);
  const g=$("tGo");g.textContent=S.running?"정지":"시작";g.classList.toggle("run",S.running);g.hidden=S.perEnd||!!S.over;
  $("tNext").hidden=!S.perEnd||!!S.over;
}
function draw(){
  const T=S.teams,C=S.cfg;
  [0,1].forEach(t=>{
    const x=T[t],n=x.roster.length;
    K.setVal("tname"+t,x.name);
    $("tsc"+t).textContent=x.score;$("tca"+t).textContent=x.catches;$("tfo"+t).textContent=x.fouls;$("tvi"+t).textContent=x.vio;
    $("tst"+t).classList.toggle("no",S.start!==t||!!S.over);
    $("trh"+t).textContent=x.name+" 선수";$("tnl"+t).textContent=x.name+" 명단 ("+n+"명)";
    let h="<div class=\"prow head\"><span>이름 (누르면 득점 +1)</span><span style=\"text-align:center\">득점</span><span style=\"text-align:center\">캐치</span><span class=\"op\"></span></div>";
    for(let i=0;i<n;i++)h+="<div class=\"prow tq\"><button type=\"button\" class=\"pn tqn\" data-tq=\""+t+":"+i+"\" aria-label=\""+esc(x.roster[i])+" 득점 +1\">"+esc(x.roster[i])+"</button>"+K.fixN(x.pts[i],"teams."+t+".pts."+i+"|teams."+t+".score",x.roster[i]+" · 득점(팀 점수도 함께)")+K.fixN(x.cat[i],"teams."+t+".cat."+i,x.roster[i]+" · 수비 캐치")+"<span class=\"btns op\"><button type=\"button\" class=\"tqp\" data-tq=\""+t+":"+i+"\" aria-label=\""+esc(x.roster[i])+" 득점\">+1</button><button type=\"button\" data-tqc=\""+t+":"+i+"\" aria-label=\""+esc(x.roster[i])+" 수비 캐치\">캐치</button></span></div>";
    $("tr"+t).innerHTML=h;
    K.setVal("tros"+t,x.roster.join("\n"));
  });
  [0,1].forEach(f=>{
    const el=R.querySelector("[data-frame='"+f+"']");el.classList.toggle("on",S.frame===f);
    $("fd"+f).innerHTML=[0,1,2].map(i=>"<i class=\""+(i<S.fcount[f]?(S.fcount[f]>=3?"full":"used"):"")+"\"></i>").join("")+"<b>"+Math.min(S.fcount[f],3)+"/3</b>";
  });
  $("tstate").innerHTML=S.over?"경기 종료":"<b style=\"color:"+TCOL[S.start]+"\">"+esc(T[S.start].name)+"</b> 공격 · 슛하는 프레임을 눌러 두세요";
  $("tfTeam").innerHTML=[0,1].map(t=>"<button type=\"button\" data-tft=\""+t+"\" aria-pressed=\""+(S.ft===t)+"\">"+esc(T[t].name)+" 반칙</button>").join("");
  $("tfBtns").innerHTML=FAULTS.map(f=>"<button class=\"small\" type=\"button\" data-tfault=\""+esc(f)+"\">"+esc(f)+"</button>").join("");
  $("tlog").innerHTML=S.log.length?S.log.slice(0,14).map(l=>{
    const tn="<b style=\"color:"+TCOL[l.t]+"\">"+esc(T[l.t].name)+"</b>";
    if(l.k==="c")return "<li><span class=\"p\" style=\"--c:"+TCOL[l.t]+"\">캐치</span><span>"+tn+" 수비 캐치"+(l.who?" · "+esc(l.who):"")+" <span class=\"x\">· "+l.per+"P</span></span></li>";
    if(l.k==="v")return "<li><span class=\"p\" style=\"--c:"+TCOL[l.t]+"\">3-3-3</span><span>"+tn+" 위반 · 공격권 넘김 <span class=\"x\">· "+l.per+"P</span></span></li>";
    return "<li><span class=\"p\" style=\"--c:"+TCOL[l.t]+"\">"+l.sc.join(":")+"</span><span>"+tn+" +1"+(l.who?" · "+esc(l.who):"")+(l.how&&l.how!=="shot"&&l.how!=="manual"?" <span class=\"x\">(상대 "+esc(l.how)+")</span>":"")+" <span class=\"x\">· "+l.per+"P</span></span></li>";
  }).join(""):"<li class=\"empty\">아직 기록이 없습니다. 득점, 수비 캐치, 반칙 버튼으로 기록하세요.</li>";
  $("tUndo").disabled=!undoStack.length;
  $("tcPer").value=String(C.per);K.setVal("tcMin",C.min);K.setVal("tcTo",C.to);$("tcPick").checked=C.pick;
  drawPick();drawClock();BG.draw();
}
function start(){if(S.over||S.perEnd||S.clock<=0)return;S.running=true;K.wake(true);drawClock();K.snd.whistle(1);}
function stop(){S.running=false;K.wake(false);save();drawClock();}

$("tGo").onclick=()=>{S.running?stop():start();};
$("tNext").onclick=nextPeriod;
$("tUndo").onclick=undo;
K.bindTime(R,()=>S.clock,(k,v)=>{S.clock=Math.max(0,Math.min(5999000,v));if(S.perEnd&&v>0&&!S.over){S.perEnd=false;S.hist.pop();}save();draw();},{full:()=>S.cfg.min*60000,stop:()=>stop()});
K.arm($("tNew"),"새 경기",()=>{BG.reset();S=fresh(S.cfg,S.teams.map(x=>({name:x.name,roster:x.roster})));undoStack=[];pick=null;K.closeModal();save();draw();K.toast("새 경기 준비 완료 (팀 이름·명단 유지)","",1800);});
R.addEventListener("click",e=>{
  let b;
  if(b=e.target.closest("[data-tpt]")){const t=+b.dataset.tpt;if(S.over)return;if(S.cfg.pick){pick={k:"p",t};drawPick();$("tpick").scrollIntoView({block:"nearest",behavior:"smooth"});}else point(t,-1,"shot");return;}
  if(b=e.target.closest("[data-tcatch]")){const t=+b.dataset.tcatch;if(S.over)return;if(S.cfg.pick){pick={k:"c",t};drawPick();$("tpick").scrollIntoView({block:"nearest",behavior:"smooth"});}else caught(t,-1);return;}
  if(b=e.target.closest("[data-tw]")){const v=b.dataset.tw;if(v==="x"){pick=null;drawPick();return;}const p=pick;if(p.k==="p")point(p.t,+v,"shot");else caught(p.t,+v);return;}
  if(b=e.target.closest("[data-tq]")){if(R.classList.contains("view")||document.body.classList.contains("view"))return;const[t,i]=b.dataset.tq.split(":").map(Number);if(S.over)return;point(t,i,"shot");return;}
  if(b=e.target.closest("[data-tqc]")){const[t,i]=b.dataset.tqc.split(":").map(Number);if(S.over)return;caught(t,i);return;}
  if(b=e.target.closest("[data-tvio]")){const t=+b.dataset.tvio;if(S.over)return;snap();S.teams[t].vio++;S.start=1-t;S.log.unshift({k:"v",t,per:S.period});save();draw();K.snd.stop();K.toast(S.teams[t].name+" 3-3-3 위반 · "+S.teams[1-t].name+" 공격","",1800);return;}
  if(b=e.target.closest("[data-tminus]")){const t=+b.dataset.tminus;if(S.teams[t].score<=0||S.over)return;snap();S.teams[t].score--;save();draw();return;}
  if(b=e.target.closest("[data-frame]")){S.frame=+b.dataset.frame;save();draw();return;}
  if(b=e.target.closest("[data-tft]")){S.ft=+b.dataset.tft;draw();return;}
  if(b=e.target.closest("[data-tfault]")){fault(S.ft,b.dataset.tfault);return;}
});
R.addEventListener("input",e=>{const el=e.target;if(el.id==="tname0"||el.id==="tname1"){S.teams[+el.id.slice(-1)].name=el.value;save();}});
R.addEventListener("change",e=>{
  const el=e.target;
  if(el.id==="tros0"||el.id==="tros1"){const t=+el.id.slice(-1),list=K.parseList(el.value,15);if(!list.length){draw();return;}snap();S.teams[t].roster=list;save();draw();return;}
  if(["tcPer","tcMin","tcTo","tcPick"].includes(el.id)){const C=S.cfg,om=C.min;C.per=+$("tcPer").value||3;C.min=Math.max(1,Math.min(30,+$("tcMin").value||10));C.to=Math.max(0,Math.min(99,+$("tcTo").value||0));C.pick=$("tcPick").checked;
    if(!S.running&&om!==C.min&&S.clock===om*60000)S.clock=C.min*60000;save();draw();}
});
draw();
return{
  record:makeRec,
  tick(dt,now){
    if(!S.running)return;
    S.clock=Math.max(0,S.clock-dt);
    if(S.clock<=0){periodUp();return;}
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
