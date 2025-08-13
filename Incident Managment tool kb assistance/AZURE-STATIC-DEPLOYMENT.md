# 🚀 Azure Static Web Apps Deployment Guide

## 📋 Overview
This guide will help you deploy your AI-powered Incident Management Tool as an Azure Static Web App for optimal performance and global distribution.

## 🔧 Prerequisites
- Azure subscription
- GitHub account
- Azure CLI installed

## 📱 Deployment Steps

### 1. Prepare Your Application
Your app is now configured for static export with:
- ✅ Next.js static export enabled
- ✅ Static web app configuration file
- ✅ GitHub Actions workflow
- ✅ Optimized build scripts

### 2. Create Azure Static Web App

#### Option A: Using Azure Portal
1. Go to [Azure Portal](https://portal.azure.com)
2. Click "Create a resource"
3. Search for "Static Web Apps"
4. Click "Create"
5. Fill in the details:
   - **Subscription**: Your subscription
   - **Resource Group**: Create new or use existing
   - **Name**: `incident-management-app`
   - **Plan type**: Free (for demo) or Standard
   - **Region**: Choose closest to your users
   - **Source**: GitHub
   - **Organization**: Your GitHub username
   - **Repository**: Your repo name
   - **Branch**: main
   - **Build Presets**: Custom
   - **App location**: `Incident Managment tool kb assistance`
   - **Output location**: `out`

#### Option B: Using Azure CLI
```bash
# Login to Azure
az login

# Create resource group
az group create --name rg-incident-management --location "East US"

# Create static web app
az staticwebapp create \
  --name incident-management-app \
  --resource-group rg-incident-management \
  --source https://github.com/yourusername/your-repo-name \
  --location "East US" \
  --branch main \
  --app-location "Incident Managment tool kb assistance" \
  --output-location "out" \
  --login-with-github
```

### 3. Configure GitHub Secrets
After creating the Static Web App, Azure will provide an API token. Add it to your GitHub repository:

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `AZURE_STATIC_WEB_APPS_API_TOKEN`
5. Value: The token from Azure portal

### 4. Test Local Build
```bash
# Test the static export locally
npm run export

# Check the output directory
ls out/
```

### 5. Deploy
1. Push your code to the main branch
2. GitHub Actions will automatically build and deploy
3. Check the Actions tab for deployment status
4. Your app will be available at: `https://your-app-name.azurestaticapps.net`

## 🌐 Custom Domain (Optional)

### Add Custom Domain
1. In Azure Portal, go to your Static Web App
2. Click "Custom domains" in the left menu
3. Click "Add"
4. Enter your domain name
5. Follow the DNS configuration instructions

### SSL Certificate
Azure Static Web Apps automatically provides SSL certificates for custom domains.

## 📊 Monitoring & Analytics

### Built-in Features
- **Application Insights**: Automatic performance monitoring
- **Usage Analytics**: User behavior tracking
- **Error Tracking**: Automatic error logging
- **Performance Metrics**: Load times and user experience

### Enable Application Insights
```bash
# Create Application Insights resource
az monitor app-insights component create \
  --app incident-management-insights \
  --location "East US" \
  --resource-group rg-incident-management \
  --application-type web
```

## 🔐 Security & Performance

### Security Headers (Already Configured)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Content Security Policy
- HTTPS enforcement

### Performance Optimizations
- **Global CDN**: Automatic worldwide distribution
- **Compression**: Gzip/Brotli compression enabled
- **Caching**: Optimal cache headers configured
- **Image Optimization**: Next.js image optimization

## 🎯 Environment Variables

### Configure App Settings
1. In Azure Portal, go to your Static Web App
2. Click "Configuration" in the left menu
3. Add environment variables:
   - `NEXT_PUBLIC_API_URL`: Your API endpoint
   - `OPENAI_API_KEY`: Your OpenAI API key (if using)

## 📈 Scaling & Pricing

### Free Tier Limits
- **Bandwidth**: 100 GB/month
- **Storage**: 0.5 GB
- **Custom domains**: 2
- **Staging environments**: 3

### Standard Tier Benefits
- **Bandwidth**: 500 GB/month
- **Storage**: 2 GB
- **Custom domains**: 5
- **Authentication**: Azure AD integration
- **Functions**: Serverless API support

## 🚀 Post-Deployment Checklist

### Verify Deployment
- [ ] App loads correctly at Azure URL
- [ ] All pages are accessible
- [ ] PWA features work (offline, install)
- [ ] Mobile responsiveness
- [ ] All static assets load

### Performance Testing
- [ ] Google PageSpeed Insights score > 90
- [ ] Lighthouse audit passes
- [ ] Mobile performance optimized
- [ ] Core Web Vitals green

### SEO & Accessibility
- [ ] Meta tags present
- [ ] Structured data configured
- [ ] Accessibility compliant
- [ ] Mobile-friendly test passes

## 🔄 Continuous Deployment

### Automatic Deployments
- ✅ Pushes to main branch trigger deployment
- ✅ Pull requests create preview environments
- ✅ Rollback capabilities available
- ✅ Build logs and error tracking

### Branch Strategies
- **Main**: Production deployment
- **Develop**: Staging environment
- **Feature**: Preview deployments

## 💡 Tips for Success

### Optimization Tips
1. **Minimize bundle size**: Use dynamic imports
2. **Optimize images**: Use Next.js Image component
3. **Cache strategies**: Leverage CDN caching
4. **Monitor performance**: Use Application Insights

### Troubleshooting
- Check build logs in GitHub Actions
- Verify all paths are relative
- Ensure no server-side features in static export
- Test locally before deploying

## 📞 Support Resources

### Documentation
- [Azure Static Web Apps Docs](https://docs.microsoft.com/azure/static-web-apps/)
- [Next.js Static Export](https://nextjs.org/docs/advanced-features/static-html-export)
- [GitHub Actions for Azure](https://github.com/Azure/actions)

### Monitoring URLs
- **Azure Portal**: https://portal.azure.com
- **GitHub Actions**: Your repo → Actions tab
- **App URL**: https://your-app-name.azurestaticapps.net

## 🎉 Success!

Your AI-powered Incident Management Tool is now deployed as a globally distributed, high-performance static web app on Azure! 🚀

### Key Benefits Achieved:
- ⚡ **Lightning fast**: Global CDN distribution
- 🔒 **Secure**: HTTPS and security headers
- 📱 **Mobile optimized**: PWA capabilities
- 💰 **Cost effective**: Pay-as-you-use pricing
- 🌍 **Global reach**: Worldwide availability
