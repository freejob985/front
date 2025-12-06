# GitHub Secrets Setup Guide

## Required Secrets for SFTP Deployment

You need to add the following secrets to your GitHub repository:

### How to Add Secrets:
1. Go to your GitHub repository
2. Click on **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret** button
5. Add each secret below

### Secrets to Add:

#### 1. SFTP_HOST
- **Name:** `SFTP_HOST`
- **Value:** `82.25.96.182`

#### 2. SFTP_PORT
- **Name:** `SFTP_PORT`
- **Value:** `65002`

#### 3. SFTP_USERNAME
- **Name:** `SFTP_USERNAME`
- **Value:** `u929533639`

#### 4. SFTP_PASSWORD
- **Name:** `SFTP_PASSWORD`
- **Value:** `Zox+LvycqC:vNM0?`

#### 5. SFTP_REMOTE_PATH
- **Name:** `SFTP_REMOTE_PATH`
- **Value:** `/home/u929533639/domains/eliteonegrocery.com/public_html/`

## Workflow Triggers

The deployment will run automatically when:
- You push changes to `main` or `master` branch that include files in the `dist` folder
- You can also trigger it manually from the Actions tab

## Important Notes

⚠️ **Security:**
- Never commit these secrets to your repository
- They are stored securely in GitHub Secrets
- Only authorized users can view/edit them

✅ **What happens:**
1. Code is checked out
2. Dependencies are installed
3. Project is built (`npm run build`)
4. The `dist` folder is deployed to your server via SFTP

## Testing the Workflow

After setting up the secrets:
1. Make a change to your code
2. Run `npm run build` locally
3. Commit and push the `dist` folder changes
4. Go to the **Actions** tab in GitHub to see the deployment progress

## Troubleshooting

If deployment fails:
- Check the Actions logs in GitHub
- Verify all secrets are set correctly
- Ensure the server credentials are valid
- Check that the remote path exists on the server
