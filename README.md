# 🚗 Smart Parking App

A modern, real-time parking management system built with React and Firebase. Users can easily book and release parking slots with a simple tap, while admins can monitor all activities through a comprehensive dashboard.

## ✨ Features

- **One-Tap Booking**: Simple tap to book or release parking slots
- **Real-Time Updates**: Instant slot status updates across all connected devices
- **User Authentication**: Simple login with username and vehicle number
- **Admin Dashboard**: Comprehensive view of all slots, users, and booking history
- **Mobile Responsive**: Optimized for all device sizes
- **Modern UI**: Colorful, intuitive design with smooth animations
- **Offline Support**: Connection status monitoring and offline handling

## 🛠️ Tech Stack

- **Frontend**: React 18 with Vite
- **Backend**: Firebase (Firestore + Authentication)
- **Styling**: CSS3 with modern features
- **Real-time**: Firebase real-time listeners
- **Routing**: React Router DOM

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-parking-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Firestore Database
   - Enable Authentication (Anonymous sign-in)
   - Copy your Firebase config

4. **Configure Firebase**
   - Open `src/firebase/config.js`
   - Replace the placeholder config with your actual Firebase configuration:
   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "your-app-id"
   };
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Navigate to `http://localhost:5173`
   - The app will automatically initialize 20 parking slots on first run

## 📱 How to Use

### For Regular Users

1. **Login**: Enter your username and vehicle number
2. **View Slots**: See all parking slots with color coding:
   - 🟢 Green: Available slots
   - 🔴 Red: Occupied slots
   - 🔵 Blue: Your occupied slots
3. **Book a Slot**: Tap any green (available) slot to book it
4. **Release a Slot**: Tap your blue slot to release it

### For Admins

1. **Login**: Use "admin" as username with any vehicle number
2. **Access Dashboard**: Click "Admin Dashboard" button
3. **Monitor**: View real-time slot occupancy, user details, and booking history

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── Login.jsx        # Login form
│   ├── ParkingGrid.jsx  # Main parking interface
│   ├── ParkingSlot.jsx  # Individual slot component
│   ├── AdminDashboard.jsx # Admin interface
│   ├── ProtectedRoute.jsx # Route protection
│   └── ConnectionStatus.jsx # Real-time status
├── contexts/            # React contexts
│   ├── AuthContext.jsx  # Authentication state
│   └── RealtimeContext.jsx # Real-time data
├── firebase/            # Firebase configuration
│   ├── config.js        # Firebase setup
│   └── services.js      # Database operations
├── services/            # Business logic
│   └── bookingService.js # Booking operations
├── utils/               # Utilities
│   └── dataModels.js    # Data structure definitions
└── styles/              # CSS files
```

## 🔥 Firebase Setup Details

### Firestore Collections

The app uses three main collections:

1. **parkingSlots**: Stores slot information
2. **users**: Stores user profiles
3. **bookingHistory**: Stores all booking/release actions

### Security Rules

Add these Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🚀 Deployment

### Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase Hosting**
   ```bash
   firebase init hosting
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Deploy**
   ```bash
   firebase deploy
   ```

### Other Deployment Options

- **Vercel**: Connect your GitHub repo to Vercel for automatic deployments
- **Netlify**: Drag and drop the `dist` folder after running `npm run build`
- **GitHub Pages**: Use GitHub Actions for automated deployment

## 🧪 Testing

### Manual Testing Checklist

- [ ] User can login with username and vehicle number
- [ ] Parking slots display correctly with proper colors
- [ ] User can book an available slot
- [ ] User can release their own slot
- [ ] Real-time updates work across multiple browser tabs
- [ ] Admin can access dashboard with "admin" username
- [ ] Admin dashboard shows correct statistics
- [ ] App is responsive on mobile devices
- [ ] Connection status indicator works
- [ ] Offline/online detection works

### Running Tests

```bash
# Run the development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Customization

### Changing Slot Count

Edit `src/utils/dataModels.js`:
```javascript
export const AppConfig = {
  TOTAL_SLOTS: 30, // Change from 20 to desired number
  ADMIN_USERNAME: 'admin'
};
```

### Styling

- Main colors are defined in CSS custom properties
- Responsive breakpoints: 768px (tablet), 480px (mobile)
- All animations use CSS transitions for smooth performance

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Connection Error**
   - Check your Firebase config in `src/firebase/config.js`
   - Ensure Firestore and Authentication are enabled

2. **Slots Not Loading**
   - Check browser console for errors
   - Verify Firestore security rules allow read/write

3. **Real-time Updates Not Working**
   - Check internet connection
   - Verify Firebase project is active

### Debug Mode

Add this to your browser console to enable debug logging:
```javascript
localStorage.setItem('debug', 'smart-parking:*');
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support, please open an issue on GitHub or contact the development team.

---

**Happy Parking! 🚗✨**
