# Pipeline Troubleshooting Guide

This document provides step-by-step guidance for diagnosing and resolving issues in the CI/CD pipeline for the Incident Management Tool.

## Common Pipeline Issues

### 1. Build Failures
- **Check error logs**: Review the build output for TypeScript or ESLint errors.
- **Dependencies**: Ensure all dependencies are installed (`npm install`).
- **Environment variables**: Verify required environment variables are set.

### 2. Test Failures
- **Unit tests**: Run `npm test` locally to reproduce failures.
- **Mock data**: Ensure test data matches expected interfaces.
- **API mocks**: Check that API routes are properly mocked in tests.

### 3. Deployment Issues
- **Build artifacts**: Confirm that the `.next` and `out` directories are generated.
- **Environment config**: Validate deployment environment variables.
- **Logs**: Check deployment logs for errors or warnings.

## AI-Powered Suggestions

If the pipeline fails, the AI assistant can:
- Suggest relevant knowledge base articles based on error messages.
- Recommend fixes for common TypeScript, Next.js, or Tailwind CSS issues.
- Provide team routing suggestions if escalation is needed.

## Best Practices

- Commit code that passes all local tests and linting.
- Use semantic commit messages for clarity.
- Document any pipeline configuration changes in this file.

For further assistance, consult the [Knowledge Base](/kb) or contact the DevOps team.