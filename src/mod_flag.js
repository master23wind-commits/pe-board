/* ================= 플래그 풋볼 ================= */
MODS.flag={name:"플래그 풋볼",sub:"터치다운 6 · 추가 득점 1/2 · 다운 4번 · 하프라인 · 빙고",color:"var(--c-ff)",
html:`
<div class="board">
  <section class="team" data-t="0">
    <input class="tname" id="fname0" aria-label="팀 이름">
    <div class="serve" id="fpos0">${K.SERVE_SVG}<span>공격 중</span></div>
    <div class="score" id="fsc0">0</div>
    <div class="tmeta"><div class="stat"><b id="ftd0">0</b><span>터치다운</span></div><div class="stat"><b id="fint0">0</b><span>가로채기</span></div><div class="stat"><b id="ffl0">0</b><span>플래그 뽑기</span></div></div>
    <div class="btnrow op"><button class="small" type="button" data-fsafe="0">세이프티 +2</button><button class="small" type="button" data-fminus="0">점수 −1</button></div>
  </section>
  <section class="center">
    <div class="qtr" id="fh">전반</div>
    <div class="clock" id="fclock">20:00</div>
    ${K.timeCtl("fc")}
    <div class="btnrow op"><button class="go" id="fGo" type="button">시작</button><button class="nextq" id="fNext" type="button" hidden>후반 시작</button></div>
    <div class="ff-pc" id="fPcWrap"><div class="shotbox" id="fpcbox"><div class="shot" id="fpc">25</div><div class="lbl" id="fpcl">공격 제한 시간</div></div>
      <div class="btnrow op"><button class="small" id="fPcA" type="button">25초</button><button class="small" id="fPcB" type="button">40초</button><button class="small" id="fSnap" type="button">스냅 · 멈춤</button></div></div>
    <div class="ff-down" id="fDown"></div>
    <div class="btnrow op ff-dbtn" id="fDbtn"></div>
    <div class="ff-pat" id="fPat" hidden></div>
    <div class="btnrow op"><button class="small" id="fUndo" type="button">되돌리기</button></div>
  </section>
  <section class="team" data-t="1">
    <input class="tname" id="fname1" aria-label="팀 이름">
    <div class="serve" id="fpos1">${K.SERVE_SVG}<span>공격 중</span></div>
    <div class="score" id="fsc1">0</div>
    <div class="tmeta"><div class="stat"><b id="ftd1">0</b><span>터치다운</span></div><div class="stat"><b id="fint1">0</b><span>가로채기</span></div><div class="stat"><b id="ffl1">0</b><span>플래그 뽑기</span></div></div>
    <div class="btnrow op"><button class="small" type="button" data-fsafe="1">세이프티 +2</button><button class="small" type="button" data-fminus="1">점수 −1</button></div>
  </section>
</div>
<div class="rosters">
  <div class="roster" data-t="0"><h3 id="frh0">홍팀 선수</h3><div id="fr0"></div></div>
  <div class="roster" data-t="1"><h3 id="frh1">청팀 선수</h3><div id="fr1"></div></div>
</div>
<div class="bgk" id="ffBingo"></div>
<div class="lower">
  <div class="box"><h4>경기 기록</h4><ul class="log" id="flog"></ul></div>
  <div class="box op">
    <h4>경기 설정</h4>
    <div class="cfg">
      <div class="cfgrow">
        <label>하프 시간 <input id="fcMin" type="number" min="1" max="30">분</label>
        <label>경기 방식 <select id="fcHalves"><option value="2">전·후반</option><option value="1">단판</option></select></label>
      </div>
      <div class="cfgrow">
        <label><input id="fcPcOn" type="checkbox"> 공격 제한 시간(플레이 클락) 사용</label>
        <label>다운 사이 <input id="fcPc1" type="number" min="5" max="60">초</label>
        <label>공격권 바뀐 뒤 <input id="fcPc2" type="number" min="5" max="90">초</label>
      </div>
      <div class="names">
        <div><div class="nh"><span id="fnl0">홍팀 명단</span></div><textarea id="fros0" aria-label="홍팀 명단"></textarea></div>
        <div><div class="nh"><span id="fnl1">청팀 명단</span></div><textarea id="fros1" aria-label="청팀 명단"></textarea></div>
      </div>
      <div class="keys">플래그 풋볼은 태클 대신 허리에 찬 깃발(플래그)을 뽑으면 공을 가진 선수가 멈추는 경기예요. 국제 5대5 규칙 기준으로 정리했어요.<br>
        공격 팀은 4번의 기회(다운) 안에 하프라인을 넘어야 하고, 넘으면 다시 4번 안에 터치다운을 해야 해요. 못 하면 공격권이 넘어가요.<br>
        터치다운 6점 → 추가 득점 시도: 5야드에서 1점, 10야드에서 2점. 공격 팀이 자기 엔드존에서 플래그를 뽑히면 수비 팀 세이프티 2점.<br>
        <b>공격 제한 시간(플레이 클락)</b>: 공이 놓인 뒤 <b>25초</b> 안에 스냅해야 해요. 터치다운 추가 득점 뒤나 공격권이 바뀐 뒤에는 <b>40초</b>. 넘기면 딜레이 오브 게임 반칙이에요. "다음 다운", "하프라인 넘음"을 누르면 25초가, 공격권이 바뀌면 40초가 자동으로 시작돼요. 스냅하면 "스냅 · 멈춤"을 누르세요. 리그마다 초가 다를 수 있어 설정에서 바꿀 수 있어요.<br>
        선수 줄의 <b>TD</b>는 터치다운한 학생, <b>패스</b>는 터치다운 패스를 던진 학생, <b>플래그</b>는 수비에서 플래그를 뽑은 학생, <b>가로채기</b>는 패스를 가로챈 학생이에요.<br>
        <kbd>Space</kbd> 시계 시작/정지 · <kbd>S</kbd> 스냅(플레이 클락 멈춤) · <kbd>Z</kbd> 되돌리기</div>
      <div><button class="danger" id="fNew" type="button">새 경기</button></div>
    </div>
  </div>
</div>`,
init(ctx){
const $=K.$,R=ctx.root,KEY="pe-flag",esc=K.esc;
const TCOL=["var(--red)","var(--blue)"];
const z=n=>Array(n).fill(0);
function mkTeam(name,roster){const r=roster.slice(0,15);return{name,roster:r,td:z(15),ps:z(15),fl:z(15),it:z(15),pts:0,bg:0};}
function fresh(cfg,keep){
  cfg=Object.assign({min:15,halves:2,pcOn:true,pc1:25,pc2:40},cfg||{});
  const k=keep||[{name:"홍팀",roster:K.EX10[0].slice(0,7)},{name:"청팀",roster:K.EX10[1].slice(0,7)}];
  return{cfg,teams:k.map(x=>mkTeam(x.name,x.roster)),half:1,clock:cfg.min*60000,running:false,pc:cfg.pc1*1000,pcRun:false,hEnd:false,over:null,off:0,down:1,mid:false,pat:null,log:[]};
}
let S=K.load(KEY);if(!S||!S.teams)S=fresh();S.running=false;S.pcRun=false;
S.cfg=Object.assign({pcOn:true,pc1:25,pc2:40},S.cfg);if(S.pc==null)S.pc=S.cfg.pc1*1000;
let undoStack=[],lastSave=0;
const save=()=>K.save(KEY,S);
K.fixKit(R,{get:()=>S,snap:()=>snap(),after:()=>{save();draw();}});
function snap(){undoStack.push(JSON.stringify(Object.assign({},S,{running:false})));if(undoStack.length>250)undoStack.shift();}
function undo(){if(!undoStack.length)return;const keep={clock:S.clock,running:S.running,pc:S.pc,pcRun:S.pcRun};S=Object.assign(JSON.parse(undoStack.pop()),keep);K.closeModal();save();draw();K.toast("되돌렸습니다","",1200);}
const score=t=>S.teams[t].pts+(S.teams[t].bg||0);
const BG=K.bingoKit({el:$("ffBingo"),key:"flag",get:()=>S,teams:()=>S.teams.map((T,t)=>({name:T.name,color:TCOL[t],roster:T.roster})),
  missions:["플래그 뽑기 3번","4번째 다운에서 성공","하프라인 넘기","2점 추가 득점 성공","러닝 플레이로 터치다운","패스 3번 연속 성공","수비 4다운 막기","모두 공 한 번씩 잡기"],bonusDef:2,
  hint:"터치다운·터치다운 패스·가로채기를 한 학생 칸이 채워지고",
  apply:(t,p)=>{S.teams[t].bg=(S.teams[t].bg||0)+p;},snap:()=>snap(),after:()=>{save();draw();}});
function addLog(o){o.h=S.half;o.sc=[score(0),score(1)];S.log.unshift(o);if(S.log.length>120)S.log.pop();}
function change(reason){S.off=1-S.off;S.down=1;S.mid=false;if(reason)K.toast(reason+" · "+S.teams[S.off].name+" 공격","",2200);}
function pcStart(sec){if(!S.cfg.pcOn||S.over)return;S.pc=sec*1000;S.pcRun=true;$("fpcbox").classList.remove("viol");drawPc();}
function pcStop(){S.pcRun=false;drawPc();}
function pcOut(){S.pcRun=false;$("fpcbox").classList.add("viol");K.snd.buzzer();K.toast("공격 시간 초과! 딜레이 오브 게임 반칙 · "+S.teams[S.off].name,"",2600);drawPc();}
function drawPc(){
  const w=$("fPcWrap");w.hidden=!S.cfg.pcOn||!!S.over;if(w.hidden)return;
  const sec=Math.ceil(S.pc/1000),c=$("fpc");c.textContent=sec;c.className="shot"+(sec<=5?" low":"");
  $("fpcl").textContent=S.pcRun?"공격 제한 시간":S.pc<=0?"시간 초과":"플레이 클락 대기";
  $("fpcbox").classList.toggle("idle",!S.pcRun&&S.pc>0);
  $("fSnap").disabled=!S.pcRun;
}
function td(t,i){
  if(S.over||S.pat)return;snap();
  const T=S.teams[t];T.pts+=6;if(i>=0){T.td[i]++;BG.hit(t,i);}
  S.off=t;S.pat={t};S.pcRun=false;addLog({k:"td",t,who:i>=0?T.roster[i]:null});
  save();draw();K.bump($("fsc"+t));K.fx.play("football",$("fsc"+t),{from:$("fsc"+(1-t)),big:true,text:"터치다운!"});K.snd.fanfare();K.toast("터치다운! "+T.name+(i>=0?" · "+T.roster[i]:"")+" +6 · 추가 득점을 고르세요","bingo",2600);
}
function patRes(n,ok){
  const t=S.pat.t,T=S.teams[t];snap();
  if(ok){T.pts+=n;K.snd.swish();}else K.snd.stop();
  addLog({k:"pat",t,n,ok});S.pat=null;change();pcStart(S.cfg.pc2);
  save();draw();if(ok)K.fx.play("football",$("fsc"+t),{from:$("fsc"+(1-t)),text:"+"+n});K.toast(T.name+" 추가 득점 "+n+"점 "+(ok?"성공!":"실패")+" · "+S.teams[S.off].name+" 공격","",2200);
}
function hUp(){
  S.running=false;S.pcRun=false;K.wake(false);K.snd.horn();
  if(S.half>=S.cfg.halves){const a=score(0),b=score(1);finish(a>b?0:b>a?1:-1);return;}
  S.hEnd=true;save();draw();K.toast("전반 종료","",2400);
}
function nextHalf(){S.half++;S.hEnd=false;S.clock=S.cfg.min*60000;S.off=1;S.down=1;S.mid=false;S.pat=null;undoStack=[];save();draw();pcStart(S.cfg.pc2);K.toast("후반 · "+S.teams[1].name+" 공격으로 시작","",2200);}
function finish(w){
  S.over={w};S.running=false;S.pcRun=false;save();draw();setTimeout(K.snd.fanfare,300);
  const T=S.teams;let st="";
  [0,1].forEach(t=>{const x=T[t],a=x.roster.map((n,i)=>x.td[i]?n+" TD "+x.td[i]:null).filter(Boolean);st+="<div>"+esc(x.name)+(a.length?" · <b>"+esc(a.join(", "))+"</b>":"")+" · 가로채기 "+x.it.reduce((p,q)=>p+q,0)+" · 플래그 "+x.fl.reduce((p,q)=>p+q,0)+"</div>";});
  K.modal({sub:"경기 종료",title:w<0?"무승부":T[w].name+" 승리",color:w<0?"var(--fg)":TCOL[w],score:score(0)+" : "+score(1),stats:st,buttons:[{label:"되돌리기",fn:undo},{label:"닫기"}]});
  ctx.store(makeRec());
}
function makeRec(){
  if(!S.rid)S.rid=K.newId();
  const T=S.teams,d=[];
  S.log.slice().reverse().forEach(l=>{if(l.k==="td")d.push((l.h===1?"전반":"후반")+" "+T[l.t].name+" 터치다운"+(l.who?" "+l.who:""));else if(l.k==="pat"&&l.ok)d.push(T[l.t].name+" 추가 득점 "+l.n+"점");else if(l.k==="sf")d.push(T[l.t].name+" 세이프티 2점");});
  if(BG.summary())d.push(BG.summary());
  return{id:S.rid,sport:"flag",sportName:"플래그 풋볼",at:Date.now(),done:!!S.over,
    teams:T.map((x,t)=>({name:x.name,score:score(t)})),winner:S.over?(S.over.w<0?"무승부":T[S.over.w].name):null,
    summary:score(0)+" : "+score(1),details:d,
    players:T.flatMap(x=>x.roster.map((n,i)=>({team:x.name,name:n,pts:x.td[i]*6,note:"TD "+x.td[i]+" · TD패스 "+x.ps[i]+" · 플래그 "+x.fl[i]+" · 가로채기 "+x.it[i]})))};
}
function drawClock(){
  $("fh").textContent=S.cfg.halves===1?"경기":S.half===1?"전반":"후반";
  const c=$("fclock");c.textContent=K.fmt(S.clock);c.className="clock"+(S.clock<60000?" low":"");
  if(!S.running)K.fillTime("fc",S.clock);
  const g=$("fGo");g.textContent=S.running?"정지":"시작";g.classList.toggle("run",S.running);g.hidden=S.hEnd||!!S.over;
  $("fNext").hidden=!S.hEnd||!!S.over;
}
function draw(){
  const T=S.teams;
  [0,1].forEach(t=>{
    const x=T[t],sum=a=>a.reduce((p,q)=>p+q,0);
    K.setVal("fname"+t,x.name);$("fsc"+t).textContent=score(t);
    $("fpos"+t).classList.toggle("no",S.off!==t||!!S.over);
    $("ftd"+t).textContent=sum(x.td);$("fint"+t).textContent=sum(x.it);$("ffl"+t).textContent=sum(x.fl);
    $("frh"+t).textContent=x.name+" 선수";$("fnl"+t).textContent=x.name+" 명단 ("+x.roster.length+"명)";
    let h="<div class=\"prow ff head\"><span>이름</span><span style=\"text-align:center\">TD</span><span style=\"text-align:center\">패스</span><span style=\"text-align:center\">플래그</span><span style=\"text-align:center\">가로</span><span class=\"op\"></span></div>";
    x.roster.forEach((n,i)=>{
      h+="<div class=\"prow ff\"><span class=\"pn\">"+esc(n)+"</span>"+K.fixN(x.td[i],"teams."+t+".td."+i+"|teams."+t+".pts*6",n+" · 터치다운(팀 점수 6점도 함께)")+K.fixN(x.ps[i],"teams."+t+".ps."+i,n+" · 터치다운 패스")+K.fixN(x.fl[i],"teams."+t+".fl."+i,n+" · 플래그 뽑기")+K.fixN(x.it[i],"teams."+t+".it."+i,n+" · 가로채기")+"<span class=\"btns op\"><button type=\"button\" class=\"b2\" data-ftd=\""+t+":"+i+"\">TD</button><button type=\"button\" data-fps=\""+t+":"+i+"\">패스</button><button type=\"button\" data-ffl=\""+t+":"+i+"\">플래그</button><button type=\"button\" data-fit=\""+t+":"+i+"\">가로채기</button></span></div>";
    });
    $("fr"+t).innerHTML=h;
    K.setVal("fros"+t,x.roster.join("\n"));
  });
  const ord=["","1번째","2번째","3번째","4번째"];
  $("fDown").innerHTML=S.over?"경기 종료":"<div class=\"ff-dn\"><b style=\"color:"+TCOL[S.off]+"\">"+esc(T[S.off].name)+"</b> 공격</div><div class=\"ff-big\">"+ord[S.down]+" 다운</div><div class=\"ff-dots\">"+[1,2,3,4].map(i=>"<i class=\""+(i<S.down?"used":i===S.down?"now":"")+"\"></i>").join("")+"</div><div class=\"ff-goal\">"+(S.mid?"🏁 목표: 터치다운":"🎯 목표: 하프라인 넘기")+"</div>";
  $("fDbtn").innerHTML=S.over||S.pat?"":"<button type=\"button\" id=\"fNextDown\">플레이 끝 · 다음 다운</button><button type=\"button\" class=\"small\" id=\"fMid\""+(S.mid?" disabled":"")+">하프라인 넘음 → 1번째 다운</button><button type=\"button\" class=\"small\" id=\"fChange\">공격권 넘기기</button>";
  const pat=$("fPat");pat.hidden=!S.pat;
  if(S.pat)pat.innerHTML="<div class=\"lbl\">"+esc(T[S.pat.t].name)+" 추가 득점 시도</div><div class=\"btnrow\"><button type=\"button\" class=\"go\" data-fpat=\"1:1\">1점(5야드) 성공</button><button type=\"button\" class=\"small\" data-fpat=\"1:0\">1점 실패</button></div><div class=\"btnrow\"><button type=\"button\" class=\"go\" data-fpat=\"2:1\">2점(10야드) 성공</button><button type=\"button\" class=\"small\" data-fpat=\"2:0\">2점 실패</button></div>";
  $("flog").innerHTML=S.log.length?S.log.slice(0,14).map(l=>{
    const tn="<b style=\"color:"+TCOL[l.t]+"\">"+esc(T[l.t].name)+"</b>",h=" <span class=\"x\">· "+(l.h===1?"전반":"후반")+"</span>",p="<span class=\"p\" style=\"--c:"+TCOL[l.t]+"\">";
    if(l.k==="td")return "<li>"+p+l.sc.join(":")+"</span><span>"+tn+" 터치다운 +6"+(l.who?" · "+esc(l.who):"")+h+"</span></li>";
    if(l.k==="pat")return "<li>"+p+l.sc.join(":")+"</span><span>"+tn+" 추가 득점 "+l.n+"점 "+(l.ok?"성공":"<span class=\"x\">실패</span>")+h+"</span></li>";
    if(l.k==="sf")return "<li>"+p+l.sc.join(":")+"</span><span>"+tn+" 세이프티 +2"+h+"</span></li>";
    if(l.k==="ps")return "<li>"+p+"패스</span><span>"+tn+" 터치다운 패스 · "+esc(l.who)+h+"</span></li>";
    if(l.k==="it")return "<li>"+p+"INT</span><span>"+tn+" 가로채기 · "+esc(l.who)+h+"</span></li>";
    if(l.k==="tov")return "<li>"+p+"↔</span><span>"+tn+" 공격 시작 <span class=\"x\">("+esc(l.r)+")</span>"+h+"</span></li>";
    if(l.k==="m")return "<li>"+p+"−1</span><span>"+tn+" 점수 정정"+h+"</span></li>";
    return "";
  }).join(""):"<li class=\"empty\">아직 기록이 없습니다. 선수 줄의 TD, 패스, 플래그, 가로채기 버튼으로 기록하세요.</li>";
  $("fUndo").disabled=!undoStack.length;
  K.setVal("fcMin",S.cfg.min);$("fcHalves").value=String(S.cfg.halves);
  $("fcPcOn").checked=!!S.cfg.pcOn;K.setVal("fcPc1",S.cfg.pc1);K.setVal("fcPc2",S.cfg.pc2);
  $("fPcA").textContent=S.cfg.pc1+"초";$("fPcB").textContent=S.cfg.pc2+"초";
  drawClock();drawPc();BG.draw();
}
function start(){if(S.over||S.hEnd||S.clock<=0)return;S.running=true;K.wake(true);drawClock();K.snd.whistle(1);}
function stop(){S.running=false;K.wake(false);save();drawClock();}
$("fGo").onclick=()=>{S.running?stop():start();};
$("fNext").onclick=nextHalf;
$("fUndo").onclick=undo;
$("fPcA").onclick=()=>pcStart(S.cfg.pc1);
$("fPcB").onclick=()=>pcStart(S.cfg.pc2);
$("fSnap").onclick=()=>{if(S.pcRun){pcStop();K.snd.chime();}};
K.bindTime(R,()=>S.clock,(k,v)=>{S.clock=Math.max(0,Math.min(5999000,v));if(S.hEnd&&v>0&&!S.over)S.hEnd=false;save();draw();},{full:()=>S.cfg.min*60000,stop:()=>stop()});
K.arm($("fNew"),"새 경기",()=>{BG.reset();S=fresh(S.cfg,S.teams.map(x=>({name:x.name,roster:x.roster})));undoStack=[];K.closeModal();save();draw();K.toast("새 경기 준비 완료 (팀 이름·명단 유지)","",1800);});
R.addEventListener("click",e=>{
  let b;const ti=s=>s.split(":").map(Number);
  if(b=e.target.closest("[data-ftd]")){const [t,i]=ti(b.dataset.ftd);td(t,i);return;}
  if(b=e.target.closest("[data-fps]")){const [t,i]=ti(b.dataset.fps);if(S.over)return;snap();S.teams[t].ps[i]++;BG.hit(t,i);addLog({k:"ps",t,who:S.teams[t].roster[i]});save();draw();K.snd.chime();return;}
  if(b=e.target.closest("[data-ffl]")){const [t,i]=ti(b.dataset.ffl);if(S.over)return;snap();S.teams[t].fl[i]++;save();draw();K.snd.tick(2);K.toast(S.teams[t].roster[i]+" 플래그!","",1000);return;}
  if(b=e.target.closest("[data-fit]")){const [t,i]=ti(b.dataset.fit);if(S.over)return;snap();S.teams[t].it[i]++;BG.hit(t,i);addLog({k:"it",t,who:S.teams[t].roster[i]});S.off=t;S.down=1;S.mid=false;S.pat=null;save();draw();pcStart(S.cfg.pc2);K.snd.bonus();K.toast("가로채기! "+S.teams[t].roster[i]+" · "+S.teams[t].name+" 공격","bingo",2000);return;}
  if(b=e.target.closest("[data-fpat]")){const [n,ok]=ti(b.dataset.fpat);if(S.pat)patRes(n,!!ok);return;}
  if(b=e.target.closest("[data-fsafe]")){const t=+b.dataset.fsafe;if(S.over)return;snap();S.teams[t].pts+=2;addLog({k:"sf",t});S.off=t;S.down=1;S.mid=false;S.pat=null;save();draw();pcStart(S.cfg.pc2);K.fx.play("quiz",$("fsc"+t),{text:"세이프티 +2"});K.snd.swish();K.toast(S.teams[t].name+" 세이프티 +2 · "+S.teams[t].name+" 공격","bingo",2000);return;}
  if(b=e.target.closest("[data-fminus]")){const t=+b.dataset.fminus,T=S.teams[t];if(S.over||score(t)<=0)return;snap();if(T.pts>0)T.pts--;else T.bg--;addLog({k:"m",t});save();draw();return;}
  if(b=e.target.closest("#fNextDown")){if(S.over||S.pat)return;snap();if(S.down<4){S.down++;save();draw();pcStart(S.cfg.pc1);}else{const from=S.off;change("4번째 다운 실패");addLog({k:"tov",t:S.off,r:S.teams[from].name+" 4다운 실패"});save();draw();pcStart(S.cfg.pc2);}return;}
  if(b=e.target.closest("#fMid")){if(S.over||S.mid)return;snap();S.mid=true;S.down=1;save();draw();pcStart(S.cfg.pc1);K.snd.chime();K.toast("하프라인 통과! 다시 1번째 다운 · 이제 터치다운까지","",2000);return;}
  if(b=e.target.closest("#fChange")){if(S.over)return;snap();change();addLog({k:"tov",t:S.off,r:"교사 지정"});save();draw();pcStart(S.cfg.pc2);return;}
});
R.addEventListener("input",e=>{const el=e.target;if(el.id==="fname0"||el.id==="fname1"){S.teams[+el.id.slice(-1)].name=el.value;save();}});
R.addEventListener("change",e=>{
  const el=e.target;
  if(el.id==="fros0"||el.id==="fros1"){
    const t=+el.id.slice(-1),list=K.parseList(el.value,15);if(!list.length){draw();return;}snap();
    const T=S.teams[t],old=T.roster,pick=a=>list.map(n=>{const k=old.indexOf(n);return k>=0?a[k]:0;});
    T.td=pick(T.td);T.ps=pick(T.ps);T.fl=pick(T.fl);T.it=pick(T.it);T.roster=list;save();draw();return;
  }
  if(el.id==="fcMin"||el.id==="fcHalves"){const C=S.cfg,om=C.min;C.min=Math.max(1,Math.min(30,+$("fcMin").value||15));C.halves=+$("fcHalves").value||2;if(!S.running&&om!==C.min&&S.clock===om*60000)S.clock=C.min*60000;save();draw();}
  if(el.id==="fcPcOn"||el.id==="fcPc1"||el.id==="fcPc2"){const C=S.cfg;C.pcOn=$("fcPcOn").checked;C.pc1=Math.max(5,Math.min(60,+$("fcPc1").value||25));C.pc2=Math.max(5,Math.min(90,+$("fcPc2").value||40));if(!C.pcOn)S.pcRun=false;if(!S.pcRun)S.pc=C.pc1*1000;save();draw();}
});
draw();
return{
  record:makeRec,
  tick(dt,now){
    if(S.pcRun){
      const b=Math.ceil(S.pc/1000);S.pc=Math.max(0,S.pc-dt);const a=Math.ceil(S.pc/1000);
      if(a!==b&&a>0&&a<=5)K.snd.tick(6-a);
      if(S.pc<=0)pcOut();else drawPc();
    }
    if(!S.running)return;
    S.clock=Math.max(0,S.clock-dt);
    if(S.clock<=0){hUp();return;}
    if(now-lastSave>1000){save();lastSave=now;}
    drawClock();
  },
  key(e){
    if(e.code==="Space"){e.preventDefault();S.running?stop():start();}
    else if(e.key==="z"||e.key==="Z")undo();
    else if((e.key==="s"||e.key==="S")&&S.pcRun){pcStop();K.snd.chime();}
  },
  destroy(){S.pcRun=false;if(S.running){S.running=false;save();}}
};
}};
