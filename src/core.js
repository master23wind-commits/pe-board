/* ================= 공통 도구 ================= */
const K=(()=>{
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const shuf=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
function load(k){try{return JSON.parse(localStorage.getItem(k));}catch(e){return null;}}
function save(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}

/* 소리: 브라우저는 화면을 한 번 누른 뒤에만 소리를 허용한다 */
let ac=null;
function audio(){try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();if(ac.state==="suspended")ac.resume();}catch(e){ac=null;}return ac;}
function unlock(){const a=audio();if(a&&a.state==="running"){const b=$("sndBtn");if(b)b.textContent="소리 테스트";}}
document.addEventListener("pointerdown",unlock);
document.addEventListener("keydown",unlock);
function tone(freqs,start,len,vol,type){
  const a=audio();if(!a)return;
  const t0=a.currentTime+start,g=a.createGain();
  g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(vol,t0+.015);
  g.gain.setValueAtTime(vol,Math.max(t0+.02,t0+len-.05));g.gain.linearRampToValueAtTime(0,t0+len);
  g.connect(a.destination);
  freqs.forEach(f=>{const o=a.createOscillator();o.type=type||"triangle";o.frequency.value=f;o.connect(g);o.start(t0);o.stop(t0+len+.02);});
}
const snd={
  buzzer(){for(let i=0;i<3;i++)tone([880,1320],i*.32,.22,.28,"square");},
  horn(){tone([233,311,466],0,2.2,.32,"sawtooth");},
  chime(){tone([660],0,.1,.2);tone([990],.09,.16,.2);},
  swish(){tone([523],0,.1,.2);tone([784],.08,.1,.2);tone([1047],.16,.2,.2);},
  fanfare(){[523,659,784,1047].forEach((f,i)=>tone([f,f*1.5],i*.12,i===3?.5:.14,.2));},
  bonus(){[523,659,784].forEach((f,i)=>tone([f],i*.14,.2,.22,"triangle"));},
  stop(){tone([392],0,.12,.22,"square");tone([311],.11,.2,.22,"square");},
  tick(n){tone([330+Math.min(n,20)*45],0,.09,.22,"square");},
  whistle(n){n=n||1;for(let i=0;i<n;i++)tone([2900,3150],i*.42,n>1&&i===n-1?.8:.3,.16,"sine");},
  boom(){
    const a=audio();if(!a)return;
    const len=.9,buf=a.createBuffer(1,Math.floor(a.sampleRate*len),a.sampleRate),d=buf.getChannelData(0);
    for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,2.4);
    const s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();
    s.buffer=buf;f.type="lowpass";f.frequency.value=1000;g.gain.value=.8;
    s.connect(f);f.connect(g);g.connect(a.destination);s.start();
    tone([60],0,.55,.45,"sine");
  }
};

let wl=null;
async function wake(on){try{if(on&&navigator.wakeLock&&!wl){wl=await navigator.wakeLock.request("screen");wl.addEventListener("release",()=>{wl=null;});}else if(!on&&wl){await wl.release();wl=null;}}catch(e){wl=null;}}

let tt=null;
function toast(msg,kind,ms){const t=$("toast");t.textContent=msg;t.className="toast"+(kind?" "+kind:"");t.hidden=false;clearTimeout(tt);tt=setTimeout(()=>t.hidden=true,ms||2600);}
function fmt(ms){if(ms>=60000){const s=Math.ceil(ms/1000);return Math.floor(s/60)+":"+String(s%60).padStart(2,"0");}return (Math.floor(ms/100)/10).toFixed(1);}
function fmtUp(ms){const s=Math.floor(ms/1000);return Math.floor(s/60)+":"+String(s%60).padStart(2,"0");}
function bump(el){if(!el)return;el.classList.remove("bump");void el.offsetWidth;el.classList.add("bump");}
function arm(btn,label,fn){
  btn.addEventListener("click",()=>{
    if(btn.classList.contains("arm")){clearTimeout(btn._t);btn.classList.remove("arm");btn.textContent=label;fn();}
    else{btn.classList.add("arm");btn.textContent="한 번 더 누르면 초기화";btn._t=setTimeout(()=>{btn.classList.remove("arm");btn.textContent=label;},3000);}
  });
}
function modal(o){
  const m=$("modal");
  $("mSub").textContent=o.sub||"";
  $("mTitle").textContent=o.title||"";$("mTitle").style.color=o.color||"var(--fg)";
  $("mScore").textContent=o.score||"";$("mScore").hidden=!o.score;
  $("mStats").innerHTML=o.stats||"";
  const row=$("mRow");row.innerHTML="";
  (o.buttons||[{label:"닫기"}]).forEach(b=>{
    const el=document.createElement("button");el.type="button";el.textContent=b.label;if(b.cls)el.className=b.cls;
    el.onclick=()=>{m.hidden=true;if(b.fn)b.fn();};row.appendChild(el);
  });
  m.hidden=false;
}
function closeModal(){$("modal").hidden=true;}
function setBrand(t,s){$("brandName").textContent=t;$("brandSub").textContent=s||"";}
function setVal(id,v){const el=$(id);if(el&&document.activeElement!==el)el.value=v;}
function parseList(txt,max){return txt.split(/[\n,]/).map(s=>s.trim()).filter(Boolean).slice(0,max||99);}
const SERVE_SVG='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 2c3 4 3 9 0 10M12 12c-4 2-8 1-10-1M12 12c3 2 5 6 4 10" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
const EX10=[["김민준","이서연","박도윤","최하은","정시우","강지유","조예준","윤수아","장하준","임채원"],
            ["임서준","한지민","오주원","서윤서","신건우","권다은","황현우","안채원","송지호","배유나"]];
return {$,esc,shuf,load,save,tone,snd,wake,toast,fmt,fmtUp,bump,arm,modal,closeModal,setBrand,setVal,parseList,unlock,SERVE_SVG,EX10};
})();
const MODS={};
/* 시간 수정 도구: 메인 시계 아래에 두는 ±분·초 버튼과 직접 입력 칸 */
K.timeCtl=key=>'<div class="tctl op"><div class="btnrow">'+[[-60000,"−1분"],[60000,"+1분"],[-10000,"−10초"],[10000,"+10초"],[-1000,"−1초"],[1000,"+1초"]].map(([v,l])=>'<button class="small" type="button" data-tclk="'+key+'" data-tadj="'+v+'">'+l+'</button>').join("")+
  '</div><div class="tset"><input type="number" min="0" max="99" id="'+key+'M" data-tin="'+key+'" aria-label="분"><span>분</span><input type="number" min="0" max="59" id="'+key+'S" data-tin="'+key+'" aria-label="초"><span>초</span><button class="small" type="button" data-tset="'+key+'">시간 맞추기</button><button class="small treset" type="button" data-treset="'+key+'" hidden>⟲ 시간 리셋</button></div></div>';
K.readTime=key=>{const m=Math.max(0,Math.min(99,parseInt(K.$(key+"M").value,10)||0)),s=Math.max(0,Math.min(59,parseInt(K.$(key+"S").value,10)||0));return (m*60+s)*1000;};
K.fillTime=(key,ms,up)=>{const M=K.$(key+"M"),S=K.$(key+"S");if(!M||!S)return;const a=document.activeElement;if(a===M||a===S)return;const t=up?Math.floor(ms/1000):Math.ceil(ms/1000);M.value=Math.floor(t/60);S.value=t%60;};
/* 모듈 루트에 시간 수정 이벤트를 연결한다. set(key, 새 시간 ms) */
K.bindTime=(root,get,set,o)=>{
  /* o.full(key): 리셋할 처음 시간(ms), o.stop(key): 시계 멈추기 */
  root.querySelectorAll("[data-treset]").forEach(b=>{
    if(!o||!o.full)return;b.hidden=false;
    K.arm(b,"⟲ 시간 리셋",()=>{const k=b.dataset.treset,v=o.full(k);if(o.stop)o.stop(k);set(k,v);K.fillTime(k,v);K.snd.chime();K.toast("시간을 처음("+K.fmtUp(v)+")으로 되돌렸습니다","",1600);});
  });
  root.addEventListener("click",e=>{
    let b;
    if(b=e.target.closest("[data-tadj]")){set(b.dataset.tclk,get(b.dataset.tclk)+ +b.dataset.tadj);}
    else if(b=e.target.closest("[data-tset]")){set(b.dataset.tset,K.readTime(b.dataset.tset));K.toast("시간을 "+K.fmtUp(K.readTime(b.dataset.tset))+"로 맞췄습니다","",1400);}
  });
  root.addEventListener("keydown",e=>{const k=e.target.dataset&&e.target.dataset.tin;if(e.key==="Enter"&&k){set(k,K.readTime(k));e.target.blur();K.toast("시간을 "+K.fmtUp(K.readTime(k))+"로 맞췄습니다","",1400);}});
};
/* 기록 고치기: data-fix="경로|경로*6" 숫자 칸을 누르면 −/+ 창이 뜬다.
   o.get(): 상태 S, o.snap(): 되돌리기 저장, o.after(info): 저장·다시 그리기 */
K.fixKit=(root,o)=>{
  let pop=K.$("fixPop");
  if(!pop){
    pop=document.createElement("div");pop.id="fixPop";pop.className="fixpop";pop.hidden=true;pop.setAttribute("role","dialog");
    pop.innerHTML='<div class="fixl"></div><div class="fixrow"><button type="button" class="fixm" data-fd="-1" aria-label="하나 빼기">−</button><b class="fixv">0</b><button type="button" class="fixp" data-fd="1" aria-label="하나 더하기">+</button></div><div class="fixh">잘못 누른 기록을 고쳐요</div><button type="button" class="small fixx">닫기</button>';
    document.body.appendChild(pop);
    document.addEventListener("pointerdown",e=>{if(!pop.hidden&&!pop.contains(e.target)&&!e.target.closest("[data-fix]"))K.fixClose();},true);
    document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!pop.hidden)K.fixClose();});
    window.addEventListener("hashchange",()=>K.fixClose());
    pop.querySelector(".fixx").onclick=()=>K.fixClose();
    pop.addEventListener("click",e=>{const b=e.target.closest("[data-fd]");if(b&&pop._fix)pop._fix(+b.dataset.fd);});
  }
  try{const n=+(localStorage.getItem("pe-fixhint")||0);if(n<3){localStorage.setItem("pe-fixhint",String(n+1));setTimeout(()=>{if(root.isConnected&&root.querySelector("[data-fix]"))K.toast("잘못 기록했으면 점선 밑줄 숫자를 눌러 고칠 수 있어요","",3200);},900);}}catch(e){}
  const parse=s=>s.split("|").map(x=>{const [p,m]=x.split("*");return{k:p.split("."),m:+m||1};});
  const ref=(S,k)=>{let o2=S;for(let i=0;i<k.length-1;i++){o2=o2==null?o2:o2[k[i]];}return o2;};
  const val=(S,k)=>{const r=ref(S,k);return r?(+r[k[k.length-1]]||0):0;};
  root.addEventListener("keydown",e=>{const c=e.target.closest&&e.target.closest("[data-fix]");if(c&&(e.key==="Enter"||e.key===" ")){e.preventDefault();e.stopPropagation();c.click();}});
  root.addEventListener("click",e=>{
    const c=e.target.closest("[data-fix]");if(!c||document.body.classList.contains("view"))return;
    const paths=parse(c.dataset.fix),label=c.dataset.fixl||"기록",mx=c.dataset.fixmax?+c.dataset.fixmax:Infinity;
    pop.querySelector(".fixl").textContent=label;
    const show=()=>{pop.querySelector(".fixv").textContent=val(o.get(),paths[0].k);const v=val(o.get(),paths[0].k);pop.querySelector(".fixm").disabled=v<=0;pop.querySelector(".fixp").disabled=v>=mx;};
    pop._fix=d=>{
      const S=o.get(),p0=paths[0];
      if(d<0&&val(S,p0.k)<=0)return;if(d>0&&val(S,p0.k)>=mx)return;
      o.snap();
      paths.forEach(p=>{const r=ref(S,p.k);if(!r)return;const key=p.k[p.k.length-1];r[key]=Math.max(0,(+r[key]||0)+d*p.m);});
      o.after({label,d,path:c.dataset.fix});show();K.snd.tick(d>0?6:2);
    };
    show();pop.hidden=false;
    const r=c.getBoundingClientRect(),w=pop.offsetWidth,h=pop.offsetHeight;
    let x=r.left+r.width/2-w/2,y=r.bottom+8;
    if(y+h>innerHeight-8)y=r.top-h-8;
    pop.style.left=Math.max(8,Math.min(innerWidth-w-8,x))+"px";pop.style.top=Math.max(8,y)+"px";
  });
};
K.fixClose=()=>{const p=K.$("fixPop");if(p){p.hidden=true;p._fix=null;}};
/* data-fix 숫자 칸 HTML */
K.fixN=(v,path,label,cls,max)=>'<span class="num fixn'+(cls?" "+cls:"")+'" role="button" tabindex="0" data-fix="'+path+'" data-fixl="'+K.esc(label)+'"'+(max!=null?' data-fixmax="'+max+'"':'')+' title="눌러서 고치기">'+v+'</span>';
