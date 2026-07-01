#!/usr/bin/env bash
#
# post-create.sh - runs once when the Codespace / Dev Container is created
# (wired up via "postCreateCommand" in devcontainer.json).
#
# It gets the workspace ready with zero manual steps:
#   1. source ROS 2 Humble
#   2. build ros2_ws with colcon
#   3. install the web_gui npm dependencies
#
# It is idempotent and safe to rerun: colcon and npm install both simply
# no-op / update when nothing has changed.

set -e

# Resolve the repo root from this script's location so it works no matter where
# it is invoked from.
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "==> [post-create] Ensuring helper scripts are executable"
chmod +x "${REPO_ROOT}/scripts/run_ros.sh" "${REPO_ROOT}/scripts/run_web.sh" "${REPO_ROOT}/.devcontainer/post-create.sh" 2>/dev/null || true

echo "==> [post-create] Sourcing ROS 2 Humble"
source /opt/ros/humble/setup.bash

echo "==> [post-create] Building ros2_ws with colcon"
cd "${REPO_ROOT}/ros2_ws"
colcon build --symlink-install

echo "==> [post-create] Installing web_gui npm dependencies"
cd "${REPO_ROOT}/web_gui"
npm install

echo "==> [post-create] Done. Use the 'Run ROS' and 'Run React' tasks to start."
