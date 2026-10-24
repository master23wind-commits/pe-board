/* ================= 배구 ================= */
MODS.volley={name:"배구",sub:"9인제·6인제 · 랠리포인트 · 폭탄 랠리 · 빙고 배구",color:"var(--c-vb)",
html:`
<div class="modebar op">
  <div class="seg" role="group" aria-label="인원">
    <button type="button" data-fmt="9">9인제</button>
    <button type="button" data-fmt="6">6인제</button>
  </div>
  <label class="sw" style="--sc:var(--bomb)"><input type="checkbox" id="modeBomb"><span class="knob"></span>폭탄 랠리</label>
  <label class="sw" style="--sc:var(--ok)"><input type="checkbox" id="modeBingo"><span class="knob"></span>빙고 배구</label>
  <span class="hint" id="ruleLine"></span>
</div>
<div class="board">
  <section class="team" data-t="0">
    <input class="tname" id="tname0" aria-label="팀 이름">
    <div class="serve" id="serve0">${K.SERVE_SVG}<span id="servet0">서브</span></div>
    <div class="score" id="score0">0</div>
    <div class="tmeta">
      <div class="stat"><div class="dots" id="sets0"></div><span>세트</span></div>
      <div class="stat"><div class="dots" id="to0"></div><span>타임아웃</span></div>
    </div>
    <div class="btnrow op"><button class="pt" type="button" data-pt="0" id="pt0">득점</button></div>
    <div class="btnrow op"><button class="small" type="button" data-minus="0">점수 −1</button><button class="small" type="button" data-to="0">타임아웃</button></div>
  </section>
  <section class="center">
    <div class="qtr" id="setno">1세트</div>
    <div class="hist" id="hist"></div>
    <div class="bombp" id="bombp">
      <div class="lbl">폭탄 랠리 · 네트를 넘어간 횟수</div>
      <div class="bombrow">
        <svg class="bombsvg" viewBox="0 0 100 100" aria-hidden="true">
          <circle class="body" cx="44" cy="58" r="32"/>
          <rect x="58" y="20" width="16" height="14" rx="3" transform="rotate(40 66 27)" fill="#2a2a36" stroke="var(--heat)" stroke-width="3"/>
          <path d="M72 18 C78 10, 86 14, 88 6" fill="none" stroke="#b9a37a" stroke-width="3"/>
          <circle class="spark" cx="89" cy="6" r="6"/>
          <circle cx="32" cy="46" r="7" fill="#ffffff" opacity=".18"/>
        </svg>
        <div class="rally" id="rally">0<small>회</small></div>
      </div>
      <div class="best">이번 득점 가치 <b id="worth">1</b>점 · 최장 랠리 <b id="best">0</b>회</div>
      <button class="netbtn op" id="netBtn" type="button">네트 넘김 +1</button>
      <div class="btnrow op"><button class="small" id="netMinus" type="button">−1</button><button class="small" id="netReset" type="button">랠리 0으로</button></div>
    </div>
    <div class="btnrow op"><button class="small" id="serveBtn" type="button">서브 바꾸기</button><button class="small" id="undoBtn" type="button">되돌리기</button></div>
  </section>
  <section class="team" data-t="1">
    <input class="tname" id="tname1" aria-label="팀 이름">
    <div class="serve" id="serve1">${K.SERVE_SVG}<span id="servet1">서브</span></div>
    <div class="score" id="score1">0</div>
    <div class="tmeta">
      <div class="stat"><div class="dots" id="sets1"></div><span>세트</span></div>
      <div class="stat"><div class="dots" id="to1"></div><span>타임아웃</span></div>
    </div>
    <div class="btnrow op"><button class="pt" type="button" data-pt="1" id="pt1">득점</button></div>
    <div class="btnrow op"><button class="small" type="button" data-minus="1">점수 −1</button><button class="small" type="button" data-to="1">타임아웃</button></div>
  </section>
</div>
<div class="rotwrap" id="rotwrap">
  <div class="rotguide"><b>6인제 로테이션</b> · 상대에게서 서브권을 가져온 팀은 시계 방향으로 한 칸씩 이동하고, 1번 자리(오른쪽 뒤)에 온 선수가 서브합니다. 점수만 누르면 이동은 자동으로 됩니다.</div>
  <div class="rot">
    <div class="rcourt" data-t="0">
      <div class="rhd"><h3 id="rch0">홍팀</h3><div class="btnrow op"><button class="small" type="button" data-rot="0" data-d="1">↻ 한 칸 돌리기</button><button class="small" type="button" data-rot="0" data-d="-1">한 칸 되돌리기</button></div></div>
      <div class="net">네트</div>
      <div class="cgrid" id="cg0"></div>
      <div class="rnext" id="rn0"></div>
      <div class="sorder" id="so0"></div>
      <div class="bench" id="bn0"></div>
    </div>
    <div class="rcourt" data-t="1">
      <div class="rhd"><h3 id="rch1">청팀</h3><div class="btnrow op"><button class="small" type="button" data-rot="1" data-d="1">↻ 한 칸 돌리기</button><button class="small" type="button" data-rot="1" data-d="-1">한 칸 되돌리기</button></div></div>
      <div class="net">네트</div>
      <div class="cgrid" id="cg1"></div>
      <div class="rnext" id="rn1"></div>
      <div class="sorder" id="so1"></div>
      <div class="bench" id="bn1"></div>
    </div>
  </div>
  <div class="bfoot op">자리를 바꾸려면 코트의 선수 두 명을 차례로 누르세요. 교체는 아래 교체 선수를 누른 뒤 코트의 선수를 누르면 됩니다.</div>
</div>
<div class="bingos" id="bingos">
  <div class="bingo" data-t="0"><div class="bhead"><h3 id="bh0">홍팀 빙고</h3><span class="bcount" id="bc0"></span></div><div class="grid3" id="g0"></div><div class="bfoot op">득점한 선수 이름을 누르면 팀 점수가 오르고 칸이 체크됩니다.</div></div>
  <div class="bingo" data-t="1"><div class="bhead"><h3 id="bh1">청팀 빙고</h3><span class="bcount" id="bc1"></span></div><div class="grid3" id="g1"></div><div class="bfoot op">득점한 선수 이름을 누르면 팀 점수가 오르고 칸이 체크됩니다.</div></div>
</div>
<div class="lower">
  <div class="box"><h4>랠리 기록</h4><ul class="log" id="log"></ul></div>
  <div class="box op">
    <h4>경기 설정</h4>
    <div class="cfg">
      <div class="cfgrow">
        <label>세트 점수 <input id="cfgTarget" type="number" min="5" max="99"></label>
        <label>마지막 세트 <input id="cfgFinal" type="number" min="5" max="99"></label>
        <label>세트 수 <select id="cfgSets"><option value="1">단판</option><option value="3">3세트(2선승)</option><option value="5">5세트(3선승)</option></select></label>
      </div>
      <div class="cfgrow">
        <label><input id="cfgDeuce" type="checkbox"> 듀스(2점 차 승리)</label>
        <label>빙고 1줄 보너스 <input id="cfgBonus" type="number" min="0" max="20">점</label>
        <label><input id="cfgReset" type="checkbox"> 세트마다 빙고 새로 시작</label>
      </div>
      <div class="names">
        <div><div class="nh"><span id="nl0">홍팀 명단</span><button class="small" type="button" data-shuf="0">빙고 칸 섞기</button></div><textarea id="nm0" aria-label="홍팀 명단"></textarea></div>
        <div><div class="nh"><span id="nl1">청팀 명단</span><button class="small" type="button" data-shuf="1">빙고 칸 섞기</button></div><textarea id="nm1" aria-label="청팀 명단"></textarea></div>
      </div>
      <div class="keys" id="nameHelp"></div>
      <div class="keys"><kbd>Space</kbd> 네트 넘김 · <kbd>←</kbd> 홍팀 득점 · <kbd>→</kbd> 청팀 득점 · <kbd>Z</kbd> 되돌리기</div>
      <div><button class="danger" id="newBtn" type="button">새 경기</button></div>
    </div>
  </div>
</div>`,
init(ctx){
const $=K.$,R=ctx.root,KEY="pe-volley",esc=K.esc;
const LINES=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
const EX=[K.EX10[0].slice(0,9),K.EX10[1].slice(0,9)];
const z=n=>Array(n).fill(0),seq=n=>[...Array(n).keys()];
// 코트 그림에서 자리 번호 배치: 앞줄 4·3·2, 뒷줄 5·6·1 (팀이 네트를 바라보는 방향)
const LAYOUT=[3,2,1,4,5,0];
function mkTeam(name,names){return{name,names:names.slice(),sets:0,to:2,hits:z(9),tot:z(12),lines:[],cells:seq(9).map(i=>i%names.length),pos:seq(6)};}
function defCfg(){return{target:25,final:15,sets:3,deuce:true,bomb:true,bingo:true,bonus:3,reset:true,fmt:9};}
function fresh(cfg,keep){
  const t=keep||[{name:"홍팀",names:EX[0]},{name:"청팀",names:EX[1]}];
  return{cfg:cfg||defCfg(),teams:[mkTeam(t[0].name,t[0].names),mkTeam(t[1].name,t[1].names)],score:[0,0],setNo:1,hist:[],serve:0,rally:0,best:0,log:[],setOver:null,over:null};
}
let S=K.load(KEY);if(!S||!S.teams||!S.cfg)S=fresh();
// 예전 저장 형식 보완
if(!S.cfg.fmt)S.cfg.fmt=9;
S.teams.forEach(T=>{if(!T.cells)T.cells=seq(9).map(i=>i%T.names.length);if(!T.pos)T.pos=seq(6);while(T.tot.length<12)T.tot.push(0);});
let undoStack=[],freshCell=null,sel=null,moved=null;
const save=()=>K.save(KEY,S);
function snap(){undoStack.push(JSON.stringify(S));if(undoStack.length>150)undoStack.shift();}
function undo(){if(!undoStack.length)return;S=JSON.parse(undoStack.pop());sel=null;K.closeModal();save();draw();K.toast("되돌렸습니다","",1200);}
const six=()=>S.cfg.fmt===6;
const need=()=>Math.ceil(S.cfg.sets/2);
const isFinal=()=>S.cfg.sets>1&&S.setNo===S.cfg.sets;
const tgt=()=>isFinal()?S.cfg.final:S.cfg.target;
const worth=()=>S.cfg.bomb?Math.max(1,S.rally):1;
const nm=(T,i)=>T.names[i]||"선수";
const server=t=>nm(S.teams[t],S.teams[t].pos[0]);
function rotate(t,d){const p=S.teams[t].pos;S.teams[t].pos=d>0?p.slice(1).concat(p[0]):[p[5]].concat(p.slice(0,5));moved=t;}

function award(t,cell){
  if(S.setOver||S.over)return;
  snap();
  const T=S.teams[t],rally=S.rally,pts=worth(),who=cell>=0?T.cells[cell]:-1;
  const newLines=[];
  if(S.cfg.bingo&&cell>=0){
    T.hits[cell]++;T.tot[who]++;
    LINES.forEach((L,i)=>{if(!T.lines.includes(i)&&L.every(c=>T.hits[c]>0)){T.lines.push(i);newLines.push(i);}});
  }
  const bonus=newLines.length*S.cfg.bonus;
  S.score[t]+=pts+bonus;
  if(S.cfg.bomb&&rally>S.best)S.best=rally;
  const sideOut=S.serve!==t;
  if(six()&&sideOut)rotate(t,1);
  S.serve=t;S.rally=0;
  S.log.unshift({t,pts,bonus,lines:newLines.length,rally:S.cfg.bomb?rally:null,who:(S.cfg.bingo&&cell>=0)?nm(T,who):null,rot:six()&&sideOut?server(t):null,set:S.setNo});
  if(S.log.length>60)S.log.pop();
  save();freshCell={t,i:cell};draw();K.bump($("score"+t));K.fx.play("spike",$("score"+t),{text:"+"+(pts+bonus)});
  if(newLines.length){K.snd.fanfare();K.toast(T.name+" 빙고 "+newLines.length+"줄 완성! 보너스 +"+bonus+"점","bingo",3600);}
  else if(S.cfg.bomb&&pts>=3){K.snd.boom();const bp=$("bombp");bp.classList.remove("boom");void bp.offsetWidth;bp.classList.add("boom");K.toast("펑! "+T.name+" 랠리 "+rally+"회로 "+pts+"점","bad",2600);}
  else if(six()&&sideOut){K.snd.bonus();K.toast(T.name+" 서브권! 시계 방향으로 한 칸 이동 · 서브: "+server(t),"",3000);}
  else K.snd.chime();
  checkSet();
}
function checkSet(){
  const s=S.score,g=tgt();
  for(const t of [0,1]){if(s[t]>=g&&(!S.cfg.deuce||s[t]-s[1-t]>=2)){setWon(t);return;}}
}
function setWon(t){
  S.setOver={w:t};S.teams[t].sets++;
  if(S.teams[t].sets>=need())S.over={w:t};
  save();draw();setTimeout(K.snd.horn,S.cfg.bingo?500:250);showModal();
  ctx.store(makeRec(),!S.over);
}
function makeRec(){
  if(!S.mid)S.mid=K.newId();
  const T=S.teams,sets=S.hist.map(h=>h.s);
  if(S.score[0]+S.score[1]>0)sets.push(S.score);
  const modes=[S.cfg.fmt+"인제",S.cfg.bomb?"폭탄 랠리":"",S.cfg.bingo?"빙고 배구":""].filter(Boolean).join(" + ");
  const d=[modes+" · "+sets.map((s,i)=>(i+1)+"세트 "+s[0]+":"+s[1]).join(", ")];
  if(S.cfg.bomb)d.push("최장 랠리 "+S.best+"회");
  if(S.cfg.bingo)T.forEach(t=>d.push(t.name+" 득점한 선수 "+t.tot.slice(0,t.names.length).filter(x=>x>0).length+"/"+t.names.length+"명"));
  return{id:S.mid,sport:"volley",sportName:"배구",at:Date.now(),done:!!S.over,
    teams:T.map(t=>({name:t.name,score:t.sets})),winner:S.over?T[S.over.w].name:null,
    summary:T[0].sets+" : "+T[1].sets+" ("+sets.map(s=>s[0]+":"+s[1]).join(", ")+")",details:d,
    players:S.cfg.bingo?T.flatMap(t=>t.names.map((n,i)=>({team:t.name,name:n,pts:t.tot[i],note:"득점 횟수"}))):[]};
}
function showModal(){
  const w=(S.over||S.setOver).w,T=S.teams;let st="";
  if(S.cfg.bomb)st+="<div>최장 랠리 <b>"+S.best+"회</b></div>";
  if(S.cfg.bingo){[0,1].forEach(t=>{const tt=T[t],n=tt.names.length,tot=tt.tot.slice(0,n),mx=Math.max(...tot);
    if(mx>0)st+="<div>"+esc(tt.name)+" 최다 득점: <b>"+esc(tt.names.filter((x,i)=>tot[i]===mx).join(", "))+"</b> ("+mx+"번)</div>";
    st+="<div style=\"color:var(--muted)\">"+esc(tt.name)+" 득점한 선수 "+tot.filter(x=>x>0).length+"/"+n+"명</div>";});}
  K.modal({sub:S.over?"경기 종료 · 세트 "+T[0].sets+" : "+T[1].sets:S.setNo+"세트 종료",title:T[w].name+(S.over?" 경기 승리":" "+S.setNo+"세트 승리"),color:w?"var(--blue)":"var(--red)",score:S.score[0]+" : "+S.score[1],stats:st,
    buttons:[{label:"되돌리기",fn:undo},{label:S.over?"새 경기":"다음 세트",cls:"go",fn:nextSet}]});
}
function nextSet(){
  if(S.over){newGame();return;}
  S.hist.push({s:S.score.slice(),w:S.setOver.w});
  S.score=[0,0];S.setNo++;S.rally=0;S.setOver=null;
  S.teams.forEach(T=>{T.to=2;if(S.cfg.reset){T.hits=z(9);T.lines=[];}});
  S.serve=(S.setNo-1)%2;undoStack=[];
  save();draw();K.toast(S.setNo+"세트 시작"+(isFinal()?" · "+S.cfg.final+"점 마지막 세트":"")+(six()?" · "+S.teams[S.serve].name+" 서브 "+server(S.serve):""),"",2600);
}
function newGame(){const keep=S.teams.map(T=>({name:T.name,names:T.names}));S=fresh(S.cfg,keep);undoStack=[];sel=null;K.closeModal();save();draw();K.toast("새 경기 준비 완료 (팀 이름·명단 유지)","",2000);}
function setNames(t,list){
  const T=S.teams[t],n=list.length,changed=n!==T.names.length;
  T.names=list;
  if(changed){T.cells=seq(9).map(i=>i%n);T.hits=z(9);T.lines=[];T.tot=z(12);T.pos=seq(6);}
}
function fitRoster(t){
  // 인원 방식에 맞게 명단 길이를 맞춘다 (9인제 9명, 6인제 6~12명)
  const T=S.teams[t],min=six()?6:9,max=six()?12:9;
  let list=T.names.slice(0,max);while(list.length<min)list.push("선수 "+(list.length+1));
  if(list.length!==T.names.length)setNames(t,list);
}

function drawCourt(t){
  const T=S.teams[t],p=T.pos,serving=S.serve===t;
  $("rch"+t).textContent=T.name+(serving?" · 서브 중":" · 리시브");
  $("cg"+t).innerHTML=LAYOUT.map(k=>{
    const i=p[k],isSrv=k===0&&serving,isSel=sel&&sel.t===t&&sel.kind==="pos"&&sel.k===k;
    return "<button type=\"button\" class=\"posc"+(isSrv?" srv":"")+(isSel?" sel":"")+(moved===t?" moved":"")+"\" data-pos=\""+k+"\" data-t=\""+t+"\"><span class=\"pnum\">"+(k+1)+"</span><b>"+esc(nm(T,i))+"</b>"+(isSrv?"<span class=\"stag\">서브</span>":"")+"</button>";
  }).join("");
  $("rn"+t).innerHTML=serving?"지금 서브: <b>"+esc(nm(T,p[0]))+"</b> (1번 자리)":"서브권을 가져오면 한 칸 돌고 다음 서브: <b>"+esc(nm(T,p[1]))+"</b>";
  const order=serving?p:p.slice(1).concat(p[0]);
  $("so"+t).innerHTML="<span class=\"lbl\">서브 순서</span> "+order.map((i,n)=>"<span class=\"so"+(n===0?" now":"")+"\">"+esc(nm(T,i))+"</span>").join("<span class=\"qsep\">→</span>");
  const bench=T.names.map((x,i)=>i).filter(i=>!p.includes(i));
  $("bn"+t).innerHTML=bench.length?"<span class=\"lbl\">교체 선수</span> "+bench.map(i=>"<button type=\"button\" class=\"bchip"+(sel&&sel.t===t&&sel.kind==="bench"&&sel.i===i?" sel":"")+"\" data-bench=\""+i+"\" data-t=\""+t+"\">"+esc(nm(T,i))+"</button>").join(""):"";
}
function draw(){
  const C=S.cfg;
  R.querySelectorAll("[data-fmt]").forEach(b=>b.setAttribute("aria-pressed",String(+b.dataset.fmt===C.fmt)));
  $("bombp").hidden=!C.bomb;$("bingos").hidden=!C.bingo;$("rotwrap").hidden=!six();
  $("modeBomb").checked=C.bomb;$("modeBingo").checked=C.bingo;
  $("ruleLine").textContent=C.fmt+"인제 · 랠리포인트 · "+C.target+"점"+(C.sets>1?" · "+C.sets+"세트("+need()+"선승) · 마지막 "+C.final+"점":" · 단판")+(C.deuce?" · 듀스":"");
  $("setno").innerHTML=(C.sets>1?S.setNo+"세트":"단판")+"<small>"+tgt()+"점"+(isFinal()?" · 마지막 세트":"")+"</small>";
  $("hist").innerHTML=S.hist.map((h,i)=>"<span>"+(i+1)+"세트 <b class=\"w"+h.w+"\">"+h.s[0]+":"+h.s[1]+"</b></span>").join("");
  $("nameHelp").textContent=six()?"6인제 명단은 6~12명입니다. 위에서부터 1번~6번 자리(서브 순서)로 들어가고, 7번째부터는 교체 선수입니다. 처음 들어 있는 이름은 예시예요.":"9인제 명단은 9명입니다. 처음 들어 있는 이름은 예시예요. 한 줄에 한 명씩 반 명단을 넣으세요.";
  const w=worth();
  [0,1].forEach(t=>{
    const T=S.teams[t];
    K.setVal("tname"+t,T.name);
    $("score"+t).textContent=S.score[t];
    $("serve"+t).classList.toggle("no",S.serve!==t);
    $("servet"+t).textContent=six()?"서브 · "+server(t):"서브";
    $("sets"+t).innerHTML=Array.from({length:need()},(_,i)=>"<i"+(i<T.sets?"":" class=\"off\"")+"></i>").join("");
    $("to"+t).innerHTML=[0,1].map(i=>"<i"+(i<T.to?"":" class=\"off\"")+"></i>").join("");
    $("pt"+t).innerHTML=(C.bingo?"득점 (이름 없이)":"득점")+" +"+w+(C.bingo?"<small>상대 실수 등</small>":"");
    $("bh"+t).textContent=T.name+" 빙고";$("nl"+t).textContent=T.name+" 명단 ("+T.names.length+"명)";
    const bc=$("bc"+t),nL=T.lines.length;
    bc.textContent=nL?"빙고 "+nL+"줄 · +"+nL*C.bonus+"점":"빙고 0줄 · 1줄마다 +"+C.bonus+"점";bc.classList.toggle("on",nL>0);
    const inLine=new Set();T.lines.forEach(li=>LINES[li].forEach(c=>inLine.add(c)));
    $("g"+t).innerHTML=T.cells.map((ri,c)=>{
      const n=nm(T,ri),cls="cell"+(T.hits[c]?" hit":"")+(inLine.has(c)?" line":"")+(freshCell&&freshCell.t===t&&freshCell.i===c?" fresh":"");
      return "<button type=\"button\" class=\""+cls+"\" data-cell=\""+c+"\" data-t=\""+t+"\" aria-label=\""+esc(n)+" 득점\"><span>"+esc(n)+"</span><span class=\"cnt\">"+(T.hits[c]?"×"+T.hits[c]:"")+"</span></button>";
    }).join("");
    K.setVal("nm"+t,T.names.join("\n"));
    if(six())drawCourt(t);
  });
  freshCell=null;moved=null;
  const bp=$("bombp");
  bp.classList.toggle("live",S.rally>0);bp.classList.toggle("h2",S.rally>=3&&S.rally<6);bp.classList.toggle("h3",S.rally>=6);
  $("rally").innerHTML=S.rally+"<small>회</small>";
  $("worth").textContent=w;$("best").textContent=S.best;
  $("log").innerHTML=S.log.length?S.log.slice(0,8).map(l=>{
    const T=S.teams[l.t];let d=esc(T.name);
    if(l.manual)d+=" <span class=\"x\">점수 정정</span>";
    else if(l.sub)d+=" <span class=\"x\">"+esc(l.sub)+"</span>";
    else{if(l.who)d+=" · "+esc(l.who);if(l.rally!==null&&l.rally!==undefined)d+=" <span class=\"x\">랠리 "+l.rally+"회</span>";if(l.lines)d+=" <span class=\"bg\">빙고 "+l.lines+"줄 +"+l.bonus+"</span>";if(l.rot)d+=" <span class=\"x\">· 로테이션, 서브 "+esc(l.rot)+"</span>";}
    const v=l.pts+l.bonus;
    return "<li><span class=\"p\" style=\"--c:"+(l.t?"var(--blue)":"var(--red)")+"\">"+(l.sub?"↔":(v>0?"+":"")+v)+"</span><span>"+d+" <span class=\"x\">· "+l.set+"세트</span></span></li>";
  }).join(""):"<li class=\"empty\">아직 득점이 없습니다. 득점 버튼이나 빙고판의 선수 이름을 누르면 여기에 쌓입니다.</li>";
  $("undoBtn").disabled=!undoStack.length;
  K.setVal("cfgTarget",C.target);K.setVal("cfgFinal",C.final);$("cfgSets").value=String(C.sets);$("cfgDeuce").checked=C.deuce;$("cfgReset").checked=C.reset;K.setVal("cfgBonus",C.bonus);
}
function netCross(d){if(!S.cfg.bomb||S.setOver||S.over)return;S.rally=Math.max(0,S.rally+d);if(d>0)K.snd.tick(S.rally);save();draw();}
function courtTap(t,kind,v){
  const T=S.teams[t];
  if(!sel||sel.t!==t){sel={t,kind,[kind==="pos"?"k":"i"]:v};draw();return;}
  if(kind==="pos"){
    if(sel.kind==="pos"){
      if(sel.k!==v){snap();const a=T.pos[sel.k];T.pos[sel.k]=T.pos[v];T.pos[v]=a;
        S.log.unshift({t,pts:0,bonus:0,sub:"자리 바꿈 "+(sel.k+1)+"번 ↔ "+(v+1)+"번",set:S.setNo});save();K.toast("자리를 바꿨습니다","",1400);}
    }else{snap();const out=T.pos[v];T.pos[v]=sel.i;
      S.log.unshift({t,pts:0,bonus:0,sub:"교체 "+nm(T,out)+" → "+nm(T,sel.i),set:S.setNo});save();K.toast(nm(T,out)+" 나가고 "+nm(T,sel.i)+" 들어갑니다 ("+(v+1)+"번 자리)","",2200);}
    sel=null;draw();return;
  }
  sel=(sel.kind==="bench"&&sel.i===v)?null:{t,kind:"bench",i:v};draw();
}

$("netBtn").onclick=()=>netCross(1);
$("netMinus").onclick=()=>netCross(-1);
$("netReset").onclick=()=>{S.rally=0;save();draw();};
$("serveBtn").onclick=()=>{snap();S.serve=1-S.serve;save();draw();};
$("undoBtn").onclick=undo;
$("modeBomb").onchange=e=>{S.cfg.bomb=e.target.checked;if(!S.cfg.bomb)S.rally=0;save();draw();};
$("modeBingo").onchange=e=>{S.cfg.bingo=e.target.checked;save();draw();};
K.arm($("newBtn"),"새 경기",newGame);
R.addEventListener("click",e=>{
  let b;
  if(b=e.target.closest("[data-fmt]")){const f=+b.dataset.fmt;if(f===S.cfg.fmt)return;snap();S.cfg.fmt=f;[0,1].forEach(fitRoster);sel=null;save();draw();
    K.toast(f===6?"6인제 · 명단 위에서부터 1~6번 자리로 들어갑니다":"9인제 · 명단 9명","",2400);return;}
  if(b=e.target.closest("[data-pos]")){courtTap(+b.dataset.t,"pos",+b.dataset.pos);return;}
  if(b=e.target.closest("[data-bench]")){courtTap(+b.dataset.t,"bench",+b.dataset.bench);return;}
  if(b=e.target.closest("[data-rot]")){const t=+b.dataset.rot;snap();rotate(t,+b.dataset.d);save();draw();K.toast(S.teams[t].name+" 한 칸 "+(+b.dataset.d>0?"돌림":"되돌림")+" · 1번 자리: "+server(t),"",1800);return;}
  if(b=e.target.closest("[data-cell]")){award(+b.dataset.t,+b.dataset.cell);return;}
  if(b=e.target.closest("[data-pt]")){award(+b.dataset.pt,-1);return;}
  if(b=e.target.closest("[data-minus]")){const t=+b.dataset.minus;if(S.score[t]>0&&!S.setOver&&!S.over){snap();S.score[t]--;S.log.unshift({t,pts:-1,bonus:0,lines:0,rally:null,who:null,set:S.setNo,manual:true});save();draw();}return;}
  if(b=e.target.closest("[data-to]")){const T=S.teams[+b.dataset.to];snap();if(T.to>0){T.to--;K.toast(T.name+" 타임아웃 ("+(2-T.to)+"/2)","",2400);}else T.to=2;save();draw();return;}
  if(b=e.target.closest("[data-shuf]")){const T=S.teams[+b.dataset.shuf];snap();
    const idx=K.shuf(seq(9));
    T.cells=idx.map(i=>T.cells[i]);T.hits=idx.map(i=>T.hits[i]);
    T.lines=[];LINES.forEach((L,i)=>{if(L.every(c=>T.hits[c]>0))T.lines.push(i);});
    save();draw();K.toast(T.name+" 빙고 칸을 섞었습니다","",1600);}
});
R.addEventListener("input",e=>{
  const el=e.target;
  if(el.id==="tname0"||el.id==="tname1"){const t=+el.id.slice(-1);S.teams[t].name=el.value;save();$("bh"+t).textContent=el.value+" 빙고";}
});
R.addEventListener("change",e=>{
  const el=e.target;
  if(el.id==="nm0"||el.id==="nm1"){
    const t=+el.id.slice(-1),max=six()?12:9,min=six()?6:9,list=K.parseList(el.value,max);
    while(list.length<min)list.push("선수 "+(list.length+1));
    snap();setNames(t,list);sel=null;save();draw();return;
  }
  if(!["cfgTarget","cfgFinal","cfgSets","cfgDeuce","cfgBonus","cfgReset"].includes(el.id))return;
  const C=S.cfg;
  C.target=Math.max(5,Math.min(99,+$("cfgTarget").value||25));C.final=Math.max(5,Math.min(99,+$("cfgFinal").value||15));
  C.sets=+$("cfgSets").value||3;C.deuce=$("cfgDeuce").checked;C.bonus=Math.max(0,Math.min(20,+$("cfgBonus").value||0));C.reset=$("cfgReset").checked;
  save();draw();
});
draw();
if(S.setOver||S.over)showModal();
return{
  record:makeRec,
  key(e){
    if(e.code==="Space"){e.preventDefault();netCross(1);}
    else if(e.key==="ArrowLeft"){e.preventDefault();award(0,-1);}
    else if(e.key==="ArrowRight"){e.preventDefault();award(1,-1);}
    else if(e.key==="z"||e.key==="Z")undo();
  }
};
}};
