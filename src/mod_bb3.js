/* ================= 농구 3대3 ================= */
MODS.bb3={name:"농구 3대3",sub:"FIBA 3x3 · 10분 · 21점 · 12초",color:"var(--c-bb)",
html:`
<div class="board">
  <section class="team" data-t="0">
    <input class="tname" id="tname0" aria-label="팀 이름">
    <div class="score" id="score0">0</div>
    <div class="tmeta">
      <div class="stat"><b id="tf0">0</b><span>팀 파울</span></div>
      <div class="stat"><div class="dots" id="to0"></div><span>타임아웃</span></div>
    </div>
    <div class="pills"><span class="pill" id="bonus0"></span><span class="pill dash" id="all0"></span></div>
    <button class="op small" type="button" data-to="0">타임아웃 사용</button>
  </section>
  <section class="center">
    <div class="lbl">경기 시간</div>
    <div class="clock" id="clock">10:00</div>
    ${K.timeCtl("bt")}
    <div class="shotbox" id="shotbox"><div class="shot" id="shot">12</div><div class="lbl">공격 제한</div></div>
    <div class="state" id="state">대기 중</div>
    <div class="btnrow op"><button class="go" id="goBtn" type="button">시작</button><button class="sr" id="srBtn" type="button">12초 리셋</button></div>
    <div class="btnrow op">
      <button class="small" type="button" data-adj="shot" data-v="-1000">공격 −1</button>
      <button class="small" type="button" data-adj="shot" data-v="1000">공격 +1</button>
      <button class="small" id="undoBtn" type="button">되돌리기</button>
    </div>
  </section>
  <section class="team" data-t="1">
    <input class="tname" id="tname1" aria-label="팀 이름">
    <div class="score" id="score1">0</div>
    <div class="tmeta">
      <div class="stat"><b id="tf1">0</b><span>팀 파울</span></div>
      <div class="stat"><div class="dots" id="to1"></div><span>타임아웃</span></div>
    </div>
    <div class="pills"><span class="pill" id="bonus1"></span><span class="pill dash" id="all1"></span></div>
    <button class="op small" type="button" data-to="1">타임아웃 사용</button>
  </section>
</div>
<div class="rosters">
  <div class="roster" data-t="0"><h3 id="rh0">홍팀 개인 기록</h3><div id="r0"></div></div>
  <div class="roster" data-t="1"><h3 id="rh1">청팀 개인 기록</h3><div id="r1"></div></div>
</div>
<div class="bgk" id="b3Bingo"></div>
<div class="box op">
  <h4>경기 설정</h4>
  <div class="cfg">
    <div class="cfgrow">
      <label>경기(분) <input id="cfgMin" type="number" min="1" max="40"></label>
      <label>공격(초) <input id="cfgShot" type="number" min="5" max="30"></label>
      <label>승리 점수 <input id="cfgWin" type="number" min="5" max="50"></label>
      <label>4명 전원 득점 보너스 <input id="cfgAll" type="number" min="0" max="10">점</label>
    </div>
    <div class="keys"><kbd>Space</kbd> 시작/정지 · <kbd>R</kbd> 공격시간 리셋 · <kbd>Z</kbd> 되돌리기 · 득점하면 공격시간이 자동으로 리셋됩니다 · 1점 = 아크 안/자유투, 2점 = 아크 밖 · 4명 전원이 득점하면 팀에 보너스(한 경기 1회)</div>
    <div><button class="danger" id="newBtn" type="button">새 경기</button></div>
  </div>
</div>`,
init(ctx){
const $=K.$,R=ctx.root,KEY="pe-bb3";
function mkTeam(name){return{name,to:1,bonus:0,pl:[1,2,3,4].map(n=>({no:String(n),name:n===4?"교체 선수":"선수 "+n,p:0,f:0}))};}
function fresh(cfg){cfg=cfg||{min:10,shot:12,win:21,all:3};return{cfg,teams:[mkTeam("홍팀"),mkTeam("청팀")],clock:cfg.min*60000,shot:cfg.shot*1000,running:false,ot:null,over:null};}
let S=K.load(KEY);if(!S||!S.teams)S=fresh();
if(S.cfg.all===undefined)S.cfg.all=3;
S.running=false;
let hist=[],lastSave=0;
const save=()=>K.save(KEY,S);
const total=t=>S.teams[t].pl.reduce((a,p)=>a+p.p,0)+(S.teams[t].bonus||0)+(S.teams[t].bg||0);
const fouls=t=>S.teams[t].pl.reduce((a,p)=>a+p.f,0);
const scored=t=>S.teams[t].pl.filter(p=>p.p>0).length;

function drawClock(){
  const c=$("clock");
  if(S.ot){c.textContent="연장전";c.className="clock ot";}
  else{c.textContent=K.fmt(S.clock);c.className="clock"+(S.clock<60000?" low":"");}
  const sh=$("shot");
  if(!S.ot&&S.clock<S.shot){sh.textContent="—";sh.className="shot";}
  else{sh.textContent=Math.ceil(S.shot/1000);sh.className="shot"+(S.shot<=5000?" low":"");}
  if(!S.running)K.fillTime("bt",S.clock);
  const g=$("goBtn");g.textContent=S.running?"정지":"시작";g.classList.toggle("run",S.running);
  const st=$("state");st.textContent=S.over?"경기 종료":S.running?"경기 진행 중":S.ot?"연장 · 먼저 2점 득점 팀 승리":"정지";st.classList.toggle("live",S.running);
}
function drawTeams(){
  [0,1].forEach(t=>{
    const T=S.teams[t];
    K.setVal("tname"+t,T.name);
    $("score"+t).textContent=total(t);
    const f=fouls(t);$("tf"+t).textContent=f;
    const b=$("bonus"+t);
    if(f>=10){b.textContent="자유투 2개 + 공격권";b.className="pill bad";}
    else if(f>=7){b.textContent="보너스 · 자유투 2개";b.className="pill warn";}
    else{b.textContent="보너스까지 "+(7-f);b.className="pill";}
    const al=$("all"+t);
    if(T.bonus>0){al.textContent="전원 득점 보너스 +"+T.bonus;al.className="pill ok"+(al.dataset.pop?" pop":"");}
    else{al.textContent="전원 득점 "+scored(t)+"/4 · 달성 시 +"+S.cfg.all;al.className="pill dash";}
    al.hidden=!S.cfg.all&&!T.bonus;
    $("to"+t).innerHTML=T.to>0?"<i></i>":"<i class=\"off\"></i>";
    $("rh"+t).textContent=T.name+" 개인 기록";
    let h='<div class="prow p5 head"><span style="text-align:center">번호</span><span>이름</span><span style="text-align:center">득점</span><span style="text-align:center">파울</span><span class="op"></span></div>';
    T.pl.forEach((p,i)=>{
      h+='<div class="prow p5"><input class="no" data-t="'+t+'" data-i="'+i+'" data-k="no" value="'+K.esc(p.no)+'" aria-label="등번호" maxlength="3">'+
      '<input class="pn" data-t="'+t+'" data-i="'+i+'" data-k="name" value="'+K.esc(p.name)+'" aria-label="선수 이름">'+
      K.fixN(p.p,'teams.'+t+'.pl.'+i+'.p',(p.name||('선수 '+(i+1)))+' · 득점')+K.fixN(p.f,'teams.'+t+'.pl.'+i+'.f',(p.name||('선수 '+(i+1)))+' · 파울','fl')+
      '<span class="btns op"><button class="b1" data-act="p" data-v="1" data-t="'+t+'" data-i="'+i+'" type="button">+1</button>'+
      '<button class="b2" data-act="p" data-v="2" data-t="'+t+'" data-i="'+i+'" type="button">+2</button>'+
      '<button class="bf" data-act="f" data-t="'+t+'" data-i="'+i+'" type="button">파울</button></span></div>';
    });
    $("r"+t).innerHTML=h;
  });
  $("undoBtn").disabled=!hist.length;
}
function drawCfg(){K.setVal("cfgMin",S.cfg.min);K.setVal("cfgShot",S.cfg.shot);K.setVal("cfgWin",S.cfg.win);K.setVal("cfgAll",S.cfg.all);$("srBtn").textContent=S.cfg.shot+"초 리셋";}
function drawAll(){drawTeams();drawClock();drawCfg();BG.draw();}
const BG=K.bingoKit({el:$("b3Bingo"),key:"bb3",get:()=>S,teams:()=>S.teams.map((T,t)=>({name:T.name,color:t?"var(--blue)":"var(--red)",roster:T.pl.map(p=>p.name)})),
  missions:["2점슛 성공","어시스트 득점","리바운드 후 득점","스틸 성공","블록슛","자유투 성공","앤드원","드라이브인 득점","패스 4번 이어서 득점","수비 3번 연속 막기"],bonusDef:2,hint:"선수가 득점하면 그 칸이 채워지고",
  apply:(t,p)=>{S.teams[t].bg=(S.teams[t].bg||0)+p;},snap:()=>snap(),after:()=>{save();drawAll();checkWin();}});

function snap(){hist.push(JSON.stringify({teams:S.teams,ot:S.ot,over:S.over,shot:S.shot,bingo:S.bingo}));if(hist.length>100)hist.shift();}
function undo(){if(!hist.length)return;const h=JSON.parse(hist.pop());S.teams=h.teams;S.ot=h.ot;S.over=h.over;S.shot=h.shot;S.bingo=h.bingo;K.closeModal();save();drawAll();K.toast("되돌렸습니다","",1200);}
function start(){if(S.over)return;if(!S.ot&&S.clock<=0)return;if(S.shot<=0)S.shot=S.cfg.shot*1000;S.running=true;$("shotbox").classList.remove("viol");K.wake(true);drawClock();}
function stop(){S.running=false;K.wake(false);save();drawClock();}
function shotReset(){S.shot=S.cfg.shot*1000;$("shotbox").classList.remove("viol");drawClock();save();}
function finish(w,reason,silent){
  S.over={w,reason};stop();if(!silent)K.snd.horn();save();
  K.modal({sub:reason,title:S.teams[w].name+" 승리",color:w?"var(--blue)":"var(--red)",score:total(0)+" : "+total(1),
    buttons:[{label:"되돌리기",fn:undo},{label:"닫기"},{label:"새 경기",cls:"go",fn:newGame}]});
  ctx.store(makeRec());
}
function checkWin(){
  for(const t of [0,1]){
    if(S.ot){if(total(t)>=S.ot[t]+2){finish(t,"연장전 2점 선득점");return;}}
    else if(total(t)>=S.cfg.win){finish(t,S.cfg.win+"점 선착 · 즉시 종료");return;}
  }
}
function timeUp(){
  stop();K.snd.horn();
  const a=total(0),b=total(1);
  if(a!==b)finish(a>b?0:1,"경기 시간 종료",true);
  else{S.ot=[a,b];S.shot=S.cfg.shot*1000;save();drawClock();K.toast("동점! 연장전 · 먼저 2점을 넣는 팀이 승리합니다","",4500);}
}
function makeRec(){
  if(!S.mid)S.mid=K.newId();
  const T=S.teams;
  return{id:S.mid,sport:"bb3",sportName:"농구 3대3",at:Date.now(),done:!!S.over,
    teams:T.map((t,i)=>({name:t.name,score:total(i)})),
    winner:S.over?T[S.over.w].name:null,
    summary:total(0)+" : "+total(1)+(S.ot?" (연장)":""),
    details:[S.over?S.over.reason:"경기 시간 "+K.fmt(S.clock)+" 남음"].concat(T.filter(t=>t.bonus).map(t=>t.name+" 전원 득점 보너스 +"+t.bonus)).concat(BG.summary()?[BG.summary()]:[]),
    players:T.flatMap(t=>t.pl.map(p=>({team:t.name,name:(p.no?"#"+p.no+" ":"")+p.name,pts:p.p,note:p.f?"파울 "+p.f:""})))};
}
function newGame(){
  BG.reset();
  const keep=S.teams.map(T=>({name:T.name,pl:T.pl.map(p=>({no:p.no,name:p.name}))}));
  S=fresh(S.cfg);S.teams.forEach((T,i)=>{T.name=keep[i].name;T.pl.forEach((p,j)=>{p.no=keep[i].pl[j].no;p.name=keep[i].pl[j].name;});});
  hist=[];K.closeModal();$("shotbox").classList.remove("viol");K.wake(false);save();drawAll();K.toast("새 경기 준비 완료 (팀·선수 이름 유지)","",1800);
}

$("goBtn").onclick=()=>{S.running?stop():start();};
K.bindTime(R,()=>S.clock,(k,v)=>{S.clock=Math.max(0,Math.min(5999000,v));save();drawClock();},{full:()=>S.cfg.min*60000,stop:()=>{stop();S.shot=S.cfg.shot*1000;$("shotbox").classList.remove("viol");}});
$("srBtn").onclick=shotReset;
$("undoBtn").onclick=undo;
K.arm($("newBtn"),"새 경기",newGame);
K.fixKit(R,{get:()=>S,snap,after:()=>{save();drawTeams();if(!S.over)checkWin();}});
R.addEventListener("click",e=>{
  let b;
  if(b=e.target.closest("[data-adj]")){
    const v=+b.dataset.v;
    if(b.dataset.adj==="clock")S.clock=Math.max(0,Math.min(S.cfg.min*60000,S.clock+v));
    else S.shot=Math.max(0,Math.min(S.cfg.shot*1000,S.shot+v));
    drawClock();save();return;
  }
  if(b=e.target.closest("[data-to]")){
    const T=S.teams[+b.dataset.to];snap();
    if(T.to>0){T.to--;stop();K.toast(T.name+" 타임아웃 (30초)","",3000);}else T.to=1;
    save();drawTeams();return;
  }
  if(b=e.target.closest("[data-act]")){
    const t=+b.dataset.t,T=S.teams[t],p=T.pl[+b.dataset.i];
    if(S.over)return;snap();
    if(b.dataset.act==="p"){
      p.p+=+b.dataset.v;S.shot=S.cfg.shot*1000;$("shotbox").classList.remove("viol");BG.hit(t,+b.dataset.i);
      if(S.cfg.all&&!T.bonus&&T.pl.every(x=>x.p>0)){
        T.bonus=S.cfg.all;const al=$("all"+t);al.dataset.pop="1";setTimeout(()=>{delete al.dataset.pop;},1600);
        K.snd.bonus();K.toast(T.name+" 4명 전원 득점! 보너스 +"+S.cfg.all+"점","bingo",3500);
      }else K.snd.chime();
      K.bump($("score"+t));K.fx.play("fire",$("score"+t),{big:+b.dataset.v>=2,text:"+"+b.dataset.v});
    }else{
      p.f++;const f=fouls(t);
      if(f===7||f===10)K.toast(T.name+" 팀파울 "+f+"개 · "+(f===7?"보너스 시작":"자유투 2개 + 공격권"),"",3000);
    }
    save();drawTeams();drawClock();checkWin();
  }
});
R.addEventListener("input",e=>{
  const el=e.target;
  if(el.dataset.k){S.teams[+el.dataset.t].pl[+el.dataset.i][el.dataset.k]=el.value;save();}
  else if(el.id==="tname0"||el.id==="tname1"){const t=+el.id.slice(-1);S.teams[t].name=el.value;$("rh"+t).textContent=el.value+" 개인 기록";save();}
});
R.addEventListener("change",e=>{
  if(!["cfgMin","cfgShot","cfgWin","cfgAll"].includes(e.target.id))return;
  const m=Math.max(1,Math.min(40,+$("cfgMin").value||10)),s=Math.max(5,Math.min(30,+$("cfgShot").value||12)),w=Math.max(5,Math.min(50,+$("cfgWin").value||21)),a=Math.max(0,Math.min(10,+$("cfgAll").value||0));
  const cm=m!==S.cfg.min,cs=s!==S.cfg.shot;
  S.cfg={min:m,shot:s,win:w,all:a};
  if(!S.running){if(cm)S.clock=m*60000;if(cs)S.shot=s*1000;}
  save();drawAll();
});

drawAll();
return{
  record:makeRec,
  tick(dt,now){
    if(!S.running)return;
    if(!S.ot)S.clock=Math.max(0,S.clock-dt);
    const ps=S.shot;S.shot=Math.max(0,S.shot-dt);
    if(!S.ot&&S.clock<=0)timeUp();
    else if(ps>0&&S.shot<=0){K.snd.buzzer();$("shotbox").classList.add("viol");K.toast("공격 제한 시간 위반 · 경기 시간은 계속 흘러요 (R로 리셋)","bad",2400);}
    if(now-lastSave>1000){save();lastSave=now;}
    drawClock();
  },
  key(e){
    const k=e.key.toLowerCase();
    if(e.code==="Space"){e.preventDefault();S.running?stop():start();}
    else if(k==="r")shotReset();
    else if(k==="z")undo();
  },
  destroy(){if(S.running){S.running=false;save();}}
};
}};
