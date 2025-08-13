# ============================================================================
# STEP 4: Initialize Git and Push Code to Azure Repos
# ============================================================================

Write-Host "Setting up Git repository and pushing to Azure Repos..." -ForegroundColor Blue

# 1. Check if git is initialized
if (!(Test-Path ".git")) {
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git repository initialized" -ForegroundColor Green
} else {
    Write-Host "✅ Git repository already exists" -ForegroundColor Green
}

# 2. Get Azure Repos URL
$ORG_NAME = Read-Host "Enter your Azure DevOps organization name (just the name, not full URL)"
$PROJECT_NAME = Read-Host "Enter your project name (default: IncidentManagementTool)"

if ([string]::IsNullOrEmpty($PROJECT_NAME)) {
    $PROJECT_NAME = "IncidentManagementTool"
}

$REPO_URL = "https://dev.azure.com/$ORG_NAME/$PROJECT_NAME/_git/$PROJECT_NAME"

Write-Host "Repository URL: $REPO_URL" -ForegroundColor White

# 3. Create .gitignore if it doesn't exist
if (!(Test-Path ".gitignore")) {
    Write-Host "Creating .gitignore file..." -ForegroundColor Yellow
    @'
# Dependencies
node_modules/
.pnp
.pnp.js
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production build
.next/
out/
build/
dist/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
.nyc_output/

# Azure
.azure/

# Temporary files
*.tmp
*.temp

# Package files
*.tgz
*.tar.gz
'@ | Out-File -FilePath ".gitignore" -Encoding UTF8
    Write-Host "✅ .gitignore created" -ForegroundColor Green
}

# 4. Add all files to git
Write-Host "Adding files to git..." -ForegroundColor Yellow
git add .

# 5. Create initial commit
Write-Host "Creating initial commit..." -ForegroundColor Yellow
git commit -m "Initial commit: Incident Management Tool with CI/CD pipeline"

# 6. Add Azure Repos as remote origin
Write-Host "Adding Azure Repos as remote..." -ForegroundColor Yellow
git remote remove origin 2>$null  # Remove existing origin if any
git remote add origin $REPO_URL

# 7. Push to Azure Repos
Write-Host "Pushing code to Azure Repos..." -ForegroundColor Yellow
Write-Host "⚠️  You may be prompted for credentials. Use your Azure DevOps credentials." -ForegroundColor Yellow

try {
    git push -u origin main
    Write-Host "✅ Code successfully pushed to Azure Repos!" -ForegroundColor Green
} catch {
    # Try with master branch if main doesn't work
    Write-Host "Trying with master branch..." -ForegroundColor Yellow
    git branch -M main
    git push -u origin main
}

# 8. Create develop branch for staging deployments
Write-Host "Creating develop branch..." -ForegroundColor Yellow
git checkout -b develop
git push -u origin develop
git checkout main

Write-Host "`n🎉 Git repository setup complete!" -ForegroundColor Green
Write-Host "Main branch: Deploys to Production" -ForegroundColor White
Write-Host "Develop branch: Deploys to Staging" -ForegroundColor White
Write-Host "`nNext: Run Step 5 to create the CI/CD pipeline" -ForegroundColor Yellow
