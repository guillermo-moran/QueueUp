# 🎵 QueueUp

A self-hosted, local-network-based music queue system for businesses and venues — powered by YouTube and iTunes API.

Patrons can search for music and queue up songs *for free* via a web app on their phones.  
Venue owners maintain control through an admin portal, including playback management and queue control

---

## 🚀 Features

- **Admin Portal**:  
  - View the current song.
  - View and manage the queue.
  - Skip to the next track.
  - Delete songs from the queue.

- **User View**:
  - Search for real songs using the iTunes API (music-only results).
  - Select and queue tracks.
  - See the current "Now Playing" song.

- **Backend**:
  - Scrapes YouTube for the best match based on `{trackName} {artistName}`.
  - Streams audio/video directly.
  - Manages a live queue and now playing state.

- **Authentication**:
  - Admin routes are protected with a bearer token.
  - Future-ready for multi-venue deployment (multi-tenant).

- **Designed for Local Networks**:
  - Optimized for hosting on Raspberry Pi or low-cost servers.
  - Accessible via IP address (e.g., `http://192.168.1.100`).

---

## 🏗️ Architecture Overview

```
User Device (Phone, Tablet) 
    ⬇️ Search
Admin Device (Venue Owner)
    ⬇️ Controls
Backend (Node.js + Express) 
    ➡️ iTunes Search API
    ➡️ YouTube Scraper
Frontend (React / TypeScript)
    ➡️ User Interface
    ➡️ Admin Interface
```

---

## 🏦 Tech Stack

| Frontend         | Backend        | Other                  |
|------------------|-----------------|-------------------------|
| React + Vite     | Node.js + Express | iTunes Search API       |
| TypeScript       | Server Sent Events | YouTube scraper libraries |
| Styled-Components | Bearer Auth |  |

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/jukebox.git
cd jukebox
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

There is **no `.env` file** required.  
Backend constants (like the admin token) are configured directly in the source code.

Start the backend:

```bash
npm run dev
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

There is **no `.env` file** required.  
The frontend uses a hardcoded API base URL (you can update it in the source if needed).

Start the frontend in dev mode:

```bash
npm run dev
```

Or build for production:

```bash
npm run build
```

Serve the built frontend however you'd like (e.g., with Vite preview, nginx, or any static server).

---

### 4. Raspberry Pi Setup (Optional)

If deploying to a Raspberry Pi:
- Install Node.js (v18+)
- Install PM2: `npm install -g pm2`
- Clone repo to Pi
- Set up backend and frontend as above
- Use PM2 to auto-start services at boot:

```bash
pm2 start backend/index.js --name jukebox-backend
pm2 serve frontend/dist 3000 --name jukebox-frontend
pm2 save
pm2 startup
```

👉 Your Jukebox will automatically start on boot.

---

## 🔒 Admin Authentication

- To protect admin routes (e.g., `/admin/protected`, `/admin/next`, `/admin/delete/:id`), your frontend must pass an `Authorization` header:
  ```
  Authorization: Bearer <your_admin_token>
  ```

---

## 🎯 Future Roadmap

- [ ] Add self-hosted streaming option (download YouTube audio, stream locally).
- [ ] Add user request limits (e.g., max 3 songs queued per user).
- [ ] Add multi-venue support (per-venue queue isolation).
- [ ] Spotify Integration (Premium API)
- [ ] Mobile app wrappers (PWA or React Native).

---

## 🛠 Development Scripts

| Command              | Description                                  |
|-----------------------|----------------------------------------------|
| `npm run dev`         | Start the backend or frontend in dev mode    |
| `npm run build`       | Build the frontend for production            |

---



## 🤝 Contributing

We welcome contributions!  
If you have ideas for improvements, feel free to fork the repo and create a pull request.  
For major changes, open an issue first to discuss your idea.

---

## 📜 License

MIT License.  
Feel free to modify and self-host!

---

## 📢 Acknowledgements

- [iTunes Search API](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/index.html)

---

# 🎶 Let the music play!

