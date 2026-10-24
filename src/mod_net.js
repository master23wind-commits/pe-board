/* ================= 네트 종목: 탁구 · 배드민턴 · 피클볼 ================= */
function makeNet(D){
return {name:D.name,sub:D.sub,color:D.color,
html:`
<div class="board" id="nboard">
  <section class="team" data-t="0">
    <input class="tname" id="tname0" aria-label="선수 또는 팀 이름">
    <div class="serve" id="serve0">${K.SERVE_SVG}<span id="servet0">서브</span></div>
    <div class="score" id="score0">0</div>
    <div class="tmeta"><div class="stat"><div class="dots" id="gm0"></div><span>이긴 게임</span></div></div>
    <div class="btnrow op"><button class="pt" type="button" data-pt="0" id="pt0">득점</button></div>
    <div class="btnrow op"><button class="small" type="button" data-minus="0">점수 −1</button></div>
  </section>
  <section class="center">
    <div class="qtr" id="gno">1게임</div>
    <div class="hist" id="hist"></div>
    <div class="lbl" id="callLbl">서브</div>
    <div class="call" id="call"></div>
    <div class="callsub" id="callsub"></div>
    <div class="state" id="state"></div>
    <div class="btnrow op">
      <button class="small" id="srvBtn" type="button">서브 바꾸기</button>
      <button class="small" id="flipBtn" type="button">좌우 바꾸기</button>
      <button class="small" id="undoBtn" type="button">되돌리기</button>
    </div>
  </section>
  <section class="team" data-t="1">
    <input class="tname" id="tname1" aria-label="선수 또는 팀 이름">
    <div class="serve" id="serve1">${K.SERVE_SVG}<span id="servet1">서브</span></div>
    <div class="score" id="score1">0</div>
    <div class="tmeta"><div class="stat"><div class="dots" id="gm1"></div><span>이긴 게임</span></div></div>
    <div class="btnrow op"><button class="pt" type="button" data-pt="1" id="pt1">득점</button></div>
    <div class="btnrow op"><button class="small" type="button" data-minus="1">점수 −1</button></div>
  </section>
</div>
<div class="lower">
  <div class="box"><h4>랠리 기록</h4><ul class="log" id="log"></ul></div>
  <div class="box op">
    <h4>경기 설정</h4>
    <div class="cfg">
      <div class="cfgrow">
        <label>게임 점수 <select id="cfgPts">${D.ptsOpts.map(p=>'<option value="'+p+'">'+p+'점</option>').join("")}</select></label>
        <label>게임 수 <select id="cfgGames">${D.gameOpts.map(g=>'<option value="'+g+'">'+(g===1?"단판":g+"게임("+Math.ceil(g/2)+"선승)")+'</option>').join("")}</select></label>
        <label><input id="cfgFx" type="checkbox"> 득점 효과</label>
        ${D.kind==="pb"?'<label><input id="cfgDbl" type="checkbox"> 복식</label><label><input id="cfgRally" type="checkbox"> 랠리 스코어링</label>':''}
      </div>
      <div class="keys">${D.help}<br><kbd>←</kbd> 왼쪽 득점 · <kbd>→</kbd> 오른쪽 득점 · <kbd>S</kbd> 서브 바꾸기 · <kbd>Z</kbd> 되돌리기<br>
        첫 서브는 경기 시작 전에 '서브 바꾸기'로 정하세요. 게임이 끝나거나 마지막 게임 중간 교대 시점이 되면 화면 좌우도 자동으로 바뀝니다.</div>
      <div><button class="danger" id="newBtn" type="button">새 경기</button></div>
    </div>
  </div>
</div>`,
init(ctx){
const $=K.$,R=ctx.root,KEY="pe-"+D.id,esc=K.esc;
function fresh(cfg,names){
  cfg=cfg||{pts:D.ptsOpts[0],games:D.defGames,dbl:true,rally:false};
  const S={cfg,names:names||D.defNames.slice(),score:[0,0],games:[0,0],gameNo:1,hist:[],gameFirst:0,serve:0,srv:1,flip:false,switched:false,gameOver:null,over:null,log:[]};
  resetServe(S);return S;
}
function resetServe(S){S.serve=S.gameFirst;S.srv=(D.kind==="pb"&&S.cfg.dbl&&!S.cfg.rally)?2:1;}
let S=K.load(KEY);if(!S||!S.cfg||!S.score)S=fresh();
let undoStack=[];
const save=()=>K.save(KEY,S);
function snap(){undoStack.push(JSON.stringify(S));if(undoStack.length>200)undoStack.shift();}
function undo(){if(!undoStack.length)return;S=JSON.parse(undoStack.pop());K.closeModal();save();draw();K.toast("되돌렸습니다","",1200);}
const need=()=>Math.ceil(S.cfg.games/2);
const isFinal=()=>S.gameNo===S.cfg.games;
const cap=()=>D.kind==="bd"?S.cfg.pts+9:null;
const sideOut=()=>D.kind==="pb"&&!S.cfg.rally;
const switchAt=()=>D.kind==="tt"?5:D.kind==="bd"?Math.ceil(S.cfg.pts/2):Math.ceil(S.cfg.pts/2);
function ttServer(){
  const p=S.cfg.pts,n=S.score[0]+S.score[1];
  const deuce=S.score[0]>=p-1&&S.score[1]>=p-1;
  const idx=deuce?(p-1)+(n-2*(p-1)):Math.floor(n/2);
  return {who:(S.gameFirst+idx)%2,deuce,nth:deuce?1:(n%2)+1};
}

function point(t){
  if(S.gameOver||S.over)return;
  snap();
  const before=S.score.slice();
  if(sideOut()&&t!==S.serve){
    // 리시브 팀이 랠리를 이기면 점수 없이 서브권만 바뀐다
    let msg;
    if(S.cfg.dbl&&S.srv===1){S.srv=2;msg=S.names[S.serve]+" 2번 서버로";}
    else{S.serve=1-S.serve;S.srv=1;msg="사이드 아웃 · "+S.names[S.serve]+" 서브";}
    S.log.unshift({t,txt:msg,pts:0,sc:S.score.slice()});
    save();draw();K.snd.stop();K.toast(msg,"",1600);return;
  }
  S.score[t]++;
  if(D.kind==="bd"||(D.kind==="pb"&&S.cfg.rally))S.serve=t;
  if(D.kind==="tt")S.serve=ttServer().who;
  S.log.unshift({t,txt:"득점",pts:1,sc:S.score.slice()});if(S.log.length>80)S.log.pop();
  // 마지막 게임 중간 코트 교대
  if(isFinal()&&S.cfg.games>1&&!S.switched&&Math.max(...S.score)>=switchAt()&&Math.max(...before)<switchAt()){
    S.switched=true;S.flip=!S.flip;setTimeout(()=>K.toast("코트 교대! 선수들은 자리를 바꾸세요","",3200),300);
  }
  save();draw();
  {const to=$("score"+t);K.bump(to);K.snd.chime();
   K.fx.play(D.kind==="tt"?"tt":D.kind==="bd"?"shuttle":"pickle",to,{from:$("score"+(1-t))});}
  checkGame();
}
function checkGame(){
  const s=S.score,p=S.cfg.pts,c=cap();
  for(const t of [0,1]){
    if(s[t]>=p&&(s[t]-s[1-t]>=2||(c&&s[t]>=c))){gameWon(t);return;}
  }
  // 게임 포인트 안내
  const gp=[0,1].find(t=>s[t]>=p-1&&s[t]>s[1-t]&&(s[t]+1-s[1-t]>=2||(c&&s[t]+1>=c)));
  if(gp!==undefined&&!(sideOut()&&gp!==S.serve))K.toast(S.names[gp]+" "+(S.games[gp]+1>=need()?"매치":"게임")+" 포인트","",1500);
}
function gameWon(t){
  S.games[t]++;S.gameOver={w:t};
  if(S.games[t]>=need())S.over={w:t};
  save();draw();setTimeout(K.snd.fanfare,200);
  if(K.fx.on()){const el=$("score"+t);setTimeout(()=>K.fx.burst(el,getComputedStyle(el.closest(".team")).getPropertyValue("--tc").trim()||"#fff",S.over?"승리!":"게임!",true),700);}
  setTimeout(showModal,K.fx.on()?1300:0);
  ctx.store(makeRec(),!S.over);
}
function makeRec(){
  if(!S.mid)S.mid=K.newId();
  const gs=S.hist.map(h=>h.s);if(!S.gameOver&&S.score[0]+S.score[1]>0)gs.push(S.score);else if(S.gameOver)gs.push(S.score);
  const extra=D.kind==="pb"?(S.cfg.rally?"랠리 스코어링":"사이드아웃")+(S.cfg.dbl?" · 복식":" · 단식"):"";
  return{id:S.mid,sport:D.id,sportName:D.name,at:Date.now(),done:!!S.over,
    teams:S.names.map((n,i)=>({name:n,score:S.games[i]})),winner:S.over?S.names[S.over.w]:null,
    summary:S.games[0]+" : "+S.games[1]+" ("+gs.map(s=>s[0]+":"+s[1]).join(", ")+")",
    details:[S.cfg.pts+"점 "+(S.cfg.games>1?S.cfg.games+"게임":"단판")+(extra?" · "+extra:"")].concat(gs.map((s,i)=>(i+1)+"게임 "+s[0]+":"+s[1])),players:[]};
}
function showModal(){
  const w=(S.over||S.gameOver).w;
  const hs=S.hist.map((h,i)=>(i+1)+"게임 "+h.s[0]+":"+h.s[1]).join(" · ");
  K.modal({sub:S.over?"경기 종료 · 게임 "+S.games[0]+" : "+S.games[1]:S.gameNo+"게임 종료",title:S.names[w]+(S.over?" 승리":" "+S.gameNo+"게임 승리"),color:w?"var(--blue)":"var(--red)",
    score:S.score[0]+" : "+S.score[1],stats:hs?"<div style=\"color:var(--muted)\">"+esc(hs)+"</div>":"",
    buttons:[{label:"되돌리기",fn:undo},{label:S.over?"새 경기":"다음 게임",cls:"go",fn:nextGame}]});
}
function nextGame(){
  if(S.over){newGame();return;}
  const w=S.gameOver.w;
  S.hist.push({s:S.score.slice(),w});
  S.score=[0,0];S.gameNo++;S.gameOver=null;S.switched=false;S.flip=!S.flip;
  S.gameFirst=D.kind==="bd"?w:1-S.gameFirst;
  resetServe(S);undoStack=[];save();draw();
  K.toast(S.gameNo+"게임 · 코트를 바꾸세요 · "+S.names[S.serve]+" 서브","",2800);
}
function newGame(){S=fresh(S.cfg,S.names);undoStack=[];K.closeModal();save();draw();K.toast("새 경기 준비 완료","",1600);}

function draw(){
  const C=S.cfg;
  $("nboard").classList.toggle("flip",!!S.flip);
  $("gno").innerHTML=(C.games>1?S.gameNo+"게임":"단판")+"<small>"+C.pts+"점"+(isFinal()&&C.games>1?" · 마지막 게임":"")+"</small>";
  $("hist").innerHTML=S.hist.map((h,i)=>"<span>"+(i+1)+"G <b class=\"w"+h.w+"\">"+h.s[0]+":"+h.s[1]+"</b></span>").join("");
  [0,1].forEach(t=>{
    K.setVal("tname"+t,S.names[t]);
    $("score"+t).textContent=S.score[t];
    $("serve"+t).classList.toggle("no",S.serve!==t);
    $("gm"+t).innerHTML=Array.from({length:need()},(_,i)=>"<i"+(i<S.games[t]?"":" class=\"off\"")+"></i>").join("");
    $("pt"+t).innerHTML=sideOut()?"랠리 승리<small>"+(S.serve===t?"서브팀 · 득점":"리시브팀 · 서브권 가져오기")+"</small>":"득점 +1";
    $("servet"+t).textContent=D.kind==="pb"&&C.dbl&&!C.rally?"서브 · "+S.srv+"번 서버":"서브";
  });
  const call=$("call"),sub=$("callsub"),lbl=$("callLbl");
  if(D.kind==="tt"){
    const s=ttServer();lbl.textContent="서브 순서";
    call.className="call";call.textContent=s.deuce?"듀스":s.nth+" / 2";
    sub.textContent=S.names[S.serve]+(s.deuce?" 서브 · 듀스에서는 1개씩 번갈아":" 서브 · 2개씩 번갈아 넣기");
  }else if(D.kind==="bd"){
    const right=S.score[S.serve]%2===0;lbl.textContent="서비스 코트";
    call.className="call k";call.textContent=right?"오른쪽":"왼쪽";
    sub.textContent=S.names[S.serve]+" 서브 · 서버 점수가 "+(right?"짝수":"홀수")+"라 "+(right?"오른쪽":"왼쪽")+"에서";
  }else{
    lbl.textContent="점수 콜 (서브팀 먼저)";call.className="call";
    const a=S.score[S.serve],b=S.score[1-S.serve];
    if(C.dbl&&!C.rally){call.textContent=a+"-"+b+"-"+S.srv;sub.textContent=S.names[S.serve]+" 서브 · "+S.srv+"번 서버"+(S.srv===2&&S.score[0]+S.score[1]===0?" (첫 서브는 2번부터)":"");}
    else{call.textContent=a+"-"+b;sub.textContent=S.names[S.serve]+" 서브 · "+(a%2===0?"오른쪽":"왼쪽")+"에서";}
  }
  const st=$("state");
  st.textContent=S.over?"경기 종료":S.gameOver?"게임 종료":(sideOut()?"서브팀만 득점합니다. 리시브팀이 이기면 서브권이 넘어가요.":"랠리를 이긴 쪽 득점 버튼을 누르세요.");
  $("log").innerHTML=S.log.length?S.log.slice(0,10).map(l=>"<li><span class=\"p\" style=\"--c:"+(l.t?"var(--blue)":"var(--red)")+"\">"+(l.pts?"+1":"↺")+"</span><span>"+(l.pts?esc(S.names[l.t])+" 득점":esc(l.txt))+" <span class=\"x\">· "+l.sc[0]+":"+l.sc[1]+"</span></span></li>").join(""):"<li class=\"empty\">아직 기록이 없습니다. 랠리를 이긴 쪽의 버튼을 누르면 여기에 쌓입니다.</li>";
  $("undoBtn").disabled=!undoStack.length;
  $("cfgPts").value=String(C.pts);$("cfgGames").value=String(C.games);
  if(D.kind==="pb"){$("cfgDbl").checked=C.dbl;$("cfgRally").checked=C.rally;}
  $("cfgFx").checked=K.fx.on();
}
function swapServe(){
  snap();
  if(D.kind==="tt"){S.gameFirst=1-S.gameFirst;S.serve=ttServer().who;}
  else{S.serve=1-S.serve;if(S.score[0]+S.score[1]===0){S.gameFirst=S.serve;resetServe(S);}}
  save();draw();
}
$("srvBtn").onclick=swapServe;
$("flipBtn").onclick=()=>{S.flip=!S.flip;save();draw();};
$("undoBtn").onclick=undo;
K.arm($("newBtn"),"새 경기",newGame);
R.addEventListener("click",e=>{
  let b;
  if(b=e.target.closest("[data-pt]")){point(+b.dataset.pt);return;}
  if(b=e.target.closest("[data-minus]")){const t=+b.dataset.minus;if(S.score[t]>0&&!S.gameOver&&!S.over){snap();S.score[t]--;if(D.kind==="tt")S.serve=ttServer().who;save();draw();}return;}
});
R.addEventListener("input",e=>{const el=e.target;if(el.id==="tname0"||el.id==="tname1"){S.names[+el.id.slice(-1)]=el.value;save();}});
R.addEventListener("change",e=>{
  const id=e.target.id;if(id==="cfgFx"){K.fx.set(e.target.checked);if(e.target.checked)K.fx.burst($("score0"),"#ff5a7a","효과 켜짐");return;}
  if(!["cfgPts","cfgGames","cfgDbl","cfgRally"].includes(id))return;
  const C=S.cfg;C.pts=+$("cfgPts").value;C.games=+$("cfgGames").value;
  if(D.kind==="pb"){C.dbl=$("cfgDbl").checked;C.rally=$("cfgRally").checked;if(S.score[0]+S.score[1]===0)resetServe(S);}
  save();draw();
});
draw();
if(S.gameOver||S.over)showModal();
return{
  record:makeRec,
  key(e){
    const k=e.key.toLowerCase();
    const left=S.flip?1:0;
    if(e.key==="ArrowLeft"){e.preventDefault();point(left);}
    else if(e.key==="ArrowRight"){e.preventDefault();point(1-left);}
    else if(k==="s")swapServe();
    else if(k==="z")undo();
  }
};
}};
}
MODS.tt=makeNet({id:"tt",kind:"tt",name:"탁구",sub:"11점 · 2점 차 · 서브 2개씩 교대",color:"var(--c-tt)",
  ptsOpts:[11,21],gameOpts:[1,3,5,7],defGames:3,defNames:["홍팀","청팀"],
  help:"서브는 2개씩 번갈아 넣고, 10:10 듀스부터는 1개씩 번갈아 넣습니다. 게임마다 첫 서브가 바뀌고, 마지막 게임은 한쪽이 5점에 도달하면 코트를 바꿉니다."});
MODS.bd=makeNet({id:"bd",kind:"bd",name:"배드민턴",sub:"21점 랠리포인트 · 서비스 코트 표시",color:"var(--c-bd)",
  ptsOpts:[21,15,11],gameOpts:[1,3],defGames:3,defNames:["홍팀","청팀"],
  help:"랠리를 이긴 쪽이 점수와 서브를 가져갑니다. 서버 점수가 짝수면 오른쪽, 홀수면 왼쪽 서비스 코트에서 서브합니다. 20:20부터는 2점 차, 29:29면 30점을 먼저 낸 쪽이 이깁니다(21점 기준). 마지막 게임은 11점에서 코트를 바꿉니다."});
MODS.pb=makeNet({id:"pb",kind:"pb",name:"피클볼",sub:"11점 · 사이드아웃 스코어링 · 점수 콜",color:"var(--c-pb)",
  ptsOpts:[11,15,21],gameOpts:[1,3],defGames:3,defNames:["홍팀","청팀"],
  help:"서브팀만 점수를 얻습니다. 복식은 한 팀에 서버가 2명이라, 1번 서버가 랠리를 지면 2번 서버로, 2번 서버까지 지면 상대 팀으로 서브가 넘어갑니다(사이드 아웃). 경기 첫 서브는 2번 서버부터라 0-0-2로 시작합니다. 점수 콜은 '서브팀 점수 - 리시브팀 점수 - 서버 번호' 순서로 크게 외치세요."});
