# BLCKBOLT Browser - Production Build Guide

## Overview

BLCKBOLT Browser is built on Electron and can be packaged as production executables for Windows (.exe), Linux (AppImage, deb), and macOS (dmg).

## Prerequisites

- **Node.js**: v18.0 or higher
- **npm**: v9.0 or higher
- **Build Tools**:
  - **Windows**: Visual Studio Build Tools or MinGW
  - **Linux**: GCC, make, development headers
  - **macOS**: Xcode Command Line Tools

### Install Build Tools

#### Windows
```bash
# Using Chocolatey
choco install visualstudio2022buildtools

# Or download from:
https://visualstudio.microsoft.com/visual-cpp-build-tools/
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install -y build-essential python3 libfuse-dev
```

#### Linux (Fedora/RHEL)
```bash
sudo dnf groupinstall -y "Development Tools"
sudo dnf install -y libfuse-dev
```

#### macOS
```bash
xcode-select --install
```

---

## Building for Production

### Quick Start

#### Windows
```bash
# Build installer and portable EXE
npm run build:win

# Or use the batch script
build-production.bat
```

**Output:**
- `dist/BLCKBOLT-Browser-Setup-0.1.0.exe` (NSIS Installer)
- `dist/BLCKBOLT Browser.exe` (Portable)
- `dist/BLCKBOLT Browser-0.1.0-win.zip` (ZIP Archive)

#### Linux
```bash
# Build AppImage and DEB package
npm run build:linux

# Or use the shell script
bash build-production.sh
```

**Output:**
- `dist/BLCKBOLT-Browser-0.1.0-x64.AppImage` (Universal)
- `dist/BLCKBOLT-Browser-0.1.0-x64.deb` (Debian-based)
- `dist/BLCKBOLT-Browser-0.1.0-arm64.AppImage` (ARM64)
- `dist/BLCKBOLT-Browser-0.1.0-arm64.deb` (ARM64)

#### macOS
```bash
npm run build:mac
```

**Output:**
- `dist/BLCKBOLT Browser-0.1.0.dmg` (Disk Image)
- `dist/BLCKBOLT Browser-0.1.0-mac.zip` (ZIP)

#### All Platforms
```bash
npm run build:all
```

---

## Detailed Build Scripts

### 1. Build Renderer Only
```bash
npm run build:renderer
```
This creates the static Next.js output in `renderer/out/`.

### 2. Clean Build
```bash
# Clean everything
rm -rf dist renderer/out renderer/.next node_modules

# Reinstall and build
npm ci --prefer-offline
npm run build:renderer
npm run build:prod
```

### 3. Full Production Build
```bash
npm run build:prod
```
Builds renderer + electron-builder packages without publishing.

### 4. Debug/Development Build
```bash
npm start
```
Runs the app in development mode with Electron DevTools.

---

## Build Process Details

### Step-by-Step

1. **Renderer Build** (Next.js)
   - Compiles TypeScript/JSX components
   - Optimizes CSS with Tailwind
   - Exports static HTML/JS to `renderer/out/`
   - Time: ~2-3 minutes

2. **Electron Packaging**
   - Bundles main process (Node.js)
   - Includes renderer output
   - Applies code signing (if configured)
   - Time: ~2-5 minutes per platform

3. **Platform-Specific**
   - **Windows NSIS**: Creates installer with registry entries
   - **Windows Portable**: Self-contained EXE, zero installation
   - **Linux AppImage**: Universal package for all Linux distros
   - **Linux DEB**: System-integrated package for Debian/Ubuntu

---

## Configuration Files

### Key Build Files

| File | Purpose |
|------|---------|
| `package.json` | NPM config + electron-builder settings |
| `electron-builder.yml` | Alternative builder config (if used) |
| `main/main.js` | Electron main process |
| `main/preload.js` | Security bridge between renderer and main |
| `renderer/next.config.mjs` | Next.js static export config |
| `main/assets/icon.ico` | Windows icon |
| `main/assets/icon.icns` | macOS icon |
| `main/assets/icon.png` | Linux icon |

### Electron Builder Configuration (package.json)

```json
{
  "build": {
    "appId": "com.blckbolt.browser",
    "productName": "BLCKBOLT Browser",
    "win": {
      "target": ["nsis", "portable", "zip"],
      "icon": "main/assets/icon.ico"
    },
    "linux": {
      "target": ["AppImage", "deb"],
      "category": "Development"
    }
  }
}
```

---

## Windows Distribution

### NSIS Installer
- **Best for**: Enterprise deployments
- **Features**: Registry entries, startup shortcuts, uninstaller
- **Size**: ~800 MB+ (includes all files)
- **Installation**: Standard Windows MSI-like experience
- **Command**: `npm run build:win`
- **Output**: `BLCKBOLT-Browser-Setup-0.1.0.exe`

### Portable EXE
- **Best for**: Portable drives, removable media
- **Features**: No installation required
- **Size**: ~800 MB
- **Installation**: Copy/execute from any location
- **Command**: `npm run build:win`
- **Output**: `BLCKBOLT Browser.exe`

### ZIP Archive
- **Best for**: Manual deployment, testing
- **Features**: Extractable, portable
- **Size**: ~300-400 MB (compressed)
- **Installation**: Extract and run
- **Command**: `npm run build:win`
- **Output**: `BLCKBOLT Browser-0.1.0-win.zip`

---

## Linux Distribution

### AppImage
- **Best for**: Universal Linux support
- **Compatibility**: Works on most modern Linux distros
- **Features**: Self-contained, no dependencies
- **Size**: ~450-550 MB
- **Installation**: `chmod +x` then execute
- **Dependencies**: libfuse2 (usually pre-installed)
- **Output**: `BLCKBOLT-Browser-0.1.0-x64.AppImage`

### DEB Package
- **Best for**: Debian/Ubuntu systems
- **Compatibility**: Ubuntu 18.04+, Debian 9+
- **Features**: Integrated with package managers
- **Size**: ~350-450 MB
- **Installation**: `sudo apt install ./BLCKBOLT-Browser-0.1.0-x64.deb`
- **Dependencies**: libappindicator1, libnotify-bin
- **Output**: `BLCKBOLT-Browser-0.1.0-x64.deb`

### Distribution Commands
```bash
# Extract AppImage without installing
./BLCKBOLT-Browser-0.1.0-x64.AppImage --appimage-extract

# Install DEB
sudo apt update
sudo apt install ./BLCKBOLT-Browser-0.1.0-x64.deb

# Create repo for updates
cd dist
python3 -m http.server 8000
# Then use auto-updater config
```

---

## Code Signing (Optional)

### Windows Code Signing
```bash
# Set environment variables
set CSC_LINK=path/to/certificate.pfx
set CSC_KEY_PASSWORD=your_password

# Or configure in package.json
"win": {
  "certificateFile": "path/to/cert.pfx",
  "certificatePassword": "password"
}

# Build with signing
npm run build:win
```

### Linux GPG Signing
```bash
# Create GPG key
gpg --gen-key

# Export public key
gpg --armor --export YOUR_KEY_ID > public.asc

# Sign DEB
dpkg-sig -k YOUR_KEY_ID -s builder dist/*.deb

# For AppImage signing (advanced)
# Requires specific setup per platform
```

### macOS Code Signing
```bash
# Requires Apple Developer account and certificate
# Automatically handled by electron-builder if cert is in keychain

export CSC_IDENTITY_AUTO_DISCOVERY=true
npm run build:mac
```

---

## Testing Builds

### Test Installer Before Distribution
```bash
# Windows
dist/BLCKBOLT-Browser-Setup-0.1.0.exe

# Linux - Install locally
sudo dpkg -i dist/BLCKBOLT-Browser-0.1.0-x64.deb
blckbolt-browser

# Or test AppImage
./dist/BLCKBOLT-Browser-0.1.0-x64.AppImage
```

### Verify Build Integrity
```bash
# Check file signatures (Windows)
signtool verify /pa dist/BLCKBOLT-Browser-Setup-0.1.0.exe

# Check DEB dependencies
apt-cache depends dist/BLCKBOLT-Browser-0.1.0-x64.deb

# List AppImage contents
./dist/BLCKBOLT-Browser-0.1.0-x64.AppImage --appimage-extract
```

---

## Troubleshooting

### Build Fails on Windows
```bash
# Issue: Missing build tools
# Solution:
npm install --global --production windows-build-tools

# Or install Visual Studio Build Tools manually
```

### AppImage Build Fails
```bash
# Issue: libfuse.so.2 not found
# Solution (Ubuntu/Debian):
sudo apt-get install libfuse-dev

# Solution (Fedora):
sudo dnf install fuse-devel
```

### Large File Size
```bash
# Reduce DEB size
strip dist/BLCKBOLT*.deb

# Use upx for EXE compression (optional)
npm install --save-dev upx
# Then configure in package.json
```

### Auto-Update Configuration
```javascript
// main/updater.js example
const { autoUpdater } = require('electron-updater');

autoUpdater.checkForUpdatesAndNotify();

// In package.json build config:
"publish": {
  "provider": "github",
  "owner": "hybeprojects",
  "repo": "BLCKBOLT-BROWSER"
}
```

---

## Performance Optimization

### Reduce Package Size

1. **Disable unused features**:
   ```javascript
   // main/main.js
   // Remove unnecessary modules
   ```

2. **Tree-shake dependencies**:
   ```json
   // package.json
   "dependencies": {
     // Only production essentials
   }
   ```

3. **Use compression**:
   ```bash
   # In package.json build config
   "files": ["dist/**/*"],
   "excludeAsarUnpack": []
   ```

### Speed Up Build Time

```bash
# Use ccache for faster compilation
export CC="ccache gcc"
export CXX="ccache g++"

# Parallel builds (node-gyp)
npm config set jobs max
```

---

## Distribution Checklist

- [ ] Renderer builds successfully (`npm run build:renderer`)
- [ ] No TypeScript errors (`npm run typecheck`)
- [ ] Main process validated
- [ ] Icons present (ico, icns, png)
- [ ] LICENSE.txt included
- [ ] Code signing certificates ready (optional)
- [ ] Test installation on target OS
- [ ] Verify auto-update configuration
- [ ] Create release on GitHub
- [ ] Upload artifacts to release
- [ ] Test download and execution
- [ ] Document release notes

---

## Update Deployment

### Using electron-updater

```javascript
// main/updater.js
const { autoUpdater } = require('electron-updater');

export default function setupAutoUpdate(mainWindow) {
  autoUpdater.checkForUpdatesAndNotify();
  
  autoUpdater.on('update-downloaded', () => {
    autoUpdater.quitAndInstall();
  });
}
```

### GitHub Releases Integration
1. Push code to main branch
2. Create GitHub release with tag `v0.1.0`
3. Upload `.exe`, `.deb`, `.AppImage` to release
4. Application checks for updates automatically

---

## Support & Debugging

### Enable Debug Logging
```bash
# Windows
set DEBUG=electron-builder

# Linux/macOS
export DEBUG=electron-builder

# Build
npm run build:prod
```

### Check Electron Version Compatibility
```bash
npm list electron
# Currently: v29.4.6

# Supported platforms:
# - Windows 7+ (x64, ia32)
# - Ubuntu 12.04+ (x64, arm64)
# - macOS 10.11+ (x64, arm64)
```

---

## License & Attribution

**BLCKBOLT Browser** is licensed under the MIT License. See LICENSE.txt for details.

For more information, visit: https://github.com/hybeprojects/BLCKBOLT-BROWSER

---

**Last Updated**: March 29, 2026  
**Version**: 0.1.0  
**Electron**: 29.4.6  
**Node**: 18.0+
