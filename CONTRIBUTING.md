# Contributing to NVM Windows Manager

First off, thank you for considering contributing to NVM Windows Manager! 🎉

It's people like you that make NVM Windows Manager such a great tool.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on what is best for the community
- Show empathy towards other community members

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates.

When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if possible**
- **Include your environment details:**
  - OS version (Windows 10, Windows 11, etc.)
  - NVM version
  - Node.js version(s) installed
  - App version

**Bug Report Template:**

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:

1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**

- OS: [e.g. Windows 11]
- NVM Version: [e.g. 1.1.11]
- App Version: [e.g. 1.0.0]
```

### 💡 Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues.

When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any alternatives you've considered**
- **Include mockups or examples if possible**

### 🔀 Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Follow the coding style** of the project
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Write clear commit messages**
6. **Submit a pull request**

#### Pull Request Process

1. Ensure your code follows the project's coding standards
2. Update the README.md with details of changes if applicable
3. Update the CHANGELOG.md with a note describing your changes
4. The PR will be merged once you have approval from a maintainer

## Development Setup

### Prerequisites

- Node.js (version 14 or higher)
- Git
- NVM for Windows installed

### Getting Started

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/nvm-win-ui.git
cd nvm-win-ui

# Install dependencies
npm install

# Run in development mode
npm start

# Build for production
npm run build
```

### Project Structure

```
nvm-win-ui/
├── main.js           # Electron main process
├── preload.js        # IPC bridge
├── index.html        # UI
├── renderer.js       # Frontend logic
├── package.json      # Dependencies and scripts
└── README.md         # Documentation
```

### Coding Standards

#### JavaScript Style

- Use ES6+ features
- Use `const` and `let`, avoid `var`
- Use arrow functions when appropriate
- Use async/await instead of callbacks
- Add comments for complex logic
- Keep functions small and focused

```javascript
// Good
async function loadVersions() {
  try {
    const result = await window.nvmAPI.listVersions();
    if (result.success) {
      displayVersions(result.versions);
    }
  } catch (error) {
    console.error('Error loading versions:', error);
  }
}

// Avoid
function loadVersions() {
  window.nvmAPI
    .listVersions()
    .then(function (result) {
      if (result.success) {
        displayVersions(result.versions);
      }
    })
    .catch(function (error) {
      console.error('Error loading versions:', error);
    });
}
```

#### HTML/CSS Style

- Use semantic HTML5 elements
- Keep CSS organized and commented
- Use CSS variables for theming
- Follow the existing design system
- Ensure responsive design

#### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**

```
feat(install): add support for installing multiple versions

fix(terminal): correct output color coding

docs(readme): update installation instructions

style(ui): improve button hover effects

refactor(api): simplify version parsing logic

perf(load): optimize version list rendering
```

## Testing

Before submitting a PR, please test:

1. **Installation of different Node.js versions**
   - Latest
   - LTS
   - Specific versions
   - Different architectures

2. **Version switching**
   - Switch to different versions
   - Verify terminal output
   - Check if change persists

3. **Package management**
   - Install global packages
   - Uninstall packages
   - List packages

4. **Settings**
   - Change root directory
   - Set proxy
   - Toggle architecture

5. **UI/UX**
   - All tabs work correctly
   - Buttons respond appropriately
   - Terminal output is clear
   - Animations are smooth

## Documentation

If you're adding new features, please update:

- README.md (if user-facing)
- CHANGELOG.md (always)
- Code comments (for complex logic)
- This file (if changing contribution process)

## Questions?

Feel free to:

- Open an issue for discussion
- Contact the maintainer: [Abdelrahman](https://github.com/Abdelrahman968)
- Join discussions in existing issues

## Recognition

Contributors will be recognized in:

- The README.md contributors section
- Release notes
- The about section in the app

Thank you for contributing! 🚀

---

Made with ❤️ by the NVM Windows Manager community
