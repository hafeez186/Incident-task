#!/bin/bash

# Azure Deployment Script for Incident Management Tool
# Usage: ./deploy.sh [dev|staging|prod]

set -e

# Configuration
ENVIRONMENT=${1:-dev}
RESOURCE_GROUP="rg-incident-management-${ENVIRONMENT}"
LOCATION="East US"
APP_NAME="incident-mgmt-${ENVIRONMENT}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(dev|staging|prod)$ ]]; then
    print_error "Invalid environment. Use: dev, staging, or prod"
    exit 1
fi

print_status "Starting deployment to ${ENVIRONMENT} environment..."

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    print_error "Azure CLI is not installed. Please install it first."
    exit 1
fi

# Check if logged into Azure
if ! az account show &> /dev/null; then
    print_warning "Not logged into Azure. Running az login..."
    az login
fi

# Create resource group if it doesn't exist
print_status "Creating resource group: ${RESOURCE_GROUP}"
az group create --name "$RESOURCE_GROUP" --location "$LOCATION" --output none

if [ $? -eq 0 ]; then
    print_success "Resource group created/verified"
else
    print_error "Failed to create resource group"
    exit 1
fi

# Deploy infrastructure using Bicep
print_status "Deploying infrastructure..."
DEPLOYMENT_OUTPUT=$(az deployment group create \
    --resource-group "$RESOURCE_GROUP" \
    --template-file infrastructure/main.bicep \
    --parameters @infrastructure/parameters.${ENVIRONMENT}.json \
    --output json)

if [ $? -eq 0 ]; then
    print_success "Infrastructure deployed successfully"
    
    # Extract outputs
    WEB_APP_URL=$(echo "$DEPLOYMENT_OUTPUT" | jq -r '.properties.outputs.webAppUrl.value')
    WEB_APP_NAME=$(echo "$DEPLOYMENT_OUTPUT" | jq -r '.properties.outputs.webAppName.value')
    
    print_status "Web App URL: $WEB_APP_URL"
    print_status "Web App Name: $WEB_APP_NAME"
else
    print_error "Infrastructure deployment failed"
    exit 1
fi

# Build the application
print_status "Building application..."
npm ci
npm run build

if [ $? -eq 0 ]; then
    print_success "Application built successfully"
else
    print_error "Application build failed"
    exit 1
fi

# Create deployment package
print_status "Creating deployment package..."
zip -r deployment.zip . -x "node_modules/*" ".git/*" "*.log" ".env*" "deployment.zip"

if [ $? -eq 0 ]; then
    print_success "Deployment package created"
else
    print_error "Failed to create deployment package"
    exit 1
fi

# Deploy to Azure App Service
print_status "Deploying to Azure App Service..."
az webapp deployment source config-zip \
    --resource-group "$RESOURCE_GROUP" \
    --name "$WEB_APP_NAME" \
    --src deployment.zip

if [ $? -eq 0 ]; then
    print_success "Application deployed successfully"
else
    print_error "Application deployment failed"
    exit 1
fi

# Clean up
rm deployment.zip

# Wait for application to start
print_status "Waiting for application to start..."
sleep 30

# Health check
print_status "Performing health check..."
HEALTH_URL="${WEB_APP_URL}/api/health"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL")

if [ "$HTTP_STATUS" -eq 200 ]; then
    print_success "Health check passed! Application is running."
    print_success "🚀 Deployment completed successfully!"
    print_status "Application URL: $WEB_APP_URL"
else
    print_warning "Health check failed (HTTP $HTTP_STATUS). Application may still be starting."
    print_status "Application URL: $WEB_APP_URL"
fi

# Display useful information
echo ""
echo "================================================"
echo "Deployment Summary"
echo "================================================"
echo "Environment: $ENVIRONMENT"
echo "Resource Group: $RESOURCE_GROUP"
echo "Web App Name: $WEB_APP_NAME"
echo "Application URL: $WEB_APP_URL"
echo "Health Check URL: $HEALTH_URL"
echo "================================================"
echo ""

print_success "Deployment script completed!"

# Optional: Open the application in browser
read -p "Do you want to open the application in your browser? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v xdg-open &> /dev/null; then
        xdg-open "$WEB_APP_URL"
    elif command -v open &> /dev/null; then
        open "$WEB_APP_URL"
    else
        print_status "Please open $WEB_APP_URL in your browser"
    fi
fi
