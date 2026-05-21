# 📈 Trend Insights & Analytics Dashboard

A premium, interactive, and beautiful analytics dashboard to track emerging technologies, financial trends, and consumer hotspots. Built with **React, Vite, and custom SVG visualizers**, this application showcases high-end frontend craftsmanship, fully fluid interactions, and automated multi-stage CI/CD pipelines.

This repository comes pre-configured with a robust **GitHub Actions Workflow** that automatically builds, tests, lints, and hosts the visualizer directly on **GitHub Pages**.

---

## 🎨 Application Showcases & Highlights
- **Stunning Dark Space Aesthetics**: Crafted with vibrant HSL design tokens, custom radial glow gradients, glassmorphism card halos, and subtle micro-animations.
- **Interactive Custom SVG Area Charts**: Multi-curve interest trackers where hovering over points dynamically renders absolute tooltips and updates coordinate highlights.
- **Dynamic Hotspot Selector**: Fluid responsive layout to switch datasets seamlessly, showcasing real-time growth indicators, global volumes, and peak markers.
- **Deployment Assistant**: Integrated local terminal guide directly in the dashboard explaining the pipeline command line.

---

## 🚀 Instant Offline Running (No Node/NPM Needed!)

Since we prioritised accessibility, you can run the entire premium visualizer locally **without installing Node or NPM**. We created a self-contained, zero-dependency `demo.html` in the root of the project that mirrors every single line of styling, animation, custom SVG redraw logic, and interactive behavior from the React application!

### Running via Python static server:
1. Open your terminal.
2. Run the command:
   ```bash
   python3 -m http.server 8000
   ```
3. Open [http://localhost:8000/demo.html](http://localhost:8000/demo.html) in your browser to inspect and interact with the dashboard immediately!

---

## 🛠️ Local Development (Standard React + Vite)

If you have Node.js and NPM installed, you can run the developer bundle and execute unit tests locally:

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Launch dev environment**:
   ```bash
   npm run dev
   ```
3. **Execute unit tests**:
   ```bash
   npm run test
   ```
4. **Run syntax linter**:
   ```bash
   npm run lint
   ```

---

## 🐙 GitHub Actions Deployment (CI/CD)

The project includes a production-grade CI/CD pipeline inside `.github/workflows/deploy.yml`. When you push to the `main` branch, the pipeline will:
1. **Lint**: Run ESLint validation checks.
2. **Test**: Execute Vitest unit tests.
3. **Build**: Compile production-ready minified web bundle using Vite.
4. **Deploy**: Automatically host the compiled files on **GitHub Pages** (`gh-pages` branch) using a secure GitHub Token.

---

## 🔒 Step-by-Step GitHub Pushing & Authentication Guide

If your Git push fails with an authentication error like:
`fatal: Authentication failed for 'https://github.com/Himavanth97/Gitlab-CI-Project/'`

It means your terminal is not authenticated to write to your GitHub account. Follow these steps to resolve this securely and push the project.

### Step 1: Generate a GitHub Personal Access Token (PAT)
1. Go to your GitHub account: [GitHub Settings -> Developer Settings](https://github.com/settings/tokens).
2. Select **Tokens (classic)** -> Click **Generate new token (classic)**.
3. Name it (e.g., `Trend Insights Dashboard`).
4. Select the **scopes** needed:
   - **`repo`** (Full control of private and public repositories)
5. Click **Generate Token** and copy it immediately! *(Note: GitHub will not show this token again.)*

### Step 2: Initialize & Push Code from Your Mac's Native Terminal
Run the following commands in the `trend-insights` folder. Running this in your native macOS Terminal allows Git to securely prompt you for credentials and save them inside your **Mac's Keychain** so you don't have to authenticate again!

```bash
# 1. Initialize Git in the project directory
git init --initial-branch=main

# 2. Stage all project files
git add .

# 3. Commit your changes
git commit -m "feat: init premium trend-insights analytics dashboard"

# 4. Link your GitHub repository
git remote add origin https://github.com/Himavanth97/Gitlab-CI-Project.git

# 5. Push your code to GitHub
git push -u origin main --force
```

### Step 3: Enter Your Credentials
When the terminal prompts you:
- **Username**: Enter your GitHub username (`Himavanth97`)
- **Password**: **Paste the Personal Access Token (PAT)** you copied in Step 1. *Do not enter your regular GitHub password; GitHub requires PATs for terminal pushes.*

Once pushed, go to `https://github.com/Himavanth97/Gitlab-CI-Project/actions` to monitor your pipeline's build, test, and automated hosting run!
