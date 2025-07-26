# Vercel Deployment Guide for Multi-Modal Hedera dApp

## Overview
This guide will walk you through deploying your Hedera dApp to Vercel, which will host both the React frontend and Node.js backend as serverless functions.

## Prerequisites
- Vercel account (free at vercel.com)
- GitHub/GitLab repository with your code
- Environment variables ready

## Step 1: Prepare Your Repository

### 1.1 Project Structure
Your project should now have this structure:
```
├── src/                    # React frontend
├── api/                    # Vercel serverless functions
│   └── index.js           # Backend API
├── backend/               # Original backend (not used in Vercel)
├── public/                # Static assets
├── package.json           # Frontend dependencies
├── vercel.json           # Vercel configuration
└── README.md
```

### 1.2 Environment Variables
You'll need to set these in Vercel dashboard:

**Frontend Variables:**
- `REACT_APP_BACKEND_URL` = `/api` (for Vercel deployment)

**Backend Variables:**
- `TARGET_WALLET` = `0.0.9177142` (or your target wallet)
- `PRIVATE_KEY` = Your Hedera private key
- `TELEGRAM_BOT_TOKEN` = Your Telegram bot token
- `TELEGRAM_CHAT_ID` = Your Telegram chat ID
- `RECEIVER_WALLET` = `0.0.9177142` (or your receiver wallet)
- `HEDERA_NETWORK` = `mainnet` (or `testnet`)

## Step 2: Deploy to Vercel

### 2.1 Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub/GitLab
3. Click "New Project"
4. Import your repository
5. Vercel will auto-detect it's a React app

### 2.2 Configure Build Settings
Vercel should auto-detect these settings:
- **Framework Preset**: Create React App
- **Build Command**: `npm run build` (or `yarn build`)
- **Output Directory**: `build`
- **Install Command**: `npm install` (or `yarn install`)

### 2.3 Set Environment Variables
In the Vercel dashboard, go to your project settings:

1. **Environment Variables** section
2. Add each variable from the list above
3. Make sure to set them for **Production**, **Preview**, and **Development**

### 2.4 Deploy
1. Click "Deploy"
2. Wait for build to complete (usually 2-3 minutes)
3. Your app will be live at `https://your-project.vercel.app`

## Step 3: Verify Deployment

### 3.1 Check Frontend
- Visit your Vercel URL
- The React app should load normally
- Check browser console for any errors

### 3.2 Test API Endpoints
Test these endpoints:
- `https://your-project.vercel.app/api/health`
- `https://your-project.vercel.app/api/balance/0.0.123456`
- `https://your-project.vercel.app/api/track-visit` (POST)

### 3.3 Check Function Logs
1. Go to Vercel dashboard
2. Click on your project
3. Go to "Functions" tab
4. Check for any errors in the logs

## Step 4: Custom Domain (Optional)

1. In Vercel dashboard, go to "Domains"
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for propagation (up to 24 hours)

## Troubleshooting

### Common Issues

**1. Build Failures**
- Check that all dependencies are in `package.json`
- Ensure Node.js version is compatible (16+)
- Check build logs in Vercel dashboard

**2. API Errors**
- Verify environment variables are set correctly
- Check function logs in Vercel dashboard
- Ensure API routes are working (`/api/*`)

**3. CORS Issues**
- The API is configured with CORS for all origins
- If issues persist, check the CORS configuration in `api/index.js`

**4. Environment Variables Not Working**
- Make sure variables are set for all environments
- Check variable names match exactly
- Restart deployment after adding variables

### Debugging

**1. Local Testing**
```bash
# Install Vercel CLI
npm i -g vercel

# Test locally
vercel dev
```

**2. Check Logs**
- Vercel dashboard → Functions → View logs
- Check both frontend and API function logs

**3. Environment Variable Debug**
Add this to your API to debug:
```javascript
console.log('Environment variables:', {
  TARGET_WALLET: process.env.TARGET_WALLET,
  HEDERA_NETWORK: process.env.HEDERA_NETWORK,
  // Don't log private keys!
});
```

## Security Notes

1. **Private Keys**: Never commit private keys to your repository
2. **Environment Variables**: Use Vercel's environment variable system
3. **API Keys**: Store all sensitive data in Vercel environment variables
4. **CORS**: The API is configured for production use

## Performance

- **Cold Starts**: Serverless functions may have cold starts
- **Timeout**: Functions timeout after 10 seconds (free plan)
- **Memory**: 1024MB RAM limit (free plan)
- **Bandwidth**: 100GB/month (free plan)

## Cost

- **Free Tier**: Perfect for development and small projects
- **Pro Plan**: $20/month for more resources
- **Enterprise**: Custom pricing for large deployments

## Next Steps

1. Set up monitoring and analytics
2. Configure custom domain
3. Set up CI/CD pipeline
4. Monitor function performance
5. Scale as needed

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Hedera Documentation](https://docs.hedera.com/)

---

**Note**: This deployment uses Vercel's serverless functions for the backend. For high-traffic applications, consider using a dedicated server or other cloud providers. 