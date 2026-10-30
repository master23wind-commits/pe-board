/* ================= 수업 작전판 =================
   점수판이 '경기'를 돕는다면 작전판은 체육 수업 1차시 전체를 설계하고 진행한다.
   - 설계: 웜업·활동·설명·종료 블록을 놓고 시간을 정하고, 활동 카드(태성쌤 아이디어 포함)를 골라 넣는다.
   - 진행: 블록마다 타이머가 흐르고 지금 활동의 방법·준비물·교사의 말·변형·안전을 안내한다.
     타이머는 다른 점수판을 열어도 계속 흐른다(K.planRun, 위쪽 막대의 작은 표시).
   저장: pe-plan-cur(설계 중), pe-plan-saved(저장한 작전), pe-plan-cards(내 카드), pe-plan-run(진행 중), pe-plan-f(필터) */
K.planCards=()=>{const a=K.load("pe-plan-cards");return Array.isArray(a)?a:[];};
K.planCard=id=>id?(K.PLAN_LIB.find(c=>c.id===id)||K.planCards().find(c=>c.id===id)||null):null;
K.planLabels=blocks=>{
  const tot={},seen={};blocks.forEach(b=>tot[b.ph]=(tot[b.ph]||0)+1);
  return blocks.map(b=>{seen[b.ph]=(seen[b.ph]||0)+1;const ph=K.PLAN_PH[b.ph]||K.PLAN_PH.act;
    return ph.n+((b.ph==="act"||b.ph==="exp"||tot[b.ph]>1)?seen[b.ph]:"");});
};
K.fmtMS=ms=>{const neg=ms<0,a=Math.abs(ms),s=neg?Math.floor(a/1000):Math.ceil(a/1000);return (neg?"+":"")+Math.floor(s/60)+":"+String(s%60).padStart(2,"0");};

/* ---------- 진행 엔진 (화면과 상관없이 흐른다) ---------- */
K.planRun=(()=>{
  const KEY="pe-plan-run";let R=K.load(KEY);if(R&&(!R.plan||!R.plan.blocks))R=null;
  const subs=[];const emit=()=>subs.forEach(f=>{try{f();}catch(e){}});
  const save=()=>K.save(KEY,R);
  const now=()=>Date.now();
  const blk=()=>R.plan.blocks[R.i];
  const el=i=>{i=i==null?R.i:i;return (R.el[i]||0)+(i===R.i&&R.since?now()-R.since:0);};
  const left=()=>blk().min*60000-el();
  const commit=()=>{if(R.since){R.el[R.i]=(R.el[R.i]||0)+now()-R.since;R.since=now();}};
  function start(plan){
    R={plan:JSON.parse(JSON.stringify(plan)),i:0,el:{},since:now(),auto:!!(K.load("pe-plan-auto")),startAt:now(),w1:{},w0:{}};
    save();K.wake(true);K.snd.whistle(1);emit();
  }
  function toggle(){if(!R)return;if(R.since){commit();R.since=null;K.wake(false);}else{R.since=now();K.wake(true);}save();emit();}
  function go(d){if(!R)return;const j=R.i+d;if(j<0||j>=R.plan.blocks.length)return;commit();const run=!!R.since;R.i=j;R.since=run?now():null;save();K.snd.chime();emit();}
  function adj(min){if(!R)return;const b=blk();b.min=Math.max(.5,Math.round((b.min+min)*2)/2);if(left()>60000)R.w1[R.i]=0;if(left()>0)R.w0[R.i]=0;save();emit();}
  function finish(){if(!R)return null;commit();R.since=null;const out=R;R=null;save();K.wake(false);emit();return out;}
  function setAuto(v){if(!R)return;R.auto=!!v;K.save("pe-plan-auto",!!v);save();emit();}
  function status(){
    if(!R)return null;const labs=K.planLabels(R.plan.blocks);
    return{i:R.i,n:R.plan.blocks.length,label:labs[R.i],name:R.plan.blocks[R.i].name,ph:R.plan.blocks[R.i].ph,left:left(),running:!!R.since,title:R.plan.title};
  }
  /* 위쪽 막대 표시 */
  let chip=null;
  function chipDraw(){
    if(!chip){const acts=document.querySelector(".bar .acts");if(!acts)return;
      chip=document.createElement("button");chip.type="button";chip.className="planchip op";chip.hidden=true;
      chip.onclick=()=>{try{location.hash="plan";}catch(e){}};acts.prepend(chip);}
    const st=status(),here=location.hash==="#plan";
    chip.hidden=!st||here;if(!st||here)return;
    chip.style.setProperty("--pc",(K.PLAN_PH[st.ph]||K.PLAN_PH.act).c);
    chip.innerHTML="<i></i>작전판 · "+K.esc(st.label)+" <b"+(st.left<0?" class=\"over\"":"")+">"+(st.running?"":"⏸ ")+K.fmtMS(st.left)+"</b>";
  }
  let lastSave=0;
  setInterval(()=>{
    if(R&&R.since){
      const l=left(),b=blk(),labs=K.planLabels(R.plan.blocks),nx=R.plan.blocks[R.i+1];
      if(l<=60000&&l>0&&!R.w1[R.i]&&b.min>=3){R.w1[R.i]=1;save();K.snd.chime();K.toast(labs[R.i]+" · 1분 남았어요","",2200);}
      if(l<=0&&!R.w0[R.i]){R.w0[R.i]=1;save();K.snd.whistle(2);
        K.toast(labs[R.i]+" 시간 끝"+(nx?" · 다음: "+labs[R.i+1]+" "+(nx.name||"")+" ("+nx.min+"분)":" · 수업을 마무리해요"),"bingo",4000);
        if(R.auto&&nx)go(1);}
      if(Date.now()-lastSave>5000){lastSave=Date.now();save();}
    }
    chipDraw();emit();
  },250);
  window.addEventListener("hashchange",chipDraw);
  return{get:()=>R,start,toggle,go,adj,finish,setAuto,status,el,left,on(f){subs.push(f);return()=>{const k=subs.indexOf(f);if(k>=0)subs.splice(k,1);};}};
})();

MODS.plan={name:"수업 작전판",sub:"1차시 설계 · 블록 타이머 · 활동 가이드",color:"var(--c-pl)",
html:`
<div class="pl-tabs"><div class="seg" role="tablist"><button type="button" data-ptab="edit">① 작전 짜기</button><button type="button" data-ptab="run">② 수업 진행</button></div><span class="pl-tabhint" id="plHint"></span></div>
<div id="plEdit">
  <div class="pl-wrap">
    <div class="pl-left">
      <section class="box pl-head">
        <div class="pl-row"><input class="pl-title" id="plTitle" placeholder="수업 이름 (예: 농구 · 3대3 첫 만남)" aria-label="수업 이름"></div>
        <div class="pl-row cfgrow">
          <label>종목 <select id="plSp"></select></label>
          <label>수업 시간 <input id="plTarget" type="number" min="10" max="120"> 분</label>
        </div>
        <div class="pl-axes">
          <label><span class="pl-ax k">기능</span><input id="plAx0" placeholder="오늘 할 수 있게 될 움직임"></label>
          <label><span class="pl-ax n">지식</span><input id="plAx1" placeholder="오늘 알게 될 원리·규칙"></label>
          <label><span class="pl-ax v">가치</span><input id="plAx2" placeholder="오늘 기를 태도·마음"></label>
        </div>
        <div class="pl-row pl-saved">
          <select id="plLoadSel" aria-label="불러올 작전"></select>
          <button class="small" type="button" id="plLoad">불러오기</button>
          <button class="small" type="button" id="plSave">저장</button>
          <button class="small danger" type="button" id="plNew">새 작전</button>
          <button class="small" type="button" id="plIoBtn">공유 · 지도안</button>
        </div>
        <div class="pl-io" id="plIo" hidden>
          <div class="btnrow" style="justify-content:flex-start">
            <button class="small" type="button" id="plExport">작전 파일 저장</button>
            <button class="small" type="button" id="plCopyCode">공유 코드 복사</button>
            <button class="small" type="button" id="plCopyText">지도안 글로 복사</button>
          </div>
          <textarea id="plIoText" rows="5" placeholder="다른 선생님에게 받은 공유 코드를 여기에 붙여 넣거나, 작전 파일을 골라 주세요"></textarea>
          <div class="btnrow" style="justify-content:flex-start"><input type="file" id="plFile" accept=".json,application/json"><button class="small" type="button" id="plImport">붙여 넣은 작전 가져오기</button></div>
        </div>
      </section>
      <section class="box">
        <div class="pl-tbar" id="plBar"></div>
        <div class="pl-tsum" id="plSum"></div>
        <div class="pl-blocks" id="plBlocks"></div>
        <div class="btnrow pl-add">
          <button class="small" type="button" data-padd="wu">+ 웜업</button><button class="small" type="button" data-padd="act">+ 활동</button><button class="small" type="button" data-padd="exp">+ 설명</button><button class="small" type="button" data-padd="end">+ 종료</button>
        </div>
        <button class="go pl-start" type="button" id="plStart">▶ 이 작전으로 수업 시작</button>
      </section>
    </div>
    <section class="box pl-lib">
      <h4>활동 카드</h4>
      <div class="pl-target" id="plTarget2"></div>
      <div class="pl-filt" id="plFilt"></div>
      <input class="pl-q" id="plQ" type="search" placeholder="카드 찾기 (예: 패스, 술래, 퀴즈)" aria-label="카드 찾기">
      <div class="pl-cards" id="plCards"></div>
      <button class="small" type="button" id="plMineBtn">+ 내 활동 카드 만들기</button>
      <div class="pl-form" id="plForm" hidden></div>
    </section>
  </div>
</div>
<div id="plRun" hidden></div>`,
init(ctx){
const $=K.$,R=ctx.root,esc=K.esc,PH=K.PLAN_PH,RUN=K.planRun;
const uid=()=>"k"+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const spName=k=>(K.PLAN_SP.find(x=>x[0]===k)||["","공통"])[1];
function blank(){return{id:"p"+uid(),title:"",sp:"bb",target:45,ax:["","",""],blocks:[]};}
function fromRecipe(r){return{id:"p"+uid(),title:r.title,sp:r.sp,target:r.target,ax:r.ax.slice(),blocks:r.blocks.map(([ph,c,m])=>({k:uid(),ph,card:c,min:m,memo:""}))};}
let P=K.load("pe-plan-cur");if(!P||!Array.isArray(P.blocks))P=fromRecipe(K.PLAN_RECIPES[0]);
let F=Object.assign({ph:"",cat:"",all:false,mine:false,q:""},K.load("pe-plan-f")||{});F.q="";
let sel=-1,openCard=null,editCard=null,tab=RUN.get()?"run":"edit",undoStack=[];
const save=()=>K.save("pe-plan-cur",P);
const saveF=()=>K.save("pe-plan-f",F);
const saved=()=>{const a=K.load("pe-plan-saved");return Array.isArray(a)?a:[];};
const bname=b=>{const c=K.planCard(b.card);return c?c.n:(b.name||"");};
const total=()=>P.blocks.reduce((a,b)=>a+(+b.min||0),0);

/* ---------- 카드 안내 HTML (설계·진행 공용) ---------- */
function guideHtml(c,big){
  if(!c)return "";
  const sec=(t,body,op)=>body?'<div class="pl-g'+(op?" op":"")+'"><h5>'+t+'</h5>'+body+'</div>':"";
  const ax=c.ax||[],axh=["기능","지식","가치"].map((t,j)=>ax[j]?'<li><span class="pl-ax '+"knv"[j]+'">'+t+'</span>'+esc(ax[j])+'</li>':"").join("");
  return '<div class="pl-guide'+(big?" big":"")+'">'+
    sec("진행 방법",c.how&&c.how.length?'<ol>'+c.how.map(x=>"<li>"+esc(x)+"</li>").join("")+'</ol>':"")+
    sec("준비물 · 대형",c.g?'<p>'+esc(c.g)+'</p>':"")+
    sec("교사의 말",c.say&&c.say.length?'<ul class="pl-say">'+c.say.map(x=>"<li>“"+esc(x)+"”</li>").join("")+'</ul>':"",true)+
    sec("변형",(c.e||c.h)?'<ul class="pl-mod">'+(c.e?'<li><b>쉽게</b> '+esc(c.e)+'</li>':"")+(c.h?'<li><b>어렵게</b> '+esc(c.h)+'</li>':"")+'</ul>':"",true)+
    sec("안전",c.safe?'<p class="pl-safe">'+esc(c.safe)+'</p>':"")+
    sec("세 축",axh?'<ul class="pl-axl">'+axh+'</ul>':"")+
  '</div>';
}
function chips(c){
  return '<span class="pl-chip" style="--pc:'+(PH[c.ph]||PH.act).c+'">'+(PH[c.ph]||PH.act).n+'</span>'+(c.cat?'<span class="pl-chip cat">'+esc(c.cat)+'</span>':"")+
    '<span class="pl-chip sp">'+esc(spName(c.sp))+'</span>'+(c.mine?'<span class="pl-chip mine">★ 태성쌤 아이디어</span>':"")+(c.u?'<span class="pl-chip u">내 카드</span>':"")+(c.tool?'<span class="pl-chip tool">'+esc(K.PLAN_TOOL[c.tool]||"")+' 연결</span>':"");
}

/* ---------- 설계 화면 ---------- */
function drawHead(){
  $("plSp").innerHTML=K.PLAN_SP.map(([k,n])=>'<option value="'+k+'">'+esc(n)+'</option>').join("");$("plSp").value=P.sp;
  K.setVal("plTitle",P.title);K.setVal("plTarget",P.target);[0,1,2].forEach(j=>K.setVal("plAx"+j,P.ax[j]||""));
  const sv=saved();
  $("plLoadSel").innerHTML='<optgroup label="태성쌤 레시피">'+K.PLAN_RECIPES.map(r=>'<option value="'+r.id+'">'+esc(r.title)+' ('+r.target+'분)</option>').join("")+'</optgroup>'+
    (sv.length?'<optgroup label="내가 저장한 작전">'+sv.map(s=>'<option value="'+esc(s.id)+'">'+esc(s.title||"이름 없는 작전")+' ('+s.blocks.reduce((a,b)=>a+(+b.min||0),0)+'분)</option>').join("")+'</optgroup>':"");
}
function drawBlocks(){
  const labs=K.planLabels(P.blocks),T=total(),tg=+P.target||45,W=Math.max(T,tg);
  $("plBar").innerHTML=P.blocks.map((b,i)=>'<span style="--pc:'+(PH[b.ph]||PH.act).c+';flex:'+(+b.min||0)+'" class="'+(i===sel?"sel":"")+'" title="'+esc(labs[i]+" "+bname(b)+" "+b.min+"분")+'" data-bi="'+i+'">'+(b.min>=3?esc(labs[i]):"")+'</span>').join("")+(T<tg?'<span class="rest" style="flex:'+(tg-T)+'"></span>':"");
  $("plBar").style.setProperty("--over",T>tg?"1":"0");
  $("plSum").innerHTML='합계 <b>'+T+'분</b> / '+tg+'분 '+(T===tg?'<span class="ok">딱 맞아요</span>':T<tg?'<span class="x">'+(tg-T)+'분 남아요</span>':'<span class="bad">'+(T-tg)+'분 넘쳐요</span>');
  if(!P.blocks.length){$("plBlocks").innerHTML='<div class="empty">아래 버튼으로 블록을 더하거나, 위에서 태성쌤 레시피를 불러와 보세요.</div>';return;}
  $("plBlocks").innerHTML=P.blocks.map((b,i)=>{
    const c=K.planCard(b.card),ph=PH[b.ph]||PH.act;
    const main=c?'<b>'+esc(c.n)+'</b><small>'+esc(c.s||"")+'</small>':(b.name?'<b>'+esc(b.name)+'</b><small>직접 쓴 활동</small>':'<b class="pl-none">카드를 골라 주세요</b><small>오른쪽 활동 카드에서 골라 넣어요</small>');
    let x="";
    if(i===sel)x='<div class="pl-bx">'+
      '<label>단계 <select data-bph="'+i+'">'+Object.keys(PH).map(k=>'<option value="'+k+'"'+(k===b.ph?" selected":"")+'>'+PH[k].n+'</option>').join("")+'</select></label>'+
      '<label class="grow">카드 없이 직접 쓰기 <input data-bname="'+i+'" value="'+esc(b.name||"")+'" placeholder="예: 자유 슛 연습"></label>'+
      (c?'<button class="small" type="button" data-bclear="'+i+'">카드 빼기</button>':"")+
      '<label class="full">이 블록 메모 (진행 화면에 보여요) <textarea data-bmemo="'+i+'" rows="2" placeholder="예: 2반은 공 4개 더 준비">'+esc(b.memo||"")+'</textarea></label></div>';
    return '<div class="pl-blk'+(i===sel?" sel":"")+'" data-bi="'+i+'" style="--pc:'+ph.c+'">'+
      '<span class="pl-lab">'+esc(labs[i])+'</span><div class="pl-bm">'+main+'</div>'+
      '<label class="pl-min"><input type="number" min="0.5" max="90" step="0.5" data-bmin="'+i+'" value="'+b.min+'" aria-label="'+esc(labs[i])+' 시간(분)"><span>분</span></label>'+
      '<span class="pl-bb"><button type="button" data-bmv="-1" data-i="'+i+'" aria-label="위로"'+(i?"":" disabled")+'>▲</button><button type="button" data-bmv="1" data-i="'+i+'" aria-label="아래로"'+(i<P.blocks.length-1?"":" disabled")+'>▼</button><button type="button" data-bdup="'+i+'" aria-label="복제">⧉</button><button type="button" data-bdel="'+i+'" aria-label="지우기" class="danger">✕</button></span>'+x+'</div>';
  }).join("");
}
function libList(){
  const q=F.q.trim().toLowerCase();
  return K.PLAN_LIB.concat(K.planCards().map(c=>Object.assign({u:1},c))).filter(c=>{
    if(F.ph&&c.ph!==F.ph)return false;
    if(F.cat&&c.cat!==F.cat)return false;
    if(!F.all&&!(c.sp==="all"||c.sp===P.sp||P.sp==="all"))return false;
    if(F.mine&&!c.mine)return false;
    if(q&&!(c.n+" "+(c.s||"")+" "+(c.how||[]).join(" ")+" "+(c.cat||"")).toLowerCase().includes(q))return false;
    return true;
  });
}
function drawLib(){
  const labs=K.planLabels(P.blocks);
  $("plTarget2").innerHTML=sel>=0&&P.blocks[sel]?'<span style="--pc:'+(PH[P.blocks[sel].ph]||PH.act).c+'">선택한 블록: <b>'+esc(labs[sel])+'</b></span> 카드를 펼쳐 <b>이 블록에 넣기</b>를 누르세요':'왼쪽 블록을 누르면 그 블록에 카드를 넣을 수 있어요. 아니면 <b>새 블록으로 추가</b>';
  const ch=(attr,v,label,on)=>'<button type="button" class="qchip" '+attr+'="'+v+'" aria-pressed="'+(!!on)+'">'+label+'</button>';
  let h='<div class="pl-fr">'+ch("data-fph","","전체",!F.ph)+Object.keys(PH).map(k=>ch("data-fph",k,PH[k].n,F.ph===k)).join("")+'</div>';
  if(F.ph==="wu"||F.cat)h+='<div class="pl-fr">'+ch("data-fcat","","모든 분류",!F.cat)+Object.keys(K.PLAN_CAT).map(k=>ch("data-fcat",k,k,F.cat===k)).join("")+'</div>'+(F.cat?'<div class="pl-catd">'+esc(K.PLAN_CAT[F.cat])+'</div>':"");
  h+='<div class="pl-fr">'+ch("data-fall","0",esc(spName(P.sp))+(P.sp==="all"?"":" + 공통"),!F.all)+ch("data-fall","1","모든 종목",F.all)+ch("data-fmine","1","★ 태성쌤 아이디어만",F.mine)+'</div>';
  $("plFilt").innerHTML=h;
  const list=libList();
  $("plCards").innerHTML=list.length?list.map(c=>{
    const op=openCard===c.id;
    return '<div class="pl-card'+(op?" open":"")+'" style="--pc:'+(PH[c.ph]||PH.act).c+'"><button type="button" class="pl-ch" data-copen="'+esc(c.id)+'" aria-expanded="'+op+'"><b>'+esc(c.n)+'</b><span class="pl-cm">'+c.m+'분</span><span class="pl-cs">'+esc(c.s||"")+'</span><span class="pl-chips">'+chips(c)+'</span></button>'+
      (op?'<div class="pl-cd">'+guideHtml(c)+'<div class="btnrow" style="justify-content:flex-start">'+
        (sel>=0&&P.blocks[sel]?'<button type="button" class="small go" data-cput="'+esc(c.id)+'">'+esc(labs[sel])+'에 넣기</button>':"")+
        '<button type="button" class="small" data-cadd="'+esc(c.id)+'">새 블록으로 추가</button>'+
        (c.u?'<button type="button" class="small" data-cedit="'+esc(c.id)+'">고치기</button><button type="button" class="small danger" data-cdel="'+esc(c.id)+'">지우기</button>':'<button type="button" class="small" data-ccopy="'+esc(c.id)+'">복사해서 내 카드로</button>')+
      '</div></div>':"")+'</div>';
  }).join(""):'<div class="empty">맞는 카드가 없어요. 필터를 바꾸거나 내 카드를 만들어 보세요.</div>';
}
function drawForm(){
  const f=$("plForm");f.hidden=!editCard;if(!editCard){$("plMineBtn").hidden=false;return;}
  $("plMineBtn").hidden=true;const c=editCard;
  const inp=(id,label,v,ph)=>'<label>'+label+'<input data-ff="'+id+'" value="'+esc(v||"")+'" placeholder="'+esc(ph||"")+'"></label>';
  const ta=(id,label,v,ph)=>'<label class="full">'+label+'<textarea data-ff="'+id+'" rows="3" placeholder="'+esc(ph||"")+'">'+esc(v||"")+'</textarea></label>';
  f.innerHTML='<h5>'+(K.planCards().some(x=>x.id===c.id)?"내 카드 고치기":"내 활동 카드 만들기")+'</h5><div class="pl-fgrid">'+
    inp("n","이름",c.n,"예: 콘 뒤집기 술래")+
    '<label>단계<select data-ff="ph">'+Object.keys(PH).map(k=>'<option value="'+k+'"'+(c.ph===k?" selected":"")+'>'+PH[k].n+'</option>').join("")+'</select></label>'+
    '<label>웜업 분류<select data-ff="cat"><option value="">없음</option>'+Object.keys(K.PLAN_CAT).map(k=>'<option'+(c.cat===k?" selected":"")+'>'+k+'</option>').join("")+'</select></label>'+
    '<label>종목<select data-ff="sp">'+K.PLAN_SP.map(([k,n])=>'<option value="'+k+'"'+(c.sp===k?" selected":"")+'>'+esc(n)+'</option>').join("")+'</select></label>'+
    '<label>추천 시간(분)<input data-ff="m" type="number" min="1" max="90" value="'+(c.m||5)+'"></label>'+
    '<label>연결할 점수판·도구<select data-ff="tool"><option value="">없음</option>'+Object.keys(K.PLAN_TOOL).map(k=>'<option value="'+k+'"'+(c.tool===k?" selected":"")+'>'+esc(K.PLAN_TOOL[k])+'</option>').join("")+'</select></label>'+
    '<label class="full">한 줄 소개<input data-ff="s" value="'+esc(c.s||"")+'" placeholder="이 활동을 한 줄로"></label>'+
    ta("how","진행 방법 (한 줄에 하나씩)",(c.how||[]).join("\n"),"1. 모둠별로 원을 만들어요")+
    inp("g","준비물 · 대형",c.g,"공 4개, 콘 8개")+inp("safe","안전",c.safe,"부딪힘 주의")+
    ta("say","교사의 말 (한 줄에 하나씩)",(c.say||[]).join("\n"),"오늘 어려웠던 순간은?")+
    inp("e","변형 · 쉽게",c.e)+inp("h","변형 · 어렵게",c.h)+
    inp("ax0","세 축 · 기능",(c.ax||[])[0])+inp("ax1","세 축 · 지식",(c.ax||[])[1])+inp("ax2","세 축 · 가치",(c.ax||[])[2])+
    '</div><div class="btnrow" style="justify-content:flex-start"><button class="small go" type="button" id="plFormSave">카드 저장</button><button class="small" type="button" id="plFormX">취소</button></div>';
}
function readForm(){
  const v=k=>{const el=R.querySelector('[data-ff="'+k+'"]');return el?el.value.trim():"";};
  const lines=k=>v(k).split("\n").map(s=>s.replace(/^\s*\d+[.)]\s*/,"").trim()).filter(Boolean);
  return{id:editCard.id,ph:v("ph")||"act",sp:v("sp")||"all",cat:v("cat"),n:v("n"),m:Math.max(1,Math.min(90,+v("m")||5)),s:v("s"),how:lines("how"),g:v("g"),say:lines("say"),e:v("e"),h:v("h"),safe:v("safe"),ax:[v("ax0"),v("ax1"),v("ax2")],tool:v("tool")};
}
function drawEdit(){drawHead();drawBlocks();drawLib();drawForm();}

/* ---------- 진행 화면 ---------- */
function drawRun(){
  const box=$("plRun"),st=RUN.get();
  if(!st){
    box.innerHTML='<div class="box pl-runempty"><div class="qbig">아직 시작한 수업이 없어요</div><p>① 작전 짜기에서 블록과 시간을 정하고 <b>▶ 이 작전으로 수업 시작</b>을 누르세요. 타이머는 점수판을 열어도 계속 흐르고, 위쪽 막대에 남은 시간이 보여요.</p>'+
      '<div class="btnrow"><button class="go" type="button" id="plStart2">▶ 지금 작전('+total()+'분)으로 시작</button></div></div>';
    return;
  }
  const B=st.plan.blocks,labs=K.planLabels(B),b=B[st.i],c=b.c,ph=PH[b.ph]||PH.act,nx=B[st.i+1];
  const done=i=>i<st.i;
  box.innerHTML=
    '<div class="pl-strip">'+B.map((x,i)=>'<button type="button" class="'+(i===st.i?"now":done(i)?"done":"")+'" style="--pc:'+(PH[x.ph]||PH.act).c+';flex:'+Math.max(.6,x.min)+'" data-rgo="'+i+'"><b>'+esc(labs[i])+'</b><span>'+esc(x.name||"")+'</span></button>').join("")+'</div>'+
    '<div class="pl-run">'+
      '<section class="box pl-now" style="--pc:'+ph.c+'">'+
        '<div class="pl-nowh"><span class="pl-chip" style="--pc:'+ph.c+'">'+esc(labs[st.i])+'</span>'+(c&&c.cat?'<span class="pl-chip cat">'+esc(c.cat)+'</span>':"")+'<span class="pl-of">'+(st.i+1)+' / '+B.length+'</span></div>'+
        '<h2 class="pl-nown">'+esc(b.name||"이름 없는 활동")+'</h2>'+(c&&c.s?'<div class="pl-nows">'+esc(c.s)+'</div>':"")+
        '<div class="pl-clock" id="plClock">0:00</div>'+
        '<div class="pl-cbar"><i id="plCbar"></i></div>'+
        '<div class="pl-tot" id="plTot"></div>'+
        '<div class="btnrow op"><button class="small" type="button" data-rgo="'+(st.i-1)+'"'+(st.i?"":" disabled")+'>◀ 이전</button><button class="go" type="button" id="plToggle"></button><button class="small" type="button" data-rgo="'+(st.i+1)+'"'+(nx?"":" disabled")+'>다음 ▶</button></div>'+
        '<div class="btnrow op"><button class="small" type="button" data-radj="-1">−1분</button><button class="small" type="button" data-radj="1">+1분</button>'+
          '<label class="sw" style="--sc:var(--c-pl)"><input type="checkbox" id="plAuto"'+(st.auto?" checked":"")+'><span class="knob"></span>시간 끝나면 자동 넘김</label></div>'+
        (c&&c.tool?'<button class="pl-tool op" type="button" data-rtool="'+esc(c.tool)+'">'+esc(K.PLAN_TOOL[c.tool]||"")+' 열기 <small>타이머는 계속 흘러요</small></button>':"")+
        (b.memo?'<div class="pl-memo op"><b>메모</b> '+esc(b.memo)+'</div>':"")+
        (nx?'<div class="pl-next">다음 · <b>'+esc(labs[st.i+1])+'</b> '+esc(nx.name||"")+' ('+nx.min+'분)</div>':'<div class="pl-next">마지막 블록이에요</div>')+
        '<button class="small danger op" type="button" id="plFinish">수업 끝내기</button>'+
      '</section>'+
      '<section class="box pl-gbox">'+
        (st.plan.ax&&st.plan.ax.some(Boolean)?'<div class="pl-goal"><span>오늘의 목표</span>'+["기능","지식","가치"].map((t,j)=>st.plan.ax[j]?'<em><i class="pl-ax '+"knv"[j]+'">'+t+'</i>'+esc(st.plan.ax[j])+'</em>':"").join("")+'</div>':"")+
        (c?guideHtml(c,true):'<div class="empty">이 블록에는 활동 카드가 없어요. 메모와 시간만 안내해요.</div>')+
      '</section>'+
    '</div>';
  K.arm($("plFinish"),"수업 끝내기",finishLesson);
  drawClock();
}
function drawClock(){
  const st=RUN.status();if(!st||tab!=="run"||!$("plClock"))return;
  const r=RUN.get(),b=r.plan.blocks[r.i],l=st.left,tot=b.min*60000;
  const ck=$("plClock");ck.textContent=K.fmtMS(l);ck.className="pl-clock"+(l<0?" over":l<=60000?" low":"")+(st.running?"":" pause");
  $("plCbar").style.width=Math.max(0,Math.min(100,(1-l/tot)*100))+"%";$("plCbar").classList.toggle("over",l<0);
  const T=r.plan.blocks.reduce((a,x)=>a+x.min,0)*60000;let E=0;r.plan.blocks.forEach((x,i)=>E+=RUN.el(i));
  $("plTot").innerHTML="수업 경과 <b>"+K.fmtUp(E)+"</b> · 계획 "+Math.round(T/60000)+"분 · "+(T-E>=0?"남은 계획 "+K.fmtMS(T-E):"<span class=\"bad\">계획보다 "+K.fmtUp(E-T)+" 더 진행</span>");
  const tg=$("plToggle");if(tg){tg.textContent=st.running?"일시 정지":"▶ 계속";tg.classList.toggle("run",st.running);}
}
let lastI=-1,lastN=-1;
const off=RUN.on(()=>{const st=RUN.status();
  if(tab==="run"){if(!st&&lastI!==-1){lastI=-1;drawRun();return;}
    if(st&&(st.i!==lastI||st.n!==lastN)){lastI=st.i;lastN=st.n;drawRun();return;}drawClock();}
  drawHint();});
function drawHint(){const st=RUN.status();$("plHint").innerHTML=st?'<span class="pl-live">'+(st.running?"진행 중":"일시 정지")+' · '+esc(st.label)+' '+K.fmtMS(st.left)+'</span>':"";}
function setTab(t){
  tab=t;R.querySelectorAll("[data-ptab]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.ptab===t)));
  $("plEdit").hidden=t!=="edit";$("plRun").hidden=t!=="run";
  if(t==="run"){const st=RUN.status();lastI=st?st.i:-1;lastN=st?st.n:-1;drawRun();}else drawEdit();
  drawHint();
}

/* ---------- 동작 ---------- */
function snap(){undoStack.push(JSON.stringify(P));if(undoStack.length>60)undoStack.shift();}
function addBlock(ph,cardId,at){
  snap();const c=K.planCard(cardId);
  const b={k:uid(),ph:c?c.ph:ph,card:cardId||null,min:c?c.m:(ph==="exp"?3:ph==="end"?5:ph==="wu"?5:10),memo:""};
  if(c&&c.ph!==ph&&ph)b.ph=c.ph;
  if(at==null){P.blocks.push(b);sel=P.blocks.length-1;}else{P.blocks.splice(at,0,b);sel=at;}
  save();drawBlocks();drawLib();
  K.toast((K.planLabels(P.blocks)[sel])+" 블록을 더했어요"+(c?" · "+c.n:""),"",1400);
}
function snapshotPlan(){
  return{title:P.title||"이름 없는 작전",sp:P.sp,target:P.target,ax:P.ax.slice(),
    blocks:P.blocks.map(b=>{const c=K.planCard(b.card);return{ph:b.ph,min:+b.min||1,memo:b.memo||"",name:c?c.n:(b.name||K.PLAN_PH[b.ph].n),c:c?JSON.parse(JSON.stringify(c)):null};})};
}
function startLesson(){
  if(!P.blocks.length){K.toast("블록을 하나 이상 넣어 주세요","bad",2000);return;}
  const go=()=>{RUN.start(snapshotPlan());setTab("run");K.toast("수업 시작! "+(P.title||""),"bingo",2000);};
  if(RUN.get())K.modal({sub:"수업 작전판",title:"진행 중인 수업이 있어요",stats:"<div>지금 진행 중인 수업을 끝내고 새로 시작할까요?</div>",buttons:[{label:"새로 시작",fn:()=>{RUN.finish();go();}},{label:"취소"}]});
  else go();
}
function finishLesson(){
  const r=RUN.finish();if(!r)return;
  const B=r.plan.blocks,labs=K.planLabels(B);
  const rows=B.map((b,i)=>{const a=r.el[i]||0,d=a-b.min*60000;return{l:labs[i],n:b.name,p:b.min,a,d};});
  const P0=B.reduce((s,b)=>s+b.min,0),A=rows.reduce((s,x)=>s+x.a,0);
  const tbl='<table class="pl-sumt"><tr><th>블록</th><th>계획</th><th>실제</th></tr>'+rows.map(x=>'<tr><td class="tn">'+esc(x.l)+' <small>'+esc(x.n)+'</small></td><td>'+x.p+'분</td><td class="'+(Math.abs(x.d)>=60000?(x.d>0?"bad":"x"):"")+'">'+K.fmtUp(x.a)+'</td></tr>').join("")+'</table>';
  K.modal({sub:"수업 끝",title:r.plan.title,color:"var(--c-pl)",score:"계획 "+P0+"분 · 실제 "+K.fmtUp(A),stats:tbl+'<div style="color:var(--muted)">기록 보관함에 저장했어요. 오래 걸린 블록은 다음 작전에서 시간을 고쳐 보세요.</div>',buttons:[{label:"닫기"}]});
  ctx.store({id:K.newId(),sport:"plan",sportName:"수업 작전판",at:Date.now(),done:true,teams:[{name:r.plan.title+" · 실제",score:Math.round(A/60000)+"분"}],winner:null,
    summary:"계획 "+P0+"분 · 실제 "+K.fmtUp(A),details:rows.map(x=>x.l+" "+x.n+" · 계획 "+x.p+"분 · 실제 "+K.fmtUp(x.a)),players:[]});
  setTab("run");
}
function exportObj(){
  const ids=new Set(P.blocks.map(b=>b.card).filter(Boolean));
  return{app:"pe-plan",v:1,plan:P,cards:K.planCards().filter(c=>ids.has(c.id))};
}
function planText(){
  const labs=K.planLabels(P.blocks);
  let t="■ "+(P.title||"이름 없는 작전")+" ("+spName(P.sp)+" · "+total()+"분)\n";
  ["기능","지식","가치"].forEach((n,j)=>{if(P.ax[j])t+="  "+n+": "+P.ax[j]+"\n";});
  P.blocks.forEach((b,i)=>{const c=K.planCard(b.card);
    t+="\n"+(i+1)+". "+labs[i]+" ("+b.min+"분) "+(c?c.n:(b.name||""))+"\n";
    if(c){(c.how||[]).forEach((x,j)=>t+="   - "+x+"\n");if(c.g)t+="   준비물: "+c.g+"\n";if(c.safe)t+="   안전: "+c.safe+"\n";}
    if(b.memo)t+="   메모: "+b.memo+"\n";});
  return t+"\n— 태성쌤의 체육수업 점수판 · 수업 작전판";
}
function importText(text){
  let o=null;try{o=JSON.parse(text);}catch(e){}
  if(!o||o.app!=="pe-plan"||!o.plan||!Array.isArray(o.plan.blocks)){K.toast("작전판 공유 코드가 아니에요","bad",2200);return;}
  const mine=K.planCards();(o.cards||[]).forEach(c=>{if(c&&c.id&&c.n){const k=mine.findIndex(x=>x.id===c.id);if(k>=0)mine[k]=c;else mine.push(c);}});
  K.save("pe-plan-cards",mine);
  snap();P=o.plan;P.id="p"+uid();P.ax=P.ax||["","",""];P.blocks.forEach(b=>{b.k=b.k||uid();b.min=+b.min||5;});sel=-1;save();
  $("plIoText").value="";$("plIo").hidden=true;drawEdit();K.toast("작전을 가져왔어요 · "+(P.title||""),"bingo",2200);
}

R.addEventListener("click",e=>{
  let b;
  if(b=e.target.closest("[data-ptab]")){setTab(b.dataset.ptab);return;}
  /* 진행 */
  if(b=e.target.closest("[data-rgo]")){const j=+b.dataset.rgo,st=RUN.status();if(st&&j>=0&&j<st.n)RUN.go(j-st.i);return;}
  if(b=e.target.closest("[data-radj]")){RUN.adj(+b.dataset.radj);drawRun();return;}
  if(b=e.target.closest("[data-rtool]")){try{location.hash=b.dataset.rtool;}catch(err){}return;}
  if(e.target.id==="plToggle"){RUN.toggle();drawClock();return;}
  if(e.target.id==="plStart2"){setTab("edit");startLesson();return;}
  /* 블록 */
  if(b=e.target.closest("[data-padd]")){addBlock(b.dataset.padd,null);return;}
  if(b=e.target.closest("[data-bmv]")){const i=+b.dataset.i,j=i+ +b.dataset.bmv;if(j<0||j>=P.blocks.length)return;snap();const t=P.blocks[i];P.blocks[i]=P.blocks[j];P.blocks[j]=t;sel=j;save();drawBlocks();drawLib();return;}
  if(b=e.target.closest("[data-bdup]")){const i=+b.dataset.bdup;snap();P.blocks.splice(i+1,0,Object.assign({},P.blocks[i],{k:uid()}));sel=i+1;save();drawBlocks();drawLib();return;}
  if(b=e.target.closest("[data-bdel]")){const i=+b.dataset.bdel;snap();P.blocks.splice(i,1);sel=-1;save();drawBlocks();drawLib();K.toast("블록을 지웠어요 · 되돌리려면 Z","",1600);return;}
  if(b=e.target.closest("[data-bclear]")){const i=+b.dataset.bclear;snap();P.blocks[i].card=null;save();drawBlocks();return;}
  if(b=e.target.closest(".pl-blk")){if(e.target.closest("input,select,textarea,label,button"))return;const i=+b.dataset.bi;sel=sel===i?-1:i;
    if(sel>=0){F.ph=P.blocks[sel].ph;F.cat="";saveF();}drawBlocks();drawLib();return;}
  if(b=e.target.closest("#plBar [data-bi]")){sel=+b.dataset.bi;drawBlocks();drawLib();return;}
  /* 카드 */
  if(b=e.target.closest("[data-copen]")){openCard=openCard===b.dataset.copen?null:b.dataset.copen;drawLib();return;}
  if(b=e.target.closest("[data-cput]")){const c=K.planCard(b.dataset.cput);if(!c||sel<0)return;snap();const bl=P.blocks[sel];bl.card=c.id;bl.min=c.m;bl.name="";
    save();drawBlocks();drawLib();K.toast(K.planLabels(P.blocks)[sel]+" ← "+c.n,"",1400);return;}
  if(b=e.target.closest("[data-cadd]")){const c=K.planCard(b.dataset.cadd);if(!c)return;addBlock(c.ph,c.id,sel>=0?sel+1:null);return;}
  if(b=e.target.closest("[data-ccopy]")){const c=K.planCard(b.dataset.ccopy);editCard=Object.assign(JSON.parse(JSON.stringify(c)),{id:"u"+uid(),n:c.n+" (내 버전)",mine:0});drawForm();$("plForm").scrollIntoView({block:"nearest"});return;}
  if(b=e.target.closest("[data-cedit]")){editCard=JSON.parse(JSON.stringify(K.planCard(b.dataset.cedit)));drawForm();$("plForm").scrollIntoView({block:"nearest"});return;}
  if(b=e.target.closest("[data-cdel]")){const id=b.dataset.cdel;if(!b.classList.contains("arm")){b.classList.add("arm");b.textContent="한 번 더 누르면 지워요";return;}
    K.save("pe-plan-cards",K.planCards().filter(c=>c.id!==id));openCard=null;drawLib();K.toast("내 카드를 지웠어요","",1400);return;}
  if(b=e.target.closest("[data-fph]")){F.ph=b.dataset.fph;if(F.ph!=="wu")F.cat="";saveF();drawLib();return;}
  if(b=e.target.closest("[data-fcat]")){F.cat=b.dataset.fcat;if(F.cat)F.ph="wu";saveF();drawLib();return;}
  if(b=e.target.closest("[data-fall]")){F.all=b.dataset.fall==="1";saveF();drawLib();return;}
  if(b=e.target.closest("[data-fmine]")){F.mine=!F.mine;saveF();drawLib();return;}
  if(e.target.id==="plMineBtn"){editCard={id:"u"+uid(),ph:sel>=0?P.blocks[sel].ph:"act",sp:P.sp,m:5,how:[],say:[],ax:["","",""]};drawForm();return;}
  if(e.target.id==="plFormX"){editCard=null;drawForm();return;}
  if(e.target.id==="plFormSave"){const c=readForm();if(!c.n){K.toast("카드 이름을 넣어 주세요","bad",1800);return;}
    const mine=K.planCards(),k=mine.findIndex(x=>x.id===c.id);if(k>=0)mine[k]=c;else mine.push(c);K.save("pe-plan-cards",mine);
    editCard=null;openCard=c.id;F.ph=c.ph;F.cat="";F.mine=false;F.all=true;saveF();drawForm();drawLib();drawBlocks();K.toast("내 카드를 저장했어요 · "+c.n,"bingo",1800);return;}
  /* 작전 저장·불러오기 */
  if(e.target.id==="plStart"){startLesson();return;}
  if(e.target.id==="plSave"){const sv=saved().filter(s=>s.id!==P.id);sv.unshift(JSON.parse(JSON.stringify(P)));K.save("pe-plan-saved",sv.slice(0,40));drawHead();K.toast("작전을 저장했어요 · "+(P.title||"이름 없는 작전"),"bingo",1800);return;}
  if(e.target.id==="plLoad"){const v=$("plLoadSel").value,r=K.PLAN_RECIPES.find(x=>x.id===v),s=saved().find(x=>x.id===v);
    if(!r&&!s)return;snap();P=r?fromRecipe(r):JSON.parse(JSON.stringify(s));sel=-1;openCard=null;save();drawEdit();K.toast("불러왔어요 · "+(P.title||""),"",1600);return;}
  if(e.target.id==="plIoBtn"){$("plIo").hidden=!$("plIo").hidden;return;}
  if(e.target.id==="plExport"){K.download("수업작전_"+(P.title||"작전").replace(/[\\/:*?"<>|\s]+/g,"_")+".json",JSON.stringify(exportObj()),"application/json").then(r=>{
    if(r==="saved")K.toast("작전 파일을 저장했어요. 다른 선생님에게 보내 주세요","",2400);else if(r!=="declined"){$("plIoText").value=JSON.stringify(exportObj());K.toast("저장이 막혀서 아래 칸에 공유 코드를 띄웠어요","",2600);}});return;}
  if(e.target.id==="plCopyCode"){const t=JSON.stringify(exportObj());$("plIoText").value=t;K.copyText(t).then(ok=>K.toast(ok?"공유 코드를 복사했어요. 카카오톡 등에 붙여 넣어 보내세요":"아래 칸을 길게 눌러 복사해 주세요","",2400));return;}
  if(e.target.id==="plCopyText"){const t=planText();$("plIoText").value=t;K.copyText(t).then(ok=>K.toast(ok?"지도안 글을 복사했어요":"아래 칸을 길게 눌러 복사해 주세요","",2200));return;}
  if(e.target.id==="plImport"){importText($("plIoText").value);return;}
});
K.arm($("plNew"),"새 작전",()=>{snap();P=blank();sel=-1;save();drawEdit();K.toast("빈 작전을 만들었어요","",1400);});
R.addEventListener("input",e=>{
  const el=e.target;
  if(el.id==="plTitle"){P.title=el.value;save();return;}
  if(/^plAx[012]$/.test(el.id)){P.ax[+el.id.slice(-1)]=el.value;save();return;}
  if(el.id==="plQ"){F.q=el.value;drawLib();return;}
  if(el.dataset.bmemo!=null){P.blocks[+el.dataset.bmemo].memo=el.value;save();return;}
  if(el.dataset.bname!=null){P.blocks[+el.dataset.bname].name=el.value;save();return;}
});
R.addEventListener("change",e=>{
  const el=e.target;
  if(el.id==="plSp"){P.sp=el.value;save();drawLib();return;}
  if(el.id==="plTarget"){P.target=Math.max(10,Math.min(120,+el.value||45));save();drawBlocks();return;}
  if(el.dataset.bmin!=null){const i=+el.dataset.bmin;snap();P.blocks[i].min=Math.max(.5,Math.min(90,Math.round((+el.value||1)*2)/2));save();drawBlocks();return;}
  if(el.dataset.bph!=null){const i=+el.dataset.bph;snap();P.blocks[i].ph=el.value;save();drawBlocks();drawLib();return;}
  if(el.dataset.bname!=null){drawBlocks();return;}
  if(el.id==="plAuto"){RUN.setAuto(el.checked);return;}
  if(el.id==="plFile"){const f=el.files&&el.files[0];if(!f)return;const rd=new FileReader();rd.onload=()=>{importText(String(rd.result||""));el.value="";};rd.readAsText(f);return;}
});
setTab(tab);
return{
  key(e){
    if(tab==="run"&&RUN.get()){
      if(e.code==="Space"){e.preventDefault();RUN.toggle();drawClock();}
      else if(e.key==="ArrowRight")RUN.go(1);else if(e.key==="ArrowLeft")RUN.go(-1);
    }else if(tab==="edit"&&(e.key==="z"||e.key==="Z")&&undoStack.length){P=JSON.parse(undoStack.pop());sel=-1;save();drawEdit();K.toast("되돌렸습니다","",1200);}
  },
  destroy(){off();}
};
}};
