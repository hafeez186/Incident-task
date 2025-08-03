# Pre-Deployment Validation Script
# This script validates that your project is ready for Azure deployment

Write-Host "========================================" -ForegroundColor Green
Write-Host "Pre-Deployment Validation Check" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

$validationPassed = $true
$warnings = @()

# Check 1: Node.js and npm
Write-Host "`n1. Checking Node.js and npm..." -ForegroundColor Cyan
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
    Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
    
    # Check if Node.js version is suitable
    $nodeVersionNumber = $nodeVersion -replace 'v', '' -split '\.' | Select-Object -First 1
    if ([int]$nodeVersionNumber -lt 16) {
        Write-Host "⚠️  Warning: Node.js version should be 16+ for best compatibility" -ForegroundColor Yellow
        $warnings += "Consider upgrading Node.js to version 18+"
    }
} catch {
    Write-Host "❌ Node.js or npm not found" -ForegroundColor Red
    $validationPassed = $false
}

# Check 2: Project files
Write-Host "`n2. Checking project files..." -ForegroundColor Cyan
$requiredFiles = @(
    "package.json",
    "next.config.js",
    "azure-pipelines.yml",
    "Dockerfile",
    "src/app/layout.tsx",
    "src/app/page.tsx"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ Missing: $file" -ForegroundColor Red
        $validationPassed = $false
    }
}

# Check 3: Dependencies
Write-Host "`n3. Checking dependencies..." -ForegroundColor Cyan
if (Test-Path "node_modules") {
    Write-Host "✅ node_modules exists" -ForegroundColor Green
} else {
    Write-Host "⚠️  node_modules not found - run 'npm install'" -ForegroundColor Yellow
    $warnings += "Run 'npm install' before deployment"
}

if (Test-Path "package-lock.json") {
    Write-Host "✅ package-lock.json exists" -ForegroundColor Green
} else {
    Write-Host "⚠️  package-lock.json not found" -ForegroundColor Yellow
    $warnings += "Consider running 'npm install' to generate package-lock.json"
}

# Check 4: Build test
Write-Host "`n4. Testing build process..." -ForegroundColor Cyan
try {
    Write-Host "Running npm run build..." -ForegroundColor Blue
    $buildOutput = npm run build 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Build successful" -ForegroundColor Green
    } else {
        Write-Host "❌ Build failed" -ForegroundColor Red
        Write-Host "Build output:" -ForegroundColor Yellow
        Write-Host $buildOutput -ForegroundColor White
        $validationPassed = $false
    }
} catch {
    Write-Host "❌ Build test failed: $($_.Exception.Message)" -ForegroundColor Red
    $validationPassed = $false
}

# Check 5: Lint test
Write-Host "`n5. Testing lint process..." -ForegroundColor Cyan
try {
    Write-Host "Running npm run lint..." -ForegroundColor Blue
    $lintOutput = npm run lint 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Lint passed" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Lint warnings/errors found" -ForegroundColor Yellow
        Write-Host "Lint output:" -ForegroundColor Yellow
        Write-Host $lintOutput -ForegroundColor White
        $warnings += "Fix lint warnings before deployment"
    }
} catch {
    Write-Host "⚠️  Lint test failed: $($_.Exception.Message)" -ForegroundColor Yellow
    $warnings += "Fix lint configuration"
}

# Check 6: Infrastructure files
Write-Host "`n6. Checking infrastructure files..." -ForegroundColor Cyan
$infraFiles = @(
    "infrastructure/main.bicep",
    "infrastructure/parameters.dev.json",
    "infrastructure/parameters.prod.json"
)

foreach ($file in $infraFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ Missing: $file" -ForegroundColor Red
        $validationPassed = $false
    }
}

# Check 7: Deployment scripts
Write-Host "`n7. Checking deployment scripts..." -ForegroundColor Cyan
$scriptFiles = @(
    "install-azure-cli.ps1",
    "step-2-azure-setup.ps1",
    "step-3-devops-setup.ps1",
    "step-4-git-setup.ps1",
    "step-5-pipeline-setup.ps1",
    "step-6-infrastructure.ps1",
    "step-7-deploy-application.ps1"
)

foreach ($file in $scriptFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ Missing: $file" -ForegroundColor Red
        $validationPassed = $false
    }
}

# Check 8: Environment configuration
Write-Host "`n8. Checking environment configuration..." -ForegroundColor Cyan
if (Test-Path ".env.example") {
    Write-Host "✅ .env.example exists" -ForegroundColor Green
} else {
    Write-Host "⚠️  .env.example not found" -ForegroundColor Yellow
    $warnings += "Create .env.example with required environment variables"
}

if (Test-Path ".env.local") {
    Write-Host "⚠️  .env.local found - ensure it's in .gitignore" -ForegroundColor Yellow
    $warnings += "Verify .env.local is not committed to git"
} else {
    Write-Host "✅ No .env.local file (good for deployment)" -ForegroundColor Green
}

# Check 9: Docker configuration
Write-Host "`n9. Checking Docker configuration..." -ForegroundColor Cyan
if (Test-Path "Dockerfile") {
    Write-Host "✅ Dockerfile exists" -ForegroundColor Green
} else {
    Write-Host "❌ Dockerfile missing" -ForegroundColor Red
    $validationPassed = $false
}

if (Test-Path "docker-compose.yml") {
    Write-Host "✅ docker-compose.yml exists" -ForegroundColor Green
} else {
    Write-Host "⚠️  docker-compose.yml not found" -ForegroundColor Yellow
    $warnings += "docker-compose.yml recommended for local development"
}

# Check 10: Git status
Write-Host "`n10. Checking Git status..." -ForegroundColor Cyan
try {
    $gitStatus = git status --porcelain 2>$null
    if ($gitStatus) {
        Write-Host "⚠️  Uncommitted changes found:" -ForegroundColor Yellow
        Write-Host $gitStatus -ForegroundColor White
        $warnings += "Commit all changes before deployment"
    } else {
        Write-Host "✅ Git working directory is clean" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Not a git repository or git not available" -ForegroundColor Yellow
    $warnings += "Initialize git repository before deployment"
}

# Summary
Write-Host "`n========================================" -ForegroundColor Green
Write-Host "VALIDATION SUMMARY" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

if ($validationPassed) {
    Write-Host "🎉 VALIDATION PASSED!" -ForegroundColor Green
    Write-Host "Your project is ready for Azure deployment" -ForegroundColor Green
} else {
    Write-Host "❌ VALIDATION FAILED!" -ForegroundColor Red
    Write-Host "Please fix the errors above before proceeding" -ForegroundColor Red
}

if ($warnings.Count -gt 0) {
    Write-Host "`n⚠️  WARNINGS:" -ForegroundColor Yellow
    foreach ($warning in $warnings) {
        Write-Host "   • $warning" -ForegroundColor White
    }
}

Write-Host "`n📋 NEXT STEPS:" -ForegroundColor Cyan
if ($validationPassed) {
    Write-Host "1. Run: .\install-azure-cli.ps1" -ForegroundColor White
    Write-Host "2. Run: .\step-2-azure-setup.ps1" -ForegroundColor White
    Write-Host "3. Continue with remaining deployment steps" -ForegroundColor White
    Write-Host "4. Follow COMPLETE-DEPLOYMENT-GUIDE.md" -ForegroundColor White
} else {
    Write-Host "1. Fix all validation errors shown above" -ForegroundColor White
    Write-Host "2. Run this validation script again" -ForegroundColor White
    Write-Host "3. Once validation passes, start deployment" -ForegroundColor White
}

Write-Host "`n📚 Documentation:" -ForegroundColor Blue
Write-Host "   • COMPLETE-DEPLOYMENT-GUIDE.md - Full deployment guide" -ForegroundColor White
Write-Host "   • CI-CD-SETUP-COMPLETE.md - CI/CD configuration details" -ForegroundColor White
Write-Host "   • DEPLOYMENT-GUIDE.md - Technical deployment reference" -ForegroundColor White

return $validationPassed
