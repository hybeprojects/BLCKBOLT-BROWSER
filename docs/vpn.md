# BLCKBOLT-BROWSER VPN Module

## Modes
- **System Mode:** Runs OpenVPN as a system process, routing all host traffic.
- **Browser-only Mode (Recommended):** Runs OpenVPN and a local SOCKS5 proxy. Only browser traffic is routed via VPN.

## Files
- `src/modules/network/vpn.js`: Main VPN manager (system/proxy mode, log streaming, IPC)
- `src/modules/network/openvpn-wrapper.sh`: Helper script to launch OpenVPN and SOCKS5 proxy
- `src/modules/network/proxy-agent.js`: Electron session proxy control
- `src/renderer/components/VpnToggle.jsx`: React UI for VPN toggle and logs
- `configs/vpn/example.ovpn`: Example OpenVPN config

## Usage

### 1. System Mode
- Calls `openvpn --config <file.ovpn>` directly.
- All host traffic is routed via VPN.

### 2. Browser-only Mode
- Calls `openvpn-wrapper.sh <file.ovpn> <socks-port>`.
- Sets Electron session proxy to `socks5://127.0.0.1:<port>`.
- Only browser traffic is routed via VPN.

### 3. Adding Configs
- Place `.ovpn` files in `configs/vpn/`.
- Use the UI to select and connect.

### 4. Requirements
- OpenVPN must be installed on the system.
- For browser-only mode, a SOCKS5 proxy (e.g., Dante) must be available.

### 5. Health Checks
- The app checks for tun interface (system mode) or SOCKS port (proxy mode) to verify connection.

### 6. Cleanup
- VPN and proxy processes are killed on disconnect or app quit.

---

For more, see `src/modules/network/vpn.js` and `openvpn-wrapper.sh` comments.
