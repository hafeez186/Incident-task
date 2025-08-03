# Step 7: Deploy Application Code to Azure
# This script deploys your incident management application to Azure App Service

Write-Host "========================================" -ForegroundColor Green
Write-Host "Step 7: Deploy Application Code to Azure" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Check if Azure CLI is logged in
$azAccount = az account show 2>$null
if (-not $azAccount) {
    Write-Host "❌ You need to login to Azure CLI first" -ForegroundColor Red
    Write-Host "Run: az login" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Azure CLI is authenticated" -ForegroundColor Green

# Set variables (update these with your values)
$RESOURCE_GROUP = Read-Host "Enter your Resource Group name (e.g., rg-incident-mgmt-dev)"
$APP_SERVICE_NAME = Read-Host "Enter your App Service name (e.g., app-incident-mgmt-dev-001)"
$AZURE_DEVOPS_ORG = Read-Host "Enter your Azure DevOps Organization URL (e.g., https://dev.azure.com/yourorg)"
$PROJECT_NAME = Read-Host "Enter your Azure DevOps Project name (e.g., incident-management-tool)"

Write-Host "`n🔧 Configuring deployment settings..." -ForegroundColor Blue

# Step 1: Set up deployment from Azure DevOps
Write-Host "`n1. Setting up continuous deployment..." -ForegroundColor Cyan

# Get App Service details
$appService = az webapp show --name $APP_SERVICE_NAME --resource-group $RESOURCE_GROUP --query "{id:id,defaultHostName:defaultHostName}" -o json | ConvertFrom-Json

if (-not $appService) {
    Write-Host "❌ App Service '$APP_SERVICE_NAME' not found in resource group '$RESOURCE_GROUP'" -ForegroundColor Red
    Write-Host "Make sure you've run Step 6 to create the infrastructure first" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Found App Service: $($appService.defaultHostName)" -ForegroundColor Green

# Step 2: Configure App Service settings
Write-Host "`n2. Configuring App Service environment variables..." -ForegroundColor Cyan

# Set essential App Service configuration
az webapp config appsettings set --name $APP_SERVICE_NAME --resource-group $RESOURCE_GROUP --settings `
    "NODE_ENV=production" `
    "WEBSITE_NODE_DEFAULT_VERSION=18.17.0" `
    "SCM_DO_BUILD_DURING_DEPLOYMENT=true" `
    "ENABLE_ORYX_BUILD=true" `
    "PRE_BUILD_COMMAND=npm ci" `
    "POST_BUILD_COMMAND=npm run build"

Write-Host "✅ App Service settings configured" -ForegroundColor Green

# Step 3: Set up deployment credentials (if needed)
Write-Host "`n3. Setting up deployment credentials..." -ForegroundColor Cyan

# Generate deployment credentials
$deploymentCredentials = az webapp deployment list-publishing-credentials --name $APP_SERVICE_NAME --resource-group $RESOURCE_GROUP -o json | ConvertFrom-Json

Write-Host "✅ Deployment credentials ready" -ForegroundColor Green

# Step 4: Create service connection in Azure DevOps (manual step)
Write-Host "`n4. Manual Step - Create Service Connection in Azure DevOps:" -ForegroundColor Yellow
Write-Host "   a. Go to your Azure DevOps project: $AZURE_DEVOPS_ORG/$PROJECT_NAME" -ForegroundColor White
Write-Host "   b. Navigate to Project Settings > Service connections" -ForegroundColor White
Write-Host "   c. Click 'New service connection' > 'Azure Resource Manager'" -ForegroundColor White
Write-Host "   d. Choose 'Service principal (automatic)'" -ForegroundColor White
Write-Host "   e. Select your subscription and resource group: $RESOURCE_GROUP" -ForegroundColor White
Write-Host "   f. Name it 'azure-connection' (this matches the pipeline)" -ForegroundColor White
Write-Host "   g. Click 'Save'" -ForegroundColor White

$serviceConnectionDone = Read-Host "`nHave you created the service connection? (y/n)"
if ($serviceConnectionDone -ne "y") {
    Write-Host "❌ Please create the service connection first" -ForegroundColor Red
    exit 1
}

# Step 5: Set up pipeline variables
Write-Host "`n5. Setting up Azure Pipeline variables..." -ForegroundColor Cyan
Write-Host "Manual Step - Add these variables to your Azure Pipeline:" -ForegroundColor Yellow
Write-Host "   Go to: $AZURE_DEVOPS_ORG/$PROJECT_NAME/_build" -ForegroundColor White
Write-Host "   1. Click on your pipeline" -ForegroundColor White
Write-Host "   2. Click 'Edit' > 'Variables'" -ForegroundColor White
Write-Host "   3. Add these variables:" -ForegroundColor White
Write-Host "      - AZURE_SUBSCRIPTION: (your subscription name)" -ForegroundColor Cyan
Write-Host "      - RESOURCE_GROUP: $RESOURCE_GROUP" -ForegroundColor Cyan
Write-Host "      - APP_SERVICE_NAME: $APP_SERVICE_NAME" -ForegroundColor Cyan
Write-Host "      - DOCKER_REGISTRY: (if using containers)" -ForegroundColor Cyan

# Step 6: Test deployment
Write-Host "`n6. Testing deployment..." -ForegroundColor Cyan

# Option A: Direct deployment using Azure CLI (for immediate testing)
Write-Host "Option A - Direct deployment for testing:" -ForegroundColor Yellow
$directDeploy = Read-Host "Do you want to do a direct deployment test now? (y/n)"

if ($directDeploy -eq "y") {
    Write-Host "Building and deploying application..." -ForegroundColor Blue
    
    # Build the application
    Write-Host "Building Next.js application..." -ForegroundColor Blue
    npm run build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Build failed" -ForegroundColor Red
        exit 1
    }
    
    # Create deployment package
    Write-Host "Creating deployment package..." -ForegroundColor Blue
    
    # Create a temporary zip for deployment
    $zipFile = "deployment.zip"
    
    # Remove existing zip if it exists
    if (Test-Path $zipFile) {
        Remove-Item $zipFile
    }
    
    # Create zip with required files
    Compress-Archive -Path "package.json", "next.config.js", ".next", "public", "src" -DestinationPath $zipFile
    
    # Deploy to App Service
    Write-Host "Deploying to Azure App Service..." -ForegroundColor Blue
    az webapp deployment source config-zip --name $APP_SERVICE_NAME --resource-group $RESOURCE_GROUP --src $zipFile
    
    # Clean up
    Remove-Item $zipFile
    
    Write-Host "✅ Direct deployment completed!" -ForegroundColor Green
    Write-Host "🌐 Your app should be available at: https://$($appService.defaultHostName)" -ForegroundColor Green
}

# Step 7: Trigger CI/CD pipeline
Write-Host "`n7. Triggering CI/CD Pipeline..." -ForegroundColor Cyan
Write-Host "To trigger your CI/CD pipeline:" -ForegroundColor Yellow
Write-Host "   1. Make a small change to your code" -ForegroundColor White
Write-Host "   2. Commit and push to your main branch" -ForegroundColor White
Write-Host "   3. The pipeline will automatically trigger" -ForegroundColor White
Write-Host "   4. Monitor the pipeline at: $AZURE_DEVOPS_ORG/$PROJECT_NAME/_build" -ForegroundColor White

# Step 8: Health check
Write-Host "`n8. Health Check..." -ForegroundColor Cyan
Write-Host "Testing application health..." -ForegroundColor Blue

$healthUrl = "https://$($appService.defaultHostName)/api/health"
try {
    $response = Invoke-RestMethod -Uri $healthUrl -Method Get -TimeoutSec 30
    if ($response.status -eq "healthy") {
        Write-Host "✅ Application is healthy!" -ForegroundColor Green
        Write-Host "Health check response: $($response | ConvertTo-Json)" -ForegroundColor White
    } else {
        Write-Host "⚠️  Application responded but may have issues" -ForegroundColor Yellow
        Write-Host "Response: $($response | ConvertTo-Json)" -ForegroundColor White
    }
} catch {
    Write-Host "⚠️  Health check failed - app may still be starting up" -ForegroundColor Yellow
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Try checking again in a few minutes" -ForegroundColor Yellow
}

# Summary
Write-Host "`n========================================" -ForegroundColor Green
Write-Host "🎉 DEPLOYMENT SETUP COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ App Service configured" -ForegroundColor Green
Write-Host "✅ Environment variables set" -ForegroundColor Green
Write-Host "✅ Deployment credentials ready" -ForegroundColor Green
Write-Host "🌐 Application URL: https://$($appService.defaultHostName)" -ForegroundColor Cyan
Write-Host "🔧 Azure DevOps: $AZURE_DEVOPS_ORG/$PROJECT_NAME" -ForegroundColor Cyan

Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Complete the manual service connection setup if not done" -ForegroundColor White
Write-Host "2. Add pipeline variables in Azure DevOps" -ForegroundColor White
Write-Host "3. Make a code change and push to trigger the pipeline" -ForegroundColor White
Write-Host "4. Monitor the pipeline execution" -ForegroundColor White
Write-Host "5. Test your application at the URL above" -ForegroundColor White

Write-Host "`n📚 For troubleshooting, check DEPLOYMENT-GUIDE.md" -ForegroundColor Blue
