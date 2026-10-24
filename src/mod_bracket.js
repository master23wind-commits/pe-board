/* ================= 대진표 (리그전 · 토너먼트 · 패자부활전 · 크로스 토너먼트) ================= */
MODS.bracket={name:"대진표",sub:"리그전 · 토너먼트 · 패자부활전 · 크로스 토너먼트",color:"var(--c-br)",
html:`
<div class="box op br-setup" id="brSetup">
  <div class="cfgrow"><label class="br-title">대회 이름 <input id="brTitle" maxlength="40" placeholder="예) 2학년 반 대항 피구 대회"></label></div>
  <div class="br-fmts" id="brFmts"></div>
  <div class="br-fdesc" id="brFdesc"></div>
  <div class="br-two">
    <div>
      <div class="cfgrow"><label>팀 수 <input id="brN" type="number" min="2" max="32" inputmode="numeric"></label><button type="button" class="small" id="brNGo">이름 자동으로</button><button type="button" class="small" id="brImp" hidden>팀 나누기 결과 가져오기</button></div>
      <textarea id="brNames" rows="7" placeholder="한 줄에 한 팀씩&#10;1반&#10;2반&#10;3반&#10;4반"></textarea>
    </div>
    <div class="br-opts" id="brOpts"></div>
  </div>
  <div class="btnrow"><label><input type="checkbox" id="brRand"> 무작위로 편성</label><button class="go" type="button" id="brMake">대진표 만들기</button></div>
</div>
<div class="br-head" id="brHead"></div>
<div id="brBoard"></div>
<div class="btnrow op br-acts" id="brActs" hidden><button type="button" id="brCopy">결과 복사</button><button type="button" id="brEdit">설정 다시 열기</button><button type="button" class="danger" id="brReset">대진표 지우기</button></div>`,
init(ctx){
const $=K.$,R=ctx.root,KEY="pe-bracket",esc=K.esc;
const FM=[
 {k:"league",t:"리그전",ic:"🔄",d:"모든 팀이 서로 한 번씩 겨뤄요. 승점(승 3 · 무 1 · 패 0) → 득실차 → 다득점 → 승자승 순으로 순위를 정해요."},
 {k:"single",t:"토너먼트",ic:"🏆",d:"지면 바로 떨어지는 방식이에요. 팀 수가 2·4·8·16이 아니면 몇 팀은 1라운드를 쉬고(부전승) 올라가요."},
 {k:"double",t:"패자부활전",ic:"♻️",d:"한 번 져도 패자조에서 다시 올라올 기회가 있어요. 두 번 지면 떨어지고, 승자조 우승팀과 패자조 우승팀이 결승에서 만나요."},
 {k:"cross",t:"크로스 토너먼트",ic:"✖️",d:"4팀씩 조를 짜서 1경기 A–B, 2경기 C–D를 한 뒤, 1경기 승자–2경기 패자, 1경기 패자–2경기 승자가 겨뤄요(크로스). 승수 → 득실차 → 다득점으로 조 순위를 정해요."}
];
let S=K.load(KEY);if(!S)S={fmt:"league",title:"",teams:[],cfg:{rand:true,twice:false,third:true,reset:true,crossFull:false,pw:3,pd:1,pl:0},m:[],built:false,stored:null};
const save=()=>K.save(KEY,S);
const nm=i=>i===-1?"부전승":i==null?"":S.teams[i];
/* ---------- 만들기 ---------- */
function seedOrder(P){let o=[1,2];while(o.length<P){const n=o.length*2,x=[];o.forEach(s=>{x.push(s,n+1-s);});o=x;}return o;}
function rname(teamsIn){return teamsIn===2?"결승":teamsIn===4?"준결승":teamsIn+"강";}
let mid=0;const M=(o)=>Object.assign({id:"m"+(mid++),a:null,b:null,sa:"",sb:"",pick:null,key:""},o);
function buildLeague(n){
  const ids=[...Array(n).keys()];if(n%2)ids.push(-1);
  const N=ids.length,rounds=N-1,out=[];
  let arr=ids.slice();
  for(let r=0;r<rounds;r++){
    for(let i=0;i<N/2;i++){const x=arr[i],y=arr[N-1-i];if(x===-1||y===-1)continue;out.push(M({r:r+1,a:r%2?y:x,b:r%2?x:y,fixA:true}));}
    arr=[arr[0]].concat([arr[N-1]],arr.slice(1,N-1));
  }
  if(S.cfg.twice)out.slice().forEach(m=>out.push(M({r:m.r+rounds,a:m.b,b:m.a,fixA:true})));
  return out;
}
function buildSingle(n,tag,third){
  const P=Math.pow(2,Math.ceil(Math.log2(Math.max(2,n))));
  const ord=seedOrder(P),out=[],rounds=Math.log2(P);
  let prev=[];
  for(let i=0;i<P/2;i++){const s1=ord[2*i],s2=ord[2*i+1];prev.push(M({br:tag||"W",r:1,a:s1<=n?s1-1:-1,b:s2<=n?s2-1:-1,fixA:true}));}
  out.push(...prev);
  for(let r=2;r<=rounds;r++){
    const cur=[];for(let i=0;i<prev.length/2;i++)cur.push(M({br:tag||"W",r,srcA:{m:prev[2*i].id,t:"w"},srcB:{m:prev[2*i+1].id,t:"w"}}));
    out.push(...cur);prev=cur;
  }
  if(third&&P>=4){const semis=out.filter(m=>m.r===rounds-1);out.push(M({br:"3",r:rounds,srcA:{m:semis[0].id,t:"l"},srcB:{m:semis[1].id,t:"l"}}));}
  return{list:out,P,rounds};
}
function buildDouble(n){
  const W=buildSingle(n,"W",false),P=W.P,k=W.rounds,out=W.list.slice();
  const wr=r=>out.filter(m=>m.br==="W"&&m.r===r);
  // 패자조
  let lb=[];const r1=wr(1);
  for(let i=0;i<r1.length/2;i++)lb.push(M({br:"L",r:1,srcA:{m:r1[2*i].id,t:"l"},srcB:{m:r1[2*i+1].id,t:"l"}}));
  out.push(...lb);
  let lr=1;
  for(let j=2;j<=k;j++){
    // 메이저: 패자조 생존팀 vs 승자조 j라운드 패자
    let losers=wr(j);if(j%2===0)losers=losers.slice().reverse();
    lr++;const maj=lb.map((m,i)=>M({br:"L",r:lr,srcA:{m:m.id,t:"w"},srcB:{m:losers[i].id,t:"l"}}));
    out.push(...maj);lb=maj;
    if(j<k){lr++;const mi=[];for(let i=0;i<lb.length/2;i++)mi.push(M({br:"L",r:lr,srcA:{m:lb[2*i].id,t:"w"},srcB:{m:lb[2*i+1].id,t:"w"}}));out.push(...mi);lb=mi;}
  }
  const wf=wr(k)[0],lf=lb[0];
  const g1=M({br:"G",r:1,srcA:{m:wf.id,t:"w"},srcB:{m:lf.id,t:"w"}});out.push(g1);
  if(S.cfg.reset)out.push(M({br:"G",r:2,srcA:{m:g1.id,t:"a"},srcB:{m:g1.id,t:"b"},cond:g1.id}));
  return out;
}
function buildCross(n){
  const g=Math.max(1,Math.round(n/4));
  const sizes=Array.from({length:g},(_,i)=>Math.floor(n/g)+(i<n%g?1:0));
  const out=[];let idx=0;S.groups=[];
  sizes.forEach((sz,gi)=>{
    const ids=[...Array(sz).keys()].map(x=>x+idx);idx+=sz;S.groups.push(ids);
    if(sz===4){
      const m1=M({br:"C",g:gi,r:1,a:ids[0],b:ids[1],fixA:true,need:true}),m2=M({br:"C",g:gi,r:1,a:ids[2],b:ids[3],fixA:true,need:true});
      out.push(m1,m2,
        M({br:"C",g:gi,r:2,srcA:{m:m1.id,t:"w"},srcB:{m:m2.id,t:"l"}}),
        M({br:"C",g:gi,r:2,srcA:{m:m1.id,t:"l"},srcB:{m:m2.id,t:"w"}}));
      if(S.cfg.crossFull)out.push(M({br:"C",g:gi,r:3,srcA:{m:m1.id,t:"w"},srcB:{m:m2.id,t:"w"}}),M({br:"C",g:gi,r:3,srcA:{m:m1.id,t:"l"},srcB:{m:m2.id,t:"l"}}));
    }else{
      // 4팀이 아닌 조는 조 안에서 리그전
      const arr=ids.slice();if(arr.length%2)arr.push(-1);const N=arr.length;let a=arr.slice();
      for(let r=0;r<N-1;r++){for(let i=0;i<N/2;i++){const x=a[i],y=a[N-1-i];if(x!==-1&&y!==-1)out.push(M({br:"C",g:gi,r:r+1,a:x,b:y,fixA:true}));}a=[a[0]].concat([a[N-1]],a.slice(1,N-1));}
    }
  });
  return out;
}
function build(){
  const names=$("brNames").value.split("\n").map(s=>s.trim()).filter(Boolean).slice(0,32);
  if(names.length<2){K.toast("팀을 2팀 이상 넣어 주세요","bad",1600);return false;}
  if(S.fmt==="double"&&names.length<3){K.toast("패자부활전은 3팀 이상이 필요해요","bad",1800);return false;}
  S.title=$("brTitle").value.trim();
  S.teams=S.cfg.rand?K.shuf(names.slice()):names;
  mid=0;S.groups=null;
  S.m=S.fmt==="league"?buildLeague(S.teams.length):S.fmt==="single"?buildSingle(S.teams.length,"W",S.cfg.third).list:S.fmt==="double"?buildDouble(S.teams.length):buildCross(S.teams.length);
  S.built=true;S.stored=null;S.mid=K.newId();
  resolve();save();draw();K.snd.whistle(1);
  setTimeout(()=>$("brHead").scrollIntoView({block:"start",behavior:"smooth"}),60);
}
/* ---------- 결과 반영 ---------- */
const byId=id=>S.m.find(m=>m.id===id);
function winSide(m){
  if(m.a==null||m.b==null)return null;
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
    if(!m.fixA){
      const take=src=>{if(!src)return null;const s=byId(src.m);if(!s)return null;
        if(src.t==="a")return s.a;if(src.t==="b")return s.b;
        const w=winSide(s);if(w==null)return null;return src.t==="w"?team(s,w):team(s,1-w);};
      m.a=take(m.srcA);m.b=take(m.srcB);
      if(m.cond){const g=byId(m.cond);const w=winSide(g);m.off=!(w===1);if(m.off){m.a=null;m.b=null;}}
    }
    if(m.key&&m.key!==m.a+":"+m.b){/* 참가 팀이 바뀌면 이전 결과는 무효 */}
  });
}
function playable(m){return m.a!=null&&m.b!=null&&m.a!==-1&&m.b!==-1&&!m.off;}
/* ---------- 순위 ---------- */
function table(ids,list){
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
  const cross=S.fmt==="cross";
  return Object.values(T).sort((x,y)=>cross?((y.w-x.w)||((y.gf-y.ga)-(x.gf-x.ga))||(y.gf-x.gf)||h2h(x,y)):((y.pts-x.pts)||((y.gf-y.ga)-(x.gf-x.ga))||(y.gf-x.gf)||h2h(x,y)));
}
function finalRank(){
  if(!S.built)return null;
  const done=S.m.filter(playable).every(m=>winSide(m)!=null||isDraw(m));
  if(S.fmt==="league"){return{done,rank:table(S.teams.map((_,i)=>i),S.m).map(t=>t.i)};}
  if(S.fmt==="cross"){return{done,groups:S.groups.map((ids,g)=>table(ids,S.m.filter(m=>m.g===g)).map(t=>t.i))};}
  if(S.fmt==="single"){
    const rounds=Math.max(...S.m.filter(m=>m.br==="W").map(m=>m.r));
    const f=S.m.find(m=>m.br==="W"&&m.r===rounds);const w=winSide(f);
    const th=S.m.find(m=>m.br==="3");const tw=th?winSide(th):null;
    if(w==null)return{done:false};
    return{done:th?tw!=null:true,rank:[team(f,w),team(f,1-w)].concat(th&&tw!=null?[team(th,tw)]:[])};
  }
  if(S.fmt==="double"){
    const g=S.m.filter(m=>m.br==="G");const g1=g[0],g2=g[1];const w1=winSide(g1);if(w1==null)return{done:false};
    let champ,second;
    if(w1===0||!g2){champ=team(g1,w1);second=team(g1,1-w1);}
    else{const w2=winSide(g2);if(w2==null)return{done:false};champ=team(g2,w2);second=team(g2,1-w2);}
    const lmax=Math.max(...S.m.filter(m=>m.br==="L").map(m=>m.r));const lf=S.m.find(m=>m.br==="L"&&m.r===lmax);const lw=winSide(lf);
    return{done:true,rank:[champ,second].concat(lw!=null?[team(lf,1-lw)]:[])};
  }
}
/* ---------- 그리기 ---------- */
function card(m,label){
  const w=winSide(m),dr=isDraw(m),pl=playable(m),bye=(m.a===-1||m.b===-1);
  const row=(side)=>{
    const t=side===0?m.a:m.b,s=side===0?m.sa:m.sb;
    const cls="br-t"+(w===side?" win":w===1-side?" lose":"")+(t==null?" tbd":"")+(t===-1?" bye":"");
    return "<div class=\""+cls+"\"><button type=\"button\" class=\"br-n\" data-brp=\""+m.id+":"+side+"\""+(pl?"":" disabled")+">"+(t==null?"<span class=\"x\">"+(m.br==="G"&&m.r===2?"(필요할 때만)":"기다리는 중")+"</span>":esc(nm(t)))+"</button>"+
      (pl?"<input class=\"br-s\" data-brs=\""+m.id+":"+side+"\" value=\""+esc(m.key===m.a+":"+m.b?s:"")+"\" inputmode=\"numeric\" aria-label=\"점수\">":"<span class=\"br-s0\"></span>")+"</div>";
  };
  return "<div class=\"br-m"+(pl&&w==null&&!dr?" open":"")+(bye?" isbye":"")+(m.off?" off":"")+"\">"+(label?"<div class=\"br-ml\">"+label+"</div>":"")+row(0)+row(1)+(dr&&m.need?"<div class=\"br-need\">무승부예요. 승부차기 등으로 이긴 팀 이름을 눌러 주세요</div>":"")+"</div>";
}
function drawLeague(){
  const t=table(S.teams.map((_,i)=>i),S.m),rounds=Math.max(...S.m.map(m=>m.r));
  let h=standings(t,false);
  h+="<div class=\"br-rounds\">";
  for(let r=1;r<=rounds;r++){const L=S.m.filter(m=>m.r===r);const rest=S.teams.map((_,i)=>i).filter(i=>!L.some(m=>m.a===i||m.b===i));
    h+="<div class=\"br-round\"><h4>"+r+"라운드"+(rest.length?" <span class=\"x\">· 쉬는 팀: "+rest.map(i=>esc(nm(i))).join(", ")+"</span>":"")+"</h4>"+L.map(m=>card(m)).join("")+"</div>";}
  return h+"</div>";
}
function standings(t,cross){
  return "<table class=\"br-tab\"><thead><tr><th>순위</th><th>팀</th><th>경기</th><th>승</th><th>무</th><th>패</th><th>득점</th><th>실점</th><th>득실</th>"+(cross?"":"<th>승점</th>")+"</tr></thead><tbody>"+
    t.map((x,i)=>"<tr class=\""+(i===0&&x.p?"top":"")+"\"><td>"+(i+1)+"</td><td class=\"tn\">"+esc(nm(x.i))+"</td><td>"+x.p+"</td><td>"+x.w+"</td><td>"+x.d+"</td><td>"+x.l+"</td><td>"+x.gf+"</td><td>"+x.ga+"</td><td>"+(x.gf-x.ga>0?"+":"")+(x.gf-x.ga)+"</td>"+(cross?"":"<td><b>"+x.pts+"</b></td>")+"</tr>").join("")+"</tbody></table>";
}
function drawTree(list,tag,labelFn){
  const rounds=[...new Set(list.map(m=>m.r))].sort((a,b)=>a-b);
  return "<div class=\"br-tree\">"+rounds.map(r=>{const L=list.filter(m=>m.r===r);return "<div class=\"br-col\"><h4>"+labelFn(r,L)+"</h4><div class=\"br-colm\">"+L.map(m=>card(m)).join("")+"</div></div>";}).join("")+"</div>";
}
function drawSingle(){
  const W=S.m.filter(m=>m.br==="W"),rounds=Math.max(...W.map(m=>m.r));
  let h=drawTree(W,"W",(r,L)=>rname(L.length*2));
  const th=S.m.find(m=>m.br==="3");if(th)h+="<div class=\"br-extra\"><h4>3·4위전</h4>"+card(th)+"</div>";
  return h;
}
function drawDouble(){
  const W=S.m.filter(m=>m.br==="W"),L=S.m.filter(m=>m.br==="L"),G=S.m.filter(m=>m.br==="G");
  const wmax=Math.max(...W.map(m=>m.r));
  return "<h3 class=\"br-sec\">승자조</h3>"+drawTree(W,"W",(r,X)=>r===wmax?"승자조 결승":rname(X.length*2))+
    "<h3 class=\"br-sec lb\">패자조 <span class=\"x\">· 한 번 진 팀이 다시 올라오는 길</span></h3>"+drawTree(L,"L",(r)=>"패자조 "+r+"라운드")+
    "<h3 class=\"br-sec gf\">최종 결승</h3><div class=\"br-extra\">"+G.map((m,i)=>card(m,i===0?"승자조 우승 vs 패자조 우승":"재경기 (패자조 팀이 이기면 한 번 더)")).join("")+"</div>";
}
function drawCross(){
  return S.groups.map((ids,g)=>{
    const L=S.m.filter(m=>m.g===g),t=table(ids,L);const four=ids.length===4;
    const rl=r=>four?(r===1?"1라운드":r===2?"2라운드 (크로스: 승자 vs 패자)":"3라운드 (남은 경기)"):r+"라운드";
    const rounds=[...new Set(L.map(m=>m.r))];
    return "<section class=\"br-group\"><h3 class=\"br-sec\">"+String.fromCharCode(65+g)+"조 <span class=\"x\">"+ids.map(i=>esc(nm(i))).join(" · ")+"</span></h3>"+standings(t,true)+
      "<div class=\"br-rounds\">"+rounds.map(r=>"<div class=\"br-round\"><h4>"+rl(r)+"</h4>"+L.filter(m=>m.r===r).map((m,i)=>card(m,four&&r===1?(i+1)+"경기":four&&r===2?(i===0?"1경기 승자 vs 2경기 패자":"1경기 패자 vs 2경기 승자"):"")).join("")+"</div>").join("")+"</div></section>";
  }).join("");
}
function drawSetup(){
  $("brFmts").innerHTML=FM.map(f=>"<button type=\"button\" class=\"tmm"+(f.k===S.fmt?" on":"")+"\" data-brf=\""+f.k+"\"><span class=\"ic\">"+f.ic+"</span>"+f.t+"</button>").join("");
  $("brFdesc").textContent=FM.find(f=>f.k===S.fmt).d;
  const c=S.cfg;let o="";
  if(S.fmt==="league")o="<label><input type=\"checkbox\" data-brc=\"twice\""+(c.twice?" checked":"")+"> 두 번씩 겨루기 (2회전)</label><div class=\"cfgrow\">승점 <label>승 <input type=\"number\" data-brc=\"pw\" value=\""+c.pw+"\" min=\"0\" max=\"9\"></label><label>무 <input type=\"number\" data-brc=\"pd\" value=\""+c.pd+"\" min=\"0\" max=\"9\"></label><label>패 <input type=\"number\" data-brc=\"pl\" value=\""+c.pl+"\" min=\"0\" max=\"9\"></label></div>";
  if(S.fmt==="single")o="<label><input type=\"checkbox\" data-brc=\"third\""+(c.third?" checked":"")+"> 3·4위전 하기</label>";
  if(S.fmt==="double")o="<label><input type=\"checkbox\" data-brc=\"reset\""+(c.reset?" checked":"")+"> 결승에서 패자조 팀이 이기면 한 번 더 (재경기)</label><div class=\"x\">승자조 팀은 아직 한 번도 지지 않았으니, 패자조 팀이 결승에서 이기면 서로 1패씩이 되어 한 번 더 겨뤄요.</div>";
  if(S.fmt==="cross")o="<label><input type=\"checkbox\" data-brc=\"crossFull\""+(c.crossFull?" checked":"")+"> 3라운드까지 (승자끼리·패자끼리 남은 경기도 하기)</label><div class=\"x\">4팀씩 조를 짜요. 팀 수가 4의 배수가 아니면 3팀이나 5팀 조가 생기고, 그 조는 조 안에서 리그전을 해요.</div>";
  $("brOpts").innerHTML=o;
  $("brRand").checked=c.rand;
  K.setVal("brTitle",S.title||"");
  if(document.activeElement!==$("brNames")&&!$("brNames").value)$("brNames").value=(S.teams.length?S.teams:["1반","2반","3반","4반"]).join("\n");
  K.setVal("brN",$("brNames").value.split("\n").filter(s=>s.trim()).length);
  const imp=K.load("pe-bracket-import");$("brImp").hidden=!(imp&&imp.names&&imp.names.length);
  if(imp&&imp.names)$("brImp").textContent="팀 나누기 결과 가져오기 ("+(imp.from?imp.from+" · ":"")+imp.names.length+"팀)";
}
function draw(){
  drawSetup();
  if(!S.built){$("brHead").innerHTML="";$("brBoard").innerHTML="<div class=\"br-empty\">팀을 넣고 방식을 고른 뒤 <b>대진표 만들기</b>를 누르세요.</div>";$("brActs").hidden=true;$("brSetup").hidden=false;return;}
  $("brActs").hidden=false;
  const f=FM.find(x=>x.k===S.fmt),fr=finalRank();
  let champ="";
  if(fr&&fr.done&&fr.rank)champ="<div class=\"br-champ\">🏆 <b>"+esc(nm(fr.rank[0]))+"</b> 우승"+(fr.rank[1]!=null?" · 2위 "+esc(nm(fr.rank[1])):"")+(fr.rank[2]!=null?" · 3위 "+esc(nm(fr.rank[2])):"")+"</div>";
  if(fr&&fr.done&&fr.groups)champ="<div class=\"br-champ\">🏆 "+fr.groups.map((g,i)=>String.fromCharCode(65+i)+"조 1위 <b>"+esc(nm(g[0]))+"</b>").join(" · ")+"</div>";
  const left=S.m.filter(m=>playable(m)&&winSide(m)==null&&!isDraw(m)).length;
  $("brHead").innerHTML="<div class=\"br-h\"><h2>"+esc(S.title||"우리 반 대회")+"</h2><span>"+f.ic+" "+f.t+" · "+S.teams.length+"팀 · "+(left?"남은 경기 "+left:"모든 경기 끝")+"</span></div>"+champ+
    "<div class=\"br-help op\">점수를 넣으면 이긴 팀이 자동으로 올라가요. 점수 없이 이긴 팀 이름만 눌러도 돼요(다시 누르면 취소).</div>";
  $("brBoard").innerHTML=S.fmt==="league"?drawLeague():S.fmt==="single"?drawSingle():S.fmt==="double"?drawDouble():drawCross();
  if(fr&&fr.done&&S.stored!==S.mid){S.stored=S.mid;save();ctx.store(makeRec());K.snd.fanfare();}
}
function makeRec(){
  const fr=finalRank()||{},d=[];
  d.push((FM.find(x=>x.k===S.fmt)||FM[0]).t+" · "+S.teams.length+"팀");
  S.m.filter(m=>playable(m)&&(winSide(m)!=null||isDraw(m))).forEach(m=>d.push(nm(m.a)+" "+(m.sa===""?(winSide(m)===0?"승":"패"):m.sa)+" : "+(m.sb===""?(winSide(m)===1?"승":"패"):m.sb)+" "+nm(m.b)));
  let teams=S.teams.map((n,i)=>({name:n,score:0}));
  if(fr.rank)teams=fr.rank.map((i,r)=>({name:nm(i),score:r+1+"위"}));
  return{id:S.mid||K.newId(),sport:"bracket",sportName:"대진표 · "+(S.title||"대회"),at:Date.now(),done:!!fr.done,
    teams:teams.slice(0,4).map(t=>({name:t.name,score:t.score})),winner:fr.rank?nm(fr.rank[0]):fr.groups?fr.groups.map(g=>nm(g[0])).join(", "):null,
    summary:fr.rank?fr.rank.slice(0,3).map((i,r)=>(r+1)+"위 "+nm(i)).join(" · "):(FM.find(x=>x.k===S.fmt)||FM[0]).t,details:d,players:[]};
}
function asText(){
  const fr=finalRank()||{};let t=(S.title||"대회")+" ("+(FM.find(x=>x.k===S.fmt)||FM[0]).t+")\n";
  if(fr.rank)t+=fr.rank.map((i,r)=>(r+1)+"위 "+nm(i)).join("\n")+"\n";
  if(fr.groups)t+=fr.groups.map((g,gi)=>String.fromCharCode(65+gi)+"조: "+g.map((i,r)=>(r+1)+"위 "+nm(i)).join(", ")).join("\n")+"\n";
  t+="\n경기 결과\n"+S.m.filter(playable).map(m=>nm(m.a)+" "+(m.sa||"-")+" : "+(m.sb||"-")+" "+nm(m.b)+(winSide(m)!=null?" → "+nm(team(m,winSide(m)))+" 승":isDraw(m)?" (무)":"")).join("\n");
  return t;
}
/* ---------- 이벤트 ---------- */
R.addEventListener("click",e=>{
  let b;
  if(b=e.target.closest("[data-brf]")){S.fmt=b.dataset.brf;save();drawSetup();return;}
  if(b=e.target.closest("[data-brp]")){
    const [id,side]=b.dataset.brp.split(":");const m=byId(id);if(!playable(m))return;
    const k=m.a+":"+m.b;if(m.key!==k){m.key=k;m.sa="";m.sb="";m.pick=null;}
    const sd=+side,a=m.sa===""?NaN:+m.sa,bb=m.sb===""?NaN:+m.sb;
    if(!isNaN(a)&&!isNaN(bb)&&a!==bb){K.toast("점수로 승패가 정해져 있어요. 점수를 고쳐 주세요","",1600);return;}
    m.pick=m.pick===sd?null:sd;resolve();save();draw();K.snd.chime();return;
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
    resolve();save();draw();
    // 다음 칸으로 이동
    const nx=R.querySelector("[data-brs='"+id+":"+(side==="0"?"1":"0")+"']");if(side==="0"&&nx)nx.focus();
    return;
  }
  if(el.dataset.brc){const k=el.dataset.brc;S.cfg[k]=el.type==="checkbox"?el.checked:Math.max(0,+el.value||0);save();if(S.built&&["pw","pd","pl"].includes(k))draw();return;}
  if(el.id==="brRand"){S.cfg.rand=el.checked;save();return;}
  if(el.id==="brTitle"){S.title=el.value.trim();save();if(S.built)draw();return;}
});
$("brNGo").onclick=()=>{const n=Math.max(2,Math.min(32,+$("brN").value||4));$("brNames").value=Array.from({length:n},(_,i)=>(i+1)+"팀").join("\n");};
$("brImp").onclick=()=>{const imp=K.load("pe-bracket-import");if(!imp)return;$("brNames").value=imp.names.join("\n");K.setVal("brN",imp.names.length);K.toast(imp.names.length+"팀을 가져왔어요","",1500);};
$("brNames").addEventListener("input",()=>K.setVal("brN",$("brNames").value.split("\n").filter(s=>s.trim()).length));
$("brMake").onclick=()=>{if(S.built&&S.m.some(m=>m.key)&&!$("brMake").classList.contains("arm")){$("brMake").classList.add("arm");$("brMake").textContent="결과가 지워져요 · 한 번 더 누르기";setTimeout(()=>{$("brMake").classList.remove("arm");$("brMake").textContent="대진표 만들기";},3000);return;}$("brMake").classList.remove("arm");$("brMake").textContent="대진표 만들기";if(build()!==false){$("brSetup").hidden=true;draw();}};
$("brEdit").onclick=()=>{$("brSetup").hidden=!$("brSetup").hidden;if(!$("brSetup").hidden)$("brSetup").scrollIntoView({block:"start",behavior:"smooth"});};
K.arm($("brReset"),"대진표 지우기",()=>{S.built=false;S.m=[];save();draw();});
$("brCopy").onclick=async()=>{const ok=await K.copyText(asText());K.toast(ok?"대회 결과를 복사했어요":"복사가 안 되는 환경이에요","",1600);};
// 팀 나누기에서 막 넘어왔으면 바로 채워 준다
const imp=K.load("pe-bracket-import");let fresh=false;
if(imp&&imp.at&&Date.now()-imp.at<60000){fresh=true;$("brNames").value=imp.names.join("\n");K.save("pe-bracket-import",Object.assign({},imp,{at:0}));setTimeout(()=>K.toast(imp.names.length+"팀을 가져왔어요. 방식을 고르고 대진표를 만드세요","",2400),300);}
mid=S.m.reduce((x,m)=>Math.max(x,+m.id.slice(1)+1),0);
draw();
$("brSetup").hidden=S.built&&!fresh;
return{record:makeRec};
}};
