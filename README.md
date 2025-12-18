<img width="1475" height="675" alt="x-clone" src="https://github.com/user-attachments/assets/8e50570a-7e11-4baf-a315-854f78b9a775" />


# X-Clone (Full Stack Social App)

An advanced, full-stack social media application built with **React Native (Expo)**, **Node.js**, **Express**, and **MongoDB**. Designed to replicate the core experience of X (formerly Twitter), featuring real-time updates, secure authentication, media sharing, and a responsive mobile interface.

## 🚀 Key Features

- **🔐 Robust Authentication**: Secure sign-up and login powered by **Clerk**, ensuring safe user access and session management.
- **📱 Native Mobile Experience**: Built with **React Native** and **Expo** for a smooth, high-performance mobile experience on Android and iOS.
- **📝 Create & Share**: Users can create dynamic posts with text and images, uploaded securely via **Cloudinary**.
- **👥 Social Interactions**: Full social suite including **Likes**, **Comments**, and **User Profiles**.
- **🔔 Notifications System**: Stay updated with a dedicated notifications tab for interactions and activity.
- **💬 Direct Messaging**: Integrated private messaging system for user-to-user communication.
- **🔍 Smart Search**: Discover users and content through an efficient search interface.
- **🛡️ Advanced Security**: Protected by **Arcjet** for bot detection, rate limiting, and attack prevention.
- **🎨 Modern UI/UX**: Beautifully styled with **NativeWind (Tailwind CSS)** for a clean, consistent, and dark-mode friendly design.
## 🛠️ Tech Stack

### Mobile (Frontend)

- **Framework**: React Native (via Expo)
- **Routing**: Expo Router
- **Styling**: NativeWind (Tailwind CSS)
- **State Management**: TanStack React Query
- **Auth**: Clerk (Clerk Expo)
- **HTTP Client**: Axios
- **Icons**: Expo Vector Icons

### Backend (API)

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Auth**: Clerk (Express SDK)
- **Security**: Arcjet (Bot protection & Rate limiting)
- **Storage**: Cloudinary (Image uploads)
- **Utilities**: Multer (File handling), CORS, Dotenv
## 🏗️ Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- **Node.js** (v18+ recommended)
- **npm** or **yarn**
- **MongoDB** Database URL
- Accounts for **Clerk**, **Cloudinary**, and **Arcjet**

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/x-clone.git
   cd x-clone
   ```

2. **Setup Backend:**

   ```bash
   cd backend
   npm install
   ```

3. **Configure Backend Environment:**
   Create a `.env` file in the `backend` directory and add the following:

   ```env
   PORT=3000
   NODE_ENV=development

   # Database
   MONGODB_URI="mongodb+srv://..."

   # Authentication (Clerk)
   CLERK_PUBLISHABLE_KEY="pk_test_..."
   CLERK_SECRET_KEY="sk_test_..."

   # Security (Arcjet)
   ARCJET_ENV="development"
   ARCJET_KEY="aj_..."

   # Storage (Cloudinary)
   CLOUDINARY_CLOUD_NAME="your_cloud_name"
   CLOUDINARY_API_KEY="your_api_key"
   CLOUDINARY_API_SECRET="your_api_secret"
   ```

4. **Start Backend Server:**

   ```bash
   npm run dev
   # Server will run on http://localhost:3000 and expose your network IP
   ```

5. **Setup Mobile App:**
   Open a new terminal:

   ```bash
   cd mobile
   npm install
   ```

6. **Configure Mobile API:**
   Ensure `utils/api.ts` points to your backend's network IP if running on a real device.

7. **Run Mobile App:**
   ```bash
   npx expo start
   ```
   - Press `a` for Android Emulator
   - Press `i` for iOS Simulator
   - Scan the QR code with Expo Go on your phone

## 📁 Project Structure

```
x-clone/
├── backend/                # Express.js API Server
│   ├── src/
│   │   ├── config/         # DB & Env Config
│   │   ├── controllers/    # Route Logic
│   │   ├── middlewares/    # Arcjet & Auth Middleware
│   │   ├── models/         # Mongoose Schemas
│   │   ├── routes/         # API Routes (User, Post, Comment)
│   │   └── server.js       # Entry Point
│   └── package.json
│
└── mobile/                 # React Native Expo App
    ├── app/                # Expo Router Pages
    │   ├── (auth)/         # Login/Signup/Welcome
    │   ├── (tabs)/         # Main App Tabs (Home, Search, Profile)
    │   └── _layout.tsx     # Root Layout
    ├── assets/             # Images & Fonts
    ├── components/         # Reusable UI Components
    ├── utils/              # API Client & Helpers
    └── package.json
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is proprietary and confidential.

Made with ❤️ by Sakila Lakmal
