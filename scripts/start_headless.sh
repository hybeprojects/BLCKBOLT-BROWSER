#!/usr/bin/env bash
set -euo pipefail

# Helper to run BLCKBOLT Browser headless inside Xvfb + dbus-run-session
# Usage:
#   scripts/start_headless.sh [build-and-start|build|start]
# Default: build-and-start

MODE=${1:-build-and-start}

XVFB_ARGS=(--auto-servernum --server-args="-screen 0 1280x720x24 -nolisten tcp")

run_x() {
  local cmd="$*"
  dbus-run-session -- xvfb-run "${XVFB_ARGS[@]}" bash -lc "$cmd"
}

case "$MODE" in
  start)
    echo "Starting Electron (headless)..."
    run_x "npm start"
    ;;
  build)
    echo "Building renderer..."
    run_x "npm run build:renderer"
    ;;
  build-and-start|default)
    echo "Building renderer and starting Electron (headless)..."
    run_x "npm run build:renderer && npm start"
    ;;
  *)
    echo "Unknown mode: $MODE"
    echo "Usage: $0 [build-and-start|build|start]"
    exit 1
    ;;
esac
