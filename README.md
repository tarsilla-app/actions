# @tarsilla/actions

This repository contains a collection of reusable GitHub Actions designed to streamline workflows for Node.js projects. These actions focus on code analysis, deployment, and publishing, providing a robust foundation for maintaining high-quality and efficient workflows.

## Actions Overview

### Node Code Analysis
The **Node Code Analysis** action ([code-analysis/node/action.yml](code-analysis/node/action.yml)) helps ensure code quality and security by integrating tools like Snyk, OWASP Dependency-Check, and CodeQL. It validates configurations, installs dependencies, and runs various analysis tools based on the provided configuration.

#### Features:
- **Snyk Test**: Scans for vulnerabilities in dependencies. config = { snyk?: { types: ('test' | 'code-test')[], token: string } }
- **OWASP Dependency-Check**: Identifies known vulnerabilities in project dependencies. config = { owasp?: boolean }
- **Snyk Code Test**: Performs static code analysis for security issues. config = { snyk?: { types: ('test' | 'code-test')[], token: string } }
- **CodeQL Analysis**: Provides advanced code scanning for JavaScript and TypeScript. config = { codeql?: boolean }

### Node Deployment
The **Node Deployment** action ([deploy/node/action.yml](deploy/node/action.yml)) simplifies the deployment process for Node.js projects. It supports deploying Storybook to GitHub Pages and validates configurations to ensure smooth deployment.

#### Features:
- **Storybook Deployment**: Deploys Storybook to GitHub Pages with customizable build and installation steps. config = { storybook?: { host: string; install?: string; build?: string; path? string } }

### Node Publishing
The **Node Publishing** action ([publish/node/action.yml](publish/node/action.yml)) automates the process of publishing Node.js packages to npm. It validates configurations, sets up the Node.js environment, and integrates with the NPM Publish action.

#### Features:
- **NPM Publish**: Publishes packages to npm with customizable build and installation steps. config = { npm?: { token: string; install?: string; build?: string; publish? string } }

## Usage
Each action is designed to be reusable and configurable. Refer to the respective `action.yml` files for detailed input and output specifications.

## License
This repository is licensed under the [MIT License](LICENSE).