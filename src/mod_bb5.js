/* ================= 농구 5대5 · 로테이션 ================= */
MODS.bb5={name:"농구 5대5",sub:"쿼터제 · 24초 · 빙고 16칸 · 빙고 미션",color:"var(--c-bb)",
html:`
<div class="modebar op">
  <div class="seg" role="group" aria-label="경기 방식">
    <button type="button" id="tabGame">5대5 경기</button>
    <button type="button" id="tabRot">로테이션 (3~5팀)</button>
  </div>
</div>

<div id="gameView" class="mod">
  <div class="modebar op">
    <div class="seg" role="group" aria-label="빙고 방식">
      <button type="button" data-bmode="0">기본</button>
      <button type="button" data-bmode="1">빙고 16칸</button>
      <button type="button" data-bmode="2">빙고 미션</button>
    </div>
    <span class="hint" id="modeHint"></span>
  </div>
  <div class="board">
    <section class="team" data-t="0">
      <input class="tname" id="gname0" aria-label="팀 이름">
      <div class="score" id="gscore0">0</div>
      <div class="tmeta">
        <div class="stat"><b id="gtf0">0</b><span>팀파울(쿼터)</span></div>
        <div class="stat"><div class="dots" id="gto0"></div><span>타임아웃</span></div>
      </div>
      <div class="pills"><span class="pill" id="gbonus0"></span><span class="pill" id="gbl0"></span></div>
      <div class="btnrow op"><button class="small" type="button" data-gto="0">타임아웃</button><button class="small" type="button" data-gadj="0">점수 −1</button></div>
    </section>
    <section class="center">
      <div class="qtr" id="gq">1쿼터</div>
      <div class="clock" id="gclock">7:00</div>
      ${K.timeCtl("gt")}
      <div class="shotbox" id="gshotbox"><div class="shot" id="gshot">24</div><div class="lbl">공격 제한</div></div>
      <div class="state" id="gstate">대기 중</div>
      <div class="btnrow op">
        <button class="go" id="gGo" type="button">시작</button>
        <button class="sr" id="gS24" type="button">24초</button>
        <button class="sr" id="gS14" type="button">14초</button>
      </div>
      <button class="nextq op" id="gNextQ" type="button" hidden>다음 쿼터 시작</button>
      <div class="btnrow op">
        <button class="small" type="button" data-gsht="-1000">공격 −1</button>
        <button class="small" type="button" data-gsht="1000">공격 +1</button>
        <button class="small" id="gUndo" type="button">되돌리기</button>
      </div>
    </section>
    <section class="team" data-t="1">
      <input class="tname" id="gname1" aria-label="팀 이름">
      <div class="score" id="gscore1">0</div>
      <div class="tmeta">
        <div class="stat"><b id="gtf1">0</b><span>팀파울(쿼터)</span></div>
        <div class="stat"><div class="dots" id="gto1"></div><span>타임아웃</span></div>
      </div>
      <div class="pills"><span class="pill" id="gbonus1"></span><span class="pill" id="gbl1"></span></div>
      <div class="btnrow op"><button class="small" type="button" data-gto="1">타임아웃</button><button class="small" type="button" data-gadj="1">점수 −1</button></div>
    </section>
  </div>
  <div class="bingos" id="gbingos">
    <div class="bingo" data-t="0"><div class="bhead"><h3 id="gbh0">홍팀 빙고</h3><button class="small op" type="button" data-gshuf="0">빙고 칸 섞기</button></div><div class="grid4" id="gg0"></div></div>
    <div class="bingo" data-t="1"><div class="bhead"><h3 id="gbh1">청팀 빙고</h3><button class="small op" type="button" data-gshuf="1">빙고 칸 섞기</button></div><div class="grid4" id="gg1"></div></div>
  </div>
  <div class="bfoot op" id="gbfoot"></div>
  <div class="rosters">
    <div class="roster" data-t="0"><h3 id="grh0">홍팀 개인 기록</h3><div id="gr0"></div></div>
    <div class="roster" data-t="1"><h3 id="grh1">청팀 개인 기록</h3><div id="gr1"></div></div>
  </div>
  <div class="lower">
    <div class="box"><h4>득점 기록</h4><ul class="log" id="glog"></ul></div>
    <div class="box op">
      <h4>경기 설정</h4>
      <div class="cfg">
        <div class="cfgrow">
          <label>쿼터(분) <input id="gcQmin" type="number" min="1" max="20"></label>
          <label>쿼터 수 <select id="gcQn"><option value="2">2쿼터(전·후반)</option><option value="4">4쿼터</option></select></label>
          <label>연장(분) <input id="gcOt" type="number" min="1" max="10"></label>
          <label>공격 제한(초) <input id="gcShot" type="number" min="5" max="40"></label>
        </div>
        <div class="cfgrow">
          <label>팀파울 보너스 <input id="gcBonusAt" type="number" min="2" max="10">개부터</label>
          <label>빙고 1줄 보너스 <input id="gcBingo" type="number" min="0" max="30">점</label>
        </div>
        <div class="names">
          <div><div class="nh"><span id="gnl0">홍팀 명단</span></div><textarea id="gros0" aria-label="홍팀 명단"></textarea></div>
          <div><div class="nh"><span id="gnl1">청팀 명단</span></div><textarea id="gros1" aria-label="청팀 명단"></textarea></div>
          <div><div class="nh"><span>미션 목록</span></div><textarea id="gmis" aria-label="미션 목록"></textarea></div>
        </div>
        <div class="keys">명단은 한 줄에 한 명, 팀당 최대 16명입니다. 처음 들어 있는 이름은 예시예요. 명단 인원이 바뀌거나 미션을 고치면 빙고판이 새로 만들어집니다.<br>
          미션 중 "3점"이 들어간 칸은 3점슛, "자유투"가 들어간 칸은 +1 득점 때 자동으로 체크됩니다. 나머지 미션은 칸을 직접 눌러 체크하세요.<br>
          <kbd>Space</kbd> 시작/정지 · <kbd>R</kbd> 24초 · <kbd>T</kbd> 14초 · <kbd>Z</kbd> 되돌리기</div>
        <div><button class="danger" id="gNew" type="button">새 경기</button></div>
      </div>
    </div>
  </div>
</div>

<div id="rotView" class="mod" hidden>
  <div class="rtop">
    <div class="rclock">
      <div><div class="lbl">경기 시간</div><div class="clock" id="rclock">10:00</div>${K.timeCtl("rt")}</div>
      <div class="shotbox" id="rshotbox"><div class="shot" id="rshot">20</div><div class="lbl">공격 제한</div></div>
      <div class="state" id="rstate">대기 중</div>
    </div>
    <div class="rctrl op">
      <button class="go" id="rGo" type="button">시작</button>
      <button class="sr" id="rSR" type="button">공격시간 리셋</button>
      <button class="small" id="rSwap" type="button">공격 방향 바꾸기</button>
      <button class="small" id="rUndo" type="button">되돌리기</button>
    </div>
  </div>
  <div class="court">
    <div class="bkt" id="bk0">
      <svg class="hoop" viewBox="0 0 48 48" aria-hidden="true"><rect x="6" y="6" width="36" height="22" rx="2" fill="none" stroke="currentColor" stroke-width="2" opacity=".5"/><ellipse cx="24" cy="28" rx="10" ry="3.5" fill="none" stroke="var(--amber)" stroke-width="3"/><path d="M15 29l3 13M33 29l-3 13M20 30l1 12M28 30l-1 12" stroke="currentColor" stroke-width="1.5" opacity=".5"/></svg>
      <div class="lbl">왼쪽 골대</div><div class="nm" id="bkn0"></div><div class="st" id="bks0"></div>
    </div>
    <div class="atkbox" id="atkbox">
      <div class="lbl">공격</div>
      <div class="atkname" id="atkn"></div>
      <svg class="arrow" id="arrow" viewBox="0 0 220 40" aria-hidden="true"><path d="M4 20H196" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><path d="M178 6L206 20L178 34" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <div class="streak" id="streak"></div>
    </div>
    <div class="bkt" id="bk1">
      <svg class="hoop" viewBox="0 0 48 48" aria-hidden="true"><rect x="6" y="6" width="36" height="22" rx="2" fill="none" stroke="currentColor" stroke-width="2" opacity=".5"/><ellipse cx="24" cy="28" rx="10" ry="3.5" fill="none" stroke="var(--amber)" stroke-width="3"/><path d="M15 29l3 13M33 29l-3 13M20 30l1 12M28 30l-1 12" stroke="currentColor" stroke-width="1.5" opacity=".5"/></svg>
      <div class="lbl">오른쪽 골대</div><div class="nm" id="bkn1"></div><div class="st" id="bks1"></div>
    </div>
  </div>
  <div class="queue" id="queue"></div>
  <div class="ract op" id="ract">
    <button class="ok2" type="button" data-rpts="2">+2 성공<small>계속 공격</small></button>
    <button class="ok3" type="button" data-rpts="3">+3 성공<small>계속 공격</small></button>
    <button class="ok1" type="button" data-rpts="1">+1 성공<small>자유투 등</small></button>
    <button class="fail" type="button" id="rFail">공격 실패<small>수비팀이 공격으로</small></button>
  </div>
  <div class="tblwrap"><table><thead><tr><th>순위</th><th style="text-align:left">팀</th><th>누적 점수</th><th>공격 성공/시도</th><th>성공률</th><th>최고 연속</th><th>수비 성공</th></tr></thead><tbody id="rtbody"></tbody></table></div>
  <div class="lower">
    <div class="box"><h4>공격 기록</h4><ul class="log" id="rlog"></ul></div>
    <div class="box op">
      <h4>로테이션 설정</h4>
      <div class="cfg">
        <div class="cfgrow">
          <label>팀 수 <select id="rcN"><option value="3">3팀</option><option value="4">4팀</option><option value="5">5팀</option></select></label>
          <label>경기 시간(분) <input id="rcMin" type="number" min="1" max="40"></label>
          <label>공격 제한(초) <input id="rcShot" type="number" min="5" max="40"></label>
        </div>
        <div class="cfgrow">
          <label><input id="rcAuto" type="checkbox"> 공격 시간 초과 시 자동으로 공격 실패</label>
          <label>수비 성공 점수 <input id="rcStop" type="number" min="0" max="5">점</label>
        </div>
        <div class="cfgrow" id="rcNames"></div>
        <div class="keys">시작 배치: 1번 팀이 공격, 2번 팀이 왼쪽 골대 수비, 3번 팀이 오른쪽 골대 수비, 나머지는 대기입니다.<br>
          공격 성공 → 공격팀은 반대 골대로 계속 공격, 수비팀은 퇴장, 대기 1순위 팀이 그 골대 수비로 입장.<br>
          공격 실패 → 수비팀이 공격권을 잡고 반대 골대로, 실패한 공격팀은 퇴장, 대기 1순위 팀 입장.<br>
          <kbd>Space</kbd> 시작/정지 · <kbd>2</kbd> <kbd>3</kbd> <kbd>1</kbd> 득점 · <kbd>X</kbd> 공격 실패 · <kbd>Z</kbd> 되돌리기</div>
        <div><button class="danger" id="rNew" type="button">새 경기</button></div>
      </div>
    </div>
  </div>
</div>`,
init(ctx,opts){
const $=K.$,RT=ctx.root,KEY="pe-bb5";
const L4=[[0,1,2,3],[4,5,6,7],[8,9,10,11],[12,13,14,15],[0,4,8,12],[1,5,9,13],[2,6,10,14],[3,7,11,15],[0,5,10,15],[3,6,9,12]];
const DEFM=["3점슛 성공","자유투 성공","인터셉트","팁인 득점","블록슛","공격 리바운드","어시스트","속공 득점","레이업 득점","바운드 패스 어시스트","박스아웃","굿 디펜스"];
const GCOL=["var(--red)","var(--blue)"];
const RCOL=["var(--red)","var(--blue)","var(--t3)","var(--t4)","var(--t5)"];
const RNAMES=["A팀","B팀","C팀","D팀","E팀"];
const esc=K.esc;

function gTeam(name,roster){return{name,roster:roster.slice(0,16),pts:Array(16).fill(0),fl:Array(16).fill(0),to:2,tf:Array(10).fill(0),board:[],chk:Array(16).fill(0),adj:0};}
function gFresh(cfg,keep,missions){
  const cf=cfg||{qmin:7,qn:4,ot:3,shot:24,bonusAt:5,mode:1,bingo:5};
  const k=keep||[{name:"홍팀",roster:K.EX10[0]},{name:"청팀",roster:K.EX10[1]}];
  const G={cfg:cf,teams:k.map(x=>gTeam(x.name,x.roster)),missions:(missions||DEFM).slice(),q:1,clock:cf.qmin*60000,shot:cf.shot*1000,running:false,qEnd:false,over:null,log:[]};
  G.teams.forEach((T,t)=>buildBoard(G,t,false));
  return G;
}
function buildBoard(G,t,mix){
  const T=G.teams[t],n=Math.max(1,T.roster.length);
  const idx=[...Array(n).keys()];if(mix)K.shuf(idx);
  const b=[];
  if(G.cfg.mode===2){
    const ms=(mix?K.shuf(G.missions.slice()):G.missions.slice()).slice(0,8);
    while(ms.length<8)ms.push("미션 "+(ms.length+1));
    let pi=0,mi=0;
    for(let c=0;c<16;c++){const r=Math.floor(c/4),cl=c%4;
      if((r+cl)%2===0)b.push({k:"p",i:idx[pi++%n]});else b.push({k:"m",t:ms[mi++]});}
    if(mix)K.shuf(b);
  }else{for(let c=0;c<16;c++)b.push({k:"p",i:idx[c%n]});}
  T.board=b;T.chk=Array(16).fill(0);
}
function rFresh(cfg,names){
  const cf=cfg||{n:5,min:10,shot:20,auto:true,stopPts:0};
  const R={cfg:cf,teams:RNAMES.map((nm,i)=>({name:names?names[i]:nm,score:0,att:0,made:0,stop:0,streak:0,best:0})),clock:cf.min*60000,shot:cf.shot*1000,running:false,over:false,log:[]};
  rPlace(R);return R;
}
function rPlace(R){const n=R.cfg.n;R.atk=0;R.bk=[1,2];R.dir=0;R.queue=[];for(let i=3;i<n;i++)R.queue.push(i);}

let S=K.load(KEY);
if(!S||!S.G||!S.R)S={tab:"game",G:gFresh(),R:rFresh()};
if(opts.tab)S.tab=opts.tab;
S.G.running=false;S.R.running=false;
let undoG=[],undoR=[],lastSave=0,freshCell=null;
const save=()=>K.save(KEY,S);
function snapG(){undoG.push(JSON.stringify(S.G));if(undoG.length>150)undoG.shift();}
function snapR(){undoR.push(JSON.stringify(S.R));if(undoR.length>150)undoR.shift();}
function undo(){
  const isG=S.tab==="game",st=isG?undoG:undoR;if(!st.length)return;
  const cur=isG?S.G:S.R,keep={clock:cur.clock,shot:cur.shot,running:cur.running};
  const prev=JSON.parse(st.pop());Object.assign(prev,keep);
  if(isG)S.G=prev;else S.R=prev;
  K.closeModal();save();drawAll();K.toast("되돌렸습니다","",1200);
}

/* ----- 5대5 ----- */
const lines=T=>L4.filter(L=>L.every(c=>T.chk[c]));
const gScore=t=>{const g=S.G,T=g.teams[t];return T.pts.reduce((a,b)=>a+b,0)+(g.cfg.mode?lines(T).length*g.cfg.bingo:0)+T.adj;};
const qIdx=()=>Math.min(S.G.q,S.G.cfg.qn)-1;
const qLabel=q=>q<=S.G.cfg.qn?(S.G.cfg.qn===2?(q===1?"전반":"후반"):q+"쿼터"):"연장 "+(q-S.G.cfg.qn);

function gPts(t,i,v){
  const g=S.G;if(g.over)return;snapG();
  const T=g.teams[t],before=lines(T).length;
  T.pts[i]+=v;
  const checked=[];
  if(g.cfg.mode){
    const c=T.board.findIndex((b,ci)=>b.k==="p"&&b.i===i&&!T.chk[ci]);
    if(c>=0){T.chk[c]=1;checked.push(c);}
    if(g.cfg.mode===2){
      const key=v===3?"3점":v===1?"자유투":null;
      if(key){const c2=T.board.findIndex((b,ci)=>b.k==="m"&&b.t.includes(key)&&!T.chk[ci]);if(c2>=0){T.chk[c2]=1;checked.push(c2);}}
    }
  }
  g.shot=g.cfg.shot*1000;$("gshotbox").classList.remove("viol");
  const nl=lines(T).length-before;
  g.log.unshift({t,txt:T.roster[i],v,nl,bonus:nl*g.cfg.bingo,q:g.q});if(g.log.length>80)g.log.pop();
  freshCell={t,cells:checked};
  save();drawGame();K.bump($("gscore"+t));K.fx.play("fire",$("gscore"+t),{big:v===3,text:"+"+v});
  if(nl>0){K.snd.fanfare();K.toast(T.name+" 빙고 "+nl+"줄! 보너스 +"+nl*g.cfg.bingo+"점","bingo",3600);}
  else if(v===3)K.snd.swish();else K.snd.chime();
}
function gFoul(t,i){
  const g=S.G;if(g.over)return;snapG();
  const T=g.teams[t];T.fl[i]++;T.tf[qIdx()]++;
  const f=T.tf[qIdx()];
  if(T.fl[i]===5)K.toast(T.roster[i]+" 파울 5개 · 퇴장","bad",3200);
  else if(f===g.cfg.bonusAt)K.toast(T.name+" 팀파울 "+f+"개 · 이제부터 상대 자유투","",3000);
  g.log.unshift({t,txt:T.roster[i]+" 파울",v:0,nl:0,bonus:0,q:g.q,foul:true});
  save();drawGame();
}
function gCell(t,c){
  const g=S.G;if(!g.cfg.mode||g.over)return;snapG();
  const T=g.teams[t],before=lines(T).length;
  T.chk[c]=T.chk[c]?0:1;
  const nl=lines(T).length-before;
  if(T.chk[c]&&T.board[c].k==="m")g.log.unshift({t,txt:"미션 · "+T.board[c].t,v:0,nl,bonus:Math.max(0,nl)*g.cfg.bingo,q:g.q,mission:true});
  freshCell=T.chk[c]?{t,cells:[c]}:null;
  save();drawGame();
  if(nl>0){K.bump($("gscore"+t));K.snd.fanfare();K.toast(T.name+" 빙고 "+nl+"줄! 보너스 +"+nl*g.cfg.bingo+"점","bingo",3600);}
  else if(T.chk[c])K.snd.chime();
}
function gStart(){const g=S.G;if(g.over||g.qEnd||g.clock<=0)return;if(g.shot<=0)g.shot=g.cfg.shot*1000;g.running=true;$("gshotbox").classList.remove("viol");K.wake(true);drawGClock();}
function gStop(){S.G.running=false;K.wake(false);save();drawGClock();}
function gShotSet(s){S.G.shot=s*1000;$("gshotbox").classList.remove("viol");save();drawGClock();}
function gTimeUp(){
  const g=S.G;g.running=false;K.snd.horn();K.wake(false);
  if(g.q<g.cfg.qn){g.qEnd=true;K.toast(qLabel(g.q)+" 종료","",3000);}
  else{const a=gScore(0),b=gScore(1);
    if(a===b){g.qEnd=true;K.toast("동점! 연장전을 준비하세요","",4000);}
    else{g.over={w:a>b?0:1};gModal();}}
  save();drawGame();
}
function gNextQ(){
  const g=S.G;if(!g.qEnd)return;
  g.q++;g.clock=(g.q>g.cfg.qn?g.cfg.ot:g.cfg.qmin)*60000;g.shot=g.cfg.shot*1000;g.qEnd=false;
  if(g.q===Math.floor(g.cfg.qn/2)+1)g.teams.forEach(T=>T.to=2);
  undoG=[];save();drawGame();K.toast(qLabel(g.q)+" 시작 준비","",1800);
}
function gModal(){
  const g=S.G,w=g.over.w,T=g.teams;let st="";
  [0,1].forEach(t=>{const tt=T[t],n=tt.roster.length,mx=Math.max(...tt.pts.slice(0,n));
    if(mx>0)st+="<div>"+esc(tt.name)+" 최다 득점: <b>"+esc(tt.roster.filter((x,i)=>tt.pts[i]===mx).join(", "))+"</b> ("+mx+"점)</div>";
    const sc=tt.pts.slice(0,n).filter(p=>p>0).length;
    st+="<div style=\"color:var(--muted)\">"+esc(tt.name)+" 득점한 선수 "+sc+"/"+n+"명"+(g.cfg.mode?" · 빙고 "+lines(tt).length+"줄":"")+"</div>";});
  K.modal({sub:"경기 종료",title:T[w].name+" 승리",color:GCOL[w],score:gScore(0)+" : "+gScore(1),stats:st,buttons:[{label:"되돌리기",fn:undo},{label:"닫기"}]});
  ctx.store(gRec());
}
function gRec(){
  const g=S.G;if(!g.mid)g.mid=K.newId();
  const T=g.teams,M=["기본","빙고 16칸","빙고 미션"][g.cfg.mode];
  const d=[M+" · "+qLabel(g.q)+(g.over?" 종료":" 진행 중")];
  if(g.cfg.mode)T.forEach(t=>{const n=lines(t).length;if(n)d.push(t.name+" 빙고 "+n+"줄 +"+n*g.cfg.bingo);});
  T.forEach(t=>{const n=t.roster.length;d.push(t.name+" 득점한 선수 "+t.pts.slice(0,n).filter(p=>p>0).length+"/"+n+"명");});
  return{id:g.mid,sport:"bb5",sportName:"농구 5대5",at:Date.now(),done:!!g.over,
    teams:T.map((t,i)=>({name:t.name,score:gScore(i)})),winner:g.over?T[g.over.w].name:null,
    summary:gScore(0)+" : "+gScore(1),details:d,
    players:T.flatMap(t=>t.roster.map((n,i)=>({team:t.name,name:n,pts:t.pts[i],note:t.fl[i]?"파울 "+t.fl[i]:""})))};
}
function rRec(){
  const r=S.R;if(!r.mid)r.mid=K.newId();
  const rk=rRank();
  return{id:r.mid,sport:"bbrot",sportName:"농구 로테이션",at:Date.now(),done:!!r.over,
    teams:rk.map(x=>({name:x.T.name,score:x.T.score})),winner:r.over?rk[0].T.name:null,
    summary:rk.map(x=>x.T.name+" "+x.T.score).join(" / "),
    details:rk.map((x,n)=>(n+1)+"위 "+x.T.name+" "+x.T.score+"점 · 성공 "+x.T.made+"/"+x.T.att+" · 최고 연속 "+x.T.best+" · 수비 성공 "+x.T.stop),players:[]};
}
function drawGClock(){
  const g=S.G;
  $("gq").textContent=qLabel(g.q);
  const c=$("gclock");c.textContent=K.fmt(g.clock);c.className="clock"+(g.clock<60000?" low":"");
  if(!g.running)K.fillTime("gt",g.clock);
  const sh=$("gshot");
  if(g.clock<g.shot){sh.textContent="—";sh.className="shot";}else{sh.textContent=Math.ceil(g.shot/1000);sh.className="shot"+(g.shot<=5000?" low":"");}
  const b=$("gGo");b.textContent=g.running?"정지":"시작";b.classList.toggle("run",g.running);
  const st=$("gstate");st.textContent=g.over?"경기 종료":g.qEnd?(qLabel(g.q)+" 종료 · 다음 쿼터를 시작하세요"):g.running?"경기 진행 중":"정지";st.classList.toggle("live",g.running);
  $("gNextQ").hidden=!g.qEnd;
  $("gNextQ").textContent=(g.q>=g.cfg.qn?"연장전":qLabel(g.q+1))+" 시작";
}
function drawGame(){
  const g=S.G,C=g.cfg;
  RT.querySelectorAll("[data-bmode]").forEach(b=>b.setAttribute("aria-pressed",String(+b.dataset.bmode===C.mode)));
  $("modeHint").textContent=C.mode===0?"일반 5대5 경기입니다.":C.mode===1?"16칸 모두 선수 이름. 득점한 선수 칸이 체크되고, 한 줄 완성마다 +"+C.bingo+"점.":"선수 8칸 + 미션 8칸. 득점과 미션 장면으로 칸을 채우고, 한 줄 완성마다 +"+C.bingo+"점.";
  $("gbingos").hidden=!C.mode;$("gbfoot").hidden=!C.mode;
  $("gbfoot").textContent=C.mode===2?"선수 칸은 그 선수가 득점하면 자동 체크됩니다. 미션 칸은 그 장면이 나왔을 때 눌러서 체크하세요. 잘못 누르면 한 번 더 누르면 해제됩니다.":"선수가 득점하면 그 선수 칸이 자동으로 체크됩니다. 같은 이름이 두 칸이면 두 번째 득점 때 두 번째 칸이 체크돼요. 칸을 눌러 직접 체크·해제할 수도 있습니다.";
  [0,1].forEach(t=>{
    const T=g.teams[t],n=T.roster.length;
    K.setVal("gname"+t,T.name);
    $("gscore"+t).textContent=gScore(t);
    const f=T.tf[qIdx()];$("gtf"+t).textContent=f;
    const bp=$("gbonus"+t);
    if(f>=C.bonusAt){bp.textContent="보너스 · 상대 자유투";bp.className="pill warn";}else{bp.textContent="보너스까지 "+(C.bonusAt-f);bp.className="pill";}
    const ln=lines(T),bl=$("gbl"+t);bl.hidden=!C.mode;
    if(ln.length){bl.textContent="빙고 "+ln.length+"줄 +"+ln.length*C.bingo;bl.className="pill ok";}else{bl.textContent="빙고 0줄";bl.className="pill";}
    $("gto"+t).innerHTML=[0,1].map(i=>"<i"+(i<T.to?"":" class=\"off\"")+"></i>").join("");
    $("gbh"+t).textContent=T.name+" 빙고";$("grh"+t).textContent=T.name+" 개인 기록";$("gnl"+t).textContent=T.name+" 명단 ("+n+"명)";
    if(C.mode){
      const inL=new Set();ln.forEach(L=>L.forEach(c=>inL.add(c)));
      const fr=freshCell&&freshCell.t===t?freshCell.cells:[];
      $("gg"+t).innerHTML=T.board.map((b,c)=>{
        const isM=b.k==="m",label=isM?b.t:(T.roster[b.i]||"선수");
        const cls="cell"+(isM?" m":"")+(T.chk[c]?" hit":"")+(inL.has(c)?" line":"")+(fr.includes(c)?" fresh":"");
        return "<button type=\"button\" class=\""+cls+"\" data-gcell=\""+c+"\" data-t=\""+t+"\">"+(isM?"<span class=\"tag\">미션</span>":"")+"<span>"+esc(label)+"</span></button>";
      }).join("");
    }
    let h="<div class=\"prow head\"><span>이름</span><span style=\"text-align:center\">득점</span><span style=\"text-align:center\">파울</span><span class=\"op\"></span></div>";
    for(let i=0;i<n;i++){
      h+="<div class=\"prow\"><span class=\"pn\">"+esc(T.roster[i])+(T.fl[i]>=5?"<em>퇴장</em>":"")+"</span>"+K.fixN(T.pts[i],"G.teams."+t+".pts."+i,T.roster[i]+" · 득점")+K.fixN(T.fl[i],"G.teams."+t+".fl."+i+"|G.teams."+t+".tf."+qIdx(),T.roster[i]+" · 파울 (팀파울도 함께)","fl")+
        "<span class=\"btns op\"><button class=\"b1\" type=\"button\" data-gp=\"1\" data-t=\""+t+"\" data-i=\""+i+"\">+1</button><button class=\"b2\" type=\"button\" data-gp=\"2\" data-t=\""+t+"\" data-i=\""+i+"\">+2</button><button class=\"b3\" type=\"button\" data-gp=\"3\" data-t=\""+t+"\" data-i=\""+i+"\">+3</button><button class=\"bf\" type=\"button\" data-gf=\"1\" data-t=\""+t+"\" data-i=\""+i+"\">파울</button></span></div>";
    }
    $("gr"+t).innerHTML=h;
    K.setVal("gros"+t,T.roster.join("\n"));
  });
  freshCell=null;
  K.setVal("gmis",g.missions.join("\n"));
  $("glog").innerHTML=g.log.length?g.log.slice(0,10).map(l=>{
    const T=g.teams[l.t];
    const p=l.foul?"F":l.mission?"✓":(l.v+l.bonus>0?"+":"")+(l.v+l.bonus);
    let d=esc(T.name)+" · "+esc(l.txt)+(l.adj?" <span class=\"x\">점수 정정</span>":"");
    if(l.nl>0)d+=" <span class=\"bg\">빙고 "+l.nl+"줄 +"+l.bonus+"</span>";
    return "<li><span class=\"p\" style=\"--c:"+GCOL[l.t]+"\">"+p+"</span><span>"+d+" <span class=\"x\">· "+qLabel(l.q)+"</span></span></li>";
  }).join(""):"<li class=\"empty\">아직 기록이 없습니다. 개인 기록의 +1, +2, +3 버튼으로 득점을 입력하세요.</li>";
  $("gUndo").disabled=!undoG.length;
  K.setVal("gcQmin",C.qmin);$("gcQn").value=String(C.qn);K.setVal("gcOt",C.ot);K.setVal("gcShot",C.shot);K.setVal("gcBonusAt",C.bonusAt);K.setVal("gcBingo",C.bingo);
  $("gS24").textContent=C.shot+"초";
  drawGClock();
}

/* ----- 로테이션 ----- */
function rAdvance(loser){const r=S.R;r.queue.push(loser);r.bk[r.dir]=r.queue.shift();r.dir=1-r.dir;r.shot=r.cfg.shot*1000;$("rshotbox").classList.remove("viol");}
function rScore(v){
  const r=S.R;if(r.over)return;snapR();
  const T=r.teams[r.atk],def=r.bk[r.dir];
  T.score+=v;T.att++;T.made++;T.streak++;T.best=Math.max(T.best,T.streak);
  r.log.unshift({a:r.atk,d:def,v,ok:true,st:T.streak});if(r.log.length>80)r.log.pop();
  rAdvance(def);save();drawRot();K.fx.play("fire",$("atkn"),{big:v===3,text:"+"+v,color:RCOL[r.atk]});
  if(T.streak>=3){K.snd.fanfare();K.toast(T.name+" "+T.streak+"연속 공격 성공!","bingo",2800);}else if(v===3)K.snd.swish();else K.snd.chime();
}
function rFail(auto){
  const r=S.R;if(r.over)return;snapR();
  const A=r.teams[r.atk],dI=r.bk[r.dir],D=r.teams[dI];
  A.att++;A.streak=0;D.stop++;D.score+=r.cfg.stopPts;
  r.log.unshift({a:r.atk,d:dI,v:r.cfg.stopPts,ok:false,auto:!!auto});if(r.log.length>80)r.log.pop();
  const loser=r.atk;r.atk=dI;rAdvance(loser);
  save();drawRot();
  if(!auto)K.snd.stop();
  K.toast((auto?"공격 시간 초과 · ":"")+D.name+" 수비 성공! 공격 전환",auto?"bad":"",2200);
}
function rStart(){const r=S.R;if(r.over||r.clock<=0)return;if(r.shot<=0)r.shot=r.cfg.shot*1000;r.running=true;$("rshotbox").classList.remove("viol");K.wake(true);drawRClock();}
function rStop(){S.R.running=false;K.wake(false);save();drawRClock();}
function rRank(){const r=S.R;return r.teams.slice(0,r.cfg.n).map((T,i)=>({T,i})).sort((a,b)=>b.T.score-a.T.score||b.T.made-a.T.made||b.T.stop-a.T.stop);}
function rModal(){
  const rk=rRank(),w=rk[0];
  const bestS=Math.max(...rk.map(x=>x.T.best)),bestD=Math.max(...rk.map(x=>x.T.stop));
  let st=rk.map((x,n)=>"<div>"+(n+1)+"위 <b style=\"color:"+RCOL[x.i]+"\">"+esc(x.T.name)+"</b> "+x.T.score+"점 · 성공 "+x.T.made+"/"+x.T.att+"</div>").join("");
  if(bestS>0)st+="<div style=\"color:var(--muted)\">최고 연속 공격: "+esc(rk.filter(x=>x.T.best===bestS).map(x=>x.T.name).join(", "))+" ("+bestS+"연속)</div>";
  if(bestD>0)st+="<div style=\"color:var(--muted)\">수비왕: "+esc(rk.filter(x=>x.T.stop===bestD).map(x=>x.T.name).join(", "))+" ("+bestD+"번)</div>";
  K.modal({sub:"로테이션 경기 종료",title:w.T.name+" 1위",color:RCOL[w.i],score:w.T.score+"점",stats:st,buttons:[{label:"닫기"}]});
  ctx.store(rRec());
}
function drawRClock(){
  const r=S.R;
  const c=$("rclock");c.textContent=K.fmt(r.clock);c.className="clock"+(r.clock<60000?" low":"");
  if(!r.running)K.fillTime("rt",r.clock);
  const sh=$("rshot");sh.textContent=Math.ceil(r.shot/1000);sh.className="shot"+(r.shot<=5000?" low":"");
  const b=$("rGo");b.textContent=r.running?"정지":"시작";b.classList.toggle("run",r.running);
  const st=$("rstate");st.textContent=r.over?"경기 종료":r.running?"경기 진행 중":"정지";st.classList.toggle("live",r.running);
}
function drawRot(){
  const r=S.R,C=r.cfg,T=r.teams,col=i=>RCOL[i];
  [0,1].forEach(s=>{
    const ti=r.bk[s],el=$("bk"+s);el.style.setProperty("--c",col(ti));
    $("bkn"+s).textContent=T[ti].name;
    const on=r.dir===s;el.classList.toggle("on",on);
    $("bks"+s).textContent=on?"수비 중":"수비 준비";
  });
  $("atkbox").style.setProperty("--c",col(r.atk));
  $("atkn").textContent=T[r.atk].name;
  $("arrow").classList.toggle("l",r.dir===0);
  const s=T[r.atk].streak;$("streak").textContent=s>0?s+"연속 성공 중":"";
  $("ract").style.setProperty("--c",col(r.atk));
  $("queue").innerHTML="<span class=\"lbl\">대기</span>"+(r.queue.length?r.queue.map((q,i)=>(i?"<span class=\"qsep\">→</span>":"")+"<span class=\"qchip"+(i===0?" next":"")+"\" style=\"--c:"+col(q)+"\">"+esc(T[q].name)+(i===0?" · 다음 입장":"")+"</span>").join(""):"<span class=\"qsep\">3팀 경기라 대기 팀 없이 바로 다시 들어갑니다</span>");
  const rk=rRank(),top=rk[0].T.score;
  $("rtbody").innerHTML=rk.map((x,n)=>{
    const t=x.T,rate=t.att?Math.round(t.made/t.att*100)+"%":"—",now=x.i===r.atk;
    return "<tr class=\""+(t.score===top&&top>0?"lead ":"")+(now?"now":"")+"\" style=\"--c:"+col(x.i)+"\"><td class=\"rk\">"+(n+1)+"</td><td class=\"tn\"><i></i>"+esc(t.name)+(now?" <span class=\"pill\" style=\"margin-left:6px\">공격 중</span>":"")+"</td><td class=\"big\">"+K.fixN(t.score,"R.teams."+x.i+".score",t.name+" · 점수")+"</td><td>"+t.made+" / "+t.att+"</td><td>"+rate+"</td><td>"+t.best+"</td><td>"+K.fixN(t.stop,"R.teams."+x.i+".stop",t.name+" · 수비 성공")+"</td></tr>";
  }).join("");
  $("rlog").innerHTML=r.log.length?r.log.slice(0,10).map(l=>{
    const A=T[l.a],D=T[l.d];
    if(l.ok)return "<li><span class=\"p\" style=\"--c:"+col(l.a)+"\">+"+l.v+"</span><span>"+esc(A.name)+" 공격 성공 <span class=\"x\">vs "+esc(D.name)+(l.st>1?" · "+l.st+"연속":"")+"</span></span></li>";
    return "<li><span class=\"p\" style=\"--c:"+col(l.d)+"\">"+(l.v?"+"+l.v:"STOP")+"</span><span>"+esc(D.name)+" 수비 성공 <span class=\"x\">vs "+esc(A.name)+(l.auto?" · 공격 시간 초과":"")+"</span></span></li>";
  }).join(""):"<li class=\"empty\">아직 기록이 없습니다. 시작을 누르고 공격 결과를 입력하세요.</li>";
  $("rUndo").disabled=!undoR.length;
  $("rcN").value=String(C.n);K.setVal("rcMin",C.min);K.setVal("rcShot",C.shot);$("rcAuto").checked=C.auto;K.setVal("rcStop",C.stopPts);
  const nb=$("rcNames");
  if(nb.dataset.n!==String(C.n)){nb.dataset.n=String(C.n);
    nb.innerHTML=T.slice(0,C.n).map((t,i)=>"<label>"+(i+1)+"번 <input type=\"text\" data-rname=\""+i+"\" style=\"border-color:"+col(i)+"\" maxlength=\"10\"></label>").join("");}
  nb.querySelectorAll("[data-rname]").forEach(inp=>{if(document.activeElement!==inp)inp.value=T[+inp.dataset.rname].name;});
  drawRClock();
}
function drawAll(){
  const g=S.tab==="game";
  $("gameView").hidden=!g;$("rotView").hidden=g;
  $("tabGame").setAttribute("aria-pressed",String(g));$("tabRot").setAttribute("aria-pressed",String(!g));
  K.setBrand(g?"농구 5대5":"농구 로테이션",g?"쿼터제 · 24초 · 빙고 16칸 · 빙고 미션":"3~5팀 · 성공하면 계속 공격 · 누적 점수");
  drawGame();drawRot();
}

/* ----- 이벤트 ----- */
K.fixKit($("gameView"),{get:()=>S,snap:snapG,after:()=>{save();drawGame();}});
K.fixKit($("rotView"),{get:()=>S,snap:snapR,after:()=>{save();drawRot();}});
$("tabGame").onclick=()=>{S.tab="game";save();drawAll();};
$("tabRot").onclick=()=>{S.tab="rot";save();drawAll();};
$("gGo").onclick=()=>{S.G.running?gStop():gStart();};
$("gS24").onclick=()=>gShotSet(S.G.cfg.shot);
$("gS14").onclick=()=>gShotSet(14);
$("gNextQ").onclick=gNextQ;
K.bindTime(RT,k=>k==="gt"?S.G.clock:S.R.clock,(k,v)=>{
  v=Math.max(0,Math.min(5999000,v));
  if(k==="gt"){const g=S.G;g.clock=v;if(g.qEnd&&v>0&&!g.over)g.qEnd=false;save();drawGame();}
  else{const r=S.R;r.clock=v;if(r.over&&v>0)r.over=false;save();drawRot();}
},{full:k=>{const g=S.G;return k==="gt"?(g.q>g.cfg.qn?g.cfg.ot:g.cfg.qmin)*60000:S.R.cfg.min*60000;},stop:k=>{if(k==="gt"){if(S.G.running)gStop();S.G.shot=S.G.cfg.shot*1000;$("gshotbox").classList.remove("viol");}else{if(S.R.running)rStop();S.R.shot=S.R.cfg.shot*1000;$("rshotbox").classList.remove("viol");}}});
$("gUndo").onclick=undo;$("rUndo").onclick=undo;
$("rGo").onclick=()=>{S.R.running?rStop():rStart();};
$("rSR").onclick=()=>{S.R.shot=S.R.cfg.shot*1000;$("rshotbox").classList.remove("viol");save();drawRClock();};
$("rSwap").onclick=()=>{snapR();S.R.dir=1-S.R.dir;save();drawRot();};
$("rFail").onclick=()=>rFail(false);
RT.addEventListener("click",e=>{
  const g=S.G;let b;
  if(b=e.target.closest("[data-gp]")){gPts(+b.dataset.t,+b.dataset.i,+b.dataset.gp);return;}
  if(b=e.target.closest("[data-gf]")){gFoul(+b.dataset.t,+b.dataset.i);return;}
  if(b=e.target.closest("[data-gcell]")){gCell(+b.dataset.t,+b.dataset.gcell);return;}
  if(b=e.target.closest("[data-bmode]")){const m=+b.dataset.bmode;if(m===g.cfg.mode)return;snapG();g.cfg.mode=m;g.teams.forEach((T,t)=>buildBoard(g,t,false));save();drawGame();K.toast(m===0?"기본 경기":m===1?"빙고 16칸 모드":"빙고 미션 모드","",1500);return;}
  if(b=e.target.closest("[data-gshuf]")){snapG();buildBoard(g,+b.dataset.gshuf,true);save();drawGame();K.toast(g.teams[+b.dataset.gshuf].name+" 빙고판을 새로 섞었습니다","",1600);return;}
  if(b=e.target.closest("[data-gto]")){const T=g.teams[+b.dataset.gto];snapG();if(T.to>0){T.to--;gStop();K.toast(T.name+" 타임아웃","",2400);}else T.to=2;save();drawGame();return;}
  if(b=e.target.closest("[data-gadj]")){const t=+b.dataset.gadj;if(gScore(t)<=0)return;snapG();g.teams[t].adj--;g.log.unshift({t,txt:"−1",v:-1,nl:0,bonus:0,q:g.q,adj:true});save();drawGame();return;}
  if(b=e.target.closest("[data-gclk]")){g.clock=Math.max(0,g.clock+ +b.dataset.gclk);save();drawGClock();return;}
  if(b=e.target.closest("[data-gsht]")){g.shot=Math.max(0,Math.min(g.cfg.shot*1000,g.shot+ +b.dataset.gsht));save();drawGClock();return;}
  if(b=e.target.closest("[data-rpts]")){rScore(+b.dataset.rpts);return;}
});
RT.addEventListener("input",e=>{
  const el=e.target;
  if(el.id==="gname0"||el.id==="gname1"){const t=+el.id.slice(-1);S.G.teams[t].name=el.value;save();$("gbh"+t).textContent=el.value+" 빙고";$("grh"+t).textContent=el.value+" 개인 기록";}
  else if(el.dataset.rname!==undefined){S.R.teams[+el.dataset.rname].name=el.value||RNAMES[+el.dataset.rname];save();drawRot();}
});
RT.addEventListener("change",e=>{
  const el=e.target,g=S.G;
  if(el.id==="gros0"||el.id==="gros1"){
    const t=+el.id.slice(-1),T=g.teams[t],list=K.parseList(el.value,16);
    if(!list.length){drawGame();return;}
    snapG();const changed=list.length!==T.roster.length;T.roster=list;
    if(changed&&g.cfg.mode){buildBoard(g,t,false);K.toast(T.name+" 명단 "+list.length+"명 · 빙고판을 새로 만들었습니다","",2200);}
    save();drawGame();
  }else if(el.id==="gmis"){
    const list=el.value.split(/\n/).map(s=>s.trim()).filter(Boolean);
    if(!list.length){drawGame();return;}
    snapG();g.missions=list;if(g.cfg.mode===2){g.teams.forEach((T,t)=>buildBoard(g,t,false));K.toast("미션을 바꿔 빙고판을 새로 만들었습니다","",2000);}
    save();drawGame();
  }else if(["gcQmin","gcQn","gcOt","gcShot","gcBonusAt","gcBingo"].includes(el.id)){
    const C=g.cfg,oq=C.qmin,os=C.shot;
    C.qmin=Math.max(1,Math.min(20,+$("gcQmin").value||7));C.qn=+$("gcQn").value||4;C.ot=Math.max(1,Math.min(10,+$("gcOt").value||3));
    C.shot=Math.max(5,Math.min(40,+$("gcShot").value||24));C.bonusAt=Math.max(2,Math.min(10,+$("gcBonusAt").value||5));
    C.bingo=Math.max(0,Math.min(30,+$("gcBingo").value||0));
    if(!g.running){if(oq!==C.qmin&&g.q===1&&!g.log.length)g.clock=C.qmin*60000;if(os!==C.shot)g.shot=C.shot*1000;}
    save();drawGame();
  }else if(["rcN","rcMin","rcShot","rcAuto","rcStop"].includes(el.id)){
    const r=S.R,C=r.cfg,on=C.n,om=C.min,os=C.shot;
    C.n=+$("rcN").value||5;C.min=Math.max(1,Math.min(40,+$("rcMin").value||10));C.shot=Math.max(5,Math.min(40,+$("rcShot").value||20));
    C.auto=$("rcAuto").checked;C.stopPts=Math.max(0,Math.min(5,+$("rcStop").value||0));
    if(on!==C.n){const names=r.teams.map(t=>t.name);S.R=rFresh(C,names);undoR=[];K.toast(C.n+"팀 로테이션으로 새로 배치했습니다","",2000);}
    else if(!r.running){if(om!==C.min&&!r.log.length)r.clock=C.min*60000;if(os!==C.shot)r.shot=C.shot*1000;}
    save();drawRot();
  }
});
K.arm($("gNew"),"새 경기",()=>{const g=S.G;S.G=gFresh(g.cfg,g.teams.map(T=>({name:T.name,roster:T.roster})),g.missions);undoG=[];K.closeModal();save();drawGame();K.toast("새 경기 준비 완료 (팀 이름·명단·미션 유지)","",2000);});
K.arm($("rNew"),"새 경기",()=>{const r=S.R;S.R=rFresh(r.cfg,r.teams.map(t=>t.name));undoR=[];K.closeModal();save();drawRot();K.toast("새 로테이션 경기 준비 완료","",2000);});

drawAll();
return{
  record:()=>S.tab==="game"?gRec():rRec(),
  tick(dt,now){
    const g=S.G,r=S.R;
    if(g.running){
      const ps=g.shot;g.clock=Math.max(0,g.clock-dt);g.shot=Math.max(0,g.shot-dt);
      if(g.clock<=0)gTimeUp();
      else if(ps>0&&g.shot<=0){K.snd.buzzer();$("gshotbox").classList.add("viol");K.toast("공격 제한 시간 위반 · 경기 시간은 계속 흘러요","bad",2400);}
    }
    if(r.running){
      const ps=r.shot;r.clock=Math.max(0,r.clock-dt);r.shot=Math.max(0,r.shot-dt);
      if(r.clock<=0){r.running=false;r.over=true;K.snd.horn();K.wake(false);save();drawRot();rModal();}
      else if(ps>0&&r.shot<=0){K.snd.buzzer();if(r.cfg.auto)rFail(true);else{$("rshotbox").classList.add("viol");K.toast("공격 시간 초과 · 경기 시간은 계속 흘러요","bad",2400);}}
    }
    if((g.running||r.running)&&now-lastSave>1000){save();lastSave=now;}
    if(S.tab==="game")drawGClock();else drawRClock();
  },
  key(e){
    const k=e.key.toLowerCase();
    if(e.code==="Space"){e.preventDefault();if(S.tab==="game")S.G.running?gStop():gStart();else S.R.running?rStop():rStart();}
    else if(k==="z")undo();
    else if(S.tab==="game"){if(k==="r")gShotSet(S.G.cfg.shot);else if(k==="t")gShotSet(14);}
    else{if(k==="2"||k==="3"||k==="1")rScore(+k);else if(k==="x")rFail(false);}
  },
  destroy(){S.G.running=false;S.R.running=false;save();}
};
}};
