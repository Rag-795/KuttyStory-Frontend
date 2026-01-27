# 🎬 Kutty Story

**AI-Powered Video Story Generator**

Kutty Story is a modern web application that transforms your creative ideas into stunning videos using AI. Simply describe your story, choose a visual style, and let AI bring your imagination to life.

![React](https://img.shields.io/badge/React-19.2-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2-purple?logo=vite)
![Firebase](https://img.shields.io/badge/Firebase-12.8-orange?logo=firebase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?logo=tailwindcss)

## ✨ Features

### 🎨 **Creative Video Generation**
- **Text-to-Video AI**: Describe your story and watch it come to life
- **8 Visual Styles**: Cinematic, Anime, Watercolor, Noir, Fantasy, Vintage, Comic, and Minimalist
- **Customizable Settings**: Choose duration (15s/30s/60s) and aspect ratio (9:16/1:1)
- **Real-time Progress Tracking**: Monitor your video generation with live progress updates

### 🔐 **User Authentication**
- Email/Password authentication
- Google Sign-In integration
- Password reset functionality
- Secure user sessions with Firebase Auth

### 📹 **Video Management**
- Personal video library (My Videos)
- Video preview and playback
- Download and share generated videos
- Track video statistics and views

### ⚙️ **User Settings**
- Profile management with avatar support
- Default preferences for quick video creation
- Usage statistics dashboard
- Account security controls

### 🎯 **Modern UI/UX**
- Responsive design for all devices
- Smooth animations with Framer Motion
- Clean, minimalist interface
- Dark mode optimized
- Interactive components with Lucide icons

## 🛠️ Tech Stack

### Frontend
- **React 19.2** - Modern UI library
- **Vite 7.2** - Lightning-fast build tool
- **React Router 7.13** - Client-side routing
- **Tailwind CSS 4.1** - Utility-first styling
- **Framer Motion 12.29** - Smooth animations

### State Management
- **Zustand 5.0** - Lightweight state management
- **React Hook Form 7.71** - Form handling
- **Zod 4.3** - Schema validation

### Backend & Services
- **Firebase 12.8**
  - Authentication (Email/Password, Google)
  - Firestore Database
  - Cloud Storage
- **Axios 1.13** - HTTP client

### UI Components
- **Lucide React** - Beautiful icon set
- **React Hot Toast** - Elegant notifications

## 📁 Project Structure

```
kutty-story/
├── src/
│   ├── assets/          # Static assets
│   ├── components/      # Reusable components
│   │   ├── common/      # Common UI elements (Loader, Modal, ProgressBar)
│   │   └── ui/          # UI components (Button, Card, Input, Badge, etc.)
│   ├── config/          # Configuration files
│   │   └── visualStyles.js
│   ├── layouts/         # Layout components
│   │   ├── AuthLayout.jsx    # Authenticated user layout
│   │   ├── MainLayout.jsx    # Public layout
│   │   ├── Navbar.jsx        # Landing page navbar
│   │   └── Footer.jsx
│   ├── pages/           # Page components
│   │   ├── Home.jsx           # Landing page
│   │   ├── Login.jsx          # Login page
│   │   ├── Signup.jsx         # Signup page
│   │   ├── ForgotPassword.jsx # Password reset
│   │   ├── Dashboard.jsx      # User dashboard
│   │   ├── Create.jsx         # Video creation wizard
│   │   ├── MyVideos.jsx       # Video library
│   │   ├── VideoView.jsx      # Video player
│   │   └── Settings.jsx       # User settings
│   ├── services/        # API and Firebase services
│   │   ├── api.js
│   │   └── firebase.js
│   ├── stores/          # Zustand state stores
│   │   ├── authStore.js
│   │   ├── generationStore.js
│   │   └── videoStore.js
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Public assets
├── .env.example         # Environment variables template
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Firebase account
- Firebase project with Authentication, Firestore, and Storage enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kutty-story
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Configure Firebase**
   - Enable Email/Password and Google authentication
   - Create Firestore database with collections: `users`, `videos`
   - Set up Cloud Storage with appropriate security rules

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## 🔥 Firebase Configuration

### Firestore Collections

#### Users Collection
```javascript
{
  uid: string,
  email: string,
  displayName: string,
  photoURL: string (optional),
  createdAt: timestamp,
  updatedAt: timestamp,
  videosGenerated: number
}
```

#### Videos Collection
```javascript
{
  id: string,
  userId: string,
  title: string,
  prompt: string,
  style: string,
  duration: number,
  aspectRatio: string,
  status: 'pending' | 'generating' | 'completed' | 'failed',
  progress: number,
  currentStage: string,
  videoUrl: string (optional),
  thumbnailUrl: string (optional),
  views: number,
  isPublic: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Security Rules Example

**Firestore Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /videos/{videoId} {
      allow read: if resource.data.isPublic == true || 
                     (request.auth != null && request.auth.uid == resource.data.userId);
      allow write: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

**Storage Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /videos/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🎯 Key Features Walkthrough

### Video Creation Workflow
1. **Story Input** - Describe your video idea
2. **Style Selection** - Choose from 8 visual styles
3. **Settings** - Configure duration and aspect ratio
4. **Generation** - Real-time progress tracking
5. **Preview & Share** - Download or share your creation

### User Flow
- **Public Users**: Landing page with features showcase
- **Authenticated Users**: Dashboard with quick create, video library, and settings
- **Separate Layouts**: Different navigation for public vs authenticated routes

## 🎨 Customization

### Adding New Visual Styles
Edit `src/config/visualStyles.js`:
```javascript
{
  id: 'your-style',
  name: 'Your Style',
  description: 'Style description',
  icon: 'LucideIconName', // Must be imported in iconMap
}
```

### Modifying Theme
Update Tailwind configuration in `tailwind.config.js` or global styles in `index.css`.

## 📝 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Animations by [Framer Motion](https://www.framer.com/motion/)
- UI styling with [Tailwind CSS](https://tailwindcss.com/)
- Backend powered by [Firebase](https://firebase.google.com/)

---

**Made with ❤️ for SE SEM-6 Project**
