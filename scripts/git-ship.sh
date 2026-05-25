#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "사용법: npm run ship -- \"커밋 메시지\""
  exit 1
fi

MSG="$*"

git add -A

if git diff --staged --quiet; then
  echo "커밋할 변경 사항이 없습니다."
  exit 0
fi

git commit -m "$MSG"
git push origin main

echo "완료: origin main 에 푸시했습니다."
