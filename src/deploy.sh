#!/usr/bin/env bash
# 빌드 후 저장소 루트(깃허브 페이지)에 올릴 파일을 복사한다. 사용: (src 폴더에서) bash deploy.sh
set -e
cd "$(dirname "$0")"
python3 build.py
node --check all.js
python3 make_file.py
python3 make_web.py
cp -r web/. ..
cp 체육점수판.html ..
echo "루트에 복사 완료 → git add -A && git commit && git push"
