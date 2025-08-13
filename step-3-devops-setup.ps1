# ============================================================================
# STEP 3: Create Azure DevOps Organization and Project
# ============================================================================

Write-Host "Creating Azure DevOps Project..." -ForegroundColor Blue

# 1. Go to Azure DevOps and create organization (Manual step)
Write-Host "📋 MANUAL STEP REQUIRED:" -ForegroundColor Yellow
Write-Host "1. Go to: https://dev.azure.com" -ForegroundColor White
Write-Host "2. Sign in with your Azure account" -ForegroundColor White
Write-Host "3. Click 'Create organization'" -ForegroundColor White
Write-Host "4. Choose organization name (e.g., 'YourName-DevOps')" -ForegroundColor White
Write-Host "5. Choose location (same as your Azure resources)" -ForegroundColor White
Write-Host "6. Create a new project called 'IncidentManagementTool'" -ForegroundColor White
Write-Host "7. Choose 'Git' for version control" -ForegroundColor White
Write-Host "8. Choose 'Agile' for work item process" -ForegroundColor White

# 2. After creating the project manually, configure Azure DevOps CLI
Write-Host "`n🔧 After creating the project, run these commands:" -ForegroundColor Green

$ORG_URL = Read-Host "Enter your Azure DevOps organization URL (e.g., https://dev.azure.com/YourOrgName)"
$PROJECT_NAME = Read-Host "Enter your project name (default: IncidentManagementTool)"

if ([string]::IsNullOrEmpty($PROJECT_NAME)) {
    $PROJECT_NAME = "IncidentManagementTool"
}

# Configure Azure DevOps defaults
az devops configure --defaults organization=$ORG_URL project=$PROJECT_NAME

# Verify configuration
az devops project show --project $PROJECT_NAME

Write-Host "✅ Azure DevOps project configured!" -ForegroundColor Green
Write-Host "Organization: $ORG_URL" -ForegroundColor White
Write-Host "Project: $PROJECT_NAME" -ForegroundColor White
Write-Host "`nNext: Run Step 4 to push your code to Azure Repos" -ForegroundColor Yellow
