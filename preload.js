const { contextBridge, ipcRenderer } = require('electron');

// Expose secure API to renderer process
contextBridge.exposeInMainWorld('nvmAPI', {
  // Version management
  listVersions: () => ipcRenderer.invoke('nvm-list'),
  installVersion: (version, arch) => ipcRenderer.invoke('nvm-install', version, arch),
  useVersion: (version, arch) => ipcRenderer.invoke('nvm-use', version, arch),
  uninstallVersion: (version) => ipcRenderer.invoke('nvm-uninstall', version),
  getCurrentVersion: () => ipcRenderer.invoke('nvm-current'),
  getNVMVersion: () => ipcRenderer.invoke('nvm-version'),
  listAvailable: () => ipcRenderer.invoke('nvm-list-available'),
  
  // Configuration
  getRoot: () => ipcRenderer.invoke('nvm-root'),
  setRoot: (path) => ipcRenderer.invoke('nvm-set-root', path),
  getProxy: () => ipcRenderer.invoke('nvm-proxy'),
  setProxy: (proxyUrl) => ipcRenderer.invoke('nvm-set-proxy', proxyUrl),
  
  // Architecture
  getArch: () => ipcRenderer.invoke('nvm-arch'),
  setArch: (arch) => ipcRenderer.invoke('nvm-set-arch', arch),
  
  // Enable/Disable
  enableNVM: () => ipcRenderer.invoke('nvm-on'),
  disableNVM: () => ipcRenderer.invoke('nvm-off'),
  
  // System info
  getNPMVersion: () => ipcRenderer.invoke('npm-version'),
  getNodeArch: () => ipcRenderer.invoke('node-arch'),
  
  // NPM packages
  listGlobalPackages: () => ipcRenderer.invoke('npm-list-global'),
  installGlobalPackage: (packageName) => ipcRenderer.invoke('npm-install-global', packageName),
  uninstallGlobalPackage: (packageName) => ipcRenderer.invoke('npm-uninstall-global', packageName),
  
  // Utilities
  checkNVM: () => ipcRenderer.invoke('check-nvm'),
  getDiskUsage: () => ipcRenderer.invoke('get-disk-usage'),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  exportConfig: () => ipcRenderer.invoke('export-config')
});
