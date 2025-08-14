#!/bin/bash

# Smart Parking App Deployment Script

echo "🚗 Smart Parking App - Deployment Script"
echo "========================================"

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed. Installing..."
    npm install -g firebase-tools
fi

# Check if user is logged in to Firebase
echo "🔐 Checking Firebase authentication..."
if ! firebase projects:list &> /dev/null; then
    echo "🔑 Please login to Firebase..."
    firebase login
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🏗️ Building the project..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed! Please check for errors."
    exit 1
fi

echo "✅ Build successful!"

# Deploy to Firebase Hosting
echo "🚀 Deploying to Firebase Hosting..."
firebase deploy --only hosting

echo "🎉 Deployment complete!"
echo "📱 Your Smart Parking App is now live!"
echo ""
echo "Next steps:"
echo "1. Update your Firebase configuration in src/firebase/config.js"
echo "2. Set up Firestore security rules"
echo "3. Test the application with real users"
echo ""
echo "Happy parking! 🚗✨"
