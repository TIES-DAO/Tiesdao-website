# TIE DAO - Human-First Web3 Community Platform

<div align="center">

![TIE DAO Logo](public/dao.png)

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.22.1-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

**A human-first Web3 community platform connecting builders, founders, and contributors through trust, reputation, and real collaboration.**

[Live Demo](https://tiesdao.vercel.app/) • [Report Bug](https://github.com/your-repo/issues) • [Request Feature](https://github.com/your-repo/issues)

</div>

---

## 📋 Table of Contents

- [About The Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Frontend Installation](#frontend-installation)
  - [Backend Installation](#backend-installation)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 About The Project

TIE DAO (TIES DAO) is a comprehensive Web3 community platform designed to foster genuine collaboration and engagement among blockchain enthusiasts, developers, and founders. Unlike traditional platforms focused on hype, TIE DAO emphasizes human connections, reputation building, and meaningful contributions.

### Key Highlights

- 🌐 **Human-First Approach**: Focus on real collaboration over speculation
- 🎮 **Gamified Engagement**: Quizzes, streaks, and leaderboards to encourage participation
- 🤝 **Referral System**: Grow the community through trusted connections
- 📊 **Admin Dashboard**: Comprehensive analytics and user management
- 🌙 **Dark/Light Mode**: Full theme support for user preference
- 📱 **Responsive Design**: Optimized for all device sizes

---

## ✨ Features

### Public Features
| Feature | Description |
|---------|-------------|
| **Landing Page** | Beautiful hero section with animated components |
| **Features Showcase** | Yaps, Jobs, Leaderboards, and Escrow features |
| **Web3 Education** | Educational content about blockchain and Web3 |
| **Roadmap** | Project development timeline |
| **Team Section** | Meet the team behind TIE DAO |
| **Community Links** | Social media and community connections |
| **Contact Form** | Direct communication channel |
| **Feedback System** | User feedback collection |

### User Features (Authenticated)
| Feature | Description |
|---------|-------------|
| **User Dashboard** | Personal stats, streaks, and progress tracking |
| **Daily Check-in** | Streak system with milestone rewards |
| **Quiz System** | Web3 knowledge quizzes with points |
| **Quiz Leaderboard** | Compete with other community members |
| **Referral Program** | Generate referral codes and track referrals |
| **Referral Leaderboard** | Top referrers ranking |
| **Password Reset** | Email-based OTP password recovery |

### Admin Features
| Feature | Description |
|---------|-------------|
| **Admin Dashboard** | Comprehensive platform analytics |
| **User Management** | View, suspend, and manage users |
| **Quiz Management** | Create, edit, and delete quizzes |
| **Analytics Charts** | Visual data representation with Recharts |
| **User Analytics** | Individual user activity tracking |

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI library with hooks |
| **Vite 5** | Build tool and dev server |
| **React Router 7** | Client-side routing |
| **Tailwind CSS 3.4** | Utility-first styling |
| **Framer Motion 11** | Animations and transitions |
| **Lucide React** | Icon library |
| **React Icons** | Additional icons |
| **Recharts** | Data visualization |
| **Supabase JS** | Authentication client |

### Backend
| Technology | Purpose |
|------------|---------|
| **Express 4** | Node.js web framework |
| **MongoDB** | NoSQL database |
| **Mongoose 9** | MongoDB ODM |
| **JWT** | Authentication tokens |
| **bcryptjs** | Password hashing |
| **Nodemailer** | Email sending |
| **CORS** | Cross-origin resource sharing |

### Deployment
| Service | Purpose |
|---------|---------|
| **Vercel** | Frontend & Backend hosting |
| **MongoDB Atlas** | Cloud database |

---

## 📁 Project Structure

```
tie-dao-react-landing/
├── public/                     # Static assets
│   └── dao.png                 # Logo image
├── server/                     # Backend API
│   ├── api/
│   │   └── index.js            # Express app entry point
│   ├── controllers/
│   │   └── authController.js   # Authentication logic
│   ├── middleware/
│   │   ├── auth.js             # JWT middleware
│   │   └── authMiddleware.js   # Auth helpers
│   ├── models/
│   │   ├── User.js             # User schema
│   │   ├── Quiz.js             # Quiz schema
│   │   ├── QuizAttempt.js      # Quiz attempt tracking
│   │   ├── DailyStreak.js      # Streak tracking
│   │   ├── Reward.js           # Rewards schema
│   │   └── Collaboration.js    # Collaboration schema
│   ├── routes/
│   │   ├── auth.js             # Auth routes
│   │   ├── admin.js            # Admin routes
│   │   ├── quiz.js             # Quiz routes
│   │   ├── referral.js         # Referral routes
│   │   ├── dailyStreak.js      # Streak routes
│   │   ├── dashboard.js        # Dashboard routes
│   │   ├── contact.js          # Contact form routes
│   │   └── feedback.js         # Feedback routes
│   ├── .env.example            # Backend env template
│   ├── package.json            # Backend dependencies
│   └── vercel.json             # Backend Vercel config
├── src/                        # Frontend source
│   ├── assets/                 # Images and media
│   ├── components/             # React components
│   │   ├── Navbar.jsx          # Navigation bar
│   │   ├── Hero.jsx            # Hero section
│   │   ├── Features.jsx        # Features showcase
│   │   ├── Roadmap.jsx         # Project roadmap
│   │   ├── Team.jsx            # Team section
│   │   ├── Community.jsx       # Community links
│   │   ├── Contact.jsx         # Contact form
│   │   ├── Footer.jsx          # Footer component
│   │   ├── Web3Education.jsx   # Educational content
│   │   ├── Feedback.jsx        # Feedback widget
│   │   ├── Quiz.jsx            # Quiz component
│   │   ├── QuizLeaderboard.jsx # Quiz rankings
│   │   ├── Referral.jsx        # Referral system
│   │   ├── ReferralLeaderboard.jsx # Referral rankings
│   │   ├── Dashboard.jsx       # User dashboard
│   │   └── ConfirmModal.jsx    # Confirmation dialogs
│   ├── config/
│   │   └── api.js              # API configuration
│   ├── context/
│   │   ├── AuthContext.jsx     # Authentication state
│   │   └── ThemeContext.jsx    # Theme management
│   ├── lib/
│   │   └── supabase.js         # Supabase client
│   ├── Pages/
│   │   ├── login.jsx           # Login page
│   │   ├── signup.jsx          # Registration page
│   │   ├── ForgotPassword.jsx  # Password reset
│   │   ├── Dashboard.jsx       # User dashboard page
│   │   ├── Leaderboard.jsx     # Leaderboard page
│   │   ├── AdminLogin.jsx      # Admin login
│   │   ├── AdminDashboard.jsx  # Admin panel
│   │   └── SuperDashboard.jsx  # Super admin panel
│   ├── routes/
│   │   ├── ProtectedRoute.jsx  # Auth route guard
│   │   └── AdminRoute.jsx      # Admin route guard
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # React entry point
│   └── index.css               # Global styles
├── .env.example                # Frontend env template
├── .gitignore                  # Git ignore rules
├── index.html                  # HTML entry point
├── package.json                # Frontend dependencies
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.js          # Tailwind configuration
├── vite.config.js              # Vite configuration
└── vercel.json                 # Frontend Vercel config
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas account)
- **Git**

### Frontend Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/tie-dao-react-landing.git
   cd tie-dao-react-landing
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

### Backend Installation

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration (see [Environment Variables](#-environment-variables))

4. **Start the server**
   ```bash
   npm start
   ```
   The API will be available at `http://localhost:5000`

---

## 🔐 Environment Variables

### Frontend (`.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000` |

### Backend (`server/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/tiedao` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-super-secret-key-here` |
| `EMAIL_USER` | Gmail address for sending emails | `your-email@gmail.com` |
| `EMAIL_PASS` | Gmail app password | `your-app-password` |
| `RECEIVE_EMAIL` | Email to receive contact forms | `admin@example.com` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://tiesdao.vercel.app` |

---

## 📡 API Reference

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | User login |
| `POST` | `/api/auth/forgot-password` | Request password reset |
| `POST` | `/api/auth/reset-password` | Reset password with OTP |

### User Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/dashboard` | Get user dashboard data |
| `POST` | `/api/daily-streak/checkin` | Daily check-in |

### Quiz Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/quiz` | Get all quizzes |
| `GET` | `/api/quiz/:id` | Get quiz by ID |
| `POST` | `/api/quiz/:id/submit` | Submit quiz answers |

### Referral Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/referral/info` | Get referral info |
| `POST` | `/api/referral/generate` | Generate referral code |

### Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/stats` | Get platform statistics |
| `GET` | `/api/admin/users` | Get all users |
| `POST` | `/api/admin/quiz` | Create new quiz |
| `DELETE` | `/api/admin/quiz/:id` | Delete quiz |

### Utility Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | API status check |
| `GET` | `/health` | Health check |
| `GET` | `/api/mongo-status` | MongoDB connection status |
| `POST` | `/api/mongo-reconnect` | Force MongoDB reconnection |

---

## 🌐 Deployment

### Frontend Deployment (Vercel)

1. **Connect your repository to Vercel**

2. **Configure build settings**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Add environment variables**
   ```
   VITE_API_URL=https://your-backend-url.vercel.app
   ```

4. **Deploy**

### Backend Deployment (Vercel)

1. **Navigate to server directory**

2. **Ensure `vercel.json` is configured**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "api/index.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "api/index.js"
       }
     ]
   }
   ```

3. **Deploy via Vercel CLI or dashboard**
   ```bash
   vercel --prod
   ```

4. **Add environment variables in Vercel dashboard**

### MongoDB Atlas Setup

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a database user
3. Whitelist IP addresses (use `0.0.0.0/0` for Vercel)
4. Get connection string and add to environment variables

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```

4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```

5. **Open a Pull Request**

### Code Style Guidelines

- Use functional components with hooks
- Follow ESLint rules
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components small and focused

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact & Support

- **Website**: [tiesdao.vercel.app](https://tiesdao.vercel.app)
- **Twitter/X**: [@ties_dao](https://x.com/ties_dao)

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI Library
- [Vite](https://vitejs.dev/) - Build Tool
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [Framer Motion](https://www.framer.com/motion/) - Animation Library
- [Lucide](https://lucide.dev/) - Icon Library
- [Vercel](https://vercel.com/) - Deployment Platform
- [MongoDB](https://www.mongodb.com/) - Database

---

<div align="center">

**Built with ❤️ by the TIE DAO Team**

⭐ Star this repo if you find it helpful!

</div>
