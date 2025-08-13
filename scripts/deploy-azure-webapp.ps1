# Azure Web App Deployment Script for Incident Management Tool
# This script creates Azure resources and configures deployment

param(
    [Parameter(Mandatory=$true)]
    [string]$ResourceGroupName = "rg-incident-management",
    
    [Parameter(Mandatory=$true)]
    [string]$WebAppName = "incident-management-kb",
    
    [Parameter(Mandatory=$true)]
    [string]$Location = "East US",
    
    [Parameter(Mandatory=$false)]
    [string]$SubscriptionId
)

# Check if Azure CLI is installed
if (!(Get-Command az -ErrorAction SilentlyContinue)) {
    Write-Error "Azure CLI is not installed. Please install it first."
    Write-Host "Run: winget install Microsoft.AzureCLI"
    exit 1
}

# Login to Azure
Write-Host "🔐 Logging into Azure..." -ForegroundColor Blue
az login

# Set subscription if provided
if ($SubscriptionId) {
    Write-Host "📋 Setting subscription to $SubscriptionId..." -ForegroundColor Blue
    az account set --subscription $SubscriptionId
}

# Get current subscription
$currentSub = az account show --query "name" -o tsv
Write-Host "✅ Using subscription: $currentSub" -ForegroundColor Green

# Create Resource Group
Write-Host "🏗️ Creating resource group '$ResourceGroupName' in '$Location'..." -ForegroundColor Blue
az group create --name $ResourceGroupName --location $Location

# Create App Service Plan (Free tier for testing)
$appServicePlan = "$WebAppName-plan"
Write-Host "📦 Creating App Service Plan '$appServicePlan'..." -ForegroundColor Blue
az appservice plan create `
    --name $appServicePlan `
    --resource-group $ResourceGroupName `
    --location $Location `
    --sku B1 `
    --is-linux

# Create Web App
Write-Host "🌐 Creating Web App '$WebAppName'..." -ForegroundColor Blue
az webapp create `
    --name $WebAppName `
    --resource-group $ResourceGroupName `
    --plan $appServicePlan `
    --runtime "NODE:18-lts"

# Configure Web App settings
Write-Host "⚙️ Configuring Web App settings..." -ForegroundColor Blue
az webapp config appsettings set `
    --name $WebAppName `
    --resource-group $ResourceGroupName `
    --settings `
        NODE_ENV=production `
        AZURE_WEBAPP=true `
        SCM_DO_BUILD_DURING_DEPLOYMENT=true `
        ENABLE_ORYX_BUILD=true

# Enable deployment logs
az webapp log config `
    --name $WebAppName `
    --resource-group $ResourceGroupName `
    --docker-container-logging filesystem

# Get publish profile for GitHub Actions
Write-Host "📄 Getting publish profile for GitHub Actions..." -ForegroundColor Blue
$publishProfile = az webapp deployment list-publishing-profiles `
    --name $WebAppName `
    --resource-group $ResourceGroupName `
    --xml

# Save publish profile to file
$publishProfile | Out-File -FilePath "publish-profile.xml" -Encoding UTF8

Write-Host "🎉 Azure Web App created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Add the publish profile as a GitHub secret:"
Write-Host "   - Go to your GitHub repo → Settings → Secrets and variables → Actions"
Write-Host "   - Create a new secret named: AZURE_WEBAPP_PUBLISH_PROFILE"
Write-Host "   - Copy the content from 'publish-profile.xml' file"
Write-Host ""
Write-Host "2. Update the workflow file with your Web App name:"
Write-Host "   - Edit .github/workflows/azure-webapp.yml"
Write-Host "   - Change AZURE_WEBAPP_NAME to: $WebAppName"
Write-Host ""
Write-Host "3. Your Web App URL will be: https://$WebAppName.azurewebsites.net"
Write-Host ""
Write-Host "🔗 Azure Portal: https://portal.azure.com/#@/resource/subscriptions/$(az account show --query 'id' -o tsv)/resourceGroups/$ResourceGroupName/providers/Microsoft.Web/sites/$WebAppName"
