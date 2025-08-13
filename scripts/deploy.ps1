# PowerShell Deployment Script for Windows
# Usage: .\deploy.ps1 -Environment dev|staging|prod

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("dev", "staging", "prod")]
    [string]$Environment
)

# Configuration
$ResourceGroup = "rg-incident-management-$Environment"
$Location = "East US"
$AppName = "incident-mgmt-$Environment"

# Functions for colored output
function Write-Info($message) {
    Write-Host "[INFO] $message" -ForegroundColor Blue
}

function Write-Success($message) {
    Write-Host "[SUCCESS] $message" -ForegroundColor Green
}

function Write-Warning($message) {
    Write-Host "[WARNING] $message" -ForegroundColor Yellow
}

function Write-Error($message) {
    Write-Host "[ERROR] $message" -ForegroundColor Red
}

Write-Info "Starting deployment to $Environment environment..."

# Check if Azure CLI is installed
try {
    $null = Get-Command az -ErrorAction Stop
} catch {
    Write-Error "Azure CLI is not installed. Please install it first."
    exit 1
}

# Check if logged into Azure
try {
    $null = az account show 2>$null
} catch {
    Write-Warning "Not logged into Azure. Running az login..."
    az login
}

# Create resource group if it doesn't exist
Write-Info "Creating resource group: $ResourceGroup"
az group create --name $ResourceGroup --location $Location --output none

if ($LASTEXITCODE -eq 0) {
    Write-Success "Resource group created/verified"
} else {
    Write-Error "Failed to create resource group"
    exit 1
}

# Deploy infrastructure using Bicep
Write-Info "Deploying infrastructure..."
$DeploymentOutput = az deployment group create `
    --resource-group $ResourceGroup `
    --template-file infrastructure/main.bicep `
    --parameters "@infrastructure/parameters.$Environment.json" `
    --output json | ConvertFrom-Json

if ($LASTEXITCODE -eq 0) {
    Write-Success "Infrastructure deployed successfully"
    
    # Extract outputs
    $WebAppUrl = $DeploymentOutput.properties.outputs.webAppUrl.value
    $WebAppName = $DeploymentOutput.properties.outputs.webAppName.value
    
    Write-Info "Web App URL: $WebAppUrl"
    Write-Info "Web App Name: $WebAppName"
} else {
    Write-Error "Infrastructure deployment failed"
    exit 1
}

# Build the application
Write-Info "Building application..."
npm ci
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Success "Application built successfully"
} else {
    Write-Error "Application build failed"
    exit 1
}

# Create deployment package
Write-Info "Creating deployment package..."
$ExcludePatterns = @('node_modules', '.git', '*.log', '.env*', 'deployment.zip')
$FilesToZip = Get-ChildItem -Path . -Recurse | Where-Object {
    $file = $_
    -not ($ExcludePatterns | Where-Object { $file.FullName -like "*$_*" })
}

Compress-Archive -Path $FilesToZip -DestinationPath deployment.zip -Force

if ($LASTEXITCODE -eq 0) {
    Write-Success "Deployment package created"
} else {
    Write-Error "Failed to create deployment package"
    exit 1
}

# Deploy to Azure App Service
Write-Info "Deploying to Azure App Service..."
az webapp deployment source config-zip `
    --resource-group $ResourceGroup `
    --name $WebAppName `
    --src deployment.zip

if ($LASTEXITCODE -eq 0) {
    Write-Success "Application deployed successfully"
} else {
    Write-Error "Application deployment failed"
    exit 1
}

# Clean up
Remove-Item deployment.zip -Force

# Wait for application to start
Write-Info "Waiting for application to start..."
Start-Sleep -Seconds 30

# Health check
Write-Info "Performing health check..."
$HealthUrl = "$WebAppUrl/api/health"
try {
    $Response = Invoke-WebRequest -Uri $HealthUrl -UseBasicParsing -TimeoutSec 10
    $HttpStatus = $Response.StatusCode
} catch {
    $HttpStatus = $_.Exception.Response.StatusCode.Value__
}

if ($HttpStatus -eq 200) {
    Write-Success "Health check passed! Application is running."
    Write-Success "🚀 Deployment completed successfully!"
    Write-Info "Application URL: $WebAppUrl"
} else {
    Write-Warning "Health check failed (HTTP $HttpStatus). Application may still be starting."
    Write-Info "Application URL: $WebAppUrl"
}

# Display useful information
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Deployment Summary" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Environment: $Environment"
Write-Host "Resource Group: $ResourceGroup"
Write-Host "Web App Name: $WebAppName"
Write-Host "Application URL: $WebAppUrl"
Write-Host "Health Check URL: $HealthUrl"
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

Write-Success "Deployment script completed!"

# Optional: Open the application in browser
$OpenBrowser = Read-Host "Do you want to open the application in your browser? (y/n)"
if ($OpenBrowser -eq "y" -or $OpenBrowser -eq "Y") {
    Start-Process $WebAppUrl
}
