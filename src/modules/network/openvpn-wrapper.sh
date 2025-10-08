#!/bin/bash
# openvpn-wrapper.sh: Helper to launch OpenVPN and a local SOCKS5 proxy for browser-only VPN mode
# Usage: ./openvpn-wrapper.sh <ovpn-file> <socks-port>

set -e

OVPN_FILE="$1"
SOCKS_PORT="${2:-1080}"

if [ -z "$OVPN_FILE" ]; then
  echo "Usage: $0 <ovpn-file> [socks-port]"
  exit 1
fi

# Start OpenVPN in the background
sudo openvpn --config "$OVPN_FILE" &
VPN_PID=$!

# Wait for tun interface to be up (simple check)
while ! ifconfig | grep -q tun; do
  sleep 1
done

echo "OpenVPN started (PID $VPN_PID). Starting SOCKS5 proxy on port $SOCKS_PORT..."

# Start Dante SOCKS5 proxy (assumes dante-server is installed and configured)
# Example config: /etc/danted.conf
#
# logoutput: syslog
# internal: 0.0.0.0 port = $SOCKS_PORT
# external: tun0
# method: username none
# user.notprivileged: nobody
# client pass {
#   from: 0.0.0.0/0 to: 0.0.0.0/0
#   log: connect disconnect error
# }
# pass {
#   from: 0.0.0.0/0 to: 0.0.0.0/0
#   protocol: tcp udp
# }

sudo danted -f /etc/danted.conf &
SOCKS_PID=$!

trap 'echo "Stopping..."; sudo kill $VPN_PID $SOCKS_PID' EXIT
wait $VPN_PID
