/* ================= PAPS 측정·기록 ================= */
MODS.paps={name:"PAPS 측정",sub:"학생건강체력평가 측정 · 기록 · 내보내기",color:"var(--c-pp)",
html:`
<div class="box op pp-setup"><div id="ppRoster"></div>
  <div class="cfgrow pp-sess">
    <label>측정 <select id="ppSess"></select></label>
    <button type="button" class="small" id="ppSessNew">+ 새 측정</button>
    <label>날짜 <input type="date" id="ppDate"></label>
    <label>이름 <input id="ppLabel" maxlength="20" placeholder="예) 1학기 PAPS"></label>
  </div>
</div>
<div class="pp-items" id="ppItems"></div>
<div class="pp-desc" id="ppDesc"></div>
<div id="ppTool"></div>
<div class="pp-main">
  <div class="box pp-rec">
    <div class="pp-rh"><h4 id="ppRecH">기록</h4><span class="x" id="ppSum"></span></div>
    <div class="pp-table" id="ppTable"></div>
  </div>
  <div class="box op pp-side">
    <h4>등급 기준 <span class="x" id="ppStdH"></span></h4>
    <div class="pp-std" id="ppStd"></div>
    <div class="qnote">공식 등급 기준표(교육부 학생건강체력평가 누리집, 학교 PAPS 시스템)의 숫자를 한 번 넣어 두면 이 기기에 저장되고, 기록을 넣을 때마다 등급이 자동으로 나와요. 비워 두면 등급 없이 기록만 남아요.</div>
    <h4>내보내기</h4>
    <div class="btnrow"><button type="button" id="ppCsv">이번 측정 CSV 내려받기</button><button type="button" class="small" id="ppCopy">표 복사</button></div>
    <div class="qnote">CSV는 엑셀에서 바로 열려요. 표 복사는 엑셀이나 한글 표에 붙여넣기 좋아요.</div>
    <div class="btnrow"><button type="button" class="small danger" id="ppDelSess">이번 측정 지우기</button></div>
  </div>
</div>`,
init(ctx){
const $=K.$,R=ctx.root,KEY="pe-paps",esc=K.esc;
const IT=[
 {k:"shuttle",t:"왕복오래달리기",u:"회",f:"심폐지구력",hi:true,dec:0,d:"20m 거리를 신호음에 맞춰 왕복해요. 신호음이 점점 빨라지고, 두 번째로 신호음 전에 선에 닿지 못하면 끝나요. 아래 '신호음 진행'을 켜고, 끝난 학생 이름을 누르면 횟수가 자동으로 기록돼요."},
 {k:"longrun",t:"오래달리기-걷기",u:"분:초",f:"심폐지구력",hi:false,time:true,d:"정해진 거리를 달리거나 걸어서 걸린 시간을 재요. 기록은 4:35처럼 분:초로 넣어요. (점수판의 '달리기'에서 바퀴 기록을 재고 옮겨 적어도 돼요.)"},
 {k:"sitreach",t:"앉아윗몸앞으로굽히기",u:"cm",f:"유연성",hi:true,dec:1,d:"무릎을 편 채 앉아 두 손을 겹쳐 천천히 앞으로 밀어요. 두 번 재서 좋은 기록을 0.1cm 단위로 넣어요. 발바닥보다 덜 가면 음수(−)로 넣어요."},
 {k:"pushup",t:"팔굽혀펴기",u:"회",f:"근력·근지구력",hi:true,dec:0,d:"남학생은 팔굽혀펴기, 여학생은 무릎 대고 팔굽혀펴기를 해요(학교 지침 확인). 박자에 맞춰 바른 자세로 한 횟수만 세요. 아래 '박자 소리'를 켜면 일정한 간격으로 신호음이 나요."},
 {k:"curlup",t:"윗몸말아올리기",u:"회",f:"근력·근지구력",hi:true,dec:0,d:"무릎을 세우고 누워 박자에 맞춰 윗몸을 말아 올려요. 박자를 놓치거나 자세가 무너지면 끝나요. 아래 '박자 소리'를 켜 두세요."},
 {k:"grip",t:"악력",u:"kg",f:"근력·근지구력",hi:true,dec:1,d:"악력계를 몸에서 살짝 떨어뜨려 힘껏 쥐어요. 좌우 두 번씩 재서 높은 기록을 0.1kg 단위로 넣어요."},
 {k:"sprint",t:"50m 달리기",u:"초",f:"순발력",hi:false,dec:2,d:"출발 신호와 함께 50m를 달린 시간을 재요. 0.01초 단위로 넣어요. (빠를수록 좋은 기록)"},
 {k:"jump",t:"제자리멀리뛰기",u:"cm",f:"순발력",hi:true,dec:1,d:"두 발을 모으고 선 뒤 팔을 흔들어 앞으로 뛰어요. 몸이 닿은 가장 가까운 곳까지 재요. 두 번 뛰어 좋은 기록을 넣어요."},
 {k:"bmi",t:"체질량지수(BMI)",u:"",f:"체지방",bmi:true,d:"키(cm)와 몸무게(kg)를 넣으면 BMI = 몸무게 ÷ (키m)² 가 자동으로 계산돼요. 몸에 관한 기록이니 학생들 앞 큰 화면에는 띄우지 마세요."}
];
// 20m 왕복오래달리기 단계 (단계별 횟수, 1회 시간 초) — PACER 방식
const PL=[[7,9.00],[8,8.00],[8,7.58],[9,7.20],[9,6.86],[10,6.55],[10,6.26],[11,6.00],[11,5.76],[11,5.54],[12,5.33],[12,5.14],[13,4.97],[13,4.80],[13,4.65],[14,4.50],[14,4.36],[15,4.24],[15,4.11],[16,4.00],[16,3.89]];
const LAPS=[];{let t=0;PL.forEach(([n,s],li)=>{for(let i=0;i<n;i++){t+=s;LAPS.push({lv:li+1,i:i+1,n,end:t});}});}
let S=K.load(KEY);if(!S||!S.cls)S={cls:{},std:{},item:"shuttle",cad:3};
const save=()=>K.save(KEY,S);
const C=()=>K.cls.cur();
function CD(){const id=C().id;if(!S.cls[id])S.cls[id]={sessions:[],cur:null};const D=S.cls[id];if(!D.sessions.length){const s={id:K.newId(),date:new Date().toISOString().slice(0,10),label:"",v:{}};D.sessions.push(s);D.cur=s.id;}if(!D.sessions.some(s=>s.id===D.cur))D.cur=D.sessions[D.sessions.length-1].id;return D;}
const SES=()=>{const D=CD();return D.sessions.find(s=>s.id===D.cur);};
const item=()=>IT.find(x=>x.k===S.item)||IT[0];
const val=(s,k)=>((SES().v[s.no]||{})[k]);
function setVal(no,k,v){const V=SES().v;V[no]=V[no]||{};if(v===""||v==null)delete V[no][k];else V[no][k]=v;save();}
const toSec=v=>{if(v==null||v==="")return NaN;const m=String(v).match(/^(\d+):(\d{1,2})(?:\.(\d+))?$/);if(m)return +m[1]*60+ +m[2]+(m[3]?+("0."+m[3]):0);return +v;};
function bmiOf(s){const h=+val(s,"h"),w=+val(s,"w");if(!h||!w)return null;return w/Math.pow(h/100,2);}
function grade(s,it){
  if(it.bmi)return null;
  const g=(S.std[C().grade||"중1"]||{})[it.k];if(!g)return null;
  const cut=(g[s.sex==="여"?"여":"남"]||[]).map(x=>it.time?toSec(x):parseFloat(x));
  if(cut.length<4||cut.some(x=>isNaN(x)))return null;
  const v=it.time?toSec(val(s,it.k)):parseFloat(val(s,it.k));if(isNaN(v))return null;
  for(let i=0;i<4;i++){if(it.hi?v>=cut[i]:v<=cut[i])return i+1;}
  return 5;
}
/* ---------- 그리기 ---------- */
function drawSess(){
  const D=CD();
  $("ppSess").innerHTML=D.sessions.map(s=>"<option value=\""+s.id+"\">"+esc(s.date)+(s.label?" · "+esc(s.label):"")+" ("+Object.keys(s.v).length+"명)</option>").join("");
  $("ppSess").value=D.cur;K.setVal("ppDate",SES().date);K.setVal("ppLabel",SES().label||"");
}
function drawItems(){
  $("ppItems").innerHTML=IT.map(x=>{const n=C().st.filter(s=>x.bmi?bmiOf(s)!=null:val(s,x.k)!=null&&val(s,x.k)!=="").length;return "<button type=\"button\" class=\"ppi"+(x.k===S.item?" on":"")+"\" data-ppi=\""+x.k+"\"><small>"+x.f+"</small>"+x.t+"<em>"+n+"/"+C().st.length+"</em></button>";}).join("");
  const it=item();$("ppDesc").innerHTML="<b>"+esc(it.t)+"</b>"+(it.u?" ("+it.u+")":"")+" · "+esc(it.d);
}
function drawTable(){
  const it=item(),L=C().st;
  $("ppRecH").textContent=it.t+" 기록";
  const head="<div class=\"pr head"+(it.bmi?" bmi":"")+"\"><span>번호</span><span>이름</span><span>성별</span>"+(it.bmi?"<span>키(cm)</span><span>몸무게(kg)</span><span>BMI</span>":"<span>기록("+(it.u||"")+")</span><span>등급</span>")+"</div>";
  $("ppTable").innerHTML=head+L.map((s,i)=>{
    if(it.bmi){const b=bmiOf(s);return "<div class=\"pr bmi\"><span class=\"no\">"+esc(s.no)+"</span><span class=\"nm\">"+esc(s.name||"")+"</span><span class=\"sx\">"+esc(s.sex||"")+"</span><input data-ppv=\""+esc(s.no)+":h\" data-ix=\""+i+"\" value=\""+esc(val(s,"h")??"")+"\" inputmode=\"decimal\" aria-label=\"키\"><input data-ppv=\""+esc(s.no)+":w\" value=\""+esc(val(s,"w")??"")+"\" inputmode=\"decimal\" aria-label=\"몸무게\"><span class=\"g\">"+(b?b.toFixed(1):"")+"</span></div>";}
    const g=grade(s,it);
    return "<div class=\"pr\"><span class=\"no\">"+esc(s.no)+"</span><span class=\"nm\">"+esc(s.name||"")+"</span><span class=\"sx\">"+esc(s.sex||"")+"</span><input data-ppv=\""+esc(s.no)+":"+it.k+"\" data-ix=\""+i+"\" value=\""+esc(val(s,it.k)??"")+"\" inputmode=\""+(it.time?"text":"decimal")+"\" placeholder=\""+(it.time?"분:초":"")+"\" aria-label=\""+esc(s.no)+"번 기록\"><span class=\"g"+(g?" g"+g:"")+"\">"+(g?g+"등급":"")+"</span></div>";
  }).join("");
  drawSum();
}
function drawSum(){
  const it=item(),L=C().st;
  const nums=sex=>L.filter(s=>!sex||s.sex===sex).map(s=>it.bmi?bmiOf(s):it.time?toSec(val(s,it.k)):parseFloat(val(s,it.k))).filter(v=>v!=null&&!isNaN(v));
  const avg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:null;
  const fmt=v=>v==null?"-":it.time?Math.floor(v/60)+":"+String(Math.round(v%60)).padStart(2,"0"):v.toFixed(it.bmi?1:it.dec||0);
  const all=nums(),m=nums("남"),f=nums("여");
  $("ppSum").textContent="입력 "+all.length+"/"+L.length+"명"+(all.length?" · 평균 "+fmt(avg(all))+(m.length?" · 남 "+fmt(avg(m)):"")+(f.length?" · 여 "+fmt(avg(f)):""):"");
}
function drawStd(){
  const it=item(),gr=C().grade||"중1";
  $("ppStdH").textContent="· "+gr+" · "+it.t;
  if(it.bmi){$("ppStd").innerHTML="<div class=\"x\">BMI 판정은 학년·성별 백분위로 정해져 있어 여기서는 값만 계산해요.</div>";return;}
  const g=((S.std[gr]||{})[it.k])||{};
  const row=sex=>"<div class=\"ps-row\"><b>"+sex+"</b>"+[0,1,2,3].map(i=>"<label><small>"+(i+1)+"등급</small><input data-pps=\""+sex+":"+i+"\" value=\""+esc((g[sex]||[])[i]??"")+"\" inputmode=\""+(it.time?"text":"decimal")+"\" placeholder=\""+(it.time?"분:초":"")+"\"></label>").join("")+"</div>";
  $("ppStd").innerHTML="<div class=\"x\">"+(it.hi?"각 등급이 되는 <b>최소</b> 기록(이상)을 넣어요. 4등급 기준보다 낮으면 5등급.":"각 등급이 되는 <b>최대</b> 기록(이하)을 넣어요. 4등급 기준보다 느리면 5등급.")+"</div>"+row("남")+row("여");
}
/* ---------- 측정 도우미: 왕복오래달리기 신호음 ---------- */
let P={on:false,start:0,laps:0,cd:0,st:{},lastLv:0},pT=null;
function speak(t){try{const u=new SpeechSynthesisUtterance(t);u.lang="ko-KR";u.rate=1.1;speechSynthesis.cancel();speechSynthesis.speak(u);}catch(e){}}
function drawTool(){
  const it=item(),el=$("ppTool");
  if(it.k==="shuttle"){
    const L=C().st;
    const lap=LAPS[Math.min(P.laps,LAPS.length-1)];
    const done=L.filter(s=>P.st[s.no]==="o").length;
    el.innerHTML="<div class=\"box pp-pacer\"><div class=\"pc-top\"><div class=\"pc-big\"><small>단계</small><b id=\"pcLv\">"+(P.on||P.laps?lap.lv:"-")+"</b></div><div class=\"pc-big\"><small>이 단계</small><b id=\"pcI\">"+(P.on||P.laps?(P.laps?(LAPS[P.laps-1].lv===lap.lv?LAPS[P.laps-1].i:0):0)+"/"+lap.n:"-")+"</b></div><div class=\"pc-big main\"><small>완료한 횟수</small><b id=\"pcN\">"+P.laps+"</b></div><div class=\"pc-big\"><small>남은 학생</small><b id=\"pcLeft\">"+(L.length-done)+"</b></div></div>"+
      "<div class=\"pc-bar\"><i id=\"pcBar\"></i></div>"+
      "<div class=\"btnrow op\"><button type=\"button\" class=\"go\" id=\"pcGo\">"+(P.on?"신호음 멈추기":P.laps?"처음부터 다시":"신호음 시작 (5초 뒤)")+"</button>"+(P.laps&&!P.on?"<button type=\"button\" class=\"small\" id=\"pcRest\">아직 달리던 학생 지금 횟수로 기록</button>":"")+"</div>"+
      "<div class=\"pc-hint\">학생이 <b>첫 번째</b>로 신호음 전에 선에 닿지 못하면 한 번 눌러 <span class=\"w\">경고</span>, <b>두 번째</b>면 한 번 더 눌러 <span class=\"o\">끝</span> — 그때까지 완료한 횟수가 기록돼요. 잘못 눌렀으면 한 번 더 누르면 처음으로 돌아가요.</div>"+
      "<div class=\"tm-chips pc-chips\">"+L.map(s=>{const st=P.st[s.no];return "<button type=\"button\" class=\"tchip "+(st==="w"?"warn":st==="o"?"out":"")+"\" data-pcs=\""+esc(s.no)+"\"><b>"+esc(s.no)+"</b>"+(s.name?" "+esc(s.name):"")+(st==="o"?" · "+esc(val(s,"shuttle")??""):"")+"</button>";}).join("")+"</div></div>";
  }else if(it.k==="pushup"||it.k==="curlup"){
    el.innerHTML="<div class=\"box pp-cad\"><div class=\"cfgrow\"><b>박자 소리</b><label>간격 <input type=\"number\" id=\"cdSec\" min=\"1\" max=\"6\" step=\"0.5\" value=\""+S.cad+"\"> 초에 1회</label><button type=\"button\" class=\"go\" id=\"cdGo\">"+(cadOn?"멈추기":"시작")+"</button><span class=\"pc-big main\"><small>박자</small><b id=\"cdN\">"+cadN+"</b></span></div><div class=\"x\">학교에서 쓰는 공식 음원과 같은 간격으로 맞춰 쓰세요. 신호음마다 숫자가 하나씩 올라가요.</div></div>";
  }else el.innerHTML="";
}
function pacerTick(now){
  if(!P.on)return;
  if(P.cd>0){const left=Math.ceil((P.start-now)/1000);if(left!==P.cd){P.cd=left;if(left>0){K.snd.tick(left);const n=$("pcN");if(n)n.textContent=left+"…";}}if(now<P.start)return;P.cd=0;K.snd.whistle(1);speak("1단계");P.lastLv=1;}
  const t=(now-P.start)/1000;
  let n=0;while(n<LAPS.length&&LAPS[n].end<=t)n++;
  if(n!==P.laps){
    P.laps=n;
    if(n>=LAPS.length){P.on=false;K.snd.fanfare();drawTool();return;}
    const lv=LAPS[n].lv;
    if(lv!==P.lastLv){P.lastLv=lv;K.tone([1320],0,.12,.3,"square");K.tone([1320],.18,.12,.3,"square");K.tone([1760],.36,.25,.3,"square");setTimeout(()=>speak(lv+"단계"),700);}else K.tone([1320],0,.16,.3,"square");
    const i=LAPS[n-1];
    const e=$("pcLv");if(e)e.textContent=LAPS[n].lv;const e2=$("pcI");if(e2)e2.textContent=(LAPS[n-1].lv===LAPS[n].lv?i.i:0)+"/"+LAPS[n].n;const e3=$("pcN");if(e3)e3.textContent=n;
  }
  const prevEnd=n?LAPS[n-1].end:0,cur=LAPS[n];
  const bar=$("pcBar");if(bar&&cur)bar.style.width=Math.min(100,100*(t-prevEnd)/(cur.end-prevEnd))+"%";
}
let cadOn=false,cadN=0,cadNext=0;
function cadTick(now){if(!cadOn)return;if(now>=cadNext){cadN++;cadNext+=S.cad*1000;K.tone([cadN%2?880:660],0,.12,.3,"square");const e=$("cdN");if(e)e.textContent=cadN;}}
function draw(){drawSess();drawItems();drawTool();drawTable();drawStd();}
/* ---------- 내보내기 ---------- */
function rows(){
  const L=C().st,H=["번호","이름","성별"];
  IT.forEach(it=>{if(it.bmi)H.push("키(cm)","몸무게(kg)","BMI");else H.push(it.t+(it.u?"("+it.u+")":""),it.t+" 등급");});
  const out=[H];
  L.forEach(s=>{const r=[s.no,s.name||"",s.sex||""];IT.forEach(it=>{if(it.bmi){const b=bmiOf(s);r.push(val(s,"h")??"",val(s,"w")??"",b?b.toFixed(1):"");}else{const g=grade(s,it);r.push(val(s,it.k)??"",g?g:"");}});out.push(r);});
  return out;
}
$("ppCsv").onclick=async()=>{
  const csv="﻿"+rows().map(r=>r.map(x=>{x=String(x);return /[",\n]/.test(x)?"\""+x.replace(/"/g,"\"\"")+"\"":x;}).join(",")).join("\r\n");
  const r=await K.download("PAPS_"+C().name+"_"+SES().date+".csv",csv);
  K.toast(r==="saved"?"CSV를 내려받았어요":r==="declined"?"내려받기를 취소했어요":"이 화면에서는 내려받을 수 없어요. 표 복사를 써 주세요","",2000);
};
$("ppCopy").onclick=async()=>{const ok=await K.copyText(rows().map(r=>r.join("\t")).join("\n"));K.toast(ok?"표를 복사했어요 · 엑셀에 붙여넣으세요":"복사가 안 되는 환경이에요","",1800);};
/* ---------- 이벤트 ---------- */
const ui=K.rosterUI(R,"pp",{onChange:()=>{P.st={};draw();}});
$("ppSess").onchange=e=>{CD().cur=e.target.value;save();P.st={};draw();};
$("ppSessNew").onclick=()=>{const D=CD();const s={id:K.newId(),date:new Date().toISOString().slice(0,10),label:"",v:{}};D.sessions.push(s);D.cur=s.id;save();P.st={};draw();K.toast("새 측정을 시작했어요. 이전 측정은 목록에 남아 있어요","",2000);};
$("ppDate").onchange=e=>{SES().date=e.target.value||SES().date;save();drawSess();};
$("ppLabel").onchange=e=>{SES().label=e.target.value.trim();save();drawSess();};
K.arm($("ppDelSess"),"이번 측정 지우기",()=>{const D=CD();D.sessions=D.sessions.filter(s=>s.id!==D.cur);save();P.st={};draw();});
R.addEventListener("click",e=>{
  let b;
  if(b=e.target.closest("[data-ppi]")){S.item=b.dataset.ppi;save();if(cadOn&&S.item!=="pushup"&&S.item!=="curlup")cadOn=false;draw();return;}
  if(b=e.target.closest("#pcGo")){
    if(P.on){P.on=false;K.wake(false);drawTool();return;}
    P={on:true,start:performance.now()+5000,laps:0,cd:6,st:P.laps?{}:P.st,lastLv:0};K.wake(true);drawTool();K.toast("5초 뒤 시작해요. 출발선에 서세요!","",2000);return;
  }
  if(b=e.target.closest("#pcRest")){const L=C().st;let n=0;L.forEach(s=>{if(P.st[s.no]!=="o"){P.st[s.no]="o";setVal(s.no,"shuttle",String(P.laps));n++;}});drawTool();drawTable();drawItems();K.toast(n+"명을 "+P.laps+"회로 기록했어요","",1800);return;}
  if(b=e.target.closest("[data-pcs]")){
    const no=b.dataset.pcs,st=P.st[no];
    if(!st)P.st[no]="w";
    else if(st==="w"){P.st[no]="o";setVal(no,"shuttle",String(P.laps));K.snd.stop();}
    else{delete P.st[no];setVal(no,"shuttle","");}
    drawTool();drawTable();drawItems();drawSess();return;
  }
  if(b=e.target.closest("#cdGo")){cadOn=!cadOn;if(cadOn){cadN=0;cadNext=performance.now()+S.cad*1000;K.snd.whistle(1);}drawTool();return;}
});
R.addEventListener("change",e=>{
  const el=e.target;
  if(el.dataset.ppv){
    const [no,k]=el.dataset.ppv.split(":");const it=item();let v=el.value.trim();
    if(v!==""){
      if(it.time&&k===it.k){const sec=toSec(v);if(isNaN(sec)){K.toast("분:초 형식으로 넣어 주세요 (예: 4:35)","bad",1800);el.value=val({no},k)??"";return;}if(!/:/.test(v))v=Math.floor(sec/60)+":"+String(Math.round(sec%60)).padStart(2,"0");}
      else{const n=parseFloat(v);if(isNaN(n)){K.toast("숫자로 넣어 주세요","bad",1400);el.value=val({no},k)??"";return;}v=String(n);}
    }
    setVal(no,k,v);el.value=v;
    // 값만 바뀐 줄의 등급·BMI만 새로 그린다 (포커스 유지)
    const row=el.closest(".pr"),s=C().st.find(x=>String(x.no)===no);
    if(row&&s){const g=row.querySelector(".g");if(it.bmi){const b2=bmiOf(s);g.textContent=b2?b2.toFixed(1):"";}else{const gg=grade(s,it);g.className="g"+(gg?" g"+gg:"");g.textContent=gg?gg+"등급":"";}}
    drawSum();drawItems();drawSess();return;
  }
  if(el.dataset.pps){
    const [sex,i]=el.dataset.pps.split(":"),gr=C().grade||"중1",it=item();
    S.std[gr]=S.std[gr]||{};S.std[gr][it.k]=S.std[gr][it.k]||{남:["","","",""],여:["","","",""]};
    S.std[gr][it.k][sex][+i]=el.value.trim();save();drawTable();return;
  }
  if(el.id==="cdSec"){S.cad=Math.max(1,Math.min(6,+el.value||3));save();return;}
});
R.addEventListener("keydown",e=>{
  if(e.key!=="Enter"||!e.target.dataset.ppv)return;
  e.preventDefault();e.target.dispatchEvent(new Event("change",{bubbles:true}));
  const ins=[...R.querySelectorAll("#ppTable input")];const i=ins.indexOf(e.target);
  const it=item(),step=it.bmi?2:1;const nx=ins[i+step]||ins[i+1];if(nx){nx.focus();nx.select();}
});
draw();
return{
  tick(dt,now){pacerTick(now);cadTick(now);},
  key(e){},
  destroy(){P.on=false;cadOn=false;K.wake(false);try{speechSynthesis.cancel();}catch(e){}}
};
}};
