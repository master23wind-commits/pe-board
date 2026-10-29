/* ================= 종목 선택과 화면 전환 ================= */
(function(){
const $=K.$;
const ICON={
  bb:'<svg class="ico" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M3 20h34M20 3v34M8 8c6 6 6 18 0 24M32 8c-6 6-6 18 0 24" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  vb:'<svg class="ico" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M20 3c5 7 5 15 0 17M20 20c-7 3-14 2-17-2M20 20c5 3 8 10 6 17" fill="none" stroke="currentColor" stroke-width="2.2"/></svg>',
  tt:'<svg class="ico" viewBox="0 0 40 40" aria-hidden="true"><circle cx="16" cy="16" r="11" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M23 24l10 10" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><circle cx="32" cy="9" r="3.5" fill="currentColor"/></svg>',
  bd:'<svg class="ico" viewBox="0 0 40 40" aria-hidden="true"><circle cx="13" cy="28" r="6" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M17 24L33 6M15 22L27 4M19 26L36 14M23 6l8 8" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  pb:'<svg class="ico" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="20" cy="12" r="2.4" fill="currentColor"/><circle cx="12" cy="20" r="2.4" fill="currentColor"/><circle cx="28" cy="20" r="2.4" fill="currentColor"/><circle cx="20" cy="28" r="2.4" fill="currentColor"/><circle cx="20" cy="20" r="2.4" fill="currentColor"/></svg>',
  sc:'<svg class="ico" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M20 13l6.5 4.7-2.5 7.6h-8l-2.5-7.6z" fill="currentColor"/><path d="M20 13V4M26.5 17.7l8-3M24 25.3l5 7M16 25.3l-5 7M13.5 17.7l-8-3" stroke="currentColor" stroke-width="2"/></svg>',
  bs:'<svg class="ico" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M10 7c5 8 5 18 0 26M30 7c-5 8-5 18 0 26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-dasharray="2.5 2"/></svg>',
  ut:'<svg class="ico" viewBox="0 0 40 40" aria-hidden="true"><ellipse cx="20" cy="22" rx="17" ry="8" fill="none" stroke="currentColor" stroke-width="2.5"/><ellipse cx="20" cy="20" rx="10" ry="4" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M6 10c4-3 8-3 12-1" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>',
  rn:'<svg class="ico" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="22" r="14" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M20 22V13M16 4h8M20 4v4M31 10l2-2" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" fill="none"/></svg>',
  tb:'<svg class="ico" viewBox="0 0 40 40" aria-hidden="true"><rect x="9" y="6" width="22" height="22" rx="2" transform="rotate(-12 20 17)" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M12 10l16 14M12 18l12 8M16 8l12 10" stroke="currentColor" stroke-width="1.2" opacity=".7"/><path d="M14 28l-3 9M27 28l3 9" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>',
  kb:'<svg class="ico" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M3 20h34M20 3c-7 6-7 28 0 34M20 3c7 6 7 28 0 34" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="8" cy="34" r="2.5" fill="currentColor"/><circle cx="20" cy="38" r="2.5" fill="currentColor"/><circle cx="32" cy="34" r="2.5" fill="currentColor"/></svg>',
  qz:'<svg class="ico" viewBox="0 0 40 40" aria-hidden="true"><path d="M6 8h28v20H18l-8 6v-6H6z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><path d="M16.5 14.5a3.5 3.5 0 1 1 5 3.2c-1 .5-1.5 1.2-1.5 2.3" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><circle cx="20" cy="24" r="1.5" fill="currentColor"/></svg>',
  tm:'<svg class="ico" viewBox="0 0 40 40" aria-hidden="true"><circle cx="12" cy="13" r="5" fill="none" stroke="currentColor" stroke-width="2.4"/><circle cx="28" cy="13" r="5" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M3 33c1-6 5-9 9-9s8 3 9 9M19 33c1-6 5-9 9-9s8 3 9 9" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><path d="M20 4v30" stroke="currentColor" stroke-width="2" stroke-dasharray="3 3"/></svg>',
  pp:'<svg class="ico" viewBox="0 0 40 40" aria-hidden="true"><path d="M5 30h30" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><rect x="8" y="18" width="5" height="12" rx="1" fill="none" stroke="currentColor" stroke-width="2.2"/><rect x="17.5" y="10" width="5" height="20" rx="1" fill="none" stroke="currentColor" stroke-width="2.2"/><rect x="27" y="14" width="5" height="16" rx="1" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M6 10l7-4 8 5 12-7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  br:'<svg class="ico" viewBox="0 0 40 40" aria-hidden="true"><path d="M4 7h8v8h6M4 23h8v-8M4 25h8v8h6M4 41M12 33v-8M18 11v18h6M24 20h12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/><path d="M30 14l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  fs:'<svg class="ico" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="22" r="13" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M20 15l6 4-2 7h-8l-2-7z" fill="currentColor"/><path d="M6 6h28" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
  nb:'<svg class="ico" viewBox="0 0 40 40" aria-hidden="true"><path d="M20 4v32" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="20" cy="8" rx="8" ry="2.5" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M12 8l3 9h10l3-9" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="30" cy="27" r="6" fill="none" stroke="currentColor" stroke-width="2.4"/></svg>',
  ff:'<svg class="ico" viewBox="0 0 40 40" aria-hidden="true"><ellipse cx="18" cy="20" rx="13" ry="8" transform="rotate(-30 18 20)" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M14 22l8-5M15 19l2 2M18 17l2 2M20 15l2 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M31 24v12M31 24l6 3-6 3" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/></svg>',
  bc:'<svg class="ico" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="26" r="4" fill="currentColor"/><circle cx="10" cy="20" r="6" fill="none" stroke="currentColor" stroke-width="2.4"/><circle cx="30" cy="16" r="6" fill="none" stroke="currentColor" stroke-width="2.4"/><circle cx="26" cy="31" r="5" fill="none" stroke="currentColor" stroke-width="2.2"/></svg>',
  hb:'<svg class="ico" viewBox="0 0 40 40" aria-hidden="true"><path d="M4 34V10h20v24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/><path d="M8 14h12M8 19h12M8 24h12M8 29h12M10 10v24M14 10v24M18 10v24" stroke="currentColor" stroke-width="1" opacity=".55"/><circle cx="30" cy="15" r="7" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M24.5 11.5c3 2 8 2 11 0M24 18c3.5-1.5 8.5-1.5 12 0M30 8v14" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>',
  dg:'<svg class="ico" viewBox="0 0 40 40" aria-hidden="true"><circle cx="24" cy="18" r="12" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M4 26h8M2 32h10M6 20h6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>'
};
const CARDS=[
  {k:"bb",col:"var(--c-bb)",name:"농구",rule:"3대3은 FIBA 3x3 규칙, 5대5는 쿼터제와 24초. 3~5팀이 돌아가며 붙는 로테이션 경기도 있어요.",
    subs:[["bb3","3대3","전원 득점 보너스 · 빙고"],["bb5","5대5","빙고 16칸 · 빙고 미션"],["bbrot","로테이션","3~5팀 누적 점수"]]},
  {k:"vb",col:"var(--c-vb)",open:"volley",name:"배구",rule:"랠리포인트 · 25점 3세트 · 듀스. 서브권과 세트 기록을 보여줍니다.",chips:["폭탄 랠리","빙고 배구"]},
  {k:"tt",col:"var(--c-tt)",open:"tt",name:"탁구",rule:"11점 · 2점 차 · 서브 2개씩 교대, 듀스에서는 1개씩. 누가 서브할 차례인지 자동으로 알려줘요.",chips:["서브 순서 자동"]},
  {k:"bd",col:"var(--c-bd)",open:"bd",name:"배드민턴",rule:"21점 랠리포인트 · 30점 상한. 서버 점수에 따라 오른쪽·왼쪽 서비스 코트를 표시합니다.",chips:["서비스 코트 표시"]},
  {k:"pb",col:"var(--c-pb)",open:"pb",name:"피클볼",rule:"11점 사이드아웃 스코어링 · 복식 1번/2번 서버. '4-2-1' 점수 콜을 크게 띄워요.",chips:["점수 콜","랠리 스코어링 선택"]},
  {k:"sc",col:"var(--c-sc)",open:"soccer",name:"축구",rule:"전·후반 경기 시간 · 득점자와 분 기록 · 경고/퇴장 카드 · 동점이면 승부차기.",chips:["득점자 기록","승부차기","빙고"]},
  {k:"fs",col:"var(--c-fs)",open:"futsal",name:"풋살",rule:"5대5 · 전·후반 20분(조절 가능). 득점자 기록, 하프마다 팀 반칙 누적(6번째부터 10m 프리킥 알림), 팀당 타임아웃 1번, 승부차기, 빙고 모드.",chips:["팀 반칙 누적","타임아웃","빙고"]},
  {k:"hb",col:"var(--c-hb)",open:"handball",name:"핸드볼",rule:"7명 · 전·후반(시간 조절). 득점자와 슛 성공률, 7m 던지기, 골키퍼 선방률. 경고→2분 퇴장→실격 단계 징계와 퇴장 선수별 2분 타이머, 타임아웃 규칙, 연장·7m 승부던지기, 빙고 모드.",chips:["2분 퇴장 타이머","7m 던지기","빙고"]},
  {k:"nb",col:"var(--c-nb)",open:"netball",name:"넷볼",rule:"7포지션(GS·GA·WA·C·WD·GD·GK) · 4쿼터. 골은 GS·GA만, 센터 패스는 골마다 자동 교대. 슈팅 성공률, 쿼터마다 포지션 돌리기, 빙고 모드.",chips:["포지션 지정","센터 패스 교대","슈팅 성공률"]},
  {k:"ff",col:"var(--c-ff)",open:"flag",name:"플래그 풋볼",rule:"터치다운 6점 · 추가 득점 1/2점 · 세이프티 2점. 4번의 다운 안에 하프라인을 넘고 다시 4번 안에 터치다운! 다운 표시와 공격권이 자동으로 넘어가요.",chips:["다운 표시","추가 득점","빙고"]},
  {k:"bc",col:"var(--c-bc)",open:"boccia",name:"보치아",rule:"빨강·파랑 공을 하얀 표적구에 가깝게! 표적구 차례, 다음에 던질 편(표적구에서 먼 편), 남은 공을 알려 주고 엔드별 점수와 승부 엔드까지 처리해요.",chips:["다음 투구 안내","엔드 점수","빙고"]},
  {k:"dg",col:"var(--c-dg)",open:"dodge",name:"피구",rule:"맞은 선수 이름을 눌러 아웃, 다시 눌러 부활. 내야 인원과 라운드 승수를 보여줍니다.",chips:["아웃·부활","왕 피구","빙고"]},
  {k:"bs",col:"var(--c-bs)",open:"base",name:"야구·티볼",rule:"이닝 점수판(R·H·E)과 볼카운트, 경기장 그림에서 수비 위치를 정하고 공을 처리한 수비수를 눌러 공격·수비 기록을 함께 남겨요.",chips:["야구·티볼 선택","수비 배치","타격·수비 기록","빙고"]},
  {k:"ut",col:"var(--c-ut)",open:"ult",name:"얼티밋",rule:"15점 · 득점할 때마다 받은 사람과 던져 준 사람(어시스트)을 함께 기록하고, 경기가 끝나면 서로의 스피릿 점수를 매겨요.",chips:["어시스트 기록","빙고 모드","스피릿 점수"]},
  {k:"rn",col:"var(--c-rn)",open:"run",name:"달리기",rule:"스톱워치를 켜 두고 학생이 출발선을 지날 때마다 이름을 누르면 누적 시간이 쌓여요. 거리를 정하면 1km 페이스와 완주 순위를 자동으로 계산합니다.",chips:["바퀴 기록","페이스 계산","12분 달리기"]},
  {k:"tb",col:"var(--c-tb)",open:"tchouk",name:"츄크볼",rule:"몸싸움과 가로막기가 없는 경기. 득점, 수비 캐치, 상대 반칙 점수를 기록하고 같은 프레임 연속 슛 3회와 피리어드 시간을 관리해요.",chips:["수비 캐치 기록","프레임 연속 슛","3피리어드","빙고"]},
  {k:"kb",col:"var(--c-kb)",open:"kin",name:"킨볼",rule:"3팀이 동시에 겨룹니다. 옴니킨 콜, 잡았다·놓쳤다 버튼, 반칙 사유별 기록, 9점 최하위 제외와 11점 피리어드 승리를 자동으로 처리해요.",chips:["3팀 동시","잡기·반칙 통계","빙고"]},
  {k:"qz",col:"var(--c-qz)",open:"quiz",name:"스포츠 상식 퀴즈",rule:"학급을 2~6팀으로 나눠 겨루는 스피드 퀴즈. 위에는 팀 점수판, 아래에는 4지선다 문제가 떠요. 규칙·역사·기술·가치·건강체력 "+K.QB.length+"문제에 내 문제"+(window.claude&&window.claude.use?"와 AI 문제":"")+"를 더할 수 있어요.",chips:["팀 대항 스피드",K.QB.length+"문제"+(window.claude&&window.claude.use?" + AI":""),"출제 기록"]},
];
const TOOLS=[
  {k:"tm",col:"var(--c-tm)",open:"teams",name:"팀 나누기",rule:"번호만 넣어도 바로 나눠요. 무작위 · 남녀 고르게 · 남녀 따로 · 실력 고르게 · 비슷한 실력끼리, 그리고 전화번호 끝자리 · 이름 비슷한 친구끼리 같은 재미있는 방법까지.",chips:["11가지 방법","결석 빼기","떨어뜨릴 짝"]},
  {k:"pp",col:"var(--c-pp)",open:"paps",name:"PAPS 측정",rule:"왕복오래달리기 신호음을 틀고 끝난 학생 이름만 누르면 횟수가 기록돼요. 9개 종목 기록, BMI 계산, 등급 자동 표시, 엑셀(CSV) 내보내기.",chips:["왕복오래달리기 신호음","반별 기록","CSV"]},
  {k:"br",col:"var(--c-br)",open:"bracket",name:"대진표",rule:"팀 이름만 넣으면 무작위로 편성해요. 리그전 · 토너먼트 · 패자부활전 · 크로스 토너먼트. 점수를 넣으면 다음 경기와 순위가 자동으로 정해져요.",chips:["4가지 방식","순위 자동","부전승 처리"]}
];
const ALIAS={bbrot:["bb5",{tab:"rot"}],bb5:["bb5",{tab:"game"}]};
let cur=null,curId=null;

function renderHome(){
  const last=K.load("pe-last");
  $("sports").innerHTML=CARDS.map(c=>{
    const isLast=c.subs?c.subs.some(s=>s[0]===last):c.open===last;
    const hd='<div class="hd">'+ICON[c.k]+'<h2>'+c.name+'</h2>'+(isLast?'<span class="last">최근</span>':'')+'</div><div class="rule">'+c.rule+'</div>';
    if(c.subs)return '<div class="sport" style="--sc:'+c.col+'">'+hd+'<div class="subs">'+c.subs.map(s=>'<button type="button" data-open="'+s[0]+'">'+s[1]+'<span>'+s[2]+'</span></button>').join("")+'</div></div>';
    return '<button type="button" class="sport" data-open="'+c.open+'" style="--sc:'+c.col+'">'+hd+'<div class="chips">'+c.chips.map(x=>'<span class="chip">'+x+'</span>').join("")+'</div></button>';
  }).join("");  $("tools").innerHTML=TOOLS.map(c=>'<button type="button" class="sport tool" data-open="'+c.open+'" style="--sc:'+c.col+'"><div class="hd">'+ICON[c.k]+'<h2>'+c.name+'</h2>'+(c.open===last?'<span class="last">최근</span>':'')+'</div><div class="rule">'+c.rule+'</div><div class="chips">'+c.chips.map(x=>'<span class="chip">'+x+'</span>').join("")+'</div></button>').join("");
}
function close(){
  if(cur&&cur.destroy){try{cur.destroy();}catch(e){}}
  cur=null;curId=null;K.wake(false);K.closeModal();K.fixClose();$("toast").hidden=true;
}
/* 종목마다 맨 위에 거는 문구 (교사가 바꿀 수 있음) */
const MOTTO={
  bb3:["작은 코트, 큰 팀워크","네 명 모두가 주인공이 되는 경기"],
  bb5:["혼자 빛나기보다 함께 빛나자","패스는 친구에게 건네는 믿음"],
  volley:["네가 받으면 내가 올린다","공을 떨어뜨리지 않는 마음이 팀을 만든다"],
  tt:["한 구 한 구에 담는 존중","이겨도 져도 먼저 고개 숙여 인사"],
  bd:["가볍게 날아도 마음은 진심으로","인사로 시작해 인사로 끝낸다"],
  pb:["점수를 소리 내어 부르는 정직함","함께 즐기는 사람이 진짜 승자"],
  soccer:["넘어진 친구에게 먼저 손을","공은 둥글고 우리는 하나"],
  dodge:["피하는 용기, 받아 주는 배려","외야에서도 끝까지 함께 뛴다"],
  kin:["모두가 손을 얹어야 칠 수 있다","함께여야만 가능한 경기"],
  base:["한 명의 안타보다 모두의 연결","실수한 친구에게 먼저 박수를"],
  ult:["스피릿 오브 더 게임","경쟁하되 공정하게"],
  run:["어제의 나보다 한 바퀴 더","끝까지 달린 모두가 승자"],
  tchouk:["몸싸움 없는 경기, 존중으로 겨룬다","상대를 막지 않고, 함께 빛나게 한다"],
  futsal:["작은 공간, 빠른 생각","모두가 공격수, 모두가 수비수"],
  handball:["몸을 던지는 용기, 손을 내미는 배려","일곱 명이 하나로 뛰는 경기"],
  netball:["내 자리에서 최선을, 우리 함께 골까지","패스 하나에 믿음 하나"],
  flag:["태클 대신 깃발, 힘 대신 작전","한 번의 다운, 모두의 약속"],
  boccia:["누구나 함께, 공 하나에 담는 집중","힘보다 정확함, 경쟁보다 존중"],
  quiz:["아는 만큼 보이고, 보이는 만큼 즐긴다","틀려도 괜찮아, 함께 배우는 시간"],
  teams:["누구와 함께여도 우리는 한 팀","새로운 친구와 만나는 시간"],
  paps:["어제의 나와 겨루는 시간","기록보다 소중한 건 꾸준함"],
  bracket:["이기는 법보다 함께 즐기는 법","모든 경기에는 배움이 있다"]
};
function mottoHtml(mid,m){
  const def=MOTTO[mid]||m.motto||["",""];const saved=K.load("pe-motto-"+mid);
  const v=Array.isArray(saved)&&saved[0]?saved:def;
  return '<div class="motto" data-mid="'+mid+'" style="--mc:'+m.color+'"><span class="mq" aria-hidden="true">“</span><div class="mt"><b data-motto="0">'+K.esc(v[0])+'</b><span data-motto="1">'+K.esc(v[1]||"")+'</span></div><span class="mq" aria-hidden="true">”</span>'+
    '<div class="medit op"><button class="small" type="button" data-medit="1">문구 바꾸기</button><button class="small" type="button" data-mreset="1" hidden>기본 문구로</button></div></div>';
}
document.getElementById("stage").addEventListener("click",e=>{
  const box=e.target.closest(".motto");if(!box)return;
  const mid=box.dataset.mid,ed=box.querySelector("[data-medit]"),rs=box.querySelector("[data-mreset]"),parts=box.querySelectorAll("[data-motto]");
  if(e.target.closest("[data-mreset]")){K.save("pe-motto-"+mid,null);const d=MOTTO[mid]||["",""];parts[0].textContent=d[0];parts[1].textContent=d[1];K.toast("기본 문구로 돌렸습니다","",1400);return;}
  if(!e.target.closest("[data-medit]"))return;
  const editing=parts[0].isContentEditable;
  if(!editing){parts.forEach(p=>{p.contentEditable="true";p.classList.add("editing");});parts[0].focus();ed.textContent="저장";rs.hidden=false;}
  else{parts.forEach(p=>{p.contentEditable="false";p.classList.remove("editing");});
    const v=[parts[0].textContent.trim(),parts[1].textContent.trim()];
    if(!v[0]){const d=MOTTO[mid]||["",""];parts[0].textContent=d[0];parts[1].textContent=d[1];K.save("pe-motto-"+mid,null);}
    else K.save("pe-motto-"+mid,v);
    ed.textContent="문구 바꾸기";rs.hidden=true;K.toast("문구를 저장했습니다","",1400);}
});
document.getElementById("stage").addEventListener("keydown",e=>{if(e.target.isContentEditable&&e.key==="Enter"){e.preventDefault();const b=e.target.closest(".motto").querySelector("[data-medit]");b.click();}},true);
function open(id,fromHash){
  let mid=id,opts={};
  if(ALIAS[id]){mid=ALIAS[id][0];opts=ALIAS[id][1];}
  const m=MODS[mid];if(!m){home();return;}
  close();
  const st=$("stage");
  document.documentElement.style.setProperty("--accent",m.color);
  st.innerHTML='<div class="mod">'+mottoHtml(mid,m)+m.html+'</div>';
  st.hidden=false;$("home").hidden=true;$("homeBtn").hidden=false;
  K.setBrand(m.name,m.sub);
  curId=id;
  try{cur=m.init({root:st.firstElementChild,store:storeRec},opts)||{};}catch(err){console.error(err);cur={};K.toast("점수판을 여는 중 문제가 생겼습니다. 새로고침 후 다시 시도해 주세요","bad",4000);}
  $("recBtn").hidden=!(cur&&cur.record);
  K.save("pe-last",id);
  if(!fromHash){try{if(location.hash!=="#"+id)location.hash=id;}catch(e){}}
  window.scrollTo(0,0);
}
/* ----- 기록 보관 ----- */
const SPORTCOL={handball:"var(--c-hb)",boccia:"var(--c-bc)",futsal:"var(--c-fs)",netball:"var(--c-nb)",flag:"var(--c-ff)",quiz:"var(--c-qz)",bracket:"var(--c-br)",bb3:"var(--c-bb)",bb5:"var(--c-bb)",bbrot:"var(--c-bb)",volley:"var(--c-vb)",tt:"var(--c-tt)",bd:"var(--c-bd)",pb:"var(--c-pb)",soccer:"var(--c-sc)",dodge:"var(--c-dg)",kin:"var(--c-kb)",base:"var(--c-bs)",ult:"var(--c-ut)",run:"var(--c-rn)",tchouk:"var(--c-tb)"};
async function storeRec(rec,silent){
  if(!rec)return;
  const old=K.rec.get(rec.id);if(old&&old.memo)rec.memo=old.memo;
  const where=await K.rec.put(rec);
  if(!silent)setTimeout(()=>K.toast("기록 보관함에 저장했습니다"+(where==="cloud"?" (내 계정)":" (이 기기)"),"bingo",2200),900);
}
$("recBtn").onclick=()=>{
  if(!cur||!cur.record)return;
  storeRec(cur.record(),true).then(()=>K.toast("지금까지의 기록을 보관함에 저장했습니다. 같은 경기는 다시 저장하면 덮어씁니다","bingo",2600));
};
const esc=K.esc;
function filtered(){const f=$("recFilter").value;return K.rec.list().filter(r=>!f||r.sportName===f);}
function renderArchive(){
  if($("home").hidden)return;
  const all=K.rec.list();
  $("recWhere").innerHTML=K.rec.where()==="cloud"?"<b>내 계정에 저장</b> · 다른 기기에서 이 점수판을 열어도 보이고, 다른 사람에게는 보이지 않습니다.":"이 기기 브라우저에만 저장됩니다. 브라우저 기록을 지우면 사라지니 CSV로 내려받아 두세요.";
  const sel=$("recFilter"),cv=sel.value,names=[...new Set(all.map(r=>r.sportName))];
  sel.innerHTML='<option value="">모든 종목 ('+all.length+')</option>'+names.map(n=>'<option value="'+esc(n)+'">'+esc(n)+' ('+all.filter(r=>r.sportName===n).length+')</option>').join("");
  sel.value=names.includes(cv)?cv:"";
  const list=filtered();
  ["recCopy","recCsv","recPCsv"].forEach(id=>$(id).disabled=!list.length);
  if(!list.length){$("recList").innerHTML='<div class="recempty">아직 저장된 경기가 없습니다. 경기가 끝나면 결과가 자동으로 여기에 저장되고, 경기 중에도 위쪽 <b>기록 저장</b> 버튼으로 지금까지의 기록을 남길 수 있어요.</div>';return;}
  $("recList").innerHTML=list.map(r=>{
    const vs=r.teams.length!==2?r.teams.map(t=>esc(t.name)+'<span class="n">'+t.score+'</span>').join(" · "):esc(r.teams[0].name)+'<span class="n">'+r.teams[0].score+'</span>:<span class="n">'+r.teams[1].score+'</span>'+esc(r.teams[1].name);
    const tag=r.done?(r.winner?'<span class="tag win">'+esc(r.winner)+(r.winner==="무승부"?"":" 승")+'</span>':""):'<span class="tag live">진행 중 저장</span>';
    const det=(r.details||[]).filter(Boolean);
    const pl=(r.players||[]).filter(p=>p.pts>0);
    const more=det.length||pl.length?'<details><summary>세부 기록 · '+esc(r.summary||"")+'</summary><ul>'+det.map(x=>"<li>"+esc(x)+"</li>").join("")+(pl.length?"<li>득점: "+esc(pl.map(p=>p.name+" "+p.pts).join(", "))+"</li>":"")+'</ul></details>':"";
    return '<div class="rec" style="--sc:'+(SPORTCOL[r.sport]||"var(--amber)")+'"><span class="dt">'+K.fmtDate(r.at)+'</span><span class="sp">'+esc(r.sportName)+'</span>'+
      '<div class="mt"><div class="vs">'+vs+tag+'</div><input class="memo" data-memo="'+esc(r.id)+'" value="'+esc(r.memo||"")+'" placeholder="메모 (예: 2학년 3반 리그 1차전)" aria-label="메모"></div>'+
      '<div class="rbt"><button class="small danger" type="button" data-del="'+esc(r.id)+'">삭제</button></div>'+more+'</div>';
  }).join("");
}
K.rec.onChange(()=>{
  // 메모를 입력하는 중에는 목록을 다시 그리지 않는다
  if(document.activeElement&&document.activeElement.classList.contains("memo"))return;
  renderArchive();
});
$("recFilter").onchange=renderArchive;
$("recList").addEventListener("change",e=>{
  const el=e.target;if(!el.dataset.memo)return;
  const r=K.rec.get(el.dataset.memo);if(!r)return;
  K.rec.put(Object.assign({},r,{memo:el.value.trim()})).then(()=>K.toast("메모를 저장했습니다","",1200));
});
$("recList").addEventListener("click",e=>{
  const b=e.target.closest("[data-del]");if(!b)return;
  if(b.classList.contains("arm")){K.rec.del(b.dataset.del);K.toast("기록을 삭제했습니다","",1400);}
  else{b.classList.add("arm");b.textContent="한 번 더 누르면 삭제";setTimeout(()=>{if(b.isConnected){b.classList.remove("arm");b.textContent="삭제";}},3000);}
});
const csvCell=v=>{v=v==null?"":String(v);return /[",\n\t]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v;};
function rows(){
  const head=["날짜","종목","메모","상태","팀1","점수1","팀2","점수2","승자","결과","세부 기록"];
  const body=filtered().slice().reverse().map(r=>{
    const t=r.teams,two=t.length===2;
    return [K.fmtDate(r.at),r.sportName,r.memo||"",r.done?"종료":"진행 중",two?t[0].name:t.map(x=>x.name).join(" / "),two?t[0].score:"",two&&t[1]?t[1].name:"",two&&t[1]?t[1].score:"",r.winner||"",r.summary||"",(r.details||[]).join(" | ")];
  });
  return [head].concat(body);
}
function prows(){
  const head=["날짜","종목","메모","팀","선수","득점","비고"],body=[];
  filtered().slice().reverse().forEach(r=>(r.players||[]).forEach(p=>body.push([K.fmtDate(r.at),r.sportName,r.memo||"",p.team,p.name,p.pts,p.note||""])));
  return [head].concat(body);
}
const toCsv=rs=>"﻿"+rs.map(r=>r.map(csvCell).join(",")).join("\r\n");
const stamp=()=>{const d=new Date(),p=n=>String(n).padStart(2,"0");return d.getFullYear()+p(d.getMonth()+1)+p(d.getDate());};
async function saveCsv(kind){
  const rs=kind==="p"?prows():rows();
  if(rs.length<2){K.toast(kind==="p"?"선수별 득점이 기록된 경기가 없습니다":"내려받을 기록이 없습니다","",2000);return;}
  const res=await K.download((kind==="p"?"선수별기록_":"경기기록_")+stamp()+".csv",toCsv(rs));
  if(res==="saved")K.toast("CSV 파일을 저장했습니다","bingo",1800);
  else if(res==="none"){
    const ok=await K.copyText(rs.map(r=>r.map(c=>String(c).replace(/\t|\n/g," ")).join("\t")).join("\n"));
    K.toast(ok?"이 화면에서는 파일 저장이 안 돼서 표를 복사했습니다. 엑셀이나 한셀에 붙여넣으세요":"이 화면에서는 파일 저장과 복사를 쓸 수 없습니다","",3600);
  }
}
$("recCsv").onclick=()=>saveCsv("g");
$("recPCsv").onclick=()=>saveCsv("p");
$("recCopy").onclick=()=>{
  const rs=rows();
  K.copyText(rs.map(r=>r.map(c=>String(c).replace(/\t|\n/g," ")).join("\t")).join("\n")).then(ok=>K.toast(ok?"표를 복사했습니다. 엑셀, 한셀, 구글 시트에 붙여넣으세요":"복사할 수 없는 화면입니다. CSV 내려받기를 써 주세요",ok?"bingo":"bad",2600));
};

function home(){
  close();
  $("recBtn").hidden=true;
  $("stage").innerHTML="";$("stage").hidden=true;$("home").hidden=false;$("homeBtn").hidden=true;
  document.documentElement.style.setProperty("--accent","var(--amber)");
  K.setBrand("태성쌤의 체육수업 점수판","종목을 고르면 그 종목 점수판이 열립니다");
  renderHome();renderArchive();
  try{if(location.hash)history.replaceState(null,"",location.pathname+location.search);}catch(e){}
}

$("sports").addEventListener("click",e=>{const b=e.target.closest("[data-open]");if(b)open(b.dataset.open);});
$("tools").addEventListener("click",e=>{const b=e.target.closest("[data-open]");if(b)open(b.dataset.open);});
$("homeBtn").onclick=home;
window.addEventListener("hashchange",()=>{const id=location.hash.slice(1);if(id&&id!==curId&&(MODS[id]||ALIAS[id]))open(id,true);else if(!id&&curId)home();});
$("sndBtn").onclick=()=>{K.unlock();K.snd.chime();setTimeout(K.snd.buzzer,500);setTimeout(K.snd.horn,1600);$("sndBtn").textContent="소리 테스트";};
function setView(on){document.body.classList.toggle("view",on);$("exitView").hidden=!on;$("viewBtn").textContent=on?"운영 모드":"관람 모드";}
$("viewBtn").onclick=()=>setView(!document.body.classList.contains("view"));
$("exitView").onclick=()=>setView(false);
$("fsBtn").onclick=()=>{try{if(document.fullscreenElement)document.exitFullscreen();else document.documentElement.requestFullscreen().catch(()=>K.toast("이 화면에서는 전체화면을 쓸 수 없습니다"));}catch(e){K.toast("이 화면에서는 전체화면을 쓸 수 없습니다");}};
document.addEventListener("keydown",e=>{
  const tag=e.target.tagName;if(tag==="INPUT"||tag==="TEXTAREA"||tag==="SELECT"||e.target.isContentEditable)return;
  if(e.key==="Escape"){setView(false);return;}
  if(!$("modal").hidden||!$("fbModal").hidden||!$("bkModal").hidden)return;
  if(cur&&cur.key)cur.key(e);
});
let last=performance.now();
function loop(now){const dt=now-last;last=now;if(cur&&cur.tick){try{cur.tick(dt,now);}catch(err){console.error(err);}}requestAnimationFrame(loop);}

/* ---- 제작자에게 의견 보내기 (카카오톡) ---- */
// 받는 곳: 카카오톡 ID. 오픈채팅 1:1 링크가 생기면 KAKAO_LINK에 넣으면 대화방이 바로 열립니다.
const KAKAO_ID="k0279w";
const KAKAO_LINK="";
let fbKind="아이디어";
function fbOpen(){
  const sel=$("fbSport");
  const names=[["","전체 / 종목과 상관없음"]].concat(Object.keys(MODS).map(k=>[k,MODS[k].name]));
  sel.innerHTML=names.map(([k,n])=>"<option value=\""+k+"\">"+K.esc(n)+"</option>").join("");
  sel.value=curId&&MODS[curId]?curId:"";
  $("fbDone").hidden=true;
  let d="";try{d=localStorage.getItem("pe-fb-draft")||"";}catch(e){}
  if(!$("fbText").value)$("fbText").value=d;
  try{$("fbFrom").value=$("fbFrom").value||localStorage.getItem("pe-fb-from")||"";}catch(e){}
  fbDraw();$("fbModal").hidden=false;setTimeout(()=>$("fbText").focus(),50);
}
function fbDraw(){
  $("fbKind").querySelectorAll("[data-fbk]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.fbk===fbKind)));
  $("fbErrHelp").hidden=fbKind!=="오류";
  $("fbText").placeholder=fbKind==="오류"?"예) 피구에서 되돌리기를 누르면 외야 숫자가 안 바뀌어요. (휴대폰 크롬)":fbKind==="아이디어"?"예) 배구 빙고에 5x5 판도 있으면 좋겠어요.":"자유롭게 적어 주세요.";
}
function fbClose(){$("fbModal").hidden=true;}
function fbMessage(){
  const sp=$("fbSport").value,txt=$("fbText").value.trim(),from=$("fbFrom").value.trim();
  const d=new Date(),pad=n=>String(n).padStart(2,"0");
  const ua=navigator.userAgent,dev=/iPhone|iPad/.test(ua)?"아이폰/아이패드":/Android/.test(ua)?"안드로이드":/Mac/.test(ua)?"맥":/Windows/.test(ua)?"윈도우":"기타";
  return "[태성쌤의 체육수업 점수판 의견] "+(fbKind==="아이디어"?"💡 아이디어":fbKind==="오류"?"🐞 오류":"💬 기타")+"\n"+
    "종목: "+(sp?MODS[sp].name:"전체")+"\n"+
    "내용: "+txt+"\n"+
    (from?"보낸 사람: "+from+"\n":"")+
    "("+d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())+" "+pad(d.getHours())+":"+pad(d.getMinutes())+" · "+dev+" · "+window.innerWidth+"px)";
}
function fallbackCopy(el){try{el.focus();el.select();return document.execCommand("copy");}catch(e){return false;}}
$("fbBtn").onclick=fbOpen;
$("fbClose").onclick=fbClose;
$("fbModal").addEventListener("click",e=>{if(e.target===$("fbModal"))fbClose();const b=e.target.closest("[data-fbk]");if(b){fbKind=b.dataset.fbk;fbDraw();}});
$("fbModal").addEventListener("keydown",e=>{if(e.key==="Escape")fbClose();});
$("fbText").addEventListener("input",e=>{try{localStorage.setItem("pe-fb-draft",e.target.value);}catch(err){}});
const INSTA_ID="taesung23";
R_fb();
function R_fb(){
  $("fbModal").addEventListener("click",async e=>{
    const b=e.target.closest("[data-fbch]");if(b){fbSend(b.dataset.fbch);return;}
    const c=e.target.closest("[data-fbcopy]");if(c){const v=c.dataset.fbcopy;const ok=await K.copyText(v);K.toast(ok?v+" 복사됨":v,"",1800);}
  });
}
async function fbSend(ch){
  if($("fbText").value.trim().length<2){K.toast("내용을 적어 주세요","bad",1600);$("fbText").focus();return;}
  try{localStorage.setItem("pe-fb-from",$("fbFrom").value.trim());}catch(e){}
  const msg=fbMessage(),out=$("fbOut");out.value=msg;$("fbDone").hidden=false;
  let ok=await K.copyText(msg);if(!ok)ok=fallbackCopy(out);
  const link=ch==="insta"?"https://ig.me/m/"+INSTA_ID:KAKAO_LINK;
  const s1="<div class=\"fbstep\"><b>1</b><span>"+(ok?"메시지를 <b>복사</b>했어요.":"자동 복사가 안 됐어요. 아래 글을 길게 눌러 복사해 주세요.")+"</span></div>";
  let s2;
  if(ch==="insta")s2="<div class=\"fbstep\"><b>2</b><span>인스타그램 <span class=\"kid\">@"+INSTA_ID+"</span> DM 창이 열려요. 안 열리면 <a href=\""+link+"\" target=\"_blank\" rel=\"noopener\">여기</a>를 누르거나 인스타그램에서 @"+INSTA_ID+"을 검색해 메시지를 누르세요. <button type=\"button\" class=\"small\" data-fbcopy=\""+INSTA_ID+"\">ID 복사</button></span></div>";
  else if(KAKAO_LINK)s2="<div class=\"fbstep\"><b>2</b><span>열린 카카오톡 대화방에 들어가세요. 안 열리면 <a href=\""+link+"\" target=\"_blank\" rel=\"noopener\">여기</a>를 누르세요.</span></div>";
  else s2="<div class=\"fbstep\"><b>2</b><span>카카오톡에서 <b>친구 추가 → ID로 추가</b>에 <span class=\"kid\">"+KAKAO_ID+"</span> 를 검색해 추가하세요. <button type=\"button\" class=\"small\" data-fbcopy=\""+KAKAO_ID+"\">ID 복사</button></span></div>";
  const s3="<div class=\"fbstep\"><b>3</b><span>대화창에 <b>붙여넣기</b> 해서 보내 주세요.</span></div>";
  $("fbSteps").innerHTML=s1+s2+s3;
  if(link){try{window.open(link,"_blank","noopener");}catch(e){}}
  try{localStorage.removeItem("pe-fb-draft");}catch(e){}
  $("fbDone").scrollIntoView({block:"nearest",behavior:"smooth"});
  K.toast("메시지를 준비했어요 · "+(ch==="insta"?"인스타그램 DM":"카카오톡")+"에 붙여넣어 보내 주세요","bingo",2600);
}

K.go=id=>open(id);
$("fxToggle").checked=K.fx.on();
$("fxToggle").onchange=e=>{K.fx.set(e.target.checked);K.toast(e.target.checked?"득점 효과를 켰어요":"득점 효과를 껐어요","",1400);};
/* ----- 백업 ----- */
const BK_SKIP=new Set(["pe-records","pe-fb-draft","pe-fixhint","pe-bk-msg"]);
function bkCollect(){
  const data={};
  try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith("pe-")&&!BK_SKIP.has(k))data[k]=localStorage.getItem(k);}}catch(e){}
  return{app:"pe-scoreboard",v:1,at:Date.now(),data,records:K.rec.list()};
}
const bkStamp=()=>{const d=new Date(),p=n=>String(n).padStart(2,"0");return d.getFullYear()+p(d.getMonth()+1)+p(d.getDate())+"_"+p(d.getHours())+p(d.getMinutes());};
let bkPending=null;
function bkShow(mode){$("bkIn").hidden=mode!=="in";$("bkOut").hidden=mode!=="out";$("bkMTitle").textContent=mode==="in"?"백업 불러오기":"백업 저장";$("bkModal").hidden=false;}
function bkClose(){$("bkModal").hidden=true;bkPending=null;$("bkFile").value="";$("bkText").value="";$("bkInfo").textContent="";$("bkApply").disabled=true;}
function bkParse(text){
  let o=null;try{o=JSON.parse(text);}catch(e){}
  if(!o||o.app!=="pe-scoreboard"||!o.data||typeof o.data!=="object"){bkPending=null;$("bkApply").disabled=true;$("bkInfo").style.color="var(--alert)";$("bkInfo").textContent=text.trim()?"점수판 백업 내용이 아니에요. 파일을 다시 확인해 주세요.":"";return;}
  bkPending=o;$("bkApply").disabled=false;$("bkInfo").style.color="var(--ok)";
  $("bkInfo").textContent=K.fmtDate(o.at)+"에 만든 백업 · 저장 항목 "+Object.keys(o.data).length+"개 · 경기 기록 "+(o.records||[]).length+"개";
}
$("bkSave").onclick=async()=>{
  const text=JSON.stringify(bkCollect());
  const res=await K.download("체육점수판_백업_"+bkStamp()+".json",text,"application/json");
  if(res==="saved")K.toast("백업 파일을 저장했어요. 잘 보관해 두세요","",2400);
  else if(res==="declined")K.toast("저장을 취소했어요","",1600);
  else{$("bkOutText").value=text;bkShow("out");}
};
$("bkLoad").onclick=()=>bkShow("in");
$("bkClose").onclick=bkClose;
$("bkModal").addEventListener("click",e=>{if(e.target===$("bkModal"))bkClose();});
$("bkModal").addEventListener("keydown",e=>{if(e.key==="Escape")bkClose();});
$("bkFile").addEventListener("change",e=>{const f=e.target.files&&e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{$("bkText").value="";bkParse(String(r.result||""));};r.readAsText(f);});
$("bkText").addEventListener("input",e=>bkParse(e.target.value));
$("bkCopy").onclick=async()=>{let ok=await K.copyText($("bkOutText").value);if(!ok)ok=fallbackCopy($("bkOutText"));K.toast(ok?"백업 내용을 복사했어요":"길게 눌러 전체 선택 후 복사해 주세요","",2200);};
$("bkApply").onclick=async()=>{
  const o=bkPending;if(!o)return;$("bkApply").disabled=true;
  try{
    const keep=new Set(["pe-fb-draft","pe-fb-from"]);const del=[];
    for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith("pe-")&&!BK_SKIP.has(k)&&!keep.has(k)&&!(k in o.data))del.push(k);}
    del.forEach(k=>localStorage.removeItem(k));
    Object.entries(o.data).forEach(([k,v])=>{if(k.startsWith("pe-")&&typeof v==="string")localStorage.setItem(k,v);});
  }catch(e){K.toast("이 기기에 저장할 수 없어요","bad",2400);$("bkApply").disabled=false;return;}
  const have=new Set(K.rec.list().map(r=>r.id));let n=0;
  for(const r of (o.records||[])){if(r&&r.id&&!have.has(r.id)){try{await K.rec.put(r);n++;}catch(e){}}}
  try{localStorage.setItem("pe-bk-msg","백업을 불러왔어요"+(n?" · 경기 기록 "+n+"개 추가":""));}catch(e){}
  location.reload();
};
try{const m=localStorage.getItem("pe-bk-msg");if(m){localStorage.removeItem("pe-bk-msg");setTimeout(()=>K.toast(m,"bingo",2800),400);}}catch(e){}
K.rec.init();
const start=location.hash.slice(1);
if(start&&(MODS[start]||ALIAS[start]))open(start,true);else home();
requestAnimationFrame(loop);
})();
