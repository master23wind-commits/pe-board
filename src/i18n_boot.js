/* ================= 언어 설정 (영어 모드) =================
   pe-lang: "ko" | "en". 저장값이 없으면 브라우저 언어가 한국어가 아닐 때 영어로 시작한다.
   여기서는 모듈이 그려지기 전에 필요한 것만 한다(예시 이름, 문서 언어). 화면 번역은 i18n.js. */
K.LANG=(()=>{
  try{const v=JSON.parse(localStorage.getItem("pe-lang"));if(v==="ko"||v==="en")return v;}catch(e){}
  try{return /^ko\b/i.test(navigator.language||"ko")?"ko":"en";}catch(e){return "ko";}
})();
K.setLang=l=>{try{localStorage.setItem("pe-lang",JSON.stringify(l));}catch(e){}location.reload();};
if(K.LANG==="en"){
  document.documentElement.lang="en";
  /* 처음 쓰는 영어 사용자를 위한 예시 명단 (이미 저장된 명단은 그대로) */
  const EN=[["Alex","Mia","Leo","Emma","Noah","Ava","Liam","Zoe","Ethan","Lily"],
            ["Ryan","Chloe","Owen","Ella","Lucas","Grace","Jack","Nora","Sam","Ruby"]];
  K.EX10.forEach((a,i)=>a.splice(0,a.length,...EN[i]));
}
