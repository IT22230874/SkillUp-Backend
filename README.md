# SkillUp – Backend (MERN Stack)

SkillUp is an online learning platform that enables students to register, browse, and enroll in courses, while instructors can create and manage their own courses. This backend is built using **Node.js**, **Express**, and **MongoDB**, and integrates with **OpenAI's GPT-3** to provide personalized course recommendations.

## 🌐 Live Preview

👉 [Visit SkillUp](https://www.skilluplearning.site)

---

## 📦 Features

### 🧑‍🎓 Student Features

- User registration and login
- View all available courses
- Enroll in courses
- View list of enrolled courses
- Get course recommendations using GPT-3

### 👨‍🏫 Instructor Features

- Register and login as an instructor
- Create, read, update, and delete courses
- View enrolled students per course

### 🔒 Authentication & Authorization

- JWT-based user authentication
- Role-based access control (Student/Instructor)

### 🤖 GPT Integration

- Uses OpenAI's GPT-3 API to suggest courses based on custom prompts

---

## 🛠 Tech Stack

- **Node.js** & **Express.js** – Backend REST API
- **MongoDB** & **Mongoose** – Database and ODM
- **JWT** – Authentication
- **Docker** – Containerized deployment
- **OpenAI GPT-3 API** – Course recommendation engine
- **Deployed on AWS EC2**

---

## 📁 Project Structure

backend/
│
├── controllers/ # Logic for courses, auth, and GPT
├── models/ # Mongoose schemas
├── routes/ # Route definitions
├── middleware/ # Auth & role checks
├── config/ # DB & environment setup
├── .env.example # Environment variables template
├── server.js # Entry point

---

## 🚀 Getting Started

### Prerequisites

- Node.js & npm
- MongoDB
- OpenAI API Key

### Clone & Setup

```
git clone https://github.com/IT22230874/SkillUp-Backend.git
cd skillup-backend
npm install
Environment Variables
Create a .env file in the root with the following content:

OPENAI_API_KEY=your_openai_api_key
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FRONTEND_URL=your_frontend_url

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

Run the Server

npm start
Server will run at http://localhost:4000.

```
