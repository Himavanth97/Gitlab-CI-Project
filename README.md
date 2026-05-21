# 🐙🦊 Dev Showcase Hub: GitLab & GitHub CI/CD Collection

Welcome to the **Dev Showcase Hub**, a unified multi-project repository curated by **Himavanth97**. This repository hosts two gorgeous interactive dashboards styled with state-of-the-art visual aesthetics, custom chart engines, and fully automated deployment pipelines.

Both projects are accessible under a single live deployment URL on **GitHub Pages**!

---

## 📂 Featured Applications

### 1. 🦊 GitLab CI/CD Pipeline Visualizer
- **Location**: `/gitlab-ci-showcase`
- **Core Function**: An interactive developer simulator built to visualize standard multi-stage runner pipelines (`lint` ➔ `test` ➔ `build` ➔ `deploy`).
- **Key Details**: Features simulated runner executions with fully active terminal log outputs and job-state animations. Pre-configured with `.gitlab-ci.yml` syntax caches.

### 2. 📈 Trend Insights & Analytics Dashboard
- **Location**: `/trend-insights`
- **Core Function**: A futuristic market analytics dashboard displaying interest volumes and emerging growth indices.
- **Key Details**: Custom SVG canvas chart with glow-line rendering and floating interactive tooltip coordinates. Styled using deep space HSL tokens.

---

## 🚀 Instant Offline Previewing (No Node/NPM Needed!)
Both dashboards come pre-built with zero-dependency standalone `demo.html` scripts. You can run and inspect the entire repository locally without having Node or NPM installed on your machine!

### Spin up via Python:
1. Open your terminal in the repository folder.
2. Run:
   ```bash
   python3 -m http.server 8000
   ```
3. Open [http://localhost:8000/index.html](http://localhost:8000/index.html) in your browser!
4. Navigate smoothly between both full-featured dashboards, interactive SVGs, and terminal simulators right from the landing portal.

---

## 🛠️ Unified GitHub Actions Pipeline (`.github/workflows/deploy.yml`)

The repository features a high-grade GitHub Actions automation flow that builds and tests both independent Vite applications inside a single workspace.

### Running Local Development (React + Vite)
If you wish to edit the source code and compile locally:
```bash
# For GitLab Showcase
cd gitlab-ci-showcase
npm install
npm run dev

# For Trend Insights
cd ../trend-insights
npm install
npm run dev
```

---

## 🔒 Safe Repository Pushing & Auth Guide
If you make changes and push to your GitHub account:
```bash
# Add all files
git add .

# Commit changes
git commit -m "feat: unified landing portal & multi-project showcase"

# Push to your GitHub Pages main branch
git push origin main
```
Your pipeline will automatically compile both portfolios and host them on **GitHub Pages**!
