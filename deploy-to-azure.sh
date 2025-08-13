#!/bin/bash
# Quick Azure App Service Deployment Script
# Run this from VS Code terminal

echo "🚀 Deploying to Azure App Service..."
echo ""

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI not found. Please install it first:"
    echo "   https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Check if logged in
if ! az account show &> /dev/null; then
    echo "🔐 Please login to Azure first:"
    az login
fi

# Get current directory name for default app name
CURRENT_DIR=$(basename "$(pwd)")
DEFAULT_APP_NAME="incident-mgmt-$(date +%s)"

# Prompt for app details
read -p "Enter Azure Web App name [$DEFAULT_APP_NAME]: " APP_NAME
APP_NAME=${APP_NAME:-$DEFAULT_APP_NAME}

read -p "Enter Resource Group [rg-incident-mgmt]: " RESOURCE_GROUP
RESOURCE_GROUP=${RESOURCE_GROUP:-rg-incident-mgmt}

read -p "Enter Location [East US]: " LOCATION
LOCATION=${LOCATION:-"East US"}

echo ""
echo "📋 Deployment Configuration:"
echo "   App Name: $APP_NAME"
echo "   Resource Group: $RESOURCE_GROUP"
echo "   Location: $LOCATION"
echo ""

# Create resource group if it doesn't exist
echo "🏗️ Creating resource group..."
az group create --name "$RESOURCE_GROUP" --location "$LOCATION"

# Create app service plan
PLAN_NAME="$APP_NAME-plan"
echo "📦 Creating app service plan..."
az appservice plan create \
    --name "$PLAN_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --location "$LOCATION" \
    --sku B1 \
    --is-linux

# Create web app
echo "🌐 Creating web app..."
az webapp create \
    --name "$APP_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --plan "$PLAN_NAME" \
    --runtime "NODE:18-lts"

# Configure app settings
echo "⚙️ Configuring app settings..."
az webapp config appsettings set \
    --name "$APP_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --settings \
        NODE_ENV=production \
        AZURE_WEBAPP=true \
        SCM_DO_BUILD_DURING_DEPLOYMENT=true

# Build the application
echo "🔨 Building application..."
export AZURE_WEBAPP=true
export NODE_ENV=production
npm run build

# Create deployment package
echo "📦 Creating deployment package..."
zip -r deployment.zip . \
    -x "node_modules/.cache/*" \
    -x ".git/*" \
    -x ".github/*" \
    -x "*.md" \
    -x ".env*"

# Deploy to Azure
echo "🚀 Deploying to Azure..."
az webapp deployment source config-zip \
    --resource-group "$RESOURCE_GROUP" \
    --name "$APP_NAME" \
    --src deployment.zip

# Clean up
rm deployment.zip

echo ""
echo "✅ Deployment completed!"
echo "🌐 Your app is available at: https://$APP_NAME.azurewebsites.net"
echo "📊 Monitor logs: az webapp log tail --name $APP_NAME --resource-group $RESOURCE_GROUP"
echo ""
