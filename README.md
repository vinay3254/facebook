# FaceBook Clone

A full-stack Facebook clone built with React, Node.js, Express, MongoDB, Socket.io, and Cloudinary.

## Features

- **Authentication** — Register, Login, JWT tokens (access + refresh), Forgot/Reset password via email
- **News Feed** — Posts from friends, Create/Like/Comment/Share/Delete/Edit posts, Feelings/Activity tags
- **Stories** — Create image or text stories with background colors, auto-expire after 24h
- **Profile** — Cover photo, profile picture, bio, hometown, workplace, relationship status, edit profile
- **Friends System** — Send/Accept/Decline/Unfriend, People You May Know suggestions
- **Real-time Messenger** — 1-on-1 chat with Socket.io, typing indicators, online status
- **Notifications** — Real-time notifications for likes, comments, friend requests
- **Search** — Search users by name with mutual friends count
- **Dark Mode** — CSS variable-based light/dark theme
- **Image Uploads** — Profile pictures, cover photos, post images, story images via Cloudinary

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, Context API |
| Styling | CSS with CSS variables + Inter font (premium UI) |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT (access + refresh tokens), bcryptjs |
| File Uploads | Multer + Cloudinary |
| Real-time | Socket.io |
| Email | Nodemailer + Gmail App Password |

## Project Structure

```
facebook/
├── client/               # React frontend
│   ├── public/
│   │   └── index.html    # CSS variables, Inter font
│   └── src/
│       ├── api/          # Axios instance + API calls
│       ├── components/
│       │   ├── layout/   # Navbar, Sidebar, Layout
│       │   ├── post/     # PostCard, CreatePost, StoryBar, PostSkeleton
│       │   └── notifications/
│       ├── context/      # AuthContext, SocketContext
│       ├── pages/        # Home, Profile, Friends, Messenger, Notifications, Search
│       ├── App.css       # Global styles
│       └── App.js        # Routes
├── server/               # Node.js backend
│   ├── controllers/      # Business logic
│   ├── middleware/       # auth.js, upload.js, errorHandler.js
│   ├── models/           # User, Post, Message, Conversation, Notification, Story
│   ├── routes/           # Express routes
│   ├── socket/           # Socket.io event handlers
│   ├── utils/            # cloudinary.js, generateToken.js, sendEmail.js
│   └── server.js
└── package.json          # Root workspace scripts
```

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (free tier works)
- Gmail account with App Password (for password reset emails)

### 1. Clone and Install

```bash
git clone <repo-url>
cd facebook
npm run install-all
```

### 2. Configure Environment Variables

**`server/.env`**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/facebook_clone
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

**`client/.env`**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### 3. Run

```bash
# Run both server and client concurrently
npm run dev

# Or separately:
npm run server    # Backend on :5000
npm run client    # Frontend on :3000
```

### 4. Open
Visit [http://localhost:3000](http://localhost:3000)

## API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/forgot-password` | Send reset email |
| POST | `/api/auth/reset-password/:token` | Reset password |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/:id` | Get user profile |
| PUT | `/api/users/:id` | Update profile (multipart/form-data) |
| GET | `/api/users/search?q=` | Search users |
| GET | `/api/users/:id/friends` | Get user's friends |
| GET | `/api/users/friend-requests` | Get pending friend requests |

### Friends
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/friends/request/:id` | Send friend request |
| PUT | `/api/friends/accept/:id` | Accept friend request |
| DELETE | `/api/friends/decline/:id` | Decline request |
| DELETE | `/api/friends/unfriend/:id` | Unfriend |
| GET | `/api/friends/suggestions` | Friend suggestions |

### Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts/feed?page=1` | Get news feed (paginated) |
| GET | `/api/posts/user/:id?page=1` | Get user's posts |
| POST | `/api/posts` | Create post (multipart/form-data) |
| PUT | `/api/posts/:id` | Update post |
| DELETE | `/api/posts/:id` | Delete post |
| PUT | `/api/posts/:id/like` | Like / Unlike post |
| POST | `/api/posts/:id/comment` | Add comment |
| DELETE | `/api/posts/:id/comment/:commentId` | Delete comment |

### Messages & Conversations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/conversations` | Get all conversations |
| POST | `/api/conversations` | Get or create conversation |
| GET | `/api/messages/:conversationId` | Get messages (paginated) |
| POST | `/api/messages` | Send message |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get notifications |
| PUT | `/api/notifications/:id/read` | Mark as read |
| PUT | `/api/notifications/read-all` | Mark all as read |

### Stories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stories` | Get stories (self + friends) |
| POST | `/api/stories` | Create story (multipart/form-data) |
| PUT | `/api/stories/:id/view` | Mark story as viewed |
| DELETE | `/api/stories/:id` | Delete story |

## Known Limitations

- **No video uploads** — only images are supported (jpg, jpeg, png, gif, webp, max 5MB)
- **No group chats** — messenger is 1-on-1 only
- **No post sharing** — share count exists in the data model but the UI is not implemented

## Cloudinary Setup
1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Copy your **Cloud Name**, **API Key**, and **API Secret** from the dashboard
3. Paste into `server/.env`

## Gmail App Password Setup
1. Enable 2-Factor Authentication on your Google account
2. Go to Google Account → Security → App passwords
3. Create an app password for "Mail"
4. Use the 16-character password as `EMAIL_PASS` (not your regular Gmail password)
