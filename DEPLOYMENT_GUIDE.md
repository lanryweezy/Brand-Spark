# 🚀 BrandSpark Deployment Guide

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Landing Page  │    │   Main SaaS App │    │  Backend API    │
│   (Netlify)     │───▶│   (Render)      │───▶│  (Render)       │
│   Static Site   │    │   React App     │    │  Flask + DB     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🗄️ Database Setup (PostgreSQL on Render)

### 1. Create PostgreSQL Database
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "PostgreSQL"
3. Configure:
   - **Name**: `brandspark-db`
   - **Database**: `brandspark`
   - **User**: `brandspark_user`
   - **Region**: Choose closest to your users
   - **Plan**: Start with Free tier

### 2. Get Database URL
After creation, copy the **External Database URL** from the database dashboard.

## 🔧 Backend API Deployment (Render)

### 1. Create Web Service
1. Go to Render Dashboard
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `brandspark-api`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && gunicorn app:app`
   - **Instance Type**: Start with Free tier

### 2. Environment Variables
Add these environment variables in Render:

```bash
DATABASE_URL=<your-postgresql-url-from-step-1>
SECRET_KEY=<generate-random-32-char-string>
JWT_SECRET_KEY=<generate-random-32-char-string>
FLASK_ENV=production
GEMINI_API_KEY=<your-gemini-api-key>
```

### 3. Database Migration
After deployment, run migrations:
1. Go to your service dashboard
2. Open "Shell" tab
3. Run: `python -c "from app import app, db; app.app_context().push(); db.create_all()"`

## 🌐 Frontend App Deployment (Render)

### 1. Update API Configuration
First, update your frontend to use the backend API:

```javascript
// In src/services/apiService.ts
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://brandspark-api.onrender.com/api';
```

### 2. Create Static Site
1. Go to Render Dashboard
2. Click "New" → "Static Site"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `brandspark-app`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

### 3. Environment Variables
```bash
REACT_APP_API_URL=https://brandspark-api.onrender.com/api
REACT_APP_ENVIRONMENT=production
```

### 4. Custom Domain Setup
1. In Render dashboard, go to your static site
2. Click "Settings" → "Custom Domains"
3. Add: `app.brandspark.com`
4. Update your DNS:
   - Type: CNAME
   - Name: app
   - Value: brandspark-app.onrender.com

## 🎯 Landing Page Deployment (Netlify)

### 1. Create New Site
1. Go to [Netlify](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub and select your repository
4. Configure:
   - **Base directory**: `landing-page`
   - **Build command**: (leave empty)
   - **Publish directory**: `.` (current directory)

### 2. Custom Domain Setup
1. In Netlify dashboard, go to "Domain settings"
2. Add custom domain: `brandspark.com`
3. Update DNS records:
   - Type: A
   - Name: @
   - Value: 75.2.60.5
   - Type: CNAME
   - Name: www
   - Value: brandspark.netlify.app

### 3. Update Landing Page Links
Update the landing page to point to your deployed app:

```javascript
// In landing-page/script.js
const APP_URL = 'https://app.brandspark.com';

// Update all redirects to use APP_URL
window.location.href = `${APP_URL}/register?${params}`;
```

## 🔐 Authentication Integration

### 1. Update Frontend Auth Service
Replace the mock authentication with real API calls:

```typescript
// In hooks/useAuth.tsx
const API_URL = process.env.REACT_APP_API_URL;

const login = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  if (!response.ok) throw new Error('Login failed');
  
  const data = await response.json();
  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('refresh_token', data.refresh_token);
  
  setCurrentUser(data.user);
  setIsAuthenticated(true);
};
```

### 2. Add Registration Component
Create a new registration page that handles the landing page flow:

```typescript
// In components/RegisterPage.tsx
const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    company_name: ''
  });

  useEffect(() => {
    // Pre-fill from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('email')) {
      setFormData(prev => ({
        ...prev,
        email: urlParams.get('email') || '',
        company_name: urlParams.get('company') || ''
      }));
    }
  }, []);

  // Handle registration logic...
};
```

## 📊 Analytics & Monitoring

### 1. Add Analytics to Landing Page
```html
<!-- In landing-page/index.html -->
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 2. Error Monitoring
Add Sentry for error tracking:

```bash
# Backend
pip install sentry-sdk[flask]

# Frontend
npm install @sentry/react
```

## 🚀 Go-Live Checklist

### Pre-Launch
- [ ] Database is set up and accessible
- [ ] Backend API is deployed and responding
- [ ] Frontend app is deployed and can connect to API
- [ ] Landing page is deployed and redirects work
- [ ] Custom domains are configured
- [ ] SSL certificates are active
- [ ] Environment variables are set correctly

### Testing
- [ ] Registration flow works end-to-end
- [ ] Login/logout functionality works
- [ ] API endpoints return expected data
- [ ] Landing page forms submit correctly
- [ ] Mobile responsiveness is good
- [ ] Page load times are acceptable (<3s)

### Post-Launch
- [ ] Analytics are tracking correctly
- [ ] Error monitoring is active
- [ ] Backup strategy is in place
- [ ] Monitoring alerts are configured
- [ ] Documentation is updated

## 🔧 Maintenance & Updates

### Database Backups
Render automatically backs up PostgreSQL databases. For additional safety:
1. Set up automated exports to AWS S3
2. Test restore procedures monthly

### Monitoring
Set up monitoring for:
- API response times
- Database connection health
- Error rates
- User registration/login success rates

### Updates
1. Use feature flags for gradual rollouts
2. Maintain staging environments
3. Run automated tests before deployment
4. Monitor metrics after each deployment

## 💰 Cost Optimization

### Initial Costs (Free Tier)
- **Render PostgreSQL**: Free (1GB storage)
- **Render Web Service**: Free (750 hours/month)
- **Render Static Site**: Free
- **Netlify**: Free (100GB bandwidth)
- **Total**: $0/month

### Scaling Costs
As you grow, upgrade to:
- **Render Pro**: $7/month per service
- **PostgreSQL Standard**: $7/month (10GB)
- **Netlify Pro**: $19/month (400GB bandwidth)

## 🆘 Troubleshooting

### Common Issues

**Backend not starting:**
- Check environment variables are set
- Verify database connection string
- Check logs in Render dashboard

**Frontend can't connect to API:**
- Verify REACT_APP_API_URL is correct
- Check CORS settings in backend
- Ensure API is deployed and running

**Landing page redirects not working:**
- Check JavaScript console for errors
- Verify APP_URL is correct
- Test form submission manually

### Getting Help
- Check Render documentation
- Review application logs
- Test locally first
- Use browser developer tools

This deployment guide will get your BrandSpark SaaS platform live and ready for users!