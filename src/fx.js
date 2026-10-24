/* ================= 득점 효과 (종목마다 짧고 가볍게) =================
   K.fx.play(종류, 점수 요소, {from, color, big, text})
   종류: fire(농구) spike(배구) tt(탁구) shuttle(배드민턴) pickle(피클볼) goal(축구·풋살)
         kin(킨볼) baseball(야구) disc(얼티밋) tchouk(츄크볼) netball(넷볼) football(플래그)
         boccia(보치아) run(달리기) quiz(퀴즈) out/revive(피구) */
K.fx=(()=>{
  const reduce=()=>{try{return matchMedia("(prefers-reduced-motion: reduce)").matches;}catch(e){return false;}};
  const on=()=>{const v=K.load("pe-fx");return v!==false;};
  let layer=null;
  const L=()=>{if(!layer||!layer.isConnected){layer=document.createElement("div");layer.className="fx-layer";document.body.appendChild(layer);}return layer;};
  const C=el=>{const r=el.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2,w:r.width,h:r.height,top:r.top,left:r.left};};
  const mk=(cls,x,y,css,html)=>{const d=document.createElement("div");d.className=cls;d.style.left=x+"px";d.style.top=y+"px";if(css)Object.assign(d.style,css);if(html)d.innerHTML=html;L().appendChild(d);return d;};
  const run=(el,kf,opt)=>{const a=el.animate(kf,opt);a.onfinish=()=>el.remove();setTimeout(()=>el.remove(),(opt.duration||800)+(opt.delay||0)+800);return a;};
  const T=(x,y,s,r)=>"translate(-50%,-50%) translate("+x+"px,"+y+"px)"+(s!=null?" scale("+s+")":"")+(r!=null?" rotate("+r+"deg)":"");
  const rnd=(a,b)=>a+Math.random()*(b-a);
  function colorOf(el){try{const t=el.closest("[data-t],.team,.qteam,.bgk-b");return(t&&getComputedStyle(t).getPropertyValue("--tc").trim())||"#ffcf3a";}catch(e){return "#ffcf3a";}}
  /* ---- 기본 조각 ---- */
  function text(el,txt,color,big){
    const c=C(el),t=mk("fx-txt"+(big?" big":""),c.x,c.y-c.h*.2,{color});t.textContent=txt;
    run(t,[{transform:T(0,0,.5),opacity:0},{transform:T(0,-c.h*.25,1.12),opacity:1,offset:.22},{transform:T(0,-c.h*.6-30,1),opacity:0}],{duration:900,easing:"ease-out"});
  }
  function dots(el,color,n,spread,mode){
    const c=C(el);
    for(let i=0;i<n;i++){
      const ang=mode==="up"?(-Math.PI/2+rnd(-.7,.7)):Math.PI*2*i/n+rnd(0,.5),d=rnd(spread*.5,spread),sz=rnd(3,mode==="up"?6:7);
      const x0=mode==="up"?rnd(-c.w*.3,c.w*.3):0,y0=mode==="up"?rnd(-c.h*.1,c.h*.3):0;
      const p=mk("fx-dot",c.x+x0,c.y+y0,{width:sz+"px",height:sz+"px",background:i%3?color:"#fff",color});
      run(p,[{transform:T(0,0,1),opacity:1},{transform:T(Math.cos(ang)*d,Math.sin(ang)*d,.2),opacity:0}],{duration:rnd(480,760),easing:"cubic-bezier(.2,.7,.3,1)",delay:mode==="up"?rnd(0,180):0});
    }
  }
  function rings(el,color,n,size,dur){
    const c=C(el);
    for(let i=0;i<n;i++){const r=mk("fx-ring",c.x,c.y,{borderColor:color,width:(size||90)+"px",height:(size||90)+"px"});
      run(r,[{transform:T(0,0,.25),opacity:.9},{transform:T(0,0,2.2),opacity:0}],{duration:dur||650,easing:"ease-out",delay:i*140});}
  }
  function glow(el,color,cls){el.classList.remove(cls||"fx-glow");void el.offsetWidth;el.style.setProperty("--fxc",color);el.classList.add(cls||"fx-glow");}
  // 날아가는 물체: from → to (포물선), 끝나면 cb
  function fly(cls,from,to,o){
    o=o||{};
    const a=from,b=C(to),mx=(a.x+b.x)/2,top=Math.min(a.y,b.y)-(o.arc!=null?o.arc:Math.max(50,Math.abs(b.x-a.x)*.22));
    const bx=b.x-(b.x-a.x)*.16,by=b.y+b.h*.32,sp=o.spin||0;
    const kf=o.bounce===false?[
      {transform:T(0,0,o.s0||1,0)},
      {transform:T(mx-a.x,top-a.y,o.s1||1,sp*.5),offset:.5},
      {transform:T(b.x-a.x,b.y-a.y,o.s2||.8,sp),opacity:.25}
    ]:[
      {transform:T(0,0,1,0)},
      {transform:T(mx-a.x,top-a.y,1,sp*.45),offset:.42},
      {transform:T(bx-a.x,by-a.y,1,sp*.8)+" scale(1.12,.84)",offset:.74},
      {transform:T(b.x-a.x,b.y-a.y,.6,sp),opacity:.2}
    ];
    const el=mk(cls,a.x,a.y,o.css);
    const an=el.animate(kf,{duration:o.dur||600,easing:"cubic-bezier(.3,.1,.4,1)"});
    if(o.bounce!==false&&o.tick!==false)setTimeout(()=>K.tone([o.tickHz||1100],0,.04,.22,"square"),(o.dur||600)*.74);
    an.onfinish=()=>{el.remove();if(o.cb)o.cb();};setTimeout(()=>el.remove(),2000);
  }
  const fromEl=(el,dx,dy)=>{if(el&&el.getBoundingClientRect){const c=C(el);return{x:c.x,y:c.y};}return null;};
  const fromOff=(to,dx,dy)=>{const c=C(to);return{x:c.x+dx,y:c.y+dy};};
  /* ---- 종목별 ---- */
  const P={
    fire(el,o){ // 농구: 숫자가 짧게 불탄다
      glow(el,"#ff7a18","fx-fire");
      dots(el,"#ff8a1f",o.big?14:8,o.big?110:80,"up");
      if(o.text)text(el,o.text,"#ffb020",o.big);
    },
    spike(el,o){ // 배구: 위에서 내리꽂히는 스파이크
      const c=C(el),a={x:c.x-140,y:c.y-240};
      const b=mk("fx-ball vb",a.x,a.y);
      const an=b.animate([{transform:T(0,0,.9,0)},{transform:T(c.x-a.x,c.y-a.y,1.05,260)}],{duration:280,easing:"cubic-bezier(.6,0,.9,.6)"});
      an.onfinish=()=>{b.remove();K.tone([180],0,.08,.35,"square");rings(el,o.color,1,80,450);dots(el,o.color,10,70);text(el,o.text||"+1",o.color);glow(el,o.color);};
      setTimeout(()=>b.remove(),1500);
    },
    tt(el,o){fly("fx-ball tt",fromEl(o.from)||fromOff(el,-300,0),el,{cb:()=>{dots(el,o.color,12,70);rings(el,o.color,1);text(el,o.text||"+1",o.color);glow(el,o.color);},tickHz:1200});},
    shuttle(el,o){const fr=fromEl(o.from)||fromOff(el,-300,-40);const dir=C(el).x>fr.x?1:-1;
      fly("fx-shuttle"+(dir<0?" l":""),fr,el,{bounce:false,arc:120,dur:640,s2:.9,cb:()=>{K.tone([700],0,.05,.2,"triangle");dots(el,"#ffffff",7,45);text(el,o.text||"+1",o.color);glow(el,o.color);}});},
    pickle(el,o){fly("fx-ball pk",fromEl(o.from)||fromOff(el,-300,0),el,{tickHz:900,cb:()=>{dots(el,"#d9f99d",10,60);text(el,o.text||"+1",o.color);glow(el,o.color);}});},
    goal(el,o){ // 축구·풋살: 그물이 출렁
      const c=C(el),sz=Math.max(c.w,c.h)*1.1;
      const n=mk("fx-net",c.x,c.y,{width:sz+"px",height:sz*.72+"px"});
      run(n,[{transform:T(0,0,.6),opacity:0},{transform:T(0,0,1.08)+" skewX(-4deg)",opacity:.9,offset:.25},{transform:T(0,0,.98)+" skewX(3deg)",opacity:.7,offset:.55},{transform:T(0,0,1),opacity:0}],{duration:900,easing:"ease-out"});
      const b=mk("fx-ball sc",c.x+rnd(-60,60),c.y+140);
      run(b,[{transform:T(0,0,1.6,0),opacity:1},{transform:T(0,-140,.55,300),opacity:1,offset:.6},{transform:T(0,-130,.5,330),opacity:0}],{duration:520,easing:"cubic-bezier(.2,.8,.3,1)"});
      setTimeout(()=>{text(el,o.text||"골!",o.color,true);glow(el,o.color);},300);
    },
    kin(el,o){rings(el,o.color,3,120,800);text(el,o.text||"+1",o.color);glow(el,o.color);},
    baseball(el,o){
      fly("fx-ball bs",fromOff(el,0,260),el,{bounce:false,arc:o.big?260:90,dur:o.big?800:560,spin:540,s2:.7,cb:()=>{
        if(o.big){dots(el,"#ffd23a",20,140);dots(el,o.color,12,90);rings(el,"#ffd23a",2,100,700);}else dots(el,o.color,9,60);
        text(el,o.text,o.big?"#ffd23a":o.color,o.big);glow(el,o.color);}});
    },
    disc(el,o){fly("fx-disc",fromEl(o.from)||fromOff(el,-320,-30),el,{bounce:false,arc:40,dur:700,spin:720,s2:.9,cb:()=>{dots(el,o.color,10,70);text(el,o.text||"+1",o.color);glow(el,o.color);}});},
    tchouk(el,o){
      const c=C(el),f=mk("fx-frame",c.x,c.y,{borderColor:o.color});
      run(f,[{transform:T(0,0,.5,-12),opacity:0},{transform:T(0,0,1.05,-12),opacity:.9,offset:.3},{transform:T(0,0,1.2,-12),opacity:0}],{duration:650,easing:"ease-out"});
      const b=mk("fx-ball tb",c.x,c.y);
      run(b,[{transform:T(0,0,.6),opacity:1},{transform:T(rnd(-90,90),-120,1),opacity:1,offset:.5},{transform:T(rnd(-130,130),40,.8),opacity:0}],{duration:700,easing:"ease-out"});
      K.tone([520],0,.06,.25,"triangle");setTimeout(()=>{text(el,o.text||"+1",o.color);glow(el,o.color);},180);
    },
    netball(el,o){
      const c=C(el),ring=mk("fx-hoop",c.x,c.y-c.h*.45,{borderColor:"#ff9a3c"});
      run(ring,[{transform:T(0,0,.7),opacity:0},{transform:T(0,0,1),opacity:1,offset:.2},{transform:T(0,0,1),opacity:1,offset:.75},{transform:T(0,0,1),opacity:0}],{duration:850});
      const b=mk("fx-ball nb",c.x,c.y-c.h*.45-90);
      run(b,[{transform:T(0,0,1),opacity:1},{transform:T(0,90,.95),opacity:1,offset:.55},{transform:T(0,170,.8),opacity:0}],{duration:620,easing:"cubic-bezier(.5,0,.8,1)"});
      setTimeout(()=>{K.tone([1500,1900],0,.08,.12,"sine");text(el,o.text||"골!",o.color);glow(el,o.color);},360);
    },
    football(el,o){
      fly("fx-football",fromEl(o.from)||fromOff(el,-340,-20),el,{bounce:false,arc:110,dur:720,spin:1080,s2:.8,cb:()=>{
        dots(el,"#facc15",o.big?18:10,o.big?120:70);if(o.big)rings(el,"#facc15",2,100,700);text(el,o.text||"TD!",o.big?"#facc15":o.color,o.big);glow(el,o.color);}});
    },
    boccia(el,o){
      const c=C(el),b=mk("fx-ball bc",c.x-220,c.y+c.h*.3,{background:o.color});
      const an=b.animate([{transform:T(0,0,1,0)},{transform:T(220,0,1,720)}],{duration:560,easing:"cubic-bezier(.2,.8,.4,1)"});
      an.onfinish=()=>{b.remove();K.tone([800],0,.05,.25,"square");rings(el,o.color,3,70,700);text(el,o.text||"+1",o.color);glow(el,o.color);};setTimeout(()=>b.remove(),1500);
    },
    run(el,o){
      const c=C(el);
      for(let i=0;i<3;i++){const s=mk("fx-streak",c.left-10,c.y+(i-1)*8,{background:o.color});run(s,[{transform:"translate(0,-50%) scaleX(.2)",opacity:.9},{transform:"translate("+(-40-i*12)+"px,-50%) scaleX(1)",opacity:0}],{duration:380,delay:i*40,easing:"ease-out"});}
      glow(el,o.color);
    },
    quiz(el,o){dots(el,o.color,12,70);rings(el,o.color,1);text(el,o.text||"정답!",o.color);glow(el,o.color);},
    out(el,o){const c=C(el),s=mk("fx-stamp",c.x,c.y);s.textContent="OUT";run(s,[{transform:T(0,0,1.8,-12),opacity:0},{transform:T(0,0,1,-12),opacity:1,offset:.3},{transform:T(0,0,1,-12),opacity:0}],{duration:650,easing:"ease-out"});},
    revive(el,o){dots(el,"#4ade80",10,55);text(el,"부활!","#4ade80");}
  };
  return{
    on,set(v){K.save("pe-fx",!!v);},
    play(kind,el,o){
      if(!el||!on()||reduce()||!P[kind])return;
      o=o||{};o.color=o.color||colorOf(el);
      try{P[kind](el,o);}catch(e){}
    },
    // 예전 호출 호환
    burst(el,color,txt,big){if(!el||!on()||reduce())return;dots(el,color,big?22:12,big?120:70);rings(el,color,1);if(txt)text(el,txt,color,big);glow(el,color);},
    ball(from,to,color,cb){if(!on()||reduce()){if(cb)cb();return;}fly("fx-ball tt",fromEl(from),to,{cb});}
  };
})();
