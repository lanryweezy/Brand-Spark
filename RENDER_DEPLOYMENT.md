# 🚀 Brand Spark - Render Deployment Guide

## 🎯 Quick Deploy to Render

### Step 1: Deploy Backend API (5 minutes)

1. **Go to Render**: https://render.com
2. **New Web Service** → Connect GitHub
3. **Select Repository**: `Brand-Spark`
4. **Configuration**:
   - **Name**: `brandspark-api`
   - **Environment**: `Python 3`
   - **Build Command**: `cd backend && pip install -r requirements.txt`
   - **Start Command**: `cd backend && gunicorn app:app`
   - **Instance Type**: `Starter` ($7/month)

5. **Environment Variables** (Add these):
   ```
   DATABASE_URL=postgresql://user:pass@host:port/dbname
   SECRET_KEY=your-super-secret-key-change-this
   JWT_SECRET_KEY=your-jwt-secret-key-change-this
   FLASK_ENV=production
   ```

6. **Add PostgreSQL Database**:
   - Dashboard → New → PostgreSQL
   - Copy connection string to `DATABASE_URL`

### Step 2: Deploy Frontend App (3 minutes)

1. **New Static Site** on Render
2. **Select Repository**: `Brand-Spark`
3. **Configuration**:
   - **Name**: `brandspark-app`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. **Environment Variables**:
   ```
   VITE_API_URL=https://brandspark-api.onrender.com/api
   VITE_GEMINI_API_KEY=your-gemini-api-key
   VITE_ENVIRONMENT=production
   ```

## 🔗 Expected URLs After Deployment

- **Backend API**: `https://brandspark-api.onrender.com`
- **Frontend App**: `https://brandspark-app.onrender.com`
- **Health Check**: `https://brandspark-api.onrender.com/api/health`

## 💰 Cost Breakdown

- **Backend**: $7/month (Starter instance)
- **Frontend**: Free (Static site)
- **Database**: $7/month (PostgreSQL)
- **Total**: $14/month

## ✅ Deployment Checklist

- [ ] Backend deployed and running
- [ ] Database connected
- [ ] Frontend deployed
- [ ] Environment variables set
- [ ] API health check passes
- [ ] Frontend connects to backend
- [ ] Test user registration
- [ ] Test brand creation

## 🚀 Ready to Deploy!

Your Brand Spark platform will be live and ready for customers in ~10 minutes!