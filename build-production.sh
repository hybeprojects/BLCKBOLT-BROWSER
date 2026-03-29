#!/bin/bash
# Production Build Script for BLCKBOLT-BROWSER
# Builds Windows (.exe, installer) and Linux (AppImage, deb) executables

set -e

echo "================================================"
echo "BLCKBOLT-BROWSER Production Build Script"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js and npm are installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

echo -e "${BLUE}Node.js version:$(node -v)${NC}"
echo -e "${BLUE}npm version:$(npm -v)${NC}"
echo ""

# Step 1: Clean previous builds
echo -e "${YELLOW}Step 1: Cleaning previous builds...${NC}"
rm -rf dist/ out/ renderer/out/.next
echo -e "${GREEN}✓ Cleaned${NC}"
echo ""

# Step 2: Install dependencies
echo -e "${YELLOW}Step 2: Installing dependencies...${NC}"
npm ci --prefer-offline
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Step 3: Build renderer (Next.js static export)
echo -e "${YELLOW}Step 3: Building Next.js renderer...${NC}"
npm run build:renderer
echo -e "${GREEN}✓ Renderer built${NC}"
echo ""

# Step 4: Check if renderer output exists
if [ ! -d "renderer/out" ]; then
    echo -e "\033[0;31m❌ Renderer output not found at renderer/out${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Renderer output verified${NC}"
echo ""

# Detect OS and build accordingly
case "$(uname -s)" in
    Linux*)
        OS="Linux"
        echo -e "${BLUE}Building for Linux...${NC}"
        echo ""
        
        echo -e "${YELLOW}Step 4: Building Linux packages (AppImage + deb)...${NC}"
        npx electron-builder --linux appimage deb -p never
        echo -e "${GREEN}✓ Linux builds complete${NC}"
        echo ""
        
        # List build artifacts
        echo -e "${BLUE}Generated Linux artifacts:${NC}"
        ls -lh dist/*.{AppImage,deb} 2>/dev/null | awk '{print "  " $9 " (" $5 ")"}'
        ;;
    
    MINGW*|MSYS*|CYGWIN*)
        OS="Windows (WSL/WSL2)"
        echo -e "${BLUE}Building for Windows from WSL...${NC}"
        echo ""
        
        echo -e "${YELLOW}Step 4: Building Windows packages (NSIS Installer + Portable)...${NC}"
        npx electron-builder --win nsis portable -p never
        echo -e "${GREEN}✓ Windows builds complete${NC}"
        echo ""
        
        # List build artifacts
        echo -e "${BLUE}Generated Windows artifacts:${NC}"
        ls -lh dist/*.exe 2>/dev/null | awk '{print "  " $9 " (" $5 ")"}'
        ls -lh dist/*.msi 2>/dev/null | awk '{print "  " $9 " (" $5 ")"}'
        ;;
    
    Darwin*)
        OS="macOS"
        echo -e "${BLUE}Building for macOS...${NC}"
        echo ""
        
        echo -e "${YELLOW}Step 4: Building macOS packages...${NC}"
        npx electron-builder --mac dmg zip -p never
        echo -e "${GREEN}✓ macOS builds complete${NC}"
        echo ""
        
        # List build artifacts
        echo -e "${BLUE}Generated macOS artifacts:${NC}"
        ls -lh dist/*.dmg 2>/dev/null | awk '{print "  " $9 " (" $5 ")"}'
        ;;
    
    *)
        echo -e "\033[0;31m❌ Unsupported OS: $(uname -s)${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${YELLOW}Step 5: Build Summary${NC}"
echo -e "${GREEN}✓ Build complete!${NC}"
echo ""
echo -e "${BLUE}Output directory: ./dist${NC}"
echo ""

# List all artifacts
if [ -d "dist" ]; then
    echo "All generated artifacts:"
    find dist -type f -executable -o -type f \( -name "*.exe" -o -name "*.deb" -o -name "*.AppImage" -o -name "*.dmg" \) | while read file; do
        size=$(ls -lh "$file" | awk '{print $5}')
        name=$(basename "$file")
        echo "  📦 $name ($size)"
    done
fi

echo ""
echo "================================================"
echo "Production build completed successfully! 🎉"
echo "================================================"
