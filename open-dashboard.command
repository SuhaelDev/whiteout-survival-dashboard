#!/bin/zsh
set -e

cd "$(dirname "$0")"

PORT=5173
URL="http://127.0.0.1:${PORT}/"

if ! lsof -iTCP:${PORT} -sTCP:LISTEN >/dev/null 2>&1; then
  mkdir -p .server
  nohup python3 scripts/ai_advisor_server.py --port "${PORT}" > .server/http-server.log 2>&1 &
  sleep 1
fi

open "${URL}"
