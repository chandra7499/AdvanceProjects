
# 🛒 Tarzon Store – Full Stack E-commerce Platform

Tarzon Store is a **modern full-stack e-commerce web application** built using **React, Node.js, Docker, Firebase, and CI/CD pipelines**.

The platform allows users to **browse products, manage carts, and securely purchase items** while providing a **scalable backend infrastructure and automated deployment workflow**.

This project focuses on:

- ⚡ Scalability  
- 🧩 Maintainability  
- 🚀 Modern DevOps practices  

---

# 🚀 Features

## 👤 User Features

- Browse product catalog
- View detailed product information
- Add / remove products from cart
- Secure checkout process
- Responsive UI for mobile and desktop
- User authentication and account management
- Order management and history
- Third-party payment integration (**Razorpay**)

---

## 🛠 Admin Features

- Product management
- Inventory control
- Order tracking
- User management
- Dashboard for monitoring store activity

---

# ⚙️ Non-Functional Features

## 🔒 Security

- Secure authentication
- Protected API routes
- Environment variable management

## ⚡ Performance

- Optimized React rendering
- Backend API optimization
- Docker containerization for consistent environments

## 🔄 Scalability

- Modular backend architecture
- Containerized deployment using Docker
- CI/CD pipeline for automated builds and deployments

## 🧪 Maintainability

- Modular component structure
- Clean backend service separation
- Git-based version control workflow

---

# 🏗 Architecture Overview
   Frontend (React)
        │
        ▼
  Backend API (Node.js / Express)
        │
        ▼
Database & Services (Firebase / External APIs) 


### Deployment Flow
  Git Repository
       │
       ▼
  CI/CD Pipeline
       │
       ▼
 Docker Containers
       │
       ▼
Production Environment


---

# 🧰 Tech Stack

## Frontend

- React
- JavaScript
- HTML5
- CSS3

## Backend

- Node.js
- Express.js

## DevOps

- Docker
- GitHub Actions (CI/CD)
- Git & GitHub

## Services

- Firebase
- Razorpay Payment Gateway

---

# 📦 Project Structure

tarzon-store
│
├── client
│   └── src
│       ├── components
│       ├── pages
│       └── services
│
├── server
│   ├── controllers
│   ├── routes
│   ├── models
│   └── middleware
│
├── docker
│
├── .github/workflows
│
├── Dockerfile
├── docker-compose.yml
└── README.md


---

# ⚡ Getting Started

## Prerequisites

Make sure you have installed:

- Node.js
- npm or yarn
- Docker
- Git

---

# 🔧 Installation

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/chandra7499/AdvanceProjects.git

cd practices

Install Dependencies

cd client
npm install

Server

cd server
npm install


🔑 Environment Variables

Create a .env file inside the server directory.

PORT=5000

FIREBASE_API_KEY=your_key
FIREBASE_AUTH_DOMAIN=your_domain
FIREBASE_PROJECT_ID=your_project

 ▶️ Running the Application

Start Backend
  cd server
  npm run server

Start Frontend
cd client
npm run dev

Application runs on:
  Frontend → http://localhost:5173
  Backend  → http://localhost:3000

🐳 Running with Docker

Build Containers
  docker-compose up --build
Run Containers
  docker-compose up
Stop Containers
  docker-compose down


🔄 CI/CD Pipeline

The project includes automated pipelines that:

Run tests

Build Docker images

Validate code quality

Deploy the application

Benefits:

Faster development cycles

Automated builds

Reliable deployments


🤝 Contributing

Contributions are welcome!

1️⃣ Fork the repository

Click Fork on GitHub.

2️⃣ Clone your fork
git clone https://github.com/your-username/tarzon-store.git
3️⃣ Create a new branch
git checkout -b feature/your-feature-name
4️⃣ Make your changes

Ensure your code follows project standards.

5️⃣ Commit changes
git commit -m "Add new feature"
6️⃣ Push to your fork
git push origin feature/your-feature-name
7️⃣ Open a Pull Request

Describe:

What changes you made

Why they are needed

Any testing performed

📌 Contribution Guidelines

Before submitting a PR:

Follow project folder structure

Write clean and readable code

Test your changes locally

Ensure the application builds successfully

🧪 Future Improvements

Recommendation system

Microservices architecture

Advanced analytics dashboard

AI-based product recommendations

📄 License

This project is licensed under the MIT License.

👨‍💻 Author

Developed by the Tarzon Store Development Team