# Changelog

All notable changes to NVM Windows Manager will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-02-09

### 🎉 Initial Release

This is the first official release of NVM Windows Manager!

### ✨ Added

#### Version Management

- View all installed Node.js versions with real-time status
- Install any Node.js version (latest, LTS, or specific version)
- Switch between installed versions with one click
- Uninstall unused versions
- Architecture selection (32-bit, 64-bit, or both)
- Version badges showing Active, LTS, and Current status
- Disk usage tracking for all Node.js installations

#### Global Package Management

- List all globally installed npm packages
- Install global packages through the UI
- Uninstall global packages
- Quick-install buttons for popular packages (nodemon, typescript, yarn, pnpm, pm2)
- Real-time package version display

#### User Interface

- Modern cyberpunk-inspired design with neon accents
- Dark theme optimized for developers
- Tabbed navigation (Versions, Install, Packages, Settings, System Info)
- Responsive layout
- Smooth animations and transitions
- Real-time terminal output display
- Color-coded command results (success, error, warning)

#### Configuration & Settings

- Change NVM root directory
- Configure proxy settings for downloads
- Set default architecture (32-bit or 64-bit)
- Enable/disable NVM functionality
- Export configuration to JSON file
- View all NVM settings in one place

#### System Information

- Display current Node.js version with status indicator
- Show NPM version
- Display system architecture
- Show NVM version
- Real-time system stats

#### Terminal Features

- Live command output
- Command history (last 50 commands)
- Color-coded output (success/error/warning)
- Timestamps for each command
- Clear terminal option
- Auto-scroll to latest output

#### Developer Experience

- One-click installation with pre-built installers
- Automatic version detection
- Error handling with user-friendly messages
- Toast notifications for important actions
- Confirmation dialogs for destructive actions
- Detailed logging in terminal

### 🔧 Technical Features

- Built with Electron for cross-platform compatibility
- Secure IPC communication between processes
- Context isolation for security
- No direct DOM manipulation from main process
- Proper error handling and user feedback
- Efficient state management

### 📚 Documentation

- Comprehensive README with installation instructions
- Usage guide with screenshots
- Troubleshooting section
- Contributing guidelines
- MIT License

### 🎨 Design Highlights

- Custom Rajdhani and Fira Code fonts
- Gradient backgrounds and glowing effects
- Scanline animation effects
- Pulse animations on active elements
- Smooth page transitions
- Responsive grid layouts

### 🛡️ Security

- Context isolation enabled
- No node integration in renderer
- Secure preload script
- Input validation
- Safe external link handling

### ⚡ Performance

- Lazy loading of tab content
- Efficient re-rendering
- Minimal DOM manipulation
- Optimized animations
- Fast startup time

### 📦 Build & Distribution

- Windows installer (NSIS)
- Support for both 32-bit and 64-bit systems
- Auto-update capability (planned)
- Portable version (planned)

## [Unreleased]

### 🚀 Planned Features

- Auto-update functionality
- Installation wizard for first-time users
- Dark/Light theme toggle
- Custom color schemes
- .nvmrc file support for automatic version switching
- Project-specific version management
- Backup and restore all global packages
- Version comparison tool
- Download progress indicators
- Scheduled version updates
- Statistics and usage analytics
- Keyboard shortcuts
- System tray integration
- Multiple language support
- Import/export global package lists

### 🔧 Planned Improvements

- Faster version switching
- Better error messages
- Improved terminal output formatting
- Enhanced search and filter options
- Bulk operations (install/uninstall multiple versions)
- Version changelogs display
- Integration with package managers (npm, yarn, pnpm)

### 🐛 Known Issues

- None reported yet

---

## Version History

- **1.0.0** - Initial release (February 9, 2025)

## How to Update

### For Users

1. Download the latest installer from the [Releases](https://github.com/Abdelrahman968/nvm-win-ui/releases) page
2. Run the installer
3. The new version will replace the old one while preserving your settings

### For Developers

```bash
git pull origin main
npm install
npm start
```

## Migration Guide

### From Command Line NVM

NVM Windows Manager works alongside the command-line version. No migration needed!

- All your existing installations are automatically detected
- Global packages are preserved
- Settings are maintained
- You can still use `nvm` commands in terminal

## Support

If you encounter any issues or have feature requests:

1. Check the [Troubleshooting](README.md#-troubleshooting) section
2. Search [existing issues](https://github.com/Abdelrahman968/nvm-win-ui/issues)
3. Create a [new issue](https://github.com/Abdelrahman968/nvm-win-ui/issues/new) with details

---

**Thank you for using NVM Windows Manager!** 🚀

Made with ❤️ by [Abdelrahman](https://github.com/Abdelrahman968)
