# 🚀 Quick Setup Guide - NVM Windows Manager

This guide will help you get NVM Windows Manager up and running in minutes!

## 📋 Prerequisites

### 1. Install NVM for Windows

Before using this application, you **must** have NVM for Windows installed:

1. Visit: https://github.com/coreybutler/nvm-windows/releases
2. Download `nvm-setup.exe` (latest version)
3. Run the installer
4. Follow the installation wizard
5. Restart your terminal/command prompt

**Verify Installation:**

```bash
nvm version
```

You should see the NVM version number.

### 2. Fix npm Warnings (Optional)

The warnings you're seeing are from outdated dependencies in electron-builder. Here's how to fix them:

#### Option 1: Ignore (Recommended)

These warnings are in dev dependencies and won't affect the built application. You can safely ignore them.

#### Option 2: Update Dependencies

```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Install with legacy peer deps
npm install --legacy-peer-deps
```

#### Option 3: Use npm overrides

Add this to your `package.json`:

```json
{
  "overrides": {
    "glob": "^11.0.0",
    "inflight": "^2.0.0",
    "tar": "^7.0.0"
  }
}
```

Then run:

```bash
npm install
```

## 🎯 Installation Methods

### Method 1: Run from Source (Development)

```bash
# 1. Extract the zip file
unzip nvm-win-ui.zip
cd nvm-win-ui

# 2. Install dependencies (first time only)
npm install

# 3. Run the application
npm start
```

### Method 2: Build Executable

```bash
# 1. Extract and install (same as above)
unzip nvm-win-ui.zip
cd nvm-win-ui
npm install

# 2. Build the application
npm run build

# 3. Find the installer in the dist/ folder
# Run: dist/NVM Windows Manager Setup 1.0.0.exe
```

## 🔧 First Run

When you first launch the application:

1. **Check NVM Status**
   - The app will automatically detect if NVM is installed
   - If not detected, you'll see an error message

2. **Load Versions**
   - All your currently installed Node.js versions will appear
   - The active version will be highlighted

3. **Explore Features**
   - Navigate through the tabs to see all features
   - Terminal output will show all operations

## 💡 Quick Start Guide

### Install Your First Version

1. Go to **Install** tab
2. Type `latest` or `lts` or a specific version like `20.10.0`
3. Click **Install**
4. Wait for completion
5. Check the **Versions** tab to see it

### Switch Versions

1. Go to **Versions** tab
2. Find the version you want
3. Click **Use** button
4. Check terminal for confirmation

### Install Global Package

1. Go to **Packages** tab
2. Enter package name (e.g., `nodemon`)
3. Click **Install**
4. Package appears in the list

## ⚠️ Common Issues & Solutions

### Issue 1: "NVM not found"

**Solution:**

```bash
# Verify NVM is installed
nvm version

# If not found, install NVM for Windows
# Then restart the app
```

### Issue 2: "Permission denied" errors

**Solution:**

- Right-click the app
- Select "Run as administrator"

### Issue 3: Version switch doesn't take effect

**Solution:**

- Close and reopen your terminal/command prompt
- Run `node -v` to verify

### Issue 4: npm warnings during install

**Solution:**
These are warnings from dev dependencies and can be safely ignored:

```bash
# Or fix with:
npm install --legacy-peer-deps
```

### Issue 5: Architecture mismatch

**Solution:**

- Go to **Settings** tab
- Set default architecture (32 or 64-bit)
- Reinstall the version

## 🎨 Customization

### Change Theme (Future Feature)

Currently, the app uses a cyberpunk dark theme. Light theme support is planned!

### Terminal History

- Terminal keeps last 50 lines
- Click "Clear" to reset
- All operations are logged

## 📁 File Locations

- **NVM Root**: Usually `C:\Users\YourName\AppData\Roaming\nvm`
- **Node Installations**: Inside NVM root directory
- **App Data**: Handled by Electron
- **Logs**: Terminal output within the app

## 🔐 Security Notes

1. **Administrator Rights**: NVM operations require admin rights
2. **Proxy Settings**: Configure in Settings if behind a firewall
3. **Safe Operations**: All destructive actions require confirmation

## 🚀 Performance Tips

1. **Limit Installed Versions**: Only keep versions you actually use
2. **Clear Terminal**: Regularly clear terminal to improve performance
3. **Close Unused Tabs**: Switch to the tab you're using
4. **Restart App**: If it feels slow, restart the application

## 📞 Need Help?

1. **Check Documentation**
   - README.md for features
   - CHANGELOG.md for updates
   - CONTRIBUTING.md for development

2. **Common Issues**: See above section

3. **GitHub Issues**: https://github.com/Abdelrahman968/nvm-win-ui/issues

4. **Contact**
   - GitHub: [@Abdelrahman968](https://github.com/Abdelrahman968)
   - LinkedIn: [Abdelrahman](https://www.linkedin.com/in/abdelrahman968)

## ✅ Verification Checklist

After installation, verify everything works:

- [ ] NVM version shows in System Info tab
- [ ] Can see installed versions (if any)
- [ ] Can install a new version
- [ ] Can switch between versions
- [ ] Terminal shows command output
- [ ] Can access all tabs
- [ ] Settings load correctly

## 🎓 Learning Resources

### Node.js

- Official Docs: https://nodejs.org/docs
- NPM Guide: https://docs.npmjs.com

### NVM Windows

- GitHub: https://github.com/coreybutler/nvm-windows
- Wiki: https://github.com/coreybutler/nvm-windows/wiki

## 🎉 You're Ready!

Congratulations! You're now ready to use NVM Windows Manager.

**Quick Commands:**

- Install latest: Go to Install → Type "latest" → Install
- Switch version: Go to Versions → Click "Use" on any version
- Install package: Go to Packages → Enter name → Install

**Enjoy!** 🚀

---

Made with ❤️ by [Abdelrahman](https://github.com/Abdelrahman968)
