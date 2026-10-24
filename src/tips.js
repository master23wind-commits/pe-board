/* ================= 득점 한마디 공용 (게임 로딩 화면 팁처럼 득점마다 바뀌는 문구) =================
   은행 형식 [영역, 문구]. 영역: t 기술 · s 전술 · r 규칙 · h 역사 · c 문화 · v 한마디(가치) */
K.TIPCAT={t:"기술",s:"전술",r:"규칙",h:"역사",c:"문화",v:"한마디"};
K.tipBox=id=>'<div class="bdtip" id="'+id+'" hidden aria-live="polite"><span class="c"></span><p></p></div>';
/* 다 돌 때까지 겹치지 않게 섞은 순서를 기기에 저장해 두고 하나씩 꺼낸다 */
K.tipShow=(box,key,bank)=>{
  if(!box||!bank||!bank.length)return;
  const QK="pe-tipq-"+key;let q=K.load(QK);
  if(!Array.isArray(q)||!q.length||q.some(i=>i>=bank.length))q=K.shuf(bank.map((_,i)=>i));
  const tp=bank[q.shift()];K.save(QK,q);if(!tp)return;
  const c=box.querySelector(".c"),p=box.querySelector("p");
  c.textContent=K.TIPCAT[tp[0]]||"";c.dataset.c=tp[0];p.textContent=tp[1];
  box.hidden=false;box.classList.remove("on");void box.offsetWidth;box.classList.add("on");
};
