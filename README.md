# 🔒 BLCKBOLT Browser

**The Advanced Developer Privacy Browser** – An Electron-based browser with enterprise-grade privacy controls, real-time threat detection, and modern glassmorphic UI.

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Electron](https://img.shields.io/badge/electron-29.4.6-brightgreen)
![Node](https://img.shields.io/badge/node-18+-brightgreen)

---

## ✨ Features

### 🔐 Privacy & Security
- **WebRTC Leak Prevention** – Blocks IP leaks through WebRTC
- **DNS-over-HTTPS/TLS** – 5 privacy-focused resolvers (Cloudflare, Quad9, Mullvad, NextDNS, AdGuard)
- **Canvas Fingerprint Blocker** – Spoofs canvas data to prevent tracking
- **Tor Integration** – Built-in SOCKS5 support with Tor connectivity
- **VPN Support** – OpenVPN configuration with proxy settings
- **AdBlock** – Request-level ad blocking with customizable lists

### 🛡️ Threat Detection
- **DPI Detection** – Identifies Deep Packet Inspection and censorship
- **Connection Metrics** – Real-time latency, packet loss, jitter monitoring
- **MITM Detection** – Certificate validation alerts
- **BGP Hijack Detection** – Route anomaly alerts
- **Throttling Detection** – Identifies ISP throttling patterns

### ⚡ Performance
- **Speed Test Widget** – Download/upload speed, latency benchmarking
- **Network Analysis** – Connection profiling with security recommendations
- **Optimized UI** – Glassmorphic design with smooth animations
- **Fast Startup** – ~2 second cold start (system-dependent)

### 🎨 Developer Experience
- **Modern UI** – Next.js + Tailwind CSS + Framer Motion
- **Omnibox** – Smart URL bar with keyboard shortcuts
- **Tab Management** – Drag-reorder, grouping, search
- **Settings Panel** – Granular privacy controls
- **Onboarding Flow** – Built-in setup with 3 profile presets

### 🌍 Cross-Platform
- **Windows** – NSIS installer, portable EXE, ZIP archive
- **Linux** – AppImage (universal), DEB (Ubuntu/Debian)
- **macOS** – DMG, ZIP (Intel & Apple Silicon)

---

## 📦 Downloads

### Latest Release: v0.1.0

#### Windows
- **Installer**: [BLCKBOLT-Browser-Setup-0.1.0.exe](https://github.com/hybeprojects/BLCKBOLT-BROWSER/releases)
- **Portable**: [BLCKBOLT Browser.exe](https://github.com/hybeprojects/BLCKBOLT-BROWSER/releases)
- **ZIP Archive**: [BLCKBOLT Browser-0.1.0-win.zip](https://github.com/hybeprojects/BLCKBOLT-BROWSER/releases)

#### Linux
- **AppImage**: [BLCKBOLT-Browser-0.1.0-x64.AppImage](https://github.com/hybeprojects/BLCKBOLT-BROWSER/releases)
- **DEB Package**: [BLCKBOLT-Browser-0.1.0-x64.deb](https://github.com/hybeprojects/BLCKBOLT-BROWSER/releases)
- **ARM64 AppImage**: [BLCKBOLT-Browser-0.1.0-arm64.AppImage](https://github.com/hybeprojects/BLCKBOLT-BROWSER/releases)

#### macOS
- **DMG**: [BLCKBOLT Browser-0.1.0.dmg](https://github.com/hybeprojects/BLCKBOLT-BROWSER/releases)
- **ZIP**: [BLCKBOLT Browser-0.1.0-mac.zip](https://github.com/hybeprojects/BLCKBOLT-BROWSER/releases)

---

## 🚀 Quick Start

### Installation

#### Windows (Installer)
1. Download `BLCKBOLT-Browser-Setup-0.1.0.exe`
2. Double-click to run installer
3. Follow setup wizard
4. Launch from Start Menu or Desktop shortcut

#### Windows (Portable)
1. Download `BLCKBOLT Browser.exe`
2. Extract/copy to desired location
3. Double-click to launch
4. No installation required ✓

#### Linux (AppImage)
```bash
# Download
wget https://github.com/hybeprojects/BLCKBOLT-BROWSER/releases/download/v0.1.0/BLCKBOLT-Browser-0.1.0-x64.AppImage

# Make executable
chmod +x BLCKBOLT-Browser-0.1.0-x64.AppImage

# Run
./BLCKBOLT-Browser-0.1.0-x64.AppImage
```

#### Linux (DEB)
```bash
# Download and install
sudo apt update
sudo apt install ./BLCKBOLT-Browser-0.1.0-x64.deb

# Launch
blckbolt-browser
```

#### macOS
1. Download `BLCKBOLT Browser-0.1.0.dmg`
2. Mount DMG (double-click)
3. Drag app to Applications folder
4. Launch from Applications

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + L` | Focus address bar (omnibox) |
| `Ctrl/Cmd + T` | New tab |
| `Ctrl/Cmd + W` | Close tab |
| `Ctrl/Cmd + Tab` | Next tab |
| `Ctrl/Cmd + Shift + Tab` | Previous tab |
| `Ctrl/Cmd + H` | Toggle history sidebar |
| `F12` | Toggle DevTools |
| `Ctrl/Cmd + R` | Reload |
| `Ctrl/Cmd + Shift + R` | Hard reload |

---

## 🔧 Configuration

### Privacy Settings
1. Click **⚙️ Settings**
2. Go to **Privacy & Security**
   - Toggle third-party cookie blocking
   - Enable Do Not Track header
   - Configure VPN/Tor

### DNS Settings
1. Click **⚙️ Settings**
2. Go to **DNS**
   - Select resolver (Cloudflare, Quad9, Mullvad, etc.)
   - Test connection speeds
   - Monitor for DPI

### Appearance
1. Click **⚙️ Settings**
2. Go to **Appearance**
   - Choose theme (Dark/Light/System)
   - Customize accent color

---

## 🏗️ Development

### Prerequisites
- Node.js 18+
- npm 9+
- Windows Build Tools (Windows only)
- Xcode (macOS only)

### Setup
```bash
# Clone repository
git clone https://github.com/hybeprojects/BLCKBOLT-BROWSER.git
cd BLCKBOLT-BROWSER

# Install dependencies
npm install

# Start development server
npm run dev

# In another terminal, launch Electron
npm start
```

### Development Build
```bash
# Build with DevTools enabled
npm run build:renderer
npm start
```

### Production Build

See [PRODUCTION_BUILD_GUIDE.md](PRODUCTION_BUILD_GUIDE.md) for detailed instructions.

```bash
# Quick build for your platform
npm run build:prod

# Or specific platform
npm run build:win      # Windows
npm run build:linux    # Linux
npm run build:mac      # macOS
npm run build:all      # All platforms
```

---

## 📊 Architecture

```
BLCKBOLT-BROWSER/
├── main/                          # Electron main process
│   ├── main.js                    # App entry point
│   ├── preload.js                 # Renderer → Main IPC bridge
│   ├── updater.js                 # Auto-updates
│   ├── modules/
│   │   ├── tor/                   # Tor integration
│   │   ├── network/               # VPN, DoH/DoT, DPI detection
│   │   ├── fingerprint/           # Canvas blocker, user agents
│   │   └── adblocker.js           # Request filtering
│   └── assets/                    # Icons, images
│
├── renderer/                      # Next.js frontend (React)
│   ├── pages/
│   │   ├── _app.tsx              # App wrapper + theme provider
│   │   └── index.tsx             # Main layout
│   ├── components/
│   │   ├── BrowserHeader.tsx      # Omnibox, address bar
│   │   ├── TabBar.tsx            # Tab management
│   │   ├── PrivacyDashboard.tsx  # Stats + WebRTC + SpeedTest
│   │   ├── ConnectionMetrics.tsx # Network analysis
│   │   ├── SettingsModal.tsx     # Settings with DNS tab
│   │   └── [others].tsx
│   ├── styles/                    # CSS, Tailwind config
│   ├── utils/                     # Utilities
│   └── design-tokens.json        # Design system
│
├── package.json                   # Project config + build scripts
├── PRODUCTION_BUILD_GUIDE.md      # Build instructions
└── README.md                      # This file
```

---

## 🔄 Auto-Updates

BLCKBOLT Browser checks for updates automatically on startup.

### Configuration
Updates are published to GitHub Releases. To enable auto-updates:

1. Create a release: `git tag v0.2.0 && git push --tags`
2. Upload executables to GitHub Release
3. App will detect and notify users
4. Users can update with one click

---

## 🐛 Known Issues & Limitations

### Current Version (0.1.0)
- [ ] WebGL RENDERER fingerprinting partially blocked (sites can still get vendor name)
- [ ] Some sites may break with aggressive fingerprinting prevention
- [ ] DPI detection has ~85% accuracy (some false positives)
- [ ] Linux: AppImage may need libfuse2 on older systems

### Roadmap
- [ ] Full WebGL spoofing
- [ ] Custom certificate authority (CA) for MITM testing
- [ ] Built-in VPN service
- [ ] Browser extension support
- [ ] Multi-window privacy profiles
- [ ] Hardware acceleration options

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use Prettier for formatting
- Write descriptive commit messages
- Test on Windows, Linux, and macOS before submitting PR

---

## 📝 License

This project is licensed under the **MIT License** – see [LICENSE](LICENSE) for details.

You are free to use, modify, and distribute this software for any purpose.

---

## 🔐 Security & Privacy

### Security First
- **No telemetry** – Zero data collection
- **Open source** – Fully auditable code
- **Regular updates** – Security patches released immediately
- **Privacy by default** – All protections enabled out of the box

### Reporting Security Issues
Found a vulnerability? Please email: `security@hybe.pro`

Do NOT open public issues for security vulnerabilities.

---

## 💬 Community & Support

- **GitHub Issues**: [Report bugs](https://github.com/hybeprojects/BLCKBOLT-BROWSER/issues)
- **Discussions**: [Ask questions](https://github.com/hybeprojects/BLCKBOLT-BROWSER/discussions)
- **Twitter**: [@hybeprojects](https://twitter.com/hybeprojects)
- **Email**: contact@hybe.pro

---

## 📚 Documentation

- [Production Build Guide](PRODUCTION_BUILD_GUIDE.md) – How to build for Windows/Linux/macOS
- [Design System](DESIGN_SYSTEM.md) – UI components and tokens
- [Architecture](docs/ARCHITECTURE.md) – Module structure and data flow
- [Security](docs/SECURITY.md) – Security features explained

---

## 🎯 Roadmap

### v0.2.0 (Q3 2026)
- [ ] Chromium version bump
- [ ] IPv6 leak prevention
- [ ] Custom DNS blocklists (Pi-hole integration)
- [ ] Browser extension marketplace

### v0.5.0 (Q4 2026)
- [ ] VPN provider integration
- [ ] Built-in sync across devices
- [ ] Multi-profile containers
- [ ] Network traffic analyzer

### v1.0.0 (Q1 2027)
- [ ] Full Chromium engine replacement
- [ ] Hardware security module (HSM) support
- [ ] Blockchain-based identity verification
- [ ] Enterprise licensing

---

## 🙏 Thanks

Built with ❤️ using:
- [Electron](https://www.electronjs.org/) – Cross-platform desktop framework
- [Next.js](https://nextjs.org/) – React framework
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) – Animation library
- [React](https://react.dev/) – UI library

---

## 📊 Stats

- **Size**: ~400-900 MB (depending on platform/flags)
- **Startup Time**: ~2-3 seconds
- **Memory**: ~150-300 MB at idle
- **CPU**: <5% at idle
- **Update Size**: ~100-200 MB
- **Built with**: Electron 29.4.6, Node.js, React 18.3

---

**Last Updated**: March 29, 2026  
**Current Version**: 0.1.0  
**Status**: Active Development 🚀

[⬆ Back to Top](#-blckbolt-browser)
