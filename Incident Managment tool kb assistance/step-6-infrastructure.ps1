# ============================================================================
# STEP 6: Deploy Azure Infrastructure
# ============================================================================

Write-Host "Deploying Azure Infrastructure..." -ForegroundColor Blue

# Check if user is logged in to Azure
try {
    $account = az account show | ConvertFrom-Json
    Write-Host "✅ Logged in as: $($account.user.name)" -ForegroundColor Green
} catch {
    Write-Host "❌ Not logged in to Azure. Please run 'az login' first." -ForegroundColor Red
    exit 1
}

# Get deployment parameters
$RESOURCE_GROUP = Read-Host "Enter resource group name (default: rg-incident-management)"
if ([string]::IsNullOrEmpty($RESOURCE_GROUP)) {
    $RESOURCE_GROUP = "rg-incident-management"
}

$LOCATION = Read-Host "Enter Azure region (default: East US)"
if ([string]::IsNullOrEmpty($LOCATION)) {
    $LOCATION = "East US"
}

$ENVIRONMENT = Read-Host "Enter environment (dev/staging/prod, default: dev)"
if ([string]::IsNullOrEmpty($ENVIRONMENT)) {
    $ENVIRONMENT = "dev"
}

Write-Host "`nDeployment Configuration:" -ForegroundColor Yellow
Write-Host "Resource Group: $RESOURCE_GROUP" -ForegroundColor White
Write-Host "Location: $LOCATION" -ForegroundColor White
Write-Host "Environment: $ENVIRONMENT" -ForegroundColor White

# Confirm deployment
$confirm = Read-Host "`nProceed with deployment? (y/N)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "Deployment cancelled." -ForegroundColor Yellow
    exit 0
}

# Create resource group
Write-Host "`nCreating resource group..." -ForegroundColor Yellow
az group create --name $RESOURCE_GROUP --location $LOCATION

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Resource group created successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to create resource group" -ForegroundColor Red
    exit 1
}

# Deploy infrastructure using Bicep
Write-Host "`nDeploying infrastructure (this may take 5-10 minutes)..." -ForegroundColor Yellow

$DEPLOYMENT_NAME = "incident-mgmt-deployment-$(Get-Date -Format 'yyyyMMddHHmmss')"
$PARAMETERS_FILE = "infrastructure/parameters.$ENVIRONMENT.json"

if (!(Test-Path $PARAMETERS_FILE)) {
    Write-Host "❌ Parameters file not found: $PARAMETERS_FILE" -ForegroundColor Red
    Write-Host "Available parameter files:" -ForegroundColor Yellow
    Get-ChildItem "infrastructure/parameters.*.json" | ForEach-Object { Write-Host "  • $($_.Name)" -ForegroundColor White }
    exit 1
}

try {
    $deploymentResult = az deployment group create `
        --resource-group $RESOURCE_GROUP `
        --template-file "infrastructure/main.bicep" `
        --parameters "@$PARAMETERS_FILE" `
        --name $DEPLOYMENT_NAME `
        --output json | ConvertFrom-Json

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Infrastructure deployed successfully!" -ForegroundColor Green
        
        # Extract deployment outputs
        $outputs = $deploymentResult.properties.outputs
        $webAppUrl = $outputs.webAppUrl.value
        $webAppName = $outputs.webAppName.value
        $appInsightsKey = $outputs.applicationInsightsInstrumentationKey.value
        
        Write-Host "`n📋 DEPLOYMENT RESULTS:" -ForegroundColor Magenta
        Write-Host "======================" -ForegroundColor Magenta
        Write-Host "Web App Name: $webAppName" -ForegroundColor White
        Write-Host "Web App URL: $webAppUrl" -ForegroundColor White
        Write-Host "Application Insights Key: $appInsightsKey" -ForegroundColor White
        
        # Save deployment info for next steps
        $deploymentInfo = @{
            resourceGroup = $RESOURCE_GROUP
            webAppName = $webAppName
            webAppUrl = $webAppUrl
            appInsightsKey = $appInsightsKey
            environment = $ENVIRONMENT
        }
        
        $deploymentInfo | ConvertTo-Json | Out-File "deployment-info.json" -Encoding UTF8
        Write-Host "✅ Deployment info saved to deployment-info.json" -ForegroundColor Green
        
    } else {
        Write-Host "❌ Infrastructure deployment failed" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Deployment error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n🎉 Infrastructure deployment complete!" -ForegroundColor Green
Write-Host "Next: Run Step 7 to deploy your application" -ForegroundColor Yellow
