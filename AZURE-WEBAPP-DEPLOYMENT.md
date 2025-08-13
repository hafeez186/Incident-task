# Azure Web App Deployment Guide

This guide will help you deploy your Incident Management Tool to Azure Web App.

## Prerequisites

1. **Azure Account**: You need an active Azure subscription
2. **Azure CLI**: Install Azure CLI on your machine
3. **GitHub Account**: For automated deployments
4. **PowerShell**: For running deployment scripts

## Step 1: Install Azure CLI (if not already installed)

```powershell
# Using winget (Windows Package Manager)
winget install Microsoft.AzureCLI

# Or download from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-windows
```

## Step 2: Create Azure Resources

Run the deployment script to create your Azure Web App:

```powershell
# Navigate to your project directory (adjust the path to your actual project location)
cd "your-project-directory"

# Run the Azure deployment script
.\scripts\deploy-azure-webapp.ps1 -ResourceGroupName "rg-incident-mgmt" -WebAppName "your-unique-app-name" -Location "East US"
```

**Important**: Replace `your-unique-app-name` with a globally unique name for your web app.

## Step 3: Configure GitHub Secrets

After running the script, you'll get a `publish-profile.xml` file:

1. Go to your GitHub repository
2. Navigate to: **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `AZURE_WEBAPP_PUBLISH_PROFILE`
5. Value: Copy the entire content from `publish-profile.xml`

## Step 4: Update GitHub Actions Workflow

Edit `.github/workflows/azure-webapp.yml` and update:

```yaml
env:
  AZURE_WEBAPP_NAME: your-unique-app-name    # Change this to your actual app name
```

## Step 5: Deploy Your Application

1. **Commit and push your changes**:
   ```bash
   git add .
   git commit -m "Add Azure Web App deployment configuration"
   git push origin main
   ```

2. **Monitor the deployment**:
   - Go to your GitHub repository
   - Click on **Actions** tab
   - Watch the "Deploy to Azure Web App" workflow

## Step 6: Access Your Application

Once deployment is complete, your application will be available at:
```
https://your-unique-app-name.azurewebsites.net
```

## Configuration Options

### Environment Variables

The following environment variables are automatically set:

- `NODE_ENV=production`
- `AZURE_WEBAPP=true`
- `SCM_DO_BUILD_DURING_DEPLOYMENT=true`
- `ENABLE_ORYX_BUILD=true`

### Custom Domain (Optional)

To use a custom domain:

1. Go to Azure Portal → Your Web App → Custom domains
2. Add your domain
3. Configure DNS settings

### SSL Certificate (Optional)

Azure provides free SSL certificates:

1. Go to Azure Portal → Your Web App → TLS/SSL settings
2. Click "Add TLS/SSL binding"
3. Select your domain and choose "SNI SSL"

## Troubleshooting

### Common Issues:

1. **App Name Already Exists**:
   - Use a different, globally unique name for your web app

2. **Build Failures**:
   - Check the GitHub Actions logs
   - Ensure all dependencies are listed in package.json

3. **Runtime Errors**:
   - Check Azure Web App logs in the portal
   - Ensure environment variables are set correctly

### Viewing Logs:

```bash
# Stream live logs
az webapp log tail --name your-app-name --resource-group rg-incident-mgmt

# Download logs
az webapp log download --name your-app-name --resource-group rg-incident-mgmt
```

## Cost Estimation

- **B1 Basic Plan**: ~$13.14/month
- **F1 Free Plan**: $0/month (limited features)

To use Free plan, change the script parameter:
```powershell
# In deploy-azure-webapp.ps1, change:
--sku F1
```

## Next Steps

1. **Set up monitoring**: Configure Application Insights
2. **Database integration**: Add Azure SQL Database or Cosmos DB
3. **CDN setup**: Configure Azure CDN for better performance
4. **Backup strategy**: Set up automated backups

## Support

For issues:
1. Check Azure Web App logs
2. Review GitHub Actions output
3. Consult Azure documentation
4. Open an issue in this repository
