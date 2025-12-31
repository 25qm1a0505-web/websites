# Deployment Guide

This guide will help you deploy the Chemistry Learning Platform to production.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git repository (for version control)

## Pre-Deployment Checklist

- [ ] All environment variables are configured
- [ ] Build passes without errors (`npm run build`)
- [ ] All features tested locally
- [ ] Database/backend configured (if applicable)

## Deployment Options

### 1. Vercel (Recommended - Easiest)

Vercel is the recommended platform for Next.js applications.

#### Steps:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

3. **Environment Variables** (if needed)
   - In Vercel dashboard, go to Project Settings → Environment Variables
   - Add any required variables (e.g., `OPENAI_API_KEY`)

4. **Done!** Your site will be live at `https://your-project.vercel.app`

### 2. Netlify

1. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

2. **Deploy**
   - Connect your GitHub repository
   - Netlify will auto-detect Next.js
   - Add environment variables if needed
   - Deploy!

### 3. Self-Hosted (VPS/Server)

1. **Build the application**
   ```bash
   npm install
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

3. **Use PM2 for process management**
   ```bash
   npm install -g pm2
   pm2 start npm --name "chemistry-platform" -- start
   pm2 save
   pm2 startup
   ```

4. **Configure Nginx** (reverse proxy)
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **SSL Certificate** (Let's Encrypt)
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

## Environment Variables

Create a `.env.production` file or set in your hosting platform:

```env
# Optional: For OpenAI integration
OPENAI_API_KEY=your_api_key_here

# Optional: Database connection (if upgrading from localStorage)
DATABASE_URL=your_database_url

# Optional: Next.js public URL
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Build Optimization

The app is already optimized for production:

- ✅ Static generation where possible
- ✅ Code splitting
- ✅ Image optimization (when images are added)
- ✅ Minification
- ✅ Tree shaking

## Post-Deployment

1. **Test all features**
   - User authentication
   - Problem solver
   - Virtual lab
   - Teach-back module
   - Course content

2. **Monitor performance**
   - Use Vercel Analytics (if on Vercel)
   - Check error logs
   - Monitor API response times

3. **Set up custom domain** (optional)
   - In Vercel: Project Settings → Domains
   - Add your domain and follow DNS instructions

## Troubleshooting

### Build Errors

- **TypeScript errors**: Run `npm run build` locally first
- **Missing dependencies**: Ensure `package.json` has all dependencies
- **Module not found**: Check `tsconfig.json` paths configuration

### Runtime Errors

- **API routes not working**: Ensure they're in `app/api/` directory
- **Environment variables**: Check they're set in production environment
- **CORS issues**: Configure CORS in API routes if needed

### Performance Issues

- Enable Next.js Image Optimization
- Use CDN for static assets
- Implement caching strategies
- Monitor bundle size

## Support

For issues or questions:
1. Check the README.md
2. Review Next.js documentation
3. Check Vercel/Netlify documentation for platform-specific issues

