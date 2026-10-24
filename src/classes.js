/* ================= 우리 반 명단 (팀 나누기 · PAPS가 함께 씀) =================
   학생: {no:번호, name:이름, sex:"남"|"여"|"", lv:1~5|"" (수준), tail:"0"~"9"|"" (전화번호 끝자리)} */
K.cls=(()=>{
  const KEY="pe-classes";
  let D=K.load(KEY);
  if(!D||!Array.isArray(D.list)||!D.list.length){
    D={cur:"c1",list:[{id:"c1",name:"1반",grade:"중1",st:Array.from({length:24},(_,i)=>({no:i+1,name:"",sex:"",lv:"",tail:""}))}]};
  }
  const subs=[];
  const save=()=>{K.save(KEY,D);subs.forEach(f=>{try{f();}catch(e){}});};
  return{
    all:()=>D.list,
    cur:()=>D.list.find(c=>c.id===D.cur)||D.list[0],
    set(id){D.cur=id;save();},
    add(name){const c={id:"c"+K.newId(),name:name||(D.list.length+1)+"반",grade:(this.cur()||{}).grade||"중1",st:[]};D.list.push(c);D.cur=c.id;save();return c;},
    remove(id){if(D.list.length<=1)return false;D.list=D.list.filter(c=>c.id!==id);if(D.cur===id)D.cur=D.list[0].id;save();return true;},
    touch:save,
    onChange(f){subs.push(f);return()=>{const i=subs.indexOf(f);if(i>=0)subs.splice(i,1);};},
    label:s=>(s.no!==""&&s.no!=null?s.no+"번":"")+(s.name?" "+s.name:"")||"학생",
    short:s=>s.name?s.name:(s.no+"번")
  };
})();
/* 표에서 복사한 글 → 학생 목록. 한 줄에 한 명: 번호 이름 성별 수준 끝자리 (탭·쉼표·공백 구분, 순서 자유) */
K.parseRoster=txt=>{
  const out=[];let auto=1;
  txt.split(/\r?\n/).map(l=>l.trim()).filter(Boolean).forEach(line=>{
    const parts=line.split(/[\t,|]+|\s+/).map(s=>s.trim()).filter(Boolean);
    const s={no:"",name:"",sex:"",lv:"",tail:""};
    parts.forEach(p=>{
      if(/^(남|남자|M|m|male)$/.test(p))s.sex="남";
      else if(/^(여|여자|F|f|female)$/.test(p))s.sex="여";
      else if(/^\d+번?$/.test(p)&&s.no==="")s.no=parseInt(p,10);
      else if(/^[1-5]$/.test(p)&&s.no!==""&&s.lv==="")s.lv=+p;
      else if(/^(상|중|하)$/.test(p))s.lv={상:5,중:3,하:1}[p];
      else if(/^\*?\d$/.test(p)&&s.lv!=="")s.tail=p.replace("*","");
      else if(/^끝?\d$/.test(p))s.tail=p.replace("끝","");
      else if(!s.name&&/[가-힣A-Za-z]/.test(p))s.name=p;
    });
    if(s.no==="")s.no=auto;
    auto=+s.no+1;
    if(s.name||s.no)out.push(s);
  });
  return out;
};
/* 명단 편집 화면 — 팀 나누기와 PAPS가 함께 쓰는 부품 */
K.rosterUI=(root,pre,opts)=>{
  opts=opts||{};
  const $=id=>root.querySelector("#"+pre+id),esc=K.esc;
  root.querySelector("#"+pre+"Roster").innerHTML=`
  <div class="cls-top">
    <label>반 <select id="${pre}Cls"></select></label>
    <button type="button" class="small" id="${pre}ClsAdd">+ 반 추가</button>
    <label>이름 <input id="${pre}ClsName" maxlength="12" class="cls-name"></label>
    <label>학년 <select id="${pre}ClsGr">${["초4","초5","초6","중1","중2","중3","고1","고2","고3"].map(g=>"<option>"+g+"</option>").join("")}</select></label>
    <button type="button" class="small danger" id="${pre}ClsDel">반 지우기</button>
  </div>
  <div class="cls-quick">
    <label>인원 <input id="${pre}N" type="number" min="1" max="60" inputmode="numeric"> 명</label>
    <button type="button" class="small" id="${pre}NSet">번호만으로 명단 만들기</button>
    <button type="button" class="small" id="${pre}PasteT">엑셀에서 붙여넣기</button>
    <button type="button" class="small" id="${pre}EditT">명단 고치기</button>
  </div>
  <div class="cls-paste" id="${pre}PasteBox" hidden>
    <textarea id="${pre}PasteTxt" rows="6" placeholder="한 줄에 한 명 · 번호 이름 성별 수준(1~5) 끝자리 순서로 (빈칸이나 탭으로 구분)&#10;1 김민준 남 4 7&#10;2 이서연 여 3 2&#10;3 박도윤 남&#10;(이름·성별·수준·끝자리는 없어도 돼요)"></textarea>
    <div class="btnrow"><button type="button" class="go" id="${pre}PasteGo">이 명단으로 바꾸기</button><button type="button" class="small" id="${pre}PasteX">닫기</button></div>
  </div>
  <div class="cls-edit" id="${pre}EditBox" hidden>
    <div class="cls-hint">성별은 눌러서 남 → 여 → 비움으로 바꿔요. 수준은 1(처음)~5(능숙), 끝자리는 전화번호 마지막 한 자리예요. 수준과 끝자리는 화면에 띄울 때 숨겨져요.</div>
    <div class="cls-table" id="${pre}ClsTable"></div>
    <div class="btnrow"><button type="button" class="small" id="${pre}RowAdd">+ 한 명 추가</button><button type="button" class="small" id="${pre}EditX">닫기</button></div>
  </div>`;
  function cur(){return K.cls.cur();}
  function drawSel(){
    $("Cls").innerHTML=K.cls.all().map(c=>"<option value=\""+c.id+"\">"+esc(c.name)+(c.grade?" ("+esc(c.grade)+")":"")+" · "+c.st.length+"명</option>").join("");
    $("Cls").value=cur().id;
    K.setVal(pre+"N",cur().st.length);K.setVal(pre+"ClsName",cur().name);$("ClsGr").value=cur().grade||"중1";
  }
  function drawTable(){
    const C=cur();
    $("ClsTable").innerHTML="<div class=\"crow head\"><span>번호</span><span>이름</span><span>성별</span><span>수준</span><span>끝자리</span><span></span></div>"+
      C.st.map((s,i)=>"<div class=\"crow\"><input data-ci=\""+i+"\" data-ck=\"no\" value=\""+esc(s.no)+"\" inputmode=\"numeric\" aria-label=\"번호\"><input data-ci=\""+i+"\" data-ck=\"name\" value=\""+esc(s.name)+"\" aria-label=\"이름\" maxlength=\"12\"><button type=\"button\" class=\"sexb s"+(s.sex==="남"?"m":s.sex==="여"?"f":"n")+"\" data-csex=\""+i+"\">"+(s.sex||"–")+"</button><input data-ci=\""+i+"\" data-ck=\"lv\" value=\""+esc(s.lv)+"\" inputmode=\"numeric\" maxlength=\"1\" aria-label=\"수준\"><input data-ci=\""+i+"\" data-ck=\"tail\" value=\""+esc(s.tail)+"\" inputmode=\"numeric\" maxlength=\"1\" aria-label=\"끝자리\"><button type=\"button\" class=\"small\" data-cdel=\""+i+"\" aria-label=\"지우기\">✕</button></div>").join("");
  }
  function changed(){K.cls.touch();drawSel();if(opts.onChange)opts.onChange();}
  $("Cls").onchange=e=>{K.cls.set(e.target.value);drawSel();if(!$("EditBox").hidden)drawTable();if(opts.onChange)opts.onChange();};
  $("ClsAdd").onclick=()=>{K.cls.add();drawSel();$("EditBox").hidden=true;if(opts.onChange)opts.onChange();$("ClsName").focus();$("ClsName").select();K.toast("반을 추가했어요. 이름과 인원(또는 명단)을 넣어 주세요","",2200);};
  $("ClsName").onchange=e=>{const v=e.target.value.trim();if(v){cur().name=v;changed();}else e.target.value=cur().name;};
  $("ClsGr").onchange=e=>{cur().grade=e.target.value;changed();};
  K.arm($("ClsDel"),"반 지우기",()=>{if(!K.cls.remove(cur().id)){K.toast("반이 하나뿐이라 지울 수 없어요","bad",1600);return;}drawSel();if(opts.onChange)opts.onChange();});
  $("NSet").onclick=()=>{
    const n=Math.max(1,Math.min(60,+$("N").value||0));if(!n)return;
    const C=cur(),old=C.st;
    C.st=Array.from({length:n},(_,i)=>old.find(s=>+s.no===i+1)||{no:i+1,name:"",sex:"",lv:"",tail:""});
    changed();if(!$("EditBox").hidden)drawTable();K.toast(n+"명 명단 준비 완료 (1~"+n+"번)","",1600);
  };
  $("PasteT").onclick=()=>{$("PasteBox").hidden=!$("PasteBox").hidden;$("EditBox").hidden=true;if(!$("PasteBox").hidden)$("PasteTxt").focus();};
  $("PasteX").onclick=()=>{$("PasteBox").hidden=true;};
  $("PasteGo").onclick=()=>{const L=K.parseRoster($("PasteTxt").value);if(!L.length){K.toast("명단을 읽지 못했어요","bad",1600);return;}cur().st=L.slice(0,60);$("PasteTxt").value="";$("PasteBox").hidden=true;changed();K.toast(L.length+"명 명단을 넣었어요","bingo",1800);};
  $("EditT").onclick=()=>{$("EditBox").hidden=!$("EditBox").hidden;$("PasteBox").hidden=true;if(!$("EditBox").hidden)drawTable();};
  $("EditX").onclick=()=>{$("EditBox").hidden=true;};
  $("RowAdd").onclick=()=>{const C=cur();const mx=C.st.reduce((m,s)=>Math.max(m,+s.no||0),0);C.st.push({no:mx+1,name:"",sex:"",lv:"",tail:""});changed();drawTable();};
  $("ClsTable").addEventListener("click",e=>{
    let b;const C=cur();
    if(b=e.target.closest("[data-csex]")){const s=C.st[+b.dataset.csex];s.sex=s.sex==="남"?"여":s.sex==="여"?"":"남";changed();drawTable();return;}
    if(b=e.target.closest("[data-cdel]")){C.st.splice(+b.dataset.cdel,1);changed();drawTable();}
  });
  $("ClsTable").addEventListener("change",e=>{
    const el=e.target;if(el.dataset.ci==null)return;
    const s=cur().st[+el.dataset.ci],k=el.dataset.ck;let v=el.value.trim();
    if(k==="no")v=v===""?"":parseInt(v,10)||"";
    if(k==="lv")v=/^[1-5]$/.test(v)?+v:"";
    if(k==="tail")v=/^\d$/.test(v)?v:"";
    s[k]=v;el.value=v;changed();
  });
  drawSel();
  return{redraw:()=>{drawSel();if(!$("EditBox").hidden)drawTable();}};
};
