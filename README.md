# BLCKBOLT-BROWSER

**Advanced Developer Privacy Browser**

## Features
- Electron-based, cross-platform desktop browser
- Modular: VPN, AdBlocker, Fingerprint, DevTools
- Secure main process, no nodeIntegration in renderer
- Dark theme UI with Tailwind CSS
- Configurable via `/configs` directory

## Project Structure
```
BLCKBOLT-BROWSER/
├── src/
│   ├── main/           # Electron main process
│   ├── renderer/       # Renderer process (UI)
│   ├── modules/        # Modular features
│   │   ├── network/vpn.js
│   │   ├── adblocker.js
│   │   └── fingerprint.js
│   └── assets/         # App icons, images
├── configs/
│   ├── settings.json   # Global preferences
│   ├── vpn/            # OpenVPN configs
│   └── adlists/        # Adblock lists
├── package.json
├── tailwind.config.js
├── .gitignore
└── README.md
```

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Start in development mode
```bash
npm start
```

### 3. Build distributable
```bash
npm run build
```

### 4. Lint code
```bash
npm run lint
```

---

- Place your OpenVPN `.ovpn` files in `configs/vpn/`.
- Adblock filter URLs in `configs/adlists/easylist.txt`.
- All modules are placeholders; extend as needed.

---

**App Name:** BLCKBOLT-BROWSER  
**Window Title:** BLCKBOLT BROWSER – Developer Mode

---

## Tor Integration (Opt-in)

- BLCKBOLT supports per-profile Tor routing via a local Tor daemon or container (SOCKS5, 127.0.0.1:9050).
- All Tor use is strictly opt-in and requires explicit user consent.
- Legal/Ethical Notice: Tor is for privacy research and legitimate use only. Do not use Tor to commit illegal acts. BLCKBOLT does not guarantee anonymity or security. Read Tor Project documentation and threat models.
- See `docs/tor-integration.md` for usage, troubleshooting, and legal/ethical guidance.

---

For more, see `BLCKBOLT-BROWSER.txt`.
