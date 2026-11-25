/* ================= 달리기 ================= */
MODS.run={name:"달리기",sub:"스톱워치 · 이름을 누르면 바퀴 기록 · 거리별 페이스",color:"var(--c-rn)",
html:`
<div class="modebar op">
  <label class="sw" style="--sc:var(--c-rn)"><input type="checkbox" id="rDist"><span class="knob"></span>거리 설정</label>
  <span class="rdcfg" id="rDistCfg">
    <label>한 바퀴 <input id="rLap" type="number" min="10" max="2000" step="10">m</label>
    <label>목표 거리 <input id="rTarget" type="number" min="0" max="50000" step="100">m</label>
  </span>
  <span class="hint" id="rHint"></span>
</div>
<section class="center rwatch">
  <div class="lbl">스톱워치</div>
  <div class="clock rclockbig" id="rclock">0:00.0</div>
  <div class="state" id="rstate"></div>
  ${K.timeCtl("rw")}
  <div class="btnrow op"><button class="go" id="rGo" type="button">출발</button><button class="small" id="rUndo" type="button">되돌리기</button><button class="small danger" id="rReset" type="button">처음부터</button></div>
</section>
<div class="rheats" id="rheats"></div>
<div class="rfind op">
  <input id="rFind" type="text" inputmode="text" autocomplete="off" placeholder="번호나 이름 (예: 10305)" aria-label="번호나 이름">
  <input id="rTime" type="text" inputmode="decimal" autocomplete="off" placeholder="시간 직접 입력 (예: 4:32.5)" aria-label="시간 직접 입력">
  <button class="small" id="rFindGo" type="button">기록하기</button>
  <span class="hint">시간을 비우면 지금 스톱워치 시간으로 한 바퀴, 시간을 적으면 완주 시간으로 저장 (0 = 지우기)</span>
</div>
<div class="runners" id="runners"></div>
<div class="box">
  <h4>기록표 · 순위</h4>
  <div class="tblwrap recw"><table class="rect" id="rtable"></table></div>
</div>
<div class="lower">
  <div class="box"><h4>통과 기록</h4><ul class="log" id="rlog"></ul></div>
  <div class="box op">
    <h4>설정</h4>
    <div class="cfg">
      <div class="cfgrow">
        <label>제한 시간 <input id="rLimit" type="number" min="0" max="120">분 (0 = 없음, 예: 12분 달리기)</label>
        <label>같은 학생 다시 누르기 막기 <input id="rGuard" type="number" min="0" max="60">초</label>
        <button class="small danger" id="rWipe" type="button">전체 기록 지우기</button>
      </div>
      <div class="names"><div><div class="nh"><span id="rnl">참가 명단</span></div><textarea id="rros" aria-label="참가 명단"></textarea></div></div>
      <div class="keys">출발을 누르면 스톱워치가 흐릅니다. 학생이 출발선(측정 지점)을 지날 때마다 그 학생 이름을 누르면, 그때까지의 누적 시간이 한 바퀴씩 기록됩니다.<br>
        거리 설정을 켜면 한 바퀴 거리로 달린 거리, 1km 페이스, 속도를 자동으로 계산하고, 목표 거리에 도달한 학생은 완주로 표시됩니다.<br>
        실수로 두 번 누르는 것을 막기 위해 같은 학생은 정한 초 안에 다시 눌러도 기록하지 않아요. 명단은 한 줄에 한 명, 최대 300명입니다. 처음 이름은 예시예요.<br>
        많은 학생은 조로 나눠 달리세요: 명단에 <b># 1반</b>처럼 #으로 시작하는 줄을 넣으면 그 아래 학생들이 한 조가 됩니다. 조마다 스톱워치가 따로 있고, 순위표는 모든 조를 합쳐 쌓입니다. "10305 홍길동"처럼 번호를 앞에 쓰면 번호로 찾기 쉬워요.<br>
        <kbd>Space</kbd> 출발/정지 · <kbd>Z</kbd> 되돌리기</div>
    </div>
  </div>
</div>`,
init(ctx){
const $=K.$,R=ctx.root,KEY="pe-run",esc=K.esc;
function fresh(cfg,names){
  cfg=cfg||{dist:true,lap:200,target:1600,limit:0,guard:3};
  names=names||K.EX10[0].concat(K.EX10[1]).slice(0,12);
  names=names.slice(0,MAX);
  return{cfg,names,grp:names.map(()=>0),groups:[""],heat:0,clocks:[0],man:names.map(()=>0),laps:names.map(()=>[]),fin:names.map(()=>null),clock:0,running:false,log:[]};
}
const MAX=300;
let S=K.load(KEY);if(!S||!S.names)S=fresh();S.running=false;
// 예전 저장(조 없음)을 이어 쓰기
if(!S.grp){S.grp=S.names.map(()=>0);S.groups=[""];S.heat=0;S.clocks=[S.clock||0];}
if(!S.man)S.man=S.names.map(()=>0);
/* 명단 글 → 이름·조. '#'으로 시작하는 줄은 조 이름 */
function parseRoster(txt){
  const names=[],grp=[],groups=[];let g=-1;
  txt.split(/\n/).map(x=>x.trim()).forEach(line=>{
    if(!line)return;
    if(line[0]==="#"){groups.push(line.replace(/^#+/,"").trim()||((groups.length+1)+"조"));g=groups.length-1;return;}
    line.split(",").map(x=>x.trim()).filter(Boolean).forEach(n=>{
      if(names.length>=MAX)return;
      if(g<0){groups.push("");g=0;}
      names.push(n);grp.push(g);
    });
  });
  // 학생이 없는 조는 빼고 번호를 다시 매김
  const used=groups.map((x,k)=>grp.includes(k)),map=[];let c=0;used.forEach((u,k)=>{map[k]=u?c++:-1;});
  return{names,grp:grp.map(k=>map[k]),groups:groups.filter((x,k)=>used[k]),cut:txt.split(/[\n,]/).filter(x=>x.trim()&&x.trim()[0]!=="#").length>MAX};
}
function rosterText(){
  const multi=S.groups.length>1||S.groups[0];
  if(!multi)return S.names.join("\n");
  return S.groups.map((gn,g)=>"# "+(gn||(g+1)+"조")+"\n"+S.names.filter((n,i)=>S.grp[i]===g).join("\n")).join("\n\n");
}
const multi=()=>S.groups.length>1;
const gName=g=>S.groups[g]||((g+1)+"조");
const inHeat=i=>S.grp[i]===S.heat;
function switchHeat(g){
  if(g===S.heat)return;
  if(S.running){K.toast("스톱워치를 멈춘 뒤 조를 바꾸세요","bad",1800);return;}
  S.clocks[S.heat]=S.clock;S.heat=g;S.clock=S.clocks[g]||0;save();draw();
  K.toast(gName(g)+" · 이 조 스톱워치로 바꿨어요","",1400);
}
let undoStack=[],lastSave=0,flashI=-1;
const save=()=>K.save(KEY,S);
function snap(){undoStack.push(JSON.stringify(Object.assign({},S,{running:false})));if(undoStack.length>300)undoStack.shift();}
function undo(){if(!undoStack.length)return;const h=JSON.parse(undoStack.pop());const keep=h.heat===S.heat?{clock:S.clock,running:S.running}:{running:false};if(S.running&&h.heat!==S.heat)K.wake(false);S=Object.assign(h,keep);K.closeModal();save();draw();K.toast("되돌렸습니다","",1200);}
const fmtD=ms=>{const t=Math.max(0,Math.floor(ms/100)),m=Math.floor(t/600),s=Math.floor(t/10)%60,d=t%10;return m+":"+String(s).padStart(2,"0")+"."+d;};
const fmtP=secPerKm=>{if(!isFinite(secPerKm)||secPerKm<=0)return "—";const m=Math.floor(secPerKm/60),s=Math.round(secPerKm%60);return (s===60?(m+1)+"'00":m+"'"+String(s).padStart(2,"0"))+"\"";};
const dist=i=>S.laps[i].length*S.cfg.lap;
const last=i=>S.laps[i].length?S.laps[i][S.laps[i].length-1]:null;
const splits=i=>S.laps[i].map((t,k)=>t-(k?S.laps[i][k-1]:0));
const needLaps=()=>S.cfg.dist&&S.cfg.target>0?Math.ceil(S.cfg.target/S.cfg.lap):0;
function pace(i){const d=dist(i),t=last(i);if(!S.cfg.dist||!d||!t)return null;return (t/1000)/(d/1000);}
function speed(i){const d=dist(i),t=last(i);if(!S.cfg.dist||!d||!t)return null;return (d/1000)/(t/3600000);}
function ranking(){
  return S.names.map((n,i)=>i).sort((a,b)=>{
    const fa=S.fin[a],fb=S.fin[b];
    if(fa!=null&&fb!=null)return fa-fb;if(fa!=null)return -1;if(fb!=null)return 1;
    const la=S.laps[a].length,lb=S.laps[b].length;if(la!==lb)return lb-la;
    if(!la)return a-b;return last(a)-last(b);
  });
}
function finRank(i){return S.names.map((n,k)=>k).filter(k=>S.fin[k]!=null&&S.fin[k]<=S.fin[i]).length;}

function tap(i){
  if(!inHeat(i)){K.toast(S.names[i]+" · "+gName(S.grp[i])+" · 다른 조 학생이에요. 위에서 조를 바꾸세요","bad",2200);return;}
  if(S.man[i]){K.toast(S.names[i]+" · 시간을 직접 입력한 학생이에요","",1800);return;}
  if(!S.running){K.toast(S.clock>0?"스톱워치가 멈춰 있어요. 다시 출발을 누르세요":"먼저 출발을 누르세요","bad",1800);return;}
  if(S.fin[i]!=null)return;
  const lt=last(i);
  if(lt!=null&&S.cfg.guard>0&&S.clock-lt<S.cfg.guard*1000){K.toast(S.names[i]+" 방금 기록했어요 ("+S.cfg.guard+"초 안에 다시 누름)","",1400);return;}
  snap();
  const t=Math.round(S.clock);S.laps[i].push(t);
  const n=S.laps[i].length,sp=t-(lt||0);
  let fin=false;
  if(needLaps()&&n>=needLaps()){S.fin[i]=t;fin=true;}
  S.log.unshift({i,n,t,sp,fin});if(S.log.length>200)S.log.pop();
  flashI=i;save();draw();
  {const el=R.querySelector("[data-rn='"+i+"']");if(el)K.fx.play(fin?"quiz":"run",el,fin?{text:"완주!",color:"#f97362"}:{color:"#f97362"});}
  if(fin){K.snd.fanfare();K.toast(S.names[i]+" 완주! "+fmtD(t)+" · "+finRank(i)+"위","bingo",2600);
    if(S.fin.every((x,k)=>x!=null||!inHeat(k))){stop();K.snd.horn();K.toast((multi()?gName(S.heat)+" ":"")+"모두 완주했습니다! 스톱워치를 멈췄어요","bingo",3200);ctx.store(makeRec());}}
  else{K.snd.tick(Math.min(n,12));}
}
function start(){if(S.cfg.limit>0&&S.clock>=S.cfg.limit*60000)return;S.running=true;K.wake(true);drawClock();if(S.clock===0){K.snd.whistle(1);}}
function stop(){S.running=false;K.wake(false);save();drawClock();}
function timeUp(){S.running=false;K.wake(false);K.snd.horn();save();draw();K.toast(S.cfg.limit+"분 종료! 지금까지 달린 거리로 기록합니다","",3200);ctx.store(makeRec());}
function makeRec(){
  if(!S.mid)S.mid=K.newId();
  const rk=ranking(),C=S.cfg;
  const line=i=>S.names[i]+" "+S.laps[i].length+"바퀴"+(C.dist?" "+dist(i)+"m":"")+(last(i)!=null?" "+fmtD(S.fin[i]!=null?S.fin[i]:last(i)):"")+(pace(i)?" 페이스 "+fmtP(pace(i))+"/km":"")+(S.fin[i]!=null?" 완주":"");
  const top=rk.slice(0,Math.max(2,Math.min(3,rk.length)));
  return{id:S.mid,sport:"run",sportName:"달리기",at:Date.now(),done:!S.running,
    teams:top.map(i=>({name:S.names[i],score:C.dist?dist(i):S.laps[i].length})),winner:rk.length&&S.laps[rk[0]].length?S.names[rk[0]]:null,
    summary:(C.dist?"한 바퀴 "+C.lap+"m"+(C.target?" · 목표 "+C.target+"m":""):"바퀴 기록")+(C.limit?" · "+C.limit+"분":"")+" · 참가 "+S.names.length+"명"+(multi()?" · "+S.groups.length+"개 조":""),
    details:rk.map((i,n)=>(n+1)+"위 "+(multi()?"["+gName(S.grp[i])+"] ":"")+line(i)+(S.man[i]?" (직접 입력)":"")),
    players:S.names.map((nm,i)=>({team:multi()?gName(S.grp[i]):"달리기",name:nm,pts:S.laps[i].length,note:(C.dist?dist(i)+"m · ":"")+(last(i)!=null?"누적 "+fmtD(last(i)):"기록 없음")+(pace(i)?" · 페이스 "+fmtP(pace(i))+"/km":"")+(S.fin[i]!=null?" · 완주 "+fmtD(S.fin[i])+(S.man[i]?"(직접 입력)":""):"")+(S.laps[i].length?" · 구간 "+splits(i).map(fmtD).join(", "):"")}))};
}

function drawClock(){
  const c=$("rclock");c.textContent=fmtD(S.clock);
  const C=S.cfg;
  c.classList.toggle("low",C.limit>0&&C.limit*60000-S.clock<60000&&S.clock>0);
  if(!S.running)K.fillTime("rw",S.clock,true);
  const g=$("rGo");g.textContent=S.running?"정지":(S.clock>0?"계속":"출발");g.classList.toggle("run",S.running);
  const ids=S.names.map((n,i)=>i).filter(i=>!multi()||inHeat(i));
  const done=ids.filter(i=>S.fin[i]!=null).length,started=ids.filter(i=>S.laps[i].length||S.man[i]).length;
  const all=multi()?" (전체 "+(needLaps()?"완주 "+S.fin.filter(x=>x!=null).length:"기록 "+S.names.filter((n,i)=>S.laps[i].length||S.man[i]).length)+" / "+S.names.length+"명)":"";
  $("rstate").textContent=(multi()?gName(S.heat)+" · ":"")+(C.limit?"남은 시간 "+K.fmtUp(Math.max(0,C.limit*60000-S.clock+999))+" · ":"")+(needLaps()?"완주 "+done+" / "+ids.length+"명":"기록한 학생 "+started+" / "+ids.length+"명")+all;
  $("rstate").classList.toggle("live",S.running);
}
function draw(){
  const C=S.cfg;
  $("rDist").checked=C.dist;$("rDistCfg").hidden=!C.dist;
  $("rHint").textContent=C.dist?(C.target?"목표 "+C.target+"m = "+needLaps()+"바퀴":"목표 거리 없이 거리와 페이스만 계산"):"바퀴 수와 누적 시간만 기록";
  K.setVal("rLap",C.lap);K.setVal("rTarget",C.target);K.setVal("rLimit",C.limit);K.setVal("rGuard",C.guard);
  const nl=needLaps();
  /* 조 고르기 */
  $("rheats").hidden=!multi();
  if(multi())$("rheats").innerHTML="<span class=\"lbl\">조</span>"+S.groups.map((gn,g)=>{
    const ids=S.names.map((n,i)=>i).filter(i=>S.grp[i]===g),d=ids.filter(i=>S.fin[i]!=null||(!nl&&(S.laps[i].length||S.man[i]))).length;
    return "<button type=\"button\" class=\"rheat"+(g===S.heat?" on":"")+"\" data-heat=\""+g+"\"><b>"+esc(gName(g))+"</b><span>"+d+"/"+ids.length+"</span></button>";
  }).join("");
  $("rReset").textContent=multi()?"이 조 처음부터":"처음부터";
  $("runners").innerHTML=S.names.map((n,i)=>{
    if(!inHeat(i))return "";
    const k=S.laps[i].length,f=S.fin[i],lt=last(i),sp=k?splits(i)[k-1]:null;
    return "<button type=\"button\" class=\"rchip"+(f!=null?" fin":"")+(flashI===i?" flash":"")+"\" data-rn=\""+i+"\">"+
      "<b>"+esc(n)+"</b><span class=\"rl\">"+(f!=null?(S.man[i]?"직접 입력 · ":"")+"완주 "+finRank(i)+"위":k+(nl?" / "+nl:"")+"바퀴")+"</span>"+
      "<span class=\"rt\">"+(f!=null?fmtD(f):lt!=null?fmtD(lt):"–")+"</span>"+(sp!=null&&f==null?"<span class=\"rs\">이번 바퀴 "+fmtD(sp)+"</span>":"")+
      (nl?"<i class=\"rbar\" style=\"width:"+Math.min(100,k/nl*100)+"%\"></i>":"")+"</button>";
  }).join("");
  flashI=-1;
  const rk=ranking();
  let h="<thead><tr><th>순위</th>"+(multi()?"<th class=\"tn\">조</th>":"")+"<th class=\"tn\">이름</th><th>바퀴</th>"+(C.dist?"<th>거리</th>":"")+"<th>누적 시간</th><th>최근 바퀴</th><th>가장 빠른 바퀴</th>"+(C.dist?"<th>1km 페이스</th><th>속도</th>":"")+"<th class=\"tn\">구간 기록</th></tr></thead><tbody>";
  rk.forEach((i,n)=>{
    const k=S.laps[i].length,sp=splits(i),best=k?Math.min(...sp):null,p=pace(i),v=speed(i);
    h+="<tr"+(S.fin[i]!=null?" class=\"now\"":"")+" style=\"--c:var(--c-rn)\"><td class=\"rk\">"+(k||S.man[i]?n+1:"–")+"</td>"+(multi()?"<td class=\"tn\">"+esc(gName(S.grp[i]))+"</td>":"")+"<td class=\"tn\">"+esc(S.names[i])+(S.fin[i]!=null?" <span class=\"atkdot\">"+(S.man[i]?"직접 입력":"완주")+"</span>":"")+"</td><td><b>"+k+"</b></td>"+(C.dist?"<td>"+dist(i)+"m</td>":"")+
      "<td>"+(S.man[i]?fmtD(S.fin[i]):k?fmtD(last(i)):"—")+"</td><td>"+(k?fmtD(sp[k-1]):"—")+"</td><td>"+(best!=null?fmtD(best):"—")+"</td>"+(C.dist?"<td>"+(p?fmtP(p):"—")+"</td><td>"+(v?v.toFixed(1)+"km/h":"—")+"</td>":"")+
      "<td class=\"tn rsplits\">"+sp.map((s,q)=>"<span>"+(q+1)+": "+fmtD(s)+"</span>").join("")+"</td></tr>";
  });
  $("rtable").innerHTML=h+"</tbody>";
  $("rlog").innerHTML=S.log.length?S.log.slice(0,14).map(l=>"<li><span class=\"p\" style=\"--c:var(--c-rn)\">"+fmtD(l.t)+"</span><span><b>"+esc(S.names[l.i]||"")+"</b> "+l.n+"바퀴째"+(l.fin?" <span class=\"bg\">완주</span>":"")+" <span class=\"x\">· 이번 바퀴 "+fmtD(l.sp)+"</span></span></li>").join(""):"<li class=\"empty\">아직 기록이 없습니다. 출발을 누른 뒤 학생이 측정 지점을 지날 때마다 이름을 누르세요.</li>";
  $("rUndo").disabled=!undoStack.length;
  K.setVal("rros",rosterText());$("rnl").textContent="참가 명단 ("+S.names.length+"명"+(multi()?" · "+S.groups.length+"개 조":"")+")";
  drawClock();
}

$("rGo").onclick=()=>{S.running?stop():start();};
$("rUndo").onclick=undo;
function wipeAll(){const keep={names:S.names,grp:S.grp,groups:S.groups,heat:S.heat};S=Object.assign(fresh(S.cfg,S.names),keep);S.clocks=S.groups.map(()=>0);undoStack=[];K.wake(false);save();draw();}
K.arm($("rReset"),"처음부터",()=>{
  if(!multi()){wipeAll();K.toast("기록을 지우고 처음부터 시작합니다 (명단 유지)","",2000);return;}
  snap();S.running=false;K.wake(false);S.clock=0;S.clocks[S.heat]=0;
  S.names.forEach((n,i)=>{if(inHeat(i)){S.laps[i]=[];S.fin[i]=null;S.man[i]=0;}});
  S.log=S.log.filter(l=>!inHeat(l.i));save();draw();K.toast(gName(S.heat)+" 기록만 지우고 처음부터 (다른 조 기록은 그대로)","",2400);
});
K.arm($("rWipe"),"전체 기록 지우기",()=>{wipeAll();K.toast("모든 조의 기록을 지웠어요 (명단 유지)","",2000);});
/* 시간 글 → ms: 4:32.5 / 1:02:03 / 272.5(초) */
function parseT(t){
  t=t.trim().replace(/[’'′]/g,":").replace(/["″]/g,"");if(!t)return null;
  const p=t.split(":").map(Number);if(p.some(x=>!isFinite(x)||x<0))return NaN;
  let sec=p.length===3?p[0]*3600+p[1]*60+p[2]:p.length===2?p[0]*60+p[1]:p[0];
  return Math.round(sec*10)*100;
}
/* 번호·이름으로 학생 찾기: 정확히 같음 → 띄어 쓴 조각이 같음 → 포함(한 명일 때) */
function findStu(q){
  q=q.trim();if(!q)return{list:[]};
  const all=S.names.map((n,i)=>i),low=q.toLowerCase();
  let m=all.filter(i=>S.names[i].toLowerCase()===low);
  if(!m.length)m=all.filter(i=>S.names[i].toLowerCase().split(/[\s·.\-_/]+/).includes(low));
  if(!m.length)m=all.filter(i=>S.names[i].toLowerCase().includes(low));
  if(m.length>1){const h=m.filter(inHeat);if(h.length===1)m=h;}
  return{list:m};
}
function findGo(){
  const q=$("rFind").value,tt=$("rTime").value.trim();
  const {list}=findStu(q);
  if(!q.trim()){$("rFind").focus();return;}
  if(!list.length){K.toast("'"+q.trim()+"' 학생을 찾지 못했어요","bad",1800);return;}
  if(list.length>1){K.toast("여러 명이에요: "+list.slice(0,5).map(i=>S.names[i]).join(", ")+(list.length>5?" …":"")+" · 번호나 이름을 더 적어 주세요","bad",3000);return;}
  const i=list[0];
  if(tt){
    const ms=parseT(tt);
    if(!(ms>=0)){K.toast("시간은 4:32.5처럼 적어 주세요","bad",2000);return;}
    snap();
    if(ms===0){S.man[i]=0;S.fin[i]=null;S.laps[i]=[];K.toast(S.names[i]+" 기록을 지웠어요","",1800);}
    else{S.man[i]=1;S.laps[i]=[];S.fin[i]=ms;K.toast(S.names[i]+" 완주 시간 "+fmtD(ms)+" 저장 · "+finRank(i)+"위","",2200);}
    save();draw();ctx.store(makeRec());
  }else{
    if(!inHeat(i)&&!S.running){switchHeat(S.grp[i]);}
    tap(i);
  }
  $("rFind").value="";$("rTime").value="";$("rFind").focus();
}
$("rFindGo").onclick=findGo;
R.addEventListener("keydown",e=>{if(e.key==="Enter"&&(e.target.id==="rFind"||e.target.id==="rTime")){e.preventDefault();findGo();}});
$("rDist").onchange=e=>{S.cfg.dist=e.target.checked;save();draw();};
K.bindTime(R,()=>S.clock,(k,v)=>{S.clock=Math.max(0,Math.min(5999000,v));save();drawClock();},{full:()=>0,stop:()=>stop()});
R.addEventListener("click",e=>{const h=e.target.closest("[data-heat]");if(h){switchHeat(+h.dataset.heat);return;}const b=e.target.closest("[data-rn]");if(b)tap(+b.dataset.rn);});
R.addEventListener("change",e=>{
  const el=e.target;
  if(el.id==="rros"){
    const P=parseRoster(el.value);if(!P.names.length){draw();return;}
    if(S.running&&(P.groups.length!==S.groups.length)){K.toast("조를 바꾸려면 스톱워치를 먼저 멈추세요","bad",2000);draw();return;}
    snap();
    const old=S.names,ol=S.laps,of=S.fin,om=S.man,oc=S.clocks,ogn=S.groups.map((x,g)=>gName(g)),cur=gName(S.heat);
    S.names=P.names;S.grp=P.grp;S.groups=P.groups;
    const j=n=>old.indexOf(n);
    S.laps=P.names.map(n=>j(n)>=0?ol[j(n)]:[]);S.fin=P.names.map(n=>j(n)>=0?of[j(n)]:null);S.man=P.names.map(n=>j(n)>=0?om[j(n)]:0);
    S.clocks=S.groups.map((x,g)=>{const k=ogn.indexOf(gName(g));return k>=0?(k===S.heat?S.clock:oc[k]||0):0;});
    S.heat=Math.max(0,S.groups.map((x,g)=>gName(g)).indexOf(cur));S.clock=S.clocks[S.heat]||0;
    S.log=S.log.filter(l=>l.i<S.names.length);
    save();draw();
    if(P.cut)K.toast("명단은 최대 "+MAX+"명까지예요. 뒤쪽 학생은 빠졌어요","bad",3000);
    else if(multi())K.toast(S.names.length+"명 · "+S.groups.length+"개 조로 나눴어요","",2000);
    return;
  }
  if(["rLap","rTarget","rLimit","rGuard"].includes(el.id)){
    const C=S.cfg;C.lap=Math.max(10,Math.min(2000,+$("rLap").value||200));C.target=Math.max(0,Math.min(50000,+$("rTarget").value||0));
    C.limit=Math.max(0,Math.min(120,+$("rLimit").value||0));C.guard=Math.max(0,Math.min(60,+$("rGuard").value||0));
    // 목표 거리가 바뀌면 완주 여부를 다시 계산
    S.fin=S.names.map((n,i)=>{const nl=needLaps();return nl&&S.laps[i].length>=nl?S.laps[i][nl-1]:null;});
    save();draw();
  }
});
draw();
return{
  record:makeRec,
  tick(dt,now){
    if(!S.running)return;
    S.clock+=dt;
    if(S.cfg.limit>0&&S.clock>=S.cfg.limit*60000){S.clock=S.cfg.limit*60000;timeUp();return;}
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
