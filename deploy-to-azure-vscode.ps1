# Quick Azure App Service Deployment from VS Code
# Run this in VS Code PowerShell terminal

Write-Host "🚀 Deploying to Azure App Service..." -ForegroundColor Green
Write-Host ""

# Check if Azure CLI is installed
if (!(Get-Command az -ErrorAction SilentlyContinue)) {
    Write-Error "❌ Azure CLI not found. Please install it first:"
    Write-Host "   winget install Microsoft.AzureCLI"
    exit 1
}

# Check if logged in to Azure
try {
    az account show | Out-Null
} catch {
    Write-Host "🔐 Please login to Azure first..." -ForegroundColor Blue
    az login
}

# Get default app name
$timestamp = Get-Date -Format "yyyyMMddHHmm"
$defaultAppName = "incident-mgmt-$timestamp"

# Prompt for deployment details
$appName = Read-Host "Enter Azure Web App name [$defaultAppName]"
if ([string]::IsNullOrEmpty($appName)) { $appName = $defaultAppName }

$resourceGroup = Read-Host "Enter Resource Group [rg-incident-mgmt]"
if ([string]::IsNullOrEmpty($resourceGroup)) { $resourceGroup = "rg-incident-mgmt" }

$location = Read-Host "Enter Location [East US]"
if ([string]::IsNullOrEmpty($location)) { $location = "East US" }

Write-Host ""
Write-Host "📋 Deployment Configuration:" -ForegroundColor Yellow
Write-Host "   App Name: $appName"
Write-Host "   Resource Group: $resourceGroup"
Write-Host "   Location: $location"
Write-Host ""

# Create resource group
Write-Host "🏗️ Creating resource group..." -ForegroundColor Blue
az group create --name $resourceGroup --location $location

# Create app service plan
$planName = "$appName-plan"
Write-Host "📦 Creating app service plan..." -ForegroundColor Blue
az appservice plan create `
    --name $planName `
    --resource-group $resourceGroup `
    --location $location `
    --sku B1 `
    --is-linux

# Create web app
Write-Host "🌐 Creating web app..." -ForegroundColor Blue
az webapp create `
    --name $appName `
    --resource-group $resourceGroup `
    --plan $planName `
    --runtime "NODE:18-lts"

# Configure app settings
Write-Host "⚙️ Configuring app settings..." -ForegroundColor Blue
az webapp config appsettings set `
    --name $appName `
    --resource-group $resourceGroup `
    --settings `
        NODE_ENV=production `
        AZURE_WEBAPP=true `
        SCM_DO_BUILD_DURING_DEPLOYMENT=true

# Build the application
Write-Host "🔨 Building application..." -ForegroundColor Blue
$env:AZURE_WEBAPP = "true"
$env:NODE_ENV = "production"
npm run build

# Create deployment package
Write-Host "📦 Creating deployment package..." -ForegroundColor Blue
$compress = @{
    Path = Get-ChildItem -Path . -Exclude @('node_modules\.cache', '.git', '.github', '*.md', '.env*')
    DestinationPath = "deployment.zip"
    CompressionLevel = "Fastest"
}
Compress-Archive @compress -Force

# Deploy to Azure
Write-Host "🚀 Deploying to Azure..." -ForegroundColor Blue
az webapp deployment source config-zip `
    --resource-group $resourceGroup `
    --name $appName `
    --src deployment.zip

# Clean up
Remove-Item "deployment.zip" -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "✅ Deployment completed!" -ForegroundColor Green
Write-Host "🌐 Your app is available at: https://$appName.azurewebsites.net" -ForegroundColor Cyan
Write-Host "📊 Monitor logs with: az webapp log tail --name $appName --resource-group $resourceGroup" -ForegroundColor Yellow
Write-Host ""

# Ask if user wants to open the app
$openApp = Read-Host "Would you like to open the app in browser? (y/n)"
if ($openApp -eq 'y' -or $openApp -eq 'Y') {
    Start-Process "https://$appName.azurewebsites.net"
}
