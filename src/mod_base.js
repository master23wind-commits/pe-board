/* ================= 야구 · 티볼 ================= */
MODS.base={name:"야구·티볼",sub:"이닝 점수판 · 볼카운트 · 경기장 수비 배치 · 공격·수비 기록",color:"var(--c-bs)",
html:`
<div class="modebar op">
  <div class="seg" role="group" aria-label="종목"><button type="button" data-bmode="base">야구</button><button type="button" data-bmode="tee">티볼</button></div>
  <span class="hint" id="bsHint"></span>
</div>
<section class="bsboard">
  <div class="tblwrap lsw"><table class="lscore" id="lscore"></table></div>
  <div class="bsstat">
    <div class="bsinn" id="bsInn"></div>
    <div class="bso" id="bso"></div>
    <div class="bsnow" id="bsNow"></div>
  </div>
</section>
<div class="bsmain">
  <div class="bfcol">
    <div class="bfield" id="bfield">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path d="M50 84 L3 37 Q50 -16 97 37 Z" fill="var(--grass)"/>
        <path d="M50 90 L24 64 Q50 28 76 64 Z" fill="var(--dirt)"/>
        <path d="M50 84 L3 37 M50 84 L97 37" stroke="rgba(255,255,255,.55)" stroke-width=".5" fill="none"/>
        <path d="M50 84 L68 64 L50 46 L32 64 Z" fill="var(--grass)" stroke="rgba(255,255,255,.4)" stroke-width=".4"/>
        <ellipse cx="50" cy="65" rx="3.2" ry="2.6" fill="var(--dirt)"/>
      </svg>
      <div id="bfLayer"></div>
    </div>
    <div class="bfmsg" id="bfMsg" hidden></div>
    <div class="bfchooser op" id="bfChooser" hidden></div>
  </div>
  <div class="bsctl op" id="bsCtl">
    <div class="bgrp" id="gPitch"><div class="lbl" id="pitchLbl">투구</div><div class="btnrow">
      <button class="pball" type="button" data-pitch="ball">볼</button><button class="pstr" type="button" data-pitch="strike">스트라이크</button><button class="pfoul" type="button" data-pitch="foul">파울</button>
    </div></div>
    <div class="bgrp"><div class="lbl">안타 · 출루</div><div class="btnrow">
      <button class="rhit" type="button" data-res="1B">1루타</button><button class="rhit" type="button" data-res="2B">2루타</button><button class="rhit" type="button" data-res="3B">3루타</button><button class="rhit rhr" type="button" data-res="HR">홈런</button>
      <button class="ronb" type="button" data-res="BB" id="resBB">볼넷</button><button class="ronb" type="button" data-res="HBP" id="resHBP">몸에 맞는 공</button><button class="ronb" type="button" data-res="E">실책 출루</button>
    </div></div>
    <div class="bgrp"><div class="lbl">아웃 (수비수를 경기장에서 고릅니다)</div><div class="btnrow">
      <button class="rout" type="button" data-res="SO">삼진</button><button class="rout" type="button" data-res="GO">땅볼 아웃</button><button class="rout" type="button" data-res="FO">뜬공 아웃</button><button class="rout" type="button" data-res="LO">직선타 아웃</button><button class="rout" type="button" data-res="SF">희생플라이</button>
    </div></div>
    <div class="bgrp" id="gRunner"><div class="lbl" id="runLbl">주자 · 경기장의 베이스를 누르세요</div><div class="btnrow" id="runBtns"></div></div>
    <div class="bgrp"><div class="btnrow">
      <button class="small" id="bsUndo" type="button">되돌리기</button><button class="small" id="bsSwitch" type="button">공수 교대</button><button class="small" id="bsEnd" type="button">경기 종료</button>
    </div></div>
  </div>
</div>
<div class="box">
  <div class="rechead"><h4>경기 기록</h4><div class="seg" role="group" aria-label="기록 보기" id="recTabs"></div></div>
  <div class="tblwrap recw"><table class="rect" id="recTable"></table></div>
</div>
<div class="bgk" id="bsBingo"></div>
<div class="lower">
  <div class="box"><h4>플레이 기록</h4><ul class="log" id="bsLog"></ul></div>
  <div class="box op">
    <h4>경기 설정</h4>
    <div class="cfg">
      <div class="cfgrow">
        <label>이닝 수 <input id="bcInn" type="number" min="1" max="12"></label>
        <label>이닝당 최대 득점 <input id="bcLimit" type="number" min="0" max="30"> (0 = 제한 없음)</label>
      </div>
      <div class="cfgrow" id="teeCfg">
        <label>티볼 타격 기회 <input id="bcTries" type="number" min="1" max="6">번 실패하면 아웃</label>
        <label><input id="bcAllBat" type="checkbox"> 이닝마다 전원이 한 번씩 치면 공수 교대</label>
        <label><input id="bcOut3" type="checkbox"> 3아웃이면 공수 교대 (티볼은 선택)</label>
      </div>
      <div class="names">
        <div><div class="nh"><input type="text" id="btn0" maxlength="10" aria-label="원정 팀 이름" style="width:7em"><span id="bnl0"></span><button class="small" type="button" data-defpos="0">수비 기본 배치</button></div><textarea id="bros0" aria-label="원정 팀 타순"></textarea></div>
        <div><div class="nh"><input type="text" id="btn1" maxlength="10" aria-label="홈 팀 이름" style="width:7em"><span id="bnl1"></span><button class="small" type="button" data-defpos="1">수비 기본 배치</button></div><textarea id="bros1" aria-label="홈 팀 타순"></textarea></div>
      </div>
      <div class="keys">명단은 타순대로 한 줄에 한 명, 팀당 최대 15명입니다. 처음 이름은 예시예요. 위 팀(원정)이 초에 먼저 공격하고, 아래 팀(홈)이 말에 공격합니다.<br>
        수비 위치는 경기장의 포지션 이름을 눌러 바꿉니다. 수비 위치는 타순과 따로예요. 타순을 바꾸거나 새 경기를 시작해도 학생마다 정한 수비 위치가 그대로 남아요. 새로 넣은 학생은 '비어 있음' 자리에 직접 넣어 주세요. '수비 기본 배치'를 누르면 타순 1~9번을 투수·포수·1루·2루·3루·유격·좌익·중견·우익 순서로 넣어요. 티볼은 10명이 수비해서 중견수 옆에 <b>제2중견수</b>가 더해지고, 10번 타자까지 배치돼요(좌익·중견·제2중견·우익 순서).<br>
        아웃을 누르면 경기장의 수비수가 깜빡입니다. 공을 처리한 수비수를 누르면 그 학생의 수비 기록이 올라가요. 땅볼 아웃은 고른 수비수에게 보살, 1루수에게 아웃 처리가 기록됩니다.<br>
        티볼은 기본으로 3아웃에 공수 교대를 하지 않고 아웃 수만 셉니다. '전원 타격 후 공수 교대'를 켜거나, '공수 교대' 버튼을 누르세요. 3아웃제를 쓰려면 설정에서 켜면 돼요.<br>
        주자는 안타·볼넷 때 자동으로 진루합니다(안타는 모든 주자가 친 루만큼 진루). 다르게 움직였으면 베이스를 눌러 한 루 진루·홈인·아웃·도루로 고치세요.</div>
      <div><button class="danger" id="bsNew" type="button">새 경기</button></div>
    </div>
  </div>
</div>`,
init(ctx){
const $=K.$,R=ctx.root,KEY="pe-base",esc=K.esc;
const POS=["P","C","1B","2B","3B","SS","LF","CF","CF2","RF"];
const PL=t=>t?POS:POS.filter(k=>k!=="CF2");
const PN={P:"투수",C:"포수","1B":"1루수","2B":"2루수","3B":"3루수",SS:"유격수",LF:"좌익수",CF:"중견수",CF2:"제2중견수",RF:"우익수"};
const XY={P:[50,66],C:[50,95],"1B":[77,54],"2B":[63,39],"3B":[23,54],SS:[37,39],LF:[16,24],CF:[50,12],RF:[84,24]};
const XYT=Object.assign({},XY,{LF:[13,27],CF:[37,13],CF2:[63,13],RF:[87,27]});
const BXY=[[68,64],[50,46],[32,64]],HOME=[50,84];
const RES={"1B":"1루타","2B":"2루타","3B":"3루타",HR:"홈런",BB:"볼넷",HBP:"몸에 맞는 공",E:"실책 출루",SO:"삼진",GO:"땅볼 아웃",FO:"뜬공 아웃",LO:"직선타 아웃",SF:"희생플라이"};
const NEEDF={GO:1,FO:1,LO:1,SF:1,E:1};
const TCOL=["var(--red)","var(--blue)"];
const MAXP=15;
const mkSt=()=>({pa:0,ab:0,h:0,d:0,t:0,hr:0,rbi:0,r:0,bb:0,so:0,sb:0,po:0,a:0,e:0,pc:0,k:0});
function defPos(n,t){const p={};PL(t).forEach((k,i)=>{if(i<n)p[k]=i;});return p;}
function mkTeam(name,order,t,pos){return{name,order:order.slice(0,MAXP),st:Array.from({length:MAXP},mkSt),pos:pos?Object.assign({},pos):defPos(Math.min(t?10:9,order.length),t),line:[],h:0,e:0,cur:0};}
function fresh(cfg,keep){
  cfg=cfg||{mode:"base",innings:7,limit:0,tries:3,allBat:false};
  const k=keep||[{name:"홍팀",order:K.EX10[0]},{name:"청팀",order:K.EX10[1]}];
  return{cfg,teams:k.map(x=>mkTeam(x.name,x.order,cfg.mode==="tee",x.pos)),inn:1,half:0,outs:0,balls:0,strikes:0,bases:[null,null,null],nb:0,nr:0,over:null,log:[]};
}
let S=K.load(KEY);if(!S||!S.teams)S=fresh();
let undoStack=[],pick=null,selBase=-1,assignPos=null,recTab="bat0",flash=null;
const save=()=>K.save(KEY,S);
K.fixKit(R,{get:()=>S,snap:()=>snap(),after:()=>{save();draw();}});
const BG=K.bingoKit({el:$("bsBingo"),key:"base",get:()=>S,teams:()=>S.teams.map((T,t)=>({name:T.name,color:TCOL[t],roster:T.order})),
  missions:["삼진 잡기","더블 플레이","장타(2루타 이상)","희생 플라이·번트","도루 성공","실책 없는 이닝","땅볼 아웃 3개","외야 플라이 잡기"],bonusDef:1,hint:"타자가 안타를 치거나 홈에 들어오면 그 칸이 채워지고",
  apply:(t,p)=>{S.teams[t].bg=(S.teams[t].bg||0)+p;},snap:()=>snap(),after:()=>{save();draw();}});
function snap(){undoStack.push(JSON.stringify(S));if(undoStack.length>250)undoStack.shift();}
function undo(){if(!undoStack.length)return;S=JSON.parse(undoStack.pop());pick=null;selBase=-1;assignPos=null;K.closeModal();save();draw();K.toast("되돌렸습니다","",1200);}
const tee=()=>S.cfg.mode==="tee";
const off=()=>S.half,def=()=>1-S.half;
const runs=t=>S.teams[t].line.reduce((a,b)=>a+(b||0),0)+(S.teams[t].bg||0);
const pname=(t,i)=>i==null?"":(S.teams[t].order[i]||"선수");
const halfName=()=>S.inn+"회 "+(S.half?"말":"초");

function addRuns(list,o){
  // 이닝당 최대 득점이 있으면 그만큼만 인정
  let n=list.length;
  if(S.cfg.limit>0)n=Math.max(0,Math.min(n,S.cfg.limit-S.nr));
  const counted=list.slice(0,n);
  counted.forEach(r=>S.teams[o].st[r].r++);
  const L=S.teams[o].line;L[S.inn-1]=(L[S.inn-1]||0)+n;S.nr+=n;
  return counted;
}
function resolve(type,posKey,inPlay){
  const o=off(),d=def(),TO=S.teams[o],TD=S.teams[d],bi=TO.cur,bs=TO.st[bi],B=S.bases;
  const pit=TD.pos.P,fp=posKey?TD.pos[posKey]:undefined;
  let scored=[],outs=0;
  if(inPlay&&!tee()&&pit!=null)TD.st[pit].pc++;
  bs.pa++;
  const force=()=>{if(B[0]!=null){if(B[1]!=null){if(B[2]!=null)scored.push(B[2]);B[2]=B[1];}B[1]=B[0];}B[0]=bi;};
  if(["1B","2B","3B","HR"].includes(type)){
    const n={"1B":1,"2B":2,"3B":3,HR:4}[type];
    bs.ab++;bs.h++;TO.h++;if(n===2)bs.d++;if(n===3)bs.t++;if(n===4)bs.hr++;
    const nb=[null,null,null];
    for(let b=2;b>=0;b--){if(B[b]!=null){const t=b+n;if(t>=3)scored.push(B[b]);else nb[t]=B[b];}}
    if(n===4)scored.push(bi);else nb[n-1]=bi;
    S.bases=nb;
  }else if(type==="BB"||type==="HBP"){bs.bb++;force();}
  else if(type==="E"){bs.ab++;if(fp!=null)TD.st[fp].e++;TD.e++;force();}
  else if(type==="SO"){bs.ab++;bs.so++;if(pit!=null)TD.st[pit].k++;if(TD.pos.C!=null)TD.st[TD.pos.C].po++;outs=1;}
  else if(type==="GO"){bs.ab++;outs=1;if(fp!=null){if(posKey==="1B")TD.st[fp].po++;else{TD.st[fp].a++;if(TD.pos["1B"]!=null)TD.st[TD.pos["1B"]].po++;}}}
  else if(type==="FO"||type==="LO"){bs.ab++;outs=1;if(fp!=null)TD.st[fp].po++;}
  else if(type==="SF"){outs=1;if(fp!=null)TD.st[fp].po++;if(B[2]!=null&&S.outs<2){scored.push(B[2]);B[2]=null;}}
  const counted=addRuns(scored,o);
  if(["1B","2B","3B","HR"].includes(type))BG.hit(o,bi);
  counted.forEach(r=>BG.hit(o,r));
  if(type!=="E")bs.rbi+=counted.length;
  S.outs+=outs;S.balls=0;S.strikes=0;
  TO.cur=(bi+1)%Math.max(1,TO.order.length);S.nb++;
  S.log.unshift({inn:S.inn,half:S.half,t:o,who:pname(o,bi),type,pos:posKey||null,fielder:fp!=null?pname(d,fp):null,runs:counted.map(r=>pname(o,r)),outs:S.outs});
  if(S.log.length>150)S.log.pop();
  flash={kind:type,runs:counted.length};
  after(counted.length,type);
}
function after(nRuns,type){
  const o=off();
  save();draw();
  if(nRuns>0){const row=R.querySelectorAll("#lscore tbody tr")[o];const cell=row&&row.querySelector(".tot");if(cell)K.fx.play("baseball",cell,{big:type==="HR",text:type==="HR"?"홈런!":"+"+nRuns,color:TCOL[o]==="var(--red)"?"#ff5a3c":"#38aefc"});}
  if(type==="HR"){K.snd.fanfare();K.toast("홈런! "+S.teams[o].name+" "+nRuns+"점","bingo",2600);}
  else if(nRuns>0){K.snd.swish();K.toast(S.teams[o].name+" "+nRuns+"점 득점!","bingo",2000);}
  else if(type&&/^(1B|2B|3B)$/.test(type))K.snd.chime();
  else if(type&&RES[type]&&/(SO|GO|FO|LO|SF)/.test(type))K.snd.stop();
  // 끝내기
  if(S.half===1&&S.inn>=S.cfg.innings&&runs(1)>runs(0)){finish("끝내기");return;}
  if(S.cfg.limit>0&&S.nr>=S.cfg.limit){endHalf("이닝 최대 득점 "+S.cfg.limit+"점");return;}
  if(S.outs>=3&&(!tee()||S.cfg.out3)){endHalf("3아웃");return;}
  if(tee()&&S.cfg.allBat&&S.nb>=S.teams[o].order.length){endHalf("전원 타격 완료");return;}
}
function endHalf(reason){
  const o=off();const L=S.teams[o].line;if(L[S.inn-1]==null)L[S.inn-1]=0;
  S.outs=0;S.balls=0;S.strikes=0;S.bases=[null,null,null];S.nb=0;S.nr=0;selBase=-1;pick=null;
  if(S.half===0){
    if(S.inn>=S.cfg.innings&&runs(1)>runs(0)){save();finish(reason+" · 홈 팀 리드로 경기 종료");return;}
    S.half=1;
  }else{
    if(S.inn>=S.cfg.innings&&runs(0)!==runs(1)){save();finish(reason);return;}
    S.inn++;S.half=0;
  }
  save();draw();K.snd.horn();
  K.toast(reason+" · 공수 교대! "+halfName()+" "+S.teams[off()].name+" 공격","",3000);
}
function finish(reason){
  const a=runs(0),b=runs(1);
  S.over={w:a>b?0:b>a?1:-1,reason};save();draw();K.snd.fanfare();
  const T=S.teams;
  const best=t=>{const s=T[t].st.slice(0,T[t].order.length).map((x,i)=>({i,x})).filter(o=>o.x.h>0||o.x.rbi>0).sort((p,q)=>q.x.h-p.x.h||q.x.rbi-p.x.rbi)[0];return s?pname(t,s.i)+" ("+s.x.h+"안타 "+s.x.rbi+"타점)":"없음";};
  K.modal({sub:reason,title:S.over.w<0?"무승부":T[S.over.w].name+" 승리",color:S.over.w<0?"var(--fg)":TCOL[S.over.w],score:a+" : "+b,
    stats:[0,1].map(t=>"<div>"+esc(T[t].name)+" 최다 안타: <b>"+esc(best(t))+"</b> · 실책 "+T[t].e+"</div>").join(""),
    buttons:[{label:"되돌리기",fn:undo},{label:"닫기"}]});
  ctx.store(makeRec());
}
function pitch(kind){
  if(S.over||pick)return;snap();
  const d=def(),pit=S.teams[d].pos.P;
  if(!tee()&&pit!=null)S.teams[d].st[pit].pc++;
  if(kind==="ball"){S.balls++;if(S.balls>=4){resolve("BB",null,false);K.toast("볼넷! 1루로","",1600);return;}}
  else if(kind==="strike"){S.strikes++;if(S.strikes>=(tee()?S.cfg.tries:3)){resolve("SO",null,false);K.toast(tee()?"타격 기회를 다 써서 아웃":"삼진 아웃!","",1600);return;}}
  else if(kind==="foul"){if(tee()){S.strikes++;if(S.strikes>=S.cfg.tries){resolve("SO",null,false);K.toast("타격 기회를 다 써서 아웃","",1600);return;}}else if(S.strikes<2)S.strikes++;}
  save();draw();
}
function result(type){
  if(S.over)return;
  if(NEEDF[type]){pick={type};assignPos=null;selBase=-1;draw();return;}
  snap();resolve(type,null,!["BB","HBP","SO"].includes(type));
}
function runnerAct(act){
  const b=selBase;if(b<0||S.over)return;
  const B=S.bases,r=B[b],o=off();if(r==null)return;
  snap();
  let msg="",n=0;
  if(act==="adv"||act==="sb"){
    if(b===2){B[2]=null;n=addRuns([r],o).length;msg=pname(o,r)+(act==="sb"?" 홈 스틸!":" 홈인");}
    else{if(B[b+1]!=null){undoStack.pop();K.toast("앞 베이스에 주자가 있어요. 앞 주자를 먼저 옮기세요","bad",2200);return;}B[b+1]=r;B[b]=null;msg=pname(o,r)+" "+(b+2)+"루로 "+(act==="sb"?"도루":"진루");}
    if(act==="sb")S.teams[o].st[r].sb++;
  }else if(act==="home"){B[b]=null;n=addRuns([r],o).length;msg=pname(o,r)+" 홈인";}
  else if(act==="out"){B[b]=null;S.outs++;msg=pname(o,r)+" 주루 아웃";}
  else if(act==="clear"){B[b]=null;msg=pname(o,r)+" 베이스에서 지움";}
  S.log.unshift({inn:S.inn,half:S.half,t:o,who:pname(o,r),type:"RUN",txt:msg,runs:n?[pname(o,r)]:[],outs:S.outs});
  selBase=-1;flash=null;
  K.toast(msg,"",1600);
  after(n,act==="out"?"SO":null);
}
function setPos(posKey,pi){
  const T=S.teams[assignTeam()];snap();
  const prev=POS.find(k=>T.pos[k]===pi);
  if(prev&&prev!==posKey){const cur=T.pos[posKey];if(cur!=null)T.pos[prev]=cur;else delete T.pos[prev];}
  T.pos[posKey]=pi;assignPos=null;save();draw();
  K.toast(T.name+" "+PN[posKey]+": "+pname(assignTeam(),pi),"",1600);
}
const assignTeam=()=>S.over?1:def();
function makeRec(){
  if(!S.mid)S.mid=K.newId();
  const T=S.teams,a=runs(0),b=runs(1);
  const inns=Math.max(S.inn,...T.map(t=>t.line.length));
  const d=[(tee()?"티볼":"야구")+" · "+T.map(t=>t.name+" "+Array.from({length:inns},(_,i)=>t.line[i]==null?"-":t.line[i]).join(" ")).join(" / ")];
  if(BG.summary())d.push(BG.summary());
  T.forEach(t=>d.push(t.name+" 안타 "+t.h+" · 실책 "+t.e));
  return{id:S.mid,sport:"base",sportName:tee()?"티볼":"야구",at:Date.now(),done:!!S.over,
    teams:T.map((t,i)=>({name:t.name,score:runs(i)})),winner:S.over?(S.over.w<0?"무승부":T[S.over.w].name):null,
    summary:a+" : "+b+(S.over?"":" ("+halfName()+")"),details:d,
    players:T.flatMap(t=>t.order.map((n,i)=>{const s=t.st[i];return{team:t.name,name:n,pts:s.h,note:"타석 "+s.pa+" 타수 "+s.ab+" 안타 "+s.h+" 홈런 "+s.hr+" 타점 "+s.rbi+" 득점 "+s.r+" 볼넷 "+s.bb+" 삼진 "+s.so+" / 수비 아웃처리 "+s.po+" 보살 "+s.a+" 실책 "+s.e+(s.pc?" / 투구수 "+s.pc+" 탈삼진 "+s.k:"")};}))};
}

/* ----- 그리기 ----- */
function drawBoard(){
  const T=S.teams,inns=Math.max(S.cfg.innings,S.inn,...T.map(t=>t.line.length));
  let h="<thead><tr><th class=\"tn\">팀</th>";
  for(let i=1;i<=inns;i++)h+="<th"+(i===S.inn&&!S.over?" class=\"cur\"":"")+">"+i+"</th>";
  h+="<th class=\"tot\">R</th><th>H</th><th>E</th></tr></thead><tbody>";
  [0,1].forEach(t=>{
    h+="<tr style=\"--c:"+TCOL[t]+"\"><td class=\"tn\"><i></i>"+esc(T[t].name)+(t===0?" <small>원정</small>":" <small>홈</small>")+(off()===t&&!S.over?" <span class=\"atkdot\">공격</span>":"")+"</td>";
    for(let i=1;i<=inns;i++){
      const v=T[t].line[i-1];
      const now=i===S.inn&&t===S.half&&!S.over;
      const xmark=S.over&&t===1&&i===S.inn&&S.half===0&&v==null;
      h+="<td class=\""+(now?"cur":"")+"\">"+(xmark?"X":v==null?(now?"0":""):K.fixN(v,"teams."+t+".line."+(i-1),T[t].name+" · "+i+"회 득점","in"))+"</td>";
    }
    h+="<td class=\"tot\">"+runs(t)+(T[t].bg?"<small class=\"bgx\">빙고+"+T[t].bg+"</small>":"")+"</td><td>"+K.fixN(T[t].h,"teams."+t+".h",T[t].name+" · 팀 안타","in")+"</td><td>"+K.fixN(T[t].e,"teams."+t+".e",T[t].name+" · 팀 실책","in")+"</td></tr>";
  });
  $("lscore").innerHTML=h+"</tbody>";
  $("bsInn").innerHTML=S.over?"경기 종료":"<b>"+S.inn+"</b>회 <b>"+(S.half?"말":"초")+"</b><small>"+esc(T[off()].name)+" 공격</small>";
  const dots=(n,max,cls)=>Array.from({length:max},(_,i)=>"<i class=\""+(i<n?cls:"")+"\"></i>").join("");
  const smax=tee()?Math.max(1,S.cfg.tries-1):2;
  $("bso").innerHTML=(tee()?"":"<div><span>B</span>"+dots(S.balls,3,"b")+"</div>")+"<div><span>"+(tee()?"실패":"S")+"</span>"+dots(S.strikes,smax,"s")+"</div>"+(tee()&&!S.cfg.out3?"<div><span>아웃</span><b class=\"ocnt\">"+S.outs+"</b></div>":"<div><span>O</span>"+dots(S.outs,2,"o")+"</div>");
  const o=off(),d=def(),bi=T[o].cur,bs=T[o].st[bi],pit=T[d].pos.P;
  $("bsNow").innerHTML=S.over?"":"<div><span class=\"lbl\">타자</span> <b>"+(bi+1)+"번 "+esc(pname(o,bi))+"</b> <small>오늘 "+bs.ab+"타수 "+bs.h+"안타</small></div>"+
    (tee()?"":"<div><span class=\"lbl\">투수</span> <b>"+esc(pit!=null?pname(d,pit):"미정")+"</b> <small>투구수 "+(pit!=null?T[d].st[pit].pc:0)+"</small></div>");
}
function drawField(){
  const T=S.teams,d=assignTeam(),o=off(),TD=T[d];
  let h="";
  PL(tee()).forEach(k=>{
    const [x,y]=(tee()?XYT:XY)[k],pi=TD.pos[k];
    const cls="fpos"+(pick?" pick":"")+(assignPos===k?" sel":"");
    h+="<button type=\"button\" class=\""+cls+"\" style=\"left:"+x+"%;top:"+y+"%\" data-fpos=\""+k+"\"><span class=\"pl\">"+PN[k]+"</span><b>"+(pi!=null?esc(pname(d,pi)):"비어 있음")+"</b></button>";
  });
  BXY.forEach(([x,y],b)=>{
    const r=S.bases[b];
    h+="<button type=\"button\" class=\"base"+(r!=null?" on":"")+(selBase===b?" sel":"")+"\" style=\"left:"+x+"%;top:"+y+"%\" data-base=\""+b+"\" aria-label=\""+(b+1)+"루\"><i></i>"+(r!=null?"<b>"+esc(pname(o,r))+"</b>":"")+"</button>";
  });
  if(!S.over)h+="<div class=\"homeb\" style=\"left:"+HOME[0]+"%;top:"+HOME[1]+"%\"><i></i><b>타자 "+esc(pname(o,T[o].cur))+"</b></div>";
  $("bfLayer").innerHTML=h;
  $("bfield").style.setProperty("--dc",TCOL[d]);$("bfield").style.setProperty("--oc",TCOL[o]);
  const m=$("bfMsg");
  if(pick){m.hidden=false;m.innerHTML=esc(RES[pick.type])+" · 공을 처리한 수비수를 누르세요 <button class=\"small\" type=\"button\" id=\"skipF\">건너뛰기</button> <button class=\"small\" type=\"button\" id=\"cancelF\">취소</button>";}
  else if(assignPos){m.hidden=false;m.textContent=TD.name+" "+PN[assignPos]+"를 아래에서 고르세요";}
  else{m.hidden=false;m.innerHTML="수비 <b style=\"color:"+TCOL[d]+"\">"+esc(TD.name)+"</b> · 포지션을 눌러 수비수를 바꿀 수 있어요";}
  const ch=$("bfChooser");
  if(assignPos){ch.hidden=false;ch.innerHTML="<div class=\"lbl\">"+esc(TD.name)+" "+PN[assignPos]+" 고르기</div><div class=\"btnrow\">"+TD.order.map((n,i)=>{const at=POS.find(k=>TD.pos[k]===i);return "<button type=\"button\" class=\"small"+(TD.pos[assignPos]===i?" go":"")+"\" data-assign=\""+i+"\">"+esc(n)+(at?" <small>("+PN[at]+")</small>":"")+"</button>";}).join("")+"<button class=\"small\" type=\"button\" data-assign=\"-1\">닫기</button></div>";}
  else ch.hidden=true;
}
function drawCtl(){
  $("gPitch").hidden=false;
  R.querySelectorAll("[data-pitch]").forEach(b=>{b.hidden=tee()&&b.dataset.pitch==="ball";});
  R.querySelector("[data-pitch='strike']").textContent=tee()?"헛스윙 · 타격 실패":"스트라이크";
  R.querySelector("[data-pitch='foul']").textContent=tee()?"파울":"파울";
  $("pitchLbl").textContent=tee()?"타격 시도 ("+S.cfg.tries+"번 실패하면 아웃)":"투구";
  $("resBB").hidden=tee();$("resHBP").hidden=tee();
  const rb=$("runBtns"),r=selBase>=0?S.bases[selBase]:null;
  if(r!=null){
    $("runLbl").textContent=(selBase+1)+"루 주자 "+pname(off(),r);
    rb.innerHTML="<button class=\"small\" type=\"button\" data-run=\"adv\">한 루 진루</button><button class=\"small\" type=\"button\" data-run=\"sb\">도루</button><button class=\"small\" type=\"button\" data-run=\"home\">홈인</button><button class=\"small danger\" type=\"button\" data-run=\"out\">주루 아웃</button><button class=\"small\" type=\"button\" data-run=\"clear\">지우기</button>";
  }else{$("runLbl").textContent="주자 · 경기장의 주자가 있는 베이스를 누르세요";rb.innerHTML="";}
  R.querySelectorAll("#bsCtl button").forEach(b=>{if(!["bsUndo"].includes(b.id))b.disabled=!!S.over;});
  $("bsUndo").disabled=!undoStack.length;
}
function drawRec(){
  const T=S.teams;
  $("recTabs").innerHTML=[["bat0",T[0].name+" 공격"],["bat1",T[1].name+" 공격"],["fld0",T[0].name+" 수비"],["fld1",T[1].name+" 수비"]].map(([k,l])=>"<button type=\"button\" data-rtab=\""+k+"\" aria-pressed=\""+(recTab===k)+"\">"+esc(l)+"</button>").join("");
  const t=+recTab.slice(-1),TT=T[t],n=TT.order.length;
  let h;
  if(recTab.startsWith("bat")){
    h="<thead><tr><th>타순</th><th class=\"tn\">이름</th><th>타석</th><th>타수</th><th>안타</th><th>2루타</th><th>3루타</th><th>홈런</th><th>타점</th><th>득점</th>"+(tee()?"":"<th>볼넷</th>")+"<th>삼진</th><th>도루</th><th>타율</th></tr></thead><tbody>";
    for(let i=0;i<n;i++){const s=TT.st[i],now=!S.over&&off()===t&&TT.cur===i,F=(k,l,x)=>"<td>"+K.fixN(s[k]||0,"teams."+t+".st."+i+"."+k+(x||""),TT.order[i]+" · "+l,"in")+"</td>";
      h+="<tr"+(now?" class=\"now\"":"")+" style=\"--c:"+TCOL[t]+"\"><td>"+(i+1)+"</td><td class=\"tn\">"+esc(TT.order[i])+(now?" <span class=\"atkdot\">타석</span>":"")+"</td>"+F("pa","타석")+F("ab","타수")+F("h","안타(팀 안타도 함께)","|teams."+t+".h")+F("d","2루타")+F("t","3루타")+F("hr","홈런")+F("rbi","타점")+F("r","득점")+(tee()?"":F("bb","볼넷"))+F("so","삼진")+F("sb","도루")+"<td>"+(s.ab?(s.h/s.ab).toFixed(3).replace(/^0/,""):"—")+"</td></tr>";}
  }else{
    h="<thead><tr><th class=\"tn\">이름</th><th>지금 포지션</th><th>아웃 처리</th><th>보살</th><th>실책</th>"+(tee()?"":"<th>투구수</th><th>탈삼진</th>")+"</tr></thead><tbody>";
    for(let i=0;i<n;i++){const s=TT.st[i],at=POS.find(k=>TT.pos[k]===i);
      const F=(k,l,x)=>"<td>"+K.fixN(s[k]||0,"teams."+t+".st."+i+"."+k+(x||""),TT.order[i]+" · "+l,"in")+"</td>";
      h+="<tr style=\"--c:"+TCOL[t]+"\"><td class=\"tn\">"+esc(TT.order[i])+"</td><td>"+(at?PN[at]:"—")+"</td>"+F("po","아웃 처리")+F("a","보살")+F("e","실책(팀 실책도 함께)","|teams."+t+".e")+(tee()?"":F("pc","투구수")+F("k","탈삼진"))+"</tr>";}
  }
  $("recTable").innerHTML=h+"</tbody>";
}
function drawLog(){
  const T=S.teams;
  $("bsLog").innerHTML=S.log.length?S.log.slice(0,14).map(l=>{
    const col=TCOL[l.t],tag=l.inn+(l.half?"말":"초");
    let d=l.type==="RUN"?esc(l.txt):"<b>"+esc(l.who)+"</b> "+esc(RES[l.type]||l.type)+(l.fielder?" <span class=\"x\">("+PN[l.pos]+" "+esc(l.fielder)+")</span>":"");
    if(l.runs&&l.runs.length&&l.type!=="RUN")d+=" <span class=\"bg\">"+l.runs.length+"점 · "+esc(l.runs.join(", "))+" 홈인</span>";
    return "<li><span class=\"p\" style=\"--c:"+col+"\">"+tag+"</span><span>"+d+" <span class=\"x\">· "+l.outs+"아웃</span></span></li>";
  }).join(""):"<li class=\"empty\">아직 기록이 없습니다. 투구나 타격 결과 버튼을 누르면 여기에 쌓입니다.</li>";
}
function draw(){
  const C=S.cfg;BG.draw();
  R.querySelectorAll("[data-bmode]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.bmode===C.mode)));
  K.setBrand(tee()?"티볼":"야구","이닝 점수판 · 경기장 수비 배치 · 공격·수비 기록");
  $("bsHint").textContent=tee()?"티 위의 공을 칩니다. 볼넷 없이 "+C.tries+"번 실패하면 아웃":"볼 4개 볼넷 · 스트라이크 3개 삼진 · 투수 투구수 기록";
  $("teeCfg").hidden=!tee();
  drawBoard();drawField();drawCtl();drawRec();drawLog();
  K.setVal("bcInn",C.innings);K.setVal("bcLimit",C.limit);K.setVal("bcTries",C.tries);$("bcAllBat").checked=!!C.allBat;$("bcOut3").checked=!!C.out3;
  [0,1].forEach(t=>{K.setVal("bros"+t,S.teams[t].order.join("\n"));K.setVal("btn"+t,S.teams[t].name);$("bnl"+t).textContent=(t?"홈 · 말 공격":"원정 · 초 공격")+" 타순";});
  flash=null;
}

/* ----- 이벤트 ----- */
$("bsUndo").onclick=undo;
$("bsSwitch").onclick=()=>{if(S.over)return;snap();endHalf("교사 판단");};
K.arm($("bsEnd"),"경기 종료",()=>{if(S.over)return;snap();finish("교사가 경기를 마침");});
K.arm($("bsNew"),"새 경기",()=>{BG.reset();S=fresh(S.cfg,S.teams.map(t=>({name:t.name,order:t.order,pos:t.pos})));undoStack=[];pick=null;selBase=-1;assignPos=null;K.closeModal();save();draw();K.toast("새 경기 준비 완료 (팀 이름·타순·수비 위치 유지)","",1800);});
R.addEventListener("click",e=>{
  let b;
  if(e.target.id==="skipF"){const p=pick;pick=null;snap();resolve(p.type,null,true);return;}
  if(e.target.id==="cancelF"){pick=null;draw();return;}
  if(b=e.target.closest("[data-bmode]")){if(b.dataset.bmode===S.cfg.mode)return;snap();S.cfg.mode=b.dataset.bmode;S.teams.forEach(T=>{if(tee()){if(T.pos.CF2==null){const used=new Set(Object.values(T.pos));const f=T.order.findIndex((_,i)=>!used.has(i));if(f>=0)T.pos.CF2=f;}}else delete T.pos.CF2;});S.balls=0;S.strikes=0;if(S.log.length===0)S.cfg.innings=tee()?5:7;save();draw();K.toast(tee()?"티볼 모드":"야구 모드","",1400);return;}
  if(b=e.target.closest("[data-pitch]")){pitch(b.dataset.pitch);return;}
  if(b=e.target.closest("[data-res]")){result(b.dataset.res);return;}
  if(b=e.target.closest("[data-fpos]")){
    const k=b.dataset.fpos;
    if(pick){const p=pick;pick=null;snap();resolve(p.type,k,true);return;}
    assignPos=assignPos===k?null:k;selBase=-1;draw();return;
  }
  if(b=e.target.closest("[data-assign]")){const i=+b.dataset.assign;if(i<0){assignPos=null;draw();}else setPos(assignPos,i);return;}
  if(b=e.target.closest("[data-base]")){if(pick)return;const i=+b.dataset.base;selBase=S.bases[i]!=null&&selBase!==i?i:-1;assignPos=null;draw();return;}
  if(b=e.target.closest("[data-run]")){runnerAct(b.dataset.run);return;}
  if(b=e.target.closest("[data-rtab]")){recTab=b.dataset.rtab;drawRec();return;}
  if(b=e.target.closest("[data-defpos]")){const t=+b.dataset.defpos;snap();S.teams[t].pos=defPos(Math.min(tee()?10:9,S.teams[t].order.length),tee());save();draw();K.toast(S.teams[t].name+" 수비를 타순대로 배치했습니다","",1600);return;}
});
R.addEventListener("input",e=>{const el=e.target;if(el.id==="btn0"||el.id==="btn1"){S.teams[+el.id.slice(-1)].name=el.value||(el.id==="btn0"?"원정":"홈");save();drawBoard();drawRec();drawField();}});
R.addEventListener("change",e=>{
  const el=e.target;
  if(el.id==="bros0"||el.id==="bros1"){
    const t=+el.id.slice(-1),list=K.parseList(el.value,MAXP);if(!list.length){draw();return;}
    snap();const T=S.teams[t],old=T.order,map=old.map(n=>list.indexOf(n));
    /* 수비 위치와 기록은 학생(이름) 기준으로 따라간다. 타순이 바뀌어도 수비 위치는 그대로 */
    const np={};POS.forEach(k=>{const i=T.pos[k];if(i!=null&&map[i]>=0)np[k]=map[i];});T.pos=np;
    const st=Array.from({length:MAXP},mkSt);old.forEach((n,i)=>{if(map[i]>=0)st[map[i]]=T.st[i];});T.st=st;
    const ci=list.indexOf(old[T.cur]);T.cur=ci>=0?ci:(T.cur<list.length?T.cur:0);
    T.order=list;
    S.bases=S.bases.map(r=>t===off()&&r!=null?(map[r]>=0?map[r]:null):r);
    save();draw();return;
  }
  if(["bcInn","bcLimit","bcTries","bcAllBat","bcOut3"].includes(el.id)){
    const C=S.cfg;C.innings=Math.max(1,Math.min(12,+$("bcInn").value||7));C.limit=Math.max(0,Math.min(30,+$("bcLimit").value||0));
    C.tries=Math.max(1,Math.min(6,+$("bcTries").value||3));C.allBat=$("bcAllBat").checked;C.out3=$("bcOut3").checked;save();draw();
  }
});
draw();
return{
  record:makeRec,
  key(e){const k=e.key.toLowerCase();if(k==="z")undo();else if(k==="escape"&&(pick||assignPos)){pick=null;assignPos=null;draw();}}
};
}};
