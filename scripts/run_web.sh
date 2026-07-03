#!/usr/bin/env bash
#
# run_web.sh - start the React + Vite dev server.
#
# When running inside GitHub Codespaces the browser is on the student's own
# machine and can only reach forwarded ports over an authenticated HTTPS
# origin. Rather than exposing rosbridge on a second public port, we let the
# GUI open its WebSocket to THIS same origin at "/rosbridge"; the Vite dev
# server proxies that to rosbridge (see web_gui/vite.config.js). This means
# only port 5173 needs to be forwarded and nothing has to be made "Public".

set -e

# Resolve the repo root from this script's location.
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "${REPO_ROOT}/web_gui"

# Detect Codespaces. GitHub sets CODESPACES=true.
if [ "${CODESPACES}" = "true" ]; then
  # Clear any inherited value so App.jsx falls back to the same-origin
  # "/rosbridge" WebSocket, which Vite proxies to ws://localhost:9090 inside
  # this container. No public port, no manual visibility change required.
  unset VITE_ROSBRIDGE_URL
  echo "==> Codespaces detected. GUI will reach rosbridge via the /rosbridge proxy on port 5173."
else
  echo "==> Not in Codespaces. Using default rosbridge URL (ws://localhost:9090)."
fi

echo "==> Starting Vite dev server on 0.0.0.0:5173"
npm run dev -- --host 0.0.0.0
