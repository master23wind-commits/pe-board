/* ================= 스포츠 상식 퀴즈 (팀 대항 스피드 퀴즈) ================= */
MODS.quiz={name:"스포츠 퀴즈",sub:"팀 대항 스피드 퀴즈 · 규칙·역사·기술·가치",color:"var(--c-qz)",
html:`
<div class="qteams" id="qTeams"></div>
<div class="qbar">
  <div class="qno" id="qNo">준비</div>
  <div class="qtime"><div class="qclock" id="qClock">20</div><div class="qprog"><i id="qProg"></i></div></div>
  <div class="qfire" id="qFire" hidden>🔥 2배 문제</div>
</div>
<section class="qcard" id="qCard"></section>
<div class="btnrow op qctl" id="qCtl"></div>
<div class="lower qlower">
  <div class="box"><h4>문제 기록</h4><ul class="log" id="qLog"></ul></div>
  <div class="box op">
    <h4>퀴즈 설정</h4>
    <div class="cfg">
      <div class="cfgrow">
        <label>팀 수 <select id="qN"><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option></select></label>
        <label>제한 시간 <select id="qSec"><option value="10">10초</option><option value="15">15초</option><option value="20">20초</option><option value="30">30초</option><option value="60">60초</option></select></label>
        <label>문제 수 <select id="qCount"><option>10</option><option>15</option><option>20</option><option>30</option><option>50</option></select></label>
      </div>
      <div class="qnames" id="qNames"></div>
      <div class="cfgrow"><span class="qlab">진행 방식</span>
        <div class="seg" role="group" aria-label="진행 방식" id="qMode">
          <button type="button" data-qmode="buzz">스피드 버저</button><button type="button" data-qmode="all">모든 팀 풀기</button>
        </div>
      </div>
      <div class="qmodehint" id="qModeHint"></div>
      <div class="cfgrow">
        <label><input type="checkbox" id="qBonus"> 빨리 맞히면 보너스(최대 +5)</label>
        <label><input type="checkbox" id="qPen"> 틀리면 −5</label>
        <label><input type="checkbox" id="qFireOn"> 5번째 문제마다 🔥 2배</label>
      </div>
      <div class="qfilt"><span class="qlab">종목</span><div class="qchips" id="qSp"></div></div>
      <div class="qfilt"><span class="qlab">영역</span><div class="qchips" id="qCat"></div></div>
      <div class="qfilt"><span class="qlab">난이도</span><div class="qchips" id="qLv"></div></div>
      <div class="qpool" id="qPool"></div>
      <div class="btnrow"><button class="small" type="button" id="qSeenReset">출제 기록 지우기</button><button class="danger" id="qNew" type="button">새 퀴즈</button></div>
    </div>
  </div>
</div>
<div class="box op qbank">
  <h4>문제 늘리기</h4>
  <div class="qbgrid">
    <div class="qai" id="qAi" hidden>
      <div class="qsub">✨ AI로 새 문제 만들기</div>
      <div class="cfgrow">
        <label>종목 <select id="qAiSp"></select></label>
        <label>영역 <select id="qAiCat"><option value="">골고루</option><option value="r">규칙</option><option value="h">역사</option><option value="t">기술</option><option value="v">가치</option><option value="f">건강·체력</option></select></label>
        <label>난이도 <select id="qAiLv"><option value="1">쉬움</option><option value="2" selected>보통</option><option value="3">어려움</option></select></label>
        <label>개수 <select id="qAiN"><option>5</option><option selected>10</option></select></label>
      </div>
      <input id="qAiMore" maxlength="120" placeholder="더 바라는 점 (선택) 예) 중학교 1학년 수준, 수비 기술 위주로">
      <div class="btnrow"><button class="go" type="button" id="qAiGo">AI로 문제 만들기</button><button class="small" type="button" id="qAiStop" hidden>멈추기</button></div>
      <div class="qaistat" id="qAiStat"></div>
      <div class="qnote">AI가 만든 문제는 틀린 내용이 섞일 수 있어요. 수업에 쓰기 전에 아래 목록에서 한 번 훑어보고, 이상한 문제는 ✕로 지워 주세요.</div>
    </div>
    <div class="qadd">
      <div class="qsub">✍️ 직접 문제 넣기</div>
      <div class="cfgrow">
        <label>종목 <select id="qAddSp"></select></label>
        <label>영역 <select id="qAddCat"><option value="r">규칙</option><option value="h">역사</option><option value="t">기술</option><option value="v">가치</option><option value="f">건강·체력</option></select></label>
      </div>
      <textarea id="qAddTxt" rows="4" placeholder="한 줄에 한 문제, | 로 나눠 주세요.&#10;문제 | 정답 | 오답1 | 오답2 | 오답3 | 해설(선택)&#10;예) 농구 골대 높이는? | 3.05m | 2.5m | 3.5m | 4m | 바닥에서 림까지 높이예요."></textarea>
      <div class="btnrow"><button class="small" type="button" id="qAddGo">문제 추가</button></div>
    </div>
  </div>
  <div class="qmine">
    <div class="qmhead"><span id="qMineN">내 문제 0개</span><span class="btnrow"><button class="small" type="button" id="qMineCopy">내 문제 복사(백업)</button><button class="small danger" type="button" id="qMineClr">모두 지우기</button></span></div>
    <ul id="qMine"></ul>
    <div class="qnote">내 문제는 이 기기의 브라우저에 저장돼요. 다른 기기로 옮길 때는 '복사(백업)'한 글을 그 기기의 직접 문제 넣기 칸에 붙여넣으세요.</div>
  </div>
  <div class="keys"><kbd>1</kbd>~<kbd>6</kbd> 먼저 외친 팀 · <kbd>A</kbd>~<kbd>D</kbd> 그 팀이 고른 답 · <kbd>Space</kbd> 시계 멈춤/계속 · <kbd>Enter</kbd> 정답 공개/다음 문제 · <kbd>Z</kbd> 되돌리기</div>
</div>`,
init(ctx){
const $=K.$,R=ctx.root,KEY="pe-quiz",esc=K.esc;
const QC=["#ff5a3c","#38aefc","#ffcf3a","#4ade80","#b98cff","#ff9a2e"];
const TN=["빨강팀","파랑팀","노랑팀","초록팀","보라팀","주황팀"];
const LVN=["","쉬움","보통","어려움"];
const SPK=Object.keys(K.QSPORT).filter(k=>k!=="my");
let mine=K.load("pe-quiz-mine")||[];
let seen=new Set(K.load("pe-quiz-seen")||[]);
const saveMine=()=>K.save("pe-quiz-mine",mine);
const saveSeen=()=>K.save("pe-quiz-seen",[...seen]);
function getQ(id){
  if(id[0]==="b"){const r=K.QB[+id.slice(1)];return r?{sp:r[0],cat:r[1],lv:r[2],q:r[3],a:r[4],w:[r[5],r[6],r[7]],ex:r[8]}:null;}
  return mine.find(m=>m.id===id)||null;
}
function fresh(cfg){
  cfg=cfg||{n:4,names:TN.slice(),mode:"buzz",sec:20,count:20,bonus:true,pen:true,fire:true,sports:SPK.slice(),cats:["r","h","t","v","f"],lv:[1,2,3],mine:true};
  return{cfg,teams:Array.from({length:6},()=>({score:0,ok:0,ng:0})),qs:[],i:-1,phase:"setup",run:false,clock:cfg.sec*1000,buzz:-1,locked:[],marks:[],opts:[],ans:0,pick:-1,log:[]};
}
let S=K.load(KEY);if(!S||!S.cfg)S=fresh();S.run=false;
// 새로 생긴 종목·영역은 처음 한 번 자동으로 켜 준다
if(!S.cfg.v3){S.cfg.v3=true;["fs","nb","ff","hf","bc"].forEach(k=>{if(!S.cfg.sports.includes(k))S.cfg.sports.push(k);});if(!S.cfg.cats.includes("f"))S.cfg.cats.push("f");}
if(!S.cfg.v4){S.cfg.v4=true;if(!S.cfg.sports.includes("hb"))S.cfg.sports.push("hb");}
let undoStack=[],lastSave=0,lastTick=-1;
const save=()=>K.save(KEY,S);
function snap(){undoStack.push(JSON.stringify(Object.assign({},S,{run:false})));if(undoStack.length>200)undoStack.shift();}
function undo(){if(!undoStack.length)return;S=JSON.parse(undoStack.pop());S.run=false;K.closeModal();save();draw();K.toast("되돌렸습니다","",1200);}
const nT=()=>S.cfg.n;
const tname=t=>S.cfg.names[t]||TN[t];
const isFire=()=>S.cfg.fire&&(S.i+1)%5===0;

function pool(){
  const C=S.cfg,out=[];
  K.QB.forEach((r,i)=>{if(C.sports.includes(r[0])&&C.cats.includes(r[1])&&C.lv.includes(r[2]))out.push("b"+i);});
  if(C.mine)mine.forEach(m=>{if((C.sports.includes(m.sp)||m.sp==="my")&&C.cats.includes(m.cat)&&C.lv.includes(m.lv||2))out.push(m.id);});
  return out;
}
function startQuiz(){
  const P=pool();
  if(P.length<1){K.toast("조건에 맞는 문제가 없어요. 종목·영역·난이도를 더 골라 주세요","bad",2600);return;}
  let un=K.shuf(P.filter(id=>!seen.has(id)));
  if(un.length<Math.min(S.cfg.count,P.length)){
    // 안 낸 문제가 모자라면 남은 것 먼저, 나머지는 이 범위의 출제 기록을 지우고 다시 섞는다
    P.forEach(id=>seen.delete(id));
    const rest=K.shuf(P.filter(id=>!un.includes(id)));un=un.concat(rest);
    K.toast("이 범위의 문제를 모두 한 번씩 냈어요 · 처음부터 다시 섞습니다","",2600);
  }
  snap();
  S.qs=un.slice(0,Math.min(S.cfg.count,P.length));S.i=-1;S.log=[];S.mid=null;
  S.teams=Array.from({length:6},()=>({score:0,ok:0,ng:0}));
  nextQ();K.snd.whistle(1);
}
function nextQ(){
  S.i++;
  if(S.i>=S.qs.length){finish();return;}
  const q=getQ(S.qs[S.i]);
  if(!q){S.qs.splice(S.i,1);S.i--;nextQ();return;}
  const opts=K.shuf([q.a].concat(q.w.filter(Boolean)));
  S.opts=opts;S.ans=opts.indexOf(q.a);S.pick=-1;
  S.phase="ask";S.clock=S.cfg.sec*1000;S.buzz=-1;S.locked=[];S.marks=[];S.run=true;lastTick=-1;
  seen.add(S.qs[S.i]);saveSeen();
  save();draw();
  if(isFire()){K.snd.bonus();K.toast("🔥 2배 문제!","bingo",1600);}
}
function speedPts(){
  let p=10;if(S.cfg.bonus)p+=Math.ceil(5*S.clock/(S.cfg.sec*1000));
  return isFire()?p*2:p;
}
function buzz(t){
  if(S.phase!=="ask"||S.cfg.mode!=="buzz"||t>=nT())return;
  if(S.locked.includes(t)){K.toast(tname(t)+"은(는) 이번 문제 기회를 썼어요","bad",1400);return;}
  S.buzz=t;S.run=false;save();draw();K.snd.tick(3);
}
function choose(k){
  if(S.phase!=="ask")return;
  if(S.cfg.mode==="all"){K.toast("모든 팀 풀기에서는 '정답 공개' 뒤에 맞힌 팀을 눌러요","",1800);return;}
  if(S.buzz<0){K.toast("먼저 답을 외친 팀을 누르세요 (위 팀 칸 또는 숫자 키)","",1800);return;}
  snap();
  const t=S.buzz,T=S.teams[t],q=getQ(S.qs[S.i]);
  if(k===S.ans){
    const p=speedPts();T.score+=p;T.ok++;S.pick=k;
    S.log.unshift({n:S.i+1,sp:q.sp,a:q.a,t,p,ok:true});
    reveal(true);K.snd.bonus();K.bump(R.querySelector("[data-qt='"+t+"'] .qs"));K.fx.play("quiz",R.querySelector("[data-qt='"+t+"'] .qs"),{text:"+"+p,color:QC[t]});
    K.toast(tname(t)+" 정답! +"+p,"bingo",1800);
  }else{
    T.ng++;const pen=S.cfg.pen?5:0;T.score-=pen;S.locked.push(t);S.buzz=-1;
    S.log.unshift({n:S.i+1,sp:q.sp,a:q.a,t,p:-pen,ok:false,wrong:S.opts[k]});
    K.snd.stop();
    if(S.locked.length>=nT()){reveal(false);K.toast("모든 팀이 틀렸어요","bad",1600);}
    else{S.run=true;save();draw();K.toast(tname(t)+" 오답"+(pen?" −"+pen:"")+" · 다른 팀에게 기회!","bad",1800);}
  }
}
function reveal(){
  S.phase="reveal";S.run=false;save();draw();
}
function openAnswer(){
  if(S.phase!=="ask")return;snap();
  const q=getQ(S.qs[S.i]);
  if(S.cfg.mode==="buzz")S.log.unshift({n:S.i+1,sp:q.sp,a:q.a,t:-1,p:0,ok:false});
  reveal();K.snd.chime();
}
function mark(t){
  if(S.phase!=="reveal"||S.cfg.mode!=="all"||t>=nT())return;
  snap();
  const p=isFire()?20:10,T=S.teams[t],q=getQ(S.qs[S.i]);
  const on=S.marks.includes(t);
  if(on){S.marks=S.marks.filter(x=>x!==t);T.score-=p;T.ok--;}
  else{S.marks.push(t);T.score+=p;T.ok++;K.snd.chime();}
  const L=S.log.find(l=>l.n===S.i+1);
  if(L)L.teams=S.marks.slice();else S.log.unshift({n:S.i+1,sp:q.sp,a:q.a,teams:S.marks.slice(),p});
  save();draw();if(!on){K.bump(R.querySelector("[data-qt='"+t+"'] .qs"));K.fx.play("quiz",R.querySelector("[data-qt='"+t+"'] .qs"),{text:"+"+p,color:QC[t]});}
}
function timeUp(){
  S.run=false;K.snd.buzzer();
  const q=getQ(S.qs[S.i]);
  if(S.cfg.mode==="buzz"){snap();S.log.unshift({n:S.i+1,sp:q.sp,a:q.a,t:-1,p:0,ok:false});}
  reveal();K.toast("시간 끝!","",1400);
}
function finish(){
  S.phase="done";S.run=false;save();draw();
  const rank=[...Array(nT()).keys()].sort((a,b)=>S.teams[b].score-S.teams[a].score);
  const top=S.teams[rank[0]].score,win=rank.filter(t=>S.teams[t].score===top);
  setTimeout(K.snd.fanfare,200);
  K.modal({sub:"스포츠 상식 퀴즈 · "+S.qs.length+"문제",title:win.length>1?"공동 1등":tname(win[0])+" 우승",color:win.length>1?"var(--fg)":QC[win[0]],
    score:rank.slice(0,Math.min(3,nT())).map(t=>S.teams[t].score).join(" · "),
    stats:rank.map((t,i)=>"<div><b style=\"color:"+QC[t]+"\">"+(i+1)+"위 "+esc(tname(t))+"</b> "+S.teams[t].score+"점 <span style=\"color:var(--muted)\">· 정답 "+S.teams[t].ok+(S.cfg.mode==="buzz"?" · 오답 "+S.teams[t].ng:"")+"</span></div>").join(""),
    buttons:[{label:"되돌리기",fn:undo},{label:"닫기"}]});
  ctx.store(makeRec());
}
function makeRec(){
  if(!S.mid){S.mid=K.newId();save();}
  const n=nT(),d=[];
  d.push("진행: "+(S.cfg.mode==="buzz"?"스피드 버저":"모든 팀 풀기")+" · "+S.cfg.sec+"초 · "+S.qs.length+"문제");
  S.log.slice().reverse().forEach(l=>{
    const who=l.teams?(l.teams.length?l.teams.map(tname).join(", ")+" 정답":"맞힌 팀 없음"):l.t<0?"맞힌 팀 없음":tname(l.t)+(l.ok?" 정답 +"+l.p:" 오답"+(l.p?" "+l.p:""));
    d.push(l.n+"번 ["+(K.QSPORT[l.sp]||"")+"] 정답: "+l.a+" — "+who);
  });
  const T=[...Array(n).keys()];
  const top=Math.max(...T.map(t=>S.teams[t].score)),win=T.filter(t=>S.teams[t].score===top);
  return{id:S.mid,sport:"quiz",sportName:"스포츠 퀴즈",at:Date.now(),done:S.phase==="done",
    teams:T.map(t=>({name:tname(t),score:S.teams[t].score})),
    winner:S.phase==="done"?(win.length>1?"공동 1등":tname(win[0])):null,
    summary:T.map(t=>S.teams[t].score).join(" : "),details:d,
    players:T.map(t=>({team:tname(t),name:tname(t),pts:S.teams[t].score,note:"정답 "+S.teams[t].ok+(S.cfg.mode==="buzz"?" · 오답 "+S.teams[t].ng:"")}))};
}

/* ---------- 그리기 ---------- */
function drawTeams(){
  const n=nT(),ph=S.phase,C=S.cfg;
  const lead=Math.max(...[...Array(n).keys()].map(t=>S.teams[t].score));
  $("qTeams").style.setProperty("--qn",n);$("qTeams").style.setProperty("--qm",n<=3?n:n===4?2:3);
  $("qTeams").innerHTML=[...Array(n).keys()].map(t=>{
    const T=S.teams[t],cls=["qteam"];
    if(S.buzz===t)cls.push("buzz");
    if(S.locked.includes(t))cls.push("locked");
    if(C.mode==="all"&&ph==="reveal"&&S.marks.includes(t))cls.push("marked");
    if(ph==="done"&&T.score===lead)cls.push("win");
    let hint="";
    if(ph==="ask"&&C.mode==="buzz")hint=S.locked.includes(t)?"기회 끝":S.buzz===t?"답을 고르세요":"먼저 외치면 누르기";
    if(ph==="reveal"&&C.mode==="all")hint=S.marks.includes(t)?"✓ 정답":"맞혔으면 누르기";
    return "<button type=\"button\" class=\""+cls.join(" ")+"\" data-qt=\""+t+"\" style=\"--tc:"+QC[t]+"\"><span class=\"qk\">"+(t+1)+"</span><span class=\"qtn\">"+esc(tname(t))+"</span><span class=\"qs\">"+T.score+"</span><span class=\"qh op\">"+hint+"</span></button>";
  }).join("");
}
function drawClock(){
  const C=S.cfg,s=Math.ceil(S.clock/1000);
  const c=$("qClock");c.textContent=S.phase==="ask"||S.phase==="reveal"?String(s):"—";
  c.classList.toggle("low",S.phase==="ask"&&s<=5);
  $("qProg").style.width=(S.phase==="ask"||S.phase==="reveal"?100*S.clock/(C.sec*1000):0)+"%";
  $("qProg").classList.toggle("low",s<=5);
  const pb=$("qPause");if(pb){pb.textContent=S.run?"⏸ 멈춤":"▶ 계속";pb.disabled=S.buzz>=0;}
}
function drawCard(){
  const el=$("qCard"),ph=S.phase,C=S.cfg;
  $("qFire").hidden=!((ph==="ask"||ph==="reveal")&&isFire());
  if(ph==="setup"||ph==="done"){
    const P=pool(),un=P.filter(id=>!seen.has(id)).length;
    $("qNo").textContent=ph==="done"?"퀴즈 끝":"준비";
    el.className="qcard intro";
    el.innerHTML=(ph==="done"
      ?"<div class=\"qbig\">퀴즈가 끝났어요!</div><p>결과는 경기 기록 보관함에 저장됐어요. 같은 팀으로 한 판 더 하려면 아래 버튼을 누르세요.</p>"
      :"<div class=\"qbig\">팀 대항 스포츠 상식 퀴즈</div><p>"+(C.mode==="buzz"
        ?"문제가 뜨면 답을 아는 팀이 손을 들거나 외치고, 선생님이 <b>그 팀 칸</b>을 누른 뒤 <b>그 팀이 고른 답</b>을 누르면 자동으로 채점돼요. 틀리면 다른 팀에게 기회가 넘어가요."
        :"모든 팀이 화이트보드나 종이에 답을 적어요. 시간이 끝나거나 '정답 공개'를 누르면 답이 나오고, <b>맞힌 팀 칸</b>을 눌러 점수를 줘요.")+"</p>")+
      "<div class=\"qstart\"><button class=\"go\" type=\"button\" id=\"qStart\">"+(ph==="done"?"한 판 더":"퀴즈 시작")+"</button><span>"+nT()+"팀 · "+Math.min(C.count,P.length)+"문제 · "+C.sec+"초 · 출제 가능 "+P.length+"문제 (아직 안 낸 문제 "+un+")</span></div>";
    return;
  }
  const q=getQ(S.qs[S.i]);if(!q)return;
  $("qNo").innerHTML="<b>"+(S.i+1)+"</b> / "+S.qs.length;
  el.className="qcard"+(ph==="reveal"?" rev":"");
  const tag="<div class=\"qtags\"><span class=\"qtag\">"+esc(K.QSPORT[q.sp]||"기타")+"</span><span class=\"qtag\">"+esc(K.QCAT[q.cat]||"")+"</span><span class=\"qtag\">"+"★".repeat(q.lv||2)+"</span>"+(q.ai?"<span class=\"qtag ai\">AI 문제</span>":q.id?"<span class=\"qtag ai\">내 문제</span>":"")+"</div>";
  const L="ABCD";
  const opts=S.opts.map((o,k)=>{
    let c="qopt";
    if(ph==="reveal"){if(k===S.ans)c+=" right";else c+=" dim";}
    const wrongNow=S.log.some(l=>l.n===S.i+1&&l.wrong===o);
    if(wrongNow&&ph==="ask")c+=" wrong";
    return "<button type=\"button\" class=\""+c+"\" data-qo=\""+k+"\"><span class=\"ql\">"+L[k]+"</span><span>"+esc(o)+"</span></button>";
  }).join("");
  let msg="";
  if(ph==="ask"&&C.mode==="buzz")msg=S.buzz>=0?"<b style=\"color:"+QC[S.buzz]+"\">"+esc(tname(S.buzz))+"</b>의 답을 누르세요":"답을 아는 팀은 손을 들어요!";
  if(ph==="ask"&&C.mode==="all")msg="모든 팀이 답을 적어요 · 시간이 끝나면 정답 공개";
  el.innerHTML=tag+"<div class=\"qq\">"+esc(q.q)+"</div><div class=\"qopts\">"+opts+"</div>"+
    (msg?"<div class=\"qmsg\">"+msg+"</div>":"")+
    (ph==="reveal"?"<div class=\"qex\"><b>정답: "+esc(q.a)+"</b>"+(q.ex?"<span>"+esc(q.ex)+"</span>":"")+(C.mode==="all"?"<em class=\"op\">맞힌 팀 칸을 누르면 +"+(isFire()?20:10)+"점</em>":"")+"</div>":"");
}
function drawCtl(){
  const ph=S.phase;let h="";
  if(ph==="ask")h="<button class=\"small\" type=\"button\" id=\"qPause\">⏸ 멈춤</button>"+(S.buzz>=0?"<button class=\"small\" type=\"button\" id=\"qUnbuzz\">팀 선택 취소</button>":"")+"<button type=\"button\" id=\"qOpen\">정답 공개</button>";
  if(ph==="reveal")h="<button class=\"go\" type=\"button\" id=\"qNext\">"+(S.i+1>=S.qs.length?"결과 보기":"다음 문제 →")+"</button>";
  if(ph==="ask"||ph==="reveal")h+="<button class=\"small\" type=\"button\" id=\"qEnd\">여기서 끝내기</button>";
  h+="<button class=\"small\" type=\"button\" id=\"qUndo\""+(undoStack.length?"":" disabled")+">되돌리기</button>";
  $("qCtl").innerHTML=h;
}
function drawLog(){
  $("qLog").innerHTML=S.log.length?S.log.slice(0,15).map(l=>{
    let who;
    if(l.teams)who=l.teams.length?l.teams.map(t=>"<b style=\"color:"+QC[t]+"\">"+esc(tname(t))+"</b>").join(", ")+" 정답":"<span class=\"x\">맞힌 팀 없음</span>";
    else if(l.t<0)who="<span class=\"x\">맞힌 팀 없음</span>";
    else who="<b style=\"color:"+QC[l.t]+"\">"+esc(tname(l.t))+"</b> "+(l.ok?"정답 +"+l.p:"오답"+(l.p?" "+l.p:"")+(l.wrong?" <span class=\"x\">("+esc(l.wrong)+")</span>":""));
    return "<li><span class=\"p\" style=\"--c:var(--c-qz)\">"+l.n+"</span><span>"+who+" <span class=\"x\">· "+esc(K.QSPORT[l.sp]||"")+" · 답 "+esc(l.a)+"</span></span></li>";
  }).join(""):"<li class=\"empty\">퀴즈를 시작하면 문제마다 결과가 여기에 쌓여요.</li>";
}
function drawCfg(){
  const C=S.cfg;
  $("qN").value=String(C.n);$("qSec").value=String(C.sec);$("qCount").value=String(C.count);
  $("qNames").innerHTML=[...Array(C.n).keys()].map(t=>"<label style=\"--tc:"+QC[t]+"\"><i></i><input data-qname=\""+t+"\" value=\""+esc(tname(t))+"\" maxlength=\"12\" aria-label=\""+(t+1)+"번 팀 이름\"></label>").join("");
  R.querySelectorAll("[data-qmode]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.qmode===C.mode)));
  $("qModeHint").textContent=C.mode==="buzz"
    ?"먼저 손든 팀이 답할 기회를 얻어요. 정답 +10점(빠를수록 보너스), 틀리면 그 팀은 이번 문제 기회가 끝나고 다른 팀이 이어서 도전해요."
    :"모든 팀이 화이트보드에 답을 적고, 정답 공개 뒤 맞힌 팀마다 +10점. 한 팀도 소외되지 않는 방식이에요.";
  $("qBonus").checked=C.bonus;$("qPen").checked=C.pen;$("qFireOn").checked=C.fire;
  $("qBonus").disabled=C.mode!=="buzz";$("qPen").disabled=C.mode!=="buzz";
  const cnt={};K.QB.forEach(r=>{cnt[r[0]]=(cnt[r[0]]||0)+1;});mine.forEach(m=>{cnt[m.sp]=(cnt[m.sp]||0)+1;});
  $("qSp").innerHTML="<button type=\"button\" class=\"qchip all\" data-qall=\"sp\">전체</button>"+SPK.map(k=>"<button type=\"button\" class=\"qchip\" data-qsp=\""+k+"\" aria-pressed=\""+C.sports.includes(k)+"\">"+esc(K.QSPORT[k])+" <small>"+(cnt[k]||0)+"</small></button>").join("")+
    "<button type=\"button\" class=\"qchip\" data-qmine=\"1\" aria-pressed=\""+C.mine+"\">내 문제 <small>"+mine.length+"</small></button>";
  $("qCat").innerHTML=Object.keys(K.QCAT).map(k=>"<button type=\"button\" class=\"qchip\" data-qcat=\""+k+"\" aria-pressed=\""+C.cats.includes(k)+"\">"+K.QCAT[k]+"</button>").join("");
  $("qLv").innerHTML=[1,2,3].map(k=>"<button type=\"button\" class=\"qchip\" data-qlv=\""+k+"\" aria-pressed=\""+C.lv.includes(k)+"\">"+"★".repeat(k)+" "+LVN[k]+"</button>").join("");
  const P=pool(),un=P.filter(id=>!seen.has(id)).length;
  $("qPool").innerHTML="조건에 맞는 문제 <b>"+P.length+"</b>개 · 아직 안 낸 문제 <b>"+un+"</b>개 <span class=\"x\">(한 번 낸 문제는 모두 돌 때까지 다시 나오지 않아요)</span>";
}
function drawMine(){
  $("qMineN").textContent="내 문제 "+mine.length+"개"+(mine.some(m=>m.ai)?" (AI "+mine.filter(m=>m.ai).length+")":"");
  $("qMine").innerHTML=mine.length?mine.slice().reverse().map(m=>"<li><span class=\"qtag"+(m.ai?" ai":"")+"\">"+esc(K.QSPORT[m.sp]||"기타")+"</span><span class=\"mq\">"+esc(m.q)+" <b>→ "+esc(m.a)+"</b></span><button type=\"button\" class=\"small\" data-qdel=\""+esc(m.id)+"\" aria-label=\"문제 지우기\">✕</button></li>").join(""):"<li class=\"empty\">아직 없어요. AI로 만들거나 직접 넣어 보세요.</li>";
}
function draw(){drawTeams();drawCard();drawCtl();drawClock();drawLog();drawCfg();drawMine();}

/* ---------- 문제 늘리기 ---------- */
const spOpts=SPK.map(k=>"<option value=\""+k+"\">"+esc(K.QSPORT[k])+"</option>").join("");
$("qAiSp").innerHTML=spOpts;$("qAddSp").innerHTML=spOpts+"<option value=\"my\">기타</option>";
function addMine(list,ai){
  const have=new Set(K.QB.map(r=>r[3]).concat(mine.map(m=>m.q)));
  let n=0;
  list.forEach(x=>{
    if(!x||!x.q||!x.a||!Array.isArray(x.w))return;
    const w=x.w.map(s=>String(s).trim()).filter(s=>s&&s!==x.a).slice(0,3);
    const q=String(x.q).trim().slice(0,200);
    if(w.length<2||have.has(q))return;
    have.add(q);
    mine.push({id:"m"+K.newId(),sp:x.sp||"my",cat:"rhtvf".includes(x.cat)&&x.cat?x.cat:"r",lv:[1,2,3].includes(+x.lv)?+x.lv:2,q,a:String(x.a).trim().slice(0,80),w,ex:String(x.ex||"").trim().slice(0,240),ai:!!ai});n++;
  });
  saveMine();drawMine();drawCfg();drawCard();
  return n;
}
$("qAddGo").onclick=()=>{
  const sp=$("qAddSp").value,cat=$("qAddCat").value;
  const lines=$("qAddTxt").value.split("\n").map(s=>s.trim()).filter(Boolean);
  const list=lines.map(l=>{const p=l.split("|").map(s=>s.trim());if(p.length<4)return null;return{sp,cat,lv:2,q:p[0],a:p[1],w:p.slice(2,5).filter(Boolean),ex:p[5]||""};});
  const bad=list.filter(x=>!x).length;
  const n=addMine(list.filter(Boolean),false);
  if(n){$("qAddTxt").value="";}
  K.toast(n?"문제 "+n+"개를 추가했어요"+(bad?" · 형식이 맞지 않는 줄 "+bad+"개는 건너뜀":""):"추가된 문제가 없어요. '문제 | 정답 | 오답1 | 오답2' 형식인지 확인해 주세요",n?"bingo":"bad",2600);
};
$("qMineCopy").onclick=async()=>{
  if(!mine.length){K.toast("내 문제가 없어요","bad",1400);return;}
  const txt=mine.map(m=>[m.q,m.a].concat(m.w).concat([m.ex||""]).join(" | ")).join("\n");
  const ok=await K.copyText(txt);
  if(ok)K.toast("내 문제 "+mine.length+"개를 복사했어요","",1800);
  else{$("qAddTxt").value=txt;K.toast("복사가 안 돼서 직접 넣기 칸에 붙여 두었어요","",2400);}
};
K.arm($("qMineClr"),"모두 지우기",()=>{mine=[];saveMine();drawMine();drawCfg();K.toast("내 문제를 모두 지웠어요","",1600);});

let sample=null,aiCtl=null;
(async()=>{try{if(window.claude&&window.claude.use)sample=await window.claude.use("sample");}catch(e){}if(sample)$("qAi").hidden=false;})();
function aiPrompt(sp,cat,lv,n,more){
  const ex=K.QB.filter(r=>r[0]===sp).map(r=>r[3]).concat(mine.filter(m=>m.sp===sp).map(m=>m.q));
  return "너는 한국 중학교 체육 교사를 돕는 스포츠 퀴즈 출제자다. 아래 조건으로 4지선다 문제 "+n+"개를 만들어라.\n"+
  "- 종목: "+K.QSPORT[sp]+"\n- 영역: "+(cat?K.QCAT[cat]+(cat==="v"?"(스포츠맨십·페어플레이·경기 예절·안전처럼 바람직한 행동을 고르는 문제)":""):"규칙·역사·기술·가치(스포츠맨십)를 골고루")+"\n- 난이도: "+LVN[lv]+" (중학생 기준)\n"+(more?"- 교사 요청: "+more+"\n":"")+
  "- 사실이 확실하고 오래 바뀌지 않는 내용만 쓴다. 규칙은 현재 국제 연맹 공식 규칙 기준이며, 나라·대회마다 다른 규칙이나 확실하지 않은 숫자는 쓰지 않는다.\n"+
  "- 정답은 하나뿐이어야 하고, 오답 3개는 그럴듯하지만 분명히 틀려야 한다. '모두 정답' 같은 보기는 쓰지 않는다.\n"+
  "- 문제는 한 문장으로 짧게, 보기는 짧은 낱말이나 구로. 해설은 '~해요' 말투로 1~2문장, 학생이 흥미를 느낄 만한 이유나 배경을 담는다.\n"+
  "- 아래 이미 있는 문제와 같거나 거의 같은 문제는 만들지 않는다.\n"+ex.slice(0,60).map(s=>"  · "+s).join("\n")+"\n"+
  "JSON 배열만 출력한다. 각 원소: {\"q\":문제, \"a\":정답, \"w\":[오답1,오답2,오답3], \"ex\":해설, \"cat\":\"r|h|t|v\"(규칙|역사|기술|가치), \"lv\":"+lv+"}";
}
$("qAiGo").onclick=async()=>{
  if(!sample)return;
  const sp=$("qAiSp").value,cat=$("qAiCat").value,lv=+$("qAiLv").value,n=+$("qAiN").value,more=$("qAiMore").value.trim();
  aiCtl=new AbortController();
  $("qAiGo").disabled=true;$("qAiStop").hidden=false;$("qAiStat").textContent="AI가 "+K.QSPORT[sp]+" 문제를 만들고 있어요… (보통 20초~1분)";
  try{
    let data=await sample.json(aiPrompt(sp,cat,lv,n,more),{signal:aiCtl.signal,modelTier:"default",cache:false});
    if(data&&!Array.isArray(data))data=data.questions||data.items||[];
    const got=addMine((data||[]).map(x=>Object.assign({},x,{sp,cat:x.cat||cat||"r",lv:x.lv||lv})),true);
    $("qAiStat").textContent=got?"새 문제 "+got+"개를 내 문제에 넣었어요. 아래 목록에서 확인해 주세요.":"쓸 수 있는 문제를 받지 못했어요. 한 번 더 눌러 보세요.";
    if(got)K.toast("AI 문제 "+got+"개 추가","bingo",2000);
  }catch(e){
    const c=e&&e.code;
    $("qAiStat").textContent=c==="cancelled"?"멈췄어요.":c==="not_granted"?"AI 사용을 허락하지 않아 만들 수 없어요.":c==="rate_limited"?"요청이 많아요. 잠시 뒤에 다시 눌러 주세요.":"문제를 만들지 못했어요. 잠시 뒤 다시 시도해 주세요.";
    if(c==="not_granted")$("qAi").hidden=true;
  }finally{$("qAiGo").disabled=false;$("qAiStop").hidden=true;aiCtl=null;}
};
$("qAiStop").onclick=()=>{if(aiCtl)aiCtl.abort();};

/* ---------- 이벤트 ---------- */
K.arm($("qNew"),"새 퀴즈",()=>{const c=S.cfg;S=fresh(c);undoStack=[];K.closeModal();save();draw();K.toast("새 퀴즈 준비 완료","",1500);});
K.arm($("qSeenReset"),"출제 기록 지우기",()=>{seen=new Set();saveSeen();drawCfg();drawCard();K.toast("모든 문제를 처음부터 다시 낼 수 있어요","",1800);});
R.addEventListener("click",e=>{
  let b;
  if(b=e.target.closest("[data-qt]")){const t=+b.dataset.qt;if(S.phase==="ask")buzz(t);else if(S.phase==="reveal")mark(t);return;}
  if(b=e.target.closest("[data-qo]")){choose(+b.dataset.qo);return;}
  if(b=e.target.closest("#qStart")){startQuiz();return;}
  if(b=e.target.closest("#qOpen")){openAnswer();return;}
  if(b=e.target.closest("#qNext")){nextQ();return;}
  if(b=e.target.closest("#qPause")){S.run=!S.run;save();drawClock();return;}
  if(b=e.target.closest("#qUnbuzz")){S.buzz=-1;S.run=true;save();draw();return;}
  if(b=e.target.closest("#qEnd")){snap();S.qs=S.qs.slice(0,S.i+1);if(S.phase==="ask")reveal();finish();return;}
  if(b=e.target.closest("#qUndo")){undo();return;}
  if(b=e.target.closest("[data-qmode]")){if(S.phase==="ask"){K.toast("문제를 푸는 중에는 바꿀 수 없어요","bad",1500);return;}S.cfg.mode=b.dataset.qmode;save();draw();return;}
  if(b=e.target.closest("[data-qall]")){const C=S.cfg;C.sports=C.sports.length===SPK.length?[]:SPK.slice();save();drawCfg();drawCard();return;}
  if(b=e.target.closest("[data-qsp]")){const k=b.dataset.qsp,C=S.cfg;C.sports=C.sports.includes(k)?C.sports.filter(x=>x!==k):C.sports.concat(k);save();drawCfg();drawCard();return;}
  if(b=e.target.closest("[data-qmine]")){S.cfg.mine=!S.cfg.mine;save();drawCfg();drawCard();return;}
  if(b=e.target.closest("[data-qcat]")){const k=b.dataset.qcat,C=S.cfg;C.cats=C.cats.includes(k)?C.cats.filter(x=>x!==k):C.cats.concat(k);save();drawCfg();drawCard();return;}
  if(b=e.target.closest("[data-qlv]")){const k=+b.dataset.qlv,C=S.cfg;C.lv=C.lv.includes(k)?C.lv.filter(x=>x!==k):C.lv.concat(k);save();drawCfg();drawCard();return;}
  if(b=e.target.closest("[data-qdel]")){const id=b.dataset.qdel;mine=mine.filter(m=>m.id!==id);saveMine();drawMine();drawCfg();return;}
});
R.addEventListener("input",e=>{const el=e.target;if(el.dataset.qname!=null){S.cfg.names[+el.dataset.qname]=el.value.trim()||TN[+el.dataset.qname];save();drawTeams();drawLog();}});
R.addEventListener("change",e=>{
  const el=e.target,C=S.cfg;
  if(el.id==="qN"){C.n=+el.value;S.buzz=-1;S.locked=S.locked.filter(t=>t<C.n);S.marks=S.marks.filter(t=>t<C.n);save();draw();}
  else if(el.id==="qSec"){C.sec=+el.value;if(S.phase!=="ask")S.clock=C.sec*1000;save();draw();}
  else if(el.id==="qCount"){C.count=+el.value;save();drawCard();}
  else if(el.id==="qBonus"||el.id==="qPen"||el.id==="qFireOn"){C.bonus=$("qBonus").checked;C.pen=$("qPen").checked;C.fire=$("qFireOn").checked;save();draw();}
});
draw();
return{
  record:makeRec,
  tick(dt){
    if(!S.run||S.phase!=="ask"||S.buzz>=0)return;
    S.clock=Math.max(0,S.clock-dt);
    const s=Math.ceil(S.clock/1000);
    if(s<=5&&s>0&&s!==lastTick){lastTick=s;K.snd.tick(s);}
    if(S.clock<=0){timeUp();return;}
    drawClock();
  },
  key(e){
    const c=e.code||"";
    if(c==="Space"){e.preventDefault();if(S.phase==="ask"&&S.buzz<0){S.run=!S.run;save();drawClock();}return;}
    if(c==="Enter"||c==="NumpadEnter"){e.preventDefault();if(S.phase==="ask")openAnswer();else if(S.phase==="reveal")nextQ();else if(S.phase==="setup"||S.phase==="done")startQuiz();return;}
    let m=c.match(/^(?:Digit|Numpad)([1-6])$/);if(m){const t=+m[1]-1;if(S.phase==="ask")buzz(t);else if(S.phase==="reveal")mark(t);return;}
    m=c.match(/^Key([A-D])$/);if(m){choose("ABCD".indexOf(m[1]));return;}
    if(c==="KeyZ")undo();
  },
  destroy(){if(aiCtl)aiCtl.abort();if(S.run){S.run=false;save();}}
};
}};
