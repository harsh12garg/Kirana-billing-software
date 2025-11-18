# 🏪 Kirana Shop Management System

A full-stack inventory and billing management system for Kirana shops with modern UI, GST calculator, and comprehensive features.

## 🚀 Features

- **Dashboard** - Real-time analytics and insights
- **Product Management** - Add, edit, delete products with categories
- **Point of Sale (POS)** - Quick billing interface
- **Bill Management** - View, print, and download bills as PDF
- **Customer Management** - Track customer information
- **Credit Management** - Manage credit sales (Udhar)
- **GST Calculator** - Calculate GST inclusive/exclusive amounts
- **Dark Mode** - Eye-friendly dark theme
- **Fully Responsive** - Works on all devices (mobile, tablet, desktop)

## 🛠️ Tech Stack

### Frontend
- React 18
- Redux Toolkit
- React Router v6
- MDB React UI Kit
- Recharts (for analytics)
- React Hot Toast
- Vite

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Bcrypt.js
- Multer (file uploads)

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account (for production)
- Git

## 🔧 Local Development Setup

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd kirana-shop-management
```

### 2. Install dependencies
```bash
# Install all dependencies (backend + frontend)
npm run install-all

# Or install separately
npm run install-backend
npm run install-frontend
```

### 3. Configure environment variables

#### Backend (.env)
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/billing_system
JWT_SECRET=your_secret_key_here
FRONTEND_URL=http://localhost:5173
```

#### Frontend (.env)
```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
```

### 4. Run the application

#### Development mode (separate terminals)
```bash
# Terminal 1 - Backend
npm run dev-backend

# Terminal 2 - Frontend
npm run dev-frontend
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 🌐 Production Deployment (Render)

### Step 1: Setup MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist all IPs (0.0.0.0/0) for Render
5. Get your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/billing_system?retryWrites=true&w=majority
   ```

### Step 2: Push to GitHub

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Production ready"

# Add remote repository
git remote add origin <your-github-repo-url>

# Push to GitHub
git push -u origin main
```

### Step 3: Deploy Backend on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `kirana-backend` (or your choice)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

5. Add Environment Variables:
   ```
   NODE_ENV=production
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/billing_system
   JWT_SECRET=your_super_secret_jwt_key_change_this
   FRONTEND_URL=https://your-frontend-url.onrender.com
   ```

6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)
8. Copy your backend URL: `https://kirana-backend.onrender.com`

### Step 4: Deploy Frontend on Render

1. Click "New +" → "Static Site"
2. Connect same GitHub repository
3. Configure:
   - **Name**: `kirana-frontend` (or your choice)
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

5. Click "Create Static Site"
6. Wait for deployment
7. Your app is live! 🎉

### Step 5: Update Backend CORS

Go back to backend service on Render and update:
```
FRONTEND_URL=https://your-actual-frontend-url.onrender.com
```

## 📱 Default Login Credentials

After deployment, you can register a new account or use seed data:

```
Email: admin@kirana.com
Password: admin123
```

## 🔒 Security Notes

- Change JWT_SECRET to a strong random string
- Never commit .env files
- Use strong passwords for MongoDB Atlas
- Enable 2FA on your accounts
- Regularly update dependencies

## 📊 Project Structure

```
kirana-shop-management/
├── backend/
│   ├── config/          # Database & config
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth & error handling
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── uploads/         # File uploads
│   ├── .env.example     # Environment template
│   ├── server.js        # Entry point
│   └── package.json
├── frontend/
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── redux/       # State management
│   │   ├── config/      # API config
│   │   ├── App.jsx      # Main app
│   │   └── main.jsx     # Entry point
│   ├── .env.example     # Environment template
│   ├── vite.config.js   # Vite configuration
│   └── package.json
├── .gitignore
├── package.json         # Root package
└── README.md
```

## 🐛 Troubleshooting

### Backend not connecting to MongoDB
- Check MongoDB Atlas IP whitelist
- Verify connection string format
- Check username/password encoding

### Frontend not connecting to Backend
- Verify VITE_API_URL is correct
- Check CORS settings in backend
- Ensure backend is running

### Build fails on Render
- Check Node.js version compatibility
- Verify all dependencies are in package.json
- Check build logs for specific errors

## 📝 Available Scripts

```bash
# Install all dependencies
npm run install-all

# Development
npm run dev-backend      # Start backend dev server
npm run dev-frontend     # Start frontend dev server

# Production
npm run build-frontend   # Build frontend for production
npm start               # Start production server
npm run deploy          # Build and start
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Your Name

## 🙏 Acknowledgments

- MDB React UI Kit for beautiful components
- MongoDB Atlas for database hosting
- Render for free hosting

---

**Made with ❤️ for Kirana Shops**

For support or queries, please open an issue on GitHub.
