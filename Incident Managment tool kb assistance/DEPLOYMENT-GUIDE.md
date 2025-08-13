# 🚀 Azure CI/CD Deployment Guide

## 📋 **Prerequisites**

### **Azure Requirements**
- Azure subscription with appropriate permissions
- Azure DevOps organization and project
- Azure CLI installed locally

### **Local Development Requirements**
- Node.js 18.x or higher
- npm or yarn package manager
- Docker Desktop (for containerized deployment)
- Git for version control

---

## 🔧 **Step-by-Step Setup**

### **1. Create Azure DevOps Project**

```bash
# Login to Azure
az login

# Create resource group
az group create --name rg-incident-management --location "East US"

# Create Azure DevOps project (if using Azure DevOps CLI)
az devops project create --name "IncidentMgmtTool"
```

### **2. Set Up Repository**

```bash
# Initialize git repository (if not already done)
git init
git add .
git commit -m "Initial commit: Incident Management Tool with CI/CD"

# Add Azure DevOps remote
git remote add origin https://dev.azure.com/yourorg/IncidentMgmtTool/_git/IncidentMgmtTool
git push -u origin main

# Create develop branch
git checkout -b develop
git push -u origin develop
```

### **3. Configure Azure Pipeline Variables**

In Azure DevOps → Pipelines → Variables, add:

| Variable Name | Value | Secret |
|---------------|-------|--------|
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | Your Static Web Apps token | ✅ |
| `azureSubscription` | Your Azure subscription | ❌ |
| `webAppName` | incident-management-app | ❌ |
| `resourceGroupName` | rg-incident-management | ❌ |
| `OPENAI_API_KEY` | Your OpenAI API key | ✅ |

### **4. Deploy Azure Infrastructure**

```bash
# Deploy using Azure CLI
az deployment group create \
  --resource-group rg-incident-management \
  --template-file infrastructure/main.bicep \
  --parameters @infrastructure/parameters.prod.json

# Or deploy using Azure PowerShell
New-AzResourceGroupDeployment `
  -ResourceGroupName "rg-incident-management" `
  -TemplateFile "infrastructure/main.bicep" `
  -TemplateParameterFile "infrastructure/parameters.prod.json"
```

### **5. Create Pipeline**

1. Go to Azure DevOps → Pipelines → New Pipeline
2. Select "Azure Repos Git"
3. Choose your repository
4. Select "Existing Azure Pipelines YAML file"
5. Choose `/azure-pipelines.yml`
6. Save and run

---

## 🐳 **Docker Deployment Options**

### **Option 1: Azure Container Instances**

```bash
# Build and push to Azure Container Registry
az acr create --resource-group rg-incident-management --name incidentmgmtacr --sku Basic
az acr login --name incidentmgmtacr

# Build and tag image
docker build -t incidentmgmtacr.azurecr.io/incident-management:latest .
docker push incidentmgmtacr.azurecr.io/incident-management:latest

# Deploy to Container Instances
az container create \
  --resource-group rg-incident-management \
  --name incident-management-container \
  --image incidentmgmtacr.azurecr.io/incident-management:latest \
  --dns-name-label incident-mgmt-app \
  --ports 3000 \
  --environment-variables NODE_ENV=production
```

### **Option 2: Azure App Service (Containers)**

```bash
# Create App Service Plan for containers
az appservice plan create \
  --name incident-mgmt-plan \
  --resource-group rg-incident-management \
  --sku B1 \
  --is-linux

# Create Web App with container
az webapp create \
  --resource-group rg-incident-management \
  --plan incident-mgmt-plan \
  --name incident-mgmt-app \
  --deployment-container-image-name incidentmgmtacr.azurecr.io/incident-management:latest
```

### **Option 3: Local Docker Development**

```bash
# Start with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f incident-management-app

# Stop services
docker-compose down
```

---

## 🌐 **Static Web App Deployment**

### **Create Azure Static Web App**

```bash
# Create Static Web App
az staticwebapp create \
  --name incident-mgmt-static \
  --resource-group rg-incident-management \
  --source https://github.com/yourusername/incident-management-tool \
  --branch main \
  --app-location "/" \
  --api-location "api" \
  --output-location ".next"
```

### **Get Deployment Token**

```bash
# Get deployment token for pipeline
az staticwebapp secrets list --name incident-mgmt-static --query "properties.apiKey"
```

---

## 📊 **Monitoring and Observability**

### **Application Insights Setup**

```bash
# Get Application Insights connection string
az monitor app-insights component show \
  --app incident-management-insights \
  --resource-group rg-incident-management \
  --query connectionString
```

### **Log Analytics Queries**

```kusto
-- Application Performance
requests
| where timestamp > ago(24h)
| summarize count(), avg(duration) by bin(timestamp, 1h)
| render timechart

-- Error Analysis
exceptions
| where timestamp > ago(24h)
| summarize count() by type, outerMessage
| order by count_ desc

-- User Activity
pageViews
| where timestamp > ago(24h)
| summarize users = dcount(user_Id) by bin(timestamp, 1h)
| render timechart
```

---

## 🔧 **Environment Configuration**

### **Development Environment**

Create `.env.local`:
```env
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000/api
OPENAI_API_KEY=your_openai_key_here
APPLICATIONINSIGHTS_CONNECTION_STRING=your_app_insights_connection_string
```

### **Production Environment**

Set in Azure App Service Configuration:
```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-app.azurewebsites.net/api
OPENAI_API_KEY=@Microsoft.KeyVault(SecretUri=https://your-keyvault.vault.azure.net/secrets/openai-key/)
APPLICATIONINSIGHTS_CONNECTION_STRING=your_production_app_insights_connection_string
```

---

## 🔄 **CI/CD Pipeline Triggers**

### **Automatic Deployments**
- **Main Branch** → Production deployment
- **Develop Branch** → Staging deployment
- **Pull Requests** → Build validation only

### **Manual Deployments**
```bash
# Trigger manual deployment
az pipelines run --name "IncidentManagement-CI/CD" --branch main
```

---

## 🚨 **Troubleshooting**

### **Common Issues**

1. **Build Failures**
   ```bash
   # Clear npm cache
   npm cache clean --force
   
   # Delete node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Deployment Failures**
   ```bash
   # Check App Service logs
   az webapp log tail --name incident-mgmt-app --resource-group rg-incident-management
   
   # Check deployment status
   az webapp deployment list --name incident-mgmt-app --resource-group rg-incident-management
   ```

3. **Performance Issues**
   ```bash
   # Scale up App Service
   az appservice plan update --name incident-mgmt-plan --resource-group rg-incident-management --sku S2
   
   # Enable auto-scaling
   az monitor autoscale create --resource-group rg-incident-management --resource incident-mgmt-plan
   ```

---

## 📈 **Production Readiness Checklist**

- [ ] SSL certificate configured
- [ ] Custom domain configured
- [ ] Application Insights monitoring
- [ ] Auto-scaling configured
- [ ] Security headers implemented
- [ ] Database backups scheduled
- [ ] Health checks enabled
- [ ] Load testing completed
- [ ] Security scanning done
- [ ] Performance optimized

---

## 🎯 **Next Steps**

1. **Security Enhancements**
   - Implement Azure AD authentication
   - Set up Web Application Firewall
   - Configure Private Endpoints

2. **Performance Optimization**
   - Implement CDN for static assets
   - Add Redis caching layer
   - Optimize database queries

3. **Advanced Monitoring**
   - Set up alerts and notifications
   - Implement distributed tracing
   - Add custom dashboards

---

**Your incident management tool is now ready for enterprise-scale deployment! 🚀**
