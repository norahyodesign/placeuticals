#!/bin/bash
cd "$(dirname "$0")"

PORT=8081

# 포트가 사용 중이면 해당 프로세스를 kill
EXISTING_PID=$(lsof -ti tcp:$PORT)
if [ -n "$EXISTING_PID" ]; then
  echo "포트 $PORT 사용 중 (PID $EXISTING_PID) → 종료 후 재시작"
  kill -9 $EXISTING_PID
  sleep 0.5
fi

echo ""
echo "🌐 로컬 테스트  → http://localhost:$PORT/index.html"
echo "📡 CDN  테스트  → http://localhost:$PORT/test-cdn.html"
echo ""
open "http://localhost:$PORT/index.html"
python3 -m http.server $PORT
