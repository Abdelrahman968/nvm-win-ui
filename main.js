const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const util = require('util');
const execPromise = util.promisify(exec);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    backgroundColor: '#0a0e17',
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'assets/icon.png'),
    frame: true,
    titleBarStyle: 'default'
  });

  mainWindow.loadFile('index.html');
  
  // Open DevTools in development
  // mainWindow.webContents.openDevTools();
  
  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Execute NVM commands
async function executeNVMCommand(command) {
  try {
    const { stdout, stderr } = await execPromise(command, {
      shell: 'cmd.exe',
      encoding: 'utf8',
      timeout: 60000 // 60 second timeout
    });
    return { success: true, output: stdout || stderr };
  } catch (error) {
    return { success: false, output: error.message, error: error.stderr || error.message };
  }
}

// Get installed versions
ipcMain.handle('nvm-list', async () => {
  const result = await executeNVMCommand('nvm list');
  if (result.success) {
    const versions = parseVersionList(result.output);
    return { success: true, versions };
  }
  return result;
});

// Install version
ipcMain.handle('nvm-install', async (event, version, arch) => {
  const archFlag = arch ? ` ${arch}` : '';
  return await executeNVMCommand(`nvm install ${version}${archFlag}`);
});

// Use version
ipcMain.handle('nvm-use', async (event, version, arch) => {
  const archFlag = arch ? ` ${arch}` : '';
  return await executeNVMCommand(`nvm use ${version}${archFlag}`);
});

// Uninstall version
ipcMain.handle('nvm-uninstall', async (event, version) => {
  return await executeNVMCommand(`nvm uninstall ${version}`);
});

// Get current version
ipcMain.handle('nvm-current', async () => {
  return await executeNVMCommand('nvm current');
});

// Get NVM version
ipcMain.handle('nvm-version', async () => {
  return await executeNVMCommand('nvm version');
});

// Get available versions
ipcMain.handle('nvm-list-available', async () => {
  const result = await executeNVMCommand('nvm list available');
  if (result.success) {
    const available = parseAvailableVersions(result.output);
    return { success: true, available };
  }
  return result;
});

// Get NVM root directory
ipcMain.handle('nvm-root', async () => {
  return await executeNVMCommand('nvm root');
});

// Set NVM root directory
ipcMain.handle('nvm-set-root', async (event, path) => {
  return await executeNVMCommand(`nvm root ${path}`);
});

// Get proxy settings
ipcMain.handle('nvm-proxy', async () => {
  return await executeNVMCommand('nvm proxy');
});

// Set proxy
ipcMain.handle('nvm-set-proxy', async (event, proxyUrl) => {
  return await executeNVMCommand(`nvm proxy ${proxyUrl}`);
});

// Get architecture
ipcMain.handle('nvm-arch', async () => {
  return await executeNVMCommand('nvm arch');
});

// Set architecture
ipcMain.handle('nvm-set-arch', async (event, arch) => {
  return await executeNVMCommand(`nvm arch ${arch}`);
});

// Enable/disable NVM
ipcMain.handle('nvm-on', async () => {
  return await executeNVMCommand('nvm on');
});

ipcMain.handle('nvm-off', async () => {
  return await executeNVMCommand('nvm off');
});

// Get NPM version
ipcMain.handle('npm-version', async () => {
  return await executeNVMCommand('npm -v');
});

// Get Node architecture
ipcMain.handle('node-arch', async () => {
  return await executeNVMCommand('node -p "process.arch"');
});

// Get global npm packages
ipcMain.handle('npm-list-global', async () => {
  const result = await executeNVMCommand('npm list -g --depth=0 --json');
  if (result.success) {
    try {
      const packages = JSON.parse(result.output);
      return { success: true, packages: packages.dependencies || {} };
    } catch (e) {
      return { success: false, output: 'Failed to parse npm packages' };
    }
  }
  return result;
});

// Install global npm package
ipcMain.handle('npm-install-global', async (event, packageName) => {
  return await executeNVMCommand(`npm install -g ${packageName}`);
});

// Uninstall global npm package
ipcMain.handle('npm-uninstall-global', async (event, packageName) => {
  return await executeNVMCommand(`npm uninstall -g ${packageName}`);
});

// Check for NVM installation
ipcMain.handle('check-nvm', async () => {
  const result = await executeNVMCommand('nvm version');
  return { installed: result.success, version: result.output?.trim() };
});

// Get disk usage for Node installations
ipcMain.handle('get-disk-usage', async () => {
  try {
    const rootResult = await executeNVMCommand('nvm root');
    if (!rootResult.success) {
      return { success: false, size: 0 };
    }
    
    const nvmRoot = rootResult.output.trim().split('\n')[0].replace('Current Root: ', '').trim();
    
    if (!fs.existsSync(nvmRoot)) {
      return { success: false, size: 0 };
    }
    
    let totalSize = 0;
    const getDirectorySize = (dirPath) => {
      const files = fs.readdirSync(dirPath);
      files.forEach(file => {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
          totalSize += getDirectorySize(filePath);
        } else {
          totalSize += stats.size;
        }
      });
      return totalSize;
    };
    
    getDirectorySize(nvmRoot);
    const sizeInGB = (totalSize / (1024 * 1024 * 1024)).toFixed(2);
    
    return { success: true, size: sizeInGB };
  } catch (error) {
    return { success: false, size: 0, error: error.message };
  }
});

// Open folder dialog
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    return { success: true, path: result.filePaths[0] };
  }
  return { success: false };
});

// Export configuration
ipcMain.handle('export-config', async () => {
  try {
    const rootResult = await executeNVMCommand('nvm root');
    const currentResult = await executeNVMCommand('nvm current');
    const listResult = await executeNVMCommand('nvm list');
    
    const config = {
      timestamp: new Date().toISOString(),
      nvmRoot: rootResult.output?.trim(),
      currentVersion: currentResult.output?.trim(),
      installedVersions: parseVersionList(listResult.output || ''),
      appVersion: app.getVersion()
    };
    
    const result = await dialog.showSaveDialog(mainWindow, {
      title: 'Export Configuration',
      defaultPath: `nvm-config-${Date.now()}.json`,
      filters: [{ name: 'JSON', extensions: ['json'] }]
    });
    
    if (!result.canceled && result.filePath) {
      fs.writeFileSync(result.filePath, JSON.stringify(config, null, 2));
      return { success: true, path: result.filePath };
    }
    
    return { success: false };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Parse version list
function parseVersionList(output) {
  const versions = [];
  const lines = output.split('\n');
  
  for (let line of lines) {
    line = line.trim();
    
    if (!line || line.includes('No installations')) continue;
    
    const match = line.match(/(\*?)\s*v?(\d+\.\d+\.\d+)/);
    if (match) {
      const isActive = match[1] === '*';
      const version = match[2];
      
      versions.push({
        version,
        isActive,
        isLTS: line.toLowerCase().includes('lts'),
        arch: line.includes('64-bit') ? '64' : line.includes('32-bit') ? '32' : 'unknown'
      });
    }
  }
  
  return versions;
}

// Parse available versions
function parseAvailableVersions(output) {
  const versions = {
    lts: null,
    current: null,
    all: []
  };
  
  const lines = output.split('\n');
  
  for (let line of lines) {
    line = line.trim();
    
    if (line.includes('LTS') && !versions.lts) {
      const match = line.match(/(\d+\.\d+\.\d+)/);
      if (match) versions.lts = match[1];
    }
    
    if (line.includes('Current') && !versions.current) {
      const match = line.match(/(\d+\.\d+\.\d+)/);
      if (match) versions.current = match[1];
    }
    
    const versionMatch = line.match(/(\d+\.\d+\.\d+)/);
    if (versionMatch) {
      versions.all.push({
        version: versionMatch[1],
        isLTS: line.toLowerCase().includes('lts'),
        isCurrent: line.toLowerCase().includes('current')
      });
    }
  }
  
  return versions;
}
