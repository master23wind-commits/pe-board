/* ================= 공용 빙고 모드 =================
   팀마다 빙고판(3×3 또는 4×4)에 선수 이름과 미션을 섞어 놓고,
   선수가 득점하면 그 칸이 자동으로 채워지고(미션 칸은 선생님이 눌러서 채움)
   한 줄이 완성될 때마다 보너스를 준다.
   o = {el, key, get:()=>S, teams:()=>[{name,color,roster:[이름]}], missions:[...], bonusDef, unit:"점",
        apply:(t,pts,lines)=>{}, snap:()=>{}, after:()=>{}, hint:"득점하면", bonusText:(n)=>"한 줄 +n점"} */
K.bingoKit=o=>{
  const CK="pe-bingo-"+o.key,esc=K.esc;
  let C=Object.assign({on:false,size:3,bonus:o.bonusDef||1,mix:"mix"},K.load(CK)||{});
  const saveC=()=>K.save(CK,C);
  const B=()=>{const S=o.get();if(!S.bingo)S.bingo={boards:null};return S.bingo;};
  const hasNames=()=>o.teams().some(t=>(t.roster||[]).filter(Boolean).length);
  function build(){
    const n=C.size*C.size;
    B().boards=o.teams().map(tm=>{
      const names=K.shuf((tm.roster||[]).map((txt,i)=>({k:"p",i,txt})).filter(c=>c.txt));
      const ms=K.shuf((o.missions||[]).map(txt=>({k:"m",txt})));
      let cells=[];
      if(C.mix==="names"||!ms.length)cells=names.slice(0,n);
      else if(C.mix==="missions"||!names.length)cells=ms.slice(0,n);
      else{const nm=Math.min(names.length,n-Math.floor(n/3));cells=names.slice(0,nm).concat(ms.slice(0,n-nm));}
      // 칸이 모자라면 미션 → 이름 순서로 채운다
      let pool=ms.filter(m=>!cells.includes(m)).concat(names.filter(p=>!cells.includes(p)));
      while(cells.length<n&&pool.length)cells.push(pool.shift());
      while(cells.length<n)cells.push({k:"m",txt:"자유 미션"});
      cells=K.shuf(cells);
      return{cells,marks:cells.map(()=>false),lines:0};
    });
  }
  function lineCount(b){
    const s=Math.round(Math.sqrt(b.cells.length)),m=b.marks;let n=0;
    for(let r=0;r<s;r++){let ok=true;for(let c=0;c<s;c++)if(!m[r*s+c])ok=false;if(ok)n++;}
    for(let c=0;c<s;c++){let ok=true;for(let r=0;r<s;r++)if(!m[r*s+c])ok=false;if(ok)n++;}
    let d1=true,d2=true;for(let i=0;i<s;i++){if(!m[i*s+i])d1=false;if(!m[i*s+s-1-i])d2=false;}
    return n+(d1?1:0)+(d2?1:0);
  }
  function recount(t,quiet){
    const b=B().boards[t],L=lineCount(b),d=L-b.lines;
    if(!d)return 0;
    b.lines=L;o.apply(t,d*C.bonus,d);
    if(d>0&&!quiet){const T=o.teams()[t];setTimeout(()=>{K.snd.bonus();K.toast("빙고! "+T.name+" "+(d>1?d+"줄 ":"")+(o.bonusText?o.bonusText(d*C.bonus):"+"+d*C.bonus+(o.unit||"점")),"bingo",3000);},250);}
    return d;
  }
  function ready(){if(!C.on)return false;const bb=B();if(!bb.boards||bb.boards.length!==o.teams().length)build();return true;}
  const api={
    on:()=>C.on,
    // 선수 득점 → 그 선수 칸 채우기 (모듈의 snap 뒤, save/draw 앞에서 부른다)
    hit(t,i){
      if(!ready()||i==null||i<0)return 0;
      const b=B().boards[t];let ch=false;
      b.cells.forEach((c,ci)=>{if(c.k==="p"&&c.i===i&&!b.marks[ci]){b.marks[ci]=true;ch=true;}});
      return ch?recount(t):0;
    },
    lines:t=>{const bb=B();return C.on&&bb.boards&&bb.boards[t]?bb.boards[t].lines:0;},
    summary(){const bb=B();if(!C.on||!bb.boards)return "";return "빙고 "+o.teams().map((T,t)=>T.name+" "+(bb.boards[t]?bb.boards[t].lines:0)+"줄").join(" · ");},
    reset(){B().boards=null;},
    draw(){
      const el=o.el;if(!el)return;
      let h="<div class=\"bgk-h op\"><label class=\"sw\" style=\"--sc:var(--bomb)\"><input type=\"checkbox\" data-bgk=\"on\""+(C.on?" checked":"")+"><span class=\"knob\"></span>빙고 모드</label>";
      if(C.on)h+="<label>판 <select data-bgk=\"size\"><option value=\"3\""+(C.size===3?" selected":"")+">3×3</option><option value=\"4\""+(C.size===4?" selected":"")+">4×4</option></select></label>"+
        "<label>칸 <select data-bgk=\"mix\"><option value=\"mix\""+(C.mix==="mix"?" selected":"")+">선수+미션</option><option value=\"names\""+(C.mix==="names"?" selected":"")+">선수만</option><option value=\"missions\""+(C.mix==="missions"?" selected":"")+">미션만</option></select></label>"+
        "<label>한 줄 보너스 <input type=\"number\" data-bgk=\"bonus\" min=\"0\" max=\"20\" value=\""+C.bonus+"\"> "+esc(o.unit||"점")+"</label><button type=\"button\" class=\"small\" data-bgk=\"new\">새 판 섞기</button>";
      else h+="<span class=\"x\">켜면 팀마다 빙고판이 생겨요. "+esc(o.hint||"선수가 득점하면 그 칸이 채워지고")+", 미션 칸은 해냈을 때 눌러요. 한 줄마다 보너스!</span>";
      h+="</div>";
      if(C.on){
        ready();
        const T=o.teams(),bb=B().boards;
        h+="<div class=\"bgk-boards\">"+T.map((tm,t)=>{const b=bb[t];const s=Math.round(Math.sqrt(b.cells.length));
          return "<div class=\"bgk-b\" style=\"--tc:"+tm.color+"\"><div class=\"bgk-t\"><b>"+esc(tm.name)+"</b><span>"+b.lines+"줄"+(b.lines?" · +"+b.lines*C.bonus+esc(o.unit||"점"):"")+"</span></div><div class=\"bgk-g\" style=\"grid-template-columns:repeat("+s+",1fr)\">"+
            b.cells.map((c,ci)=>"<button type=\"button\" class=\"bgk-c"+(b.marks[ci]?" on":"")+(c.k==="m"?" ms":"")+"\" data-bgc=\""+t+":"+ci+"\"><span>"+esc(c.txt)+"</span></button>").join("")+"</div></div>";}).join("")+"</div>";
      }
      el.innerHTML=h;
    }
  };
  o.el.addEventListener("click",e=>{
    let b;
    if(b=e.target.closest("[data-bgc]")){
      if(document.body.classList.contains("view"))return;
      const [t,ci]=b.dataset.bgc.split(":").map(Number);const bd=B().boards[t];
      o.snap();bd.marks[ci]=!bd.marks[ci];recount(t);o.after();return;
    }
    if(b=e.target.closest("[data-bgk='new']")){o.snap();const bb=B();
      // 이미 받은 보너스는 되돌리고 새 판
      if(bb.boards)bb.boards.forEach((bd,t)=>{if(bd.lines)o.apply(t,-bd.lines*C.bonus,-bd.lines);});
      build();o.after();K.toast("빙고판을 새로 섞었어요","",1400);}
  });
  o.el.addEventListener("change",e=>{
    const el=e.target,k=el.dataset.bgk;if(!k)return;
    const bb=B();
    const undoBonus=()=>{if(bb.boards)bb.boards.forEach((bd,t)=>{if(bd.lines)o.apply(t,-bd.lines*C.bonus,-bd.lines);});};
    if(k==="on"){o.snap();C.on=el.checked;if(!C.on){undoBonus();bb.boards=null;}saveC();o.after();return;}
    if(k==="size"||k==="mix"){o.snap();undoBonus();C[k]=k==="size"?+el.value:el.value;build();saveC();o.after();return;}
    if(k==="bonus"){
      const nb=Math.max(0,Math.min(20,+el.value||0));o.snap();
      if(bb.boards)bb.boards.forEach((bd,t)=>{if(bd.lines)o.apply(t,bd.lines*(nb-C.bonus),0);});
      C.bonus=nb;saveC();o.after();
    }
  });
  return api;
};
