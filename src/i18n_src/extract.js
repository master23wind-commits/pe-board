// 원본 src의 한국어 화면 글자를 조각으로 뽑는다 (내용 은행 파일은 제외)
const fs=require("fs"),path=require("path"),acorn=require("acorn"),walk=require("acorn-walk");
const SRC="/home/claude/pe-board/src";
const SKIP=new Set(["all.js","quiz_bank.js","quiz_bank_ext.js","plan_lib.js","bd_tips.js","vb_tips.js","tt_tips.js"]);
const H=/[가-힣]/;
const out=new Map();
const NAMES=new Set(["김민준","이서연","박도윤","최하은","정시우","강지유","조예준","윤수아","장하준","임채원","임서준","한지민","오주원","서윤서","신건우","권다은","황현우","안채원","송지호","배유나"]);
function add(s,file){
  s=s.replace(/&nbsp;/g," ").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/g," ").trim();
  s=s.replace(/^[\s:·,.)\]]+|[\s(\[]+$/g,"").trim();
  if(!H.test(s)||NAMES.has(s))return;
  if(!out.has(s))out.set(s,new Set());out.get(s).add(file);
}
function frag(str,file){
  // 태그 속 속성값(placeholder, title, aria-label, value)
  str.replace(/<[^>]*>/g,tag=>{tag.replace(/(?:placeholder|title|aria-label|value|alt)\s*=\s*"([^"]*)"/g,(m,v)=>{v.split(/\$\{[^}]*\}/).forEach(x=>add(x,file));});return "";});
  // 태그 사이 글자
  str.split(/<[^>]*>/).forEach(t=>{
    // 따옴표가 깨진 속성 조각(예: aria-label="...)은 버림
    t.split(/[<>]/).forEach(u=>u.split(/\s*(?:[a-z-]+=)?"\s*/).forEach(x=>add(x.replace(/^(?:hidden|selected|checked|disabled)\b/,""),file)));
  });
}
for(const f of fs.readdirSync(SRC)){
  if(!f.endsWith(".js")||SKIP.has(f))continue;
  const code=fs.readFileSync(path.join(SRC,f),"utf8");
  let ast;try{ast=acorn.parse(code,{ecmaVersion:"latest",sourceType:"script"});}catch(e){console.error("parse fail",f,e.message);continue;}
  walk.full(ast,n=>{
    if(n.type==="Literal"&&typeof n.value==="string")frag(n.value,f);
    if(n.type==="TemplateElement")frag(n.value.cooked||"",f);
  });
}
// shell.html
const sh=fs.readFileSync(path.join(SRC,"shell.html"),"utf8").replace(/<style[\s\S]*?<\/style>/g,"").replace(/<!--[\s\S]*?-->/g,"");
frag(sh,"shell.html");
const arr=[...out.entries()].map(([k,v])=>({k,f:[...v].join(",")}));
fs.writeFileSync("frags.json",JSON.stringify(arr,null,0));
console.log("fragments",arr.length,"chars",arr.reduce((a,x)=>a+x.k.length,0));
const by={};arr.forEach(x=>{const f=x.f.split(",")[0];by[f]=(by[f]||0)+1;});console.log(by);
