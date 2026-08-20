# FinSight AI

FinSight AI is a full-stack personal finance web application. Users can create an account, upload bank statements, manage transactions, view spending analytics, and receive personalized financial insights.

## Features

- JWT-based signup, login, protected routes, and logout
- Manual income and expense transaction management
- CSV and PDF bank statement uploads
- Gemini-assisted transaction extraction from uploaded statements
- Automatic duplicate transaction detection during statement imports
- Dashboard summaries for income, expenses, balance, and transaction count
- Monthly and category-based spending charts
- Searchable recent transactions
- AI insights for spending patterns, risks, anomalies, and opportunities
- Per-user insight caching to avoid regenerating insights on every dashboard visit
- Rule-based insight fallback when Gemini free-tier quota is unavailable
- Profile, currency, monthly budget, and savings goal settings
- Responsive landing page, dashboard navigation, and mobile statement upload

## Tech Stack

### Client

- React 19
- Vite
- React Router
- Tailwind CSS
- Axios
- Recharts
- Framer Motion
- React Hook Form
- React Dropzone
- React Hot Toast

### Server

- Node.js and Express
- MongoDB and Mongoose
- JWT and bcryptjs
- Multer for memory-based file uploads
- pdf-parse and pdfjs-dist for PDF extraction
- Google Gemini REST API

## Project Structure

```text
Finsight-AI/
|-- client/
|   |-- public/
|   |-- src/
|   |   |-- components/
|   |   |-- context/
|   |   |-- pages/
|   |   |-- routes/
|   |   |-- services/
|   |   `-- main.jsx
|   |-- package.json
|   `-- vercel.json
|-- server/
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- middleware/
|   |   |-- models/
|   |   |-- routes/
|   |   |-- services/
|   |   `-- server.js
|   `-- package.json
`-- README.md
```

## Requirements

- Node.js 18 or newer
- npm
- MongoDB database
- Gemini API key for AI transaction extraction and AI insights

## Installation

```bash
git clone https://github.com/harsh-123-byte/Finsight-AI.git
cd Finsight-AI

cd client
npm install

cd ../server
npm install
```

## Environment Variables

Create `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

The client normalizes the API URL and appends `/api` when it is not already present.

Never expose `GEMINI_API_KEY` in the client environment. Do not commit either `.env` file. If credentials have been exposed, rotate the MongoDB password, JWT secret, and Gemini API key.

## Run Locally

Start the backend in one terminal:

```bash
cd server
npm run dev
```

Start the frontend in another terminal:

```bash
cd client
npm run dev
```

The frontend runs at `http://localhost:5173` and the backend runs at `http://localhost:5000` by default.

For a production client build:

```bash
cd client
npm run build
npm run preview
```

## Client Pages

### Public pages

- `/` - Landing page
- `/login` - Login
- `/signup` - Account registration

### Protected pages

- `/dashboard` - Financial summary, charts, transactions, and AI insights
- `/transactions` - Add, edit, search, and delete transactions
- `/upload` - Upload and review CSV/PDF statement transactions
- `/analytics` - Monthly and category analytics
- `/settings` - Update profile and financial preferences

Protected pages require a valid JWT stored by the client authentication context.

## API Endpoints

All endpoints are relative to the configured backend URL.

### Authentication

| Method | Endpoint | Auth |
| --- | --- | --- |
| POST | `/api/auth/register` | No |
| POST | `/api/auth/login` | No |
| GET | `/api/auth/me` | Yes |
| PUT | `/api/auth/me` | Yes |
| POST | `/api/auth/logout` | No |

### Transactions

| Method | Endpoint | Auth |
| --- | --- | --- |
| GET | `/api/transactions` | Yes |
| GET | `/api/transactions/:id` | Yes |
| POST | `/api/transactions` | Yes |
| PUT | `/api/transactions/:id` | Yes |
| DELETE | `/api/transactions/:id` | Yes |

### Dashboard

| Method | Endpoint | Auth |
| --- | --- | --- |
| GET | `/api/dashboard` | Yes |
| GET | `/api/dashboard/summary` | Yes |
| GET | `/api/dashboard/category` | Yes |
| GET | `/api/dashboard/monthly` | Yes |
| GET | `/api/dashboard/recent` | Yes |

### Statements and AI

| Method | Endpoint | Auth |
| --- | --- | --- |
| POST | `/api/statement/upload` | Yes |
| GET | `/api/ai/insights` | Yes |

The statement upload field name is `statement`. Supported file types are CSV and PDF.

## AI Insight Behavior

The server sends transaction data to Gemini and stores successful insights on the user document. Returning to the dashboard reads the cached insights instead of creating a new Gemini request.

The cache is cleared after a transaction is added, updated, deleted, or imported, and when financial profile settings change. If Gemini returns a quota or rate-limit error, the server creates local fallback insights from the user's income, expenses, top category, and largest expense.

## Deployment

### Backend on Render

Create a Render Web Service with:

- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`

Set these Render environment variables:

```env
PORT=10000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
CLIENT_URL=https://your-frontend-domain.vercel.app
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
```

### Frontend on Vercel

Create a Vercel project with:

- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`

Set this Vercel environment variable:

```env
VITE_API_URL=https://your-backend-domain.onrender.com/api
```

The `client/vercel.json` rewrite sends client-side routes back to `index.html`, so refreshing routes such as `/dashboard` and `/analytics` works correctly.

After deployment, update the backend `CLIENT_URL` to the exact frontend origin and redeploy the backend if that value changes.

## Useful Commands

```bash
# Client development server
cd client && npm run dev

# Client production build
cd client && npm run build

# Client lint
cd client && npm run lint

# Server development server
cd server && npm run dev

# Server production server
cd server && npm start
```

## Author

Kumar Harsh

B.Tech ECE, IIIT Ranchi
