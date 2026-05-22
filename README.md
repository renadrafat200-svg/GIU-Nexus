# GIU Nexus

## 📌 Project Overview
GIU Nexus is a full-stack MERN web application that helps university students find internships and job opportunities while enabling recruiters to discover suitable candidates efficiently.

The platform integrates AI-powered features using the Hugging Face Inference API:
- **Skill Extraction (NER)** — automatically extracts skills from student bios
- **Job Classification (Zero-shot)** — auto-assigns category badges to job posts
- **Job Recommendations (Embeddings)** — ranks jobs by cosine similarity to student skills
- **AI Cover Letter Generation** — generates a personalised draft cover letter based on the student's bio and the job description

---

## 🛠️ Tech Stack
- **Frontend:** React (Vite), React Router v6, Axios, Context API
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Mongoose)
- **AI:** Hugging Face Inference API

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm

### Backend
```bash
# In the root directory
npm install
# Create a .env file (see .env.example)
npm run dev
```

### Frontend
```bash
cd Client
npm install
npm run dev
```

---

## 📁 Project Structure
```
GIU-Nexus/
├── controllers/     # Route handlers
├── models/          # Mongoose schemas
├── routes/          # Express routers
├── services/        # HuggingFace client, email service
├── middleware/       # Auth, error handler
├── config/          # DB connection
├── Client/
│   └── src/
│       ├── pages/       # One file per route
│       ├── components/  # Reusable UI components
│       ├── context/     # AuthContext
│       ├── services/    # Axios instance
│       └── utils/       # Helper functions
└── server.js
```

---

## Contributors

- [Renad Rafaat](https://github.com/renadrafat200-svg/GIU-Nexus/commits?author=renadrafat200-svg)
- [Ahmed Hesham](https://github.com/renadrafat200-svg/GIU-Nexus/commits?author=ahmedouf727)
- [Ali Sherif](https://github.com/renadrafat200-svg/GIU-Nexus/commits?author=alisherif)
- [Mostafa Elshehy](https://github.com/renadrafat200-svg/GIU-Nexus/commits?author=mostafaelsheehy)
- [Nadeen Yasser](https://github.com/renadrafat200-svg/GIU-Nexus/commits?author=nadeenyasser)
- [Malak Ehab](https://github.com/renadrafat200-svg/GIU-Nexus/commits?author=malakehab)
- [Judy Ahmed](https://github.com/renadrafat200-svg/GIU-Nexus/commits?author=judyahmed)
- [Karem Hany](https://github.com/renadrafat200-svg/GIU-Nexus/commits?author=karemhany)
- [Omar Abdelkarem](https://github.com/renadrafat200-svg/GIU-Nexus/commits?author=omarabdelkarem)
- [Obay Habbash](https://github.com/renadrafat200-svg/GIU-Nexus/commits?author=obayhabbash)
