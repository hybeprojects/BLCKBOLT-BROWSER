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
  Xvfb :99 -screen 0 1280x720x24 -nolisten tcp > /dev/null 2>&1 &
  XVFB_PID=$!
  trap 'kill -TERM "$XVFB_PID" 2>/dev/null || true' EXIT
  export DISPLAY=:99
  sleep 1
fi

# Environment tweaks
export ELECTRON_DISABLE_SANDBOX=true
export LIBGL_ALWAYS_SOFTWARE=1
export ELECTRON_ENABLE_LOGGING=true

echo "Building renderer..."
npm run build:renderer

echo "Starting Electron (headless)..."
# Run electron under dbus session and Xvfb. Avoid unstable/process-oriented flags.
cmd="npx electron . --no-sandbox --disable-gpu --disable-dev-shm-usage --disable-setuid-sandbox"
if [ -n "$DBUS_PREFIX" ]; then
  eval "$DBUS_PREFIX $cmd"
else
  eval "$cmd"
fi

