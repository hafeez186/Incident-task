# Complete CI/CD Deployment Guide for Azure
## Incident Management Tool with AI-Powered KB Assistant

This guide will walk you through deploying your Next.js incident management application to Azure using a complete CI/CD pipeline with Azure DevOps.

## 🎯 Overview

You'll be setting up:
- **Azure App Service** for hosting your Next.js application
- **Azure DevOps** for CI/CD pipeline
- **Infrastructure as Code** using Bicep templates
- **Automated deployment** with build, test, and deploy stages

## 📋 Prerequisites

Before starting, ensure you have:
- Azure subscription with sufficient credits
- Windows PowerShell (scripts are optimized for Windows)
- Git installed
- Node.js 18+ installed
- Your project ready in the workspace

## 🚀 Step-by-Step Deployment Process

### Phase 1: Initial Setup

#### Step 1: Install Azure CLI
```powershell
.\install-azure-cli.ps1
```
This script will:
- Download and install Azure CLI
- Verify the installation
- Login to your Azure account

#### Step 2: Azure Account and Resource Setup
```powershell
.\step-2-azure-setup.ps1
```
This script will:
- Create a resource group
- Set up your Azure subscription
- Configure basic Azure settings

### Phase 2: DevOps Setup

#### Step 3: Azure DevOps Project Setup
```powershell
.\step-3-devops-setup.ps1
```
This script will:
- Create an Azure DevOps organization (if needed)
- Set up a new project
- Install required extensions

#### Step 4: Git and Azure Repos Setup
```powershell
.\step-4-git-setup.ps1
```
This script will:
- Initialize Git repository
- Create Azure Repo
- Push your code to Azure DevOps

#### Step 5: Azure Pipeline Setup
```powershell
.\step-5-pipeline-setup.ps1
```
This script will:
- Create the CI/CD pipeline
- Configure pipeline variables
- Set up build triggers

### Phase 3: Infrastructure Deployment

#### Step 6: Deploy Azure Infrastructure
```powershell
.\step-6-infrastructure.ps1
```
This script will:
- Deploy App Service using Bicep templates
- Configure networking and security
- Set up monitoring and logging

### Phase 4: Application Deployment

#### Step 7: Deploy Application Code
```powershell
.\step-7-deploy-application.ps1
```
This script will:
- Configure App Service settings
- Set up deployment credentials
- Deploy your application
- Run health checks

## 🔧 Manual Configuration Steps

Some steps require manual configuration through the Azure portal:

### Service Connection Setup
1. Go to Azure DevOps → Project Settings → Service connections
2. Create new Azure Resource Manager connection
3. Use Service Principal (automatic)
4. Name it `azure-connection`

### Pipeline Variables
Add these variables in Azure DevOps → Pipelines → Your Pipeline → Variables:
- `AZURE_SUBSCRIPTION`: Your Azure subscription name
- `RESOURCE_GROUP`: Your resource group name
- `APP_SERVICE_NAME`: Your App Service name

## 📁 Project Structure After Setup

```
your-project/
├── azure-pipelines.yml          # CI/CD pipeline configuration
├── Dockerfile                   # Container configuration
├── docker-compose.yml          # Local development
├── infrastructure/              # Infrastructure as Code
│   ├── main.bicep              # Main Bicep template
│   ├── parameters.dev.json     # Dev environment parameters
│   └── parameters.prod.json    # Prod environment parameters
├── scripts/                    # Deployment scripts
│   ├── deploy.sh              # Linux deployment script
│   └── deploy.ps1             # Windows deployment script
├── step-*.ps1                 # Step-by-step setup scripts
└── src/                       # Your application code
```

## 🌐 Azure Resources Created

After running all scripts, you'll have:

### Resource Group
- **Name**: `rg-incident-mgmt-{environment}`
- **Location**: East US (configurable)

### App Service Plan
- **SKU**: B1 (Basic, scalable to higher tiers)
- **OS**: Linux
- **Runtime**: Node.js 18

### App Service
- **Name**: `app-incident-mgmt-{environment}-{unique-id}`
- **HTTPS Only**: Enabled
- **Health Check**: `/api/health`

### Application Insights
- **Monitoring**: Performance and availability
- **Alerts**: Configured for failures

## 🔄 CI/CD Pipeline Stages

### Stage 1: Build
- Install Node.js dependencies
- Run ESLint for code quality
- Build Next.js application
- Run unit tests
- Create deployment artifacts

### Stage 2: Deploy to Development
- Deploy to dev App Service
- Run health checks
- Smoke tests

### Stage 3: Deploy to Production (Manual Approval)
- Requires manual approval
- Deploy to production App Service
- Post-deployment validation

## 🧪 Testing Your Deployment

### Local Testing
```powershell
# Test the build locally
npm run build
npm start

# Test with Docker
docker-compose up --build
```

### Health Check Endpoints
- **Application Health**: `https://your-app.azurewebsites.net/api/health`
- **Build Info**: `https://your-app.azurewebsites.net/api/build-info`

### Pipeline Testing
1. Make a small code change
2. Commit and push to main branch
3. Monitor pipeline at Azure DevOps
4. Check deployment logs

## 🔧 Troubleshooting

### Common Issues and Solutions

#### Build Failures
```powershell
# Check Node.js version
node --version

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Deployment Failures
- Check App Service logs in Azure Portal
- Verify environment variables are set
- Ensure service connection is properly configured

#### Health Check Failures
- Wait 2-3 minutes for app to fully start
- Check Application Insights for errors
- Verify `/api/health` endpoint is accessible

### Useful Commands

```powershell
# Check Azure resources
az resource list --resource-group rg-incident-mgmt-dev

# View App Service logs
az webapp log tail --name your-app-name --resource-group your-rg

# Restart App Service
az webapp restart --name your-app-name --resource-group your-rg

# Check pipeline status
az pipelines runs list --project your-project
```

## 🏆 Competition Readiness

Your application is now competition-ready with:

✅ **Professional CI/CD Pipeline**
- Automated testing and deployment
- Multi-environment support
- Infrastructure as Code

✅ **Production-Grade Infrastructure**
- Scalable App Service
- Monitoring and alerting
- Health checks and logging

✅ **Modern Development Practices**
- TypeScript for type safety
- ESLint for code quality
- Docker containerization
- Automated testing

✅ **AI-Powered Features**
- Knowledge base suggestions
- Smart team routing
- Real-time analysis

## 📞 Getting Help

If you encounter issues:
1. Check the troubleshooting section above
2. Review Azure Portal logs
3. Check Azure DevOps pipeline logs
4. Refer to `CI-CD-SETUP-COMPLETE.md` for detailed configuration

## 🎉 Next Steps

After successful deployment:
1. **Set up monitoring alerts** in Application Insights
2. **Configure custom domains** if needed
3. **Set up staging environments** for testing
4. **Add performance monitoring** and optimization
5. **Prepare your competition presentation** using `PRESENTATION-GUIDE.md`

## 📊 Competition Presentation Points

Highlight these achievements in your presentation:
- **End-to-end automation** from code commit to production
- **Infrastructure as Code** for reproducible deployments
- **Multi-stage pipeline** with testing and validation
- **Production-ready monitoring** and health checks
- **Modern development practices** and clean architecture

---

**🏆 Your incident management tool is now professionally deployed and competition-ready!**
