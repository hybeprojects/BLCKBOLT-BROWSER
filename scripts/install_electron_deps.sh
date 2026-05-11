#!/usr/bin/env bash
set -euo pipefail

echo "Detecting package manager..."
if command -v apt-get >/dev/null 2>&1; then
  PKG_MANAGER="apt"
elif command -v dnf >/dev/null 2>&1; then
  PKG_MANAGER="dnf"
elif command -v apk >/dev/null 2>&1; then
  PKG_MANAGER="apk"
else
  echo "Unsupported distribution. Please install Electron dependencies manually."
  exit 1
fi

install_apt() {
  sudo apt update
  sudo apt install -y \
    libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libgbm1 libasound2 \
    libnss3 libxss1 libxcomposite1 libxrandr2 libxdamage1 libxtst6 \
    libgtk-3-0 libgdk-pixbuf2.0-0 libpangocairo-1.0-0
}

install_dnf() {
  sudo dnf install -y \
    atk atk-bridge cups-libs libdrm libgbm alsa-lib nss \
    libXss libXcomposite libXrandr libXdamage libXtst gtk3 gdk-pixbuf2 pango
}

install_apk() {
  sudo apk add --no-cache \
    atk atk-bridge cups libdrm libgbm alsa-lib nss \
    libxss libxcomposite libxrandr libxdamage libxtst gtk+3.0 gdk-pixbuf pango
}

echo "Package manager detected: $PKG_MANAGER"
case "$PKG_MANAGER" in
  apt) install_apt ;;
  dnf) install_dnf ;;
  apk) install_apk ;;
esac

echo "Electron runtime dependencies installed."
echo "Next steps:"
echo "  cd /workspaces/BLCKBOLT-BROWSER"
echo "  npm ci"
echo "  npm run build:renderer && npm start"
