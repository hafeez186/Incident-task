# Manual Deployment Guide

This project is configured for manual deployment only. All CI/CD automation has been removed for simplicity.

## Development

### Start Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:3000`

### Build for Production
```bash
npm run build
```

## Manual Deployment Options

### 1. Deploy to Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`

### 2. Deploy to Netlify
1. Build the application: `npm run build`
2. Drag and drop the `.next` folder to Netlify dashboard
3. Or use Netlify CLI:
   ```bash
   npm i -g netlify-cli
   netlify login
   netlify deploy --prod --dir=.next
   ```

### 3. Deploy to Azure App Service (Manual)
1. Install Azure CLI
2. Login: `az login`
3. Create resource group: `az group create --name myapp-rg --location "East US"`
4. Create app service plan: `az appservice plan create --name myapp-plan --resource-group myapp-rg --sku B1 --is-linux`
5. Create web app: `az webapp create --name myapp --resource-group myapp-rg --plan myapp-plan --runtime "NODE:18-lts"`
6. Build and zip: `npm run build && zip -r app.zip .next package.json node_modules`
7. Deploy: `az webapp deployment source config-zip --resource-group myapp-rg --name myapp --src app.zip`

### 4. Deploy to GitHub Pages (Static)
1. Modify `next.config.js` to add: `output: 'export'`
2. Build: `npm run build`
3. Push the `out` folder to `gh-pages` branch

## VS Code Tasks
- **Start Development Server**: Starts the dev server on port 3000
- **Build Application**: Creates production build

Use `Ctrl+Shift+P` > "Tasks: Run Task" to run these tasks.

## Environment Variables
Set these in your deployment platform:
- `NODE_ENV=production`
- Add any other environment variables your app needs

## Notes
- No automated CI/CD pipelines
- All deployments are manual
- Use the platform of your choice
- Make sure to build the app before deploying
