# 🚀 BrandSpark Deployment Instructions

## 📋 Repository Structure

### Main Repository (Current)
- **Repository**: `Brand-Spark` (this repo)
- **Contains**: Backend API + Frontend App
- **Deploy to**: Render
- **URL**: `https://app.brandspark.com`

### Landing Page Repository
- **Repository**: `BrandSpark-Landing` (separate repo)
- **Contains**: Static landing page
- **Deploy to**: Netlify
- **URL**: `https://brandspark.com`

## 🔄 Step 1: Push to GitHub

### Main Repository (Backend + Frontend)
```bash
# You're already in the main repo
git remote add origin https://github.com/lanryweezy/Brand-Spark.git
git branch -M main
git push -u origin main
```

### Landing Page Repository
```bash
# Create new repository on GitHub: BrandSpark-Landing
cd ../BrandSpark-Landing
git remote add origin https://github.com/lanryweezy/BrandSpark-Landing.git
git branch -M main
git push -u origin main
```

## 🌐 Step 2: Deploy Landing Page to Netlify

1. **Go to Netlify**: https://app.netlify.com
2. **New site from Git** → Connect to GitHub
3. **Select repository**: `BrandSpark-Landing`
4. **Build settings**:
   - Build command: (leave empty)
   - Publish directory: `/` (root)
5. **Deploy site**
6. **Custom domain**: Add `brandspark.com`

### Netlify Configuration
- ✅ `netlify.toml` already configured
- ✅ `_redirects` file ready
- ✅ Form handling setup
- ✅ Headers and caching optimized

## 🚀 Step 3: Deploy Main App to Render

### Backend Deployment
1. **Go to Render**: https://render.com
2. **New Web Service** → Connect GitHub
3. **Select repository**: `Brand-Spark`
4. **Configuration**:
   - Name: `brandspark-api`
   - Environment: `Python 3`
   - Build Command: `cd backend && pip install -r requirements.txt`
   - Start Command: `cd backend && gunicorn app:app`
   - Instance Type: `Starter` ($7/month)

5. **Environment Variables**:
   ```
   DATABASE_URL=postgresql://user:pass@host:port/dbname
   SECRET_KEY=your-secret-key-here
   JWT_SECRET_KEY=your-jwt-secret-here
   FLASK_ENV=production
   ```

6. **Add PostgreSQL Database**:
   - Go to Dashboard → New → PostgreSQL
   - Copy connection string to `DATABASE_URL`

### Frontend Deployment
1. **New Static Site** on Render
2. **Select repository**: `Brand-Spark`
3. **Configuration**:
   - Name: `brandspark-app`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

4. **Environment Variables**:
   ```
   VITE_API_URL=https://brandspark-api.onrender.com/api
   VITE_GEMINI_API_KEY=your-gemini-api-key
   ```

## 🔗 Step 4: Configure Custom Domains

### DNS Configuration
```
# For brandspark.com (Landing Page - Netlify)
A     @     104.198.14.52
CNAME www   brandspark.netlify.app

# For app.brandspark.com (Main App - Render)
CNAME app   brandspark-app.onrender.com

# For api.brandspark.com (Backend - Render)
CNAME api   brandspark-api.onrender.com
```

## 🔧 Step 5: Environment Setup

### Backend Environment (.env)
```bash
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Security
SECRET_KEY=your-super-secret-key-change-this
JWT_SECRET_KEY=your-jwt-secret-key-change-this

# Email (Optional)
SENDGRID_API_KEY=your-sendgrid-key

# Storage (Optional)
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_S3_BUCKET=your-bucket-name
```

### Frontend Environment (.env.local)
```bash
VITE_API_URL=https://api.brandspark.com
VITE_GEMINI_API_KEY=your-gemini-api-key
VITE_ENVIRONMENT=production
```

## 📊 Step 6: Verify Deployment

### Test URLs
- **Landing Page**: https://brandspark.com
- **Main App**: https://app.brandspark.com
- **API Health**: https://api.brandspark.com/health

### Test Flow
1. Visit landing page → Fill form → Redirects to app
2. Register new account → Login → Create brand
3. Test all major features

## 🎯 Step 7: Go Live Checklist

- [ ] Landing page deployed to Netlify
- [ ] Main app deployed to Render
- [ ] Backend API deployed to Render
- [ ] PostgreSQL database connected
- [ ] Custom domains configured
- [ ] SSL certificates active
- [ ] Environment variables set
- [ ] Test complete user flow
- [ ] Analytics tracking active
- [ ] Error monitoring setup

## 💰 Estimated Monthly Costs

### Netlify (Landing Page)
- **Starter**: Free (100GB bandwidth)
- **Pro**: $19/month (1TB bandwidth)

### Render (Backend + Frontend)
- **Backend**: $7/month (Starter instance)
- **Frontend**: Free (Static site)
- **Database**: $7/month (PostgreSQL)

**Total**: ~$14-33/month for full production setup

## 🚀 Ready to Launch!

Once deployed, you'll have a complete SaaS platform:
- Professional landing page for lead generation
- Full-featured application for customers
- Scalable backend API with authentication
- Multi-tenant architecture ready for growth

**Your Brand Spark platform will be ready to compete with industry giants! 🎉**