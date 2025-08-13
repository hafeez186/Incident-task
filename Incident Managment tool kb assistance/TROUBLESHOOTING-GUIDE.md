# Troubleshooting Guide - Azure CI/CD Deployment
## Common Issues and Solutions

This guide helps you resolve common issues during the Azure deployment process.

## 🔧 Quick Fixes

### Before You Start
Always run the validation script first:
```powershell
.\validate-deployment-readiness.ps1
```

## 📋 Step-by-Step Troubleshooting

### Step 1: Azure CLI Issues

#### Issue: Azure CLI not found
```
The term 'az' is not recognized...
```
**Solution:**
```powershell
# Restart PowerShell and try again
# Or manually install Azure CLI from https://aka.ms/installazurecliwindows
```

#### Issue: Login fails
```
az login fails with timeout or browser issues
```
**Solution:**
```powershell
# Try device code authentication
az login --use-device-code

# Or use service principal
az login --service-principal -u <app-id> -p <password> --tenant <tenant>
```

### Step 2: Azure Resource Issues

#### Issue: Insufficient permissions
```
Authorization failed or access denied
```
**Solution:**
- Ensure your account has Contributor role on the subscription
- Contact your Azure administrator for proper permissions
- Check if you're in the correct subscription: `az account show`

#### Issue: Resource name conflicts
```
Resource name already exists
```
**Solution:**
```powershell
# Use different resource names or clean up existing resources
az group delete --name rg-incident-mgmt-dev --yes --no-wait
```

### Step 3: Azure DevOps Issues

#### Issue: DevOps organization not found
```
Organization does not exist
```
**Solution:**
- Create organization manually at https://dev.azure.com
- Use existing organization URL in the format: https://dev.azure.com/yourorg

#### Issue: Extension installation fails
```
Failed to install Azure DevOps extensions
```
**Solution:**
```powershell
# Install extensions manually through Azure DevOps portal
# Or skip extension installation and continue
```

### Step 4: Git Repository Issues

#### Issue: Git not initialized
```
Not a git repository
```
**Solution:**
```powershell
git init
git add .
git commit -m "Initial commit"
```

#### Issue: Push to Azure Repos fails
```
Authentication failed when pushing to Azure Repos
```
**Solution:**
```powershell
# Generate Git credentials in Azure DevOps
# Or use Personal Access Token (PAT)
git remote set-url origin https://username:PAT@dev.azure.com/org/project/_git/repo
```

### Step 5: Pipeline Issues

#### Issue: Pipeline creation fails
```
Pipeline YAML not found or invalid
```
**Solution:**
- Ensure `azure-pipelines.yml` exists in project root
- Validate YAML syntax
- Check file encoding (should be UTF-8)

#### Issue: Service connection not found
```
Service connection 'azure-connection' not found
```
**Solution:**
1. Go to Azure DevOps → Project Settings → Service connections
2. Create new Azure Resource Manager connection
3. Name it exactly `azure-connection`

### Step 6: Infrastructure Deployment Issues

#### Issue: Bicep template fails
```
Deployment template validation failed
```
**Solution:**
```powershell
# Validate template manually
az deployment group validate --resource-group your-rg --template-file infrastructure/main.bicep --parameters @infrastructure/parameters.dev.json
```

#### Issue: App Service creation fails
```
The specified resource name is not available
```
**Solution:**
- App Service names must be globally unique
- Try different names or add random suffix
- Check availability: `az webapp check-name --name your-app-name`

### Step 7: Application Deployment Issues

#### Issue: Build fails in pipeline
```
npm run build failed with exit code 1
```
**Solution:**
```powershell
# Test build locally first
npm install
npm run build

# Check for TypeScript errors
npm run type-check

# Fix lint errors
npm run lint --fix
```

#### Issue: App Service deployment timeout
```
Deployment timed out
```
**Solution:**
- Increase deployment timeout in Azure Portal
- Check App Service size (upgrade to higher tier if needed)
- Monitor deployment logs in Azure Portal

#### Issue: Application won't start
```
Application failed to start
```
**Solution:**
```powershell
# Check App Service logs
az webapp log tail --name your-app --resource-group your-rg

# Verify environment variables
az webapp config appsettings list --name your-app --resource-group your-rg

# Restart the app
az webapp restart --name your-app --resource-group your-rg
```

## 🚨 Common Error Messages

### Build Errors

#### "Module not found"
```bash
Error: Cannot resolve module 'xyz'
```
**Fix:** Check package.json dependencies and run `npm install`

#### "TypeScript compilation failed"
```bash
TS2304: Cannot find name 'xyz'
```
**Fix:** Add proper type definitions or check imports

### Deployment Errors

#### "502 Bad Gateway"
**Causes:**
- App Service is starting up (wait 2-3 minutes)
- Application crashed on startup
- Incorrect Node.js version

**Fix:**
```powershell
# Check logs
az webapp log tail --name your-app --resource-group your-rg

# Verify Node.js version
az webapp config show --name your-app --resource-group your-rg
```

#### "Health check failed"
**Causes:**
- `/api/health` endpoint not responding
- App Service not fully started
- Application error

**Fix:**
- Wait for app to fully start
- Check if health endpoint exists: `src/app/api/health/route.ts`
- Test endpoint manually: `curl https://your-app.azurewebsites.net/api/health`

## 🔍 Debugging Commands

### Check Azure Resources
```powershell
# List all resources in resource group
az resource list --resource-group rg-incident-mgmt-dev --output table

# Check App Service status
az webapp show --name your-app --resource-group your-rg --query "state"

# View App Service configuration
az webapp config show --name your-app --resource-group your-rg
```

### Check Pipeline Status
```powershell
# List recent pipeline runs
az pipelines runs list --project your-project --top 5

# Get specific run details
az pipelines runs show --project your-project --id <run-id>
```

### Application Logs
```powershell
# Stream live logs
az webapp log tail --name your-app --resource-group your-rg

# Download logs
az webapp log download --name your-app --resource-group your-rg
```

## 🛠️ Manual Recovery Steps

### Complete Reset
If everything fails, start fresh:

```powershell
# 1. Delete resource group
az group delete --name rg-incident-mgmt-dev --yes --no-wait

# 2. Delete Azure DevOps project (manual)
# Go to Azure DevOps → Project Settings → Overview → Delete

# 3. Clean local git
Remove-Item .git -Recurse -Force
git init

# 4. Start deployment again
.\deploy-all.ps1
```

### Partial Reset (Keep DevOps)
```powershell
# 1. Delete only Azure resources
az group delete --name rg-incident-mgmt-dev --yes --no-wait

# 2. Re-run infrastructure deployment
.\step-6-infrastructure.ps1
.\step-7-deploy-application.ps1
```

## 📊 Performance Optimization

### If deployment is slow:
1. **Upgrade App Service Plan**: Use B2 or S1 instead of B1
2. **Use Build Cache**: Enable npm cache in pipeline
3. **Optimize Dependencies**: Remove unused packages
4. **Use CDN**: For static assets in production

### If app is slow:
1. **Enable Application Insights**: Monitor performance
2. **Add Caching**: Implement Redis or in-memory cache
3. **Optimize Images**: Compress images in public folder
4. **Bundle Analysis**: Use Next.js bundle analyzer

## 🎯 Competition-Specific Tips

### Last-minute fixes:
1. **Demo Data**: Ensure you have good demo data ready
2. **Error Handling**: Add proper error boundaries
3. **Loading States**: Show loading indicators
4. **Mobile Responsive**: Test on mobile devices
5. **Performance**: Check Core Web Vitals

### Presentation backup:
- **Screenshots**: Take screenshots of working app
- **Video Demo**: Record a demo video as backup
- **Local Version**: Keep local version running as fallback
- **Architecture Diagram**: Prepare system architecture diagram

## 📞 Getting Help

### Resources:
- **Azure Documentation**: https://docs.microsoft.com/azure/
- **Next.js Documentation**: https://nextjs.org/docs
- **Azure DevOps Documentation**: https://docs.microsoft.com/azure/devops/

### Support Channels:
- **Azure Support**: Through Azure Portal
- **Stack Overflow**: Tag with `azure`, `nextjs`, `azure-devops`
- **GitHub Issues**: For specific package issues

### Emergency Contacts:
- **Azure Status**: https://status.azure.com/
- **Service Health**: Check Azure Portal → Service Health

---

## 📝 Quick Reference

### Essential Commands
```powershell
# Check everything is working
az account show
npm run build
docker build -t test .

# Deploy specific components
.\step-6-infrastructure.ps1
.\step-7-deploy-application.ps1

# Monitor deployment
az webapp log tail --name your-app --resource-group your-rg
```

### Validation Checklist
- [ ] Azure CLI authenticated
- [ ] Resource group exists
- [ ] App Service running
- [ ] Pipeline configured
- [ ] Application accessible
- [ ] Health check passing
- [ ] Demo data ready

**Remember**: If one step fails, you can usually continue from that step after fixing the issue. You don't need to start from the beginning unless it's a fundamental configuration problem.
