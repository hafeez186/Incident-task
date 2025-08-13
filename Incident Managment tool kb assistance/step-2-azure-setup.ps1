# ============================================================================
# STEP 2: Azure Account Setup and Initial Configuration
# ============================================================================

# 1. Sign up for Azure (if you don't have an account)
# Go to: https://azure.microsoft.com/free/
# - Click "Start free"
# - Sign in with Microsoft account or create new one
# - Complete verification (phone number, credit card for verification only)
# - You get $200 free credits for 30 days

# 2. After Azure CLI installation, login to Azure
az login
# This will open browser for authentication

# 3. Verify your subscription
az account show
az account list --output table

# 4. Set your subscription (if you have multiple)
# az account set --subscription "Your Subscription Name"

# 5. Install Azure DevOps extension
az extension add --name azure-devops

# 6. Create a resource group for your project
$RESOURCE_GROUP = "rg-incident-management"
$LOCATION = "East US"

az group create --name $RESOURCE_GROUP --location $LOCATION

Write-Host "✅ Azure account setup complete!" -ForegroundColor Green
Write-Host "Next: Run Step 3 to create Azure DevOps project" -ForegroundColor Yellow
