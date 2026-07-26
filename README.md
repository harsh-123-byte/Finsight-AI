# 💰 FinSight AI

> A full-stack personal finance management application that helps users track income, expenses, analyse spending habits, detect recurring expenses, and receive intelligent financial insights(Similar to AI Insights).

---

## 🚀 Features

### 🔐 Secure Authentication
- User Signup & Login
- JWT Authentication
- Protected Routes
- Password Hashing using bcrypt

### 💸 Transaction Management
- Add Income & Expense
- Edit Transactions
- Delete Transactions
- View Complete Transaction History
- Category-wise Transaction Tracking

### 📊 Interactive Dashboard
- Total Income
- Total Expenses
- Current Balance
- Total Transactions
- Monthly Expense Trend
- Category-wise Spending Analysis
- Recent Transactions

### 🧠 Smart Financial Insights
The application analyses transaction history and generates personalised financial insights such as:

- Total spending analysis
- Income vs Expense ratio
- Largest expense detection
- Top spending category
- Recurring subscription detection
- Budget utilisation
- Savings goal progress
- Weekly saving suggestions

> **Note:** The insights engine is rule-based and generates personalised recommendations by analysing user transaction patterns.

### 📂 Statement Upload
- Upload Bank Statement (CSV)
- Parse transaction records
- Automatically store transactions into database

---

# 🛠 Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Recharts
- Framer Motion
- Lucide React

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Multer
- csv-parser

---

# 📂 Project Structure

```
FinSight-AI
│
├── client
│   ├── src
│   ├── public
│   └── package.json
│
├── server
│   ├── controllers
│   ├── models
│   ├── middleware
│   ├── routes
│   ├── config
│   └── package.json
│
└── README.md
```

---


# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/your-username/finsight-ai.git
```

```
cd finsight-ai
```

---

## Install Frontend

```bash
cd client
npm install
```

---

## Install Backend

```bash
cd ../server
npm install
```

---

# 🔑 Environment Variables

## Server (.env)

```env
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

CLIENT_URL=http://localhost:5173
```

---

## Client (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

---

# ▶ Running the Project

## Backend

```bash
cd server
npm run dev
```

---

## Frontend

```bash
cd client
npm run dev
```

---

# API Endpoints

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | /api/auth/register |
| POST | /api/auth/login |

---

## Transactions

| Method | Endpoint |
|---------|----------|
| GET | /api/transactions |
| POST | /api/transactions |
| PUT | /api/transactions/:id |
| DELETE | /api/transactions/:id |

---

## Dashboard

| Method | Endpoint |
|---------|----------|
| GET | /api/dashboard |
| GET | /api/dashboard/category |
| GET | /api/dashboard/monthly |
| GET | /api/dashboard/recent |

---

## AI Insights

| Method | Endpoint |
|---------|----------|
| GET | /api/ai/insights |

---

# Future Improvements

- AI-powered spending prediction using LLMs
- OCR support for scanned bank statements
- Multi-bank integration
- Monthly financial reports in PDF
- Email notifications
- Dark / Light Theme
- Export transactions to Excel/PDF
- Budget alerts

---

# Learning Outcomes

Through this project I gained hands-on experience with:

- Full Stack MERN Development
- JWT Authentication
- MongoDB Aggregation Pipeline
- REST API Design
- File Upload using Multer
- CSV Parsing
- Dashboard Analytics
- React Component Architecture
- Chart Visualisation
- Rule-Based Financial Insight Generation

---

# Author

**Kumar Harsh**

B.Tech ECE, IIIT Ranchi

---

⭐ If you like this project, don't forget to star the repository.
