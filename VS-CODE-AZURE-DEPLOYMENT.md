# Deploy from VS Code to Azure App Service

## Prerequisites
- Azure App Service extension installed in VS Code
- Azure CLI installed locally
- Azure subscription

## Method 1: Direct Deployment from VS Code

1. **Sign in to Azure:**
   - Open Command Palette (Ctrl+Shift+P)
   - Type: `Azure: Sign In`
   - Follow authentication steps

2. **Create App Service:**
   - Open Azure extension panel
   - Right-click on your subscription
   - Select "Create New Web App..."
   - Enter details:
     - Name: incident-management-kb-[unique]
     - Runtime: Node 18 LTS
     - OS: Linux
     - Plan: Create new (Basic B1)

3. **Deploy Application:**
   - Right-click on project root folder
   - Select "Deploy to Web App..."
   - Choose your App Service
   - Select "Yes" to build settings
   - Wait for deployment

## Method 2: Git-based Deployment

1. **Enable Git deployment in Azure:**
   - Go to Azure Portal → Your App Service
   - Settings → Deployment Center
   - Source: Local Git
   - Copy the Git URL

2. **Add Azure as remote:**
   ```bash
   git remote add azure <your-git-url>
   git push azure main
   ```

## Method 3: Using Azure CLI from VS Code Terminal

1. **Login to Azure:**
   ```bash
   az login
   ```

2. **Create resource group (if needed):**
   ```bash
   az group create --name rg-incident-mgmt --location "East US"
   ```

3. **Create App Service Plan:**
   ```bash
   az appservice plan create --name incident-plan --resource-group rg-incident-mgmt --sku B1 --is-linux
   ```

4. **Create Web App:**
   ```bash
   az webapp create --name incident-mgmt-[unique] --resource-group rg-incident-mgmt --plan incident-plan --runtime "NODE:18-lts"
   ```

5. **Deploy using ZIP:**
   ```bash
   # Create deployment package
   npm run build
   
   # Deploy
   az webapp deployment source config-zip --resource-group rg-incident-mgmt --name incident-mgmt-[unique] --src ./deployment.zip
   ```

## VS Code Tasks for Easy Deployment

The following tasks are available in VS Code (Ctrl+Shift+P → "Tasks: Run Task"):

1. **Azure: Build and Deploy**
2. **Azure: Deploy Only** 
3. **Azure: View Logs**

## Environment Variables for Azure

Set these in your Azure App Service → Configuration → Application Settings:
- `NODE_ENV=production`
- `AZURE_WEBAPP=true`
- `SCM_DO_BUILD_DURING_DEPLOYMENT=true`

## Monitoring Deployment

- **VS Code Output Panel**: View deployment progress
- **Azure Portal**: Monitor app performance
- **Log Stream**: Real-time application logs

## Updated GitHub Actions (August 2025)

✅ **Latest Action Versions Used:**
- `actions/upload-artifact@v4` (updated from deprecated v3)
- `actions/download-artifact@v4` (updated from deprecated v3)
- `azure/webapps-deploy@v3` (latest version)
- `actions/checkout@v4` and `actions/setup-node@v4`
