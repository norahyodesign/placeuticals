#!/usr/bin/env bash
#
# 미리보기 배포 — 새 React 사이트를 GitHub Pages의 하위 경로에 올린다.
#   https://norahyodesign.github.io/placeuticals/preview/
#
# 저장소 루트의 기존 운영 사이트(index.html 등)는 건드리지 않는다. 아임웹이 그 루트를
# iframe으로 감싸고 있어서, 루트를 덮으면 실제 방문자에게 바로 반영되기 때문이다.
#
# 사용법: web/ 안에서  ./scripts/deploy-preview.sh
set -euo pipefail

BASE="/placeuticals/preview/"
WEB_DIR="$(cd "$(dirname "$0")/.." && pwd)"
REPO_DIR="$(cd "$WEB_DIR/.." && pwd)"
OUT_DIR="$REPO_DIR/preview"

cd "$WEB_DIR"

echo "==> 빌드 (base=$BASE, 해시 라우팅)"
# 해시 라우팅 이유는 web/src/routes.tsx 주석 참고 (Pages는 사이트 루트 404.html만 쓴다)
SITE_BASE="$BASE" VITE_ROUTER=hash npm run build:site

# Shutterstock 워터마크 미리보기 — 사이트에서 쓰지 않는데 public/에 남아 있어 빌드에 딸려 온다.
# 공개 주소로 나가면 안 되므로 배포본에서만 제외한다 (원본은 public/img에 그대로 둔다).
rm -f dist-site/img/main1.jpg dist-site/img/main2.jpg

echo "==> $OUT_DIR 에 반영"
rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"
cp -R dist-site/. "$OUT_DIR/"

echo "==> 완료. 커밋 후 push 하면 1~2분 뒤 반영된다:"
echo "    git add preview && git commit -m 'chore: 미리보기 배포' && git push"
