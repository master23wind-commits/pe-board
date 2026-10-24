/* ================= 경기 기록 보관함 ================= */
K.newId=()=>"g"+Date.now().toString(36)+Math.random().toString(36).slice(2,7);
K.fmtDate=ts=>{const d=new Date(ts),p=n=>String(n).padStart(2,"0");return d.getFullYear()+"-"+p(d.getMonth()+1)+"-"+p(d.getDate())+" "+p(d.getHours())+":"+p(d.getMinutes());};
K.rec=(()=>{
  const LK="pe-records";
  let db=null,uid=null,mode="local",cache=[],subs=[],unsub=null;
  const localAll=()=>K.load(LK)||[];
  const emit=()=>subs.forEach(f=>{try{f();}catch(e){}});
  function toLocal(){mode="local";if(unsub){try{unsub();}catch(e){}unsub=null;}cache=localAll();emit();}
  const col=()=>db.collection("data/users/"+uid);
  async function init(){
    cache=localAll();emit();
    try{
      if(!window.claude||!window.claude.use)return;
      const u=await window.claude.use("user"),d=await window.claude.use("db");
      if(!u||!d)return;
      const id=await u.id();if(!id)return;
      db=d;uid=id;mode="cloud";
      unsub=col().onSnapshot(snap=>{
        const local=localAll();
        cache=snap.docs.map(x=>Object.assign({},x.data(),{id:x.id})).filter(r=>r.kind==="game");
        // 아직 올라가지 못한 이 기기 기록도 함께 보여준다
        local.forEach(r=>{if(!cache.some(c=>c.id===r.id))cache.push(r);});
        emit();
      },()=>toLocal());
      // 예전에 이 기기에만 저장된 기록을 계정으로 옮긴다
      for(const r of localAll()){
        try{await col().doc(r.id).set(r);K.save(LK,localAll().filter(x=>x.id!==r.id));}catch(e){break;}
      }
    }catch(e){toLocal();}
  }
  async function put(r){
    r=Object.assign({},r,{kind:"game"});
    if(mode==="cloud"){
      try{await col().doc(r.id).set(r);return "cloud";}
      catch(e){/* 쓰기 권한이 없거나 연결이 끊긴 경우 이 기기에 저장 */}
    }
    const a=localAll().filter(x=>x.id!==r.id);a.push(r);K.save(LK,a);
    if(mode!=="cloud")cache=a;else if(!cache.some(c=>c.id===r.id))cache.push(r);else cache=cache.map(c=>c.id===r.id?r:c);
    emit();return "local";
  }
  async function del(id){
    K.save(LK,localAll().filter(x=>x.id!==id));
    if(mode==="cloud"){try{await col().doc(id).delete();}catch(e){}}
    cache=cache.filter(c=>c.id!==id);emit();
  }
  return{
    init,put,del,
    list:()=>cache.slice().sort((a,b)=>b.at-a.at),
    get:id=>cache.find(c=>c.id===id),
    where:()=>mode,
    onChange(f){subs.push(f);return()=>{subs=subs.filter(x=>x!==f);};}
  };
})();
K.download=async(filename,text,mime)=>{
  let dl=null;
  if(!window.claude||!window.claude.use){
    // 파일로 내려받아 브라우저에서 직접 연 경우: 보통의 내려받기 링크를 쓴다
    try{const u=URL.createObjectURL(new Blob([text],{type:(mime||"text/csv")+";charset=utf-8"}));const a=document.createElement("a");a.href=u;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),2000);return "saved";}catch(e){return "none";}
  }
  try{dl=await window.claude.use("downloads");}catch(e){}
  if(!dl)return "none";
  try{await dl.save({filename,data:text});return "saved";}
  catch(e){return e&&e.code==="declined"?"declined":"none";}
};
K.copyText=(text)=>{
  try{return navigator.clipboard.writeText(text).then(()=>true,()=>false);}catch(e){return Promise.resolve(false);}
};
