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
      </div>
      <div class="names"><div><div class="nh"><span id="rnl">참가 명단</span></div><textarea id="rros" aria-label="참가 명단"></textarea></div></div>
      <div class="keys">출발을 누르면 스톱워치가 흐릅니다. 학생이 출발선(측정 지점)을 지날 때마다 그 학생 이름을 누르면, 그때까지의 누적 시간이 한 바퀴씩 기록됩니다.<br>
        거리 설정을 켜면 한 바퀴 거리로 달린 거리, 1km 페이스, 속도를 자동으로 계산하고, 목표 거리에 도달한 학생은 완주로 표시됩니다.<br>
        실수로 두 번 누르는 것을 막기 위해 같은 학생은 정한 초 안에 다시 눌러도 기록하지 않아요. 명단은 한 줄에 한 명, 최대 40명입니다. 처음 이름은 예시예요.<br>
        <kbd>Space</kbd> 출발/정지 · <kbd>Z</kbd> 되돌리기</div>
    </div>
  </div>
</div>`,
init(ctx){
const $=K.$,R=ctx.root,KEY="pe-run",esc=K.esc;
function fresh(cfg,names){
  cfg=cfg||{dist:true,lap:200,target:1600,limit:0,guard:3};
  names=names||K.EX10[0].concat(K.EX10[1]).slice(0,12);
  return{cfg,names:names.slice(0,40),laps:names.map(()=>[]),fin:names.map(()=>null),clock:0,running:false,log:[]};
}
let S=K.load(KEY);if(!S||!S.names)S=fresh();S.running=false;
let undoStack=[],lastSave=0,flashI=-1;
const save=()=>K.save(KEY,S);
function snap(){undoStack.push(JSON.stringify(Object.assign({},S,{running:false})));if(undoStack.length>300)undoStack.shift();}
function undo(){if(!undoStack.length)return;const keep={clock:S.clock,running:S.running};S=Object.assign(JSON.parse(undoStack.pop()),keep);K.closeModal();save();draw();K.toast("되돌렸습니다","",1200);}
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
    if(S.fin.every(x=>x!=null)){stop();K.snd.horn();K.toast("모두 완주했습니다! 스톱워치를 멈췄어요","bingo",3200);ctx.store(makeRec());}}
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
    summary:(C.dist?"한 바퀴 "+C.lap+"m"+(C.target?" · 목표 "+C.target+"m":""):"바퀴 기록")+(C.limit?" · "+C.limit+"분":"")+" · 참가 "+S.names.length+"명",
    details:rk.map((i,n)=>(n+1)+"위 "+line(i)),
    players:S.names.map((nm,i)=>({team:"달리기",name:nm,pts:S.laps[i].length,note:(C.dist?dist(i)+"m · ":"")+(last(i)!=null?"누적 "+fmtD(last(i)):"기록 없음")+(pace(i)?" · 페이스 "+fmtP(pace(i))+"/km":"")+(S.fin[i]!=null?" · 완주 "+fmtD(S.fin[i]):"")+(S.laps[i].length?" · 구간 "+splits(i).map(fmtD).join(", "):"")}))};
}

function drawClock(){
  const c=$("rclock");c.textContent=fmtD(S.clock);
  const C=S.cfg;
  c.classList.toggle("low",C.limit>0&&C.limit*60000-S.clock<60000&&S.clock>0);
  if(!S.running)K.fillTime("rw",S.clock,true);
  const g=$("rGo");g.textContent=S.running?"정지":(S.clock>0?"계속":"출발");g.classList.toggle("run",S.running);
  const done=S.fin.filter(x=>x!=null).length,started=S.laps.filter(l=>l.length).length;
  $("rstate").textContent=(C.limit?"남은 시간 "+K.fmtUp(Math.max(0,C.limit*60000-S.clock+999))+" · ":"")+(needLaps()?"완주 "+done+" / "+S.names.length+"명":"기록한 학생 "+started+" / "+S.names.length+"명");
  $("rstate").classList.toggle("live",S.running);
}
function draw(){
  const C=S.cfg;
  $("rDist").checked=C.dist;$("rDistCfg").hidden=!C.dist;
  $("rHint").textContent=C.dist?(C.target?"목표 "+C.target+"m = "+needLaps()+"바퀴":"목표 거리 없이 거리와 페이스만 계산"):"바퀴 수와 누적 시간만 기록";
  K.setVal("rLap",C.lap);K.setVal("rTarget",C.target);K.setVal("rLimit",C.limit);K.setVal("rGuard",C.guard);
  const nl=needLaps();
  $("runners").innerHTML=S.names.map((n,i)=>{
    const k=S.laps[i].length,f=S.fin[i],lt=last(i),sp=k?splits(i)[k-1]:null;
    return "<button type=\"button\" class=\"rchip"+(f!=null?" fin":"")+(flashI===i?" flash":"")+"\" data-rn=\""+i+"\">"+
      "<b>"+esc(n)+"</b><span class=\"rl\">"+(f!=null?"완주 "+finRank(i)+"위":k+(nl?" / "+nl:"")+"바퀴")+"</span>"+
      "<span class=\"rt\">"+(f!=null?fmtD(f):lt!=null?fmtD(lt):"–")+"</span>"+(sp!=null&&f==null?"<span class=\"rs\">이번 바퀴 "+fmtD(sp)+"</span>":"")+
      (nl?"<i class=\"rbar\" style=\"width:"+Math.min(100,k/nl*100)+"%\"></i>":"")+"</button>";
  }).join("");
  flashI=-1;
  const rk=ranking();
  let h="<thead><tr><th>순위</th><th class=\"tn\">이름</th><th>바퀴</th>"+(C.dist?"<th>거리</th>":"")+"<th>누적 시간</th><th>최근 바퀴</th><th>가장 빠른 바퀴</th>"+(C.dist?"<th>1km 페이스</th><th>속도</th>":"")+"<th class=\"tn\">구간 기록</th></tr></thead><tbody>";
  rk.forEach((i,n)=>{
    const k=S.laps[i].length,sp=splits(i),best=k?Math.min(...sp):null,p=pace(i),v=speed(i);
    h+="<tr"+(S.fin[i]!=null?" class=\"now\"":"")+" style=\"--c:var(--c-rn)\"><td class=\"rk\">"+(k?n+1:"–")+"</td><td class=\"tn\">"+esc(S.names[i])+(S.fin[i]!=null?" <span class=\"atkdot\">완주</span>":"")+"</td><td><b>"+k+"</b></td>"+(C.dist?"<td>"+dist(i)+"m</td>":"")+
      "<td>"+(k?fmtD(last(i)):"—")+"</td><td>"+(k?fmtD(sp[k-1]):"—")+"</td><td>"+(best!=null?fmtD(best):"—")+"</td>"+(C.dist?"<td>"+(p?fmtP(p):"—")+"</td><td>"+(v?v.toFixed(1)+"km/h":"—")+"</td>":"")+
      "<td class=\"tn rsplits\">"+sp.map((s,q)=>"<span>"+(q+1)+": "+fmtD(s)+"</span>").join("")+"</td></tr>";
  });
  $("rtable").innerHTML=h+"</tbody>";
  $("rlog").innerHTML=S.log.length?S.log.slice(0,14).map(l=>"<li><span class=\"p\" style=\"--c:var(--c-rn)\">"+fmtD(l.t)+"</span><span><b>"+esc(S.names[l.i]||"")+"</b> "+l.n+"바퀴째"+(l.fin?" <span class=\"bg\">완주</span>":"")+" <span class=\"x\">· 이번 바퀴 "+fmtD(l.sp)+"</span></span></li>").join(""):"<li class=\"empty\">아직 기록이 없습니다. 출발을 누른 뒤 학생이 측정 지점을 지날 때마다 이름을 누르세요.</li>";
  $("rUndo").disabled=!undoStack.length;
  K.setVal("rros",S.names.join("\n"));$("rnl").textContent="참가 명단 ("+S.names.length+"명)";
  drawClock();
}

$("rGo").onclick=()=>{S.running?stop():start();};
$("rUndo").onclick=undo;
K.arm($("rReset"),"처음부터",()=>{const c=S.cfg,n=S.names;S=fresh(c,n);undoStack=[];save();draw();K.toast("기록을 지우고 처음부터 시작합니다 (명단 유지)","",2000);});
$("rDist").onchange=e=>{S.cfg.dist=e.target.checked;save();draw();};
K.bindTime(R,()=>S.clock,(k,v)=>{S.clock=Math.max(0,Math.min(5999000,v));save();drawClock();},{full:()=>0,stop:()=>stop()});
R.addEventListener("click",e=>{const b=e.target.closest("[data-rn]");if(b)tap(+b.dataset.rn);});
R.addEventListener("change",e=>{
  const el=e.target;
  if(el.id==="rros"){
    const list=K.parseList(el.value,40);if(!list.length){draw();return;}
    snap();
    const old=S.names,ol=S.laps,of=S.fin;
    S.names=list;S.laps=list.map(n=>{const j=old.indexOf(n);return j>=0?ol[j]:[];});S.fin=list.map(n=>{const j=old.indexOf(n);return j>=0?of[j]:null;});
    save();draw();return;
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
