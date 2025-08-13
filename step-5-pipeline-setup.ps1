# ============================================================================
# STEP 5: Create Azure CI/CD Pipeline
# ============================================================================

Write-Host "Creating Azure DevOps CI/CD Pipeline..." -ForegroundColor Blue

Write-Host "📋 MANUAL STEPS IN AZURE DEVOPS:" -ForegroundColor Yellow
Write-Host "=================================" -ForegroundColor Yellow

Write-Host "`n1️⃣ CREATE PIPELINE:" -ForegroundColor Green
Write-Host "   • Go to Azure DevOps: https://dev.azure.com" -ForegroundColor White
Write-Host "   • Navigate to your project" -ForegroundColor White
Write-Host "   • Click 'Pipelines' > 'New pipeline'" -ForegroundColor White
Write-Host "   • Select 'Azure Repos Git'" -ForegroundColor White
Write-Host "   • Choose your repository" -ForegroundColor White
Write-Host "   • Select 'Existing Azure Pipelines YAML file'" -ForegroundColor White
Write-Host "   • Choose 'azure-pipelines.yml' from root directory" -ForegroundColor White
Write-Host "   • Click 'Continue' and then 'Save and run'" -ForegroundColor White

Write-Host "`n2️⃣ SET PIPELINE VARIABLES:" -ForegroundColor Green
Write-Host "   Go to Pipelines > Your Pipeline > Edit > Variables" -ForegroundColor White
Write-Host "   Add these variables:" -ForegroundColor White

$variables = @(
    @{Name="azureSubscription"; Value="Your Azure Subscription Name"; Secret=$false},
    @{Name="webAppName"; Value="incident-mgmt-app-$(Build.BuildId)"; Secret=$false},
    @{Name="resourceGroupName"; Value="rg-incident-management"; Secret=$false},
    @{Name="OPENAI_API_KEY"; Value="your_openai_api_key_here"; Secret=$true},
    @{Name="AZURE_STATIC_WEB_APPS_API_TOKEN"; Value="(will get this in next step)"; Secret=$true}
)

foreach ($var in $variables) {
    $secretText = if ($var.Secret) { " (🔒 Secret)" } else { "" }
    Write-Host "   ✓ $($var.Name) = $($var.Value)$secretText" -ForegroundColor Cyan
}

Write-Host "`n3️⃣ CREATE SERVICE CONNECTION:" -ForegroundColor Green
Write-Host "   • Go to Project Settings > Service connections" -ForegroundColor White
Write-Host "   • Click 'New service connection'" -ForegroundColor White
Write-Host "   • Select 'Azure Resource Manager'" -ForegroundColor White
Write-Host "   • Choose 'Service principal (automatic)'" -ForegroundColor White
Write-Host "   • Select your subscription and resource group" -ForegroundColor White
Write-Host "   • Name it: 'azure-subscription-service-connection'" -ForegroundColor White
Write-Host "   • Grant access permission to all pipelines" -ForegroundColor White

Write-Host "`n4️⃣ UPDATE PIPELINE VARIABLES:" -ForegroundColor Green
Write-Host "   Update the 'azureSubscription' variable with your service connection name" -ForegroundColor White

# Generate unique app name
$timestamp = Get-Date -Format "yyyyMMddHHmm"
$uniqueAppName = "incident-mgmt-$timestamp"

Write-Host "`n📝 RECOMMENDED VALUES:" -ForegroundColor Magenta
Write-Host "=================================" -ForegroundColor Magenta
Write-Host "azureSubscription: azure-subscription-service-connection" -ForegroundColor White
Write-Host "webAppName: $uniqueAppName" -ForegroundColor White
Write-Host "resourceGroupName: rg-incident-management" -ForegroundColor White

Write-Host "`n⚠️  IMPORTANT NOTES:" -ForegroundColor Red
Write-Host "• Keep the webAppName unique to avoid conflicts" -ForegroundColor White
Write-Host "• Mark OPENAI_API_KEY and API tokens as secret variables" -ForegroundColor White
Write-Host "• The pipeline will fail initially until all variables are set" -ForegroundColor White

Write-Host "`n✅ After completing these steps, your pipeline will be ready!" -ForegroundColor Green
Write-Host "Next: Run Step 6 to deploy Azure infrastructure" -ForegroundColor Yellow
