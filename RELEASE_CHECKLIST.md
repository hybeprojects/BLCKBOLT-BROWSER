# Release & Deployment Checklist

Complete this checklist before releasing a new version of BLCKBOLT Browser to production.

## Pre-Release (1 week before)

### Code Quality
- [ ] All tests pass (`npm run typecheck && npm run lint`)
- [ ] No console errors or warnings
- [ ] Security audit passed (`npm audit`)
- [ ] Dependencies updated (`npm update`)
- [ ] Code reviewed by team member

### Documentation
- [ ] README.md updated with new features
- [ ] CHANGELOG.md created with version notes
- [ ] PRODUCTION_BUILD_GUIDE.md reflects current config
- [ ] API docs updated if any IPC changes
- [ ] User guide updated for new features

### Feature Testing
- [ ] Test on Windows 10/11 (x64, ia32)
- [ ] Test on Ubuntu 20.04+ (x64, arm64)
- [ ] Test on macOS 12+ (Intel & Apple Silicon)
- [ ] Test all privacy features (WebRTC, DoH, Tor, VPN)
- [ ] Test performance (startup, memory, CPU)
- [ ] Test auto-update flow

### Configuration Review
- [ ] package.json version bumped
- [ ] electron-builder config correct
- [ ] Icon files present and correct size
- [ ] License file (LICENSE.txt) updated
- [ ] Code signing certificates valid

## Release Day

### Version Preparation
```bash
# Update version in package.json
# Currently: "version": "0.1.0"
# Update to: "version": "0.2.0"
```

### Build Verification
```bash
# Test full build process on each platform
npm run build:win      # Windows
npm run build:linux    # Linux  
npm run build:mac      # macOS (if available)

# Verify executables exist:
ls -lah dist/
```

### Build Output Checklist
- [ ] Windows installer: `BLCKBOLT-Browser-Setup-*.exe` (~800MB+)
- [ ] Windows portable: `BLCKBOLT Browser.exe` (~800MB)
- [ ] Windows ZIP: `BLCKBOLT Browser-*.zip` (~300MB)
- [ ] Linux AppImage: `BLCKBOLT-Browser-*-x64.AppImage` (~500MB)
- [ ] Linux DEB: `BLCKBOLT-Browser-*-x64.deb` (~400MB)
- [ ] Linux ARM64: Both AppImage and DEB for arm64 arch
- [ ] macOS DMG: `BLCKBOLT Browser-*.dmg` (~600MB)
- [ ] macOS ZIP: `BLCKBOLT Browser-*.zip` (~400MB)

### Binary Verification
```bash
# Windows - Check installer integrity
signtool verify /pa dist/BLCKBOLT-Browser-Setup-*.exe

# Linux - Check DEB dependencies
apt-cache depends dist/BLCKBOLT-Browser-*.deb

# macOS - Check code signature
codesign -vv dist/BLCKBOLT\ Browser.app

# All platforms - Check file sizes reasonable
wc -c dist/*  # Should be >300MB for each
```

### Installation Testing
- [ ] Install Windows (NSIS) - test uninstall, reinstall
- [ ] Run Windows portable - verify no missing files
- [ ] Install Linux DEB - check menu entries, desktop shortcuts
- [ ] Run Linux AppImage - verify works on clean system
- [ ] Install macOS DMG - verify .app bundle complete
- [ ] Test auto-launch on system boot
- [ ] Verify shortcuts/menu entries created

### Functionality Testing
- [ ] Launch app successfully
- [ ] Load first URL without errors
- [ ] Privacy dashboard displays metrics
- [ ] WebRTC leak prevention works
- [ ] DoH/DoT resolver selection works
- [ ] Speed test completes
- [ ] Canvas fingerprinting active
- [ ] Settings save and persist
- [ ] Theme switching functional
- [ ] Tab drag-reorder works
- [ ] Keyboard shortcuts active
- [ ] DevTools open (F12)

### Git & GitHub Preparation
```bash
# Tag the release
git tag -a v0.2.0 -m "Release v0.2.0: Feature X, Y, Z"

# Verify tag
git tag -l
git show v0.2.0

# Push (doesn't auto-publish)
git push origin main
git push origin v0.2.0
```

### GitHub Release Creation
1. Go to: https://github.com/hybeprojects/BLCKBOLT-BROWSER/releases
2. Click "Draft a new release"
3. Select tag: v0.2.0
4. Title: "BLCKBOLT Browser v0.2.0"
5. Description: Copy from CHANGELOG.md
6. Add artifacts:
   - [ ] dist/BLCKBOLT-Browser-Setup-*.exe
   - [ ] dist/BLCKBOLT Browser.exe
   - [ ] dist/BLCKBOLT Browser-*.zip
   - [ ] dist/BLCKBOLT-Browser-*-x64.AppImage
   - [ ] dist/BLCKBOLT-Browser-*-x64.deb
   - [ ] dist/BLCKBOLT-Browser-*-arm64.AppImage
   - [ ] dist/BLCKBOLT-Browser-*-arm64.deb
   - [ ] dist/BLCKBOLT Browser-*.dmg
   - [ ] dist/BLCKBOLT Browser-*.zip (macOS)
7. Add checksums (SHA256):
   ```bash
   sha256sum dist/* > CHECKSUMS.txt
   ```
8. Check "Create a discussion"
9. Uncheck "Pre-release" (unless beta)
10. Publish Release

### Post-Release Verification
- [ ] Release visible on GitHub
- [ ] All files downloadable
- [ ] Download links work
- [ ] File checksums verify
- [ ] Auto-update detects new version
- [ ] Users can download and install
- [ ] Website updated with new version

## Post-Release (48 hours after)

### Monitoring
- [ ] Check GitHub issues for bug reports
- [ ] Monitor crash reports (if telemetry enabled)
- [ ] Check community discussions
- [ ] Performance metrics normal
- [ ] No security vulnerabilities reported

### User Communications
- [ ] Tweet/announce on social media
- [ ] Send email to mailing list
- [ ] Update project website
- [ ] Post in community forums
- [ ] Update Discord/Slack if applicable

### Documentation Updates
- [ ] Update INSTALLATION.md
- [ ] Update FAQ with new features
- [ ] Create demo/tutorial if major feature
- [ ] Archive previous version docs

### Metrics & Analytics
```bash
# Check release download count in 24 hours
# Expected initial downloads: 100-500+

# Monitor from dashboard:
# - Total downloads
# - Peak traffic time
# - Geographic distribution
# - Common errors/crashes
```

## Rollback Plan (If Critical Issues Found)

### Emergency Rollback
```bash
# If critical bug found within 24 hours:

# 1. Create patch on main branch
git checkout main
git pull origin main
# Fix bug...
git add .
git commit -m "Critical hotfix: [issue]"

# 2. Create patch release
git tag v0.2.1
git push origin main
git push origin v0.2.1

# 3. Create new release with CRITICAL tag
# On GitHub: Release v0.2.1 as CRITICAL FIX
```

### Communication
- [ ] Post on GitHub issues explaining issue
- [ ] Recommend users rollback to v0.1.0
- [ ] Provide direct download link to previous version
- [ ] Publish hotfix within 12 hours
- [ ] Document root cause in CHANGELOG

## Post-Release (1 week)

### Review & Analysis
- [ ] Total downloads: >100 (baseline)
- [ ] Average rating: 4.0+ stars
- [ ] User feedback positive overall
- [ ] No security issues reported
- [ ] Performance metrics acceptable

### Planning Next Release
- [ ] Create v0.3.0 milestone on GitHub
- [ ] Prioritize reported issues
- [ ] Plan new features
- [ ] Schedule next release date
- [ ] Assign tasks to team

## Release Notes Template

```markdown
# BLCKBOLT Browser v0.2.0

**Release Date**: March 29, 2026

## 🎉 New Features
- Feature A
- Feature B
- Feature C

## 🐛 Bug Fixes
- Fixed issue X
- Fixed issue Y
- Fixed issue Z

## ⚡ Performance
- Improved startup time by 20%
- Reduced memory usage by 15%
- Optimized rendering pipeline

## 🔒 Security
- Updated Electron to 29.4.6
- Fixed XSS vulnerability in parser
- Enhanced CSP headers

## 📚 Documentation
- Added guide for setting up Tor
- Updated DNS resolver comparison
- Created troubleshooting guide

## 🙏 Credits
- Thanks to [contributor] for [feature]
- Special thanks to users reporting issues

## 📥 Downloads
See attachments above for platform-specific installers.

## 📖 Installation
See [PRODUCTION_BUILD_GUIDE.md](PRODUCTION_BUILD_GUIDE.md) for detailed installation instructions.

---
**Total commits**: 47
**Files changed**: 89
**Insertions**: +2,845
**Deletions**: -312

For upgrade instructions, see [UPGRADE_GUIDE.md]()
For comprehensive changelog, see [CHANGELOG.md]()
```

## Signing & Notarization (Optional, for Production)

### Code Signing
```bash
# Windows (requires Sectigo/DigiCert certificate)
export CSC_LINK="path/to/cert.pfx"
export CSC_KEY_PASSWORD="password"
npm run build:win

# macOS (requires Apple Developer certificate)
export CSC_IDENTITY_AUTO_DISCOVERY=true
npm run build:mac
```

### Notarization (macOS)
```bash
# Apple notarization for Gatekeeper bypass
xcrun altool --notarize-app \
  -f dist/BLCKBOLT\ Browser-*.dmg \
  -t osx \
  -u apple@email.com \
  -p "@keychain:AC_PASSWORD"
```

## Checklist Summary

### Must Complete Before Release
- [ ] All tests pass
- [ ] Security audit clean
- [ ] All platforms build successfully
- [ ] Installation tests pass
- [ ] Documentation updated
- [ ] Version number bumped
- [ ] Tag created on GitHub
- [ ] Release notes written
- [ ] Artifacts uploaded

### Nice to Have
- [ ] Code signing enabled
- [ ] Auto-update verified
- [ ] Performance benchmarked
- [ ] Localization reviewed
- [ ] Accessibility tested

### Critical (Stop Release If Any Fail)
- [ ] No high-severity security issues
- [ ] Installer launches without error
- [ ] Core privacy features functional
- [ ] No data corruption on clean install
- [ ] File integrity verified

---

**Last Updated**: March 29, 2026  
**Version**: 0.1.0  
**Prepared by**: Development Team
