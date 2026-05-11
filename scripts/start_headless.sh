#!/usr/bin/env bash
set -euo pipefail

echo "=== Starting BLCKBOLT Browser in Headless Mode ==="

# Prefer dbus-run-session (safer), fall back to dbus-launch when unavailable
DBUS_PREFIX=""
if command -v dbus-run-session >/dev/null 2>&1; then
  DBUS_PREFIX="dbus-run-session --"
elif command -v dbus-launch >/dev/null 2>&1; then
  # dbus-launch will export a session bus for child processes
  eval "$(dbus-launch --sh-syntax --exit-with-session)"
else
  echo "Warning: neither dbus-run-session nor dbus-launch found; some features may log warnings."
fi

# Start a virtual X server if one is not present
if [ -z "${DISPLAY:-}" ] || ! xdpyinfo >/dev/null 2>&1; then
    echo "Starting Xvfb on :99"
    # Prefer xvfb-run (handles XAUTH); if not available, start Xvfb and try to allow local connections
    if command -v xvfb-run >/dev/null 2>&1; then
      USE_XVFB_RUN=1
    else
      USE_XVFB_RUN=0
      Xvfb :99 -screen 0 1280x720x24 -nolisten tcp > /dev/null 2>&1 &
      XVFB_PID=$!
      trap 'kill -TERM "$XVFB_PID" 2>/dev/null || true' EXIT
      export DISPLAY=:99
      sleep 1
      # Try to relax access control if xauth/xhost available
      if command -v xhost >/dev/null 2>&1; then
        xhost +local:root >/dev/null 2>&1 || true
      fi
    fi
fi

# Environment tweaks
export ELECTRON_DISABLE_SANDBOX=true
export LIBGL_ALWAYS_SOFTWARE=1
export ELECTRON_ENABLE_LOGGING=true

echo "Building renderer..."
npm run build:renderer

echo "Starting Electron (headless)..."
# Run electron under dbus session and Xvfb (prefer xvfb-run to handle auth)
cmd_base="npx electron . --no-sandbox --disable-gpu --disable-dev-shm-usage --disable-setuid-sandbox"
if [ "${USE_XVFB_RUN:-0}" = "1" ]; then
  cmd_full="xvfb-run --auto-servernum --server-args='-screen 0 1280x720x24 -nolisten tcp' $cmd_base"
else
  cmd_full="$cmd_base"
fi
if [ -n "$DBUS_PREFIX" ]; then
  eval "$DBUS_PREFIX $cmd_full"
else
  eval "$cmd_full"
fi

