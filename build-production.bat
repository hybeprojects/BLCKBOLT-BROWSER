@echo off
REM Production Build Script for BLCKBOLT-BROWSER (Windows)
REM Builds Windows (.exe, installer) executables

setlocal enabledelayedexpansion

echo.
echo ================================================
echo BLCKBOLT-BROWSER Production Build Script
echo ================================================
echo.

REM Check if Node.js and npm are installed
where node >nul 2>nul
if errorlevel 1 (
    echo Error: Node.js is not installed
    exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
    echo Error: npm is not installed
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VER=%%i
for /f "tokens=*" %%i in ('npm -v') do set NPM_VER=%%i

echo Node.js version: %NODE_VER%
echo npm version: %NPM_VER%
echo.

REM Step 1: Clean previous builds
echo [1/5] Cleaning previous builds...
if exist dist rmdir /s /q dist
if exist out rmdir /s /q out
if exist renderer\.next rmdir /s /q renderer\.next
echo Done!
echo.

REM Step 2: Install dependencies
echo [2/5] Installing dependencies...
call npm ci --prefer-offline
if errorlevel 1 (
    echo Error: Failed to install dependencies
    exit /b 1
)
echo Done!
echo.

REM Step 3: Build renderer
echo [3/5] Building Next.js renderer...
call npm run build:renderer
if errorlevel 1 (
    echo Error: Renderer build failed
    exit /b 1
)
echo Done!
echo.

REM Step 4: Verify renderer output
if not exist renderer\out (
    echo Error: Renderer output not found at renderer\out
    exit /b 1
)
echo Renderer output verified!
echo.

REM Step 5: Build Windows packages
echo [4/5] Building Windows packages (NSIS Installer + Portable EXE)...
call npx electron-builder --win nsis portable -p never
if errorlevel 1 (
    echo Error: Build failed
    exit /b 1
)
echo Done!
echo.

REM List artifacts
echo [5/5] Build Summary
echo.
echo Output directory: .\dist
echo.
echo Generated Windows artifacts:
for %%f in (dist\*.exe, dist\*.msi, dist\*.nsis) do (
    if exist "%%f" (
        for /f %%z in ('powershell -NoProfile -Command "[math]::Round((Get-Item \"%%f\").Length / 1MB, 2)"') do (
            echo   %%~nxf ^(%%zMB^)
        )
    )
)

echo.
echo ================================================
echo Production build completed successfully!
echo ================================================
echo.
echo You can now distribute these executables:
echo - NSIS Installer: dist\BLCKBOLT Browser Setup.exe
echo - Portable EXE: dist\BLCKBOLT Browser.exe
echo - ZIP Archive: dist\BLCKBOLT Browser-0.1.0-win.zip
echo.

endlocal
