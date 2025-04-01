# @tarsilla/actions

This repository contains a collection of reusable GitHub Actions designed to streamline workflows for Next.js, React and TypeScript library. These actions cover code analysis, dependency checks, publishing and deployment.

## Actions Overview

### 1. **Snyk Test**
- **Path**: [code-analysis/node/snyk/test/action.yml](code-analysis/node/snyk/test/action.yml)
- **Description**: Executes Snyk tests to identify vulnerabilities in your project dependencies.
- **Inputs**:
  - `token` (required): Snyk API token.
- **Usage**:
```yaml
  - name: Run Snyk Test
    uses: tarsilla-app/actions/code-analysis/node/snyk/test@main
    with:
      token: ${{ secrets.SNYK_TOKEN }}
```

### 2. **Snyk Code Test**
- **Path**: [code-analysis/node/snyk/code-test/action.yml](code-analysis/node/snyk/code-test/action.yml)
- **Description**: Executes Snyk code tests to identify vulnerabilities in your source code.
- **Inputs**:
  - `token` (required): Snyk API token.
- **Usage**:
```yaml
  - name: Run Snyk Code Test
    uses: tarsilla-app/actions/code-analysis/node/snyk/code-test@main
    with:
      token: ${{ secrets.SNYK_TOKEN }}
```

### 3. **OWASP Dependency-Check**
- **Path**: [code-analysis/node/owasp/action.yml](code-analysis/node/owasp/action.yml)
- **Description**: Runs OWASP Dependency-Check to identify vulnerabilities in project dependencies.
- **Inputs**:
  - `suppression` (optional): indicates if using suppression (suppressions.xml in project root).
- **Usage**:
```yaml
  - name: Run OWASP Dependency-Check
    uses: tarsilla-app/actions/code-analysis/node/owasp@main
    with:
      suppression: true
```

### 4. **CodeQL Analysis**
- **Path**: [code-analysis/node/codeql/action.yml](code-analysis/node/codeql/action.yml)
- **Description**: Executes CodeQL analysis to identify security vulnerabilities and code quality issues.
- **Usage**:
```yaml
  - name: Run CodeQL Analysis
    uses: tarsilla-app/actions/code-analysis/node/codeql@main
```

### 5. **NPM Publish**
- **Path**: [publish/npm/action.yml](publish/npm/action.yml)
- **Description**: Publishes the project to NPM using semantic versioning.
- **Inputs**:
  - `token` (required): NPM authentication token.
- **Usage**:
```yaml
  - name: Run Snyk Test
    uses: tarsilla-app/actions/publish/npm@main
    with:
      token: ${{ secrets.NPM_TOKEN }}
```

### 6. **Deploy Storybook to GitHub Pages**
- **Path**: [deploy/github-pages/storybook/action.yml](deploy/github-pages/storybook/action.yml)
- **Description**: Deploys Storybook to GitHub Pages.
- **Inputs**:
  - `path` (optional): Path to the Storybook static files.
  - `install` (optional): Command to install dependencies.
  - `build` (optional): Command to build Storybook.
- **Usage**:
```yaml
  - name: Run Snyk Test
    uses: tarsilla-app/actions/deploy/github-pages/storybook@main
    with:
      path: storybook-static
      install: npm ci
      build: npm run build-storybook
```
