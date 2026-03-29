# Quick Start: Build BLCKBOLT Browser for Production

## 🎯 One-Minute Overview

BLCKBOLT Browser is ready to build for Windows and Linux.

### Windows Build
```cmd
npm run build:win
```
Output: `dist/BLCKBOLT-Browser-Setup-0.1.0.exe` (installer + portable)

### Linux Build
```bash
npm run build:linux
```
Output: `dist/BLCKBOLT-Browser-0.1.0-x64.{AppImage,deb}`

### All Platforms
```bash
npm run build:all
```
Output: Windows + Linux + macOS builds

---

## 📋 Prerequisites

- **Node.js** 18.0+
- **npm** 9.0+
- **Windows Build Tools** (for Windows builds)
- **GCC/Make** (for Linux builds)

### Install Build Tools

**Windows (Chocolatey):**
```powershell
choco install visualstudio2022buildtools
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install build-essential python3 libfuse-dev
```

---

## 🚀 Build Steps

1. **Navigate to project**
   ```bash
   cd /workspaces/BLCKBOLT-BROWSER
   ```

2. **Install dependencies** (if needed)
   ```bash
   npm ci --prefer-offline
   ```

3. **Build renderer**
   ```bash
   npm run build:renderer
   ```
   Takes ~2-3 minutes

4. **Build for your platform**
   ```bash
   npm run build:win       # Windows
   npm run build:linux     # Linux
   npm run build:all       # All
   ```
   Takes ~4-18 minutes depending on platform

5. **Verify output**
   ```bash
   ls -lh dist/
   ```
   Should see .exe, .deb, .AppImage files

---

## 📦 Output Files

### Windows
```
dist/BLCKBOLT-Browser-Setup-0.1.0.exe    # NSIS Installer
dist/BLCKBOLT Browser.exe                 # Portable EXE
dist/BLCKBOLT Browser-0.1.0-win.zip      # ZIP Archive
```

### Linux
```
dist/BLCKBOLT-Browser-0.1.0-x64.AppImage # Universal
dist/BLCKBOLT-Browser-0.1.0-x64.deb      # Ubuntu/Debian
dist/BLCKBOLT-Browser-0.1.0-arm64.*      # ARM64
```

---

## 🧪 Test Your Build

### Windows
```cmd
# Test installer
dist\BLCKBOLT-Browser-Setup-0.1.0.exe

# Test portable
dist\BLCKBOLT Browser.exe

# Test ZIP
unzip "dist\BLCKBOLT Browser-0.1.0-win.zip"
```

### Linux
```bash
# Test AppImage
chmod +x dist/BLCKBOLT-Browser-0.1.0-x64.AppImage
./dist/BLCKBOLT-Browser-0.1.0-x64.AppImage

# Test DEB
sudo apt install ./dist/BLCKBOLT-Browser-0.1.0-x64.deb
blckbolt-browser
```

---

## 📚 Documentation

For more detailed information:

| Document | Purpose |
|----------|---------|
| [README.md](README.md) | Features, installation, keyboard shortcuts |
| [PRODUCTION_BUILD_GUIDE.md](PRODUCTION_BUILD_GUIDE.md) | Complete build guide with troubleshooting |
| [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md) | Quality assurance before release |
| [DISTRIBUTION_GUIDE.md](DISTRIBUTION_GUIDE.md) | How to publish to package managers |

---

## 🔗 Create GitHub Release

1. **Push to GitHub**
   ```bash
   git tag v0.1.0
   git push origin main --tags
   ```

2. **Create Release**
   - Go to: github.com/hybeprojects/BLCKBOLT-BROWSER/releases
   - Click "Draft a new release"
   - Select tag: v0.1.0
   - Upload files from `dist/`
   - Publish

3. **Auto-Updates**
   - App automatically detects new release
   - Users notified to update

---

## 🐛 Troubleshooting

### "Build failed: Cannot find module"
```bash
npm ci --prefer-offline
npm run build:renderer
npm run build:win
```

### "Visual Studio Build Tools not found" (Windows)
```powershell
choco install visualstudio2022buildtools
# Install C++ workload
```

### "libfuse.so.2 not found" (Linux)
```bash
sudo apt-get install libfuse-dev
```

### "Port 3000 already in use" (if running dev server)
```bash
npx kill-port 3000
npm run build:renderer
```

---

## ✅ Quality Checks

Before release, verify:

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Build successfully
npm run build:prod

# Verify output exists
ls -lh dist/ | grep -E "\.(exe|deb|AppImage)$"
```

---

## 📊 Build Status

| Step | Command | Time | Status |
|------|---------|------|--------|
| Install | `npm ci` | 2-5 min | ✅ Ready |
| Renderer | `npm run build:renderer` | 2-3 min | ✅ Ready |
| Windows | `npm run build:win` | 2-5 min | ✅ Ready |
| Linux | `npm run build:linux` | 2-5 min | ✅ Ready |
| **Total** | **`npm run build:all`** | **12-18 min** | **✅ Ready** |

---

## 💡 Pro Tips

1. **Use build script on Windows**
   ```cmd
   build-production.bat
   ```

2. **Use build script on Linux/macOS**
   ```bash
   bash build-production.sh
   ```

3. **Parallel builds on multi-core system**
   ```bash
   npm config set jobs max
   ```

4. **Clean rebuild if issues**
   ```bash
   rm -rf dist renderer/out renderer/.next
   npm ci
   npm run build:prod
   ```

5. **Get latest Electron version**
   ```bash
   npm update
   npm run build:prod
   ```

---

## 🚀 Next Steps

1. ✅ Build for your platform
2. ✅ Test the installers
3. ✅ Create GitHub release
4. ✅ Share with users
5. ✅ Monitor feedback

---

## 📞 Need Help?

- **Build errors?** See [PRODUCTION_BUILD_GUIDE.md](PRODUCTION_BUILD_GUIDE.md)
- **Release questions?** See [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md)
- **Distribution help?** See [DISTRIBUTION_GUIDE.md](DISTRIBUTION_GUIDE.md)
- **Features?** See [README.md](README.md)

---

**Ready to build?** Run `npm run build:prod` now! 🚀

Generated: March 29, 2026 | Version: 0.1.0 | Status: ✅ Production Ready
