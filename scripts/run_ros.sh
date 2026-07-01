#!/usr/bin/env bash
#
# run_ros.sh - build the ROS 2 workspace and start rosbridge + the listener.
#
# Works both inside a Codespace / Dev Container and any machine with ROS 2
# Humble installed. Mirrors what docker-compose.yml does for the local flow.

set -e

# Resolve the repo root from this script's location.
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "==> Sourcing ROS 2 Humble"
source /opt/ros/humble/setup.bash

echo "==> Building ros2_ws (colcon --symlink-install)"
cd "${REPO_ROOT}/ros2_ws"
colcon build --symlink-install

echo "==> Sourcing the freshly built workspace"
source install/setup.bash

echo "==> Starting rosbridge websocket server (background, port 9090)"
ros2 launch rosbridge_server rosbridge_websocket_launch.xml &

# Give rosbridge a moment to come up before starting the node.
sleep 5

echo "==> Starting button_listener (foreground)"
ros2 run button_listener_pkg button_listener
