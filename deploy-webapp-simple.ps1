npm run# Simple Azure Web App Deployment - Local Testing
# Run this script from your project root directory

Write-Host "🚀 Starting Azure Web App Deployment Process..." -ForegroundColor Green
Write-Host ""

# Get current directory
$currentDir = Get-Location
Write-Host "📁 Current directory: $currentDir" -ForegroundColor Blue

# Check if we're in the right directory (should contain package.json)
if (!(Test-Path "package.json")) {
    Write-Error "❌ package.json not found. Please run this script from your project root directory."
    Write-Host "💡 Navigate to your project directory first, then run this script."
    exit 1
}

Write-Host "✅ Found package.json - we're in the right directory!" -ForegroundColor Green

# Check if Azure CLI is installed
Write-Host "🔧 Checking Azure CLI installation..." -ForegroundColor Blue
if (!(Get-Command az -ErrorAction SilentlyContinue)) {
    Write-Error "❌ Azure CLI is not installed."
    Write-Host "📦 Please install Azure CLI first:"
    Write-Host "   winget install Microsoft.AzureCLI"
    Write-Host "   Or download from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-windows"
    exit 1
}
Write-Host "✅ Azure CLI is installed!" -ForegroundColor Green

# Get unique app name suggestion
$timestamp = Get-Date -Format "yyyyMMdd"
$suggestedName = "incident-mgmt-$timestamp"

Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Choose a unique name for your Azure Web App"
Write-Host "   Suggested name: $suggestedName"
Write-Host ""
Write-Host "2. Run the deployment command:"
Write-Host "   .\scripts\deploy-azure-webapp.ps1 -WebAppName '$suggestedName' -ResourceGroupName 'rg-incident-mgmt' -Location 'East US'"
Write-Host ""
Write-Host "3. Follow the instructions after the script completes"
Write-Host ""

# Check if user wants to proceed
$proceed = Read-Host "Do you want to create the Azure Web App now? (y/n)"
if ($proceed -eq 'y' -or $proceed -eq 'Y') {
    Write-Host "🔄 Running deployment script..." -ForegroundColor Blue
    .\scripts\deploy-azure-webapp.ps1 -WebAppName $suggestedName -ResourceGroupName "rg-incident-mgmt" -Location "East US"
} else {
    Write-Host "ℹ️ Deployment cancelled. You can run the script manually later." -ForegroundColor Yellow
}
