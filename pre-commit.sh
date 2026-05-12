#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
#  플라슈티컬즈 pre-commit hook
#  git commit 전 자동 실행 — 실패 시 커밋 중단
# ─────────────────────────────────────────────────────────
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel)"
HTML_FILES=()
while IFS= read -r f; do HTML_FILES+=("$(basename "$f")"); done < <(find "$ROOT" -maxdepth 1 -name "*.html" | sort)
PASS=true

echo ""
echo "🔍 Pre-commit 검사 시작..."
echo "─────────────────────────────────"

# ── 1. HTML 유효성 검사 ──────────────────────────────────
echo "① HTML 유효성 (html-validate)"
cd "$ROOT"
if ! command -v npx &>/dev/null; then
  echo "   ⚠️  npx 미설치 — HTML 유효성 검사 건너뜀 (Node.js 설치 필요)"
elif npx --no html-validate "${HTML_FILES[@]}" 2>&1; then
  echo "   ✅ HTML 유효성 통과"
else
  echo "   ❌ HTML 유효성 오류 — 커밋 중단"
  PASS=false
fi

# ── 2. 깨진 내부 링크 href="#" (푸터 제외) ──────────────
echo ""
echo "② 깨진 내부 링크 확인 (nav/button href='#')"
BROKEN=$(grep -rn 'href="#"' "$ROOT"/*.html \
  | grep -v '개인정보처리방침\|이용약관\|\.claude' || true)
if [ -n "$BROKEN" ]; then
  echo "   ⚠️  미연결 링크 발견:"
  echo "$BROKEN" | sed 's/^/      /'
  # 경고만 (커밋 중단 안 함 — 푸터 링크는 의도적)
fi
echo "   ✅ 링크 확인 완료"

# ── 3. 플레이스홀더 실제 데이터 미입력 경고 ─────────────
echo ""
echo "③ 플레이스홀더 잔재 확인"
PLACEHOLDERS=$(grep -rn '홍길동\|02-000-0000\|월드컵북로 000\|031-000-0000\|0212345678' \
  "$ROOT"/*.html 2>/dev/null | grep -v '\.claude' || true)
if [ -n "$PLACEHOLDERS" ]; then
  echo "   ⚠️  미입력 플레이스홀더:"
  echo "$PLACEHOLDERS" | sed 's/^/      /'
  echo "   (실제 정보 입력 전까지 경고만 표시)"
fi
echo "   ✅ 플레이스홀더 확인 완료"

# ── 4. target="_blank" rel 누락 ──────────────────────────
echo ""
echo "④ target=_blank 보안 (noopener noreferrer)"
UNSAFE=$(grep -rn 'target="_blank"' "$ROOT"/*.html \
  | grep -v 'noopener noreferrer\|\.claude' || true)
if [ -n "$UNSAFE" ]; then
  echo "   ❌ rel='noopener noreferrer' 누락:"
  echo "$UNSAFE" | sed 's/^/      /'
  PASS=false
else
  echo "   ✅ 보안 링크 통과"
fi

# ── 5. console.log 잔재 ──────────────────────────────────
echo ""
echo "⑤ console.log 잔재"
CONSOLE=$(grep -rn 'console\.log' "$ROOT"/*.html 2>/dev/null | grep -v '\.claude' || true)
if [ -n "$CONSOLE" ]; then
  echo "   ❌ console.log 발견 (제거 필요):"
  echo "$CONSOLE" | sed 's/^/      /'
  PASS=false
else
  echo "   ✅ console.log 없음"
fi

# ── 결과 ─────────────────────────────────────────────────
echo ""
echo "─────────────────────────────────"
if [ "$PASS" = true ]; then
  echo "✅ 모든 검사 통과 — 커밋 진행"
  echo ""
  exit 0
else
  echo "❌ 검사 실패 — 커밋 중단됨"
  echo "   위 오류를 수정 후 다시 커밋하세요."
  echo ""
  exit 1
fi
