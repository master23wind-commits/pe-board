/* ================= 피구 ================= */
MODS.dodge={name:"피구",sub:"내야 인원 · 아웃/부활 · 라운드제 · 왕 피구",color:"var(--c-dg)",
html:`
<div class="modebar op">
  <label class="sw" style="--sc:var(--t3)"><input type="checkbox" id="modeKing"><span class="knob"></span>왕 피구</label>
  <span class="hint" id="kingHint"></span>
</div>
<div class="board" id="dboard">
  <section class="team" data-t="0">
    <input class="tname" id="tname0" aria-label="팀 이름">
    <div class="lbl">내야</div>
    <div class="alive" id="alive0">0<small>명</small></div>
    <div class="tmeta">
      <div class="stat"><b id="outs0">0</b><span>외야</span></div>
      <div class="stat"><div class="dots" id="wins0"></div><span>이긴 라운드</span></div>
    </div>
    <div class="pills"><span class="pill kingpill" id="kp0"></span></div>
    <div class="btnrow op kingctl"><button class="small" type="button" data-kdraw="0">왕 랜덤 뽑기</button><button class="small" type="button" data-kpick="0">왕 직접 지정</button></div>
  </section>
  <section class="center">
    <div class="qtr" id="rno">1라운드</div>
    <div class="clock" id="clock">5:00</div>
    ${K.timeCtl("dt")}
    <div class="state" id="state">대기 중</div>
    <div class="btnrow op">
      <button class="go" id="goBtn" type="button">시작</button>
      <button class="small" id="undoBtn" type="button">되돌리기</button>
    </div>
    <div class="hist" id="hist"></div>
  </section>
  <section class="team" data-t="1">
    <input class="tname" id="tname1" aria-label="팀 이름">
    <div class="lbl">내야</div>
    <div class="alive" id="alive1">0<small>명</small></div>
    <div class="tmeta">
      <div class="stat"><b id="outs1">0</b><span>외야</span></div>
      <div class="stat"><div class="dots" id="wins1"></div><span>이긴 라운드</span></div>
    </div>
    <div class="pills"><span class="pill kingpill" id="kp1"></span></div>
    <div class="btnrow op kingctl"><button class="small" type="button" data-kdraw="1">왕 랜덤 뽑기</button><button class="small" type="button" data-kpick="1">왕 직접 지정</button></div>
  </section>
</div>
<div class="rosters" id="drosters">
  <div class="roster" data-t="0"><h3 id="rh0">홍팀</h3><div class="pickhint op" id="ph0" hidden>왕으로 정할 학생 이름을 누르세요</div><div class="chipgrid" id="c0"></div><form class="addp op" data-addf="0"><input id="add0" placeholder="이름 넣고 Enter (여러 명은 쉼표로)" aria-label="선수 추가" maxlength="60"><button type="submit" class="small">+ 추가</button></form></div>
  <div class="roster" data-t="1"><h3 id="rh1">청팀</h3><div class="pickhint op" id="ph1" hidden>왕으로 정할 학생 이름을 누르세요</div><div class="chipgrid" id="c1"></div><form class="addp op" data-addf="1"><input id="add1" placeholder="이름 넣고 Enter (여러 명은 쉼표로)" aria-label="선수 추가" maxlength="60"><button type="submit" class="small">+ 추가</button></form></div>
</div>
<div class="bgk" id="dgBingo"></div>
<div class="lower">
  <div class="box"><h4>경기 기록</h4><ul class="log" id="log"></ul></div>
  <div class="box op">
    <h4>경기 설정</h4>
    <div class="cfg">
      <div class="cfgrow">
        <label>라운드 시간(분) <input id="cfgMin" type="number" min="1" max="20"></label>
        <label>라운드 수 <select id="cfgRounds"><option value="1">단판</option><option value="3">3라운드(2선승)</option><option value="5">5라운드(3선승)</option></select></label>
      </div>
      <div class="cfgrow" id="kingCfg">
        <label><input id="cfgSecret" type="checkbox"> 왕을 비밀로 (관람 모드 화면에서 숨김)</label>
        <label><input id="cfgRedraw" type="checkbox"> 라운드마다 왕 새로 뽑기</label>
      </div>
      <div class="names">
        <div><div class="nh"><span id="nl0">홍팀 명단</span></div><textarea id="ros0" aria-label="홍팀 명단"></textarea></div>
        <div><div class="nh"><span id="nl1">청팀 명단</span></div><textarea id="ros1" aria-label="청팀 명단"></textarea></div>
      </div>
      <div class="keys">선수 이름을 누르면 아웃(외야로), 한 번 더 누르면 부활(내야로)입니다. 외야 선수가 상대를 맞혀 다시 들어오면 그 이름을 눌러 부활시키세요.<br>
        내야가 0명이 되면 라운드가 바로 끝나고, 시간이 다 되면 내야 인원이 많은 팀이 이깁니다. 명단은 한 줄에 한 명, 팀당 최대 60명까지 넣을 수 있어 규정보다 많은 인원으로도 할 수 있어요. 이름을 넣는 대로 이름 칸이 바로 늘어나고, 경기 중에도 이름 칸 아래 '+ 추가'로 선수를 더할 수 있어요(새 선수는 내야에서 시작). 처음 이름은 예시예요.<br>
        왕 피구: 팀마다 왕을 한 명 정하고, 왕이 아웃되면 그 팀은 그 자리에서 라운드를 집니다. 왕을 정하지 않고 시작을 누르면 자동으로 랜덤하게 뽑습니다.<br>
        <kbd>Space</kbd> 시작/정지 · <kbd>Z</kbd> 되돌리기</div>
      <div><button class="danger" id="newBtn" type="button">새 경기</button></div>
    </div>
  </div>
</div>`,
init(ctx){
const $=K.$,R=ctx.root,KEY="pe-dodge",esc=K.esc;
const MAXP=60;
function mkTeam(name,roster){return{name,roster:roster.slice(0,MAXP),out:Array(roster.length).fill(0),wins:0,king:-1};}
function setRoster(t,list){
  // 이름이 같은 선수는 아웃 상태·왕을 그대로 유지
  const T=S.teams[t],old=T.roster,oldOut=T.out,kn=T.king>=0?old[T.king]:null;
  const used=new Set();
  T.out=list.map(n=>{const j=old.findIndex((o,k)=>o===n&&!used.has(k));if(j<0)return 0;used.add(j);return oldOut[j]||0;});
  T.roster=list;T.king=kn!=null?list.indexOf(kn):-1;
}
function fitTA(el){if(!el)return;el.style.height="auto";el.style.height=Math.max(el.scrollHeight+2,0)+"px";}
function fresh(cfg,keep){
  cfg=cfg||{min:5,rounds:3,king:false,secret:false,redraw:false};
  const k=keep||[{name:"홍팀",roster:K.EX10[0]},{name:"청팀",roster:K.EX10[1]}];
  return{cfg,teams:k.map(x=>mkTeam(x.name,x.roster)),round:1,clock:cfg.min*60000,running:false,roundOver:null,over:null,hist:[],log:[]};
}
let S=K.load(KEY);if(!S||!S.teams)S=fresh();S.running=false;
S.teams.forEach(T=>{if(T.king===undefined)T.king=-1;});
let undoStack=[],lastSave=0,fresh1=null,pickFor=-1,drawing=false;
const save=()=>K.save(KEY,S);
const BG=K.bingoKit({el:$("dgBingo"),key:"dodge",get:()=>S,teams:()=>S.teams.map((T,t)=>({name:T.name,color:t?"var(--blue)":"var(--red)",roster:T.roster})),
  missions:["공 잡아내기","외야에서 맞혀 부활","한 라운드 끝까지 생존","친구에게 패스해서 아웃","2명 연속 아웃","왕 지키기 성공","몸 낮춰 피하기 3번","얼굴 안 맞히기 약속 지키기"],bonusDef:1,unit:"명 부활",
  hint:"외야 학생이 상대를 맞혀 부활하면 그 칸이 채워지고(상대를 맞힌 내야 학생은 칸을 눌러요)",bonusText:n=>"외야 "+n+"명 부활!",
  apply:(t,p)=>{if(p<=0)return;const T=S.teams[t];let k=p;for(let j=0;j<T.roster.length&&k>0;j++){if(T.out[j]){T.out[j]=0;k--;S.log.unshift({t,who:T.roster[j],out:false,king:false,a:[alive(0),alive(1)],r:S.round,bg:true});}}},
  snap:()=>snap(),after:()=>{save();draw();}});
function snap(){undoStack.push(JSON.stringify(Object.assign({},S,{running:false})));if(undoStack.length>200)undoStack.shift();}
function undo(){if(!undoStack.length)return;const keep={clock:S.clock,running:S.running};S=Object.assign(JSON.parse(undoStack.pop()),keep);K.closeModal();save();draw();K.toast("되돌렸습니다","",1200);}
const alive=t=>{const T=S.teams[t];return T.roster.length-T.roster.reduce((a,_,i)=>a+(T.out[i]?1:0),0);};
const need=()=>Math.ceil(S.cfg.rounds/2);
const kingName=t=>{const T=S.teams[t];return T.king>=0&&T.king<T.roster.length?T.roster[T.king]:null;};

function toggle(t,i){
  if(drawing)return;
  const T=S.teams[t];
  if(pickFor===t){
    if(T.out[i]){K.toast("외야 선수는 왕이 될 수 없어요. 내야 선수를 고르세요","bad",2000);return;}
    snap();T.king=i;pickFor=-1;save();draw();K.snd.bonus();K.toast(T.name+" 왕: "+T.roster[i],"bingo",2000);return;
  }
  if(S.roundOver||S.over)return;snap();
  T.out[i]=T.out[i]?0:1;
  if(!T.out[i])BG.hit(t,i);
  const kingOut=S.cfg.king&&T.king===i&&T.out[i];
  S.log.unshift({t,who:T.roster[i],out:!!T.out[i],king:kingOut,a:[alive(0),alive(1)],r:S.round});if(S.log.length>80)S.log.pop();
  fresh1={t,i};
  save();draw();
  {const ch=R.querySelector("#c"+t+" [data-chip='"+i+"']");if(ch)K.fx.play(T.out[i]?"out":"revive",ch);}
  if(kingOut){K.snd.boom();K.toast(T.name+"의 왕 "+T.roster[i]+" 아웃!","bad",3000);roundWon(1-t,T.name+" 왕 아웃");return;}
  if(T.out[i])K.snd.stop();else{K.snd.chime();K.toast(T.roster[i]+" 부활!","bingo",1500);}
  const a=alive(t);
  if(a===0){roundWon(1-t,"상대 내야 전원 아웃");return;}
  if(a===1&&T.out[i]){const last=T.roster.find((n,j)=>!T.out[j]);K.toast(T.name+" 마지막 생존자: "+last+"!","",2600);}
}
function roundWon(w,reason){
  S.running=false;K.wake(false);
  S.roundOver={w,reason};
  if(w>=0){S.teams[w].wins++;if(S.teams[w].wins>=need())S.over={w};}
  S.hist.push({w,a:[alive(0),alive(1)],king:/왕/.test(reason)});
  save();draw();setTimeout(K.snd.horn,/왕/.test(reason)?700:0);
  const T=S.teams;
  K.modal({sub:reason+" · 내야 "+alive(0)+" : "+alive(1),title:w<0?"무승부":S.over?T[w].name+" 경기 승리":T[w].name+" "+S.round+"라운드 승리",color:w<0?"var(--fg)":w?"var(--blue)":"var(--red)",
    score:S.cfg.rounds>1?T[0].wins+" : "+T[1].wins:"",
    stats:S.cfg.king?"<div style=\"color:var(--muted)\">왕: "+T.map(x=>esc(x.name)+" "+esc(x.king>=0?x.roster[x.king]:"없음")).join(" · ")+"</div>":"",
    buttons:[{label:"되돌리기",fn:undo},{label:S.over?"새 경기":"다음 라운드",cls:"go",fn:S.over?newGame:nextRound}]});
  ctx.store(makeRec(),!S.over);
}
function timeUp(){
  const a=alive(0),b=alive(1);
  if(a===b){S.running=false;K.wake(false);K.snd.horn();save();draw();
    K.modal({sub:"시간 종료 · 내야 "+a+" : "+b,title:"동점",color:"var(--amber)",stats:"<div>1분 연장해서 먼저 맞히는 팀이 이기게 하거나, 무승부로 넘어갈 수 있어요.</div>",
      buttons:[{label:"1분 연장",cls:"go",fn:()=>{S.clock=60000;save();draw();}},{label:"무승부로 처리",fn:()=>roundWon(-1,"시간 종료 · 동점")}]});
  }else roundWon(a>b?0:1,"시간 종료");
}
function nextRound(){
  S.round++;S.roundOver=null;S.clock=S.cfg.min*60000;
  S.teams.forEach(T=>{T.out=Array(T.roster.length).fill(0);if(S.cfg.redraw)T.king=-1;});
  undoStack=[];save();draw();
  K.toast(S.round+"라운드 · 모두 내야로 들어갑니다"+(S.cfg.king&&S.cfg.redraw?" · 왕을 새로 뽑으세요":""),"",2400);
}
function newGame(){BG.reset();S=fresh(S.cfg,S.teams.map(T=>({name:T.name,roster:T.roster})));undoStack=[];K.closeModal();save();draw();K.toast("새 경기 준비 완료 (팀 이름·명단 유지)","",1800);}
function inside(t){const T=S.teams[t];return T.roster.map((n,i)=>i).filter(i=>!T.out[i]);}
function drawKing(t,quick){
  const T=S.teams[t],c=inside(t);if(!c.length)return;
  const pick=c[Math.floor(Math.random()*c.length)];
  if(quick){T.king=pick;return;}
  snap();drawing=true;pickFor=-1;
  let n=0;const steps=14;
  const spin=()=>{
    if(!R.isConnected){drawing=false;return;}
    const grid=$("c"+t);if(!grid){drawing=false;return;}
    grid.querySelectorAll(".pchip").forEach(el=>el.classList.remove("spin"));
    if(n<steps){const i=c[Math.floor(Math.random()*c.length)];const el=grid.querySelector("[data-chip='"+i+"']");if(el)el.classList.add("spin");K.snd.tick(n);n++;setTimeout(spin,60+n*12);}
    else{drawing=false;T.king=pick;save();draw();K.snd.fanfare();
      K.toast(S.cfg.secret?T.name+" 왕을 뽑았습니다 (비밀)":T.name+" 왕: "+T.roster[pick],"bingo",2400);}
  };
  spin();
}
function start(){
  if(S.roundOver||S.over||S.clock<=0)return;
  if(S.cfg.king){
    const miss=[0,1].filter(t=>S.teams[t].king<0||S.teams[t].out[S.teams[t].king]||S.teams[t].king>=S.teams[t].roster.length);
    if(miss.length){snap();miss.forEach(t=>drawKing(t,true));save();draw();K.toast(miss.map(t=>S.teams[t].name).join(", ")+" 왕을 랜덤으로 뽑았습니다"+(S.cfg.secret?" (비밀)":""),"bingo",2400);}
  }
  pickFor=-1;S.running=true;K.wake(true);draw();K.snd.whistle(1);
}
function stop(){S.running=false;K.wake(false);save();drawClock();}
function makeRec(){
  if(!S.mid)S.mid=K.newId();
  const T=S.teams,d=S.hist.map((h,i)=>(i+1)+"라운드 "+(h.w<0?"무승부":T[h.w].name+" 승"+(h.king?" (왕 아웃)":""))+" · 남은 내야 "+h.a[0]+":"+h.a[1]);
  if(BG.summary())d.push(BG.summary());
  if(S.cfg.king)d.unshift("왕 피구 · "+T.map(t=>t.name+" 왕 "+(t.king>=0?t.roster[t.king]:"없음")).join(", "));
  return{id:S.mid,sport:"dodge",sportName:"피구",at:Date.now(),done:!!S.over,
    teams:T.map(t=>({name:t.name,score:t.wins})),winner:S.over?T[S.over.w].name:null,
    summary:T[0].wins+" : "+T[1].wins+(S.hist.length?" ("+S.hist.map(h=>h.w<0?"무":h.a[0]+":"+h.a[1]).join(", ")+")":""),
    details:d,players:[]};
}

function drawClock(){
  $("rno").textContent=S.cfg.rounds>1?S.round+"라운드":"단판";
  const c=$("clock");c.textContent=K.fmt(S.clock);c.className="clock"+(S.clock<30000?" low":"");
  if(!S.running)K.fillTime("dt",S.clock);
  const g=$("goBtn");g.textContent=S.running?"정지":"시작";g.classList.toggle("run",S.running);
  const st=$("state");st.textContent=S.over?"경기 종료":S.roundOver?"라운드 종료":S.running?"경기 진행 중":"정지";st.classList.toggle("live",S.running);
}
function draw(){
  const K1=S.cfg.king;BG.draw();
  $("modeKing").checked=K1;
  $("kingHint").textContent=K1?"왕이 아웃되면 그 팀은 바로 라운드 패배":"";
  $("kingCfg").hidden=!K1;
  R.classList.toggle("kingsecret",K1&&S.cfg.secret);
  R.querySelectorAll(".kingctl").forEach(el=>el.hidden=!K1);
  [0,1].forEach(t=>{
    const T=S.teams[t],n=T.roster.length,a=alive(t);
    K.setVal("tname"+t,T.name);
    const al=$("alive"+t);al.innerHTML=a+"<small>명</small>";al.classList.toggle("last",a<=1);
    $("outs"+t).textContent=n-a;
    $("wins"+t).innerHTML=Array.from({length:need()},(_,i)=>"<i"+(i<T.wins?"":" class=\"off\"")+"></i>").join("");
    $("rh"+t).textContent=T.name+" · 내야 "+a+" / 외야 "+(n-a);
    $("nl"+t).textContent=T.name+" 명단 ("+n+"명)";
    const kp=$("kp"+t),kn=kingName(t);
    kp.hidden=!K1;
    kp.className="pill kingpill"+(kn?" on":"");
    kp.innerHTML=kn?"<span class=\"kn\">♛ 왕 "+esc(kn)+"</span><span class=\"ks\">♛ 왕은 비밀</span>":"♛ 왕 미정";
    $("ph"+t).hidden=pickFor!==t;
    R.querySelector("[data-kpick='"+t+"']").textContent=pickFor===t?"지정 취소":"왕 직접 지정";
    $("c"+t).classList.toggle("picking",pickFor===t);
    $("c"+t).innerHTML=T.roster.map((nm,i)=>"<button type=\"button\" class=\"pchip"+(T.out[i]?" out":"")+(K1&&T.king===i?" king":"")+(fresh1&&fresh1.t===t&&fresh1.i===i?" fresh":"")+"\" data-chip=\""+i+"\" data-t=\""+t+"\" aria-pressed=\""+(T.out[i]?"true":"false")+"\">"+esc(nm)+"</button>").join("");
    K.setVal("ros"+t,T.roster.join("\n"));fitTA($("ros"+t));
  });
  fresh1=null;
  $("hist").innerHTML=S.hist.map((h,i)=>"<span>"+(i+1)+"R <b class=\"w"+h.w+"\">"+(h.w<0?"무":(h.king?"♛ ":"")+h.a[0]+":"+h.a[1])+"</b></span>").join("");
  $("log").innerHTML=S.log.length?S.log.slice(0,12).map(l=>{
    const T=S.teams[l.t],col=l.t?"var(--blue)":"var(--red)";
    return "<li><span class=\"p\" style=\"--c:"+col+"\">"+(l.king?"♛":l.out?"OUT":"IN")+"</span><span>"+esc(T.name)+" "+esc(l.who)+" "+(l.king?"<b>왕 아웃</b>":l.out?"아웃":"<b>부활</b>")+" <span class=\"x\">· 내야 "+l.a[0]+":"+l.a[1]+" · "+l.r+"R</span></span></li>";
  }).join(""):"<li class=\"empty\">아직 기록이 없습니다. 맞은 선수의 이름을 누르면 아웃으로 기록됩니다.</li>";
  $("undoBtn").disabled=!undoStack.length;
  K.setVal("cfgMin",S.cfg.min);$("cfgRounds").value=String(S.cfg.rounds);
  $("cfgSecret").checked=!!S.cfg.secret;$("cfgRedraw").checked=!!S.cfg.redraw;
  drawClock();
}

$("goBtn").onclick=()=>{S.running?stop():start();};
K.bindTime(R,()=>S.clock,(k,v)=>{S.clock=Math.max(0,Math.min(5999000,v));save();drawClock();},{full:()=>S.cfg.min*60000,stop:()=>stop()});
$("undoBtn").onclick=undo;
$("modeKing").onchange=e=>{S.cfg.king=e.target.checked;pickFor=-1;save();draw();K.toast(S.cfg.king?"왕 피구 모드 · 팀마다 왕을 정하세요":"일반 피구로 돌아갑니다","",2000);};
K.arm($("newBtn"),"새 경기",newGame);
R.addEventListener("click",e=>{
  let b;
  if(b=e.target.closest("[data-chip]")){toggle(+b.dataset.t,+b.dataset.chip);return;}
  if(b=e.target.closest("[data-kdraw]")){if(drawing)return;const t=+b.dataset.kdraw;if(!inside(t).length){K.toast("내야에 선수가 없습니다","bad",1600);return;}drawKing(t,false);return;}
  if(b=e.target.closest("[data-kpick]")){if(drawing)return;const t=+b.dataset.kpick;pickFor=pickFor===t?-1:t;draw();return;}
  if(b=e.target.closest("[data-clk]")){S.clock=Math.max(0,Math.min(S.cfg.min*60000,S.clock+ +b.dataset.clk));save();drawClock();return;}
});
let rosSnap=false;
R.addEventListener("focusin",e=>{if(e.target.id==="ros0"||e.target.id==="ros1")rosSnap=false;});
R.addEventListener("input",e=>{const el=e.target;if(el.id==="tname0"||el.id==="tname1"){const t=+el.id.slice(-1);S.teams[t].name=el.value;save();return;}
  if(el.id==="ros0"||el.id==="ros1"){
    fitTA(el);
    const t=+el.id.slice(-1),list=K.parseList(el.value,MAXP);if(!list.length)return;
    if(list.join("\n")===S.teams[t].roster.join("\n"))return;
    if(!rosSnap){snap();rosSnap=true;}
    setRoster(t,list);save();draw();
    if(el.value.split(/[\n,]/).filter(x=>x.trim()).length>MAXP)K.toast("팀당 최대 "+MAXP+"명까지 넣을 수 있어요","bad",1800);
  }
});
R.addEventListener("submit",e=>{
  const f=e.target.closest("[data-addf]");if(!f)return;e.preventDefault();
  const t=+f.dataset.addf,inp=$("add"+t),names=K.parseList(inp.value,MAXP);if(!names.length)return;
  const T=S.teams[t],room=MAXP-T.roster.length;
  if(room<=0){K.toast("팀당 최대 "+MAXP+"명까지예요","bad",1800);return;}
  snap();const add=names.slice(0,room);setRoster(t,T.roster.concat(add));
  fresh1={t,i:T.roster.length-1};inp.value="";save();draw();inp.focus();
  K.toast(T.name+" "+add.join(", ")+" 추가 · 이제 "+T.roster.length+"명","",1600);
});
R.addEventListener("change",e=>{
  const el=e.target;
  if(el.id==="ros0"||el.id==="ros1"){const t=+el.id.slice(-1),list=K.parseList(el.value,MAXP);if(!list.length){draw();return;}if(list.join("\n")!==S.teams[t].roster.join("\n")){if(!rosSnap)snap();setRoster(t,list);}rosSnap=false;save();draw();}
  else if(el.id==="cfgMin"||el.id==="cfgRounds"){
    const om=S.cfg.min;S.cfg.min=Math.max(1,Math.min(20,+$("cfgMin").value||5));S.cfg.rounds=+$("cfgRounds").value||3;
    if(!S.running&&om!==S.cfg.min&&S.clock===om*60000)S.clock=S.cfg.min*60000;
    save();draw();
  }
  else if(el.id==="cfgSecret"||el.id==="cfgRedraw"){S.cfg.secret=$("cfgSecret").checked;S.cfg.redraw=$("cfgRedraw").checked;save();draw();}
});
draw();
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
    if(e.code==="Space"){e.preventDefault();S.running?stop():start();}
    else if(e.key==="z"||e.key==="Z")undo();
  },
  destroy(){if(S.running){S.running=false;save();}}
};
}};
