/* ================= 대진표 (1단계: 리그전 · 조별 리그 · 크로스 · 토너먼트 · 1회전 패자부활 · 더블 엘리미네이션
                            2단계: 결선 토너먼트(상위 진출) 또는 순위별 결정전) ================= */
MODS.bracket={name:"대진표",sub:"리그 · 조별 리그 · 크로스 · 토너먼트 · 패자부활 · 결선 조합",color:"var(--c-br)",
html:`
<div class="box op br-setup" id="brSetup">
  <div class="cfgrow"><label class="br-title">대회 이름 <input id="brTitle" maxlength="40" placeholder="예) 2학년 반 대항 피구 대회"></label></div>
  <h4 class="br-stg">1단계 · 경기 방식</h4>
  <div class="br-fmts" id="brFmts"></div>
  <div class="br-fdesc" id="brFdesc"></div>
  <div class="br-two">
    <div>
      <div class="cfgrow"><label>팀 수 <input id="brN" type="number" min="2" max="32" inputmode="numeric"></label><button type="button" class="small" id="brNGo">이름 자동으로</button><button type="button" class="small" id="brImp" hidden>팀 나누기 결과 가져오기</button></div>
      <textarea id="brNames" rows="7" placeholder="한 줄에 한 팀씩&#10;1반&#10;2반&#10;3반&#10;4반"></textarea>
    </div>
    <div class="br-opts" id="brOpts"></div>
  </div>
  <div class="br-s2" id="brS2"></div>
  <div class="br-prev" id="brPrev"></div>
  <div class="btnrow"><label><input type="checkbox" id="brRand"> 무작위로 편성</label><button class="go" type="button" id="brMake">대진표 만들기</button></div>
</div>
<div class="br-head" id="brHead"></div>
<div id="brBoard"></div>
<div class="btnrow op br-acts" id="brActs" hidden><button type="button" id="brCopy">결과 복사</button><button type="button" id="brEdit">설정 다시 열기</button><button type="button" class="danger" id="brReset">대진표 지우기</button></div>`,
init(ctx){
const $=K.$,R=ctx.root,KEY="pe-bracket",esc=K.esc;
const FM=[
 {k:"league",t:"리그전",ic:"🔄",d:"모든 팀이 서로 한 번씩 겨뤄요. 승점(승 3 · 무 1 · 패 0) → 득실차 → 다득점 → 승자승 순으로 순위를 정해요. 끝나면 상위 팀끼리 결선 토너먼트를 이어 할 수 있어요.",s2:true},
 {k:"groups",t:"조별 리그",ic:"🧩",d:"팀을 여러 조로 나눠 조 안에서 리그전을 해요. 끝나면 각 조 상위 팀이 결선 토너먼트에 오르거나, 같은 순위끼리 순위 결정전을 해요.",s2:true},
 {k:"cross",t:"크로스 조별전",ic:"✖️",d:"4팀씩 조를 짜서 1경기 A–B, 2경기 C–D를 한 뒤 1경기 승자–2경기 패자, 1경기 패자–2경기 승자가 겨뤄요(크로스). 승수 → 득실차 → 다득점으로 조 순위를 정하고, 끝나면 순위에 따라 다시 토너먼트를 해요.",s2:true},
 {k:"single",t:"토너먼트",ic:"🏆",d:"지면 바로 떨어지는 방식이에요. 팀 수가 2·4·8·16이 아니면 몇 팀은 1라운드를 쉬고(부전승) 올라가요."},
 {k:"rep1",t:"1회전 패자부활 토너먼트",ic:"🔁",d:"1회전에서 진 팀들만 패자부활조에서 다시 겨뤄요. 본선 우승팀과 패자부활조 우승팀이 최종 결승에서 만나요. 2회전부터는 지면 탈락이에요."},
 {k:"double",t:"더블 엘리미네이션",ic:"♻️",d:"두 번 져야 떨어지는 패자부활전이에요. 한 번 진 팀은 패자조에서 계속 올라올 수 있고, 승자조 우승팀과 패자조 우승팀이 결승에서 만나요."}
];
const KO={single:"토너먼트",rep1:"1회전 패자부활 토너먼트",double:"더블 엘리미네이션"};
const DEFCFG={rand:true,twice:false,third:true,reset:true,crossFull:false,pw:3,pd:1,pl:0,groups:2,s2:true,s2mode:"top",s2k:2,s2kind:"single",s2third:true};
let S=K.load(KEY);
if(!S||S.v!==2){if(S&&S.built)K.save("pe-bracket-old",S);S={v:2,fmt:"league",title:"",teams:[],cfg:Object.assign({},DEFCFG),m:[],kos:[],groups:null,built:false,stored:null,s2sig:null,s2stale:false};}
S.cfg=Object.assign({},DEFCFG,S.cfg);
const save=()=>K.save(KEY,S);
const nm=i=>i===-1?"부전승":i==null?"":S.teams[i];
const GL=g=>String.fromCharCode(65+g)+"조";
/* ---------- 만들기 ---------- */
function seedOrder(P){let o=[1,2];while(o.length<P){const n=o.length*2,x=[];o.forEach(s=>{x.push(s,n+1-s);});o=x;}return o;}
function rname(teamsIn){return teamsIn===2?"결승":teamsIn===4?"준결승":teamsIn+"강";}
let mid=0;const M=(o)=>Object.assign({id:"m"+(mid++),a:null,b:null,sa:"",sb:"",pick:null,key:""},o);
function rr(ids,base,twice){
  /* 원형 회전 방식 리그 일정. 홀수면 한 팀씩 쉰다 */
  const arr=ids.slice();if(arr.length%2)arr.push(-1);
  const N=arr.length,rounds=N-1,out=[];let a=arr.slice();
  for(let r=0;r<rounds;r++){
    for(let i=0;i<N/2;i++){const x=a[i],y=a[N-1-i];if(x===-1||y===-1)continue;out.push(M(Object.assign({r:r+1,a:r%2?y:x,b:r%2?x:y,fixA:true},base)));}
    a=[a[0]].concat([a[N-1]],a.slice(1,N-1));
  }
  if(twice)out.slice().forEach(m=>out.push(M(Object.assign({r:m.r+rounds,a:m.b,b:m.a,fixA:true},base))));
  return out;
}
function splitGroups(n,g){
  g=Math.max(1,Math.min(g,Math.floor(n/2)||1));
  return Array.from({length:g},(_,i)=>Math.floor(n/g)+(i<n%g?1:0));
}
function crossSizes(n){
  /* 4팀 조를 기본으로, 남는 팀은 3팀 조로(각 팀 2경기로 같게). 2팀만 남으면 그 조는 1경기 */
  if(n<=4)return [n];
  let g=Math.ceil(n/4);const s=splitGroups(n,g);return s;
}
/* 녹아웃(토너먼트류) 만들기. seeds: 팀 번호 배열(시드 순서). kind: single | rep1 | double */
function buildKO(seeds,kind,o,base){
  const n=seeds.length,out=[];if(n<2)return out;
  const P=Math.pow(2,Math.ceil(Math.log2(n))),ord=seedOrder(P),k=Math.log2(P);
  const B=x=>Object.assign({},base,x);
  let prev=[];
  for(let i=0;i<P/2;i++){const s1=ord[2*i],s2=ord[2*i+1];prev.push(M(B({br:"W",r:1,a:s1<=n?seeds[s1-1]:-1,b:s2<=n?seeds[s2-1]:-1,fixA:true})));}
  out.push(...prev);const r1=prev.slice();
  for(let r=2;r<=k;r++){const cur=[];for(let i=0;i<prev.length/2;i++)cur.push(M(B({br:"W",r,srcA:{m:prev[2*i].id,t:"w"},srcB:{m:prev[2*i+1].id,t:"w"}})));out.push(...cur);prev=cur;}
  const wf=prev[0];
  if(kind==="single"){
    if(o.third&&P>=4){const semis=out.filter(m=>m.br==="W"&&m.r===k-1);out.push(M(B({br:"3",r:k,srcA:{m:semis[0].id,t:"l"},srcB:{m:semis[1].id,t:"l"}})));}
    return out;
  }
  if(kind==="rep1"){
    /* 1회전 패자들끼리 부활조 토너먼트 → 우승팀이 최종 결승 */
    let src=r1.map(m=>({m:m.id,t:"l"})),rr2=1,last=null;
    if(src.length===1)last=src[0];
    while(src.length>1){const cur=[];for(let i=0;i<src.length/2;i++)cur.push(M(B({br:"R",r:rr2,srcA:src[2*i],srcB:src[2*i+1]})));out.push(...cur);src=cur.map(m=>({m:m.id,t:"w"}));rr2++;if(src.length===1)last=src[0];}
    const g1=M(B({br:"G",r:1,srcA:{m:wf.id,t:"w"},srcB:last}));out.push(g1);
    if(o.reset)out.push(M(B({br:"G",r:2,srcA:{m:g1.id,t:"a"},srcB:{m:g1.id,t:"b"},cond:g1.id})));
    return out;
  }
  /* double */
  const wr=r=>out.filter(m=>m.br==="W"&&m.r===r);
  let lb=[];
  for(let i=0;i<r1.length/2;i++)lb.push(M(B({br:"L",r:1,srcA:{m:r1[2*i].id,t:"l"},srcB:{m:r1[2*i+1].id,t:"l"}})));
  if(P===2){lb=[];}
  out.push(...lb);let lr=1;
  for(let j=2;j<=k;j++){
    let losers=wr(j);if(j%2===0)losers=losers.slice().reverse();
    lr++;const maj=lb.map((m,i)=>M(B({br:"L",r:lr,srcA:{m:m.id,t:"w"},srcB:{m:losers[i].id,t:"l"}})));out.push(...maj);lb=maj;
    if(j<k){lr++;const mi=[];for(let i=0;i<lb.length/2;i++)mi.push(M(B({br:"L",r:lr,srcA:{m:lb[2*i].id,t:"w"},srcB:{m:lb[2*i+1].id,t:"w"}})));out.push(...mi);lb=mi;}
  }
  const lf=lb[0];
  const g1=M(B({br:"G",r:1,srcA:{m:wf.id,t:"w"},srcB:lf?{m:lf.id,t:"w"}:{m:wf.id,t:"l"}}));out.push(g1);
  if(o.reset)out.push(M(B({br:"G",r:2,srcA:{m:g1.id,t:"a"},srcB:{m:g1.id,t:"b"},cond:g1.id})));
  return out;
}
function addKO(seeds,kind,o,st,label,tier){
  const id="k"+(S.kos.length+1)+"_"+st+(tier!=null?"_"+tier:"");
  S.kos.push({id,st,kind,label,tier:tier==null?null:tier,seeds:seeds.slice(),third:!!o.third});
  S.m.push(...buildKO(seeds,kind,o,{st,ko:id}));
}
function build(){
  const names=$("brNames").value.split("\n").map(s=>s.trim()).filter(Boolean).slice(0,32);
  if(names.length<2){K.toast("팀을 2팀 이상 넣어 주세요","bad",1600);return false;}
  if(S.fmt==="double"&&names.length<3){K.toast("더블 엘리미네이션은 3팀 이상이 필요해요","bad",1800);return false;}
  if(S.fmt==="rep1"&&names.length<4){K.toast("1회전 패자부활 토너먼트는 4팀 이상이 필요해요","bad",1800);return false;}
  if(S.fmt==="groups"&&names.length<4){K.toast("조별 리그는 4팀 이상이 필요해요","bad",1800);return false;}
  S.title=$("brTitle").value.trim();
  S.teams=S.cfg.rand?K.shuf(names.slice()):names;
  mid=0;S.m=[];S.kos=[];S.groups=null;S.s2sig=null;S.s2stale=false;
  const n=S.teams.length,ids=[...Array(n).keys()],c=S.cfg;
  if(S.fmt==="league"){S.groups=[ids];S.m=rr(ids,{st:1,g:0},c.twice);}
  else if(S.fmt==="groups"){
    let idx=0;S.groups=splitGroups(n,c.groups).map(sz=>{const g=ids.slice(idx,idx+sz);idx+=sz;return g;});
    S.groups.forEach((g,gi)=>S.m.push(...rr(g,{st:1,g:gi},c.twice)));
  }else if(S.fmt==="cross"){
    let idx=0;S.groups=crossSizes(n).map(sz=>{const g=ids.slice(idx,idx+sz);idx+=sz;return g;});
    S.groups.forEach((g,gi)=>{
      if(g.length===4){
        const m1=M({st:1,g:gi,r:1,a:g[0],b:g[1],fixA:true,need:true}),m2=M({st:1,g:gi,r:1,a:g[2],b:g[3],fixA:true,need:true});
        S.m.push(m1,m2,M({st:1,g:gi,r:2,srcA:{m:m1.id,t:"w"},srcB:{m:m2.id,t:"l"}}),M({st:1,g:gi,r:2,srcA:{m:m1.id,t:"l"},srcB:{m:m2.id,t:"w"}}));
        if(c.crossFull)S.m.push(M({st:1,g:gi,r:3,srcA:{m:m1.id,t:"w"},srcB:{m:m2.id,t:"w"}}),M({st:1,g:gi,r:3,srcA:{m:m1.id,t:"l"},srcB:{m:m2.id,t:"l"}}));
      }else S.m.push(...rr(g,{st:1,g:gi},false));
    });
  }else addKO(ids,S.fmt,{third:c.third,reset:c.reset},1,KO[S.fmt]);
  S.built=true;S.stored=null;S.mid=K.newId();
  resolve();ensureStage2();save();draw();K.snd.whistle(1);
  setTimeout(()=>$("brHead").scrollIntoView({block:"start",behavior:"smooth"}),60);
}
/* ---------- 결과 반영 ---------- */
const byId=id=>S.m.find(m=>m.id===id);
function winSide(m){
  if(!m||m.a==null||m.b==null)return null;
  if(m.a===-1&&m.b===-1)return 0;
  if(m.a===-1)return 1;if(m.b===-1)return 0;
  if(m.key!==m.a+":"+m.b)return null;
  const a=m.sa===""?NaN:+m.sa,b=m.sb===""?NaN:+m.sb;
  if(!isNaN(a)&&!isNaN(b)&&a!==b)return a>b?0:1;
  if(m.pick===0||m.pick===1)return m.pick;
  return null;
}
const isDraw=m=>m.key===m.a+":"+m.b&&m.sa!==""&&m.sb!==""&&+m.sa===+m.sb&&m.pick==null;
function team(m,side){return side===0?m.a:m.b;}
function resolve(){
  S.m.forEach(m=>{
    if(m.fixA)return;
    const take=src=>{if(!src)return null;const s=byId(src.m);if(!s)return null;
      if(src.t==="a")return s.a;if(src.t==="b")return s.b;
      const w=winSide(s);if(w==null)return null;return src.t==="w"?team(s,w):team(s,1-w);};
    m.a=take(m.srcA);m.b=take(m.srcB);
    if(m.cond){const g=byId(m.cond);const w=winSide(g);m.off=!(w===1&&g.a!==-1&&g.b!==-1);if(m.off){m.a=null;m.b=null;}}
  });
}
function playable(m){return m.a!=null&&m.b!=null&&m.a!==-1&&m.b!==-1&&!m.off;}
const decided=m=>winSide(m)!=null||isDraw(m);
/* ---------- 순위 ---------- */
function table(ids,list,cross){
  const T={};ids.forEach(i=>T[i]={i,p:0,w:0,d:0,l:0,gf:0,ga:0,pts:0});
  list.forEach(m=>{
    if(!playable(m)||!T[m.a]||!T[m.b])return;
    const w=winSide(m),dr=isDraw(m);if(w==null&&!dr)return;
    const A=T[m.a],B=T[m.b],sa=+m.sa||0,sb=+m.sb||0;
    A.p++;B.p++;A.gf+=sa;A.ga+=sb;B.gf+=sb;B.ga+=sa;
    if(dr){A.d++;B.d++;}else if(w===0){A.w++;B.l++;}else{B.w++;A.l++;}
  });
  const c=S.cfg;
  Object.values(T).forEach(t=>t.pts=t.w*c.pw+t.d*c.pd+t.l*c.pl);
  const h2h=(x,y)=>{const m=list.find(m=>playable(m)&&((m.a===x.i&&m.b===y.i)||(m.a===y.i&&m.b===x.i)));if(!m)return 0;const w=winSide(m);if(w==null)return 0;return team(m,w)===x.i?-1:1;};
  return Object.values(T).sort((x,y)=>cross?((y.w-x.w)||((y.gf-y.ga)-(x.gf-x.ga))||(y.gf-x.gf)||h2h(x,y)):((y.pts-x.pts)||((y.gf-y.ga)-(x.gf-x.ga))||(y.gf-x.gf)||h2h(x,y)));
}
const st1=()=>S.m.filter(m=>m.st===1);
function groupRanks(){return (S.groups||[]).map((ids,g)=>table(ids,st1().filter(m=>m.g===g),S.fmt==="cross").map(t=>t.i));}
function stage1Done(){const L=st1();return L.length===0?false:L.every(m=>m.off||(m.a!=null&&m.b!=null&&(decided(m)||!playable(m))));}
function koRank(ko){
  const L=S.m.filter(m=>m.ko===ko.id);
  if(ko.seeds.length<2)return{done:true,rank:ko.seeds.slice(),co3:[]};
  const W=L.filter(m=>m.br==="W"),k=Math.max(...W.map(m=>m.r)),wf=W.find(m=>m.r===k);
  if(ko.kind==="single"){
    const w=winSide(wf);if(w==null)return{done:false};
    const th=L.find(m=>m.br==="3");const tw=th?winSide(th):null;
    const semis=W.filter(m=>m.r===k-1);
    const co3=!th?semis.map(m=>{const x=winSide(m);return x==null?null:team(m,1-x);}).filter(x=>x!=null&&x!==-1):[];
    return{done:th?tw!=null:true,rank:[team(wf,w),team(wf,1-w)].concat(th&&tw!=null?[team(th,tw),team(th,1-tw)].filter(x=>x!==-1):[]),co3};
  }
  const G=L.filter(m=>m.br==="G"),g1=G[0],g2=G[1];const w1=winSide(g1);if(w1==null)return{done:false};
  let champ,second;
  if(w1===0||!g2||g2.off){champ=team(g1,w1);second=team(g1,1-w1);}
  else{const w2=winSide(g2);if(w2==null)return{done:false};champ=team(g2,w2);second=team(g2,1-w2);}
  if(ko.kind==="double"){
    const Lb=L.filter(m=>m.br==="L");let third=null;
    if(Lb.length){const lmax=Math.max(...Lb.map(m=>m.r));const lf=Lb.find(m=>m.r===lmax);const lw=winSide(lf);if(lw!=null)third=team(lf,1-lw);}
    return{done:true,rank:[champ,second].concat(third!=null&&third!==-1&&third!==second?[third]:[]),co3:[]};
  }
  /* rep1: 공동 3위 = 본선 결승 패자, 부활조 결승 패자 중 2위가 아닌 팀 */
  const co3=[];const ww=winSide(wf);if(ww!=null)co3.push(team(wf,1-ww));
  const Rb=L.filter(m=>m.br==="R");if(Rb.length){const rmax=Math.max(...Rb.map(m=>m.r));const rf=Rb.find(m=>m.r===rmax);const rw=winSide(rf);if(rw!=null)co3.push(team(rf,1-rw));}
  return{done:true,rank:[champ,second],co3:co3.filter(x=>x!==-1&&x!==second&&x!==champ)};
}
/* ---------- 2단계(결선) ---------- */
const hasS2=()=>FM.find(f=>f.k===S.fmt).s2&&S.cfg.s2;
/* 결선 이름: 실제 만들어진 방식 기준(팀이 적어 일반 토너먼트로 바뀐 경우 포함) */
function s2Name(){const c=S.cfg;if(c.s2mode==="tiers"&&S.fmt!=="league")return "순위 결정전";const k=S.kos.find(x=>x.st===2);return "결선 "+KO[k?k.kind:c.s2kind];}
function s2Plan(){
  const gr=groupRanks(),c=S.cfg;
  if(c.s2mode==="tiers"&&S.fmt!=="league"){
    const depth=Math.max(...gr.map(g=>g.length));
    return {mode:"tiers",tiers:Array.from({length:depth},(_,r)=>gr.map(g=>g[r]).filter(x=>x!=null))};
  }
  const k=S.fmt==="league"?Math.min(c.s2k,gr[0].length):c.s2k,seeds=[];
  if(S.fmt==="league")seeds.push(...gr[0].slice(0,k));
  else for(let r=0;r<k;r++)gr.forEach(g=>{if(g[r]!=null)seeds.push(g[r]);});
  return {mode:"top",seeds};
}
function ensureStage2(){
  const had=S.kos.filter(k=>k.st===2),hasRes=S.m.some(m=>m.st===2&&m.key);
  const clear=()=>{S.m=S.m.filter(m=>m.st!==2);S.kos=S.kos.filter(k=>k.st!==2);S.s2sig=null;S.s2stale=false;};
  if(!S.built)return;
  if(!hasS2()){if(had.length)clear();return;}
  if(!stage1Done()){if(had.length&&!hasRes)clear();else if(had.length)S.s2stale=true;return;}
  const plan=s2Plan(),c=S.cfg,sig=JSON.stringify([plan,c.s2kind,c.s2third,c.reset]);
  if(S.s2sig===sig){S.s2stale=false;return;}
  if(had.length&&hasRes){S.s2stale=true;return;}
  clear();
  const kind=c.s2kind;
  if(plan.mode==="top"){
    let kd=kind;if(kd==="rep1"&&plan.seeds.length<4)kd="single";if(kd==="double"&&plan.seeds.length<3)kd="single";
    addKO(plan.seeds,kd,{third:c.s2third,reset:c.reset},2,"결선 "+KO[kd]);
  }else plan.tiers.forEach((t,r)=>addKO(t,"single",{third:true},2,(r+1)+"위 그룹 순위 결정전",r));
  S.s2sig=sig;S.s2stale=false;resolve();
  K.toast(plan.mode==="top"?"1단계 끝! 결선 토너먼트가 만들어졌어요":"1단계 끝! 순위 결정전이 만들어졌어요","bingo",2600);
}
function rebuildStage2(){S.m=S.m.filter(m=>m.st!==2);S.kos=S.kos.filter(k=>k.st!==2);S.s2sig=null;S.s2stale=false;ensureStage2();save();draw();}
function finalRank(){
  if(!S.built)return null;
  if(hasS2()){
    const K2=S.kos.filter(k=>k.st===2);if(!K2.length)return{done:false};
    if(S.cfg.s2mode==="tiers"&&S.fmt!=="league"){
      const rs=K2.sort((a,b)=>a.tier-b.tier).map(k=>koRank(k));if(rs.some(r=>!r.done))return{done:false};
      return{done:true,rank:rs.flatMap(r=>r.rank.concat(r.co3||[])),full:true};
    }
    return koRank(K2[0]);
  }
  if(S.fmt==="league"){return{done:stage1Done(),rank:groupRanks()[0],full:true};}
  if(S.fmt==="groups"||S.fmt==="cross")return{done:stage1Done(),groups:groupRanks()};
  return koRank(S.kos[0]);
}
/* ---------- 그리기 ---------- */
function card(m,label){
  const w=winSide(m),dr=isDraw(m),pl=playable(m),bye=(m.a===-1||m.b===-1);
  const row=(side)=>{
    const t=side===0?m.a:m.b,s=side===0?m.sa:m.sb;
    const cls="br-t"+(w===side?" win":w===1-side?" lose":"")+(t==null?" tbd":"")+(t===-1?" bye":"");
    return "<div class=\""+cls+"\"><button type=\"button\" class=\"br-n\" data-brp=\""+m.id+":"+side+"\""+(pl?"":" disabled")+">"+(t==null?"<span class=\"x\">"+(m.cond?"(필요할 때만)":"기다리는 중")+"</span>":esc(nm(t)))+"</button>"+
      (pl?"<input class=\"br-s\" data-brs=\""+m.id+":"+side+"\" value=\""+esc(m.key===m.a+":"+m.b?s:"")+"\" inputmode=\"numeric\" aria-label=\"점수\">":"<span class=\"br-s0\"></span>")+"</div>";
  };
  const need=dr&&(m.need||m.ko);
  return "<div class=\"br-m"+(pl&&w==null&&!dr?" open":"")+(need?" open":"")+(bye?" isbye":"")+(m.off?" off":"")+"\">"+(label?"<div class=\"br-ml\">"+label+"</div>":"")+row(0)+row(1)+(need?"<div class=\"br-need\">무승부예요. 승부차기 등으로 이긴 팀 이름을 눌러 주세요</div>":"")+"</div>";
}
function standings(t,cross,adv){
  return "<div class=\"br-tabw\"><table class=\"br-tab\"><thead><tr><th>순위</th><th>팀</th><th>경기</th><th>승</th><th>무</th><th>패</th><th>득점</th><th>실점</th><th>득실</th>"+(cross?"":"<th>승점</th>")+"</tr></thead><tbody>"+
    t.map((x,i)=>"<tr class=\""+(i===0&&x.p?"top":"")+(adv&&i<adv?" adv":"")+"\"><td>"+(i+1)+"</td><td class=\"tn\">"+esc(nm(x.i))+"</td><td>"+x.p+"</td><td>"+x.w+"</td><td>"+x.d+"</td><td>"+x.l+"</td><td>"+x.gf+"</td><td>"+x.ga+"</td><td>"+(x.gf-x.ga>0?"+":"")+(x.gf-x.ga)+"</td>"+(cross?"":"<td><b>"+x.pts+"</b></td>")+"</tr>").join("")+"</tbody></table></div>";
}
function drawRounds(L,ids,rl,lbl){
  const rounds=[...new Set(L.map(m=>m.r))].sort((a,b)=>a-b);
  return "<div class=\"br-rounds\">"+rounds.map(r=>{const X=L.filter(m=>m.r===r);const rest=ids?ids.filter(i=>!X.some(m=>m.a===i||m.b===i)):[];
    return "<div class=\"br-round\"><h4>"+rl(r)+(rest.length&&!lbl?" <span class=\"x\">· 쉬는 팀: "+rest.map(i=>esc(nm(i))).join(", ")+"</span>":"")+"</h4>"+X.map((m,i)=>card(m,lbl?lbl(r,i):"")).join("")+"</div>";}).join("")+"</div>";
}
function drawTree(list,labelFn){
  const rounds=[...new Set(list.map(m=>m.r))].sort((a,b)=>a-b);
  return "<div class=\"br-tree\">"+rounds.map(r=>{const L=list.filter(m=>m.r===r);return "<div class=\"br-col\"><h4>"+labelFn(r,L)+"</h4><div class=\"br-colm\">"+L.map(m=>card(m)).join("")+"</div></div>";}).join("")+"</div>";
}
function drawKO(ko){
  const L=S.m.filter(m=>m.ko===ko.id);
  if(ko.seeds.length<2)return "<div class=\"br-extra\"><div class=\"x\">"+(ko.seeds.length?esc(nm(ko.seeds[0]))+" (혼자라 경기 없이 그대로 순위가 정해져요)":"참가 팀 없음")+"</div></div>";
  const W=L.filter(m=>m.br==="W"),wmax=Math.max(...W.map(m=>m.r));
  if(ko.kind==="single"){
    let h=drawTree(W,(r,X)=>rname(X.length*2));
    const th=L.find(m=>m.br==="3");if(th)h+="<div class=\"br-extra\"><h4>3·4위전</h4>"+card(th)+"</div>";
    return h;
  }
  const G=L.filter(m=>m.br==="G");
  if(ko.kind==="rep1"){
    const Rb=L.filter(m=>m.br==="R");
    return "<h4 class=\"br-sub\">본선</h4>"+drawTree(W,(r,X)=>r===wmax?"본선 결승":rname(X.length*2))+
      (Rb.length?"<h4 class=\"br-sub lb\">패자부활조 <span class=\"x\">· 1회전에서 진 팀끼리, 우승팀은 최종 결승으로</span></h4>"+drawTree(Rb,(r,X)=>X.length===1?"부활조 결승":"부활조 "+r+"라운드"):"<div class=\"x\">1회전에서 진 팀이 바로 최종 결승에 올라요.</div>")+
      "<h4 class=\"br-sub gf\">최종 결승</h4><div class=\"br-extra\">"+G.map((m,i)=>card(m,i===0?"본선 우승 vs 패자부활조 우승":"재경기 (부활조 팀이 이기면 한 번 더)")).join("")+"</div>";
  }
  const Lb=L.filter(m=>m.br==="L");
  return "<h4 class=\"br-sub\">승자조</h4>"+drawTree(W,(r,X)=>r===wmax?"승자조 결승":rname(X.length*2))+
    (Lb.length?"<h4 class=\"br-sub lb\">패자조 <span class=\"x\">· 한 번 진 팀이 다시 올라오는 길</span></h4>"+drawTree(Lb,(r)=>"패자조 "+r+"라운드"):"")+
    "<h4 class=\"br-sub gf\">최종 결승</h4><div class=\"br-extra\">"+G.map((m,i)=>card(m,i===0?"승자조 우승 vs 패자조 우승":"재경기 (패자조 팀이 이기면 한 번 더)")).join("")+"</div>";
}
function drawStage1(){
  if(S.fmt==="league"){
    const L=st1(),t=table(S.groups[0],L,false);
    return standings(t,false,hasS2()&&S.cfg.s2mode==="top"?Math.min(S.cfg.s2k,S.teams.length):0)+drawRounds(L,S.groups[0],r=>r+"라운드");
  }
  if(S.fmt==="groups"||S.fmt==="cross"){
    const cross=S.fmt==="cross",adv=hasS2()&&S.cfg.s2mode==="top"?S.cfg.s2k:0;
    return "<div class=\"br-groups\">"+S.groups.map((ids,g)=>{
      const L=st1().filter(m=>m.g===g),t=table(ids,L,cross),four=cross&&ids.length===4;
      const rl=r=>four?(r===1?"1라운드":r===2?"2라운드 (크로스)":"3라운드 (남은 경기)"):r+"라운드";
      const lbl=four?(r,i)=>r===1?(i+1)+"경기":r===2?(i===0?"1경기 승자 vs 2경기 패자":"1경기 패자 vs 2경기 승자"):"":null;
      return "<section class=\"br-group\"><h3 class=\"br-sec\">"+GL(g)+" <span class=\"x\">"+ids.map(i=>esc(nm(i))).join(" · ")+(cross&&!four?" · "+ids.length+"팀 조는 조 안 리그":"")+"</span></h3>"+standings(t,cross,adv)+drawRounds(L,ids,rl,lbl)+"</section>";
    }).join("")+"</div>";
  }
  return drawKO(S.kos[0]);
}
function drawStage2(){
  if(!hasS2())return "";
  const c=S.cfg,K2=S.kos.filter(k=>k.st===2);
  let h="<h3 class=\"br-stage\">2단계 · "+s2Name()+"</h3>";
  if(S.s2stale)h+="<div class=\"br-warn\">1단계 결과가 바뀌어 진출 팀이 달라졌어요. <button type=\"button\" class=\"small\" id=\"brS2Re\">결선 다시 만들기</button> <span class=\"x\">(결선에 넣은 점수는 지워져요)</span></div>";
  if(!K2.length)return h+"<div class=\"br-empty\">1단계 경기가 모두 끝나면 순위에 따라 자동으로 만들어져요. "+s2Desc()+"</div>";
  return h+K2.map(k=>(K2.length>1?"<section class=\"br-group\"><h3 class=\"br-sec\">"+esc(k.label)+" <span class=\"x\">"+k.seeds.map(i=>esc(nm(i))).join(" · ")+"</span></h3>":"")+drawKO(k)+(K2.length>1?"</section>":"")).join("");
}
function s2Desc(){
  const c=S.cfg;
  if(c.s2mode==="tiers"&&S.fmt!=="league")return "각 조 1위끼리, 2위끼리, 3위끼리… 따로 토너먼트를 해서 전체 순위를 정해요.";
  return (S.fmt==="league"?"상위 "+c.s2k+"팀":"각 조 상위 "+c.s2k+"팀")+"이 "+KO[c.s2kind]+"로 우승을 가려요. 1위가 다른 조 2위와 먼저 만나도록 엇갈려 배치해요."+(c.s2kind==="rep1"?" (결선 진출 팀이 4팀보다 적으면 일반 토너먼트로 해요)":c.s2kind==="double"?" (3팀보다 적으면 일반 토너먼트)":"");
}
function drawSetup(){
  $("brFmts").innerHTML=FM.map(f=>"<button type=\"button\" class=\"tmm"+(f.k===S.fmt?" on":"")+"\" data-brf=\""+f.k+"\"><span class=\"ic\">"+f.ic+"</span>"+f.t+"</button>").join("");
  const F=FM.find(f=>f.k===S.fmt);$("brFdesc").textContent=F.d;
  const c=S.cfg,pts="<div class=\"cfgrow\">승점 <label>승 <input type=\"number\" data-brc=\"pw\" value=\""+c.pw+"\" min=\"0\" max=\"9\"></label><label>무 <input type=\"number\" data-brc=\"pd\" value=\""+c.pd+"\" min=\"0\" max=\"9\"></label><label>패 <input type=\"number\" data-brc=\"pl\" value=\""+c.pl+"\" min=\"0\" max=\"9\"></label></div>";
  let o="";
  if(S.fmt==="league")o="<label><input type=\"checkbox\" data-brc=\"twice\""+(c.twice?" checked":"")+"> 두 번씩 겨루기 (2회전)</label>"+pts;
  if(S.fmt==="groups")o="<div class=\"cfgrow\"><label>조 수 <select data-brc=\"groups\">"+[2,3,4,5,6,7,8].map(v=>"<option"+(v===c.groups?" selected":"")+">"+v+"</option>").join("")+"</select></label></div><label><input type=\"checkbox\" data-brc=\"twice\""+(c.twice?" checked":"")+"> 조 안에서 두 번씩 겨루기</label>"+pts;
  if(S.fmt==="cross")o="<label><input type=\"checkbox\" data-brc=\"crossFull\""+(c.crossFull?" checked":"")+"> 3라운드까지 (승자끼리·패자끼리 남은 경기도 하기)</label><div class=\"x\">4팀씩 조를 짜요. 4로 나누어떨어지지 않으면 3팀 조를 만들어 조 안 리그(각 팀 2경기)로 해요.</div>";
  if(S.fmt==="single")o="<label><input type=\"checkbox\" data-brc=\"third\""+(c.third?" checked":"")+"> 3·4위전 하기</label>";
  if(S.fmt==="rep1"||S.fmt==="double")o="<label><input type=\"checkbox\" data-brc=\"reset\""+(c.reset?" checked":"")+"> 최종 결승에서 "+(S.fmt==="rep1"?"부활조":"패자조")+" 팀이 이기면 한 번 더 (재경기)</label><div class=\"x\">위쪽 팀은 아직 한 번도 지지 않았으니, 아래쪽 팀이 결승에서 이기면 서로 1패씩이 되어 한 번 더 겨룰 수 있어요.</div>";
  $("brOpts").innerHTML=o;
  let s2="";
  if(F.s2){
    s2="<h4 class=\"br-stg\">2단계 · 결선</h4><label><input type=\"checkbox\" data-brc=\"s2\""+(c.s2?" checked":"")+"> 1단계가 끝나면 순위에 따라 토너먼트 이어 하기</label>";
    if(c.s2){
      s2+="<div class=\"cfgrow\">";
      if(S.fmt!=="league")s2+="<label>방식 <select data-brc=\"s2mode\"><option value=\"top\""+(c.s2mode==="top"?" selected":"")+">상위 팀 결선 토너먼트</option><option value=\"tiers\""+(c.s2mode==="tiers"?" selected":"")+">같은 순위끼리 순위 결정전</option></select></label>";
      if(c.s2mode==="top"||S.fmt==="league"){
        s2+="<label>진출 <select data-brc=\"s2k\">"+(S.fmt==="league"?[2,3,4,6,8]:[1,2,3,4]).map(v=>"<option value=\""+v+"\""+(v===c.s2k?" selected":"")+">"+(S.fmt==="league"?"상위 "+v+"팀":"각 조 "+v+"위까지")+"</option>").join("")+"</select></label>";
        s2+="<label>결선 <select data-brc=\"s2kind\">"+Object.keys(KO).map(k=>"<option value=\""+k+"\""+(k===c.s2kind?" selected":"")+">"+KO[k]+"</option>").join("")+"</select></label>";
        if(c.s2kind==="single")s2+="<label><input type=\"checkbox\" data-brc=\"s2third\""+(c.s2third?" checked":"")+"> 3·4위전</label>";
        if(c.s2kind!=="single")s2+="<label><input type=\"checkbox\" data-brc=\"reset\""+(c.reset?" checked":"")+"> 결승 재경기</label>";
      }
      s2+="</div><div class=\"x\">"+s2Desc()+"</div>";
    }
  }
  $("brS2").innerHTML=s2;$("brS2").hidden=!F.s2;
  $("brPrev").innerHTML=preview();
  $("brRand").checked=c.rand;
  K.setVal("brTitle",S.title||"");
  if(document.activeElement!==$("brNames")&&!$("brNames").value)$("brNames").value=(S.teams.length?S.teams:["1반","2반","3반","4반","5반","6반","7반","8반"]).join("\n");
  K.setVal("brN",$("brNames").value.split("\n").filter(s=>s.trim()).length);
  const imp=K.load("pe-bracket-import");$("brImp").hidden=!(imp&&imp.names&&imp.names.length);
  if(imp&&imp.names)$("brImp").textContent="팀 나누기 결과 가져오기 ("+(imp.from?imp.from+" · ":"")+imp.names.length+"팀)";
}
function preview(){
  /* 팀 수에 따라 대략 몇 경기인지 미리 보여 준다 */
  const n=$("brNames").value.split("\n").filter(s=>s.trim()).length;if(n<2)return "";
  const c=S.cfg,P=Math.pow(2,Math.ceil(Math.log2(n)));
  const rrN=x=>x*(x-1)/2;let t="";
  if(S.fmt==="league")t="리그 "+rrN(n)*(c.twice?2:1)+"경기";
  else if(S.fmt==="groups"){const g=splitGroups(n,c.groups);t=g.length+"개 조("+g.join("·")+"팀) · 조별 "+g.reduce((a,x)=>a+rrN(x),0)*(c.twice?2:1)+"경기";}
  else if(S.fmt==="cross"){const g=crossSizes(n);t=g.length+"개 조("+g.join("·")+"팀)";}
  else t=n+"팀"+(P>n?" · 부전승 "+(P-n)+"팀":"");
  return "<div class=\"x\">미리 보기: "+t+(FM.find(f=>f.k===S.fmt).s2&&c.s2?" → 결선":"")+"</div>";
}
function draw(){
  drawSetup();
  if(!S.built){$("brHead").innerHTML="";$("brBoard").innerHTML="<div class=\"br-empty\">팀을 넣고 방식을 고른 뒤 <b>대진표 만들기</b>를 누르세요.</div>";$("brActs").hidden=true;$("brSetup").hidden=false;return;}
  $("brActs").hidden=false;
  const f=FM.find(x=>x.k===S.fmt),fr=finalRank();
  let champ="";
  if(fr&&fr.done&&fr.rank)champ="<div class=\"br-champ\">🏆 <b>"+esc(nm(fr.rank[0]))+"</b> 우승"+(fr.rank[1]!=null?" · 2위 "+esc(nm(fr.rank[1])):"")+(fr.rank[2]!=null?" · 3위 "+esc(nm(fr.rank[2])):fr.co3&&fr.co3.length?" · 공동 3위 "+fr.co3.map(i=>esc(nm(i))).join(", "):"")+"</div>"+(fr.full&&fr.rank.length>3?"<div class=\"br-full\">전체 순위 · "+fr.rank.map((i,r)=>(r+1)+"위 "+esc(nm(i))).join(" · ")+"</div>":"");
  if(fr&&fr.done&&fr.groups)champ="<div class=\"br-champ\">🏆 "+fr.groups.map((g,i)=>GL(i)+" 1위 <b>"+esc(nm(g[0]))+"</b>").join(" · ")+"</div>";
  const left=S.m.filter(m=>playable(m)&&winSide(m)==null&&!(isDraw(m)&&!m.ko&&!m.need)).length;
  $("brHead").innerHTML="<div class=\"br-h\"><h2>"+esc(S.title||"우리 반 대회")+"</h2><span>"+f.ic+" "+f.t+(hasS2()?" → "+s2Name():"")+" · "+S.teams.length+"팀 · "+(left?"남은 경기 "+left:"모든 경기 끝")+"</span></div>"+champ+
    "<div class=\"br-help op\">점수를 넣으면 이긴 팀이 자동으로 올라가요. 점수 없이 이긴 팀 이름만 눌러도 돼요(다시 누르면 취소).</div>";
  $("brBoard").innerHTML=(hasS2()?"<h3 class=\"br-stage\">1단계 · "+f.t+"</h3>":"")+drawStage1()+drawStage2();
  if(fr&&fr.done&&S.stored!==S.mid){S.stored=S.mid;save();ctx.store(makeRec());K.snd.fanfare();}
}
function makeRec(){
  const fr=finalRank()||{},d=[];
  d.push((FM.find(x=>x.k===S.fmt)||FM[0]).t+(hasS2()?" → "+s2Name():"")+" · "+S.teams.length+"팀");
  S.m.filter(m=>playable(m)&&decided(m)).forEach(m=>d.push((m.st===2?"[결선] ":"")+nm(m.a)+" "+(m.sa===""?(winSide(m)===0?"승":"패"):m.sa)+" : "+(m.sb===""?(winSide(m)===1?"승":"패"):m.sb)+" "+nm(m.b)));
  let teams=S.teams.map(n=>({name:n,score:0}));
  if(fr.rank)teams=fr.rank.map((i,r)=>({name:nm(i),score:r+1+"위"}));
  return{id:S.mid||K.newId(),sport:"bracket",sportName:"대진표 · "+(S.title||"대회"),at:Date.now(),done:!!fr.done,
    teams:teams.slice(0,4).map(t=>({name:t.name,score:t.score})),winner:fr.rank?nm(fr.rank[0]):fr.groups?fr.groups.map(g=>nm(g[0])).join(", "):null,
    summary:fr.rank?fr.rank.slice(0,3).map((i,r)=>(r+1)+"위 "+nm(i)).join(" · "):(FM.find(x=>x.k===S.fmt)||FM[0]).t,details:d,players:[]};
}
function asText(){
  const fr=finalRank()||{};let t=(S.title||"대회")+" ("+(FM.find(x=>x.k===S.fmt)||FM[0]).t+(hasS2()?" → 결선":"")+")\n";
  if(fr.rank)t+=fr.rank.map((i,r)=>(r+1)+"위 "+nm(i)).join("\n")+"\n";
  if(fr.co3&&fr.co3.length)t+="공동 3위 "+fr.co3.map(nm).join(", ")+"\n";
  if(fr.groups)t+=fr.groups.map((g,gi)=>GL(gi)+": "+g.map((i,r)=>(r+1)+"위 "+nm(i)).join(", ")).join("\n")+"\n";
  t+="\n경기 결과\n"+S.m.filter(playable).map(m=>(m.st===2?"[결선] ":"")+nm(m.a)+" "+(m.sa||"-")+" : "+(m.sb||"-")+" "+nm(m.b)+(winSide(m)!=null?" → "+nm(team(m,winSide(m)))+" 승":isDraw(m)?" (무)":"")).join("\n");
  return t;
}
function after(){resolve();ensureStage2();resolve();save();draw();}
/* ---------- 이벤트 ---------- */
R.addEventListener("click",e=>{
  let b;
  if(b=e.target.closest("[data-brf]")){S.fmt=b.dataset.brf;if(S.fmt==="cross"&&!S.cfg._crossSet){S.cfg.s2mode="tiers";S.cfg._crossSet=true;}save();drawSetup();return;}
  if(e.target.closest("#brS2Re")){rebuildStage2();K.toast("결선을 다시 만들었어요","",1600);return;}
  if(b=e.target.closest("[data-brp]")){
    const [id,side]=b.dataset.brp.split(":");const m=byId(id);if(!playable(m))return;
    const k=m.a+":"+m.b;if(m.key!==k){m.key=k;m.sa="";m.sb="";m.pick=null;}
    const sd=+side,a=m.sa===""?NaN:+m.sa,bb=m.sb===""?NaN:+m.sb;
    if(!isNaN(a)&&!isNaN(bb)&&a!==bb){K.toast("점수로 승패가 정해져 있어요. 점수를 고쳐 주세요","",1600);return;}
    m.pick=m.pick===sd?null:sd;after();K.snd.chime();return;
  }
});
R.addEventListener("change",e=>{
  const el=e.target;
  if(el.dataset.brs){
    const [id,side]=el.dataset.brs.split(":");const m=byId(id);const k=m.a+":"+m.b;
    if(m.key!==k){m.key=k;m.sa="";m.sb="";m.pick=null;}
    const v=el.value.trim()===""?"":String(Math.max(0,parseInt(el.value,10)||0));
    if(side==="0")m.sa=v;else m.sb=v;
    if(m.sa!==""&&m.sb!==""&&+m.sa!==+m.sb)m.pick=null;
    after();
    const nx=R.querySelector("[data-brs='"+id+":"+(side==="0"?"1":"0")+"']");if(side==="0"&&nx)nx.focus();
    return;
  }
  if(el.dataset.brc){const k=el.dataset.brc;S.cfg[k]=el.type==="checkbox"?el.checked:el.tagName==="SELECT"&&isNaN(+el.value)?el.value:Math.max(0,+el.value||0);
    save();if(S.built){if(["pw","pd","pl","s2","s2mode","s2k","s2kind","s2third","reset"].includes(k))after();else drawSetup();}else drawSetup();return;}
  if(el.id==="brRand"){S.cfg.rand=el.checked;save();return;}
  if(el.id==="brTitle"){S.title=el.value.trim();save();if(S.built)draw();return;}
});
$("brNGo").onclick=()=>{const n=Math.max(2,Math.min(32,+$("brN").value||4));$("brNames").value=Array.from({length:n},(_,i)=>(i+1)+"팀").join("\n");drawSetup();};
$("brImp").onclick=()=>{const imp=K.load("pe-bracket-import");if(!imp)return;$("brNames").value=imp.names.join("\n");K.setVal("brN",imp.names.length);drawSetup();K.toast(imp.names.length+"팀을 가져왔어요","",1500);};
$("brNames").addEventListener("input",()=>{K.setVal("brN",$("brNames").value.split("\n").filter(s=>s.trim()).length);$("brPrev").innerHTML=preview();});
$("brMake").onclick=()=>{if(S.built&&S.m.some(m=>m.key)&&!$("brMake").classList.contains("arm")){$("brMake").classList.add("arm");$("brMake").textContent="결과가 지워져요 · 한 번 더 누르기";setTimeout(()=>{$("brMake").classList.remove("arm");$("brMake").textContent="대진표 만들기";},3000);return;}$("brMake").classList.remove("arm");$("brMake").textContent="대진표 만들기";if(build()!==false){$("brSetup").hidden=true;draw();}};
$("brEdit").onclick=()=>{$("brSetup").hidden=!$("brSetup").hidden;if(!$("brSetup").hidden)$("brSetup").scrollIntoView({block:"start",behavior:"smooth"});};
K.arm($("brReset"),"대진표 지우기",()=>{S.built=false;S.m=[];S.kos=[];save();draw();});
$("brCopy").onclick=async()=>{const ok=await K.copyText(asText());K.toast(ok?"대회 결과를 복사했어요":"복사가 안 되는 환경이에요","",1600);};
const imp=K.load("pe-bracket-import");let fresh=false;
if(imp&&imp.at&&Date.now()-imp.at<60000){fresh=true;$("brNames").value=imp.names.join("\n");K.save("pe-bracket-import",Object.assign({},imp,{at:0}));setTimeout(()=>K.toast(imp.names.length+"팀을 가져왔어요. 방식을 고르고 대진표를 만드세요","",2400),300);}
mid=S.m.reduce((x,m)=>Math.max(x,+m.id.slice(1)+1),0);
draw();
$("brSetup").hidden=S.built&&!fresh;
return{record:makeRec};
}};
