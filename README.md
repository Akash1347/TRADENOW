# 📈 TradeNow - Real-Time Stock Trading Platform

[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://tradenow-six.vercel.app/)
![MERN Stack](https://img.shields.io/badge/MERN-Stack-blue)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED)

**TradeNow** is a full-stack stock trading platform designed to simulate a real-world trading environment. It allows users to buy and sell stocks, view real-time market charts, and manage their investment portfolios.

The goal of this project was to build a scalable, high-performance financial application using the **MERN architecture** while solving complex challenges like handling real-time data streams and secure user authentication.

---

## 🚀 Live Demo
> **Check out the live application here:** [https://tradenow-six.vercel.app/]
> *(Note: If the server is spinning down on free hosting, please allow 30 seconds for it to wake up.)*

---

## ✨ Key Features

* **Real-Time Dashboard:** Users see live stock price updates without refreshing the page, powered by **Socket.io**.
* **Interactive Charts:** Implemented professional financial candlesticks and area charts using **Lightweight Charts** and **Chart.js** for technical analysis.
* **Order Execution:** Complete Buy/Sell functionality with immediate portfolio updates.
* **User Authentication:** Secure signup and login system using **Passport.js** and **JWT** (JSON Web Tokens).
* **Portfolio Management:** Dashboard to track current holdings, positions, and total account value.
* **Containerized Environment:** Fully dockerized application (Frontend, Dashboard, Backend) for consistent deployment across environments.

---

## 🛠️ Tech Stack

I chose the **MERN Stack** for this project to ensure a unified JavaScript ecosystem from client to server.

### **Frontend (Client & Dashboard)**
* **React.js (Vite):** For building a fast, component-based user interface.
* **Material UI (MUI):** For polished, responsive UI components in the dashboard.
* **Socket.io Client:** To listen for real-time stock price events.
* **React Toastify:** For instant user feedback (success/error notifications).
* **Lightweight Charts:** For rendering high-performance financial charts.

### **Backend (API)**
* **Node.js & Express.js:** RESTful API architecture handling trade logic and data retrieval.
* **MongoDB & Mongoose:** NoSQL database for flexible storage of user profiles, orders, and stock data.
* **Passport.js & BCrypt:** For robust security, password hashing, and session management.
* **Socket.io:** For broadcasting real-time market data to connected clients.

### **DevOps & Tools**
* **Docker & Docker Compose:** Used to containerize the application services for easy setup and deployment.
* **Git & GitHub:** For version control and collaboration.

---

## 📸 Screenshots

 

### Landing Page
![Landing Page](https://example.com/your-landing-page-image-link)

### Dashboard
![Dashboard](https://example.com/your-dashboard-image-link)

### Holdings
![Holdings](https://example.com/your-holdings-image-link)

### Stock Page
![Stock Page](https://example.com/your-stock-page-image-link)

---

## 🏗️ Architecture

The application is split into three distinct services to maintain separation of concerns:

1.  **Frontend:** The public-facing landing page and marketing site.
2.  **Dashboard:** The private, protected trading interface for logged-in users.
3.  **Backend:** The central server that manages database connections, authentication, and the stock price engine.

---

## ⚙️ Installation & Run Locally

To run this project on your local machine, follow these steps:

**Prerequisites:** Node.js and MongoDB installed (or Docker).

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/akash1347/tradenow.git](https://github.com/akash1347/tradenow.git)
    cd tradenow
    ```

2.  **Install Dependencies**
    ```bash
    # Install Backend Deps
    cd backend
    npm install

    # Install Frontend Deps
    cd ../frontend
    npm install

    # Install Dashboard Deps
    cd ../dashboard
    npm install
    ```

3.  **Environment Variables**
    Create a `.env` file in the `backend` folder and add your MongoDB URI and secrets:
    ```env
    MONGO_URL=your_mongodb_connection_string
    PORT=3002
    ```

4.  **Run the App**
    ```bash
    # Start Backend
    cd backend
    npm start

    # Start Frontend (in a new terminal)
    cd frontend
    npm run dev

    # Start Dashboard (in a new terminal)
    cd dashboard
    npm run dev
    ```

---

 

*This project is for educational purposes and simulates a trading environment.*