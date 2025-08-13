#!/bin/bash
# Startup script for Azure Web App

echo "Starting Incident Management Tool..."

# Set environment variables
export NODE_ENV=production
export AZURE_WEBAPP=true

# Start the Next.js application
echo "NODE_ENV: $NODE_ENV"
echo "AZURE_WEBAPP: $AZURE_WEBAPP"

# Run the application
node server.js
