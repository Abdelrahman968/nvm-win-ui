// Check if API is available
if (!window.nvmAPI) {
  console.error('NVM API not available');
  showToast('NVM API not available. Please restart the application.', 'error');
}

let currentTab = 'versions';
let installedVersionsCache = [];
let globalPackagesCache = {};

// ===== TAB MANAGEMENT =====
function switchTab(tabName) {
  // Update buttons
  document
    .querySelectorAll('.tab-btn')
    .forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  // Update content
  document
    .querySelectorAll('.tab-content')
    .forEach(content => content.classList.remove('active'));
  document.getElementById(`tab-${tabName}`).classList.add('active');

  currentTab = tabName;

  // Load data for specific tabs
  if (tabName === 'packages') {
    loadGlobalPackages();
  } else if (tabName === 'settings') {
    loadSettings();
  }
}

// ===== TERMINAL FUNCTIONS =====
function addTerminalLine(text, type = 'output') {
  const terminal = document.getElementById('terminal');
  const line = document.createElement('div');
  line.className = 'terminal-line';

  const timestamp = new Date().toLocaleTimeString();

  if (type === 'command') {
    line.innerHTML = `<span class="terminal-prompt">[${timestamp}] $</span> <span class="terminal-output">${text}</span>`;
  } else if (type === 'success') {
    line.innerHTML = `<span class="terminal-success">✓ ${text}</span>`;
  } else if (type === 'error') {
    line.innerHTML = `<span class="terminal-error">✗ ${text}</span>`;
  } else if (type === 'warning') {
    line.innerHTML = `<span class="terminal-warning">⚠ ${text}</span>`;
  } else {
    line.innerHTML = `<span class="terminal-output">${text}</span>`;
  }

  terminal.appendChild(line);
  terminal.scrollTop = terminal.scrollHeight;

  // Keep only last 50 lines
  while (terminal.children.length > 50) {
    terminal.removeChild(terminal.firstChild);
  }
}

function clearTerminal() {
  const terminal = document.getElementById('terminal');
  terminal.innerHTML = `
        <div class="terminal-line">
            <span class="terminal-prompt">$</span> <span class="terminal-output">Terminal cleared</span>
        </div>
    `;
}

// ===== VERSION MANAGEMENT =====
async function loadVersions() {
  try {
    addTerminalLine('nvm list', 'command');
    addTerminalLine('Loading installed versions...');

    const result = await window.nvmAPI.listVersions();

    if (result.success && result.versions) {
      installedVersionsCache = result.versions;
      displayVersions(result.versions);
      addTerminalLine(
        `Found ${result.versions.length} installed version(s)`,
        'success'
      );

      // Update stats
      document.getElementById('totalVersions').textContent =
        result.versions.length;

      // Find active version
      const activeVersion = result.versions.find(v => v.isActive);
      if (activeVersion) {
        document.getElementById('nodeVersion').innerHTML = `
                    <span class="status-indicator status-online"></span>v${activeVersion.version}
                `;
      }

      // Load disk usage
      loadDiskUsage();
    } else {
      addTerminalLine('No versions installed', 'warning');
      displayEmptyState();
    }
  } catch (error) {
    addTerminalLine('Error loading versions: ' + error.message, 'error');
    console.error(error);
    showToast('Failed to load versions', 'error');
  }
}

function displayVersions(versions) {
  const container = document.getElementById('installedVersions');
  container.innerHTML = '';

  if (versions.length === 0) {
    displayEmptyState();
    return;
  }

  versions.forEach(version => {
    const item = document.createElement('div');
    item.className = 'version-item' + (version.isActive ? ' active' : '');

    const badges = [];
    if (version.isActive) {
      badges.push('<span class="version-badge badge-active">ACTIVE</span>');
    }
    if (version.isLTS) {
      badges.push('<span class="version-badge badge-lts">LTS</span>');
    }

    const useButton = version.isActive
      ? '<button class="btn btn-small btn-primary" disabled>In Use</button>'
      : `<button class="btn btn-small btn-secondary" onclick="useVersion('${version.version}')">Use</button>`;

    item.innerHTML = `
            <div class="version-info">
                <span class="version-number">v${version.version}</span>
                ${badges.join('')}
                <span style="font-size: 12px; color: var(--text-muted);">${version.arch}-bit</span>
            </div>
            <div class="version-actions">
                ${useButton}
                <button class="btn btn-small btn-danger" onclick="confirmUninstall('${version.version}')">Delete</button>
            </div>
        `;

    container.appendChild(item);
  });
}

function displayEmptyState() {
  const container = document.getElementById('installedVersions');
  container.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">📦</div>
            <div class="empty-text">No versions installed</div>
            <div class="empty-subtext">Install a version from the Install tab</div>
        </div>
    `;
}

async function installVersion() {
  const version = document.getElementById('versionInput').value.trim();
  const arch = document.getElementById('archSelect').value;

  if (!version) {
    addTerminalLine('Please enter a version number', 'error');
    showToast('Version number required', 'error');
    return;
  }

  try {
    addTerminalLine(
      `nvm install ${version}${arch ? ' ' + arch : ''}`,
      'command'
    );
    addTerminalLine(`Downloading Node.js ${version}...`);
    showToast(`Installing Node.js ${version}...`, 'info');

    const result = await window.nvmAPI.installVersion(version, arch);

    if (result.success) {
      addTerminalLine('Installation completed successfully!', 'success');
      addTerminalLine(result.output);
      showToast(`Node.js ${version} installed successfully!`, 'success');

      // Reload versions
      setTimeout(() => {
        loadVersions();
        switchTab('versions');
      }, 1000);

      // Clear input
      document.getElementById('versionInput').value = '';
    } else {
      addTerminalLine('Installation failed', 'error');
      addTerminalLine(result.output || result.error, 'error');
      showToast('Installation failed', 'error');
    }
  } catch (error) {
    addTerminalLine('Installation error: ' + error.message, 'error');
    console.error(error);
    showToast('Installation error', 'error');
  }
}

function quickInstall(type) {
  document.getElementById('versionInput').value = type;
  installVersion();
}

async function useVersion(version) {
  try {
    addTerminalLine(`nvm use ${version}`, 'command');
    addTerminalLine(`Switching to Node.js ${version}...`);

    const result = await window.nvmAPI.useVersion(version);

    if (result.success) {
      addTerminalLine(`Successfully switched to v${version}`, 'success');
      addTerminalLine(result.output);
      showToast(`Now using Node.js v${version}`, 'success');

      // Reload versions and system info
      setTimeout(() => {
        loadVersions();
        loadSystemInfo();
      }, 500);
    } else {
      addTerminalLine('Failed to switch version', 'error');
      addTerminalLine(result.output || result.error, 'error');
      showToast('Failed to switch version', 'error');
    }
  } catch (error) {
    addTerminalLine('Switch error: ' + error.message, 'error');
    console.error(error);
    showToast('Switch error', 'error');
  }
}

let versionToUninstall = null;
function confirmUninstall(version) {
  versionToUninstall = version;
  showConfirmModal(
    `Are you sure you want to uninstall Node.js v${version}?`,
    uninstallVersion
  );
}

async function uninstallVersion() {
  if (!versionToUninstall) return;

  const version = versionToUninstall;
  closeModal();

  try {
    addTerminalLine(`nvm uninstall ${version}`, 'command');
    addTerminalLine(`Uninstalling Node.js ${version}...`);

    const result = await window.nvmAPI.uninstallVersion(version);

    if (result.success) {
      addTerminalLine(`Successfully uninstalled v${version}`, 'success');
      addTerminalLine(result.output);
      showToast(`Node.js v${version} uninstalled`, 'success');

      // Reload versions
      setTimeout(loadVersions, 500);
    } else {
      addTerminalLine('Uninstall failed', 'error');
      addTerminalLine(result.output || result.error, 'error');
      showToast('Uninstall failed', 'error');
    }
  } catch (error) {
    addTerminalLine('Uninstall error: ' + error.message, 'error');
    console.error(error);
    showToast('Uninstall error', 'error');
  }

  versionToUninstall = null;
}

// ===== GLOBAL PACKAGES =====
async function loadGlobalPackages() {
  try {
    addTerminalLine('npm list -g --depth=0', 'command');
    addTerminalLine('Loading global packages...');

    const result = await window.nvmAPI.listGlobalPackages();

    if (result.success && result.packages) {
      globalPackagesCache = result.packages;
      displayGlobalPackages(result.packages);
      addTerminalLine(
        `Found ${Object.keys(result.packages).length} global package(s)`,
        'success'
      );
    } else {
      document.getElementById('packageList').innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📦</div>
                    <div class="empty-text">No global packages</div>
                </div>
            `;
      addTerminalLine('No global packages found', 'warning');
    }
  } catch (error) {
    addTerminalLine('Error loading packages: ' + error.message, 'error');
    console.error(error);
  }
}

function displayGlobalPackages(packages) {
  const container = document.getElementById('packageList');
  container.innerHTML = '';

  const packageNames = Object.keys(packages);

  if (packageNames.length === 0) {
    container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📦</div>
                <div class="empty-text">No global packages</div>
            </div>
        `;
    return;
  }

  packageNames.forEach(name => {
    const pkg = packages[name];
    const item = document.createElement('div');
    item.className = 'package-item';

    item.innerHTML = `
            <div>
                <div class="package-name">${name}</div>
                <div class="package-version">v${pkg.version || 'unknown'}</div>
            </div>
            <button class="btn btn-small btn-danger" onclick="confirmUninstallPackage('${name}')">
                Uninstall
            </button>
        `;

    container.appendChild(item);
  });
}

async function installGlobalPackage() {
  const packageName = document.getElementById('packageInput').value.trim();

  if (!packageName) {
    addTerminalLine('Please enter a package name', 'error');
    showToast('Package name required', 'error');
    return;
  }

  try {
    addTerminalLine(`npm install -g ${packageName}`, 'command');
    addTerminalLine(`Installing ${packageName}...`);
    showToast(`Installing ${packageName}...`, 'info');

    const result = await window.nvmAPI.installGlobalPackage(packageName);

    if (result.success) {
      addTerminalLine(`${packageName} installed successfully!`, 'success');
      showToast(`${packageName} installed!`, 'success');

      // Reload packages
      setTimeout(loadGlobalPackages, 1000);

      // Clear input
      document.getElementById('packageInput').value = '';
    } else {
      addTerminalLine('Installation failed', 'error');
      addTerminalLine(result.output || result.error, 'error');
      showToast('Installation failed', 'error');
    }
  } catch (error) {
    addTerminalLine('Installation error: ' + error.message, 'error');
    console.error(error);
    showToast('Installation error', 'error');
  }
}

let packageToUninstall = null;
function confirmUninstallPackage(packageName) {
  packageToUninstall = packageName;
  showConfirmModal(
    `Are you sure you want to uninstall ${packageName}?`,
    uninstallGlobalPackage
  );
}

async function uninstallGlobalPackage() {
  if (!packageToUninstall) return;

  const packageName = packageToUninstall;
  closeModal();

  try {
    addTerminalLine(`npm uninstall -g ${packageName}`, 'command');
    addTerminalLine(`Uninstalling ${packageName}...`);

    const result = await window.nvmAPI.uninstallGlobalPackage(packageName);

    if (result.success) {
      addTerminalLine(`${packageName} uninstalled successfully`, 'success');
      showToast(`${packageName} uninstalled`, 'success');

      // Reload packages
      setTimeout(loadGlobalPackages, 500);
    } else {
      addTerminalLine('Uninstall failed', 'error');
      addTerminalLine(result.output || result.error, 'error');
      showToast('Uninstall failed', 'error');
    }
  } catch (error) {
    addTerminalLine('Uninstall error: ' + error.message, 'error');
    console.error(error);
    showToast('Uninstall error', 'error');
  }

  packageToUninstall = null;
}

// ===== SYSTEM INFO =====
async function loadSystemInfo() {
  try {
    // Current Node version
    const nodeResult = await window.nvmAPI.getCurrentVersion();
    if (nodeResult.success) {
      const version = nodeResult.output.trim().replace(/^v/, '');
      document.getElementById('nodeVersion').innerHTML = `
                <span class="status-indicator status-online"></span>v${version}
            `;
    }

    // NPM version
    const npmResult = await window.nvmAPI.getNPMVersion();
    if (npmResult.success) {
      document.getElementById('npmVersion').textContent =
        'v' + npmResult.output.trim();
    }

    // Architecture
    const archResult = await window.nvmAPI.getNodeArch();
    if (archResult.success) {
      const arch = archResult.output.trim();
      document.getElementById('nodeArch').textContent =
        arch === 'x64'
          ? '64-bit (x64)'
          : arch === 'x32' || arch === 'ia32'
            ? '32-bit (x32)'
            : arch;
    }

    // NVM version
    const nvmResult = await window.nvmAPI.getNVMVersion();
    if (nvmResult.success) {
      document.getElementById('nvmVersion').textContent =
        'v' + nvmResult.output.trim();
    }
  } catch (error) {
    console.error('Error loading system info:', error);
  }
}

async function loadDiskUsage() {
  try {
    const result = await window.nvmAPI.getDiskUsage();
    if (result.success) {
      document.getElementById('diskUsage').textContent = result.size + ' GB';
    }
  } catch (error) {
    console.error('Error loading disk usage:', error);
  }
}

async function loadAvailableVersions() {
  try {
    const result = await window.nvmAPI.listAvailable();

    if (result.success && result.available) {
      if (result.available.current) {
        document.getElementById('latestVersion').textContent =
          'v' + result.available.current;
      }
      if (result.available.lts) {
        document.getElementById('ltsVersion').textContent =
          'v' + result.available.lts;
      }
    }
  } catch (error) {
    console.error('Error loading available versions:', error);
  }
}

// ===== SETTINGS =====
async function loadSettings() {
  try {
    // Load NVM root
    const rootResult = await window.nvmAPI.getRoot();
    if (rootResult.success) {
      const root = rootResult.output
        .trim()
        .split('\n')[0]
        .replace('Current Root: ', '')
        .trim();
      document.getElementById('nvmRoot').textContent = root;
    }

    // Load proxy settings
    const proxyResult = await window.nvmAPI.getProxy();
    if (proxyResult.success) {
      const proxy = proxyResult.output.trim();
      document.getElementById('proxySettings').textContent =
        proxy && proxy !== 'none' ? proxy : 'Not configured';
    }

    // Load current arch
    const archResult = await window.nvmAPI.getArch();
    if (archResult.success) {
      document.getElementById('currentArch').textContent =
        archResult.output.trim() + '-bit';
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
}

async function changeRoot() {
  try {
    const result = await window.nvmAPI.selectFolder();
    if (result.success && result.path) {
      const setResult = await window.nvmAPI.setRoot(result.path);
      if (setResult.success) {
        addTerminalLine(`NVM root changed to: ${result.path}`, 'success');
        showToast('Root directory updated', 'success');
        loadSettings();
      }
    }
  } catch (error) {
    addTerminalLine('Error changing root: ' + error.message, 'error');
    showToast('Failed to change root', 'error');
  }
}

async function setProxy() {
  const proxyUrl = document.getElementById('proxyInput').value.trim();

  try {
    const result = await window.nvmAPI.setProxy(proxyUrl || 'none');
    if (result.success) {
      addTerminalLine(
        `Proxy ${proxyUrl ? 'set to: ' + proxyUrl : 'cleared'}`,
        'success'
      );
      showToast('Proxy settings updated', 'success');
      loadSettings();
      document.getElementById('proxyInput').value = '';
    }
  } catch (error) {
    addTerminalLine('Error setting proxy: ' + error.message, 'error');
    showToast('Failed to set proxy', 'error');
  }
}

async function setArchitecture(arch) {
  try {
    const result = await window.nvmAPI.setArch(arch);
    if (result.success) {
      addTerminalLine(`Default architecture set to: ${arch}-bit`, 'success');
      showToast(`Architecture set to ${arch}-bit`, 'success');
      loadSettings();
    }
  } catch (error) {
    addTerminalLine('Error setting architecture: ' + error.message, 'error');
    showToast('Failed to set architecture', 'error');
  }
}

async function toggleNVM(enabled) {
  try {
    const result = enabled
      ? await window.nvmAPI.enableNVM()
      : await window.nvmAPI.disableNVM();

    if (result.success) {
      addTerminalLine(`NVM ${enabled ? 'enabled' : 'disabled'}`, 'success');
      showToast(`NVM ${enabled ? 'enabled' : 'disabled'}`, 'success');
    } else {
      document.getElementById('nvmEnabled').checked = !enabled;
      addTerminalLine(
        `Failed to ${enabled ? 'enable' : 'disable'} NVM`,
        'error'
      );
      showToast('Operation failed', 'error');
    }
  } catch (error) {
    document.getElementById('nvmEnabled').checked = !enabled;
    addTerminalLine('Toggle error: ' + error.message, 'error');
    showToast('Toggle failed', 'error');
  }
}

async function exportConfiguration() {
  try {
    const result = await window.nvmAPI.exportConfig();
    if (result.success) {
      addTerminalLine(`Configuration exported to: ${result.path}`, 'success');
      showToast('Configuration exported successfully', 'success');
    }
  } catch (error) {
    addTerminalLine('Export error: ' + error.message, 'error');
    showToast('Export failed', 'error');
  }
}

// ===== UI HELPERS =====
function showConfirmModal(message, onConfirm) {
  document.getElementById('modalMessage').textContent = message;
  document.getElementById('confirmModal').classList.add('active');
  document.getElementById('confirmButton').onclick = onConfirm;
}

function closeModal() {
  document.getElementById('confirmModal').classList.remove('active');
}

function confirmAction(message, action) {
  showConfirmModal(message, () => {
    closeModal();
    action();
  });
}

function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'toast ' + type + ' show';

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function openExternal(url) {
  // Using shell.openExternal is handled in main process
  // For now, we'll log it
  addTerminalLine(`Opening: ${url}`, 'command');
  window.open(url, '_blank');
}

// ===== EVENT LISTENERS =====
document.getElementById('confirmModal').addEventListener('click', e => {
  if (e.target.id === 'confirmModal') {
    closeModal();
  }
});

document.getElementById('versionInput').addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    installVersion();
  }
});

document.getElementById('packageInput').addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    installGlobalPackage();
  }
});

document.getElementById('proxyInput').addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    setProxy();
  }
});

// ===== INITIALIZATION =====
window.addEventListener('DOMContentLoaded', async () => {
  addTerminalLine('NVM Windows Manager initialized', 'success');
  addTerminalLine('System ready', 'success');

  // Check NVM installation
  const nvmCheck = await window.nvmAPI.checkNVM();
  if (nvmCheck.installed) {
    addTerminalLine(`NVM version ${nvmCheck.version} detected`, 'success');

    // Load initial data
    loadVersions();
    loadSystemInfo();
    loadAvailableVersions();
  } else {
    addTerminalLine('NVM not found! Please install NVM for Windows', 'error');
    showToast('NVM not installed', 'error');
    document.getElementById('installedVersions').innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">⚠️</div>
                <div class="empty-text">NVM Not Installed</div>
                <div class="empty-subtext">Please install NVM for Windows first</div>
            </div>
        `;
  }
});
