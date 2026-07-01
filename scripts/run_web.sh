#!/usr/bin/env bash
#
# run_web.sh - start the React + Vite dev server.
#
# When running inside GitHub Codespaces the browser is on the student's own
# machine, so "ws://localhost:9090" cannot reach rosbridge. Codespaces exposes
# port 9090 at a public HTTPS URL instead, so we point the app there.

set -e

# Resolve the repo root from this script's location.
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "${REPO_ROOT}/web_gui"

# Detect Codespaces. GitHub sets CODESPACES=true and provides the codespace
# name + the port-forwarding domain used to build forwarded URLs.
if [ "${CODESPACES}" = "true" ] && [ -n "${CODESPACE_NAME}" ]; then
  # The forwarded 9090 port is served over TLS, so roslibjs must use wss://
  # (the secure WebSocket scheme) against the same host that Codespaces would
  # serve at https://${CODESPACE_NAME}-9090.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}
  export VITE_ROSBRIDGE_URL="wss://${CODESPACE_NAME}-9090.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}"
  echo "==> Codespaces detected. VITE_ROSBRIDGE_URL=${VITE_ROSBRIDGE_URL}"
else
  echo "==> Not in Codespaces. Using default rosbridge URL (ws://localhost:9090)."
fi

echo "==> Starting Vite dev server on 0.0.0.0:5173"
npm run dev -- --host 0.0.0.0
