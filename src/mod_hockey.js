/* ================= 아이스하키 =================
   경기 방식 3가지 (설정에서 고름)
   1) 5대5 정식 (IIHF 규칙서 2026-27): 20분 × 3피리어드, 실제 경기 시간(휘슬마다 시계 정지), 피리어드 사이 휴식 15분,
      팀 타임아웃 30초 1번. 반칙: 마이너 2분 · 더블 마이너 4분 · 메이저 5분 · 미스컨덕트 10분 · 게임 미스컨덕트 · 매치 · 페널티 샷.
      한 팀은 동시에 2명까지만 줄어든다(세 번째 반칙은 앞 반칙이 끝날 때까지 대기). 파워플레이 골이 나면 마이너 하나가 끝난다.
      동점이면 3대3 서든데스 연장(조별 5분 · 토너먼트 10분, 휴식 3분) → 슛아웃 5명 → 1명씩 서든데스. NHL(연장 5분 → 슛아웃 3명)도 고를 수 있다.
      연장 3대3에서 반칙이 나면 반칙한 팀이 줄지 않고 상대가 4명, 5명으로 늘어난다.
   2) 3대3 · IIHF 3x3 얼티밋 하키(2026): 12분 × 2하프(24분), 시계는 계속 흐르고 반칙 때만 멈춤, 하프 사이 3분.
      반칙은 퇴장 대신 페널티 샷(마이너 1개, 메이저 3개 + 퇴장, 같은 수의 반칙은 상쇄). 자기 진영(빨간 선 뒤)에서 넣은 골은 2골(프리존).
      반칙이 하나도 없는 팀은 경기 끝에 페어플레이 샷 1개(결과를 바꿀 수 있을 때만). 승점: 하프 승리 1 · 경기 승리 1(비기면 각 1).
      순위 결정전만 연장 5분(휴식 3분) → 슛아웃 3명.
   3) 3대3 · 3ICE: 8분 × 2하프, 시계는 계속 흐르고 반칙·부상 때만 멈춤. 반칙은 페널티 샷. 연장 없이 1명씩 슛아웃. */
MODS.hockey={name:"아이스하키",sub:"5대5 정식 · 3대3 · 반칙 타이머 · 파워플레이 · 슛아웃 · 빙고",color:"var(--c-ih)",
html:`
<div class="board">
  <section class="team" data-t="0">
    <input class="tname" id="tname0" aria-label="팀 이름">
    <div class="score" id="score0">0</div>
    <div class="pills"><span class="pill" id="sk0"></span><span class="pill" id="pim0"></span><span class="pill" id="sog0"></span><span class="pill" id="tout0"></span><span class="pill" id="pts0" hidden></span></div>
    <div class="btnrow op"><button class="small" type="button" data-og="0">득점 (이름 없이)</button><button class="small" type="button" data-shot="0">유효 슛 (이름 없이)</button><button class="small" type="button" data-minus="0">점수 −1</button></div>
    <div class="btnrow op"><button class="small" type="button" data-tpen="0">팀 반칙</button><button class="small" type="button" data-pull="0">골리 빼기</button><button class="small" type="button" data-tout="0">타임아웃</button></div>
  </section>
  <section class="center">
    <div class="qtr" id="per">1피리어드</div>
    <div class="clock" id="clock">20:00</div>
    ${K.timeCtl("st")}
    <div class="state" id="state">대기 중</div>
    <div class="ih-str" id="str"></div>
    <div class="hb-tout" id="toBox" hidden><b id="toT"></b><span id="toC">0:30</span><button class="small op" type="button" id="toEnd">끝</button></div>
    <div class="btnrow op">
      <button class="go" id="goBtn" type="button">시작</button>
      <button class="small" id="endBtn" type="button">이번 피리어드 종료</button>
    </div>
    <button class="nextq op" id="nextBtn" type="button" hidden>다음 피리어드 시작</button>
    <div class="ih-box" id="astBox" hidden></div>
    <div class="ih-box pen" id="penBox" hidden></div>
    <div class="ih-box ps" id="psBox" hidden></div>
    <div class="hb-susp" id="penList" hidden></div>
    <div class="pk" id="soBox" hidden>
      <div class="lbl" style="text-align:center">슛아웃</div>
      <div class="pkrow" data-t="0"><span class="nm" id="son0"></span><span class="kicks" id="sok0"></span><span class="sum" id="sos0">0</span></div>
      <div class="pkrow" data-t="1"><span class="nm" id="son1"></span><span class="kicks" id="sok1"></span><span class="sum" id="sos1">0</span></div>
      <div class="pkturn" id="soTurn"></div>
      <div class="btnrow op"><button class="go" id="soGoal" type="button">골</button><button class="small danger" id="soMiss" type="button">실패 · 선방</button></div>
    </div>
    <div class="btnrow op">
      <button class="small" id="undoBtn" type="button">되돌리기</button>
    </div>
  </section>
  <section class="team" data-t="1">
    <input class="tname" id="tname1" aria-label="팀 이름">
    <div class="score" id="score1">0</div>
    <div class="pills"><span class="pill" id="sk1"></span><span class="pill" id="pim1"></span><span class="pill" id="sog1"></span><span class="pill" id="tout1"></span><span class="pill" id="pts1" hidden></span></div>
    <div class="btnrow op"><button class="small" type="button" data-og="1">득점 (이름 없이)</button><button class="small" type="button" data-shot="1">유효 슛 (이름 없이)</button><button class="small" type="button" data-minus="1">점수 −1</button></div>
    <div class="btnrow op"><button class="small" type="button" data-tpen="1">팀 반칙</button><button class="small" type="button" data-pull="1">골리 빼기</button><button class="small" type="button" data-tout="1">타임아웃</button></div>
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
        <label>경기 방식 <select id="cfgRule"><option value="iihf">5대5 정식 (IIHF)</option><option value="u3">3대3 · IIHF 3x3 얼티밋 하키</option><option value="ice3">3대3 · 3ICE 리그</option></select></label>
        <label>동점이면 <select id="cfgTie"></select></label>
      </div>
      <div class="cfgrow">
        <label><span id="cfgPerL">피리어드 시간(분)</span> <input id="cfgPer" type="number" min="1" max="30"></label>
        <label><span id="cfgNpL">피리어드 수</span> <input id="cfgNp" type="number" min="1" max="4"></label>
        <label>휴식(분) <input id="cfgInter" type="number" min="0" max="20"></label>
        <label>타임아웃(30초) <input id="cfgTo" type="number" min="0" max="3"></label>
      </div>
      <div class="names">
        <div><div class="nh"><span id="nl0">홍팀 명단</span></div><textarea id="ros0" aria-label="홍팀 명단"></textarea></div>
        <div><div class="nh"><span id="nl1">청팀 명단</span></div><textarea id="ros1" aria-label="청팀 명단"></textarea></div>
      </div>
      <div class="keys" id="ihHelp"></div>
      <div><button class="danger" id="newBtn" type="button">새 경기</button></div>
    </div>
  </div>
</div>`,
init(ctx){
const $=K.$,R=ctx.root,KEY="pe-hockey",esc=K.esc;
const z=n=>Array(n).fill(0);
const MAXP=25;
const L=(ko,en)=>K.LANG==="en"?en:ko; /* 하키에서는 뜻이 다른 낱말(반칙 → Penalty) */
/* 경기 방식별 기본값 (규정) */
const RULES={
  iihf:{mode:5,per:20,np:3,inter:15,to:1,run:false,tie:"iihf5",ties:["iihf5","iihf10","nhl","so","draw"]},
  u3:{mode:3,per:12,np:2,inter:3,to:0,run:true,tie:"group",ties:["group","ko"]},
  ice3:{mode:3,per:8,np:2,inter:3,to:0,run:true,tie:"so1",ties:["so1"]}
};
/* ot: 연장 분(0=없음), so: 슛아웃 인원(0=없음), br: 연장 전 휴식 분 */
const TIES={
  iihf5:{ot:5,so:5,br:3,l:"3대3 연장 5분 → 슛아웃 5명 (IIHF 조별)"},
  iihf10:{ot:10,so:5,br:3,l:"3대3 연장 10분 → 슛아웃 5명 (IIHF 토너먼트)"},
  nhl:{ot:5,so:3,br:1,l:"3대3 연장 5분 → 슛아웃 3명 (NHL 정규 시즌)"},
  so:{ot:0,so:5,br:0,l:"바로 슛아웃 5명 (수업용)"},
  draw:{ot:0,so:0,br:0,l:"무승부로 끝"},
  group:{ot:0,so:0,br:0,l:"무승부로 끝 (조별 경기)"},
  ko:{ot:5,so:3,br:3,l:"연장 5분 → 슛아웃 3명 (순위 결정전)"},
  so1:{ot:0,so:1,br:0,l:"1명씩 서든데스 슛아웃 (연장 없음)"}
};
/* 5대5 반칙: 분, 인원이 줄어드는지, 반칙 시간(PIM), 퇴장 */
const PT={
  m2:{min:2,short:1,pim:2,l:"마이너 2분"},m4:{min:4,short:1,pim:4,l:"더블 마이너 4분"},m5:{min:5,short:1,pim:5,l:"메이저 5분"},
  m10:{min:10,short:0,pim:10,l:"미스컨덕트 10분"},gm:{min:0,short:0,pim:20,ej:1,l:"게임 미스컨덕트"},mp:{min:5,short:1,pim:25,ej:1,l:"매치 페널티"},
  ps:{min:0,short:0,pim:0,l:"페널티 샷"},
  /* 3대3 */
  s1:{min:0,short:0,pim:2,shots:1,l:"마이너 → 페널티 샷 1개"},s3:{min:0,short:0,pim:5,shots:3,ej:1,l:"메이저 → 페널티 샷 3개 · 퇴장"},
  sx:{min:0,short:0,pim:5,shots:1,ej:1,l:"메이저 → 페널티 샷 · 퇴장"},ic:{min:0,short:0,pim:0,shots:1,l:"고의 아이싱 · 시간 끌기 → 페널티 샷"}
};
function mkTeam(name,roster){return{name,roster:roster.slice(0,MAXP),g:z(MAXP),a:z(MAXP),sog:z(MAXP),pim:z(MAXP),ej:z(MAXP),og:0,os:0,bg:0,psg:0,fz:0,bpim:0,pens:0,tu:0};}
function defCfg(rule){const r=RULES[rule||"iihf"];return{rule:rule||"iihf",per:r.per,np:r.np,inter:r.inter,to:r.to,tie:r.tie};}
function fresh(cfg,keep){
  cfg=cfg||defCfg("iihf");
  const k=keep||[{name:"홍팀",roster:K.EX10[0]},{name:"청팀",roster:K.EX10[1]}];
  return{cfg,teams:k.map(x=>mkTeam(x.name,x.roster)),period:1,clock:0,running:false,periodEnd:false,ot:false,over:null,so:null,ps:null,pen:[],pull:[0,0],tout:null,inter:null,hs:[],fp:null,ag:null,log:[],seq:0};
}
let S=K.load(KEY);if(!S||!S.teams||!S.cfg||!RULES[S.cfg.rule])S=fresh();S.running=false;
let undoStack=[],lastSave=0,lastSec=-1,pc=null;
const save=()=>K.save(KEY,S);
const COL=t=>t?"var(--blue)":"var(--red)";
const RU=()=>RULES[S.cfg.rule];
const is3=()=>RU().mode===3;
const TI=()=>TIES[S.cfg.tie]||TIES.draw;
const NP=()=>S.cfg.np;
const inOt=()=>S.period>NP();
const BG=K.bingoKit({el:$("sBingo"),key:"hockey",get:()=>S,teams:()=>S.teams.map((T,t)=>({name:T.name,color:COL(t),roster:T.roster})),
  missions:["파워플레이 골","숏핸디드 골","어시스트 2명 골","원타이머 골","리바운드 골","브레이크어웨이 골","페널티 샷 골","골리 선방 3번 연속"],bonusDef:1,unit:"골",hint:"선수가 골을 넣으면 그 칸이 채워지고",
  apply:(t,p)=>{S.teams[t].bg=(S.teams[t].bg||0)+p;},snap:()=>snap(),after:()=>{save();draw();}});
function snap(){undoStack.push(JSON.stringify(Object.assign({},S,{running:false})));if(undoStack.length>150)undoStack.shift();}
function undo(){
  if(!undoStack.length)return;
  const keep={running:S.running,tout:S.tout,inter:S.inter};
  S=Object.assign(JSON.parse(undoStack.pop()),keep);pc=null;K.closeModal();save();draw();K.toast("되돌렸습니다","",1200);
}
const sum=a=>a.reduce((x,y)=>x+y,0);
const score=t=>{const T=S.teams[t];return sum(T.g)+T.og+(T.bg||0)+(T.psg||0)+(T.fz||0);};
const soSum=t=>S.so?sum(S.so.k[t]):0;
/* 기록에 남기는 최종 점수: 슛아웃 승리 팀에 1골을 더한다(IIHF·NHL 방식) */
const fin=t=>score(t)+(S.so&&S.over&&S.over.w===t?1:0);
const shots=t=>sum(S.teams[t].sog)+S.teams[t].os;
const ga=t=>score(1-t)-(S.teams[1-t].bg||0)-(S.teams[1-t].fz||0);
const svPct=t=>{const sa=shots(1-t),g=Math.min(sa,ga(t));return sa?Math.round((sa-g)*1000/sa)/10:0;};
const limOf=p=>(p>NP()?TI().ot:S.cfg.per)*60000;
const lim=()=>limOf(S.period);
const left=()=>Math.max(0,lim()-S.clock);
const perName=p=>p>NP()?"연장":is3()?(NP()===2?(p===1?"전반":"후반"):p+"하프"):p+"피리어드";
const perTag=p=>p>NP()?"OT":(is3()?p+"H":p+"P");
const fmtS=ms=>{const s=Math.max(0,Math.ceil(ms/1000));return Math.floor(s/60)+":"+String(s%60).padStart(2,"0");};

/* ---------- 반칙 시간과 인원 ---------- */
/* 인원이 줄어드는 반칙은 팀마다 앞의 2개만 흐르고, 나머지는 대기 */
function runIds(){
  const ids=new Set();
  [0,1].forEach(t=>{let n=0;S.pen.filter(p=>p.t===t).sort((a,b)=>a.id-b.id).forEach(p=>{if(!p.short)ids.add(p.id);else if(n<2){ids.add(p.id);n++;}});});
  return ids;
}
const shortRun=t=>{const ids=runIds();return S.pen.filter(p=>p.t===t&&p.short&&ids.has(p.id)).length;};
function skaters(t){
  if(is3())return 3;
  const a=shortRun(t),b=shortRun(1-t);
  if(inOt()&&!S.over){return Math.min(5,3+Math.max(0,b-a));}
  return 5-a;
}
function penTick(d){
  if(!S.pen.length)return;
  const ids=runIds(),done=[];
  S.pen.forEach(p=>{if(ids.has(p.id)){p.left-=d;if(p.left<=0)done.push(p);}});
  if(!done.length)return;
  S.pen=S.pen.filter(p=>p.left>0);
  done.forEach(p=>{const T=S.teams[p.t],n=p.i>=0?T.roster[p.i]:"벤치 마이너";
    K.toast(n+" 반칙 시간 끝 · "+(p.short?"빙판으로 돌아와요":"교체할 수 있어요"),"bingo",3000);});
  K.snd.bonus();save();draw();
}
/* 파워플레이 골: 상대의 마이너(더블 마이너는 앞 2분) 하나를 끝낸다. 메이저는 끝나지 않는다 */
function ppRelease(o){
  const ids=runIds();
  const c=S.pen.filter(p=>p.t===o&&p.short&&ids.has(p.id)&&(p.ty==="m2"||p.ty==="m4")).sort((a,b)=>a.left-b.left)[0];
  if(!c)return null;
  const T=S.teams[o],n=c.i>=0?T.roster[c.i]:"벤치 마이너";
  if(c.ty==="m4"&&c.left>120000){c.left=120000;return n+" 더블 마이너의 앞 2분이 끝났어요";}
  S.pen=S.pen.filter(p=>p!==c);return n+" 마이너가 끝나 빙판으로 돌아와요";
}

function addLog(o){o.per=S.period;o.pt=K.fmtUp(S.clock);o.id=++S.seq;S.log.unshift(o);if(S.log.length>120)S.log.pop();return o;}
function fx(t,txt){K.fx.play("hockey",$("score"+t),{text:txt});}
function stopClock(){if(S.running){S.running=false;K.wake(false);}}

/* ---------- 득점 ---------- */
function goal(t,i,o){
  o=o||{};
  if(S.over||S.so)return;
  if(S.periodEnd&&!S.fp&&!o.ps)return K.toast("다음 "+(is3()?"하프":"피리어드")+"를 시작한 뒤 기록하세요","bad",2000);
  if(!o.noSnap)snap();
  const T=S.teams[t],u=1-t;
  const pp=!is3()&&skaters(t)>skaters(u),sh=!is3()&&skaters(t)<skaters(u),en=!!S.pull[u];
  if(i>=0){T.g[i]++;T.sog[i]++;}else if(o.ps)T.psg++;else{T.og++;T.os++;}
  const L=addLog({t,k:"g",who:i>=0?T.roster[i]:null,pp,sh,en,ps:!!o.ps,fp:o.src==="fp",a:[]});
  let rel=null;if(pp&&!inOt())rel=ppRelease(u);
  S.pull=[0,0];
  BG.hit(t,i);
  stopClock();
  const tag=o.ps?"페널티 샷 골!":pp?"파워플레이 골!":sh?"숏핸디드 골!":en?"빈 골대 골!":"골!";
  save();K.bump($("score"+t));fx(t,tag);K.snd.horn();
  K.toast(tag+" "+T.name+(i>=0?" · "+T.roster[i]:"")+(rel?" · "+rel:""),"bingo",3000);
  /* 어시스트(도움) 고르기 */
  if(!o.ps)S.ag={id:L.id,t,i};
  if(inOt()&&!S.over){draw();setTimeout(()=>finish(),300);return;}
  draw();
}
function shot(t,i){
  if(S.over||S.so)return;snap();
  const T=S.teams[t];if(i>=0)T.sog[i]++;else T.os++;
  save();draw();K.snd.tick(4);
  K.toast("유효 슛 · "+(i>=0?T.roster[i]:T.name)+" · 상대 골리 선방","",1200);
}
function assist(j){
  const A=S.ag;if(!A)return;const L=S.log.find(l=>l.id===A.id);if(!L){S.ag=null;draw();return;}
  if(L.a.length>=2||L.a.includes(S.teams[A.t].roster[j]))return;
  snap();S.teams[A.t].a[j]++;L.a.push(S.teams[A.t].roster[j]);
  if(L.a.length>=2)closeAg();else{save();draw();}
}
function closeAg(){S.ag=null;save();draw();if(S.over)ctx.store(makeRec());}
function freeZone(){
  const A=S.ag;if(!A)return;const L=S.log.find(l=>l.id===A.id);if(!L||L.fz)return;
  snap();S.teams[A.t].fz++;L.fz=true;save();draw();K.bump($("score"+A.t));
  K.toast("프리존 골! 자기 진영에서 넣어 2골로 인정","bingo",2600);
}

/* ---------- 반칙 ---------- */
function openPen(t,i){if(S.over||S.so)return;pc={t,i,cancel:false};draw();}
function penalty(ty){
  if(!pc)return;const {t,i,cancel}=pc,P=PT[ty],T=S.teams[t],u=1-t;
  if(i>=0&&T.ej[i]){K.toast(T.roster[i]+" 선수는 이미 퇴장했어요","bad",2200);pc=null;draw();return;}
  snap();pc=null;
  const who=i>=0?T.roster[i]:"벤치";
  if(i>=0)T.pim[i]+=P.pim;else T.bpim+=P.pim;
  if(P.ej&&i>=0)T.ej[i]=1;
  T.pens++;
  stopClock();
  addLog({t,k:"pen",who,ty,cancel});
  K.snd.whistle(P.ej?3:2);
  if(ty==="ps"||P.shots){
    awardPS(u,ty==="ps"?1:P.shots,ty);
  }else if(P.min){
    S.pen.push({id:++S.seq,t,i,ty,left:P.min*60000,full:P.min*60000,short:P.short&&!cancel?1:0});
    const wait=P.short&&!cancel&&shortRun(t)>=2&&!runIds().has(S.seq);
    K.toast(who+" "+P.l+(cancel?" · 상쇄라 인원은 그대로":wait?" · 이미 2명이 빠져 있어 앞 반칙이 끝나면 시작":" · "+T.name+" "+skaters(t)+"명"),"bad",3200);
  }else K.toast(who+" "+P.l+(P.ej?" · 경기에서 물러나요":""),"bad",3000);
  if(P.ej)K.fx.play("out",$("score"+t));
  save();draw();
}
/* 페널티 샷 주기. 상대 팀에 이미 줄 샷이 있으면 같은 수만큼 상쇄 */
function awardPS(t,n,src){
  const P=S.ps;
  if(P&&P.t!==t&&src!=="fp"){
    if(P.n>=n){P.n-=n;if(!P.n)S.ps=null;K.toast("두 팀 반칙이 서로 상쇄되었어요"+(S.ps?" · "+S.teams[S.ps.t].name+" 샷 "+S.ps.n+"개 남음":""),"",3000);return;}
    n-=P.n;S.ps=null;
  }
  if(S.ps&&S.ps.t===t){S.ps.n+=n;S.ps.tot+=n;}
  else S.ps={t,n,tot:n,done:0,src:src||"ps",who:-1};
  K.toast(S.teams[t].name+" 페널티 샷 "+(n>1?n+"개":"")+" · 센터 점에서 출발","",3000);
}
function psShot(res){
  const P=S.ps;if(!P||S.over)return;snap();
  const t=P.t,T=S.teams[t],i=P.who;
  P.n--;P.done++;
  if(res)goal(t,i,{ps:true,noSnap:true,src:P.src});
  else{if(i>=0)T.sog[i]++;else T.os++;addLog({t,k:"psx",who:i>=0?T.roster[i]:null,fp:P.src==="fp"});K.snd.stop();K.toast("페널티 샷 실패 · 선방","",1600);}
  if(S.over){S.ps=null;save();draw();return;}
  if(P.n<=0){S.ps=null;
    if(P.src==="fp"){save();draw();setTimeout(afterReg,350);return;}
    if(is3()&&!S.periodEnd)K.toast("시작을 누르면 시계가 다시 흘러요","",2200);
  }
  save();draw();
}

/* ---------- 타임아웃 ---------- */
function timeout(t){
  if(S.over||S.so)return;
  const T=S.teams[t];
  if(!S.cfg.to){K.toast(is3()?"3대3 규정에는 팀 타임아웃이 없어요 (설정에서 켤 수 있어요)":"설정에서 타임아웃 수를 정하세요","bad",2600);return;}
  if((T.tu||0)>=S.cfg.to){K.toast(T.name+"은(는) 타임아웃을 다 썼어요","bad",2400);return;}
  snap();T.tu=(T.tu||0)+1;stopClock();S.tout={t,left:30000};
  addLog({t,k:"to"});K.snd.whistle(1);save();draw();K.toast(T.name+" 타임아웃 (30초)","",2400);
}

/* ---------- 경기 흐름 ---------- */
function start(){if(S.over||S.periodEnd||S.so||S.fp)return;S.tout=null;S.inter=null;S.running=true;K.wake(true);draw();if(S.clock===0)K.snd.whistle(1);}
function stop(){S.running=false;K.wake(false);save();draw();}
function endPeriod(){
  stopClock();S.periodEnd=true;S.pull=[0,0];pc=null;
  if(S.period<=NP()){const c=[score(0),score(1)],p=S.hs.reduce((a,h)=>[a[0]+h[0],a[1]+h[1]],[0,0]);S.hs[S.period-1]=[c[0]-p[0],c[1]-p[1]];}
  K.snd.horn();
  if(S.period===NP()){K.toast("정규 시간 종료","",2400);S.fp=S.cfg.rule==="u3"?{q:[0,1].filter(t=>!S.teams[t].pens)}:null;save();draw();setTimeout(afterReg,400);return;}
  if(inOt()){
    const T=TI();
    if(T.so){S.so={k:[[],[]],first:0,n:T.so};K.toast("연장에도 동점! 슛아웃 ("+T.so+"명)","",3600);}
    else{finish();return;}
  }else{
    if(S.cfg.inter)S.inter={left:S.cfg.inter*60000,l:perName(S.period)+" 뒤 휴식"};
    K.toast(perName(S.period)+" 종료","",2600);
  }
  save();draw();
}
/* 정규 시간이 끝난 뒤: 페어플레이 샷 → 승부 → 연장/슛아웃 */
function afterReg(){
  if(S.over)return;
  if(S.fp){
    while(S.fp.q.length){
      const t=S.fp.q.shift(),a=score(t),b=score(1-t);
      if(a<=b&&a+1>=b){S.ps={t,n:1,tot:1,done:0,src:"fp",who:-1};K.toast(S.teams[t].name+" 페어플레이 샷! 반칙이 하나도 없었어요","bingo",3400);save();draw();return;}
    }
    S.fp=null;
  }
  const a=score(0),b=score(1),T=TI();
  if(a!==b){finish();return;}
  if(T.ot&&!S.ot){S.ot=true;S.inter=T.br?{left:T.br*60000,l:"연장 전 휴식"}:null;K.toast("동점! "+"3대3"+" 연장 "+T.ot+"분 (먼저 넣으면 끝)","",3600);save();draw();return;}
  if(T.so){S.so={k:[[],[]],first:0,n:T.so};K.toast("동점! 슛아웃 ("+T.so+"명"+(T.so===1?"씩":"")+")","",3600);save();draw();return;}
  finish();
}
function nextPeriod(){
  if(!S.periodEnd||S.over||S.so||S.fp||S.ps)return;
  const max=S.ot?NP()+1:NP();if(S.period>=max)return;
  S.period++;S.clock=0;S.periodEnd=false;S.inter=null;undoStack=[];save();draw();
  K.toast(perName(S.period)+(inOt()?" · "+"3대3"+" 서든데스":"")+" 준비 · 시작을 누르세요","",2200);
}
function soTurn(){const p=S.so;return p.k[0].length===p.k[1].length?p.first:1-p.first;}
function soDecided(){
  const p=S.so,n=p.n,a=soSum(0),b=soSum(1),n0=p.k[0].length,n1=p.k[1].length;
  if(n0<=n&&n1<=n){if(a+(n-n0)<b)return 1;if(b+(n-n1)<a)return 0;}
  if(n0>=n&&n0===n1&&a!==b)return a>b?0:1;
  return -1;
}
function soShot(res){
  if(!S.so||S.over)return;snap();
  const t=soTurn();S.so.k[t].push(res);
  addLog({t,k:res?"sog":"sox"});
  if(res){K.snd.chime();fx(t,"골!");}else K.snd.stop();
  const d=soDecided();save();draw();
  if(d>=0)setTimeout(()=>finish(d),400);
}
function points(){
  /* 3x3 얼티밋 하키 승점: 하프 승리 1(비기면 각 1) + 경기 승리 1(비기면 각 1) */
  const p=[0,0];
  S.hs.forEach(h=>{if(h[0]>h[1])p[0]++;else if(h[1]>h[0])p[1]++;else{p[0]++;p[1]++;}});
  if(S.over){if(S.over.w<0){p[0]++;p[1]++;}else p[S.over.w]++;}
  return p;
}
function finish(wSo){
  const a=score(0),b=score(1);
  let w=a>b?0:b>a?1:(wSo!==undefined?wSo:-1);
  S.over={w};stopClock();S.tout=null;S.inter=null;S.pen=[];S.ps=null;S.fp=null;S.periodEnd=true;pc=null;save();draw();K.snd.fanfare();
  const T=S.teams;let st="";
  [0,1].forEach(t=>{const tt=T[t],sc=tt.roster.map((n,i)=>tt.g[i]?n+(tt.g[i]>1?" "+tt.g[i]+"골":""):null).filter(Boolean);
    if(sc.length)st+="<div>"+esc(tt.name)+" 득점: <b>"+esc(sc.join(", "))+"</b></div>";});
  const best=topPts();if(best)st+="<div>최고 포인트(골+도움): <b>"+esc(best)+"</b></div>";
  st+="<div style=\"color:var(--muted)\">유효 슛 "+shots(0)+" : "+shots(1)+" · 골리 선방률 "+svPct(0)+"% : "+svPct(1)+"%</div>";
  if(S.so)st+="<div style=\"color:var(--muted)\">슛아웃 "+soSum(0)+" : "+soSum(1)+" (이긴 팀에 1골을 더해 기록)</div>";
  if(S.cfg.rule==="u3"){const p=points();st+="<div>승점 <b>"+p[0]+" : "+p[1]+"</b> <span style=\"color:var(--muted)\">(하프마다 1 · 경기 1)</span></div>";}
  K.modal({sub:"경기 종료"+(S.ot?" · 연장":"")+(S.so?" · 슛아웃":""),title:w<0?"무승부":T[w].name+" 승리",color:w<0?"var(--fg)":COL(w),score:fin(0)+" : "+fin(1),stats:st,
    buttons:[{label:"되돌리기",fn:undo},{label:"닫기"}]});
  ctx.store(makeRec());
}
function topPts(){
  let best=0,who=[];
  S.teams.forEach(T=>T.roster.forEach((n,i)=>{const p=T.g[i]+T.a[i];if(p>best){best=p;who=[n];}else if(best&&p===best)who.push(n);}));
  return best?who.join(", ")+" "+best+"포인트":"";
}
function logLine(l){
  const T=S.teams[l.t],tn=T.name,tag=perTag(l.per)+" "+l.pt;
  if(l.k==="g"){const x=[l.pp?"PP":"",l.sh?"SH":"",l.en?"EN":"",l.ps?"PS":"",l.fz?"프리존 ×2":"",l.fp?"페어플레이":""].filter(Boolean).join(" ");
    return tag+" 골 · "+tn+(l.who?" "+l.who:"")+(l.a&&l.a.length?" (도움 "+l.a.join(", ")+")":"")+(x?" "+x:"");}
  if(l.k==="pen")return tag+" 반칙 · "+tn+" "+l.who+" "+PT[l.ty].l+(l.cancel?" (상쇄)":"");
  if(l.k==="psx")return tag+" 페널티 샷 실패 · "+tn+(l.who?" "+l.who:"");
  if(l.k==="to")return tag+" 타임아웃 · "+tn;
  if(l.k==="sog"||l.k==="sox")return "슛아웃 · "+tn+" "+(l.k==="sog"?"성공":"실패");
  return "";
}
function makeRec(){
  if(!S.mid)S.mid=K.newId();
  const T=S.teams,d=[];
  d.push(K.$("cfgRule").selectedOptions[0]?K.$("cfgRule").selectedOptions[0].textContent:"");
  S.log.slice().reverse().forEach(l=>{if(l.k!=="m"&&l.k!=="sog"&&l.k!=="sox"){const s=logLine(l);if(s)d.push(s);}});
  d.push("유효 슛 "+shots(0)+" : "+shots(1)+" · 골리 선방률 "+svPct(0)+"% : "+svPct(1)+"%");
  if(S.so)d.push("슛아웃 "+soSum(0)+" : "+soSum(1));
  if(S.cfg.rule==="u3"&&S.over){const p=points();d.push("승점 "+p[0]+" : "+p[1]);}
  if(BG.summary())d.push(BG.summary());
  const w=S.over?S.over.w:null;
  return{id:S.mid,sport:"hockey",sportName:"아이스하키",at:Date.now(),done:!!S.over,
    teams:T.map((t,i)=>({name:t.name,score:fin(i)})),winner:S.over?(w<0?"무승부":T[w].name):null,
    summary:fin(0)+" : "+fin(1)+(S.so?" (슛아웃 "+soSum(0)+":"+soSum(1)+")":S.ot&&S.over?" (연장)":""),details:d,
    players:T.flatMap(t=>t.roster.map((n,i)=>({team:t.name,name:n,pts:t.g[i],
      note:[t.a[i]?"도움 "+t.a[i]:"",t.sog[i]?"유효 슛 "+t.sog[i]:"",t.pim[i]?"반칙 "+t.pim[i]+"분":"",t.ej[i]?"퇴장":""].filter(Boolean).join(" ")})))};
}
function newGame(cfg){BG.reset();S=fresh(cfg||S.cfg,S.teams.map(T=>({name:T.name,roster:T.roster})));undoStack=[];pc=null;K.closeModal();save();draw();K.toast("새 경기 준비 완료 (팀 이름·명단 유지)","",1800);}

/* ---------- 그리기 ---------- */
function drawClock(){
  $("per").textContent=perName(S.period);
  if(!S.running)K.fillTime("st",left(),false);
  const c=$("clock"),lf=left();c.textContent=K.fmt(lf);c.className="clock"+(lf<60000&&!S.periodEnd?" low":"");
  const g=$("goBtn");g.textContent=S.running?"정지":(S.clock===0?"시작":"재개");g.classList.toggle("run",S.running);
  const st=$("state"),how=RU().run?"런닝 타임":"스톱 타임";
  st.textContent=S.over?"경기 종료":S.so?"슛아웃 진행 중":S.fp||(S.ps&&S.ps.src==="fp")?"페어플레이 샷":S.periodEnd?perName(S.period)+" 종료":S.tout?"타임아웃":S.running?perName(S.period)+" 진행 중 · "+how:"정지 · "+how;
  st.classList.toggle("live",S.running);
  /* 인원 */
  const a=skaters(0),b=skaters(1),sx=$("str");
  if(S.over||S.so){sx.hidden=true;}
  else{
    sx.hidden=false;
    const pa=S.pull[0]?"+1":"",pb=S.pull[1]?"+1":"";
    let txt=a+pa+" 대 "+b+pb,sub="";
    if(!is3()){if(a>b)sub=S.teams[0].name+" 파워플레이";else if(b>a)sub=S.teams[1].name+" 파워플레이";else if(a<5&&!inOt())sub="양 팀 모두 줄어 있어요";else if(inOt())sub="3대3 서든데스";}
    else sub=S.cfg.rule==="u3"?"오프사이드 없음 · 터치 아이싱":"런닝 타임 · 반칙은 페널티 샷";
    if(S.pull[0]||S.pull[1])sub+=(sub?" · ":"")+"골리 없이 추가 공격수";
    sx.innerHTML="<b>"+txt+"</b>"+(sub?"<span>"+esc(sub)+"</span>":"");
    sx.className="ih-str"+(a!==b?" pp":"");
  }
  [0,1].forEach(t=>{const p=$("sk"+t),n=skaters(t);p.textContent="스케이터 "+n+"명"+(S.pull[t]?" + 골리 뺌":"");p.className="pill"+(n<(is3()?3:inOt()?3:5)?" bad":S.pull[t]?" warn":"");});
  const tb=$("toBox"),box=S.tout||S.inter;tb.hidden=!box;
  if(S.tout){$("toT").textContent=S.teams[S.tout.t].name+" 타임아웃";$("toT").style.color=COL(S.tout.t);$("toC").textContent=fmtS(S.tout.left);$("toC").classList.toggle("low",S.tout.left<=10000);$("toEnd").textContent="타임아웃 끝";}
  else if(S.inter){$("toT").textContent=S.inter.l;$("toT").style.color="";$("toC").textContent=fmtS(S.inter.left);$("toC").classList.toggle("low",S.inter.left<=30000);$("toEnd").textContent="휴식 끝";}
  drawPen();
}
function drawPen(){
  const box=$("penList"),ids=runIds(),list=S.pen.slice().sort((a,b)=>a.t-b.t||a.id-b.id);
  box.hidden=!list.length;
  const sig=list.map(x=>x.id+":"+x.t+":"+x.i+":"+(ids.has(x.id)?1:0)+":"+(S.teams[x.t].roster[x.i]||"")).join("|");
  if(box._sig!==sig){
    box._sig=sig;
    box.innerHTML=list.length?'<div class="lbl">반칙 박스</div>'+list.map(x=>{const T=S.teams[x.t];
      return '<div class="hb-sr'+(ids.has(x.id)?"":" wait")+'" style="--tc:'+COL(x.t)+'"><span class="nm">'+esc(x.i>=0?T.roster[x.i]:"벤치 마이너")+'</span><span class="k">'+PT[x.ty].l+(x.short?"":" · 인원 그대로")+(ids.has(x.id)?"":" · 대기")+'</span><span class="tm"></span><button class="small op" type="button" data-unpen="'+x.id+'" aria-label="반칙 일찍 끝내기">✕</button></div>';}).join(""):"";
  }
  box.querySelectorAll(".tm").forEach((el,j)=>{const x=list[j];el.textContent=fmtS(x.left);el.classList.toggle("low",x.left<=10000&&ids.has(x.id));});
  [0,1].forEach(t=>S.teams[t].roster.forEach((_,i)=>{const el=R.querySelector('[data-sb="'+t+':'+i+'"]');if(!el)return;
    const x=S.pen.find(p=>p.t===t&&p.i===i);el.textContent=x?fmtS(x.left):"";el.hidden=!x;}));
}
function drawBoxes(){
  /* 어시스트 */
  const ab=$("astBox"),A=S.ag,L=A&&S.log.find(l=>l.id===A.id);
  ab.hidden=!L;
  if(L){const T=S.teams[A.t];
    ab.style.setProperty("--tc",COL(A.t));
    ab.innerHTML="<b>"+esc(T.name)+" 골"+(L.who?" · "+esc(L.who):"")+"</b><span>도움(어시스트) 선수를 골라요 · 최대 2명"+(L.a.length?" · "+esc(L.a.join(", ")):"")+"</span>"+
      "<div class=\"ih-picks\">"+T.roster.map((n,j)=>j===A.i||T.ej[j]?"":"<button class=\"small"+(L.a.includes(n)?" on":"")+"\" type=\"button\" data-ast=\""+j+"\">"+esc(n)+"</button>").join("")+"</div>"+
      "<div class=\"btnrow\">"+(S.cfg.rule==="u3"&&!L.ps?"<button class=\"small"+(L.fz?" on":"")+"\" type=\"button\" id=\"fzBtn\""+(L.fz?" disabled":"")+">프리존 골 (2골)</button>":"")+"<button class=\"small go\" type=\"button\" id=\"agDone\">"+(L.a.length?"완료":"도움 없음")+"</button></div>";
  }
  /* 반칙 고르기 */
  const pb=$("penBox");pb.hidden=!pc;
  if(pc){const T=S.teams[pc.t],who=pc.i>=0?T.roster[pc.i]:T.name+" 벤치(팀)";
    const list=is3()?(S.cfg.rule==="u3"?["s1","s3","ic"]:["s1","sx","ic"]):(pc.i>=0?["m2","m4","m5","m10","gm","mp","ps"]:["m2","ps"]);
    pb.style.setProperty("--tc",COL(pc.t));
    pb.innerHTML="<b>"+esc(who)+" 반칙</b>"+(is3()?"<span>3대3은 반칙한 선수가 나가지 않고 상대가 페널티 샷을 해요</span>":"<span>반칙 박스에 들어가 시간이 흐르는 동안 팀은 한 명 적게 뛰어요</span>")+
      "<div class=\"ih-picks\">"+list.map(k=>"<button class=\"small"+(PT[k].ej?" danger":"")+"\" type=\"button\" data-pt=\""+k+"\">"+PT[k].l+"</button>").join("")+"</div>"+
      (is3()?"":"<label class=\"ih-cc\"><input type=\"checkbox\" id=\"penCancel\""+(pc.cancel?" checked":"")+"> 상쇄 반칙 (양 팀 같은 반칙 · 인원은 그대로)</label>")+
      "<div class=\"btnrow\"><button class=\"small\" type=\"button\" id=\"penX\">취소</button></div>";
  }
  /* 페널티 샷 */
  const sb=$("psBox"),P=S.ps;sb.hidden=!P;
  if(P){const T=S.teams[P.t];sb.style.setProperty("--tc",COL(P.t));
    sb.innerHTML="<b>"+esc(T.name)+" "+(P.src==="fp"?"페어플레이 샷":"페널티 샷")+(P.tot>1?" · 남은 샷 "+P.n+"개":"")+"</b>"+
      "<span>"+(P.src==="fp"?"반칙 없이 뛴 팀의 보너스 샷 · 넣지 못하면 바로 경기 끝":is3()?"센터 점에서 출발 · 따라가는 선수도 뛸 수 있어요":"센터에서 출발해 골리와 1대1")+"</span>"+
      "<label>슈터 <select id=\"psWho\"><option value=\"-1\">이름 없이</option>"+T.roster.map((n,j)=>T.ej[j]?"":"<option value=\""+j+"\""+(P.who===j?" selected":"")+">"+esc(n)+"</option>").join("")+"</select></label>"+
      "<div class=\"btnrow op\">"+(is3()&&!S.periodEnd&&!S.running&&P.src!=="fp"?"<button class=\"small\" type=\"button\" id=\"psGo\">출발 · 시계 재개</button>":"")+"<button class=\"go\" type=\"button\" id=\"psG\">골</button><button class=\"small danger\" type=\"button\" id=\"psX\">실패 · 선방</button></div>";
  }
}
function draw(){
  const u3=S.cfg.rule==="u3";
  [0,1].forEach(t=>{
    const T=S.teams[t],n=T.roster.length;
    K.setVal("tname"+t,T.name);
    $("score"+t).innerHTML=score(t)+(S.so?"<small>("+soSum(t)+")</small>":"");
    const pim=sum(T.pim)+T.bpim;
    const pp=$("pim"+t);pp.textContent=L("반칙 ","Penalties ")+T.pens+(is3()?"":" · "+pim+"분");pp.className="pill"+(T.pens?"":" dash");
    $("sog"+t).textContent="유효 슛 "+shots(t)+" · 선방률 "+svPct(t)+"%";
    const tl=S.cfg.to-(T.tu||0);$("tout"+t).textContent="타임아웃 "+Math.max(0,tl);$("tout"+t).className="pill"+(tl>0?"":" dash");$("tout"+t).hidden=!S.cfg.to;
    const ps=$("pts"+t);ps.hidden=!u3;
    if(u3){const p=points();ps.textContent="승점 "+p[t]+(T.pens?"":" · 페어플레이");ps.className="pill"+(T.pens?"":" ok");}
    R.querySelector('[data-pull="'+t+'"]').classList.toggle("on",!!S.pull[t]);
    R.querySelector('[data-pull="'+t+'"]').textContent=S.pull[t]?"골리 복귀":"골리 빼기";
    $("rh"+t).textContent=T.name+" 선수";$("nl"+t).textContent=T.name+" 명단 ("+n+"명)";
    let h="<div class=\"prow hb ih head\"><span>이름</span><span style=\"text-align:center\">골·도움</span><span style=\"text-align:center\">슛·반칙</span><span class=\"op\"></span></div>";
    for(let i=0;i<n;i++){
      const nm=T.roster[i];
      h+="<div class=\"prow hb ih"+(T.ej[i]?" out":"")+"\"><span class=\"pn\">"+esc(nm)+(T.ej[i]?"<em>퇴장</em>":"")+"<em class=\"hb-sb\" data-sb=\""+t+":"+i+"\" hidden></em></span>"+
        "<span class=\"num\">"+K.fixN(T.g[i],"teams."+t+".g."+i+"|teams."+t+".sog."+i,nm+" · 골(유효 슛도 함께)","in")+"<small>-"+K.fixN(T.a[i],"teams."+t+".a."+i,nm+" · 도움","in")+"</small></span>"+
        "<span class=\"fixcards\">"+K.fixN("슛 "+T.sog[i],"teams."+t+".sog."+i,nm+" · 유효 슛","fixc"+(T.sog[i]?"":" zero"))+K.fixN(T.pim[i]+"′","teams."+t+".pim."+i,nm+" · 반칙 시간(분)","fixc"+(T.pim[i]?"":" zero"))+"</span>"+
        "<span class=\"btns op\"><button class=\"b2\" type=\"button\" data-goal=\""+i+"\" data-t=\""+t+"\">골</button><button type=\"button\" data-sog=\""+i+"\" data-t=\""+t+"\">"+L("슛","Shot")+"</button><button class=\"b2m\" type=\"button\" data-pen=\""+i+"\" data-t=\""+t+"\">"+L("반칙","Penalty")+"</button></span></div>";
    }
    $("r"+t).innerHTML=h;
    K.setVal("ros"+t,T.roster.join("\n"));
  });
  const max=S.ot?NP()+1:NP();
  const nb=$("nextBtn");nb.hidden=!(S.periodEnd&&S.period<max&&!S.over&&!S.so&&!S.fp&&!S.ps);
  nb.textContent=S.period+1>NP()?"연장 시작 ("+TI().ot+"분 · 3대3)":perName(S.period+1)+" 시작";
  $("endBtn").hidden=S.periodEnd||!!S.over;$("endBtn").textContent="이번 "+(is3()?"하프":"피리어드")+" 종료";
  drawBoxes();
  const sb=$("soBox");sb.hidden=!S.so;
  if(S.so){
    [0,1].forEach(t=>{
      $("son"+t).textContent=S.teams[t].name;
      const k=S.so.k[t],n=Math.max(S.so.n,S.so.k[0].length,S.so.k[1].length);
      let h="";for(let i=0;i<n;i++)h+=i<k.length?(k[i]?"<i class=\"g\"></i>":"<i class=\"x\"></i>"):"<i></i>";
      $("sok"+t).innerHTML=h;$("sos"+t).textContent=soSum(t);
    });
    const tt=soTurn(),n=S.so.k[tt].length+1;
    $("soTurn").innerHTML=S.over?"슛아웃 종료":"<span style=\"color:"+COL(tt)+"\">"+esc(S.teams[tt].name)+"</span> "+n+"번째 슈터"+(n>S.so.n?" · 서든데스":"");
  }
  $("log").innerHTML=S.log.length?S.log.slice(0,16).map(l=>{
    const T=S.teams[l.t],col=COL(l.t),m="<span class=\"p\" style=\"--c:"+col+"\">"+perTag(l.per)+" "+l.pt+"</span>";
    if(l.k==="g"){const x=[l.pp?"PP":"",l.sh?"SH":"",l.en?"EN":"",l.ps?"PS":"",l.fz?"×2":"",l.fp?"FP":""].filter(Boolean).join(" ");
      return "<li>"+m+"<span><b>골</b> · "+esc(T.name)+(l.who?" "+esc(l.who):"")+(l.a&&l.a.length?" <span class=\"x\">(도움 "+esc(l.a.join(", "))+")</span>":"")+(x?" <span class=\"ih-tag\">"+x+"</span>":"")+"</span></li>";}
    if(l.k==="pen")return "<li>"+m+"<span><b>반칙</b> · "+esc(T.name)+" "+esc(l.who)+" <span class=\"x\">"+PT[l.ty].l+(l.cancel?" · 상쇄":"")+"</span></span></li>";
    if(l.k==="psx")return "<li>"+m+"<span>"+(l.fp?"페어플레이 샷":"페널티 샷")+" 실패 · "+esc(T.name)+(l.who?" "+esc(l.who):"")+"</span></li>";
    if(l.k==="to")return "<li>"+m+"<span>타임아웃 · "+esc(T.name)+"</span></li>";
    if(l.k==="m")return "<li><span class=\"p\" style=\"--c:"+col+"\">−1</span><span>"+esc(T.name)+" <span class=\"x\">점수 정정</span></span></li>";
    return "<li><span class=\"p\" style=\"--c:"+col+"\">SO</span><span>슛아웃 · "+esc(T.name)+" "+(l.k==="sog"?"<b>성공</b>":"<span class=\"x\">실패</span>")+"</span></li>";
  }).join(""):"<li class=\"empty\">아직 기록이 없습니다. 선수 옆 골, 슛, 반칙 버튼으로 기록하세요.</li>";
  $("undoBtn").disabled=!undoStack.length;
  BG.draw();
  /* 설정 */
  $("cfgRule").value=S.cfg.rule;
  const ts=$("cfgTie");ts.innerHTML=RU().ties.map(k=>"<option value=\""+k+"\">"+TIES[k].l+"</option>").join("");ts.value=S.cfg.tie;
  $("cfgPerL").textContent=is3()?"하프 시간(분)":"피리어드 시간(분)";$("cfgNpL").textContent=is3()?"하프 수":"피리어드 수";
  K.setVal("cfgPer",S.cfg.per);K.setVal("cfgNp",S.cfg.np);K.setVal("cfgInter",S.cfg.inter);K.setVal("cfgTo",S.cfg.to);
  $("ihHelp").innerHTML=help();
  drawClock();
}
function help(){
  const r=S.cfg.rule;
  const common="명단은 한 줄에 한 명, 팀당 최대 25명(골리 포함)이에요. 처음 들어 있는 이름은 예시예요. 시계는 경기 시간에서 0으로 줄어들어요.<br>"+
    "<b>기록</b>: 선수 옆 <b>골</b>을 누르면 도움(어시스트) 선수를 최대 2명 고를 수 있어요. <b>슛</b>은 골대로 간 유효 슛이에요(상대 골리 선방). 골·도움을 합한 것이 포인트예요.<br>";
  if(r==="iihf")return common+
    "<b>5대5 정식 (IIHF)</b>: 20분짜리 피리어드 3개, 피리어드 사이 휴식 15분. 휘슬이 울리면 시계를 멈추는 <b>스톱 타임</b>이에요(<kbd>Space</kbd>). 팀 타임아웃은 경기당 1번, 30초.<br>"+
    "<b>반칙</b>: 마이너 2분 · 더블 마이너 4분 · 메이저 5분 동안 팀이 한 명 적게 뛰어요(파워플레이). 한 팀은 동시에 2명까지만 줄고, 세 번째 반칙은 앞 반칙이 끝나면 시작돼요. "+
    "미스컨덕트 10분은 선수만 나가고 인원은 그대로, 게임 미스컨덕트·매치 페널티는 퇴장이에요. 반칙 시간은 경기 시계와 함께 흘러요.<br>"+
    "<b>파워플레이 골</b>이 나면 상대의 마이너 하나가 끝나요(더블 마이너는 앞 2분, 메이저는 끝나지 않음). 상쇄 반칙은 체크하면 인원이 줄지 않아요.<br>"+
    "<b>골리 빼기</b>: 마지막에 골리 대신 공격수를 한 명 더 넣을 때 눌러요. 그때 들어간 골은 빈 골대(EN) 골로 기록돼요.<br>"+
    "<b>동점</b>: IIHF 조별 경기는 3분 쉬고 3대3 연장 5분(먼저 넣으면 끝), 그래도 같으면 슛아웃 5명 → 1명씩 서든데스. 토너먼트는 연장 10분. NHL 정규 시즌은 3대3 연장 5분 → 슛아웃 3명. 연장 3대3에서 반칙이 나면 상대가 4명, 5명으로 늘어나요. 슛아웃 승리 팀은 1골을 더해 기록해요.<br>"+
    "<kbd>Space</kbd> 시작/정지 · <kbd>Z</kbd> 되돌리기";
  if(r==="u3")return common+
    "<b>3대3 · IIHF 3x3 얼티밋 하키 (2026)</b>: 3명 + 골리. 12분 × 2하프(24분), 하프 사이 3분. 시계는 휘슬에도 계속 흐르는 <b>런닝 타임</b>이고 반칙·큰 부상 때만 멈춰요. 작은 링크, 오프사이드 없음, 터치 아이싱, 몸으로 부딪히는 체킹 금지, 교체는 자유롭게.<br>"+
    "<b>반칙</b>: 반칙 박스가 없어요. 마이너는 상대에게 <b>페널티 샷 1개</b>, 메이저는 <b>3개 연속</b>(반칙한 선수는 퇴장). 두 팀 반칙 수가 같으면 서로 상쇄돼요. 고의 아이싱, 마지막 1분의 시간 끌기도 페널티 샷이에요. 반칙을 누르면 시계가 멈추고, 샷이 출발할 때 다시 흘러요.<br>"+
    "<b>공격권 되돌리기</b>: 공격 팀이 방해 없이 퍽을 빨간 중앙선 너머로 가지고 나가면 상대 공이에요. 골리가 퍽을 잡으면 공격 팀은 되돌림선 뒤로 물러나요.<br>"+
    "<b>프리존 골</b>: 자기 진영(빨간 선 뒤)에서 넣은 골은 2골! 골을 넣은 뒤 '프리존 골'을 누르세요.<br>"+
    "<b>페어플레이 샷</b>: 반칙이 하나도 없는 팀은 경기 끝에 샷 1개를 더 얻어요(넣으면 비기거나 이길 수 있을 때만).<br>"+
    "<b>승점</b>: 하프마다 이긴 팀 1점(비기면 각 1점), 경기 승리 1점(비기면 각 1점), 최대 3점. 순위 결정전만 3분 쉬고 연장 5분 → 슛아웃 3명.<br>"+
    "<kbd>Space</kbd> 시작/정지 · <kbd>Z</kbd> 되돌리기";
  return common+
    "<b>3대3 · 3ICE 리그</b>: 3명 + 골리. 8분 × 2하프, <b>런닝 타임</b>(반칙·부상 때만 멈춤). 반칙은 파워플레이 대신 <b>페널티 샷</b>, 슈터는 코치가 골라요. 고의 아이싱도 페널티 샷. 공격 팀이 방해 없이 퍽을 중앙선 너머로 가지고 나가면 상대 공. 골리는 어디서나 퍽을 다룰 수 있어요.<br>"+
    "<b>동점</b>: 연장 없이 바로 1명씩 슛아웃, 승부가 날 때까지 이어 가요.<br>"+
    "<kbd>Space</kbd> 시작/정지 · <kbd>Z</kbd> 되돌리기";
}

/* ---------- 이벤트 ---------- */
K.fixKit(R,{get:()=>S,snap,after:()=>{save();draw();}});
$("goBtn").onclick=()=>{S.running?stop():start();};
K.bindTime(R,()=>left(),(k,v)=>{
  v=Math.max(0,Math.min(lim(),v));const nc=lim()-v,d=nc-S.clock;
  /* 시계를 고치면 흐르는 반칙 시간도 같이 고친다 */
  if(d){const ids=runIds();S.pen.forEach(p=>{if(ids.has(p.id))p.left=Math.min(p.full,p.left-d);});S.pen=S.pen.filter(p=>p.left>0);}
  S.clock=nc;
  if(S.periodEnd&&!S.so&&!S.over&&!S.fp&&v>0)S.periodEnd=false;
  save();draw();
},{full:()=>lim(),stop:()=>stop()});
$("endBtn").onclick=()=>{if(S.over||S.periodEnd)return;snap();endPeriod();};
$("nextBtn").onclick=nextPeriod;
$("soGoal").onclick=()=>soShot(1);
$("soMiss").onclick=()=>soShot(0);
$("undoBtn").onclick=undo;
$("toEnd").onclick=()=>{S.tout=null;S.inter=null;save();draw();};
K.arm($("newBtn"),"새 경기",()=>newGame());
R.addEventListener("click",e=>{
  let b;
  if(b=e.target.closest("[data-goal]")){goal(+b.dataset.t,+b.dataset.goal);return;}
  if(b=e.target.closest("[data-sog]")){shot(+b.dataset.t,+b.dataset.sog);return;}
  if(b=e.target.closest("[data-pen]")){openPen(+b.dataset.t,+b.dataset.pen);return;}
  if(b=e.target.closest("[data-tpen]")){openPen(+b.dataset.tpen,-1);return;}
  if(b=e.target.closest("[data-pt]")){penalty(b.dataset.pt);return;}
  if(b=e.target.closest("#penX")){pc=null;draw();return;}
  if(b=e.target.closest("[data-ast]")){assist(+b.dataset.ast);return;}
  if(b=e.target.closest("#agDone")){closeAg();return;}
  if(b=e.target.closest("#fzBtn")){freeZone();return;}
  if(b=e.target.closest("#psG")){psShot(1);return;}
  if(b=e.target.closest("#psX")){psShot(0);return;}
  if(b=e.target.closest("#psGo")){start();return;}
  if(b=e.target.closest("[data-og]")){goal(+b.dataset.og,-1);return;}
  if(b=e.target.closest("[data-shot]")){shot(+b.dataset.shot,-1);return;}
  if(b=e.target.closest("[data-tout]")){timeout(+b.dataset.tout);return;}
  if(b=e.target.closest("[data-pull]")){const t=+b.dataset.pull;if(S.over||S.so)return;snap();S.pull[t]=S.pull[t]?0:1;save();draw();
    K.toast(S.pull[t]?S.teams[t].name+" 골리를 빼고 공격수를 한 명 더 넣어요":S.teams[t].name+" 골리가 돌아왔어요","",2200);return;}
  if(b=e.target.closest("[data-unpen]")){const id=+b.dataset.unpen,x=S.pen.find(p=>p.id===id);if(!x)return;snap();S.pen=S.pen.filter(p=>p.id!==id);save();draw();
    K.toast((x.i>=0?S.teams[x.t].roster[x.i]:"벤치 마이너")+" 반칙 시간을 끝냈어요","",1600);return;}
  if(b=e.target.closest("[data-minus]")){const t=+b.dataset.minus,T=S.teams[t];if(score(t)<=0||S.over)return;snap();
    if(T.og>0){T.og--;T.os=Math.max(0,T.os-1);}else if(T.fz>0)T.fz--;else if(T.psg>0)T.psg--;else{const i=T.g.findIndex(x=>x>0);if(i>=0){T.g[i]--;T.sog[i]=Math.max(0,T.sog[i]-1);}else if(T.bg)T.bg--;}
    addLog({t,k:"m"});save();draw();return;}
});
R.addEventListener("input",e=>{const el=e.target;if(el.id==="tname0"||el.id==="tname1"){const t=+el.id.slice(-1);S.teams[t].name=el.value;$("rh"+t).textContent=el.value+" 선수";save();}});
R.addEventListener("change",e=>{
  const el=e.target;
  if(el.id==="penCancel"){if(pc)pc.cancel=el.checked;return;}
  if(el.id==="psWho"){if(S.ps){S.ps.who=+el.value;save();}return;}
  if(el.id==="ros0"||el.id==="ros1"){
    const t=+el.id.slice(-1),list=K.parseList(el.value,MAXP);if(!list.length){draw();return;}
    snap();
    const T=S.teams[t],old=T.roster,keys=["g","a","sog","pim","ej"],nw={};
    keys.forEach(k=>nw[k]=z(MAXP));
    const map={};list.forEach((n,j)=>{const i=old.indexOf(n);if(i>=0){keys.forEach(k=>nw[k][j]=T[k][i]);map[i]=j;}});
    keys.forEach(k=>T[k]=nw[k]);T.roster=list;
    S.pen=S.pen.filter(x=>x.t!==t||x.i<0||map[x.i]!=null).map(x=>x.t===t&&x.i>=0?Object.assign(x,{i:map[x.i]}):x);
    save();draw();
  }
  else if(el.id==="cfgRule"){
    const r=el.value;if(!RULES[r])return;
    newGame(defCfg(r));
    K.toast("경기 방식을 바꿔 새 경기로 준비했어요 · "+el.selectedOptions[0].textContent,"",2600);
  }
  else if(["cfgTie","cfgPer","cfgNp","cfgInter","cfgTo"].includes(el.id)){
    const C=S.cfg;
    C.tie=RU().ties.includes($("cfgTie").value)?$("cfgTie").value:RU().tie;
    C.per=Math.max(1,Math.min(30,+$("cfgPer").value||RU().per));
    C.np=Math.max(1,Math.min(4,+$("cfgNp").value||RU().np));
    C.inter=Math.max(0,Math.min(20,+$("cfgInter").value||0));
    C.to=Math.max(0,Math.min(3,Math.round(+$("cfgTo").value||0)));
    if(S.period>C.np&&!S.ot)S.period=C.np;
    if(S.clock>lim())S.clock=lim();
    save();draw();
  }
});
R.querySelectorAll("[data-tpen]").forEach(b=>b.textContent=L("팀 반칙","Bench penalty"));
draw();
return{
  record:makeRec,
  tick(dt,now){
    if(S.tout){S.tout.left-=dt;
      if(S.tout.left<=0){S.tout=null;K.snd.buzzer();K.toast("타임아웃 끝 · 재개를 누르세요","",3000);save();draw();}
      else{const s=Math.ceil(S.tout.left/1000);if(s!==lastSec){lastSec=s;if(s<=5)K.snd.tick(6-s);drawClock();}}}
    else if(S.inter){S.inter.left-=dt;
      if(S.inter.left<=0){S.inter=null;K.snd.buzzer();K.toast("휴식 끝 · 다음 경기를 시작하세요","",3000);save();draw();}
      else{const s=Math.ceil(S.inter.left/1000);if(s!==lastSec){lastSec=s;drawClock();}}}
    if(!S.running)return;
    const d=Math.min(dt,lim()-S.clock);
    S.clock+=d;penTick(d);
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
