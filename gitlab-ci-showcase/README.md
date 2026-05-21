# 🦊 GitLab CI/CD Pipeline Dashboard & Visualizer

A premium, highly interactive dashboard application designed to showcase, simulate, and teach **GitLab CI/CD Pipelines**. The application is pre-configured to compile using Vite, run linting and unit tests, and deploy directly to **GitLab Pages** on push.

---

## 🚀 Getting Started

### 1. Local Development Setup
Make sure you have [Node.js](https://nodejs.org/) (LTS recommended) installed.

```bash
# Navigate to the project directory
cd gitlab-ci-showcase

# Install required dependencies
npm install

# Run the lint suite
npm run lint

# Run the test suite (Vitest)
npm run test

# Launch the visualizer app locally
npm run dev
```

The application will launch on your local host (usually `http://localhost:5173`). Open it to interact with the pipeline and explore the YAML keywords interactively!

---

## 🛠️ Deploying to GitLab (Step-by-Step Guide)

Follow these steps to push this project to GitLab and activate the live CI/CD building pipeline and Pages hosting.

### Step 1: Create a Repository on GitLab
1. Sign in to your [GitLab](https://gitlab.com) account.
2. Click the **"+" icon** at the top or the **New project** button.
3. Select **Create blank project**.
4. Set the project name to: `gitlab-ci-showcase`
5. Choose your visibility level (Public or Private).
6. **Important**: Leave the *Initialize repository with a README* checkbox **unchecked** (we already have a complete codebase).
7. Click **Create project**.

### Step 2: Initialize Git and Push Code
In your terminal, navigate to this project folder (`gitlab-ci-showcase`) and execute the following commands to push the project to GitLab:

```bash
# Initialize local git repository
git init --initial-branch=main

# Stage all files
git add .

# Create the initial commit
git commit -m "feat: init vite showcase application and gitlab pipeline config"

# Link your local repo to the GitLab repository
# (Replace with your actual GitLab username or SSH path)
git remote add origin https://gitlab.com/YOUR_USERNAME/gitlab-ci-showcase.git

# Push to the main branch
git push -u origin main
```

---

## 🐙 Deploying to GitHub (Step-by-Step Guide)

Follow these steps to push this project to GitHub and configure **GitHub Actions** for automated testing and **GitHub Pages** deployment:

### Step 1: Create a Repository on GitHub
1. Go to [GitHub](https://github.com) and sign in.
2. In the top-right corner, click **"+"** and select **New repository**.
3. Set the Repository name to: `gitlab-ci-showcase`
4. Set the visibility to Public or Private.
5. **Important**: Leave *Add a README file*, *Add .gitignore*, and *Choose a license* **unchecked**.
6. Click **Create repository**.

### Step 2: Push Code to GitHub
In your local project terminal (`gitlab-ci-showcase`), execute these commands:

```bash
# Initialize local repository (if not already done)
git init --initial-branch=main

# Stage and commit your files
git add .
git commit -m "feat: init project with GitLab CI and GitHub Actions support"

# Link your local repo to the GitHub repository
# (Replace with your actual GitHub username)
git remote add github https://github.com/YOUR_USERNAME/gitlab-ci-showcase.git

# Push to the main branch on GitHub
git push -u github main
```

### Step 3: Enable GitHub Pages Permissions
To allow GitHub Actions to publish your static build to GitHub Pages, enable write permissions:
1. In your GitHub repository, navigate to **Settings > Actions > General**.
2. Scroll down to **Workflow permissions**.
3. Select **Read and write permissions**.
4. Click **Save**.

Once configured, any push to the `main` branch will run the workflow in **Actions** and automatically deploy the application to GitHub Pages under the `gh-pages` branch!

---

## ⚙️ GitLab & GitHub CI/CD Architecture Under The Hood

The repository is preloaded with a fully-configured `.gitlab-ci.yml` pipeline that triggers on push to the `main` branch. 

### Pipeline Flow:
```mermaid
graph LR
  A[Git Push / Commit] --> B[Lint Stage]
  B --> C[Test Stage]
  C --> D[Build Stage]
  D --> E[Deploy Stage]
  E --> F[GitLab Pages Host]
  
  style B fill:#38bdf8,stroke:#0284c7,stroke-width:2px,color:#fff
  style C fill:#a78bfa,stroke:#7c3aed,stroke-width:2px,color:#fff
  style D fill:#fb7185,stroke:#e11d48,stroke-width:2px,color:#fff
  style E fill:#34d399,stroke:#059669,stroke-width:2px,color:#fff
  style F fill:#f43f5e,stroke:#be123c,stroke-width:2px,color:#fff
```

### Explaining the Stages
1. **Lint (`lint-job`)**: Executes `npm run lint` to enforce clean syntax across Javascript and React components, failing the pipeline instantly if syntax rules are breached.
2. **Test (`test-job`)**: Executes `npm run test` using **Vitest** in a head-less JSDOM environment to ensure absolute code integrity.
3. **Build (`build-job`)**: Runs `npm run build` compiling assets via Vite. The output `dist/` directory is cached and stored as a build artifact.
4. **Deploy (`pages`)**: A special GitLab job that takes the `dist/` build artifacts, renames the folder to `public/`, and publishes it directly to **GitLab Pages**.

---

## ⚡ Runner and Cache Optimization

Our `.gitlab-ci.yml` uses best practices to make builds lightning fast:
* **Caching**: The `node_modules` and `.npm` cache are stored between jobs using a hash of `package-lock.json`. This cuts installation times by over **70%**!
* **Artifact Expiry**: The compiled `dist/` folder expires after 1 week, saving registry storage on your GitLab account.
* **Conditional Rules**: Pipeline jobs run strictly on pushes to the default branch, preventing unnecessary runner usage on WIP/draft branches.

---

## 🌐 Accessing Your Deployed App
Once your pipeline finishes successfully, GitLab will host your app. To access it:
1. In your GitLab repository sidebar, go to **Deploy > Pages**.
2. If the pipeline has completed, you will see your live URL:
   `https://<your-username>.gitlab.io/gitlab-ci-showcase/`
