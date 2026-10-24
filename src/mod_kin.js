/* ================= 킨볼 ================= */
MODS.kin={name:"킨볼",sub:"3팀 동시 경기 · 옴니킨 콜 · 반칙하면 다른 두 팀 +1",color:"var(--c-kb)",
html:`
<div class="kteams" id="kteams"></div>
<section class="center kcenter">
  <div class="qtr" id="kper">1피리어드</div>
  <div class="hist" id="khist"></div>
  <div id="ktimer" class="kclock">
    <div class="clock" id="kclock">7:00</div>
    ${K.timeCtl("kt")}
    <div class="btnrow op"><button class="go" id="kGo" type="button">시작</button><button class="small" id="kUndo" type="button">되돌리기</button></div>
  </div>
  <div class="katk" id="katk"></div>
  <div class="kcall" id="kcallShow"></div>
  <div class="op kops">
    <div class="lbl">1. 공격팀이 부른 색 (옴니킨 콜)</div>
    <div class="btnrow" id="kcalls"></div>
    <div class="lbl">2. 결과</div>
    <div class="kres">
      <button class="kok" id="kCatch" type="button">잡았다<small>공을 땅에 닿기 전에 받음 · 공격권 넘어감</small></button>
      <button class="kmiss" id="kMiss" type="button">놓쳤다<small>땅에 닿음 · 다른 두 팀 +1</small></button>
    </div>
    <div class="lbl">공격팀 반칙 · 다른 두 팀 +1, 공격팀이 다시 공격</div>
    <div class="btnrow" id="kfouls"></div>
    <div class="btnrow"><button class="small" id="kUndo2" type="button">되돌리기</button></div>
  </div>
</section>
<div class="bgk" id="kbBingo"></div>
<div class="lower">
  <div class="box"><h4>경기 기록</h4><ul class="log" id="klog"></ul></div>
  <div class="box op">
    <h4>경기 설정</h4>
    <div class="cfg">
      <div class="cfgrow">
        <label>피리어드 승리 점수 <input id="kcTarget" type="number" min="3" max="50"></label>
        <label>피리어드 <select id="kcWin"><option value="1">단판</option><option value="2">2피리어드 먼저 이기면 승리</option><option value="3">3피리어드 먼저 이기면 승리</option></select></label>
      </div>
      <div class="cfgrow">
        <label><input id="kcElim" type="checkbox"> 한 팀이 <input id="kcElimAt" type="number" min="2" max="49"> 점이 되면 최하위 팀 제외</label>
      </div>
      <div class="cfgrow">
        <label><input id="kcTimer" type="checkbox"> 피리어드 시간 사용</label>
        <label><input id="kcMin" type="number" min="1" max="30"> 분</label>
      </div>
      <div class="cfgrow" id="kcTeams"></div>
      <div class="keys">공격팀은 "옴니킨, ○○!"처럼 받을 팀의 색을 부르고 공을 칩니다. 불린 팀이 땅에 닿기 전에 잡으면 그 팀이 다음 공격팀이 되고, 놓치면 나머지 두 팀이 1점씩 얻습니다. 반칙한 팀도 나머지 두 팀에 1점씩 주고, 반칙한 팀이 공을 받아 다시 시작합니다.<br>
        기본값은 국제 규칙 요약(9점에서 최하위 팀 제외, 11점 승리)을 따랐습니다. 수업에 맞게 바꿔 쓰세요.<br>
        <kbd>Space</kbd> 시계 시작/정지 · <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> 콜 팀 고르기 · <kbd>C</kbd> 잡았다 · <kbd>X</kbd> 놓쳤다 · <kbd>Z</kbd> 되돌리기</div>
      <div><button class="danger" id="kNew" type="button">새 경기</button></div>
    </div>
  </div>
</div>`,
init(ctx){
const $=K.$,R=ctx.root,KEY="pe-kin",esc=K.esc;
const PAL={pink:{n:"분홍",c:"#ff6fae"},gray:{n:"회색",c:"#aeb8c7"},black:{n:"검정",c:"#111111"},blue:{n:"파랑",c:"#38aefc"},green:{n:"초록",c:"#4ade80"},yellow:{n:"노랑",c:"#ffd23a"},orange:{n:"주황",c:"#ff8a3d"}};
const FOULS=["라인 밖","콜 실수","아래로 침","전원 터치 안 함","1.8m 안에서 침","공 들고 이동","방해"];
function mkTeam(col){return{name:PAL[col].n+"팀",col,score:0,periods:0,catches:0,fouls:0};}
function fresh(cfg,keep){
  cfg=cfg||{target:11,elim:true,elimAt:9,win:2,timer:false,min:7};
  const T=keep?keep.map(k=>Object.assign(mkTeam(k.col),{name:k.name})):[mkTeam("pink"),mkTeam("gray"),mkTeam("black")];
  return{cfg,teams:T,active:[true,true,true],atk:0,called:-1,period:1,clock:cfg.min*60000,running:false,periodOver:null,over:null,hist:[],log:[]};
}
let S=K.load(KEY);if(!S||!S.teams)S=fresh();S.running=false;
let undoStack=[],lastSave=0,bumpT=-1;
const save=()=>K.save(KEY,S);
K.fixKit(R,{get:()=>S,snap:()=>snap(),after:()=>{save();draw();}});
const BG=K.bingoKit({el:$("kbBingo"),key:"kin",get:()=>S,teams:()=>S.teams.map(x=>({name:x.name,color:x.col==="black"?"#c9d1dc":PAL[x.col].c,roster:[]})),
  missions:["다이빙 캐치","무릎 아래 캐치","팀원 4명 모두 공 터치","옴니킨 콜 크게 외치기","한 손 서브 성공","3번 연속 잡기","멀리 보내는 서브","팀원 모두 하이파이브","정확한 방향 서브","반칙 없이 2분"],
  bonusDef:1,hint:"미션을 해내면 그 칸을 눌러 채우고",
  apply:(t,p)=>{S.teams[t].score=Math.max(0,S.teams[t].score+p);S.teams[t].bg=(S.teams[t].bg||0)+p;},snap:()=>snap(),after:()=>{save();draw();if(!busy())check();}});
function snap(){undoStack.push(JSON.stringify(Object.assign({},S,{running:false})));if(undoStack.length>200)undoStack.shift();}
function undo(){if(!undoStack.length)return;const keep={clock:S.clock,running:S.running};S=Object.assign(JSON.parse(undoStack.pop()),keep);K.closeModal();save();draw();K.toast("되돌렸습니다","",1200);}
const col=t=>PAL[S.teams[t].col].c;
const isBlack=t=>S.teams[t].col==="black";
const act=()=>[0,1,2].filter(t=>S.active[t]);
const others=t=>act().filter(o=>o!==t);
const busy=()=>!!(S.periodOver||S.over);
function autoCall(){const o=others(S.atk);S.called=o.length===1?o[0]:-1;}

function fault(t,reason){
  if(busy()||!S.active[t])return;snap();
  const got=others(t);got.forEach(o=>S.teams[o].score++);
  S.teams[t].fouls++;S.atk=t;autoCall();
  S.log.unshift({k:"f",t,reason,got,sc:S.teams.map(x=>x.score),p:S.period});if(S.log.length>80)S.log.pop();
  bumpT=got;save();draw();K.snd.stop();
  got.forEach(o=>{const el=$("kteams").children[o];if(el)K.fx.play("kin",el.querySelector(".score"),{color:S.teams[o].col==="black"?"#f2f2f2":PAL[S.teams[o].col].c});});
  K.toast(S.teams[t].name+" "+reason+" · "+got.map(o=>S.teams[o].name).join(", ")+" +1","",2200);
  check();
}
function caught(){
  if(busy()||S.called<0)return;snap();
  const t=S.called;S.teams[t].catches++;
  S.log.unshift({k:"c",t,from:S.atk,p:S.period});if(S.log.length>80)S.log.pop();
  S.atk=t;autoCall();save();draw();K.snd.chime();
}
function check(){
  const T=S.teams,a=act();
  if(S.cfg.elim&&a.length===3&&a.some(t=>T[t].score>=S.cfg.elimAt)&&a.every(t=>T[t].score<S.cfg.target)){
    const low=Math.min(...a.map(t=>T[t].score)),lows=a.filter(t=>T[t].score===low);
    if(lows.length===1){eliminate(lows[0]);}
    else{K.modal({sub:S.cfg.elimAt+"점 도달 · 최하위 동점",title:"제외할 팀을 고르세요",color:"var(--amber)",stats:"<div>"+lows.map(t=>esc(T[t].name)).join(", ")+"이(가) "+low+"점으로 같습니다.</div>",
      buttons:lows.map(t=>({label:T[t].name+" 제외",fn:()=>{eliminate(t);}}))});}
    return;
  }
  const win=a.find(t=>T[t].score>=S.cfg.target);
  if(win!==undefined)periodWon(win,S.cfg.target+"점 선착");
}
function eliminate(t){
  snap();S.active[t]=false;
  if(S.atk===t){const o=act();S.atk=o.reduce((m,x)=>S.teams[x].score<S.teams[m].score?x:m,o[0]);}
  autoCall();
  S.log.unshift({k:"e",t,p:S.period});
  save();draw();K.snd.horn();K.toast(S.teams[t].name+" 제외 · 남은 두 팀이 "+S.cfg.target+"점까지 겨룹니다","bad",3200);
}
function periodWon(t,reason){
  S.running=false;K.wake(false);
  const T=S.teams;T[t].periods++;S.periodOver={w:t};
  if(T[t].periods>=S.cfg.win)S.over={w:t};
  S.hist.push({w:t,s:T.map(x=>x.score)});
  save();draw();setTimeout(K.snd.fanfare,200);
  const st=T.map(x=>"<div><b style=\"color:"+PAL[x.col].c+(x.col==="black"?";text-shadow:0 0 1px #fff":"")+"\">"+esc(x.name)+"</b> "+x.score+"점 · 잡기 "+x.catches+" · 반칙 "+x.fouls+"</div>").join("");
  K.modal({sub:reason+(S.cfg.win>1?" · 피리어드 "+T.map(x=>x.periods).join(" : "):""),title:S.over?T[t].name+" 경기 승리":T[t].name+" "+S.period+"피리어드 승리",color:isBlack(t)?"var(--fg)":col(t),
    score:T.map(x=>x.score).join(" : "),stats:st,
    buttons:[{label:"되돌리기",fn:undo},{label:S.over?"새 경기":"다음 피리어드",cls:"go",fn:S.over?newGame:nextPeriod}]});
  ctx.store(makeRec(),!S.over);
}
function nextPeriod(){
  S.period++;S.periodOver=null;S.active=[true,true,true];S.clock=S.cfg.min*60000;
  S.teams.forEach(x=>x.score=0);S.atk=(S.period-1)%3;S.called=-1;undoStack=[];
  save();draw();K.toast(S.period+"피리어드 · "+S.teams[S.atk].name+" 공격으로 시작","",2200);
}
function newGame(){BG.reset();S=fresh(S.cfg,S.teams.map(x=>({name:x.name,col:x.col})));undoStack=[];K.closeModal();save();draw();K.toast("새 경기 준비 완료","",1600);}
function timeUp(){
  S.running=false;K.wake(false);K.snd.horn();
  const a=act(),hi=Math.max(...a.map(t=>S.teams[t].score)),tops=a.filter(t=>S.teams[t].score===hi);
  if(tops.length===1)periodWon(tops[0],"시간 종료");
  else{save();draw();K.modal({sub:"시간 종료 · 공동 1위",title:"동점",color:"var(--amber)",stats:"<div>1분 연장하거나, 이긴 팀을 직접 고를 수 있어요.</div>",
    buttons:[{label:"1분 연장",cls:"go",fn:()=>{S.clock=60000;save();draw();}}].concat(tops.map(t=>({label:S.teams[t].name+" 승리",fn:()=>periodWon(t,"시간 종료 · 교사 판정")})))});}
}
function makeRec(){
  if(!S.mid)S.mid=K.newId();
  const T=S.teams;
  const d=S.hist.map((h,i)=>(i+1)+"피리어드 "+T[h.w].name+" 승 ("+h.s.join(":")+")");
  T.forEach(x=>d.push(x.name+" 잡기 성공 "+x.catches+" · 반칙 "+x.fouls));
  if(BG.summary())d.push(BG.summary());
  return{id:S.mid,sport:"kin",sportName:"킨볼",at:Date.now(),done:!!S.over,
    teams:T.map(x=>({name:x.name,score:x.periods})),winner:S.over?T[S.over.w].name:null,
    summary:T.map(x=>x.name+" "+x.periods).join(" / "),details:d,players:[]};
}

function drawClock(){
  $("ktimer").hidden=!S.cfg.timer;
  if(!S.cfg.timer)return;
  const c=$("kclock");c.textContent=K.fmt(S.clock);c.className="clock"+(S.clock<60000?" low":"");
  if(!S.running)K.fillTime("kt",S.clock);
  const g=$("kGo");g.textContent=S.running?"정지":"시작";g.classList.toggle("run",S.running);
}
function draw(){
  const T=S.teams,C=S.cfg;BG.draw();
  $("kper").innerHTML=(C.win>1?S.period+"피리어드":"단판")+"<small>"+C.target+"점"+(C.elim?" · "+C.elimAt+"점에서 최하위 제외":"")+"</small>";
  $("khist").innerHTML=S.hist.map((h,i)=>"<span>"+(i+1)+"P <b style=\"color:"+(T[h.w].col==="black"?"var(--fg)":PAL[T[h.w].col].c)+"\">"+esc(T[h.w].name)+"</b></span>").join("");
  $("kteams").innerHTML=T.map((x,t)=>{
    const c=PAL[x.col].c,blk=x.col==="black",on=S.active[t],atk=S.atk===t&&on,called=S.called===t;
    return "<section class=\"team kteam"+(on?"":" gone")+(atk?" atk":"")+(called?" called":"")+(blk?" blk":"")+"\" style=\"--tc:"+(blk?"#f2f2f2":c)+";--sw:"+c+"\">"+
      "<div class=\"ktag\">"+(on?(atk?"공격":called?"받을 팀":""):"제외")+"</div>"+
      "<div class=\"kname\"><i class=\"swatch\"></i>"+esc(x.name)+"</div>"+
      "<div class=\"score"+(Array.isArray(bumpT)&&bumpT.includes(t)?" bump":"")+"\">"+x.score+"</div>"+
      "<div class=\"tmeta\"><div class=\"stat\"><div class=\"dots\">"+Array.from({length:C.win},(_,i)=>"<i"+(i<x.periods?"":" class=\"off\"")+"></i>").join("")+"</div><span>피리어드</span></div>"+
      "<div class=\"stat\"><b>"+K.fixN(x.catches,"teams."+t+".catches",x.name+" · 잡기 성공","in")+"</b><span>잡기 성공</span></div><div class=\"stat\"><b>"+K.fixN(x.fouls,"teams."+t+".fouls",x.name+" · 반칙","in")+"</b><span>반칙</span></div></div>"+
      "<div class=\"btnrow op\">"+(on?"<button class=\"small\" type=\"button\" data-kfoul=\""+t+"\">반칙 (수비)</button><button class=\"small\" type=\"button\" data-katk=\""+t+"\">공격권 주기</button>":"")+"<button class=\"small\" type=\"button\" data-kminus=\""+t+"\">점수 −1</button></div></section>";
  }).join("");
  bumpT=-1;
  const a=S.atk;
  $("katk").innerHTML="<span class=\"lbl\">공격</span><b style=\"color:"+(isBlack(a)?"var(--fg)":col(a))+"\">"+esc(T[a].name)+"</b>";
  $("kcallShow").innerHTML=S.called>=0?"옴니킨, <b style=\"color:"+(isBlack(S.called)?"var(--fg)":col(S.called))+"\">"+esc(PAL[T[S.called].col].n)+"</b>!":"<span class=\"x\">공격팀이 받을 팀의 색을 부릅니다</span>";
  $("kcalls").innerHTML=others(a).map(t=>"<button type=\"button\" class=\"callbtn"+(S.called===t?" on":"")+(isBlack(t)?" blk":"")+"\" style=\"--c:"+col(t)+"\" data-kcall=\""+t+"\">옴니킨 "+esc(PAL[T[t].col].n)+"!</button>").join("");
  $("kCatch").disabled=S.called<0||busy();$("kMiss").disabled=S.called<0||busy();
  $("kfouls").innerHTML=FOULS.map(f=>"<button class=\"small\" type=\"button\" data-kreason=\""+esc(f)+"\">"+esc(f)+"</button>").join("");
  $("klog").innerHTML=S.log.length?S.log.slice(0,12).map(l=>{
    const tn=x=>"<b style=\"color:"+(isBlack(x)?"var(--fg)":col(x))+"\">"+esc(T[x].name)+"</b>";
    if(l.k==="c")return "<li><span class=\"p\">✓</span><span>"+tn(l.t)+" 잡기 성공 <span class=\"x\">· "+esc(T[l.from].name)+"의 공격 · "+l.p+"P</span></span></li>";
    if(l.k==="e")return "<li><span class=\"p\">OUT</span><span>"+tn(l.t)+" 제외 <span class=\"x\">· "+l.p+"P</span></span></li>";
    if(l.k==="m")return "<li><span class=\"p\">−1</span><span>"+tn(l.t)+" <span class=\"x\">점수 정정</span></span></li>";
    return "<li><span class=\"p\">+1</span><span>"+l.got.map(tn).join(", ")+" 득점 <span class=\"x\">· "+esc(T[l.t].name)+" "+esc(l.reason)+" · "+l.sc.join(":")+"</span></span></li>";
  }).join(""):"<li class=\"empty\">아직 기록이 없습니다. 콜한 팀을 고르고 잡았다/놓쳤다를 누르세요.</li>";
  $("kUndo").disabled=$("kUndo2").disabled=!undoStack.length;
  K.setVal("kcTarget",C.target);$("kcWin").value=String(C.win);$("kcElim").checked=C.elim;K.setVal("kcElimAt",C.elimAt);$("kcTimer").checked=C.timer;K.setVal("kcMin",C.min);
  const tb=$("kcTeams");
  if(!tb.dataset.built){tb.dataset.built="1";tb.innerHTML=T.map((x,t)=>"<label>"+(t+1)+"팀 <input type=\"text\" data-kname=\""+t+"\" maxlength=\"8\"> <select data-kcol=\""+t+"\" aria-label=\"팀 색\">"+Object.keys(PAL).map(k=>"<option value=\""+k+"\">"+PAL[k].n+"</option>").join("")+"</select></label>").join("");}
  tb.querySelectorAll("[data-kname]").forEach(el=>{if(document.activeElement!==el)el.value=T[+el.dataset.kname].name;});
  tb.querySelectorAll("[data-kcol]").forEach(el=>el.value=T[+el.dataset.kcol].col);
  drawClock();
}
function start(){if(busy()||S.clock<=0)return;S.running=true;K.wake(true);drawClock();K.snd.whistle(1);}
function stop(){S.running=false;K.wake(false);save();drawClock();}

$("kGo").onclick=()=>{S.running?stop():start();};
$("kUndo").onclick=undo;$("kUndo2").onclick=undo;
$("kCatch").onclick=caught;
$("kMiss").onclick=()=>{if(S.called>=0)fault(S.called,"놓침(땅에 닿음)");};
K.bindTime(R,()=>S.clock,(k,v)=>{S.clock=Math.max(0,Math.min(5999000,v));save();drawClock();},{full:()=>S.cfg.min*60000,stop:()=>stop()});
K.arm($("kNew"),"새 경기",newGame);
R.addEventListener("click",e=>{
  let b;
  if(b=e.target.closest("[data-kcall]")){if(busy())return;S.called=+b.dataset.kcall;save();draw();return;}
  if(b=e.target.closest("[data-kreason]")){fault(S.atk,b.dataset.kreason);return;}
  if(b=e.target.closest("[data-kfoul]")){fault(+b.dataset.kfoul,"수비 반칙");return;}
  if(b=e.target.closest("[data-katk]")){snap();S.atk=+b.dataset.katk;autoCall();save();draw();return;}
  if(b=e.target.closest("[data-kminus]")){const t=+b.dataset.kminus;if(S.teams[t].score<=0||busy())return;snap();S.teams[t].score--;S.log.unshift({k:"m",t,p:S.period});save();draw();return;}
});
R.addEventListener("input",e=>{const el=e.target;if(el.dataset.kname!==undefined){S.teams[+el.dataset.kname].name=el.value||PAL[S.teams[+el.dataset.kname].col].n+"팀";save();draw();}});
R.addEventListener("change",e=>{
  const el=e.target;
  if(el.dataset.kcol!==undefined){const t=+el.dataset.kcol,old=S.teams[t];const wasDefault=old.name===PAL[old.col].n+"팀";old.col=el.value;if(wasDefault)old.name=PAL[el.value].n+"팀";save();draw();return;}
  if(["kcTarget","kcWin","kcElim","kcElimAt","kcTimer","kcMin"].includes(el.id)){
    const C=S.cfg,om=C.min;
    C.target=Math.max(3,Math.min(50,+$("kcTarget").value||11));C.win=+$("kcWin").value||2;
    C.elim=$("kcElim").checked;C.elimAt=Math.max(2,Math.min(C.target-1,+$("kcElimAt").value||9));
    C.timer=$("kcTimer").checked;C.min=Math.max(1,Math.min(30,+$("kcMin").value||7));
    if(!S.running&&om!==C.min&&S.clock===om*60000)S.clock=C.min*60000;
    save();draw();
  }
});
autoCall();draw();
return{
  record:makeRec,
  tick(dt,now){
    if(!S.running)return;
    S.clock=Math.max(0,S.clock-dt);
    if(S.clock<=0){timeUp();return;}
    if(now-lastSave>1000){save();lastSave=now;}
    drawClock();
  },
  key(e){
    const k=e.key.toLowerCase();
    if(e.code==="Space"){e.preventDefault();if(S.cfg.timer)S.running?stop():start();}
    else if(k==="1"||k==="2"||k==="3"){const t=+k-1;if(!busy()&&others(S.atk).includes(t)){S.called=t;save();draw();}}
    else if(k==="c")caught();
    else if(k==="x"){if(S.called>=0)fault(S.called,"놓침(땅에 닿음)");}
    else if(k==="z")undo();
  },
  destroy(){if(S.running){S.running=false;save();}}
};
}};
