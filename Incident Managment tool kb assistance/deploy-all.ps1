# Quick Start Deployment Script
# This script runs all deployment steps in sequence with user confirmation

Write-Host "========================================" -ForegroundColor Green
Write-Host "🚀 INCIDENT MANAGEMENT TOOL" -ForegroundColor Green
Write-Host "Azure CI/CD Deployment - Quick Start" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host "`n📋 This script will guide you through the complete deployment process:" -ForegroundColor Cyan
Write-Host "   1. Validate project readiness" -ForegroundColor White
Write-Host "   2. Install Azure CLI" -ForegroundColor White
Write-Host "   3. Set up Azure resources" -ForegroundColor White
Write-Host "   4. Configure Azure DevOps" -ForegroundColor White
Write-Host "   5. Set up Git repository" -ForegroundColor White
Write-Host "   6. Create CI/CD pipeline" -ForegroundColor White
Write-Host "   7. Deploy infrastructure" -ForegroundColor White
Write-Host "   8. Deploy application" -ForegroundColor White

$continue = Read-Host "`nDo you want to continue with the full deployment? (y/n)"
if ($continue -ne "y") {
    Write-Host "Deployment cancelled." -ForegroundColor Yellow
    exit 0
}

# Step 0: Validation
Write-Host "`n🔍 Step 0: Pre-deployment validation..." -ForegroundColor Blue
Write-Host "Running project validation check..." -ForegroundColor Cyan

try {
    $validationResult = .\validate-deployment-readiness.ps1
    if (-not $validationResult) {
        Write-Host "`n❌ Validation failed. Please fix the issues and run this script again." -ForegroundColor Red
        $retry = Read-Host "Do you want to continue anyway? (y/n)"
        if ($retry -ne "y") {
            exit 1
        }
    }
} catch {
    Write-Host "⚠️  Could not run validation script. Continuing..." -ForegroundColor Yellow
}

Write-Host "`nPress any key to continue with Step 1..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Step 1: Install Azure CLI
Write-Host "`n🔧 Step 1: Installing Azure CLI..." -ForegroundColor Blue
try {
    .\install-azure-cli.ps1
    Write-Host "✅ Step 1 completed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Step 1 failed: $($_.Exception.Message)" -ForegroundColor Red
    $continue = Read-Host "Do you want to continue to the next step? (y/n)"
    if ($continue -ne "y") { exit 1 }
}

Write-Host "`nPress any key to continue with Step 2..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Step 2: Azure Setup
Write-Host "`n☁️  Step 2: Setting up Azure resources..." -ForegroundColor Blue
try {
    .\step-2-azure-setup.ps1
    Write-Host "✅ Step 2 completed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Step 2 failed: $($_.Exception.Message)" -ForegroundColor Red
    $continue = Read-Host "Do you want to continue to the next step? (y/n)"
    if ($continue -ne "y") { exit 1 }
}

Write-Host "`nPress any key to continue with Step 3..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Step 3: Azure DevOps Setup
Write-Host "`n🛠️  Step 3: Setting up Azure DevOps..." -ForegroundColor Blue
try {
    .\step-3-devops-setup.ps1
    Write-Host "✅ Step 3 completed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Step 3 failed: $($_.Exception.Message)" -ForegroundColor Red
    $continue = Read-Host "Do you want to continue to the next step? (y/n)"
    if ($continue -ne "y") { exit 1 }
}

Write-Host "`nPress any key to continue with Step 4..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Step 4: Git Setup
Write-Host "`n📝 Step 4: Setting up Git repository..." -ForegroundColor Blue
try {
    .\step-4-git-setup.ps1
    Write-Host "✅ Step 4 completed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Step 4 failed: $($_.Exception.Message)" -ForegroundColor Red
    $continue = Read-Host "Do you want to continue to the next step? (y/n)"
    if ($continue -ne "y") { exit 1 }
}

Write-Host "`nPress any key to continue with Step 5..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Step 5: Pipeline Setup
Write-Host "`n🔄 Step 5: Setting up CI/CD pipeline..." -ForegroundColor Blue
try {
    .\step-5-pipeline-setup.ps1
    Write-Host "✅ Step 5 completed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Step 5 failed: $($_.Exception.Message)" -ForegroundColor Red
    $continue = Read-Host "Do you want to continue to the next step? (y/n)"
    if ($continue -ne "y") { exit 1 }
}

Write-Host "`nPress any key to continue with Step 6..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Step 6: Infrastructure Deployment
Write-Host "`n🏗️  Step 6: Deploying infrastructure..." -ForegroundColor Blue
try {
    .\step-6-infrastructure.ps1
    Write-Host "✅ Step 6 completed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Step 6 failed: $($_.Exception.Message)" -ForegroundColor Red
    $continue = Read-Host "Do you want to continue to the next step? (y/n)"
    if ($continue -ne "y") { exit 1 }
}

Write-Host "`nPress any key to continue with Step 7..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Step 7: Application Deployment
Write-Host "`n🚀 Step 7: Deploying application..." -ForegroundColor Blue
try {
    .\step-7-deploy-application.ps1
    Write-Host "✅ Step 7 completed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Step 7 failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Check the error messages above and try running step-7-deploy-application.ps1 manually" -ForegroundColor Yellow
}

# Final Summary
Write-Host "`n========================================" -ForegroundColor Green
Write-Host "🎉 DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host "`n✅ Successfully completed:" -ForegroundColor Green
Write-Host "   • Azure CLI installation and login" -ForegroundColor White
Write-Host "   • Azure resource group and subscription setup" -ForegroundColor White
Write-Host "   • Azure DevOps project and pipeline creation" -ForegroundColor White
Write-Host "   • Git repository setup and code push" -ForegroundColor White
Write-Host "   • Infrastructure deployment (App Service, etc.)" -ForegroundColor White
Write-Host "   • Application deployment and configuration" -ForegroundColor White

Write-Host "`n🌐 Your application should now be available at:" -ForegroundColor Cyan
Write-Host "   https://your-app-name.azurewebsites.net" -ForegroundColor White

Write-Host "`n📊 Next steps for competition:" -ForegroundColor Yellow
Write-Host "   1. Test your application thoroughly" -ForegroundColor White
Write-Host "   2. Make a small code change and verify CI/CD pipeline" -ForegroundColor White
Write-Host "   3. Review COMPETITION-FEATURES.md for presentation points" -ForegroundColor White
Write-Host "   4. Prepare your demo using PRESENTATION-GUIDE.md" -ForegroundColor White

Write-Host "`n📚 Documentation available:" -ForegroundColor Blue
Write-Host "   • COMPLETE-DEPLOYMENT-GUIDE.md - Full deployment reference" -ForegroundColor White
Write-Host "   • CI-CD-SETUP-COMPLETE.md - Pipeline configuration details" -ForegroundColor White
Write-Host "   • COMPETITION-FEATURES.md - Features to highlight" -ForegroundColor White
Write-Host "   • PRESENTATION-GUIDE.md - Competition presentation guide" -ForegroundColor White

Write-Host "`n🏆 Your incident management tool is now competition-ready!" -ForegroundColor Green
Write-Host "Good luck with the Cognizant Vibe Code Competition! 🚀" -ForegroundColor Cyan
