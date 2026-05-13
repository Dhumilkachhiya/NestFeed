# 📸 Instagram Clone — HomeBook

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)
![React](https://img.shields.io/badge/Frontend-React_19-cyan.svg)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green.svg)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-darkgreen.svg)
![Tailwind](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

A full-stack, feature-rich social media platform inspired by Instagram built using the **MERN (MongoDB, Express.js, React, Node.js)** stack. This platform allows users to share moments through images, engage with content, communicate directly with other users, view 24-hour stories, and explore real-estate property listings all in one application.

## ✨ Features

- **User Authentication:** Secure signup and login using JWT (JSON Web Tokens) and bcrypt for password hashing.
- **Post Management:** Upload images with captions. Images are optimized and resized using `Sharp` before being securely stored on `Cloudinary`.
- **Engagement:** Like, unlike, comment, and bookmark posts. All data is persisted in real-time.
- **Direct Messaging (DM):** Engage in private 1-on-1 conversations with other users.
- **Stories:** Upload 24-hour expiring stories. Automated clean-up via MongoDB TTL (Time-To-Live) indexes.
- **Real Estate Listings (HomeBook):** A unique extension where users can list and explore real-estate properties (For Sale, Sold, Rent) with multiple images.
- **Profile Management:** Edit bio, gender, profile picture, and track followers/following interactions.
- **State Persistence:** Seamless user experience with `redux-persist` to maintain state across browser refreshes.

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 19 + Vite
- **Routing:** React Router v7
- **State Management:** Redux Toolkit + Redux Persist
- **Styling:** Tailwind CSS v4, Radix UI, Framer Motion
- **Icons/UI:** Lucide React, React Icons, Sonner (Toasts)
- **HTTP Client:** Axios

### Backend
- **Environment:** Node.js + Express.js
- **Database:** MongoDB Atlas (with Mongoose ODM)
- **Authentication:** jsonwebtoken (JWT), bcrypt
- **File Uploads:** Multer, DataURI, Cloudinary
- **Image Optimization:** Sharp
- **Security & Config:** CORS, Cookie-Parser, Dotenv

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
- Node.js (v18+)
- MongoDB Atlas Account (or Local MongoDB)
- Cloudinary Account (for image uploads)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/Instagram_clone-main.git
   cd Instagram_clone-main
   ```

2. **Backend Setup:**
   ```bash
   cd Backend
   npm install
   ```
   Create a `.env` file in the `Backend` directory and add the following variables:
   ```env
   PORT=8000
   MONGO_URI=your_mongodb_connection_string
   CORS_ORIGIN=http://localhost:5173
   ACCESS_TOKEN_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup:**
   Open a new terminal window/tab:
   ```bash
   cd Frontend
   npm install
   ```
   Start the frontend development server:
   ```bash
   npm run dev
   ```

4. **Access the application:**
   Open your browser and navigate to `http://localhost:5173`.

## 🗄️ Database Schema

The database uses MongoDB and is structured around the following key collections:
- **Users:** Stores authentication data, profile details, follower/following relationships, and bookmarks.
- **Posts:** Contains captions, Cloudinary image URLs, author details, likes array, and comments.
- **Comments:** Text, author, and associated post reference.
- **Conversations & Messages:** Two-collection design for direct messaging.
- **Stories:** Uses TTL indexes (`expiresAt`) to auto-delete documents 24 hours after creation.
- **Properties:** Real-estate specific details like price, location, bedrooms, and status.

## 📡 Key API Endpoints

- **Auth:** `POST /api/v1/users/register`, `POST /api/v1/users/login`, `GET /api/v1/users/logout`
- **Users:** `GET /api/v1/users/:id/profile`, `POST /api/v1/users/followOrUnfollow/:id`
- **Posts:** `POST /api/v1/post/addpost`, `GET /api/v1/post/all`, `POST /api/v1/post/:id/comment`, `GET /api/v1/post/:id/like`
- **Messages:** `POST /api/v1/message/send/:id`, `GET /api/v1/message/get/:id`
- **Stories:** Managed under `/api/v1/stories`
- **Properties:** Managed under `/api/v1/property`

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/Instagram_clone-main/issues).

## 📝 License
This project is open-source and available under the [MIT License](LICENSE).
