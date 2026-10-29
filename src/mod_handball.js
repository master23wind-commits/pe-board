/* ================= 핸드볼 =================
   IHF 규칙 기준: 7명(골키퍼 포함), 전·후반, 단계별 징계(경고 → 2분 퇴장 → 실격),
   2분 퇴장 타이머(경기 시계와 함께 흐름), 7m 던지기, 팀 타임아웃(경기당 3번·하프당 2번·마지막 5분 1번),
   동점이면 연장(5분×2) 또는 7m 승부던지기. */
MODS.handball={name:"핸드볼",sub:"전·후반 · 2분 퇴장 타이머 · 7m 던지기 · 타임아웃 · 빙고",color:"var(--c-hb)",
html:`
<div class="board">
  <section class="team" data-t="0">
    <input class="tname" id="tname0" aria-label="팀 이름">
    <div class="score" id="score0">0</div>
    <div class="pills"><span class="pill" id="court0"></span><span class="pill" id="cards0"></span><span class="pill" id="tout0"></span><span class="pill" id="save0"></span></div>
    <div class="btnrow op"><button class="small" type="button" data-og="0">득점 (이름 없이)</button><button class="small" type="button" data-minus="0">점수 −1</button></div>
    <div class="btnrow op"><button class="small" type="button" data-seven="0">7m 던지기</button><button class="small" type="button" data-sv="0">GK 선방</button><button class="small" type="button" data-tout="0">타임아웃</button></div>
  </section>
  <section class="center">
    <div class="qtr" id="per">전반</div>
    <div class="clock" id="clock">0:00</div>
    ${K.timeCtl("st")}
    <div class="state" id="state">대기 중</div>
    <div class="hb-tout" id="toBox" hidden><b id="toT"></b><span id="toC">1:00</span><button class="small op" type="button" id="toEnd">타임아웃 끝</button></div>
    <div class="btnrow op">
      <button class="go" id="goBtn" type="button">시작</button>
      <button class="small" id="endBtn" type="button">이번 하프 종료</button>
    </div>
    <button class="nextq op" id="nextBtn" type="button" hidden>후반 시작</button>
    <div class="hb-seven" id="sevenBox" hidden><b id="sevenT"></b><span>던진 선수의 <b>골</b> 또는 <b>실패</b>를 누르세요</span><button class="small op" type="button" id="sevenX">취소</button></div>
    <div class="hb-susp" id="suspBox" hidden></div>
    <div class="pk" id="pkBox" hidden>
      <div class="lbl" style="text-align:center">7m 승부던지기</div>
      <div class="pkrow" data-t="0"><span class="nm" id="pkn0"></span><span class="kicks" id="pkk0"></span><span class="sum" id="pks0">0</span></div>
      <div class="pkrow" data-t="1"><span class="nm" id="pkn1"></span><span class="kicks" id="pkk1"></span><span class="sum" id="pks1">0</span></div>
      <div class="pkturn" id="pkTurn"></div>
      <div class="btnrow op"><button class="go" id="pkGoal" type="button">골</button><button class="small danger" id="pkMiss" type="button">실패 · 선방</button></div>
    </div>
    <div class="btnrow op">
      <button class="small" id="undoBtn" type="button">되돌리기</button>
    </div>
  </section>
  <section class="team" data-t="1">
    <input class="tname" id="tname1" aria-label="팀 이름">
    <div class="score" id="score1">0</div>
    <div class="pills"><span class="pill" id="court1"></span><span class="pill" id="cards1"></span><span class="pill" id="tout1"></span><span class="pill" id="save1"></span></div>
    <div class="btnrow op"><button class="small" type="button" data-og="1">득점 (이름 없이)</button><button class="small" type="button" data-minus="1">점수 −1</button></div>
    <div class="btnrow op"><button class="small" type="button" data-seven="1">7m 던지기</button><button class="small" type="button" data-sv="1">GK 선방</button><button class="small" type="button" data-tout="1">타임아웃</button></div>
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
        <label>하프 시간(분) <input id="cfgHalf" type="number" min="1" max="30"></label>
        <label>경기 방식 <select id="cfgHalves"><option value="2">전·후반</option><option value="1">단판</option></select></label>
        <label>코트 인원 <select id="cfgCourt"><option value="7">7명 (정식)</option><option value="6">6명</option><option value="5">5명</option><option value="4">4명</option></select></label>
      </div>
      <div class="cfgrow">
        <label>동점이면 <select id="cfgTie"><option value="seven">7m 승부던지기</option><option value="ot">연장 후 7m 승부던지기</option><option value="draw">무승부</option></select></label>
        <label>연장 하프(분) <input id="cfgOt" type="number" min="1" max="10"></label>
        <label>퇴장 시간(초) <input id="cfgSusp" type="number" min="30" max="300" step="10"></label>
      </div>
      <div class="names">
        <div><div class="nh"><span id="nl0">홍팀 명단</span></div><textarea id="ros0" aria-label="홍팀 명단"></textarea></div>
        <div><div class="nh"><span id="nl1">청팀 명단</span></div><textarea id="ros1" aria-label="청팀 명단"></textarea></div>
      </div>
      <div class="keys">명단은 한 줄에 한 명, 팀당 최대 20명이에요. 처음 들어 있는 이름은 예시예요. 시계는 0분부터 올라가고 하프 시간이 되면 멈춥니다.<br>
        <b>징계</b>: 경고(옐로카드)는 한 선수 1번, 한 팀 3번까지예요. 그다음 반칙은 2분 퇴장으로 이어져요. 2분 퇴장을 누르면 그 선수 타이머가 경기 시계와 함께 흐르고, 그동안 팀은 한 명 적게 뛰어요. 같은 선수가 세 번째 2분 퇴장을 받으면 자동으로 실격이에요. 실격된 선수는 다시 못 들어오고, 팀은 2분 동안 한 명 적게 뛴 뒤 다른 선수를 넣을 수 있어요. 타이머 옆 ✕로 일찍 끝낼 수도 있어요.<br>
        <b>7m 던지기</b>: 반칙으로 확실한 득점 기회를 막으면 줘요. '7m 던지기'를 누른 뒤 던진 선수의 골·실패를 누르면 7m 기록으로 따로 세요.<br>
        <b>타임아웃</b>: 공을 가진 팀만 부를 수 있어요. 경기당 3번, 한 하프에 2번까지, 후반 마지막 5분에는 1번만. 연장에는 없어요. 1분 타이머가 흘러요.<br>
        <b>동점</b>: 정식 규칙은 5분씩 연장 두 하프(최대 두 번) 뒤 7m 승부던지기예요. 여기서는 연장 한 번 뒤 승부던지기로 정했어요. 승부던지기는 5명씩 번갈아 던지고, 같으면 한 명씩 이어 가요.<br>
        <kbd>Space</kbd> 시작/정지 · <kbd>Z</kbd> 되돌리기</div>
      <div><button class="danger" id="newBtn" type="button">새 경기</button></div>
    </div>
  </div>
</div>`,
init(ctx){
const $=K.$,R=ctx.root,KEY="pe-handball",esc=K.esc;
const z=n=>Array(n).fill(0);
const MAXP=20;
function mkTeam(name,roster){return{name,roster:roster.slice(0,MAXP),g:z(MAXP),a:z(MAXP),sg:z(MAXP),sa:z(MAXP),y:z(MAXP),s:z(MAXP),dq:z(MAXP),og:0,bg:0,sv:0,tu:[0,0,0,0,0],tl5:0};}
function fresh(cfg,keep){
  cfg=cfg||{half:15,halves:2,court:7,tie:"seven",ot:5,susp:120};
  const k=keep||[{name:"홍팀",roster:K.EX10[0]},{name:"청팀",roster:K.EX10[1]}];
  return{cfg,teams:k.map(x=>mkTeam(x.name,x.roster)),period:1,clock:0,gt:0,running:false,periodEnd:false,ot:false,over:null,pk:null,seven:-1,susp:[],tout:null,log:[]};
}
let S=K.load(KEY);if(!S||!S.teams)S=fresh();S.running=false;
let undoStack=[],lastSave=0,lastSec=-1;
const save=()=>K.save(KEY,S);
const COL=t=>t?"var(--blue)":"var(--red)";
const BG=K.bingoKit({el:$("sBingo"),key:"handball",get:()=>S,teams:()=>S.teams.map((T,t)=>({name:T.name,color:COL(t),roster:T.roster})),
  missions:["점프 슛 골","7m 골","골키퍼 선방","속공 골","윙에서 넣은 골","어시스트 골","수비로 공 빼앗기","바운드 슛 골"],bonusDef:1,unit:"골",hint:"선수가 골을 넣으면 그 칸이 채워지고",
  apply:(t,p)=>{S.teams[t].bg=(S.teams[t].bg||0)+p;},snap:()=>snap(),after:()=>{save();draw();}});
function snap(){undoStack.push(JSON.stringify(Object.assign({},S,{running:false})));if(undoStack.length>150)undoStack.shift();}
function undo(){
  if(!undoStack.length)return;
  /* 시계·누적 시간·타임아웃 타이머는 지금 값을 그대로 두고 기록만 되돌린다 (퇴장 타이머는 누적 시간 기준이라 자연스럽게 맞음) */
  const keep={clock:S.clock,gt:S.gt,running:S.running,tout:S.tout};
  S=Object.assign(JSON.parse(undoStack.pop()),keep);K.closeModal();save();draw();K.toast("되돌렸습니다","",1200);
}
const score=t=>S.teams[t].g.reduce((a,b)=>a+b,0)+S.teams[t].og+(S.teams[t].bg||0);
const H=()=>S.cfg.halves;
const isOt=p=>p>H();
const perName=p=>isOt(p)?(p===H()+1?"연장 전반":"연장 후반"):H()===1?"경기":p===1?"전반":"후반";
const limOf=p=>(isOt(p)?S.cfg.ot:S.cfg.half)*60000;
const lim=()=>limOf(S.period);
const minute=()=>{let m=0;for(let p=1;p<S.period;p++)m+=limOf(p)/60000;return Math.floor(S.clock/60000)+1+m;};
const suspMs=()=>(S.cfg.susp||120)*1000;
const fmtS=ms=>{const s=Math.max(0,Math.ceil(ms/1000));return Math.floor(s/60)+":"+String(s%60).padStart(2,"0");};
const active=t=>S.susp.filter(x=>x.t===t);
const onCourt=t=>Math.max(1,S.cfg.court-active(t).length);

function addLog(o){o.min=minute();o.per=S.period;S.log.unshift(o);if(S.log.length>100)S.log.pop();}
function fx(t,txt){K.fx.play("handball",$("score"+t),{text:txt});}

/* ---------- 득점·슛 ---------- */
function goal(t,i){
  if(S.over||S.pk)return;snap();
  const T=S.teams[t],sev=S.seven===t;
  if(i>=0){T.g[i]++;T.a[i]++;if(sev){T.sg[i]++;T.sa[i]++;}}else T.og++;
  addLog({t,k:"g",who:i>=0?T.roster[i]:null,sev});
  if(sev)S.seven=-1;
  BG.hit(t,i);
  save();draw();K.bump($("score"+t));fx(t,sev?"7m 골!":"골!");K.snd.fanfare();
  K.toast((sev?"7m ":"")+"골! "+T.name+(i>=0?" · "+T.roster[i]:""),"bingo",2400);
}
function miss(t,i){
  if(S.over||S.pk)return;snap();
  const T=S.teams[t],sev=S.seven===t;
  T.a[i]++;if(sev){T.sa[i]++;S.seven=-1;}
  addLog({t,k:"x",who:T.roster[i],sev});
  save();draw();K.snd.stop();K.toast(T.roster[i]+(sev?" 7m 실패":" 슛 실패"),"",1500);
}
function gkSave(t){
  if(S.over||S.pk)return;snap();
  const T=S.teams[t];T.sv=(T.sv||0)+1;addLog({t,k:"sv"});
  if(S.seven===1-t){S.seven=-1;}
  save();draw();K.fx.play("kin",$("save"+t),{text:"선방!"});K.snd.chime();
}

/* ---------- 징계 ---------- */
function warn(t,i){
  if(S.over)return;
  const T=S.teams[t],n=T.roster[i],ty=T.y.reduce((a,b)=>a+b,0);
  if(T.dq[i]){K.toast(n+" 선수는 실격되었어요","bad",2200);return;}
  if(T.y[i]){K.toast(n+" 선수는 이미 경고를 받았어요 · 다음 반칙은 2분 퇴장","bad",3000);return;}
  if(T.s[i]){K.toast(n+" 선수는 2분 퇴장을 받은 적이 있어 경고 대신 2분 퇴장을 줘요","bad",3200);return;}
  if(ty>=3){K.toast(T.name+"은(는) 경고 3번을 다 받았어요 · 다음 반칙은 2분 퇴장","bad",3000);return;}
  snap();T.y[i]=1;addLog({t,k:"y",who:n});save();draw();K.snd.whistle(1);K.toast(n+" 경고","",1800);
}
function suspend(t,i){
  if(S.over)return;
  const T=S.teams[t],n=T.roster[i];
  if(T.dq[i]){K.toast(n+" 선수는 실격되었어요","bad",2200);return;}
  if(S.susp.some(x=>x.t===t&&x.i===i&&x.k==="2")){K.toast(n+" 선수는 이미 2분 퇴장 중이에요","bad",2200);return;}
  snap();T.s[i]++;
  if(T.s[i]>=3){
    T.dq[i]=1;S.susp.push({t,i,k:"dq",until:S.gt+suspMs()});
    addLog({t,k:"s",who:n,n:T.s[i]});addLog({t,k:"r",who:n,three:true});
    K.toast(n+" 세 번째 2분 퇴장 · 실격","bad",3400);K.fx.play("out",$("score"+t));
  }else{
    S.susp.push({t,i,k:"2",until:S.gt+suspMs()});
    addLog({t,k:"s",who:n,n:T.s[i]});
    K.toast(n+" 2분 퇴장 · "+T.name+" "+onCourt(t)+"명으로 경기","bad",2800);
  }
  K.snd.whistle(2);save();draw();
}
function disq(t,i){
  if(S.over)return;
  const T=S.teams[t],n=T.roster[i];
  if(T.dq[i]){K.toast(n+" 선수는 이미 실격되었어요","bad",2200);return;}
  snap();T.dq[i]=1;
  S.susp=S.susp.filter(x=>!(x.t===t&&x.i===i));
  S.susp.push({t,i,k:"dq",until:S.gt+suspMs()});
  addLog({t,k:"r",who:n});K.snd.whistle(3);save();draw();K.fx.play("out",$("score"+t));
  K.toast(n+" 실격 (레드카드) · "+T.name+" 2분 동안 "+onCourt(t)+"명","bad",3200);
}
function suspTick(){
  const done=S.susp.filter(x=>x.until<=S.gt);
  if(!done.length)return;
  S.susp=S.susp.filter(x=>x.until>S.gt);
  done.forEach(x=>{const T=S.teams[x.t],n=T.roster[x.i]||"선수";
    K.toast(x.k==="dq"?T.name+" 실격 2분 끝 · 다른 선수가 들어갈 수 있어요":n+" 2분 퇴장 끝 · 코트로 돌아올 수 있어요","bingo",3000);});
  K.snd.bonus();save();draw();
}

/* ---------- 타임아웃 ---------- */
function timeout(t){
  if(S.over||S.pk)return;
  const T=S.teams[t];T.tu=T.tu||[0,0,0,0,0];
  if(isOt(S.period)){K.toast("연장전에는 팀 타임아웃이 없어요","bad",2400);return;}
  const used=T.tu.reduce((a,b)=>a+b,0);
  if(used>=3){K.toast(T.name+"은(는) 타임아웃 3번을 다 썼어요","bad",2400);return;}
  if(T.tu[S.period]>=2){K.toast("한 하프에는 타임아웃을 2번까지 부를 수 있어요","bad",2600);return;}
  const last5=S.period===H()&&lim()-S.clock<=300000&&S.cfg.half>=10;
  if(last5&&(T.tl5||0)>=1){K.toast("마지막 5분에는 타임아웃을 1번만 부를 수 있어요","bad",2600);return;}
  snap();T.tu[S.period]++;if(last5)T.tl5=(T.tl5||0)+1;
  S.running=false;K.wake(false);S.tout={t,left:60000};
  addLog({t,k:"to",n:used+1});K.snd.whistle(1);save();draw();K.toast(T.name+" 타임아웃 (1분)","",2400);
}

/* ---------- 경기 흐름 ---------- */
function start(){if(S.over||S.periodEnd||S.pk)return;if(S.tout){S.tout=null;}S.running=true;K.wake(true);draw();if(S.clock===0)K.snd.whistle(1);}
function stop(){S.running=false;K.wake(false);save();draw();}
function endPeriod(){
  S.running=false;S.periodEnd=true;S.seven=-1;K.wake(false);
  const a=score(0),b=score(1),regEnd=S.period===H(),otEnd=S.period===H()+2;
  K.snd.whistle(regEnd||otEnd?3:2);
  if(regEnd||otEnd){
    if(a!==b||S.cfg.tie==="draw"){finish();return;}
    if(regEnd&&S.cfg.tie==="ot"&&!S.ot){S.ot=true;K.toast("동점! 연장전을 준비합니다 ("+S.cfg.ot+"분 × 2)","",3600);}
    else{S.pk={k:[[],[]],first:0};K.toast("동점! 7m 승부던지기로 승부를 가립니다","",3600);}
  }else K.toast(perName(S.period)+" 종료","",2600);
  save();draw();
}
function nextPeriod(){
  if(!S.periodEnd||S.over||S.pk)return;
  const max=S.ot?H()+2:H();if(S.period>=max)return;
  S.period++;S.clock=0;S.periodEnd=false;undoStack=[];save();draw();K.toast(perName(S.period)+" 준비 · 시작을 누르세요","",2000);
}
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
  if(res){K.snd.chime();fx(t,"골!");}else K.snd.stop();
  const d=pkDecided();save();draw();
  if(d>=0)setTimeout(()=>finish(d),400);
}
function finish(wPk){
  const a=score(0),b=score(1);
  let w=a>b?0:b>a?1:(wPk!==undefined?wPk:-1);
  S.over={w};S.running=false;S.tout=null;S.susp=[];S.seven=-1;S.periodEnd=true;save();draw();K.snd.fanfare();
  const T=S.teams;let st="";
  [0,1].forEach(t=>{const tt=T[t],sc=tt.roster.map((n,i)=>tt.g[i]?n+(tt.g[i]>1?" "+tt.g[i]+"골":""):null).filter(Boolean);
    if(sc.length)st+="<div>"+esc(tt.name)+" 득점: <b>"+esc(sc.join(", "))+"</b></div>";});
  const best=topScorer();if(best)st+="<div>최다 득점: <b>"+esc(best)+"</b></div>";
  [0,1].forEach(t=>{if(T[t].sv)st+="<div style=\"color:var(--muted)\">"+esc(T[t].name)+" 골키퍼 선방 "+T[t].sv+"번 ("+savePct(t)+"%)</div>";});
  if(S.pk)st+="<div style=\"color:var(--muted)\">7m 승부던지기 "+pkSum(0)+" : "+pkSum(1)+"</div>";
  K.modal({sub:"경기 종료",title:w<0?"무승부":T[w].name+" 승리",color:w<0?"var(--fg)":COL(w),score:a+" : "+b,stats:st,
    buttons:[{label:"되돌리기",fn:undo},{label:"닫기"}]});
  ctx.store(makeRec());
}
function topScorer(){
  let best=0,who=[];
  S.teams.forEach(T=>T.roster.forEach((n,i)=>{if(T.g[i]>best){best=T.g[i];who=[n];}else if(best&&T.g[i]===best)who.push(n);}));
  return best?who.join(", ")+" "+best+"골":"";
}
function savePct(t){const sv=S.teams[t].sv||0,ga=score(1-t)-(S.teams[1-t].bg||0);return sv+ga?Math.round(sv*100/(sv+ga)):0;}
function makeRec(){
  if(!S.mid)S.mid=K.newId();
  const T=S.teams,a=score(0),b=score(1),d=[];
  S.log.slice().reverse().forEach(l=>{
    const tn=T[l.t].name;
    if(l.k==="g")d.push(l.min+"' "+(l.sev?"7m 골":"골")+" · "+tn+(l.who?" "+l.who:""));
    else if(l.k==="y")d.push(l.min+"' 경고 · "+tn+" "+l.who);
    else if(l.k==="s")d.push(l.min+"' 2분 퇴장 · "+tn+" "+l.who+(l.n>1?" ("+l.n+"번째)":""));
    else if(l.k==="r")d.push(l.min+"' 실격 · "+tn+" "+l.who);
    else if(l.k==="to")d.push(l.min+"' 타임아웃 · "+tn);
  });
  [0,1].forEach(t=>{if(T[t].sv)d.push(T[t].name+" 골키퍼 선방 "+T[t].sv+" ("+savePct(t)+"%)");});
  if(S.pk)d.push("7m 승부던지기 "+pkSum(0)+" : "+pkSum(1));
  if(BG.summary())d.push(BG.summary());
  const w=S.over?S.over.w:null;
  return{id:S.mid,sport:"handball",sportName:"핸드볼",at:Date.now(),done:!!S.over,
    teams:T.map((t,i)=>({name:t.name,score:score(i)})),winner:S.over?(w<0?"무승부":T[w].name):null,
    summary:a+" : "+b+(S.ot?" (연장)":"")+(S.pk?" (7m "+pkSum(0)+":"+pkSum(1)+")":""),details:d,
    players:T.flatMap(t=>t.roster.map((n,i)=>({team:t.name,name:n,pts:t.g[i],
      note:[t.a[i]?"슛 "+t.g[i]+"/"+t.a[i]:"",t.sa[i]?"7m "+t.sg[i]+"/"+t.sa[i]:"",t.y[i]?"경고":"",t.s[i]?"2분 "+t.s[i]:"",t.dq[i]?"실격":""].filter(Boolean).join(" ")})))};
}
function newGame(){BG.reset();S=fresh(S.cfg,S.teams.map(T=>({name:T.name,roster:T.roster})));undoStack=[];K.closeModal();save();draw();K.toast("새 경기 준비 완료 (팀 이름·명단 유지)","",1800);}

/* ---------- 그리기 ---------- */
function drawClock(){
  $("per").textContent=perName(S.period);
  if(!S.running)K.fillTime("st",S.clock,true);
  const c=$("clock");c.textContent=K.fmtUp(S.clock);c.className="clock"+(lim()-S.clock<60000&&!S.periodEnd?" low":"");
  const g=$("goBtn");g.textContent=S.running?"정지":(S.clock===0?"시작":"재개");g.classList.toggle("run",S.running);
  const st=$("state");
  st.textContent=S.over?"경기 종료":S.pk?"7m 승부던지기 진행 중":S.periodEnd?perName(S.period)+" 종료":S.tout?"타임아웃":S.running?perName(S.period)+" 진행 중 · "+(lim()/60000)+"분":"정지 · "+(lim()/60000)+"분";
  st.classList.toggle("live",S.running);
  const tb=$("toBox");tb.hidden=!S.tout;
  if(S.tout){$("toT").textContent=S.teams[S.tout.t].name+" 타임아웃";$("toT").style.color=COL(S.tout.t);$("toC").textContent=fmtS(S.tout.left);$("toC").classList.toggle("low",S.tout.left<=10000);}
  drawSusp();
}
function drawSusp(){
  const box=$("suspBox"),list=S.susp.slice().sort((a,b)=>a.until-b.until);
  box.hidden=!list.length;
  /* 목록이 바뀔 때만 다시 만들고, 평소에는 남은 시간 숫자만 고친다 (✕ 버튼이 눌리도록) */
  const sig=list.map(x=>x.t+":"+x.i+":"+x.k+":"+x.until+":"+S.susp.indexOf(x)+":"+(S.teams[x.t].roster[x.i]||"")).join("|");
  if(box._sig!==sig){
    box._sig=sig;
    box.innerHTML=list.length?'<div class="lbl">퇴장 중</div>'+list.map(x=>{const T=S.teams[x.t];
      return '<div class="hb-sr" style="--tc:'+COL(x.t)+'"><span class="nm">'+esc(T.roster[x.i]||"선수")+'</span><span class="k">'+(x.k==="dq"?"실격 · 팀 −1명":"2분 퇴장")+'</span><span class="tm"></span><button class="small op" type="button" data-unsusp="'+S.susp.indexOf(x)+'" aria-label="퇴장 일찍 끝내기">✕</button></div>';}).join(""):"";
  }
  box.querySelectorAll(".tm").forEach((el,j)=>{const left=list[j].until-S.gt;el.textContent=fmtS(left);el.classList.toggle("low",left<=10000);});
  [0,1].forEach(t=>{
    const n=onCourt(t),cp=$("court"+t);cp.textContent="코트 "+n+"명";cp.className="pill"+(n<S.cfg.court?" bad":"");
    S.teams[t].roster.forEach((_,i)=>{const el=R.querySelector('[data-sb="'+t+':'+i+'"]');if(!el)return;
      const x=S.susp.find(s=>s.t===t&&s.i===i&&s.k==="2");el.textContent=x?"2분 "+fmtS(x.until-S.gt):"";el.hidden=!x;});
  });
}
function draw(){
  [0,1].forEach(t=>{
    const T=S.teams[t],n=T.roster.length;
    K.setVal("tname"+t,T.name);
    $("score"+t).innerHTML=score(t)+(S.pk?"<small>("+pkSum(t)+")</small>":"");
    const ys=T.y.reduce((a,b)=>a+b,0),ss=T.s.reduce((a,b)=>a+b,0),ds=T.dq.reduce((a,b)=>a+b,0);
    const cp=$("cards"+t);cp.innerHTML="<span class=\"ycard\"></span> "+ys+"/3 &nbsp; 2분 "+ss+(ds?" &nbsp; <span class=\"rcard\"></span> "+ds:"")+(T.bg?" &nbsp; 빙고 +"+T.bg:"");cp.className="pill"+(ys>=3?" warn":"");
    const used=(T.tu||[]).reduce((a,b)=>a+b,0),left=isOt(S.period)?0:3-used;
    $("tout"+t).textContent="타임아웃 "+left;$("tout"+t).className="pill"+(left?"":" dash");
    $("save"+t).textContent="GK 선방 "+(T.sv||0)+(T.sv?" · "+savePct(t)+"%":"");
    $("rh"+t).textContent=T.name+" 선수";$("nl"+t).textContent=T.name+" 명단 ("+n+"명)";
    let h="<div class=\"prow hb head\"><span>이름</span><span style=\"text-align:center\">골/슛</span><span style=\"text-align:center\">징계</span><span class=\"op\"></span></div>";
    for(let i=0;i<n;i++){
      const nm=T.roster[i];
      const pen=K.fixN("<span class=\"ycard\"></span>"+T.y[i],"teams."+t+".y."+i,nm+" · 경고","fixc"+(T.y[i]?"":" zero"),1)+
        K.fixN("2′"+T.s[i],"teams."+t+".s."+i,nm+" · 2분 퇴장 횟수","fixc"+(T.s[i]?"":" zero"),3)+
        K.fixN("<span class=\"rcard\"></span>"+T.dq[i],"teams."+t+".dq."+i,nm+" · 실격","fixc"+(T.dq[i]?"":" zero"),1);
      const sev=T.sa[i]?"<small class=\"hb-7\">7m "+T.sg[i]+"/"+T.sa[i]+"</small>":"";
      h+="<div class=\"prow hb"+(T.dq[i]?" out":"")+"\"><span class=\"pn\">"+esc(nm)+(T.dq[i]?"<em>실격</em>":"")+"<em class=\"hb-sb\" data-sb=\""+t+":"+i+"\" hidden></em></span>"+
        "<span class=\"num\">"+K.fixN(T.g[i],"teams."+t+".g."+i+"|teams."+t+".a."+i,nm+" · 골(슛도 함께)","in")+"<small>/"+K.fixN(T.a[i],"teams."+t+".a."+i,nm+" · 슛 시도","in")+"</small>"+sev+"</span>"+
        "<span class=\"fixcards\">"+pen+"</span>"+
        "<span class=\"btns op\"><button class=\"b2\" type=\"button\" data-goal=\""+i+"\" data-t=\""+t+"\">골</button><button type=\"button\" data-miss=\""+i+"\" data-t=\""+t+"\">실패</button><button class=\"by\" type=\"button\" data-warn=\""+i+"\" data-t=\""+t+"\">경고</button><button class=\"b2m\" type=\"button\" data-susp=\""+i+"\" data-t=\""+t+"\">2분</button><button class=\"br\" type=\"button\" data-dq=\""+i+"\" data-t=\""+t+"\">실격</button></span></div>";
    }
    $("r"+t).innerHTML=h;
    K.setVal("ros"+t,T.roster.join("\n"));
  });
  const max=S.ot?H()+2:H();
  $("nextBtn").hidden=!(S.periodEnd&&S.period<max&&!S.over&&!S.pk);
  $("nextBtn").textContent=perName(S.period+1)+" 시작";
  $("endBtn").hidden=S.periodEnd||!!S.over;
  const sb=$("sevenBox");sb.hidden=S.seven<0;
  if(S.seven>=0){$("sevenT").textContent=S.teams[S.seven].name+" 7m 던지기";$("sevenT").style.color=COL(S.seven);}
  R.querySelectorAll("[data-seven]").forEach(b=>b.classList.toggle("on",+b.dataset.seven===S.seven));
  const pb=$("pkBox");pb.hidden=!S.pk;
  if(S.pk){
    [0,1].forEach(t=>{
      $("pkn"+t).textContent=S.teams[t].name;
      const k=S.pk.k[t],n=Math.max(5,S.pk.k[0].length,S.pk.k[1].length);
      let h="";for(let i=0;i<n;i++)h+=i<k.length?(k[i]?"<i class=\"g\"></i>":"<i class=\"x\"></i>"):"<i></i>";
      $("pkk"+t).innerHTML=h;$("pks"+t).textContent=pkSum(t);
    });
    const tt=pkTurn(),n=S.pk.k[tt].length+1;
    $("pkTurn").innerHTML=S.over?"승부던지기 종료":"<span style=\"color:"+COL(tt)+"\">"+esc(S.teams[tt].name)+"</span> "+n+"번째 던지는 선수"+(n>5?" · 서든데스":"");
  }
  $("log").innerHTML=S.log.length?S.log.slice(0,14).map(l=>{
    const T=S.teams[l.t],col=COL(l.t),m="<span class=\"p\" style=\"--c:"+col+"\">"+l.min+"'</span>";
    if(l.k==="g")return "<li>"+m+"<span><b>"+(l.sev?"7m 골":"골")+"</b> · "+esc(T.name)+(l.who?" "+esc(l.who):"")+"</span></li>";
    if(l.k==="x")return "<li>"+m+"<span>"+(l.sev?"7m 실패":"슛 실패")+" · "+esc(T.name)+" "+esc(l.who)+"</span></li>";
    if(l.k==="sv")return "<li>"+m+"<span>골키퍼 선방 · "+esc(T.name)+"</span></li>";
    if(l.k==="y")return "<li>"+m+"<span><span class=\"ycard\"></span> 경고 · "+esc(T.name)+" "+esc(l.who)+"</span></li>";
    if(l.k==="s")return "<li>"+m+"<span><b>2분 퇴장</b> · "+esc(T.name)+" "+esc(l.who)+(l.n>1?" <span class=\"x\">("+l.n+"번째)</span>":"")+"</span></li>";
    if(l.k==="r")return "<li>"+m+"<span><span class=\"rcard\"></span> 실격 · "+esc(T.name)+" "+esc(l.who)+(l.three?" <span class=\"x\">(2분 퇴장 3번)</span>":"")+"</span></li>";
    if(l.k==="to")return "<li>"+m+"<span>타임아웃 · "+esc(T.name)+" <span class=\"x\">("+l.n+"번째)</span></span></li>";
    if(l.k==="m")return "<li><span class=\"p\" style=\"--c:"+col+"\">−1</span><span>"+esc(T.name)+" <span class=\"x\">점수 정정</span></span></li>";
    return "<li><span class=\"p\" style=\"--c:"+col+"\">7m</span><span>승부던지기 · "+esc(T.name)+" "+(l.k==="pkg"?"<b>성공</b>":"<span class=\"x\">실패</span>")+"</span></li>";
  }).join(""):"<li class=\"empty\">아직 기록이 없습니다. 선수 옆 골, 실패, 경고, 2분, 실격 버튼으로 기록하세요.</li>";
  $("undoBtn").disabled=!undoStack.length;
  BG.draw();
  K.setVal("cfgHalf",S.cfg.half);$("cfgHalves").value=String(S.cfg.halves);$("cfgCourt").value=String(S.cfg.court);
  $("cfgTie").value=S.cfg.tie;K.setVal("cfgOt",S.cfg.ot);K.setVal("cfgSusp",S.cfg.susp);
  drawClock();
}

/* ---------- 이벤트 ---------- */
K.fixKit(R,{get:()=>S,snap,after:()=>{save();draw();}});
$("goBtn").onclick=()=>{S.running?stop():start();};
K.bindTime(R,()=>S.clock,(k,v)=>{
  v=Math.max(0,Math.min(lim(),v));S.gt=Math.max(0,S.gt+(v-S.clock));S.clock=v;
  if(S.periodEnd&&!S.pk&&!S.over&&v<lim())S.periodEnd=false;
  save();draw();
},{full:()=>0,stop:()=>stop()});
$("endBtn").onclick=()=>{if(S.over||S.periodEnd)return;snap();endPeriod();};
$("nextBtn").onclick=nextPeriod;
$("pkGoal").onclick=()=>pkKick(1);
$("pkMiss").onclick=()=>pkKick(0);
$("undoBtn").onclick=undo;
$("toEnd").onclick=()=>{S.tout=null;save();draw();};
$("sevenX").onclick=()=>{S.seven=-1;save();draw();};
K.arm($("newBtn"),"새 경기",newGame);
R.addEventListener("click",e=>{
  let b;
  if(b=e.target.closest("[data-goal]")){goal(+b.dataset.t,+b.dataset.goal);return;}
  if(b=e.target.closest("[data-miss]")){miss(+b.dataset.t,+b.dataset.miss);return;}
  if(b=e.target.closest("[data-warn]")){warn(+b.dataset.t,+b.dataset.warn);return;}
  if(b=e.target.closest("[data-susp]")){suspend(+b.dataset.t,+b.dataset.susp);return;}
  if(b=e.target.closest("[data-dq]")){disq(+b.dataset.t,+b.dataset.dq);return;}
  if(b=e.target.closest("[data-og]")){goal(+b.dataset.og,-1);return;}
  if(b=e.target.closest("[data-sv]")){gkSave(+b.dataset.sv);return;}
  if(b=e.target.closest("[data-tout]")){timeout(+b.dataset.tout);return;}
  if(b=e.target.closest("[data-seven]")){const t=+b.dataset.seven;if(S.over||S.pk)return;S.seven=S.seven===t?-1:t;
    if(S.seven>=0){if(S.running)stop();K.snd.whistle(1);K.toast(S.teams[t].name+" 7m 던지기 · 던진 선수의 골/실패를 누르세요","",2600);}save();draw();return;}
  if(b=e.target.closest("[data-unsusp]")){const x=S.susp[+b.dataset.unsusp];if(!x)return;snap();S.susp.splice(+b.dataset.unsusp,1);save();draw();
    K.toast((S.teams[x.t].roster[x.i]||"선수")+" 퇴장 시간을 끝냈어요","",1600);return;}
  if(b=e.target.closest("[data-minus]")){const t=+b.dataset.minus,T=S.teams[t];if(score(t)<=0||S.over)return;snap();
    if(T.og>0)T.og--;else{const i=T.g.findIndex(x=>x>0);if(i>=0){T.g[i]--;T.a[i]=Math.max(0,T.a[i]-1);}else if(T.bg)T.bg--;}
    addLog({t,k:"m"});save();draw();return;}
});
R.addEventListener("input",e=>{const el=e.target;if(el.id==="tname0"||el.id==="tname1"){const t=+el.id.slice(-1);S.teams[t].name=el.value;$("rh"+t).textContent=el.value+" 선수";save();}});
R.addEventListener("change",e=>{
  const el=e.target;
  if(el.id==="ros0"||el.id==="ros1"){
    const t=+el.id.slice(-1),list=K.parseList(el.value,MAXP);if(!list.length){draw();return;}
    snap();
    /* 이름이 남아 있는 선수는 기록을 그대로 따라가게 한다 */
    const T=S.teams[t],old=T.roster,keys=["g","a","sg","sa","y","s","dq"],nw={};
    keys.forEach(k=>nw[k]=z(MAXP));
    const map={};list.forEach((n,j)=>{const i=old.indexOf(n);if(i>=0){keys.forEach(k=>nw[k][j]=T[k][i]);map[i]=j;}});
    keys.forEach(k=>T[k]=nw[k]);T.roster=list;
    S.susp=S.susp.filter(x=>x.t!==t||map[x.i]!=null).map(x=>x.t===t?Object.assign(x,{i:map[x.i]}):x);
    save();draw();
  }
  else if(["cfgHalf","cfgHalves","cfgCourt","cfgTie","cfgOt","cfgSusp"].includes(el.id)){
    const C=S.cfg;
    C.half=Math.max(1,Math.min(30,+$("cfgHalf").value||15));C.halves=+$("cfgHalves").value||2;C.court=+$("cfgCourt").value||7;
    C.tie=$("cfgTie").value;C.ot=Math.max(1,Math.min(10,+$("cfgOt").value||5));C.susp=Math.max(30,Math.min(300,+$("cfgSusp").value||120));
    if(S.period>H()&&!S.ot)S.period=H();
    save();draw();
  }
});
draw();
return{
  record:makeRec,
  tick(dt,now){
    if(S.tout){S.tout.left-=dt;
      if(S.tout.left<=0){S.tout=null;K.snd.buzzer();K.toast("타임아웃 끝 · 재개를 누르세요","",3000);save();draw();}
      else{const s=Math.ceil(S.tout.left/1000);if(s!==lastSec){lastSec=s;if(s<=5)K.snd.tick(6-s);drawClock();}}}
    if(!S.running)return;
    const d=Math.min(dt,lim()-S.clock);
    S.clock+=d;S.gt+=d;
    if(S.susp.length)suspTick();
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
}};
