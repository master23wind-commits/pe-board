/* ================= 보치아 ================= */
MODS.boccia={name:"보치아",sub:"빨강 vs 파랑 · 표적구(잭) · 엔드별 점수 · 다음 투구 안내 · 빙고",color:"var(--c-bc)",
html:`
<div class="board">
  <section class="team" data-t="0" style="--tc:#ff4d4d">
    <input class="tname" id="bname0" aria-label="빨강 이름">
    <div class="serve" id="bjack0">${K.SERVE_SVG}<span>표적구</span></div>
    <div class="score" id="bsc0">0</div>
    <div class="bc-balls" id="bballs0"></div>
    <div class="btnrow op"><button class="pt" type="button" data-bthrow="0">공 던짐<small id="bleft0"></small></button></div>
    <div class="btnrow op"><button class="small" type="button" data-bclose="0">빨강이 더 가까움</button><button class="small" type="button" data-bback="0">공 하나 되돌리기</button></div>
  </section>
  <section class="center">
    <div class="qtr" id="bend">1엔드</div>
    <div class="bc-next" id="bnext"></div>
    <div class="bc-line"><table id="bline"></table></div>
    <div class="op bc-score" id="bscore"></div>
    <div class="btnrow op"><button class="nextq" id="bNext" type="button" hidden>다음 엔드</button><button class="small" id="bUndo" type="button">되돌리기</button></div>
  </section>
  <section class="team" data-t="1" style="--tc:#3b82f6">
    <input class="tname" id="bname1" aria-label="파랑 이름">
    <div class="serve" id="bjack1">${K.SERVE_SVG}<span>표적구</span></div>
    <div class="score" id="bsc1">0</div>
    <div class="bc-balls" id="bballs1"></div>
    <div class="btnrow op"><button class="pt" type="button" data-bthrow="1">공 던짐<small id="bleft1"></small></button></div>
    <div class="btnrow op"><button class="small" type="button" data-bclose="1">파랑이 더 가까움</button><button class="small" type="button" data-bback="1">공 하나 되돌리기</button></div>
  </section>
</div>
<div class="gpick op" id="bpick" hidden></div>
<div class="bgk" id="bcBingo"></div>
<div class="lower">
  <div class="box"><h4>경기 기록</h4><ul class="log" id="blog"></ul></div>
  <div class="box op">
    <h4>경기 설정</h4>
    <div class="cfg">
      <div class="cfgrow">
        <label>경기 방식 <select id="bcFmt"><option value="ind">개인전 (1:1, 공 6개)</option><option value="pair">2인조 (한 명당 3개)</option><option value="team">3인조 (한 명당 2개)</option><option value="free">수업용 (인원·공 자유)</option></select></label>
        <label>엔드 수 <select id="bcEnds"><option>2</option><option>3</option><option>4</option><option>6</option></select></label>
        <label>한 편 공 수 <input id="bcBalls" type="number" min="1" max="12"></label>
      </div>
      <div class="cfgrow"><label><input id="bcWho" type="checkbox"> 점수 낼 때 가장 가까운 공을 던진 학생 고르기</label></div>
      <div class="names">
        <div><div class="nh"><span id="bnl0">빨강 명단</span></div><textarea id="bros0" aria-label="빨강 명단"></textarea></div>
        <div><div class="nh"><span id="bnl1">파랑 명단</span></div><textarea id="bros1" aria-label="파랑 명단"></textarea></div>
      </div>
      <div class="keys">보치아는 빨강 공과 파랑 공을 하얀 표적구(잭)에 가깝게 던지는 경기예요. 엔드마다 표적구를 던지는 편이 번갈아 바뀌고(1엔드는 빨강), 표적구를 던진 편이 첫 공을, 상대 편이 두 번째 공을 던져요.<br>
        그다음부터는 <b>표적구에서 더 먼 편</b>이 계속 던져요. 공을 다 던진 편은 기다리고, 남은 편이 나머지 공을 던져요. 화면의 '○○이 더 가까움'을 눌러 두면 다음에 던질 편을 알려 줘요.<br>
        엔드가 끝나면 표적구에 가장 가까운 공을 가진 편이, 상대의 가장 가까운 공보다 가까이 있는 자기 공 수만큼 점수를 얻어요. 두 편의 가장 가까운 공이 같은 거리면 서로 1점씩이에요. 정해진 엔드가 끝나 동점이면 승부 엔드(타이브레이크)를 해요.<br>
        <kbd>Z</kbd> 되돌리기</div>
      <div><button class="danger" id="bNew" type="button">새 경기</button></div>
    </div>
  </div>
</div>`,
init(ctx){
const $=K.$,R=ctx.root,KEY="pe-boccia",esc=K.esc;
const TC=["#ff4d4d","#3b82f6"];
const FMT={ind:{b:6,e:4,n:1},pair:{b:6,e:4,n:2},team:{b:6,e:6,n:3},free:{b:6,e:4,n:0}};
function mkSide(name,roster){return{name,roster:roster.slice(0,12),ends:[],pts:[],bg:0};}
function fresh(cfg,keep){
  cfg=cfg||{fmt:"ind",ends:4,balls:6,who:true};
  const k=keep||[{name:"빨강",roster:["김민준"]},{name:"파랑",roster:["이서연"]}];
  return{cfg,sides:k.map(x=>mkSide(x.name,x.roster)),end:1,left:[cfg.balls,cfg.balls],close:-1,jackDone:false,endOver:false,tb:false,over:null,log:[]};
}
let S=K.load(KEY);if(!S||!S.sides)S=fresh();
let undoStack=[],pick=null;
const save=()=>K.save(KEY,S);
K.fixKit(R,{get:()=>S,snap:()=>snap(),after:()=>{save();draw();}});
function snap(){undoStack.push(JSON.stringify(S));if(undoStack.length>250)undoStack.shift();}
function undo(){if(!undoStack.length)return;S=JSON.parse(undoStack.pop());pick=null;K.closeModal();save();draw();K.toast("되돌렸습니다","",1200);}
const total=t=>S.sides[t].ends.reduce((a,b)=>a+(b||0),0)+(S.sides[t].bg||0);
const jackSide=()=>(S.end-1)%2; // 1엔드 빨강, 2엔드 파랑…
const BG=K.bingoKit({el:$("bcBingo"),key:"boccia",get:()=>S,teams:()=>S.sides.map((x,t)=>({name:x.name,color:TC[t],roster:x.roster})),
  missions:["표적구에 딱 붙이기","상대 공 쳐내기","표적구 옮겨 역전","한 엔드 2점 이상","마지막 공으로 역전","공 6개 모두 표적구 1m 안","굴려서 맞히기","높이 던져 떨어뜨리기"],bonusDef:1,
  hint:"엔드 점수를 낼 때 고른 학생 칸이 채워지고",
  apply:(t,p)=>{S.sides[t].bg=(S.sides[t].bg||0)+p;},snap:()=>snap(),after:()=>{save();draw();}});
function nextThrower(){
  // 표적구를 던진 편이 첫 공, 상대가 둘째 공, 그다음은 표적구에서 먼 편
  const L=S.left,j=jackSide(),b=S.cfg.balls;
  if(!S.jackDone)return{t:j,what:"표적구"};
  if(L[0]===0&&L[1]===0)return null;
  if(L[j]===b)return{t:j,what:"첫 공"};
  if(L[1-j]===b)return{t:1-j,what:"둘째 공"};
  if(L[0]===0)return{t:1,what:"남은 공"};
  if(L[1]===0)return{t:0,what:"남은 공"};
  if(S.close<0)return{t:-1,what:"?"};
  return{t:1-S.close,what:"표적구에서 먼 편"};
}
function throwBall(t){
  if(S.over||S.endOver)return;
  if(!S.jackDone){if(t!==jackSide()){K.toast("이번 엔드는 "+S.sides[jackSide()].name+"이(가) 표적구를 먼저 던져요","",1800);return;}snap();S.jackDone=true;S.log.unshift({k:"j",t,end:S.end});save();draw();K.snd.tick(2);K.toast("표적구 던짐 · 이어서 "+S.sides[t].name+" 첫 공","",1600);return;}
  if(S.left[t]<=0){K.toast(S.sides[t].name+"은(는) 공을 다 던졌어요","bad",1400);return;}
  snap();S.left[t]--;S.close=-1;
  // 첫 공·둘째 공 뒤에는 누가 가까운지 물어본다
  save();draw();K.snd.tick(1);
  if(S.left[0]===0&&S.left[1]===0)K.toast("모든 공을 던졌어요 · 점수를 매겨 주세요","bingo",2200);
}
function setClose(t){if(S.over||S.endOver)return;snap();S.close=t;save();draw();}
function scoreEnd(t,n){
  if(S.over||S.endOver)return;
  if(S.cfg.who&&t>=0&&S.sides[t].roster.length>1&&!pick){pick={t,n};drawPick();return;}
  const who=pick&&pick.i!=null?pick.i:(S.sides[t]&&S.sides[t].roster.length===1?0:-1);
  pick=null;snap();
  const e=S.end-1;
  if(t<0){S.sides[0].ends[e]=1;S.sides[1].ends[e]=1;}
  else{S.sides[t].ends[e]=n;S.sides[1-t].ends[e]=0;if(who>=0){S.sides[t].pts[who]=(S.sides[t].pts[who]||0)+n;BG.hit(t,who);}}
  S.log.unshift({k:"e",t,n,end:S.end,tb:S.tb,who:t>=0&&who>=0?S.sides[t].roster[who]:null,sc:[total(0),total(1)]});
  S.endOver=true;
  setTimeout(()=>{if(t>=0)K.fx.play("boccia",$("bsc"+t),{text:"+"+n,color:TC[t]});else[0,1].forEach(x=>K.fx.play("boccia",$("bsc"+x),{text:"+1",color:TC[x]}));},30);
  const last=S.tb||S.end>=S.cfg.ends;
  if(last){
    const a=total(0),b=total(1);
    if(a!==b){finish(a>b?0:1);return;}
    S.tbNext=true;
  }
  save();draw();K.snd.swish();
  K.toast(t<0?"같은 거리 · 서로 1점":S.sides[t].name+" "+n+"점!"+(S.tbNext?" · 동점이라 승부 엔드를 해요":""),"bingo",2200);
}
function nextEnd(){
  if(!S.endOver||S.over)return;snap();
  if(S.tbNext){S.tb=true;S.tbNext=false;}
  S.end++;S.left=[S.cfg.balls,S.cfg.balls];S.close=-1;S.jackDone=false;S.endOver=false;
  save();draw();K.toast((S.tb?"승부 엔드":S.end+"엔드")+" · "+S.sides[jackSide()].name+" 표적구","",2000);
}
function finish(w){
  S.over={w};S.endOver=true;save();draw();setTimeout(K.snd.fanfare,300);
  const T=S.sides;
  K.modal({sub:"경기 종료"+(S.tb?" · 승부 엔드":""),title:T[w].name+" 승리",color:TC[w],score:total(0)+" : "+total(1),
    stats:"<div>엔드별 "+T.map(x=>esc(x.name)+" "+x.ends.map(v=>v==null?"-":v).join("·")).join(" / ")+"</div>",buttons:[{label:"되돌리기",fn:undo},{label:"닫기"}]});
  ctx.store(makeRec());
}
function makeRec(){
  if(!S.rid)S.rid=K.newId();
  const T=S.sides,d=[T.map(x=>x.name+" "+x.ends.map(v=>v==null?"-":v).join(" ")).join(" / ")];
  if(BG.summary())d.push(BG.summary());
  return{id:S.rid,sport:"boccia",sportName:"보치아",at:Date.now(),done:!!S.over,
    teams:T.map((x,t)=>({name:x.name,score:total(t)})),winner:S.over?T[S.over.w].name:null,summary:total(0)+" : "+total(1),details:d,
    players:T.flatMap(x=>x.roster.map((n,i)=>({team:x.name,name:n,pts:x.pts[i]||0,note:""})))};
}
function drawPick(){
  const el=$("bpick");if(!pick){el.hidden=true;return;}
  const T=S.sides[pick.t];el.hidden=false;el.style.setProperty("--tc",TC[pick.t]);
  el.innerHTML="<div class=\"gph\"><b>"+esc(T.name)+" "+pick.n+"점</b> · 가장 가까운 공을 던진 학생을 고르세요</div><div class=\"btnrow\">"+T.roster.map((n,i)=>"<button type=\"button\" class=\"gchip\" data-bwho=\""+i+"\">"+esc(n)+"</button>").join("")+"<button type=\"button\" class=\"small\" data-bwho=\"-1\">이름 없이</button><button type=\"button\" class=\"small\" data-bwho=\"x\">취소</button></div>";
}
function draw(){
  const T=S.sides,C=S.cfg,j=jackSide();
  [0,1].forEach(t=>{
    const x=T[t];K.setVal("bname"+t,x.name);$("bsc"+t).textContent=total(t);
    $("bjack"+t).classList.toggle("no",j!==t||!!S.over);
    $("bballs"+t).innerHTML=Array.from({length:C.balls},(_,i)=>"<i class=\""+(i<S.left[t]?"":"used")+"\" style=\"--c:"+TC[t]+"\"></i>").join("");
    $("bleft"+t).textContent="남은 공 "+S.left[t];
    R.querySelector("[data-bclose='"+t+"']").classList.toggle("on",S.close===t);
    $("bnl"+t).textContent=x.name+" 명단 ("+x.roster.length+"명)";K.setVal("bros"+t,x.roster.join("\n"));
  });
  $("bend").textContent=S.over?"경기 종료":S.tb?"승부 엔드":S.end+"엔드 / "+C.ends;
  const nt=nextThrower();
  let nx="";
  if(S.over)nx="<b>"+esc(T[S.over.w].name)+"</b> 승리!";
  else if(S.endOver)nx=S.tbNext?"동점! 승부 엔드를 준비하세요":"엔드 끝 · 다음 엔드를 누르세요";
  else if(!nt)nx="모든 공을 던졌어요 · 아래에서 점수를 매기세요";
  else if(nt.t<0)nx="어느 편이 표적구에 더 가까운지 눌러 주세요";
  else nx="다음: <b style=\"color:"+TC[nt.t]+"\">"+esc(T[nt.t].name)+"</b> "+nt.what+(nt.what==="표적구"?" 던지기":"");
  $("bnext").innerHTML=nx;
  const ends=Math.max(C.ends,S.end);
  $("bline").innerHTML="<tr><th></th>"+Array.from({length:ends},(_,i)=>"<th class=\""+(i+1===S.end&&!S.over?"cur":"")+"\">"+(i+1>C.ends?"TB":i+1)+"</th>").join("")+"<th>합</th></tr>"+
    T.map((x,t)=>"<tr><td class=\"tn\" style=\"color:"+TC[t]+"\">"+esc(x.name)+"</td>"+Array.from({length:ends},(_,i)=>"<td>"+(x.ends[i]==null?"":K.fixN(x.ends[i],"sides."+t+".ends."+i,x.name+" · "+(i+1>C.ends?"승부 엔드":(i+1)+"엔드")+" 점수","in",6))+"</td>").join("")+"<td class=\"tot\">"+total(t)+(x.bg?"<small class=\"bgx\">빙고+"+x.bg+"</small>":"")+"</td></tr>").join("");
  $("bscore").innerHTML=S.over||S.endOver?"":"<div class=\"lbl\">엔드 점수 매기기</div>"+[0,1].map(t=>"<div class=\"btnrow\"><span class=\"bc-who\" style=\"color:"+TC[t]+"\">"+esc(T[t].name)+"</span>"+Array.from({length:C.balls},(_,i)=>"<button type=\"button\" class=\"small\" data-bend=\""+t+":"+(i+1)+"\">"+(i+1)+"점</button>").join("")+"</div>").join("")+"<div class=\"btnrow\"><button type=\"button\" class=\"small\" data-bend=\"-1:1\">같은 거리 (서로 1점)</button></div>";
  $("bNext").hidden=!S.endOver||!!S.over;$("bNext").textContent=S.tbNext?"승부 엔드 시작":"다음 엔드";
  $("blog").innerHTML=S.log.length?S.log.slice(0,14).map(l=>{
    if(l.k==="j")return "<li><span class=\"p\" style=\"--c:"+TC[l.t]+"\">잭</span><span>"+esc(T[l.t].name)+" 표적구 · "+l.end+"엔드</span></li>";
    if(l.t<0)return "<li><span class=\"p\" style=\"--c:var(--fg)\">"+l.sc.join(":")+"</span><span>"+(l.tb?"승부 엔드":l.end+"엔드")+" · 같은 거리, 서로 1점</span></li>";
    return "<li><span class=\"p\" style=\"--c:"+TC[l.t]+"\">"+l.sc.join(":")+"</span><span>"+(l.tb?"승부 엔드":l.end+"엔드")+" · <b style=\"color:"+TC[l.t]+"\">"+esc(T[l.t].name)+"</b> "+l.n+"점"+(l.who?" · "+esc(l.who):"")+"</span></li>";
  }).join(""):"<li class=\"empty\">아직 기록이 없습니다. 표적구를 던지면 '공 던짐'을 눌러 시작하세요.</li>";
  $("bUndo").disabled=!undoStack.length;
  $("bcFmt").value=C.fmt;$("bcEnds").value=String(C.ends);K.setVal("bcBalls",C.balls);$("bcWho").checked=!!C.who;
  drawPick();BG.draw();
}
$("bNext").onclick=nextEnd;$("bUndo").onclick=undo;
K.arm($("bNew"),"새 경기",()=>{BG.reset();S=fresh(S.cfg,S.sides.map(x=>({name:x.name,roster:x.roster})));undoStack=[];pick=null;K.closeModal();save();draw();K.toast("새 경기 준비 완료","",1500);});
R.addEventListener("click",e=>{
  let b;
  if(b=e.target.closest("[data-bthrow]")){throwBall(+b.dataset.bthrow);return;}
  if(b=e.target.closest("[data-bclose]")){setClose(+b.dataset.bclose);return;}
  if(b=e.target.closest("[data-bback]")){const t=+b.dataset.bback;if(S.left[t]>=S.cfg.balls||S.endOver)return;snap();S.left[t]++;save();draw();return;}
  if(b=e.target.closest("[data-bend]")){const [t,n]=b.dataset.bend.split(":").map(Number);scoreEnd(t,n);return;}
  if(b=e.target.closest("[data-bwho]")){const v=b.dataset.bwho;if(v==="x"){pick=null;drawPick();return;}const p=pick;p.i=+v;scoreEnd(p.t,p.n);return;}
});
R.addEventListener("input",e=>{const el=e.target;if(el.id==="bname0"||el.id==="bname1"){S.sides[+el.id.slice(-1)].name=el.value||(el.id==="bname0"?"빨강":"파랑");save();}});
R.addEventListener("change",e=>{
  const el=e.target,C=S.cfg;
  if(el.id==="bros0"||el.id==="bros1"){const t=+el.id.slice(-1),list=K.parseList(el.value,12);if(!list.length){draw();return;}snap();const x=S.sides[t],old=x.roster;x.pts=list.map(n=>{const k=old.indexOf(n);return k>=0?x.pts[k]||0:0;});x.roster=list;save();draw();return;}
  if(el.id==="bcFmt"){const f=FMT[el.value];C.fmt=el.value;C.balls=f.b;C.ends=f.e;if(!S.jackDone&&S.end===1){S.left=[C.balls,C.balls];}save();draw();return;}
  if(el.id==="bcEnds"){C.ends=+el.value||4;save();draw();return;}
  if(el.id==="bcBalls"){const v=Math.max(1,Math.min(12,+el.value||6));const d=v-C.balls;C.balls=v;S.left=S.left.map(x=>Math.max(0,Math.min(v,x+d)));save();draw();return;}
  if(el.id==="bcWho"){C.who=el.checked;save();return;}
});
draw();
return{
  record:makeRec,
  key(e){if(e.key==="z"||e.key==="Z")undo();}
};
}};
