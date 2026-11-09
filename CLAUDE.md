# 태성쌤의 체육수업 점수판 — 작업 안내

- 사용자: 체육교사 이태성(마스터님). 답은 한국어로, "마스터님"으로 부른다.
- 공개 주소(GitHub Pages, main 브랜치 루트): https://master23wind-commits.github.io/pe-board/
- Claude 아티팩트 판(같은 앱): https://claude.ai/artifact/1VNg1W4QA2byYZppAbBnRH — capabilities {db, downloads, user, sample}. 수정할 때 이 링크도 함께 다시 게시한다(Artifact read 후 publish).

## 구조
- `src/` 원본. 모듈 패턴 `MODS.x={name,sub,color,html,init(ctx)}` → `{record,tick,key,destroy}`.
  - core.js(K 도구: save/load, timeCtl/bindTime, fixKit 숫자 고치기), records.js(기록 보관함·다운로드), classes.js(학급 명단), bingo.js, fx.js(득점 효과)
  - mod_*.js 종목·도구, quiz_bank.js, main.js(첫 화면·백업·의견 보내기), shell.html(CSS·마크업)
- 루트: 배포 결과물(index.html, manifest.webmanifest, sw.js, 아이콘, 체육점수판.html). 직접 고치지 말고 src에서 빌드.

## 빌드·배포
1. `cd src && bash deploy.sh` (build.py → make_file.py → make_web.py → 루트로 복사)
2. 저장소 루트에서 `git add -A && git commit && git push`
3. Claude 아티팩트도 `src/pe-scoreboard.html`로 다시 게시, 필요하면 `체육점수판.html` 파일 전달
4. Playwright로 http://test/#모듈 형태로 열어 확인(route로 HTML 주입)

## 주의
- 기록은 각 기기 localStorage. 외부 사용자는 Claude db에 쓸 수 없음 → 첫 화면 '백업 저장/불러오기'로 옮김.
- 변경 내역은 Claude 프로젝트 문서 `claude/업데이트-기록.md`에 최신이 위로.

## 영어 모드 (2026-11-09)
- 언어: localStorage `pe-lang`("ko"|"en"), 없으면 브라우저 언어(한국어가 아니면 영어). 위쪽 `#langBtn`으로 전환(새로고침).
- `src/i18n_boot.js`(core 다음): K.LANG, 영어 예시 명단. `src/i18n.js`(맨 끝): 화면 번역층(MutationObserver). 모듈 코드는 한국어 그대로.
- 사전: `src/i18n_src/*.tsv`(한국어\t영어) → `gen_dict.py` → `src/i18n_en.js` (deploy.sh가 자동 실행).
- 새 한국어 문구를 추가하면 같은 뜻의 영어를 tsv에 넣는다. `node i18n_src/extract.js`(acorn 필요)로 조각을 뽑아 빠진 것 확인.
- 번역 순서: 정확히 일치 → 문장 틀(PRE_RULES) → 긴 조각(4자+) → 숫자+단위(NUM) → 짧은 조각 → 한 글자.
- 아직 한국어(2단계): 퀴즈 문제(translate="no"), 작전판 카드 내용, 득점 한마디. 학생 이름·입력칸 글은 번역하지 않음.
