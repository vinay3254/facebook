# FaceBook Clone — Setup Guide

## Environment Variables

### Server (`server/.env`)

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the backend runs on | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/facebook_clone` |
| `JWT_SECRET` | Secret key for access tokens | any long random string |
| `JWT_REFRESH_SECRET` | Secret key for refresh tokens | any long random string |
| `JWT_EXPIRE` | Access token expiry | `15m` |
| `JWT_REFRESH_EXPIRE` | Refresh token expiry | `7d` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | from cloudinary.com dashboard |
| `CLOUDINARY_API_KEY` | Cloudinary API key | from cloudinary.com dashboard |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | from cloudinary.com dashboard |
| `EMAIL_HOST` | SMTP host | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_USER` | Your email address | `you@gmail.com` |
| `EMAIL_PASS` | Gmail App Password (not your login password) | 16-character app password |
| `CLIENT_URL` | Frontend URL (for CORS) | `http://localhost:3000` |
| `NODE_ENV` | Environment | `development` |

### Client (`client/.env`)

| Variable | Description | Example |
|---|---|---|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `REACT_APP_SOCKET_URL` | Socket.io server URL | `http://localhost:5000` |

---

## Step-by-Step Setup

### 1. MongoDB

**Option A — Local MongoDB**
```bash
# Install MongoDB and start it
mongod
# URI: mongodb://localhost:27017/facebook_clone
```

**Option B — MongoDB Atlas (free cloud)**
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) → create free account
2. Create a free cluster → Connect → Drivers
3. Copy the connection string and paste it as `MONGO_URI`
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/facebook_clone
```

---

### 2. Cloudinary (image uploads)

1. Sign up free at [cloudinary.com](https://cloudinary.com)
2. Go to **Dashboard** → copy these three values:
   - Cloud Name
   - API Key
   - API Secret
3. Paste them into `server/.env`

---

### 3. Gmail App Password (password reset emails)

1. Enable **2-Step Verification** on your Google account
2. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Select app: **Mail** → Select device: **Other** → name it "FaceBook Clone"
4. Copy the 16-character password → paste as `EMAIL_PASS`

> **Note:** Use your regular Gmail address as `EMAIL_USER`

---

### 4. Install & Run

```bash
# From the root /facebook directory

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install

# Go back to root
cd ..

# Run both simultaneously (requires concurrently)
npm install          # installs concurrently
npm run dev          # starts server on :5000 and client on :3000
```

Or run them separately in two terminals:
```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm start
```

---

### 5. Open the App

| URL | Description |
|---|---|
| `http://localhost:3000` | React frontend |
| `http://localhost:5000/api` | Express REST API |

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `MongoServerError: connection refused` | Make sure MongoDB is running locally, or check your Atlas URI |
| Images not uploading | Check Cloudinary credentials in `.env` |
| Password reset emails not sending | Use a Gmail App Password, not your regular password |
| `CORS error` | Make sure `CLIENT_URL` in `server/.env` matches your frontend URL |
| Port already in use | Change `PORT` in `server/.env` or kill the process using that port |
| `Cannot find module` | Run `npm install` inside both `server/` and `client/` |
