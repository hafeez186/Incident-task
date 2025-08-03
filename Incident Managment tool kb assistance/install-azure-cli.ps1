# Step 1: Install Azure CLI on Windows

# Option 1: Using PowerShell (Recommended)
Invoke-WebRequest -Uri https://aka.ms/installazurecliwindows -OutFile .\AzureCLI.msi; Start-Process msiexec.exe -Wait -ArgumentList '/I AzureCLI.msi /quiet'; rm .\AzureCLI.msi

# Option 2: Using Chocolatey (if you have it)
choco install azure-cli

# Option 3: Using winget
winget install Microsoft.AzureCLI

# Option 4: Download manually from:
# https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-windows

# After installation, restart PowerShell and verify:
az --version
