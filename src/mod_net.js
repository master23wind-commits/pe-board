/* ================= 네트 종목: 탁구 · 배드민턴 · 피클볼 ================= */
function makeNet(D){
return {name:D.name,sub:D.sub,color:D.color,
html:`
${D.kind==="bd"?'<div class="bdteam" id="bdTeam" hidden></div>':''}
<div class="board" id="nboard">
  <section class="team" data-t="0">
    <input class="tname" id="tname0" aria-label="선수 또는 팀 이름">
    ${D.kind==="bd"?'<div class="tpl" id="tpl0" hidden></div>':''}
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
    ${D.kind==="bd"?'<button class="go op" id="bdReveal" type="button" hidden>오더 공개</button><div class="bdtip" id="bdTip" hidden aria-live="polite"><span class="c" id="bdTipC"></span><p id="bdTipT"></p></div>':''}
    <div class="btnrow op">
      <button class="small" id="srvBtn" type="button">서브 바꾸기</button>
      <button class="small" id="flipBtn" type="button">좌우 바꾸기</button>
      <button class="small" id="undoBtn" type="button">되돌리기</button>
    </div>
  </section>
  <section class="team" data-t="1">
    <input class="tname" id="tname1" aria-label="선수 또는 팀 이름">
    ${D.kind==="bd"?'<div class="tpl" id="tpl1" hidden></div>':''}
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
        ${D.kind==="bd"?'<label><input id="cfgTips" type="checkbox"> 득점할 때 배드민턴 한마디(기술·전술·규칙·역사)</label>':''}
        ${D.kind==="pb"?'<label><input id="cfgDbl" type="checkbox"> 복식</label><label><input id="cfgRally" type="checkbox"> 랠리 스코어링</label>':''}
      </div>
      <div class="keys">${D.help}<br><kbd>←</kbd> 왼쪽 득점 · <kbd>→</kbd> 오른쪽 득점 · <kbd>S</kbd> 서브 바꾸기 · <kbd>Z</kbd> 되돌리기<br>
        첫 서브는 경기 시작 전에 '서브 바꾸기'로 정하세요. 게임이 끝나거나 마지막 게임 중간 교대 시점이 되면 화면 좌우도 자동으로 바뀝니다.</div>
      <div><button class="danger" id="newBtn" type="button">새 경기</button></div>
    </div>
  </div>
</div>
${D.kind==="bd"?'<div class="box op bdtm" id="bdTm"></div><div class="modal bdom" id="bdOrd" hidden role="dialog" aria-modal="true"><div class="card" id="bdOrdCard"></div></div>':''}`,
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
/* ---------- 배드민턴: 한마디 · 단체전 · 비공개 오더 ---------- */
const BD=D.kind==="bd";
const TIPQ="pe-bd-tipq";
function showTip(){
  if(!BD||!K.BD_TIPS)return;const box=$("bdTip");
  if(S.cfg.tips===false){box.hidden=true;return;}
  let q=K.load(TIPQ);if(!Array.isArray(q)||!q.length)q=K.shuf(K.BD_TIPS.map((_,i)=>i));
  const i=q.shift();K.save(TIPQ,q);const tp=K.BD_TIPS[i];if(!tp)return;
  $("bdTipC").textContent=K.BD_TIPCAT[tp[0]]||"";$("bdTipC").dataset.c=tp[0];$("bdTipT").textContent=tp[1];
  box.hidden=false;box.classList.remove("on");void box.offsetWidth;box.classList.add("on");
}
function teamNew(){return{on:true,slots:["S","D","S"],rule:"decide",blind:false,reveal:"all",ros:[K.EX10[0].slice(0,6),K.EX10[1].slice(0,6)],ord:[[],[]],sub:[false,false],shown:-1,cur:0,res:[],over:null,rid:null};}
const TM=()=>S.team&&S.team.on?S.team:null;
const tNeed=T=>Math.floor(T.slots.length/2)+1;
const tWins=T=>[0,1].map(t=>T.res.filter(r=>r.w===t).length);
function slotName(T,i){const k=T.slots[i],n=T.slots.slice(0,i+1).filter(x=>x===k).length;return n+(k==="D"?"복식":"단식");}
const slotSize=k=>k==="D"?2:1;
function ordOf(T,t,i){const o=(T.ord[t]||[])[i];return Array.isArray(o)?o:[];}
function filled(T,t,i){const o=ordOf(T,t,i);return o.length===slotSize(T.slots[i])&&o.every(Boolean);}
const isShown=(T,i)=>!T.blind||T.shown>=i;
function pnames(T,t,i){return ordOf(T,t,i).filter(Boolean).join(" · ");}
function teamReady(){const T=TM();if(!T)return true;if(T.over)return false;
  if(!filled(T,0,T.cur)||!filled(T,1,T.cur))return T.blind?"두 팀 모두 비공개 오더를 제출해 주세요":"단체전 오더에서 이번 경기 선수를 정해 주세요";
  if(!isShown(T,T.cur))return "오더를 공개해 주세요";return true;}
function ordWarn(T,t){
  const w=[],seen={S:{},D:{}};
  T.slots.forEach((k,i)=>{const o=ordOf(T,t,i).filter(Boolean);
    if(k==="D"&&o.length===2&&o[0]===o[1])w.push(slotName(T,i)+"에 같은 선수가 두 번 들어갔어요");
    o.forEach(n=>{if(seen[k][n])w.push(n+" 선수가 "+(k==="D"?"복식":"단식")+"에 두 번 나와요");seen[k][n]=1;});});
  return [...new Set(w)];
}
function ordSelects(T,t,i,src,attr){
  const o=(src[i]||[]),n=slotSize(T.slots[i]);let h="";
  for(let k=0;k<n;k++)h+="<select "+attr+"=\""+(attr==="data-bord"?"":t+":")+i+":"+k+"\"><option value=\"\">선수 고르기</option>"+T.ros[t].map(nm=>"<option"+(o[k]===nm?" selected":"")+">"+esc(nm)+"</option>").join("")+"</select>";
  return h;
}
function drawTeam(){
  if(!BD)return;const T=TM(),box=$("bdTm"),strip=$("bdTeam");
  [0,1].forEach(t=>{const el=$("tpl"+t);if(!T){el.hidden=true;return;}el.hidden=false;
    const ok=filled(T,t,T.cur)&&isShown(T,T.cur);el.innerHTML=T.over?"<span>단체전 종료</span>":"<span>"+esc(slotName(T,T.cur))+"</span> "+(false?"":ok?"<b>"+esc(pnames(T,t,T.cur))+"</b>":T.blind?"<b class=\"hid\">비공개</b>":"<b class=\"hid\">선수 미정</b>");});
  const rv=$("bdReveal");
  if(!T){strip.hidden=true;rv.hidden=true;
    box.innerHTML="<h4>단체전</h4><p class=\"bdh\">여러 경기(단식·복식)를 이어서 치러 이긴 경기 수로 승부를 가리는 방식이에요. 팀 명단과 오더(누가 몇 번째 경기에 나갈지)를 정하고, 상대 오더를 모르게 하는 비공개 오더도 쓸 수 있어요.</p><div class=\"btnrow\"><button type=\"button\" class=\"go\" id=\"bdTmOn\">단체전 모드 켜기</button></div>";return;}
  const W=tWins(T),n=T.slots.length,locked=T.res.length>0||S.score[0]+S.score[1]>0||S.hist.length>0;
  strip.hidden=false;
  strip.innerHTML="<div class=\"bdt-top\"><span class=\"lbl\">단체전</span><b class=\"r\">"+esc(S.names[0])+"</b><span class=\"sc\">"+W[0]+" : "+W[1]+"</span><b class=\"b\">"+esc(S.names[1])+"</b><span class=\"lbl\">"+(T.over?"종료":(T.cur+1)+"경기 / "+n+" · "+esc(slotName(T,T.cur)))+"</span></div><div class=\"bdt-pills\">"+
    T.slots.map((k,i)=>{const r=T.res[i];return "<span class=\"pill"+(i===T.cur&&!T.over?" now":"")+(r?" w"+r.w:"")+"\">"+esc(slotName(T,i))+(r?" · "+esc(S.names[r.w])+" 승":i===T.cur&&!T.over?" · 진행":"")+"</span>";}).join("")+"</div>";
  rv.hidden=!(T.blind&&T.reveal==="each"&&!T.over&&T.sub[0]&&T.sub[1]&&T.shown<T.cur);
  rv.textContent=slotName(T,T.cur)+" 오더 공개";
  let h="<div class=\"bdh-row\"><h4>단체전</h4><div class=\"btnrow\"><button type=\"button\" class=\"small danger\" id=\"bdTmNew\">새 단체전</button><button type=\"button\" class=\"small\" id=\"bdTmOff\">단체전 끄기</button></div></div>";
  h+="<div class=\"cfgrow\"><label>경기 수 <select id=\"bdN\""+(locked?" disabled":"")+">"+[3,5,7].map(v=>"<option"+(v===n?" selected":"")+">"+v+"</option>").join("")+"</select></label>";
  h+="<span class=\"bdslots\">"+T.slots.map((k,i)=>"<label>"+(i+1)+"경기 <select data-bslot=\""+i+"\""+(locked?" disabled":"")+"><option value=\"S\""+(k==="S"?" selected":"")+">단식</option><option value=\"D\""+(k==="D"?" selected":"")+">복식</option></select></label>").join("")+"</span></div>";
  h+="<div class=\"cfgrow\"><label>승부 <select id=\"bdRule\"><option value=\"decide\""+(T.rule==="decide"?" selected":"")+">과반을 먼저 이기면 끝("+tNeed(T)+"승)</option><option value=\"all\""+(T.rule==="all"?" selected":"")+">모든 경기 진행</option></select></label>";
  h+="<label>오더 <select id=\"bdBlind\""+(locked?" disabled":"")+"><option value=\"0\""+(!T.blind?" selected":"")+">공개 오더</option><option value=\"1\""+(T.blind?" selected":"")+">비공개 오더</option></select></label>";
  if(T.blind)h+="<label>공개 시점 <select id=\"bdReveal2\""+(locked&&T.shown>=0?" disabled":"")+"><option value=\"all\""+(T.reveal==="all"?" selected":"")+">두 팀 제출 뒤 한 번에</option><option value=\"each\""+(T.reveal==="each"?" selected":"")+">경기마다 시작 직전에</option></select></label>";
  h+="</div>";
  h+="<div class=\"names\">"+[0,1].map(t=>"<div><div class=\"nh\"><span>"+esc(S.names[t])+" 명단 ("+T.ros[t].length+"명)</span></div><textarea data-bros=\""+t+"\" aria-label=\""+esc(S.names[t])+" 명단\""+(T.blind&&T.sub[t]&&T.shown<0?"":"")+">"+esc(T.ros[t].join("\n"))+"</textarea></div>").join("")+"</div>";
  if(!T.blind){
    h+="<table class=\"bdo\"><thead><tr><th>경기</th><th style=\"color:var(--red)\">"+esc(S.names[0])+"</th><th style=\"color:var(--blue)\">"+esc(S.names[1])+"</th><th>결과</th></tr></thead><tbody>"+
      T.slots.map((k,i)=>{const r=T.res[i],dis=i<T.cur||T.over;return "<tr"+(i===T.cur&&!T.over?" class=\"now\"":"")+"><td>"+esc(slotName(T,i))+"</td>"+[0,1].map(t=>"<td>"+(dis?esc(pnames(T,t,i)||"—"):ordSelects(T,t,i,T.ord[t],"data-ord"))+"</td>").join("")+"<td>"+(r?esc(S.names[r.w])+" "+r.g[0]+":"+r.g[1]:"")+"</td></tr>";}).join("")+"</tbody></table>";
  }else{
    h+="<div class=\"bdsub\">"+[0,1].map(t=>"<div class=\"bdsubc"+(T.sub[t]?" done":"")+"\"><b style=\"color:"+(t?"var(--blue)":"var(--red)")+"\">"+esc(S.names[t])+"</b> "+(T.sub[t]?"오더 제출 완료 ✓":"오더 아직")+(T.shown<0?"<button type=\"button\" class=\"small\" data-bopen=\""+t+"\">"+(T.sub[t]?"다시 입력":"오더 입력")+"</button>":"")+"</div>").join("")+"</div>";
    if(T.reveal==="all"&&T.shown<0)h+="<div class=\"btnrow\"><button type=\"button\" class=\"go\" id=\"bdShowAll\""+(T.sub[0]&&T.sub[1]?"":" disabled")+">오더 공개</button></div><p class=\"bdh\">각 팀 주장이 차례로 '오더 입력'을 눌러 몰래 정해요. 입력하는 동안 상대 팀은 화면을 보지 않게 해 주세요. 두 팀이 모두 제출하면 공개할 수 있어요.</p>";
    else if(T.reveal==="each"&&T.shown<0)h+="<p class=\"bdh\">두 팀이 모두 제출하면 경기마다 시작 직전에 그 경기 대진만 공개돼요.</p>";
    h+="<table class=\"bdo\"><thead><tr><th>경기</th><th style=\"color:var(--red)\">"+esc(S.names[0])+"</th><th style=\"color:var(--blue)\">"+esc(S.names[1])+"</th><th>결과</th></tr></thead><tbody>"+
      T.slots.map((k,i)=>{const r=T.res[i],sh=isShown(T,i);return "<tr"+(i===T.cur&&!T.over?" class=\"now\"":"")+"><td>"+esc(slotName(T,i))+"</td>"+[0,1].map(t=>"<td>"+(sh?esc(pnames(T,t,i)||"—"):"<span class=\"hid\">?</span>")+"</td>").join("")+"<td>"+(r?esc(S.names[r.w])+" "+r.g[0]+":"+r.g[1]:"")+"</td></tr>";}).join("")+"</tbody></table>";
  }
  const warns=T.blind&&T.shown<0?[]:[0,1].flatMap(t=>ordWarn(T,t).map(w=>S.names[t]+": "+w));
  if(warns.length)h+="<p class=\"bdwarn\">⚠ "+warns.map(esc).join("<br>⚠ ")+"</p>";
  h+="<p class=\"bdh\">같은 선수가 단식에 두 번, 복식에 두 번 나오면 경고만 보여 줘요(대회 규정에 맞게 조절하세요). 한 경기가 끝나면 결과 창의 '다음 경기'로 넘어가요.</p>";
  box.innerHTML=h;
}
let draft=null,draftT=0;
function openOrd(t){
  const T=TM();if(!T)return;draftT=t;draft=T.slots.map((_,i)=>ordOf(T,t,i).slice());
  drawOrd();$("bdOrd").hidden=false;
}
function drawOrd(){
  const T=TM(),t=draftT,card=$("bdOrdCard");
  let h="<p>비공개 오더</p><h2 style=\"color:"+(t?"var(--blue)":"var(--red)")+"\">"+esc(S.names[t])+" 오더</h2><p>상대 팀은 화면을 보지 마세요. 제출하면 상대에게는 보이지 않아요.</p><div class=\"bdog\">";
  T.slots.forEach((k,i)=>{h+="<div class=\"bdor\"><span>"+esc(slotName(T,i))+"</span>"+ordSelects(T,t,i,draft,"data-bord")+"</div>";});
  h+="</div>";
  const tmp={slots:T.slots,ord:[[],[]]};tmp.ord[t]=draft;const w=ordWarn(tmp,t);
  if(w.length)h+="<p class=\"bdwarn\">⚠ "+w.map(esc).join("<br>⚠ ")+"</p>";
  const all=T.slots.every((k,i)=>(draft[i]||[]).length===slotSize(k)&&(draft[i]||[]).every(Boolean));
  h+="<div class=\"row\"><button type=\"button\" id=\"bdOrdCancel\">취소</button><button type=\"button\" class=\"go\" id=\"bdOrdOk\""+(all?"":" disabled")+">제출</button></div>";
  card.innerHTML=h;
}
function closeOrd(){$("bdOrd").hidden=true;$("bdOrdCard").innerHTML="";draft=null;}
function revealCur(){const T=TM();if(!T)return;snap();T.shown=T.reveal==="all"?T.slots.length-1:T.cur;save();draw();
  K.snd.fanfare();K.toast(T.reveal==="all"?"오더 공개!":slotName(T,T.cur)+" · "+pnames(T,0,T.cur)+" vs "+pnames(T,1,T.cur),"bingo",3200);
  [0,1].forEach(t=>{const el=$("tpl"+t);if(el){el.classList.remove("pop");void el.offsetWidth;el.classList.add("pop");}});}
function teamRec(){
  const T=TM();if(!T)return null;if(!T.rid)T.rid=K.newId();const W=tWins(T);
  return{id:T.rid,sport:"bd",sportName:"배드민턴 단체전",at:Date.now(),done:!!T.over,teams:S.names.map((n,i)=>({name:n,score:W[i]})),
    winner:T.over?S.names[T.over.w]:null,summary:W[0]+" : "+W[1],
    details:[T.slots.length+"경기("+T.slots.map((k,i)=>slotName(T,i)).join("·")+")"+(T.blind?" · 비공개 오더":"")].concat(T.res.map((r,i)=>slotName(T,i)+" "+pnames(T,0,i)+" vs "+pnames(T,1,i)+" → "+S.names[r.w]+" 승 ("+r.sc+")")),
    players:[]};
}
function teamModal(){
  const T=TM(),W=tWins(T);
  K.modal({sub:"단체전 종료",title:S.names[T.over.w]+" 승리",color:T.over.w?"var(--blue)":"var(--red)",score:W[0]+" : "+W[1],
    stats:T.res.map((r,i)=>"<div>"+esc(slotName(T,i))+" · "+esc(pnames(T,0,i))+" vs "+esc(pnames(T,1,i))+" → <b>"+esc(S.names[r.w])+"</b> ("+esc(r.sc)+")</div>").join(""),
    buttons:[{label:"되돌리기",fn:undo},{label:"닫기"}]});
}
function teamNext(){
  const T=TM();if(!T||!S.over||T.over)return;snap();
  const gs=S.hist.map(h=>h.s).concat([S.score]);
  T.res[T.cur]={w:S.over.w,g:S.games.slice(),sc:gs.map(x=>x[0]+":"+x[1]).join(", ")};
  const W=tWins(T),need=tNeed(T);
  const done=T.cur>=T.slots.length-1||(T.rule==="decide"&&Math.max(...W)>=need);
  K.closeModal();
  if(done){T.over={w:W[0]>W[1]?0:1};save();draw();ctx.store(teamRec());setTimeout(K.snd.fanfare,200);teamModal();return;}
  T.cur++;
  Object.assign(S,{score:[0,0],games:[0,0],gameNo:1,hist:[],gameFirst:0,flip:false,switched:false,gameOver:null,over:null,log:[],mid:null});resetServe(S);
  save();draw();ctx.store(teamRec());
  const r=teamReady();K.toast(slotName(T,T.cur)+" 시작"+(r===true?" · "+pnames(T,0,T.cur)+" vs "+pnames(T,1,T.cur):" · "+r),"",3000);
}
function ttServer(){
  const p=S.cfg.pts,n=S.score[0]+S.score[1];
  const deuce=S.score[0]>=p-1&&S.score[1]>=p-1;
  const idx=deuce?(p-1)+(n-2*(p-1)):Math.floor(n/2);
  return {who:(S.gameFirst+idx)%2,deuce,nth:deuce?1:(n%2)+1};
}

function point(t){
  if(S.gameOver||S.over)return;
  {const r=teamReady();if(r!==true){K.toast(r,"bad",2200);return;}}
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
  if(BD)showTip();
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
  const T=TM();
  return{id:S.mid,sport:D.id,sportName:D.name+(T?" 단체전 "+(T.cur+1)+"경기("+slotName(T,T.cur)+")":""),at:Date.now(),done:!!S.over,
    teams:S.names.map((n,i)=>({name:T?n+"("+pnames(T,i,T.cur)+")":n,score:S.games[i]})),winner:S.over?S.names[S.over.w]:null,
    summary:S.games[0]+" : "+S.games[1]+" ("+gs.map(s=>s[0]+":"+s[1]).join(", ")+")",
    details:[S.cfg.pts+"점 "+(S.cfg.games>1?S.cfg.games+"게임":"단판")+(extra?" · "+extra:"")].concat(gs.map((s,i)=>(i+1)+"게임 "+s[0]+":"+s[1])),players:[]};
}
function showModal(){
  if(TM()&&TM().over){teamModal();return;}
  const w=(S.over||S.gameOver).w;
  const hs=S.hist.map((h,i)=>(i+1)+"게임 "+h.s[0]+":"+h.s[1]).join(" · ");
  K.modal({sub:S.over?"경기 종료 · 게임 "+S.games[0]+" : "+S.games[1]:S.gameNo+"게임 종료",title:S.names[w]+(S.over?" 승리":" "+S.gameNo+"게임 승리"),color:w?"var(--blue)":"var(--red)",
    score:S.score[0]+" : "+S.score[1],stats:hs?"<div style=\"color:var(--muted)\">"+esc(hs)+"</div>":"",
    buttons:[{label:"되돌리기",fn:undo},TM()&&S.over?{label:"다음 경기",cls:"go",fn:teamNext}:{label:S.over?"새 경기":"다음 게임",cls:"go",fn:nextGame}]});
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
function newGame(){
  const T=TM();
  if(T){const nt=Object.assign({},T,{cur:0,res:[],over:null,rid:null,shown:T.blind?-1:T.shown,ord:T.blind?[[],[]]:T.ord,sub:[false,false]});S=fresh(S.cfg,S.names);S.team=nt;undoStack=[];K.closeModal();save();draw();K.toast("새 단체전 준비 완료"+(nt.blind?" · 오더를 다시 제출하세요":""),"",2000);return;}
  S=fresh(S.cfg,S.names);undoStack=[];K.closeModal();save();draw();K.toast("새 경기 준비 완료","",1600);}

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
  if(BD){$("cfgTips").checked=C.tips!==false;if(C.tips===false)$("bdTip").hidden=true;drawTeam();}
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
  if(BD&&teamClick(e))return;
  if(b=e.target.closest("[data-minus]")){const t=+b.dataset.minus;if(S.score[t]>0&&!S.gameOver&&!S.over){snap();S.score[t]--;if(D.kind==="tt")S.serve=ttServer().who;save();draw();}return;}
});
R.addEventListener("input",e=>{const el=e.target;if(el.id==="tname0"||el.id==="tname1"){S.names[+el.id.slice(-1)]=el.value;save();}});
R.addEventListener("change",e=>{
  const id=e.target.id;
  if(id==="cfgTips"){S.cfg.tips=e.target.checked;save();if(e.target.checked)showTip();else $("bdTip").hidden=true;return;}
  if(BD&&teamChange(e))return;
  if(id==="cfgFx"){K.fx.set(e.target.checked);if(e.target.checked)K.fx.burst($("score0"),"#ff5a7a","효과 켜짐");return;}
  if(!["cfgPts","cfgGames","cfgDbl","cfgRally"].includes(id))return;
  const C=S.cfg;C.pts=+$("cfgPts").value;C.games=+$("cfgGames").value;
  if(D.kind==="pb"){C.dbl=$("cfgDbl").checked;C.rally=$("cfgRally").checked;if(S.score[0]+S.score[1]===0)resetServe(S);}
  save();draw();
});
function teamClick(e){
  let b;const T=TM();
  if(e.target.closest("#bdTmOn")){snap();S.team=teamNew();save();draw();K.toast("단체전 모드 · 아래에서 경기 구성과 오더를 정하세요","",2600);return true;}
  if(e.target.closest("#bdTmOff")){snap();if(S.team)S.team.on=false;save();draw();K.toast("단체전 모드를 껐어요","",1600);return true;}
  if(e.target.closest("#bdShowAll")||e.target.closest("#bdReveal")){revealCur();return true;}
  if(b=e.target.closest("[data-bopen]")){openOrd(+b.dataset.bopen);return true;}
  if(e.target.closest("#bdOrdCancel")){closeOrd();return true;}
  if(e.target.closest("#bdOrdOk")){if(!T||!draft)return true;snap();T.ord[draftT]=draft.map(x=>x.slice());T.sub[draftT]=true;const nm=S.names[draftT];closeOrd();save();draw();K.toast(nm+" 오더 제출 완료 (비공개)","",2000);return true;}
  if(e.target===$("bdOrd")){return true;}
  return false;
}
function teamChange(e){
  const el=e.target,T=TM();if(!T)return false;
  if(el.id==="bdN"){snap();const n=+el.value,sl=T.slots.slice(0,n);while(sl.length<n)sl.push(sl.length%2?"D":"S");T.slots=sl;T.ord=[T.ord[0].slice(0,n),T.ord[1].slice(0,n)];save();draw();return true;}
  if(el.dataset.bslot!=null){snap();const i=+el.dataset.bslot;T.slots[i]=el.value;T.ord[0][i]=[];T.ord[1][i]=[];save();draw();return true;}
  if(el.id==="bdRule"){snap();T.rule=el.value;save();draw();return true;}
  if(el.id==="bdBlind"){snap();T.blind=el.value==="1";T.ord=[[],[]];T.sub=[false,false];T.shown=-1;save();draw();if(T.blind)K.toast("비공개 오더 · 각 팀이 따로 오더를 입력해요","",2400);return true;}
  if(el.id==="bdReveal2"){snap();T.reveal=el.value;save();draw();return true;}
  if(el.dataset.bros!=null){const t=+el.dataset.bros,list=K.parseList(el.value,20);if(!list.length){draw();return true;}snap();T.ros[t]=list;
    T.ord[t]=T.ord[t].map(o=>(o||[]).map(n=>list.includes(n)?n:""));save();draw();return true;}
  if(el.dataset.ord!=null){const [t,i,k]=el.dataset.ord.split(":").map(Number);snap();T.ord[t][i]=(T.ord[t][i]||[]).slice();T.ord[t][i][k]=el.value;save();draw();return true;}
  if(el.dataset.bord!=null&&draft){const [i,k]=el.dataset.bord.split(":").map(Number);draft[i]=(draft[i]||[]).slice();draft[i][k]=el.value;drawOrd();return true;}
  return false;
}
draw();
if(BD&&S.cfg.tips!==false)showTip();
if(S.gameOver||S.over)showModal();
return{
  record:makeRec,
  key(e){
    if(BD&&!$("bdOrd").hidden){if(e.key==="Escape")closeOrd();return;}
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
