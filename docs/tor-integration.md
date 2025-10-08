# BLCKBOLT-BROWSER Tor Integration

## Purpose
Enable privacy-minded users and researchers to route browser profile traffic through the Tor network using a local Tor daemon or container. This is strictly opt-in and for authorized, ethical use only.

## How It Works
- Per-profile Tor toggle in the sidebar UI
- Connects only to local Tor SOCKS5 endpoints (127.0.0.1:9050 or user-specified)
- Electron session proxy is set per-profile; no system-wide routing
- DNS leak prevention: browser DNS routed through Tor proxy
- Diagnostics: check Tor IP, SOCKS reachability, and display warnings

## Usage
1. **Run Tor locally** (system daemon or Docker container)
2. **Enable Tor** for a profile in BLCKBOLT sidebar (consent required)
3. **Check diagnostics** in the sidebar (IP, SOCKS status)
4. **Verify** with https://check.torproject.org/ or https://api.ipify.org?format=json

## Legal & Ethical Notice
- Tor integration is for legitimate privacy and research use only.
- Do not use Tor to commit illegal acts. You are responsible for your actions.
- BLCKBOLT does not guarantee anonymity or security. Read Tor Project documentation and threat models.
- All Tor connections are opt-in and local only. No remote/third-party Tor endpoints are supported.

## Troubleshooting
- Ensure Tor is running and listening on 127.0.0.1:9050
- Use `nc -z 127.0.0.1 9050` to check SOCKS port
- If diagnostics show "Not Reachable", check your Tor daemon/container

## Example Tor Config
See `configs/tor/config.example.json` for a sample config.

## Docker Compose Example (user-managed)
```
services:
  tor:
    image: local/tor:latest  # user must provide an official Tor image
    ports:
      - "9050:9050"
    restart: unless-stopped
```

**Note:** This is a template only. User must review and run their own container.

---
For more, see the sidebar UI and `src/modules/tor/torManager.js`.
